// src/admin/pages/ReelsCMS.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { reelsApi, CmsReel, uploadToCloudinary } from '../api';
import s from '../cms.module.css';

export const ReelsCMS: React.FC = () => {
  const [items, setItems] = useState<CmsReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CmsReel | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try { const res = await reelsApi.list(); setItems(res.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null); setTitle(''); setDescription('');
    setDisplayOrder(items.length + 1); setPublished(true);
    setThumbFile(null); setThumbPreview(''); setVideoFile(null); setVideoName(''); setError('');
    setShowForm(true);
  };

  const openEdit = (item: CmsReel) => {
    setEditing(item); setTitle(item.title); setDescription(item.description || '');
    setDisplayOrder(item.display_order); setPublished(Boolean(item.published));
    setThumbFile(null); setThumbPreview(item.thumbnail_url || '');
    setVideoFile(null); setVideoName(item.video_url ? 'Existing video' : ''); setError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');

    try {
      let thumb_url = editing?.thumbnail_url || null;
      let thumb_pid = editing?.thumbnail_public_id || null;
      let video_url = editing?.video_url || null;
      let video_pid = editing?.video_public_id || null;

      setUploading(true);
      if (thumbFile) {
        const u = await uploadToCloudinary(thumbFile, 'aranea-den/reels/thumbs', 'image');
        thumb_url = u.secure_url; thumb_pid = u.public_id;
      }
      if (videoFile) {
        const u = await uploadToCloudinary(videoFile, 'aranea-den/reels/videos', 'video');
        video_url = u.secure_url; video_pid = u.public_id;
      }
      setUploading(false);

      const payload = {
        title: title.trim(), description: description.trim() || null,
        display_order: displayOrder, published,
        thumbnail_url: thumb_url, thumbnail_public_id: thumb_pid,
        video_url, video_public_id: video_pid,
      };

      if (editing) await reelsApi.update(editing.id, payload);
      else await reelsApi.create(payload);

      await load(); setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally { setSaving(false); setUploading(false); }
  };

  const togglePublish = async (item: CmsReel) => { await reelsApi.update(item.id, { published: !item.published }); await load(); };
  const handleDelete = async (item: CmsReel) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await reelsApi.remove(item.id); await load();
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Reels</h1>
        <button className={s.addBtn} onClick={openNew}>+ ADD REEL</button>
      </div>

      {loading ? <div className={s.emptyState}>Loading…</div> : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead><tr><th>Thumb</th><th>Title</th><th>Video</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className={s.emptyState}>No reels yet.</td></tr>}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.thumbnail_url ? <img src={item.thumbnail_url} alt="" className={s.thumbPreview} /> : <div className={s.noThumb}>🎬</div>}</td>
                  <td><strong>{item.title}</strong><br /><span style={{ fontSize: 11, color: '#73747A' }}>{item.description?.slice(0, 60)}</span></td>
                  <td><span style={{ fontSize: 12, color: item.video_url ? '#15803D' : '#73747A' }}>{item.video_url ? '✓ Video uploaded' : 'No video'}</span></td>
                  <td>{item.display_order}</td>
                  <td><span className={`${s.badge} ${item.published ? s.badgePublished : s.badgeDraft}`}>{item.published ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.actionBtn} onClick={() => openEdit(item)}>Edit</button>
                      <button className={`${s.actionBtn} ${s.actionBtnGreen}`} onClick={() => togglePublish(item)}>{item.published ? 'Unpublish' : 'Publish'}</button>
                      <button className={`${s.actionBtn} ${s.actionBtnDanger}`} onClick={() => handleDelete(item)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className={s.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className={s.modal}>
            <h2 className={s.modalTitle}>{editing ? 'Edit Reel' : 'Add Reel'}</h2>
            {error && <div className={s.errorMsg}>{error}</div>}
            {uploading && <div className={s.successMsg}>Uploading to Cloudinary… please wait.</div>}

            <form onSubmit={handleSave}>
              <div className={s.fieldGroup}>
                <label className={s.label}>Title *</label>
                <input className={s.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Startup Potluck Reel" required />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short reel description…" />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Display Order</label>
                <input className={s.input} type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} min={0} />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Thumbnail Image</label>
                <div className={s.uploadArea}>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setThumbFile(f); setThumbPreview(URL.createObjectURL(f)); }}} />
                  <p className={s.uploadText}>Click to upload thumbnail</p>
                  {thumbPreview && <img src={thumbPreview} alt="" className={s.previewImg} />}
                </div>
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Video File (MP4)</label>
                <div className={s.uploadArea}>
                  <input type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setVideoFile(f); setVideoName(f.name); }}} />
                  <p className={s.uploadText}>Click to upload video</p>
                  {videoName && <p className={s.uploadProgress}>{videoName}</p>}
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
                <button type="submit" className={s.saveBtn} disabled={saving || uploading}>
                  {uploading ? 'Uploading…' : saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
