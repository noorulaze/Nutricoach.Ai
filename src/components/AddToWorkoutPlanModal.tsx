import React, { useState } from 'react';
import { X, Calendar, Plus, Clock, Check, Dumbbell } from 'lucide-react';
import { AnatomyExercise } from '../data/workoutAnatomyData';
import { getWorkoutPlan, saveWorkoutPlan } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import { WorkoutExercise } from '../types';

interface AddToWorkoutPlanModalProps {
  isOpen: boolean;
  exercise: AnatomyExercise | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddToWorkoutPlanModal({
  isOpen,
  exercise,
  onClose,
  onSuccess
}: AddToWorkoutPlanModalProps) {
  const { showToast } = useToast();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    // Default to today's day of the week (Mon = 0, Sun = 6)
    return (new Date().getDay() + 6) % 7;
  });

  const [setsCount, setSetsCount] = useState<number>(3);
  const [repsValue, setRepsValue] = useState<string>('8–12 reps');
  const [weightKg, setWeightKg] = useState<number | ''>(20);
  const [restSeconds, setRestSeconds] = useState<number>(75);

  if (!isOpen || !exercise) return null;

  const currentPlan = getWorkoutPlan();
  const targetDay = currentPlan.find((d) => d.dayIndex === selectedDayIndex) || currentPlan[0];

  const handleConfirmAdd = () => {
    const newWorkoutExercise: WorkoutExercise = {
      id: 'ex_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      exerciseId: exercise.id,
      name: exercise.name,
      targetMuscle: exercise.primaryMuscle,
      sets: setsCount,
      reps: repsValue,
      weightKg: typeof weightKg === 'number' ? weightKg : undefined,
      restSeconds: restSeconds,
      instructions: exercise.instructions[0] || 'Perform with controlled cadence and full range of motion.',
      completedSets: Array(setsCount).fill(false)
    };

    const updatedPlan = currentPlan.map((day) => {
      if (day.dayIndex === selectedDayIndex) {
        return {
          ...day,
          isRestDay: false, // Automatically convert rest day to active session
          exercises: [...day.exercises, newWorkoutExercise]
        };
      }
      return day;
    });

    saveWorkoutPlan(updatedPlan);
    showToast(`Added ${exercise.name} to ${targetDay.dayName} workout plan!`, 'success', 'Plan Updated');
    if (onSuccess) onSuccess();
    onClose();
  };

  const days = [
    { index: 0, label: 'Mon', full: 'Monday' },
    { index: 1, label: 'Tue', full: 'Tuesday' },
    { index: 2, label: 'Wed', full: 'Wednesday' },
    { index: 3, label: 'Thu', full: 'Thursday' },
    { index: 4, label: 'Fri', full: 'Friday' },
    { index: 5, label: 'Sat', full: 'Saturday' },
    { index: 6, label: 'Sun', full: 'Sunday' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e8ede6] dark:border-[#394139] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eef7eb] dark:bg-[#1f2920] text-[#5ba83c] dark:text-[#8BAF78] flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
                Add to Workout Plan
              </h3>
              <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium mt-0.5">
                {exercise.name} ({exercise.primaryMuscle})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8e9f8e] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Selector */}
        <div>
          <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#5ba83c]" />
            Select Scheduled Training Day
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => (
              <button
                key={d.index}
                type="button"
                onClick={() => setSelectedDayIndex(d.index)}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                  selectedDayIndex === d.index
                    ? 'bg-[#2b3a2a] text-white shadow-xs'
                    : 'bg-[#f6f8f5] dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#eef5ec] dark:hover:bg-[#2e372f] border border-[#e8ede6] dark:border-[#394139]'
                }`}
              >
                <span className="block text-[10px] uppercase font-semibold">{d.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#7a8c79] font-medium mt-1.5">
            Targeting: <strong className="text-[#192418] dark:text-[#E8EDE7]">{targetDay.dayName}</strong> ({targetDay.name})
          </p>
        </div>

        {/* Prescription Parameters */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Sets */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">
              Sets
            </label>
            <select
              value={setsCount}
              onChange={(e) => setSetsCount(Number(e.target.value))}
              className="w-full bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Sets
                </option>
              ))}
            </select>
          </div>

          {/* Reps */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">
              Rep Target
            </label>
            <input
              type="text"
              value={repsValue}
              onChange={(e) => setRepsValue(e.target.value)}
              placeholder="e.g. 8–12 reps"
              className="w-full bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
            />
          </div>

          {/* Starting Weight (kg) */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">
              Target Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Optional weight in kg"
              className="w-full bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
            />
          </div>

          {/* Rest Period */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">
              Rest Duration
            </label>
            <select
              value={restSeconds}
              onChange={(e) => setRestSeconds(Number(e.target.value))}
              className="w-full bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
            >
              <option value={45}>45 seconds</option>
              <option value={60}>60 seconds (1 min)</option>
              <option value={75}>75 seconds</option>
              <option value={90}>90 seconds (1.5 min)</option>
              <option value={120}>120 seconds (2 min)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#2e4c34] hover:bg-[#253f2a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Confirm & Add Exercise</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] font-bold text-xs border border-[#e8ede6] dark:border-[#394139] transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
