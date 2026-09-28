// src/admin/pages/AppsCMS.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { appsApi, CmsApp, uploadToCloudinary } from '../api';
import s from '../cms.module.css';

export const AppsCMS: React.FC = () => {
  const [items, setItems] = useState<CmsApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CmsApp | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [platform, setPlatform] = useState('iOS & Android');
  const [status, setStatus] = useState('Production');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await appsApi.list();
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setName('');
    setClient('');
    setPlatform('iOS & Android');
    setStatus('Production');
    setUrl('');
    setDescription('');
    setDisplayOrder(items.length + 1);
    setPublished(true);
    setThumbFile(null);
    setThumbPreview('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: CmsApp) => {
    setEditing(item);
    setName(item.name);
    setClient(item.client || '');
    setPlatform(item.platform || 'iOS & Android');
    setStatus(item.status || 'Production');
    setUrl(item.url || '');
    setDescription(item.description || '');
    setDisplayOrder(item.display_order);
    setPublished(Boolean(item.published));
    setThumbFile(null);
    setThumbPreview(item.thumbnail_url || '');
    setError('');
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
    if (!name.trim()) {
      setError('App name is required.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      let thumb_url = editing?.thumbnail_url || null;
      let thumb_pid = editing?.thumbnail_public_id || null;

      if (thumbFile) {
        setUploading(true);
        const uploaded = await uploadToCloudinary(thumbFile, 'aranea-den/apps');
        thumb_url = uploaded.secure_url;
        thumb_pid = uploaded.public_id;
        setUploading(false);
      }

      const payload = {
        name: name.trim(),
        client: client.trim() || null,
        platform: platform.trim() || 'iOS & Android',
        status: status.trim() || 'Production',
        url: url.trim() || null,
        description: description.trim() || null,
        display_order: displayOrder,
        published,
        thumbnail_url: thumb_url,
        thumbnail_public_id: thumb_pid,
      };

      if (editing) {
        await appsApi.update(editing.id, payload);
      } else {
        await appsApi.create(payload);
      }

      await load();
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const togglePublish = async (item: CmsApp) => {
    await appsApi.update(item.id, { published: !item.published });
    await load();
  };

  const handleDelete = async (item: CmsApp) => {
    if (!confirm(`Delete app "${item.name}"? This cannot be undone.`)) return;
    await appsApi.remove(item.id);
    await load();
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Applications</h1>
          <p className={s.pageSubtitle}>Manage mobile applications, SaaS products, and app store showcases.</p>
        </div>
        <button className={s.addBtn} onClick={openNew}>+ ADD APPLICATION</button>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading applications…</div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Preview</th>
                <th>Application</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Order</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className={s.emptyState}>
                    No applications listed yet. Click "+ ADD APPLICATION" to create one.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt="" className={s.thumbPreview} />
                    ) : (
                      <div className={s.noThumb}>📱</div>
                    )}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.client && <div style={{ fontSize: 11, color: '#73747A' }}>{item.client}</div>}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: '#424348' }}>{item.platform || 'iOS / Android'}</span>
                  </td>
                  <td>
                    <span className={s.statusTag}>{item.status || 'Production'}</span>
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
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>{editing ? 'Edit Application' : 'Add Application'}</h2>
              <button type="button" className={s.closeModalBtn} onClick={() => setShowForm(false)}>×</button>
            </div>
            {error && <div className={s.errorMsg}>{error}</div>}

            <form onSubmit={handleSave}>
              <div className={s.fieldGroup}>
                <label className={s.label}>Application Name *</label>
                <input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ARANEA MOBILE OS" required />
              </div>

              <div className={s.gridTwo}>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Client / Brand</label>
                  <input className={s.input} value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Aranea Den Atelier" />
                </div>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Platform</label>
                  <input className={s.input} value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. iOS / React Native" />
                </div>
              </div>

              <div className={s.gridTwo}>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Status Tag</label>
                  <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Production">Production</option>
                    <option value="In Development">In Development</option>
                    <option value="Beta">Beta Testing</option>
                    <option value="Concept">Concept</option>
                  </select>
                </div>
                <div className={s.fieldGroup}>
                  <label className={s.label}>App Link / URL</label>
                  <input className={s.input} type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://apps.apple.com/... or /services/mobile-development" />
                </div>
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="App architecture, functionality, and stack highlights…" />
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label}>Display Order</label>
                <input className={s.input} type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} min={0} />
              </div>

              <div className={s.fieldGroup}>
                <label className={s.label}>App Screenshot / Mockup</label>
                <div className={s.uploadArea}>
                  <input type="file" accept="image/*" onChange={handleThumbChange} />
                  <p className={s.uploadText}>Drop app screenshot here or click to browse</p>
                  <p className={s.uploadSubtext}>Mobile mockup PNG, WebP, JPG — 9:19.5 or 16:9 ratio</p>
                  {thumbPreview && <img src={thumbPreview} alt="Preview" className={s.previewImg} />}
                  {uploading && <p className={s.uploadProgress}>Uploading image…</p>}
                </div>
              </div>

              <div className={s.toggleRow}>
                <span className={s.toggleLabel}>Published on Portfolio</span>
                <label className={s.toggle}>
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                  <span className={s.toggleSlider} />
                </label>
              </div>

              <div className={s.formActions}>
                <button type="button" className={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={s.saveBtn} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
