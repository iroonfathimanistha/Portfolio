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
// POSTGRESQL DATABASE CLIENT
// -------------------------------------------------------------
let dbPool: pg.Pool | null = null;
let poolConnectionString: string | null = null;
let isTableReady = false;

function getDbPool(): pg.Pool | null {
  const dbUrl = (process.env.DATABASE_URL || process.env.POSTGRES_URL || '').trim();
  if (!dbUrl) {
    if (dbPool) {
      dbPool.end().catch(() => {});
      dbPool = null;
      poolConnectionString = null;
      isTableReady = false;
    }
    return null;
  }

  // Re-create pool if connection string changed
  if (!dbPool || poolConnectionString !== dbUrl) {
    if (dbPool) {
      dbPool.end().catch(() => {});
    }
    poolConnectionString = dbUrl;
    isTableReady = false;
    const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
    dbPool = new pg.Pool({
      connectionString: dbUrl,
      ssl: isLocal ? false : {
        rejectUnauthorized: false
      },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });

    dbPool.on('error', (err) => {
      console.error('[PostgreSQL Pool Error]:', err.message);
      // Invalidate pool so next call gets fresh connection
      isTableReady = false;
    });
  }
  return dbPool;
}

async function ensureTableInitialized(pool: pg.Pool): Promise<void> {
  if (isTableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_cms (
      id VARCHAR(50) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  isTableReady = true;
}

const REPO_DATA_FILE = path.join(process.cwd(), 'data', 'cms-database.json');

function readRepoSeed(): any {
  if (fs.existsSync(REPO_DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(REPO_DATA_FILE, 'utf-8'));
    } catch (err) {
      console.warn('[Seed] Could not read repo seed file:', err);
    }
  }
  return { empty: true };
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  const origin = req.headers?.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Anti-caching headers (critical for Vercel Serverless / CDN)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const pool = getDbPool();
  const isVercelProd = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');

  // -----------------------------------------------------------
  // 1. GET /api/data: READ CURRENT STATE FROM POSTGRESQL
  // -----------------------------------------------------------
  if (req.method === 'GET') {
    if (!pool) {
      res.setHeader('x-database-status', 'MISSING_DATABASE_URL');
      if (isVercelProd) {
        console.warn('[API /api/data] WARNING: DATABASE_URL is not set in production. Serving read-only fallback seed.');
      }
      const seed = readRepoSeed();
      return sendJson(res, 200, {
        ...seed,
        _meta: {
          databaseConfigured: false,
          warning: 'DATABASE_URL is not configured in Vercel environment variables. Changes cannot be persisted.'
        }
      });
    }

    try {
      await ensureTableInitialized(pool);
      const queryResult = await pool.query(`SELECT data, updated_at FROM portfolio_cms WHERE id = 'main' LIMIT 1;`);

      if (queryResult.rows && queryResult.rows.length > 0 && queryResult.rows[0].data) {
        let dbData = queryResult.rows[0].data;
        if (typeof dbData === 'string') {
          try {
            dbData = JSON.parse(dbData);
          } catch (e) {
            console.warn('[API /api/data] Could not parse dbData string:', e);
          }
        }
        res.setHeader('x-database-status', 'CONNECTED');
        res.setHeader('x-database-updated-at', queryResult.rows[0].updated_at || '');
        return sendJson(res, 200, dbData);
      }

      // If database table is fresh and empty, seed it once with the initial seed data
      const initialSeed = readRepoSeed();
      if (initialSeed && !initialSeed.empty) {
        await pool.query(
          `INSERT INTO portfolio_cms (id, data, updated_at) VALUES ('main', $1::jsonb, NOW()) ON CONFLICT (id) DO NOTHING;`,
          [JSON.stringify(initialSeed)]
        );
        res.setHeader('x-database-status', 'SEEDED');
        return sendJson(res, 200, initialSeed);
      }

      return sendJson(res, 200, { empty: true });
    } catch (err: any) {
      console.error('[API /api/data] PostgreSQL query error:', err.message);
      res.setHeader('x-database-status', 'QUERY_FAILED');
      return sendJson(res, 500, {
        error: 'DATABASE_QUERY_FAILED',
        message: `Failed to query PostgreSQL database: ${err.message}`
      });
    }
  }

  // -----------------------------------------------------------
  // 2. POST /api/data: WRITE UPDATES TO POSTGRESQL
  // -----------------------------------------------------------
  if (req.method === 'POST') {
    // Authenticate Admin
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
        error: 'UNAUTHORIZED',
        message: 'Admin authentication required to update portfolio.'
      });
    }

    // STRICT CHECK: If DATABASE_URL is missing, DO NOT fake success!
    if (!pool) {
      console.error('[API /api/data] REJECTED: POST /api/data called but DATABASE_URL is not set in environment.');
      return sendJson(res, 503, {
        success: false,
        error: 'DATABASE_URL_NOT_CONFIGURED',
        message: 'DATABASE_URL is not set in Vercel Environment Variables. Cannot save changes to PostgreSQL. Please configure DATABASE_URL in Vercel Project Settings.'
      });
    }

    try {
      const payload = await getRequestBody(req);
      if (!payload || typeof payload !== 'object') {
        return sendJson(res, 400, {
          success: false,
          error: 'INVALID_PAYLOAD',
          message: 'Invalid payload provided for update.'
        });
      }

      await ensureTableInitialized(pool);

      // Fetch current database record to merge with incoming update
      let currentData: any = {};
      const currentRes = await pool.query(`SELECT data FROM portfolio_cms WHERE id = 'main' LIMIT 1;`);
      if (currentRes.rows && currentRes.rows.length > 0 && currentRes.rows[0].data) {
        const raw = currentRes.rows[0].data;
        currentData = typeof raw === 'string' ? JSON.parse(raw) : raw;
      } else {
        currentData = readRepoSeed();
      }

      const merged = {
        ...(currentData && !currentData.empty ? currentData : {}),
        ...payload,
        lastUpdated: new Date().toISOString()
      };

      // Atomic PostgreSQL Upsert
      const writeResult = await pool.query(
        `INSERT INTO portfolio_cms (id, data, updated_at)
         VALUES ('main', $1::jsonb, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $1::jsonb, updated_at = NOW()
         RETURNING updated_at;`,
        [JSON.stringify(merged)]
      );

      const savedTimestamp = writeResult.rows[0]?.updated_at || new Date().toISOString();
      console.log(`[API /api/data] Successfully persisted to PostgreSQL at ${savedTimestamp}`);

      return sendJson(res, 200, {
        success: true,
        provider: 'PostgreSQL',
        message: 'Portfolio record successfully persisted to PostgreSQL database.',
        savedAt: savedTimestamp,
        data: merged
      });
    } catch (err: any) {
      console.error('[API /api/data] PostgreSQL write failed:', err);
      return sendJson(res, 500, {
        success: false,
        error: 'POSTGRESQL_WRITE_FAILED',
        message: `Database write operation failed: ${err.message}`
      });
    }
  }

  return sendJson(res, 405, {
    success: false,
    message: `Method ${req.method} Not Allowed.`
  });
}
