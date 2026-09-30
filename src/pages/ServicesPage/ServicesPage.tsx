import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SERVICE_CATEGORIES,
  ServiceCategory,
  ServiceItem,
} from '../../data/servicesData';
import { ClienteleSection } from '../../components/ClienteleSection';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import { EditableMedia } from '../../cms/components/EditableMedia/EditableMedia';
import { CmsServiceItem } from '../../cms/types';
import styles from './ServicesPage.module.css';

gsap.registerPlugin(ScrollTrigger);

type ViewMode = 'split' | 'grid';

/* ─── Stacked Split Card (Deck-of-Cards Scroll Experience) ─── */
interface SplitCardProps {
  service: CmsServiceItem | ServiceItem;
  index: number;
  originalIndex: number;
  total?: number;
}

const SplitCard: React.FC<SplitCardProps> = ({ service, index, originalIndex }) => {
  const { isAdmin, isEditMode, isPreviewMode, duplicateCollectionItem, removeCollectionItem } = useCms();
  const canEdit = isAdmin && isEditMode && !isPreviewMode;

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

  const serviceMedia = (service as any).media || { type: 'image', url: (service as any).image };

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
        style={{ position: 'relative' }}
      >
        {canEdit && originalIndex >= 0 && (
          <div className={styles.cardAdminBar}>
            <button
              type="button"
              className={styles.adminBtn}
              onClick={(e) => {
                e.stopPropagation();
                duplicateCollectionItem('services.items', originalIndex);
              }}
              title="Duplicate this service card"
            >
              ⧉ DUPLICATE
            </button>
            <button
              type="button"
              className={`${styles.adminBtn} ${styles.adminDeleteBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete service "${service.title}"?`)) {
                  removeCollectionItem('services.items', originalIndex);
                }
              }}
              title="Remove this service card"
            >
              🗑 REMOVE
            </button>
          </div>
        )}

        {/* LEFT PANEL — CONTENT */}
        <div className={styles.splitContent}>
          {/* Service Title */}
          <EditableField
            fieldPath={`services.items.${originalIndex}.title`}
            fieldLabel="Service Title"
            value={service.title}
          >
            <h3 id={`sc-title-${service.id}`} className={styles.scTitle}>
              {service.title}
            </h3>
          </EditableField>

          {/* Description */}
          <EditableField
            fieldPath={`services.items.${originalIndex}.detailedCopy`}
            fieldLabel="Service Description"
            value={service.detailedCopy || service.description}
            isTextarea
            isBlock
          >
            <p className={styles.scDescription}>{service.detailedCopy || service.description}</p>
          </EditableField>

          {/* Action Row: Red BOOK SERVICE button */}
          <div className={styles.scActionRow}>
            <Link
              to={service.actionUrl || `/contact?service=${service.id}`}
              className={styles.bookServiceRedBtn}
              aria-label={`Book service ${service.title}`}
            >
              <span>{service.actionLabel || 'BOOK SERVICE'}</span>
              <span className={styles.bookServiceArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL — VISUAL */}
        <div className={styles.splitMedia}>
          <EditableMedia
            mediaPath={`services.items.${originalIndex}.media`}
            media={serviceMedia}
            alt={`${service.title} — Aranea Den`}
            className={styles.splitImage}
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

