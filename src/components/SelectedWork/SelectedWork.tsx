import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_WEBSITES } from '../../data/portfolioData';
import { ARANEA_REELS, AraneaReel } from '../../data/reelsData';
import styles from './SelectedWork.module.css';

gsap.registerPlugin(ScrollTrigger);

// Top 4 featured flagship websites on the homepage
export type WorkCategory =
  | 'websites'
  | 'apps'
  | 'marketing'
  | 'visuals'
  | 'hackathons'
  | 'broadcasting';

export interface SelectedProject {
  id: string;
  number: string;
  title: string;
  domain: string;
  url: string;
  category: string;
  metaDescription: string;
  tags: string[];
  thumbnail: string;
  actionLabel?: string;
}

const FEATURED_WEBSITES: SelectedProject[] = PORTFOLIO_WEBSITES.filter((p) => p.featuredOnHome)
  .slice(0, 4)
  .map((p, idx) => ({
    id: p.id,
    number: `0${idx + 1}`,
    title: p.title,
    domain: p.domain,
    url: p.url,
    category: p.category,
    metaDescription: p.metaDescription,
    tags: p.tags,
    thumbnail: p.thumbnail,
    actionLabel: 'VISIT LIVE PLATFORM',
  }));

const FEATURED_APPS: SelectedProject[] = [
  {
    id: 'aranea-mobile-os',
    number: '01',
    title: 'Aranea Mobile OS — Tactile Companion Application',
    domain: 'araneaden.com/app',
    url: '/services/mobile-development',
    category: 'MOBILE ECOSYSTEM & TELEMETRY',
    metaDescription:
      'Tactile companion application engineered with micro-interactions, low-latency telemetry, biometric security, and fluid 120Hz gesture response.',
    tags: ['SwiftUI', 'Offline-First SQLite', 'Biometrics', 'Haptics'],
    thumbnail: '/services/ad-mobile-development.jpg',
    actionLabel: 'EXPLORE APP ARCHITECTURE',
  },
  {
    id: 'thor-mobile-orders',
    number: '02',
    title: 'Thor Mobile Orders — High-Speed Table & Kitchen Platform',
    domain: 'thor-cuisine.app',
    url: 'https://thor-indian-cuisinse.firebaseapp.com',
    category: 'HOSPITALITY & LIVE ORDERING',
    metaDescription:
      'High-speed table reservations, instant kitchen telemetry, synchronized curbside pickup notifications, and localized digital ordering in Memphis, TN.',
    tags: ['React Native', 'Live Orders', 'Push Notifications', 'Memphis TN'],
    thumbnail: '/services/02-mobile-app-development.jpg',
    actionLabel: 'LAUNCH MOBILE WEB APP',
  },
  {
    id: 'nri360-concierge',
    number: '03',
    title: 'NRI360 Mobile Concierge — Global Property & Care App',
    domain: 'nri360degrees.com',
    url: 'https://nri360degrees.com',
    category: 'GLOBAL CONCIERGE & HEALTHCARE',
    metaDescription:
      'Real-time property monitoring, senior family healthcare check-ins, encrypted concierge chat, and legal document vaults across 100+ cities.',
    tags: ['Flutter', 'Encrypted Telemetry', '100+ Cities', 'Legal Vault'],
    thumbnail: '/services/ad-ui-ux-design.jpg',
    actionLabel: 'EXPLORE CONCIERGE APP',
  },
  {
    id: 'imperial-visuals-suite',
    number: '04',
    title: 'Imperial Visuals Media Suite — 4K Client Proofing & Vault',
    domain: 'imperialvisuals.internal',
    url: '/services/video-production',
    category: 'PORTABLE 4K MEDIA ARCHIVE',
    metaDescription:
      'Sensory vertical 4K media showcase, client proofing suite, color-accurate ProRes delivery, and instant social reel deployment companion.',
    tags: ['Video Player', 'ProRes Delivery', 'Color Fidelity', 'Studio Suite'],
    thumbnail: '/services/ui-ux-design.jpg',
    actionLabel: 'EXPLORE STUDIO SUITE',
  },
];

