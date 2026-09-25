import React from 'react';
import { AraneaDenHero } from '../../components/AraneaDenHero';
import { WhatWeDo } from '../../components/WhatWeDo';
import { AraneaSystem } from '../../components/AraneaSystem';
import { StatementMarquee } from '../../components/StatementMarquee';
import { SelectedWork } from '../../components/SelectedWork';
import { TeamPreview } from '../../components/TeamPreview';
import { FinalCTA } from '../../components/FinalCTA';

interface HomePageProps {
  isVisible: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isVisible }) => {
  return (
    <>
      {/* Scene 02 & 03: Master Pinned Flow (Framed Video Hero -> Fullscreen Expansion -> Our Passion) */}
      <AraneaDenHero isVisible={isVisible} />

      {/* Scene 04: Pinned 8-Chapter Disciplines Timeline */}
      <WhatWeDo />

      {/* Scene 05: Connected Discipline Architecture Grid */}
      <AraneaSystem />

      {/* Scene 06: Kinetic Typographic Ticker */}
      <StatementMarquee />

      {/* Scene 07: Editorial Case Study Previews (What We've Built) */}
      <SelectedWork />

      {/* Scene 08: Compact Editorial Team Preview */}
      <TeamPreview />

      {/* Scene 09: Monumental Closing Call to Action (Engagements) */}
      <FinalCTA />
    </>
  );
};
