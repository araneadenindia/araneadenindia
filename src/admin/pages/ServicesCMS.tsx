// src/admin/pages/ServicesCMS.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { servicesApi, CmsService, uploadToCloudinary } from '../api';
import s from '../cms.module.css';

export const ServicesCMS: React.FC = () => {
  const [items, setItems] = useState<CmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CmsService | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try { const res = await servicesApi.list(); setItems(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null); setName(''); setDescription('');
    setDisplayOrder(items.length + 1); setPublished(true);
    setThumbFile(null); setThumbPreview(''); setError(''); setShowForm(true);
  };

  const openEdit = (item: CmsService) => {
    setEditing(item); setName(item.name); setDescription(item.description || '');
    setDisplayOrder(item.display_order); setPublished(Boolean(item.published));
    setThumbFile(null); setThumbPreview(item.thumbnail_url || ''); setError(''); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Service name is required.'); return; }
    setSaving(true); setError('');

    try {
      let thumb_url = editing?.thumbnail_url || null;
      let thumb_pid = editing?.thumbnail_public_id || null;

      if (thumbFile) {
        setUploading(true);
        const u = await uploadToCloudinary(thumbFile, 'aranea-den/services', 'image');
        thumb_url = u.secure_url; thumb_pid = u.public_id;
        setUploading(false);
      }

      const payload = { name: name.trim(), description: description.trim() || null, display_order: displayOrder, published, thumbnail_url: thumb_url, thumbnail_public_id: thumb_pid };

      if (editing) await servicesApi.update(editing.id, payload);
      else await servicesApi.create(payload);

      await load(); setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally { setSaving(false); setUploading(false); }
  };

  const togglePublish = async (item: CmsService) => { await servicesApi.update(item.id, { published: !item.published }); await load(); };
  const handleDelete = async (item: CmsService) => {
    if (!confirm(`Delete service "${item.name}"?`)) return;
    await servicesApi.remove(item.id); await load();
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Services</h1>
        <button className={s.addBtn} onClick={openNew}>+ ADD SERVICE</button>
      </div>

      {loading ? <div className={s.emptyState}>Loading…</div> : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead><tr><th>Image</th><th>Name</th><th>Description</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className={s.emptyState}>No services yet.</td></tr>}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.thumbnail_url ? <img src={item.thumbnail_url} alt="" className={s.thumbPreview} /> : <div className={s.noThumb}>⚙️</div>}</td>
                  <td><strong>{item.name}</strong></td>
                  <td style={{ fontSize: 12, color: '#73747A', maxWidth: 200 }}>{item.description?.slice(0, 70) || '—'}</td>
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
            <h2 className={s.modalTitle}>{editing ? 'Edit Service' : 'Add Service'}</h2>
            {error && <div className={s.errorMsg}>{error}</div>}
            <form onSubmit={handleSave}>
              <div className={s.fieldGroup}>
                <label className={s.label}>Service Name *</label>
                <input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Web Development" required />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the service…" />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Display Order</label>
                <input className={s.input} type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} min={0} />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Service Image</label>
                <div className={s.uploadArea}>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setThumbFile(f); setThumbPreview(URL.createObjectURL(f)); }}} />
                  <p className={s.uploadText}>Click to upload image</p>
                  {thumbPreview && <img src={thumbPreview} alt="" className={s.previewImg} />}
                  {uploading && <p className={s.uploadProgress}>Uploading…</p>}
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
                <button type="submit" className={s.saveBtn} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
