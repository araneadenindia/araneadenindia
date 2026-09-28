// api/cms/apps.js — GET/POST /api/cms/apps
import { initDb, getDb } from '../../_lib/db.js';
import { requireAuth, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  await initDb();
  const db = getDb();

  // ── GET: Public or admin list ──
  if (req.method === 'GET') {
    const isAdmin = Boolean(await requireAuth(req));
    const sql = isAdmin
      ? `SELECT * FROM apps ORDER BY display_order ASC, id ASC`
      : `SELECT * FROM apps WHERE published = 1 ORDER BY display_order ASC, id ASC`;

    const result = await db.execute(sql);
    return sendJson(res, 200, { ok: true, data: result.rows });
  }

  // ── POST: Create new app (admin only) ──
  if (req.method === 'POST') {
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

    if (!name) return sendJson(res, 400, { error: 'App name is required.' });

    const result = await db.execute({
      sql: `INSERT INTO apps (name, client, platform, category, description, tags, thumbnail_url, thumbnail_public_id, url, year, status, display_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        name,
        client || null,
        platform || 'iOS / Android',
        category || 'Mobile & Cloud Application',
        description || null,
        Array.isArray(tags) ? tags.join(', ') : tags || null,
        thumbnail_url || null,
        thumbnail_public_id || null,
        url || null,
        year || '2026',
        status || 'Production',
        Number(display_order) || 0,
        published ? 1 : 0,
      ],
    });

    return sendJson(res, 201, { ok: true, data: result.rows[0] });
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
