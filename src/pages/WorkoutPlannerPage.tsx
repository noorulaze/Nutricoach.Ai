import React, { useState } from 'react';
import { 
  Dumbbell, Calendar, Clock, Plus, Trash2, 
  CheckCircle2, RotateCcw, Sparkles, ChevronRight, X, 
  AlertCircle, ShieldCheck, Flame, Layers
} from 'lucide-react';
import { 
  getProfile, getWorkoutPlan, saveWorkoutPlan, 
  toggleExerciseSetCompletion, toggleDayWorkoutComplete 
} from '../utils/storage';
import { EXERCISE_LIBRARY } from '../data/nutritionAndExerciseData';
import { DayWorkout, WorkoutExercise, ExerciseDefinition } from '../types';
import { useToast } from '../context/ToastContext';

export default function WorkoutPlannerPage() {
  const { showToast } = useToast();
  const profile = getProfile();
  const [workouts, setWorkouts] = useState<DayWorkout[]>(() => getWorkoutPlan());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0); // Mon
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string>('All');

  const selectedDay = workouts.find((w) => w.dayIndex === selectedDayIndex) || workouts[0];

  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    const updated = toggleExerciseSetCompletion(selectedDay.dayIndex, exerciseId, setIndex);
    setWorkouts([...updated]);
    showToast('Exercise set updated', 'info');
  };

  const handleToggleDayComplete = () => {
    const updated = toggleDayWorkoutComplete(selectedDay.dayIndex);
    setWorkouts([...updated]);
    if (!selectedDay.completed) {
      showToast(`${selectedDay.name} marked complete! Outstanding effort.`, 'success', 'Session Complete');
    }
  };

  const handleToggleRestDay = () => {
    const updated = workouts.map((w) => {
      if (w.dayIndex === selectedDay.dayIndex) {
        return {
          ...w,
          isRestDay: !w.isRestDay,
          name: !w.isRestDay ? 'Scheduled Rest & Recovery' : 'Active Training Session'
        };
      }
      return w;
    });
    setWorkouts(updated);
    saveWorkoutPlan(updated);
    showToast(`${selectedDay.dayName} toggled to ${!selectedDay.isRestDay ? 'Rest Day' : 'Training Day'}`, 'info');
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updated = workouts.map((w) => {
      if (w.dayIndex === selectedDay.dayIndex) {
        return {
          ...w,
          exercises: w.exercises.filter((e) => e.id !== exerciseId)
        };
      }
      return w;
    });
    setWorkouts(updated);
    saveWorkoutPlan(updated);
    showToast('Exercise removed from routine', 'info');
  };

  const handleAddExerciseToDay = (def: ExerciseDefinition) => {
    const newEx: WorkoutExercise = {
      id: 'ex_' + Date.now(),
      exerciseId: def.id,
      name: def.name,
      targetMuscle: def.primaryMuscle,
      sets: 3,
      reps: '10-12 reps',
      weightKg: profile.availableEquipment === 'bodyweight_only' ? undefined : 16,
      restSeconds: 75,
      instructions: def.instructions[0] || 'Perform with controlled tempo and full range of motion.',
      completedSets: [false, false, false]
    };

    const updated = workouts.map((w) => {
      if (w.dayIndex === selectedDay.dayIndex) {
        return {
          ...w,
          exercises: [...w.exercises, newEx]
        };
      }
      return w;
    });
    setWorkouts(updated);
    saveWorkoutPlan(updated);
    setIsAddExerciseModalOpen(false);
    showToast(`Added ${def.name} to ${selectedDay.dayName}`, 'success', 'Exercise Added');
  };

  const handleUpdateExerciseStats = (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    weightKg?: number
  ) => {
    const updated = workouts.map((w) => {
      if (w.dayIndex === selectedDay.dayIndex) {
        return {
          ...w,
          exercises: w.exercises.map((e) => {
            if (e.id === exerciseId) {
              const currentCompleted = e.completedSets || [];
              const newCompleted = Array.from({ length: sets }, (_, i) => currentCompleted[i] || false);
              return {
                ...e,
                sets,
                reps,
                weightKg,
                completedSets: newCompleted
              };
            }
            return e;
          })
        };
      }
      return w;
    });
    setWorkouts(updated);
    saveWorkoutPlan(updated);
  };

  const muscleFilters = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.category.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle = filterMuscle === 'All' || ex.category === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  const totalExercises = selectedDay.exercises.length;
  const completedSetsCount = selectedDay.exercises.reduce(
    (acc, ex) => acc + ex.completedSets.filter(Boolean).length,
    0
  );
  const totalSetsCount = selectedDay.exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8ede6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
              PROGRAM DESIGN
            </span>
            <span className="text-xs text-[#7a8c79] font-medium">Personalized Progression Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
            Weekly Workout Planner
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
            Targeting: <strong className="text-[#192418] capitalize">{profile.goal.replace('_', ' ')}</strong> • Equipment: <strong className="text-[#3b7e23] capitalize">{profile.availableEquipment.replace('_', ' ')}</strong> • {profile.preferredWorkoutDurationMin} mins/session.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleRestDay}
            className="px-4 py-2 rounded-2xl text-xs font-bold bg-white hover:bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6] transition-colors shadow-xs"
          >
            {selectedDay.isRestDay ? 'Switch to Training Day' : 'Switch to Rest Day'}
          </button>
        </div>
      </div>

      {/* 7-DAY NAVIGATION STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {workouts.map((day) => {
          const isSelected = day.dayIndex === selectedDayIndex;
          const dayExerciseCount = day.exercises.length;
          const daySetsDone = day.exercises.reduce((acc, e) => acc + e.completedSets.filter(Boolean).length, 0);
          const dayTotalSets = day.exercises.reduce((acc, e) => acc + e.sets, 0);

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className={`p-4 rounded-3xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#eef7eb] border-[#5ba83c] text-[#192418] shadow-xs translate-y-[-2px]'
                  : 'bg-white border-[#e8ede6] hover:border-[#cbd7c8] hover:bg-[#fdfefd]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#3b7e23]' : 'text-[#7a8c79]'}`}>
                  {day.dayName.substring(0, 3)}
                </span>
                {day.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#5ba83c] fill-[#eef7eb]" />
                ) : day.isRestDay ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                ) : (
                  <span className="text-[10px] text-[#8e9f8e] font-semibold">
                    {daySetsDone}/{dayTotalSets}
                  </span>
                )}
              </div>

              <div className="font-extrabold text-[#192418] text-xs sm:text-sm truncate">
                {day.isRestDay ? 'Rest & Repair' : day.name.split(' ')[0]}
              </div>

              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1 truncate">
                {day.isRestDay ? 'Active Recovery' : `${dayExerciseCount} exercises`}
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED DAY VIEW */}
      <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Header of selected day */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f0f4ee]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase text-[#3b7e23]">
                {selectedDay.dayName}
              </span>
              <span className="text-[#8e9f8e]">•</span>
              <span className="text-xs text-[#5e6f5e]">
                {selectedDay.isRestDay ? 'Active Recovery Protocol' : `${selectedDay.targetFocus}`}
              </span>
              {!selectedDay.isRestDay && (
                <>
                  <span className="text-[#8e9f8e]">•</span>
                  <span className="text-xs text-[#7a8c79] font-medium">
                    {completedSetsCount}/{totalSetsCount} Sets Logged
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
              {selectedDay.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!selectedDay.isRestDay && (
              <button
                onClick={() => setIsAddExerciseModalOpen(true)}
                className="bg-[#f6f8f5] hover:bg-[#edf2ea] text-[#192418] border border-[#e8ede6] font-bold text-xs px-4 py-2.5 rounded-2xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#5ba83c] stroke-[2.5]" />
                <span>Add Exercise</span>
              </button>
            )}

            {!selectedDay.isRestDay && (
              <button
                onClick={handleToggleDayComplete}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedDay.completed
                    ? 'bg-[#eef7eb] text-[#3b7e23] border border-[#d6ebd0]'
                    : 'bg-[#5ba83c] hover:bg-[#4d9630] text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedDay.completed ? 'Session Completed' : 'Mark Session Complete'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Exercises List or Rest Day */}
        {selectedDay.isRestDay ? (
          <div className="text-center py-12 px-4 bg-[#eef7eb]/60 rounded-3xl border border-[#d6ebd0]">
            <span className="text-4xl block mb-2">🌿</span>
            <h3 className="text-lg font-extrabold text-[#192418]">Active Recovery Protocol</h3>
            <p className="text-xs sm:text-sm text-[#5e6f5e] max-w-md mx-auto mt-2 leading-relaxed font-medium">
              Scheduled rest days allow muscle protein synthesis, central nervous system rejuvenation, and replenishment of muscle glycogen stores. Keep your hydration and protein on target.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDay.exercises.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-3xl border border-dashed border-[#e8ede6] bg-[#fcfdfc]">
                <Dumbbell className="w-8 h-8 text-[#8e9f8e] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#192418]">No exercises scheduled for this day</p>
                <p className="text-xs text-[#7a8c79] mt-1 mb-4 font-medium">Add movements from the verified exercise library to build your routine.</p>
                <button
                  onClick={() => setIsAddExerciseModalOpen(true)}
                  className="px-4 py-2 bg-[#5ba83c] text-white font-bold text-xs rounded-2xl hover:bg-[#4d9630] transition-colors shadow-xs"
                >
                  Browse & Add Exercises
                </button>
              </div>
            ) : (
              selectedDay.exercises.map((exercise, idx) => {
                const allSetsDone = exercise.completedSets.length > 0 && exercise.completedSets.every(Boolean);

                return (
                  <div
                    key={exercise.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      allSetsDone
                        ? 'bg-[#f6f8f5]/60 border-[#e8ede6] opacity-85'
                        : 'bg-[#fcfdfc] border-[#e8ede6] hover:border-[#cbd7c8]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase text-[#3b7e23] bg-[#eef7eb] px-2 py-0.5 rounded-full border border-[#d6ebd0]">
                            #{idx + 1} • {exercise.targetMuscle}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#192418]">{exercise.name}</h4>
                        <p className="text-xs text-[#5e6f5e] mt-1 leading-relaxed max-w-xl font-medium">
                          {exercise.instructions}
                        </p>
                      </div>

                      {/* Sets, Reps, Load inputs */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#e8ede6] text-xs shadow-xs">
                          <div>
                            <span className="text-[9px] text-[#7a8c79] uppercase block font-bold">SETS</span>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={exercise.sets}
                              onChange={(e) =>
                                handleUpdateExerciseStats(
                                  exercise.id,
                                  Number(e.target.value) || 1,
                                  exercise.reps,
                                  exercise.weightKg
                                )
                              }
                              className="w-12 bg-[#f6f8f5] border border-[#e8ede6] rounded-lg px-1.5 py-0.5 text-[#192418] font-bold"
                            />
                          </div>

                          <div>
                            <span className="text-[9px] text-[#7a8c79] uppercase block font-bold">REPS</span>
                            <input
                              type="text"
                              value={exercise.reps}
                              onChange={(e) =>
                                handleUpdateExerciseStats(
                                  exercise.id,
                                  exercise.sets,
                                  e.target.value,
                                  exercise.weightKg
                                )
                              }
                              className="w-20 bg-[#f6f8f5] border border-[#e8ede6] rounded-lg px-1.5 py-0.5 text-[#192418] font-bold text-center"
                            />
                          </div>

                          {exercise.weightKg !== undefined && (
                            <div>
                              <span className="text-[9px] text-[#7a8c79] uppercase block font-bold">LOAD (KG)</span>
                              <input
                                type="number"
                                min="0"
                                step="2.5"
                                value={exercise.weightKg}
                                onChange={(e) =>
                                  handleUpdateExerciseStats(
                                    exercise.id,
                                    exercise.sets,
                                    exercise.reps,
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-14 bg-[#f6f8f5] border border-[#e8ede6] rounded-lg px-1.5 py-0.5 text-[#192418] font-bold text-center"
                              />
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="p-2 text-[#7a8c79] hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                          title="Remove exercise"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Sets Checklist */}
                    <div className="pt-3 border-t border-[#f0f4ee] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#7a8c79]">Log Sets:</span>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                            const isSetComplete = exercise.completedSets?.[sIdx] || false;
                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleToggleSet(exercise.id, sIdx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  isSetComplete
                                    ? 'bg-[#5ba83c] text-white shadow-xs'
                                    : 'bg-white border border-[#e8ede6] text-[#7a8c79] hover:border-[#5ba83c]'
                                }`}
                              >
                                Set {sIdx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#7a8c79] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#5ba83c]" />
                        <span>Rest: {exercise.restSeconds}s</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ADD EXERCISE MODAL */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in space-y-5">
            <button
              onClick={() => setIsAddExerciseModalOpen(false)}
              className="absolute top-5 right-5 text-[#7a8c79] hover:text-[#192418] p-2 rounded-xl bg-[#f6f8f5] hover:bg-[#edf2ea] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
                EXERCISE CATALOG
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#192418]">
                Add Movement to {selectedDay.dayName}
              </h3>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search exercise by name or muscle..."
                className="flex-1 bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl px-4 py-2.5 text-xs text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
              />

              <div className="flex flex-wrap gap-1">
                {muscleFilters.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMuscle(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      filterMuscle === m
                        ? 'bg-[#5ba83c] text-white shadow-xs'
                        : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map((def) => (
                <div
                  key={def.id}
                  className="p-3.5 rounded-2xl bg-[#fcfdfc] border border-[#e8ede6] hover:border-[#5ba83c] flex items-center justify-between gap-4 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#192418]">{def.name}</h4>
                      <span className="text-[10px] text-[#3b7e23] bg-[#eef7eb] px-2 py-0.5 rounded-md font-bold">
                        {def.primaryMuscle}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5e6f5e] mt-0.5 line-clamp-1 font-medium">
                      {def.instructions[0]}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddExerciseToDay(def)}
                    className="px-3.5 py-1.5 bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-xs"
                  >
                    + Add to Workout
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
