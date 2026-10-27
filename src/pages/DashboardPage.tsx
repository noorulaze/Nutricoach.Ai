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
  Calendar,
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
import { getFoodImageUrl } from '../utils/foodImageDatabase';
import FoodImage from '../components/common/FoodImage';

// Cute friendly AI Robot mascot matching the reference image
function AIRobotAvatar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#eef7eb" className="dark:fill-[#2d3a2b]" />
      <line x1="32" y1="11" x2="32" y2="17" stroke="#4a8039" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="10" r="3" fill="#5ba83c" />
      <rect x="15" y="17" width="34" height="28" rx="8" fill="#a4cf8a" />
      <rect x="19" y="21" width="26" height="20" rx="5" fill="#f4faf0" className="dark:fill-[#1C211D]" />
      <circle cx="26" cy="29" r="2.5" fill="#2d5225" />
      <circle cx="38" cy="29" r="2.5" fill="#2d5225" />
      <path d="M28 34 Q32 37 36 34" stroke="#2d5225" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="11" y="24" width="4" height="14" rx="2" fill="#3b692d" />
      <rect x="49" y="24" width="4" height="14" rx="2" fill="#3b692d" />
      <path d="M13 24 C13 15 51 15 51 24" stroke="#3b692d" strokeWidth="2" fill="none" />
      <circle cx="23" cy="32" r="1.5" fill="#ffb4a2" opacity="0.8" />
      <circle cx="41" cy="32" r="1.5" fill="#ffb4a2" opacity="0.8" />
    </svg>
  );
}

