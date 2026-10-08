import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';

function sendJson(res: any, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const payload = JSON.stringify(data);
  if (typeof res.json === 'function') {
    return res.json(data);
  }
  return res.end(payload);
}

function verifySession(token: string | null | undefined, secret: string) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(Buffer.from(signature, 'utf-8'), Buffer.from(expectedSig, 'utf-8'));
    if (!isSigValid) return null;

    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
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

// -------------------------------------------------------------
// POSTGRESQL DATABASE CLIENT (SINGLE SOURCE OF TRUTH)
// -------------------------------------------------------------
let dbPool: pg.Pool | null = null;
let dbInitialized = false;

function getDbPool(): pg.Pool | null {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return null;

  if (!dbPool) {
    dbPool = new pg.Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
  }
  return dbPool;
}

async function ensureTableInitialized(pool: pg.Pool) {
  if (dbInitialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_cms (
      id VARCHAR(50) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  dbInitialized = true;
}

// Local filesystem fallback (used only for initial offline development)
const REPO_DATA_FILE = path.join(process.cwd(), 'data', 'cms-database.json');
const TMP_DATA_FILE = path.join('/tmp', 'cms-database.json');

function readLocalSeed(): any {
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TMP_DATA_FILE, 'utf-8'));
    } catch {}
  }
  if (fs.existsSync(REPO_DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(REPO_DATA_FILE, 'utf-8'));
    } catch {}
  }
  return { empty: true };
}

function writeLocalSeed(data: any) {
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
  try {
    const dir = path.dirname(REPO_DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(REPO_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

export async function getDatabaseRecord(): Promise<any> {
  const pool = getDbPool();

  if (pool) {
    try {
      await ensureTableInitialized(pool);
      const res = await pool.query(`SELECT data FROM portfolio_cms WHERE id = 'main' LIMIT 1;`);
      if (res.rows && res.rows.length > 0 && res.rows[0].data) {
        return res.rows[0].data;
      }

      // If database table is currently empty, seed it once with repo seed data
      const seedData = readLocalSeed();
      if (seedData && !seedData.empty) {
        await pool.query(
          `INSERT INTO portfolio_cms (id, data, updated_at) VALUES ('main', $1, NOW()) ON CONFLICT (id) DO NOTHING;`,
          [JSON.stringify(seedData)]
        );
        return seedData;
      }
    } catch (err) {
      console.error('[Database] PostgreSQL read query failed:', err);
    }
  }

  // Memory/Local fallback when running locally without DATABASE_URL
  if ((globalThis as any).__cmsMemoryCache) {
    return (globalThis as any).__cmsMemoryCache;
  }
  const fallback = readLocalSeed();
  (globalThis as any).__cmsMemoryCache = fallback;
  return fallback;
}

export async function setDatabaseRecord(newData: any): Promise<{ success: boolean; provider: string; error?: string }> {
  (globalThis as any).__cmsMemoryCache = newData;

  const pool = getDbPool();
  if (pool) {
    try {
      await ensureTableInitialized(pool);
      await pool.query(
        `INSERT INTO portfolio_cms (id, data, updated_at)
         VALUES ('main', $1, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW();`,
        [JSON.stringify(newData)]
      );
      return { success: true, provider: 'PostgreSQL' };
    } catch (err: any) {
      console.error('[Database] PostgreSQL write query failed:', err);
      return { success: false, provider: 'PostgreSQL', error: err.message || 'Database query execution failed' };
    }
  }

  // Local write for local development
  writeLocalSeed(newData);
  return { success: true, provider: 'LocalDisk' };
}

export default async function handler(req: any, res: any) {
  const origin = req.headers?.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  // PUBLIC & ADMIN DATA RETRIEVAL
  if (req.method === 'GET') {
    const data = await getDatabaseRecord();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return sendJson(res, 200, data);
  }

  // ADMIN PERSISTENT WRITE
  if (req.method === 'POST') {
    let token: string | null = null;
    const authHeader = req.headers?.authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    if (!token && req.headers?.cookie) {
      const match = req.headers.cookie.match(/admin_session=([^;]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }
    if (!token && req.cookies?.admin_session) {
      token = req.cookies.admin_session;
    }

    const authSecret = process.env.AUTH_SECRET || 'nistha-cms-secure-key-2026-auth-v1';
    const session = verifySession(token, authSecret);

    if (!session) {
      return sendJson(res, 401, {
        success: false,
        message: 'Unauthorized: Admin authentication required.'
      });
    }

    try {
      const payload = await getRequestBody(req);
      if (!payload || typeof payload !== 'object') {
        return sendJson(res, 400, {
          success: false,
          message: 'Invalid payload.'
        });
      }

      // Fetch current database state and merge to avoid wiping other tables
      const current = await getDatabaseRecord();
      const merged = {
        ...(current && !current.empty ? current : {}),
        ...payload,
        lastUpdated: new Date().toISOString()
      };

      const result = await setDatabaseRecord(merged);
      if (!result.success) {
        return sendJson(res, 500, {
          success: false,
          message: `Persistent database write failed: ${result.error}`,
          provider: result.provider
        });
      }

      return sendJson(res, 200, {
        success: true,
        message: 'Portfolio record updated in persistent database successfully.',
        provider: result.provider,
        savedAt: merged.lastUpdated,
        data: merged
      });
    } catch (err: any) {
      console.error('[API /api/data] Write failure:', err);
      return sendJson(res, 500, {
        success: false,
        message: 'Internal server error processing database update.'
      });
    }
  }

  return sendJson(res, 405, {
    success: false,
    message: `Method ${req.method} Not Allowed.`
  });
}
