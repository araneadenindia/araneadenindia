import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_WEBSITES } from '../../data/portfolioData';
import { ARANEA_REELS, AraneaReel } from '../../data/reelsData';
import styles from './SelectedWork.module.css';

gsap.registerPlugin(ScrollTrigger);

// Top 4 featured flagship websites on the homepage
const FEATURED_WEBSITES = PORTFOLIO_WEBSITES.filter((p) => p.featuredOnHome).slice(0, 4);

/* ─────────────────────────────────────────
   SINGLE REEL CARD — matches Services section style
───────────────────────────────────────── */
const ReelCard: React.FC<{ reel: AraneaReel }> = ({ reel }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {});
      }
    };

    startPlayback();

    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        rootMargin: '120px 60px 120px 60px',
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
    };
  }, [reel.videoSrc]);

  return (
    <a
      ref={cardRef}
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.reelCard}
      aria-label={`Watch reel: ${reel.title}`}
    >
      <div className={styles.reelMedia}>
        <img
          src={reel.thumbnail}
          alt={reel.title}
          loading="lazy"
          className={`${styles.reelPoster} ${isVideoLoaded ? styles.posterHidden : ''}`}
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
          className={styles.reelVideo}
          onPlaying={() => setIsVideoLoaded(true)}
        />
        {/* Bottom-left red bloom overlay + title */}
        <div className={styles.cleanReelOverlay}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.cleanReelInstaIcon} aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className={styles.cleanReelLabel}>{reel.client || reel.title}</span>
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────
   REEL MARQUEE — continuous auto-scroll carousel
   Identical to Services section SmoothReelMarquee
───────────────────────────────────────── */
const ReelMarquee: React.FC = () => {
  // Duplicate reels so the CSS animation loops seamlessly
  const doubled = useMemo(() => [...ARANEA_REELS, ...ARANEA_REELS], []);

  return (
    <div className={styles.reelMarqueeOuter}>
      <div className={styles.reelMarqueeViewport}>
        <div className={styles.reelMarqueeTrack}>
          {doubled.map((reel, idx) => (
            <div key={`${reel.id}-${idx}`} className={styles.reelMarqueeCardWrapper}>
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<'websites' | 'reels'>('websites');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
          }
        );
      }

      const items = listRef.current?.querySelectorAll(`.${styles.projectItem}`);
      if (items && items.length > 0) {
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: { trigger: item, start: 'top 84%' },
            }
          );
        });
      }

      // Pause continuous marquee when SelectedWork section leaves viewport to save GPU/CPU cycles
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => section.classList.remove(styles.isPaused),
        onLeave: () => section.classList.add(styles.isPaused),
        onEnterBack: () => section.classList.remove(styles.isPaused),
        onLeaveBack: () => section.classList.add(styles.isPaused),
      });
    }, section);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section ref={sectionRef} id="work" className={styles.section} aria-label="What We've Built">
      <div className={styles.container}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.crimsonMarker} aria-hidden="true" />
          <span className={styles.eyebrowText}>WHAT WE'VE BUILT</span>
        </div>

        {/* Section Headline */}
        <div ref={headerRef} className={styles.header}>
          <h2 className={styles.headline}>
            FLAGSHIP WEBSITES AND SHOOTS BY ARANEA DEN.
          </h2>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs} role="tablist" aria-label="Work Categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'websites'}
            className={`${styles.tabBtn} ${activeCategory === 'websites' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveCategory('websites')}
          >
            <span>FLAGSHIP WEBSITES</span>
            <span className={styles.tabBadge}>{FEATURED_WEBSITES.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'reels'}
            className={`${styles.tabBtn} ${activeCategory === 'reels' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveCategory('reels')}
          >
            <span>REEL SHOOTS (AD IMPERIAL VISUALS)</span>
            <span className={styles.tabBadge}>{ARANEA_REELS.length}</span>
          </button>
        </div>

        {/* Content */}
        <div ref={listRef}>
          {activeCategory === 'websites' ? (
            <div className={styles.projectsList}>
              {FEATURED_WEBSITES.map((project, index) => {
                const isEven = index % 2 === 1;
                return (
                  <article
                    key={project.id}
                    className={`${styles.projectItem} ${isEven ? styles.projectItemReverse : ''}`}
                  >
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.visualFrame}
                      aria-label={`Visit live site ${project.domain}`}
                    >
                      <div className={styles.imageWrapper}>
                        <img
                          src={project.thumbnail}
                          alt={`Landing page preview of ${project.title}`}
                          className={styles.screenshotImg}
                          loading="lazy"
                        />
                        <div className={styles.imageOverlay}>
                          <span className={styles.overlayPill}>
                            <span>VISIT LIVE PLATFORM</span>
                            <span aria-hidden="true">↗</span>
                          </span>
                        </div>
                      </div>
                      <div className={styles.floatingDomainBadge}>
                        <span className={styles.domainDot} aria-hidden="true" />
                        <span className={styles.domainText}>{project.domain}</span>
                        <span className={styles.domainArrow} aria-hidden="true">↗</span>
                      </div>
                    </a>

                    <div className={styles.metaCol}>
                      <div className={styles.metaTop}>
                        <span className={styles.projectIndex}>0{index + 1} // 04</span>
                        <span className={styles.projectCategory}>{project.category}</span>
                      </div>
                      <h3 className={styles.projectTitle}>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
                          {project.title}
                        </a>
                      </h3>
                      <p className={styles.projectDescription}>{project.metaDescription}</p>
                      <div className={styles.tagsRow}>
                        {project.tags.map((tag) => (
                          <span key={tag} className={styles.tagPill}>{tag}</span>
                        ))}
                      </div>
                      <div className={styles.actionRow}>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.visitLink}>
                          <span>VISIT LIVE PLATFORM</span>
                          <span className={styles.arrowIcon} aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Reel Shoots — Continuous Marquee Carousel (same as Services section) */
            <ReelMarquee />
          )}
        </div>

        {/* View All CTA */}
        <div className={styles.archiveCtaWrap}>
          <Link to="/portfolio" className={styles.archiveLink}>
            <span className={styles.archiveLinkText}>VIEW ALL 11 CLIENT PLATFORMS &amp; REELS</span>
            <span className={styles.archiveArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
