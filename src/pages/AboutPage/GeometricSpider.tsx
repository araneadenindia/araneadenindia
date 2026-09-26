import React from 'react';

interface GeometricSpiderProps {
  className?: string;
  activeNode?: string | null;
}

/**
 * GeometricSpider — Master Symmetrical Metallic Arachnid
 * Faithfully re-architected to match the reference artwork:
 * - 3D faceted chrome and titanium carapace with crimson rim bevels
 * - Opisthosoma (abdomen) with internal tensile web lattice and glowing ruby core
 * - 8 articulated, faceted metallic legs with specular highlights and joint nodes
 * - Upward crescent pedipalps and concentric coronal crest
 */
export const GeometricSpider: React.FC<GeometricSpiderProps> = ({ className, activeNode }) => {
  return (
    <svg
      viewBox="0 0 500 480"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aranea Den Central Geometric Spider"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Core Crimson Neon Glow */}
        <filter id="spiderGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle Leg Specular Glow */}
        <filter id="legGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ambient Ruby Heart Glow */}
        <radialGradient id="rubyCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="25%" stopColor="#FF4A58" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#DF2531" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#780000" stopOpacity="0" />
        </radialGradient>

        {/* Metallic Chrome & Titanium Carapace Gradient */}
        <linearGradient id="chromePlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="18%" stopColor="#E2E2EA" />
          <stop offset="45%" stopColor="#8E8E9E" />
          <stop offset="75%" stopColor="#3C3C46" />
          <stop offset="100%" stopColor="#141418" />
        </linearGradient>

        {/* Inverted Specular Chrome Gradient */}
        <linearGradient id="chromePlateAlt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="22%" stopColor="#D4D4E0" />
          <stop offset="50%" stopColor="#767688" />
          <stop offset="80%" stopColor="#282830" />
          <stop offset="100%" stopColor="#0E0E12" />
        </linearGradient>

        {/* Sharp Crimson Bevel Stroke Gradient */}
        <linearGradient id="crimsonBevel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B76" />
          <stop offset="50%" stopColor="#DF2531" />
          <stop offset="100%" stopColor="#6E000A" />
        </linearGradient>

        {/* Deep Cavity Void Fill */}
        <linearGradient id="voidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#121216" />
          <stop offset="50%" stopColor="#08080A" />
          <stop offset="100%" stopColor="#020203" />
        </linearGradient>
      </defs>

      {/* ── 0. Deep Central Crimson Ambient Back-Light Aura ── */}
      <circle
        cx="250"
        cy="260"
        r="140"
        fill="url(#rubyCore)"
        opacity="0.32"
        style={{ pointerEvents: 'none' }}
      />

      {/* ── 1. CEPHALOTHORAX & UPPER CREST (Head, Pincers & Concentric Arches) ── */}
      <g id="cephalothorax" className="spider-core">
        {/* Concentric Crest Arches */}
        <path
          d="M 222 108 C 222 72 278 72 278 108"
          stroke="url(#chromePlate)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#legGlow)"
        />
        <path
          d="M 230 110 C 230 84 270 84 270 110"
          stroke="url(#crimsonBevel)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Left Curved Pincer (Chelicera / Pedipalp) */}
        <path
          d="M 244 128 C 234 92 216 66 206 42 C 224 58 238 88 248 116 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
          filter="url(#legGlow)"
        />
        {/* Right Curved Pincer */}
        <path
          d="M 256 128 C 266 92 284 66 294 42 C 276 58 262 88 252 116 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
          filter="url(#legGlow)"
        />

        {/* Central Faceted Thorax Shield */}
        <polygon
          points="250,118 280,154 250,190 220,154"
          fill="url(#voidGradient)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.8"
        />
        {/* Faceted Chiseled Reflective Plates */}
        <polygon
          points="250,118 280,154 250,154"
          fill="url(#chromePlate)"
          opacity="0.85"
        />
        <polygon
          points="250,118 220,154 250,154"
          fill="url(#chromePlateAlt)"
          opacity="0.9"
        />
        <polygon
          points="220,154 250,190 250,154"
          fill="url(#chromePlate)"
          opacity="0.75"
        />
        <polygon
          points="280,154 250,190 250,154"
          fill="url(#chromePlateAlt)"
          opacity="0.7"
        />

        {/* Center Heart Pip of Thorax */}
        <circle cx="250" cy="154" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="250" cy="154" r="1.8" fill="#DF2531" />
      </g>

      {/* ── 2. OPISTHOSOMA (Abdomen With Internal Spider Web & Ruby Core) ── */}
      <g id="opisthosoma" className="spider-core">
        {/* Outer Faceted Shield Perimeter */}
        <polygon
          points="250,194 296,268 280,352 250,394 220,352 204,268"
          fill="url(#voidGradient)"
          stroke="url(#crimsonBevel)"
          strokeWidth="2.6"
          filter="url(#legGlow)"
        />

        {/* Inner Beveled Recessed Chamber */}
        <polygon
          points="250,205 287,270 272,344 250,380 228,344 213,270"
          fill="#060608"
          stroke="rgba(223, 37, 49, 0.45)"
          strokeWidth="1.2"
        />

        {/* Internal Web Lattice Strands */}
        {/* Radiating threads from center (250, 285) to perimeter vertices */}
        <line x1="250" y1="285" x2="250" y2="205" stroke="rgba(223, 37, 49, 0.65)" strokeWidth="1.1" />
        <line x1="250" y1="285" x2="287" y2="270" stroke="rgba(223, 37, 49, 0.65)" strokeWidth="1.1" />
        <line x1="250" y1="285" x2="272" y2="344" stroke="rgba(223, 37, 49, 0.65)" strokeWidth="1.1" />
        <line x1="250" y1="285" x2="250" y2="380" stroke="rgba(223, 37, 49, 0.65)" strokeWidth="1.1" />
        <line x1="250" y1="285" x2="228" y2="344" stroke="rgba(223, 37, 49, 0.65)" strokeWidth="1.1" />
        <line x1="250" y1="285" x2="213" y2="270" stroke="rgba(223, 37, 49, 0.65)" strokeWidth="1.1" />

        {/* Secondary Diagonal Radiating Strands */}
        <line x1="250" y1="285" x2="268" y2="236" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="0.8" />
        <line x1="250" y1="285" x2="232" y2="236" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="0.8" />
        <line x1="250" y1="285" x2="280" y2="307" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="0.8" />
        <line x1="250" y1="285" x2="220" y2="307" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="0.8" />
        <line x1="250" y1="285" x2="261" y2="362" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="0.8" />
        <line x1="250" y1="285" x2="239" y2="362" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="0.8" />

        {/* Concentric Internal Arches */}
        <path d="M 226 248 Q 250 266 274 248" stroke="rgba(255, 77, 90, 0.7)" strokeWidth="1.2" fill="none" />
        <path d="M 229 275 Q 250 293 271 275" stroke="rgba(255, 77, 90, 0.75)" strokeWidth="1.2" fill="none" />
        <path d="M 234 305 Q 250 322 266 305" stroke="rgba(255, 77, 90, 0.8)" strokeWidth="1.2" fill="none" />
        <path d="M 239 335 Q 250 348 261 335" stroke="rgba(255, 77, 90, 0.75)" strokeWidth="1.2" fill="none" />
        <path d="M 244 360 Q 250 368 256 360" stroke="rgba(255, 77, 90, 0.7)" strokeWidth="1.1" fill="none" />

        {/* Glowing Ruby Arachnid Heart Core */}
        <circle cx="250" cy="285" r="14" fill="url(#rubyCore)" opacity="0.9" />
        <circle cx="250" cy="285" r="5" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="250" cy="285" r="2.5" fill="#DF2531" />
      </g>

      {/* ── 3. EIGHT ARTICULATED METALLIC LEGS ── */}
      {/* ── PAIR 1: FRONT UPPER LEGS (Connects to Web Dev & Graphic Design) ── */}
      <g
        id="leg-pair-1"
        className={`spider-leg ${activeNode === 'web' || activeNode === 'graphic' ? 'active-leg' : ''}`}
      >
        {/* Leg 1 Left */}
        {/* Coxa/Femur */}
        <path
          d="M 224 142 C 188 116 166 82 155 52 L 164 49 C 174 77 194 109 230 134 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        {/* Tibia */}
        <path
          d="M 155 52 L 108 78 L 112 85 L 164 49 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        {/* Tarsus (tapering to tip) */}
        <path
          d="M 108 78 L 62 64 L 64 59 L 112 85 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        {/* Knee Joint Jewel */}
        <circle cx="159" cy="50" r="3.2" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="159" cy="50" r="1.8" fill="#DF2531" />
        {/* Tip Jewel Node */}
        <circle cx="63" cy="62" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="63" cy="62" r="1.6" fill="#DF2531" />

        {/* Leg 1 Right (Symmetrical) */}
        <path
          d="M 276 142 C 312 116 334 82 345 52 L 336 49 C 326 77 306 109 270 134 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 345 52 L 392 78 L 388 85 L 336 49 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 392 78 L 438 64 L 436 59 L 388 85 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="341" cy="50" r="3.2" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="341" cy="50" r="1.8" fill="#DF2531" />
        <circle cx="437" cy="62" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="437" cy="62" r="1.6" fill="#DF2531" />
      </g>

      {/* ── PAIR 2: MID-UPPER LEGS (Connects to UI/UX & Video Production) ── */}
      <g
        id="leg-pair-2"
        className={`spider-leg ${activeNode === 'uiux' || activeNode === 'video' ? 'active-leg' : ''}`}
      >
        {/* Leg 2 Left */}
        <path
          d="M 220 162 C 178 150 142 134 122 118 L 129 114 C 148 128 183 143 224 154 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 122 118 L 78 145 L 82 152 L 129 114 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 78 145 L 45 138 L 47 132 L 82 152 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="125" cy="116" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="125" cy="116" r="1.6" fill="#DF2531" />
        <circle cx="46" cy="135" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="46" cy="135" r="1.6" fill="#DF2531" />

        {/* Leg 2 Right */}
        <path
          d="M 280 162 C 322 150 358 134 378 118 L 371 114 C 352 128 317 143 276 154 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 378 118 L 422 145 L 418 152 L 371 114 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 422 145 L 455 138 L 453 132 L 418 152 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="375" cy="116" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="375" cy="116" r="1.6" fill="#DF2531" />
        <circle cx="454" cy="135" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="454" cy="135" r="1.6" fill="#DF2531" />
      </g>

      {/* ── PAIR 3: MID-LOWER LEGS (Connects to Mobile Dev & SEO Services) ── */}
      <g
        id="leg-pair-3"
        className={`spider-leg ${activeNode === 'mobile' || activeNode === 'seo' ? 'active-leg' : ''}`}
      >
        {/* Leg 3 Left */}
        <path
          d="M 216 186 C 172 192 132 212 106 238 L 113 244 C 137 218 175 200 220 178 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 106 238 L 68 270 L 73 276 L 113 244 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 68 270 L 42 284 L 45 289 L 73 276 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="109" cy="241" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="109" cy="241" r="1.6" fill="#DF2531" />
        <circle cx="43" cy="286" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="43" cy="286" r="1.6" fill="#DF2531" />

        {/* Leg 3 Right */}
        <path
          d="M 284 186 C 328 192 368 212 394 238 L 387 244 C 363 218 325 200 280 178 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 394 238 L 432 270 L 427 276 L 387 244 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 432 270 L 458 284 L 455 289 L 427 276 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="391" cy="241" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="391" cy="241" r="1.6" fill="#DF2531" />
        <circle cx="457" cy="286" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="457" cy="286" r="1.6" fill="#DF2531" />
      </g>

      {/* ── PAIR 4: BACK LOWER LEGS (Connects to Digital Marketing & Cloud Solutions) ── */}
      <g
        id="leg-pair-4"
        className={`spider-leg ${activeNode === 'marketing' || activeNode === 'cloud' ? 'active-leg' : ''}`}
      >
        {/* Leg 4 Left */}
        <path
          d="M 220 226 C 182 258 152 304 132 344 L 140 348 C 158 310 188 266 226 236 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 132 344 L 102 395 L 108 399 L 140 348 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 102 395 L 76 422 L 80 426 L 108 399 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="136" cy="346" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="136" cy="346" r="1.6" fill="#DF2531" />
        <circle cx="78" cy="424" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="78" cy="424" r="1.6" fill="#DF2531" />

        {/* Leg 4 Right */}
        <path
          d="M 280 226 C 318 258 348 304 368 344 L 360 348 C 342 310 312 266 274 236 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 368 344 L 398 395 L 392 399 L 360 348 Z"
          fill="url(#chromePlate)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <path
          d="M 398 395 L 424 422 L 420 426 L 392 399 Z"
          fill="url(#chromePlateAlt)"
          stroke="url(#crimsonBevel)"
          strokeWidth="1.2"
        />
        <circle cx="364" cy="346" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="364" cy="346" r="1.6" fill="#DF2531" />
        <circle cx="422" cy="424" r="3" fill="#FFFFFF" filter="url(#legGlow)" />
        <circle cx="422" cy="424" r="1.6" fill="#DF2531" />
      </g>
    </svg>
  );
};
