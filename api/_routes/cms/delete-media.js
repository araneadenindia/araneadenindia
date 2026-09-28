// api/cms/delete-media.js — POST /api/cms/delete-media
// Deletes a Cloudinary asset by public_id (server-side, API secret never exposed)
import crypto from 'crypto';
import { requireAuth, sendJson } from '../../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const admin = await requireAuth(req);
  if (!admin) return sendJson(res, 401, { error: 'Not authenticated.' });

  const { public_id, resource_type = 'image' } = req.body || {};
  if (!public_id) return sendJson(res, 400, { error: 'public_id is required.' });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return sendJson(res, 500, { error: 'Cloudinary configuration is missing.' });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha256').update(stringToSign).digest('hex');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resource_type}/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id, signature, api_key: apiKey, timestamp }),
      }
    );
    const data = await response.json();
    return sendJson(res, 200, { ok: true, result: data });
  } catch (err) {
    console.error('[delete-media]', err);
    return sendJson(res, 500, { error: 'Failed to delete media from Cloudinary.' });
  }
}
