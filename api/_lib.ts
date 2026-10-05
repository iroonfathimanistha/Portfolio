import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface SessionPayload extends AuthUser {
  iat: number;
  exp: number;
}

export const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  'nistha-cms-secure-key-2026-auth-v1';

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Base64URL helpers
export function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function fromBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// Stateless HMAC Signed Session Token
export function signSession(user: AuthUser): string {
  const payload: SessionPayload = {
    ...user,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS
  };
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = toBase64Url(payloadStr);
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifySession(token: string | null | undefined): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'utf-8'),
      Buffer.from(expectedSig, 'utf-8')
    );
    if (!isSigValid) return null;

    const payloadJson = fromBase64Url(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Password hashing
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, effectiveSalt, 64).toString('hex');
  return { hash, salt: effectiveSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

// Configured Admin Credentials
export function getAdminUser() {
  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || 'nisthafathima99@gmail.com').trim();
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || 'NisthaAdmin2026!';

  // Check if cms-auth.json exists on disk
  try {
    const authPath = path.join(process.cwd(), 'data', 'cms-auth.json');
    if (fs.existsSync(authPath)) {
      const data = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
      if (data && Array.isArray(data.users) && data.users.length > 0) {
        return {
          storedUsers: data.users,
          fallbackAdmin: {
            id: 'user-admin-1',
            username: adminUsername,
            email: adminEmail,
            password: adminPassword
          }
        };
      }
    }
  } catch {
    // If running in read-only environment or file doesn't exist, proceed with environment credentials
  }

  return {
    storedUsers: [],
    fallbackAdmin: {
      id: 'user-admin-1',
      username: adminUsername,
      email: adminEmail,
      password: adminPassword
    }
  };
}

export function authenticateCredentials(userInput: string, passInput: string): AuthUser | null {
  const cleanInput = (userInput || '').trim().toLowerCase();
  const { storedUsers, fallbackAdmin } = getAdminUser();

  // 1. Check against file stored users (if any)
  for (const u of storedUsers) {
    if (
      u.username.toLowerCase() === cleanInput ||
      u.email.toLowerCase() === cleanInput
    ) {
      if (verifyPassword(passInput, u.passwordHash, u.passwordSalt)) {
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          role: u.role || 'admin'
        };
      }
    }
  }

  // 2. Check against environment/default admin credentials
  if (
    cleanInput === fallbackAdmin.username.toLowerCase() ||
    cleanInput === fallbackAdmin.email.toLowerCase()
  ) {
    if (passInput === fallbackAdmin.password) {
      return {
        id: fallbackAdmin.id,
        username: fallbackAdmin.username,
        email: fallbackAdmin.email,
        role: 'admin'
      };
    }
  }

  return null;
}

// Request helpers
export async function parseJsonBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (req.body && typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  // Otherwise read stream
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export function extractBearerOrCookie(req: any): string | null {
  const authHeader = req.headers?.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check cookie header
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader && typeof cookieHeader === 'string') {
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }

  // Check req.cookies
  if (req.cookies && req.cookies.admin_session) {
    return req.cookies.admin_session;
  }

  return null;
}

export function setSessionCookie(res: any, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieVal = [
    `admin_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  ];
  if (isProd) {
    cookieVal.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieVal.join('; '));
}

export function clearSessionCookie(res: any) {
  res.setHeader(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
}
