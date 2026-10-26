import React, { useState, useMemo } from 'react';
import { 
  Utensils, Plus, Trash2, Edit2, Search, 
  ChevronLeft, ChevronRight, Calendar, Sparkles, X, 
  CheckCircle2, Flame, Apple, Coffee, Moon, Sun, 
  Star, Clock, BookOpen, Filter, Check, ArrowRight,
  Globe, Info, RefreshCw, Sliders
} from 'lucide-react';
import { 
  getProfile, getFoodLog, addFoodEntry, 
  deleteFoodEntry, updateFoodEntry, analyzeNutritionGaps, getTodayKey,
  getFavoriteFoodIds, toggleFavoriteFood, isFoodFavorite,
  getUserCustomRecipes, saveUserCustomRecipe, deleteUserCustomRecipe,
  getRecentLoggedFoods
} from '../utils/storage';
import { 
  COMPREHENSIVE_FOOD_DATABASE, searchFoods, calculatePortionNutrition,
  toFoodItem, ComprehensiveFood, ServingSize, FoodCuisine, FoodCategory,
  DietaryType, UserCustomRecipe, RecipeIngredient, customRecipeToComprehensiveFood
} from '../data/foodDatabase';
import DishIngredientCalculatorModal from '../components/DishIngredientCalculatorModal';
import { FoodItem, MealType, PresetFood } from '../types';
import { useToast } from '../context/ToastContext';

