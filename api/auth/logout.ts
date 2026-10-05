import { clearSessionCookie } from '../_lib';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  clearSessionCookie(res);
  res.statusCode = 200;
  return res.end(
    JSON.stringify({
      success: true,
      message: 'Logged out successfully.'
    })
  );
}
