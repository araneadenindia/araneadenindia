import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AnnouncementsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   10 ANNOUNCEMENTS — real Aranea Den data
───────────────────────────────────────── */
export interface AnnouncementItem {
  id: string;
  category: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'hackathon-2026',
    category: 'HACKATHONS',
    badge: 'OCT 2026',
    title: 'Aranea Code Nexus Hackathon 2026',
    description: '48-hour global sprint for creative technologists. Build next-gen apps, spatial interfaces, and sensory prototypes with our team.',
    image: '/portfolio-thumbs/thor.jpg',
    link: '/contact',
  },
  {
    id: 'ai-masterclass',
    category: 'WORKSHOPS',
    badge: 'ENROLLING NOW',
    title: 'Systems Architecture & AI Masterclass',
    description: 'Intensive hands-on training in production Next.js, WebGL, real-time microservices, and AI integrations directly with our lead engineers.',
    image: '/portfolio-thumbs/cornercraft.jpg',
    link: '/services',
  },
  {
    id: 'imperial-visuals-launch',
    category: 'IMPERIAL VISUALS',
    badge: 'NEW',
    title: 'AD Imperial Visuals — Creative Suite Launch',
    description: 'Full-spectrum cinematic motion: 4K narrative reels, 3D motion design, acoustic choreography, and high-impact brand campaigns.',
    image: '/portfolio-thumbs/creators.jpg',
    link: '/portfolio',
  },
  {
    id: 'iot-hardware-labs',
    category: 'HARDWARE & IOT',
    badge: 'LABS',
    title: 'Hardware & Embedded Solutions Lab',
    description: 'Custom sensory microcontrollers, IoT installations, and interactive smart exhibits bridging physical and computational design.',
    image: '/portfolio-thumbs/viraj.jpg',
    link: '/contact',
  },
  {
    id: 'brand-identity-sprint',
    category: 'GRAPHIC DESIGN',
    badge: 'OPEN',
    title: 'Brand Identity Sprint — Q4 2026',
    description: 'End-to-end identity design in 7 days. Logomark, typography system, brand guidelines, and launch-ready visual assets.',
    image: '/portfolio-thumbs/meghana.jpg',
    link: '/services/graphic-design',
  },
  {
    id: 'web-dev-intake',
    category: 'WEB DEVELOPMENT',
    badge: 'INTAKE OPEN',
    title: 'Premium Web Platform — Project Intake',
    description: 'Accepting new bespoke web projects for Q4 2026. Engineered for speed, durability, and computational elegance.',
    image: '/portfolio-thumbs/makaan.jpg',
    link: '/contact',
  },
  {
    id: 'digital-marketing-summit',
    category: 'DIGITAL MARKETING',
    badge: 'NOV 2026',
    title: 'Growth Strategy Summit — Aranea Den',
    description: 'Data-informed growth strategies and omnichannel marketing deep-dive. Real revenue and brand equity impact sessions.',
    image: '/portfolio-thumbs/nri360.jpg',
    link: '/services/digital-marketing',
  },
  {
    id: 'mobile-app-workshop',
    category: 'MOBILE',
    badge: 'DEC 2026',
    title: 'Mobile App Development Bootcamp',
    description: 'From zero to deployed: native iOS & Android with tactile micro-interactions, offline-first architecture, and scalable backends.',
    image: '/portfolio-thumbs/pooja.jpg',
    link: '/services/mobile-development',
  },
  {
    id: 'uiux-critique',
    category: 'UI / UX',
    badge: 'FREE SESSION',
    title: 'Open UI/UX Design Critique — Submit Your Work',
    description: 'Submit your product for a live design critique session with our senior UI/UX team. Structural feedback, typographic precision, and UX audit.',
    image: '/portfolio-thumbs/pandp.jpg',
    link: '/contact',
  },
  {
    id: 'sriyasjaan-collab',
    category: 'COLLABORATION',
    badge: 'LIVE PROJECT',
    title: 'Sriyasjaan Creative Collaboration — Case Study',
    description: 'Behind-the-scenes on our latest fashion x digital collaboration: identity systems, campaign visuals, and social content strategy.',
    image: '/portfolio-thumbs/sriyasjaan.jpg',
    link: '/portfolio',
  },
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export const AnnouncementsSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate for seamless infinite loop
  const items = useMemo(() => [...ANNOUNCEMENTS, ...ANNOUNCEMENTS], []);

  // GSAP continuous scroll (same technique as reels marquee)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate -50% = one full set of 10 items
    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 50,   // slower than reels — readable
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  // Pause / resume on hover
  useEffect(() => {
    if (!tweenRef.current) return;
    if (isPaused) {
      tweenRef.current.pause();
    } else {
      tweenRef.current.resume();
    }
  }, [isPaused]);

  // Manual prev / next — seek GSAP tween progress by one card step
  const handlePrev = useCallback(() => {
    if (!tweenRef.current) return;
    const wasRunning = !isPaused;
    tweenRef.current.pause();
    const cur = tweenRef.current.progress();
    const step = 1 / ANNOUNCEMENTS.length;
    const newProg = Math.max(0, cur - step);
    tweenRef.current.progress(newProg);
    if (wasRunning) tweenRef.current.resume();
  }, [isPaused]);

  const handleNext = useCallback(() => {
    if (!tweenRef.current) return;
    const wasRunning = !isPaused;
    tweenRef.current.pause();
    const cur = tweenRef.current.progress();
    const step = 1 / ANNOUNCEMENTS.length;
    const newProg = Math.min(0.99, cur + step);
    tweenRef.current.progress(newProg);
    if (wasRunning) tweenRef.current.resume();
  }, [isPaused]);

  // GSAP entrance
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [section.querySelector(`.${styles.headerBar}`), section.querySelector(`.${styles.carouselStage}`)],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 82%' },
        }
      );

      // Pause ticker when section is offscreen to preserve CPU cycles
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => tweenRef.current?.resume(),
        onLeave: () => tweenRef.current?.pause(),
        onEnterBack: () => tweenRef.current?.resume(),
        onLeaveBack: () => tweenRef.current?.pause(),
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.headerBar}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>
              <span className={styles.crimsonDot} aria-hidden="true" />
              <span className={styles.eyebrowText}>ANNOUNCEMENTS</span>
            </div>
            <h2 className={styles.sectionTitle}>
              <img
                src="/AD Transparent SVG.svg"
                alt="Aranea Den"
                className={styles.titleLogo}
                aria-hidden="true"
              />
              ANNOUNCEMENTS
            </h2>
          </div>

          <div className={styles.controlsWrap}>
            <button type="button" className={styles.arrowBtn} onClick={handlePrev} aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className={styles.arrowBtn} onClick={handleNext} aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Infinite Carousel */}
        <div className={styles.carouselStage}>
          {/* Edge fades */}
          <div className={styles.fadeLeft} aria-hidden="true" />
          <div className={styles.fadeRight} aria-hidden="true" />

          <div ref={trackRef} className={styles.carouselTrack}>
            {items.map((item, i) => (
              <article
                key={`${item.id}-${i}`}
                className={styles.card}
                aria-label={item.title}
              >
                {/* Thumbnail */}
                <div className={styles.imageFrame}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.cardImage}
                    loading={i < 3 ? 'eager' : 'lazy'}
                  />
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <span className={styles.dateBadge}>{item.badge}</span>
                </div>

                {/* Text */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                  <Link to={item.link} className={styles.actionBtn}>
                    MORE INFO
                    <span className={styles.btnArrow} aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AnnouncementsSection;
