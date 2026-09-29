import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import { Aranea3DLogo } from './Aranea3DLogo';
import styles from './FinalCTA.module.css';

export const FinalCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Monumental statement staggered reveal
      const lines = headlineRef.current?.querySelectorAll(`.${styles.line}`);
      if (lines && lines.length > 0) {
        gsap.fromTo(
          lines,
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1.15,
            stagger: 0.12,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 2. Subtext and button emergence
      if (subtextRef.current && buttonRef.current) {
        gsap.fromTo(
          [subtextRef.current, buttonRef.current],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: subtextRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, section);

    // 3. Tactile Magnetic Button Interaction
    const btn = buttonRef.current;
    if (btn) {
      const onMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        gsap.to(btn, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const onMouseLeave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.35)',
        });
      };

      btn.addEventListener('mousemove', onMouseMove);
      btn.addEventListener('mouseleave', onMouseLeave);

      return () => {
        btn.removeEventListener('mousemove', onMouseMove);
        btn.removeEventListener('mouseleave', onMouseLeave);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  const { activeContent } = useCms();
  const ctaData = activeContent?.home?.cta;

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Final Call to Action">
      {/* 3D Spider Web Full Background & Interactive Brandmark */}
      <Aranea3DLogo parentRef={sectionRef} anchorRef={visualRef} />

      <div className={styles.container}>
        <div className={styles.ctaGrid}>
          {/* Left Column: Statement & CTAs */}
          <div className={styles.contentCol}>
            {/* Eyebrow Label */}
            <div className={styles.eyebrow}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <EditableField
                fieldPath="home.cta.eyebrow"
                fieldLabel="CTA Eyebrow"
                value={ctaData?.eyebrow || 'ENGAGEMENTS'}
              >
                <span className={styles.eyebrowText}>{ctaData?.eyebrow || 'ENGAGEMENTS'}</span>
              </EditableField>
            </div>

            {/* Large Final Statement in MOKOTO with Masked Lines */}
            <h2 ref={headlineRef} className={styles.statement}>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <EditableField
                  fieldPath="home.cta.line1"
                  fieldLabel="Statement Line 1"
                  value={ctaData?.line1 || 'LET’S WEAVE'}
                >
                  <span className={styles.line} style={{ display: 'block' }}>
                    {ctaData?.line1 || 'LET’S WEAVE'}
                  </span>
                </EditableField>
              </span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <EditableField
                  fieldPath="home.cta.line2"
                  fieldLabel="Statement Line 2"
                  value={ctaData?.line2 || 'SOMETHING'}
                >
                  <span className={styles.line} style={{ display: 'block' }}>
                    {ctaData?.line2 || 'SOMETHING'}
                  </span>
                </EditableField>
              </span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <EditableField
                  fieldPath="home.cta.line3"
                  fieldLabel="Statement Line 3"
                  value={ctaData?.line3 || 'REMARKABLE.'}
                >
                  <span className={`${styles.line} ${styles.crimsonText}`} style={{ display: 'block' }}>
                    {ctaData?.line3 || 'REMARKABLE.'}
                  </span>
                </EditableField>
              </span>
            </h2>

            {/* Minimal Supporting Copy */}
            <EditableField
              fieldPath="home.cta.subtext"
              fieldLabel="CTA Subtext"
              value={ctaData?.subtext || 'Transform your business objectives into a cohesive, high-performance digital experience. Let’s start the conversation.'}
              isTextarea={true}
              isBlock={true}
            >
              <p ref={subtextRef} className={styles.subtext}>
                {ctaData?.subtext ||
                  'Transform your business objectives into a cohesive, high-performance digital experience. Let’s start the conversation.'}
              </p>
            </EditableField>

            {/* Flat Restrained Action Button with Magnetic GSAP Micro-Interaction */}
            <div className={styles.actionWrap}>
              <EditableField
                fieldPath="home.cta.buttonLabel"
                fieldLabel="CTA Button Label"
                value={ctaData?.buttonLabel || 'START A PROJECT'}
              >
                <Link
                  ref={buttonRef}
                  to={ctaData?.buttonUrl || '/contact'}
                  className={styles.primaryBtn}
                  aria-label="Start a project with Aranea Den"
                >
                  <span className={styles.btnLabel}>{ctaData?.buttonLabel || 'START A PROJECT'}</span>
                  <span className={styles.btnArrow} aria-hidden="true">→</span>
                </Link>
              </EditableField>
            </div>
          </div>

          {/* Right Column: Visual Alignment Anchor */}
          <div ref={visualRef} className={styles.visualCol} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
