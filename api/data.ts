import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

// Data store locations
const REPO_DATA_FILE = path.join(process.cwd(), 'data', 'cms-database.json');
const TMP_DATA_FILE = path.join('/tmp', 'cms-database.json');

// Upstash / Vercel KV REST helpers (zero external dependencies)
async function loadFromKV(): Promise<any | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/cms_database`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      }
    }
  } catch (err) {
    console.warn('[DB KV] Error loading:', err);
  }
  return null;
}

async function saveToKV(payload: any): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/set/cms_database`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn('[DB KV] Error saving:', err);
    return false;
  }
}

// Unified Database Reader
export async function getDatabaseData(): Promise<any> {
  // 1. Try remote cloud KV store if configured
  const kvData = await loadFromKV();
  if (kvData && typeof kvData === 'object' && Object.keys(kvData).length > 0) {
    (globalThis as any).__cmsDataCache = kvData;
    return kvData;
  }

  // 2. Try in-memory lambda cache
  if ((globalThis as any).__cmsDataCache) {
    return (globalThis as any).__cmsDataCache;
  }

  // 3. Try /tmp filesystem (writable on Vercel lambda instances)
  if (fs.existsSync(TMP_DATA_FILE)) {
    try {
      const content = fs.readFileSync(TMP_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      (globalThis as any).__cmsDataCache = parsed;
      return parsed;
    } catch {}
  }

  // 4. Try bundled repo file
  if (fs.existsSync(REPO_DATA_FILE)) {
    try {
      const content = fs.readFileSync(REPO_DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      (globalThis as any).__cmsDataCache = parsed;
      return parsed;
    } catch (err) {
      console.warn('[DB] Failed to parse repo data file:', err);
    }
  }

  return { empty: true };
}

// Unified Database Writer
export async function setDatabaseData(updatedData: any): Promise<boolean> {
  (globalThis as any).__cmsDataCache = updatedData;

  // 1. Save to remote KV if configured
  await saveToKV(updatedData);

  // 2. Save to /tmp (always writable in serverless runtimes)
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Could not write to /tmp:', err);
  }

  // 3. Save to repo data file (writable in local dev / persistent servers)
  try {
    const dir = path.dirname(REPO_DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(REPO_DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
  } catch {
    // Expected on read-only serverless lambdas
  }

  return true;
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

  if (req.method === 'GET') {
    const data = await getDatabaseData();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return sendJson(res, 200, data);
  }

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

      // Merge with existing database record so partial updates don't wipe other tables
      const current = await getDatabaseData();
      const merged = {
        ...(current && !current.empty ? current : {}),
        ...payload,
        lastUpdated: new Date().toISOString()
      };

      await setDatabaseData(merged);

      return sendJson(res, 200, {
        success: true,
        message: 'Portfolio data saved to persistent database successfully.',
        savedAt: merged.lastUpdated,
        data: merged
      });
    } catch (err: any) {
      console.error('[API /api/data] Write error:', err);
      return sendJson(res, 500, {
        success: false,
        message: 'Failed to update database record.'
      });
    }
  }

  return sendJson(res, 405, {
    success: false,
    message: `Method ${req.method} Not Allowed.`
  });
}
