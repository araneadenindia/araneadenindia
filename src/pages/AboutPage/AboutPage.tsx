import React, { useEffect } from 'react';
import { AboutSpiderHero } from './AboutSpiderHero';
import { AboutBrandValues } from './AboutBrandValues';
import { AboutNarrative } from './AboutNarrative';
import styles from './AboutPage.module.css';

/**
 * AboutPage — Master Cinematic Studio Architecture
 * Re-designed from scratch inspired by the reference artwork:
 * 1. Full-screen Dark Cinematic Hero with Central Geometric Spider & Symmetrical Web
 * 2. Eight Service Nodes with glowing crimson circular badges & connecting silk lines
 * 3. Minimal Brand Values Strip (Creative Ideas, Strategic Approach, Quality Assured, Results Driven)
 * 4. Concise, Editorial About Narrative (Who We Are, Mission, Approach, Founder Saikiran Chapa)
 * 5. Closing Collaborative Call To Action
 */
export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'ABOUT — ARANEA DEN | We Weave Your Digital Excellence';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className={styles.aboutPage}>
      {/* ── 1 & 2. Master Central Spider Composition with 8 Service Nodes ── */}
      <AboutSpiderHero />

      {/* ── 3. Brand Core Values Strip ── */}
      <AboutBrandValues />

      {/* ── 4 & 5. Concise Editorial Narrative, Founder Direction & Next Steps ── */}
      <AboutNarrative />
    </div>
  );
};

export default AboutPage;
