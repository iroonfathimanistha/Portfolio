import type { IncomingMessage, ServerResponse } from 'http';
import {
  parseJsonBody,
  authenticateCredentials,
  signSession,
  setSessionCookie
} from '../_lib';

export default async function handler(req: any, res: any) {
  // Always return application/json
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(
      JSON.stringify({
        success: false,
        error: `Method ${req.method} Not Allowed. Expected POST.`
      })
    );
  }

  try {
    const body = await parseJsonBody(req);
    const { username, password } = body || {};

    if (!username || !password) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          success: false,
          error: 'Please provide both email/username and password.'
        })
      );
    }

    const authUser = authenticateCredentials(username, password);
    if (!authUser) {
      res.statusCode = 401;
      return res.end(
        JSON.stringify({
          success: false,
          error: 'Incorrect email/username or password. Access denied.'
        })
      );
    }

    // Generate secure HMAC token
    const token = signSession(authUser);
    setSessionCookie(res, token);

    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: authUser.id,
          username: authUser.username,
          email: authUser.email,
          role: authUser.role
        }
      })
    );
  } catch (err: any) {
    console.error('[API /api/auth/login] Error:', err);
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        success: false,
        error: 'Authentication service temporarily unavailable.'
      })
    );
  }
}
