export interface PortfolioWebsite {
  id: string;
  number: string;
  title: string;
  domain: string;
  url: string;
  category: string;
  filterCategory: 'enterprise' | 'luxury' | 'hospitality' | 'creative';
  metaDescription: string;
  tags: string[];
  thumbnail: string;
  year: string;
  featuredOnHome?: boolean;
}

export const PORTFOLIO_WEBSITES: PortfolioWebsite[] = [
  {
    id: 'pooja-productions',
    number: '01',
    title: 'Pooja Productions — Premium Film Production House',
    domain: 'poojaproductions.com',
    url: 'https://poojaproductions.com',
    category: 'FILM PRODUCTION & ENTERTAINMENT',
    filterCategory: 'creative',
    metaDescription: 'Pooja Productions is a prestigious film production house producing award-winning feature films, documentaries, and visual stories.',
    tags: ['Next.js', 'Cinematic Media', 'Film Archive', 'High-Res Video'],
    thumbnail: '/portfolio-thumbs/pooja.jpg',
    year: '2026',
    featuredOnHome: true,
  },
  {
    id: 'meghana-builders',
    number: '02',
    title: 'Meghana Builders — Crafting Landmarks in Hyderabad',
    domain: 'meghanabuilders.com',
    url: 'https://meghanabuilders.com',
    category: 'REAL ESTATE & CIVIL CONSTRUCTION',
    filterCategory: 'enterprise',
    metaDescription: 'Premier residential, commercial & government construction in Hyderabad. Architectural innovation meets structural excellence. Est. 2018.',
    tags: ['React', 'Civil Architecture', 'Property Showcase', 'Lead Capture'],
    thumbnail: '/portfolio-thumbs/meghana.jpg',
    year: '2026',
    featuredOnHome: true,
  },
  {
    id: 'viraj-academy',
    number: '03',
    title: 'VIRAJ ACADEMY — Transform Knowledge Into Career Success',
    domain: 'virajedu.com',
    url: 'https://virajedu.com',
    category: 'EDTECH & PROFESSIONAL TRAINING',
    filterCategory: 'enterprise',
    metaDescription: 'Practical training, competitive exam coaching, and career guidance from senior industry experts. 100% job assistance program.',
    tags: ['Next.js', 'LMS Portal', 'Course Enrollment', 'Career Guidance'],
    thumbnail: '/portfolio-thumbs/viraj.jpg',
    year: '2026',
    featuredOnHome: true,
  },
  {
    id: 'makaan-infra',
    number: '04',
    title: 'Makaan Infra — Building Dreams, Civil & Consulting',
    domain: 'makaaninfra.com',
    url: 'https://makaaninfra.com',
    category: 'CIVIL INFRASTRUCTURE & STRUCTURAL CONSULTING',
    filterCategory: 'enterprise',
    metaDescription: 'Makaan Infra – Professional civil construction, building planning, structural consulting & renovation services in Odisha. Quality work since 2020.',
    tags: ['Web Platform', 'Civil Consulting', 'Structural Engineering', 'Odisha'],
    thumbnail: '/portfolio-thumbs/makaan.jpg',
    year: '2025',
    featuredOnHome: true,
  },
  {
    id: 'sriyasjaan',
    number: '05',
    title: 'Sriya & Janak — Luxury Wedding Experience',
    domain: 'sriyasjaan.com',
    url: 'https://sriyasjaan.com',
    category: 'LUXURY WEDDINGS & PRIVATE FLAGSHIPS',
    filterCategory: 'luxury',
    metaDescription: 'With the blessings of our families, Hamsini Sriya Reddy & S. V. Janak Reddy invite you to their wedding celebrations in Hyderabad, 24–27 August 2026.',
    tags: ['Editorial Typography', 'RSVP Engine', 'Cinematic Photo Gallery', 'Private Cloud'],
    thumbnail: '/portfolio-thumbs/sriyasjaan.jpg',
    year: '2026',
    featuredOnHome: true,
  },
  {
    id: 'creators-events',
    number: '06',
    title: 'Creators Event Organization — Premium Expos in India',
    domain: 'creatorseventsorganization.vercel.app',
    url: 'https://creatorseventsorganization.vercel.app/',
    category: 'EXHIBITIONS & EVENT MANAGEMENT',
    filterCategory: 'creative',
    metaDescription: 'Creators Event Organization curates premium food, business, franchise, shopping, education and fashion expos across India. Book your stall today.',
    tags: ['React', 'Vercel Edge', 'Stall Booking System', 'National Expos'],
    thumbnail: '/portfolio-thumbs/creators.jpg',
    year: '2026',
  },
  {
    id: 'pp-connekts',
    number: '07',
    title: 'P & P Connekts — Make Your Mark Memorable',
    domain: 'pandpconnektss.web.app',
    url: 'https://pandpconnektss.web.app',
    category: 'DIGITAL MARKETING & BRAND STRATEGY',
    filterCategory: 'creative',
    metaDescription: 'P & P Connekts — Full-stack digital marketing agency delivering strategic brand elevation, campaign execution, and creative presence across India.',
    tags: ['Firebase Hosting', 'Brand Marketing', 'Performance SEO', 'Campaigns'],
    thumbnail: '/portfolio-thumbs/pandp.jpg',
    year: '2025',
  },
  {
    id: 'corner-craft',
    number: '08',
    title: 'Corner Craft Design Studio — Luxury Interiors',
    domain: 'cornercraftds.web.app',
    url: 'https://cornercraftds.web.app',
    category: 'HIGH-END ARCHITECTURAL INTERIOR DESIGN',
    filterCategory: 'luxury',
    metaDescription: 'Corner Craft Design Studio crafts luxury residential and commercial interiors in Hyderabad & Vijayawada. Premium materials, timeless design, turnkey solutions.',
    tags: ['Interior Design', '3D Walkthroughs', 'Turnkey Execution', 'Hyderabad'],
    thumbnail: '/portfolio-thumbs/cornercraft.jpg',
    year: '2026',
  },
  {
    id: 'thor-cuisine',
    number: '09',
    title: 'Thor Indian Cuisine — Authentic Restaurant in Memphis, TN',
    domain: 'thor-indian-cuisinse.firebaseapp.com',
    url: 'https://thor-indian-cuisinse.firebaseapp.com',
    category: 'FINE DINING & CULINARY BRANDING',
    filterCategory: 'hospitality',
    metaDescription: 'Experience authentic Indian cuisine at Thor Indian Cuisine. Hyderabadi Biryani, Butter Chicken, Tandoori specialties & catering in Memphis, TN.',
    tags: ['Digital Menu', 'Online Orders', 'Firebase App', 'Memphis TN'],
    thumbnail: '/portfolio-thumbs/thor.jpg',
    year: '2025',
  },
  {
    id: 'nri360',
    number: '10',
    title: 'NRI360 — Trusted NRI Services for Family & Property',
    domain: 'nri360degrees.com',
    url: 'https://nri360degrees.com',
    category: 'GLOBAL CONCIERGE & LEGAL INFRASTRUCTURE',
    filterCategory: 'enterprise',
    metaDescription: 'NRI360 delivers reliable senior citizen care, real estate management, legal aid, tax filing, PAN/Aadhaar & concierge services across 100+ cities in India for NRIs.',
    tags: ['Global Enterprise', 'Legal Concierge', 'Cloud Services', '100+ Cities'],
    thumbnail: '/portfolio-thumbs/nri360.jpg',
    year: '2026',
  },
  {
    id: 'ishoots',
    number: '11',
    title: 'iShoots — Premium Photography & Visual Production',
    domain: 'ishoots.com',
    url: 'https://ishoots.com',
    category: 'VISUAL PRODUCTION & COMMERCIAL MEDIA',
    filterCategory: 'creative',
    metaDescription: 'Editorial photography, commercial film campaigns, brand visuals, and creative fashion portfolios crafted with high dynamic range.',
    tags: ['Visual Archive', 'Commercial Shoots', 'Cinematography', 'Editorial Media'],
    thumbnail: '/portfolio-thumbs/pooja.jpg',
    year: '2025',
  },
];

