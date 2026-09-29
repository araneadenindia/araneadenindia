// api/cms/seed.js — POST /api/cms/seed
// Seeds all existing hardcoded data into the DB if tables are empty.
// Safe to run repeatedly — uses INSERT OR IGNORE so existing rows are never overwritten.
import { initDb, getDb } from '../../_lib/db.js';
import { requireAuth, sendJson } from '../../_lib/auth.js';

// ── Static data mirrored from src/data/ ─────────────────────────────────────
const WEBSITES = [
  { title: 'MEGHANA BUILDERS', live_url: 'https://meghanabuilders.com', thumbnail_url: '/portfolio-thumbs/meghana.jpg', description: 'Premier residential, commercial & government construction in Hyderabad.', display_order: 1 },
  { title: 'POOJA PRODUCTIONS', live_url: 'https://poojaproductions.com', thumbnail_url: '/portfolio-thumbs/pooja.jpg', description: 'Premium film production house producing award-winning feature films and documentaries.', display_order: 2 },
  { title: 'VIRAJ ACADEMY', live_url: 'https://virajedu.com', thumbnail_url: '/portfolio-thumbs/viraj.jpg', description: 'Practical training, competitive exam coaching and career guidance from senior industry experts.', display_order: 3 },
  { title: 'MAKAAN INFRA', live_url: 'https://makaaninfra.com', thumbnail_url: '/portfolio-thumbs/makaan.jpg', description: 'Professional civil construction, building planning and structural consulting in Odisha.', display_order: 4 },
  { title: 'SRIYA & JANAK', live_url: 'https://sriyasjaan.com', thumbnail_url: '/portfolio-thumbs/sriyasjaan.jpg', description: 'Luxury wedding experience with editorial typography and RSVP engine.', display_order: 5 },
  { title: 'CREATORS EVENT ORGANIZATION', live_url: 'https://creatorseventsorganization.vercel.app/', thumbnail_url: '/portfolio-thumbs/creators.jpg', description: 'Premium food, business, franchise, shopping, education and fashion expos across India.', display_order: 6 },
  { title: 'P & P CONNEKTS', live_url: 'https://pandpconnektss.web.app', thumbnail_url: '/portfolio-thumbs/pandp.jpg', description: 'Full-stack digital marketing agency delivering strategic brand elevation.', display_order: 7 },
  { title: 'CORNER CRAFT DESIGN STUDIO', live_url: 'https://cornercraftds.web.app', thumbnail_url: '/portfolio-thumbs/cornercraft.jpg', description: 'Luxury residential and commercial interiors in Hyderabad & Vijayawada.', display_order: 8 },
  { title: 'THOR INDIAN CUISINE', live_url: 'https://thor-indian-cuisinse.firebaseapp.com', thumbnail_url: '/portfolio-thumbs/thor.jpg', description: 'Authentic Indian cuisine restaurant platform in Memphis, TN.', display_order: 9 },
  { title: 'NRI360', live_url: 'https://nri360degrees.com', thumbnail_url: '/portfolio-thumbs/nri360.jpg', description: 'NRI services for family & property — legal aid, tax filing, senior citizen care.', display_order: 10 },
  { title: 'ISHOOTS', live_url: 'https://ishoots.com', thumbnail_url: '/portfolio-thumbs/pooja.jpg', description: 'Premium photography & visual production — editorial, commercial, fashion.', display_order: 11 },
];

const APPS = [
  { name: 'ARANEA MOBILE OS', client: 'Aranea Den Atelier', platform: 'iOS / Swift & React Native', category: 'MOBILE ECOSYSTEM & TELEMETRY', description: 'Tactile companion application engineered with micro-interactions and biometric security.', tags: 'SwiftUI,Offline-First SQLite,Biometrics,Haptics', thumbnail_url: '/services/ad-mobile-development.jpg', year: '2026', status: 'In Development', display_order: 1 },
  { name: 'THOR MOBILE ORDERS', client: 'Thor Indian Cuisine', platform: 'iOS & Android Native', category: 'HOSPITALITY & LIVE ORDERING', description: 'High-speed table reservations, instant kitchen telemetry, and synchronized curbside pickup.', tags: 'React Native,Live Orders,Push Notifications,Memphis TN', thumbnail_url: '/services/02-mobile-app-development.jpg', url: 'https://thor-indian-cuisinse.firebaseapp.com', year: '2025', status: 'Private Beta', display_order: 2 },
  { name: 'NRI360 MOBILE CONCIERGE', client: 'NRI360 Global', platform: 'Cross-Platform Mobile', category: 'GLOBAL CONCIERGE & HEALTHCARE', description: 'Real-time property monitoring, senior family healthcare check-ins, and direct encrypted concierge chat.', tags: 'Flutter,Encrypted Chat,100+ Cities,Legal Telemetry', thumbnail_url: '/services/ad-ui-ux-design.jpg', url: 'https://nri360degrees.com', year: '2026', status: 'Production', display_order: 3 },
  { name: 'IMPERIAL VISUALS MEDIA SUITE', client: 'AD Imperial Visuals', platform: 'iOS / iPadOS & Android', category: 'PORTABLE 4K MEDIA ARCHIVE', description: 'Sensory vertical media showcase, client proofing suite, and instant social reel deployment.', tags: 'Video Player,ProRes Delivery,Color Fidelity,Studio Suite', thumbnail_url: '/services/ui-ux-design.jpg', year: '2026', status: 'Internal Release', display_order: 4 },
];

