// api/cms/reels/[id].js — GET/PUT/DELETE /api/cms/reels/:id
import { getDb } from '../../../_lib/db.js';
import { requireAuth, sendJson } from '../../../_lib/auth.js';

export default async function handler(req, res) {
  const db = getDb();
  const { id } = req.query;
  if (!id) return sendJson(res, 400, { error: 'ID is required.' });

  if (req.method === 'GET') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });
    const result = await db.execute({ sql: `SELECT * FROM reels WHERE id = ?`, args: [id] });
    if (!result.rows.length) return sendJson(res, 404, { error: 'Not found.' });
    return sendJson(res, 200, { ok: true, data: result.rows[0] });
  }

  if (req.method === 'PUT') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const { title, video_url, video_public_id, thumbnail_url, thumbnail_public_id, description, display_order, published } = req.body || {};

    await db.execute({
      sql: `UPDATE reels
            SET title = COALESCE(?, title),
                video_url = ?,
                video_public_id = ?,
                thumbnail_url = ?,
                thumbnail_public_id = ?,
                description = ?,
                display_order = COALESCE(?, display_order),
                published = COALESCE(?, published),
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        title || null,
        video_url !== undefined ? video_url : null,
        video_public_id !== undefined ? video_public_id : null,
        thumbnail_url !== undefined ? thumbnail_url : null,
        thumbnail_public_id !== undefined ? thumbnail_public_id : null,
        description !== undefined ? description : null,
        display_order !== undefined ? Number(display_order) : null,
        published !== undefined ? (published ? 1 : 0) : null,
        id,
      ],
    });

    const result = await db.execute({ sql: `SELECT * FROM reels WHERE id = ?`, args: [id] });
    return sendJson(res, 200, { ok: true, data: result.rows[0] });
  }

  if (req.method === 'DELETE') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });
    await db.execute({ sql: `DELETE FROM reels WHERE id = ?`, args: [id] });
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
