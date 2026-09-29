import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import { EditableMedia } from '../../cms/components/EditableMedia/EditableMedia';
import { EditableCollection } from '../../cms/components/EditableCollection/EditableCollection';
import styles from './ClienteleSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export interface ClientLogo {
  id: string;
  name: string;
  src: string;
  url?: string;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: '1', src: '/clientele/meghana-builders.webp', name: 'Meghana Builders', url: 'https://meghanabuilders.com' },
  { id: '2', src: '/clientele/pooja-productions.png', name: 'Pooja Productions', url: 'https://poojaproductions.com' },
  { id: '3', src: '/clientele/makaan-infrastructure.png', name: 'Makaan Infrastructure', url: 'https://makaaninfra.com' },
  { id: '4', src: '/clientele/pp-connekts.png', name: 'P&P Connekts', url: 'https://pandpconnektss.web.app' },
  { id: '5', src: '/clientele/thor-cuisine.png', name: 'Thor Indian Cuisine', url: 'https://thor-indian-cuisinse.firebaseapp.com' },
  { id: '6', src: '/clientele/nri-360.png', name: 'NRI 360', url: 'https://nri360degrees.com' },
  { id: '7', src: '/clientele/viraj-academy.png', name: 'Viraj Academy', url: 'https://virajedu.com' },
  { id: '8', src: '/clientele/ishoots.jpg', name: 'ISHOOTS', url: 'https://ishoots.com' },
  { id: '9', src: '/clientele/sriya-janak.jpg', name: 'Sriya & Janak', url: 'https://sriyasjaan.com' },
];

export interface ClienteleSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ClienteleSection: React.FC<ClienteleSectionProps> = ({
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeContent, isEditMode } = useCms();
  const clientsData = activeContent?.home?.clients;
  const clientList: ClientLogo[] = clientsData?.items?.length
    ? clientsData.items.map((item) => ({
        id: String(item.id),
        name: item.name,
        src: item.src,
        url: item.url,
      }))
    : CLIENT_LOGOS;

  const createDefaultClient = (): ClientLogo => ({
    id: `c-${Date.now()}`,
    name: 'New Client Partner',
    src: '/clientele/meghana-builders.webp',
    url: 'https://araneaden.com',
  });

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
      aria-label={clientsData?.title || 'Our Clientele'}
    >
      <div className={styles.container}>
        <div className={styles.headerCenter}>
          <EditableField
            fieldPath="home.clients.eyebrow"
            fieldLabel="Clientele Eyebrow"
            value={clientsData?.eyebrow || 'OUR CLIENTELE'}
          >
            <span className={styles.eyebrowText}>{clientsData?.eyebrow || 'OUR CLIENTELE'}</span>
          </EditableField>

          <EditableField
            fieldPath="home.clients.title"
            fieldLabel="Clientele Title"
            value={clientsData?.title || 'TRUSTED BY VISIONARY BRANDS'}
          >
            <h2 className={styles.title}>{clientsData?.title || 'TRUSTED BY VISIONARY BRANDS'}</h2>
          </EditableField>

          <EditableField
            fieldPath="home.clients.subtitle"
            fieldLabel="Clientele Subtitle"
            value={clientsData?.subtitle || 'Partnering with ambitious teams across technology, luxury, commerce, and media.'}
            isTextarea={true}
            isBlock={true}
          >
            <p className={styles.subtitle}>
              {clientsData?.subtitle || 'Partnering with ambitious teams across technology, luxury, commerce, and media.'}
            </p>
          </EditableField>
        </div>

        {/* Dedicated Admin Collection Editor when in Edit Mode */}
        {isEditMode && (
          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <EditableCollection
              collectionPath="home.clients.items"
              itemTypeLabel="Client Partner Logo"
              items={clientList}
              createDefaultItem={createDefaultClient}
              containerClassName={styles.adminClientsGrid}
              renderItem={(logo: any, index: number) => (
                <div
                  key={logo.id || index}
                  style={{
                    backgroundColor: '#141418',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <EditableMedia
                    mediaPath={`home.clients.items.${index}.src`}
                    mediaLabel={`${logo.name || 'Client'} Logo`}
                    media={{ type: 'image', url: logo.src || '/clientele/meghana-builders.webp' }}
                    supportedTypes={['image']}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name || 'Client Logo'}
                      style={{ maxHeight: '48px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </EditableMedia>
                  <EditableField
                    fieldPath={`home.clients.items.${index}.name`}
                    fieldLabel="Client Name"
                    value={logo.name || ''}
                  >
                    <span style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: 600 }}>{logo.name || 'Client Name'}</span>
                  </EditableField>
                </div>
              )}
            />
          </div>
        )}
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
