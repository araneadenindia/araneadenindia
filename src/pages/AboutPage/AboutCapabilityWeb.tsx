import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GeometricSpider } from './GeometricSpider';
import styles from './AboutCapabilityWeb.module.css';

interface ServiceNode {
  id: string;
  name: string;
  description: string;
  href: string;
  iconType: 'web' | 'uiux' | 'mobile' | 'marketing' | 'graphic' | 'video' | 'seo' | 'cloud';
}

const LEFT_NODES: ServiceNode[] = [
  {
    id: 'web',
    name: 'WEB DEVELOPMENT',
    description: 'Building fast, secure & modern websites.',
    href: '/services',
    iconType: 'web',
  },
  {
    id: 'uiux',
    name: 'UI/UX DESIGN',
    description: 'Designing intuitive & engaging user experiences.',
    href: '/services',
    iconType: 'uiux',
  },
  {
    id: 'mobile',
    name: 'MOBILE DEVELOPMENT',
    description: 'Creating powerful mobile apps for Android & iOS.',
    href: '/services',
    iconType: 'mobile',
  },
  {
    id: 'marketing',
    name: 'DIGITAL MARKETING',
    description: 'Growing brands with strategy, content & performance.',
    href: '/services',
    iconType: 'marketing',
  },
];

const RIGHT_NODES: ServiceNode[] = [
  {
    id: 'graphic',
    name: 'GRAPHIC DESIGN',
    description: "Creative visuals that communicate your brand's story.",
    href: '/services',
    iconType: 'graphic',
  },
  {
    id: 'video',
    name: 'VIDEO PRODUCTION',
    description: 'Crafting compelling videos that engage & inspire.',
    href: '/services',
    iconType: 'video',
  },
  {
    id: 'seo',
    name: 'SEO SERVICES',
    description: 'Improving visibility & ranking higher on search engines.',
    href: '/services',
    iconType: 'seo',
  },
  {
    id: 'cloud',
    name: 'CLOUD SOLUTIONS',
    description: 'Scalable, secure & reliable cloud infrastructure.',
    href: '/services',
    iconType: 'cloud',
  },
];

const NodeIcon: React.FC<{ type: ServiceNode['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'web':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="9 8 6 10 9 12" />
          <polyline points="15 8 18 10 15 12" />
        </svg>
      );
    case 'uiux':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case 'mobile':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.4" />
        </svg>
      );
    case 'marketing':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <polyline points="4 8 11 3 19 6" />
          <polyline points="16 3 19 6 16 9" />
        </svg>
      );
    case 'graphic':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18.375 2.625a3.875 3.875 0 0 0-5.48 0L3.125 12.395a1.5 1.5 0 0 0-.44 1.06v5.045a1.5 1.5 0 0 0 1.5 1.5h5.045c.4 0 .78-.16 1.06-.44l9.77-9.77a3.875 3.875 0 0 0 0-5.48z" />
          <path d="M15 6l3 3" />
        </svg>
      );
    case 'video':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          <circle cx="8.5" cy="12" r="2.5" />
        </svg>
      );
    case 'seo':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      );
    case 'cloud':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          <line x1="12" y1="15.5" x2="12" y2="19" />
        </svg>
      );
    default:
      return null;
  }
};

export const AboutCapabilityWeb: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section className={styles.capabilityWebSection} aria-label="Aranea Den Interconnected Capabilities">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>01 / CONNECTED CAPABILITIES</span>
          </div>
          <h2 className={styles.sectionTitle}>WE WEAVE DIGITAL EXPERIENCES.</h2>
          <p className={styles.sectionSubtitle}>
            Eight integrated disciplines operating in unison, uniting strategy, creative architecture, and computational engineering.
          </p>
        </div>

        {/* Master Light Card Frame */}
        <div className={styles.masterCard}>
          <div className={styles.ambientSpiderGlow} aria-hidden="true" />

          {/* Symmetrical Diagram Grid */}
          <div className={styles.diagramGrid}>
            {/* Left 4 Nodes */}
            <div className={`${styles.nodesColumn} ${styles.leftColumn}`}>
              {LEFT_NODES.map((node) => (
                <Link
                  key={node.id}
                  to={node.href}
                  className={`${styles.nodeItem} ${styles.leftNode} ${
                    activeNode === node.id ? styles.activeNodeItem : ''
                  }`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  aria-label={`${node.name} — ${node.description}`}
                >
                  <div className={styles.nodeText}>
                    <h3 className={styles.nodeTitle}>{node.name}</h3>
                    <p className={styles.nodeDesc}>{node.description}</p>
                  </div>
                  <div className={styles.nodeBadge} aria-hidden="true">
                    <NodeIcon type={node.iconType} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Center Stage: Geometric Spider & Branding */}
            <div className={styles.centerStage}>
              <div className={styles.spiderWrap}>
                <GeometricSpider activeNode={activeNode} className={styles.spiderSvg} />
              </div>
              <div className={styles.brandCenter}>
                <h3 className={styles.brandName}>ARANEA DEN</h3>
                <span className={styles.brandTagline}>WE WEAVE DIGITAL EXPERIENCES</span>
              </div>
            </div>

            {/* Right 4 Nodes */}
            <div className={`${styles.nodesColumn} ${styles.rightColumn}`}>
              {RIGHT_NODES.map((node) => (
                <Link
                  key={node.id}
                  to={node.href}
                  className={`${styles.nodeItem} ${styles.rightNode} ${
                    activeNode === node.id ? styles.activeNodeItem : ''
                  }`}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  aria-label={`${node.name} — ${node.description}`}
                >
                  <div className={styles.nodeBadge} aria-hidden="true">
                    <NodeIcon type={node.iconType} />
                  </div>
                  <div className={styles.nodeText}>
                    <h3 className={styles.nodeTitle}>{node.name}</h3>
                    <p className={styles.nodeDesc}>{node.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom 4 Core Value Badges (Directly From Reference Image 1) */}
          <div className={styles.valuesBar} aria-label="Core Studio Pillars">
            <div className={styles.valueItem}>
              <span className={styles.valueIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </span>
              <span className={styles.valueLabel}>CREATIVE IDEAS</span>
            </div>

            <div className={styles.valueItem}>
              <span className={styles.valueIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <span className={styles.valueLabel}>STRATEGIC APPROACH</span>
            </div>

            <div className={styles.valueItem}>
              <span className={styles.valueIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </span>
              <span className={styles.valueLabel}>QUALITY ASSURED</span>
            </div>

            <div className={styles.valueItem}>
              <span className={styles.valueIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </span>
              <span className={styles.valueLabel}>RESULTS DRIVEN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCapabilityWeb;
