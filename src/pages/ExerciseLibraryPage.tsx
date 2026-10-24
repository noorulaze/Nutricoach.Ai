import React, { useState } from 'react';
import { 
  BookOpen, Search, Dumbbell, Filter, CheckCircle2, 
  AlertTriangle, Lightbulb, Plus, X, ArrowRight, Activity 
} from 'lucide-react';
import { EXERCISE_LIBRARY } from '../data/nutritionAndExerciseData';
import { ExerciseDefinition } from '../types';
import { getWorkoutPlan, saveWorkoutPlan } from '../utils/storage';
import { useToast } from '../context/ToastContext';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
            BIOMECHANICS REPOSITORY
          </span>
          <span className="text-xs text-zinc-500 font-mono">40+ Staple Movements</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Exercise Technique & Movement Library
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Master anatomical cues, muscle recruitment paths, and injury prevention techniques across resistance disciplines.
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="app-card p-5 sm:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercise by movement or target muscle (e.g. lats, bench press, deadlift, quads)..."
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_12px_rgba(204,255,0,0.25)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-zinc-500 uppercase font-mono text-[10px]">DIFFICULTY:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ccff00] capitalize cursor-pointer"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-zinc-900 capitalize">
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
            className="app-card p-5 cursor-pointer transition-all duration-300 hover:border-[#ccff00]/40 flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/20">
                  {exercise.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                  {exercise.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-[#ccff00] transition-colors mb-2">
                {exercise.name}
              </h3>

              <div className="space-y-1 text-xs mb-3 font-mono">
                <div className="text-zinc-300">
                  <span className="text-zinc-500">Primary:</span>{' '}
                  <strong className="text-white font-semibold">{exercise.primaryMuscle}</strong>
                </div>
                {exercise.secondaryMuscles.length > 0 && (
                  <div className="text-zinc-400 text-[11px] truncate">
                    <span className="text-zinc-500">Assists:</span> {exercise.secondaryMuscles.join(', ')}
                  </div>
                )}
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                {exercise.instructions[0]}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[#ccff00] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Full Form Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED EXERCISE MODAL */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in space-y-6">
            <button
              onClick={() => setActiveExerciseModal(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
                {activeExerciseModal.category} • {activeExerciseModal.difficulty.toUpperCase()}
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {activeExerciseModal.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2 text-xs font-mono">
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg">
                  Target: <strong className="text-white">{activeExerciseModal.primaryMuscle}</strong>
                </span>
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg">
                  Assists: {activeExerciseModal.secondaryMuscles.join(', ')}
                </span>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" /> Execution Protocol
              </h4>
              <div className="space-y-2 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-300">
                {activeExerciseModal.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-[#ccff00] font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Form Tips */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-yellow-400" /> Coaching Cues
              </h4>
              <div className="space-y-1.5 text-xs text-zinc-300 bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800">
                {activeExerciseModal.formTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#ccff00] font-bold">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoid Mistakes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-red-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Common Mistakes to Avoid
              </h4>
              <div className="space-y-1.5 text-xs text-zinc-300 bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800">
                {activeExerciseModal.avoidMistakes.map((mistake, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span className="leading-relaxed">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAddToToday(activeExerciseModal)}
                className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add to Today's Workout Plan
              </button>
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="px-5 py-3.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800"
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
