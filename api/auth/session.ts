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

export default async function handler(req: any, res: any) {
  const origin = req.headers?.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  try {
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

    if (!token) {
      return sendJson(res, 200, { authenticated: false });
    }

    const authSecret = process.env.AUTH_SECRET || 'nistha-cms-secure-key-2026-auth-v1';
    const session = verifySession(token, authSecret);

    if (!session) {
      res.setHeader(
        'Set-Cookie',
        'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      return sendJson(res, 200, { authenticated: false });
    }

    return sendJson(res, 200, {
      authenticated: true,
      user: {
        id: session.id,
        username: session.username,
        email: session.email,
        role: session.role
      }
    });
  } catch {
    return sendJson(res, 200, { authenticated: false });
  }
}
