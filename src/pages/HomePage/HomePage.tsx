import React from 'react';
import { AraneaDenHero } from '../../components/AraneaDenHero';
import { WhatWeDo } from '../../components/WhatWeDo';
import { AnnouncementsSection } from '../../components/AnnouncementsSection';
import { AraneaSystem } from '../../components/AraneaSystem';
import { StatementMarquee } from '../../components/StatementMarquee';
import { SelectedWork } from '../../components/SelectedWork';
import { TestimonialsSection } from '../../components/TestimonialsSection';
import { TeamPreview } from '../../components/TeamPreview';
import { ClienteleSection } from '../../components/ClienteleSection';
import { FinalCTA } from '../../components/FinalCTA';

interface HomePageProps {
  isVisible: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ isVisible }) => {
  return (
    <>
      {/* Scene 02 & 03: Master Pinned Flow (Framed Video Hero -> Fullscreen Expansion -> Our Passion) */}
      <AraneaDenHero isVisible={isVisible} />

      {/* Announcements Section (Immediately below OUR PASSION) */}
      <AnnouncementsSection />

      {/* Scene 04: Pinned 8-Chapter Disciplines Timeline (Services) */}
      <WhatWeDo />

      {/* Scene 05: Connected Discipline Architecture Grid (Our Philosophy) */}
      <AraneaSystem />

      {/* Scene 06: Kinetic Typographic Ticker */}
      <StatementMarquee />

      {/* Scene 07: Editorial Case Study Previews (What We've Built) */}
      <SelectedWork />

      {/* Scene 08.5: Editorial Auto-Scrolling Testimonials */}
      <TestimonialsSection />

      {/* Scene 08: Compact Editorial Team Preview */}
      <TeamPreview />

      {/* Universal Clientele Section (Immediately before ENGAGEMENTS) */}
      <ClienteleSection />

      {/* Scene 09: Monumental Closing Call to Action (Engagements) */}
      <FinalCTA />
    </>
  );
};
