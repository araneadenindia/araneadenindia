// api/auth/login.js — POST /api/auth/login
import { compare } from 'bcryptjs';
import { initDb, getDb } from '../../_lib/db.js';
import { signToken, buildSessionCookie, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    await initDb();
    const db = getDb();

    const { username, password } = req.body || {};
    if (!username || !password) {
      return sendJson(res, 400, { error: 'Username and password are required.' });
    }

    const result = await db.execute({
      sql: `SELECT id, username, password_hash, must_change_password FROM admin_users WHERE username = ? LIMIT 1`,
      args: [username.trim()],
    });

    if (result.rows.length === 0) {
      return sendJson(res, 401, { error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const valid = await compare(password, user.password_hash);
    if (!valid) {
      return sendJson(res, 401, { error: 'Invalid credentials.' });
    }

    const token = await signToken({
      sub: String(user.id),
      username: user.username,
      mustChangePassword: Boolean(user.must_change_password),
    });

    res.setHeader('Set-Cookie', buildSessionCookie(token));
    return sendJson(res, 200, {
      ok: true,
      mustChangePassword: Boolean(user.must_change_password),
    });
  } catch (err) {
    console.error('[login] Error:', err);
    return sendJson(res, 500, { error: 'Internal server error.' });
  }
}
