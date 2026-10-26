import React from 'react';
import { ChevronRight, Clock, Repeat, Layers } from 'lucide-react';
import { AnatomyExercise } from '../data/workoutAnatomyData';

interface AnatomyExerciseCardProps {
  exercise: AnatomyExercise;
  onOpenDetails: (exercise: AnatomyExercise) => void;
  onQuickAdd: (exercise: AnatomyExercise) => void;
}

export default function AnatomyExerciseCard({
  exercise,
  onOpenDetails,
  onQuickAdd
}: AnatomyExerciseCardProps) {
  // Generate stylized svg preview based on exercise demo graphic key
  const renderExerciseGraphic = (type: string) => {
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f0f4ef] dark:bg-[#1f2621] border border-[#dce5db] dark:border-[#384338] flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs group-hover:scale-[1.02] transition-transform">
        {/* Subtle athletic silhouette graphic */}
        <svg className="w-12 h-12 text-[#465a44] dark:text-[#8BAF78]" viewBox="0 0 64 64" fill="none">
          {/* Athlete bench / equipment */}
          {type === 'bench_press' && (
            <>
              {/* Bench */}
              <rect x="12" y="38" width="40" height="4" rx="2" fill="currentColor" fillOpacity="0.3" />
              <rect x="18" y="42" width="4" height="12" fill="currentColor" fillOpacity="0.3" />
              <rect x="42" y="42" width="4" height="12" fill="currentColor" fillOpacity="0.3" />
              {/* Torso lying down */}
              <rect x="22" y="32" width="20" height="7" rx="3" fill="currentColor" />
              {/* Head */}
              <circle cx="17" cy="35" r="4" fill="currentColor" />
              {/* Arms extended pressing */}
              <path d="M26 33L31 20M36 33L31 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Barbell & Plates */}
              <line x1="16" y1="20" x2="48" y2="20" stroke="currentColor" strokeWidth="2.5" />
              <rect x="14" y="14" width="4" height="12" rx="1.5" fill="currentColor" />
              <rect x="46" y="14" width="4" height="12" rx="1.5" fill="currentColor" />
            </>
          )}

          {type === 'db_press' && (
            <>
              {/* Bench */}
              <rect x="14" y="38" width="36" height="4" rx="2" fill="currentColor" fillOpacity="0.3" />
              {/* Athlete */}
              <circle cx="18" cy="35" r="4" fill="currentColor" />
              <rect x="22" y="32" width="20" height="7" rx="3" fill="currentColor" />
              {/* Two dumbbells */}
              <rect x="24" y="18" width="6" height="3" rx="1" fill="currentColor" />
              <rect x="36" y="18" width="6" height="3" rx="1" fill="currentColor" />
              <line x1="26" y1="33" x2="27" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="36" y1="33" x2="38" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {type === 'incline_press' && (
            <>
              {/* Incline bench */}
              <line x1="12" y1="46" x2="42" y2="26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.3" />
              {/* Torso on incline */}
              <line x1="18" y1="42" x2="36" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <circle cx="39" cy="27" r="4" fill="currentColor" />
              {/* Press upward */}
              <line x1="28" y1="34" x2="34" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="31" y="14" width="7" height="3" rx="1" fill="currentColor" />
            </>
          )}

          {type === 'push_up' && (
            <>
              {/* Floor line */}
              <line x1="8" y1="48" x2="56" y2="48" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
              {/* Planking body */}
              <line x1="14" y1="44" x2="44" y2="34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <circle cx="48" cy="32" r="4" fill="currentColor" />
              {/* Arms down to floor */}
              <path d="M42 36L44 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {type === 'cable_fly' && (
            <>
              {/* Standing athlete */}
              <circle cx="32" cy="18" r="4" fill="currentColor" />
              <line x1="32" y1="22" x2="32" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path d="M30 40L26 54M34 40L38 54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              {/* Wide hug fly arms with cable lines */}
              <path d="M12 28Q32 30 52 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="28" r="2.5" fill="currentColor" />
              <circle cx="52" cy="28" r="2.5" fill="currentColor" />
            </>
          )}

          {/* Generic default dumbbell/barbell graphic */}
          {![
            'bench_press',
            'db_press',
            'incline_press',
            'push_up',
            'cable_fly'
          ].includes(type) && (
            <>
              <circle cx="32" cy="18" r="5" fill="currentColor" />
              <path d="M32 23V42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path d="M22 28L32 24L42 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M29 42L25 56M35 42L39 56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div 
      onClick={() => onOpenDetails(exercise)}
      className="group w-full bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] hover:border-[#cbd7c8] dark:hover:border-[#536153] rounded-3xl p-3.5 sm:p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex items-center justify-between gap-3 relative"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Demonstration Media Thumbnail */}
        {renderExerciseGraphic(exercise.demoGraphic)}

        {/* Text Information */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#192418] dark:text-[#E8EDE7] truncate group-hover:text-[#3b7e23] dark:group-hover:text-[#8BAF78] transition-colors">
            {exercise.name}
          </h4>

          {/* Muscle Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {exercise.targetMuscles.map((muscle, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#edf5eb] dark:bg-[#223023] text-[#446b38] dark:text-[#8BAF78] text-[10px] font-bold tracking-wide"
              >
                {muscle}
              </span>
            ))}
          </div>

          {/* Sets, Reps & Rest Metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6d7e6c] dark:text-[#A2AAA1] font-medium mt-1.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#8BAF78]" />
              {exercise.sets}
            </span>
            <span className="flex items-center gap-1">
              <Repeat className="w-3 h-3 text-[#8BAF78]" />
              {exercise.reps}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#8BAF78]" />
              {exercise.restText}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="mt-2">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide ${
                exercise.difficulty === 'Beginner'
                  ? 'bg-[#eef8eb] text-[#448b30] border border-[#d6ebd0]'
                  : exercise.difficulty === 'Intermediate'
                  ? 'bg-[#edf5eb] text-[#558641] border border-[#d2e4cb]'
                  : 'bg-[#fff5eb] text-[#b36214] border border-[#fde2cb]'
              }`}
            >
              {exercise.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Chevron */}
      <div className="shrink-0 pl-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(exercise);
          }}
          className="w-8 h-8 rounded-full bg-[#f6f8f5] dark:bg-[#1C211D] group-hover:bg-[#eef7eb] dark:group-hover:bg-[#2d3a2e] border border-[#e8ede6] dark:border-[#394139] flex items-center justify-center text-[#6d7e6c] group-hover:text-[#192418] dark:group-hover:text-[#E8EDE7] transition-colors"
          title="View Exercise Guide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
