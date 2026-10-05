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
      message: `Method ${req.method} Not Allowed.`
    });
  }

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
    const body = await getRequestBody(req);
    const { filename, dataUrl, mimeType, category } = body || {};

    if (!dataUrl || !filename) {
      return sendJson(res, 400, {
        success: false,
        message: 'Missing filename or dataUrl payload.'
      });
    }

    return sendJson(res, 200, {
      success: true,
      url: dataUrl,
      filename,
      mimeType: mimeType || 'image/jpeg',
      category: category || 'general'
    });
  } catch (err: any) {
    console.error('[API /api/upload] Error:', err);
    return sendJson(res, 500, {
      success: false,
      message: 'Upload processing failed.'
    });
  }
}
