// src/admin/pages/WebsitesCMS.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { websitesApi, CmsWebsite, uploadToCloudinary } from '../api';
import s from '../cms.module.css';

export const WebsitesCMS: React.FC = () => {
  const [items, setItems] = useState<CmsWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CmsWebsite | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await websitesApi.list();
      setItems(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    setTitle(''); setLiveUrl(''); setDescription('');
    setDisplayOrder(items.length + 1); setPublished(true);
    setThumbFile(null); setThumbPreview(''); setError('');
    setShowForm(true);
  };

  const openEdit = (item: CmsWebsite) => {
    setEditing(item);
    setTitle(item.title); setLiveUrl(item.live_url || '');
    setDescription(item.description || '');
    setDisplayOrder(item.display_order);
    setPublished(Boolean(item.published));
    setThumbFile(null); setThumbPreview(item.thumbnail_url || ''); setError('');
    setShowForm(true);
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');

    try {
      let thumb_url = editing?.thumbnail_url || null;
      let thumb_pid = editing?.thumbnail_public_id || null;

      if (thumbFile) {
        setUploading(true);
        const uploaded = await uploadToCloudinary(thumbFile, 'aranea-den/websites');
        thumb_url = uploaded.secure_url;
        thumb_pid = uploaded.public_id;
        setUploading(false);
      }

      const payload = {
        title: title.trim(),
        live_url: liveUrl.trim() || null,
        description: description.trim() || null,
        display_order: displayOrder,
        published,
        thumbnail_url: thumb_url,
        thumbnail_public_id: thumb_pid,
      };

      if (editing) {
        await websitesApi.update(editing.id, payload);
      } else {
        await websitesApi.create(payload);
      }

      await load();
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally { setSaving(false); setUploading(false); }
  };

  const togglePublish = async (item: CmsWebsite) => {
    await websitesApi.update(item.id, { published: !item.published });
    await load();
  };

  const handleDelete = async (item: CmsWebsite) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    await websitesApi.remove(item.id);
    await load();
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Websites</h1>
        <button className={s.addBtn} onClick={openNew}>+ ADD WEBSITE</button>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading…</div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>URL</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} className={s.emptyState}>No websites yet. Add your first one.</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.thumbnail_url
                      ? <img src={item.thumbnail_url} alt="" className={s.thumbPreview} />
                      : <div className={s.noThumb}>🌐</div>}
                  </td>
                  <td><strong>{item.title}</strong></td>
                  <td>
                    {item.live_url
                      ? <a href={item.live_url} target="_blank" rel="noopener noreferrer" style={{ color: '#DF2531', textDecoration: 'none', fontSize: 12 }}>
                          {item.live_url.replace(/^https?:\/\//, '')}
                        </a>
                      : '—'}
                  </td>
                  <td>{item.display_order}</td>
                  <td>
                    <span className={`${s.badge} ${item.published ? s.badgePublished : s.badgeDraft}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.actionBtn} onClick={() => openEdit(item)}>Edit</button>
                      <button className={`${s.actionBtn} ${s.actionBtnGreen}`} onClick={() => togglePublish(item)}>
                        {item.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className={`${s.actionBtn} ${s.actionBtnDanger}`} onClick={() => handleDelete(item)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className={s.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className={s.modal}>
            <h2 className={s.modalTitle}>{editing ? 'Edit Website' : 'Add Website'}</h2>
            {error && <div className={s.errorMsg}>{error}</div>}

            <form onSubmit={handleSave}>
              <div className={s.fieldGroup}>
                <label className={s.label}>Title *</label>
                <input className={s.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Meghana Builders" required />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Live URL</label>
                <input className={s.input} type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short project description…" />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Display Order</label>
                <input className={s.input} type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} min={0} />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Thumbnail</label>
                <div className={s.uploadArea}>
                  <input type="file" accept="image/*" onChange={handleThumbChange} />
                  <p className={s.uploadText}>Click to upload image</p>
                  <p className={s.uploadSubtext}>JPG, PNG, WebP — max 10MB</p>
                  {thumbPreview && <img src={thumbPreview} alt="Preview" className={s.previewImg} />}
                  {uploading && <p className={s.uploadProgress}>Uploading to Cloudinary…</p>}
                </div>
              </div>
              <div className={s.toggleRow}>
                <span className={s.toggleLabel}>Published</span>
                <label className={s.toggle}>
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                  <span className={s.toggleSlider} />
                </label>
              </div>
              <div className={s.formActions}>
                <button type="button" className={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={s.saveBtn} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
