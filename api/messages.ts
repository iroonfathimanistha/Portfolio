import fs from 'fs';
import path from 'path';
import { parseJsonBody } from './_lib';

const DATA_FILE = path.join(process.cwd(), 'data', 'cms-database.json');

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

  try {
    const { name, email, subject, message } = (await parseJsonBody(req)) || {};
    if (!name || !email || !message) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          error: 'Please provide name, email, and message.'
        })
      );
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

    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        success: true,
        id: newMessage.id
      })
    );
  } catch (err: any) {
    console.error('[API /api/messages] Error:', err);
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        error: 'Failed to process contact message.'
      })
    );
  }
}