export interface MarketingCompanyCase {
  id: string;
  client: string;
  category: string;
  title: string;
  matter: string;
  crafted: string[];
  reelThumb: string;
  reelVideo: string;
  reelUrl: string;
  actionUrl: string;
}

const MARKETING_COMPANIES: MarketingCompanyCase[] = [
  {
    id: 'ceo-expos',
    client: 'CEO Expos',
    category: 'EXECUTIVE CONFERENCES & BUSINESS SUMMITS',
    title: 'CEO Expos — India’s Premier Business & Franchise Summits',
    matter:
      'High-impact conference branding, executive summit campaigns, dynamic exhibitor acquisition, and attendee registration funnels driving full capacity across Andhra Pradesh.',
    crafted: [
      'Brand Identity & Positioning',
      'High-Performance Web Platform',
      'Executive Cinematic Reels',
      'Attendee & Exhibitor Funnels',
    ],
    reelThumb: '/reels/reel_02.jpg',
    reelVideo: '/reels-videos/ceo-expos.mp4',
    reelUrl: 'https://www.instagram.com/araneaden_/',
    actionUrl: 'https://creatorseventsorganization.vercel.app/',
  },
  {
    id: 'jk-restaurant',
    client: 'JK Restaurant',
    category: 'CULINARY BRANDING & SOCIAL GROWTH',
    title: 'JK Restaurant — Sensory Gastronomy Growth Campaign',
    matter:
      'Sensory gastronomy choreography, culinary visual storytelling, localized digital ordering platform, and geo-targeted social media acquisition for Rajahmundry’s premier dining landmark.',
    crafted: [
      'Culinary Brand Identity',
      'Digital Ordering Web Platform',
      'Sensory Gastronomy Reels',
      'Local Social Growth Campaigns',
    ],
    reelThumb: '/reels/reel_06.jpg',
    reelVideo: '/reels-videos/jk-restaurant.mp4',
    reelUrl: 'https://www.instagram.com/araneaden_/',
    actionUrl: '/services/digital-marketing',
  },
  {
    id: 'finance-with-veeru',
    client: 'Finance with Veeru',
    category: 'FINANCIAL ADVISORY & REEL FUNNELS',
    title: 'Finance with Veeru — Authoritative Personal Branding',
    matter:
      'Authoritative financial education media, personal brand cinematography, viral educational hooks, and high-trust organic audience growth choreography across South India.',
    crafted: [
      'Authoritative Personal Branding',
      'Wealth Advisory Platform',
      'High-Trust Educational Reels',
      'Audience Acquisition Funnels',
    ],
    reelThumb: '/reels/reel_04.jpg',
    reelVideo: '/reels-videos/finance-with-veeru.mp4',
    reelUrl: 'https://www.instagram.com/araneaden_/',
    actionUrl: '/services/digital-marketing',
  },
  {
    id: 'startup-potluck',
    client: 'Startup Potluck',
    category: 'STARTUP ECOSYSTEM & BRAND ACCELERATION',
    title: 'Startup Potluck — Founder Ecosystem & Pitch Summits',
    matter:
      'Official video coverage, founder pitch showcases, attendee networking platform, and cinematic launch campaigns accelerating regional startup ecosystems and investor connections.',
    crafted: [
      'Ecosystem Brand Strategy',
      'Event & Networking Platform',
      'Founder Pitch Reels & Media',
      'Community Launch Campaigns',
    ],
    reelThumb: '/reels/reel_05.jpg',
    reelVideo: '/reels-videos/startup-potluck.mp4',
    reelUrl: 'https://www.instagram.com/araneaden_/reel/DaxbWhTz9hH/',
    actionUrl: 'https://pandpconnektss.web.app',
  },
];

