// api/cms/apps/[id].js — GET/PUT/DELETE /api/cms/apps/:id
import { getDb } from '../../../_lib/db.js';
import { requireAuth, sendJson } from '../../../_lib/auth.js';

export default async function handler(req, res) {
  const db = getDb();
  const { id } = req.query;

  if (!id) return sendJson(res, 400, { error: 'ID is required.' });

  // ── GET single (admin only) ──
  if (req.method === 'GET') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const result = await db.execute({ sql: `SELECT * FROM apps WHERE id = ?`, args: [id] });
    if (!result.rows.length) return sendJson(res, 404, { error: 'Not found.' });
    return sendJson(res, 200, { ok: true, data: result.rows[0] });
  }

  // ── PUT: Update app (admin only) ──
  if (req.method === 'PUT') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const {
      name,
      client,
      platform,
      category,
      description,
      tags,
      thumbnail_url,
      thumbnail_public_id,
      url,
      year,
      status,
      display_order,
      published,
    } = req.body || {};

    await db.execute({
      sql: `UPDATE apps
            SET name = COALESCE(?, name),
                client = ?,
                platform = ?,
                category = ?,
                description = ?,
                tags = ?,
                thumbnail_url = ?,
                thumbnail_public_id = ?,
                url = ?,
                year = ?,
                status = ?,
                display_order = COALESCE(?, display_order),
                published = COALESCE(?, published),
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        name || null,
        client !== undefined ? client : null,
        platform !== undefined ? platform : null,
        category !== undefined ? category : null,
        description !== undefined ? description : null,
        tags !== undefined ? (Array.isArray(tags) ? tags.join(', ') : tags) : null,
        thumbnail_url !== undefined ? thumbnail_url : null,
        thumbnail_public_id !== undefined ? thumbnail_public_id : null,
        url !== undefined ? url : null,
        year !== undefined ? year : null,
        status !== undefined ? status : null,
        display_order !== undefined ? Number(display_order) : null,
        published !== undefined ? (published ? 1 : 0) : null,
        id,
      ],
    });

    const result = await db.execute({ sql: `SELECT * FROM apps WHERE id = ?`, args: [id] });
    return sendJson(res, 200, { ok: true, data: result.rows[0] });
  }

  // ── DELETE (admin only) ──
  if (req.method === 'DELETE') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    await db.execute({ sql: `DELETE FROM apps WHERE id = ?`, args: [id] });
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
