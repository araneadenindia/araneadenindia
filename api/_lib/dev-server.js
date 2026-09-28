// api/_lib/dev-server.js
// Local development middleware for Vite to route /api/* requests to serverless handlers
import fs from 'fs';
import path from 'path';

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0 && !process.env[key.trim()]) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  }
} catch (e) {
  console.warn('[dev-server] could not read .env.local:', e.message);
}

// Fallback defaults for dev
if (!process.env.TURSO_DATABASE_URL) process.env.TURSO_DATABASE_URL = 'file:local.db';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'araneaden-jwt-dev-secret-key-2026';
if (!process.env.ADMIN_INITIAL_PASSWORD) process.env.ADMIN_INITIAL_PASSWORD = 'araneaden@2026admin';

export async function handleApiRequest(req, res, next) {
  const urlObj = new URL(req.url, 'http://localhost:3000');
  const pathname = urlObj.pathname.replace(/\/$/, ''); // strip trailing slash

  if (!pathname.startsWith('/api')) {
    return next();
  }

  // Decorate response with Express/Vercel-like helpers
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  res.json = function (data) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(data));
  };

  // Parse query params into req.query
  req.query = Object.fromEntries(urlObj.searchParams.entries());

  // Buffer request body
  const bodyChunks = [];
  for await (const chunk of req) {
    bodyChunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(bodyChunks).toString('utf8');
  if (rawBody) {
    try {
      req.body = JSON.parse(rawBody);
    } catch {
      req.body = rawBody;
    }
  } else {
    req.body = {};
  }

  // Map pathname to route handler file
  let handlerPath = null;
  const basePath = path.resolve(process.cwd(), 'api');

  // Direct matches
  if (pathname === '/api/setup') {
    handlerPath = path.join(basePath, 'setup.js');
  } else if (pathname === '/api/auth/login') {
    handlerPath = path.join(basePath, 'auth', 'login.js');
  } else if (pathname === '/api/auth/logout') {
    handlerPath = path.join(basePath, 'auth', 'logout.js');
  } else if (pathname === '/api/auth/me') {
    handlerPath = path.join(basePath, 'auth', 'me.js');
  } else if (pathname === '/api/auth/change-password') {
    handlerPath = path.join(basePath, 'auth', 'change-password.js');
  } else if (pathname === '/api/cms/upload-signature') {
    handlerPath = path.join(basePath, 'cms', 'upload-signature.js');
  } else if (pathname === '/api/cms/delete-media') {
    handlerPath = path.join(basePath, 'cms', 'delete-media.js');
  } else if (pathname === '/api/cms/seed') {
    handlerPath = path.join(basePath, 'cms', 'seed.js');
  } else {
    // Dynamic matching for cms collections: /api/cms/:resource or /api/cms/:resource/:id
    const parts = pathname.replace('/api/cms/', '').split('/');
    const resource = parts[0];
    const id = parts[1];

    if (resource && id) {
      handlerPath = path.join(basePath, 'cms', resource, '[id].js');
      req.query.id = id;
    } else if (resource) {
      handlerPath = path.join(basePath, 'cms', `${resource}.js`);
    }
  }

  if (handlerPath && fs.existsSync(handlerPath)) {
    try {
      // Dynamic import with file URL and cache-busting query for instant reload
      const fileUrl = new URL(`file://${handlerPath.replace(/\\/g, '/')}`).href;
      const mod = await import(`${fileUrl}?t=${Date.now()}`);
      const handler = mod.default || mod;
      await handler(req, res);
    } catch (err) {
      console.error(`[dev-server] Error handling ${pathname}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ ok: false, error: err.message });
      }
    }
  } else {
    console.warn(`[dev-server] No handler found for ${pathname} (mapped to: ${handlerPath})`);
    res.status(404).json({ ok: false, error: `Route ${pathname} not found` });
  }
}
