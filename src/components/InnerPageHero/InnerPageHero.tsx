import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './InnerPageHero.module.css';
import { InnerPageHeroProps, InnerPageHeroVariant } from './types';
import { Breadcrumbs, BreadcrumbItem } from '../Breadcrumbs';
import { AboutWebVisual } from './visuals/AboutWebVisual';
import { ServicesWebVisual } from './visuals/ServicesWebVisual';
import { PortfolioWebVisual } from './visuals/PortfolioWebVisual';
import { ContactWebVisual } from './visuals/ContactWebVisual';

const renderVisual = (variant: InnerPageHeroVariant) => {
  switch (variant) {
    case 'about':
      return <AboutWebVisual />;
    case 'services':
      return <ServicesWebVisual />;
    case 'portfolio':
      return <PortfolioWebVisual />;
    case 'contact':
      return <ContactWebVisual />;
    default:
      return null;
  }
};

/**
 * InnerPageHero — Minimal, Premium Inner-Page Hero System
 * Shared across /about, /services, /portfolio, and /contact
 */
export const InnerPageHero: React.FC<InnerPageHeroProps> = ({
  breadcrumb,
  breadcrumbItems,
  headline,
  description,
  variant,
  children,
  className,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const resolvedBreadcrumbs: BreadcrumbItem[] | undefined = React.useMemo(() => {
    if (breadcrumbItems && breadcrumbItems.length > 0) {
      return breadcrumbItems;
    }
    if (breadcrumb) {
      const parts = breadcrumb.split('/').map((s) => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        return parts.map((part, index) => {
          const isFirst = index === 0;
          const isLast = index === parts.length - 1;
          const label = (isFirst && (part === 'ARANEA DEN' || part === 'HOME')) ? 'HOME' : part;
          return {
            label,
            path: isFirst ? '/' : isLast ? undefined : `/${part.toLowerCase().replace(/\s+/g, '-')}`,
          };
        });
      }
    }
    return undefined;
  }, [breadcrumbItems, breadcrumb]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const elements = [
        breadcrumbRef.current,
        headlineRef.current,
        descriptionRef.current,
        visualRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        elements,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className={`${styles.heroSection} ${className || ''}`}
      aria-label={headline}
    >
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* Content Column */}
          <div className={styles.contentCol}>
            {/* Real Interactive Breadcrumbs Navigation */}
            <div ref={breadcrumbRef} className={styles.breadcrumbWrapper}>
              <Breadcrumbs items={resolvedBreadcrumbs} />
            </div>

            {/* Bold, Elegant Headline */}
            <h1 ref={headlineRef} className={styles.headline}>
              {headline}
            </h1>

            {/* Short Editorial Description */}
            <p ref={descriptionRef} className={styles.description}>
              {description}
            </p>

            {/* Optional Children (e.g. Portfolio Category Filter Row) */}
            {children && (
              <div className={styles.heroChildren}>
                {children}
              </div>
            )}
          </div>

          {/* Right Column: Subtle, Tasteful Spider/Web Visual */}
          <div ref={visualRef} className={styles.visualCol} aria-hidden="true">
            <div className={styles.visualFrame}>
              {renderVisual(variant)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnerPageHero;
