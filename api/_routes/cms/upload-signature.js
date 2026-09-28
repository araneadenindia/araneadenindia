// api/cms/upload-signature.js — POST /api/cms/upload-signature
// Returns a signed Cloudinary upload signature so the browser can upload directly
// to Cloudinary without exposing the API secret in frontend code.
import crypto from 'crypto';
import { requireAuth, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const admin = await requireAuth(req);
  if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return sendJson(res, 500, { error: 'Cloudinary configuration is missing.' });
  }

  const { folder = 'aranea-den', resource_type = 'image' } = req.body || {};
  const timestamp = Math.round(Date.now() / 1000);

  // Parameters to sign — must match what the browser sends
  const paramsToSign = {
    folder,
    timestamp,
  };

  // Build the string to sign: alphabetically sorted key=value pairs joined by &
  const stringToSign = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join('&');

  const signature = crypto
    .createHash('sha256')
    .update(stringToSign + apiSecret)
    .digest('hex');

  return sendJson(res, 200, {
    ok: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    resource_type,
  });
}
