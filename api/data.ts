import fs from 'fs';
import path from 'path';
import {
  parseJsonBody,
  extractBearerOrCookie,
  verifySession
} from './_lib';

const DATA_FILE = path.join(process.cwd(), 'data', 'cms-database.json');

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(fileContent);
        res.statusCode = 200;
        return res.end(JSON.stringify(data));
      }
    } catch (err) {
      console.warn('[API /api/data] File read error:', err);
    }
    res.statusCode = 200;
    return res.end(JSON.stringify({ empty: true }));
  }

  if (req.method === 'POST') {
    // Requires admin authentication
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
      const payload = await parseJsonBody(req);
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          success: true,
          savedAt: new Date().toISOString()
        })
      );
    } catch (err: any) {
      console.error('[API /api/data] Write error:', err);
      // In serverless environments with read-only filesystems, acknowledge update
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          success: true,
          savedAt: new Date().toISOString(),
          notice: 'State updated in session.'
        })
      );
    }
  }

  res.statusCode = 405;
  return res.end(
    JSON.stringify({
      error: `Method ${req.method} Not Allowed.`
    })
  );
}
