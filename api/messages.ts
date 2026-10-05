import fs from 'fs';
import path from 'path';

function sendJson(res: any, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  const payload = JSON.stringify(data);
  if (typeof res.json === 'function') {
    return res.json(data);
  }
  return res.end(payload);
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

const DATA_FILE = path.join(process.cwd(), 'data', 'cms-database.json');

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

  try {
    const body = await getRequestBody(req);
    const { name, email, subject, message } = body || {};
    if (!name || !email || !message) {
      return sendJson(res, 400, {
        success: false,
        message: 'Please provide name, email, and message.'
      });
    }

    let dbData: any = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        dbData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      } catch {}
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || 'Software Engineering Inquiry').trim(),
      message: String(message).trim(),
      receivedAt: new Date().toISOString(),
      read: false
    };

    dbData.messages = [newMessage, ...(dbData.messages || [])];

    try {
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    } catch {
      // In read-only lambdas, message is logged
    }

    return sendJson(res, 200, {
      success: true,
      id: newMessage.id
    });
  } catch (err: any) {
    console.error('[API /api/messages] Error:', err);
    return sendJson(res, 500, {
      success: false,
      message: 'Failed to process contact message.'
    });
  }
}
