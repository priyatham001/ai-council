import React from 'react';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm p-1.5 ${iconSizes[size]}`}>
        {/* Modern Agricultural Leaf + Market Chart + Connection Network Node */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main stylized leaf contour */}
          <path
            d="M6 26C6 26 8 13 19 8C19 8 26 6 27 6C27 6 26 13 21 21C16 29 6 26 6 26Z"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Upward market growth trend line along the leaf vein */}
          <path
            d="M8 24L15 16L18 19L25 10"
            stroke="#bbf7d0"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead */}
          <path
            d="M21 10H25V14"
            stroke="#bbf7d0"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Digital connection nodes */}
          <circle cx="8" cy="24" r="2" fill="#4ade80" />
          <circle cx="15" cy="16" r="2" fill="#4ade80" />
          <circle cx="18" cy="19" r="2" fill="#4ade80" />
          <circle cx="25" cy="10" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <div className={`font-black tracking-tight text-gray-900 leading-tight ${textSizes[size]}`}>
            Agri<span className="text-emerald-700">Connect</span>
          </div>
          <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Marketplace
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-gray-700 hidden sm:block tracking-wide">
            Direct Farm-to-Buyer Linkage Platform
          </span>
        )}
      </div>
    </div>
  );
};
