import React from 'react';
import { X, Plus, AlertTriangle, CheckCircle2, Dumbbell, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { AnatomyExercise } from '../data/workoutAnatomyData';
import ExerciseDemonstration from './common/ExerciseDemonstration';

interface ExerciseDetailModalProps {
  exercise: AnatomyExercise | null;
  onClose: () => void;
  onAddToPlan: (exercise: AnatomyExercise) => void;
}

export default function ExerciseDetailModal({
  exercise,
  onClose,
  onAddToPlan
}: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e8ede6] dark:border-[#394139] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#eef7eb] dark:bg-[#223023] text-[#446b38] dark:text-[#8BAF78] border border-[#d6ebd0] dark:border-[#334634]">
                {exercise.primaryMuscle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#f6f8f5] dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] border border-[#e8ede6] dark:border-[#394139]">
                {exercise.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
              {exercise.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8e9f8e] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Instructional Movement Demonstration (Dual-Frame & Motion Guide) */}
        <ExerciseDemonstration
          exerciseName={exercise.name}
          exerciseId={exercise.id}
          mode="expanded"
        />

        {/* Prescription Quick Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-center">
          <div>
            <span className="text-[10px] font-bold text-[#7a8c79] uppercase block">Sets & Reps</span>
            <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">{exercise.sets} × {exercise.reps}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#7a8c79] uppercase block">Rest Interval</span>
            <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">{exercise.restText}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#7a8c79] uppercase block">Equipment</span>
            <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7] truncate block">{exercise.equipment}</span>
          </div>
        </div>

        {/* Step-by-Step Execution Guide */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#192418] dark:text-[#E8EDE7] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5ba83c]" />
            Execution Guide
          </h4>
          <ol className="space-y-2 text-xs text-[#4a5a4a] dark:text-[#C5CDC4] leading-relaxed list-decimal pl-4">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Form Cues */}
        {exercise.formTips.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#f0f6ee] dark:bg-[#202b21] border border-[#d8e8d5] dark:border-[#354836] space-y-1.5">
            <span className="text-xs font-bold text-[#34602c] dark:text-[#8BAF78] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5ba83c]" />
              Biomechanical Form Cues
            </span>
            <ul className="text-xs text-[#446b38] dark:text-[#C5CDC4] space-y-1 pl-4 list-disc">
              {exercise.formTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mistakes to Avoid */}
        {exercise.avoidMistakes.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-[#2c271e] border border-amber-200/60 dark:border-[#4d4029] space-y-1.5">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Common Mistakes to Avoid
            </span>
            <ul className="text-xs text-amber-900/80 dark:text-amber-300 space-y-1 pl-4 list-disc">
              {exercise.avoidMistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddToPlan(exercise);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#2e4c34] hover:bg-[#253f2a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Workout Plan</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] font-bold text-xs border border-[#e8ede6] dark:border-[#394139] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
