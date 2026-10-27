import React, { useState } from 'react';
import { 
  BookOpen, Search, Dumbbell, Filter, CheckCircle2, 
  AlertTriangle, Lightbulb, Plus, X, ArrowRight, Activity 
} from 'lucide-react';
import { EXERCISE_LIBRARY } from '../data/nutritionAndExerciseData';
import { ExerciseDefinition } from '../types';
import { getWorkoutPlan, saveWorkoutPlan } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import ExerciseDemonstration from '../components/common/ExerciseDemonstration';

export default function ExerciseLibraryPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeExerciseModal, setActiveExerciseModal] = useState<ExerciseDefinition | null>(null);

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

  const filtered = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase()) ||
      ex.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesCat && matchesDiff;
  });

  const handleAddToToday = (exercise: ExerciseDefinition) => {
    const plan = getWorkoutPlan();
    const dayOfWeekIndex = (new Date().getDay() + 6) % 7; // Mon = 0
    const today = plan.find((d) => d.dayIndex === dayOfWeekIndex);

    if (!today) {
      showToast('No active workout found for today', 'error');
      return;
    }

    const updated = plan.map((d) => {
      if (d.dayIndex === dayOfWeekIndex) {
        return {
          ...d,
          isRestDay: false,
          exercises: [
            ...d.exercises,
            {
              id: 'ex_' + Date.now(),
              exerciseId: exercise.id,
              name: exercise.name,
              targetMuscle: exercise.primaryMuscle,
              sets: 3,
              reps: '10-12 reps',
              weightKg: 16,
              restSeconds: 75,
              instructions: exercise.instructions[0] || 'Strict tempo and form.',
              completedSets: [false, false, false]
            }
          ]
        };
      }
      return d;
    });

    saveWorkoutPlan(updated);
    setActiveExerciseModal(null);
    showToast(`Added ${exercise.name} to today's workout!`, 'success', 'Exercise Added');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#e8ede6]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
            BIOMECHANICS REPOSITORY
          </span>
          <span className="text-xs text-[#7a8c79] font-medium">40+ Staple Movements</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
          Exercise Technique & Movement Library
        </h1>
        <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
          Master anatomical cues, muscle recruitment paths, and injury prevention techniques across resistance disciplines.
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-[#e8ede6] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercise by movement or target muscle (e.g. lats, bench press, deadlift, quads)..."
            className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#5ba83c] text-white shadow-xs'
                    : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-[#7a8c79] uppercase font-bold text-[10px]">DIFFICULTY:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3 py-1.5 text-xs text-[#192418] font-bold focus:outline-none focus:border-[#5ba83c] capitalize cursor-pointer"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-white capitalize">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* EXERCISES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setActiveExerciseModal(exercise)}
            className="bg-white border border-[#e8ede6] rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:border-[#5ba83c] hover:shadow-md flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] bg-[#eef7eb] px-2 py-0.5 rounded-full border border-[#d6ebd0]">
                  {exercise.category}
                </span>
                <span className="text-[10px] text-[#7a8c79] font-bold uppercase bg-[#f6f8f5] px-2 py-0.5 rounded-md border border-[#e8ede6]">
                  {exercise.difficulty}
                </span>
              </div>

              {/* Real Motion Demonstration Guide */}
              <div className="mb-3">
                <ExerciseDemonstration
                  exerciseId={exercise.id}
                  exerciseName={exercise.name}
                  mode="card"
                  className="h-44 w-full"
                />
              </div>

              <h3 className="text-base font-extrabold text-[#192418] group-hover:text-[#5ba83c] transition-colors mb-2">
                {exercise.name}
              </h3>

              <div className="space-y-1 text-xs mb-3">
                <div className="text-[#5e6f5e]">
                  <span className="text-[#7a8c79]">Primary:</span>{' '}
                  <strong className="text-[#192418] font-bold">{exercise.primaryMuscle}</strong>
                </div>
                {exercise.secondaryMuscles.length > 0 && (
                  <div className="text-[#7a8c79] text-[11px] truncate">
                    <span>Assists:</span> {exercise.secondaryMuscles.join(', ')}
                  </div>
                )}
              </div>

              <p className="text-xs text-[#5e6f5e] line-clamp-2 mb-4 leading-relaxed font-medium">
                {exercise.instructions[0]}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f0f4ee] flex items-center justify-between text-xs text-[#5e6f5e]">
              <span className="text-[#5ba83c] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Full Form Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED EXERCISE MODAL */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in space-y-6">
            <button
              onClick={() => setActiveExerciseModal(null)}
              className="absolute top-5 right-5 text-[#7a8c79] hover:text-[#192418] p-2 rounded-xl bg-[#f6f8f5] hover:bg-[#edf2ea] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
                  {activeExerciseModal.category}
                </span>
                <span className="text-[10px] text-[#7a8c79] font-bold uppercase bg-[#f6f8f5] px-2 py-0.5 rounded-md border border-[#e8ede6]">
                  {activeExerciseModal.difficulty}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#192418]">
                {activeExerciseModal.name}
              </h3>
            </div>

            {/* Expanded Dual-Frame Movement Guide */}
            <ExerciseDemonstration
              exerciseId={activeExerciseModal.id}
              exerciseName={activeExerciseModal.name}
              mode="expanded"
            />

            {/* Target muscle details */}
            <div className="grid grid-cols-2 gap-3 bg-[#f6f8f5] p-3.5 rounded-2xl border border-[#e8ede6] text-xs">
              <div>
                <span className="text-[#7a8c79] block text-[10px] font-bold uppercase">PRIMARY TARGET</span>
                <span className="font-extrabold text-[#192418] text-sm">{activeExerciseModal.primaryMuscle}</span>
              </div>
              <div>
                <span className="text-[#7a8c79] block text-[10px] font-bold uppercase">SECONDARY SYNERGISTS</span>
                <span className="font-medium text-[#5e6f5e]">{activeExerciseModal.secondaryMuscles.join(', ') || 'None'}</span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#192418] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Execution Steps & Form Cues</span>
              </h4>
              <div className="space-y-2">
                {activeExerciseModal.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#5e6f5e] bg-[#fcfdfc] p-3 rounded-xl border border-[#e8ede6]">
                    <span className="w-5 h-5 rounded-full bg-[#eef7eb] text-[#3b7e23] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleAddToToday(activeExerciseModal)}
                className="flex-1 py-3 bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Today's Workout Routine</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveExerciseModal(null)}
                className="px-5 py-3 bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] rounded-2xl text-xs font-bold border border-[#e8ede6]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
