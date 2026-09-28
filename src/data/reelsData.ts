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
    videoSrc: '/reels-videos/startup_potluck_rjy_1786440024_3961264728183160298_74679998814.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DaxbWhTz9hH/',
    aspectRatio: '9:16',
    likes: '142 Likes',
    tag: 'STARTUP PITCH'
  }
];
