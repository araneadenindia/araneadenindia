import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { PORTFOLIO_WEBSITES, PortfolioWebsite } from '../../data/portfolioData';
import { ARANEA_REELS } from '../../data/reelsData';
import styles from './PortfolioPage.module.css';

const CATEGORIES = [
  { id: 'all', label: 'ALL WEBSITES (11)' },
  { id: 'enterprise', label: 'ENTERPRISE & INFRASTRUCTURE' },
  { id: 'luxury', label: 'LUXURY & LIFESTYLE' },
  { id: 'creative', label: 'CREATIVE & MEDIA' },
  { id: 'reels', label: 'OFFICIAL REELS (7)' },
];

export const PortfolioPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reelsRef = useRef<HTMLElement>(null);

  const filteredWebsites = activeFilter === 'all' || activeFilter === 'reels'
    ? PORTFOLIO_WEBSITES
    : PORTFOLIO_WEBSITES.filter((p) => p.filterCategory === activeFilter);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // 1. Hero emergence
      if (heroRef.current) {
        const title = heroRef.current.querySelector(`.${styles.heroTitle}`);
        const lead = heroRef.current.querySelector(`.${styles.heroLead}`);

        gsap.fromTo(
          [title, lead],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.15,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }
        );
      }

      // 2. Project card reveals
      if (listRef.current) {
        const cards = listRef.current.querySelectorAll(`.${styles.projectCard}`);
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
              },
            }
          );
        });
      }

      // 3. Reels cards reveals
      if (reelsRef.current) {
        const reelCards = reelsRef.current.querySelectorAll(`.${styles.reelCard}`);
        gsap.fromTo(
          reelCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: reelsRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <div ref={pageRef} className={styles.portfolioPage}>
      {/* Editorial Header */}
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroHeader}>
            <div className={styles.eyebrow}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>WHAT WE'VE BUILT // ARCHIVE OF CRAFT</span>
            </div>

            <h1 className={styles.heroTitle}>
              WHAT WE'VE BUILT.
            </h1>

            <p className={styles.heroLead}>
              Every platform, digital ecosystem, and visual system designed and engineered
              by Aranea Den. Explorable below with direct access to live production environments.
            </p>
          </div>

          {/* Category Filter Navigation */}
          <div className={styles.filterRow} role="tablist" aria-label="Portfolio Filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveFilter(cat.id);
                  if (cat.id === 'reels' && reelsRef.current) {
                    reelsRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Websites Showcase (11 Client Sites) */}
      <section className={styles.projectsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubhead}>PRODUCTION WEBSITES</span>
            <span className={styles.sectionCounter}>11 PLATFORMS LIVE</span>
          </div>

          <div ref={listRef} className={styles.projectsGrid}>
            {filteredWebsites.map((site: PortfolioWebsite) => {
              return (
                <article key={site.id} className={styles.projectCard}>
                  {/* Clean Editorial Visual Canvas Frame */}
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visualFrame}
                    aria-label={`Visit live website for ${site.title}`}
                  >
                    <div className={styles.imageWrapper}>
                      <img
                        src={site.thumbnail}
                        alt={`Landing page preview of ${site.title}`}
                        className={styles.screenImg}
                        loading="lazy"
                      />
                      <div className={styles.screenOverlay}>
                        <span className={styles.overlayPill}>
                          <span>VISIT LIVE PLATFORM</span>
                          <span aria-hidden="true">↗</span>
                        </span>
                      </div>
                    </div>

                    {/* Floating Minimal Domain Capsule */}
                    <div className={styles.floatingDomainBadge}>
                      <span className={styles.domainDot} aria-hidden="true" />
                      <span className={styles.domainText}>{site.domain}</span>
                      <span className={styles.domainArrow} aria-hidden="true">↗</span>
                    </div>
                  </a>

                  {/* Card Editorial Info & Metadata */}
                  <div className={styles.cardDetails}>
                    <div className={styles.cardTopMeta}>
                      <span className={styles.badgeIndex}>{site.number}</span>
                      <span className={styles.badgeCategory}>{site.category}</span>
                      <span className={styles.badgeYear}>{site.year}</span>
                    </div>

                    <h2 className={styles.cardTitle}>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cardTitleLink}
                      >
                        {site.title}
                      </a>
                    </h2>

                    <p className={styles.cardDescription}>{site.metaDescription}</p>

                    <div className={styles.cardTags}>
                      {site.tags.map((t) => (
                        <span key={t} className={styles.tagPill}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className={styles.cardActions}>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.primaryVisitBtn}
                        aria-label={`Visit live ${site.domain}`}
                      >
                        <span>VISIT LIVE PLATFORM</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reels & Motion Section (Ready for user video/reel links) */}
      <section ref={reelsRef} id="reels" className={styles.reelsSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>02 — MOTION CINEMATICS</span>
          </div>

          <div className={styles.reelsHeader}>
            <h2 className={styles.reelsTitle}>REELS & BRAND CINEMATICS.</h2>
            <p className={styles.reelsLead}>
              High-impact vertical storytelling, commercial reels, and creative direction designed
              for modern social distribution.
            </p>
          </div>

          {/* Reels Showcase Grid with 9:16 Aspect Frames */}
          <div className={styles.reelsGrid}>
            {ARANEA_REELS.map((reel) => (
              <article key={reel.id} className={styles.reelCard}>
                <div className={styles.reelFrame}>
                  <video
                    src={reel.videoSrc}
                    poster={reel.thumbnail}
                    className={styles.reelVideo}
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                  <div className={styles.reelOverlay}>
                    <span className={styles.reelBadge}>{reel.tag || reel.aspectRatio}</span>
                    {reel.likes && (
                      <span className={styles.reelLikesBadge}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {reel.likes}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.reelInfo}>
                  <div className={styles.reelClient}>{reel.client}</div>
                  <h3 className={styles.reelCardTitle}>{reel.title}</h3>
                  <p className={styles.reelCardDesc}>{reel.caption}</p>
                  <a
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.reelInstaBtn}
                    aria-label={`Watch ${reel.title} on Instagram`}
                  >
                    <span>WATCH ON INSTAGRAM</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Notification badge that more reels can be linked */}
          <div className={styles.reelsNote}>
            <span className={styles.noteDot} />
            <span className={styles.noteText}>
              More client reels will appear here as new campaign links are added.
            </span>
          </div>
        </div>
      </section>

      {/* Closing Collaboration Banner */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow} style={{ justifyContent: 'center' }}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>START A COLLABORATION</span>
          </div>

          <h2 className={styles.ctaHeadline}>HAVE A PROJECT TO BUILD?</h2>

          <Link to="/contact" className={styles.ctaBtn}>
            <span>COMMISSION A PROJECT</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
