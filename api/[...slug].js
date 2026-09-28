// api/[...slug].js — Master Vercel Serverless Function Dispatcher
// Consolidates all API routes into a single Serverless Function to comply with
// Vercel Hobby tier limits (max 12 serverless functions).
import setupHandler from './_routes/setup.js';
import loginHandler from './_routes/auth/login.js';
import logoutHandler from './_routes/auth/logout.js';
import meHandler from './_routes/auth/me.js';
import changePasswordHandler from './_routes/auth/change-password.js';

import websitesHandler from './_routes/cms/websites.js';
import websiteItemHandler from './_routes/cms/websites/[id].js';
import appsHandler from './_routes/cms/apps.js';
import appItemHandler from './_routes/cms/apps/[id].js';
import reelsHandler from './_routes/cms/reels.js';
import reelItemHandler from './_routes/cms/reels/[id].js';
import servicesHandler from './_routes/cms/services.js';
import serviceItemHandler from './_routes/cms/services/[id].js';
import clientsHandler from './_routes/cms/clients.js';
import clientItemHandler from './_routes/cms/clients/[id].js';
import announcementsHandler from './_routes/cms/announcements.js';
import announcementItemHandler from './_routes/cms/announcements/[id].js';

import uploadSigHandler from './_routes/cms/upload-signature.js';
import deleteMediaHandler from './_routes/cms/delete-media.js';
import seedHandler from './_routes/cms/seed.js';

export default async function handler(req, res) {
  // Extract path from req.url or req.query.slug
  let pathname = '';
  if (req.url) {
    try {
      const u = new URL(req.url, 'http://localhost');
      pathname = u.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    } catch {
      pathname = req.url.replace(/^\/api\/?/, '').split('?')[0].replace(/\/$/, '');
    }
  }

  // Fallback to req.query.slug if available
  if (!pathname && req.query?.slug) {
    const slug = req.query.slug;
    pathname = Array.isArray(slug) ? slug.join('/') : String(slug);
  }

  const parts = pathname.split('/').filter(Boolean);
  const route = parts.join('/');

  // Auth & Setup routes
  if (route === 'setup') return setupHandler(req, res);
  if (route === 'auth/login') return loginHandler(req, res);
  if (route === 'auth/logout') return logoutHandler(req, res);
  if (route === 'auth/me') return meHandler(req, res);
  if (route === 'auth/change-password') return changePasswordHandler(req, res);

  // Special CMS actions
  if (route === 'cms/upload-signature') return uploadSigHandler(req, res);
  if (route === 'cms/delete-media') return deleteMediaHandler(req, res);
  if (route === 'cms/seed') return seedHandler(req, res);

  // Collections: cms/:resource or cms/:resource/:id
  if (parts[0] === 'cms' && parts[1]) {
    const resource = parts[1];
    const id = parts[2];

    if (id) {
      req.query = req.query || {};
      req.query.id = id;
      if (resource === 'websites') return websiteItemHandler(req, res);
      if (resource === 'apps') return appItemHandler(req, res);
      if (resource === 'reels') return reelItemHandler(req, res);
      if (resource === 'services') return serviceItemHandler(req, res);
      if (resource === 'clients') return clientItemHandler(req, res);
      if (resource === 'announcements') return announcementItemHandler(req, res);
    } else {
      if (resource === 'websites') return websitesHandler(req, res);
      if (resource === 'apps') return appsHandler(req, res);
      if (resource === 'reels') return reelsHandler(req, res);
      if (resource === 'services') return servicesHandler(req, res);
      if (resource === 'clients') return clientsHandler(req, res);
      if (resource === 'announcements') return announcementsHandler(req, res);
    }
  }

  if (res.status) {
    return res.status(404).json({ ok: false, error: `Route /api/${route} not found` });
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ ok: false, error: `Route /api/${route} not found` }));
}
