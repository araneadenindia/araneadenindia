import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  WEBSITE_PROJECTS,
  APP_PROJECTS,
  WebsiteProject,
  AppProject,
} from '../../data/portfolioData';
import { ARANEA_REELS, AraneaReel } from '../../data/reelsData';
import { ClienteleSection } from '../../components/ClienteleSection';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import { EditableMedia } from '../../cms/components/EditableMedia/EditableMedia';
import { CmsPortfolioWebsite, CmsAppItem, CmsReelItem } from '../../cms/types';
import styles from './PortfolioPage.module.css';

gsap.registerPlugin(ScrollTrigger);

type CategoryFilter = 'all' | 'websites' | 'apps' | 'reels';
type ViewMode = 'grid' | 'editorial';

/* ─────────────────────────────────────────────────────────────
   AUTOPLAY REEL CARD (Hardware-Accelerated 60FPS Video Card)
   ───────────────────────────────────────────────────────────── */
interface AutoplayReelCardProps {
  reel: AraneaReel;
  onClick: () => void;
}

const AutoplayReelCard: React.FC<AutoplayReelCardProps> = ({ reel, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { rootMargin: '80px 40px 80px 40px', threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [reel.videoSrc]);

  return (
    <div
      ref={cardRef}
      className={styles.reelMarqueeCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Watch reel: ${reel.title}`}
    >
      <div className={styles.reelMediaFrame}>
        {/* Crisp static poster is always present to avoid black frames */}
        <img
          src={reel.thumbnail}
          alt={reel.title}
          loading="lazy"
          className={styles.reelPosterImg}
        />

        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.thumbnail}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className={`${styles.reelAutoplayVideo} ${isPlaying ? styles.videoPlaying : ''}`}
          onPlaying={() => setIsPlaying(true)}
        />

        {/* Hover Center Play Button */}
        <div className={styles.reelHoverPlayBtn} aria-hidden="true">
          <svg className={styles.reelPlayIcon} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </div>

        {/* Ambient Gradient Overlay & Title */}
        <div className={styles.reelBottomOverlay}>
          <div className={styles.reelBadgeClient}>{reel.client}</div>
          <div className={styles.reelCardTitle}>{reel.title}</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SIDE-BY-SIDE AUTO-SCROLLING REEL MARQUEE
   Duplicated 2x for a lightweight, seamless 60FPS loop
   ───────────────────────────────────────────────────────────── */
interface AutoplayReelMarqueeProps {
  reels?: AraneaReel[];
  onSelectReel: (reel: AraneaReel) => void;
}

const AutoplayReelMarquee: React.FC<AutoplayReelMarqueeProps> = ({ reels = ARANEA_REELS, onSelectReel }) => {
  const [isPaused, setIsPaused] = useState(false);
  const repeatCount = Math.max(2, Math.ceil(8 / (reels.length || 1)));
  const marqueeList: AraneaReel[] = [];
  for (let i = 0; i < repeatCount; i++) {
    marqueeList.push(...reels);
  }

  return (
    <div className={styles.reelMarqueeContainer}>
      {/* Top track control bar */}
      <div className={styles.marqueeControlBar}>
        <div className={styles.marqueeStatus}>
          <span className={styles.livePulseDot} aria-hidden="true" />
          <span>AUTOPLAY CINEMATIC FEED // 60 FPS</span>
        </div>
        <button
          type="button"
          className={styles.marqueePauseBtn}
          onClick={() => setIsPaused((prev) => !prev)}
        >
          {isPaused ? '▶ RESUME SCROLL' : '❚❚ PAUSE SCROLL'}
        </button>
      </div>

      <div className={styles.reelMarqueeViewport}>
        <div
          className={`${styles.reelMarqueeTrack} ${isPaused ? styles.marqueeTrackPaused : ''}`}
        >
          {marqueeList.map((reel, index) => (
            <AutoplayReelCard
              key={`${reel.id}-${index}`}
              reel={reel}
              onClick={() => onSelectReel(reel)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   EDITORIAL VIEW AUTOPLAY REEL CARD
   ───────────────────────────────────────────────────────────── */
const EditorialAutoplayReelCard: React.FC<{
  reel: AraneaReel;
  index: number;
  onClick: () => void;
}> = ({ reel, index, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlay = () => {
      video.muted = true;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setIsVideoLoaded(true)).catch(() => {});
      }
    };

    startPlay();
    video.addEventListener('canplay', startPlay);
    video.addEventListener('loadeddata', startPlay);

    return () => {
      video.removeEventListener('canplay', startPlay);
      video.removeEventListener('loadeddata', startPlay);
    };
  }, [reel.videoSrc]);

  return (
    <div
      className={styles.reelEditorialCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Play vertical reel: ${reel.title}`}
    >
      <div className={styles.reelEditorialMedia}>
        <img
          src={reel.thumbnail}
          alt={reel.title}
          className={`${styles.reelPosterImg} ${isVideoLoaded ? styles.posterHidden : ''}`}
          loading="lazy"
        />
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.thumbnail}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={styles.reelAutoplayVideo}
          onPlaying={() => setIsVideoLoaded(true)}
        />
        <div className={styles.reelHoverPlayBtn} aria-hidden="true">
          <svg className={styles.reelPlayIcon} viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className={styles.websiteEditorialContent}>
        <div className={styles.websiteEditorialTop}>
          <span className={styles.editorialIndex}>0{index + 1} // 9:16 REEL</span>
          <span className={styles.websiteCategoryTag}>{reel.client}</span>
        </div>

        <h3 className={styles.websiteTitle}>{reel.title}</h3>
        <p className={styles.editorialDescription}>{reel.caption}</p>

        <div className={styles.tagsRow}>
          <span className={styles.tagPill}>{reel.tag}</span>
          <span className={styles.tagPill}>9:16 CINEMA</span>
          <span className={styles.tagPill}>{reel.likes}</span>
        </div>

        <span className={styles.websiteActionLink}>
          <span>EXPAND FULLSCREEN</span>
          <span className={styles.websiteActionArrow} aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PORTFOLIO PAGE COMPONENT
   ───────────────────────────────────────────────────────────── */
export const PortfolioPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const viewMode: ViewMode = 'grid';
  const [activeModalVideo, setActiveModalVideo] = useState<{
    src: string;
    title: string;
    caption?: string;
    client?: string;
  } | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const {
    activeContent,
    isAdmin,
    isEditMode,
    isPreviewMode,
    addCollectionItem,
    duplicateCollectionItem,
    removeCollectionItem,
  } = useCms();
  const canEdit = isAdmin && isEditMode && !isPreviewMode;

  const portfolioHero = activeContent.portfolio?.hero || {
    breadcrumb: 'PORTFOLIO',
    eyebrow: 'OUR WORK',
    heading: 'A COLLECTION OF DIGITAL EXPERIENCES.',
    lead: 'Websites, applications, and visual stories crafted by Aranea Den.',
  };

  const websites: (CmsPortfolioWebsite | WebsiteProject)[] =
    activeContent.portfolio?.websites || WEBSITE_PROJECTS;
  const apps: (CmsAppItem | AppProject)[] =
    activeContent.portfolio?.apps || APP_PROJECTS;
  const reels: (CmsReelItem | AraneaReel)[] =
    activeContent.portfolio?.reels || ARANEA_REELS;

  useEffect(() => {
    document.title = 'PORTFOLIO — ARANEA DEN | Selected Work & Client Archive';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);


  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };

    if (activeModalVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalVideo]);

  // Subtle GSAP entrance on scroll
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const sections = page.querySelectorAll(`.${styles.portfolioSection}`);
      sections.forEach((sec) => {
        const header = sec.querySelector(`.${styles.sectionHeader}`);
        const content = sec.querySelector(`.${styles.sectionContent}`);

        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: sec,
                start: 'top 85%',
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.1,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: sec,
                start: 'top 85%',
              },
            }
          );
        }
      });
    }, page);

    return () => ctx.revert();
  }, [activeCategory, viewMode]);

  // Determine which sections to render based on activeCategory
  const showWebsites = activeCategory === 'all' || activeCategory === 'websites';
  const showApps = activeCategory === 'all' || activeCategory === 'apps';
  const showReels = activeCategory === 'all' || activeCategory === 'reels';

  return (
    <div ref={pageRef} className={styles.portfolioPage}>
      {/* ─────────────────────────────────────────────────────────────
          01 — EDITORIAL HERO SECTION
          Standardized with /about and /services:
          Breadcrumb + Eyebrow + Heading Accent + Filter Pills + 3D Visual Art
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Breadcrumb Navigation matching Services and About */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/" className={styles.breadcrumbLink}>
                HOME
              </Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbActive}>PORTFOLIO</span>
            </nav>

            {/* Eyebrow */}
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} />
              <EditableField
                fieldPath="portfolio.hero.eyebrow"
                fieldLabel="Portfolio Eyebrow"
                value={portfolioHero.eyebrow}
              >
                <span className={styles.eyebrowText}>{portfolioHero.eyebrow}</span>
              </EditableField>
            </div>

            <EditableField
              fieldPath="portfolio.hero.heading"
              fieldLabel="Portfolio Heading"
              value={portfolioHero.heading}
            >
              <h1 className={styles.heroTitle}>
                {portfolioHero.heading}
              </h1>
            </EditableField>

            <EditableField
              fieldPath="portfolio.hero.lead"
              fieldLabel="Portfolio Description"
              value={portfolioHero.lead}
              isTextarea
              isBlock
            >
              <p className={styles.heroSupportingText}>
                {portfolioHero.lead}
              </p>
            </EditableField>

            {/* Clean Pill Filter Tabs matching mockup */}
            <div className={styles.heroFilterRow} role="tablist" aria-label="Project categories">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'all'}
                className={`${styles.filterPill} ${activeCategory === 'all' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <span>ALL WORK</span>
                <span className={styles.filterPillBadge}>{websites.length + apps.length + reels.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'websites'}
                className={`${styles.filterPill} ${activeCategory === 'websites' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('websites')}
              >
                <span>WEBSITES</span>
                <span className={styles.filterPillBadge}>{websites.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'apps'}
                className={`${styles.filterPill} ${activeCategory === 'apps' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('apps')}
              >
                <span>APPS</span>
                <span className={styles.filterPillBadge}>{apps.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'reels'}
                className={`${styles.filterPill} ${activeCategory === 'reels' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('reels')}
              >
                <span>AD IMPERIAL VISUALS</span>
                <span className={styles.filterPillBadge}>{reels.length}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02 — CATEGORY 1: WEBSITES (16:9 LANDSCAPE ORIENTATION)
          ───────────────────────────────────────────────────────────── */}
      {showWebsites && (
        <section id="websites" className={styles.portfolioSection}>
          <div className={styles.container}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.sectionEyebrowDot} aria-hidden="true" />
                <span>01 / WEBSITES</span>
              </div>
              <h2 className={styles.sectionTitle}>ENGINEERED PLATFORMS.</h2>
              <p className={styles.sectionSubtitle}>
                Landscape project showcase featuring bespoke web architectures, culinary platforms,
                and digital flagships crafted for high performance.
              </p>
            </div>

            {/* Content: Grid or Editorial Layout */}
            <div className={styles.sectionContent}>
              {viewMode === 'grid' ? (
                /* ── GRID VIEW (Landscape 16:9) ── */
                <div className={styles.websitesGrid}>
                  {websites.map((project: any, idx: number) => {
                    const originalIndex = activeContent.portfolio?.websites?.findIndex((w) => w.id === project.id) ?? idx;
                    const projectMedia = project.media || { type: 'image', url: project.thumbnail };

                    return (
                      <div
                        key={project.id || idx}
                        className={styles.websiteCard}
                        style={{ position: 'relative' }}
                      >
                        {canEdit && originalIndex >= 0 && (
                          <div className={styles.cardAdminBar}>
                            <button
                              type="button"
                              className={styles.adminBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                duplicateCollectionItem('portfolio.websites', originalIndex);
                              }}
                              title="Duplicate website project"
                            >
                              ⧉ DUPLICATE
                            </button>
                            <button
                              type="button"
                              className={`${styles.adminBtn} ${styles.adminDeleteBtn}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (window.confirm(`Delete website "${project.title}"?`)) {
                                  removeCollectionItem('portfolio.websites', originalIndex);
                                }
                              }}
                              title="Remove website project"
                            >
                              🗑 REMOVE
                            </button>
                          </div>
                        )}

                        <div className={styles.websiteThumbnailFrame}>
                          <EditableMedia
                            mediaPath={`portfolio.websites.${originalIndex}.media`}
                            media={projectMedia}
                            alt={`${project.title} live interface preview`}
                            className={styles.websiteImg}
                          />
                          <div className={styles.websiteOverlayGlow} aria-hidden="true" />
                        </div>

                        <div className={styles.websiteMeta}>
                          <span className={styles.websiteCategoryTag}>{project.category}</span>
                          <EditableField
                            fieldPath={`portfolio.websites.${originalIndex}.title`}
                            fieldLabel="Project Title"
                            value={project.title}
                          >
                            <h3 className={styles.websiteTitle}>{project.title}</h3>
                          </EditableField>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.websiteActionLink}
                            aria-label={`Visit live site: ${project.title}`}
                          >
                            <span>VIEW PROJECT</span>
                            <span className={styles.websiteActionArrow} aria-hidden="true">
                              →
                            </span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ── EDITORIAL VIEW (Horizontal Card Layout) ── */
                <div className={styles.websitesEditorialList}>
                  {websites.map((project: any, idx: number) => {
                    const originalIndex = activeContent.portfolio?.websites?.findIndex((w) => w.id === project.id) ?? idx;
                    const projectMedia = project.media || { type: 'image', url: project.thumbnail };

                    return (
                      <div
                        key={project.id || idx}
                        className={styles.websiteEditorialCard}
                        style={{ position: 'relative' }}
                      >
                        {canEdit && originalIndex >= 0 && (
                          <div className={styles.cardAdminBar}>
                            <button
                              type="button"
                              className={styles.adminBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                duplicateCollectionItem('portfolio.websites', originalIndex);
                              }}
                            >
                              ⧉ DUPLICATE
                            </button>
                            <button
                              type="button"
                              className={`${styles.adminBtn} ${styles.adminDeleteBtn}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (window.confirm(`Delete website "${project.title}"?`)) {
                                  removeCollectionItem('portfolio.websites', originalIndex);
                                }
                              }}
                            >
                              🗑 REMOVE
                            </button>
                          </div>
                        )}

                        <div className={styles.websiteEditorialMedia}>
                          <EditableMedia
                            mediaPath={`portfolio.websites.${originalIndex}.media`}
                            media={projectMedia}
                            alt={`${project.title} screenshot`}
                            className={styles.websiteImg}
                          />
                        </div>

                        <div className={styles.websiteEditorialContent}>
                          <div className={styles.websiteEditorialTop}>
                            <span className={styles.editorialIndex}>{project.number} // {project.year}</span>
                            <span className={styles.websiteCategoryTag}>{project.category}</span>
                          </div>

                          <EditableField
                            fieldPath={`portfolio.websites.${originalIndex}.title`}
                            fieldLabel="Project Title"
                            value={project.title}
                          >
                            <h3 className={styles.websiteTitle}>{project.title}</h3>
                          </EditableField>

                          <EditableField
                            fieldPath={`portfolio.websites.${originalIndex}.metaDescription`}
                            fieldLabel="Description"
                            value={project.metaDescription || project.description || ''}
                            isTextarea
                            isBlock
                          >
                            <p className={styles.editorialDescription}>{project.metaDescription || project.description}</p>
                          </EditableField>

                          <div className={styles.tagsRow}>
                            {project.tags?.map((tag: string) => (
                              <span key={tag} className={styles.tagPill}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.websiteActionLink}
                            aria-label={`Visit live site: ${project.title}`}
                          >
                            <span>VIEW PROJECT</span>
                            <span className={styles.websiteActionArrow} aria-hidden="true">
                              →
                            </span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {canEdit && (
                <div className={styles.addProjectBar}>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => {
                      const count = websites.length + 1;
                      const newWebsite: CmsPortfolioWebsite = {
                        id: `web-${Date.now()}`,
                        number: String(count).padStart(2, '0'),
                        title: 'NEW DIGITAL PLATFORM',
                        domain: 'platform.araneaden.com',
                        url: 'https://araneaden.com',
                        category: 'DIGITAL EXPERIENCE',
                        filterCategory: 'creative',
                        metaDescription: 'Engineered high-performance web architecture.',
                        tags: ['React', 'Full-Stack', 'Interactive'],
                        media: {
                          type: 'image',
                          url: '/portfolio-thumbs/meghana.jpg',
                          alt: 'New Platform Preview',
                        },
                        year: '2026',
                        featuredOnHome: true,
                      };
                      addCollectionItem('portfolio.websites', newWebsite);
                    }}
                  >
                    <span>+</span>
                    <span>ADD NEW WEBSITE PROJECT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          03 — CATEGORY 2: APPS (9:16 PORTRAIT DEVICE MOCKUPS)
          ───────────────────────────────────────────────────────────── */}
      {showApps && (
        <section id="apps" className={styles.portfolioSection}>
          <div className={styles.container}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.sectionEyebrowDot} aria-hidden="true" />
                <span>02 / APPS</span>
              </div>
              <h2 className={styles.sectionTitle}>MOBILE ECOSYSTEMS.</h2>
              <p className={styles.sectionSubtitle}>
                Portrait mobile applications and companion software presented in realistic, subtle
                device framing with tactile haptics and offline-first resilience.
              </p>
            </div>

            {/* Content: Grid or Editorial Layout */}
            <div className={styles.sectionContent}>
              {viewMode === 'grid' ? (
                /* ── GRID VIEW (Portrait 9:16 Subtle Mobile Mockup) ── */
                <div className={styles.appsGrid}>
                  {apps.map((app: any, idx: number) => {
                    const originalIndex = activeContent.portfolio?.apps?.findIndex((a) => a.id === app.id) ?? idx;
                    const appMedia = app.media || { type: 'image', url: app.thumbnail };

                    return (
                      <div
                        key={app.id || idx}
                        className={styles.appCard}
                        style={{ position: 'relative' }}
                      >
                        {canEdit && originalIndex >= 0 && (
                          <div className={styles.cardAdminBar}>
                            <button
                              type="button"
                              className={styles.adminBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                duplicateCollectionItem('portfolio.apps', originalIndex);
                              }}
                              title="Duplicate app"
                            >
                              ⧉ DUPLICATE
                            </button>
                            <button
                              type="button"
                              className={`${styles.adminBtn} ${styles.adminDeleteBtn}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (window.confirm(`Delete app "${app.name}"?`)) {
                                  removeCollectionItem('portfolio.apps', originalIndex);
                                }
                              }}
                              title="Remove app"
                            >
                              🗑 REMOVE
                            </button>
                          </div>
                        )}

                        {/* Subtle Mobile Device Mockup Frame */}
                        <div className={styles.appDeviceFrame}>
                          <div className={styles.deviceIslandPill} aria-hidden="true" />
                          <EditableMedia
                            mediaPath={`portfolio.apps.${originalIndex}.media`}
                            media={appMedia}
                            alt={`${app.name} interface preview`}
                            className={styles.appScreenImg}
                          />
                        </div>

                        <div className={styles.appMeta}>
                          <span className={styles.appPlatformTag}>{app.platform}</span>
                          <EditableField
                            fieldPath={`portfolio.apps.${originalIndex}.name`}
                            fieldLabel="App Name"
                            value={app.name}
                          >
                            <h3 className={styles.appTitle}>{app.name}</h3>
                          </EditableField>
                          <span className={styles.appActionLink}>
                            <span>VIEW PROJECT</span>
                            <span className={styles.websiteActionArrow} aria-hidden="true">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ── EDITORIAL VIEW (Horizontal Card with Phone on Left) ── */
                <div className={styles.appsEditorialList}>
                  {apps.map((app: any, idx: number) => {
                    const originalIndex = activeContent.portfolio?.apps?.findIndex((a) => a.id === app.id) ?? idx;
                    const appMedia = app.media || { type: 'image', url: app.thumbnail };

                    return (
                      <div
                        key={app.id || idx}
                        className={styles.appEditorialCard}
                        style={{ position: 'relative' }}
                      >
                        {canEdit && originalIndex >= 0 && (
                          <div className={styles.cardAdminBar}>
                            <button
                              type="button"
                              className={styles.adminBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                duplicateCollectionItem('portfolio.apps', originalIndex);
                              }}
                            >
                              ⧉ DUPLICATE
                            </button>
                            <button
                              type="button"
                              className={`${styles.adminBtn} ${styles.adminDeleteBtn}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (window.confirm(`Delete app "${app.name}"?`)) {
                                  removeCollectionItem('portfolio.apps', originalIndex);
                                }
                              }}
                            >
                              🗑 REMOVE
                            </button>
                          </div>
                        )}

                        {/* Device Mockup */}
                        <div className={styles.appDeviceFrame}>
                          <div className={styles.deviceIslandPill} aria-hidden="true" />
                          <EditableMedia
                            mediaPath={`portfolio.apps.${originalIndex}.media`}
                            media={appMedia}
                            alt={`${app.name} interface`}
                            className={styles.appScreenImg}
                          />
                        </div>

                        <div className={styles.websiteEditorialContent}>
                          <div className={styles.websiteEditorialTop}>
                            <span className={styles.editorialIndex}>{app.number} // {app.status}</span>
                            <span className={styles.appPlatformTag}>{app.platform}</span>
                          </div>

                          <EditableField
                            fieldPath={`portfolio.apps.${originalIndex}.name`}
                            fieldLabel="App Name"
                            value={app.name}
                          >
                            <h3 className={styles.appTitle}>{app.name}</h3>
                          </EditableField>

                          <EditableField
                            fieldPath={`portfolio.apps.${originalIndex}.description`}
                            fieldLabel="App Description"
                            value={app.description || ''}
                            isTextarea
                            isBlock
                          >
                            <p className={styles.editorialDescription}>{app.description}</p>
                          </EditableField>

                          <div className={styles.tagsRow}>
                            {app.tags?.map((tag: string) => (
                              <span key={tag} className={styles.tagPill}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          <span className={styles.appActionLink}>
                            <span>VIEW PROJECT</span>
                            <span className={styles.websiteActionArrow} aria-hidden="true">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {canEdit && (
                <div className={styles.addProjectBar}>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => {
                      const count = apps.length + 1;
                      const newApp: CmsAppItem = {
                        id: `app-${Date.now()}`,
                        name: `NEW APPLICATION ECOSYSTEM 0${count}`,
                        client: 'Aranea Den Enterprise',
                        platform: 'iOS / Android & Web',
                        category: 'MOBILE APPLICATION',
                        description: 'Next-generation application engineered for speed and fluid physics.',
                        tags: ['React Native', 'TypeScript', 'Offline-First'],
                        media: {
                          type: 'image',
                          url: '/services/ad-mobile-development.jpg',
                          alt: 'New App Preview',
                        },
                        url: '/services/mobile-development',
                        year: '2026',
                        status: 'Production',
                      };
                      addCollectionItem('portfolio.apps', newApp);
                    }}
                  >
                    <span>+</span>
                    <span>ADD NEW APP PROJECT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          04 — CATEGORY 3: AD IMPERIAL VISUALS (SIDE-BY-SIDE AUTO-SCROLL AUTOPLAY REELS)
          ───────────────────────────────────────────────────────────── */}
      {showReels && (
        <section id="ad-imperial-visuals" className={styles.portfolioSection}>
          <div className={styles.container}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.sectionEyebrowDot} aria-hidden="true" />
                <span>03 / AD IMPERIAL VISUALS</span>
              </div>
              <h2 className={styles.sectionTitle}>VERTICAL CINEMATICS.</h2>
              <p className={styles.sectionSubtitle}>
                Side-by-side continuous auto-scrolling gallery of 9:16 vertical reels, sensory gastronomy,
                and cinematic brand stories playing automatically in real-time.
              </p>
            </div>

            {/* Content: Continuous Auto-scroll Autoplay Track or Editorial View */}
            <div className={styles.sectionContent}>
              {viewMode === 'grid' ? (
                /* ── SIDE-BY-SIDE CONTINUOUS AUTO-SCROLL AUTOPLAY REELS ── */
                <AutoplayReelMarquee
                  reels={reels.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    client: r.client,
                    caption: r.caption || '',
                    thumbnail: r.media?.posterUrl || r.thumbnail || '/reels/reel_05.jpg',
                    videoSrc: r.media?.url || r.videoSrc || '/reels-videos/startup-potluck.mp4',
                    instagramUrl: r.instagramUrl || 'https://www.instagram.com/araneaden_/',
                    aspectRatio: r.aspectRatio || '9:16',
                    likes: r.likes || 'HD Reel',
                    tag: r.tag || 'AD IMPERIAL VISUALS',
                  }))}
                  onSelectReel={(reel) =>
                    setActiveModalVideo({
                      src: reel.videoSrc,
                      title: reel.title,
                      client: reel.client,
                      caption: reel.caption,
                    })
                  }
                />
              ) : (
                /* ── EDITORIAL VIEW FOR REELS (Horizontal Cards with Autoplay Video) ── */
                <div className={styles.reelsEditorialList}>
                  {reels.map((r: any, index: number) => {
                    const reel: AraneaReel = {
                      id: r.id,
                      title: r.title,
                      client: r.client,
                      caption: r.caption || '',
                      thumbnail: r.media?.posterUrl || r.thumbnail || '/reels/reel_05.jpg',
                      videoSrc: r.media?.url || r.videoSrc || '/reels-videos/startup-potluck.mp4',
                      instagramUrl: r.instagramUrl || 'https://www.instagram.com/araneaden_/',
                      aspectRatio: r.aspectRatio || '9:16',
                      likes: r.likes || 'HD Reel',
                      tag: r.tag || 'AD IMPERIAL VISUALS',
                    };
                    return (
                      <EditorialAutoplayReelCard
                        key={reel.id}
                        reel={reel}
                        index={index}
                        onClick={() =>
                          setActiveModalVideo({
                            src: reel.videoSrc,
                            title: reel.title,
                            client: reel.client,
                            caption: reel.caption,
                          })
                        }
                      />
                    );
                  })}
                </div>
              )}

              {canEdit && (
                <div className={styles.addProjectBar}>
                  <button
                    type="button"
                    className={styles.addProjectBtn}
                    onClick={() => {
                      const count = reels.length + 1;
                      const newReel: CmsReelItem = {
                        id: `reel-${Date.now()}`,
                        title: `CINEMATIC REEL 0${count}`,
                        client: 'Aranea Den Visuals',
                        caption: 'Vertical cinematic brand story produced in 60FPS.',
                        media: {
                          type: 'video',
                          url: '/reels-videos/startup-potluck.mp4',
                          posterUrl: '/reels/reel_05.jpg',
                          alt: 'New Reel Video',
                        },
                        instagramUrl: 'https://www.instagram.com/araneaden_/',
                        aspectRatio: '9:16',
                        likes: 'HD Reel',
                        tag: 'AD IMPERIAL VISUALS',
                      };
                      addCollectionItem('portfolio.reels', newReel);
                    }}
                  >
                    <span>+</span>
                    <span>ADD NEW CINEMATIC REEL</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          05 — CLIENTELE SECTION
          ───────────────────────────────────────────────────────────── */}
      <ClienteleSection />

      {/* ─────────────────────────────────────────────────────────────
          06 — REFINED VERTICAL 9:16 VIDEO MODAL / LIGHTBOX
          ───────────────────────────────────────────────────────────── */}
      {activeModalVideo && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveModalVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeModalVideo.title}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderMeta}>
                {activeModalVideo.client && (
                  <span className={styles.modalClientTag}>{activeModalVideo.client}</span>
                )}
                <h3 className={styles.modalTitle}>{activeModalVideo.title}</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalVideo(null)}
                aria-label="Close video player"
              >
                ✕
              </button>
            </div>

            {/* Properly Sized 9:16 Vertical Video Player */}
            <div className={styles.modalVideoWrapper}>
              <video
                ref={videoPlayerRef}
                src={activeModalVideo.src}
                controls
                autoPlay
                playsInline
                className={styles.modalVideo}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
