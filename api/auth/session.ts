import {
  extractBearerOrCookie,
  verifySession,
  clearSessionCookie
} from '../_lib';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  try {
    const token = extractBearerOrCookie(req);
    if (!token) {
      res.statusCode = 200;
      return res.end(JSON.stringify({ authenticated: false }));
    }

    const session = verifySession(token);
    if (!session) {
      clearSessionCookie(res);
      res.statusCode = 200;
      return res.end(JSON.stringify({ authenticated: false }));
    }

    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        authenticated: true,
        user: {
          id: session.id,
          username: session.username,
          email: session.email,
          role: session.role
        }
      })
    );
  } catch (err: any) {
    console.error('[API /api/auth/session] Error:', err);
    res.statusCode = 200;
    return res.end(JSON.stringify({ authenticated: false }));
  }
}
