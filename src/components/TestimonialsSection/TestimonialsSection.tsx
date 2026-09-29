import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TestimonialsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  company: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    quote: 'Aranea Den completely redefined our brand and digital presence.',
    author: 'Karthik Varma',
    company: 'Startup Potluck',
  },
  {
    id: 'test-2',
    quote: 'Disciplined technical craftsmanship paired with fluid, high-performance execution.',
    author: 'Rajeshwari Rao',
    company: 'Corner Craft',
  },
  {
    id: 'test-3',
    quote: 'Architectural storytelling and a web experience that commanded executive attention.',
    author: 'Vikramaditya S.',
    company: 'CEO Expos',
  },
  {
    id: 'test-4',
    quote: 'Clean, uncompromising aesthetics paired with fluid interactive performance.',
    author: 'Ananya Sen',
    company: 'Maakan Designs',
  },
  {
    id: 'test-5',
    quote: 'Seamless cloud architecture and engineering rigor delivered with zero friction.',
    author: 'Dr. Praveen Kumar',
    company: 'O2Med Academy',
  },
  {
    id: 'test-6',
    quote: 'Cinematic video production and digital brand identity that transformed our reach.',
    author: 'Veerabhadra Rao',
    company: 'Finance with Veeru',
  },
  {
    id: 'test-7',
    quote: 'Exceptional clarity in brand design and relentless precision in development.',
    author: 'Sriya Reddy',
    company: 'Sriya & Janak',
  },
  {
    id: 'test-8',
    quote: 'Elevated our luxury real estate positioning with extraordinary finesse.',
    author: 'Rohit Mehta',
    company: 'Meghana Builders',
  },
];

export const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Duplicate list to achieve continuous, seamless -50% CSS looping
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
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          }
        );
      }

      // Pause ticker when offscreen to preserve system resources
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
            <span className={styles.eyebrowText}>TESTIMONIALS</span>
          </div>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Testimonial Track (Hover to pause) */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack} role="region" aria-label="Client testimonials ticker">
          {duplicatedTestimonials.map((item, idx) => (
            <article key={`${item.id}-${idx}`} className={styles.card}>
              <p className={styles.quoteText}>“{item.quote}”</p>
              <footer className={styles.authorRow}>
                <span className={styles.authorName}>{item.author}</span>
                <span className={styles.authorDivider}>—</span>
                <span className={styles.authorCompany}>{item.company}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
