import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ALL_SERVICES,
  SERVICE_CATEGORIES,
  ServiceCategory,
  ServiceItem,
} from '../../data/servicesData';
import styles from './ServicesPage.module.css';

gsap.registerPlugin(ScrollTrigger);

type ViewMode = 'split' | 'grid';

/* ── Minimal Line Icons for each service ── */
const ServiceIcon: React.FC<{ id: string }> = ({ id }) => {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: styles.scIcon,
    'aria-hidden': true,
  };

  switch (id) {
    case 'web-development':
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="18" rx="3" />
          <path d="m9 10-3 3 3 3" />
          <path d="m15 10 3 3-3 3" />
          <line x1="2" y1="8" x2="22" y2="8" />
        </svg>
      );
    case 'mobile-app-development':
      return (
        <svg {...props}>
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
        </svg>
      );
    case 'digital-marketing':
      return (
        <svg {...props}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 'social-media-management':
      return (
        <svg {...props}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'meta-google-instagram-ads':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'google-business-profile':
      return (
        <svg {...props}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'videography':
      return (
        <svg {...props}>
          <path d="m22 8-6 4 6 4V8Z" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      );
    case 'photography':
      return (
        <svg {...props}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case 'video-editing':
      return (
        <svg {...props}>
          <polygon points="5 3 19 12 5 21 5 3" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      );
    case 'poster-graphic-design':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case 'ad-imperial-visuals':
      return (
        <svg {...props}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <polygon points="10 9 15 12 10 15 10 9" />
        </svg>
      );
    case 'iot-prototyping':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      );
    case 'hackathons-updates':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'workshops-training':
      return (
        <svg {...props}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};

/* ── Individual Stacking Split Card ── */
interface SplitCardProps {
  service: ServiceItem;
  index: number;
  total: number;
}

const SplitCard: React.FC<SplitCardProps> = ({ service, index, total }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numStr = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  // Stepped sticky offset so cards stack like a neat physical deck of cards
  const stackOffset = Math.min(index, 7) * 10;

  return (
    <div
      ref={cardRef}
      className={styles.stackCardWrapper}
      style={{
        top: `calc(clamp(85px, 12vh, 110px) + ${stackOffset}px)`,
        zIndex: index + 1,
      }}
    >
      <article
        id={service.id}
        className={styles.splitCard}
        aria-labelledby={`sc-title-${service.id}`}
      >
        {/* LEFT PANEL — Content */}
        <div className={styles.splitContent}>
          {/* Header Row: Number + Icon + Category */}
          <div className={styles.scMetaRow}>
            <div className={styles.scMetaLeft}>
              <span className={styles.scNum}>
                {numStr} <span className={styles.scNumTotal}>/ {totalStr}</span>
              </span>
              <span className={styles.scCat}>{service.category}</span>
            </div>
            <div className={styles.scIconWrap}>
              <ServiceIcon id={service.id} />
            </div>
          </div>

          {/* Service Title */}
          <h3 id={`sc-title-${service.id}`} className={styles.scTitle}>
            {service.title}
          </h3>

          {/* Short Description */}
          <p className={styles.scDescription}>{service.description}</p>

          {/* Deliverable Tags */}
          <div className={styles.scDeliverables} aria-label="Key Deliverables">
            {service.deliverables.map((d) => (
              <span key={d} className={styles.scPill}>
                {d}
              </span>
            ))}
          </div>

          {/* CTA Link */}
          <div className={styles.scCtaWrapper}>
            <Link
              to={service.actionUrl || `/contact?service=${service.id}`}
              className={styles.scCta}
              aria-label={`Explore ${service.title} service`}
            >
              <span>EXPLORE SERVICE</span>
              <span className={styles.scCtaArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL — Visual */}
        <div className={styles.splitMedia}>
          <img
            src={service.image}
            alt={`${service.title} — Aranea Den`}
            className={styles.splitImage}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <div className={styles.splitMediaOverlay} />
          {service.badge && (
            <span
              className={`${styles.splitBadge} ${
                service.id === 'ad-imperial-visuals' ? styles.badgeCrimson : ''
              }`}
            >
              {service.badge}
            </span>
          )}
        </div>
      </article>
    </div>
  );
};

/* ── Main ServicesPage Component ── */
export const ServicesPage: React.FC = () => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Handle URL deep-linking
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (
      path.includes('web-development') ||
      path.includes('mobile-development') ||
      path.includes('ui-ux-design')
    ) {
      setActiveCategory('digital-products');
    } else if (path.includes('digital-marketing')) {
      setActiveCategory('marketing-growth');
    } else if (path.includes('video-production')) {
      setActiveCategory('visual-production');
    }
  }, [location.pathname]);

  const displayedServices =
    activeCategory === 'all'
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.categorySlug === activeCategory);

  // Set document title and scroll to top on mount
  useEffect(() => {
    document.title = 'SERVICES — ARANEA DEN | Digital Experiences. Built to Connect.';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Hero entrance animation
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const els = hero.querySelectorAll('[data-hero-el]');
      gsap.fromTo(
        els,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  // GSAP Card Stacking Scale & Dim Effect for Split View
  useEffect(() => {
    if (viewMode !== 'split' || !stackContainerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const wrappers = stackContainerRef.current.querySelectorAll(
      `.${styles.stackCardWrapper}`
    );
    if (wrappers.length <= 1) return;

    const ctx = gsap.context(() => {
      wrappers.forEach((wrapper, i) => {
        // Only scale down if there's a card after it
        if (i < wrappers.length - 1) {
          const nextWrapper = wrappers[i + 1];
          const innerCard = wrapper.querySelector(`.${styles.splitCard}`);

          if (innerCard) {
            gsap.to(innerCard, {
              scale: 0.96,
              filter: 'brightness(0.92)',
              ease: 'none',
              scrollTrigger: {
                trigger: nextWrapper,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 0.4,
              },
            });
          }
        }
      });
    }, stackContainerRef.current);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [viewMode, activeCategory]);

  // Grid view entrance animation
  useEffect(() => {
    if (viewMode !== 'grid' || !gridContainerRef.current) return;
    const cards = gridContainerRef.current.querySelectorAll(`.${styles.gridCard}`);
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
  }, [viewMode, activeCategory]);

  // CTA scroll trigger animation
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cta.querySelector(`.${styles.ctaInner}`),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: cta, start: 'top 82%' },
        }
      );
    }, cta);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      {/* ─────────────────────────────────────────────────────────────
          01 — HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className={styles.hero} aria-labelledby="services-page-heading">
        {/* Spider Web SVG Backdrop */}
        <svg className={styles.heroWeb} viewBox="0 0 700 700" fill="none" aria-hidden="true">
          <circle cx="350" cy="350" r="310" stroke="#DF2531" strokeWidth="1.1" strokeDasharray="8 6" opacity="0.45" />
          <circle cx="350" cy="350" r="235" stroke="#0B0B0C" strokeWidth="0.8" opacity="0.3" />
          <circle cx="350" cy="350" r="160" stroke="#DF2531" strokeWidth="0.8" opacity="0.35" />
          <circle cx="350" cy="350" r="88" stroke="#0B0B0C" strokeWidth="0.9" opacity="0.22" />
          <circle cx="350" cy="350" r="32" stroke="#DF2531" strokeWidth="1.4" opacity="0.55" />
          <line x1="40" y1="350" x2="660" y2="350" stroke="#0B0B0C" strokeWidth="0.6" opacity="0.25" />
          <line x1="350" y1="40" x2="350" y2="660" stroke="#0B0B0C" strokeWidth="0.6" opacity="0.25" />
          <line x1="130" y1="130" x2="570" y2="570" stroke="#DF2531" strokeWidth="0.6" opacity="0.3" />
          <line x1="130" y1="570" x2="570" y2="130" stroke="#DF2531" strokeWidth="0.6" opacity="0.3" />
          <line x1="350" y1="40" x2="660" y2="570" stroke="#0B0B0C" strokeWidth="0.4" opacity="0.15" />
          <line x1="350" y1="40" x2="40" y2="570" stroke="#0B0B0C" strokeWidth="0.4" opacity="0.15" />
          <circle cx="350" cy="350" r="5" fill="#DF2531" opacity="0.85" />
        </svg>

        <div className={styles.heroContainer}>
          <nav data-hero-el className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              HOME
            </Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbActive}>SERVICES</span>
          </nav>

          <div data-hero-el className={styles.heroEyebrow}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>COMPREHENSIVE CAPABILITIES</span>
          </div>

          <h1 data-hero-el id="services-page-heading" className={styles.heroHeading}>
            WHAT WE DO
          </h1>

          <p data-hero-el className={styles.heroSub}>
            From digital products and brand experiences to content, campaigns, and emerging
            technology — we connect every discipline to help businesses move forward.
          </p>

          {/* Quick Metrics */}
          <div data-hero-el className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNum}>14</span>
              <span className={styles.statLabel}>Services</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>Disciplines</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.statNum}>1</span>
              <span className={styles.statLabel}>Studio</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02 — MAIN SERVICE SECTION (SPLIT VIEW + GRID VIEW)
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.servicesSection} aria-label="Services Collection">
        <div className={styles.container}>
          {/* Controls Bar: Categories & View Switcher */}
          <div className={styles.controlsBar}>
            {/* Category Filter Navigation */}
            <div
              className={styles.filterBar}
              role="tablist"
              aria-label="Filter Services by Category"
            >
              {SERVICE_CATEGORIES.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.filterBtn} ${
                      isActive ? styles.filterBtnActive : ''
                    }`}
                    onClick={() => setActiveCategory(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className={styles.filterCount}>{tab.count}</span>
                  </button>
                );
              })}
            </div>

            {/* View Switcher: SPLIT VIEW + GRID VIEW */}
            <div className={styles.viewToggle} role="group" aria-label="View Switcher">
              <button
                className={`${styles.viewBtn} ${
                  viewMode === 'split' ? styles.viewBtnActive : ''
                }`}
                onClick={() => setViewMode('split')}
                aria-pressed={viewMode === 'split'}
                title="Split View (Pack of Cards Stacking)"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="1" y="2" width="13" height="4" rx="1" fill="currentColor" />
                  <rect x="1" y="9" width="13" height="4" rx="1" fill="currentColor" />
                </svg>
                <span>SPLIT VIEW</span>
              </button>
              <button
                className={`${styles.viewBtn} ${
                  viewMode === 'grid' ? styles.viewBtnActive : ''
                }`}
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                title="Grid View (3-Column Grid)"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
                  <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
                  <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
                  <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
                </svg>
                <span>GRID VIEW</span>
              </button>
            </div>
          </div>

          {/* ── OPTION A: SPLIT VIEW (DEFAULT: PACK OF CARDS STACKING) ── */}
          {viewMode === 'split' && (
            <div
              ref={stackContainerRef}
              className={styles.stackContainer}
              aria-label="Split View Service Cards"
            >
              {displayedServices.map((service, idx) => (
                <SplitCard
                  key={`${service.id}-${activeCategory}`}
                  service={service}
                  index={idx}
                  total={displayedServices.length}
                />
              ))}
            </div>
          )}

          {/* ── OPTION B: GRID VIEW ── */}
          {viewMode === 'grid' && (
            <div
              ref={gridContainerRef}
              className={styles.gridContainer}
              aria-label="Grid View Service Cards"
            >
              {displayedServices.map((service) => (
                <article
                  key={service.id}
                  id={`grid-${service.id}`}
                  className={styles.gridCard}
                  aria-labelledby={`gc-title-${service.id}`}
                >
                  <div className={styles.gcMedia}>
                    <img
                      src={service.image}
                      alt={`${service.title} — Aranea Den`}
                      className={styles.gcImage}
                      loading="lazy"
                    />
                    <div className={styles.gcOverlay} />
                    {service.badge && (
                      <span
                        className={`${styles.gcBadge} ${
                          service.id === 'ad-imperial-visuals' ? styles.badgeCrimson : ''
                        }`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <div className={styles.gcBody}>
                    <div className={styles.gcMeta}>
                      <span className={styles.gcIndex}>// {service.number}</span>
                      <span className={styles.gcCat}>{service.category}</span>
                    </div>
                    <h3 id={`gc-title-${service.id}`} className={styles.gcTitle}>
                      {service.title}
                    </h3>
                    <p className={styles.gcDesc}>{service.description}</p>
                    <div className={styles.gcDeliverables}>
                      {service.deliverables.slice(0, 3).map((d) => (
                        <span key={d} className={styles.gcPill}>
                          {d}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={service.actionUrl || `/contact?service=${service.id}`}
                      className={styles.gcCta}
                      aria-label={`Explore ${service.title}`}
                    >
                      <span>EXPLORE SERVICE</span>
                      <span className={styles.gcArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03 — CLOSING PROJECT INQUIRY CTA
          ───────────────────────────────────────────────────────────── */}
      <section ref={ctaRef} className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className={styles.ctaGlow} />
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaEyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>LET'S BUILD SOMETHING MEANINGFUL</span>
            </div>
            <h2 id="cta-heading" className={styles.ctaHeading}>
              HAVE A PROJECT TO CONNECT?
            </h2>
            <p className={styles.ctaSub}>
              Tell us what you're building. We'll bring the strategy, creativity, and
              technology to bring it to life.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.ctaPrimary}>
                <span>START A PROJECT</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/portfolio" className={styles.ctaSecondary}>
                <span>VIEW OUR WORK</span>
              </Link>
            </div>
          </div>

          <div className={styles.ctaMeta}>
            <a href="mailto:contact@araneaden.com" className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>DIRECT INQUIRIES</span>
              <span className={styles.ctaMetaVal}>contact@araneaden.com</span>
            </a>
            <div className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>STUDIO LOCATION</span>
              <span className={styles.ctaMetaVal}>Hyderabad, Telangana, India</span>
            </div>
            <div className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>RESPONSE VELOCITY</span>
              <span className={styles.ctaMetaVal}>&lt; 24 Hours Guaranteed</span>
            </div>
            <Link to="/contact" className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>DISCOVERY SESSION</span>
              <span className={styles.ctaMetaVal}>Book a Consultation →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
