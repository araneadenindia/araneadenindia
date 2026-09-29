import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import styles from './StatementMarquee.module.css';

gsap.registerPlugin(ScrollTrigger);

export const StatementMarquee: React.FC = () => {
  const { activeContent } = useCms();
  const statementText = activeContent.home?.marqueeText?.[0] || 'WE WEAVE YOUR DIGITAL EXCELLENCE';
  const marqueeItems = Array.from({ length: 8 }, (_, i) => ({
    id: `statement-${i}`,
    text: statementText,
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ticker = tickerRef.current;
    if (!section || !ticker) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // ── Base continuous ticker scroll (buttery linear) ──
    tweenRef.current = gsap.to(ticker, {
      xPercent: -50,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    // ── Cinematic entrance: section fades + slides up ──
    gsap.fromTo(
      section,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );

    // ── Scroll-velocity speed boost: ScrollTrigger native velocity tracking ──
    const velocityTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (!tweenRef.current) return;
        const vel = Math.abs(self.getVelocity() / 300);
        const targetScale = 1 + Math.min(vel, 3);
        gsap.to(tweenRef.current, {
          timeScale: targetScale,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            if (tweenRef.current) {
              gsap.to(tweenRef.current, {
                timeScale: 1,
                duration: 1.2,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }
          },
        });
      },
    });

    // ── Offscreen Pause & Glow-intensity pulse on scroll enter ──
    const glowEls = section.querySelectorAll<HTMLElement>(`.${styles.glowingText}`);
    const pulseTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: () => {
        tweenRef.current?.resume();
        gsap.to(glowEls, {
          textShadow: '0 0 24px rgba(223,37,49,1), 0 0 60px rgba(223,37,49,0.4)',
          duration: 0.6,
          ease: 'power2.out',
        });
      },
      onLeave: () => {
        tweenRef.current?.pause();
        gsap.to(glowEls, {
          textShadow: '0 0 8px rgba(223,37,49,0.5)',
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
      onEnterBack: () => {
        tweenRef.current?.resume();
        gsap.to(glowEls, {
          textShadow: '0 0 24px rgba(223,37,49,1), 0 0 60px rgba(223,37,49,0.4)',
          duration: 0.6,
          ease: 'power2.out',
        });
      },
      onLeaveBack: () => {
        tweenRef.current?.pause();
        gsap.to(glowEls, {
          textShadow: '0 0 8px rgba(223,37,49,0.5)',
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
    });

    return () => {
      tweenRef.current?.kill();
      velocityTrigger.kill();
      pulseTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Brand Statement Marquee">
      <div className={styles.inner}>
        <div ref={tickerRef} className={styles.ticker}>
          {marqueeItems.map((item, idx) => (
            <div key={item.id} className={styles.statementItem}>
              {/* Crisp Red Glowing Brand Emblem */}
              <div className={styles.glowingEmblem} aria-hidden="true">
                <img
                  src="/AD Transparent SVG.svg"
                  alt="Aranea Den Brandmark"
                  className={styles.glowingLogo}
                  loading="lazy"
                />
              </div>

              {/* Cinematic Red Glow Typography */}
              {idx === 0 ? (
                <EditableField
                  fieldPath="home.marqueeText.0"
                  fieldLabel="Marquee Statement"
                  value={statementText}
                >
                  <span className={styles.glowingText}>{item.text}</span>
                </EditableField>
              ) : (
                <span className={styles.glowingText}>{item.text}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatementMarquee;
