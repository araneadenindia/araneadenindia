import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import { EditableMedia } from '../../cms/components/EditableMedia/EditableMedia';
import { ItemEditModal } from '../../cms/components/Modals/ItemEditModal';
import { CmsAnnouncementItem } from '../../cms/types';
import styles from './AnnouncementsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export interface AnnouncementItem {
  id: string;
  title: string;
  image: string;
  date: string;
  button_title?: string | null;
  button_link?: string | null;
}

const SAMPLE_REG_LINK = 'https://forms.gle/JSXfFGGESx6U2Mhr8';

// Fallback data shown while API loads or if CMS has no entries yet
const FALLBACK_ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: 'district-youth-festival-2026', title: 'District Youth Festival – 2026', image: '/announcements/district-youth-festival-2026.jpg', date: '29 SEPTEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'sriyasjaan-collab', title: 'Sriyasjaan Creative Collaboration', image: '/portfolio-thumbs/sriyasjaan.jpg', date: '24 SEPTEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'hackathon-2026', title: 'Aranea Code Nexus Hackathon', image: '/portfolio-thumbs/thor.jpg', date: '08 OCTOBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'ai-masterclass', title: 'Systems Architecture & AI Masterclass', image: '/portfolio-thumbs/cornercraft.jpg', date: '16 OCTOBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'imperial-visuals-launch', title: 'AD Imperial Visuals Creative Suite', image: '/portfolio-thumbs/creators.jpg', date: '25 OCTOBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'iot-hardware-labs', title: 'Hardware & Embedded Solutions Lab', image: '/portfolio-thumbs/viraj.jpg', date: '03 NOVEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'brand-identity-sprint', title: 'Brand Identity Sprint — Q4', image: '/portfolio-thumbs/meghana.jpg', date: '12 NOVEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'web-dev-intake', title: 'Premium Web Platform Intake', image: '/portfolio-thumbs/makaan.jpg', date: '21 NOVEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'digital-marketing-summit', title: 'Growth Strategy Summit', image: '/portfolio-thumbs/nri360.jpg', date: '02 DECEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'mobile-app-workshop', title: 'Mobile App Development Bootcamp', image: '/portfolio-thumbs/pooja.jpg', date: '11 DECEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
  { id: 'uiux-critique', title: 'Open UI/UX Design Critique', image: '/portfolio-thumbs/pandp.jpg', date: '19 DECEMBER 2026', button_title: 'Register Now', button_link: SAMPLE_REG_LINK },
];

