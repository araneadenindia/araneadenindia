import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { TeamPreview } from '../../components/TeamPreview';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import styles from './TeamPage.module.css';

export const TeamPage: React.FC = () => {
  const { activeContent } = useCms();
  const team = activeContent.team;
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'THE POWERHOUSE — ARANEA DEN | Team & Leadership';
    // Scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page}>
      {/* ── 1. Page Header ── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div ref={heroRef}>
            <Breadcrumbs
              items={[
                { label: 'HOME', path: '/' },
                { label: 'TEAM' },
              ]}
            />
            <EditableField
              fieldPath="team.hero.heading"
              fieldLabel="Team Hero Heading"
              value={team?.hero?.heading || 'WEAVERS OF DIGITAL REALMS.'}
            >
              <h1 className={styles.heroTitle}>{team?.hero?.heading || 'WEAVERS OF DIGITAL REALMS.'}</h1>
            </EditableField>
          </div>
        </div>
      </section>

      {/* ── 2. The Same CEO Spotlight & The Powerhouse Collective Network ── */}
      <TeamPreview />

      {/* ── 3. Closing CTA Band ── */}
      <section className={styles.ctaBand} aria-label="Work With Our Team">
        <div className={styles.container}>
          <EditableField
            fieldPath="cta.line1"
            fieldLabel="CTA Heading"
            value={activeContent.home?.cta?.line1 || 'WANT TO BUILD TOGETHER?'}
          >
            <h2 className={styles.ctaHeading}>{activeContent.home?.cta?.line1 || 'WANT TO BUILD TOGETHER?'}</h2>
          </EditableField>
          <EditableField
            fieldPath="cta.subtext"
            fieldLabel="CTA Subtext"
            value={activeContent.home?.cta?.subtext || 'We partner with visionary founders, enterprises, and innovators to craft digital flagships.'}
            isTextarea
          >
            <p className={styles.ctaSubtext}>
              {activeContent.home?.cta?.subtext || 'We partner with visionary founders, enterprises, and innovators to craft digital flagships.'}
            </p>
          </EditableField>
          <Link to="/contact" className={styles.ctaBtn}>
            <span>START A CONVERSATION</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
