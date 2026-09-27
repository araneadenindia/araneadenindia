import React from 'react';
import styles from './ServiceVisuals.module.css';

/**
 * 01: Web Development — Premium Website Browser Mockup
 */
export const WebDevVisual: React.FC = () => {
  return (
    <div className={styles.webDevStage} aria-label="Web Development Browser Mockup">
      {/* Primary Foreground Browser Window */}
      <div className={styles.browserPrimary}>
        <div className={styles.browserHeader}>
          <div className={styles.browserDots} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <div className={styles.browserAddress}>araneaden.com/atelier</div>
        </div>

        <div className={styles.browserBody}>
          <div className={styles.browserNavMock}>
            <span className={styles.browserLogoMock}>ARANEA DEN</span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>2026</span>
          </div>

          <h4 className={styles.browserHeroTitle}>KINETIC DIGITAL ARCHITECTURE</h4>
          <p className={styles.browserHeroSub}>
            Sculpted interfaces engineered for speed, durability, and computational elegance.
          </p>

          <div className={styles.browserCtaBtn}>EXPLORE ATELIER &rarr;</div>
        </div>
      </div>

      {/* Secondary Staggered Browser Preview (Desktop only) */}
      <div className={styles.browserSecondary} aria-hidden="true">
        <div className={styles.secondaryBody}>
          <div className={styles.wireLine} />
          <div className={`${styles.wireLine} ${styles.wireLineShort}`} />
          <div style={{ height: '36px', background: 'rgba(11,11,12,0.04)', borderRadius: '6px', marginTop: '6px' }} />
        </div>
      </div>
    </div>
  );
};

/**
 * 02: Mobile App Development — Metallic Smartphone Mockup with Aranea Den Brandmark
 */
export const MobileAppVisual: React.FC = () => {
  return (
    <div className={styles.mobileAppStage} aria-label="Metallic Smartphone Interface Mockup">
      <div className={styles.metallicPhone}>
        {/* Dynamic Island Cutout */}
        <div className={styles.phoneIsland} aria-hidden="true" />

        <div className={styles.phoneScreen}>
          {/* App Header with Official Aranea Den Brandmark */}
          <div className={styles.phoneAppHeader}>
            <img
              src="/AD Transparent SVG.svg"
              alt="Aranea Den"
              className={styles.phoneBrandLogo}
            />
            <span className={styles.phoneStatusDot} aria-hidden="true" />
          </div>

          {/* App Screen Content */}
          <div className={styles.phoneAppBody}>
            <div className={styles.phoneStatCard}>
              <span className={styles.phoneStatLabel}>PLATFORM VELOCITY</span>
              <span className={styles.phoneStatValue}>60 FPS // NATIVE</span>
              <svg width="100%" height="28" viewBox="0 0 140 28" fill="none">
                <path
                  d="M0 22 C 30 18, 50 25, 80 12 C 105 3, 125 15, 140 6"
                  stroke="#df2531"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className={styles.phoneListRow}>
              <span className={styles.phoneListText}>Tactile Micro-Interactions</span>
              <span className={styles.phoneListArrow}>&rarr;</span>
            </div>

            <div className={styles.phoneListRow}>
              <span className={styles.phoneListText}>Offline-First Cloud Sync</span>
              <span className={styles.phoneListArrow}>&rarr;</span>
            </div>
          </div>

          {/* Phone Bottom Navigation */}
          <div className={styles.phoneBottomNav} aria-hidden="true">
            <span className={`${styles.navIconDot} ${styles.navIconDotActive}`} />
            <span className={styles.navIconDot} />
            <span className={styles.navIconDot} />
            <span className={styles.navIconDot} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 03: UI / UX Design — Design System Architecture & Specimen
 */
export const UiUxVisual: React.FC = () => {
  return (
    <div className={styles.uiUxStage} aria-label="Design System Interface Specimen">
      <div className={styles.specCard}>
        <div className={styles.specHeader}>
          <span className={styles.specBadge}>SYSTEM // DESIGN TOKENS</span>
          <span className={styles.specDimensions}>420 &times; 280 DP</span>
        </div>

        {/* Color Palette Tokens */}
        <div className={styles.colorTokens}>
          <div className={`${styles.swatch} ${styles.swatchCrimson}`}>#DF2531</div>
          <div className={`${styles.swatch} ${styles.swatchObsidian}`}>#070708</div>
          <div className={`${styles.swatch} ${styles.swatchSand}`}>#F8F8F5</div>
        </div>

        {/* Interactive Component Blueprint */}
        <div className={styles.componentRow}>
          <span className={styles.componentLabel}>ACTIVE STATE</span>
          <div className={styles.switchMock} aria-hidden="true">
            <div className={styles.switchKnob} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '8px', color: '#7e7f85' }}>
            TYPE SCALE
          </span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: '#0b0b0c' }}>
            Display 01 // 72px
          </span>
        </div>

        {/* Collaborator Cursor */}
        <div className={styles.cursorLead} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="0,0 0,10 3,7 6,10 8,9 5,6 10,6" />
          </svg>
          <span>DESIGN LEAD</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 04: Digital Marketing — Organic Performance & Analytics Curve
 */