const FEATURED_HACKATHONS: SelectedProject[] = [
  {
    id: 'aranea-code-nexus',
    number: '01',
    title: 'Aranea Code Nexus — National 36-Hour Hackathon Sprint',
    domain: 'codenexus.araneaden.com',
    url: '/announcements',
    category: 'HACKATHON SPRINT & INCUBATION LAB',
    metaDescription:
      'Flagship 36-hour national technology hackathon challenging 500+ elite engineers in algorithmic optimization, robust system architectures, and decentralized protocol sprints.',
    tags: ['36hr Hackathon', '500+ Developers', 'Algorithmic Challenges', 'Incubation Lab'],
    thumbnail: '/services/13-hackathons-updates.jpg',
    actionLabel: 'VIEW HACKATHON BRIEF',
  },
  {
    id: 'systems-architecture-masterclass',
    number: '02',
    title: 'Systems Architecture & Cloud Masterclass Workshop',
    domain: 'masterclass.araneaden.com',
    url: '/services/software-hardware-solutions',
    category: 'HANDS-ON TECHNICAL BOOTCAMP',
    metaDescription:
      'Intensive hands-on technical workshop diving into production distributed systems, microservice architectures, high-frequency state management, and real-time edge deployments.',
    tags: ['Hands-on Lab', 'Cloud Systems', 'Distributed State', 'Edge Compute'],
    thumbnail: '/services/14-workshops-training.jpg',
    actionLabel: 'EXPLORE WORKSHOP CURRICULUM',
  },
  {
    id: 'iot-hardware-telemetry-lab',
    number: '03',
    title: 'IoT Telemetry & Embedded Hardware Prototyping Lab',
    domain: 'hardwarelab.araneaden.com',
    url: '/services/iot-hardware-solutions',
    category: 'EMBEDDED HARDWARE BOOTCAMP',
    metaDescription:
      'Hands-on micro-controller interfacing, sensor telemetry pipelines, embedded PCB architecture, and low-latency industrial hardware prototyping sprint.',
    tags: ['Embedded C++', 'Sensors & Actuators', 'MQTT Telemetry', 'Rapid Prototyping'],
    thumbnail: '/services/12-iot-prototyping.jpg',
    actionLabel: 'EXPLORE HARDWARE SPRINT',
  },
  {
    id: 'design-system-critique-sprint',
    number: '04',
    title: 'UI/UX Design System Critique & High-Fidelity Sprint',
    domain: 'designatelier.araneaden.com',
    url: '/services/ui-ux-design',
    category: 'DESIGN SYSTEM WORKSHOP',
    metaDescription:
      'Open UI/UX design critique, interactive Figma design system sprints, component-driven token architecture, and micro-interaction animation clinics.',
    tags: ['Design Systems', 'Motion Design', 'Figma Atelier', 'Component Tokens'],
    thumbnail: '/services/ad-ui-ux-design.jpg',
    actionLabel: 'EXPLORE DESIGN SPRINT',
  },
];

const FEATURED_BROADCASTING: SelectedProject[] = [
  {
    id: 'ceo-expos-broadcast',
    number: '01',
    title: 'CEO Expos Global Hybrid Summit Live Telecast',
    domain: 'live.ceoexpos.com',
    url: '/services/video-production',
    category: 'MULTI-CAMERA 4K LIVE STREAMING',
    metaDescription:
      'Multi-camera 4K live streaming, synchronized lower-thirds telemetry, instant ISO recording, and ultra-low latency satellite simulcast for 10,000+ virtual attendees.',
    tags: ['4K Multi-Cam', 'Live Switching', 'Satellite Uplink', 'Low Latency'],
    thumbnail: '/services/07-videography.jpg',
    actionLabel: 'EXPLORE BROADCAST SPECS',
  },
  {
    id: 'imperial-stage-concert',
    number: '02',
    title: 'Imperial Stage Concert & Audiovisual Broadcast',
    domain: 'imperialstage.live',
    url: '/services/video-production',
    category: 'CONCERT & CULTURAL TELECAST',
    metaDescription:
      'Studio-grade multi-feed live concert broadcast, real-time audio mastering, dynamic gimbal choreography, and multi-platform synchronized live streaming.',
    tags: ['Concert Telecast', 'Spatial Audio Master', 'Multi-Angle Gimbal', '1080p60 Stream'],
    thumbnail: '/services/11-ad-imperial-visuals.jpg',
    actionLabel: 'WATCH BROADCAST ARCHIVE',
  },
  {
    id: 'viraj-convocation-stream',
    number: '03',
    title: 'Viraj Academy National Convocation & Keynote Broadcast',
    domain: 'stream.virajedu.com',
    url: '/services/video-production',
    category: 'INSTITUTIONAL LIVE BROADCAST',
    metaDescription:
      'Multi-stage commencement ceremony broadcast, live interactive Q&A pipelines, speaker teleprompter feeds, and multi-channel YouTube/LinkedIn simulcasts.',
    tags: ['Multi-Stage Stream', 'Interactive Q&A', 'Simulcast Engine', 'Keynote Feeds'],
    thumbnail: '/services/08-photography.jpg',
    actionLabel: 'VIEW STREAM PIPELINE',
  },
  {
    id: 'startup-pitch-arena-telecast',
    number: '04',
    title: 'Startup Pitch Arena Live Investor Telecast',
    domain: 'pitcharena.live',
    url: '/services/video-production',
    category: 'HYBRID FOUNDER PITCH BROADCAST',
    metaDescription:
      'Live founder pitch telecast with synchronized pitch deck graphics, real-time investor evaluation scoreboards, and seamless hybrid room streaming.',
    tags: ['Pitch Arena', 'Real-Time Overlays', 'Investor Telemetry', 'Hybrid Room'],
    thumbnail: '/services/09-video-editing.jpg',
    actionLabel: 'EXPLORE TELECAST ARCHITECTURE',
  },
];