// Flowing green leaves illustration for the quote card matching the reference image
function LeavesIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 70 C45 60 65 55 90 65 C85 40 65 30 40 45 C50 35 70 20 95 25 C80 5 50 10 30 35 C20 48 25 60 30 70 Z" fill="#7cb342" fillOpacity="0.3" />
      <path d="M45 75 C60 65 80 62 100 70 C92 48 75 40 52 52 C60 42 80 30 100 35 C88 15 60 20 45 42 Z" fill="#5ba83c" fillOpacity="0.45" />
      <path d="M10 80 Q50 65 95 65" stroke="#4d8c2d" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

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
  const firstName = (profile.name || 'Nooru').split(' ')[0] || 'Nooru';
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const progressEntries = getProgressEntries();

  // Format today's date: "Today, Oct 25, 2026"
  const todayFormatted = `Today, ${new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;

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

  // Meal cards real data integration matching reference design
  const breakfastEntries = todayFoods.filter((f) => f.meal === 'breakfast');
  const lunchEntries = todayFoods.filter((f) => f.meal === 'lunch');
  const dinnerEntries = todayFoods.filter((f) => f.meal === 'dinner');
  const snackEntries = todayFoods.filter((f) => f.meal === 'snack');

  const mealCards = [
    {
      type: 'breakfast',
      name: 'Breakfast',
      firstItemName: breakfastEntries[0]?.name,
      icon: Sun,
      iconColor: 'text-amber-500 fill-amber-500',
      hasLogged: breakfastEntries.length > 0,
      description: breakfastEntries.length > 0 
        ? breakfastEntries.map((f) => f.name).join(', ') 
        : 'Oats, Banana, Almonds',
      calories: breakfastEntries.length > 0 
        ? breakfastEntries.reduce((s, f) => s + f.calories, 0) 
        : 398,
      protein: breakfastEntries.length > 0 
        ? breakfastEntries.reduce((s, f) => s + f.protein, 0) 
        : 21,
      image: breakfastEntries[0]?.imageUrl || (breakfastEntries[0]?.name ? getFoodImageUrl(breakfastEntries[0].name, 'breakfast') : getFoodImageUrl('Oatmeal with Almonds and Fruits', 'breakfast')),
      logPath: '/food?meal=breakfast'
    },
    {
      type: 'lunch',
      name: 'Lunch',
      firstItemName: lunchEntries[0]?.name,
      icon: Sun,
      iconColor: 'text-orange-500 fill-orange-500',
      hasLogged: lunchEntries.length > 0,
      description: lunchEntries.length > 0 
        ? lunchEntries.map((f) => f.name).join(', ') 
        : 'Grilled Chicken, Brown Rice, Veggies',
      calories: lunchEntries.length > 0 
        ? lunchEntries.reduce((s, f) => s + f.calories, 0) 
        : 445,
      protein: lunchEntries.length > 0 
        ? lunchEntries.reduce((s, f) => s + f.protein, 0) 
        : 35,
      image: lunchEntries[0]?.imageUrl || (lunchEntries[0]?.name ? getFoodImageUrl(lunchEntries[0].name, 'lunch') : getFoodImageUrl('Nadan Chicken Curry', 'curries_gravies')),
      logPath: '/food?meal=lunch'
    },
    {
      type: 'dinner',
      name: 'Dinner',
      firstItemName: dinnerEntries[0]?.name,
      icon: Moon,
      iconColor: 'text-sky-500 fill-sky-500',
      hasLogged: dinnerEntries.length > 0,
      description: dinnerEntries.length > 0 
        ? dinnerEntries.map((f) => f.name).join(', ') 
        : 'Fish, Quinoa, Salad',
      calories: dinnerEntries.length > 0 
        ? dinnerEntries.reduce((s, f) => s + f.calories, 0) 
        : 520,
      protein: dinnerEntries.length > 0 
        ? dinnerEntries.reduce((s, f) => s + f.protein, 0) 
        : 42,
      image: dinnerEntries[0]?.imageUrl || (dinnerEntries[0]?.name ? getFoodImageUrl(dinnerEntries[0].name, 'dinner') : getFoodImageUrl('Kerala Fish Curry', 'seafood')),
      logPath: '/food?meal=dinner'
    },
    {
      type: 'snack',
      name: 'Snacks',
      firstItemName: snackEntries[0]?.name,
      icon: Apple,
      iconColor: 'text-rose-500 fill-rose-500',
      hasLogged: snackEntries.length > 0,
      description: snackEntries.length > 0 
        ? snackEntries.map((f) => f.name).join(', ') 
        : 'Greek Yogurt, Berries',
      calories: snackEntries.length > 0 
        ? snackEntries.reduce((s, f) => s + f.calories, 0) 
        : 158,
      protein: snackEntries.length > 0 
        ? snackEntries.reduce((s, f) => s + f.protein, 0) 
        : 12,
      image: snackEntries[0]?.imageUrl || (snackEntries[0]?.name ? getFoodImageUrl(snackEntries[0].name, 'snack') : getFoodImageUrl('Kerala Banana Chips', 'snacks_streetfood')),
      logPath: '/food?meal=snack'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-5 sm:space-y-6">
      
      {/* ========================================================= */}
      {/* MOBILE DASHBOARD VIEW (< 1024px): Matches Screens 6 & 1   */}
      {/* ========================================================= */}
      <div className="lg:hidden space-y-4">
        {/* Mobile Greeting Card */}
        <div className="space-y-0.5 pt-0.5">
          <h1 className="text-xl font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight">
            Good Morning, {firstName}
          </h1>
          <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium flex items-center gap-1.5">
            <span>Keep going! You're doing great!</span>
            <span role="img" aria-label="sprout">🌿</span>
          </p>
        </div>

        {/* 3 Summary Cards in a row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Card 1: Calories */}
          <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 mb-1.5">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <span className="text-sm font-black text-[#192418] dark:text-[#E8EDE7] leading-none">
              {displayCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium mt-1">
              Calories
            </span>
          </div>

          {/* Card 2: Protein */}
          <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] mb-1.5">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-[#192418] dark:text-[#E8EDE7] leading-none">
              {displayProtein}g
            </span>
            <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium mt-1">
              Protein
            </span>
          </div>

          {/* Card 3: Fiber */}
          <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-7 h-7 rounded-xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center text-sky-500 mb-1.5">
              <Wheat className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-[#192418] dark:text-[#E8EDE7] leading-none">
              {displayFiber}g
            </span>
            <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium mt-1">
              Fiber
            </span>
          </div>
        </div>

        {/* Today's Progress Card with 3 Circular Gauges */}
        <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#192418] dark:text-[#E8EDE7] tracking-tight">
            Today's Progress
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            {/* Nutrition Ring */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" className="stroke-[#edf2ea] dark:stroke-[#394139]" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="14" fill="none" 
                    className="stroke-[#5ba83c] dark:stroke-[#8BAF78] transition-all duration-700" 
                    strokeWidth="3" 
                    strokeDasharray="87.96" 
                    strokeDashoffset={87.96 - (caloriePercent / 100) * 87.96} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-[#192418] dark:text-[#E8EDE7]">
                  {caloriePercent}%
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#5e6f5e] dark:text-[#A2AAA1]">Nutrition</span>
            </div>

            {/* Workout Ring */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" className="stroke-[#edf2ea] dark:stroke-[#394139]" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="14" fill="none" 
                    className="stroke-[#38bdf8] transition-all duration-700" 
                    strokeWidth="3" 
                    strokeDasharray="87.96" 
                    strokeDashoffset={87.96 - ((todayWorkout?.completed ? 100 : 45) / 100) * 87.96} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-[#192418] dark:text-[#E8EDE7]">
                  {todayWorkout?.completed ? 100 : 45}%
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#5e6f5e] dark:text-[#A2AAA1]">Workout</span>
            </div>

            {/* Water Ring */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" className="stroke-[#edf2ea] dark:stroke-[#394139]" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="14" fill="none" 
                    className="stroke-[#34d399] transition-all duration-700" 
                    strokeWidth="3" 
                    strokeDasharray="87.96" 
                    strokeDashoffset={87.96 - (waterPercent / 100) * 87.96} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-[#192418] dark:text-[#E8EDE7]">
                  {waterPercent}%
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#5e6f5e] dark:text-[#A2AAA1]">Water</span>
            </div>
          </div>
        </div>

        {/* Quick Actions List matching mockup */}
        <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-3xl p-4 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-[#8e9f8e] dark:text-[#7A8279] uppercase tracking-wider mb-1">
            Quick Actions
          </h3>

          <Link
            to="/food"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] hover:bg-[#eef7eb] dark:hover:bg-[#223023] border border-[#e8ede6] dark:border-[#394139] text-[#192418] dark:text-[#E8EDE7] text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] flex items-center justify-center text-[#5ba83c]">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span>Log Food</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7a8c79]" />
          </Link>

          <Link
            to="/workouts"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] hover:bg-[#eef7eb] dark:hover:bg-[#223023] border border-[#e8ede6] dark:border-[#394139] text-[#192418] dark:text-[#E8EDE7] text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] flex items-center justify-center text-[#5ba83c]">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span>Start Workout</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7a8c79]" />
          </Link>

          <Link
            to="/meal-planner"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] hover:bg-[#eef7eb] dark:hover:bg-[#223023] border border-[#e8ede6] dark:border-[#394139] text-[#192418] dark:text-[#E8EDE7] text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] flex items-center justify-center text-[#5ba83c]">
                <Calendar className="w-4 h-4" />
              </div>
              <span>AI Meal Planner</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7a8c79]" />
          </Link>

          <Link
            to="/coach"
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] hover:bg-[#eef7eb] dark:hover:bg-[#223023] border border-[#e8ede6] dark:border-[#394139] text-[#192418] dark:text-[#E8EDE7] text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] flex items-center justify-center text-[#5ba83c]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Ask AI Coach</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7a8c79]" />
          </Link>
        </div>

        {/* Hero Card: "Your Health Our Priority" matching Screen 1 */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#273728] via-[#1F2D20] to-[#152016] text-white p-5 shadow-md">
          <div className="max-w-[70%] space-y-2 relative z-10">
            <h2 className="text-lg font-black tracking-tight leading-tight">
              Your Health Our Priority
            </h2>
            <p className="text-[11px] text-white/80 leading-relaxed font-medium">
              Personalized nutrition, smarter workouts, better you.
            </p>
            <div className="pt-1">
              <Link
                to="/food"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-25 pointer-events-none">
            <NutriCoachSymbol className="w-full h-full text-[#8BAF78]" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP DASHBOARD VIEW (>= 1024px): Matches Reference Img */}
      {/* ========================================================= */}
      <div className="hidden lg:block space-y-6">
        
        {/* TOP CONTROLS ROW: Date badge (left/center over 8 cols) + Daily Goal & Log Food (right over 4 cols) */}
        <div className="grid grid-cols-12 gap-5 items-center">
          {/* Left 8 cols: Right-aligned date pill directly over Wellness Banner */}
          <div className="col-span-8 flex justify-end">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-xs font-semibold text-[#5e6f5e] dark:text-[#A2AAA1] shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
              <span>{todayFormatted}</span>
            </div>
          </div>

          {/* Right 4 cols: Daily Goal pill & + Log Food button directly over Calories Card */}
          <div className="col-span-4 flex items-center justify-between gap-3">
            {/* Daily Goal Pill */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-[#eef7eb] dark:bg-[#243022] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shrink-0">
                <NutriCoachSymbol className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8e9f8e] dark:text-[#7A8279] leading-none">
                  Daily Goal
                </span>
                <span className="text-xs font-extrabold text-[#192418] dark:text-[#E8EDE7] leading-tight">
                  {targetCalories.toLocaleString()} kcal
                </span>
              </div>
              <div className="w-16 sm:w-20 h-2 bg-[#eef7eb] dark:bg-[#243022] rounded-full overflow-hidden ml-auto shrink-0">
                <div 
                  className="h-full bg-[#5ba83c] dark:bg-[#8BAF78] rounded-full transition-all duration-300"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
            </div>

            {/* + Log Food Action Button */}
            <Link
              to="/food"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] dark:bg-[#8BAF78] dark:hover:bg-[#9CBD89] text-white dark:text-[#161D15] text-xs font-extrabold shadow-xs hover:shadow-md transition-all active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Food</span>
            </Link>
          </div>
        </div>

        {/* ROW 1: Daily Wellness Tip Card (8 cols) + Calories Donut Card (4 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch">
          {/* Daily Wellness Tip Card (8 cols on lg) */}
          <div className="col-span-8 bg-gradient-to-br from-[#eaf4e6] via-[#f3f9f0] to-[#e4f0e0] dark:from-[#212B22] dark:via-[#263128] dark:to-[#1F2821] border border-[#d6ebd0] dark:border-[#384639] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs group">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2e4a2d] hover:bg-[#243c23] dark:bg-[#8BAF78] dark:hover:bg-[#7a9d68] text-white dark:text-[#192418] text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Circular Grain Bowl Hero Photography */}
              <div className="relative shrink-0 w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center">
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
          <div className="col-span-4 bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-extrabold text-[#192418] dark:text-[#E8EDE7]">Calories</h3>
              <span className="text-[11px] font-bold text-[#7a8c79] dark:text-[#A2AAA1] uppercase tracking-wider">
                Today
              </span>
            </div>

            {/* Donut Chart & Side Legends */}
            <div className="flex items-center justify-between gap-4 my-auto py-2">
              {/* Circular SVG Donut */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={ringRadius}
                    className="stroke-[#edf2ea] dark:stroke-[#394139]"
                    strokeWidth="12"
                    fill="transparent"
                  />
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
                  <span className="text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight leading-none">
                    {displayCalories.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5 uppercase tracking-wide">
                    kcal
                  </span>
                  <span className="text-[10px] font-medium text-[#8e9f8e] dark:text-[#7A8279] mt-0.5">
                    of {targetCalories.toLocaleString()} kcal
                  </span>
                </div>
              </div>

              {/* Right Side Stats */}
              <div className="flex flex-col justify-center gap-3.5 text-xs">
                {/* Remaining */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-[#7a8c79] dark:text-[#A2AAA1] block">
                      Remaining
                    </span>
                    <span className="text-sm font-extrabold text-[#192418] dark:text-[#E8EDE7] leading-tight">
                      {remainingCalories.toLocaleString()} kcal
                    </span>
                  </div>
                </div>

                {/* Food dot */}
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#f0f4ee] dark:border-[#394139]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78]" />
                    <span className="text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">Food</span>
                  </div>
                  <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">
                    {displayCalories.toLocaleString()} kcal
                  </span>
                </div>

                {/* Exercise dot */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a3b89f] dark:bg-[#5b6a58]" />
                    <span className="text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">Exercise</span>
                  </div>
                  <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">
                    {todayWorkout?.completed ? '412 kcal' : '0 kcal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Link
                to="/food"
                className="text-[11px] font-bold text-[#5ba83c] dark:text-[#8BAF78] hover:text-[#45812e] dark:hover:text-[#9CBD89] transition-colors"
              >
                Log more food →
              </Link>
            </div>
          </div>
        </div>

        {/* ROW 2: DAILY ACTIVITY (5 cols) + MACROS (4 cols) + HYDRATION (3 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch">
          {/* 1. Daily Activity Card (5 cols on lg) */}
          <div className="col-span-5 bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#192418] dark:text-[#E8EDE7]">Daily Activity</h3>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] px-2.5 py-1 rounded-xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] transition-colors"
              >
                <span>Last 7 days</span>
                <ChevronDown className="w-3 h-3 text-[#7a8c79] dark:text-[#A2AAA1]" />
              </button>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Activity SVG Trend Chart (7 cols) */}
              <div className="col-span-7 flex flex-col">
                <div className="relative w-full h-32 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 350 100">
                    <line x1="0" y1="20" x2="340" y2="20" stroke="currentColor" className="text-[#f0f4ee] dark:text-[#394139]" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="340" y2="50" stroke="currentColor" className="text-[#f0f4ee] dark:text-[#394139]" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="340" y2="80" stroke="currentColor" className="text-[#f0f4ee] dark:text-[#394139]" strokeDasharray="3 3" />

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

                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                      className="text-[#5ba83c] dark:text-[#8BAF78]"
                    />

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

                <div className="flex justify-between text-[9px] font-medium text-[#8e9f8e] dark:text-[#7A8279] mt-2 px-1">
                  {activityData.map((d, i) => (
                    <span key={i} className={i === 6 ? 'font-bold text-[#192418] dark:text-[#E8EDE7]' : ''}>
                      {d.day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity Right Stats List (5 cols) */}
              <div className="col-span-5 flex flex-col justify-center gap-3 pl-3 border-l border-[#f0f4ee] dark:border-[#394139]">
                {/* Steps */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#eef7eb] dark:bg-[#243022] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shrink-0">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium block">
                      Steps
                    </span>
                    <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">
                      6,842
                    </span>
                  </div>
                </div>

                {/* Active Minutes */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium block">
                      Active Minutes
                    </span>
                    <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">
                      32 min
                    </span>
                  </div>
                </div>

                {/* Calories Burned */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-500 shrink-0">
                    <Flame className="w-4 h-4 fill-orange-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium block">
                      Calories Burned
                    </span>
                    <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">
                      {todayWorkout?.completed ? '412 kcal' : '0 kcal'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Macronutrients Card (4 cols on lg) */}
          <div className="col-span-4 bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#192418] dark:text-[#E8EDE7]">Macronutrients</h3>
              <Link
                to="/food"
                className="text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#5ba83c] dark:hover:text-[#8BAF78] transition-colors"
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
                    <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">Protein</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#7a8c79] dark:text-[#A2AAA1] text-[11px]">
                      {displayProtein} / {targetProtein}g
                    </span>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7] text-[11px] w-8 text-right">
                      {proteinPct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#f6f8f5] dark:bg-[#1C211D] rounded-full overflow-hidden">
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
                    <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500">
                      <Wheat className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">Carbs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#7a8c79] dark:text-[#A2AAA1] text-[11px]">
                      {displayCarbs} / {targetCarbs}g
                    </span>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7] text-[11px] w-8 text-right">
                      {carbsPct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#f6f8f5] dark:bg-[#1C211D] rounded-full overflow-hidden">
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
                    <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center text-sky-500">
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">Fats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#7a8c79] dark:text-[#A2AAA1] text-[11px]">
                      {displayFat} / {targetFat}g
                    </span>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7] text-[11px] w-8 text-right">
                      {fatPct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#f6f8f5] dark:bg-[#1C211D] rounded-full overflow-hidden">
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
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
                      <Apple className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">Fiber</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#7a8c79] dark:text-[#A2AAA1] text-[11px]">
                      {displayFiber} / {targetFiber}g
                    </span>
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7] text-[11px] w-8 text-right">
                      {fiberPct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#f6f8f5] dark:bg-[#1C211D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                    style={{ width: `${fiberPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Hydration Card (3 cols on lg) */}
          <div className="col-span-3 bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-extrabold text-[#192418] dark:text-[#E8EDE7]">Hydration</h3>
              <span className="text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] cursor-pointer hover:text-[#5ba83c] dark:hover:text-[#8BAF78]">
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

        {/* ROW 3: TODAY'S MEALS (8 cols) + AI COACH & QUOTE (4 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch">
          {/* Today's Meals Section (8 cols on lg) */}
          <div className="col-span-8 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#192418] dark:text-[#E8EDE7]">Today's Meals</h3>
              <Link
                to="/food"
                className="text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#5ba83c] dark:hover:text-[#8BAF78] transition-colors"
              >
                View all →
              </Link>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-4 gap-3.5">
              {mealCards.map((meal) => {
                const Icon = meal.icon;
                return (
                  <div
                    key={meal.type}
                    className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[24px] p-4 flex flex-col justify-between shadow-xs hover:border-[#d6e2d3] dark:hover:border-[#4d5c4c] transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#192418] dark:text-[#E8EDE7]">
                        <Icon className={`w-4 h-4 ${meal.iconColor}`} />
                        <span>{meal.name}</span>
                      </div>
                      <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium mt-1 truncate" title={meal.description}>
                        {meal.description}
                      </p>
                      <div className="text-[10px] font-bold text-[#7a8c79] dark:text-[#8e9f8e] mt-0.5">
                        {meal.calories} kcal • {meal.protein}g P
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-[#394139] shadow-xs group-hover:scale-105 transition-transform shrink-0 bg-[#f4f7f3] dark:bg-[#1C211D]">
                        <FoodImage
                          name={meal.firstItemName || meal.name}
                          imageUrl={meal.image}
                          className="w-full h-full object-cover"
                          alt={meal.name}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(meal.logPath)}
                        className="w-8 h-8 rounded-full bg-[#5ba83c] hover:bg-[#4d9630] dark:bg-[#8BAF78] dark:hover:bg-[#9cbd89] text-white dark:text-[#192418] flex items-center justify-center shadow-xs transition-transform active:scale-90"
                        title={`Add food to ${meal.name}`}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Workout Reminder Strip */}
            {todayWorkout && (
              <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                    todayWorkout.completed ? 'bg-[#5ba83c] dark:bg-[#8BAF78]' : 'bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78]'
                  }`}>
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] block">
                      Today's Workout: {todayWorkout.name}
                    </span>
                    <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1]">
                      {todayWorkout.exercises.length} exercises • {todayWorkout.durationMinutes} min • {todayWorkout.targetFocus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWorkoutSection(!showWorkoutSection)}
                    className="text-xs font-semibold text-[#5ba83c] dark:text-[#8BAF78] hover:underline"
                  >
                    {showWorkoutSection ? 'Hide' : 'Quick View'}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleWorkoutComplete}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      todayWorkout.completed
                        ? 'bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78]'
                        : 'bg-[#5ba83c] hover:bg-[#4d9630] dark:bg-[#8BAF78] dark:hover:bg-[#9CBD89] text-white dark:text-[#192418] shadow-xs'
                    }`}
                  >
                    {todayWorkout.completed ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Workout Details Dropdown */}
            {showWorkoutSection && todayWorkout && (
              <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-4 space-y-3 animate-fade-in shadow-xs">
                <h4 className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider">
                  Exercise Check-in
                </h4>
                <div className="space-y-2">
                  {todayWorkout.exercises.map((ex) => (
                    <div key={ex.id} className="p-2.5 rounded-xl bg-[#f6f8f5] dark:bg-[#1C211D] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">{ex.name}</span>
                        <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1] block">
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
                                  ? 'bg-[#5ba83c] dark:bg-[#8BAF78] text-white dark:text-[#192418]'
                                  : 'bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-[#7a8c79] dark:text-[#A2AAA1] hover:border-[#5ba83c]'
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
          <div className="col-span-4 flex flex-col justify-between gap-4">
            {/* AI Nutrition Coach Card */}
            <div className="bg-gradient-to-br from-[#eef7eb] via-[#f7fbf6] to-[#e6f4e2] dark:from-[#212B22] dark:via-[#263128] dark:to-[#1F2821] border border-[#d6ebd0] dark:border-[#384639] rounded-[28px] p-6 relative overflow-hidden shadow-xs flex flex-col justify-between flex-1">
              {/* Robot Avatar and Title */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs">
                    <AIRobotAvatar className="w-12 h-12" />
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] dark:bg-[#8BAF78] dark:hover:bg-[#9CBD89] text-white dark:text-[#192418] text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Ask AI Coach</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Decorative subtle stars */}
              <div className="absolute top-4 right-4 opacity-30 pointer-events-none">
                <Sparkles className="w-6 h-6 text-[#5ba83c] dark:text-[#8BAF78]" />
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-5 relative overflow-hidden shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-3xl font-serif text-[#5ba83c] dark:text-[#8BAF78] select-none leading-none">
                  “
                </span>
                <p className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] italic leading-snug">
                  Healthy food builds a healthy mind.
                </p>
              </div>

              {/* Right leafy illustration */}
              <div className="shrink-0 relative z-0 -mr-2">
                <LeavesIllustration className="w-20 h-16" />
              </div>
            </div>
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
