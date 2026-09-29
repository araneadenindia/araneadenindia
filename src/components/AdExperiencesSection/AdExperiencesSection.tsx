import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AdExperiencesSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export interface ShowcaseExperience {
  id: string;
  client: string;
  tag: string;
  title: string;
  matter: string;
  imageSrc: string;
  linkUrl: string;
  isExternal?: boolean;
}

export const SHOWCASE_DATA: ShowcaseExperience[] = [
  {
    id: 'exp-pooja',
    client: 'Pooja Productions',
    tag: 'FILM & ENTERTAINMENT PLATFORM',
    title: 'Pooja Productions — Editorial Film Platform & Streaming Archive',
    matter:
      'Architected an ultra-responsive, editorial-grade web platform and streaming preview portal for award-winning film production house Pooja Productions. The platform was engineered with custom video player pipelines, adaptive bitrate previews, and a monolithic archival architecture that balances cinematic immersion with sub-second page loads. Every interaction, from typography scaling to poster depth shaders, was designed to honor the artistry of high-caliber Indian cinema.',
    imageSrc: '/portfolio-thumbs/pooja.jpg',
    linkUrl: 'https://poojaproductions.com',
    isExternal: true,
  },
  {
    id: 'exp-ceo-expos',
    client: 'CEO Expos',
    tag: 'EXECUTIVE CONFERENCES & SUMMITS',
    title: 'CEO Expos — National Exhibition Digital Infrastructure & Summit Media',
    matter:
      'Engineered the full-stack digital operational engine and attendee acquisition funnel for India’s premier franchise and business expositions. The system powers real-time exhibitor booth bookings, multi-tier visitor registration, dynamic pass generation, and multi-camera live telecast integrations across major convention centers in Andhra Pradesh. Delivered a scalable, edge-cached web architecture paired with on-ground technical production.',
    imageSrc: '/portfolio-thumbs/creators.jpg',
    linkUrl: 'https://creatorseventsorganization.vercel.app/',
    isExternal: true,
  },
  {
    id: 'exp-meghana',
    client: 'Meghana Builders',
    tag: 'CIVIL INFRASTRUCTURE & REAL ESTATE',
    title: 'Meghana Builders — Architectural Landmark Platform & Property Showcase',
    matter:
      'Designed and developed a monumental landmark property platform for one of Hyderabad’s premier civil engineering and infrastructure firms. Crafted bespoke 3D spatial layout showcases, dynamic property spec sheets, interactive floor plan telemetry, and an encrypted client inquiry pipeline. Built with Next.js and optimized for effortless navigation across commercial and residential developments.',
    imageSrc: '/portfolio-thumbs/meghana.jpg',
    linkUrl: 'https://meghanabuilders.com',
    isExternal: true,
  },
  {
    id: 'exp-jk-restaurant',
    client: 'JK Restaurant',
    tag: 'CULINARY BRANDING & SOCIAL GROWTH',
    title: 'JK Restaurant — Sensory Gastronomy Branding & Digital Ordering Ecosystem',
    matter:
      'Developed a synchronized digital ordering platform and culinary brand narrative for Rajahmundry’s premier dining landmark. The solution incorporates high-definition visual menu engineering, localized table reservation pipelines, instant kitchen telemetry, and geo-targeted social acquisition funnels that drove substantial footfall growth across East Godavari.',
    imageSrc: '/portfolio-thumbs/thor.jpg',
    linkUrl: '/services/digital-marketing',
    isExternal: false,
  },
  {
    id: 'exp-sriyasjaan',
    client: 'Sriya & Janak',
    tag: 'LUXURY PRIVATE FLAGSHIPS',
    title: 'Sriya & Janak — Private Luxury Celebration Flagship & Digital Atelier',
    matter:
      'Engineered an intimate, bespoke digital celebration flagship featuring editorial typography, password-gated itinerary access, private RSVP management, and a high-resolution cloud photo gallery. The application provides guests with synchronized event itineraries, location navigation, and high-fidelity media delivery across 3-day wedding celebrations in Hyderabad.',
    imageSrc: '/portfolio-thumbs/sriyasjaan.jpg',
    linkUrl: 'https://sriyasjaan.com',
    isExternal: true,
  },
  {
    id: 'exp-finance-veeru',
    client: 'Finance with Veeru',
    tag: 'FINANCIAL ADVISORY & REEL FUNNELS',
    title: 'Finance with Veeru — Authoritative Wealth Advisory & Educational Platform',
    matter:
      'Crafted an authoritative personal branding and digital learning ecosystem for South India’s premier financial advisor. Engineered conversion funnels, educational course catalogs, automated webinar lead pipelines, and personal advisory scheduling architectures designed to convert organic reach into long-term wealth management clients.',
    imageSrc: '/portfolio-thumbs/viraj.jpg',
    linkUrl: '/services/digital-marketing',
    isExternal: false,
  },
  {
    id: 'exp-youth-fest',
    client: 'District Youth Festival 2026',
    tag: 'HACKATHONS & YOUTH SUMMITS',
    title: 'District Youth Festival 2026 — Youth Empowerment & Technical Hackathons',
    matter:
      'Engineered the official digital registration engine, competitive event matrix, automated badge issuing, and live stage management for 2,500+ student participants, innovators, and cultural performers. Integrated real-time team submissions, jury scoring protocols, and on-ground broadcast pipelines.',
    imageSrc: '/services/03-branding.jpg',
    linkUrl: '/announcements',
    isExternal: false,
  },
  {
    id: 'exp-broadcasting',
    client: 'Imperial Broadcast Network',
    tag: 'MULTI-CAMERA LIVE STREAMING & BROADCASTING',
    title: 'Imperial Broadcast Network — 4K Multi-Camera Live Telecast Architecture',
    matter:
      'Designed and executed multi-camera 4K broadcast infrastructures, satellite uplink telemetry, and multi-channel live streaming pipelines for high-profile business summits, sports tournaments, and musical concerts across Telangana and Andhra Pradesh. Features real-time broadcast overlays, audio mastering, and sub-second stream latency.',
    imageSrc: '/services/07-videography.jpg',
    linkUrl: '/services/video-production',
    isExternal: false,
  },
];

