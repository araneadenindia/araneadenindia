// api/auth/change-password.js — POST /api/auth/change-password
import { hash } from 'bcryptjs';
import { requireAuth, sendJson, signToken, buildSessionCookie } from '../../_lib/auth.js';
import { getDb } from '../../_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const admin = await requireAuth(req);
  if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

  const { newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 8) {
    return sendJson(res, 400, { error: 'New password must be at least 8 characters.' });
  }

  try {
    const db = getDb();
    const passwordHash = await hash(newPassword, 12);
    await db.execute({
      sql: `UPDATE admin_users SET password_hash = ?, must_change_password = 0 WHERE id = ?`,
      args: [passwordHash, admin.sub],
    });

    // Re-issue cookie with mustChangePassword = false so subsequent /api/auth/me checks succeed immediately
    const token = await signToken({
      sub: String(admin.sub),
      username: admin.username,
      mustChangePassword: false,
    });
    res.setHeader('Set-Cookie', buildSessionCookie(token));

    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error('[change-password] Error:', err);
    return sendJson(res, 500, { error: err.message || 'Internal server error.' });
  }
}
