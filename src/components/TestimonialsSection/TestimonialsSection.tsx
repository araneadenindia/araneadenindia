import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import styles from './TestimonialsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  company?: string;
  role?: string;
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
  const {
    activeContent,
    isAdmin,
    isEditMode,
    isPreviewMode,
    addCollectionItem,
    duplicateCollectionItem,
    removeCollectionItem,
  } = useCms();
  const canEdit = isAdmin && isEditMode && !isPreviewMode;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const testimonialsData = activeContent.home?.testimonials || {
    eyebrow: 'TESTIMONIALS',
    title: 'WHAT PARTNERS SAY ABOUT ARANEA DEN',
    items: TESTIMONIALS,
  };

  const list = testimonialsData.items && testimonialsData.items.length > 0
    ? testimonialsData.items
    : TESTIMONIALS;

  // Duplicate list to achieve continuous, seamless -50% CSS looping
  const duplicatedTestimonials = [...list, ...list];

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
            <EditableField
              fieldPath="home.testimonials.eyebrow"
              fieldLabel="Testimonials Eyebrow"
              value={testimonialsData.eyebrow}
            >
              <span className={styles.eyebrowText}>{testimonialsData.eyebrow}</span>
            </EditableField>
          </div>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Testimonial Track (Hover to pause) */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack} role="region" aria-label="Client testimonials ticker">
          {duplicatedTestimonials.map((item, idx) => {
            const originalIndex = idx % list.length;
            return (
              <article key={`${item.id}-${idx}`} className={styles.card}>
                {canEdit && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateCollectionItem('home.testimonials.items', originalIndex);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ⧉ DUPLICATE
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this testimonial?')) {
                          removeCollectionItem('home.testimonials.items', originalIndex);
                        }
                      }}
                      style={{
                        background: 'rgba(223,37,49,0.2)',
                        border: '1px solid rgba(223,37,49,0.4)',
                        color: '#df2531',
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      🗑 REMOVE
                    </button>
                  </div>
                )}
                <EditableField
                  fieldPath={`home.testimonials.items.${originalIndex}.quote`}
                  fieldLabel="Quote"
                  value={item.quote}
                  isTextarea
                >
                  <p className={styles.quoteText}>“{item.quote}”</p>
                </EditableField>
                <footer className={styles.authorRow}>
                  <EditableField
                    fieldPath={`home.testimonials.items.${originalIndex}.author`}
                    fieldLabel="Author"
                    value={item.author}
                  >
                    <span className={styles.authorName}>{item.author}</span>
                  </EditableField>
                  <span className={styles.authorDivider}>—</span>
                  <EditableField
                    fieldPath={`home.testimonials.items.${originalIndex}.company`}
                    fieldLabel="Company"
                    value={item.company || item.role || ''}
                  >
                    <span className={styles.authorCompany}>{item.company || item.role}</span>
                  </EditableField>
                </footer>
              </article>
            );
          })}
        </div>
      </div>

      {canEdit && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="cms-add-testimonial-btn"
            onClick={() => {
              const newT = {
                id: `test-${Date.now()}`,
                quote: 'Aranea Den delivered beyond our expectations with unmatched speed and aesthetic excellence.',
                author: 'Executive Partner',
                role: 'Founder & CEO',
                company: 'Global Enterprise',
              };
              addCollectionItem('home.testimonials.items', newT);
            }}
            style={{
              padding: '0.7rem 1.4rem',
              background: '#df2531',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              boxShadow: '0 4px 15px rgba(223, 37, 49, 0.4)',
            }}
          >
            + ADD TESTIMONIAL
          </button>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
