import React from 'react';

interface MuscleGroupIconProps {
  muscleId: string;
  isSelected?: boolean;
  className?: string;
  size?: number;
}

export default function MuscleGroupIcon({
  muscleId,
  isSelected = false,
  className = '',
  size = 32
}: MuscleGroupIconProps) {
  const activeColor = isSelected ? '#5ba83c' : '#7cb342';
  const neutralBodyColor = isSelected ? '#7a8c79' : '#a2aaa1';

  // Base athletic mannequin silhouette
  // We highlight specific muscle segments in sage green
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-all duration-200 ${className}`}
    >
      {/* Universal Head & Neck */}
      <circle cx="24" cy="7" r="4.5" stroke={neutralBodyColor} strokeWidth="1.5" />
      <path d="M22 11.5V14M26 11.5V14" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />

      {/* RENDER ANATOMICAL SILHOUETTE WITH DEDICATED HIGHLIGHT REGION */}
      {muscleId === 'chest' && (
        <>
          {/* Body wireframe */}
          <path d="M16 14L11 20L9 28M32 14L37 20L39 28" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 32L17 44M29 32L31 44" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 26L18 32H30L29 26" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* CHEST HIGHLIGHT (Pectorals) */}
          <path 
            d="M17 15C19 15 23 16 23 21C20 22 17 21 16 18C15.5 16.5 16 15 17 15Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M31 15C29 15 25 16 25 21C28 22 31 21 32 18C32.5 16.5 32 15 31 15Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'shoulders' && (
        <>
          <path d="M17 19L11 26L9 32M31 19L37 26L39 32" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 20C19 25 21 32 21 32H27C27 32 29 25 29 20" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M20 32L18 44M28 32L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* SHOULDERS HIGHLIGHT (Deltoid Caps) */}
          <path 
            d="M18 14C15 14 13 16 13 19C13 22 15 23 17 22C18 20 18.5 17 18 14Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M30 14C33 14 35 16 35 19C35 22 33 23 31 22C30 20 29.5 17 30 14Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'biceps' && (
        <>
          <path d="M17 14H31M21 14V32M27 14V32M20 32H28" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M10 29L8 35M38 29L40 35" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M21 32L19 44M27 32L29 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* BICEPS HIGHLIGHT (Upper Arm Anterior) */}
          <path 
            d="M14 18C12 19 11 23 12 26C14 27 16 25 15 21C15 19 14.5 18 14 18Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M34 18C36 19 37 23 36 26C34 27 32 25 33 21C33 19 33.5 18 34 18Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'triceps' && (
        <>
          <path d="M18 14H30M22 14V32M26 14V32M21 32H27" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M10 29L8 35M38 29L40 35" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M21 32L19 44M27 32L29 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* TRICEPS HIGHLIGHT (Posterior Horseshoe) */}
          <path 
            d="M13 18C11 20 11 24 13 27C14.5 26 15 22 14.5 19C14 18 13.5 18 13 18Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M35 18C37 20 37 24 35 27C33.5 26 33 22 33.5 19C34 18 34.5 18 35 18Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'forearms' && (
        <>
          <path d="M17 14H31M15 17L13 25M33 17L35 25M21 14V32M27 14V32" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M21 32L19 44M27 32L29 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* FOREARMS HIGHLIGHT */}
          <path 
            d="M12 25C10 26 9 31 10 35C12 35 13 32 13 28C13 26 12.5 25 12 25Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M36 25C38 26 39 31 38 35C36 35 35 32 35 28C35 26 35.5 25 36 25Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'abs' && (
        <>
          <path d="M16 14L12 24L10 32M32 14L36 24L38 32" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17 14C19 14 29 14 31 14C31 20 29 32 28 32H20C19 32 17 20 17 14Z" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M20 32L18 44M28 32L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* ABS 6-PACK HIGHLIGHT */}
          <rect x="21" y="20" width="2.8" height="3" rx="0.8" fill={activeColor} />
          <rect x="24.2" y="20" width="2.8" height="3" rx="0.8" fill={activeColor} />
          <rect x="21" y="23.8" width="2.8" height="3" rx="0.8" fill={activeColor} />
          <rect x="24.2" y="23.8" width="2.8" height="3" rx="0.8" fill={activeColor} />
          <rect x="21" y="27.6" width="2.8" height="3" rx="0.8" fill={activeColor} />
          <rect x="24.2" y="27.6" width="2.8" height="3" rx="0.8" fill={activeColor} />
        </>
      )}

      {muscleId === 'obliques' && (
        <>
          <path d="M16 14L12 24L10 32M32 14L36 24L38 32" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20 15V32M28 15V32" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M20 32L18 44M28 32L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* OBLIQUES HIGHLIGHT */}
          <path d="M18 21C16 23 16 28 18 31L19 30C18 27 18 23 19 21H18Z" fill={activeColor} stroke={activeColor} strokeWidth="1" />
          <path d="M30 21C32 23 32 28 30 31L29 30C30 27 30 23 29 21H30Z" fill={activeColor} stroke={activeColor} strokeWidth="1" />
        </>
      )}

      {muscleId === 'upper_back' && (
        <>
          <path d="M16 14L12 24L10 32M32 14L36 24L38 32" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 27L18 33H30L29 27" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M20 33L18 44M28 33L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* TRAPEZIUS / UPPER BACK HIGHLIGHT */}
          <polygon points="24,14 17,17 20,24 24,26 28,24 31,17" fill={activeColor} stroke={activeColor} strokeWidth="1.2" />
        </>
      )}

      {muscleId === 'lats' && (
        <>
          <path d="M16 14L12 24L10 32M32 14L36 24L38 32" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 14V32" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M20 32L18 44M28 32L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* LATS HIGHLIGHT (V-Wings) */}
          <path d="M17 19C15 21 16 26 19 28C19 24 18 21 17 19Z" fill={activeColor} stroke={activeColor} strokeWidth="1.2" />
          <path d="M31 19C33 21 32 26 29 28C29 24 30 21 31 19Z" fill={activeColor} stroke={activeColor} strokeWidth="1.2" />
        </>
      )}

      {muscleId === 'lower_back' && (
        <>
          <path d="M16 14L12 24L10 32M32 14L36 24L38 32" stroke={neutralBodyColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 14H30" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M20 33L18 44M28 33L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* LOWER BACK HIGHLIGHT (Erector Spinae) */}
          <rect x="21" y="24" width="2.5" height="8" rx="1" fill={activeColor} stroke={activeColor} strokeWidth="1" />
          <rect x="24.5" y="24" width="2.5" height="8" rx="1" fill={activeColor} stroke={activeColor} strokeWidth="1" />
        </>
      )}

      {muscleId === 'glutes' && (
        <>
          <path d="M18 14H30V30H18V14Z" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M16 14L12 24M32 14L36 24" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M19 36L18 44M29 36L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* GLUTES HIGHLIGHT (Posterior Pelvis) */}
          <path 
            d="M18 28C18 33 22 35 24 35C24 30 23 28 18 28Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M30 28C30 33 26 35 24 35C24 30 25 28 30 28Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'quadriceps' && (
        <>
          <path d="M18 14H30V29H18V14Z" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M16 14L12 24M32 14L36 24" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M19 39L18 44M29 39L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* QUADS HIGHLIGHT (Front Thighs) */}
          <path 
            d="M17 30C16 33 17 38 19 40C21 40 22 36 22 30H17Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M31 30C32 33 31 38 29 40C27 40 26 36 26 30H31Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'hamstrings' && (
        <>
          <path d="M18 14H30V29H18V14Z" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M16 14L12 24M32 14L36 24" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M19 39L18 44M29 39L30 44" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* HAMSTRINGS HIGHLIGHT (Posterior Thighs) */}
          <path 
            d="M17.5 30C16.5 33 17 37 19 39C20.5 39 21.5 35 21.5 30H17.5Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M30.5 30C31.5 33 31 37 29 39C27.5 39 26.5 35 26.5 30H30.5Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}

      {muscleId === 'calves' && (
        <>
          <path d="M18 14H30V29H18V14Z" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M16 14L12 24M32 14L36 24" stroke={neutralBodyColor} strokeWidth="1.5" />
          <path d="M18 29L19 38M30 29L29 38" stroke={neutralBodyColor} strokeWidth="1.5" />
          {/* CALVES HIGHLIGHT (Lower Legs) */}
          <path 
            d="M18 38C17 39 16.5 42 17.5 44C19 44 20 42 19.5 38H18Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
          <path 
            d="M30 38C31 39 31.5 42 30.5 44C29 44 28 42 28.5 38H30Z" 
            fill={activeColor} 
            stroke={activeColor} 
            strokeWidth="1.2" 
          />
        </>
      )}
    </svg>
  );
}
