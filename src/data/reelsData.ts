// Authoritative Aranea Den Instagram Reels from official channel @araneaden_
export interface AraneaReel {
  id: string;
  title: string;
  client: string;
  caption: string;
  thumbnail: string;
  videoSrc: string;
  instagramUrl: string;
  aspectRatio: '9:16' | '16:9';
  likes: string;
  tag: string;
}

export const ARANEA_REELS: AraneaReel[] = [
  {
    id: 'reel-1',
    title: 'Startup Potluck — Founder Pitch',
    client: 'Startup Potluck',
    caption: 'Official video coverage and cinematic launch showcase for Startup Potluck in Rajahmundry.',
    thumbnail: '/reels/reel_05.jpg',
    videoSrc: '/reels-videos/startup-potluck.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DaxbWhTz9hH/',
    aspectRatio: '9:16',
    likes: '142 Likes',
    tag: 'STARTUP PITCH',
  },
  {
    id: 'reel-2',
    title: 'CEO Expos — Executive Summit',
    client: 'CEO Expos',
    caption: 'High-impact conference branding, executive summit campaigns, and dynamic attendee registration media across Andhra Pradesh.',
    thumbnail: '/reels/reel_02.jpg',
    videoSrc: '/reels-videos/ceo-expos.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/',
    aspectRatio: '9:16',
    likes: '280 Likes',
    tag: 'EXECUTIVE SUMMIT',
  },
  {
    id: 'reel-3',
    title: 'JK Restaurant — Culinary Storytelling',
    client: 'JK Restaurant',
    caption: 'Sensory gastronomy choreography and culinary brand elevation for Rajahmundry premier dining establishment.',
    thumbnail: '/reels/reel_06.jpg',
    videoSrc: '/reels-videos/jk-restaurant.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/',
    aspectRatio: '9:16',
    likes: '310 Likes',
    tag: 'CULINARY BRANDING',
  },
  {
    id: 'reel-4',
    title: 'Finance with Veeru — Advisory Visuals',
    client: 'Finance with Veeru',
    caption: 'Authoritative financial education reels, personal brand cinematography, and high-trust audience growth choreography.',
    thumbnail: '/reels/reel_04.jpg',
    videoSrc: '/reels-videos/finance-with-veeru.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/',
    aspectRatio: '9:16',
    likes: '520 Likes',
    tag: 'WEALTH ADVISORY',
  },
];
