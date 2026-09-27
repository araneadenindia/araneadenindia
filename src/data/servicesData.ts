export type ServiceCategory =
  | 'all'
  | 'digital-products'
  | 'marketing-growth'
  | 'visual-production'
  | 'innovation-learning';

export interface ServiceCategoryTab {
  id: ServiceCategory;
  label: string;
  count: number;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  categorySlug: 'digital-products' | 'marketing-growth' | 'visual-production' | 'innovation-learning';
  badge?: string;
  description: string;
  detailedCopy: string;
  deliverables: string[];
  image: string;
  featured?: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryTab[] = [
  { id: 'all', label: 'ALL SERVICES', count: 14 },
  { id: 'digital-products', label: 'DIGITAL PRODUCTS', count: 3 },
  { id: 'marketing-growth', label: 'DIGITAL MARKETING', count: 4 },
  { id: 'visual-production', label: 'AD IMPERIAL VISUALS', count: 5 },
  { id: 'innovation-learning', label: 'TECHNOLOGY & COMMUNITY', count: 2 },
];

export const ALL_SERVICES: ServiceItem[] = [
  // ── 01: WEB DEVELOPMENT (Flagship Feature) ──
  {
    id: 'web-development',
    number: '01',
    title: 'WEB DEVELOPMENT',
    category: 'DIGITAL PRODUCTS',
    categorySlug: 'digital-products',
    badge: 'FLAGSHIP DISCIPLINE',
    description: 'Build responsive, high-performance websites and digital platforms tailored to business goals.',
    detailedCopy:
      'We engineer bespoke web applications, enterprise platforms, and digital flagships built on modern component architecture. From headless content management systems to high-concurrency microservices, our code is written for planetary scale, rigorous accessibility, and effortless velocity.',
    deliverables: [
      'Next.js & React Flagships',
      'Headless CMS Architecture',
      'Custom WebGL & GSAP Motion',
      'API & Microservices Engineering',
      'Sub-Second Core Web Vitals',
    ],
    image: '/services/01-web-development.jpg',
    featured: true,
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=web-development',
  },

  // ── 02: MOBILE APP DEVELOPMENT ──
  {
    id: 'mobile-app-development',
    number: '02',
    title: 'MOBILE APP DEVELOPMENT',
    category: 'DIGITAL PRODUCTS',
    categorySlug: 'digital-products',
    description: 'Design and develop intuitive mobile applications that deliver seamless experiences across devices.',
    detailedCopy:
      'Fluid iOS and Android experiences built with tactile responsiveness, native capabilities, and offline-first resilience. We focus on low-latency state synchronization, frictionless onboarding flows, and zero-compromise platform fidelity.',
    deliverables: [
      'Cross-Platform React Native',
      'Native iOS (Swift) & Android (Kotlin)',
      'Offline-First Sync Engines',
      'Tactile Haptic Micro-Interactions',
      'App Store Optimization & Release',
    ],
    image: '/services/02-mobile-app-development.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=mobile-development',
  },

  // ── 03: DIGITAL MARKETING ──
  {
    id: 'digital-marketing',
    number: '03',
    title: 'DIGITAL MARKETING',
    category: 'MARKETING & GROWTH',
    categorySlug: 'marketing-growth',
    description: 'Create strategic digital campaigns that strengthen brand visibility, audience engagement, and business growth.',
    detailedCopy:
      'Data-driven performance campaigns and strategic positioning that turn passive observers into devoted advocates. We build closed-loop analytics architectures and multi-touch attribution systems to ensure every marketing investment compounds brand equity.',
    deliverables: [
      'Omnichannel Growth Strategy',
      'Conversion Funnel Optimization',
      'Audience Segmentation & Retention',
      'Closed-Loop Analytics & BI',
      'Brand Identity Positioning',
    ],
    image: '/services/03-digital-marketing.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=digital-marketing',
  },

  // ── 04: SOCIAL MEDIA MANAGEMENT ──
  {
    id: 'social-media-management',
    number: '04',
    title: 'SOCIAL MEDIA MANAGEMENT',
    category: 'MARKETING & GROWTH',
    categorySlug: 'marketing-growth',
    description: 'Manage social media presence through content planning, creative direction, publishing, and audience engagement.',
    detailedCopy:
      'Holistic social media direction that establishes unmistakable authority across modern digital channels. From strategic calendar planning to bespoke aesthetic curation and active community management, we build enduring brand affinity.',
    deliverables: [
      'Strategic Content Calendars',
      'Art Direction & Feed Aesthetics',
      'Multi-Channel Publishing Workflows',
      'Community & Audience Engagement',
      'Performance Telemetry Reports',
    ],
    image: '/services/04-social-media-management.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=social-media',
  },

  // ── 05: META / GOOGLE / INSTAGRAM ADS ──
  {
    id: 'meta-google-instagram-ads',
    number: '05',
    title: 'META / GOOGLE / INSTAGRAM ADS',
    category: 'MARKETING & GROWTH',
    categorySlug: 'marketing-growth',
    description: 'Create and manage paid advertising campaigns across Meta, Google, and Instagram to reach relevant audiences and support business objectives.',
    detailedCopy:
      'High-velocity paid media campaigns engineered for measurable return on ad spend. We orchestrate algorithmic bidding, hyper-targeted demographic cohorts, and relentless creative testing across Meta, Google Search/Display, and Instagram networks.',
    deliverables: [
      'Meta Ads Manager & Pixels',
      'Google Search, Performance Max & YouTube',
      'Instagram Story & Feed Ad Choreography',
      'Dynamic Creative Multivariate Testing',
      'ROAS & CAC Scale Optimization',
    ],
    image: '/services/05-meta-google-instagram-ads.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=paid-ads',
  },

  // ── 06: GOOGLE BUSINESS PROFILE & LOCAL LISTING ──
  {
    id: 'google-business-profile',
    number: '06',
    title: 'GOOGLE BUSINESS PROFILE & LOCAL LISTING',
    category: 'MARKETING & GROWTH',
    categorySlug: 'marketing-growth',
    description: 'Set up and optimize Google Business Profiles to improve local business visibility and help customers discover businesses online.',
    detailedCopy:
      'Dominate high-intent local search and map discovery. We set up, verify, and continuously optimize your Google Business Profiles and local directory listings, ensuring verified trust, accurate geo-coordinates, and automated customer review workflows.',
    deliverables: [
      'Google Business Profile Setup & Verification',
      'Local Map Pack 3-Pack Optimization',
      'Citation & Directory Consistency',
      'Customer Review Acquisition Funnels',
      'Local Search Keyword Clustering',
    ],
    image: '/services/06-google-business-profile.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=local-listing',
  },

  // ── 07: VIDEOGRAPHY ──
  {
    id: 'videography',
    number: '07',
    title: 'VIDEOGRAPHY',
    category: 'VISUAL PRODUCTION',
    categorySlug: 'visual-production',
    description: 'Capture cinematic footage, brand stories, events, and promotional content with a strong visual identity.',
    detailedCopy:
      'Studio-grade cinematography engineered with cinema camera systems, high-dynamic-range glass, and intentional lighting. We shoot commercial advertisements, corporate documentaries, event coverage, and flagship brand narrative films.',
    deliverables: [
      '4K Cinema Camera Productions',
      'Commercials & Brand Spot Filming',
      'Executive & Corporate Documentaries',
      'On-Location Multi-Cam Event Capture',
      'Acoustic Multi-Track Field Recording',
    ],
    image: '/services/07-videography.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=videography',
  },

  // ── 08: PHOTOGRAPHY ──
  {
    id: 'photography',
    number: '08',
    title: 'PHOTOGRAPHY',
    category: 'VISUAL PRODUCTION',
    categorySlug: 'visual-production',
    description: 'Create professional visual content for brands, products, people, events, and campaigns.',
    detailedCopy:
      'High-resolution commercial photography tailored for international campaigns and digital storefronts. Our studio specializes in precision product lighting, editorial portraits, architecture, and live event documentation.',
    deliverables: [
      'High-End Product Photography',
      'Executive & Editorial Portraits',
      'Architectural & Interior Showcase',
      'Campaign & Commercial Lookbooks',
      'Pixel-Level Color & Retouch Polish',
    ],
    image: '/services/08-photography.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=photography',
  },

  // ── 09: VIDEO EDITING ──
  {
    id: 'video-editing',
    number: '09',
    title: 'VIDEO EDITING',
    category: 'VISUAL PRODUCTION',
    categorySlug: 'visual-production',
    description: 'Transform raw footage into polished, engaging visual stories through professional editing, pacing, color grading, and sound design.',
    detailedCopy:
      'Post-production craft that turns hours of raw capture into rhythmic, emotionally arresting cinematic narratives. Our editing suite executes non-linear multi-track assemblies, DaVinci Resolve color grading, audio spatialization, and seamless visual effects.',
    deliverables: [
      'Non-Linear Narrative Assembly',
      'DaVinci Resolve HDR Color Grading',
      'Custom Motion Graphics & Lower Thirds',
      'Foley, Sound Design & Audio Mastering',
      'Dynamic Aspect Ratio Multiplexing',
    ],
    image: '/services/09-video-editing.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=video-editing',
  },

  // ── 10: POSTER & GRAPHIC DESIGN ──
  {
    id: 'poster-graphic-design',
    number: '10',
    title: 'POSTER & GRAPHIC DESIGN',
    category: 'VISUAL PRODUCTION',
    categorySlug: 'visual-production',
    description: 'Create compelling posters, promotional creatives, visual identities, and graphic assets for brands, events, and campaigns.',
    detailedCopy:
      'Bold typographic compositions and visual architecture grounded in the Swiss international typographic style. We design arresting event posters, billboard creatives, social identity assets, and brand design guidelines that stand out instantly.',
    deliverables: [
      'Editorial & Exhibition Posters',
      'Key Visual & Campaign Creatives',
      'Vector Brandmark & Logotype Systems',
      'Print Collateral & Packaging Design',
      'Digital Banner & Display Assets',
    ],
    image: '/services/10-poster-graphic-design.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=graphic-design',
  },

  // ── 11: REEL SHOOTS — AD IMPERIAL VISUALS (Feature Card) ──
  {
    id: 'ad-imperial-visuals',
    number: '11',
    title: 'REEL SHOOTS — AD IMPERIAL VISUALS',
    category: 'VISUAL PRODUCTION',
    categorySlug: 'visual-production',
    badge: 'AD IMPERIAL VISUALS',
    description: 'Create short-form vertical video content, promotional reels, and social-first visual stories through AD Imperial Visuals.',
    detailedCopy:
      'Our dedicated creative arm for viral, high-production 9:16 vertical storytelling. AD Imperial Visuals pairs cinema-grade handheld setups with fast-paced editing, viral audio hooks, and visual storytelling tailored specifically for Instagram Reels, YouTube Shorts, and TikTok.',
    deliverables: [
      '9:16 Vertical Cinema Direction',
      'On-Location Fast-Turnaround Shoots',
      'Hook Architecture & High-Retention Pacing',
      'Trending Audio Choreography',
      'Creator & Brand Collaborative Packages',
    ],
    image: '/services/11-ad-imperial-visuals.jpg',
    featured: true,
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=reels-production',
  },

  // ── 12: IoT PROTOTYPING ──
  {
    id: 'iot-prototyping',
    number: '12',
    title: 'IoT PROTOTYPING',
    category: 'DIGITAL PRODUCTS',
    categorySlug: 'digital-products',
    description: 'Develop IoT concepts and functional prototypes that connect hardware, software, sensors, and digital systems.',
    detailedCopy:
      'Bridging computational intelligence with physical reality. We build connected hardware prototypes using ESP32, STM32, and custom PCB boards integrated with cloud telemetry pipelines, embedded sensors, and real-time mobile companion applications.',
    deliverables: [
      'Custom PCB Schematic & Layout Design',
      'Embedded Firmware (C / C++ / MicroPython)',
      'Sensor & Actuator Telemetry Arrays',
      'MQTT / WebSockets Cloud Connectivity',
      'Physical Proof-of-Concept Bench Testing',
    ],
    image: '/services/12-iot-prototyping.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=iot-prototyping',
  },

  // ── 13: HACKATHONS & UPDATES ──
  {
    id: 'hackathons-updates',
    number: '13',
    title: 'HACKATHONS & UPDATES',
    category: 'INNOVATION & LEARNING',
    categorySlug: 'innovation-learning',
    description: 'Provide hackathon-related updates, announcements, opportunities, event information, and relevant community content.',
    detailedCopy:
      'Connecting aspiring engineers, creative technologists, and founders with high-impact technology hackathons, algorithmic challenges, and open-source sprints. We provide curated event briefings, problem statements, and real-time community updates.',
    deliverables: [
      'Curated Hackathon Announcements & Tracks',
      'Rapid Solution Prototyping Frameworks',
      'Open-Source Sprint Coordination',
      'Community Innovation Updates & Briefs',
      'Technical Mentorship & Judging Guidance',
    ],
    image: '/services/13-hackathons-updates.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=hackathons',
  },

  // ── 14: WORKSHOPS & TRAINING ──
  {
    id: 'workshops-training',
    number: '14',
    title: 'WORKSHOPS & TRAINING',
    category: 'INNOVATION & LEARNING',
    categorySlug: 'innovation-learning',
    description: 'Conduct workshops and practical learning sessions focused on technology, creativity, digital tools, and emerging skills.',
    detailedCopy:
      'Empowering engineering teams, students, and emerging designers through intensive, practical hands-on workshops. Our sessions cover modern full-stack web engineering, UI/UX systems design, generative AI workflows, and cinematic digital production.',
    deliverables: [
      'Hands-On Coding & Architecture Masterclasses',
      'Interactive Design System Bootcamps',
      'Applied AI & Digital Workflow Seminars',
      'Corporate Engineering Upskilling',
      'Comprehensive Curriculum & Code Sandboxes',
    ],
    image: '/services/14-workshops-training.jpg',
    actionLabel: 'EXPLORE SERVICE →',
    actionUrl: '/contact?service=workshops',
  },
];
