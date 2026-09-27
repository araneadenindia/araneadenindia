import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { GeometricSpider } from './GeometricSpider';
import styles from './AboutPage.module.css';

interface ServiceNode {
  id: string;
  number: string;
  name: string;
  description: string;
  href: string;
  iconType: 'web' | 'uiux' | 'mobile' | 'marketing' | 'graphic' | 'video' | 'seo' | 'cloud';
  side: 'left' | 'right';
  badgeClass: string;
}

const SERVICE_NODES: ServiceNode[] = [
  // ── LEFT SIDE NODES ──
  {
    id: 'web',
    number: '01',
    name: 'WEB DEVELOPMENT',
    description: 'Building fast, secure & modern websites.',
    href: '/services/web-development',
    iconType: 'web',
    side: 'left',
    badgeClass: styles.nodeWeb,
  },
  {
    id: 'uiux',
    number: '02',
    name: 'UI/UX DESIGN',
    description: 'Designing intuitive & engaging user experiences.',
    href: '/services/ui-ux-design',
    iconType: 'uiux',
    side: 'left',
    badgeClass: styles.nodeUiux,
  },
  {
    id: 'mobile',
    number: '03',
    name: 'MOBILE DEVELOPMENT',
    description: 'Creating powerful mobile apps for Android & iOS.',
    href: '/services/mobile-development',
    iconType: 'mobile',
    side: 'left',
    badgeClass: styles.nodeMobile,
  },
  {
    id: 'marketing',
    number: '04',
    name: 'DIGITAL MARKETING',
    description: 'Growing brands with strategy, content & performance.',
    href: '/services/digital-marketing',
    iconType: 'marketing',
    side: 'left',
    badgeClass: styles.nodeMarketing,
  },

  // ── RIGHT SIDE NODES ──
  {
    id: 'graphic',
    number: '05',
    name: 'GRAPHIC DESIGN',
    description: "Creative visuals that communicate your brand's story.",
    href: '/services/graphic-design',
    iconType: 'graphic',
    side: 'right',
    badgeClass: styles.nodeGraphic,
  },
  {
    id: 'video',
    number: '06',
    name: 'VIDEO PRODUCTION',
    description: 'Crafting compelling videos that engage & inspire.',
    href: '/services/video-production',
    iconType: 'video',
    side: 'right',
    badgeClass: styles.nodeVideo,
  },
  {
    id: 'seo',
    number: '07',
    name: 'SEO SERVICES',
    description: 'Improving visibility & ranking higher on search engines.',
    href: '/services/seo',
    iconType: 'seo',
    side: 'right',
    badgeClass: styles.nodeSeo,
  },
  {
    id: 'cloud',
    number: '08',
    name: 'CLOUD SOLUTIONS',
    description: 'Building scalable, secure & reliable digital infrastructure.',
    href: '/services/cloud-solutions',
    iconType: 'cloud',
    side: 'right',
    badgeClass: styles.nodeCloud,
  },
];

/**
 * Service Node Icon Render Helper
 */
const NodeIcon: React.FC<{ type: ServiceNode['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'web':
      // Monitor with code brackets </ >
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="9 8 6 10 9 12" />
          <polyline points="15 8 18 10 15 12" />
        </svg>
      );
    case 'uiux':
      // Vector fountain pen / bezier anchor tool
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case 'mobile':
      // Smartphone outline
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.4" />
        </svg>
      );
    case 'marketing':
      // Ascending bar chart with upward trend arrow
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <polyline points="4 8 11 3 19 6" />
          <polyline points="16 3 19 6 16 9" />
        </svg>
      );
    case 'graphic':
      // Artist paintbrush with paint stroke
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.375 2.625a3.875 3.875 0 0 0-5.48 0L3.125 12.395a1.5 1.5 0 0 0-.44 1.06v5.045a1.5 1.5 0 0 0 1.5 1.5h5.045c.4 0 .78-.16 1.06-.44l9.77-9.77a3.875 3.875 0 0 0 0-5.48z" />
          <path d="M15 6l3 3" />
        </svg>
      );
    case 'video':
      // Film production cinema camera
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          <circle cx="8.5" cy="12" r="2.5" />
        </svg>
      );
    case 'seo':
      // Magnifying search glass with subtle chart
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      );
    case 'cloud':
      // Cloud infrastructure with network circuit nodes
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          <line x1="12" y1="15.5" x2="12" y2="19" />
        </svg>
      );
    default:
      return null;
  }
};

