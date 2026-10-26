import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ShoppingCart, 
  Bookmark, 
  Calendar, 
  Clock, 
  Flame, 
  ChevronRight, 
  Plus, 
  Check, 
  ShieldCheck, 
  ChefHat, 
  Heart, 
  AlertCircle,
  Share2,
  Download,
  Info
} from 'lucide-react';
import { 
  PlannedMeal, 
  DayPlan, 
  SavedMealPlan, 
  MealPlannerPreferences 
} from '../types/mealPlanner';
import { 
  getActiveMealPlan, 
  saveActiveMealPlan, 
  getSavedMealPlans, 
  saveMealPlanToLibrary, 
  deleteSavedMealPlan,
  getMealPlannerPreferences,
  saveMealPlannerPreferences,
  getFavoritePlannedMeals,
  toggleFavoritePlannedMeal,
  isFavoritePlannedMeal
} from '../utils/mealPlanStorage';
import { requestGenerateMealPlan, requestSwapMeal } from '../utils/mealPlanClient';
import { generateShoppingListFromPlan } from '../utils/shoppingListGenerator';
import { getProfile } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

// Components
import MealPreferenceModal from '../components/mealPlanner/MealPreferenceModal';
import PlannedMealCard from '../components/mealPlanner/PlannedMealCard';
import MealEditModal from '../components/mealPlanner/MealEditModal';
import MealSwapModal from '../components/mealPlanner/MealSwapModal';
import ShoppingListModal from '../components/mealPlanner/ShoppingListModal';
import LogMealToTrackerModal from '../components/mealPlanner/LogMealToTrackerModal';
import SavedPlansDrawer from '../components/mealPlanner/SavedPlansDrawer';
import ApiKeySetupBanner from '../components/mealPlanner/ApiKeySetupBanner';