export default function FoodTrackerPage() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [foods, setFoods] = useState<FoodItem[]>(() => getFoodLog(selectedDate));
  const [mobileFoodTab, setMobileFoodTab] = useState<'meals' | 'nutrition' | 'history'>('meals');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'search' | 'favorites' | 'recents' | 'recipe_builder' | 'manual'>('search');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [activeMealCategory, setActiveMealCategory] = useState<MealType>('breakfast');
  
  // Food Search & Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<FoodCuisine | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType | 'all'>('all');
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  
  // Selected food from search database
  const [selectedFood, setSelectedFood] = useState<ComprehensiveFood | null>(null);
  const [selectedServing, setSelectedServing] = useState<ServingSize | null>(null);
  const [customGramInput, setCustomGramInput] = useState<number>(100);
  const [isCustomGramsActive, setIsCustomGramsActive] = useState(false);

  // Manual Form State
  const [formName, setFormName] = useState('');
  const [formPortion, setFormPortion] = useState('');
  const [formCalories, setFormCalories] = useState<number>(200);
  const [formProtein, setFormProtein] = useState<number>(20);
  const [formCarbs, setFormCarbs] = useState<number>(15);
  const [formFat, setFormFat] = useState<number>(5);
  const [formFiber, setFormFiber] = useState<number>(3);

  // Custom Recipe Builder State
  const [recipeName, setRecipeName] = useState('');
  const [recipeServings, setRecipeServings] = useState<number>(2);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeIngredientSearch, setRecipeIngredientSearch] = useState('');
  const [recipeIngredientGrams, setRecipeIngredientGrams] = useState<number>(100);
  const [selectedRecipeFood, setSelectedRecipeFood] = useState<ComprehensiveFood | null>(null);

  // Curated list of popular curries and sides for quick-access showcase
  const [curryShowcaseFilter, setCurryShowcaseFilter] = useState<'all' | 'kerala' | 'chicken' | 'beef' | 'seafood' | 'veg'>('all');

  // Favorites trigger state to force re-render
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  // Dish Ingredients & Nutrition Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorFood, setCalculatorFood] = useState<ComprehensiveFood | null>(null);
  const [calculatorMeal, setCalculatorMeal] = useState<MealType>('lunch');

  const handleOpenCalculator = (food: ComprehensiveFood, meal: MealType = 'lunch') => {
    setCalculatorFood(food);
    setCalculatorMeal(meal);
    setIsCalculatorOpen(true);
  };

  const profile = getProfile();

  // Reload foods on date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setFoods(getFoodLog(newDate));
  };

  const handleStepDay = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    if (isNaN(current.getTime())) return;
    current.setDate(current.getDate() + (direction === 'prev' ? -1 : 1));
    const nextStr = current.toISOString().split('T')[0];
    handleDateChange(nextStr);
  };

  const isToday = selectedDate === getTodayKey();

  const meals: { key: MealType; label: string; icon: React.ReactNode; period: string }[] = [
    { key: 'breakfast', label: 'Breakfast', icon: <Coffee className="w-4 h-4 text-amber-500" />, period: 'Morning fuel' },
    { key: 'lunch', label: 'Lunch', icon: <Sun className="w-4 h-4 text-orange-500" />, period: 'Midday recovery' },
    { key: 'dinner', label: 'Dinner', icon: <Moon className="w-4 h-4 text-sky-500" />, period: 'Evening repair' },
    { key: 'snack', label: 'Snacks & Beverages', icon: <Apple className="w-4 h-4 text-[#5ba83c]" />, period: 'Metabolic boost' }
  ];

  // Daily Totals calculation
  const totals = foods.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const caloriesRemaining = Math.max(0, Math.round(profile.calorieTarget - totals.calories));
  const caloriePercent = Math.min(100, Math.round((totals.calories / profile.calorieTarget) * 100)) || 0;

  // Gap analysis recommendations
  const gapAnalysis = analyzeNutritionGaps(profile, foods);

  // Custom User Recipes converted to ComprehensiveFood
  const userCustomRecipes = useMemo(() => {
    return getUserCustomRecipes();
  }, [favoritesVersion]);

  const convertedCustomFoods = useMemo(() => {
    return userCustomRecipes.map((r) => customRecipeToComprehensiveFood(r));
  }, [userCustomRecipes]);

  // Multilingual Search Filtering
  const filteredFoods = useMemo(() => {
    return searchFoods(
      {
        query: searchQuery,
        cuisine: selectedCuisine,
        category: selectedCategory,
        dietaryType: selectedDietary,
        highProteinOnly: highProteinOnly
      },
      convertedCustomFoods
    );
  }, [searchQuery, selectedCuisine, selectedCategory, selectedDietary, highProteinOnly, convertedCustomFoods]);

  // Favorite foods list
  const favoriteFoodIds = useMemo(() => {
    return getFavoriteFoodIds();
  }, [favoritesVersion]);

  const favoriteFoodsList = useMemo(() => {
    const all = [...convertedCustomFoods, ...COMPREHENSIVE_FOOD_DATABASE];
    return all.filter((f) => favoriteFoodIds.includes(f.id));
  }, [favoriteFoodIds, convertedCustomFoods]);

  // Recent logged foods
  const recentFoodsList = useMemo(() => {
    return getRecentLoggedFoods(10);
  }, [foods]);

  // Dynamic nutrition calculation for currently selected food in modal
  const activeServingNutrition = useMemo(() => {
    if (!selectedFood) return null;
    const effectiveGrams = isCustomGramsActive ? customGramInput : (selectedServing?.grams || selectedFood.defaultServing.grams);
    return calculatePortionNutrition(selectedFood, effectiveGrams);
  }, [selectedFood, selectedServing, customGramInput, isCustomGramsActive]);

  // Curated list of popular curries and sides for quick-access showcase
  const featuredCurriesList = useMemo(() => {
    const curries = COMPREHENSIVE_FOOD_DATABASE.filter(
      (f) => f.category === 'curries_gravies' || f.category === 'vegetarian_sides'
    );
    if (curryShowcaseFilter === 'kerala') {
      return curries.filter((c) => c.cuisine === 'kerala');
    }
    if (curryShowcaseFilter === 'chicken') {
      return curries.filter((c) => c.name.toLowerCase().includes('chicken'));
    }
    if (curryShowcaseFilter === 'beef') {
      return curries.filter((c) => c.name.toLowerCase().includes('beef'));
    }
    if (curryShowcaseFilter === 'seafood') {
      return curries.filter((c) => 
        c.dietaryType === 'pescatarian' || 
        c.name.toLowerCase().includes('fish') || 
        c.name.toLowerCase().includes('prawn') || 
        c.name.toLowerCase().includes('sardine') || 
        c.name.toLowerCase().includes('mackerel') || 
        c.name.toLowerCase().includes('squid')
      );
    }
    if (curryShowcaseFilter === 'veg') {
      return curries.filter((c) => c.dietaryType === 'vegetarian' || c.dietaryType === 'vegan');
    }
    return curries;
  }, [curryShowcaseFilter]);

  // Open Modal directly focused on a selected Curry
  const handleOpenCurryModal = (food: ComprehensiveFood, meal: MealType = 'lunch') => {
    setActiveMealCategory(meal);
    setSelectedFood(food);
    setSelectedServing(food.defaultServing);
    setIsCustomGramsActive(false);
    setSearchQuery('');
    setActiveModalTab('search');
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAddModal = (meal: MealType) => {
    setEditingItem(null);
    setActiveMealCategory(meal);
    setSelectedFood(null);
    setSelectedServing(null);
    setSearchQuery('');
    setActiveModalTab('search');
    setIsCustomGramsActive(false);
    setFormName('');
    setFormPortion('');
    setFormCalories(200);
    setFormProtein(20);
    setFormCarbs(15);
    setFormFat(5);
    setFormFiber(3);
    setIsModalOpen(true);
  };

  // Open Edit Modal for already logged item
  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setActiveMealCategory(item.meal);
    setFormName(item.name);
    setFormPortion(item.portion);
    setFormCalories(item.calories);
    setFormProtein(item.protein);
    setFormCarbs(item.carbs);
    setFormFat(item.fat);
    setFormFiber(item.fiber);
    setActiveModalTab('manual');
    setIsModalOpen(true);
  };

  // Select Food from search database
  const handleSelectFood = (food: ComprehensiveFood) => {
    setSelectedFood(food);
    setSelectedServing(food.defaultServing);
    setCustomGramInput(food.defaultServing.grams);
    setIsCustomGramsActive(false);
  };

  // Toggle Favorite
  const handleToggleFavorite = (e: React.MouseEvent, foodId: string) => {
    e.stopPropagation();
    const isNowFav = toggleFavoriteFood(foodId);
    setFavoritesVersion((v) => v + 1);
    showToast(isNowFav ? 'Added to favorites' : 'Removed from favorites', 'info');
  };

  // Quick Add from Database with selected portion
  const handleLogSelectedFood = () => {
    if (!selectedFood || !activeServingNutrition) return;

    const grams = isCustomGramsActive ? customGramInput : (selectedServing?.grams || selectedFood.defaultServing.grams);
    const serving = selectedServing || selectedFood.defaultServing;

    const newEntry = toFoodItem(selectedFood, activeMealCategory, serving, grams);
    addFoodEntry(selectedDate, newEntry);
    setFoods(getFoodLog(selectedDate));
    setIsModalOpen(false);
    showToast(`Logged ${selectedFood.name} to ${activeMealCategory}!`, 'success', 'Food Logged');
  };

  // Quick Add Suggestion (from Gap Analysis)
  const handleQuickAddSuggestion = (preset: PresetFood, meal: MealType = 'lunch') => {
    const newEntry: FoodItem = {
      id: 'food_' + Date.now(),
      name: preset.name,
      meal,
      portion: preset.defaultPortion,
      grams: preset.grams,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      fiber: preset.fiber,
      isCustom: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: preset.category,
      budgetFriendly: preset.budgetFriendly
    };
    addFoodEntry(selectedDate, newEntry);
    setFoods(getFoodLog(selectedDate));
    showToast(`Added ${preset.name} to ${meal}!`, 'success', 'Food Logged');
  };

  // Save Manual Form / Edit Entry
  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a valid food name', 'error');
      return;
    }

    if (editingItem) {
      const updated: FoodItem = {
        ...editingItem,
        name: formName.trim(),
        portion: formPortion.trim() || '1 serving',
        meal: activeMealCategory,
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        fiber: Number(formFiber)
      };
      updateFoodEntry(selectedDate, updated);
      showToast(`Updated ${formName}`, 'success', 'Entry Saved');
    } else {
      const newEntry: Omit<FoodItem, 'id' | 'timestamp'> = {
        name: formName.trim(),
        portion: formPortion.trim() || '1 serving',
        grams: 100,
        meal: activeMealCategory,
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        fiber: Number(formFiber),
        isCustom: true,
        verificationStatus: 'user_provided'
      };
      addFoodEntry(selectedDate, newEntry);
      showToast(`Added ${formName} to ${activeMealCategory}`, 'success', 'Food Logged');
    }

    setFoods(getFoodLog(selectedDate));
    setIsModalOpen(false);
  };

  // Delete Food Entry
  const handleDeleteFood = (id: string, name: string) => {
    deleteFoodEntry(selectedDate, id);
    setFoods(getFoodLog(selectedDate));
    showToast(`Removed ${name}`, 'info', 'Item Removed');
  };

  // Recipe Builder: Add Ingredient
  const handleAddRecipeIngredient = () => {
    if (!selectedRecipeFood) return;
    const nutrition = calculatePortionNutrition(selectedRecipeFood, recipeIngredientGrams);
    const newIngredient: RecipeIngredient = {
      foodId: selectedRecipeFood.id,
      foodName: selectedRecipeFood.name,
      grams: recipeIngredientGrams,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber
    };
    setRecipeIngredients([...recipeIngredients, newIngredient]);
    setSelectedRecipeFood(null);
    setRecipeIngredientSearch('');
    setRecipeIngredientGrams(100);
    showToast(`Added ${selectedRecipeFood.name} to recipe`, 'success');
  };

  // Recipe Builder: Remove Ingredient
  const handleRemoveRecipeIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  // Recipe Builder: Save Recipe
  const handleSaveRecipe = () => {
    if (!recipeName.trim() || recipeIngredients.length === 0) {
      showToast('Please provide a recipe name and at least one ingredient', 'error');
      return;
    }
    const totalGrams = recipeIngredients.reduce((acc, ing) => acc + ing.grams, 0);
    const totalCalories = recipeIngredients.reduce((acc, ing) => acc + ing.calories, 0);
    const totalProtein = recipeIngredients.reduce((acc, ing) => acc + ing.protein, 0);
    const totalCarbs = recipeIngredients.reduce((acc, ing) => acc + ing.carbs, 0);
    const totalFat = recipeIngredients.reduce((acc, ing) => acc + ing.fat, 0);
    const totalFiber = recipeIngredients.reduce((acc, ing) => acc + ing.fiber, 0);

    const yields = Math.max(1, recipeServings);

    const newRecipe: UserCustomRecipe = {
      id: 'custom_rec_' + Date.now(),
      name: recipeName.trim(),
      cuisine: 'kerala',
      servingsYield: yields,
      ingredients: recipeIngredients,
      totalPerServing: {
        grams: Math.round(totalGrams / yields),
        calories: Math.round(totalCalories / yields),
        protein: Math.round((totalProtein / yields) * 10) / 10,
        carbs: Math.round((totalCarbs / yields) * 10) / 10,
        fat: Math.round((totalFat / yields) * 10) / 10,
        fiber: Math.round((totalFiber / yields) * 10) / 10
      },
      createdAt: new Date().toISOString()
    };

    saveUserCustomRecipe(newRecipe);
    setFavoritesVersion((v) => v + 1);
    setRecipeName('');
    setRecipeIngredients([]);
    setActiveModalTab('search');
    showToast(`Saved recipe "${newRecipe.name}"!`, 'success');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ========================================================= */}
      {/* MOBILE-SPECIFIC FOOD TRACKER VIEW (Screen 2 Reference)    */}
      {/* ========================================================= */}
      <div className="lg:hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h1 className="text-xl font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight">
              Food Tracker
            </h1>
            <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] font-medium">
              Track your meals and stay on target
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAddModal('lunch')}
              className="px-3 py-1.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              aria-label="Log Food"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log</span>
            </button>
          </div>
        </div>

        {/* Date Stepper Bar: < Today, 26 Apr 2025 > */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] p-2 rounded-2xl shadow-xs">
          <button
            onClick={() => handleStepDay('prev')}
            className="p-2 text-[#7a8c79] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] rounded-xl transition-colors active:scale-95"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <label
            htmlFor="mobile-tracker-date"
            className="flex items-center gap-1.5 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#5ba83c]" />
            <span>
              {isToday ? 'Today, ' : ''}
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <input
              id="mobile-tracker-date"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="sr-only"
            />
          </label>

          <button
            onClick={() => handleStepDay('next')}
            className="p-2 text-[#7a8c79] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] rounded-xl transition-colors active:scale-95"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calorie & Macro Gauge Card (Circular gauge on left, horizontal bars on right) */}
        <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[24px] p-4 shadow-xs flex items-center gap-4">
          {/* Left: Circular Calorie Gauge */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-[#eef7eb] dark:text-[#272E29]"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#5ba83c"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(1, totals.calories / (profile.calorieTarget || 2000)))}`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="text-base font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight leading-none">
                {caloriesRemaining > 0 ? caloriesRemaining.toLocaleString() : 0}
              </span>
              <span className="text-[9px] font-bold text-[#7a8c79] dark:text-[#A2AAA1] uppercase tracking-wider mt-0.5">
                {caloriesRemaining > 0 ? 'kcal left' : 'Goal met'}
              </span>
              <span className="text-[9px] text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5">
                {Math.round(totals.calories)}/{profile.calorieTarget}
              </span>
            </div>
          </div>

          {/* Right: Macro Progress Bars */}
          <div className="flex-1 space-y-2.5">
            {/* Protein */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-rose-600 dark:text-rose-400">Protein</span>
                <span className="text-[#192418] dark:text-[#E8EDE7]">
                  {Math.round(totals.protein)} / {profile.proteinTargetGrams}g
                </span>
              </div>
              <div className="h-2 w-full bg-rose-100/60 dark:bg-rose-950/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.protein / (profile.proteinTargetGrams || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-amber-600 dark:text-amber-400">Carbs</span>
                <span className="text-[#192418] dark:text-[#E8EDE7]">
                  {Math.round(totals.carbs)} / {profile.carbsTargetGrams}g
                </span>
              </div>
              <div className="h-2 w-full bg-amber-100/60 dark:bg-amber-950/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.carbs / (profile.carbsTargetGrams || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-sky-600 dark:text-sky-400">Fats</span>
                <span className="text-[#192418] dark:text-[#E8EDE7]">
                  {Math.round(totals.fat)} / {profile.fatTargetGrams}g
                </span>
              </div>
              <div className="h-2 w-full bg-sky-100/60 dark:bg-sky-950/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fat / (profile.fatTargetGrams || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector Pills: Meals | Nutrition | History */}
        <div className="flex items-center bg-[#f6f8f5] dark:bg-[#272E29] p-1 rounded-2xl border border-[#e8ede6] dark:border-[#394139]">
          {(['meals', 'nutrition', 'history'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileFoodTab(tab)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                mobileFoodTab === tab
                  ? 'bg-[#5ba83c] text-white shadow-xs'
                  : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: MEALS */}
        {mobileFoodTab === 'meals' && (
          <div className="space-y-3.5">
            {/* Quick Access Curry & Recipe Calculator Banner */}
            <div className="bg-gradient-to-r from-[#eef7eb] via-[#f7fbf6] to-[#e7f4e3] dark:from-[#272E29] dark:via-[#1C211D] dark:to-[#272E29] border border-[#d6ebd0] dark:border-[#394139] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#3b7e23] dark:text-[#8BAF78] uppercase tracking-wider">
                    DISH CALCULATOR
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-[#192418] dark:text-[#E8EDE7] truncate">
                  Kerala & Regional Curries
                </h4>
                <p className="text-[10px] text-[#5e6f5e] dark:text-[#A2AAA1]">
                  Customize ingredients & recalculate nutrition live
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCalculator(COMPREHENSIVE_FOOD_DATABASE[0], 'lunch')}
                className="px-3 py-1.5 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-xl text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all"
              >
                Customize
              </button>
            </div>

            {/* 4 Meals List (Breakfast, Lunch, Dinner, Snack) */}
            {meals.map((meal) => {
              const mealFoods = foods.filter((f) => f.meal === meal.key);
              const mealCalories = mealFoods.reduce((acc, f) => acc + f.calories, 0);
              const mealProtein = mealFoods.reduce((acc, f) => acc + f.protein, 0);

              return (
                <div
                  key={meal.key}
                  className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-4 shadow-xs space-y-3"
                >
                  {/* Meal Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#f6f8f5] dark:bg-[#272E29] flex items-center justify-center">
                        {meal.icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#192418] dark:text-[#E8EDE7]">
                          {meal.label}
                        </h3>
                        <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-semibold">
                          {Math.round(mealCalories)} kcal • {mealProtein.toFixed(1)}g Protein
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(meal.key)}
                      className="w-8 h-8 rounded-xl bg-[#eef7eb] dark:bg-[#272E29] hover:bg-[#5ba83c] hover:text-white text-[#3b7e23] dark:text-[#8BAF78] flex items-center justify-center transition-all active:scale-95 border border-[#d6ebd0] dark:border-[#394139]"
                      aria-label={`Add food to ${meal.label}`}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Logged Items */}
                  {mealFoods.length === 0 ? (
                    <div
                      onClick={() => handleOpenAddModal(meal.key)}
                      className="py-3 px-3 rounded-xl border border-dashed border-[#e8ede6] dark:border-[#394139] text-center cursor-pointer hover:border-[#5ba83c]/50 transition-colors"
                    >
                      <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1] flex items-center justify-center gap-1.5 font-medium">
                        <Plus className="w-3.5 h-3.5 text-[#5ba83c]" />
                        No {meal.label.toLowerCase()} logged yet • Tap to add
                      </span>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f0f4ee] dark:divide-[#394139]">
                      {mealFoods.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-[#192418] dark:text-[#E8EDE7] truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5">
                              <span>{item.portion}</span>
                              <span>•</span>
                              <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">{item.calories} kcal</span>
                              <span>•</span>
                              <span className="text-rose-600 dark:text-rose-400 font-semibold">{item.protein}g P</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-[#7a8c79] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] rounded-lg"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFood(item.id, item.name)}
                              className="p-1.5 text-[#7a8c79] dark:text-[#A2AAA1] hover:text-rose-600 rounded-lg"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: NUTRITION */}
        {mobileFoodTab === 'nutrition' && (
          <div className="space-y-4">
            {/* 5 Macro Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2 bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] p-3.5 rounded-2xl">
                <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] uppercase font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> TOTAL CALORIES
                </span>
                <div className="text-2xl font-black text-[#192418] dark:text-[#E8EDE7] mt-1">
                  {Math.round(totals.calories).toLocaleString()}
                  <span className="text-xs text-[#7a8c79] dark:text-[#A2AAA1] font-normal"> / {profile.calorieTarget} kcal</span>
                </div>
                <div className="h-2 w-full bg-[#eef7eb] dark:bg-[#272E29] rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#5ba83c] rounded-full" style={{ width: `${caloriePercent}%` }} />
                </div>
              </div>

              <div className="bg-[#fff9f9] dark:bg-[#272E29] border border-rose-100 dark:border-[#394139] p-3 rounded-2xl">
                <span className="text-[10px] text-rose-500 uppercase font-bold">PROTEIN</span>
                <div className="text-lg font-black text-[#192418] dark:text-[#E8EDE7] mt-0.5">
                  {Math.round(totals.protein)}g <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-normal">/ {profile.proteinTargetGrams}g</span>
                </div>
              </div>

              <div className="bg-[#fffcf7] dark:bg-[#272E29] border border-amber-100 dark:border-[#394139] p-3 rounded-2xl">
                <span className="text-[10px] text-amber-600 uppercase font-bold">CARBS</span>
                <div className="text-lg font-black text-[#192418] dark:text-[#E8EDE7] mt-0.5">
                  {Math.round(totals.carbs)}g <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-normal">/ {profile.carbsTargetGrams}g</span>
                </div>
              </div>

              <div className="bg-[#f8fcff] dark:bg-[#272E29] border border-sky-100 dark:border-[#394139] p-3 rounded-2xl">
                <span className="text-[10px] text-sky-600 uppercase font-bold">FATS</span>
                <div className="text-lg font-black text-[#192418] dark:text-[#E8EDE7] mt-0.5">
                  {Math.round(totals.fat)}g <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-normal">/ {profile.fatTargetGrams}g</span>
                </div>
              </div>

              <div className="bg-[#f8fdfa] dark:bg-[#272E29] border border-emerald-100 dark:border-[#394139] p-3 rounded-2xl">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">FIBER</span>
                <div className="text-lg font-black text-[#192418] dark:text-[#E8EDE7] mt-0.5">
                  {Math.round(totals.fiber)}g <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-normal">/ {profile.fiberTargetGrams}g</span>
                </div>
              </div>
            </div>

            {/* Gap Analysis / Recommendations */}
            <div className="bg-gradient-to-br from-[#eef7eb] to-[#f7fbf6] dark:from-[#272E29] dark:to-[#1C211D] border border-[#d6ebd0] dark:border-[#394139] rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5ba83c]" />
                <h4 className="text-xs font-extrabold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider">
                  Recommended Foods for Today
                </h4>
              </div>
              <div className="space-y-2">
                {gapAnalysis.suggestedFoods.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#1C211D] border border-[#d6ebd0] dark:border-[#394139] flex items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-[#192418] dark:text-[#E8EDE7]">{item.name}</h5>
                      <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1]">
                        {item.defaultPortion} • {item.calories} kcal • {item.protein}g P
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickAddSuggestion(item, 'dinner')}
                      className="px-2.5 py-1 bg-[#eef7eb] dark:bg-[#272E29] hover:bg-[#5ba83c] hover:text-white text-[#3b7e23] dark:text-[#8BAF78] rounded-lg text-xs font-bold transition-colors shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {mobileFoodTab === 'history' && (
          <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-4 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-[#192418] dark:text-[#E8EDE7]">
              Recently Logged Foods
            </h3>
            {recentFoodsList.length === 0 ? (
              <p className="text-xs text-[#7a8c79] dark:text-[#A2AAA1] py-4 text-center">
                No previous food history yet. Start logging meals!
              </p>
            ) : (
              <div className="divide-y divide-[#f0f4ee] dark:divide-[#394139]">
                {recentFoodsList.slice(0, 8).map((rf, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#192418] dark:text-[#E8EDE7] truncate">{rf.name}</h4>
                      <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1]">
                        {rf.calories} kcal • {rf.protein}g Protein
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const entry: Omit<FoodItem, 'id' | 'timestamp'> = {
                          name: rf.name,
                          meal: 'lunch',
                          portion: '1 serving',
                          grams: 100,
                          calories: rf.calories,
                          protein: rf.protein,
                          carbs: rf.carbs,
                          fat: rf.fat,
                          fiber: rf.fiber,
                          isCustom: false
                        };
                        addFoodEntry(selectedDate, entry);
                        setFoods(getFoodLog(selectedDate));
                        showToast(`Re-logged ${rf.name}!`, 'success');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#eef7eb] dark:bg-[#272E29] hover:bg-[#5ba83c] hover:text-white text-[#3b7e23] dark:text-[#8BAF78] text-xs font-bold transition-all shrink-0"
                    >
                      + Log Again
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP FOOD TRACKER VIEW (FULL EXISTING INTERFACE)       */}
      {/* ========================================================= */}
      <div className="hidden lg:block space-y-6">
        {/* HEADER & DATE SELECTOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8ede6]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
                AUTHENTIC FOOD DATABASE
              </span>
              <span className="text-xs text-[#7a8c79] font-medium">Kerala • Regional Indian • Global</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
              Food & Macronutrient Tracker
            </h1>
            <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
              Log foods by precise portion size, track Kerala, regional Indian & international curries, and balance macros in real time.
            </p>
          </div>

          {/* Date Selector Pill */}
          <div className="flex items-center gap-2 bg-white border border-[#e8ede6] p-1.5 rounded-2xl shadow-xs self-start md:self-auto">
            <button
              onClick={() => handleStepDay('prev')}
              className="p-1.5 text-[#7a8c79] hover:text-[#192418] hover:bg-[#f6f8f5] rounded-xl transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDateChange(getTodayKey())}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                isToday
                  ? 'bg-[#5ba83c] text-white shadow-xs'
                  : 'text-[#5e6f5e] hover:text-[#192418] hover:bg-[#f6f8f5]'
              }`}
            >
              Today
            </button>

            <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-[#192418]">
              <Calendar className="w-3.5 h-3.5 text-[#5ba83c]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-transparent text-[#192418] text-xs font-medium focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleStepDay('next')}
              className="p-1.5 text-[#7a8c79] hover:text-[#192418] hover:bg-[#f6f8f5] rounded-xl transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DAILY NUTRITION TARGETS CARD */}
        <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7a8c79] font-bold block">
              DAILY NUTRITION TARGETS
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-[#192418]">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-[#8e9f8e]">•</span>
              <span className="text-xs text-[#5e6f5e] capitalize">
                {profile.dietType} • {profile.goal.replace('_', ' ')}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#8e9f8e] italic">
            *Verified against ICMR-NIN & USDA nutritional standards
          </span>
        </div>

        {/* 5-Column Macro Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Calories Hero Card */}
          <div className="col-span-2 lg:col-span-1 bg-[#f9fbf8] border border-[#e8ede6] p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#7a8c79] uppercase font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> CALORIES
                </span>
                <span className="text-[10px] text-[#5ba83c] font-bold">
                  {caloriePercent}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.calories).toLocaleString()}
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.calorieTarget.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 w-full bg-[#eef7eb] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5ba83c] rounded-full transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Target achieved!'}
              </span>
            </div>
          </div>

          {/* Protein: Pastel Coral */}
          <div className="bg-[#fff9f9] border border-rose-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-rose-500 uppercase font-bold">PROTEIN</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.protein / profile.proteinTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.protein)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.proteinTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-rose-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#fb7185] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.protein / profile.proteinTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.proteinTargetGrams - totals.protein))}g to reach target
              </span>
            </div>
          </div>

          {/* Carbs: Pastel Amber */}
          <div className="bg-[#fffcf7] border border-amber-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-amber-600 uppercase font-bold">CARBS</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.carbs / profile.carbsTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.carbs)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.carbsTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-amber-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f59e0b] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.carbs / profile.carbsTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.carbsTargetGrams - totals.carbs))}g remaining
              </span>
            </div>
          </div>

          {/* Fats: Pastel Blue */}
          <div className="bg-[#f8fcff] border border-sky-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-sky-600 uppercase font-bold">FATS</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.fat / profile.fatTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.fat)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.fatTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-sky-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38bdf8] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fat / profile.fatTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.fatTargetGrams - totals.fat))}g remaining
              </span>
            </div>
          </div>

          {/* Fiber: Pastel Mint */}
          <div className="bg-[#f8fdfa] border border-emerald-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">FIBER</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.fiber / profile.fiberTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.fiber)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.fiberTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-emerald-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fiber / profile.fiberTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.fiberTargetGrams - totals.fiber))}g needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FEATURED CURRIES & AUTHENTIC SIDE DISHES MENU             */}
      {/* ========================================================= */}
      <div className="bg-white border border-[#e8ede6] rounded-[28px] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
                AUTHENTIC CURRIES & SIDES MENU
              </span>
              <span className="text-xs text-[#7a8c79] font-medium">Kerala • Regional Indian • International</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#192418] tracking-tight">
              Featured Curries & Traditional Side Dishes
            </h2>
            <p className="text-xs text-[#5e6f5e] mt-0.5 font-medium">
              Select any authentic curry or side dish, choose your portion size (100g, 1 cup, 1 bowl, or custom grams), and add it directly to your Food Tracker.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('curries_gravies');
                handleOpenAddModal('lunch');
              }}
              className="px-4 py-2 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Browse All Curries</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { key: 'all', label: 'All Curries & Sides' },
            { key: 'kerala', label: 'Kerala Specialties' },
            { key: 'chicken', label: 'Chicken Curries' },
            { key: 'beef', label: 'Beef Curries' },
            { key: 'seafood', label: 'Fish & Seafood' },
            { key: 'veg', label: 'Vegetarian & Dals' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCurryShowcaseFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                curryShowcaseFilter === tab.key
                  ? 'bg-[#192418] text-white shadow-xs'
                  : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Curries Grid (Showing 8 top curated items according to filter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {featuredCurriesList.slice(0, 8).map((curry) => (
            <div
              key={curry.id}
              onClick={() => handleOpenCalculator(curry, 'lunch')}
              className="p-4 rounded-2xl border border-[#e8ede6] dark:border-[#394139] bg-[#fcfdfc] dark:bg-[#272E29] hover:border-[#5ba83c] hover:bg-white dark:hover:bg-[#1C211D] transition-all flex flex-col justify-between shadow-xs group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#1C211D] px-2 py-0.5 rounded-md border border-[#d6ebd0] dark:border-[#394139]">
                    {curry.region}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    curry.dietaryType === 'non_vegetarian'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                      : curry.dietaryType === 'pescatarian'
                      ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                  }`}>
                    {curry.dietaryType === 'non_vegetarian' ? 'Non-Veg' : curry.dietaryType === 'pescatarian' ? 'Seafood' : 'Vegetarian'}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] group-hover:text-[#5ba83c] transition-colors leading-snug">
                  {curry.name}
                </h3>

                <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] mt-1 line-clamp-2 leading-relaxed">
                  {curry.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#f0f4ee] dark:border-[#394139] flex items-center justify-between text-[11px]">
                  <span className="text-[#7a8c79] dark:text-[#A2AAA1]">Per 100g:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">{curry.per100g.calories} kcal</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{curry.per100g.protein}g Protein</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCalculator(curry, 'lunch');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#eef7eb] dark:bg-[#1C211D] hover:bg-[#d6ebd0] dark:hover:bg-[#394139] text-[#3b7e23] dark:text-[#8BAF78] text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95 border border-[#d6ebd0] dark:border-[#394139]"
                  title="Customize ingredients, adjust oil/quantities, and calculate live nutrition"
                >
                  <Sliders className="w-3 h-3 text-[#5ba83c]" />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCurryModal(curry, 'lunch');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-[11px] font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Select & Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 MEAL CATEGORIES LIST */}
      <div className="space-y-4">
        {meals.map((meal) => {
          const mealFoods = foods.filter((f) => f.meal === meal.key);
          const mealCalories = mealFoods.reduce((acc, f) => acc + f.calories, 0);
          const mealProtein = mealFoods.reduce((acc, f) => acc + f.protein, 0);
          const mealCarbs = mealFoods.reduce((acc, f) => acc + f.carbs, 0);
          const mealFat = mealFoods.reduce((acc, f) => acc + f.fat, 0);

          return (
            <div key={meal.key} className="bg-white border border-[#e8ede6] rounded-[24px] p-5 sm:p-6 transition-all hover:border-[#d6e2d3] shadow-xs">
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0f4ee]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f6f8f5] border border-[#e8ede6] flex items-center justify-center">
                    {meal.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#192418]">
                        {meal.label}
                      </h3>
                      <span className="text-[11px] text-[#7a8c79] hidden sm:inline">
                        • {meal.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#5e6f5e] mt-0.5">
                      <span className="text-[#192418] font-bold">{Math.round(mealCalories)} kcal</span>
                      <span className="text-[#cbd7c8]">|</span>
                      <span className="font-semibold text-rose-600">{mealProtein.toFixed(1)}g P</span>
                      <span className="text-[#cbd7c8]">|</span>
                      <span className="font-semibold text-amber-600">{mealCarbs.toFixed(1)}g C</span>
                      <span className="text-[#cbd7c8]">|</span>
                      <span className="font-semibold text-sky-600">{mealFat.toFixed(1)}g F</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddModal(meal.key)}
                  className="px-3.5 py-2 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Log Food</span>
                </button>
              </div>

              {/* Items in Meal */}
              <div className="mt-3">
                {mealFoods.length === 0 ? (
                  <div
                    onClick={() => handleOpenAddModal(meal.key)}
                    className="py-5 px-4 rounded-2xl border border-dashed border-[#e8ede6] hover:border-[#5ba83c]/50 text-center cursor-pointer transition-colors group bg-[#fdfefd]"
                  >
                    <span className="text-xs text-[#7a8c79] group-hover:text-[#192418] transition-colors flex items-center justify-center gap-2 font-medium">
                      <Plus className="w-3.5 h-3.5 text-[#8e9f8e] group-hover:text-[#5ba83c]" />
                      No items logged for {meal.label.toLowerCase()} yet. Search Kerala, Indian, or global foods to log.
                    </span>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f0f4ee]">
                    {mealFoods.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2.5 rounded-xl hover:bg-[#f6f8f5] transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-[#192418]">{item.name}</h4>
                            <span className="text-[11px] text-[#7a8c79]">
                              ({item.portion})
                            </span>
                            {item.cuisine && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f6f8f5] border border-[#e8ede6] text-[#5e6f5e]">
                                {item.cuisine}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#5e6f5e] mt-0.5 flex flex-wrap items-center gap-2.5">
                            <span className="text-[#192418] font-bold">{item.calories} kcal</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-rose-600">{item.protein}g Protein</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-amber-600">{item.carbs}g Carbs</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-sky-600">{item.fat}g Fat</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-emerald-600">{item.fiber}g Fiber</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto opacity-75 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-[#7a8c79] hover:text-[#192418] rounded-xl hover:bg-white border border-transparent hover:border-[#e8ede6] transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(item.id, item.name)}
                            className="p-1.5 text-[#7a8c79] hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLEMENTARY FOOD SUGGESTIONS BASED ON GAPS */}
      <div className="bg-gradient-to-br from-[#eef7eb] via-[#f7fbf6] to-[#e7f4e3] border border-[#d6ebd0] rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#5ba83c]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] block">
                MACRO GAP ANALYSIS & CULTURAL RECOMMENDATIONS
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#192418]">
                Recommended Foods to Complete Today's Targets
              </h3>
            </div>
          </div>
          <span className="text-xs text-[#5e6f5e] font-medium self-start sm:self-auto bg-white px-3 py-1 rounded-full border border-[#d6ebd0]">
            {profile.dietType} • {profile.budget} budget
          </span>
        </div>

        <p className="text-xs text-[#5e6f5e] mb-5 max-w-2xl leading-relaxed font-medium">
          Based on what you have logged today, here are practical, nutrient-dense regional and staple foods that will close your remaining protein and micronutrient gaps without exceeding your calorie budget.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gapAnalysis.suggestedFoods.map((preset, i) => (
            <div
              key={i}
              className="bg-white border border-[#d6ebd0] p-4 rounded-2xl flex flex-col justify-between hover:border-[#5ba83c] transition-all shadow-xs group"
            >
              <div>
                <span className="text-[10px] text-[#3b7e23] uppercase font-bold block">
                  {preset.category}
                </span>
                <h4 className="font-bold text-sm text-[#192418] mt-1 group-hover:text-[#5ba83c] transition-colors">
                  {preset.name}
                </h4>
                <span className="text-[11px] text-[#7a8c79] block mt-0.5">
                  {preset.defaultPortion}
                </span>

                <div className="grid grid-cols-2 gap-1.5 bg-[#f6f8f5] p-2.5 rounded-xl my-3 text-[11px] border border-[#e8ede6]">
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">CALORIES</span>
                    <span className="text-[#192418] font-bold">{preset.calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">PROTEIN</span>
                    <span className="text-rose-600 font-bold">{preset.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">CARBS</span>
                    <span className="text-amber-600 font-medium">{preset.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">FIBER</span>
                    <span className="text-emerald-600 font-medium">{preset.fiber}g</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickAddSuggestion(preset, 'dinner')}
                className="w-full py-2 bg-[#eef7eb] hover:bg-[#5ba83c] text-[#3b7e23] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Dinner</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* ========================================================= */}
      {/* COMPREHENSIVE ADD / LOG FOOD MODAL                        */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl my-2 sm:my-6 animate-fade-in max-h-[92vh] sm:max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ee]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block">
                  {editingItem ? 'EDIT LOGGED ENTRY' : `LOG FOOD TO ${activeMealCategory.toUpperCase()}`}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#192418]">
                  {editingItem ? 'Modify Food Entry' : 'Comprehensive Food Database'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#7a8c79] hover:text-[#192418] p-2 rounded-xl bg-[#f6f8f5] hover:bg-[#edf2ea] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            {!editingItem && (
              <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-[#f0f4ee] text-xs font-bold scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('search')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    activeModalTab === 'search'
                      ? 'bg-[#5ba83c] text-white shadow-xs'
                      : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Foods (170+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('favorites')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    activeModalTab === 'favorites'
                      ? 'bg-[#5ba83c] text-white shadow-xs'
                      : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Favorites ({favoriteFoodsList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('recents')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    activeModalTab === 'recents'
                      ? 'bg-[#5ba83c] text-white shadow-xs'
                      : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#7a8c79]" />
                  <span>Recent Foods</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('recipe_builder')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    activeModalTab === 'recipe_builder'
                      ? 'bg-[#5ba83c] text-white shadow-xs'
                      : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  <span>Recipe Builder</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('manual')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    activeModalTab === 'manual'
                      ? 'bg-[#5ba83c] text-white shadow-xs'
                      : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418]'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Quick Manual Entry</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              
              {/* TAB 1: SEARCH FOOD DATABASE */}
              {activeModalTab === 'search' && (
                <div className="space-y-4">
                  {/* Search Bar with Curry & Food prompt */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search curries, sides, & foods (e.g. chicken curry, beef curry, fish curry, sambar, avial, thoran, kadala, butter chicken, dal)..."
                      className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e9f8e] hover:text-[#192418]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Chips */}
                  <div className="space-y-2 text-xs">
                    {/* Cuisine Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      <span className="text-[10px] font-bold uppercase text-[#7a8c79] mr-1 shrink-0">Cuisine:</span>
                      {[
                        { key: 'all', label: 'All Cuisines' },
                        { key: 'kerala', label: '🌴 Kerala Cuisine' },
                        { key: 'south_indian', label: 'South Indian' },
                        { key: 'north_indian', label: 'North Indian' },
                        { key: 'middle_eastern', label: 'Middle Eastern' },
                        { key: 'asian', label: 'Asian' },
                        { key: 'mediterranean', label: 'Mediterranean' },
                        { key: 'western', label: 'Western / Staples' }
                      ].map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setSelectedCuisine(c.key as any)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            selectedCuisine === c.key
                              ? 'bg-[#192418] text-white shadow-xs'
                              : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>

                    {/* Secondary Filters (Category, Dietary, Quick Curry Buttons, High Protein) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                        className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-2.5 py-1 text-[11px] text-[#192418] font-bold focus:outline-none"
                      >
                        <option value="all">All Categories</option>
                        <option value="curries_gravies">🍛 Curries & Gravies</option>
                        <option value="vegetarian_sides">🥗 Veg Sides & Thorans</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="staples_grains">Staples & Grains</option>
                        <option value="seafood">Seafood</option>
                        <option value="meat_poultry">Meat & Poultry</option>
                        <option value="snacks_streetfood">Snacks & Street Food</option>
                        <option value="beverages">Drinks & Beverages</option>
                        <option value="desserts">Desserts & Sweets</option>
                        <option value="fitness_staples">Fitness Staples</option>
                      </select>

                      <select
                        value={selectedDietary}
                        onChange={(e) => setSelectedDietary(e.target.value as any)}
                        className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-2.5 py-1 text-[11px] text-[#192418] font-bold focus:outline-none"
                      >
                        <option value="all">All Diets</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="pescatarian">Pescatarian (Fish & Seafood)</option>
                        <option value="non_vegetarian">Non-Vegetarian</option>
                      </select>

                      {/* Quick Curry Category Shortcut */}
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === 'curries_gravies' ? 'all' : 'curries_gravies')}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                          selectedCategory === 'curries_gravies'
                            ? 'bg-[#3b7e23] text-white shadow-xs'
                            : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                        }`}
                      >
                        <span>🍛 Curries</span>
                      </button>

                      {/* Quick Veg Sides Shortcut */}
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === 'vegetarian_sides' ? 'all' : 'vegetarian_sides')}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                          selectedCategory === 'vegetarian_sides'
                            ? 'bg-[#3b7e23] text-white shadow-xs'
                            : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                        }`}
                      >
                        <span>🥗 Veg Sides & Thoran</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHighProteinOnly(!highProteinOnly)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                          highProteinOnly
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-[#f6f8f5] text-[#5e6f5e] border border-[#e8ede6]'
                        }`}
                      >
                        <Flame className="w-3 h-3" />
                        <span>High Protein (&gt;15g)</span>
                      </button>
                    </div>
                  </div>

                  {/* Food List & Detail Split View */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* List Column (7 cols) */}
                    <div className="md:col-span-7 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      <div className="text-[10px] font-bold text-[#7a8c79] uppercase px-1">
                        Showing {filteredFoods.length} foods
                      </div>

                      {filteredFoods.length === 0 ? (
                        <div className="py-8 text-center bg-[#fdfefd] border border-dashed border-[#e8ede6] rounded-2xl">
                          <p className="text-xs text-[#7a8c79] font-medium">
                            No foods match "{searchQuery}". Try searching by curry name, ingredient, or cuisine.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCuisine('all');
                              setSelectedCategory('all');
                              setHighProteinOnly(false);
                            }}
                            className="mt-2 text-xs font-bold text-[#5ba83c] hover:underline"
                          >
                            Reset filters
                          </button>
                        </div>
                      ) : (
                        filteredFoods.map((food) => {
                          const isSelected = selectedFood?.id === food.id;
                          const isFav = favoriteFoodIds.includes(food.id);

                          return (
                            <div
                              key={food.id}
                              onClick={() => handleSelectFood(food)}
                              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                                isSelected
                                  ? 'bg-[#eef7eb] border-[#5ba83c] shadow-xs'
                                  : 'bg-white border-[#e8ede6] hover:border-[#cbd7c8] hover:bg-[#fcfdfc]'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs font-bold text-[#192418] truncate">
                                    {food.name}
                                  </h4>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                    food.dietaryType === 'vegetarian' || food.dietaryType === 'vegan'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : food.dietaryType === 'pescatarian'
                                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {food.dietaryType === 'vegetarian' ? 'Veg' : food.dietaryType === 'vegan' ? 'Vegan' : food.dietaryType === 'pescatarian' ? 'Seafood' : 'Non-Veg'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-[#7a8c79] mt-0.5 flex items-center gap-2">
                                  <span className="capitalize">{food.region}</span>
                                  <span>•</span>
                                  <span>{food.defaultServing.label}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-right">
                                  <span className="text-xs font-black text-[#192418] block">
                                    {food.per100g.calories} kcal
                                  </span>
                                  <span className="text-[10px] font-bold text-rose-600 block">
                                    {food.per100g.protein}g P /100g
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => handleToggleFavorite(e, food.id)}
                                  className="p-1.5 rounded-lg text-[#7a8c79] hover:text-amber-500 hover:bg-[#f6f8f5] transition-colors"
                                  title="Toggle favorite"
                                >
                                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Selected Food Detail & Portion Customizer (5 cols) */}
                    <div className="md:col-span-5 bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl p-4 flex flex-col justify-between">
                      {selectedFood && activeServingNutrition ? (
                        <div className="space-y-3.5">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2 py-0.5 rounded-full border border-[#d6ebd0]">
                                {selectedFood.cuisine.toUpperCase()} • {selectedFood.category.replace('_', ' ')}
                              </span>
                              <span className="text-[9px] text-[#7a8c79] italic">
                                {selectedFood.verificationStatus === 'verified' ? '✓ ICMR/USDA Verified' : 'Estimated'}
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-[#192418]">
                              {selectedFood.name}
                            </h4>
                            <p className="text-[11px] text-[#5e6f5e] mt-1 line-clamp-2">
                              {selectedFood.description}
                            </p>
                          </div>

                          {/* Portion Selection */}
                          <div className="pt-2 border-t border-[#e8ede6]">
                            <label className="text-[10px] font-bold text-[#192418] uppercase tracking-wider block mb-1.5">
                              Select Portion Size:
                            </label>
                            <div className="space-y-1.5">
                              {selectedFood.servings.map((serving, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedServing(serving);
                                    setIsCustomGramsActive(false);
                                  }}
                                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                    !isCustomGramsActive && selectedServing?.label === serving.label
                                      ? 'bg-[#5ba83c] text-white font-bold'
                                      : 'bg-white text-[#192418] hover:bg-[#edf2ea] border border-[#e8ede6]'
                                  }`}
                                >
                                  <span>{serving.label}</span>
                                  <span className="text-[10px] opacity-80">{serving.grams}g</span>
                                </button>
                              ))}

                              {/* Custom Grams Option */}
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => setIsCustomGramsActive(true)}
                                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                    isCustomGramsActive
                                      ? 'bg-[#192418] text-white font-bold'
                                      : 'bg-white text-[#192418] hover:bg-[#edf2ea] border border-[#e8ede6]'
                                  }`}
                                >
                                  <span>Custom Weight (Grams)</span>
                                  <span className="text-[10px]">Enter grams</span>
                                </button>

                                {isCustomGramsActive && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="1"
                                      max="2000"
                                      value={customGramInput}
                                      onChange={(e) => setCustomGramInput(Math.max(1, Number(e.target.value)))}
                                      className="w-24 bg-white border border-[#e8ede6] rounded-xl px-2.5 py-1 text-xs text-[#192418] font-bold"
                                    />
                                    <span className="text-xs text-[#7a8c79]">grams</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Nutrition Preview for Selected Portion */}
                          <div className="bg-white p-3 rounded-xl border border-[#e8ede6] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-[#7a8c79]">Portion Nutrition</span>
                              <span className="text-xs font-black text-[#192418]">{activeServingNutrition.calories} kcal</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                              <div className="bg-rose-50 p-1.5 rounded-lg">
                                <span className="block text-[8px] font-bold text-rose-500">PROTEIN</span>
                                <span className="font-bold text-rose-700">{activeServingNutrition.protein}g</span>
                              </div>
                              <div className="bg-amber-50 p-1.5 rounded-lg">
                                <span className="block text-[8px] font-bold text-amber-500">CARBS</span>
                                <span className="font-bold text-amber-700">{activeServingNutrition.carbs}g</span>
                              </div>
                              <div className="bg-sky-50 p-1.5 rounded-lg">
                                <span className="block text-[8px] font-bold text-sky-500">FAT</span>
                                <span className="font-bold text-sky-700">{activeServingNutrition.fat}g</span>
                              </div>
                              <div className="bg-emerald-50 p-1.5 rounded-lg">
                                <span className="block text-[8px] font-bold text-emerald-500">FIBER</span>
                                <span className="font-bold text-emerald-700">{activeServingNutrition.fiber}g</span>
                              </div>
                            </div>
                          </div>

                          {/* Target Meal Selection & Log Button */}
                          <div className="pt-2 border-t border-[#e8ede6] space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-[#192418] uppercase tracking-wider">
                                Log into Meal:
                              </label>
                              <div className="flex items-center gap-1">
                                {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map((m) => (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => setActiveMealCategory(m)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                                      activeMealCategory === m
                                        ? 'bg-[#192418] text-white shadow-xs'
                                        : 'bg-white text-[#5e6f5e] hover:bg-[#edf2ea] border border-[#e8ede6]'
                                    }`}
                                  >
                                    {m}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Customize Ingredients & Nutrition Calculator Entrypoint */}
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedFood) {
                                  setIsModalOpen(false);
                                  handleOpenCalculator(selectedFood, activeMealCategory);
                                }
                              }}
                              className="w-full py-2.5 bg-[#eef7eb] hover:bg-[#d6ebd0] text-[#3b7e23] border border-[#d6ebd0] font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                              <Sliders className="w-3.5 h-3.5 text-[#5ba83c]" />
                              <span>Customize Ingredients & Live Calculator</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleLogSelectedFood}
                              className="w-full py-3 bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                              <span>Add to {activeMealCategory}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4 text-[#7a8c79]">
                          <Utensils className="w-8 h-8 text-[#cbd7c8] mb-2" />
                          <p className="text-xs font-medium">
                            Select any food item from the list to choose your portion size and preview exact macronutrients.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FAVORITE FOODS */}
              {activeModalTab === 'favorites' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#192418]">
                      Your Starred & Frequently Used Foods
                    </span>
                    <span className="text-[11px] text-[#7a8c79]">
                      Click to quickly log to {activeMealCategory}
                    </span>
                  </div>

                  {favoriteFoodsList.length === 0 ? (
                    <div className="py-12 text-center bg-[#fdfefd] border border-dashed border-[#e8ede6] rounded-2xl">
                      <Star className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-[#7a8c79] font-medium">
                        You have not starred any favorite foods yet. Star dishes in the search tab for fast 1-click access!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {favoriteFoodsList.map((food) => (
                        <div
                          key={food.id}
                          className="bg-white border border-[#e8ede6] p-3.5 rounded-2xl hover:border-[#5ba83c] transition-all flex flex-col justify-between shadow-xs group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-[#192418] group-hover:text-[#5ba83c] transition-colors">
                                  {food.name}
                                </h4>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${
                                  food.dietaryType === 'vegetarian' || food.dietaryType === 'vegan'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : food.dietaryType === 'pescatarian'
                                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {food.dietaryType === 'vegetarian' ? 'Veg' : food.dietaryType === 'vegan' ? 'Vegan' : food.dietaryType === 'pescatarian' ? 'Seafood' : 'Non-Veg'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleToggleFavorite(e, food.id)}
                                className="text-amber-500 hover:text-amber-600"
                              >
                                <Star className="w-4 h-4 fill-amber-400" />
                              </button>
                            </div>

                            <div className="text-[10px] text-[#7a8c79] mt-1">
                              Default: {food.defaultServing.label}
                            </div>

                            <div className="flex items-center gap-2 mt-2 text-[11px]">
                              <span className="font-bold text-[#192418]">{food.per100g.calories} kcal /100g</span>
                              <span className="text-[#cbd7c8]">•</span>
                              <span className="font-bold text-rose-600">{food.per100g.protein}g P</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const newEntry = toFoodItem(food, activeMealCategory, food.defaultServing);
                              addFoodEntry(selectedDate, newEntry);
                              setFoods(getFoodLog(selectedDate));
                              setIsModalOpen(false);
                              showToast(`Logged ${food.name}!`, 'success');
                            }}
                            className="mt-3 w-full py-2 bg-[#eef7eb] hover:bg-[#5ba83c] text-[#3b7e23] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Quick Add to {activeMealCategory}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RECENT FOODS */}
              {activeModalTab === 'recents' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#192418]">
                    Recently Logged Foods from Past 7 Days
                  </div>

                  {recentFoodsList.length === 0 ? (
                    <div className="py-12 text-center bg-[#fdfefd] border border-dashed border-[#e8ede6] rounded-2xl">
                      <Clock className="w-8 h-8 text-[#cbd7c8] mx-auto mb-2" />
                      <p className="text-xs text-[#7a8c79] font-medium">
                        No recent foods logged yet. As you log meals, your past items will appear here for fast repeat logging.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f0f4ee] bg-white border border-[#e8ede6] rounded-2xl p-2">
                      {recentFoodsList.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 px-3 flex items-center justify-between hover:bg-[#f6f8f5] rounded-xl transition-colors"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-[#192418]">{item.name}</h4>
                            <span className="text-[10px] text-[#7a8c79]">{item.portion}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#192418]">
                              {item.calories} kcal • {item.protein}g P
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newEntry: Omit<FoodItem, 'id' | 'timestamp'> = {
                                  name: item.name,
                                  portion: item.portion,
                                  grams: 100,
                                  meal: activeMealCategory,
                                  calories: item.calories,
                                  protein: item.protein,
                                  carbs: item.carbs,
                                  fat: item.fat,
                                  fiber: item.fiber
                                };
                                addFoodEntry(selectedDate, newEntry);
                                setFoods(getFoodLog(selectedDate));
                                setIsModalOpen(false);
                                showToast(`Added ${item.name}!`, 'success');
                              }}
                              className="px-3 py-1.5 bg-[#eef7eb] hover:bg-[#5ba83c] text-[#3b7e23] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CUSTOM RECIPE BUILDER */}
              {activeModalTab === 'recipe_builder' && (
                <div className="space-y-4">
                  <div className="bg-[#f6f8f5] p-3.5 rounded-2xl border border-[#e8ede6]">
                    <span className="text-[10px] font-bold text-[#3b7e23] uppercase tracking-wider block mb-1">
                      HOMEMADE DISH CALCULATOR
                    </span>
                    <p className="text-xs text-[#5e6f5e]">
                      Combine multiple verified raw or cooked ingredients to calculate exact nutrition for your family meals, curries, or meal preps.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#192418] uppercase mb-1">
                        Recipe Name *
                      </label>
                      <input
                        type="text"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="e.g. Mom's Nadan Meen Curry with Kudampuli"
                        className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3 py-2 text-xs text-[#192418] focus:outline-none focus:border-[#5ba83c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#192418] uppercase mb-1">
                        Servings Yield
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={recipeServings}
                        onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3 py-2 text-xs text-[#192418] font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Add Ingredient Section */}
                  <div className="p-4 bg-white border border-[#e8ede6] rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-[#192418] block">
                      Search & Add Ingredients
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-8 relative">
                        <Search className="w-3.5 h-3.5 text-[#8e9f8e] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={recipeIngredientSearch}
                          onChange={(e) => setRecipeIngredientSearch(e.target.value)}
                          placeholder="Search ingredient (e.g. sardine, coconut, onion, oil)..."
                          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl pl-9 pr-3 py-2 text-xs text-[#192418] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={recipeIngredientGrams}
                          onChange={(e) => setRecipeIngredientGrams(Math.max(1, Number(e.target.value)))}
                          placeholder="Grams"
                          className="w-24 bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3 py-2 text-xs text-[#192418] font-bold focus:outline-none"
                        />
                        <span className="text-xs text-[#7a8c79]">g</span>
                      </div>
                    </div>

                    {/* Ingredient Suggestions */}
                    {recipeIngredientSearch.trim() && (
                      <div className="max-h-36 overflow-y-auto divide-y divide-[#f0f4ee] border border-[#e8ede6] rounded-xl">
                        {COMPREHENSIVE_FOOD_DATABASE.filter((f) =>
                          f.name.toLowerCase().includes(recipeIngredientSearch.toLowerCase())
                        ).slice(0, 5).map((f) => (
                          <div
                            key={f.id}
                            onClick={() => setSelectedRecipeFood(f)}
                            className={`p-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              selectedRecipeFood?.id === f.id
                                ? 'bg-[#5ba83c] text-white font-bold'
                                : 'hover:bg-[#f6f8f5] text-[#192418]'
                            }`}
                          >
                            <span>{f.name}</span>
                            <span className="text-[10px] opacity-80">{f.per100g.calories} kcal/100g</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedRecipeFood && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#5ba83c]">
                          Selected: {selectedRecipeFood.name} ({recipeIngredientGrams}g)
                        </span>
                        <button
                          type="button"
                          onClick={handleAddRecipeIngredient}
                          className="px-3 py-1.5 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          Add to Recipe
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Added Ingredients Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#192418] block">
                      Ingredients in this Recipe ({recipeIngredients.length}):
                    </span>

                    {recipeIngredients.length === 0 ? (
                      <p className="text-xs text-[#7a8c79] italic">No ingredients added yet.</p>
                    ) : (
                      <div className="divide-y divide-[#f0f4ee] bg-white border border-[#e8ede6] rounded-2xl p-2 text-xs">
                        {recipeIngredients.map((ing, i) => (
                          <div key={i} className="py-2 px-2 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#192418]">{ing.foodName}</span>
                              <span className="text-[11px] text-[#7a8c79] ml-2">({ing.grams}g)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-[#192418]">
                                {ing.calories} kcal • {ing.protein}g P
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRecipeIngredient(i)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Recipe Button */}
                  {recipeIngredients.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSaveRecipe}
                      className="w-full py-3 bg-[#192418] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xs"
                    >
                      Save Recipe to Food Database
                    </button>
                  )}
                </div>
              )}

              {/* TAB 5: QUICK MANUAL ENTRY */}
              {activeModalTab === 'manual' && (
                <form onSubmit={handleSaveFood} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                        Food Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Scrambled Eggs with Sourdough"
                        className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                        Portion / Quantity *
                      </label>
                      <input
                        type="text"
                        required
                        value={formPortion}
                        onChange={(e) => setFormPortion(e.target.value)}
                        placeholder="e.g. 2 eggs + 1 slice (120g)"
                        className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                      />
                    </div>
                  </div>

                  {/* Meal Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1.5">
                      Designated Meal
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {meals.map((m) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setActiveMealCategory(m.key)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            activeMealCategory === m.key
                              ? 'bg-[#5ba83c] text-white shadow-xs'
                              : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                          }`}
                        >
                          {m.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nutrition Inputs */}
                  <div>
                    <span className="text-[10px] text-[#7a8c79] uppercase font-bold block mb-2">
                      ESTIMATED NUTRITIONAL VALUES
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                      <div>
                        <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">CALORIES</label>
                        <input
                          type="number"
                          min="0"
                          value={formCalories}
                          onChange={(e) => setFormCalories(Number(e.target.value))}
                          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">PROTEIN (G)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={formProtein}
                          onChange={(e) => setFormProtein(Number(e.target.value))}
                          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">CARBS (G)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={formCarbs}
                          onChange={(e) => setFormCarbs(Number(e.target.value))}
                          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">FAT (G)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={formFat}
                          onChange={(e) => setFormFat(Number(e.target.value))}
                          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">FIBER (G)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={formFiber}
                          onChange={(e) => setFormFiber(Number(e.target.value))}
                          className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all shadow-xs active:scale-[0.98]"
                    >
                      {editingItem ? 'Save Changes' : 'Log Food Entry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3.5 bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] rounded-2xl text-xs font-bold border border-[#e8ede6]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DISH INGREDIENTS & NUTRITION CALCULATOR MODAL */}
      <DishIngredientCalculatorModal
        food={calculatorFood}
        isOpen={isCalculatorOpen}
        onClose={() => {
          setIsCalculatorOpen(false);
          setCalculatorFood(null);
        }}
        selectedDate={selectedDate}
        defaultMeal={calculatorMeal}
        onRecipeSaved={() => {
          setFavoritesVersion((v) => v + 1);
        }}
        onFoodLogged={() => {
          setFoods(getFoodLog(selectedDate));
        }}
      />
    </div>
  );
}