const REELS = [
  { title: 'Startup Potluck — Founder Pitch', video_url: '/reels-videos/startup-potluck.mp4', thumbnail_url: '/reels/reel_05.jpg', description: 'Official video coverage and cinematic launch showcase for Startup Potluck in Rajahmundry.', display_order: 1 },
  { title: 'CEO Expos — Executive Summit', video_url: '/reels-videos/ceo-expos.mp4', thumbnail_url: '/reels/reel_02.jpg', description: 'High-impact conference branding and executive summit campaigns across Andhra Pradesh.', display_order: 2 },
  { title: 'JK Restaurant — Culinary Branding', video_url: '/reels-videos/jk-restaurant.mp4', thumbnail_url: '/reels/reel_06.jpg', description: 'Sensory gastronomy campaign and culinary storytelling for JK Restaurant, Rajahmundry.', display_order: 3 },
  { title: 'Finance with Veeru — Advisory Reels', video_url: '/reels-videos/finance-with-veeru.mp4', thumbnail_url: '/reels/reel_04.jpg', description: 'Authoritative financial education reels and high-trust audience growth.', display_order: 4 },
];

const CLIENTS = [
  { name: 'Makaan Infrastructure', logo_url: '/clientele/makaan-infrastructure.png', display_order: 1 },
  { name: 'Meghana Builders', logo_url: '/clientele/meghana-builders.webp', display_order: 2 },
  { name: 'Pooja Productions', logo_url: '/clientele/pooja-productions.png', display_order: 3 },
  { name: 'P&P Connekts', logo_url: '/clientele/pp-connekts.png', display_order: 4 },
  { name: 'Thor Indian Cuisine', logo_url: '/clientele/thor-cuisine.png', display_order: 5 },
  { name: 'NRI 360', logo_url: '/clientele/nri-360.png', display_order: 6 },
  { name: 'Viraj Academy', logo_url: '/clientele/viraj-academy.png', display_order: 7 },
  { name: 'ISHOOTS', logo_url: '/clientele/ishoots.jpg', display_order: 8 },
  { name: 'Sriya & Janak', logo_url: '/clientele/sriya-janak.jpg', display_order: 9 },
];

