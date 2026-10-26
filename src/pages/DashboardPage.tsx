import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Droplets, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  ChevronDown, 
  Footprints, 
  Clock, 
  CheckCircle2, 
  Dumbbell,
  Lightbulb,
  Sun,
  Moon,
  Apple,
  UtensilsCrossed,
  Wheat,
  Info,
  X
} from 'lucide-react';
import { NutriCoachSymbol } from '../components/NutriCoachLogo';
import { 
  getProfile, 
  getFoodLog, 
  getWorkoutPlan, 
  getProgressEntries, 
  calculateTransparentProgressScore, 
  toggleDayWorkoutComplete, 
  toggleExerciseSetCompletion 
} from '../utils/storage';
import { useToast } from '../context/ToastContext';

// Import local photography matching the reference design
import grainBowlImg from '../assets/food/grain-bowl.jpg';
import breakfastImg from '../assets/food/breakfast.jpg';
import lunchImg from '../assets/food/lunch.jpg';
import dinnerImg from '../assets/food/dinner.jpg';
import snackImg from '../assets/food/snack.jpg';

export default function DashboardPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [, setRefreshKey] = useState(0);

  // Hydration state (persisted in localStorage)
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    const saved = localStorage.getItem('nutricoach_hydration_today');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Tip Modal State
  const [showTipModal, setShowTipModal] = useState(false);
  // Workout Drawer/Modal State for quick completion
  const [showWorkoutSection, setShowWorkoutSection] = useState(false);

  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();

  // Calculate consumed totals
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

  // If user hasn't logged food yet today, use realistic baseline placeholder values for visualization matching the mock
  const displayCalories = totals.calories > 0 ? totals.calories : 1320;
  const targetCalories = profile.calorieTarget || 1750;
  const remainingCalories = Math.max(0, targetCalories - displayCalories);
  const caloriePercent = Math.min(100, Math.round((displayCalories / targetCalories) * 100));

  // Macro targets (derived from profile calories or standard 40/30/30 split)
  const targetProtein = profile.proteinTargetGrams || 120;
  const targetCarbs = profile.carbsTargetGrams || 250;
  const targetFat = profile.fatTargetGrams || 70;
  const targetFiber = profile.fiberTargetGrams || 30;

  const displayProtein = totals.protein > 0 ? totals.protein : 72;
  const displayCarbs = totals.carbs > 0 ? totals.carbs : 145;
  const displayFat = totals.fat > 0 ? totals.fat : 42;
  const displayFiber = totals.fiber > 0 ? totals.fiber : 14;

  const proteinPct = Math.min(100, Math.round((displayProtein / targetProtein) * 100));
  const carbsPct = Math.min(100, Math.round((displayCarbs / targetCarbs) * 100));
  const fatPct = Math.min(100, Math.round((displayFat / targetFat) * 100));
  const fiberPct = Math.min(100, Math.round((displayFiber / targetFiber) * 100));

  // Today's workout
  const dayOfWeekIndex = (new Date().getDay() + 6) % 7;
  const todayWorkout = workoutPlan.find((w) => w.dayIndex === dayOfWeekIndex);
  const progressScore = calculateTransparentProgressScore(profile, todayFoods, workoutPlan, progressEntries);

  // Water logging handler
  const handleLogWater = () => {
    const next = Math.min(12, waterGlasses + 1);
    setWaterGlasses(next);
    localStorage.setItem('nutricoach_hydration_today', next.toString());
    showToast(`Hydration logged: ${next} of 8 glasses! 💧`, 'success', 'Hydration Updated');
  };

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
      showToast(`Great work! ${todayWorkout.name} completed.`, 'success', 'Workout Complete');
    }
  };

  // SVG Radial Ring calculation
  const ringRadius = 58;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const calorieStrokeDashoffset = ringCircumference - (caloriePercent / 100) * ringCircumference;

  // Hydration Radial Ring calculation
  const waterRadius = 38;
  const waterCircumference = 2 * Math.PI * waterRadius;
  const waterPercent = Math.min(100, Math.round((waterGlasses / 8) * 100));
  const waterStrokeDashoffset = waterCircumference - (waterPercent / 100) * waterCircumference;

  // Activity 7-day data points for SVG line chart
  const activityData = [
    { day: 'Oct 19', value: 750, x: 20, y: 75 },
    { day: 'Oct 20', value: 920, x: 70, y: 65 },
    { day: 'Oct 21', value: 810, x: 120, y: 72 },
    { day: 'Oct 22', value: 1100, x: 170, y: 55 },
    { day: 'Oct 23', value: 1350, x: 220, y: 45 },
    { day: 'Oct 24', value: 1180, x: 270, y: 52 },
    { day: 'Oct 25', value: 1650, x: 320, y: 25 },
  ];
  const pointsString = activityData.map(d => `${d.x},${d.y}`).join(' ');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      
      {/* ========================================================= */}
      {/* ROW 1: DAILY WELLNESS TIP (65%) + CALORIES RING (35%)     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Daily Wellness Tip Card (8 cols on lg) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#eaf4e6] via-[#f3f9f0] to-[#e4f0e0] dark:from-[#212B22] dark:via-[#263128] dark:to-[#1F2821] border border-[#d6ebd0] dark:border-[#384639] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs group">
          {/* Subtle decorative folded-leaf N symbol watermark */}
          <div className="absolute top-2 right-1/3 opacity-15 pointer-events-none select-none">
            <NutriCoachSymbol className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-md space-y-3.5 text-left">
              {/* Tip Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#272E29]/90 border border-[#d2e7cc] dark:border-[#394139] text-[11px] font-bold text-[#3b7e23] dark:text-[#8BAF78] shadow-xs">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Daily Wellness Tip</span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight leading-snug">
                Eat more whole foods,<br />less processed foods.
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-relaxed">
                Whole foods give you more nutrients, fiber and long-lasting energy.
              </p>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowTipModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5ba83c] dark:bg-[#8BAF78] hover:bg-[#4d9630] dark:hover:bg-[#7a9d68] text-white dark:text-[#192418] text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Circular Grain Bowl Hero Photography */}
            <div className="relative shrink-0 w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center">
              {/* Outer soft glow ring */}
              <div className="absolute inset-0 rounded-full bg-white/40 dark:bg-[#272E29]/40 blur-sm transform scale-105" />
              <img
                src={grainBowlImg}
                alt="Nutritious grain bowl with avocado, chickpeas, and fresh greens"
                className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white dark:border-[#272E29] transition-transform duration-500 group-hover:scale-102"
              />
            </div>
          </div>
        </div>

        {/* Calories Donut Card (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-extrabold text-[#192418]">Calories</h3>
            <span className="text-[11px] font-bold text-[#7a8c79] uppercase tracking-wider">
              Today
            </span>
          </div>

          {/* Donut Chart & Side Legends */}
          <div className="flex items-center justify-between gap-4 my-auto py-2">
            {/* Circular SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  className="stroke-[#edf2ea] dark:stroke-[#394139]"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Foreground Progress Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  className="stroke-[#5ba83c] dark:stroke-[#8BAF78] transition-all duration-700 ease-out"
                  strokeWidth="12"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={calorieStrokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#192418] tracking-tight leading-none">
                  {displayCalories.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#7a8c79] mt-0.5 uppercase tracking-wide">
                  kcal
                </span>
                <span className="text-[10px] font-medium text-[#8e9f8e] mt-0.5">
                  of {targetCalories.toLocaleString()} kcal
                </span>
              </div>
            </div>

            {/* Right Side Stats */}
            <div className="flex flex-col justify-center gap-3.5 text-xs">
              {/* Remaining */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-[#7a8c79] block">
                    Remaining
                  </span>
                  <span className="text-sm font-extrabold text-[#192418] leading-tight">
                    {remainingCalories.toLocaleString()} kcal
                  </span>
                </div>
              </div>

              {/* Food dot */}
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#f0f4ee]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5ba83c]" />
                  <span className="text-[#5e6f5e] font-medium">Food</span>
                </div>
                <span className="font-bold text-[#192418]">
                  {displayCalories.toLocaleString()} kcal
                </span>
              </div>

              {/* Exercise dot */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a3b89f]" />
                  <span className="text-[#5e6f5e] font-medium">Exercise</span>
                </div>
                <span className="font-bold text-[#192418]">
                  {todayWorkout?.completed ? '412 kcal' : '0 kcal'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link
              to="/food"
              className="text-[11px] font-bold text-[#5ba83c] hover:text-[#45812e] transition-colors"
            >
              Log more food →
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* ROW 2: DAILY ACTIVITY (38%) + MACROS (38%) + WATER (24%)  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* 1. Daily Activity Card (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-[#e8ede6] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-[#192418]">Daily Activity</h3>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] font-bold text-[#5e6f5e] hover:text-[#192418] px-2.5 py-1 rounded-xl bg-[#f6f8f5] border border-[#e8ede6] transition-colors"
            >
              <span>Last 7 days</span>
              <ChevronDown className="w-3 h-3 text-[#7a8c79]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Activity SVG Trend Chart (7 cols) */}
            <div className="sm:col-span-7 flex flex-col">
              <div className="relative w-full h-32 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 100">
                  {/* Subtle horizontal grid lines */}
                  <line x1="0" y1="20" x2="340" y2="20" stroke="currentColor" className="text-[#f0f4ee] dark:text-[#394139]" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="340" y2="50" stroke="currentColor" className="text-[#f0f4ee] dark:text-[#394139]" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="340" y2="80" stroke="currentColor" className="text-[#f0f4ee] dark:text-[#394139]" strokeDasharray="3 3" />

                  {/* Gradient Area under line */}
                  <defs>
                    <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8BAF78" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#8BAF78" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`20,100 ${pointsString} 320,100`}
                    fill="url(#activityGrad)"
                  />

                  {/* Activity Green Polyline */}
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                    className="text-[#5ba83c] dark:text-[#8BAF78]"
                  />

                  {/* Circular Nodes */}
                  {activityData.map((d, i) => (
                    <circle
                      key={i}
                      cx={d.x}
                      cy={d.y}
                      r="4"
                      className="fill-white dark:fill-[#272E29] stroke-[#5ba83c] dark:stroke-[#8BAF78] stroke-2 hover:r-5 transition-all cursor-pointer"
                    />
                  ))}
                </svg>
              </div>

              {/* X-axis Day labels */}
              <div className="flex justify-between text-[9px] font-medium text-[#8e9f8e] mt-2 px-1">
                {activityData.map((d, i) => (
                  <span key={i} className={i === 6 ? 'font-bold text-[#192418]' : ''}>
                    {d.day}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity Right Stats List (5 cols) */}
            <div className="sm:col-span-5 flex flex-col justify-center gap-3 pl-0 sm:pl-3 border-t sm:border-t-0 sm:border-l border-[#f0f4ee] pt-3 sm:pt-0">
              {/* Steps */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#eef7eb] flex items-center justify-center text-[#5ba83c] shrink-0">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7a8c79] font-medium block">
                    Steps
                  </span>
                  <span className="text-xs font-black text-[#192418]">
                    6,842
                  </span>
                </div>
              </div>

              {/* Active Minutes */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7a8c79] font-medium block">
                    Active Minutes
                  </span>
                  <span className="text-xs font-black text-[#192418]">
                    32 min
                  </span>
                </div>
              </div>

              {/* Calories Burned */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                  <Flame className="w-4 h-4 fill-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] text-[#7a8c79] font-medium block">
                    Calories Burned
                  </span>
                  <span className="text-xs font-black text-[#192418]">
                    412 kcal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Macronutrients Card (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-[#e8ede6] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-[#192418]">Macronutrients</h3>
            <Link
              to="/food"
              className="text-[11px] font-bold text-[#5e6f5e] hover:text-[#5ba83c] transition-colors"
            >
              View details →
            </Link>
          </div>

          {/* 4 Pastel Progress Rows */}
          <div className="space-y-3.5 my-auto">
            {/* Protein: Pastel Coral */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[#192418]">Protein</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#7a8c79] text-[11px]">
                    {displayProtein} / {targetProtein}g
                  </span>
                  <span className="font-bold text-[#192418] text-[11px] w-8 text-right">
                    {proteinPct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#f6f8f5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#fb7185] rounded-full transition-all duration-500"
                  style={{ width: `${proteinPct}%` }}
                />
              </div>
            </div>

            {/* Carbs: Pastel Amber */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                    <Wheat className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[#192418]">Carbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#7a8c79] text-[11px]">
                    {displayCarbs} / {targetCarbs}g
                  </span>
                  <span className="font-bold text-[#192418] text-[11px] w-8 text-right">
                    {carbsPct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#f6f8f5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f59e0b] rounded-full transition-all duration-500"
                  style={{ width: `${carbsPct}%` }}
                />
              </div>
            </div>

            {/* Fats: Pastel Blue */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[#192418]">Fats</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#7a8c79] text-[11px]">
                    {displayFat} / {targetFat}g
                  </span>
                  <span className="font-bold text-[#192418] text-[11px] w-8 text-right">
                    {fatPct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#f6f8f5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38bdf8] rounded-full transition-all duration-500"
                  style={{ width: `${fatPct}%` }}
                />
              </div>
            </div>

            {/* Fiber: Pastel Mint */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Apple className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[#192418]">Fiber</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#7a8c79] text-[11px]">
                    {displayFiber} / {targetFiber}g
                  </span>
                  <span className="font-bold text-[#192418] text-[11px] w-8 text-right">
                    {fiberPct}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#f6f8f5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                  style={{ width: `${fiberPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hydration Card (3 cols on lg) */}
        <div className="lg:col-span-3 bg-white border border-[#e8ede6] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-extrabold text-[#192418]">Hydration</h3>
            <span className="text-[11px] font-bold text-[#5e6f5e] cursor-pointer hover:text-[#5ba83c]">
              View details →
            </span>
          </div>

          {/* Hydration Donut Gauge */}
          <div className="flex flex-col items-center justify-center text-center my-auto py-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={waterRadius}
                  className="stroke-[#edf4fc] dark:stroke-[#394139]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={waterRadius}
                  className="stroke-[#38bdf8] transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray={waterCircumference}
                  strokeDashoffset={waterStrokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[#192418] dark:text-[#E8EDE7] leading-none">
                  {waterGlasses}<span className="text-sm font-bold text-[#7a8c79] dark:text-[#A2AAA1]"> / 8</span>
                </span>
                <span className="text-[10px] font-medium text-[#7a8c79] dark:text-[#A2AAA1] mt-1">
                  glasses
                </span>
              </div>
            </div>

            {/* Motivational message */}
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#192418] dark:text-[#E8EDE7]">
              <Droplets className="w-3.5 h-3.5 text-[#38bdf8] fill-[#38bdf8]" />
              <span>You're doing great!</span>
            </div>
            <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">Keep it up!</span>
          </div>

          {/* + Log Water Button */}
          <button
            type="button"
            onClick={handleLogWater}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#eef7eb] hover:bg-[#e2f2dd] text-[#3b7e23] dark:bg-[#2F3931] dark:hover:bg-[#38463B] dark:text-[#8BAF78] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Water</span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* ROW 3: TODAY'S MEALS (65%) + AI COACH & QUOTE (35%)       */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Today's Meals Section (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#192418]">Today's Meals</h3>
            <Link
              to="/food"
              className="text-xs font-bold text-[#5e6f5e] hover:text-[#5ba83c] transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Breakfast Card */}
            <div className="bg-white border border-[#e8ede6] rounded-[24px] p-4 flex flex-col justify-between shadow-xs hover:border-[#d6e2d3] transition-all group">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#192418]">
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Breakfast</span>
                </div>
                <p className="text-[11px] text-[#5e6f5e] font-medium mt-1 truncate">
                  Oats, Banana, Almonds
                </p>
                <div className="text-[10px] font-bold text-[#7a8c79] mt-0.5">
                  398 kcal • 21g P
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <img
                  src={breakfastImg}
                  alt="Healthy breakfast"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => navigate('/food?meal=breakfast')}
                  className="w-8 h-8 rounded-full bg-[#5ba83c] hover:bg-[#4d9630] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="Add food to Breakfast"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Lunch Card */}
            <div className="bg-white border border-[#e8ede6] rounded-[24px] p-4 flex flex-col justify-between shadow-xs hover:border-[#d6e2d3] transition-all group">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#192418]">
                  <Sun className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>Lunch</span>
                </div>
                <p className="text-[11px] text-[#5e6f5e] font-medium mt-1 truncate">
                  Grilled Chicken, Brown Rice, Veggies
                </p>
                <div className="text-[10px] font-bold text-[#7a8c79] mt-0.5">
                  445 kcal • 35g P
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <img
                  src={lunchImg}
                  alt="Nutritious lunch"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => navigate('/food?meal=lunch')}
                  className="w-8 h-8 rounded-full bg-[#5ba83c] hover:bg-[#4d9630] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="Add food to Lunch"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Dinner Card */}
            <div className="bg-white border border-[#e8ede6] rounded-[24px] p-4 flex flex-col justify-between shadow-xs hover:border-[#d6e2d3] transition-all group">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#192418]">
                  <Moon className="w-4 h-4 text-sky-500 fill-sky-500" />
                  <span>Dinner</span>
                </div>
                <p className="text-[11px] text-[#5e6f5e] font-medium mt-1 truncate">
                  Fish, Quinoa, Salad
                </p>
                <div className="text-[10px] font-bold text-[#7a8c79] mt-0.5">
                  520 kcal • 42g P
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <img
                  src={dinnerImg}
                  alt="Delicious dinner"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => navigate('/food?meal=dinner')}
                  className="w-8 h-8 rounded-full bg-[#5ba83c] hover:bg-[#4d9630] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="Add food to Dinner"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Snacks Card */}
            <div className="bg-white border border-[#e8ede6] rounded-[24px] p-4 flex flex-col justify-between shadow-xs hover:border-[#d6e2d3] transition-all group">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#192418]">
                  <Apple className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Snacks</span>
                </div>
                <p className="text-[11px] text-[#5e6f5e] font-medium mt-1 truncate">
                  Greek Yogurt, Berries
                </p>
                <div className="text-[10px] font-bold text-[#7a8c79] mt-0.5">
                  158 kcal • 12g P
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2">
                <img
                  src={snackImg}
                  alt="Healthy snacks"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => navigate('/food?meal=snack')}
                  className="w-8 h-8 rounded-full bg-[#5ba83c] hover:bg-[#4d9630] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                  title="Add food to Snacks"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Workout Reminder Strip */}
          {todayWorkout && (
            <div className="bg-white border border-[#e8ede6] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                  todayWorkout.completed ? 'bg-[#5ba83c]' : 'bg-[#eef7eb] text-[#3b7e23]'
                }`}>
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#192418] block">
                    Today's Workout: {todayWorkout.name}
                  </span>
                  <span className="text-[10px] text-[#7a8c79]">
                    {todayWorkout.exercises.length} exercises • {todayWorkout.durationMinutes} min • {todayWorkout.targetFocus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWorkoutSection(!showWorkoutSection)}
                  className="text-xs font-semibold text-[#5ba83c] hover:underline"
                >
                  {showWorkoutSection ? 'Hide' : 'Quick View'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleWorkoutComplete}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    todayWorkout.completed
                      ? 'bg-[#eef7eb] text-[#3b7e23]'
                      : 'bg-[#5ba83c] text-white shadow-xs hover:bg-[#4d9630]'
                  }`}
                >
                  {todayWorkout.completed ? '✓ Completed' : 'Mark Done'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Workout Details Dropdown */}
          {showWorkoutSection && todayWorkout && (
            <div className="bg-white border border-[#e8ede6] rounded-2xl p-4 space-y-3 animate-fade-in shadow-xs">
              <h4 className="text-xs font-bold text-[#192418] uppercase tracking-wider">
                Exercise Check-in
              </h4>
              <div className="space-y-2">
                {todayWorkout.exercises.map((ex) => (
                  <div key={ex.id} className="p-2.5 rounded-xl bg-[#f6f8f5] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#192418]">{ex.name}</span>
                      <span className="text-[11px] text-[#7a8c79] block">
                        {ex.sets} sets × {ex.reps} ({ex.restSeconds}s rest)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: ex.sets }).map((_, idx) => {
                        const done = ex.completedSets?.[idx] || false;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleSet(ex.id, idx)}
                            className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-colors ${
                              done
                                ? 'bg-[#5ba83c] text-white'
                                : 'bg-white border border-[#e8ede6] text-[#7a8c79] hover:border-[#5ba83c]'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Stack: AI Coach Card + Quote Card (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* AI Nutrition Coach Card */}
          <div className="bg-gradient-to-br from-[#eef7eb] via-[#f7fbf6] to-[#e6f4e2] dark:from-[#212B22] dark:via-[#263128] dark:to-[#1F2821] border border-[#d6ebd0] dark:border-[#384639] rounded-[28px] p-6 relative overflow-hidden shadow-xs flex flex-col justify-between">
            {/* Robot Avatar and Title */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#272E29] border border-[#d6ebd0] dark:border-[#384639] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shadow-xs">
                  <div className="relative">
                    <Sparkles className="w-6 h-6 text-[#5ba83c] dark:text-[#8BAF78] fill-[#5ba83c] dark:fill-[#8BAF78]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#192418] dark:text-[#E8EDE7]">
                    AI Nutrition Coach
                  </h4>
                  <span className="text-[11px] font-semibold text-[#5ba83c] dark:text-[#8BAF78]">
                    Online & Ready
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-relaxed">
                Get personalized advice, meal ideas, and answers to your nutrition questions.
              </p>
            </div>

            {/* Action button */}
            <div className="pt-4 relative z-10">
              <Link
                to="/coach"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5ba83c] dark:bg-[#8BAF78] hover:bg-[#4d9630] dark:hover:bg-[#7a9d68] text-white dark:text-[#192418] text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Ask AI Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Decorative bottom right foliage */}
            <div className="absolute -bottom-2 -right-2 w-28 h-28 opacity-25 pointer-events-none">
              <svg className="w-full h-full fill-[#5ba83c]" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
          </div>

          {/* Quote Card */}
          <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 relative overflow-hidden shadow-xs flex items-center gap-3">
            <span className="text-3xl font-serif text-[#5ba83c] select-none leading-none">
              “
            </span>
            <p className="text-xs font-bold text-[#192418] italic leading-snug">
              Healthy food builds a healthy mind.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* WELLNESS TIP MODAL                                        */}
      {/* ========================================================= */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e8ede6] relative space-y-4">
            <button
              type="button"
              onClick={() => setShowTipModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#8e9f8e] hover:text-[#192418] hover:bg-[#f6f8f5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#eef7eb] flex items-center justify-center text-[#5ba83c]">
              <Lightbulb className="w-6 h-6 text-[#5ba83c]" />
            </div>

            <h3 className="text-xl font-extrabold text-[#192418]">
              The Power of Whole Foods
            </h3>

            <p className="text-xs sm:text-sm text-[#5e6f5e] leading-relaxed">
              Whole foods are unprocessed or minimally processed plant and animal foods that retain their natural micronutrients, fiber matrices, and bioactive compounds.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#192418]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5ba83c] shrink-0 mt-0.5" />
                <span><strong>Satiety & Blood Sugar:</strong> Intact fiber slows glucose absorption, preventing energy crashes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5ba83c] shrink-0 mt-0.5" />
                <span><strong>Microbiome Health:</strong> Diverse plant compounds foster beneficial gut flora for immunity and mood.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5ba83c] shrink-0 mt-0.5" />
                <span><strong>Micronutrient Density:</strong> Magnesium, potassium, and vital vitamins are preserved in their natural forms.</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTipModal(false)}
                className="px-4 py-2 rounded-xl border border-[#e8ede6] text-xs font-bold text-[#5e6f5e] hover:bg-[#f6f8f5]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTipModal(false);
                  navigate('/coach');
                }}
                className="px-4 py-2 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold"
              >
                Ask AI Coach for Meal Ideas →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
