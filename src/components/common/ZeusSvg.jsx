import React from 'react';

/**
 * Olympian Aegis Shield & Divine Thunderbolt Vector Symbols
 * Apple & Claude aesthetic design for ZEUS GYM
 */
export function ZeusDefs() {
  return (
    <svg className="hidden" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        {/* Gradient for Celestial Shield */}
        <linearGradient id="zeus-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#070b14" />
        </linearGradient>

        {/* Gradient for Divine Golden Lightning Bolt */}
        <linearGradient id="zeus-lightning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Outer Celestial Aura Glow */}
        <filter id="zeus-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Intense Lightning Spark Glow */}
        <filter id="zeus-bolt-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 2 -0.1
          " result="bright" />
          <feComposite in="SourceGraphic" in2="bright" operator="over" />
        </filter>

        {/* Olympian Aegis Emblem (Master Symbol) */}
        <symbol id="zeus-emblem" viewBox="0 0 200 200">
          {/* Subtle Outer Halo Ring */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2" strokeDasharray="4 8" />
          
          {/* Olympian Aegis Shield Body */}
          <path
            d="M100 14 L174 46 C174 116, 144 164, 100 188 C56 164, 26 116, 26 46 Z"
            fill="url(#zeus-shield-grad)"
            stroke="#38bdf8"
            strokeWidth="3.5"
            filter="url(#zeus-glow)"
          />

          {/* Inner Sacred Border */}
          <path
            d="M100 24 L164 52 C164 112, 138 154, 100 176 C62 154, 36 112, 36 52 Z"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />

          {/* Inner Laurel Geometric Accents */}
          <circle cx="100" cy="102" r="54" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1.5" strokeDasharray="5 5" />

          {/* Divine Thunderbolt (Rayo Olímpico de Zeus) */}
          <path
            d="M108 30 L64 102 L98 102 L86 170 L140 92 L104 92 Z"
            fill="url(#zeus-lightning-grad)"
            stroke="#fef08a"
            strokeWidth="2.2"
            strokeLinejoin="round"
            filter="url(#zeus-bolt-glow)"
          />
        </symbol>

        {/* Standalone Divine Lightning Bolt Symbol */}
        <symbol id="zeus-bolt" viewBox="0 0 100 100">
          <path
            d="M56 6 L20 54 L48 54 L38 94 L82 44 L52 44 Z"
            fill="url(#zeus-lightning-grad)"
            stroke="#fef08a"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#zeus-bolt-glow)"
          />
        </symbol>

        {/* Backwards compatibility alias for crimson-omen symbol */}
        <symbol id="crimson-omen" viewBox="0 0 200 200">
          <use href="#zeus-emblem" />
        </symbol>
      </defs>
    </svg>
  );
}

/**
 * Zeus Emblem Component (Aegis Shield with Thunderbolt)
 */
export function ZeusEmblem({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} aria-label="Emblema de Zeus">
      <use href="#zeus-emblem" />
    </svg>
  );
}

/**
 * Zeus Lightning Bolt Component
 */
export function ZeusBolt({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} aria-label="Rayo de Zeus">
      <use href="#zeus-bolt" />
    </svg>
  );
}

export default ZeusEmblem;
