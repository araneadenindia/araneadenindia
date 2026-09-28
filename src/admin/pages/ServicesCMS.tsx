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
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    try {
      const res = await servicesApi.list();
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

  // Keyboard shortcut to close modal on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  const openNew = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setDisplayOrder(items.length + 1);
    setPublished(true);
    setThumbFile(null);
    setThumbPreview('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: CmsService) => {
    setEditing(item);
    setName(item.name);
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

  const removeThumb = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbFile(null);
    setThumbPreview('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Service name is required.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      let thumb_url = thumbPreview ? (editing?.thumbnail_url || null) : null;
      let thumb_pid = thumbPreview ? (editing?.thumbnail_public_id || null) : null;

      if (thumbFile) {
        setUploading(true);
        const u = await uploadToCloudinary(thumbFile, 'aranea-den/services', 'image');
        thumb_url = u.secure_url;
        thumb_pid = u.public_id;
        setUploading(false);
      }

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        display_order: displayOrder,
        published,
        thumbnail_url: thumb_url,
        thumbnail_public_id: thumb_pid,
      };

      if (editing) {
        await servicesApi.update(editing.id, payload);
        showToast(`Service "${name.trim()}" updated.`);
      } else {
        await servicesApi.create(payload);
        showToast(`Service "${name.trim()}" created successfully.`);
      }

      await load();
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed. Please retry.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const togglePublish = async (item: CmsService) => {
    try {
      const next = !item.published;
      await servicesApi.update(item.id, { published: next });
      showToast(`Service marked as ${next ? 'Published' : 'Draft'}.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item: CmsService) => {
    if (!confirm(`Delete service "${item.name}"? This cannot be undone.`)) return;
    try {
      await servicesApi.remove(item.id);
      showToast(`Service "${item.name}" deleted.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
  );

  const publishedCount = items.filter((i) => i.published).length;

  return (
    <div className={s.page}>
      {toast && <div className={s.toast}>✓ {toast}</div>}

      <div className={s.pageHeader}>
        <div className={s.headerLeft}>
          <div className={s.titleRow}>
            <h1 className={s.pageTitle}>Services</h1>
            <span className={s.countBadge}>
              {items.length} Total · {publishedCount} Live
            </span>
          </div>
          <p className={s.pageSubtitle}>
            Manage capabilities and digital solutions showcased on the ARANEA DEN Services page.
          </p>
        </div>

        <div className={s.headerActions}>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search services…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={s.addBtn} onClick={openNew}>
            + Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading services…</div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Icon</th>
                <th>Service Name</th>
                <th>Description</th>
                <th style={{ width: 70 }}>Order</th>
                <th style={{ width: 110 }}>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={s.emptyState}>
                    {search ? `No services matching "${search}".` : 'No services added yet. Click "+ Add Service" to create one.'}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt="" className={s.thumbPreview} />
                    ) : (
                      <div className={s.noThumb}>⚡</div>
                    )}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, color: '#6A6B74' }}>
                      {item.description ? item.description.slice(0, 80) + '…' : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{item.display_order}</span>
                  </td>
                  <td>
                    <span className={`${s.badge} ${item.published ? s.badgePublished : s.badgeDraft}`}>
                      {item.published ? '● Live' : '○ Draft'}
                    </span>
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.actionBtn} onClick={() => openEdit(item)} title="Edit service">
                        ✏️ Edit
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnGreen}`}
                        onClick={() => togglePublish(item)}
                        title={item.published ? 'Hide service' : 'Publish service'}
                      >
                        {item.published ? 'Hide' : 'Publish'}
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnDanger}`}
                        onClick={() => handleDelete(item)}
                        title="Delete service"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ROCK-SOLID RESPONSIVE MODAL ── */}
      {showForm && (
        <div
          className={s.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="modal-service-title">
            {/* ── Fixed Header ── */}
            <div className={s.modalHeader}>
              <div>
                <h2 id="modal-service-title" className={s.modalTitle}>
                  {editing ? 'Edit Service' : 'Add Service'}
                </h2>
                <span className={s.modalSub}>ARANEA DEN SERVICES & CAPABILITIES</span>
              </div>
              <button
                type="button"
                className={s.closeModalBtn}
                onClick={() => setShowForm(false)}
                title="Close modal (Esc)"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* ── Form with scrollable body & fixed footer ── */}
            <form onSubmit={handleSave} className={s.modalForm}>
              <div className={s.modalBody}>
                {error && (
                  <div className={s.errorMsg}>
                    <span>⚠️ {error}</span>
                    <button type="button" onClick={() => setError('')} className={s.errorDismiss}>✕</button>
                  </div>
                )}

                <div className={s.fieldGroup}>
                  <label className={s.label}>Service Name *</label>
                  <input
                    className={s.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Web Development & UI/UX"
                    required
                    autoFocus
                  />
                </div>

                <div className={s.fieldGroup}>
                  <label className={s.label}>
                    Description <span className={s.labelOptional}>(Capabilities & Scope)</span>
                  </label>
                  <textarea
                    className={s.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how Aranea Den delivers this service, deliverables, and architecture…"
                  />
                </div>

                <div className={s.gridTwo}>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Display Order</label>
                    <input
                      className={s.input}
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.label}>Visibility</label>
                    <div
                      className={s.toggleRow}
                      onClick={() => setPublished(!published)}
                      role="checkbox"
                      aria-checked={published}
                      style={{ margin: 0, height: 44, boxSizing: 'border-box' }}
                    >
                      <span className={s.toggleLabel}>
                        {published ? 'Published (Live)' : 'Draft (Hidden)'}
                      </span>
                      <span className={s.toggle}>
                        <input
                          type="checkbox"
                          checked={published}
                          onChange={(e) => setPublished(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className={s.toggleSlider} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className={s.fieldGroup}>
                  <label className={s.label}>
                    Service Visual / Icon <span className={s.labelOptional}>(Optional)</span>
                  </label>
                  <div className={s.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbChange}
                      title="Upload service image"
                    />
                    <span className={s.uploadIcon}>⚡</span>
                    <p className={s.uploadText}>
                      {thumbPreview ? 'Click or drop to replace image' : 'Click or drop service visual here'}
                    </p>
                    <p className={s.uploadSubtext}>PNG, JPG, SVG, WebP — max 10MB</p>

                    {thumbPreview && (
                      <div className={s.previewWrap} onClick={(e) => e.stopPropagation()}>
                        <img src={thumbPreview} alt="Service preview" className={s.previewImg} />
                        <button
                          type="button"
                          className={s.removeThumbBtn}
                          onClick={removeThumb}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {uploading && (
                      <div className={s.uploadProgress}>
                        <span className={s.btnSpinner} style={{ borderTopColor: '#DF2531' }} />
                        Uploading image…
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Fixed / Sticky Footer (ALWAYS VISIBLE & 100% CLICKABLE!) ── */}
              <div className={s.modalFooter}>
                <button
                  type="button"
                  className={s.cancelBtn}
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={s.saveBtn}
                  disabled={saving || uploading}
                >
                  {uploading ? (
                    <>
                      <span className={s.btnSpinner} />
                      Uploading…
                    </>
                  ) : saving ? (
                    <>
                      <span className={s.btnSpinner} />
                      Saving…
                    </>
                  ) : editing ? (
                    'Save Changes'
                  ) : (
                    '+ Add Service'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
