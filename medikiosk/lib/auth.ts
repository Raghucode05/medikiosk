import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getUserByEmail, getDb } from './db';

const SESSION_COOKIE = 'medikiosk_session';
const SECRET = process.env.MEDIKIOSK_SECRET || 'medikiosk_default_secret_key_2026';

/**
 * Create a signed session token from user data.
 */
function signToken(payload: { userId: string; email: string }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verify and decode a signed session token.
 */
function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(data)
      .digest('base64url');

    if (signature !== expected) return null;

    return JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch {
    return null;
  }
}

/**
 * Build a Set-Cookie header string for the session.
 */
export function buildSessionCookie(userId: string, email: string): string {
  const token = signToken({ userId, email });
  // HttpOnly, SameSite=Lax, path=/, max-age = 7 days
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

/**
 * Build a Set-Cookie header string that clears the session.
 */
export function buildClearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

/**
 * Extract the authenticated doctor's user ID from the request cookies.
 * Returns the doctor's database ID (e.g. 'U001') or null if not authenticated.
 */
export function getSessionDoctorId(request: Request): string | null {
  // Parse cookies from the Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );

  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Verify user still exists in database
  const db = getDb();
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(payload.userId) as any;
  if (!user) return null;

  return payload.userId;
}