export default function AIMealPlannerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const profile = getProfile();

  // Core State
  const [preferences, setPreferences] = useState<MealPlannerPreferences>(getMealPlannerPreferences());
  const [activePlan, setActivePlan] = useState<SavedMealPlan | null>(getActiveMealPlan());
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>(getSavedMealPlans());
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  // Loading & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Synthesizing your personalized meal plan...');
  const [errorState, setErrorState] = useState<string | null>(null);

  // Modals & Drawers
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<PlannedMeal | null>(null);
  const [swappingMeal, setSwappingMeal] = useState<PlannedMeal | null>(null);
  const [loggingMeal, setLoggingMeal] = useState<PlannedMeal | null>(null);

  // Cycle loading messages for engaging UX during generation
  useEffect(() => {
    if (!isGenerating) return;
    const messages = [
      'Analyzing your metabolic targets & calorie goals...',
      'Synthesizing authentic Kerala & Indian recipes...',
      'Validating strict food allergy safety & exclusions...',
      'Balancing protein, carbohydrates, and healthy fats...',
      'Finalizing step-by-step cooking preparation...'
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setLoadingMessage(messages[idx]);
    }, 1800);
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Handle plan generation from preferences
  const handleGeneratePlan = async (newPrefs: MealPlannerPreferences) => {
    setIsGenerating(true);
    setErrorState(null);
    setPreferences(newPrefs);
    saveMealPlannerPreferences(newPrefs);
    setIsPreferenceModalOpen(false);

    try {
      const response = await requestGenerateMealPlan(newPrefs);
      if (response.success && response.days.length > 0) {
        const newPlan: SavedMealPlan = {
          id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId: user?.id || 'default_user',
          name: `${newPrefs.duration === '1_day' ? 'Daily' : 'Weekly'} ${newPrefs.dietaryPreference === 'vegetarian' ? 'Vegetarian' : 'Balanced'} Plan`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          duration: newPrefs.duration,
          preferences: newPrefs,
          days: response.days,
          isAIGenerated: response.isAIGenerated,
          sourceModel: response.sourceModel
        };

        setActivePlan(newPlan);
        saveActiveMealPlan(newPlan);
        setSelectedDayIndex(0);
        showToast(
          `Your ${newPrefs.duration === '1_day' ? '1-day' : '7-day'} meal plan is ready!`,
          'success',
          response.isAIGenerated ? 'AI Plan Generated' : 'Plan Ready'
        );
      } else {
        throw new Error(response.error || 'Failed to generate meal plan');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorState(err?.message || 'Could not connect to meal planning service.');
      showToast('Error generating meal plan. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle single meal swapping
  const handleConfirmSwap = async (mealToSwap: PlannedMeal, userPrompt?: string) => {
    if (!activePlan) return;
    try {
      const res = await requestSwapMeal(preferences, mealToSwap, userPrompt);
      if (res.success && res.meal) {
        const updatedDays = activePlan.days.map(d => {
          if (d.dayIndex === mealToSwap.dayIndex) {
            const updatedMeals = d.meals.map(m => m.id === mealToSwap.id ? res.meal : m);
            return {
              ...d,
              meals: updatedMeals,
              totalCalories: updatedMeals.reduce((s, m) => s + m.calories, 0),
              totalProtein: Math.round(updatedMeals.reduce((s, m) => s + m.protein, 0) * 10) / 10,
              totalCarbs: Math.round(updatedMeals.reduce((s, m) => s + m.carbs, 0) * 10) / 10,
              totalFat: Math.round(updatedMeals.reduce((s, m) => s + m.fat, 0) * 10) / 10,
              totalFiber: Math.round(updatedMeals.reduce((s, m) => s + m.fiber, 0) * 10) / 10
            };
          }
          return d;
        });

        const updatedPlan: SavedMealPlan = {
          ...activePlan,
          days: updatedDays,
          updatedAt: new Date().toISOString()
        };

        setActivePlan(updatedPlan);
        saveActiveMealPlan(updatedPlan);
        showToast(`Replaced with "${res.meal.name}"!`, 'success', 'Meal Swapped');
      }
    } catch (err) {
      console.error('Meal swap failed:', err);
      showToast('Failed to swap meal.', 'error');
    }
  };

  // Handle saving modified meal from MealEditModal
  const handleSaveEditedMeal = (updatedMeal: PlannedMeal) => {
    if (!activePlan) return;
    const updatedDays = activePlan.days.map(d => {
      if (d.dayIndex === updatedMeal.dayIndex) {
        const updatedMeals = d.meals.map(m => m.id === updatedMeal.id ? updatedMeal : m);
        return {
          ...d,
          meals: updatedMeals,
          totalCalories: updatedMeals.reduce((s, m) => s + m.calories, 0),
          totalProtein: Math.round(updatedMeals.reduce((s, m) => s + m.protein, 0) * 10) / 10,
          totalCarbs: Math.round(updatedMeals.reduce((s, m) => s + m.carbs, 0) * 10) / 10,
          totalFat: Math.round(updatedMeals.reduce((s, m) => s + m.fat, 0) * 10) / 10,
          totalFiber: Math.round(updatedMeals.reduce((s, m) => s + m.fiber, 0) * 10) / 10
        };
      }
      return d;
    });

    const updatedPlan: SavedMealPlan = {
      ...activePlan,
      days: updatedDays,
      updatedAt: new Date().toISOString()
    };

    setActivePlan(updatedPlan);
    saveActiveMealPlan(updatedPlan);
    setEditingMeal(null);
    showToast(`Updated "${updatedMeal.name}"!`, 'success');
  };

  // Save current active plan to user library
  const handleSavePlanToLibrary = () => {
    if (!activePlan) return;
    saveMealPlanToLibrary(activePlan);
    setSavedPlans(getSavedMealPlans());
    showToast(`Saved "${activePlan.name}" to your library!`, 'success', 'Plan Saved');
  };

  // Active day meals and summary
  const currentDay: DayPlan | undefined = activePlan?.days?.[selectedDayIndex] || activePlan?.days?.[0];
  const shoppingListItems = activePlan ? generateShoppingListFromPlan(activePlan.days) : [];

  return (
    <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-6">
      
      {/* ========================================================= */}
      {/* 1. HERO HEADER & MAIN ACTIONS BAR                         */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-[#eaf4e6] via-[#f3f9f0] to-[#e4f0e0] dark:from-[#212B22] dark:via-[#263128] dark:to-[#1F2821] border border-[#d6ebd0] dark:border-[#384639] rounded-[32px] p-5 sm:p-8 relative overflow-hidden shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Decorative foliage watermark */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 opacity-20 pointer-events-none select-none">
          <svg className="w-full h-full fill-[#5ba83c] dark:fill-[#8BAF78]" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
          </svg>
        </div>

        <div className="max-w-xl space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-white/80 dark:bg-[#1C211D]/80 px-2.5 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#3A4B35]">
              AI PERSONALIZED NUTRITION
            </span>
            <span className="text-xs text-[#7a8c79] dark:text-[#A2AAA1] font-semibold">
              Authentic Kerala & Indian Dishes
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight">
            AI Personalized Meal Planner
          </h1>

          <p className="text-xs sm:text-sm text-[#5e6f5e] dark:text-[#A2AAA1] font-medium leading-relaxed">
            Generate customized daily and 7-day culinary plans tailored to your exact calorie and macro targets, dietary lifestyle, cooking time, and strict allergen safety.
          </p>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <button
            type="button"
            onClick={() => setIsPreferenceModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{activePlan ? 'Edit Preferences' : 'Create My Meal Plan'}</span>
          </button>

          {activePlan && (
            <>
              <button
                type="button"
                onClick={() => setIsShoppingListOpen(true)}
                className="px-3.5 py-3 rounded-2xl bg-white dark:bg-[#272E29] border border-[#d6ebd0] dark:border-[#384639] hover:border-[#5ba83c] text-xs font-bold text-[#192418] dark:text-[#E8EDE7] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="View consolidated grocery shopping list"
              >
                <ShoppingCart className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78]" />
                <span className="hidden sm:inline">Groceries</span>
                <span className="bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] px-1.5 py-0.5 rounded-full text-[10px]">
                  {shoppingListItems.length}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSavePlanToLibrary}
                className="p-3 rounded-2xl bg-white dark:bg-[#272E29] border border-[#d6ebd0] dark:border-[#384639] hover:border-[#5ba83c] text-xs font-bold text-[#192418] dark:text-[#E8EDE7] transition-all shadow-2xs cursor-pointer"
                title="Save current plan to your library"
              >
                <Bookmark className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78]" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsSavedPlansOpen(true)}
            className="px-3.5 py-3 rounded-2xl bg-white dark:bg-[#272E29] border border-[#d6ebd0] dark:border-[#384639] hover:border-[#5ba83c] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-all shadow-2xs cursor-pointer"
            title="Browse saved meal plans library"
          >
            <span className="hidden sm:inline">Saved Plans</span>
            <span className="bg-[#f6f8f5] dark:bg-[#1C211D] px-1.5 py-0.5 rounded-full text-[10px] ml-1">
              {savedPlans.length}
            </span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. API KEY NOTIFICATION / STATUS BANNER                  */}
      {/* ========================================================= */}
      <ApiKeySetupBanner
        isAIGenerated={activePlan?.isAIGenerated}
        needsApiKey={!profile.geminiApiKey}
        onKeySaved={() => {
          if (activePlan) handleGeneratePlan(preferences);
        }}
      />

      {/* ========================================================= */}
      {/* 3. GENERATION LOADING STATE                               */}
      {/* ========================================================= */}
      {isGenerating && (
        <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-12 text-center shadow-xs animate-fade-in space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] flex items-center justify-center text-3xl mx-auto animate-bounce shadow-sm">
            🌱
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#192418] dark:text-[#E8EDE7]">
              Crafting Your Meal Plan
            </h3>
            <p className="text-xs sm:text-sm text-[#5ba83c] dark:text-[#8BAF78] font-bold animate-pulse">
              {loadingMessage}
            </p>
          </div>
          <div className="w-48 h-1.5 bg-[#edf2ea] dark:bg-[#272E29] rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-[#5ba83c] rounded-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ERROR STATE                                            */}
      {/* ========================================================= */}
      {!isGenerating && errorState && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-3xl p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-rose-800 dark:text-rose-200">
              Meal Plan Generation Notice
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto mt-0.5">
              {errorState}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleGeneratePlan(preferences)}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Retry Generation
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EMPTY STATE (BEFORE FIRST PLAN GENERATION)             */}
      {/* ========================================================= */}
      {!isGenerating && !activePlan && !errorState && (
        <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-8 sm:p-14 text-center shadow-xs space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] mx-auto shadow-xs">
              <ChefHat className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
              Ready to Plan Your Healthy Week?
            </h3>
            
            <p className="text-xs sm:text-sm text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
              Tell NutriCoach AI your preferred authentic dishes, diet type, budget, and cooking time. We'll automatically build balanced meal plans with exact portion macros and step-by-step instructions.
            </p>

            {/* Authentic Repertoire Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              {['Puttu & Kadala', 'Appam & Stew', 'Kerala Fish Curry', 'Nadan Chicken', 'Dosa & Sambar', 'Avial & Thoran', 'Paneer Butter Masala'].map((tag, i) => (
                <span key={i} className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#f6f8f5] dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1] border border-[#e8ede6] dark:border-[#394139]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsPreferenceModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-black uppercase tracking-wider shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create My First Meal Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ACTIVE PLAN VIEW & DAY NAVIGATOR                       */}
      {/* ========================================================= */}
      {!isGenerating && activePlan && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Day Navigation Tabs for 7-Day Plans */}
          {activePlan.days.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-scroll pb-1">
              {activePlan.days.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={day.dayIndex}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all text-left shrink-0 cursor-pointer min-w-[130px] ${
                      isSelected
                        ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] shadow-xs'
                        : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29]'
                    }`}
                  >
                    <span className="block font-black text-sm">{day.dayName}</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">
                      {day.totalCalories} kcal • {day.meals.length} meals
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Day Macronutrient Summary Bar */}
          {currentDay && (
            <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#192418] dark:text-[#E8EDE7]">
                    {currentDay.dayName}'s Nutrition Summary
                  </h3>
                  <span className="text-[11px] font-bold text-[#7a8c79] dark:text-[#A2AAA1]">
                    ({currentDay.meals.length} planned meals)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5ba83c] dark:text-[#8BAF78] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>All declared allergens strictly excluded</span>
                </div>
              </div>

              {/* Macro Gauges */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                <div className="bg-[#f6f8f5] dark:bg-[#272E29] p-2.5 rounded-2xl border border-[#e8ede6] dark:border-[#394139]">
                  <span className="text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1] block">Total Energy</span>
                  <span className="text-sm sm:text-base font-black text-[#192418] dark:text-[#E8EDE7]">{currentDay.totalCalories} kcal</span>
                </div>
                <div className="bg-[#f6f8f5] dark:bg-[#272E29] p-2.5 rounded-2xl border border-[#e8ede6] dark:border-[#394139]">
                  <span className="text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1] block">Protein</span>
                  <span className="text-sm sm:text-base font-black text-[#5ba83c] dark:text-[#8BAF78]">{currentDay.totalProtein}g</span>
                </div>
                <div className="bg-[#f6f8f5] dark:bg-[#272E29] p-2.5 rounded-2xl border border-[#e8ede6] dark:border-[#394139]">
                  <span className="text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1] block">Carbohydrates</span>
                  <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">{currentDay.totalCarbs}g</span>
                </div>
                <div className="bg-[#f6f8f5] dark:bg-[#272E29] p-2.5 rounded-2xl border border-[#e8ede6] dark:border-[#394139]">
                  <span className="text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1] block">Fats</span>
                  <span className="text-sm sm:text-base font-black text-sky-600 dark:text-sky-400">{currentDay.totalFat}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Meals Grid for Active Day */}
          {currentDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentDay.meals.map((meal) => (
                <PlannedMealCard
                  key={meal.id}
                  meal={meal}
                  onSwapMeal={(m) => setSwappingMeal(m)}
                  onEditMeal={(m) => setEditingMeal(m)}
                  onLogMeal={(m) => setLoggingMeal(m)}
                  onToggleFavorite={(m) => {
                    toggleFavoritePlannedMeal(m);
                    setFavoritesVersion(v => v + 1);
                    showToast(
                      isFavoritePlannedMeal(m.name) ? `Added "${m.name}" to favorites` : `Removed "${m.name}" from favorites`,
                      'info'
                    );
                  }}
                  isFavorite={isFavoritePlannedMeal(meal.name)}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MEDICAL & NUTRITION RELIABILITY NOTICE                 */}
      {/* ========================================================= */}
      <div className="p-4 rounded-2xl bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] flex items-center gap-3 text-xs text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
        <Info className="w-5 h-5 text-[#5ba83c] shrink-0" />
        <p>
          <strong>NutriCoach AI Nutritional Notice:</strong> Calculated calories and macronutrients are reliable estimates based on authentic ingredient formulas (ICMR-NIN & USDA FoodData Central). Actual values may vary with cooking time and moisture loss. Meal plans are designed for general fitness and wellness support and do not constitute clinical dietetic or medical prescriptions.
        </p>
      </div>

      {/* ========================================================= */}
      {/* MODALS & DRAWERS                                          */}
      {/* ========================================================= */}
      <MealPreferenceModal
        isOpen={isPreferenceModalOpen}
        initialPreferences={preferences}
        onClose={() => setIsPreferenceModalOpen(false)}
        onSubmit={handleGeneratePlan}
        isGenerating={isGenerating}
      />

      <MealEditModal
        meal={editingMeal}
        isOpen={Boolean(editingMeal)}
        onClose={() => setEditingMeal(null)}
        onSave={handleSaveEditedMeal}
      />

      <MealSwapModal
        meal={swappingMeal}
        isOpen={Boolean(swappingMeal)}
        onClose={() => setSwappingMeal(null)}
        onConfirmSwap={handleConfirmSwap}
      />

      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        items={shoppingListItems}
        planTitle={activePlan?.name}
      />

      <LogMealToTrackerModal
        meal={loggingMeal}
        isOpen={Boolean(loggingMeal)}
        onClose={() => setLoggingMeal(null)}
      />

      <SavedPlansDrawer
        isOpen={isSavedPlansOpen}
        onClose={() => setIsSavedPlansOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={(plan) => {
          setActivePlan(plan);
          saveActiveMealPlan(plan);
          setSelectedDayIndex(0);
        }}
        onDeletePlan={(planId) => {
          deleteSavedMealPlan(planId);
          setSavedPlans(getSavedMealPlans());
        }}
      />

    </div>
  );
}
