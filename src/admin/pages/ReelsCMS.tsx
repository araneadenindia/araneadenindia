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
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    try {
      const res = await reelsApi.list();
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
    setDescription('');
    setDisplayOrder(items.length + 1);
    setPublished(true);
    setThumbFile(null);
    setThumbPreview('');
    setVideoFile(null);
    setVideoName('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: CmsReel) => {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setDisplayOrder(item.display_order);
    setPublished(Boolean(item.published));
    setThumbFile(null);
    setThumbPreview(item.thumbnail_url || '');
    setVideoFile(null);
    setVideoName(item.video_url ? 'Existing video attached' : '');
    setError('');
    setShowForm(true);
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
      let thumb_url = thumbPreview ? (editing?.thumbnail_url || null) : null;
      let thumb_pid = thumbPreview ? (editing?.thumbnail_public_id || null) : null;
      let video_url = editing?.video_url || null;
      let video_pid = editing?.video_public_id || null;

      setUploading(true);
      if (thumbFile) {
        const u = await uploadToCloudinary(thumbFile, 'aranea-den/reels/thumbs', 'image');
        thumb_url = u.secure_url;
        thumb_pid = u.public_id;
      }
      if (videoFile) {
        const u = await uploadToCloudinary(videoFile, 'aranea-den/reels/videos', 'video');
        video_url = u.secure_url;
        video_pid = u.public_id;
      }
      setUploading(false);

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        display_order: displayOrder,
        published,
        thumbnail_url: thumb_url,
        thumbnail_public_id: thumb_pid,
        video_url,
        video_public_id: video_pid,
      };

      if (editing) {
        await reelsApi.update(editing.id, payload);
        showToast(`Reel "${title.trim()}" updated.`);
      } else {
        await reelsApi.create(payload);
        showToast(`Reel "${title.trim()}" created successfully.`);
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

  const togglePublish = async (item: CmsReel) => {
    try {
      const next = !item.published;
      await reelsApi.update(item.id, { published: next });
      showToast(`Reel marked as ${next ? 'Published' : 'Draft'}.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (item: CmsReel) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await reelsApi.remove(item.id);
      showToast(`Reel "${item.title}" deleted.`);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
  );

  const publishedCount = items.filter((i) => i.published).length;

  return (
    <div className={s.page}>
      {toast && <div className={s.toast}>✓ {toast}</div>}

      <div className={s.pageHeader}>
        <div className={s.headerLeft}>
          <div className={s.titleRow}>
            <h1 className={s.pageTitle}>Reels</h1>
            <span className={s.countBadge}>
              {items.length} Total · {publishedCount} Live
            </span>
          </div>
          <p className={s.pageSubtitle}>
            Manage high-impact visual showreels and cinematic video showcases.
          </p>
        </div>

        <div className={s.headerActions}>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search reels…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={s.addBtn} onClick={openNew}>
            + Add Reel
          </button>
        </div>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading reels…</div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Cover</th>
                <th>Reel Title</th>
                <th>Video Status</th>
                <th style={{ width: 70 }}>Order</th>
                <th style={{ width: 110 }}>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={s.emptyState}>
                    {search ? `No reels matching "${search}".` : 'No reels added yet. Click "+ Add Reel" to create one.'}
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt="" className={s.thumbPreview} />
                    ) : (
                      <div className={s.noThumb}>🎬</div>
                    )}
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    {item.description && (
                      <div style={{ fontSize: 11.5, color: '#6A6B74', marginTop: 3 }}>
                        {item.description.slice(0, 60)}…
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: item.video_url ? '#15803D' : '#73747A', fontWeight: 600 }}>
                      {item.video_url ? '✓ Video Ready' : '— No Video'}
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
                      <button className={s.actionBtn} onClick={() => openEdit(item)} title="Edit reel">
                        ✏️ Edit
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnGreen}`}
                        onClick={() => togglePublish(item)}
                        title={item.published ? 'Hide reel' : 'Publish reel'}
                      >
                        {item.published ? 'Hide' : 'Publish'}
                      </button>
                      <button
                        className={`${s.actionBtn} ${s.actionBtnDanger}`}
                        onClick={() => handleDelete(item)}
                        title="Delete reel"
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
          <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="modal-reel-title">
            {/* ── Fixed Header ── */}
            <div className={s.modalHeader}>
              <div>
                <h2 id="modal-reel-title" className={s.modalTitle}>
                  {editing ? 'Edit Reel' : 'Add Reel'}
                </h2>
                <span className={s.modalSub}>ARANEA DEN VISUAL CINEMATICS</span>
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
                  <label className={s.label}>Reel Title *</label>
                  <input
                    className={s.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cinematic Showreel 2026"
                    required
                    autoFocus
                  />
                </div>

                <div className={s.fieldGroup}>
                  <label className={s.label}>
                    Description <span className={s.labelOptional}>(Optional)</span>
                  </label>
                  <textarea
                    className={s.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Creative direction, motion design highlights, and aesthetic overview…"
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

                <div className={s.gridTwo}>
                  {/* Thumbnail dropzone */}
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Cover Image</label>
                    <div className={s.uploadArea}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setThumbFile(f);
                            setThumbPreview(URL.createObjectURL(f));
                          }
                        }}
                        title="Upload cover image"
                      />
                      <span className={s.uploadIcon}>🖼️</span>
                      <p className={s.uploadText}>
                        {thumbPreview ? 'Change cover' : 'Upload cover'}
                      </p>
                      <p className={s.uploadSubtext}>JPG, PNG, WebP</p>

                      {thumbPreview && (
                        <div className={s.previewWrap} onClick={(e) => e.stopPropagation()}>
                          <img src={thumbPreview} alt="Cover preview" className={s.previewImg} />
                          <button
                            type="button"
                            className={s.removeThumbBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbFile(null);
                              setThumbPreview('');
                            }}
                            title="Remove cover"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video file dropzone */}
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Video File (MP4, WebM)</label>
                    <div className={s.uploadArea}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setVideoFile(f);
                            setVideoName(f.name);
                          }
                        }}
                        title="Upload MP4 video"
                      />
                      <span className={s.uploadIcon}>🎬</span>
                      <p className={s.uploadText}>
                        {videoName ? 'Change video' : 'Upload MP4'}
                      </p>
                      <p className={s.uploadSubtext}>Direct MP4 video file</p>
                      {videoName && (
                        <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: '#15803D' }}>
                          ✓ {videoName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {uploading && (
                  <div className={s.uploadProgress} style={{ marginTop: 12 }}>
                    <span className={s.btnSpinner} style={{ borderTopColor: '#DF2531' }} />
                    Uploading media to cloud storage…
                  </div>
                )}
              </div>

              {/* ── Fixed / Sticky Footer (ALWAYS VISIBLE & 100% CLICKABLE!) ── */}
              <div className={s.modalFooter}>
                <button
                  type="button"
                  className={s.cancelBtn}
                  onClick={() => setShowForm(false)}
                  disabled={saving || uploading}
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
                    '+ Add Reel'
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
