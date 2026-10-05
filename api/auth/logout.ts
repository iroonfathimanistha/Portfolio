function sendJson(res: any, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const payload = JSON.stringify(data);
  if (typeof res.json === 'function') {
    return res.json(data);
  }
  return res.end(payload);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  res.setHeader(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );

  return sendJson(res, 200, {
    success: true,
    message: 'Logged out successfully.'
  });
}
