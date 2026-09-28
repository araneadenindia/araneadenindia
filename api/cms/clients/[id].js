// api/cms/clients/[id].js — GET/PUT/DELETE /api/cms/clients/:id
import { getDb } from '../../_lib/db.js';
import { requireAuth, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  const db = getDb();
  const { id } = req.query;
  if (!id) return sendJson(res, 400, { error: 'ID is required.' });

  if (req.method === 'GET') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });
    const result = await db.execute({ sql: `SELECT * FROM clients WHERE id = ?`, args: [id] });
    if (!result.rows.length) return sendJson(res, 404, { error: 'Not found.' });
    return sendJson(res, 200, { ok: true, data: result.rows[0] });
  }

  if (req.method === 'PUT') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const { name, logo_url, logo_public_id, website_url, description, display_order, published } = req.body || {};

    await db.execute({
      sql: `UPDATE clients
            SET name = COALESCE(?, name),
                logo_url = ?,
                logo_public_id = ?,
                website_url = ?,
                description = ?,
                display_order = COALESCE(?, display_order),
                published = COALESCE(?, published),
                updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        name || null,
        logo_url !== undefined ? logo_url : null,
        logo_public_id !== undefined ? logo_public_id : null,
        website_url !== undefined ? website_url : null,
        description !== undefined ? description : null,
        display_order !== undefined ? Number(display_order) : null,
        published !== undefined ? (published ? 1 : 0) : null,
        id,
      ],
    });
    const result = await db.execute({ sql: `SELECT * FROM clients WHERE id = ?`, args: [id] });
    return sendJson(res, 200, { ok: true, data: result.rows[0] });
  }

  if (req.method === 'DELETE') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });
    await db.execute({ sql: `DELETE FROM clients WHERE id = ?`, args: [id] });
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
