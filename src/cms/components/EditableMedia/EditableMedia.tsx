// src/cms/components/EditableMedia/EditableMedia.tsx
// Universal Image / Video component with live editing, Cloudinary uploads, and MANDATORY Video Autoplay
import React, { useState, useRef, useEffect } from 'react';
import { useCms } from '../../CmsContext';
import { CmsMedia, MediaType } from '../../types';
import { uploadToCloudinary } from '../../../admin/api';
import styles from './EditableMedia.module.css';

interface EditableMediaProps {
  mediaPath?: string;
  mediaLabel?: string;
  media: CmsMedia | string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain';
  supportedTypes?: string[];
  children?: React.ReactNode;
  onMediaChange?: (updated: CmsMedia) => void;
}

export const EditableMedia: React.FC<EditableMediaProps> = ({
  mediaPath,
  mediaLabel,
  media,
  alt = 'Aranea Den Media',
  className = '',
  style,
  objectFit = 'cover',
  supportedTypes,
  children,
  onMediaChange,
}) => {
  const { isAdmin, isEditMode, isPreviewMode, updateField } = useCms();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize media input to CmsMedia object
  const currentMedia: CmsMedia = typeof media === 'string'
    ? {
        type: media.endsWith('.mp4') || media.endsWith('.webm') ? 'video' : 'image',
        url: media,
        alt,
      }
    : media;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaType>(currentMedia.type || 'image');
  const [mediaUrl, setMediaUrl] = useState(currentMedia.url || '');
  const [posterUrl, setPosterUrl] = useState(currentMedia.posterUrl || '');
  const [mediaAlt, setMediaAlt] = useState(currentMedia.alt || alt);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const canEdit = isAdmin && isEditMode && !isPreviewMode;

  // MANDATORY UNIVERSAL VIDEO AUTOPLAY
  // Enforces autoPlay, muted, playsInline, loop continuously without click-to-play
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentMedia.type !== 'video') return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Retry playback on user interaction if browser policy strictly requires it
          const retry = () => {
            video.muted = true;
            video.play().catch(() => {});
            window.removeEventListener('click', retry);
            window.removeEventListener('touchstart', retry);
          };
          window.addEventListener('click', retry, { once: true });
          window.addEventListener('touchstart', retry, { once: true });
        });
      }
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, [currentMedia.url, currentMedia.type]);

  const handleClick = (e: React.MouseEvent) => {
    if (!canEdit) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedType(currentMedia.type || 'image');
    setMediaUrl(currentMedia.url || '');
    setPosterUrl(currentMedia.posterUrl || '');
    setMediaAlt(currentMedia.alt || alt);
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await uploadToCloudinary(file, 'aranea-den', selectedType);
      setMediaUrl(res.secure_url);
    } catch (err: any) {
      setUploadError(err.message || 'Media upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    const updated: CmsMedia = {
      type: selectedType,
      url: mediaUrl,
      alt: mediaAlt,
      posterUrl: selectedType === 'video' ? posterUrl : undefined,
    };

    if (mediaPath) {
      updateField(mediaPath, updated);
    }

    if (onMediaChange) {
      onMediaChange(updated);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.mediaContainer} ${canEdit ? styles.editMode : ''}`}
        onClick={canEdit ? handleClick : undefined}
        title={canEdit ? 'Click to replace media (Image or Video)' : undefined}
      >
        {children ? (
          children
        ) : currentMedia.type === 'video' ? (
          <video
            ref={videoRef}
            src={currentMedia.url}
            poster={currentMedia.posterUrl}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className={`${styles.renderedVideo} ${className}`}
            style={{ objectFit, ...style }}
          />
        ) : (
          <img
            src={currentMedia.url}
            alt={currentMedia.alt || alt}
            className={`${styles.renderedImage} ${className}`}
            style={{ objectFit, ...style }}
            loading="lazy"
          />
        )}

        {canEdit && (
          <span className={styles.mediaBadge} aria-hidden="true">
            ✎ {mediaLabel ? `REPLACE ${mediaLabel.toUpperCase()}` : `REPLACE ${currentMedia.type.toUpperCase()}`}
          </span>
        )}
      </div>

      {/* Media Replacement Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} role="dialog">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>REPLACE MEDIA (IMAGE OR VIDEO)</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Type Switcher: Image vs Video */}
              {(!supportedTypes || supportedTypes.length > 1) && (
                <div className={styles.typeSelector}>
                  {(!supportedTypes || supportedTypes.includes('image')) && (
                    <button
                      type="button"
                      className={`${styles.typeBtn} ${selectedType === 'image' ? styles.typeBtnActive : ''}`}
                      onClick={() => setSelectedType('image')}
                    >
                      🖼 IMAGE
                    </button>
                  )}
                  {(!supportedTypes || supportedTypes.includes('video')) && (
                    <button
                      type="button"
                      className={`${styles.typeBtn} ${selectedType === 'video' ? styles.typeBtnActive : ''}`}
                      onClick={() => setSelectedType('video')}
                    >
                      ▶ VIDEO (AUTOPLAY)
                    </button>
                  )}
                </div>
              )}

              {/* Live Preview Frame */}
              <div className={styles.previewFrame}>
                {mediaUrl ? (
                  selectedType === 'video' ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      muted
                      playsInline
                      loop
                      className={styles.previewVid}
                    />
                  ) : (
                    <img src={mediaUrl} alt="Preview" className={styles.previewImg} />
                  )
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                    No media selected yet
                  </span>
                )}
              </div>

              {/* Cloudinary Upload Trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept={selectedType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <div
                className={styles.uploadZone}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <div className={styles.uploadText}>
                  {isUploading ? 'UPLOADING TO CLOUDINARY…' : `↑ UPLOAD NEW ${selectedType.toUpperCase()}`}
                </div>
                <div className={styles.uploadSubtext}>
                  {selectedType === 'video'
                    ? 'MP4 or WebM up to 50MB · Seamless 60FPS loop'
                    : 'JPG, PNG, WebP, SVG · High resolution'}
                </div>
              </div>

              {uploadError && (
                <div style={{ color: '#FF7788', fontSize: '12px', textAlign: 'center' }}>
                  {uploadError}
                </div>
              )}

              {/* Direct URL Input */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{selectedType.toUpperCase()} URL</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={selectedType === 'video' ? 'https://... or /video.mp4' : 'https://... or /image.jpg'}
                  className={styles.input}
                />
              </div>

              {/* Optional Poster for Video */}
              {selectedType === 'video' && (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>POSTER / THUMBNAIL IMAGE URL</label>
                  <input
                    type="text"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="/thumbnail.jpg"
                    className={styles.input}
                  />
                </div>
              )}

              {/* Alt Text */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>ACCESSIBILITY ALT / DESCRIPTION</label>
                <input
                  type="text"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  placeholder="Describe this media..."
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
              >
                CANCEL
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={isUploading || !mediaUrl.trim()}
              >
                SAVE MEDIA TO DRAFT →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
