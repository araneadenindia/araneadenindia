// api/setup.js
// One-time database initialization + admin user seeding
// GET /api/setup — safe to call multiple times (idempotent)
import { initDb, getDb } from './_lib/db.js';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    // Initialize schema
    await initDb();
    const db = getDb();

    // Check if admin already exists
    const existing = await db.execute(`SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1`);
    if (existing.rows.length === 0) {
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'araneaden@2026admin';
      const passwordHash = await hash(initialPassword, 12);
      await db.execute({
        sql: `INSERT INTO admin_users (username, password_hash, must_change_password) VALUES (?, ?, 1)`,
        args: ['admin', passwordHash],
      });
    }

    // Seed 1 initial website if none exist
    const websiteCount = await db.execute(`SELECT COUNT(*) as cnt FROM websites`);
    if (Number(websiteCount.rows[0].cnt) === 0) {
      await db.execute({
        sql: `INSERT INTO websites (title, live_url, description, display_order, published)
              VALUES (?, ?, ?, 1, 1)`,
        args: [
          'Meghana Builders',
          'https://meghanabuilders.com',
          'Premier residential, commercial & government construction in Hyderabad.',
        ],
      });
    }

    // Seed 1 initial reel if none exist
    const reelCount = await db.execute(`SELECT COUNT(*) as cnt FROM reels`);
    if (Number(reelCount.rows[0].cnt) === 0) {
      await db.execute({
        sql: `INSERT INTO reels (title, description, display_order, published)
              VALUES (?, ?, 1, 1)`,
        args: [
          'Startup Potluck — Founder Pitch',
          'Official video coverage and cinematic launch showcase for Startup Potluck in Rajahmundry.',
        ],
      });
    }

    // Seed 1 initial client if none exist
    const clientCount = await db.execute(`SELECT COUNT(*) as cnt FROM clients`);
    if (Number(clientCount.rows[0].cnt) === 0) {
      await db.execute({
        sql: `INSERT INTO clients (name, website_url, description, display_order, published)
              VALUES (?, ?, ?, 1, 1)`,
        args: [
          'Meghana Builders',
          'https://meghanabuilders.com',
          'Premier residential construction company in Hyderabad.',
        ],
      });
    }

    res.status(200).json({ ok: true, message: 'Database initialized and seeded successfully.' });
  } catch (err) {
    console.error('[setup] Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