export const AboutSpiderHero: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const webCanvasRef = useRef<SVGSVGElement>(null);
  const spiderWrapperRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP Choreographed Entrance Animation
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Initial State
      gsap.set(spiderWrapperRef.current, { opacity: 0, scale: 0.88 });
      gsap.set(brandingRef.current, { opacity: 0, y: 25 });
      gsap.set(nodesRef.current, { opacity: 0, y: 20 });

      // 2. Web Strands Draw-in
      const strands = hero.querySelectorAll(`.${styles.webRadialStrand}, .${styles.webConcentricRing}`);
      if (strands.length > 0) {
        gsap.fromTo(
          strands,
          { opacity: 0, strokeDashoffset: 400 },
          { opacity: 1, strokeDashoffset: 0, duration: 1.4, stagger: 0.04, ease: 'power2.inOut' }
        );
      }

      // 3. Central Spider Smooth Scale & Glow Reveal
      tl.to(
        spiderWrapperRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
        0.3
      );

      // 4. Connector Lines Shoot Outward
      const connectorPaths = hero.querySelectorAll(`.${styles.connectorPath}`);
      if (connectorPaths.length > 0) {
        tl.fromTo(
          connectorPaths,
          { strokeDashoffset: 300, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.0, stagger: 0.08, ease: 'power2.out' },
          0.7
        );
      }

      // 5. Service Nodes Reveal in Symmetrical Sequence
      tl.to(
        nodesRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0.9
      );

      // 6. Center Branding Title & Tagline Reveal
      tl.to(
        brandingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
        },
        1.1
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.spiderHeroSection} aria-label="Aranea Den Interconnected Ecosystem">
      {/* ── Background Deep Atmosphere Glow ── */}
      <div className={styles.ambientSpiderGlow} aria-hidden="true" />

      {/* ── Master SVG Layer: Concentric Spider Web & Glowing Silk Connectors ── */}
      <svg
        ref={webCanvasRef}
        viewBox="0 0 1440 820"
        className={styles.webSvgCanvas}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Intense Neon Red Glow for Silk Connectors */}
          <filter id="silkConnectorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── A. CONCENTRIC SPIDER WEB (Subtle Crimson & White Mesh) ── */}
        <g id="concentric-web" className={styles.webMeshGroup}>
          {/* Concentric Arched Polygonal Rings Centered at (720, 310) */}
          <ellipse cx="720" cy="310" rx="140" ry="120" stroke="rgba(223, 37, 49, 0.18)" strokeWidth="1" className={styles.webConcentricRing} />
          <ellipse cx="720" cy="310" rx="240" ry="200" stroke="rgba(223, 37, 49, 0.16)" strokeWidth="1" className={styles.webConcentricRing} />
          <ellipse cx="720" cy="310" rx="360" ry="290" stroke="rgba(223, 37, 49, 0.14)" strokeWidth="1" className={styles.webConcentricRing} />
          <ellipse cx="720" cy="310" rx="490" ry="380" stroke="rgba(223, 37, 49, 0.11)" strokeWidth="1" className={styles.webConcentricRing} />
          <ellipse cx="720" cy="310" rx="630" ry="480" stroke="rgba(223, 37, 49, 0.08)" strokeWidth="1" className={styles.webConcentricRing} />

          {/* Radiating Silk Strands Expanding From Center */}
          <line x1="720" y1="310" x2="720" y2="20" stroke="rgba(223, 37, 49, 0.18)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="1050" y2="40" stroke="rgba(223, 37, 49, 0.16)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="1320" y2="180" stroke="rgba(223, 37, 49, 0.15)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="1420" y2="350" stroke="rgba(223, 37, 49, 0.14)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="1320" y2="540" stroke="rgba(223, 37, 49, 0.14)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="1080" y2="720" stroke="rgba(223, 37, 49, 0.12)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="720" y2="780" stroke="rgba(223, 37, 49, 0.15)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="360" y2="720" stroke="rgba(223, 37, 49, 0.12)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="120" y2="540" stroke="rgba(223, 37, 49, 0.14)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="20" y2="350" stroke="rgba(223, 37, 49, 0.14)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="120" y2="180" stroke="rgba(223, 37, 49, 0.15)" strokeWidth="1" className={styles.webRadialStrand} />
          <line x1="720" y1="310" x2="390" y2="40" stroke="rgba(223, 37, 49, 0.16)" strokeWidth="1" className={styles.webRadialStrand} />
        </g>

        {/* ── B. EIGHT RED CONNECTING SILK LINES (Between Spider Legs & Nodes) ── */}
        <g id="connector-lines" className={styles.connectorGroup}>
          {/* Node 01 Left: Web Development */}
          <path
            d="M 580 185 L 485 160 L 415 160"
            className={`${styles.connectorPath} ${activeNode === 'web' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="485" cy="160" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="485" cy="160" r="2.2" fill="#DF2531" />

          {/* Node 02 Left: UI/UX Design */}
          <path
            d="M 545 270 L 440 290 L 370 290"
            className={`${styles.connectorPath} ${activeNode === 'uiux' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="440" cy="290" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="440" cy="290" r="2.2" fill="#DF2531" />

          {/* Node 03 Left: Mobile Development */}
          <path
            d="M 555 385 L 460 425 L 395 425"
            className={`${styles.connectorPath} ${activeNode === 'mobile' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="460" cy="425" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="460" cy="425" r="2.2" fill="#DF2531" />

          {/* Node 04 Left: Digital Marketing */}
          <path
            d="M 600 485 L 530 555 L 450 555"
            className={`${styles.connectorPath} ${activeNode === 'marketing' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="530" cy="555" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="530" cy="555" r="2.2" fill="#DF2531" />

          {/* Node 05 Right: Graphic Design */}
          <path
            d="M 860 185 L 955 160 L 1025 160"
            className={`${styles.connectorPath} ${activeNode === 'graphic' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="955" cy="160" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="955" cy="160" r="2.2" fill="#DF2531" />

          {/* Node 06 Right: Video Production */}
          <path
            d="M 895 270 L 1000 290 L 1070 290"
            className={`${styles.connectorPath} ${activeNode === 'video' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="1000" cy="290" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="1000" cy="290" r="2.2" fill="#DF2531" />

          {/* Node 07 Right: SEO Services */}
          <path
            d="M 885 385 L 980 425 L 1045 425"
            className={`${styles.connectorPath} ${activeNode === 'seo' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="980" cy="425" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="980" cy="425" r="2.2" fill="#DF2531" />

          {/* Node 08 Right: Cloud Solutions */}
          <path
            d="M 840 485 L 910 555 L 990 555"
            className={`${styles.connectorPath} ${activeNode === 'cloud' ? styles.activePath : ''}`}
            stroke="#DF2531"
            strokeWidth="1.8"
            strokeDasharray="400"
            filter="url(#silkConnectorGlow)"
          />
          <circle cx="910" cy="555" r="4.2" fill="#FFFFFF" filter="url(#silkConnectorGlow)" />
          <circle cx="910" cy="555" r="2.2" fill="#DF2531" />
        </g>
      </svg>

      {/* ── Master Composition Responsive Grid ── */}
      <div className={styles.compositionContainer}>

        {/* ── LEFT SERVICE NODES COLUMN ── */}
        <div className={styles.leftNodesCol}>
          {SERVICE_NODES.slice(0, 4).map((node, idx) => (
            <div
              key={node.id}
              ref={el => { nodesRef.current[idx] = el; }}
              className={`${styles.serviceNodeItem} ${styles.leftNodeItem} ${node.badgeClass} ${
                activeNode === node.id ? styles.activeNodeItem : ''
              }`}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <Link to={node.href} className={styles.nodeLink} aria-label={`${node.name}: ${node.description}`}>
                {/* Descriptive Copy (Left Aligned on Desktop) */}
                <div className={styles.nodeTextWrap}>
                  <h3 className={styles.nodeTitle}>{node.name}</h3>
                  <p className={styles.nodeDesc}>{node.description}</p>
                </div>

                {/* Circular Neon Glowing Badge */}
                <div className={styles.nodeBadge}>
                  <div className={styles.badgeGlowRing} aria-hidden="true" />
                  <span className={styles.badgeIcon}>
                    <NodeIcon type={node.iconType} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ── CENTERPIECE: GEOMETRIC SPIDER & MONUMENTAL BRANDING ── */}
        <div className={styles.centerStage}>
          {/* Master Geometric Spider */}
          <div ref={spiderWrapperRef} className={styles.spiderWrap}>
            <GeometricSpider activeNode={activeNode} className={styles.spiderSvg} />
          </div>

          {/* Monumental Center Branding */}
          <div ref={brandingRef} className={styles.centerBranding}>
            <h1 className={styles.brandTitle}>
              ARANEA DEN
            </h1>

            {/* Glowing Central Flare Dot */}
            <div className={styles.brandCenterFlare} aria-hidden="true" />

            <p className={styles.brandTagline}>
              WE WEAVE YOUR DIGITAL EXCELLENCE
            </p>
          </div>
        </div>

        {/* ── RIGHT SERVICE NODES COLUMN ── */}
        <div className={styles.rightNodesCol}>
          {SERVICE_NODES.slice(4, 8).map((node, idx) => (
            <div
              key={node.id}
              ref={el => { nodesRef.current[idx + 4] = el; }}
              className={`${styles.serviceNodeItem} ${styles.rightNodeItem} ${node.badgeClass} ${
                activeNode === node.id ? styles.activeNodeItem : ''
              }`}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <Link to={node.href} className={styles.nodeLink} aria-label={`${node.name}: ${node.description}`}>
                {/* Circular Neon Glowing Badge */}
                <div className={styles.nodeBadge}>
                  <div className={styles.badgeGlowRing} aria-hidden="true" />
                  <span className={styles.badgeIcon}>
                    <NodeIcon type={node.iconType} />
                  </span>
                </div>

                {/* Descriptive Copy (Right Aligned on Desktop) */}
                <div className={styles.nodeTextWrap}>
                  <h3 className={styles.nodeTitle}>{node.name}</h3>
                  <p className={styles.nodeDesc}>{node.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutSpiderHero;