const TABS: { id: WorkCategory; label: string; count: number }[] = [
  { id: 'websites', label: 'WEBSITES', count: FEATURED_WEBSITES.length },
  { id: 'apps', label: 'APPS', count: FEATURED_APPS.length },
  { id: 'marketing', label: 'DIGITAL MARKETING', count: MARKETING_COMPANIES.length },
  { id: 'visuals', label: "AD'S IMPERIAL VISUALS", count: ARANEA_REELS.length },
  { id: 'hackathons', label: 'HACKATHONS / WORKSHOPS', count: FEATURED_HACKATHONS.length },
  { id: 'broadcasting', label: 'LIVE STREAMING & BROADCASTING', count: FEATURED_BROADCASTING.length },
];

const HEADLINES: Record<WorkCategory, string> = {
  websites: 'FLAGSHIP WEBSITES CRAFTED BY ARANEA DEN.',
  apps: 'HIGH-PERFORMANCE APPS & MOBILE ECOSYSTEMS.',
  marketing: 'STRATEGIC DIGITAL MARKETING & GROWTH CAMPAIGNS.',
  visuals: 'CINEMATIC SHOOTS & REELS BY AD IMPERIAL VISUALS.',
  hackathons: 'HIGH-IMPACT HACKATHONS & TECHNICAL WORKSHOPS.',
  broadcasting: 'STUDIO-GRADE LIVE STREAMING & BROADCASTING.',
};

const PROJECTS_BY_CATEGORY: Record<Exclude<WorkCategory, 'visuals' | 'marketing'>, SelectedProject[]> = {
  websites: FEATURED_WEBSITES,
  apps: FEATURED_APPS,
  hackathons: FEATURED_HACKATHONS,
  broadcasting: FEATURED_BROADCASTING,
};

/* ─────────────────────────────────────────
   SINGLE REEL CARD — matches Services section style
───────────────────────────────────────── */
const ReelCard: React.FC<{ reel: AraneaReel }> = ({ reel }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {});
      }
    };

    startPlayback();

    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        rootMargin: '120px 60px 120px 60px',
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
    };
  }, [reel.videoSrc]);

  return (
    <a
      ref={cardRef}
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.reelCard}
      aria-label={`Watch reel: ${reel.title}`}
    >
      <div className={styles.reelMedia}>
        <img
          src={reel.thumbnail}
          alt={reel.title}
          loading="lazy"
          className={`${styles.reelPoster} ${isVideoLoaded ? styles.posterHidden : ''}`}
        />
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.thumbnail}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className={styles.reelVideo}
          onPlaying={() => setIsVideoLoaded(true)}
        />
        {/* Bottom-left red bloom overlay + title */}
        <div className={styles.cleanReelOverlay}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.cleanReelInstaIcon} aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className={styles.cleanReelLabel}>{reel.client || reel.title}</span>
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────
   REEL MARQUEE — continuous auto-scroll carousel
   Identical to Services section SmoothReelMarquee
