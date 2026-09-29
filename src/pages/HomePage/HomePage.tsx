import React from 'react';
import { AraneaDenHero } from '../../components/AraneaDenHero';
import { WhatWeDo } from '../../components/WhatWeDo';
import { AnnouncementsSection } from '../../components/AnnouncementsSection';
import { AraneaSystem } from '../../components/AraneaSystem';
import { StatementMarquee } from '../../components/StatementMarquee';
import { AdExperiencesSection } from '../../components/AdExperiencesSection';
import { TeamPreview } from '../../components/TeamPreview';
import { ClienteleSection } from '../../components/ClienteleSection';
import { TestimonialsSection } from '../../components/TestimonialsSection';
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

      {/* Scene 07: AD Experiences Showcase */}
      <AdExperiencesSection />

      {/* Scene 08: Compact Editorial Team Preview (The Powerhouse) */}
      <TeamPreview />

      {/* Universal Clientele Section */}
      <ClienteleSection />

      {/* Simple Editorial Testimonials (Immediately before ENGAGEMENTS) */}
      <TestimonialsSection />

      {/* Scene 09: Monumental Closing Call to Action (Engagements) */}
      <FinalCTA />
    </>
  );
};
