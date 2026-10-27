import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCw, Activity, Layers } from 'lucide-react';
import { getExerciseMediaGuide, ExerciseMediaGuide } from '../../utils/foodImageDatabase';

interface ExerciseDemonstrationProps {
  exerciseName: string;
  exerciseId?: string;
  className?: string;
  mode?: 'compact' | 'expanded' | 'card';
  autoAnimateOnHover?: boolean;
  hideBadge?: boolean;
}

export default function ExerciseDemonstration({
  exerciseName,
  exerciseId,
  className = '',
  mode = 'compact',
  autoAnimateOnHover = true,
  hideBadge = false
}: ExerciseDemonstrationProps) {
  const guide: ExerciseMediaGuide = getExerciseMediaGuide(exerciseId || exerciseName);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Auto-motion loop when playing or hovered (if card mode)
  useEffect(() => {
    let interval: any = null;
    if (isPlaying || (autoAnimateOnHover && isHovered && mode === 'card')) {
      interval = setInterval(() => {
        setActiveFrameIndex((prev) => (prev === 0 ? 1 : 0));
      }, 900);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isHovered, autoAnimateOnHover, mode]);

  const currentFrameUrl = guide.allFrames[activeFrameIndex] || guide.startFrame;

  // COMPACT CARD VIEW (used in exercise lists, cards, and daily workout tracker)
  if (mode === 'card' || mode === 'compact') {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveFrameIndex(0);
        }}
        className={`relative overflow-hidden rounded-2xl bg-[#192418]/5 dark:bg-[#1C211D] border border-[#dce5db] dark:border-[#384338] shrink-0 group ${className}`}
      >
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#e8ede6]/50 dark:bg-[#272E29]/50 animate-pulse flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#5ba83c]/40" />
          </div>
        )}

        <img
          src={currentFrameUrl}
          alt={`${exerciseName} demonstration`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Frame position pill indicator */}
        {!hideBadge && (
          <div className="absolute bottom-1.5 right-1.5 z-10">
            <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-xs text-white border border-white/20">
              {activeFrameIndex === 0 ? 'Start' : 'Peak'}
            </span>
          </div>
        )}

        {/* Subtle motion hint indicator */}
        {!hideBadge && (
          <div className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="p-1 rounded-md bg-black/60 text-white flex items-center gap-0.5 text-[8px] font-bold">
              <RotateCw className="w-2.5 h-2.5 text-[#8BAF78] animate-spin" />
            </span>
          </div>
        )}
      </div>
    );
  }

  // EXPANDED VIEW (used inside Exercise Detail Modals)
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main High-Res Demonstration View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#101712] border border-[#dce5db] dark:border-[#384338] shadow-sm group">
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#192418]/20 animate-pulse flex items-center justify-center">
            <Activity className="w-8 h-8 text-[#5ba83c]/40" />
          </div>
        )}

        <img
          src={currentFrameUrl}
          alt={`${exerciseName} demonstration`}
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-contain sm:object-cover transition-all duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Overlay Controls Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
          {/* Frame Switcher Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveFrameIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeFrameIndex === 0 && !isPlaying
                  ? 'bg-[#5ba83c] text-white shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              1. Setup
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveFrameIndex(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeFrameIndex === 1 && !isPlaying
                  ? 'bg-[#5ba83c] text-white shadow-xs'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              2. Peak Contraction
            </button>
          </div>

          {/* Auto-Play Movement Demo Loop */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-rose-500 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Motion</span>
              </>
            )}
          </button>
        </div>

        {/* Real photo verified badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#8BAF78] border border-white/15 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#5ba83c]" />
            Real Movement Guide
          </span>
        </div>
      </div>
    </div>
  );
}
