import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ClienteleSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export interface ClientLogo {
  id: number | string;
  name: string;
  src: string;
  url?: string;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: 1, src: '/clientele/meghana-builders.webp', name: 'Meghana Builders', url: 'https://meghanabuilders.com' },
  { id: 2, src: '/clientele/pooja-productions.png', name: 'Pooja Productions', url: 'https://poojaproductions.com' },
  { id: 3, src: '/clientele/makaan-infrastructure.png', name: 'Makaan Infrastructure', url: 'https://makaaninfra.com' },
  { id: 4, src: '/clientele/pp-connekts.png', name: 'P&P Connekts', url: 'https://pandpconnektss.web.app' },
  { id: 5, src: '/clientele/thor-cuisine.png', name: 'Thor Indian Cuisine', url: 'https://thor-indian-cuisinse.firebaseapp.com' },
  { id: 6, src: '/clientele/nri-360.png', name: 'NRI 360', url: 'https://nri360degrees.com' },
  { id: 7, src: '/clientele/viraj-academy.png', name: 'Viraj Academy', url: 'https://virajedu.com' },
  { id: 8, src: '/clientele/ishoots.jpg', name: 'ISHOOTS', url: 'https://ishoots.com' },
  { id: 9, src: '/clientele/sriya-janak.jpg', name: 'Sriya & Janak', url: 'https://sriyasjaan.com' },
];

export interface ClienteleSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ClienteleSection: React.FC<ClienteleSectionProps> = ({
  eyebrow = 'OUR CLIENTELE',
  title = 'TRUSTED BY VISIONARY BRANDS',
  subtitle = 'Partnering with ambitious teams across technology, luxury, commerce, and media.',
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector(`.${styles.headerCenter}`);
      const marquee = section.querySelector(`.${styles.marqueeWrapper}`);

      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          }
        );
      }

      if (marquee) {
        gsap.fromTo(
          marquee,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.15,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const [clientList, setClientList] = React.useState<ClientLogo[]>(CLIENT_LOGOS);

  React.useEffect(() => {
    fetch('/api/cms/clients')
      .then((res) => res.json())
      .then((res) => {
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const cmsLogos: ClientLogo[] = res.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            src: c.logo_url || '/clientele/meghana-builders.webp',
            url: c.website_url || undefined,
          }));
          setClientList(cmsLogos);
        }
      })
      .catch(() => {});
  }, []);

  // Repeat enough times to guarantee a seamless marquee loop
  const repeatCount = Math.max(4, Math.ceil(12 / (clientList.length || 1)));
  const repeatedLogos: ClientLogo[] = [];
  for (let i = 0; i < repeatCount; i++) {
    repeatedLogos.push(...clientList);
  }

  return (
    <section
      ref={sectionRef}
      className={`${styles.clienteleSection} ${className}`}
      aria-label={title}
    >
      <div className={styles.container}>
        <div className={styles.headerCenter}>
          <span className={styles.eyebrowText}>{eyebrow}</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      {/* Seamless Infinite Marquee Track with Masked Fade Edges */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.track}>
          {repeatedLogos.map((logo, index) => {
            const indexNumber = String((index % (clientList.length || 1)) + 1).padStart(2, '0');
            const cardContent = (
              <div
                className={styles.clientCard}
                title={logo.name}
              >
                {/* Red hairline accent on card top */}
                <div className={styles.cardAccentLine} aria-hidden="true" />

                {/* Red architectural index marker */}
                <span className={styles.cardIndex} aria-hidden="true">
                  {indexNumber}
                </span>

                <img
                  src={logo.src}
                  alt={logo.name}
                  className={styles.clientLogoImg}
                  loading="lazy"
                />

                {/* Subtle red corner tick */}
                <span className={styles.cardCornerTick} aria-hidden="true" />
              </div>
            );

            if (logo.url) {
              return (
                <a
                  key={`${logo.id}-${index}`}
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {cardContent}
                </a>
              );
            }

            return <React.Fragment key={`${logo.id}-${index}`}>{cardContent}</React.Fragment>;
          })}
        </div>
      </div>
    </section>
  );
};
