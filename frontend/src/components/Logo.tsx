import React, { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
  subtitle
}) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const gearGradId = `gearGrad_${uid}`;
  const mStemGradId = `mStemGrad_${uid}`;
  const mWingGradId = `mWingGrad_${uid}`;
  const logoShadowId = `logoShadow_${uid}`;

  const sizeMap = {
    sm: { icon: 34, title: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 44, title: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 56, title: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { icon: 84, title: 'text-3xl sm:text-4xl', sub: 'text-sm' },
    hero: { icon: 112, title: 'text-5xl', sub: 'text-base' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${showText ? 'gap-3' : ''} select-none ${className}`}>
      {/* Precision Engineered SVG Matching Reference Image */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="32 16 96 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}
        >
          <defs>
            {/* Gear Vibrant Cyan-to-Blue Gradient */}
            <linearGradient id={gearGradId} x1="20%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#4FC3FF" />
              <stop offset="50%" stopColor="#0094FF" />
              <stop offset="100%" stopColor="#0062D6" />
            </linearGradient>

            {/* M Letter Left Stem Ice-White Gradient */}
            <linearGradient id={mStemGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>

            {/* M Right Wing Vibrant Cyan Gradient */}
            <linearGradient id={mWingGradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>

            {/* Soft Ambient Shadow for 3D Depth */}
            <filter id={logoShadowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* 1. BACKGROUND GEAR WITH 6 VISIBLE PROTRUDING TEETH       */}
          {/* ======================================================== */}
          <g filter={`url(#${logoShadowId})`}>
            {/* Outer Gear Body with Trapezoidal Teeth */}
            <path
              d="
                M 72 20 
                L 86 20 L 88 32 
                L 98 35 L 107 26 L 117 36 L 109 46 
                L 112 55 L 123 58 L 122 72 L 111 74 
                L 109 83 L 118 92 L 108 102 L 99 94 
                L 89 97 L 87 108 L 73 108 L 71 97 
                L 61 94 L 52 102 L 42 92 L 51 83 
                L 48 74 L 37 72 L 37 58 L 48 55 
                L 51 46 L 42 36 L 52 26 L 61 35 
                L 71 32 Z
              "
              fill={`url(#${gearGradId})`}
            />

            {/* Central Dark Gear Bore Ring */}
            <circle cx="80" cy="64" r="28" fill="#0B1F3B" opacity="0.95" />
            <circle cx="80" cy="64" r="24" stroke="#007BFF" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* ======================================================== */}
          {/* 2. THE LETTER 'M' - CRISP GEOMETRIC FOREGROUND          */}
          {/* ======================================================== */}
          <g filter={`url(#${logoShadowId})`}>
            {/* Left Vertical Leg of 'M' */}
            <path
              d="M 54 44 L 72 44 L 72 108 L 54 108 Z"
              fill={`url(#${mStemGradId})`}
            />

            {/* Central Diagonal Chevron & Right Wing of 'M' */}
            <path
              d="
                M 72 44 
                L 88 80 
                L 124 38 
                L 125 64 
                L 98 94 
                L 84 94 
                L 72 68 
                Z
              "
              fill={`url(#${mWingGradId})`}
            />

            {/* Right Wing Top Aerodynamic Bevel Highlight */}
            <polygon
              points="124,38 125,64 116,56 116,46"
              fill="#FFFFFF"
              opacity="0.3"
            />
          </g>

          {/* ======================================================== */}
          {/* 3. PRECISION MECHANICAL / CALIPER LINKAGES UNDER WING    */}
          {/* ======================================================== */}
          {/* Upper Ray with Node */}
          <line
            x1="120"
            y1="68"
            x2="88"
            y2="108"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="88" cy="108" r="4.5" fill="#38BDF8" />

          {/* Lower Parallel Ray with Node */}
          <line
            x1="122"
            y1="82"
            x2="100"
            y2="110"
            stroke="#00A3FF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="110" r="4" fill="#00A3FF" />

          {/* Upper Connector Accent Node on Wing Tip */}
          <circle cx="120" cy="68" r="3" fill="#BAE6FD" />
        </svg>
      </div>

      {/* Typography Exactly as in Reference Image: Mech (White) Nova (Cyan) */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center tracking-tight">
            <span className={`font-black text-white ${dim.title}`}>
              Mech
            </span>
            <span className={`font-black text-[#00A3FF] ${dim.title}`}>
              Nova
            </span>
          </div>

          <span className={`text-slate-300 font-medium tracking-normal mt-1 ${dim.sub}`}>
            {subtitle || 'Intelligence for Every Machine'}
          </span>
        </div>
      )}
    </div>
  );
};
