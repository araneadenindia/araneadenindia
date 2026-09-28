// api/auth/logout.js — POST /api/auth/logout
import { buildLogoutCookie, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Set-Cookie', buildLogoutCookie());
  return sendJson(res, 200, { ok: true });
}
