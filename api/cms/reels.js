// api/cms/reels.js — GET/POST /api/cms/reels
import { initDb, getDb } from '../_lib/db.js';
import { requireAuth, sendJson } from '../_lib/auth.js';

export default async function handler(req, res) {
  await initDb();
  const db = getDb();

  if (req.method === 'GET') {
    const isAdmin = Boolean(await requireAuth(req));
    const sql = isAdmin
      ? `SELECT * FROM reels ORDER BY display_order ASC, id ASC`
      : `SELECT * FROM reels WHERE published = 1 ORDER BY display_order ASC, id ASC`;
    const result = await db.execute(sql);
    return sendJson(res, 200, { ok: true, data: result.rows });
  }

  if (req.method === 'POST') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const { title, video_url, video_public_id, thumbnail_url, thumbnail_public_id, description, display_order, published } = req.body || {};
    if (!title) return sendJson(res, 400, { error: 'Title is required.' });

    const result = await db.execute({
      sql: `INSERT INTO reels (title, video_url, video_public_id, thumbnail_url, thumbnail_public_id, description, display_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [title, video_url || null, video_public_id || null, thumbnail_url || null, thumbnail_public_id || null, description || null, Number(display_order) || 0, published ? 1 : 0],
    });
    return sendJson(res, 201, { ok: true, data: result.rows[0] });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
