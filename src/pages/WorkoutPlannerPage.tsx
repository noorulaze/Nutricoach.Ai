import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, Calendar, Clock, Plus, Trash2, 
  CheckCircle2, Sparkles, X, Search, SlidersHorizontal,
  Flame, Layers, Target, Compass, Timer, Activity
} from 'lucide-react';
import { 
  getProfile, getWorkoutPlan, saveWorkoutPlan, 
  toggleExerciseSetCompletion, toggleDayWorkoutComplete 
} from '../utils/storage';
import { DayWorkout, WorkoutExercise } from '../types';
import { useToast } from '../context/ToastContext';
import { 
  MUSCLE_GROUPS, 
  MuscleGroupInfo, 
  AnatomyExercise, 
  getMuscleGroupById 
} from '../data/workoutAnatomyData';
import HumanAnatomy3D from '../components/HumanAnatomy3D';
import MuscleGroupIcon from '../components/MuscleGroupIcon';
import AnatomyExerciseCard from '../components/AnatomyExerciseCard';
import AddToWorkoutPlanModal from '../components/AddToWorkoutPlanModal';
import ExerciseDetailModal from '../components/ExerciseDetailModal';

export default function WorkoutPlannerPage() {
  const { showToast } = useToast();
  const profile = getProfile();

  // Top Mode Switcher: 'anatomy' (Muscle Groups) vs 'plans' (Weekly Workout Plans)
  const [activeTab, setActiveTab] = useState<'anatomy' | 'plans'>('anatomy');

  // Anatomy 3D State
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');
  const [modelViewMode, setModelViewMode] = useState<'front' | 'back'>('front');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Modals
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<AnatomyExercise | null>(null);
  const [exerciseForPlanModal, setExerciseForPlanModal] = useState<AnatomyExercise | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  // Existing Weekly Workout Plan State (Preserved 100%)
  const [workouts, setWorkouts] = useState<DayWorkout[]>(() => getWorkoutPlan());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0); // Mon = 0
  const selectedDay = workouts.find((w) => w.dayIndex === selectedDayIndex) || workouts[0];

  // Active muscle group data
  const currentMuscleInfo = useMemo(() => {
    return getMuscleGroupById(selectedMuscleId);
  }, [selectedMuscleId]);

  // Filtered exercises for right column
  const filteredExercises = useMemo(() => {
    return currentMuscleInfo.exercises.filter((ex) => {
      const matchesSearch = 
        ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
        ex.targetMuscles.some((m) => m.toLowerCase().includes(exerciseSearch.toLowerCase())) ||
        ex.equipment.toLowerCase().includes(exerciseSearch.toLowerCase());
      const matchesDiff = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
      return matchesSearch && matchesDiff;
    });
  }, [currentMuscleInfo, exerciseSearch, selectedDifficulty]);

  // Handler for muscle selection
  const handleSelectMuscle = (id: string) => {
    setSelectedMuscleId(id);
    const muscle = getMuscleGroupById(id);
    setModelViewMode(muscle.defaultView);
  };

  // Handler for adding exercise to plan
  const handleOpenAddToPlan = (exercise?: AnatomyExercise) => {
    const targetExercise = exercise || (filteredExercises.length > 0 ? filteredExercises[0] : currentMuscleInfo.exercises[0]);
    setExerciseForPlanModal(targetExercise);
    setIsPlanModalOpen(true);
  };

  // Handlers for weekly workout planner tab (existing logic preserved)
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

  const totalExercises = selectedDay.exercises.length;
  const completedSetsCount = selectedDay.exercises.reduce(
    (acc, ex) => acc + ex.completedSets.filter(Boolean).length,
    0
  );
  const totalSetsCount = selectedDay.exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <div className="w-full min-h-screen bg-[#f6f8f5] dark:bg-[#1C211D] text-[#192418] dark:text-[#E8EDE7] px-3 sm:px-6 lg:px-8 py-5 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* ========================================================================= */}
        {/* TOP TAB CONTROLS: "Muscle Groups" vs "Workout Plans" (matches reference)   */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('anatomy')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'anatomy'
                  ? 'bg-[#273726] text-white shadow-xs'
                  : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
              }`}
            >
              Muscle Groups
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'plans'
                  ? 'bg-[#273726] text-white shadow-xs'
                  : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
              }`}
            >
              Workout Plans
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5ba83c] animate-pulse" />
            <span>Interactive Biomechanics Engine</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 3D ANATOMICAL MUSCLE GROUPS (Exact match to attached reference)    */}
        {/* ========================================================================= */}
        {activeTab === 'anatomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* --------------------------------------------------------------------- */}
            {/* LEFT COLUMN: 14 Muscle Groups Navigation List                         */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-3 xl:col-span-2 space-y-1.5 bg-white/70 dark:bg-[#272E29]/70 backdrop-blur-sm p-2.5 rounded-3xl border border-[#e8ede6] dark:border-[#394139] max-h-[780px] overflow-y-auto shadow-2xs custom-scrollbar">
              {MUSCLE_GROUPS.map((muscle) => {
                const isSelected = muscle.id === selectedMuscleId;
                return (
                  <button
                    key={muscle.id}
                    type="button"
                    onClick={() => handleSelectMuscle(muscle.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#eef6eb] dark:bg-[#273728] text-[#192418] dark:text-[#E8EDE7] font-black border border-[#d6ebd0] dark:border-[#3d533f] shadow-2xs'
                        : 'text-[#4e5e4e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5] dark:hover:bg-[#212722] hover:text-[#192418] dark:hover:text-[#E8EDE7] font-bold border border-transparent'
                    }`}
                  >
                    <MuscleGroupIcon 
                      muscleId={muscle.id} 
                      isSelected={isSelected} 
                      size={28} 
                    />
                    <span className="text-xs sm:text-[13px] tracking-tight truncate">
                      {muscle.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* CENTER COLUMN: Real 3D Rotatable Human Model & Tips Card              */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col gap-4">
              {/* 3D Anatomical Body Card */}
              <div className="w-full bg-white dark:bg-[#272E29] rounded-[32px] border border-[#e8ede6] dark:border-[#394139] shadow-xs relative overflow-hidden flex items-center justify-center min-h-[580px] lg:min-h-[640px]">
                <HumanAnatomy3D
                  selectedMuscleId={selectedMuscleId}
                  onSelectMuscle={handleSelectMuscle}
                  viewMode={modelViewMode}
                  onViewModeChange={setModelViewMode}
                />
              </div>

              {/* Tips & Info Card (Directly below 3D Model, matching reference) */}
              <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#eef7eb] dark:bg-[#223023] flex items-center justify-center text-[#5ba83c]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wide">
                    Tips & Info
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  {/* Focus */}
                  <div className="flex items-start gap-2.5">
                    <Target className="w-4 h-4 text-[#7a8c79] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] block">
                        Focus
                      </span>
                      <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-snug">
                        {currentMuscleInfo.tips.focus}
                      </p>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="flex items-start gap-2.5">
                    <Dumbbell className="w-4 h-4 text-[#7a8c79] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] block">
                        Equipment
                      </span>
                      <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-snug">
                        {currentMuscleInfo.tips.equipment}
                      </p>
                    </div>
                  </div>

                  {/* Rest */}
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#7a8c79] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] block">
                        Rest
                      </span>
                      <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-snug">
                        {currentMuscleInfo.tips.rest}
                      </p>
                    </div>
                  </div>

                  {/* Target */}
                  <div className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-[#7a8c79] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] block">
                        Target
                      </span>
                      <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-snug">
                        {currentMuscleInfo.tips.target}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Muscle Info, Difficulty Filter & Exercise Cards         */}
            {/* --------------------------------------------------------------------- */}
            <div className="lg:col-span-4 xl:col-span-4 bg-white/70 dark:bg-[#272E29]/70 backdrop-blur-sm rounded-[32px] border border-[#e8ede6] dark:border-[#394139] p-5 sm:p-6 space-y-4 shadow-xs">
              
              {/* Muscle Header */}
              <div className="space-y-2 border-b border-[#e8ede6] dark:border-[#394139] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#edf5eb] dark:bg-[#223023] border border-[#d6ebd0] dark:border-[#354836] flex items-center justify-center shrink-0 shadow-2xs">
                    <MuscleGroupIcon muscleId={currentMuscleInfo.id} isSelected={true} size={34} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight leading-tight">
                      {currentMuscleInfo.name}
                    </h2>
                    <span className="text-xs text-[#5e6f5e] dark:text-[#8BAF78] font-bold tracking-wide">
                      {currentMuscleInfo.scientificName}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5e6f5e] dark:text-[#C5CDC4] leading-relaxed font-medium pt-1">
                  {currentMuscleInfo.description}
                </p>
              </div>

              {/* Difficulty Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-[#273726] text-white shadow-2xs'
                        : 'bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl pl-10 pr-9 py-2 text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
                />
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8e9f8e] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Exercise Cards List */}
              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
                    <AnatomyExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onOpenDetails={(ex) => setSelectedExerciseForModal(ex)}
                      onQuickAdd={(ex) => handleOpenAddToPlan(ex)}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-[#1C211D] rounded-2xl border border-dashed border-[#e8ede6] dark:border-[#394139] p-4">
                    <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">
                      No exercises matching "{exerciseSearch}".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setExerciseSearch('');
                        setSelectedDifficulty('All');
                      }}
                      className="text-xs font-bold text-[#5ba83c] hover:underline mt-2"
                    >
                      Clear search filters
                    </button>
                  </div>
                )}
              </div>

              {/* Wide Primary Button: "+ Add to Workout Plan" (matches reference) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddToPlan()}
                  className="w-full py-3.5 rounded-2xl bg-[#325b39] hover:bg-[#28492e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Workout Plan</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WEEKLY WORKOUT PLANS (Existing schedule, tracking, and logs)       */}
        {/* ========================================================================= */}
        {activeTab === 'plans' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Top Banner & Rest Day Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] shadow-2xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#223023] px-2.5 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#334634]">
                  Weekly Progression Plan
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight mt-1">
                  Active Training Routine
                </h2>
                <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">
                  Goal: <strong className="text-[#192418] dark:text-[#E8EDE7] capitalize">{profile.goal.replace('_', ' ')}</strong> • Preferred Session: {profile.preferredWorkoutDurationMin} mins.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleRestDay}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#f6f8f5] dark:bg-[#1C211D] hover:bg-[#edf2ea] text-[#192418] dark:text-[#E8EDE7] border border-[#e8ede6] dark:border-[#394139] transition-colors"
              >
                {selectedDay.isRestDay ? 'Switch to Active Training Day' : 'Mark as Scheduled Rest Day'}
              </button>
            </div>

            {/* 7-Day Day Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {workouts.map((day) => {
                const isSelected = day.dayIndex === selectedDayIndex;
                const dayExerciseCount = day.exercises.length;
                const daySetsDone = day.exercises.reduce((acc, e) => acc + e.completedSets.filter(Boolean).length, 0);
                const dayTotalSets = day.exercises.reduce((acc, e) => acc + e.sets, 0);

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDayIndex(day.dayIndex)}
                    className={`p-3.5 rounded-3xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#eef7eb] dark:bg-[#2b3a2a] border-[#5ba83c] text-[#192418] dark:text-[#E8EDE7] shadow-xs'
                        : 'bg-white dark:bg-[#272E29] border-[#e8ede6] dark:border-[#394139] hover:bg-[#fcfdfc] text-[#5e6f5e] dark:text-[#A2AAA1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-[#3b7e23] dark:text-[#8BAF78]' : 'text-[#7a8c79]'}`}>
                        {day.dayName.substring(0, 3)}
                      </span>
                      {day.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5ba83c]" />
                      ) : (
                        <span className="text-[10px] font-bold">{daySetsDone}/{dayTotalSets}</span>
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-[#192418] dark:text-[#E8EDE7] truncate">
                      {day.isRestDay ? 'Rest' : day.name.split(' ')[0]}
                    </div>
                    <span className="text-[10px] text-[#7a8c79] block mt-0.5 truncate">
                      {day.isRestDay ? 'Recovery' : `${dayExerciseCount} exercises`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Exercise Sets Card */}
            <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-3xl p-5 sm:p-7 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f4ee] dark:border-[#394139] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-[#5ba83c]">
                    {selectedDay.dayName} • {selectedDay.targetFocus}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
                    {selectedDay.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleToggleDayComplete}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                    selectedDay.completed
                      ? 'bg-[#eef7eb] dark:bg-[#243324] text-[#3b7e23] dark:text-[#8BAF78] border border-[#5ba83c]'
                      : 'bg-[#2b3a2a] text-white hover:bg-[#233122] shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedDay.completed ? 'Workout Completed' : 'Complete Session'}</span>
                </button>
              </div>

              {/* Exercise Items in Day */}
              {selectedDay.exercises.length > 0 ? (
                <div className="space-y-3">
                  {selectedDay.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-4 rounded-2xl bg-[#f9fbf8] dark:bg-[#1F2620] border border-[#e8ede6] dark:border-[#394139] space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-[#192418] dark:text-[#E8EDE7]">
                            {ex.name}
                          </h4>
                          <span className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">
                            {ex.targetMuscle} • {ex.sets} Sets × {ex.reps} {ex.weightKg ? `• ${ex.weightKg}kg` : ''} • Rest: {ex.restSeconds}s
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-1.5 text-[#8e9f8e] hover:text-rose-600 transition-colors"
                          title="Remove from routine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Set Checkboxes */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {Array.from({ length: ex.sets }).map((_, setIdx) => {
                          const isDone = ex.completedSets[setIdx] || false;
                          return (
                            <button
                              key={setIdx}
                              type="button"
                              onClick={() => handleToggleSet(ex.id, setIdx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isDone
                                  ? 'bg-[#5ba83c] text-white shadow-2xs'
                                  : 'bg-white dark:bg-[#272E29] border border-[#e2e8df] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1]'
                              }`}
                            >
                              <span>Set {setIdx + 1}</span>
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#fbfdfa] dark:bg-[#1C211D] rounded-2xl border border-dashed border-[#e2e8df] dark:border-[#394139] p-6 space-y-2">
                  <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">
                    No exercises scheduled for {selectedDay.dayName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('anatomy')}
                    className="text-xs font-bold text-[#5ba83c] hover:underline"
                  >
                    Explore 3D Muscle Anatomy & Add Movements
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}
      {/* Exercise Details Guide Modal */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onAddToPlan={(ex) => handleOpenAddToPlan(ex)}
      />

      {/* Add To Workout Plan Scheduling Modal */}
      <AddToWorkoutPlanModal
        isOpen={isPlanModalOpen}
        exercise={exerciseForPlanModal}
        onClose={() => {
          setIsPlanModalOpen(false);
          setExerciseForPlanModal(null);
        }}
        onSuccess={() => {
          setWorkouts(getWorkoutPlan());
        }}
      />

    </div>
  );
}
