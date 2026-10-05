import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function sendJson(res: any, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const payload = JSON.stringify(data);
  if (typeof res.json === 'function') {
    return res.json(data);
  }
  return res.end(payload);
}

async function getRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }

  if (req.readableEnded || !req.readable) {
    return {};
  }

  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function signSession(user: { id: string; username: string; email: string; role: string }, secret: string): string {
  const payload = JSON.stringify({
    ...user,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      success: false,
      message: `Method ${req.method} Not Allowed. Expected POST.`
    });
  }

  try {
    const body = await getRequestBody(req);
    const username = (body?.username || '').trim();
    const password = body?.password || '';

    if (!username || !password) {
      return sendJson(res, 400, {
        success: false,
        message: 'Username/email and password are required.'
      });
    }

    const authSecret = process.env.AUTH_SECRET || 'nistha-cms-secure-key-2026-auth-v1';
    const envAdminUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'nisthafathima99@gmail.com').trim();
    const envAdminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || 'NisthaAdmin2026!';

    let authenticatedUser: { id: string; username: string; email: string; role: string } | null = null;

    // 1. Check cms-auth.json if present
    try {
      const authPath = path.join(process.cwd(), 'data', 'cms-auth.json');
      if (fs.existsSync(authPath)) {
        const fileData = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
        if (fileData && Array.isArray(fileData.users)) {
          const found = fileData.users.find(
            (u: any) =>
              u.username.toLowerCase() === username.toLowerCase() ||
              u.email.toLowerCase() === username.toLowerCase()
          );
          if (found && verifyPassword(password, found.passwordHash, found.passwordSalt)) {
            authenticatedUser = {
              id: found.id || 'user-admin-1',
              username: found.username,
              email: found.email,
              role: found.role || 'admin'
            };
          }
        }
      }
    } catch {
      // In read-only serverless environment
    }

    // 2. Check environment credentials
    if (!authenticatedUser) {
      const lower = username.toLowerCase();
      if (
        (lower === envAdminUser.toLowerCase() || lower === envAdminEmail.toLowerCase()) &&
        password === envAdminPass
      ) {
        authenticatedUser = {
          id: 'user-admin-1',
          username: envAdminUser,
          email: envAdminEmail,
          role: 'admin'
        };
      }
    }

    if (!authenticatedUser) {
      return sendJson(res, 401, {
        success: false,
        message: 'Invalid credentials. Access denied.'
      });
    }

    const token = signSession(authenticatedUser, authSecret);
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOpts = [
      `admin_session=${encodeURIComponent(token)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
    ];
    if (isProd) cookieOpts.push('Secure');

    res.setHeader('Set-Cookie', cookieOpts.join('; '));

    return sendJson(res, 200, {
      success: true,
      message: 'Login successful',
      token,
      user: authenticatedUser
    });
  } catch (err: any) {
    console.error('[API Login] Internal error:', err);
    return sendJson(res, 500, {
      success: false,
      message: 'Authentication service unavailable'
    });
  }
}