export const AnnouncementsSection: React.FC = () => {
  const {
    activeContent,
    isAdmin,
    isEditMode,
    isPreviewMode,
    addCollectionItem,
    duplicateCollectionItem,
    removeCollectionItem,
    updateField,
    updateCollectionItem,
  } = useCms();
  const canEdit = isAdmin && isEditMode && !isPreviewMode;

  // Inline Button Editing State
  const [isBtnModalOpen, setIsBtnModalOpen] = useState(false);
  const [editingBtnIndex, setEditingBtnIndex] = useState(0);
  const [editingBtnTitle, setEditingBtnTitle] = useState('');
  const [editingBtnLink, setEditingBtnLink] = useState('');

  // Full Announcement Editing State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(0);

  const handleOpenButtonModal = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const targetItem = rawItems[index] || {} as any;
    setEditingBtnIndex(index);
    setEditingBtnTitle(targetItem?.buttonTitle || 'Register Now');
    setEditingBtnLink(targetItem?.buttonLink || '');
    setIsBtnModalOpen(true);
  };

  const handleSaveButton = () => {
    updateField(`home.announcements.items.${editingBtnIndex}.buttonTitle`, editingBtnTitle);
    updateField(`home.announcements.items.${editingBtnIndex}.buttonLink`, editingBtnLink);
    setIsBtnModalOpen(false);
  };

  const handleOpenItemModal = (index: number) => {
    setEditingItemIndex(index);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (data: Record<string, any>) => {
    const currentItem = rawItems[editingItemIndex] || {};
    const updatedItem: CmsAnnouncementItem = {
      ...currentItem,
      id: currentItem.id || `ann-${Date.now()}`,
      title: data.title || '',
      eventDate: data.eventDate || '',
      buttonTitle: data.buttonTitle || 'Register Now',
      buttonLink: data.buttonLink || SAMPLE_REG_LINK,
      media: {
        type: 'image',
        url: data.imageUrl || currentItem.media?.url || '/announcements/district-youth-festival-2026.jpg',
        alt: data.title || 'Announcement Flyer',
      },
    };
    updateCollectionItem('home.announcements.items', editingItemIndex, updatedItem);
    setIsItemModalOpen(false);
  };

  const announcementsData = activeContent.home?.announcements || {
    eyebrow: 'LATEST UPDATES',
    title: 'ANNOUNCEMENTS',
    items: [],
  };

  const rawItems = announcementsData.items && announcementsData.items.length > 0
    ? announcementsData.items
    : FALLBACK_ANNOUNCEMENTS.map((f) => ({
        id: f.id,
        title: f.title,
        media: { type: 'image' as const, url: f.image, alt: f.title },
        eventDate: f.date,
        buttonTitle: f.button_title || 'Register Now',
        buttonLink: f.button_link || SAMPLE_REG_LINK,
      }));

  const announcements: AnnouncementItem[] = rawItems.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.media?.url || '/announcements/district-youth-festival-2026.jpg',
    date: item.eventDate,
    button_title: item.buttonTitle || 'Register Now',
    button_link: item.buttonLink || SAMPLE_REG_LINK,
  }));

  const extendedSlides = useMemo(() => {
    if (announcements.length === 0) return [];

    return [
      announcements[announcements.length - 1], // Clone of last item (index 0)
      ...announcements,                         // Real items (indices 1 to length)
      announcements[0],                         // Clone of first item (index length + 1)
    ];
  }, [announcements]);


  const [trackIndex, setTrackIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Real active index (0 to announcements.length - 1)
  const activeRealIndex = (trackIndex - 1 + announcements.length) % announcements.length;

  // Prev / Next actions
  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setTrackIndex((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setTrackIndex((prev) => prev + 1);
  }, []);

  // Handle transition end for seamless infinite loop wrapping
  const handleTransitionEnd = () => {
    if (trackIndex >= extendedSlides.length - 1) {
      setIsTransitioning(false);
      setTrackIndex(1);
    } else if (trackIndex <= 0) {
      setIsTransitioning(false);
      setTrackIndex(announcements.length);
    }
  };


  // Re-enable CSS transition on the next frame after instant index wrap
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Modal Prev / Next
  const handleModalPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  }, [announcements.length]);

  const handleModalNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  }, [announcements.length]);


  // Open modal at specified index
  const handleCardClick = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Continuous smooth auto-slide every 2.6 seconds (pauses only when modal is open or in edit mode)
  useEffect(() => {
    if (isModalOpen || canEdit) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2600);

    return () => clearInterval(interval);
  }, [isModalOpen, canEdit, handleNext]);

  // Lock body scroll and listen for escape / arrow keys when modal is open
  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowLeft') {
        handleModalPrev();
      } else if (e.key === 'ArrowRight') {
        handleModalNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleModalPrev, handleModalNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // GSAP scroll entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const stage = section.querySelector(`.${styles.stageWrapper}`);

      if (stage) {
        gsap.fromTo(
          stage,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const activeCurrentItem = announcements[activeRealIndex];
  const activeModalItem = announcements[modalIndex];


  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Announcements"
    >
      <div className={styles.container}>
        {/* Left Red Arrow (Pure red chevron, no circle) */}
        <button
          type="button"
          className={`${styles.sideNavBtn} ${styles.sideNavPrev}`}
          onClick={handlePrev}
          aria-label="Previous announcement"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Centered Editorial 16:9 Stage */}
        <div className={styles.stageWrapper}>
          {/* Header Bar — perfectly aligned with the card */}
          <div className={styles.headerBar}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrow}>
                <span className={styles.crimsonDot} aria-hidden="true" />
                <EditableField
                  fieldPath="home.announcements.eyebrow"
                  fieldLabel="Announcements Eyebrow"
                  value={announcementsData.eyebrow}
                >
                  <span className={styles.eyebrowText}>{announcementsData.eyebrow}</span>
                </EditableField>
              </div>
              <EditableField
                fieldPath="home.announcements.title"
                fieldLabel="Announcements Title"
                value={announcementsData.title}
              >
                <h2 className={styles.sectionTitle}>
                  {announcementsData.title}
                </h2>
              </EditableField>
            </div>

            <div className={styles.slideCounter} aria-live="polite">
              <span className={styles.counterCurrent}>
                {String(activeRealIndex + 1).padStart(2, '0')}
              </span>
              <span className={styles.counterDivider}>/</span>
              <span className={styles.counterTotal}>
                {String(announcements.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* 16:9 Single Card Viewport */}
          <div
            className={styles.sliderViewport}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.sliderTrack}
              style={{
                transform: `translateX(-${trackIndex * 100}%)`,
                transition: isTransitioning
                  ? 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedSlides.map((item, idx) => {
                const origIndex =
                  idx === 0
                    ? announcements.length - 1
                    : idx === extendedSlides.length - 1
                    ? 0
                    : idx - 1;

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className={styles.cardSlide}
                    onClick={canEdit ? undefined : () => handleCardClick(activeRealIndex)}
                    role={canEdit ? undefined : 'button'}
                    tabIndex={canEdit ? undefined : 0}
                    onKeyDown={canEdit ? undefined : (e) => e.key === 'Enter' && handleCardClick(activeRealIndex)}
                    aria-label={`${item.title} — Click to expand full screen`}
                  >
                    <EditableMedia
                      mediaPath={`home.announcements.items.${origIndex}.media`}
                      mediaLabel={`Announcement #${origIndex + 1} Flyer`}
                      media={rawItems[origIndex]?.media || { type: 'image', url: item.image, alt: item.title }}
                      className={styles.cardImage}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.cardImage}
                        loading={idx <= 2 ? 'eager' : 'lazy'}
                      />
                    </EditableMedia>

                    {/* Light curved red bottom-left gradient */}
                    <div className={styles.cardGradientOverlay} aria-hidden="true" />

                    {/* Crisp White Title */}
                    <h3 className={`${styles.cardTitle} ${styles.cardTitleWithBtn} ${canEdit ? styles.cardTitleEditable : ''}`}>
                      <EditableField
                        fieldPath={`home.announcements.items.${origIndex}.title`}
                        fieldLabel={`Announcement #${origIndex + 1} Title`}
                        value={item.title}
                      >
                        <span>{item.title}</span>
                      </EditableField>
                    </h3>

                    {/* Action / Register Button */}
                    {canEdit ? (
                      <button
                        type="button"
                        className={`${styles.cardActionBtn} ${styles.cardActionBtnEditable}`}
                        onClick={(e) => handleOpenButtonModal(e, origIndex)}
                        title={`Click to edit button text & link for "${item.title}"`}
                        aria-label={`Edit Button for ${item.title}`}
                      >
                        <span>{item.button_title || 'Register Now'}</span>
                        <span className={styles.editBtnBadge}>✎ EDIT BUTTON</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={item.button_link || SAMPLE_REG_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cardActionBtn}
                        onClick={(e) => e.stopPropagation()}
                        title={`${item.button_title || 'Register Now'} — Opens link`}
                        aria-label={`${item.button_title || 'Register Now'} for ${item.title}`}
                      >
                        <span>{item.button_title || 'Register Now'}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}

                    {/* Fullscreen Expand Hint Badge */}
                    {!canEdit && (
                      <div className={styles.expandBadge} aria-hidden="true" title="View Fullscreen">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Centered Bottom Meta: Dots + Full Date */}
          <div className={styles.bottomMeta}>
            <div className={styles.paginationDots} role="tablist" aria-label="Slide indicators">
              {announcements.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeRealIndex === idx}
                  className={`${styles.dot} ${activeRealIndex === idx ? styles.dotActive : ''}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTrackIndex(idx + 1);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <EditableField
              fieldPath={`home.announcements.items.${activeRealIndex}.eventDate`}
              fieldLabel={`Announcement #${activeRealIndex + 1} Date`}
              value={activeCurrentItem.date}
            >
              <span className={styles.slideDate}>{activeCurrentItem.date}</span>
            </EditableField>
          </div>

          {canEdit && (
            <div className={styles.adminActionBar}>
              <button
                type="button"
                className={styles.adminActionBtn}
                onClick={() => handleOpenItemModal(activeRealIndex)}
                title="Edit all fields of this announcement card in a single modal"
              >
                ✎ EDIT CARD #{activeRealIndex + 1}
              </button>
              <button
                type="button"
                className={`${styles.adminActionBtn} ${styles.adminAddBtn}`}
                onClick={() => {
                  const count = rawItems.length + 1;
                  const newAnn: CmsAnnouncementItem = {
                    id: `ann-${Date.now()}`,
                    title: `NEW ANNOUNCEMENT 0${count}`,
                    eventDate: 'COMING SOON',
                    buttonTitle: 'Register Now',
                    buttonLink: SAMPLE_REG_LINK,
                    media: {
                      type: 'image',
                      url: '/announcements/district-youth-festival-2026.jpg',
                      alt: 'New Announcement Flyer',
                    },
                  };
                  addCollectionItem('home.announcements.items', newAnn);
                }}
              >
                + ADD ANNOUNCEMENT
              </button>
              <button
                type="button"
                className={styles.adminActionBtn}
                onClick={() => {
                  duplicateCollectionItem('home.announcements.items', activeRealIndex);
                }}
              >
                ⧉ DUPLICATE
              </button>
              <button
                type="button"
                className={`${styles.adminActionBtn} ${styles.adminDeleteBtn}`}
                onClick={() => {
                  if (window.confirm(`Delete announcement "${announcements[activeRealIndex]?.title}"?`)) {
                    removeCollectionItem('home.announcements.items', activeRealIndex);
                  }
                }}
              >
                🗑 REMOVE
              </button>
            </div>
          )}
        </div>

        {/* Right Red Arrow (Pure red chevron, no circle) */}
        <button
          type="button"
          className={`${styles.sideNavBtn} ${styles.sideNavNext}`}
          onClick={handleNext}
          aria-label="Next announcement"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FULL SCREEN LIGHTBOX MODAL WITH BACKGROUND BLUR
          ───────────────────────────────────────────────────────────── */}
      {isModalOpen && activeModalItem && (
        <div
          className={styles.modalOverlay}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label={activeModalItem.title}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={handleCloseModal}
              aria-label="Close fullscreen modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Prev Button */}
            <button
              type="button"
              className={`${styles.modalNavBtn} ${styles.modalNavPrev}`}
              onClick={handleModalPrev}
              aria-label="Previous announcement"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Modal Next Button */}
            <button
              type="button"
              className={`${styles.modalNavBtn} ${styles.modalNavNext}`}
              onClick={handleModalNext}
              aria-label="Next announcement"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Full Date Tag in Modal */}
            <span className={styles.modalDateTag}>{activeModalItem.date}</span>

            {/* Fullscreen Image */}
            <img
              src={activeModalItem.image}
              alt={activeModalItem.title}
              className={styles.modalImage}
            />

            {/* Light curved red bottom-left gradient */}
            <div className={styles.cardGradientOverlay} aria-hidden="true" />

            {/* White Title */}
            <h3 className={`${styles.modalTitle} ${styles.modalTitleWithBtn}`}>
              {activeModalItem.title}
            </h3>

            {/* Modal Action / Register Button */}
            <a
              href={activeModalItem.button_link || SAMPLE_REG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.modalActionBtn}
              onClick={(e) => e.stopPropagation()}
              title={`${activeModalItem.button_title || 'Register Now'} — Opens link`}
              aria-label={`${activeModalItem.button_title || 'Register Now'} for ${activeModalItem.title}`}
            >
              <span>{activeModalItem.button_title || 'Register Now'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          INLINE BUTTON EDIT MODAL (TITLE & TARGET LINK)
          ───────────────────────────────────────────────────────────── */}
      {isBtnModalOpen && (
        <div className={styles.btnModalOverlay} onClick={() => setIsBtnModalOpen(false)}>
          <div className={styles.btnModalCard} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.btnModalHeader}>
              <h4 className={styles.btnModalTitle}>Edit Button #{editingBtnIndex + 1}</h4>
              <button
                type="button"
                className={styles.btnModalClose}
                onClick={() => setIsBtnModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className={styles.btnModalBody}>
              <div className={styles.btnFieldGroup}>
                <label className={styles.btnFieldLabel}>Button Text / Label</label>
                <input
                  type="text"
                  className={styles.btnModalInput}
                  value={editingBtnTitle}
                  onChange={(e) => setEditingBtnTitle(e.target.value)}
                  placeholder="e.g. Register Now, Learn More"
                  autoFocus
                />
              </div>
              <div className={styles.btnFieldGroup}>
                <label className={styles.btnFieldLabel}>Button Target URL (Link)</label>
                <input
                  type="text"
                  className={styles.btnModalInput}
                  value={editingBtnLink}
                  onChange={(e) => setEditingBtnLink(e.target.value)}
                  placeholder="https://forms.gle/... or /contact"
                />
              </div>
            </div>
            <div className={styles.btnModalFooter}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setIsBtnModalOpen(false)}
              >
                CANCEL
              </button>
              <button
                type="button"
                className={styles.btnModalSave}
                onClick={handleSaveButton}
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FULL ANNOUNCEMENT ITEM EDIT MODAL
          ───────────────────────────────────────────────────────────── */}
      <ItemEditModal
        isOpen={isItemModalOpen}
        title={`Edit Announcement #${editingItemIndex + 1}`}
        initialData={{
          title: rawItems[editingItemIndex]?.title || '',
          imageUrl: rawItems[editingItemIndex]?.media?.url || '',
          eventDate: rawItems[editingItemIndex]?.eventDate || '',
          buttonTitle: rawItems[editingItemIndex]?.buttonTitle || 'Register Now',
          buttonLink: rawItems[editingItemIndex]?.buttonLink || SAMPLE_REG_LINK,
        }}
        fields={[
          { key: 'title', label: 'Announcement Title', type: 'textarea', placeholder: 'Event or program title' },
          { key: 'imageUrl', label: 'Flyer Image URL', type: 'text', placeholder: '/announcements/... or Cloudinary URL' },
          { key: 'eventDate', label: 'Event Date / Schedule', type: 'text', placeholder: 'e.g. 29 SEPTEMBER 2026' },
          { key: 'buttonTitle', label: 'Button Title / Label', type: 'text', placeholder: 'e.g. Register Now' },
          { key: 'buttonLink', label: 'Button Target URL', type: 'text', placeholder: 'https://... or /contact' },
        ]}
        onSave={handleSaveItem}
        onClose={() => setIsItemModalOpen(false)}
      />
    </section>
  );
};

export default AnnouncementsSection;
