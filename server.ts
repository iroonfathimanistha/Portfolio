import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isCloudRun = Boolean(process.env.K_SERVICE || process.env.K_REVISION);
const isProd =
  process.env.NODE_ENV === 'production' ||
  isCloudRun ||
  (process.env.PORT !== undefined && process.env.PORT !== '3000') ||
  (process.env.NODE_ENV !== 'development' && fs.existsSync(path.join(__dirname, 'dist', 'index.html')));

// Ensure data directory & uploads directory exist safely
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'cms-database.json');
const AUTH_FILE = path.join(DATA_DIR, 'cms-auth.json');

try {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (err) {
  console.warn('[Storage] Warning initializing storage directories:', err);
}

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser('nistha-cms-secure-key-2026'));

// Health check endpoints for Cloud Run container probes
app.get(['/health', '/healthz', '/_health', '/api/health'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    isProd
  });
});

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// Also serve /src/assets if requested directly
const SRC_ASSETS_DIR = path.join(__dirname, 'src', 'assets');
if (fs.existsSync(SRC_ASSETS_DIR)) {
  app.use('/src/assets', express.static(SRC_ASSETS_DIR));
}

// Session store in-memory & file-backed
interface SessionData {
  userId: string;
  username: string;
  email: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper: Password hashing
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, effectiveSalt, 64).toString('hex');
  return { hash, salt: effectiveSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

// Initialize Admin Credentials
function initAdminAuth() {
  if (!fs.existsSync(AUTH_FILE)) {
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'NisthaAdmin2026!';
    const { hash, salt } = hashPassword(defaultPassword);
    const authData = {
      users: [
        {
          id: 'user-admin-1',
          username: 'admin',
          email: 'nisthafathima99@gmail.com',
          role: 'admin',
          passwordHash: hash,
          passwordSalt: salt,
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2), 'utf-8');
    console.log('[Auth] Initialized default admin credentials.');
  }
}
initAdminAuth();

function getAuthUsers() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8')).users;
    }
  } catch (err) {
    console.error('[Auth] Failed to read auth file:', err);
  }
  return [];
}

// Authentication Middleware
function extractToken(req: express.Request): string | null {
  // 1. From signed or regular cookie
  if (req.cookies && req.cookies.admin_session) {
    return req.cookies.admin_session;
  }
  // 2. From Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid.' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session has expired.' });
  }

  (req as any).user = session;
  next();
}

// --- AUTH API ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both username/email and password.' });
  }

  const users = getAuthUsers();
  const normalized = username.trim().toLowerCase();
  const user = users.find(
    (u: any) =>
      u.username.toLowerCase() === normalized ||
      u.email.toLowerCase() === normalized
  );

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return res.status(401).json({ error: 'Incorrect email/username or password.' });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const sessionData: SessionData = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS
  };

  activeSessions.set(token, sessionData);

  // Set HTTP-only secure cookie
  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS,
    path: '/'
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  const token = extractToken(req);
  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie('admin_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/session', (req, res) => {
  const token = extractToken(req);
  if (!token) {
    return res.json({ authenticated: false });
  }

  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (token) activeSessions.delete(token);
    res.clearCookie('admin_session', { path: '/' });
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      userId: session.userId,
      username: session.username,
      email: session.email,
      role: session.role
    }
  });
});

app.post('/api/auth/change-password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const session = (req as any).user as SessionData;
  const users = getAuthUsers();
  const user = users.find((u: any) => u.id === session.userId);

  if (!user || !verifyPassword(currentPassword, user.passwordHash, user.passwordSalt)) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ users }, null, 2), 'utf-8');

  return res.json({ success: true, message: 'Password updated successfully.' });
});

// --- CMS DATA PERSISTENCE API ---
app.get('/api/data', (_req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      return res.json(data);
    }
  } catch (err) {
    console.error('[DB] Failed to read database:', err);
  }
  return res.json({ empty: true });
});

app.post('/api/data', requireAdminAuth, (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[DB] Failed to save database:', err);
    return res.status(500).json({ error: 'Failed to write data to server storage.' });
  }
});

// --- MEDIA FILE UPLOAD API ---
app.post('/api/upload', requireAdminAuth, (req, res) => {
  try {
    const { filename, dataUrl, mimeType, category } = req.body;
    if (!dataUrl || !filename) {
      return res.status(400).json({ error: 'Missing filename or dataUrl payload.' });
    }

    // Match base64 data
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 data URL format.' });
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const safeExt = path.extname(filename) || (type.includes('png') ? '.png' : '.jpg');
    const baseClean = path.basename(filename, safeExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${Date.now()}_${baseClean}${safeExt}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    return res.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      size: `${Math.round(buffer.length / 1024)} KB`,
      mimeType: type,
      category: category || 'general'
    });
  } catch (err) {
    console.error('[Upload] Failed to process upload:', err);
    return res.status(500).json({ error: 'File upload processing failed.' });
  }
});

// --- PUBLIC CONTACT MESSAGES API ---
app.post('/api/messages', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    let dbData: any = {};
    if (fs.existsSync(DB_FILE)) {
      try {
        dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      } catch {}
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'Software Engineering Inquiry').trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      read: false
    };

    dbData.messages = [newMessage, ...(dbData.messages || [])];
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');

    return res.json({ success: true, id: newMessage.id });
  } catch (err) {
    console.error('[Messages] Failed to save contact message:', err);
    return res.status(500).json({ error: 'Failed to save message.' });
  }
});

// --- VITE MIDDLEWARE (DEV) OR STATIC CLIENT (PROD) ---
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, { maxAge: '1h' }));
    }
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      if (fs.existsSync(indexHtmlPath)) {
        res.setHeader('Cache-Control', 'no-cache');
        return res.sendFile(indexHtmlPath);
      }
      return res.status(200).send('Portfolio service is ready.');
    });
  }

  // Global express error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server Error]', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Portfolio & CMS running on http://0.0.0.0:${PORT} (isProd: ${isProd})`);
  });

  server.on('error', (err: any) => {
    console.error('[Server] Critical server listen error:', err);
  });

  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received, shutting down gracefully...');
    server.close(() => {
      process.exit(0);
    });
  });
}

process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled rejection at:', promise, 'reason:', reason);
});

startServer().catch((err) => {
  console.error('[Server] Fatal startup failure:', err);
  process.exit(1);
});
