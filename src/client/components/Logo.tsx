import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withGlow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  withGlow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {withGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-pitch-accent pointer-events-none"
          style={{ transform: 'scale(1.15)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 filter drop-shadow-md"
      >
        <defs>
          {/* Shield Outer Gold Gradient */}
          <linearGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7d070" />
            <stop offset="35%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#99771f" />
            <stop offset="100%" stopColor="#f3cf55" />
          </linearGradient>

          {/* Pitch Tactical Green Gradient */}
          <linearGradient id="pitchDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d2416" />
            <stop offset="50%" stopColor="#07140c" />
            <stop offset="100%" stopColor="#050a0f" />
          </linearGradient>

          {/* Emerald Accent Line */}
          <linearGradient id="emeraldLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0.4" />
          </linearGradient>

          {/* Ball Hexagon Gradient */}
          <linearGradient id="ballShine" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          <linearGradient id="leatherPatch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0a0f1d" />
          </linearGradient>
        </defs>

        {/* Outer Shield Path */}
        <path
          d="M50 4 
             C74 4, 88 15, 88 32 
             C88 64, 50 94, 50 94 
             C50 94, 12 64, 12 32 
             C12 15, 26 4, 50 4 Z"
          fill="url(#shieldGoldGrad)"
          stroke="#523e0a"
          strokeWidth="1"
        />

        {/* Inner Shield Body */}
        <path
          d="M50 8 
             C70 8, 83 18, 83 33 
             C83 61, 50 88, 50 88 
             C50 88, 17 61, 17 33 
             C17 18, 30 8, 50 8 Z"
          fill="url(#pitchDarkGrad)"
        />

        {/* Tactical Pitch Lines inside Shield */}
        {/* Halfway vertical axis */}
        <line x1="50" y1="12" x2="50" y2="84" stroke="url(#emeraldLineGrad)" strokeWidth="1.2" strokeDasharray="3 2" />
        {/* Tactical Penalty Box contour */}
        <path
          d="M32 16 L32 30 L68 30 L68 16"
          fill="none"
          stroke="url(#emeraldLineGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <circle cx="50" cy="48" r="16" fill="none" stroke="url(#emeraldLineGrad)" strokeWidth="1.2" strokeOpacity="0.6" />

        {/* Championship Laurel Wreath (Historical Heritage) */}
        {/* Left Branch */}
        <path
          d="M24 38 C21 44, 21 52, 25 58 C27 61, 30 65, 36 70"
          fill="none"
          stroke="url(#shieldGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M21 42 C18 43, 18 45, 22 47" fill="url(#shieldGoldGrad)" />
        <path d="M20 49 C17 51, 17 53, 21 55" fill="url(#shieldGoldGrad)" />
        <path d="M23 57 C20 60, 21 62, 26 63" fill="url(#shieldGoldGrad)" />
        <path d="M28 65 C26 68, 28 70, 33 69" fill="url(#shieldGoldGrad)" />

        {/* Right Branch */}
        <path
          d="M76 38 C79 44, 79 52, 75 58 C73 61, 70 65, 64 70"
          fill="none"
          stroke="url(#shieldGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M79 42 C82 43, 82 45, 78 47" fill="url(#shieldGoldGrad)" />
        <path d="M80 49 C83 51, 83 53, 79 55" fill="url(#shieldGoldGrad)" />
        <path d="M77 57 C80 60, 79 62, 74 63" fill="url(#shieldGoldGrad)" />
        <path d="M72 65 C74 68, 72 70, 67 69" fill="url(#shieldGoldGrad)" />

        {/* Center: Iconic Vintage/Modern Hybrid Football */}
        <g transform="translate(0, -1)">
          {/* Ball Base Outline */}
          <circle cx="50" cy="48" r="13" fill="url(#ballShine)" stroke="url(#shieldGoldGrad)" strokeWidth="1.5" />

          {/* Central Pentagonal Pattern */}
          <polygon
            points="50,42 56,46 54,53 46,53 44,46"
            fill="url(#leatherPatch)"
            stroke="#d4af37"
            strokeWidth="0.8"
          />

          {/* Connecting Stitching Lines */}
          <line x1="50" y1="42" x2="50" y2="35.5" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="56" y1="46" x2="62" y2="44" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="54" y1="53" x2="59" y2="58" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="46" y1="53" x2="41" y2="58" stroke="#1e293b" strokeWidth="1.2" />
          <line x1="44" y1="46" x2="38" y2="44" stroke="#1e293b" strokeWidth="1.2" />
        </g>

        {/* Top Trophy Star (Symbolizing World Cup Glory) */}
        <polygon
          points="50,11 52.2,16 57.5,16.5 53.5,20.2 54.8,25.5 50,22.8 45.2,25.5 46.5,20.2 42.5,16.5 47.8,16"
          fill="url(#shieldGoldGrad)"
          stroke="#fff"
          strokeWidth="0.4"
        />

        {/* Bottom Historic Year Banner: '1930 • 2026' */}
        <path
          d="M34 80 L50 86 L66 80 L63 76 L50 81 L37 76 Z"
          fill="url(#shieldGoldGrad)"
          stroke="#382806"
          strokeWidth="0.6"
        />
        <circle cx="50" cy="83.5" r="1.5" fill="#0f2416" />
      </svg>
    </div>
  );
};
