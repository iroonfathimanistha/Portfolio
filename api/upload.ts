import {
  parseJsonBody,
  extractBearerOrCookie,
  verifySession
} from './_lib';

export default async function handler(req: any, res: any) {
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
        error: `Method ${req.method} Not Allowed.`
      })
    );
  }

  const token = extractBearerOrCookie(req);
  const session = verifySession(token);
  if (!session) {
    res.statusCode = 401;
    return res.end(
      JSON.stringify({
        success: false,
        error: 'Unauthorized: Admin authentication required.'
      })
    );
  }

  try {
    const body = await parseJsonBody(req);
    const { filename, dataUrl, mimeType, category } = body || {};

    if (!dataUrl || !filename) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          success: false,
          error: 'Missing filename or dataUrl payload.'
        })
      );
    }

    // In serverless environments, returning the dataUrl directly or metadata
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        success: true,
        url: dataUrl,
        filename,
        mimeType: mimeType || 'image/jpeg',
        category: category || 'general'
      })
    );
  } catch (err: any) {
    console.error('[API /api/upload] Error:', err);
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        success: false,
        error: 'Upload processing failed.'
      })
    );
  }
}
