import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Dumbbell, Sparkles, Plus, CheckCircle2, 
  ArrowRight, Activity, Calendar, Trophy, AlertTriangle, 
  Droplets, Target, Clock, ChevronRight, Check, History, Layers, Utensils 
} from 'lucide-react';
import { 
  getProfile, getFoodLog, getWorkoutPlan, 
  getProgressEntries, calculateTransparentProgressScore, 
  analyzeNutritionGaps, toggleDayWorkoutComplete, toggleExerciseSetCompletion 
} from '../utils/storage';
import { useToast } from '../context/ToastContext';
import MacroRingChart from '../components/MacroRingChart';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [waterGlasses, setWaterGlasses] = useState(6); // 250ml each

  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();

  // Calculate consumed totals for today
  const totals = todayFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const dayOfWeekIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const todayWorkout = workoutPlan.find((w) => w.dayIndex === dayOfWeekIndex);
  const progressScore = calculateTransparentProgressScore(profile, todayFoods, workoutPlan, progressEntries);
  const gapAnalysis = analyzeNutritionGaps(profile, todayFoods);

  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    if (!todayWorkout) return;
    toggleExerciseSetCompletion(todayWorkout.dayIndex, exerciseId, setIndex);
    setRefreshKey((k) => k + 1);
    showToast('Set updated', 'info');
  };

  const handleToggleWorkoutComplete = () => {
    if (!todayWorkout) return;
    toggleDayWorkoutComplete(todayWorkout.dayIndex);
    setRefreshKey((k) => k + 1);
    if (!todayWorkout.completed) {
      showToast(`Session completed: ${todayWorkout.name}!`, 'success', 'Workout Complete');
    }
  };

  const remainingCalories = Math.round(profile.calorieTarget - totals.calories);
  const caloriePercent = Math.min(100, Math.round((totals.calories / profile.calorieTarget) * 100)) || 0;

  // Meal categories breakdown
  const mealCategories = [
    { key: 'breakfast', name: 'Breakfast', icon: '🌅', color: 'text-amber-400' },
    { key: 'lunch', name: 'Lunch', icon: '☀️', color: 'text-orange-400' },
    { key: 'dinner', name: 'Dinner', icon: '🌙', color: 'text-indigo-400' },
    { key: 'snack', name: 'Snacks & Supps', icon: '🍎', color: 'text-emerald-400' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24 lg:pb-12">
      {/* 1. COMPACT WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded-md border border-[#ccff00]/25">
              PERSONAL DASHBOARD
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400 font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-[#ccff00]">{profile.name}</span>
          </h1>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
            <span>
              Goal: <strong className="text-white capitalize">{profile.goal.replace('_', ' ')}</strong>
            </span>
            <span>•</span>
            <span>
              Target: <strong className="text-white font-mono">{profile.calorieTarget} kcal/day</strong>
            </span>
            <span>•</span>
            <Link to="/profile" className="text-[#ccff00] hover:underline text-[11px]">
              Edit targets →
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to="/food"
            className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Food
          </Link>
          <Link
            to="/coach"
            className="bg-[#12141c] hover:bg-[#1a1d28] text-white border border-white/[0.08] hover:border-[#ccff00]/40 font-bold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#ccff00]" /> Ask Coach
          </Link>
        </div>
      </div>

      {/* 2 & 3. PROMINENT NUTRITION & MACRONUTRIENT HUB */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" /> DAILY NUTRITION BALANCE
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            Maintenance TDEE: {profile.tdee} kcal
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Calorie Radial Ring (5 cols) */}
          <div className="lg:col-span-5 app-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                CALORIC INTAKE
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-white">
                {caloriePercent}% OF GOAL
              </span>
            </div>

            <div className="py-2 flex items-center justify-around">
              <MacroRingChart
                label="Total Energy"
                consumed={totals.calories}
                target={profile.calorieTarget}
                unit="kcal"
                color="#ccff00"
                size={160}
                strokeWidth={12}
                subtitle={remainingCalories >= 0 ? `${remainingCalories} kcal left` : `+${Math.abs(remainingCalories)} kcal surplus`}
              />

              <div className="space-y-3 text-xs font-mono border-l border-white/[0.08] pl-6">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">CONSUMED</span>
                  <span className="text-white font-bold text-base">{Math.round(totals.calories)} kcal</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">TARGET BUDGET</span>
                  <span className="text-zinc-300 font-bold text-sm">{profile.calorieTarget} kcal</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">REMAINING</span>
                  <span className={`font-bold text-sm ${remainingCalories >= 0 ? 'text-[#ccff00]' : 'text-yellow-400'}`}>
                    {remainingCalories >= 0 ? `${remainingCalories} kcal` : `+${Math.abs(remainingCalories)} kcal`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <Link to="/food" className="text-[#ccff00] hover:underline flex items-center gap-1 font-semibold">
                Open Full Food Log <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[11px] text-zinc-500 font-mono">
                {todayFoods.length} items logged
              </span>
            </div>
          </div>

          {/* 4 Separate Macronutrient Cards (7 cols: 2x2 grid) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Protein Card */}
            <div className="app-card rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] block">
                    PROTEIN
                  </span>
                  <span className="text-xs text-zinc-400">Muscle Repair & Satiety</span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded">
                  {Math.round((totals.protein / profile.proteinTargetGrams) * 100)}%
                </span>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-white">
                    {Math.round(totals.protein)}g
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    / {profile.proteinTargetGrams}g target
                  </span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full mt-2 overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-[#ccff00] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totals.protein / profile.proteinTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                {Math.max(0, Math.round(profile.proteinTargetGrams - totals.protein))}g remaining
              </span>
            </div>

            {/* Carbohydrates Card */}
            <div className="app-card rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block">
                    CARBOHYDRATES
                  </span>
                  <span className="text-xs text-zinc-400">Training Glycogen Fuel</span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded">
                  {Math.round((totals.carbs / profile.carbsTargetGrams) * 100)}%
                </span>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-white">
                    {Math.round(totals.carbs)}g
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    / {profile.carbsTargetGrams}g target
                  </span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full mt-2 overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totals.carbs / profile.carbsTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                {Math.max(0, Math.round(profile.carbsTargetGrams - totals.carbs))}g remaining
              </span>
            </div>

            {/* Healthy Fats Card */}
            <div className="app-card rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                    HEALTHY FATS
                  </span>
                  <span className="text-xs text-zinc-400">Hormonal & Joint Support</span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded">
                  {Math.round((totals.fat / profile.fatTargetGrams) * 100)}%
                </span>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-white">
                    {Math.round(totals.fat)}g
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    / {profile.fatTargetGrams}g target
                  </span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full mt-2 overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totals.fat / profile.fatTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                {Math.max(0, Math.round(profile.fatTargetGrams - totals.fat))}g remaining
              </span>
            </div>

            {/* Dietary Fiber Card */}
            <div className="app-card rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block">
                    DIETARY FIBER
                  </span>
                  <span className="text-xs text-zinc-400">Gut Motility & Satiety</span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-2 py-0.5 rounded">
                  {Math.round((totals.fiber / profile.fiberTargetGrams) * 100)}%
                </span>
              </div>

              <div className="my-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-white">
                    {Math.round(totals.fiber)}g
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    / {profile.fiberTargetGrams}g target
                  </span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full mt-2 overflow-hidden border border-white/[0.06]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totals.fiber / profile.fiberTargetGrams) * 100)}%` }}
                  />
                </div>
              </div>

              <span className="text-[11px] font-mono text-zinc-400">
                {Math.max(0, Math.round(profile.fiberTargetGrams - totals.fiber))}g remaining
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLEAN DAILY MEAL OVERVIEW WITH QUICK-ADD */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#ccff00]" /> TODAY'S MEAL BREAKDOWN
          </h2>
          <Link to="/food" className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1">
            Manage All Meals <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealCategories.map((meal) => {
            const mealFoods = todayFoods.filter((f) => f.meal === meal.key);
            const mealCals = mealFoods.reduce((acc, f) => acc + f.calories, 0);
            const mealProt = mealFoods.reduce((acc, f) => acc + f.protein, 0);

            return (
              <div key={meal.key} className="app-card rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.14] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meal.icon}</span>
                      <h3 className="font-bold text-sm text-white">{meal.name}</h3>
                    </div>
                    <Link
                      to={`/food?add=${meal.key}`}
                      className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-[#ccff00] hover:text-black text-zinc-300 flex items-center justify-center transition-colors"
                      title={`Add food to ${meal.name}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="text-xs font-mono text-zinc-300 mb-3">
                    <span className="font-bold text-white text-base">{mealCals}</span> kcal • <span className="text-[#ccff00]">{mealProt.toFixed(1)}g P</span>
                  </div>

                  <div className="space-y-1.5 min-h-[48px]">
                    {mealFoods.length === 0 ? (
                      <span className="text-[11px] text-zinc-500 italic block">No items logged yet</span>
                    ) : (
                      mealFoods.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-[11px] text-zinc-300 flex items-center justify-between truncate">
                          <span className="truncate">{item.name}</span>
                          <span className="text-zinc-500 font-mono shrink-0 ml-1.5">{item.calories}kcal</span>
                        </div>
                      ))
                    )}
                    {mealFoods.length > 2 && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        +{mealFoods.length - 2} more items
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] mt-3">
                  <Link
                    to="/food"
                    className="text-[11px] text-zinc-400 hover:text-[#ccff00] font-semibold flex items-center justify-between"
                  >
                    <span>View items ({mealFoods.length})</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5, 6 & 7: WORKOUT CARD + PROGRESS GAUGE + WEEKLY CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Today's Workout Card (7 cols) */}
        <div className="lg:col-span-7 app-card-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-0.5">
                SESSION OF THE DAY
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white uppercase tracking-tight">
                {todayWorkout ? todayWorkout.name : 'Rest Day'}
              </h2>
              <span className="text-xs text-zinc-400 font-mono">
                {todayWorkout?.isRestDay ? 'Scheduled active recovery & joint mobility' : todayWorkout?.targetFocus}
              </span>
            </div>

            {todayWorkout && !todayWorkout.isRestDay && (
              <button
                onClick={handleToggleWorkoutComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 self-start sm:self-auto ${
                  todayWorkout.completed
                    ? 'bg-zinc-800 text-[#ccff00] border border-[#ccff00]/40'
                    : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{todayWorkout.completed ? 'SESSION COMPLETED' : 'START / COMPLETE'}</span>
              </button>
            )}
          </div>

          {todayWorkout && !todayWorkout.isRestDay ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400 bg-black/40 px-3.5 py-2 rounded-xl border border-white/[0.04]">
                <span>Duration: <strong className="text-white">{todayWorkout.durationMinutes} mins</strong></span>
                <span>{todayWorkout.exercises.length} prescribed movements</span>
              </div>

              {/* Exercise Items with interactive set pills */}
              <div className="space-y-2.5">
                {todayWorkout.exercises.map((exercise) => {
                  const allDone = exercise.completedSets.every(Boolean);

                  return (
                    <div
                      key={exercise.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        allDone ? 'bg-white/[0.02] border-white/[0.04] opacity-75' : 'bg-white/[0.04] border-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#ccff00] uppercase font-bold block">
                            {exercise.targetMuscle}
                          </span>
                          <h4 className="font-bold text-sm text-white">{exercise.name}</h4>
                        </div>
                        <span className="text-xs font-mono text-zinc-300 bg-black/50 px-2 py-0.5 rounded border border-white/[0.06]">
                          {exercise.sets} × {exercise.reps} {exercise.weightKg ? `@ ${exercise.weightKg}kg` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">SETS:</span>
                        {exercise.completedSets.map((done, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleToggleSet(exercise.id, sIdx)}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                              done
                                ? 'bg-[#ccff00] text-black shadow-[0_0_8px_rgba(204,255,0,0.3)]'
                                : 'bg-[#1a1d26] text-zinc-400 hover:text-white'
                            }`}
                            title="Click to toggle set completed"
                          >
                            S{sIdx + 1} {done ? '✓' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/workouts"
                  className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1"
                >
                  Edit routine in Workout Planner <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-black/30 rounded-2xl border border-white/[0.06]">
              <span className="text-3xl block mb-2">🌿</span>
              <h4 className="font-bold text-white text-base">Active Rest & Recovery</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                Your muscles rebuild and replenish energy stores today. Take a relaxing walk or focus on clean hydration.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Progress Score + Weekly Strip + Water (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 6. Fitness Progress Score Card */}
          <div className="app-card rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
                  TRANSPARENT METRICS
                </span>
                <h3 className="text-lg font-black font-heading text-white">
                  FITNESS PROGRESS SCORE
                </h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black font-mono text-[#ccff00]">
                  {progressScore.totalScore}
                </span>
                <span className="text-zinc-500 text-xs font-mono">/100</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {progressScore.summary}
            </p>

            <div className="space-y-2 border-t border-white/[0.06] pt-3 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Workout Consistency (30%):</span>
                <span className="text-white font-bold">{progressScore.workoutConsistencyScore}/30</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Nutrition & Protein (30%):</span>
                <span className="text-white font-bold">{progressScore.nutritionAdherenceScore}/30</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Recovery & Sleep (20%):</span>
                <span className="text-white font-bold">{progressScore.recoveryScore}/20</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Logging Habit (20%):</span>
                <span className="text-white font-bold">{progressScore.loggingHabitScore}/20</span>
              </div>
            </div>

            <Link
              to="/progress"
              className="mt-2 text-center block w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold uppercase tracking-wider text-zinc-200 rounded-xl transition-colors"
            >
              View Full Progress Assessment →
            </Link>
          </div>

          {/* 7. Compact Weekly Workout Calendar */}
          <div className="app-card rounded-3xl p-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-white uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#ccff00]" /> 7-DAY SCHEDULE
              </span>
              <span className="text-zinc-500">MON — SUN</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {workoutPlan.map((day) => {
                const isToday = day.dayIndex === dayOfWeekIndex;
                return (
                  <div
                    key={day.id}
                    className={`p-2 rounded-xl border text-xs transition-all ${
                      isToday
                        ? 'border-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_10px_rgba(204,255,0,0.15)]'
                        : 'border-white/[0.06] bg-black/40'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block mb-1">
                      {day.dayName.substring(0, 3)}
                    </span>
                    <div className="flex items-center justify-center">
                      {day.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00]" />
                      ) : day.isRestDay ? (
                        <span className="text-[9px] text-zinc-600 font-bold">REST</span>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hydration Tracker */}
          <div className="app-card rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">HYDRATION LOG</span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {waterGlasses * 250} ml / 2,500 ml target ({waterGlasses} glasses)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setWaterGlasses((g) => Math.max(0, g - 1))}
                className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white flex items-center justify-center text-xs font-bold"
              >
                -
              </button>
              <button
                onClick={() => {
                  setWaterGlasses((g) => g + 1);
                  showToast('+250ml water logged', 'info');
                }}
                className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. RECENT ACTIVITY FEED */}
      <section className="app-card rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
            <History className="w-4 h-4 text-[#ccff00]" /> RECENT ACTIVITY LOG
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Real recorded data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Foods recorded today */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">
              TODAY'S FOOD ENTRIES
            </span>
            {todayFoods.length === 0 ? (
              <span className="text-xs text-zinc-500 italic">No food logged yet today</span>
            ) : (
              todayFoods.slice(-4).map((f) => (
                <div key={f.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.04] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-semibold block">{f.name}</span>
                    <span className="text-zinc-500 text-[10px] font-mono">{f.portion} • {f.meal}</span>
                  </div>
                  <span className="font-mono text-[#ccff00] font-bold">{f.calories} kcal</span>
                </div>
              ))
            )}
          </div>

          {/* Workout & Check-In History */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block">
              LATEST CHECK-IN & SESSIONS
            </span>
            {progressEntries.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.04] flex items-center justify-between text-xs">
                <div>
                  <span className="text-white font-semibold block">Body Weight: {p.weightKg} kg</span>
                  <span className="text-zinc-500 text-[10px] font-mono">Date: {p.date} • Energy: {p.energyLevel}/10</span>
                </div>
                <span className="text-zinc-400 font-mono text-[11px]">{p.sleepHours}h sleep</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