───────────────────────────────────────── */
const ReelMarquee: React.FC = () => {
  // Duplicate reels so the CSS animation loops seamlessly
  const doubled = useMemo(() => [...ARANEA_REELS, ...ARANEA_REELS], []);

  return (
    <div className={styles.reelMarqueeOuter}>
      <div className={styles.reelMarqueeViewport}>
        <div className={styles.reelMarqueeTrack}>
          {doubled.map((reel, idx) => (
            <div key={`${reel.id}-${idx}`} className={styles.reelMarqueeCardWrapper}>
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   DIGITAL MARKETING COMPANY CARD (REEL ONLY)
───────────────────────────────────────── */
const MarketingCompanyCard: React.FC<{ company: MarketingCompanyCase; index: number }> = ({
  company,
  index,
}) => {
  const isReverse = index % 2 === 1;
  const isExternalAction = company.actionUrl.startsWith('http');
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsVideoLoaded(true)).catch(() => {});
      }
    };

    startPlayback();
    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '100px 50px', threshold: 0.05 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
    };
  }, [company.reelVideo]);

  return (
    <article
      ref={cardRef}
      className={`${styles.marketingItem} ${isReverse ? styles.marketingItemReverse : ''}`}
    >
      {/* Matter Column */}
      <div className={styles.marketingMetaCol}>
        <div className={styles.metaTop}>
          <span className={styles.projectCategory}>{company.category}</span>
        </div>

        <h3 className={styles.projectTitle}>
          {isExternalAction ? (
            <a
              href={company.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              {company.title}
            </a>
          ) : (
            <Link to={company.actionUrl} className={styles.titleLink}>
              {company.title}
            </Link>
          )}
        </h3>

        <p className={styles.projectDescription}>{company.matter}</p>

        {/* WE CRAFTED — list */}
        <div className={styles.craftedWrap}>
          <span className={styles.craftedHeading}>WE CRAFTED —</span>
          <ul className={styles.craftedList}>
            {company.crafted.map((item, idx) => (
              <li key={idx} className={styles.craftedItem}>
                <span className={styles.craftedDash} aria-hidden="true">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actionRow}>
          {isExternalAction ? (
            <a
              href={company.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visitRedBtn}
              aria-label={`Visit ${company.client}`}
            >
              <span>VISIT</span>
              <span className={styles.visitRedBtnArrow} aria-hidden="true">↗</span>
            </a>
          ) : (
            <Link
              to={company.actionUrl}
              className={styles.visitRedBtn}
              aria-label={`Visit ${company.client}`}
            >
              <span>VISIT</span>
              <span className={styles.visitRedBtnArrow} aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </div>

      {/* Visual Reel Column: ONLY Reel format, no website */}
      <div className={styles.marketingReelCol}>
        <a
          href={company.reelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.reelCardOnly}
          aria-label={`Watch ${company.client} official reel on Instagram`}
        >
          <div className={styles.reelMediaOnly}>
            <img
              src={company.reelThumb}
              alt={`${company.client} Reel`}
              className={`${styles.tilePoster} ${isVideoLoaded ? styles.posterHidden : ''}`}
            />
            <video
              ref={videoRef}
              src={company.reelVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={styles.tileVideo}
            />
            <div className={styles.cleanReelOverlay}>
              <svg className={styles.cleanReelInstaIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className={styles.cleanReelLabel}>{company.client}</span>
            </div>
          </div>
        </a>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<WorkCategory>('websites');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
            scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
          }
        );
      }

      const items = listRef.current?.querySelectorAll(`.${styles.projectItem}, .${styles.marketingItem}`);
      if (items && items.length > 0) {
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: { trigger: item, start: 'top 84%' },
            }
          );
        });
      }

      // Pause continuous marquee when SelectedWork section leaves viewport to save GPU/CPU cycles
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
  }, [activeCategory]);

  const currentProjects =
    activeCategory !== 'visuals' && activeCategory !== 'marketing'
      ? PROJECTS_BY_CATEGORY[activeCategory]
      : [];

  return (
    <section ref={sectionRef} id="work" className={styles.section} aria-label="What We've Built">
      <div className={styles.container}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.crimsonMarker} aria-hidden="true" />
          <span className={styles.eyebrowText}>WHAT WE'VE BUILT</span>
        </div>

        {/* Section Headline */}
        <div ref={headerRef} className={styles.header}>
          <h2 className={styles.headline}>
            {HEADLINES[activeCategory]}
          </h2>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs} role="tablist" aria-label="Work Categories">
          {TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveCategory(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div ref={listRef}>
          {activeCategory === 'visuals' ? (
            /* Reel Shoots — Continuous Marquee Carousel (same as Services section) */
            <ReelMarquee />
          ) : activeCategory === 'marketing' ? (
            /* Digital Marketing — Specific Company Showcase with Alternating Website + Reel Collage */
            <div className={styles.marketingList}>
              {MARKETING_COMPANIES.map((company, index) => (
                <MarketingCompanyCard key={company.id} company={company} index={index} />
              ))}
            </div>
          ) : (
            <div className={styles.projectsList}>
              {currentProjects.map((project, index) => {
                const isEven = index % 2 === 1;
                const isExternal = project.url.startsWith('http');

                return (
                  <article
                    key={project.id}
                    className={`${styles.projectItem} ${isEven ? styles.projectItemReverse : ''}`}
                  >
                    {isExternal ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visualFrame}
                        aria-label={`Visit live site ${project.domain}`}
                      >
                        <div className={styles.imageWrapper}>
                          <img
                            src={project.thumbnail}
                            alt={`Preview of ${project.title}`}
                            className={styles.screenshotImg}
                            loading="lazy"
                          />
                          <div className={styles.imageOverlay}>
                            <span className={styles.overlayPill}>
                              <span>{project.domain}</span>
                              <span className={styles.overlayPillArrow} aria-hidden="true">↗</span>
                            </span>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link
                        to={project.url}
                        className={styles.visualFrame}
                        aria-label={`Explore ${project.title}`}
                      >
                        <div className={styles.imageWrapper}>
                          <img
                            src={project.thumbnail}
                            alt={`Preview of ${project.title}`}
                            className={styles.screenshotImg}
                            loading="lazy"
                          />
                          <div className={styles.imageOverlay}>
                            <span className={styles.overlayPill}>
                              <span>{project.domain}</span>
                              <span className={styles.overlayPillArrow} aria-hidden="true">↗</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}

                    <div className={styles.metaCol}>
                      <div className={styles.metaTop}>
                        <span className={styles.projectCategory}>{project.category}</span>
                      </div>
                      <h3 className={styles.projectTitle}>
                        {isExternal ? (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.titleLink}>
                            {project.title}
                          </a>
                        ) : (
                          <Link to={project.url} className={styles.titleLink}>
                            {project.title}
                          </Link>
                        )}
                      </h3>
                      <p className={styles.projectDescription}>{project.metaDescription}</p>

                      <div className={styles.actionRow}>
                        {isExternal ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.visitRedBtn}
                            aria-label={`Visit ${project.title}`}
                          >
                            <span>VISIT</span>
                            <span className={styles.visitRedBtnArrow} aria-hidden="true">↗</span>
                          </a>
                        ) : (
                          <Link
                            to={project.url}
                            className={styles.visitRedBtn}
                            aria-label={`Visit ${project.title}`}
                          >
                            <span>VISIT</span>
                            <span className={styles.visitRedBtnArrow} aria-hidden="true">↗</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className={styles.archiveCtaWrap}>
          <Link to="/portfolio" className={styles.archiveLink}>
            <span className={styles.archiveLinkText}>EXPLORE FULL CLIENT ARCHIVE &amp; PORTFOLIO</span>
            <span className={styles.archiveArrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
