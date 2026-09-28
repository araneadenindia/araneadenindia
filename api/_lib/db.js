// api/_lib/db.js
// Turso (libSQL) database client — shared across all API routes
import { createClient } from '@libsql/client';

let _client = null;

export function getDb() {
  if (!_client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) throw new Error('TURSO_DATABASE_URL env var is not set');
    _client = createClient({ url, authToken: authToken || undefined });
  }
  return _client;
}

// Initialize all tables on first run
export async function initDb() {
  const db = getDb();

  await db.batch([
    // Admin users table
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      must_change_password INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,

    // Websites (portfolio web projects)
    `CREATE TABLE IF NOT EXISTS websites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      thumbnail_url TEXT,
      thumbnail_public_id TEXT,
      live_url TEXT,
      description TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,

    // Reels (short-form video portfolio)
    `CREATE TABLE IF NOT EXISTS reels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      video_url TEXT,
      video_public_id TEXT,
      thumbnail_url TEXT,
      thumbnail_public_id TEXT,
      description TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,

    // Services
    `CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      thumbnail_url TEXT,
      thumbnail_public_id TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,

    // Clients
    `CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT,
      logo_public_id TEXT,
      website_url TEXT,
      description TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ], 'write');
}
