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

  const [websites, setWebsites] = useState<WebsiteProject[]>(WEBSITE_PROJECTS);
  const [apps, setApps] = useState<AppProject[]>(APP_PROJECTS);
  const [reels, setReels] = useState<AraneaReel[]>(ARANEA_REELS);

  useEffect(() => {
    fetch('/api/cms/websites')
      .then((res) => res.json())
      .then((res) => {
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: WebsiteProject[] = res.data.map((w: any, index: number) => ({
            id: String(w.id),
            number: String(index + 1).padStart(2, '0'),
            title: w.title,
            client: w.title,
            category: 'DIGITAL EXPERIENCE',
            description: w.description || '',
            tags: ['Website', 'Live Production'],
            thumbnail: w.thumbnail_url || '/portfolio-thumbs/meghana.jpg',
            url: w.live_url || '#',
            year: '2026',
          }));
          setWebsites(mapped);
        }
      })
      .catch(() => {});

    fetch('/api/cms/apps')
      .then((res) => res.json())
      .then((res) => {
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AppProject[] = res.data.map((a: any, index: number) => ({
            id: String(a.id),
            number: String(index + 1).padStart(2, '0'),
            name: a.name,
            client: a.client || 'Aranea Den',
            platform: a.platform || 'iOS / Android',
            category: a.category || 'Mobile Application',
            description: a.description || '',
            tags: a.tags ? a.tags.split(',').map((t: string) => t.trim()) : ['React Native', 'Mobile App'],
            thumbnail: a.thumbnail_url || '/services/ad-mobile-development.jpg',
            url: a.url || '/services/mobile-development',
            year: a.year || '2026',
            status: a.status || 'Production',
          }));
          setApps(mapped);
        }
      })
      .catch(() => {});

    fetch('/api/cms/reels')
      .then((res) => res.json())
      .then((res) => {
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AraneaReel[] = res.data.map((r: any) => ({
            id: String(r.id),
            title: r.title,
            client: r.title,
            caption: r.description || '',
            thumbnail: r.thumbnail_url || '/reels/reel_05.jpg',
            videoSrc: r.video_url || '/reels-videos/startup-potluck.mp4',
            instagramUrl: 'https://www.instagram.com/araneaden_/',
            aspectRatio: '9:16',
            likes: 'HD Reel',
            tag: 'AD IMPERIAL VISUALS',
          }));
          setReels(mapped);
        }
      })
      .catch(() => {});
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
          Left (Typography) + Right (Clean Horizontal Filter Options)
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Left Column: Typography */}
            <div className={styles.heroLeftCol}>
              <span className={styles.eyebrow}>OUR WORK</span>
              <h1 className={styles.heroTitle}>
                A COLLECTION OF DIGITAL EXPERIENCES.
              </h1>
              <p className={styles.heroSupportingText}>
                Websites, applications, and visual stories crafted by Aranea Den.
              </p>
            </div>

            {/* Right Column: Clean Text-Based Category Filters */}
            <div className={styles.heroRightCol}>
              <nav className={styles.filterNav} role="tablist" aria-label="Project categories">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === 'websites'}
                  className={`${styles.filterBtn} ${
                    activeCategory === 'websites' ? styles.filterBtnActive : ''
                  }`}
                  onClick={() =>
                    setActiveCategory((prev) => (prev === 'websites' ? 'all' : 'websites'))
                  }
                >
                  Websites
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === 'apps'}
                  className={`${styles.filterBtn} ${
                    activeCategory === 'apps' ? styles.filterBtnActive : ''
                  }`}
                  onClick={() =>
                    setActiveCategory((prev) => (prev === 'apps' ? 'all' : 'apps'))
                  }
                >
                  Apps
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === 'reels'}
                  className={`${styles.filterBtn} ${
                    activeCategory === 'reels' ? styles.filterBtnActive : ''
                  }`}
                  onClick={() =>
                    setActiveCategory((prev) => (prev === 'reels' ? 'all' : 'reels'))
                  }
                >
                  Ad Imperial Visuals
                </button>
              </nav>
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
                  {websites.map((project: WebsiteProject) => (
                    <a
                      key={project.id}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.websiteCard}
                      aria-label={`Visit live site: ${project.title}`}
                    >
                      <div className={styles.websiteThumbnailFrame}>
                        <img
                          src={project.thumbnail}
                          alt={`${project.title} live interface preview`}
                          className={styles.websiteImg}
                          loading="lazy"
                        />
                        <div className={styles.websiteOverlayGlow} aria-hidden="true" />
                      </div>

                      <div className={styles.websiteMeta}>
                        <span className={styles.websiteCategoryTag}>{project.category}</span>
                        <h3 className={styles.websiteTitle}>{project.title}</h3>
                        <span className={styles.websiteActionLink}>
                          <span>VIEW PROJECT</span>
                          <span className={styles.websiteActionArrow} aria-hidden="true">
                            →
                          </span>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                /* ── EDITORIAL VIEW (Horizontal Card Layout) ── */
                <div className={styles.websitesEditorialList}>
                  {websites.map((project: WebsiteProject) => (
                    <a
                      key={project.id}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.websiteEditorialCard}
                      aria-label={`Visit live site: ${project.title}`}
                    >
                      <div className={styles.websiteEditorialMedia}>
                        <img
                          src={project.thumbnail}
                          alt={`${project.title} screenshot`}
                          className={styles.websiteImg}
                          loading="lazy"
                        />
                      </div>

                      <div className={styles.websiteEditorialContent}>
                        <div className={styles.websiteEditorialTop}>
                          <span className={styles.editorialIndex}>{project.number} // {project.year}</span>
                          <span className={styles.websiteCategoryTag}>{project.category}</span>
                        </div>

                        <h3 className={styles.websiteTitle}>{project.title}</h3>
                        <p className={styles.editorialDescription}>{project.description}</p>

                        <div className={styles.tagsRow}>
                          {project.tags.map((tag) => (
                            <span key={tag} className={styles.tagPill}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className={styles.websiteActionLink}>
                          <span>VIEW PROJECT</span>
                          <span className={styles.websiteActionArrow} aria-hidden="true">
                            →
                          </span>
                        </span>
                      </div>
                    </a>
                  ))}
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
                  {apps.map((app: AppProject) => {
                    const isExternal = app.url?.startsWith('http');
                    const CardElement = isExternal ? 'a' : Link;
                    const linkProps = isExternal
                      ? { href: app.url, target: '_blank', rel: 'noopener noreferrer' }
                      : { to: app.url || '/services/mobile-development' };

                    return (
                      <CardElement
                        key={app.id}
                        {...(linkProps as any)}
                        className={styles.appCard}
                        aria-label={`View app project: ${app.name}`}
                      >
                        {/* Subtle Mobile Device Mockup Frame */}
                        <div className={styles.appDeviceFrame}>
                          <div className={styles.deviceIslandPill} aria-hidden="true" />
                          <img
                            src={app.thumbnail}
                            alt={`${app.name} interface preview`}
                            className={styles.appScreenImg}
                            loading="lazy"
                          />
                        </div>

                        <div className={styles.appMeta}>
                          <span className={styles.appPlatformTag}>{app.platform}</span>
                          <h3 className={styles.appTitle}>{app.name}</h3>
                          <span className={styles.appActionLink}>
                            <span>VIEW PROJECT</span>
                            <span className={styles.websiteActionArrow} aria-hidden="true">
                              →
                            </span>
                          </span>
                        </div>
                      </CardElement>
                    );
                  })}
                </div>
              ) : (
                /* ── EDITORIAL VIEW (Horizontal Card with Phone on Left) ── */
                <div className={styles.appsEditorialList}>
                  {apps.map((app: AppProject) => {
                    const isExternal = app.url?.startsWith('http');
                    const CardElement = isExternal ? 'a' : Link;
                    const linkProps = isExternal
                      ? { href: app.url, target: '_blank', rel: 'noopener noreferrer' }
                      : { to: app.url || '/services/mobile-development' };

                    return (
                      <CardElement
                        key={app.id}
                        {...(linkProps as any)}
                        className={styles.appEditorialCard}
                        aria-label={`View app project: ${app.name}`}
                      >
                        {/* Device Mockup */}
                        <div className={styles.appDeviceFrame}>
                          <div className={styles.deviceIslandPill} aria-hidden="true" />
                          <img
                            src={app.thumbnail}
                            alt={`${app.name} interface`}
                            className={styles.appScreenImg}
                            loading="lazy"
                          />
                        </div>

                        <div className={styles.websiteEditorialContent}>
                          <div className={styles.websiteEditorialTop}>
                            <span className={styles.editorialIndex}>{app.number} // {app.status}</span>
                            <span className={styles.appPlatformTag}>{app.platform}</span>
                          </div>

                          <h3 className={styles.appTitle}>{app.name}</h3>
                          <p className={styles.editorialDescription}>{app.description}</p>

                          <div className={styles.tagsRow}>
                            {app.tags.map((tag) => (
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
                      </CardElement>
                    );
                  })}
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
                  reels={reels}
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
                  {reels.map((reel: AraneaReel, index: number) => (
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
                  ))}
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