export interface WebsiteShowcaseProject {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail: string;
  url: string;
  layout: 'image-left' | 'image-right';
}

export const REQUIRED_WEBSITES: WebsiteShowcaseProject[] = [
  {
    id: 'thor',
    number: '01',
    title: 'THOR',
    category: 'FINE DINING & CULINARY BRANDING',
    description:
      'Authentic culinary platform and online ordering system for Thor Indian Cuisine in Memphis, TN. Engineered with appetizing visual storytelling, real-time digital menus, and streamlined local online orders.',
    tags: ['Digital Menu', 'Online Orders', 'Firebase App', 'Memphis TN'],
    thumbnail: '/portfolio-thumbs/thor.jpg',
    url: 'https://thor-indian-cuisinse.firebaseapp.com',
    layout: 'image-left',
  },
  {
    id: 'corner-craft',
    number: '02',
    title: 'CORNER CRAFT',
    category: 'HIGH-END ARCHITECTURAL INTERIORS',
    description:
      'A minimalist digital atelier for luxury residential and commercial interiors across Hyderabad and Vijayawada. Showcases material palettes, turnkey transformations, and 3D architectural walkthroughs.',
    tags: ['Interior Architecture', '3D Walkthroughs', 'Turnkey Execution', 'Hyderabad'],
    thumbnail: '/portfolio-thumbs/cornercraft.jpg',
    url: 'https://cornercraftds.web.app',
    layout: 'image-right',
  },
  {
    id: 'maakan',
    number: '03',
    title: 'MAAKAN',
    category: 'CIVIL INFRASTRUCTURE & STRUCTURAL CONSULTING',
    description:
      'Enterprise civil construction, building planning, and structural consulting platform in Odisha. Crafted for structural authority, project progress transparency, and direct client consultation intake.',
    tags: ['Web Platform', 'Civil Consulting', 'Structural Engineering', 'Odisha'],
    thumbnail: '/portfolio-thumbs/makaan.jpg',
    url: 'https://makaaninfra.com',
    layout: 'image-left',
  },
];

