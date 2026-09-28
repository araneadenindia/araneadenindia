// src/admin/api.ts
// Lightweight fetch wrapper for all CMS API calls

const BASE = '/api';

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned unexpected response (${res.status}): ${text.slice(0, 100)}`);
  }

  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ ok: boolean; mustChangePassword: boolean }>('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout', {}),
  me: () => api.get<{ ok: boolean; username: string; mustChangePassword: boolean }>('/auth/me'),
  changePassword: (newPassword: string) =>
    api.post('/auth/change-password', { newPassword }),
};

// ── CMS Entities ──────────────────────────────────────────────
export type CmsWebsite = {
  id: number; title: string; thumbnail_url: string | null;
  thumbnail_public_id: string | null; live_url: string | null;
  description: string | null; display_order: number; published: number | boolean;
  created_at: string; updated_at: string;
};

export type CmsReel = {
  id: number; title: string; video_url: string | null; video_public_id: string | null;
  thumbnail_url: string | null; thumbnail_public_id: string | null;
  description: string | null; display_order: number; published: number | boolean;
  created_at: string; updated_at: string;
};

export type CmsService = {
  id: number; name: string; description: string | null;
  thumbnail_url: string | null; thumbnail_public_id: string | null;
  display_order: number; published: number | boolean; created_at: string; updated_at: string;
};

export type CmsClient = {
  id: number; name: string; logo_url: string | null; logo_public_id: string | null;
  website_url: string | null; description: string | null;
  display_order: number; published: number | boolean; created_at: string; updated_at: string;
};

export type CmsApp = {
  id: number; name: string; client: string | null; platform: string | null;
  category: string | null; description: string | null; tags: string | null;
  thumbnail_url: string | null; thumbnail_public_id: string | null;
  url: string | null; year: string | null; status: string | null;
  display_order: number; published: number | boolean;
  created_at: string; updated_at: string;
};

type ListResponse<T> = { ok: boolean; data: T[] };
type ItemResponse<T> = { ok: boolean; data: T };

export const websitesApi = {
  list: () => api.get<ListResponse<CmsWebsite>>('/cms/websites'),
  create: (data: Partial<CmsWebsite>) => api.post<ItemResponse<CmsWebsite>>('/cms/websites', data),
  update: (id: number, data: Partial<CmsWebsite>) => api.put<ItemResponse<CmsWebsite>>(`/cms/websites/${id}`, data),
  remove: (id: number) => api.delete(`/cms/websites/${id}`),
};

export const appsApi = {
  list: () => api.get<ListResponse<CmsApp>>('/cms/apps'),
  create: (data: Partial<CmsApp>) => api.post<ItemResponse<CmsApp>>('/cms/apps', data),
  update: (id: number, data: Partial<CmsApp>) => api.put<ItemResponse<CmsApp>>(`/cms/apps/${id}`, data),
  remove: (id: number) => api.delete(`/cms/apps/${id}`),
};

export const reelsApi = {
  list: () => api.get<ListResponse<CmsReel>>('/cms/reels'),
  create: (data: Partial<CmsReel>) => api.post<ItemResponse<CmsReel>>('/cms/reels', data),
  update: (id: number, data: Partial<CmsReel>) => api.put<ItemResponse<CmsReel>>(`/cms/reels/${id}`, data),
  remove: (id: number) => api.delete(`/cms/reels/${id}`),
};

export const servicesApi = {
  list: () => api.get<ListResponse<CmsService>>('/cms/services'),
  create: (data: Partial<CmsService>) => api.post<ItemResponse<CmsService>>('/cms/services', data),
  update: (id: number, data: Partial<CmsService>) => api.put<ItemResponse<CmsService>>(`/cms/services/${id}`, data),
  remove: (id: number) => api.delete(`/cms/services/${id}`),
};

export const clientsApi = {
  list: () => api.get<ListResponse<CmsClient>>('/cms/clients'),
  create: (data: Partial<CmsClient>) => api.post<ItemResponse<CmsClient>>('/cms/clients', data),
  update: (id: number, data: Partial<CmsClient>) => api.put<ItemResponse<CmsClient>>(`/cms/clients/${id}`, data),
  remove: (id: number) => api.delete(`/cms/clients/${id}`),
};

export type CmsAnnouncement = {
  id: number; title: string; image_url: string | null; image_public_id: string | null;
  event_date: string | null; display_order: number; published: number | boolean;
  created_at: string; updated_at: string;
};

export const announcementsApi = {
  list: () => api.get<ListResponse<CmsAnnouncement>>('/cms/announcements'),
  create: (data: Partial<CmsAnnouncement>) => api.post<ItemResponse<CmsAnnouncement>>('/cms/announcements', data),
  update: (id: number, data: Partial<CmsAnnouncement>) => api.put<ItemResponse<CmsAnnouncement>>(`/cms/announcements/${id}`, data),
  remove: (id: number) => api.delete(`/cms/announcements/${id}`),
};


// ── Resilient Cloudinary & Data URL Upload Helper ─────────────
export async function uploadToCloudinary(
  file: File,
  folder: string = 'aranea-den',
  resourceType: 'image' | 'video' = 'image'
): Promise<{ secure_url: string; public_id: string }> {
  try {
    const sigData = await api.post<{
      ok: boolean; signature: string; timestamp: number;
      apiKey: string; cloudName: string; folder: string; resource_type: string;
    }>('/cms/upload-signature', { folder, resource_type: resourceType });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', String(sigData.timestamp));
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    if (res.ok && data.secure_url) {
      return { secure_url: data.secure_url, public_id: data.public_id };
    }

    // If Cloudinary rejected the request (e.g. invalid cloud name), convert images to local Data URL
    if (resourceType === 'image') {
      const dataUrl = await fileToDataUrl(file);
      return { secure_url: dataUrl, public_id: 'data_uri_' + Date.now() };
    }

    throw new Error(data.error?.message || 'Cloudinary upload failed');
  } catch (err: any) {
    if (resourceType === 'image') {
      const dataUrl = await fileToDataUrl(file);
      return { secure_url: dataUrl, public_id: 'data_uri_' + Date.now() };
    }
    throw err;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
