// src/cms/components/EditableMedia/EditableMedia.tsx
import React, { useRef, useEffect } from 'react';
import { CmsMedia } from '../../types';
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
  media,
  alt = 'Aranea Den Media',
  className = '',
  style,
  objectFit = 'cover',
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (children) {
    return <>{children}</>;
  }

  const currentMedia: CmsMedia = typeof media === 'string'
    ? {
        type: media.endsWith('.mp4') || media.endsWith('.webm') ? 'video' : 'image',
        url: media,
        alt,
      }
    : media;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentMedia.type !== 'video') return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, [currentMedia.url, currentMedia.type]);

  if (currentMedia.type === 'video') {
    return (
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
    );
  }

  return (
    <img
      src={currentMedia.url}
      alt={currentMedia.alt || alt}
      className={`${styles.renderedImage} ${className}`}
      style={{ objectFit, ...style }}
      loading="lazy"
    />
  );
};
