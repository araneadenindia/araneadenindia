// src/admin/pages/AnnouncementsCMS.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { announcementsApi, CmsAnnouncement, uploadToCloudinary } from '../api';
import s from '../cms.module.css';

export const AnnouncementsCMS: React.FC = () => {
  const [items, setItems] = useState<CmsAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CmsAnnouncement | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    try {
      const res = await announcementsApi.list();
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
    setTitle('');
    setEventDate('');
    setDisplayOrder(items.length + 1);
    setPublished(true);
    setImageFile(null);
    setImagePreview('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: CmsAnnouncement) => {
    setEditing(item);
    setTitle(item.title);
    setEventDate(item.event_date || '');
    setDisplayOrder(item.display_order);
    setPublished(Boolean(item.published));
    setImageFile(null);
    setImagePreview(item.image_url || '');
    setError('');
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      let image_url = imagePreview ? (editing?.image_url || null) : null;
      let image_pid = imagePreview ? (editing?.image_public_id || null) : null;

      if (imageFile) {
        setUploading(true);
        const u = await uploadToCloudinary(imageFile, 'aranea-den/announcements', 'image');
        image_url = u.secure_url;
        image_pid = u.public_id;
        setUploading(false);
      }

      const payload = {
        title: title.trim(),
        event_date: eventDate.trim() || null,
        display_order: displayOrder,
        published,
        image_url,
        image_public_id: image_pid,
      };

      if (editing) {
        await announcementsApi.update(editing.id, payload);
        showToast(`Announcement "${title.trim()}" updated.`);
      } else {
        await announcementsApi.create(payload);
        showToast(`Announcement "${title.trim()}" created.`);
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

  const togglePublish = async (item: CmsAnnouncement) => {
    try {
      const next = !item.published;
      await announcementsApi.update(item.id, { published: next });
      showToast(`Announcement marked as ${next ? 'Published' : 'Draft'}.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item: CmsAnnouncement) => {
    if (!confirm(`Delete announcement "${item.title}"? This cannot be undone.`)) return;
    try {
      await announcementsApi.remove(item.id);
      showToast(`Announcement "${item.title}" deleted.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.event_date && item.event_date.toLowerCase().includes(search.toLowerCase()))
  );

  const publishedCount = items.filter((i) => i.published).length;

  return (
    <div className={s.page}>
      {toast && <div className={s.toast}>✓ {toast}</div>}

      <div className={s.pageHeader}>
        <div className={s.headerLeft}>
          <div className={s.titleRow}>
            <h1 className={s.pageTitle}>Announcements</h1>
            <span className={s.countBadge}>
              {items.length} Total · {publishedCount} Live
            </span>
          </div>
          <p className={s.pageSubtitle}>
            Manage banner announcements, keynotes, and hackathon notices on the homepage.
          </p>
        </div>

        <div className={s.headerActions}>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search announcements…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={s.addBtn} onClick={openNew}>
            + Add Announcement
          </button>
        </div>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading announcements…</div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Image</th>
                <th>Title</th>
                <th>Event Date</th>
                <th style={{ width: 70 }}>Order</th>
                <th style={{ width: 110 }}>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={s.emptyState}>
                    {search ? `No announcements matching "${search}".` : 'No announcements yet. Click "+ Add Announcement" to create one.'}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className={s.thumbPreview} />
                    ) : (
                      <div className={s.noThumb}>📢</div>
                    )}
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, color: '#4B4C53' }}>{item.event_date || '—'}</span>
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
                      <button className={s.actionBtn} onClick={() => openEdit(item)} title="Edit announcement">
                        ✏️ Edit
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnGreen}`}
                        onClick={() => togglePublish(item)}
                        title={item.published ? 'Hide announcement' : 'Publish announcement'}
                      >
                        {item.published ? 'Hide' : 'Publish'}
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnDanger}`}
                        onClick={() => handleDelete(item)}
                        title="Delete announcement"
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
          <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="modal-ann-title">
            {/* ── Fixed Header ── */}
            <div className={s.modalHeader}>
              <div>
                <h2 id="modal-ann-title" className={s.modalTitle}>
                  {editing ? 'Edit Announcement' : 'Add Announcement'}
                </h2>
                <span className={s.modalSub}>ARANEA DEN NOTICE & KEYNOTE BROADCAST</span>
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
                  <label className={s.label}>Announcement Title *</label>
                  <input
                    className={s.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Aranea Code Nexus Hackathon"
                    required
                    autoFocus
                  />
                </div>

                <div className={s.gridTwo}>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>
                      Event Date / Timestamp <span className={s.labelOptional}>(Optional)</span>
                    </label>
                    <input
                      className={s.input}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="e.g. 08 OCTOBER 2026"
                    />
                  </div>

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

                <div className={s.fieldGroup}>
                  <label className={s.label}>
                    Announcement Banner Image <span className={s.labelOptional}>(16:9 recommended)</span>
                  </label>
                  <div className={s.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      title="Upload announcement image"
                    />
                    <span className={s.uploadIcon}>📢</span>
                    <p className={s.uploadText}>
                      {imagePreview ? 'Click or drop to replace image' : 'Click or drop announcement banner here'}
                    </p>
                    <p className={s.uploadSubtext}>JPG, PNG, WebP — max 10MB</p>

                    {imagePreview && (
                      <div className={s.previewWrap} onClick={(e) => e.stopPropagation()}>
                        <img src={imagePreview} alt="Preview" className={s.previewImg} />
                        <button
                          type="button"
                          className={s.removeThumbBtn}
                          onClick={removeImage}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {uploading && (
                      <div className={s.uploadProgress}>
                        <span className={s.btnSpinner} style={{ borderTopColor: '#DF2531' }} />
                        Uploading banner…
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
                    '+ Add Announcement'
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
