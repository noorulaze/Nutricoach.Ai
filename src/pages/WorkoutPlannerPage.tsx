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
      instructions: def.instructions[0] || 'Execute with clean tempo and strict form.',
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
    showToast(`Added ${def.name} to ${selectedDay.dayName}`, 'success');
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
              const newCompleted = Array.from({ length: sets }, (_, idx) => currentCompleted[idx] || false);
              return { ...e, sets, reps, weightKg, completedSets: newCompleted };
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
              PROGRAM DESIGN
            </span>
            <span className="text-xs text-zinc-500 font-mono">Personalized Progression Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Weekly Workout Planner
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Targeting: <strong className="text-white capitalize">{profile.goal.replace('_', ' ')}</strong> • Equipment: <strong className="text-[#ccff00] capitalize">{profile.availableEquipment.replace('_', ' ')}</strong> • {profile.preferredWorkoutDurationMin} mins/session.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleRestDay}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 transition-colors"
          >
            {selectedDay.isRestDay ? 'Switch to Training Day' : 'Switch to Rest Day'}
          </button>
        </div>
      </div>

      {/* 7-DAY NAVIGATION STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {workouts.map((day) => {
          const isSelected = day.dayIndex === selectedDayIndex;
          const dayExerciseCount = day.exercises.length;
          const daySetsDone = day.exercises.reduce((acc, e) => acc + e.completedSets.filter(Boolean).length, 0);
          const dayTotalSets = day.exercises.reduce((acc, e) => acc + e.sets, 0);

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.18)] translate-y-[-2px]'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-zinc-700/80 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-mono font-bold uppercase ${isSelected ? 'text-[#ccff00]' : 'text-zinc-400'}`}>
                  {day.dayName.substring(0, 3)}
                </span>
                {day.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                ) : day.isRestDay ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                ) : (
                  <span className="text-[10px] font-mono text-zinc-500">
                    {daySetsDone}/{dayTotalSets}
                  </span>
                )}
              </div>

              <div className="font-bold text-white text-xs sm:text-sm truncate">
                {day.isRestDay ? 'Rest & Repair' : day.name.split(' ')[0]}
              </div>

              <span className="text-[10px] text-zinc-400 font-mono block mt-1 truncate">
                {day.isRestDay ? 'Active Recovery' : `${dayExerciseCount} exercises`}
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED DAY VIEW */}
      <div className="app-card-elevated p-6 sm:p-8 space-y-6">
        {/* Header of selected day */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase text-[#ccff00]">
                {selectedDay.dayName}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-mono">
                {selectedDay.isRestDay ? 'Active Recovery Protocol' : `${selectedDay.targetFocus}`}
              </span>
              {!selectedDay.isRestDay && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {completedSetsCount}/{totalSetsCount} Sets Logged
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedDay.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!selectedDay.isRestDay && (
              <button
                onClick={() => setIsAddExerciseModalOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#ccff00]" />
                <span>Add Exercise</span>
              </button>
            )}

            {!selectedDay.isRestDay && (
              <button
                onClick={handleToggleDayComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedDay.completed
                    ? 'bg-zinc-900 text-[#ccff00] border border-[#ccff00]/40'
                    : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
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
          <div className="text-center py-12 px-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80">
            <span className="text-4xl block mb-2">🌿</span>
            <h3 className="text-lg font-bold text-white">Active Recovery Protocol</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
              Scheduled rest days allow muscle protein synthesis, central nervous system rejuvenation, and replenishment of muscle glycogen stores. Keep your hydration and protein on target.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDay.exercises.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-zinc-800">
                <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-300">No exercises scheduled for this day</p>
                <p className="text-xs text-zinc-500 mt-1 mb-4">Add movements from the verified exercise library to build your routine.</p>
                <button
                  onClick={() => setIsAddExerciseModalOpen(true)}
                  className="px-4 py-2 bg-[#ccff00] text-black font-bold text-xs rounded-xl hover:bg-[#b8e600] transition-colors"
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
                    className={`p-5 rounded-2xl border transition-all ${
                      allSetsDone
                        ? 'bg-zinc-900/30 border-zinc-800/50 opacity-80'
                        : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700/80'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/20">
                            #{idx + 1} • {exercise.targetMuscle}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{exercise.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-xl">
                          {exercise.instructions}
                        </p>
                      </div>

                      {/* Sets, Reps, Load inputs */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-zinc-800 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">SETS</span>
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
                              className="w-12 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-white font-bold"
                            />
                          </div>

                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">REPS</span>
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
                              className="w-20 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-white font-bold"
                            />
                          </div>

                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block font-semibold">LOAD (KG)</span>
                            <input
                              type="number"
                              min="0"
                              value={exercise.weightKg || 0}
                              onChange={(e) =>
                                handleUpdateExerciseStats(
                                  exercise.id,
                                  exercise.sets,
                                  exercise.reps,
                                  Number(e.target.value) || undefined
                                )
                              }
                              className="w-16 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-[#ccff00] font-bold"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-zinc-800 transition-colors"
                          title="Remove exercise"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Set Checklist */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold mr-1">
                        SET TRACKER:
                      </span>
                      {exercise.completedSets.map((done, setIndex) => (
                        <button
                          key={setIndex}
                          onClick={() => handleToggleSet(exercise.id, setIndex)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            done
                              ? 'bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                              : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60'
                          }`}
                        >
                          <span>Set {setIndex + 1}</span>
                          {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                      <span className="text-[10px] text-zinc-500 font-mono ml-auto">
                        Rest between sets: {exercise.restSeconds}s
                      </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in">
            <button
              onClick={() => setIsAddExerciseModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              EXERCISE CATALOG
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Add Movement to {selectedDay.dayName}
            </h3>

            {/* Search */}
            <input
              type="text"
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              placeholder="Search exercise by muscle or name (e.g. bench, squat, pull-up, chest)..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] mb-3"
            />

            {/* Muscle Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none">
              {muscleFilters.map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMuscle(m)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filterMuscle === m
                      ? 'bg-[#ccff00] text-black font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Exercise list */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map((def) => (
                <div
                  key={def.id}
                  className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between hover:border-[#ccff00]/40 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">
                      {def.category} • {def.primaryMuscle}
                    </span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{def.name}</h5>
                    <span className="text-[11px] text-zinc-400 capitalize">
                      Difficulty: {def.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddExerciseToDay(def)}
                    className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
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
