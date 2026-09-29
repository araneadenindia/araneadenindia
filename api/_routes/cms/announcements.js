// api/cms/announcements.js — GET/POST /api/cms/announcements
import { initDb, getDb } from '../../_lib/db.js';
import { requireAuth, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  await initDb();
  const db = getDb();

  if (req.method === 'GET') {
    const isAdmin = Boolean(await requireAuth(req));
    const sql = isAdmin
      ? `SELECT * FROM announcements ORDER BY display_order ASC, id ASC`
      : `SELECT * FROM announcements WHERE published = 1 ORDER BY display_order ASC, id ASC`;
    const result = await db.execute(sql);
    return sendJson(res, 200, { ok: true, data: result.rows });
  }

  if (req.method === 'POST') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const { title, image_url, image_public_id, event_date, button_title, button_link, display_order, published } = req.body || {};
    if (!title) return sendJson(res, 400, { error: 'Title is required.' });

    const result = await db.execute({
      sql: `INSERT INTO announcements (title, image_url, image_public_id, event_date, button_title, button_link, display_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        title,
        image_url || null,
        image_public_id || null,
        event_date || null,
        button_title || null,
        button_link || null,
        Number(display_order) || 0,
        published ? 1 : 0,
      ],
    });
    return sendJson(res, 201, { ok: true, data: result.rows[0] });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
