import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Flat Dark Shield Base */}
        <path
          d="M50 6 C72 6, 86 16, 86 32 C86 60, 50 92, 50 92 C50 92, 14 60, 14 32 C14 16, 28 6, 50 6 Z"
          fill="#0d1117"
          stroke="#2ecc71"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Pitch Green Inner Shield */}
        <path
          d="M50 13 C67 13, 79 21, 79 33 C79 56, 50 83, 50 83 C50 83, 21 56, 21 33 C21 21, 33 13, 50 13 Z"
          fill="#143820"
        />

        {/* Flat Pitch Field Line Markings */}
        <line
          x1="26"
          y1="49"
          x2="74"
          y2="49"
          stroke="#2ecc71"
          strokeWidth="1.8"
          strokeOpacity="0.7"
        />
        <circle
          cx="50"
          cy="49"
          r="15"
          stroke="#2ecc71"
          strokeWidth="1.8"
          fill="none"
          strokeOpacity="0.7"
        />
        <circle cx="50" cy="49" r="2.5" fill="#2ecc71" />

        {/* Minimalist Geometric Football Pentagon */}
        <polygon
          points="50,38 59,45 56,56 44,56 41,45"
          fill="#0d1117"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Connecting Geometric Spokes */}
        <line x1="50" y1="38" x2="50" y2="29" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="59" y1="45" x2="67" y2="42" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="56" y1="56" x2="63" y2="64" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="44" y1="56" x2="37" y2="64" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="41" y1="45" x2="33" y2="42" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />

        {/* Flat Champion Star */}
        <polygon
          points="50,17 52.2,22.2 57.8,22.6 53.6,26.2 55,31.6 50,28.8 45,31.6 46.4,26.2 42.2,22.6 47.8,22.2"
          fill="#f3cf55"
        />
      </svg>
    </div>
  );
};
