import React, { useId } from 'react';
import { Link } from 'react-router-dom';

export interface NutriCoachSymbolProps {
  className?: string;
  theme?: 'auto' | 'light' | 'dark';
}

/**
 * Geometric, folded-leaf letter "N" symbol with dark forest green and sage green facets,
 * exactly matching the official brand identity sheet.
 * Supports auto light/dark mode adaptation or explicit theme overrides.
 */
export function NutriCoachSymbol({ className = 'w-8 h-8', theme = 'auto' }: NutriCoachSymbolProps) {
  const uniqueId = useId().replace(/:/g, '');
  const lightGradId = `nc-sym-grad-light-${uniqueId}`;
  const darkGradId = `nc-sym-grad-dark-${uniqueId}`;

  const isExplicitLight = theme === 'light';
  const isExplicitDark = theme === 'dark';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="NutriCoach AI Logo Symbol"
      role="img"
    >
      <defs>
        {/* Light Mode Diagonal Ribbon Gradient */}
        <linearGradient id={lightGradId} x1="0.1" y1="0.1" x2="0.85" y2="0.85">
          <stop offset="0%" stopColor="#1B3824" />
          <stop offset="50%" stopColor="#3A633F" />
          <stop offset="100%" stopColor="#6F9662" />
        </linearGradient>

        {/* Dark Mode Diagonal Ribbon Gradient */}
        <linearGradient id={darkGradId} x1="0.1" y1="0.1" x2="0.85" y2="0.85">
          <stop offset="0%" stopColor="#4B7243" />
          <stop offset="60%" stopColor="#68915C" />
          <stop offset="100%" stopColor="#8DB37F" />
        </linearGradient>
      </defs>

      {/* 1. Left Upright / Petal Contour */}
      <path
        d="M 18,88 C 10,64 11,36 22,20 C 27,12 36,10 44,14 L 44,28 C 36,34 30,50 30,72 C 28,82 24,88 18,88 Z"
        className={
          isExplicitDark
            ? 'fill-[#DFECE0]'
            : isExplicitLight
            ? 'fill-[#162D1E]'
            : 'fill-[#162D1E] dark:fill-[#DFECE0] transition-colors duration-200'
        }
      />

      {/* 2. Right Upright Leaf with Graceful Pointed Tip */}
      <path
        d="M 64,88 C 65,66 68,44 88,14 C 92,38 90,64 78,84 C 74,88 68,89 64,88 Z"
        className={
          isExplicitDark
            ? 'fill-[#8EAF7F]'
            : isExplicitLight
            ? 'fill-[#789C6A]'
            : 'fill-[#789C6A] dark:fill-[#8EAF7F] transition-colors duration-200'
        }
      />

      {/* 3. Center Diagonal Overlapping Ribbon Fold */}
      {isExplicitDark ? (
        <path
          d="M 22,22 L 44,14 L 78,84 L 64,88 Z"
          fill={`url(#${darkGradId})`}
          opacity="0.92"
        />
      ) : isExplicitLight ? (
        <path
          d="M 22,22 L 44,14 L 78,84 L 64,88 Z"
          fill={`url(#${lightGradId})`}
          opacity="0.96"
        />
      ) : (
        <>
          {/* Light Mode path */}
          <path
            d="M 22,22 L 44,14 L 78,84 L 64,88 Z"
            fill={`url(#${lightGradId})`}
            opacity="0.96"
            className="dark:hidden"
          />
          {/* Dark Mode path */}
          <path
            d="M 22,22 L 44,14 L 78,84 L 64,88 Z"
            fill={`url(#${darkGradId})`}
            opacity="0.92"
            className="hidden dark:block"
          />
        </>
      )}
    </svg>
  );
}

export interface NutriCoachLogoProps {
  variant?: 'horizontal' | 'vertical' | 'symbol-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  theme?: 'auto' | 'light' | 'dark';
  to?: string;
  onClick?: () => void;
  className?: string;
  symbolClassName?: string;
}

/**
 * Official NutriCoach AI Brand Logo Component.
 * Implements the geometric folded-leaf "N" symbol, clean sans-serif typography,
 * dark forest green brand text, fresh sage green AI accent, and adaptive Dark Mode.
 */
export default function NutriCoachLogo({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  theme = 'auto',
  to,
  onClick,
  className = '',
  symbolClassName = '',
}: NutriCoachLogoProps) {
  // Sizing matrix for responsive balance
  const sizeConfig = {
    xs: {
      symbol: 'w-6 h-6',
      title: 'text-sm font-extrabold',
      tagline: 'text-[10px]',
      gap: 'gap-2',
    },
    sm: {
      symbol: 'w-8 h-8',
      title: 'text-base font-extrabold',
      tagline: 'text-[10px]',
      gap: 'gap-2.5',
    },
    md: {
      symbol: 'w-9 h-9',
      title: 'text-xl font-extrabold',
      tagline: 'text-[11px]',
      gap: 'gap-3',
    },
    lg: {
      symbol: 'w-11 h-11',
      title: 'text-2xl font-extrabold',
      tagline: 'text-xs',
      gap: 'gap-3.5',
    },
    xl: {
      symbol: 'w-14 h-14',
      title: 'text-3xl font-black',
      tagline: 'text-sm',
      gap: 'gap-4',
    },
  }[size];

  const isExplicitLight = theme === 'light';
  const isExplicitDark = theme === 'dark';

  // Typography color classes
  const brandTextColor = isExplicitDark
    ? 'text-[#FFFFFF]'
    : isExplicitLight
    ? 'text-[#172B1D]'
    : 'text-[#172B1D] dark:text-[#FFFFFF] transition-colors duration-200';

  const aiTextColor = isExplicitDark
    ? 'text-[#8BAF78]'
    : isExplicitLight
    ? 'text-[#6E9460]'
    : 'text-[#6E9460] dark:text-[#8BAF78] transition-colors duration-200';

  const taglineColor = isExplicitDark
    ? 'text-[#A2AAA1]'
    : isExplicitLight
    ? 'text-[#7a8c79]'
    : 'text-[#7a8c79] dark:text-[#A2AAA1] transition-colors duration-200';

  // If symbol-only variant is selected
  if (variant === 'symbol-only') {
    const symbolElement = (
      <NutriCoachSymbol
        className={`${symbolClassName || sizeConfig.symbol} ${className}`}
        theme={theme}
      />
    );

    if (to) {
      return (
        <Link to={to} onClick={onClick} className="inline-flex items-center group cursor-pointer">
          {symbolElement}
        </Link>
      );
    }

    if (onClick) {
      return (
        <button type="button" onClick={onClick} className="inline-flex items-center group cursor-pointer bg-transparent border-0 p-0">
          {symbolElement}
        </button>
      );
    }

    return symbolElement;
  }

  const isVertical = variant === 'vertical';

  const content = (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center' : 'items-center text-left'
      } ${sizeConfig.gap} select-none group ${className}`}
    >
      <NutriCoachSymbol
        className={`${symbolClassName || sizeConfig.symbol} group-hover:scale-105 transition-transform duration-200`}
        theme={theme}
      />
      <div>
        <span
          className={`font-heading tracking-tight block leading-tight ${sizeConfig.title} ${brandTextColor}`}
        >
          NutriCoach <span className={aiTextColor}>AI</span>
        </span>
        {showTagline && (
          <span className={`font-medium block mt-0.5 ${sizeConfig.tagline} ${taglineColor}`}>
            Better Food. Healthier You.
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-flex items-center cursor-pointer no-underline">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center cursor-pointer bg-transparent border-0 p-0 text-left"
      >
        {content}
      </button>
    );
  }

  return content;
}