export const DigitalMarketingVisual: React.FC = () => {
  return (
    <div className={styles.marketingStage} aria-label="Marketing Performance Analytics">
      <div className={styles.metricCard}>
        <div className={styles.metricTop}>
          <span className={styles.metricLabel}>ORGANIC MOMENTUM</span>
          <span className={styles.metricGrowthBadge}>+284% GROWTH</span>
        </div>

        <div className={styles.metricHeroValue}>2.4M REACH</div>

        {/* Clean Rising Bézier Curve */}
        <svg className={styles.chartSvg} viewBox="0 0 320 80" fill="none">
          <defs>
            <linearGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#df2531" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#df2531" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 65 Q 80 60, 140 45 T 260 20 L 320 10 L 320 80 L 0 80 Z"
            fill="url(#crimsonGradient)"
          />
          <path
            d="M 0 65 Q 80 60, 140 45 T 260 20 L 320 10"
            stroke="#df2531"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="320" cy="10" r="4.5" fill="#df2531" />
        </svg>

        <div className={styles.metricBottomRow}>
          <div className={styles.subMetric}>
            <span className={styles.subMetricLabel}>CONVERSION</span>
            <span className={styles.subMetricVal}>5.4%</span>
          </div>
          <div className={styles.subMetric}>
            <span className={styles.subMetricLabel}>ROAS INDEX</span>
            <span className={styles.subMetricVal}>4.8&times;</span>
          </div>
          <div className={styles.subMetric}>
            <span className={styles.subMetricLabel}>RETENTION</span>
            <span className={styles.subMetricVal}>82.6%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 05: Video Production — Cinema Director Monitor & 4K Recording Suite
 */
export const VideoProductionVisual: React.FC = () => {
  return (
    <div className={styles.videoProdStage} aria-label="Cinema Monitor & 4K Production Suite">
      <div className={styles.monitorCard}>
        <div className={styles.monitorHeader}>
          <div className={styles.recBadge}>
            <span className={styles.recBlink} aria-hidden="true" />
            <span>REC 4K UHD</span>
          </div>
          <span className={styles.monitorTimecode}>00:24:18:12</span>
        </div>

        <div className={styles.monitorViewport}>
          <div className={styles.crosshairLines} aria-hidden="true" />
          <div className={styles.monitorCenterBadge}>
            <span className={styles.monitorTag}>AD IMPERIAL VISUALS</span>
            <span className={styles.monitorFps}>PRORES 422 HQ // 60 FPS</span>
          </div>
        </div>

        <div className={styles.monitorFooter}>
          <div className={styles.monitorStatCol}>
            <span className={styles.monitorStatLabel}>SHUTTER</span>
            <span className={styles.monitorStatValue}>1/120s</span>
          </div>
          <div className={styles.monitorStatCol}>
            <span className={styles.monitorStatLabel}>APERTURE</span>
            <span className={styles.monitorStatValue}>f/1.8</span>
          </div>
          <div className={styles.monitorStatCol}>
            <span className={styles.monitorStatLabel}>ISO RANGE</span>
            <span className={styles.monitorStatValue}>800 NATIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 06: Graphic Design — Editing, Poster Design & Typographic Grid Specimen
 */
export const GraphicDesignVisual: React.FC = () => {
  return (
    <div className={styles.graphicDesignStage} aria-label="Poster Design & Brand Visual Identity Specimen">
      <div className={styles.specimenBox}>
        <div className={styles.specimenGridLines} aria-hidden="true" />

        <div className={styles.specimenGlyphs}>
          <span className={styles.glyphLarge}>Aa</span>
          <span className={styles.glyphAccent}>Rr</span>
          <span className={styles.glyphAmp}>&amp;</span>
        </div>

        <div className={styles.specimenFooter}>
          <span className={styles.specimenLabel}>POSTER DESIGN // EDITORIAL // 1.618 &Phi;</span>
          <div className={styles.specimenPalette} aria-hidden="true">
            <span className={styles.swatchMini} style={{ backgroundColor: '#df2531' }} />
            <span className={styles.swatchMini} style={{ backgroundColor: '#ffffff' }} />
            <span className={styles.swatchMini} style={{ backgroundColor: '#1a1a1e' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 07: SEO Services — Search Intelligence & Core Web Vitals Dominance
 */
export const SeoServicesVisual: React.FC = () => {
  return (
    <div className={styles.seoStage} aria-label="Search Engine Visibility Specimen">
      <div className={styles.serpCard}>
        {/* Mock Search Bar */}
        <div className={styles.searchBarMock}>
          <span className={styles.searchIcon}>&gt;</span>
          <span className={styles.searchText}>high-end digital atelier</span>
        </div>

        {/* Position #01 SERP Result */}
        <div className={styles.serpResult}>
          <div className={styles.serpUrlRow}>
            <span className={styles.serpRankBadge}>RANK #01</span>
            <span className={styles.serpUrl}>https://araneaden.com</span>
          </div>
          <div className={styles.serpTitle}>Aranea Den — Immersive Digital Architecture</div>
          <div className={styles.serpSnippet}>
            Bespoke web platforms engineered for durability, performance, and lasting brand resonance.
          </div>
        </div>

        {/* 100/100 Core Web Vitals Pill */}
        <div className={styles.coreVitalsPill}>
          <span className={styles.vitalsDot} aria-hidden="true" />
          <span>CORE WEB VITALS: 100/100 · 0.0s LCP</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 08: Cloud Solutions — Planetary Edge Topology & Latency
 */
export const CloudSolutionsVisual: React.FC = () => {
  return (
    <div className={styles.cloudStage} aria-label="Planetary Cloud Edge Topology">
      <div className={styles.edgeCard}>
        <div className={styles.edgeHeader}>
          <span className={styles.edgeTitle}>GLOBAL EDGE CLUSTERS</span>
          <span className={styles.uptimeBadge}>99.999% UPTIME</span>
        </div>

        {/* Topology Schematic */}
        <svg className={styles.topologySvg} viewBox="0 0 320 80" fill="none">
          <line x1="40" y1="40" x2="160" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="160" y1="40" x2="280" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="160" y1="40" x2="210" y2="15" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Node NYC */}
          <circle cx="40" cy="40" r="6" fill="#08080a" stroke="#df2531" strokeWidth="2" />
          <text x="40" y="62" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace">NYC</text>

          {/* Central Edge Hub */}
          <circle cx="160" cy="40" r="10" fill="#08080a" stroke="#ffffff" strokeWidth="2" />
          <circle cx="160" cy="40" r="4" fill="#df2531" />
          <text x="160" y="66" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600" fontFamily="monospace">HUB</text>

          {/* Node LON */}
          <circle cx="210" cy="15" r="5" fill="#08080a" stroke="#10b981" strokeWidth="2" />
          <text x="235" y="18" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace">LON</text>

          {/* Node TYO */}
          <circle cx="280" cy="40" r="6" fill="#08080a" stroke="#df2531" strokeWidth="2" />
          <text x="280" y="62" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace">TYO</text>
        </svg>

        <div className={styles.edgeLatencies}>
          <div className={styles.latencyBox}>
            <span className={styles.nodeCity}>US-EAST</span>
            <span className={styles.nodeMs}>&lt; 8ms</span>
          </div>
          <div className={styles.latencyBox}>
            <span className={styles.nodeCity}>EU-WEST</span>
            <span className={styles.nodeMs}>&lt; 12ms</span>
          </div>
          <div className={styles.latencyBox}>
            <span className={styles.nodeCity}>AP-SOUTH</span>
            <span className={styles.nodeMs}>&lt; 14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 07: Software & Hardware Solutions — Workshops, Hackathons & Code Nexus
 */
export const SoftwareSolutionsVisual: React.FC = () => {
  return (
    <div className={styles.softwareStage} aria-label="Software & Hardware Solutions Specimen">
      <div className={styles.terminalCard}>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalDots} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <span className={styles.terminalTitle}>WORKSHOPS // HACKATHONS LAB</span>
        </div>

        <div className={styles.terminalBody}>
          <div className={styles.codeLine}>
            <span className={styles.promptSymbol}>$</span>
            <span className={styles.commandText}>aranea sprint --hackathon-active</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px' }}>
            &gt; Initializing Hackathon Pipeline [v2.4]...
          </div>
          <div style={{ color: '#10b981', fontSize: '9px', fontWeight: 600 }}>
            &gt; STATUS: 128 / 128 UNIT &amp; HARDWARE TESTS PASSED
          </div>

          <div className={styles.hackathonStatsRow}>
            <div className={styles.statItem}>
              <span className={styles.statItemLabel}>ACTIVE BUILDERS</span>
              <span className={styles.statItemValue}>48 SPRINT LAB</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statItemLabel}>HARDWARE RIGS</span>
              <span className={styles.statItemValue}>16 PROTOTYPES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 08: IoT & Hardware Solutions — Microcontroller Circuit & Sensor Telemetry
 */
export const IoTHardwareVisual: React.FC = () => {
  return (
    <div className={styles.iotStage} aria-label="IoT & Hardware Solutions Specimen">
      <div className={styles.iotCard}>
        <div className={styles.iotHeader}>
          <span className={styles.iotTitle}>EMBEDDED MCU // SENSOR BUS</span>
          <div className={styles.iotLiveStatus}>
            <span className={styles.iotLiveDot} aria-hidden="true" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Microcontroller Schematic & Circuit Traces */}
        <svg className={styles.mcuSchematic} viewBox="0 0 320 80" fill="none">
          {/* Main MCU IC Package */}
          <rect x="110" y="16" width="100" height="48" rx="4" fill="#0d0e14" stroke="#df2531" strokeWidth="1.5" />
          <text x="160" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="monospace">
            ESP32 / MCU
          </text>

          {/* Left Pins (GPIO) */}
          <line x1="40" y1="26" x2="110" y2="26" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="40" cy="26" r="3" fill="#df2531" />
          <text x="32" y="29" textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">GPIO 04</text>

          <line x1="40" y1="52" x2="110" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="40" cy="52" r="3" fill="#df2531" />
          <text x="32" y="55" textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">I2C SDA</text>

          {/* Right Pins (Sensors & Power) */}
          <line x1="210" y1="26" x2="280" y2="26" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="280" cy="26" r="3" fill="#10b981" />
          <text x="288" y="29" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">3.3V VDD</text>

          <line x1="210" y1="52" x2="280" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="280" cy="52" r="3" fill="#10b981" />
          <text x="288" y="55" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">SPI MOSI</text>
        </svg>

        {/* Telemetry Grid */}
        <div className={styles.telemetryGrid}>
          <div className={styles.telemetryBox}>
            <span className={styles.telemetryLabel}>CORE VOLT</span>
            <span className={styles.telemetryValue}>3.30V</span>
          </div>
          <div className={styles.telemetryBox}>
            <span className={styles.telemetryLabel}>MESH FREQ</span>
            <span className={styles.telemetryValue}>2.4 GHz</span>
          </div>
          <div className={styles.telemetryBox}>
            <span className={styles.telemetryLabel}>THERMAL</span>
            <span className={styles.telemetryValue}>24.6°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

