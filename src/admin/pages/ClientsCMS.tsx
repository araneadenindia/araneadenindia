// src/admin/pages/ClientsCMS.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { clientsApi, CmsClient, uploadToCloudinary } from '../api';
import s from '../cms.module.css';

export const ClientsCMS: React.FC = () => {
  const [items, setItems] = useState<CmsClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CmsClient | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try { const res = await clientsApi.list(); setItems(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null); setName(''); setWebsiteUrl(''); setDescription('');
    setDisplayOrder(items.length + 1); setPublished(true);
    setLogoFile(null); setLogoPreview(''); setError(''); setShowForm(true);
  };

  const openEdit = (item: CmsClient) => {
    setEditing(item); setName(item.name); setWebsiteUrl(item.website_url || '');
    setDescription(item.description || ''); setDisplayOrder(item.display_order);
    setPublished(Boolean(item.published));
    setLogoFile(null); setLogoPreview(item.logo_url || ''); setError(''); setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Client name is required.'); return; }
    setSaving(true); setError('');

    try {
      let logo_url = editing?.logo_url || null;
      let logo_pid = editing?.logo_public_id || null;

      if (logoFile) {
        setUploading(true);
        const u = await uploadToCloudinary(logoFile, 'aranea-den/clients', 'image');
        logo_url = u.secure_url; logo_pid = u.public_id;
        setUploading(false);
      }

      const payload = { name: name.trim(), website_url: websiteUrl.trim() || null, description: description.trim() || null, display_order: displayOrder, published, logo_url, logo_public_id: logo_pid };

      if (editing) await clientsApi.update(editing.id, payload);
      else await clientsApi.create(payload);

      await load(); setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally { setSaving(false); setUploading(false); }
  };

  const togglePublish = async (item: CmsClient) => { await clientsApi.update(item.id, { published: !item.published }); await load(); };
  const handleDelete = async (item: CmsClient) => {
    if (!confirm(`Delete client "${item.name}"?`)) return;
    await clientsApi.remove(item.id); await load();
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Clients</h1>
        <button className={s.addBtn} onClick={openNew}>+ ADD CLIENT</button>
      </div>

      {loading ? <div className={s.emptyState}>Loading…</div> : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead><tr><th>Logo</th><th>Client Name</th><th>Website</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan={6} className={s.emptyState}>No clients yet.</td></tr>}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.logo_url ? <img src={item.logo_url} alt="" className={s.thumbPreview} style={{ objectFit: 'contain', background: '#fff' }} /> : <div className={s.noThumb}>🏢</div>}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.website_url ? <a href={item.website_url} target="_blank" rel="noopener noreferrer" style={{ color: '#DF2531', fontSize: 12, textDecoration: 'none' }}>{item.website_url.replace(/^https?:\/\//, '')}</a> : '—'}</td>
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
            <h2 className={s.modalTitle}>{editing ? 'Edit Client' : 'Add Client'}</h2>
            {error && <div className={s.errorMsg}>{error}</div>}
            <form onSubmit={handleSave}>
              <div className={s.fieldGroup}>
                <label className={s.label}>Client Name *</label>
                <input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Meghana Builders" required />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Client Website URL</label>
                <input className={s.input} type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the client…" />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Display Order</label>
                <input className={s.input} type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} min={0} />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Client Logo</label>
                <div className={s.uploadArea}>
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}} />
                  <p className={s.uploadText}>Click to upload logo</p>
                  <p className={s.uploadSubtext}>PNG, SVG, WebP recommended</p>
                  {logoPreview && <img src={logoPreview} alt="" className={s.previewImg} style={{ objectFit: 'contain' }} />}
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
                <button type="submit" className={s.saveBtn} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