/* ─── Main Services Page Component ─── */
export const ServicesPage: React.FC = () => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { activeContent, isAdmin, isEditMode, isPreviewMode, addCollectionItem, duplicateCollectionItem, removeCollectionItem } = useCms();
  const canEdit = isAdmin && isEditMode && !isPreviewMode;

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

  const servicesList: CmsServiceItem[] = activeContent.services?.items || [];

  const displayedServices = useMemo(() => {
    if (activeCategory === 'all') return servicesList;
    return servicesList.filter((s) => s.categorySlug === activeCategory);
  }, [activeCategory, servicesList]);


  // Page title & scroll restoration
  useEffect(() => {
    const path = location.pathname.toLowerCase().replace(/\/$/, '');
    if (path.includes('web-development')) {
      document.title = 'WEB DEVELOPMENT — ARANEA DEN';
    } else if (path.includes('mobile-development')) {
      document.title = 'MOBILE APP DEVELOPMENT — ARANEA DEN';
    } else if (path.includes('ui-ux-design')) {
      document.title = 'UI / UX DESIGN — ARANEA DEN';
    } else if (path.includes('digital-marketing')) {
      document.title = 'DIGITAL MARKETING — ARANEA DEN';
    } else if (path.includes('video-production')) {
      document.title = 'VIDEO PRODUCTION — ARANEA DEN';
    } else if (path.includes('graphic-design')) {
      document.title = 'GRAPHIC DESIGN — ARANEA DEN';
    } else if (path.includes('live-streaming-broadcasting')) {
      document.title = 'LIVE STREAMING & BROADCASTING — ARANEA DEN';
    } else if (path.includes('software-hardware-solutions')) {
      document.title = 'SOFTWARE & HARDWARE SOLUTIONS — ARANEA DEN';
    } else if (path.includes('iot-hardware-solutions')) {
      document.title = 'IOT & HARDWARE SOLUTIONS — ARANEA DEN';
    } else if (path.includes('seo')) {
      document.title = 'SEO ARCHITECTURE — ARANEA DEN';
    } else if (path.includes('cloud-solutions')) {
      document.title = 'CLOUD SOLUTIONS — ARANEA DEN';
    } else {
      document.title = 'SERVICES — ARANEA DEN | Digital Experiences. Built to Connect.';
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

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


  return (
    <div ref={pageRef} className={styles.page}>
      {/* ── 01: HERO SECTION ── */}
      <section ref={heroRef} className={styles.hero} aria-labelledby="services-page-heading">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Left Column: Editorial Information */}
            <div className={styles.heroLeftCol}>
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
                <EditableField
                  fieldPath="services.hero.eyebrow"
                  fieldLabel="Hero Eyebrow"
                  value={activeContent.services?.hero?.eyebrow || 'COMPREHENSIVE CAPABILITIES'}
                >
                  <span className={styles.eyebrowText}>
                    {activeContent.services?.hero?.eyebrow || 'COMPREHENSIVE CAPABILITIES'}
                  </span>
                </EditableField>
              </div>

              {/* Heading */}
              <EditableField
                fieldPath="services.hero.heading"
                fieldLabel="Hero Heading"
                value={activeContent.services?.hero?.heading || 'WHAT WE DO'}
              >
                <h1 data-hero-el id="services-page-heading" className={styles.heroHeading}>
                  {activeContent.services?.hero?.heading || 'WHAT WE DO'}
                </h1>
              </EditableField>

              {/* Subtitle */}
              <EditableField
                fieldPath="services.hero.lead"
                fieldLabel="Hero Lead Description"
                value={
                  activeContent.services?.hero?.lead ||
                  'From digital products and brand experiences to content, campaigns, and emerging technology — we connect every discipline to help businesses move forward.'
                }
                isTextarea
                isBlock
              >
                <p data-hero-el className={styles.heroSub}>
                  {activeContent.services?.hero?.lead ||
                    'From digital products and brand experiences to content, campaigns, and emerging technology — we connect every discipline to help businesses move forward.'}
                </p>
              </EditableField>

              {/* Stats Counter */}
              <div data-hero-el className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <EditableField
                    fieldPath="services.hero.stats.servicesCount"
                    fieldLabel="Services Count"
                    value={activeContent.services?.hero?.stats?.servicesCount || '15'}
                  >
                    <span className={styles.statNum}>
                      {activeContent.services?.hero?.stats?.servicesCount || '15'}
                    </span>
                  </EditableField>
                  <span className={styles.statLabel}>SERVICES</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <EditableField
                    fieldPath="services.hero.stats.disciplinesCount"
                    fieldLabel="Disciplines Count"
                    value={activeContent.services?.hero?.stats?.disciplinesCount || '4'}
                  >
                    <span className={styles.statNum}>
                      {activeContent.services?.hero?.stats?.disciplinesCount || '4'}
                    </span>
                  </EditableField>
                  <span className={styles.statLabel}>DISCIPLINES</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <EditableField
                    fieldPath="services.hero.stats.studioCount"
                    fieldLabel="Studio Count"
                    value={activeContent.services?.hero?.stats?.studioCount || '1'}
                  >
                    <span className={styles.statNum}>
                      {activeContent.services?.hero?.stats?.studioCount || '1'}
                    </span>
                  </EditableField>
                  <span className={styles.statLabel}>STUDIO</span>
                </div>
              </div>
            </div>

            {/* Right Column: Connected Disciplines Architecture Visual Card */}
            <div className={styles.heroRightCol}>
              <div className={styles.disciplinesCard} aria-hidden="true">
                {/* Corner registration marks */}
                <span className={`${styles.cornerMark} ${styles.tl}`}>+</span>
                <span className={`${styles.cornerMark} ${styles.tr}`}>+</span>
                <span className={`${styles.cornerMark} ${styles.bl}`}>+</span>
                <span className={`${styles.cornerMark} ${styles.br}`}>+</span>

                {/* Top Meta Plate */}
                <div className={styles.disciplinesMetaTop}>
                  <span className={styles.disciplinesMetaTag}>DISCIPLINE ARCHITECTURE</span>
                  <span className={styles.disciplinesMetaMatrix}>4-CORE MATRIX</span>
                </div>

                {/* 2x2 Connected Disciplines Matrix */}
                <div className={styles.matrixContainer}>
                  {/* Central connective spider nexus */}
                  <div className={styles.matrixNexus}>
                    <span className={styles.nexusDot} />
                    <span className={styles.nexusPing} />
                  </div>

                  {/* 4 Core Discipline Blocks */}
                  <div className={styles.matrixBlock}>
                    <div className={styles.blockIndex}>01 // WEB</div>
                    <div className={styles.blockTitle}>DIGITAL EXPERIENCES</div>
                    <div className={styles.blockDesc}>Bespoke Platforms &amp; UI/UX</div>
                  </div>

                  <div className={styles.matrixBlock}>
                    <div className={styles.blockIndex}>02 // APP</div>
                    <div className={styles.blockTitle}>MOBILE ENGINEERING</div>
                    <div className={styles.blockDesc}>iOS, Android &amp; Cross-Platform</div>
                  </div>

                  <div className={styles.matrixBlock}>
                    <div className={styles.blockIndex}>03 // MEDIA</div>
                    <div className={styles.blockTitle}>CREATIVE PRODUCTION</div>
                    <div className={styles.blockDesc}>Imperial Visuals &amp; Branding</div>
                  </div>

                  <div className={styles.matrixBlock}>
                    <div className={styles.blockIndex}>04 // TECH</div>
                    <div className={styles.blockTitle}>EMERGING SYSTEMS</div>
                    <div className={styles.blockDesc}>IoT Prototyping &amp; Cloud</div>
                  </div>
                </div>

                {/* Bottom Architectural Plate */}
                <div className={styles.disciplinesMetaBottom}>
                  <div className={styles.matrixStatusRow}>
                    <span className={styles.statusPulseDot} />
                    <span className={styles.matrixStatusText}>15 SERVICES // ONE UNIFIED STUDIO</span>
                  </div>
                  <span className={styles.matrixIndexTag}>INDEXED &amp; ACTIVE</span>
                </div>
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

          {/* Admin Add Service Button */}
          {canEdit && (
            <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
              <button
                type="button"
                className="cms-add-service-btn"
                onClick={() => {
                  const newId = `service-${Date.now()}`;
                  addCollectionItem('services.items', {
                    id: newId,
                    number: String(servicesList.length + 1).padStart(2, '0'),
                    title: 'NEW BESPOKE SERVICE',
                    category: 'Digital Products',
                    categorySlug: 'digital-products',
                    badge: 'NEW CAPABILITY',
                    description: 'High-impact solutions crafted for scale and speed.',
                    detailedCopy: 'Tailored architectural engineering, modern UI/UX design, and dedicated deployment support.',
                    deliverables: ['Custom Strategy', 'Full Production', 'Ongoing Support'],
                    media: {
                      type: 'image',
                      url: '/services/ad-web-development.jpg',
                      alt: 'New Service',
                    },
                    featured: false,
                    actionLabel: 'BOOK SERVICE →',
                    actionUrl: `/contact?service=${newId}`,
                  });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 2rem',
                  background: '#df2531',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 20px rgba(223, 37, 49, 0.4)',
                }}
              >
                + ADD NEW SERVICE
              </button>
            </div>
          )}

          {/* ── OPTION A: DEFAULT SPLIT VIEW (PACK-OF-CARDS STACKING) ── */}
          {viewMode === 'split' && (
            <div className={styles.splitDeckContainer}>
              {displayedServices.map((service, idx) => {
                const originalIndex = servicesList.findIndex((s) => s.id === service.id);
                return (
                  <SplitCard
                    key={`${service.id}-${activeCategory}`}
                    service={service}
                    index={idx}
                    originalIndex={originalIndex}
                    total={displayedServices.length}
                  />
                );
              })}
            </div>
          )}

          {/* ── OPTION B: GRID VIEW (ALTERNATIVE VIEW) ── */}
          {viewMode === 'grid' && (
            <div ref={gridRef} className={styles.gridList}>
              {displayedServices.map((service) => {
                const originalIndex = servicesList.findIndex((s) => s.id === service.id);
                const serviceMedia = (service as any).media || { type: 'image', url: (service as any).image };

                return (
                  <article
                    key={service.id}
                    id={`g-${service.id}`}
                    className={styles.gridCard}
                    aria-labelledby={`gc-title-${service.id}`}
                    style={{ position: 'relative' }}
                  >
                    {canEdit && originalIndex >= 0 && (
                      <div className={styles.cardAdminBar}>
                        <button
                          type="button"
                          className={styles.adminBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateCollectionItem('services.items', originalIndex);
                          }}
                          title="Duplicate this service"
                        >
                          ⧉
                        </button>
                        <button
                          type="button"
                          className={`${styles.adminBtn} ${styles.adminDeleteBtn}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete service "${service.title}"?`)) {
                              removeCollectionItem('services.items', originalIndex);
                            }
                          }}
                          title="Remove this service"
                        >
                          🗑
                        </button>
                      </div>
                    )}

                    <div className={styles.gcMedia}>
                      <EditableMedia
                        mediaPath={`services.items.${originalIndex}.media`}
                        media={serviceMedia}
                        alt={`${service.title} — Aranea Den`}
                        className={styles.gcImage}
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

                      <EditableField
                        fieldPath={`services.items.${originalIndex}.title`}
                        fieldLabel="Service Title"
                        value={service.title}
                      >
                        <h3 id={`gc-title-${service.id}`} className={styles.gcTitle}>
                          {service.title}
                        </h3>
                      </EditableField>

                      <EditableField
                        fieldPath={`services.items.${originalIndex}.description`}
                        fieldLabel="Service Description"
                        value={service.description}
                        isTextarea
                        isBlock
                      >
                        <p className={styles.gcDesc}>{service.description}</p>
                      </EditableField>

                      <Link
                        to={service.actionUrl || `/contact?service=${service.id}`}
                        className={styles.gcCta}
                        aria-label={`Book service ${service.title}`}
                      >
                        <span>{service.actionLabel || 'BOOK SERVICE'}</span>
                        <span className={styles.gcArrow} aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Admin Add Service Button */}
          {canEdit && (
            <div className={styles.addServiceBar}>
              <button
                type="button"
                className={styles.addServiceBtn}
                onClick={() => {
                  const count = servicesList.length + 1;
                  const newService: CmsServiceItem = {
                    id: `service-${Date.now()}`,
                    number: String(count).padStart(2, '0'),
                    title: 'NEW DISCIPLINE / SERVICE',
                    category: 'DIGITAL PRODUCTS',
                    categorySlug: 'digital-products',
                    badge: 'NEW',
                    description: 'Enter service description here.',
                    detailedCopy: 'Provide thorough details on this discipline, engineering standards, and business outcomes.',
                    deliverables: ['Custom Strategy', 'Full Implementation', 'Ongoing Optimization'],
                    media: {
                      type: 'image',
                      url: '/services/01-web-development.jpg',
                      alt: 'New Service Visual',
                    },
                    featured: true,
                    actionLabel: 'BOOK SERVICE →',
                    actionUrl: '/contact',
                  };
                  addCollectionItem('services.items', newService);
                }}
              >
                <span>+</span>
                <span>ADD NEW SERVICE DISCIPLINE</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 03: UNIVERSAL CLIENTELE SECTION ── */}
      <ClienteleSection />

      {/* ── 04: MINIMAL PROJECT INQUIRY CTA ── */}
      <section ref={ctaRef} className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className={styles.ctaGlow} />
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaEyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>LET'S BUILD SOMETHING MEANINGFUL</span>
            </div>

            <EditableField
              fieldPath="cta.line1"
              fieldLabel="Services CTA Heading"
              value={activeContent.home?.cta?.line1 || 'HAVE A PROJECT?'}
            >
              <h2 id="cta-heading" className={styles.ctaHeading}>
                {activeContent.home?.cta?.line1 || 'HAVE A PROJECT?'}
              </h2>
            </EditableField>

            <EditableField
              fieldPath="cta.subtext"
              fieldLabel="Services CTA Subtext"
              value={activeContent.home?.cta?.subtext || "Tell us what you're building. We'll bring the strategy, creativity, and technology to make it real."}
              isTextarea
              isBlock
            >
              <p className={styles.ctaSub}>
                {activeContent.home?.cta?.subtext || "Tell us what you're building. We'll bring the strategy, creativity, and technology to make it real."}
              </p>
            </EditableField>

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