const ANNOUNCEMENTS = [
  { title: 'District Youth Festival – 2026', image_url: '/announcements/district-youth-festival-2026.jpg', event_date: '29 SEPTEMBER 2026', button_title: 'Register Now', button_link: 'https://forms.gle/JSXfFGGESx6U2Mhr8', display_order: 1 },
  { title: 'Sriyasjaan Creative Collaboration', image_url: '/portfolio-thumbs/sriyasjaan.jpg', event_date: '24 SEPTEMBER 2026', button_title: null, button_link: null, display_order: 2 },
  { title: 'Aranea Code Nexus Hackathon', image_url: '/portfolio-thumbs/thor.jpg', event_date: '08 OCTOBER 2026', button_title: null, button_link: null, display_order: 3 },
  { title: 'Systems Architecture & AI Masterclass', image_url: '/portfolio-thumbs/cornercraft.jpg', event_date: '16 OCTOBER 2026', button_title: null, button_link: null, display_order: 4 },
  { title: 'AD Imperial Visuals Creative Suite', image_url: '/portfolio-thumbs/creators.jpg', event_date: '25 OCTOBER 2026', button_title: null, button_link: null, display_order: 5 },
  { title: 'Hardware & Embedded Solutions Lab', image_url: '/portfolio-thumbs/viraj.jpg', event_date: '03 NOVEMBER 2026', button_title: null, button_link: null, display_order: 6 },
  { title: 'Brand Identity Sprint — Q4', image_url: '/portfolio-thumbs/meghana.jpg', event_date: '12 NOVEMBER 2026', button_title: null, button_link: null, display_order: 7 },
  { title: 'Premium Web Platform Intake', image_url: '/portfolio-thumbs/makaan.jpg', event_date: '21 NOVEMBER 2026', button_title: null, button_link: null, display_order: 8 },
  { title: 'Growth Strategy Summit', image_url: '/portfolio-thumbs/nri360.jpg', event_date: '02 DECEMBER 2026', button_title: null, button_link: null, display_order: 9 },
  { title: 'Mobile App Development Bootcamp', image_url: '/portfolio-thumbs/pooja.jpg', event_date: '11 DECEMBER 2026', button_title: null, button_link: null, display_order: 10 },
  { title: 'Open UI/UX Design Critique', image_url: '/portfolio-thumbs/pandp.jpg', event_date: '19 DECEMBER 2026', button_title: null, button_link: null, display_order: 11 },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const admin = await requireAuth(req);
  if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

  await initDb();
  const db = getDb();

  let inserted = { websites: 0, apps: 0, reels: 0, clients: 0, announcements: 0 };

  // Seed Websites (only if not already existing)
  for (const w of WEBSITES) {
    try {
      const exists = await db.execute({ sql: `SELECT id FROM websites WHERE title = ? LIMIT 1`, args: [w.title] });
      if (!exists.rows.length) {
        await db.execute({
          sql: `INSERT INTO websites (title, live_url, thumbnail_url, description, display_order, published)
                VALUES (?, ?, ?, ?, ?, 1)`,
          args: [w.title, w.live_url, w.thumbnail_url, w.description, w.display_order],
        });
        inserted.websites++;
      }
    } catch { /* skip duplicates */ }
  }

  // Seed Apps (only if not already existing)
  for (const a of APPS) {
    try {
      const exists = await db.execute({ sql: `SELECT id FROM apps WHERE name = ? LIMIT 1`, args: [a.name] });
      if (!exists.rows.length) {
        await db.execute({
          sql: `INSERT INTO apps (name, client, platform, category, description, tags, thumbnail_url, url, year, status, display_order, published)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          args: [a.name, a.client, a.platform, a.category, a.description, a.tags, a.thumbnail_url, a.url || null, a.year, a.status, a.display_order],
        });
        inserted.apps++;
      }
    } catch { /* skip duplicates */ }
  }

  // Seed Reels (only if not already existing)
  for (const r of REELS) {
    try {
      const exists = await db.execute({ sql: `SELECT id FROM reels WHERE title = ? LIMIT 1`, args: [r.title] });
      if (!exists.rows.length) {
        await db.execute({
          sql: `INSERT INTO reels (title, video_url, thumbnail_url, description, display_order, published)
                VALUES (?, ?, ?, ?, ?, 1)`,
          args: [r.title, r.video_url, r.thumbnail_url, r.description, r.display_order],
        });
        inserted.reels++;
      }
    } catch { /* skip duplicates */ }
  }

  // Seed Clients (only if not already existing)
  for (const c of CLIENTS) {
    try {
      const exists = await db.execute({ sql: `SELECT id FROM clients WHERE name = ? LIMIT 1`, args: [c.name] });
      if (!exists.rows.length) {
        await db.execute({
          sql: `INSERT INTO clients (name, logo_url, display_order, published)
                VALUES (?, ?, ?, 1)`,
          args: [c.name, c.logo_url, c.display_order],
        });
        inserted.clients++;
      }
    } catch { /* skip duplicates */ }
  }

  // Seed Announcements (only if not already existing)
  for (const ann of ANNOUNCEMENTS) {
    try {
      const exists = await db.execute({ sql: `SELECT id FROM announcements WHERE title = ? LIMIT 1`, args: [ann.title] });
      if (!exists.rows.length) {
        await db.execute({
          sql: `INSERT INTO announcements (title, image_url, event_date, button_title, button_link, display_order, published)
                VALUES (?, ?, ?, ?, ?, ?, 1)`,
          args: [ann.title, ann.image_url, ann.event_date, ann.button_title || null, ann.button_link || null, ann.display_order],
        });
        inserted.announcements++;
      }
    } catch { /* skip duplicates */ }
  }

  return sendJson(res, 200, {
    ok: true,
    message: 'Seed complete.',
    inserted,
  });
}
