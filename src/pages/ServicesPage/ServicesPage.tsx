import React, { useEffect, useRef, useState, useMemo } from 'react';
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

/* ─── Minimal SVG Line Icons for Each Service ─── */
const ServiceIcon: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  switch (serviceId) {
    case 'web-development':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case 'mobile-app-development':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case 'ui-ux-design':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case 'digital-marketing':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 'social-media-management':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'meta-google-instagram-ads':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'google-business-profile':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'videography':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'photography':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case 'video-editing':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      );
    case 'poster-graphic-design':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'ad-imperial-visuals':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <circle cx="12" cy="10" r="3" />
          <polygon points="11 9 14 10.5 11 12 11 9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'iot-prototyping':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      );
    case 'hackathons-updates':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'workshops-training':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};

/* ─── Stacked Split Card (Deck-of-Cards Scroll Experience) ─── */
interface SplitCardProps {
  service: ServiceItem;
  index: number;
  total: number;
}

const SplitCard: React.FC<SplitCardProps> = ({ service, index, total }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const image = imageRef.current;
    if (!wrapper || !card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance animation: smooth reveal as card scrolls into view
      gsap.fromTo(
        card,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            id: `entrance-${service.id}`,
            trigger: wrapper,
            start: 'top 88%',
            once: true,
          },
        }
      );

      if (image) {
        gsap.fromTo(
          image,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              id: `img-entrance-${service.id}`,
              trigger: wrapper,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

    }, wrapper);

    return () => {
      ctx.revert();
    };
  }, [service.id]);

  const numStr = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  return (
    <div
      ref={wrapperRef}
      className={styles.splitCardWrapper}
      style={{ '--stack-index': index + 1 } as React.CSSProperties}
    >
      <article
        ref={cardRef}
        id={service.id}
        className={styles.splitCard}
        aria-labelledby={`sc-title-${service.id}`}
      >
        {/* LEFT PANEL — CONTENT */}
        <div className={styles.splitContent}>
          {/* Header Row: Number + Category + Service Line Icon */}
          <div className={styles.scHeaderRow}>
            <div className={styles.scMetaGroup}>
              <span className={styles.scNumber}>
                {numStr}&nbsp;<span className={styles.scNumberTotal}>/ {totalStr}</span>
              </span>
              <span className={styles.scCategory}>{service.category}</span>
            </div>

            <div className={styles.scIconBox} aria-hidden="true" title={service.title}>
              <ServiceIcon serviceId={service.id} />
            </div>
          </div>

          {/* Service Title */}
          <h3 id={`sc-title-${service.id}`} className={styles.scTitle}>
            {service.title}
          </h3>

          {/* Description */}
          <p className={styles.scDescription}>{service.description}</p>

          {/* Deliverables Pills */}
          <div className={styles.scDeliverables}>
            {service.deliverables.slice(0, 4).map((d) => (
              <span key={d} className={styles.scPill}>
                {d}
              </span>
            ))}
          </div>

          {/* Explore Link */}
          <Link
            to={service.actionUrl || `/contact?service=${service.id}`}
            className={styles.scCta}
            aria-label={`Explore ${service.title}`}
          >
            <span>EXPLORE SERVICE</span>
            <span className={styles.scCtaArrow} aria-hidden="true">→</span>
          </Link>
        </div>

        {/* RIGHT PANEL — VISUAL */}
        <div className={styles.splitMedia}>
          <img
            ref={imageRef}
            src={service.image}
            alt={`${service.title} — Aranea Den`}
            className={styles.splitImage}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <div className={styles.splitMediaOverlay} />

          {service.badge && (
            <span
              className={`${styles.splitBadge} ${
                service.id === 'ad-imperial-visuals' || service.badge === 'FLAGSHIP DISCIPLINE'
                  ? styles.badgeCrimson
                  : ''
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

/* ─── Client Logos for Clientele Marquee ─── */
const CLIENTELE_LOGOS = [
  { id: 'pooja-productions', name: 'Pooja Productions', logo: '/clients/pooja-productions.svg' },
  { id: 'corner-craft', name: 'Corner Craft', logo: '/clients/corner-craft.svg' },
  { id: 'makaan-infra', name: 'Makaan Infra', logo: '/clients/makaan-infra.svg' },
  { id: 'jk-restaurant', name: 'JK Restaurant', logo: '/clients/jk-restaurant.svg' },
  { id: 'ceo-expos', name: 'CEO Expos', logo: '/clients/ceo-expos.svg' },
  { id: 'creators-events', name: 'Creators Events', logo: '/clients/creators-events.svg' },
  { id: 'finance-with-veeru', name: 'Finance With Veeru', logo: '/clients/finance-with-veeru.svg' },
  { id: 'meghana-builders', name: 'Meghana Builders', logo: '/clients/meghana-builders.svg' },
  { id: 'nri360', name: 'NRI 360', logo: '/clients/nri360.svg' },
  { id: 'o2med-academy', name: 'O2Med Academy', logo: '/clients/o2med-academy.svg' },
  { id: 'pelli-kaburulu', name: 'Pelli Kaburulu', logo: '/clients/pelli-kaburulu.svg' },
  { id: 'pp-connekts', name: 'PP Connekts', logo: '/clients/pp-connekts.svg' },
  { id: 'startup-potluck', name: 'Startup Potluck', logo: '/clients/startup-potluck.svg' },
  { id: 'thor-cuisine', name: 'Thor Cuisine', logo: '/clients/thor-cuisine.svg' },
  { id: 'viraj-academy', name: 'Viraj Academy', logo: '/clients/viraj-academy.svg' },
];

/* ─── Main Services Page Component ─── */
export const ServicesPage: React.FC = () => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const clienteleRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // URL deep-linking support
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('web-development') || path.includes('mobile-development') || path.includes('ui-ux')) {
      setActiveCategory('digital-products');
    } else if (path.includes('digital-marketing') || path.includes('social-media') || path.includes('paid-ads')) {
      setActiveCategory('digital-marketing');
    } else if (path.includes('videography') || path.includes('photography') || path.includes('reels')) {
      setActiveCategory('ad-imperial-visuals');
    } else if (path.includes('iot') || path.includes('hackathon') || path.includes('workshop')) {
      setActiveCategory('technology-community');
    }
  }, [location.pathname]);

  const displayedServices = useMemo(() => {
    if (activeCategory === 'all') return ALL_SERVICES;
    return ALL_SERVICES.filter((s) => s.categorySlug === activeCategory);
  }, [activeCategory]);

  // Page title & scroll restoration
  useEffect(() => {
    document.title = 'SERVICES — ARANEA DEN | Digital Experiences. Built to Connect.';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Recalculate ScrollTrigger on view or filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [viewMode, activeCategory]);

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
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', delay: 0.08 }
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  // Grid view entrance animation
  useEffect(() => {
    if (viewMode !== 'grid' || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(`.${styles.gridCard}`);
    if (!cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', overwrite: 'auto' }
    );
  }, [viewMode, activeCategory]);

  // CTA section entrance animation
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
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: { trigger: cta, start: 'top 82%' },
        }
      );
    }, cta);

    return () => ctx.revert();
  }, []);

  // Clientele section entrance animation
  useEffect(() => {
    const clientele = clienteleRef.current;
    if (!clientele) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        clientele.querySelector(`.${styles.clienteleHeader}`),
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: clientele, start: 'top 85%' },
        }
      );
    }, clientele);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      {/* ── 01: HERO SECTION ── */}
      <section ref={heroRef} className={styles.hero} aria-labelledby="services-page-heading">
        {/* Geometric Spider Web Architectural Svg */}
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

        <div className={styles.container}>
          <div className={styles.heroContainer}>
            {/* Breadcrumb Navigation */}
            <nav data-hero-el className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/" className={styles.breadcrumbLink}>
                HOME
              </Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbActive}>SERVICES</span>
            </nav>

            {/* Eyebrow */}
            <div data-hero-el className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>COMPREHENSIVE CAPABILITIES</span>
            </div>

            {/* Heading */}
            <h1 data-hero-el id="services-page-heading" className={styles.heroHeading}>
              WHAT WE DO
            </h1>

            {/* Subtitle */}
            <p data-hero-el className={styles.heroSub}>
              From digital products and brand experiences to content, campaigns, and emerging
              technology — we connect every discipline to help businesses move forward.
            </p>

            {/* Stats Counter */}
            <div data-hero-el className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.statNum}>15</span>
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
        </div>
      </section>

      {/* ── 02: MAIN SERVICES SECTION ── */}
      <section className={styles.servicesSection} aria-label="Services Section">
        <div className={styles.container}>
          {/* Controls Bar: Category Filter & View Mode Switcher */}
          <div className={styles.controlsBar}>
            {/* Compact Category Filter */}
            <div className={styles.filterBar} role="tablist" aria-label="Filter by category">
              {SERVICE_CATEGORIES.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                    onClick={() => setActiveCategory(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className={styles.filterCount}>{tab.count}</span>
                  </button>
                );
              })}
            </div>

            {/* View Switcher: SPLIT VIEW (Default) & GRID VIEW */}
            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                className={`${styles.viewBtn} ${viewMode === 'split' ? styles.viewBtnActive : ''}`}
                onClick={() => setViewMode('split')}
                aria-pressed={viewMode === 'split'}
                title="Split View (Default)"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="1" y="2" width="13" height="4" rx="1" fill="currentColor" />
                  <rect x="1" y="9" width="13" height="4" rx="1" fill="currentColor" />
                </svg>
                <span>SPLIT VIEW</span>
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                title="Grid View"
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

          {/* ── OPTION A: DEFAULT SPLIT VIEW (PACK-OF-CARDS STACKING) ── */}
          {viewMode === 'split' && (
            <div className={styles.splitDeckContainer}>
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

          {/* ── OPTION B: GRID VIEW (ALTERNATIVE VIEW) ── */}
          {viewMode === 'grid' && (
            <div ref={gridRef} className={styles.gridList}>
              {displayedServices.map((service) => (
                <article
                  key={service.id}
                  id={`g-${service.id}`}
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
                          service.id === 'ad-imperial-visuals' || service.badge === 'FLAGSHIP DISCIPLINE'
                            ? styles.badgeCrimson
                            : ''
                        }`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className={styles.gcBody}>
                    <div className={styles.gcMeta}>
                      <span className={styles.gcIndex}>{service.number}</span>
                      <span className={styles.gcCat}>{service.category}</span>
                    </div>

                    <h3 id={`gc-title-${service.id}`} className={styles.gcTitle}>
                      {service.title}
                    </h3>

                    <p className={styles.gcDesc}>{service.description}</p>

                    <Link
                      to={service.actionUrl || `/contact?service=${service.id}`}
                      className={styles.gcCta}
                      aria-label={`Explore ${service.title}`}
                    >
                      <span>EXPLORE</span>
                      <span className={styles.gcArrow} aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 03: OUR CLIENTELE SECTION ── */}
      <section ref={clienteleRef} className={styles.clienteleSection} aria-labelledby="clientele-heading">
        <div className={styles.container}>
          <div className={styles.clienteleHeader}>
            <div className={styles.clienteleEyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>OUR CLIENTELE // TRUSTED COLLABORATORS</span>
            </div>
            <h2 id="clientele-heading" className={styles.clienteleTitle}>
              TRUSTED BY VISIONARY BRANDS
            </h2>
            <p className={styles.clienteleSub}>
              Partnering with forward-thinking businesses and studios to engineer standout digital products,
              creative campaigns, and cinematic productions.
            </p>
          </div>
        </div>

        {/* Seamless Infinite Marquee Track */}
        <div className={styles.clienteleMarqueeWrapper}>
          <div className={styles.clienteleTrack}>
            {[...CLIENTELE_LOGOS, ...CLIENTELE_LOGOS].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className={styles.clienteleCard}
                title={item.name}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className={styles.clienteleLogoImg}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04: MINIMAL PROJECT INQUIRY CTA ── */}
      <section ref={ctaRef} className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className={styles.ctaGlow} />
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaEyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>LET'S BUILD SOMETHING MEANINGFUL</span>
            </div>

            <h2 id="cta-heading" className={styles.ctaHeading}>
              HAVE A PROJECT?
            </h2>

            <p className={styles.ctaSub}>
              Tell us what you're building. We'll bring the strategy, creativity, and technology to
              make it real.
            </p>

            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.ctaPrimary}>
                <span>START A PROJECT</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/portfolio" className={styles.ctaSecondary}>
                VIEW OUR WORK
              </Link>
            </div>
          </div>

          <div className={styles.ctaMeta}>
            <a href="mailto:contact@araneaden.com" className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>INQUIRIES</span>
              <span className={styles.ctaMetaVal}>contact@araneaden.com</span>
            </a>
            <div className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>STUDIO</span>
              <span className={styles.ctaMetaVal}>Hyderabad, India</span>
            </div>
            <div className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>RESPONSE</span>
              <span className={styles.ctaMetaVal}>&lt; 24 Hours</span>
            </div>
            <Link to="/contact" className={styles.ctaMetaCard}>
              <span className={styles.ctaMetaLabel}>CONSULTATION</span>
              <span className={styles.ctaMetaVal}>Book a Session →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
