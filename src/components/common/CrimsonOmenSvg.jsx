import React from 'react';

export function CrimsonOmenDefs() {
  return (
    <svg className="hidden" xmlns="http://www.w3.org/2000/svg">
      <symbol id="crimson-omen" viewBox="0 0 200 200">
        <g className="origin-center">
          <path fill="#e11d48" d="M90,4 L110,4 L115,22 L129,26 L142,12 L159,22 L153,40 L164,51 L182,45 L192,62 L178,75 L182,89 L200,94 L200,114 L182,119 L178,133 L192,146 L182,163 L164,157 L153,168 L159,186 L142,196 L129,182 L115,186 L110,200 L90,200 L85,182 L71,178 L58,192 L41,182 L47,164 L36,153 L18,159 L8,142 L22,129 L18,115 L0,110 L0,90 L18,85 L22,71 L8,58 L18,41 L36,47 L47,36 L41,18 L58,8 L71,22 L85,18 Z" />
          <circle cx="100" cy="100" r="68" fill="#09090b" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#e11d48" strokeWidth="7" />
        </g>
        <path fill="#e11d48" d="M98,44 C66,44 50,67 52,98 C53,112 60,122 67,128 L64,152 C64,160 75,168 98,168 C121,168 132,160 132,152 L129,128 C136,122 143,112 144,98 C146,67 130,44 98,44 Z" />
        <polygon points="65,94 89,89 92,107 68,110" fill="#09090b" rx="4" />
        <polygon points="131,94 107,89 104,107 128,110" fill="#09090b" rx="4" />
        <polygon points="96,108 90,127 96,127" fill="#09090b" />
        <polygon points="100,108 106,127 100,127" fill="#09090b" />
        <rect x="73" y="135" width="5" height="20" rx="2" fill="#09090b" transform="rotate(-8 73 135)" />
        <rect x="83" y="136" width="6" height="25" rx="2" fill="#09090b" transform="rotate(-4 83 136)" />
        <rect x="95" y="137" width="6" height="26" rx="2" fill="#09090b" />
        <rect x="107" y="136" width="6" height="25" rx="2" fill="#09090b" transform="rotate(4 107 136)" />
        <rect x="118" y="135" width="5" height="19" rx="2" fill="#09090b" transform="rotate(8 118 135)" />
      </symbol>
    </svg>
  );
}

export function CrimsonOmen({ className = 'w-8 h-8 gear-spin' }) {
  return (
    <svg className={className}>
      <use href="#crimson-omen" />
    </svg>
  );
}

export default CrimsonOmen;
