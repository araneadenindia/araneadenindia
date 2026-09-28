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
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

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

  const removeThumb = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbFile(null);
    setThumbPreview('');
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
      let thumb_url = thumbPreview ? (editing?.thumbnail_url || null) : null;
      let thumb_pid = thumbPreview ? (editing?.thumbnail_public_id || null) : null;

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
        category: 'Applications',
        tags: 'iOS, Android, React Native',
        description: description.trim() || null,
        url: url.trim() || null,
        display_order: displayOrder,
        published,
        thumbnail_url: thumb_url,
        thumbnail_public_id: thumb_pid,
      };

      if (editing) {
        await appsApi.update(editing.id, payload);
        showToast(`Application "${name.trim()}" updated successfully.`);
      } else {
        await appsApi.create(payload);
        showToast(`Application "${name.trim()}" created successfully.`);
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

  const togglePublish = async (item: CmsApp) => {
    try {
      const next = !item.published;
      await appsApi.update(item.id, { published: next });
      showToast(`App marked as ${next ? 'Published' : 'Draft'}.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item: CmsApp) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await appsApi.remove(item.id);
      showToast(`Application "${item.name}" deleted.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.client && item.client.toLowerCase().includes(search.toLowerCase())) ||
      (item.platform && item.platform.toLowerCase().includes(search.toLowerCase()))
  );

  const publishedCount = items.filter((i) => i.published).length;

  return (
    <div className={s.page}>
      {toast && <div className={s.toast}>✓ {toast}</div>}

      <div className={s.pageHeader}>
        <div className={s.headerLeft}>
          <div className={s.titleRow}>
            <h1 className={s.pageTitle}>Apps</h1>
            <span className={s.countBadge}>
              {items.length} Total · {publishedCount} Live
            </span>
          </div>
          <p className={s.pageSubtitle}>
            Manage mobile, SaaS, and platform engineering projects for the apps portfolio.
          </p>
        </div>

        <div className={s.headerActions}>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search applications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={s.addBtn} onClick={openNew}>
            + Add Application
          </button>
        </div>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading applications…</div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Mockup</th>
                <th>App Name</th>
                <th>Client / Brand</th>
                <th>Platform</th>
                <th>Status</th>
                <th style={{ width: 70 }}>Order</th>
                <th style={{ width: 110 }}>Visibility</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={s.emptyState}>
                    {search ? `No apps matching "${search}".` : 'No applications added yet. Click "+ Add Application" to create one.'}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
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
                    {item.description && (
                      <div style={{ fontSize: 11.5, color: '#6A6B74', marginTop: 3 }}>
                        {item.description.slice(0, 50)}…
                      </div>
                    )}
                  </td>
                  <td>{item.client || <span style={{ color: '#9C9EA8' }}>Internal</span>}</td>
                  <td>
                    <span style={{ fontSize: 12, color: '#4B4C53' }}>{item.platform || 'iOS / Android'}</span>
                  </td>
                  <td>
                    <span className={s.statusTag}>{item.status || 'Production'}</span>
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
                      <button className={s.actionBtn} onClick={() => openEdit(item)} title="Edit app">
                        ✏️ Edit
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnGreen}`}
                        onClick={() => togglePublish(item)}
                        title={item.published ? 'Hide from portfolio' : 'Publish to portfolio'}
                      >
                        {item.published ? 'Hide' : 'Publish'}
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnDanger}`}
                        onClick={() => handleDelete(item)}
                        title="Delete app"
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
          <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="modal-app-title">
            {/* ── Fixed Header ── */}
            <div className={s.modalHeader}>
              <div>
                <h2 id="modal-app-title" className={s.modalTitle}>
                  {editing ? 'Edit Application' : 'Add Application'}
                </h2>
                <span className={s.modalSub}>ARANEA DEN MOBILE & PLATFORM SUITE</span>
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
                  <label className={s.label}>Application Name *</label>
                  <input
                    className={s.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ARANEA MOBILE OS"
                    required
                    autoFocus
                  />
                </div>

                <div className={s.gridTwo}>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>
                      Client / Brand <span className={s.labelOptional}>(Optional)</span>
                    </label>
                    <input
                      className={s.input}
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="e.g. Aranea Den Atelier"
                    />
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.label}>Platform / Framework</label>
                    <input
                      className={s.input}
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="e.g. iOS & Android (React Native)"
                    />
                  </div>
                </div>

                <div className={s.gridTwo}>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Status Tag</label>
                    <select
                      className={s.select}
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Production">Production</option>
                      <option value="In Development">In Development</option>
                      <option value="Beta">Beta Testing</option>
                      <option value="Concept">Concept</option>
                    </select>
                  </div>

                  <div className={s.fieldGroup}>
                    <label className={s.label}>
                      Store URL / Project Link <span className={s.labelOptional}>(Optional)</span>
                    </label>
                    <input
                      className={s.input}
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://apps.apple.com/... or /contact"
                    />
                  </div>
                </div>

                <div className={s.fieldGroup}>
                  <label className={s.label}>
                    Description <span className={s.labelOptional}>(Architecture, Features)</span>
                  </label>
                  <textarea
                    className={s.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="App architecture, functionality, performance highlights, and stack…"
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
                    App Mockup / Screenshot <span className={s.labelOptional}>(PNG or WebP)</span>
                  </label>
                  <div className={s.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbChange}
                      title="Click or drag mockup to upload"
                    />
                    <span className={s.uploadIcon}>📱</span>
                    <p className={s.uploadText}>
                      {thumbPreview ? 'Click or drop to replace mockup' : 'Click or drop app mockup screenshot here'}
                    </p>
                    <p className={s.uploadSubtext}>Mobile mockup 9:19.5 or 16:9 — max 10MB</p>

                    {thumbPreview && (
                      <div className={s.previewWrap} onClick={(e) => e.stopPropagation()}>
                        <img src={thumbPreview} alt="App mockup preview" className={s.previewImg} />
                        <button
                          type="button"
                          className={s.removeThumbBtn}
                          onClick={removeThumb}
                          title="Remove mockup"
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
                    '+ Add Application'
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
