import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TestimonialsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  tag: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote:
      'Aranea Den completely redefined our brand and digital presence. Their ability to fuse bold cinematic visuals with rock-solid engineering elevated our entire ecosystem across investor circles.',
    author: 'Karthik Varma',
    role: 'Co-Founder',
    company: 'Startup Potluck',
    tag: 'BRAND & PLATFORM',
    initials: 'KV',
  },
  {
    id: 'test-2',
    quote:
      'From creative strategy to full-stack execution, the discipline and technical craftsmanship of the Aranea Den team was extraordinary. Our flagship digital platform exceeded every benchmark.',
    author: 'Rajeshwari Rao',
    role: 'Creative Director',
    company: 'Corner Craft',
    tag: 'FLAGSHIP E-COMMERCE',
    initials: 'RR',
  },
  {
    id: 'test-3',
    quote:
      'Architectural storytelling, flawless media production, and a high-performance web experience that commanded executive attention. They operate with relentless precision.',
    author: 'Vikramaditya S.',
    role: 'Managing Director',
    company: 'CEO Expos',
    tag: 'EXECUTIVE MEDIA & WEB',
    initials: 'VS',
  },
  {
    id: 'test-4',
    quote:
      'They didn’t just build a portfolio site; they captured the architectural soul of our studio. Clean, uncompromising aesthetics paired with fluid interactive performance.',
    author: 'Ananya Sen',
    role: 'Principal Architect',
    company: 'Maakan Designs',
    tag: 'DIGITAL FLAGSHIP',
    initials: 'AS',
  },
  {
    id: 'test-5',
    quote:
      'Building a complex education platform requires deep engineering rigor. Aranea Den delivered seamless architecture connecting mentors and students nationwide with zero friction.',
    author: 'Dr. Praveen Kumar',
    role: 'Director',
    company: 'O2Med Academy',
    tag: 'FULL-STACK CLOUD SYSTEM',
    initials: 'PK',
  },
  {
    id: 'test-6',
    quote:
      'The high-retention cinematic video production and cohesive digital brand identity transformed our advisory reach. Audience engagement grew tenfold within weeks of launch.',
    author: 'Veerabhadra Rao',
    role: 'Founder',
    company: 'Finance with Veeru',
    tag: 'CINEMATOGRAPHY & BRAND',
    initials: 'VR',
  },
];

export const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Duplicate array once for seamless infinite -50% CSS looping
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Pause ticker when section is offscreen to preserve CPU cycles
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => section.classList.remove(styles.isPaused),
        onLeave: () => section.classList.add(styles.isPaused),
        onEnterBack: () => section.classList.remove(styles.isPaused),
        onLeaveBack: () => section.classList.add(styles.isPaused),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Client Testimonials">
      <div className={styles.container}>
        <div ref={headerRef} className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.eyebrowText}>CLIENT PERSPECTIVES</span>
          </div>
          <h2 className={styles.title}>VOICES OF PARTNERSHIP</h2>
          <p className={styles.subtitle}>
            Trusted by founders, leaders, and emerging enterprises to architect high-performance digital reality.
          </p>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Testimonial Track (Hover to Pause) */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack} role="region" aria-label="Auto-scrolling client testimonials">
          {duplicatedTestimonials.map((item, idx) => (
            <article key={`${item.id}-${idx}`} className={styles.card}>
              <div className={styles.cardTopBar} aria-hidden="true" />

              <div className={styles.cardHeader}>
                <div className={styles.rating} aria-label="5 out of 5 stars">
                  {'★'.repeat(5)}
                </div>
                <span className={styles.tagBadge}>{item.tag}</span>
              </div>

              <blockquote className={styles.quoteText}>
                "{item.quote}"
              </blockquote>

              <footer className={styles.authorRow}>
                <div className={styles.authorAvatar} aria-hidden="true">
                  {item.initials}
                </div>
                <div className={styles.authorMeta}>
                  <cite className={styles.authorName}>{item.author}</cite>
                  <span className={styles.authorRole}>
                    {item.role} · {item.company}
                  </span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
