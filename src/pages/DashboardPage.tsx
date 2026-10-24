import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Dumbbell, Sparkles, Plus, CheckCircle2, 
  ArrowRight, Activity, Calendar, Trophy, AlertTriangle, 
  ChevronRight, Droplets, Target, ShieldCheck 
} from 'lucide-react';
import { 
  getProfile, getFoodLog, getWorkoutPlan, 
  getProgressEntries, calculateTransparentProgressScore, 
  analyzeNutritionGaps, toggleDayWorkoutComplete, toggleExerciseSetCompletion 
} from '../utils/storage';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [waterGlasses, setWaterGlasses] = useState(6); // 250ml each

  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();

  // Calculated totals for today
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
    showToast('Exercise set updated', 'info');
  };

  const handleToggleWorkoutComplete = () => {
    if (!todayWorkout) return;
    toggleDayWorkoutComplete(todayWorkout.dayIndex);
    setRefreshKey((k) => k + 1);
    if (!todayWorkout.completed) {
      showToast(`Great job! ${todayWorkout.name} marked as complete!`, 'success', 'Workout Completed');
    }
  };

  const remainingCalories = Math.round(profile.calorieTarget - totals.calories);
  const caloriePercent = Math.min(100, Math.round((totals.calories / profile.calorieTarget) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((totals.protein / profile.proteinTargetGrams) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((totals.carbs / profile.carbsTargetGrams) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((totals.fat / profile.fatTargetGrams) * 100)) || 0;
  const fiberPercent = Math.min(100, Math.round((totals.fiber / profile.fiberTargetGrams) * 100)) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Greeting & Goal Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#101507] to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#ccff00]/15 text-[#ccff00] px-2.5 py-0.5 rounded border border-[#ccff00]/40">
              PERSONAL DASHBOARD
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            WELCOME BACK, <span className="text-[#ccff00]">{profile.name}</span>
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-xl">
            Goal: <strong className="text-white uppercase">{profile.goal.replace('_', ' ')}</strong> ({profile.calorieTarget} kcal/day target) • {profile.trainingDaysPerWeek} training days/week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/coach"
            className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" /> ASK AI COACH
          </Link>
          <Link
            to="/food"
            className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#ccff00]" /> LOG FOOD
          </Link>
        </div>
      </div>

      {/* MACRONUTRIENT & CALORIE SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Calories Card (2 cols on lg) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" /> DAILY ENERGY BUDGET
              </span>
              <span className="text-xs font-mono font-bold text-[#ccff00]">
                {caloriePercent}% CONSUMED
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-black font-heading text-white">
                {Math.round(totals.calories)}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ {profile.calorieTarget} kcal</span>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              {remainingCalories >= 0 ? (
                <>
                  <strong className="text-white font-mono">{remainingCalories} kcal</strong> remaining for today.
                </>
              ) : (
                <>
                  <strong className="text-yellow-400 font-mono">+{Math.abs(remainingCalories)} kcal</strong> above daily target.
                </>
              )}
            </p>
          </div>

          <div>
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-[#ccff00] rounded-full transition-all duration-500"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-1.5">
              <span>0 kcal</span>
              <span>Maintenance TDEE: {profile.tdee}</span>
              <span>{profile.calorieTarget} kcal</span>
            </div>
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">PROTEIN</span>
              <span className="text-[10px] font-mono text-[#ccff00] font-bold">{proteinPercent}%</span>
            </div>
            <div className="text-2xl font-black font-heading text-white mb-0.5">
              {Math.round(totals.protein)}<span className="text-xs font-normal text-zinc-400"> / {profile.proteinTargetGrams}g</span>
            </div>
            <span className="text-[11px] text-zinc-400 block mb-3">Muscle synthesis & repair</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-[#ccff00] rounded-full" style={{ width: `${proteinPercent}%` }} />
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">CARBOHYDRATES</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">{carbsPercent}%</span>
            </div>
            <div className="text-2xl font-black font-heading text-white mb-0.5">
              {Math.round(totals.carbs)}<span className="text-xs font-normal text-zinc-400"> / {profile.carbsTargetGrams}g</span>
            </div>
            <span className="text-[11px] text-zinc-400 block mb-3">Training glycogen fuel</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${carbsPercent}%` }} />
          </div>
        </div>

        {/* Fats & Fiber Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">FATS & FIBER</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">{fatPercent}%</span>
            </div>
            <div className="text-2xl font-black font-heading text-white mb-0.5">
              {Math.round(totals.fat)}g <span className="text-xs font-normal text-zinc-400">Fat</span>
            </div>
            <div className="text-xs text-zinc-300 font-mono mb-3">
              Fiber: <strong className="text-emerald-400">{Math.round(totals.fiber)}g</strong> / {profile.fiberTargetGrams}g
            </div>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${fatPercent}%` }} />
          </div>
        </div>
      </div>

      {/* TODAY'S WORKOUT & WEEKLY PROGRESS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Today's Scheduled Workout (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
                TODAY'S SCHEDULED SESSION
              </span>
              <h2 className="text-2xl font-black font-heading text-white uppercase tracking-tight mt-0.5">
                {todayWorkout ? todayWorkout.name : 'Rest Day'}
              </h2>
            </div>

            {todayWorkout && !todayWorkout.isRestDay && (
              <button
                onClick={handleToggleWorkoutComplete}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  todayWorkout.completed
                    ? 'bg-zinc-900 text-[#ccff00] border border-[#ccff00]/40'
                    : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{todayWorkout.completed ? 'COMPLETED' : 'MARK COMPLETE'}</span>
              </button>
            )}
          </div>

          {todayWorkout ? (
            todayWorkout.isRestDay ? (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 text-center py-10">
                <Activity className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white font-heading">SCHEDULED ACTIVE RECOVERY</h3>
                <p className="text-zinc-400 text-xs max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                  Your central nervous system adapts and grows while resting. Prioritize hydration, 8 hours of sleep, and an optional 20-minute light mobility walk.
                </p>
                <Link
                  to="/workouts"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#ccff00] hover:underline"
                >
                  View full weekly training split <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-900/80 px-4 py-2.5 rounded-xl border border-zinc-800">
                  <span>Target: <strong className="text-white">{todayWorkout.targetFocus}</strong></span>
                  <span>Estimated Duration: <strong className="text-[#ccff00] font-mono">{todayWorkout.durationMinutes} mins</strong></span>
                </div>

                {/* Exercise List with Interactive Set Checkboxes */}
                <div className="space-y-3">
                  {todayWorkout.exercises.map((exercise) => {
                    const allSetsDone = exercise.completedSets.every(Boolean);
                    return (
                      <div
                        key={exercise.id}
                        className={`p-4 rounded-xl border transition-all ${
                          allSetsDone
                            ? 'bg-zinc-900/40 border-zinc-800/60 opacity-80'
                            : 'bg-zinc-900 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">
                              {exercise.targetMuscle}
                            </span>
                            <h4 className="font-bold text-sm text-white">{exercise.name}</h4>
                          </div>
                          <span className="text-xs font-mono text-zinc-300 bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
                            {exercise.sets} sets × {exercise.reps} {exercise.weightKg ? `@ ${exercise.weightKg}kg` : ''}
                          </span>
                        </div>

                        {/* Interactive set pills */}
                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/70">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono mr-1">SETS:</span>
                          {exercise.completedSets.map((done, setIdx) => (
                            <button
                              key={setIdx}
                              onClick={() => handleToggleSet(exercise.id, setIdx)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                                done
                                  ? 'bg-[#ccff00] text-black shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                              title={`Click to mark set ${setIdx + 1} complete`}
                            >
                              S{setIdx + 1} {done ? '✓' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 text-right">
                  <Link
                    to="/workouts"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#ccff00] hover:underline"
                  >
                    Edit exercises & rest timers in Workout Planner <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="text-zinc-500 text-xs py-8 text-center">No workout data found for today.</div>
          )}
        </div>

        {/* Right Column: Weekly Consistency & Habit Progress (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Progress Score Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
                  ADHERENCE RATING
                </span>
                <h3 className="text-xl font-black font-heading text-white">
                  FITNESS PROGRESS SCORE
                </h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black font-heading text-[#ccff00] font-mono">
                  {progressScore.totalScore}
                </span>
                <span className="text-zinc-500 text-xs">/100</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {progressScore.summary}
            </p>

            <div className="space-y-2 border-t border-zinc-800 pt-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Workout Frequency:</span>
                <span className="text-white font-mono font-bold">{progressScore.workoutConsistencyScore}/30 pts</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Nutrition & Protein Targets:</span>
                <span className="text-white font-mono font-bold">{progressScore.nutritionAdherenceScore}/30 pts</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Recovery & Energy Balance:</span>
                <span className="text-white font-mono font-bold">{progressScore.recoveryScore}/20 pts</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Habit Logging Consistency:</span>
                <span className="text-white font-mono font-bold">{progressScore.loggingHabitScore}/20 pts</span>
              </div>
            </div>

            <Link
              to="/progress"
              className="mt-4 inline-flex items-center justify-center w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-200 rounded-xl transition-colors"
            >
              View Full Progress Assessment →
            </Link>
          </div>

          {/* 7-Day Weekly Training Schedule Mini Matrix */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ccff00]" /> 7-DAY WEEKLY SCHEDULE
              </span>
              <span className="text-[10px] font-mono text-zinc-500">MON — SUN</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {workoutPlan.map((day) => {
                const isToday = day.dayIndex === dayOfWeekIndex;
                return (
                  <div
                    key={day.id}
                    className={`p-2 rounded-xl border text-xs transition-all ${
                      isToday
                        ? 'border-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_12px_rgba(204,255,0,0.15)]'
                        : 'border-zinc-800/80 bg-zinc-900/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-zinc-400 block mb-1">
                      {day.dayName.substring(0, 3)}
                    </span>
                    <div className="flex items-center justify-center">
                      {day.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                      ) : day.isRestDay ? (
                        <span className="text-[10px] text-zinc-600 font-bold">REST</span>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Water Tracker */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">HYDRATION LOG</span>
                <span className="text-[11px] text-zinc-400">
                  {waterGlasses * 250} ml / 2,500 ml target ({waterGlasses} glasses)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setWaterGlasses((g) => Math.max(0, g - 1))}
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center text-sm font-bold"
              >
                -
              </button>
              <button
                onClick={() => {
                  setWaterGlasses((g) => g + 1);
                  showToast('+250ml water logged', 'info');
                }}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NUTRITION GAP ALERTS & COMPLEMENTARY FOOD SUGGESTIONS */}
      {gapAnalysis.gaps.length > 0 && (
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
                <AlertTriangle className="w-4 h-4" /> NUTRITION GAP ANALYSIS
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                NUTRIENT TARGETS STILL NEEDED TODAY
              </h3>
            </div>
            <Link
              to="/food"
              className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1"
            >
              Open Full Food Tracker <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {gapAnalysis.gaps.map((gap, i) => (
              <div key={i} className="bg-black/60 p-4 rounded-xl border border-zinc-800 text-xs space-y-1">
                <div className="flex justify-between font-bold text-white uppercase font-mono">
                  <span>{gap.nutrient}</span>
                  <span className="text-yellow-400">+{gap.remaining}{gap.nutrient === 'calories' ? ' kcal' : 'g'} needed</span>
                </div>
                <p className="text-zinc-400">{gap.message}</p>
              </div>
            ))}
          </div>

          {/* Practical Food Suggestions */}
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider block mb-3">
              SUGGESTED COMPLEMENTARY FOODS (BASED ON YOUR {profile.dietType.toUpperCase()} DIET & {profile.budget.toUpperCase()} BUDGET):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {gapAnalysis.suggestedFoods.map((food, i) => (
                <div key={i} className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 text-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#ccff00] block">{food.category}</span>
                    <h5 className="font-bold text-white text-sm mt-0.5">{food.name}</h5>
                    <span className="text-zinc-400 text-[11px] block">{food.defaultPortion}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-800/80 text-[11px] font-mono">
                    <span className="text-zinc-300">{food.calories} kcal</span>
                    <span className="text-[#ccff00] font-bold">{food.protein}g protein</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