export interface MarketingProject {
  id: string;
  number: string;
  name: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  logo?: string;
  videoSrc?: string;
}

export const REQUIRED_MARKETING_PROJECTS: MarketingProject[] = [
  {
    id: 'jk',
    number: '01',
    name: 'JK',
    client: 'JK Restaurant',
    category: 'CULINARY BRANDING & SOCIAL GROWTH',
    description:
      'Sensory gastronomy campaign, culinary storytelling, and localized social media acquisition for Rajahmundry’s premier dining landmark.',
    tags: ['Sensory Visuals', 'Local Acquisition', 'Social Strategy'],
    image: '/reels/reel_06.jpg',
    logo: '/clients/jk-restaurant.svg',
    videoSrc: '/reels-videos/jk-restaurant.mp4',
  },
  {
    id: 'ceo-expo',
    number: '02',
    name: 'CEO EXPO',
    client: 'CEO Expos',
    category: 'EXECUTIVE CONFERENCES & BUSINESS SUMMITS',
    description:
      'High-impact conference branding, executive summit campaigns, and dynamic attendee registration media across Andhra Pradesh.',
    tags: ['Summit Production', 'Key Visuals', 'Registration Media'],
    image: '/reels/reel_02.jpg',
    logo: '/clients/ceo-expos.svg',
    videoSrc: '/reels-videos/ceo-expos.mp4',
  },
  {
    id: 'startup-potluck',
    number: '03',
    name: 'STARTUP POTLUCK',
    client: 'Startup Potluck',
    category: 'FOUNDER ECOSYSTEMS & PITCH CAMPAIGNS',
    description:
      'Grassroots entrepreneurship meetup branding, investor pitch coverage, and high-engagement founder ecosystem campaigns.',
    tags: ['Founder Community', 'Pitch Media', 'Ecosystem Growth'],
    image: '/reels/reel_05.jpg',
    logo: '/clients/startup-potluck.svg',
    videoSrc: '/reels-videos/startup-potluck.mp4',
  },
  {
    id: 'finance-with-veeru',
    number: '04',
    name: 'FINANCE WITH VEERU',
    client: 'Finance with Veeru',
    category: 'FINANCIAL ADVISORY & PERSONAL BRANDING',
    description:
      'Authoritative financial education reels, personal brand cinematography, and high-trust audience growth choreography.',
    tags: ['Wealth Advisory', 'Brand Authority', 'Educational Reels'],
    image: '/reels/reel_04.jpg',
    logo: '/clients/finance-with-veeru.svg',
    videoSrc: '/reels-videos/finance-with-veeru.mp4',
  },
  {
    id: 'o2med-academy',
    number: '05',
    name: 'O2MED ACADEMY',
    client: 'O2Med Academy',
    category: 'HEALTHCARE EDUCATION & STUDENT INTAKE',
    description:
      'Medical education digital presence, student inquiry funnels, and authoritative healthcare coaching campaign infrastructure.',
    tags: ['Medical EdTech', 'Inquiry Funnels', 'Healthcare Academy'],
    image: '/portfolio-thumbs/viraj.jpg',
    logo: '/clients/o2med-academy.svg',
  },
];

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO REDESIGN DATA: 3 PRIMARY CATEGORIES
   ───────────────────────────────────────────────────────────── */

