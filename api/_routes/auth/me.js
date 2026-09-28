// api/auth/me.js — GET /api/auth/me — returns current session info
import { requireAuth, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAuth(req);
  if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });
  return sendJson(res, 200, {
    ok: true,
    username: admin.username,
    mustChangePassword: admin.mustChangePassword,
  });
}
