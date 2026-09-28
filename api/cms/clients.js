// api/cms/clients.js — GET/POST /api/cms/clients
import { initDb, getDb } from '../_lib/db.js';
import { requireAuth, sendJson } from '../_lib/auth.js';

export default async function handler(req, res) {
  await initDb();
  const db = getDb();

  if (req.method === 'GET') {
    const isAdmin = Boolean(await requireAuth(req));
    const sql = isAdmin
      ? `SELECT * FROM clients ORDER BY display_order ASC, id ASC`
      : `SELECT * FROM clients WHERE published = 1 ORDER BY display_order ASC, id ASC`;
    const result = await db.execute(sql);
    return sendJson(res, 200, { ok: true, data: result.rows });
  }

  if (req.method === 'POST') {
    const admin = await requireAuth(req);
    if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

    const { name, logo_url, logo_public_id, website_url, description, display_order, published } = req.body || {};
    if (!name) return sendJson(res, 400, { error: 'Client name is required.' });

    const result = await db.execute({
      sql: `INSERT INTO clients (name, logo_url, logo_public_id, website_url, description, display_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [name, logo_url || null, logo_public_id || null, website_url || null, description || null, Number(display_order) || 0, published ? 1 : 0],
    });
    return sendJson(res, 201, { ok: true, data: result.rows[0] });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
