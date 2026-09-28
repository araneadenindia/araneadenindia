// api/_lib/auth.js
// JWT-based authentication utilities for the CMS admin panel
import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-do-not-use-in-production'
);

const COOKIE_NAME = 'ad_cms_session';
const TOKEN_TTL = '7d';

// Sign a new JWT token
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(SECRET_KEY);
}

// Verify a JWT token; returns payload or null
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

// Extract token from cookie header
export function getTokenFromRequest(req) {
  const cookieHeader = req.headers.cookie || req.headers.Cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  return cookies[COOKIE_NAME] || null;
}

// Build a Set-Cookie header string for the session token
export function buildSessionCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`;
}

// Build a cookie that clears the session
export function buildLogoutCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

// Middleware: verify the request is authenticated; returns admin payload or null
export async function requireAuth(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return await verifyToken(token);
}

// CORS and JSON helpers
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).json(data);
}