export interface WebsiteProject {
  id: string;
  number: string;
  title: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail: string;
  url: string;
  year: string;
}

export const WEBSITE_PROJECTS: WebsiteProject[] = [
  {
    id: 'meghana-builders',
    number: '01',
    title: 'MEGHANA BUILDERS',
    client: 'Meghana Builders',
    category: 'REAL ESTATE & CIVIL CONSTRUCTION',
    description:
      'Premier residential, commercial & government construction in Hyderabad. Architectural innovation meets structural excellence.',
    tags: ['React', 'Civil Architecture', 'Property Showcase', 'Lead Capture'],
    thumbnail: '/portfolio-thumbs/meghana.jpg',
    url: 'https://meghanabuilders.com',
    year: '2026',
  },
];

export interface AppProject {
  id: string;
  number: string;
  name: string;
  client: string;
  platform: string;
  category: string;
  description: string;
  tags: string[];
  thumbnail: string;
  url?: string;
  year: string;
  status: string;
}

export const APP_PROJECTS: AppProject[] = [
  {
    id: 'aranea-mobile-os',
    number: '01',
    name: 'ARANEA MOBILE OS',
    client: 'Aranea Den Atelier',
    platform: 'iOS / Swift & React Native',
    category: 'MOBILE ECOSYSTEM & TELEMETRY',
    description:
      'Tactile companion application engineered with micro-interactions, low-latency telemetry, and biometric security.',
    tags: ['SwiftUI', 'Offline-First SQLite', 'Biometrics', 'Haptics'],
    thumbnail: '/services/ad-mobile-development.jpg',
    url: '/services/mobile-development',
    year: '2026',
    status: 'In Development',
  },
  {
    id: 'thor-mobile-orders',
    number: '02',
    name: 'THOR MOBILE ORDERS',
    client: 'Thor Indian Cuisine',
    platform: 'iOS & Android Native',
    category: 'HOSPITALITY & LIVE ORDERING',
    description:
      'High-speed table reservations, instant kitchen telemetry, and synchronized curbside pickup notifications.',
    tags: ['React Native', 'Live Orders', 'Push Notifications', 'Memphis TN'],
    thumbnail: '/services/02-mobile-app-development.jpg',
    url: 'https://thor-indian-cuisinse.firebaseapp.com',
    year: '2025',
    status: 'Private Beta',
  },
  {
    id: 'nri360-concierge',
    number: '03',
    name: 'NRI360 MOBILE CONCIERGE',
    client: 'NRI360 Global',
    platform: 'Cross-Platform Mobile',
    category: 'GLOBAL CONCIERGE & HEALTHCARE',
    description:
      'Real-time property monitoring, senior family healthcare check-ins, and direct encrypted concierge chat.',
    tags: ['Flutter', 'Encrypted Chat', '100+ Cities', 'Legal Telemetry'],
    thumbnail: '/services/ad-ui-ux-design.jpg',
    url: 'https://nri360degrees.com',
    year: '2026',
    status: 'Production',
  },
  {
    id: 'imperial-visuals-suite',
    number: '04',
    name: 'IMPERIAL VISUALS MEDIA SUITE',
    client: 'AD Imperial Visuals',
    platform: 'iOS / iPadOS & Android',
    category: 'PORTABLE 4K MEDIA ARCHIVE',
    description:
      'Sensory vertical media showcase, client proofing suite, and instant social reel deployment companion.',
    tags: ['Video Player', 'ProRes Delivery', 'Color Fidelity', 'Studio Suite'],
    thumbnail: '/services/ui-ux-design.jpg',
    url: '/services/video-production',
    year: '2026',
    status: 'Internal Release',
  },
];
