import React, { useState } from 'react';
import { 
  Dumbbell, Calendar, Clock, Plus, Trash2, 
  CheckCircle2, RotateCcw, Sparkles, ChevronRight, X, AlertCircle 
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
      showToast(`${selectedDay.name} completed! Fantastic work.`, 'success', 'Session Complete');
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

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.category.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.primaryMuscle.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccff00] block mb-1">
            PERSONALIZED SPLIT & PROGRESSION
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            WEEKLY WORKOUT PLANNER
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Targeting: <strong className="text-white">{profile.goal.replace('_', ' ').toUpperCase()}</strong> • Equipment: <strong className="text-[#ccff00]">{profile.availableEquipment.replace('_', ' ')}</strong> • {profile.preferredWorkoutDurationMin} mins/session.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleRestDay}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
          >
            {selectedDay.isRestDay ? 'CHANGE TO TRAINING DAY' : 'CHANGE TO REST DAY'}
          </button>
        </div>
      </div>

      {/* 7-DAY NAVIGATION STRIP */}
      <div className="grid grid-cols-7 gap-2">
        {workouts.map((day) => {
          const isSelected = day.dayIndex === selectedDayIndex;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.2)]'
                  : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-[#ccff00]' : 'text-zinc-500'}`}>
                  {day.dayName.substring(0, 3)}
                </span>
                {day.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />}
              </div>
              <div className="font-heading font-black text-white text-xs sm:text-sm truncate">
                {day.isRestDay ? 'REST' : day.name.split(' ')[0]}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block mt-0.5 truncate">
                {day.isRestDay ? 'Recovery' : `${day.exercises.length} moves`}
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED DAY VIEW */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase text-[#ccff00]">
                {selectedDay.dayName}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-mono">
                {selectedDay.isRestDay ? 'Active Recovery Protocol' : `${selectedDay.targetFocus}`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight">
              {selectedDay.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!selectedDay.isRestDay && (
              <button
                onClick={() => setIsAddExerciseModalOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold uppercase text-xs tracking-wider px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#ccff00]" /> ADD EXERCISE
              </button>
            )}

            {!selectedDay.isRestDay && (
              <button
                onClick={handleToggleDayComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  selectedDay.completed
                    ? 'bg-zinc-900 text-[#ccff00] border border-[#ccff00]/40'
                    : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedDay.completed ? 'SESSION COMPLETED' : 'MARK SESSION COMPLETE'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Exercises List */}
        {selectedDay.isRestDay ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800/80">
            <span className="text-3xl block mb-2">🌿</span>
            <h3 className="text-xl font-bold font-heading text-white">RECOVERY PROTOCOL ACTIVE</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
              Rest days allow muscular protein synthesis, replenishment of muscle glycogen stores, and psychological decompression. Maintain your protein targets today.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDay.exercises.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500">
                No exercises scheduled for this day yet. Click "Add Exercise" to start building your routine.
              </div>
            ) : (
              selectedDay.exercises.map((exercise, idx) => {
                const allSetsDone = exercise.completedSets.every(Boolean);

                return (
                  <div
                    key={exercise.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      allSetsDone
                        ? 'bg-zinc-900/40 border-zinc-800/60 opacity-80'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">
                            EXERCISE {idx + 1} • {exercise.targetMuscle}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold font-heading text-white">{exercise.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{exercise.instructions}</p>
                      </div>

                      {/* Sets & Reps Inputs */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-zinc-800 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">SETS</span>
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
                            <span className="text-[9px] text-zinc-500 uppercase block">REPS</span>
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
                            <span className="text-[9px] text-zinc-500 uppercase block">KG</span>
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
                              className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-[#ccff00] font-bold"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800"
                          title="Remove exercise"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Set Checklist */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold mr-1">
                        SET TRACKER:
                      </span>
                      {exercise.completedSets.map((done, setIndex) => (
                        <button
                          key={setIndex}
                          onClick={() => handleToggleSet(exercise.id, setIndex)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            done
                              ? 'bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                              : 'bg-zinc-800 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <span>Set {setIndex + 1}</span>
                          {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                      <span className="text-[10px] text-zinc-500 font-mono ml-auto">
                        Rest: {exercise.restSeconds}s
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in">
            <button
              onClick={() => setIsAddExerciseModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              EXERCISE LIBRARY CATALOG
            </span>
            <h3 className="text-2xl font-black font-heading text-white uppercase tracking-tight mb-4">
              ADD EXERCISE TO {selectedDay.dayName.toUpperCase()}
            </h3>

            <input
              type="text"
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              placeholder="Search exercise by muscle or name (e.g. bench, squat, pull-up, chest)..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] mb-4"
            />

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map((def) => (
                <div
                  key={def.id}
                  className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-[#ccff00]/40 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">
                      {def.category} • {def.primaryMuscle}
                    </span>
                    <h5 className="font-bold text-white text-sm">{def.name}</h5>
                    <span className="text-[10px] text-zinc-400 capitalize">
                      Difficulty: {def.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddExerciseToDay(def)}
                    className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD
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
