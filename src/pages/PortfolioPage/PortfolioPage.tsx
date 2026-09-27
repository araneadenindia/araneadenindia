import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  REQUIRED_WEBSITES,
  REQUIRED_MARKETING_PROJECTS,
  WebsiteShowcaseProject,
  MarketingProject,
} from '../../data/portfolioData';
import { ARANEA_REELS, AraneaReel } from '../../data/reelsData';
import styles from './PortfolioPage.module.css';

gsap.registerPlugin(ScrollTrigger);

interface CategoryItem {
  id: string;
  num: string;
  label: string;
  badge: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'websites', num: '01', label: 'WEBSITES', badge: '03' },
  { id: 'apps', num: '02', label: 'APPS', badge: 'IN DEV' },
  { id: 'digital-marketing', num: '03', label: 'DIGITAL MARKETING', badge: '05' },
  { id: 'ad-imperial-visuals', num: '04', label: 'AD IMPERIAL VISUALS', badge: 'REELS' },
];

export const PortfolioPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('websites');
  const [activeModalVideo, setActiveModalVideo] = useState<{
    src: string;
    title: string;
    caption?: string;
    client?: string;
  } | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const spiderRef = useRef<HTMLDivElement>(null);
  const navTabsRef = useRef<HTMLDivElement>(null);

  // Reposition spider onto the active category tab
  const moveSpiderToTab = useCallback((categoryId: string, immediate = false) => {
    if (!spiderRef.current || !navTabsRef.current) return;
    const tabEl = navTabsRef.current.querySelector<HTMLButtonElement>(
      `button[data-cat="${categoryId}"]`
    );
    if (!tabEl) return;

    const railEl = spiderRef.current.parentElement;
    if (!railEl) return;
    const railRect = railEl.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();
    const targetX = tabRect.left - railRect.left + tabRect.width / 2;

    if (immediate) {
      gsap.set(spiderRef.current, { x: targetX, y: 0 });
    } else {
      gsap.killTweensOf(spiderRef.current);
      gsap.to(spiderRef.current, {
        x: targetX,
        duration: 0.55,
        ease: 'power3.out',
      });
      // Subtle vertical bob simulating silk spring suspension
      gsap.fromTo(
        spiderRef.current,
        { y: -4 },
        { y: 0, duration: 0.45, ease: 'bounce.out', delay: 0.1 }
      );
    }
  }, []);

  // Update spider position whenever active category changes
  useEffect(() => {
    moveSpiderToTab(activeCategory);
  }, [activeCategory, moveSpiderToTab]);

  // Handle window resize to keep spider aligned
  useEffect(() => {
    const handleResize = () => moveSpiderToTab(activeCategory, true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeCategory, moveSpiderToTab]);

  // Setup GSAP ScrollTrigger for section scroll synchronization & entrance animations
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // Synchronize active category with scroll position
      CATEGORIES.forEach((cat) => {
        const section = document.getElementById(cat.id);
        if (section) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 40%',
            end: 'bottom 40%',
            onEnter: () => setActiveCategory(cat.id),
            onEnterBack: () => setActiveCategory(cat.id),
          });
        }
      });

      // Website row reveals
      const websiteRows = page.querySelectorAll(`.${styles.websiteRow}`);
      websiteRows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
            },
          }
        );
      });

      // Marketing cards reveals
      const marketingCards = page.querySelectorAll(`.${styles.marketingCard}`);
      gsap.fromTo(
        marketingCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#digital-marketing',
            start: 'top 80%',
          },
        }
      );

      // Reels card reveals
      const reelCards = page.querySelectorAll(`.${styles.reelCard}`);
      gsap.fromTo(
        reelCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#ad-imperial-visuals',
            start: 'top 80%',
          },
        }
      );
    }, page);

    // Initial position of spider
    setTimeout(() => {
      moveSpiderToTab(activeCategory, true);
    }, 150);

    return () => ctx.revert();
  }, [moveSpiderToTab]);

  // Close modal on Escape key press
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

  const handleTabClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const targetSection = document.getElementById(categoryId);
    if (targetSection) {
      const navOffset = 130;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={pageRef} className={styles.portfolioPage}>
      {/* ─────────────────────────────────────────────────────────────
          01 — COMPACT EDITORIAL HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.heroSection}>
        {/* Subtle Arachnid Web Backdrop SVG */}
        <svg
          className={styles.heroWebSvg}
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="250" cy="250" r="60" stroke="#0B0B0C" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="120" stroke="#0B0B0C" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="250" cy="250" r="180" stroke="#0B0B0C" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="250" cy="250" r="240" stroke="#0B0B0C" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="250" y1="10" x2="250" y2="490" stroke="#0B0B0C" strokeWidth="1" />
          <line x1="10" y1="250" x2="490" y2="250" stroke="#0B0B0C" strokeWidth="1" />
          <line x1="80" y1="80" x2="420" y2="420" stroke="#0B0B0C" strokeWidth="1" />
          <line x1="420" y1="80" x2="80" y2="420" stroke="#0B0B0C" strokeWidth="1" />
        </svg>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Breadcrumb Navigation */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/" className={styles.breadcrumbLink}>
                HOME
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbActive}>PORTFOLIO</span>
            </nav>

            {/* Editorial Eyebrow */}
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>SELECTED WORKS</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.heroTitle}>WHAT WE'VE BUILT.</h1>

            {/* Concise Supporting Text */}
            <p className={styles.heroSupportingText}>
              An architectural catalog of engineered web applications, mobile platforms, brand
              identities, and high-dynamic social storytelling crafted for industry leaders. Live
              production links included.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SHOWCASE CONTENT WRAPPER (NAV + 4 SECTIONS)
          ───────────────────────────────────────────────────────────── */}
      <div className={styles.showcaseSectionWrapper}>
        {/* ─────────────────────────────────────────────────────────────
            02 & 03 — INTERACTIVE SPIDER STICKY CATEGORY NAVIGATION
            ───────────────────────────────────────────────────────────── */}
        <nav
          className={styles.categoryNavWrapper}
          aria-label="Portfolio Category Navigation"
        >
        <div className={styles.container}>
          {/* Silk Thread & Vector Spider Track */}
          <div className={styles.spiderTrackRail} aria-hidden="true">
            <div className={styles.silkThreadLine} />
            <div ref={spiderRef} className={styles.spiderNavigator}>
              <svg
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.spiderSvg}
              >
                {/* Spider Silk Drop Line */}
                <line
                  x1="14"
                  y1="0"
                  x2="14"
                  y2="7"
                  stroke="#DF2531"
                  strokeWidth="1.5"
                  strokeDasharray="1.5 1.5"
                />

                {/* Left Legs */}
                <path
                  d="M12 12 C8 8, 4 9, 2 12"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M12 14 C7 12, 3 15, 1 18"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M12 16 C8 17, 4 20, 2 24"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M13 18 C10 21, 6 24, 4 27"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />

                {/* Right Legs */}
                <path
                  d="M16 12 C20 8, 24 9, 26 12"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M16 14 C21 12, 25 15, 27 18"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M16 16 C20 17, 24 20, 26 24"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <path
                  d="M15 18 C18 21, 22 24, 24 27"
                  stroke="#0B0B0C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />

                {/* Cephalothorax */}
                <ellipse cx="14" cy="11.5" rx="2.5" ry="3" fill="#0B0B0C" />
                {/* Abdomen */}
                <ellipse cx="14" cy="17" rx="3.5" ry="4.5" fill="#0B0B0C" />
                {/* Crimson Hourglass Marking */}
                <path
                  d="M13 15 L15 15 L14 16.5 L15 18 L13 18 L14 16.5 Z"
                  fill="#DF2531"
                />
                {/* Arachnid Ocelli (Eyes) */}
                <circle cx="13" cy="9.5" r="0.6" fill="#DF2531" />
                <circle cx="15" cy="9.5" r="0.6" fill="#DF2531" />
              </svg>
            </div>
          </div>

          {/* Category Tabs Pill Row */}
          <div ref={navTabsRef} className={styles.categoryTabsRow} role="tablist">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  data-cat={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.categoryTabBtn} ${
                    isActive ? styles.categoryTabActive : ''
                  }`}
                  onClick={() => handleTabClick(cat.id)}
                >
                  <span className={styles.tabNum}>{cat.num}</span>
                  <span>{cat.label}</span>
                  <span className={styles.tabBadge}>{cat.badge}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 01 — WEBSITES (ALTERNATING LEFT/RIGHT SHOWCASE)
          ───────────────────────────────────────────────────────────── */}
      <section id="websites" className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categoryHeaderBlock}>
            <div className={styles.categoryEyebrow}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>01 / WEBSITES</span>
            </div>
            <h2 className={styles.categorySectionTitle}>ENGINEERED PLATFORMS.</h2>
            <p className={styles.categorySectionSubtitle}>
              High-performance, bespoke web architectures crafted for speed, seamless
              conversions, and lasting brand resonance.
            </p>
          </div>

          <div className={styles.websitesShowcaseList}>
            {REQUIRED_WEBSITES.map((site: WebsiteShowcaseProject) => {
              const isReverse = site.layout === 'image-right';
              return (
                <article
                  key={site.id}
                  className={`${styles.websiteRow} ${
                    isReverse ? styles.websiteRowReverse : ''
                  }`}
                >
                  {/* Browser Mockup Media Column */}
                  <div className={styles.websiteMediaCol}>
                    <div className={styles.websiteBrowserFrame}>
                      {/* Browser Chrome Header */}
                      <div className={styles.browserTopBar}>
                        <div className={styles.browserDots}>
                          <span
                            className={`${styles.browserDot} ${styles.browserDotRed}`}
                          />
                          <span
                            className={`${styles.browserDot} ${styles.browserDotYellow}`}
                          />
                          <span
                            className={`${styles.browserDot} ${styles.browserDotGreen}`}
                          />
                        </div>
                        <div className={styles.browserUrlPill}>
                          {site.url.replace(/^https?:\/\//, '')}
                        </div>
                      </div>

                      {/* Interactive Website Preview */}
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.websiteImgWrapper}
                        aria-label={`Visit live platform for ${site.title}`}
                      >
                        <img
                          src={site.thumbnail}
                          alt={`${site.title} preview`}
                          className={styles.websiteImg}
                          loading="lazy"
                        />
                      </a>
                    </div>
                  </div>

                  {/* Project Editorial Info Column */}
                  <div className={styles.websiteInfoCol}>
                    <div className={styles.websiteMetaTag}>
                      {site.number} — {site.category}
                    </div>

                    <h3 className={styles.websiteTitle}>{site.title}</h3>

                    <p className={styles.websiteDesc}>{site.description}</p>

                    <div className={styles.tagsContainer}>
                      {site.tags.map((tag) => (
                        <span key={tag} className={styles.tagPill}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewProjectBtn}
                      aria-label={`Launch live platform for ${site.title}`}
                    >
                      <span>VISIT LIVE PLATFORM</span>
                      <span className={styles.viewProjectArrow} aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 02 — APPS (ARCHITECTURAL PLACEHOLDER)
          ───────────────────────────────────────────────────────────── */}
      <section id="apps" className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categoryHeaderBlock}>
            <div className={styles.categoryEyebrow}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>02 / APPS</span>
            </div>
            <h2 className={styles.categorySectionTitle}>MOBILE ECOSYSTEMS.</h2>
            <p className={styles.categorySectionSubtitle}>
              Native iOS and Android engineering engineered with tactile haptics, offline-first
              resilience, and modern fluid ergonomics.
            </p>
          </div>

          <div className={styles.appsPlaceholderCard}>
            {/* Device Wireframe Mockup */}
            <div className={styles.appsVisualMockup}>
              <div className={styles.phoneWireframeFrame}>
                <div className={styles.phoneIslandMock} />
                <div className={styles.phoneScreenContentMock}>
                  <div className={styles.phoneWireHero}>
                    <img
                      src="/AD Transparent SVG.svg"
                      alt="Aranea Den"
                      className={styles.phoneWireLogo}
                    />
                  </div>
                  <div className={styles.phoneWireBlock} style={{ width: '85%' }} />
                  <div className={styles.phoneWireBlock} style={{ width: '60%' }} />
                  <div className={styles.phoneWireBlock} style={{ width: '92%' }} />
                  <div
                    className={styles.phoneWireBlock}
                    style={{
                      width: '100%',
                      marginTop: 'auto',
                      height: '36px',
                      background: 'rgba(223, 37, 49, 0.2)',
                      border: '1px solid rgba(223, 37, 49, 0.4)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Architecture Details */}
            <div className={styles.appsPlaceholderContent}>
              <div className={styles.appStatusPill}>
                <span className={styles.pulseDot} />
                <span>PLATFORMS IN ACTIVE DEVELOPMENT</span>
              </div>

              <h3 className={styles.appsPlaceholderHeading}>
                CLIENT MOBILE SUITES LAUNCHING SOON
              </h3>

              <p className={styles.appsPlaceholderText}>
                We are actively engineering cross-platform and native mobile software for our
                enterprise clientele. Projects span real-time operational hubs, customer loyalty
                ecosystems, and high-security transactional portals.
              </p>

              <div className={styles.appSpecsRow}>
                <div className={styles.appSpecBadge}>iOS (Swift / SwiftUI)</div>
                <div className={styles.appSpecBadge}>Android (Kotlin)</div>
                <div className={styles.appSpecBadge}>Cross-Platform (React Native)</div>
                <div className={styles.appSpecBadge}>Offline-First SQLite</div>
                <div className={styles.appSpecBadge}>Biometric Security</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 03 — DIGITAL MARKETING (5 PROJECTS)
          ───────────────────────────────────────────────────────────── */}
      <section id="digital-marketing" className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categoryHeaderBlock}>
            <div className={styles.categoryEyebrow}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>03 / DIGITAL MARKETING</span>
            </div>
            <h2 className={styles.categorySectionTitle}>GROWTH & DIGITAL CAMPAIGNS.</h2>
            <p className={styles.categorySectionSubtitle}>
              Strategic market positioning, data-backed audience growth, and high-converting creative
              campaigns executed across regional and national landscapes.
            </p>
          </div>

          <div className={styles.marketingGrid}>
            {REQUIRED_MARKETING_PROJECTS.map((proj: MarketingProject, index: number) => {
              const isFifth = index === 4;
              return (
                <article
                  key={proj.id}
                  className={`${styles.marketingCard} ${
                    isFifth ? styles.marketingCardFeatured : ''
                  }`}
                >
                  {/* Campaign Media Canvas */}
                  <div
                    className={styles.marketingMedia}
                    style={{ cursor: proj.videoSrc ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (proj.videoSrc) {
                        setActiveModalVideo({
                          src: proj.videoSrc,
                          title: `${proj.name} — Campaign Video`,
                          client: proj.client,
                          caption: proj.description,
                        });
                      }
                    }}
                  >
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className={styles.marketingImg}
                      loading="lazy"
                    />

                    {/* Client Official Logo Overlay */}
                    {proj.logo && (
                      <div className={styles.marketingLogoOverlay}>
                        <img
                          src={proj.logo}
                          alt={proj.client}
                          className={styles.marketingLogoImg}
                        />
                      </div>
                    )}

                    {/* Play Button Indicator if video available */}
                    {proj.videoSrc && (
                      <div className={styles.reelPlayOverlay}>
                        <div className={styles.playCircleBtn} aria-label="Play Campaign Reel">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Editorial Body Content */}
                  <div className={styles.marketingBody}>
                    <div className={styles.marketingMetaRow}>
                      <span className={styles.marketingIndex}>{proj.number}</span>
                      <span className={styles.marketingCategoryTag}>{proj.category}</span>
                    </div>

                    <h3 className={styles.marketingTitle}>{proj.name}</h3>

                    <p className={styles.marketingDesc}>{proj.description}</p>

                    <div className={styles.tagsContainer}>
                      {proj.tags.map((tag) => (
                        <span key={tag} className={styles.tagPill}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 04 — AD IMPERIAL VISUALS (VERTICAL REELS SHOWCASE)
          ───────────────────────────────────────────────────────────── */}
      <section id="ad-imperial-visuals" className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categoryHeaderBlock}>
            <div className={styles.categoryEyebrow}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>04 / AD IMPERIAL VISUALS</span>
            </div>
            <h2 className={styles.categorySectionTitle}>VERTICAL CINEMATICS.</h2>
            <p className={styles.categorySectionSubtitle}>
              High-impact 9:16 cinematography, sensory culinary reels, executive summit broadcasts,
              and viral founder pitch choreography.
            </p>
          </div>

          <div className={styles.reelsGrid}>
            {ARANEA_REELS.map((reel: AraneaReel) => (
              <article
                key={reel.id}
                className={styles.reelCard}
                onClick={() =>
                  setActiveModalVideo({
                    src: reel.videoSrc,
                    title: reel.title,
                    caption: reel.caption,
                    client: reel.client,
                  })
                }
              >
                {/* 9:16 Vertical Video Frame */}
                <div className={styles.reelMediaFrame}>
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className={styles.reelThumbnail}
                    loading="lazy"
                  />

                  {/* Play Overlay */}
                  <div className={styles.reelPlayOverlay}>
                    <div
                      className={styles.playCircleBtn}
                      aria-label={`Play ${reel.title}`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Badge & Engagement Metas */}
                  <span className={styles.reelBadgeTag}>
                    {reel.tag || reel.aspectRatio}
                  </span>

                  {reel.likes && (
                    <span className={styles.reelLikesBadge}>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{reel.likes}</span>
                    </span>
                  )}
                </div>

                {/* Card Editorial Info */}
                <div className={styles.reelCardBody}>
                  <div className={styles.reelClientText}>{reel.client}</div>
                  <h4 className={styles.reelTitle}>{reel.title}</h4>
                  <p className={styles.reelCaption}>{reel.caption}</p>

                  <a
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.reelInstaBtn}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Watch ${reel.title} on Instagram`}
                  >
                    <span>WATCH ON INSTAGRAM</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          05 — CLOSING COLLABORATION CALL TO ACTION
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.eyebrow} style={{ justifyContent: 'center' }}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText} style={{ color: '#DF2531' }}>
                START A COLLABORATION
              </span>
            </div>

            <h2 className={styles.ctaHeading}>HAVE A PROJECT TO BUILD?</h2>

            <p className={styles.ctaSubtext}>
              From custom web architectures and native mobile ecosystems to commercial video
              campaigns, let's architect your brand's next digital milestone.
            </p>

            <Link to="/contact" className={styles.ctaBtnPrimary}>
              <span>COMMISSION A PROJECT</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTERACTIVE CINEMATIC VIDEO MODAL
          ───────────────────────────────────────────────────────────── */}
      {activeModalVideo && (
        <div
          className={styles.videoModalBackdrop}
          onClick={() => setActiveModalVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeModalVideo.title}
        >
          <div
            className={styles.videoModalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.videoModalCloseBtn}
              onClick={() => setActiveModalVideo(null)}
              aria-label="Close video player"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <video
              src={activeModalVideo.src}
              controls
              autoPlay
              playsInline
              className={styles.videoPlayerElement}
            />

            <div className={styles.videoModalFooter}>
              {activeModalVideo.client && (
                <div className={styles.reelClientText}>
                  {activeModalVideo.client}
                </div>
              )}
              <h3 className={styles.videoModalTitle}>{activeModalVideo.title}</h3>
              {activeModalVideo.caption && (
                <p className={styles.videoModalCaption}>
                  {activeModalVideo.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
