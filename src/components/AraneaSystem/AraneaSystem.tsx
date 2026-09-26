import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AraneaSystem.module.css';

gsap.registerPlugin(ScrollTrigger);

interface PhilosophyStage {
  number: string;
  name: string;
  summary: string;
}

const PHILOSOPHY_STAGES: PhilosophyStage[] = [
  {
    number: '01',
    name: 'STRATEGY',
    summary: 'Understand the business, identify opportunities, and define a clear digital direction.',
  },
  {
    number: '02',
    name: 'DESIGN',
    summary: 'Create intuitive, distinctive experiences that connect with people.',
  },
  {
    number: '03',
    name: 'BUILD',
    summary: 'Develop scalable websites, applications, and digital solutions with precision.',
  },
  {
    number: '04',
    name: 'GROW',
    summary: 'Improve performance, strengthen visibility, and evolve through continuous refinement.',
  },
];

export const AraneaSystem: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  // Desktop refs
  const desktopStagesRef = useRef<HTMLDivElement>(null);
  const desktopProgressRef = useRef<HTMLDivElement>(null);
  const stageColsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Mobile refs
  const mobileStagesRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const mobileStageColsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStage, setActiveStage] = useState(0);
  const [mobileActiveStage, setMobileActiveStage] = useState(0);

  // Click on stage column on desktop
  const handleStageClick = useCallback((index: number) => {
    setActiveStage(index);
    const st = ScrollTrigger.getById('philosophy-pin');
    if (st) {
      const targetProgress = (index + 0.5) / PHILOSOPHY_STAGES.length;
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (desktopProgressRef.current) {
      const targetPercent = ((index + 0.5) / PHILOSOPHY_STAGES.length) * 100;
      gsap.to(desktopProgressRef.current, {
        width: `${targetPercent}%`,
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (desktopProgressRef.current) desktopProgressRef.current.style.width = '100%';
      if (mobileProgressRef.current) mobileProgressRef.current.style.height = '100%';
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal eyebrow, headline, and subtext with subtle upward text animation
      if (headerRef.current) {
        gsap.fromTo(
          [eyebrowRef.current, headlineRef.current, subtextRef.current],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 80%',
            },
          }
        );
      }

      const mm = gsap.matchMedia();

      // DESKTOP GSAP SCROLL EXPERIENCE (min-width: 769px)
      // PINNED: User stays in section until the red line finishes (100% across the 4 stages)
      mm.add('(min-width: 769px)', () => {
        const pinTrigger = ScrollTrigger.create({
          id: 'philosophy-pin',
          trigger: wrapper,
          start: 'top top',
          end: '+=120%',
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress; // 0.0 to 1.0
            if (desktopProgressRef.current) {
              const targetWidth = Math.min(100, Math.max(0, p * 100));
              desktopProgressRef.current.style.width = `${targetWidth}%`;
            }
            const activeIdx = Math.min(3, Math.floor(p * PHILOSOPHY_STAGES.length));
            setActiveStage(activeIdx);
          },
        });

        // Sequential entrance of columns when section first reaches viewport
        const cols = stageColsRef.current.filter(Boolean);
        if (cols.length > 0) {
          gsap.fromTo(
            cols,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 78%',
              },
            }
          );
        }

        return () => {
          pinTrigger.kill();
        };
      });

      // MOBILE GSAP SCROLL EXPERIENCE (max-width: 768px)
      mm.add('(max-width: 768px)', () => {
        const mobileContainer = mobileStagesRef.current;
        if (!mobileContainer) return;

        // Animate vertical progress rail and highlight each stage as user scrolls
        ScrollTrigger.create({
          trigger: mobileContainer,
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress;
            if (mobileProgressRef.current) {
              const targetHeight = Math.min(100, Math.max(12, p * 100));
              mobileProgressRef.current.style.height = `${targetHeight}%`;
            }
            const activeIdx = Math.min(3, Math.floor(p * PHILOSOPHY_STAGES.length));
            setMobileActiveStage(activeIdx);
          },
        });

        // Gentle sequential entrance for each mobile stage
        const mobileCols = mobileStageColsRef.current.filter(Boolean);
        mobileCols.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
              },
            }
          );
        });
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.systemWrapper}>
      <section ref={sectionRef} id="philosophy" className={styles.section} aria-label="Our Philosophy">
        <div className={styles.container}>
          {/* Eyebrow Label */}
          <div ref={eyebrowRef} className={styles.eyebrow}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.eyebrowText}>OUR PHILOSOPHY</span>
          </div>

          {/* Master Editorial Header */}
          <div ref={headerRef} className={styles.headerBlock}>
            <h2 ref={headlineRef} className={styles.headline}>
              A CONNECTED DISCIPLINE ENGINE: UNITING STRATEGY, DESIGN, TECHNOLOGY, CONTENT, AND GROWTH.
            </h2>
            <p ref={subtextRef} className={styles.subtext}>
              We bring strategy, creativity, and technology together to create meaningful digital experiences.
            </p>
          </div>

          {/* ── DESKTOP CONTINUOUS EDITORIAL COMPOSITION ── */}
          <div ref={desktopStagesRef} className={styles.desktopComposition}>
            {/* Precision Progress Track with Crimson Runner */}
            <div className={styles.timelineTrack} aria-hidden="true">
              <div className={styles.timelineBaseLine} />
              <div ref={desktopProgressRef} className={styles.timelineProgressBar} />
              <div className={styles.timelineNodes}>
                {PHILOSOPHY_STAGES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${styles.timelineNode} ${idx <= activeStage ? styles.nodeActive : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* 4 Connected Philosophy Columns */}
            <div className={styles.stagesRow}>
              {PHILOSOPHY_STAGES.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={stage.number}
                    ref={(el) => {
                      stageColsRef.current[idx] = el;
                    }}
                    type="button"
                    className={`${styles.stageCol} ${isActive ? styles.stageActive : ''}`}
                    onClick={() => handleStageClick(idx)}
                    aria-label={`${stage.number} ${stage.name}`}
                  >
                    {/* Stage Number */}
                    <div className={styles.stageMeta}>
                      <span className={styles.stageNumber}>{stage.number}</span>
                    </div>

                    {/* Stage Title */}
                    <h3 className={styles.stageName}>{stage.name}</h3>

                    {/* Stage Description */}
                    <p className={styles.stageSummary}>{stage.summary}</p>

                    {/* Minimal Accent Baseline */}
                    <div className={styles.stageAccentBar} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── MOBILE VERTICAL EDITORIAL COMPOSITION ── */}
          <div ref={mobileStagesRef} className={styles.mobileComposition}>
            {/* Vertical Progress Rail */}
            <div className={styles.mobileRail} aria-hidden="true">
              <div className={styles.mobileRailTrack} />
              <div ref={mobileProgressRef} className={styles.mobileRailProgress} />
            </div>

            {/* Vertically Stacked Philosophy Stages */}
            <div className={styles.mobileStagesList}>
              {PHILOSOPHY_STAGES.map((stage, idx) => {
                const isActive = idx === mobileActiveStage;
                return (
                  <div
                    key={stage.number}
                    ref={(el) => {
                      mobileStageColsRef.current[idx] = el;
                    }}
                    className={`${styles.mobileStageItem} ${isActive ? styles.mobileStageActive : ''}`}
                  >
                    <div className={styles.mobileStageIndicator} aria-hidden="true">
                      <span
                        className={`${styles.mobileNode} ${isActive ? styles.mobileNodeActive : ''}`}
                      />
                    </div>
                    <div className={styles.mobileStageContent}>
                      <div className={styles.mobileStageMeta}>
                        <span className={styles.mobileStageNumber}>{stage.number}</span>
                      </div>
                      <h3 className={styles.mobileStageName}>{stage.name}</h3>
                      <p className={styles.mobileStageSummary}>{stage.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AraneaSystem;
