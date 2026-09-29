// src/cms/types.ts
// Comprehensive TypeScript schema for Aranea Den Live Visual CMS

export type MediaType = 'image' | 'video';

export interface CmsMedia {
  type: MediaType;
  url: string;
  publicId?: string;
  alt?: string;
  posterUrl?: string; // Poster / thumbnail for video
  aspectRatio?: string;
}

export interface CmsLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

// ── Repeatable Collection Item Types ─────────────────────────
export interface CmsServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  categorySlug: 'digital-products' | 'digital-marketing' | 'ad-imperial-visuals' | 'technology-community';
  badge?: string;
  description: string;
  detailedCopy: string;
  deliverables: string[];
  media: CmsMedia;
  featured?: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export interface CmsPortfolioWebsite {
  id: string;
  number: string;
  title: string;
  domain: string;
  url: string;
  category: string;
  filterCategory: 'enterprise' | 'luxury' | 'hospitality' | 'creative';
  metaDescription: string;
  tags: string[];
  media: CmsMedia;
  year: string;
  featuredOnHome?: boolean;
}

export interface CmsAppItem {
  id: string;
  name: string;
  client: string;
  platform: string;
  category: string;
  description: string;
  tags: string[];
  media: CmsMedia;
  url?: string;
  year: string;
  status: string;
}

export interface CmsReelItem {
  id: string;
  title: string;
  client: string;
  caption: string;
  media: CmsMedia;
  instagramUrl: string;
  aspectRatio: '9:16' | '16:9';
  likes: string;
  tag: string;
}

export interface CmsTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  shortBio?: string;
  media: CmsMedia;
  order: number;
  linkedin?: string;
  instagram?: string;
}

export interface CmsAnnouncementItem {
  id: string;
  title: string;
  media: CmsMedia;
  eventDate: string;
  buttonTitle: string;
  buttonLink: string;
}

export interface CmsTestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
}

export interface CmsClientItem {
  id: string;
  name: string;
  media: CmsMedia;
  link?: string;
}

export interface CmsWhatWeDoChapter {
  id: string;
  number: string;
  slug: string;
  name: string;
  description: string;
  imageSrc: string;
}

export interface CmsPhilosophyStage {
  number: string;
  name: string;
  summary: string;
}

export interface CmsShowcaseExperience {
  id: string;
  client: string;
  tag: string;
  title: string;
  matter: string;
  imageSrc: string;
  linkUrl: string;
  isExternal?: boolean;
}

export interface CmsClientLogo {
  id: string;
  name: string;
  src: string;
  url?: string;
}

export interface CmsFinalCTA {
  eyebrow: string;
  line1: string;
  line2: string;
  line3: string;
  subtext: string;
  buttonLabel: string;
  buttonUrl: string;
}

export interface CmsFooter {
  tagline: string;
  copyright: string;
  email: string;
  phone: string;
  instagramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

// ── Complete Site Content Tree ────────────────────────────────
export interface CmsContentTree {
  metadata: {
    version: number;
    lastSaved: string;
    lastPublished: string;
    publishedBy?: string;
  };
  home: {
    hero: {
      headline1: string;
      headline2: string;
      narrative: string;
      ctaLabel: string;
      ctaUrl: string;
      media: CmsMedia;
      passionTitle: string;
      passionNarrative: string;
      passionCopy: string;
    };
    announcements: {
      eyebrow: string;
      title: string;
      items: CmsAnnouncementItem[];
    };
    whatWeDo: {
      eyebrow: string;
      title: string;
      items: CmsWhatWeDoChapter[];
    };
    philosophy: {
      eyebrow: string;
      title: string;
      subtitle: string;
      stages: CmsPhilosophyStage[];
    };
    marqueeText: string[];
    experiences: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: CmsShowcaseExperience[];
    };
    testimonials: {
      eyebrow: string;
      title: string;
      items: CmsTestimonialItem[];
    };
    clients: {
      eyebrow: string;
      title: string;
      subtitle: string;
      items: CmsClientLogo[];
    };
    cta: CmsFinalCTA;
  };
  about: {
    hero: {
      breadcrumb: string;
      eyebrow: string;
      heading: string;
      lead: string;
      stats: {
        founded: string;
        services: string;
        ecosystem: string;
      };
      cta1Label: string;
      cta1Url: string;
      cta2Label: string;
      cta2Url: string;
    };
    vision: {
      eyebrow: string;
      heading: string;
      body: string;
      media: CmsMedia;
    };
    mission: {
      eyebrow: string;
      heading: string;
      body: string;
      media: CmsMedia;
    };
    pillars: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  services: {
    hero: {
      breadcrumb: string;
      eyebrow: string;
      heading: string;
      lead: string;
      stats: {
        servicesCount: string;
        disciplinesCount: string;
        studioCount: string;
      };
    };
    items: CmsServiceItem[];
  };
  portfolio: {
    hero: {
      breadcrumb: string;
      eyebrow: string;
      heading: string;
      lead: string;
    };
    websites: CmsPortfolioWebsite[];
    apps: CmsAppItem[];
    reels: CmsReelItem[];
  };
  team: {
    hero: {
      breadcrumb: string;
      eyebrow: string;
      heading: string;
      lead: string;
    };
    members: CmsTeamMember[];
  };
  contact: {
    hero: {
      breadcrumb: string;
      heading: string;
      lead: string;
    };
    phone: string;
    email: string;
    address: string;
    whatsappNumber: string;
  };
  footer: CmsFooter;
}
