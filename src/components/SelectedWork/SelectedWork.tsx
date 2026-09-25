import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { PORTFOLIO_WEBSITES } from '../../data/portfolioData';
import styles from './SelectedWork.module.css';

// Top 4 featured flagship websites on the homepage
const FEATURED_WEBSITES = PORTFOLIO_WEBSITES.filter((p) => p.featuredOnHome).slice(0, 4);

export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 2. Project items reveal
      const items = listRef.current?.querySelectorAll(`.${styles.projectItem}`);
      if (items && items.length > 0) {
        items.forEach((item) => {
          const frame = item.querySelector(`.${styles.visualFrame}`);
          const meta = item.querySelector(`.${styles.metaCol}`);

          if (frame) {
            gsap.fromTo(
              frame,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 82%',
                },
              }
            );
          }

          if (meta) {
            gsap.fromTo(
              meta,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                delay: 0.08,
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 82%',
                },
              }
            );
          }
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

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
            FLAGSHIP WEBSITES AND DIGITAL SYSTEMS ENGINEERED BY ARANEA DEN.
          </h2>
        </div>

        {/* Project List: Minimal Editorial Showcase */}
        <div ref={listRef} className={styles.projectsList}>
          {FEATURED_WEBSITES.map((project, index) => (
            <article key={project.id} className={styles.projectItem}>
              {/* Project Visual Presentation Frame (Clean Editorial Canvas) */}
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

                {/* Minimal Floating Domain Capsule */}
                <div className={styles.floatingDomainBadge}>
                  <span className={styles.domainDot} aria-hidden="true" />
                  <span className={styles.domainText}>{project.domain}</span>
                  <span className={styles.domainArrow} aria-hidden="true">↗</span>
                </div>
              </a>

              {/* Project Metadata Column */}
              <div className={styles.metaCol}>
                <div className={styles.metaTop}>
                  <span className={styles.projectIndex}>0{index + 1} // 04</span>
                  <span className={styles.projectCategory}>{project.category}</span>
                </div>

                <h3 className={styles.projectTitle}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.titleLink}
                  >
                    {project.title}
                  </a>
                </h3>

                <p className={styles.projectDescription}>{project.metaDescription}</p>

                {/* Scope / Discipline Tags */}
                <div className={styles.tagsRow}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tagPill}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div className={styles.actionRow}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visitLink}
                  >
                    <span>VISIT LIVE PLATFORM</span>
                    <span className={styles.arrowIcon} aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Archives CTA */}
        <div className={styles.archiveCtaWrap}>
          <Link to="/portfolio" className={styles.archiveLink}>
            <span className={styles.archiveLinkText}>VIEW ALL 11 CLIENT PLATFORMS & REELS</span>
            <span className={styles.archiveArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