export const AdExperiencesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 28 },
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

      const cards = section.querySelectorAll(`.${styles.showcaseCard}`);
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-labelledby="ad-experiences-heading"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.eyebrowText}>AD EXPERIENCES</span>
          </div>

          <h2 id="ad-experiences-heading" className={styles.heading}>
            AD EXPERIENCES
          </h2>

          <p className={styles.supportingLine}>
            From the first idea to the final experience.
          </p>

          <p className={styles.headerDescription}>
            A curated index of how Aranea Den conceptualizes, designs, develops, and delivers digital reality—spanning flagship web platforms, brand systems, and physical computing.
          </p>
        </div>

        {/* Full Cards Vertical Scroll List */}
        <div className={styles.showcaseList}>
          {SHOWCASE_DATA.map((item) => (
            <article key={item.id} className={styles.showcaseCard}>
              {/* Left Column: Title & Detailed Matter */}
              <div className={styles.matterCol}>
                <div className={styles.cardEyebrow}>
                  <span className={styles.cardEyebrowText}>
                    {item.tag}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>

                <p className={styles.cardMatter}>{item.matter}</p>

                <div className={styles.cardActionRow}>
                  {item.isExternal ? (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.visitRedBtn}
                      aria-label={`Visit ${item.title}`}
                    >
                      <span>VISIT</span>
                      <span className={styles.visitRedBtnArrow} aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      to={item.linkUrl}
                      className={styles.visitRedBtn}
                      aria-label={`Visit ${item.title}`}
                    >
                      <span>VISIT</span>
                      <span className={styles.visitRedBtnArrow} aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: One Single Image */}
              <div className={styles.imageCol}>
                {item.isExternal ? (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.imageLinkWrapper}
                    aria-label={`Preview of ${item.title}`}
                  >
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      loading="lazy"
                      className={styles.cardImage}
                    />
                  </a>
                ) : (
                  <Link
                    to={item.linkUrl}
                    className={styles.imageLinkWrapper}
                    aria-label={`Preview of ${item.title}`}
                  >
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      loading="lazy"
                      className={styles.cardImage}
                    />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdExperiencesSection;
