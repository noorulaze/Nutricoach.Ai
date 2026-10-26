import React, { useState, useMemo } from 'react';
import { 
  X, Plus, Minus, Trash2, RotateCcw, Check, Bookmark, 
  Flame, ShieldCheck, AlertCircle, Search, Sparkles, 
  ChevronDown, Utensils, Info, CheckCircle2, Sliders,
  Heart, ChevronLeft, Clock
} from 'lucide-react';
import { ComprehensiveFood } from '../data/foodDatabase/types';
import { 
  INGREDIENTS_DATABASE, INGREDIENTS_BY_ID, IngredientItem, 
  MeasurementUnit, searchIngredients 
} from '../data/ingredientsData';
import { 
  getOrGenerateDishRecipe, CookingMethodType, 
  DishRecipeIngredient 
} from '../data/dishRecipes';
import { 
  calculateLiveDishNutrition, calculateNutritionDiff 
} from '../utils/nutritionCalculator';
import { saveUserCustomRecipe, addFoodEntry, isFoodFavorite, toggleFavoriteFood } from '../utils/storage';
import { MealType, FoodItem } from '../types';
import { useToast } from '../context/ToastContext';

// Meal images for rich visual headers
import breakfastImg from '../assets/food/breakfast.jpg';
import lunchImg from '../assets/food/lunch.jpg';
import dinnerImg from '../assets/food/dinner.jpg';
import snackImg from '../assets/food/snack.jpg';
import grainBowlImg from '../assets/food/grain-bowl.jpg';

interface DishIngredientCalculatorModalProps {
  food: ComprehensiveFood | null;
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  defaultMeal?: MealType;
  onRecipeSaved?: () => void;
  onFoodLogged?: () => void;
}

export default function DishIngredientCalculatorModal({
  food,
  isOpen,
  onClose,
  selectedDate,
  defaultMeal = 'lunch',
  onRecipeSaved,
  onFoodLogged
}: DishIngredientCalculatorModalProps) {
  const { showToast } = useToast();

  if (!isOpen || !food) return null;

  // Retrieve or procedurally generate the authentic recipe
  const baseRecipe = useMemo(() => {
    return getOrGenerateDishRecipe(food);
  }, [food]);

  // Working recipe state
  const [servings, setServings] = useState<number>(baseRecipe.defaultServings || 2);
  const [cookingMethod, setCookingMethod] = useState<CookingMethodType>(baseRecipe.cookingMethod || 'gravy_simmered');
  const [ingredients, setIngredients] = useState<(DishRecipeIngredient & { active: boolean; uid: string })[]>(() => {
    return baseRecipe.ingredients.map((ing, idx) => ({
      ...ing,
      active: true,
      uid: `${ing.ingredientId}_${idx}_${Date.now()}`
    }));
  });

  // Display mode for nutrition summary: 'per_serving' vs 'total_dish'
  const [nutritionViewMode, setNutritionViewMode] = useState<'per_serving' | 'total_dish'>('per_serving');

  // Search and Add new ingredient state
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
  const [selectedNewIngredient, setSelectedNewIngredient] = useState<IngredientItem | null>(null);
  const [newIngredientAmount, setNewIngredientAmount] = useState<number>(50);
  const [newIngredientUnit, setNewIngredientUnit] = useState<MeasurementUnit>('g');

  // Target meal for direct Food Tracker logging
  const [targetMeal, setTargetMeal] = useState<MealType>(defaultMeal);

  // Active filter for ingredient checklist view
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'protein' | 'oil_fat' | 'vegetable' | 'spice'>('all');

  // Mobile sub-tab navigation
  const [mobileTab, setMobileTab] = useState<'ingredients' | 'nutrition' | 'info'>('ingredients');

  // Favorite toggle state
  const [isFav, setIsFav] = useState<boolean>(() => food ? isFoodFavorite(food.id) : false);

  const handleToggleFav = () => {
    if (!food) return;
    const next = toggleFavoriteFood(food.id);
    setIsFav(next);
    showToast(next ? `Added ${food.name} to favorites` : `Removed from favorites`, 'info');
  };

  // Compute live nutrition results
  const liveResult = useMemo(() => {
    return calculateLiveDishNutrition(
      ingredients,
      servings,
      cookingMethod,
      !baseRecipe.isAuthenticStandard
    );
  }, [ingredients, servings, cookingMethod, baseRecipe.isAuthenticStandard]);

  // Compute baseline authentic nutrition for live delta comparison
  const originalBaselineResult = useMemo(() => {
    return calculateLiveDishNutrition(
      baseRecipe.ingredients,
      baseRecipe.defaultServings,
      baseRecipe.cookingMethod,
      !baseRecipe.isAuthenticStandard
    );
  }, [baseRecipe]);

  const diff = useMemo(() => {
    return calculateNutritionDiff(liveResult.perServing, originalBaselineResult.perServing);
  }, [liveResult.perServing, originalBaselineResult.perServing]);

  // Dish Banner Image resolution
  const heroImage = useMemo(() => {
    if (food.category === 'breakfast') return breakfastImg;
    if (food.category === 'snacks_streetfood') return snackImg;
    if (food.category === 'curries_gravies' || food.cuisine === 'kerala') return lunchImg;
    if (food.category === 'meat_poultry' || food.category === 'seafood') return dinnerImg;
    return grainBowlImg;
  }, [food]);

  // --- INGREDIENT HANDLERS ---

  const handleUpdateAmount = (uid: string, newAmount: number) => {
    const safeAmount = Math.max(0, Math.round(newAmount * 10) / 10);
    setIngredients((prev) =>
      prev.map((ing) => (ing.uid === uid ? { ...ing, amount: safeAmount } : ing))
    );
  };

  const handleUpdateUnit = (uid: string, newUnit: MeasurementUnit) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.uid === uid ? { ...ing, unit: newUnit } : ing))
    );
  };

  const handleToggleIngredient = (uid: string) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.uid === uid ? { ...ing, active: !ing.active } : ing))
    );
  };

  const handleRemoveIngredient = (uid: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.uid !== uid));
    showToast('Ingredient removed from dish', 'info');
  };

  const handleAddIngredient = () => {
    if (!selectedNewIngredient || newIngredientAmount <= 0) {
      showToast('Please select a valid ingredient and amount', 'error');
      return;
    }

    const newLine: DishRecipeIngredient & { active: boolean; uid: string } = {
      ingredientId: selectedNewIngredient.id,
      amount: newIngredientAmount,
      unit: newIngredientUnit,
      notes: 'Custom added ingredient',
      isRemovable: true,
      active: true,
      uid: `${selectedNewIngredient.id}_custom_${Date.now()}`
    };

    setIngredients((prev) => [...prev, newLine]);
    setSelectedNewIngredient(null);
    setIngredientSearchQuery('');
    setNewIngredientAmount(50);
    showToast(`Added ${selectedNewIngredient.name} to recipe!`, 'success');
  };

  // Quick Healthy Presets
  const handleApplyPreset = (preset: 'less_oil' | 'high_protein' | 'light_coconut' | 'low_sodium') => {
    if (preset === 'less_oil') {
      setIngredients((prev) =>
        prev.map((ing) => {
          const item = INGREDIENTS_BY_ID.get(ing.ingredientId);
          if (item?.category === 'oil_fat' || item?.category === 'dairy_fat') {
            return { ...ing, amount: Math.max(0.25, Math.round(ing.amount * 0.5 * 10) / 10) };
          }
          return ing;
        })
      );
      showToast('Halved cooking oils and fats (-50%)', 'info');
    } else if (preset === 'high_protein') {
      // Find main protein or add chicken breast/paneer
      const hasProtein = ingredients.some((ing) => {
        const item = INGREDIENTS_BY_ID.get(ing.ingredientId);
        return item?.category === 'protein';
      });

      if (hasProtein) {
        setIngredients((prev) =>
          prev.map((ing) => {
            const item = INGREDIENTS_BY_ID.get(ing.ingredientId);
            if (item?.category === 'protein') {
              return { ...ing, amount: Math.round((ing.amount + 60) * 10) / 10 };
            }
            return ing;
          })
        );
      } else {
        const defaultProteinId = food.dietaryType === 'vegetarian' || food.dietaryType === 'vegan' 
          ? 'ing_paneer_fresh' 
          : 'ing_chicken_breast_raw';
        setIngredients((prev) => [
          ...prev,
          {
            ingredientId: defaultProteinId,
            amount: 80,
            unit: 'g',
            notes: 'High-protein boost',
            active: true,
            uid: `protein_boost_${Date.now()}`
          }
        ]);
      }
      showToast('Boosted lean protein (+60g)', 'info');
    } else if (preset === 'light_coconut') {
      setIngredients((prev) =>
        prev.map((ing) => {
          if (
            ing.ingredientId === 'ing_coconut_milk_thick' ||
            ing.ingredientId === 'ing_coconut_grated_fresh'
          ) {
            return { ...ing, amount: Math.max(0.2, Math.round(ing.amount * 0.5 * 10) / 10) };
          }
          return ing;
        })
      );
      showToast('Reduced rich coconut content by 50%', 'info');
    } else if (preset === 'low_sodium') {
      setIngredients((prev) =>
        prev.map((ing) => {
          if (ing.ingredientId === 'ing_salt_sea' || ing.ingredientId === 'ing_soy_sauce') {
            return { ...ing, amount: Math.max(0.1, Math.round(ing.amount * 0.5 * 10) / 10) };
          }
          return ing;
        })
      );
      showToast('Halved added salt & sodium', 'info');
    }
  };

  // Reset to original recipe
  const handleResetRecipe = () => {
    setServings(baseRecipe.defaultServings || 2);
    setCookingMethod(baseRecipe.cookingMethod || 'gravy_simmered');
    setIngredients(
      baseRecipe.ingredients.map((ing, idx) => ({
        ...ing,
        active: true,
        uid: `${ing.ingredientId}_${idx}_${Date.now()}`
      }))
    );
    showToast('Reset to original authentic recipe', 'info');
  };

  // Save as custom user recipe in account
  const handleSaveCustomRecipe = () => {
    const customRecipeId = `recipe_custom_${Date.now()}`;
    const recipeName = `${food.name} (Customized)`;

    const recipeData = {
      id: customRecipeId,
      name: recipeName,
      cuisine: food.cuisine,
      servingsYield: servings,
      ingredients: liveResult.lines.map((line) => ({
        foodId: line.ingredient.id,
        foodName: line.ingredient.name,
        grams: line.cookedGrams,
        calories: line.calories,
        protein: line.protein,
        carbs: line.carbs,
        fat: line.fat,
        fiber: line.fiber
      })),
      totalPerServing: {
        grams: liveResult.perServing.grams,
        calories: liveResult.perServing.calories,
        protein: liveResult.perServing.protein,
        carbs: liveResult.perServing.carbs,
        fat: liveResult.perServing.fat,
        fiber: liveResult.perServing.fiber
      },
      createdAt: new Date().toISOString()
    };

    saveUserCustomRecipe(recipeData);
    if (onRecipeSaved) onRecipeSaved();
    showToast(`Saved "${recipeName}" to your recipe library!`, 'success', 'Recipe Saved');
  };

  // Log directly into Food Tracker
  const handleAddToFoodTracker = () => {
    const targetServing = liveResult.perServing;
    const entry: Omit<FoodItem, 'id' | 'timestamp'> = {
      name: `${food.name} (Custom Prepared)`,
      meal: targetMeal,
      portion: `1 serving (${targetServing.grams}g, customized)`,
      grams: targetServing.grams,
      calories: targetServing.calories,
      protein: targetServing.protein,
      carbs: targetServing.carbs,
      fat: targetServing.fat,
      fiber: targetServing.fiber,
      isCustom: true,
      category: food.category,
      budgetFriendly: food.budgetFriendly,
      cuisine: food.cuisine,
      verificationStatus: liveResult.accuracyMetadata.isEstimate ? 'estimated' : 'verified'
    };

    addFoodEntry(selectedDate, entry);
    if (onFoodLogged) onFoodLogged();
    showToast(`Added 1 serving of customized ${food.name} to ${targetMeal}!`, 'success', 'Food Logged');
    onClose();
  };

  // Filtered ingredients list for checklist
  const filteredLines = useMemo(() => {
    return liveResult.lines.filter((line) => {
      if (categoryFilter === 'all') return true;
      if (categoryFilter === 'protein') return line.ingredient.category === 'protein';
      if (categoryFilter === 'oil_fat') return line.ingredient.category === 'oil_fat' || line.ingredient.category === 'dairy_fat';
      if (categoryFilter === 'vegetable') return line.ingredient.category === 'vegetable';
      if (categoryFilter === 'spice') return line.ingredient.category === 'spice_seasoning' || line.ingredient.category === 'liquid_gravy';
      return true;
    });
  }, [liveResult.lines, categoryFilter]);

  // Active nutrition stats depending on per_serving vs total_dish view
  const activeStats = nutritionViewMode === 'per_serving' ? liveResult.perServing : liveResult.totalDish;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white dark:bg-[#1C211D] border-t sm:border border-[#e8ede6] dark:border-[#394139] rounded-t-[28px] sm:rounded-[28px] max-w-4xl w-full h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-0 sm:my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calculator-dish-title"
      >
        {/* ========================================================= */}
        {/* MODAL HEADER WITH DISH BANNER & ACCURACY BADGE            */}
        {/* ========================================================= */}
        <div className="relative h-40 sm:h-44 w-full shrink-0 overflow-hidden bg-[#192418]">
          <img 
            src={heroImage} 
            alt={food.name} 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#192418] via-[#192418]/60 to-transparent" />

          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden absolute top-3.5 left-3.5 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95 flex items-center justify-center shadow-xs"
            aria-label="Back to food menu"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Right Action Icons (Favorite Heart + Close X) */}
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleFav}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95 shadow-xs"
              aria-label="Toggle Favorite"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95 shadow-xs"
              aria-label="Close Calculator"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Header Badges & Titles */}
          <div className="absolute bottom-3 left-4 sm:left-6 right-4 sm:right-6 flex flex-col justify-end text-white">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#5ba83c] px-2.5 py-0.5 rounded-full text-white shadow-xs">
                {food.cuisine.replace('_', ' ').toUpperCase()} • {food.category.replace('_', ' ').toUpperCase()}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                food.dietaryType === 'non_vegetarian'
                  ? 'bg-rose-500/90 text-white'
                  : food.dietaryType === 'pescatarian'
                  ? 'bg-sky-500/90 text-white'
                  : 'bg-emerald-600/90 text-white'
              }`}>
                {food.dietaryType === 'non_vegetarian' ? 'Non-Vegetarian' : food.dietaryType === 'pescatarian' ? 'Pescatarian' : 'Vegetarian'}
              </span>

              <div className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-[#d6ebd0] border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-[#8BAF78]" />
                <span>{liveResult.accuracyMetadata.verificationLabel}</span>
              </div>
            </div>

            <h2 id="calculator-dish-title" className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
              {food.name}
            </h2>

            {/* Metadata Badges: Prep, Cook, Servings (Screen 3 Reference) */}
            <div className="flex items-center gap-2 mt-1.5 pt-1 border-t border-white/10 text-[10px] text-white/90">
              <span className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
                <Clock className="w-3 h-3 text-[#8BAF78]" /> Prep: 15m
              </span>
              <span className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
                <Flame className="w-3 h-3 text-amber-400" /> Cook: 25m
              </span>
              <span className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
                <Utensils className="w-3 h-3 text-sky-400" /> {servings} Servings
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE SUBTABS PILL BAR (Screen 3 Reference)              */}
        {/* ========================================================= */}
        <div className="sm:hidden bg-[#f0f4ee] dark:bg-[#272E29] border-b border-[#e8ede6] dark:border-[#394139] p-1.5 flex items-center gap-1 shrink-0">
          {(['ingredients', 'nutrition', 'info'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                mobileTab === tab
                  ? 'bg-[#5ba83c] text-white shadow-xs'
                  : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418]'
              }`}
            >
              {tab === 'info' ? 'Recipe Info' : tab}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE CONTROLS BAR: SERVINGS, COOKING METHOD        */}
        {/* ========================================================= */}
        <div className="bg-[#f6f8f5] dark:bg-[#272E29] border-b border-[#e8ede6] dark:border-[#394139] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Servings Stepper */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider">
                Servings:
              </span>
              <div className="flex items-center bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="p-1.5 hover:bg-[#eef7eb] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] transition-colors"
                  aria-label="Decrease servings"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-black text-[#192418] dark:text-[#E8EDE7]">
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  className="p-1.5 hover:bg-[#eef7eb] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] transition-colors"
                  aria-label="Increase servings"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">
                ({Math.round(liveResult.perServing.grams)}g / serving)
              </span>
            </div>

            {/* Cooking Method Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider">
                Cooking Method:
              </span>
              <select
                value={cookingMethod}
                onChange={(e) => setCookingMethod(e.target.value as CookingMethodType)}
                className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-2.5 py-1 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
              >
                <option value="gravy_simmered">🍛 Simmered with Gravy</option>
                <option value="boiled">🍲 Boiled / Stewed</option>
                <option value="steamed">💨 Steamed</option>
                <option value="roasted">🔥 Pan Roasted / Tawa</option>
                <option value="fried">🍳 Shallow Fried</option>
              </select>
            </div>
          </div>

          {/* Quick Reset Button */}
          <button
            type="button"
            onClick={handleResetRecipe}
            className="px-3 py-1 bg-white dark:bg-[#1C211D] hover:bg-[#edf2ea] dark:hover:bg-[#394139] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3 h-3 text-[#7a8c79]" />
            <span>Reset to Authentic</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* LIVE NUTRITION DASHBOARD BAR (REACTIVE REAL-TIME)         */}
        {/* ========================================================= */}
        <div className={`bg-[#fcfdfc] dark:bg-[#1C211D] border-b border-[#e8ede6] dark:border-[#394139] p-4 sm:p-5 ${mobileTab === 'nutrition' ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight">
                LIVE RECALCULATED NUTRITION:
              </span>

              {/* View Mode Toggle: Per Serving vs Total Batch */}
              <div className="flex items-center bg-[#f0f4ee] dark:bg-[#272E29] p-0.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] text-[11px]">
                <button
                  type="button"
                  onClick={() => setNutritionViewMode('per_serving')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    nutritionViewMode === 'per_serving'
                      ? 'bg-[#192418] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
                      : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418]'
                  }`}
                >
                  Per Serving ({liveResult.perServing.grams}g)
                </button>
                <button
                  type="button"
                  onClick={() => setNutritionViewMode('total_dish')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    nutritionViewMode === 'total_dish'
                      ? 'bg-[#192418] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
                      : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418]'
                  }`}
                >
                  Total Dish ({liveResult.totalDish.grams}g)
                </button>
              </div>
            </div>

            {/* Live Delta comparison against authentic baseline */}
            {(diff.caloriesDiff !== 0 || diff.proteinDiff !== 0 || diff.fatDiff !== 0) && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#eef7eb] dark:bg-[#272E29] text-[#3b7e23] dark:text-[#8BAF78] border border-[#d6ebd0] dark:border-[#394139] self-start sm:self-auto">
                <Sparkles className="w-3 h-3 text-[#5ba83c]" />
                <span>Custom Delta: </span>
                <span className={diff.caloriesDiff > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {diff.caloriesDiff > 0 ? `+${diff.caloriesDiff}` : diff.caloriesDiff} kcal
                </span>
                <span>•</span>
                <span className={diff.proteinDiff >= 0 ? 'text-rose-600' : 'text-slate-500'}>
                  {diff.proteinDiff >= 0 ? `+${diff.proteinDiff}g` : `${diff.proteinDiff}g`} P
                </span>
                <span>•</span>
                <span className={diff.fatDiff <= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                  {diff.fatDiff > 0 ? `+${diff.fatDiff}g` : `${diff.fatDiff}g`} F
                </span>
              </div>
            )}
          </div>

          {/* 5 Macro Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* Calories */}
            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="text-[9px] font-bold text-[#3b7e23] dark:text-[#8BAF78] uppercase tracking-wider">
                CALORIES
              </span>
              <div className="mt-1">
                <span className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
                  {activeStats.calories}
                </span>
                <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] ml-1">kcal</span>
              </div>
              <span className="text-[9px] text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5">
                {nutritionViewMode === 'per_serving' ? 'for 1 serving' : `full batch (${servings} servings)`}
              </span>
            </div>

            {/* Protein: Rose */}
            <div className="bg-[#fff9f9] dark:bg-[#272E29] border border-rose-100 dark:border-[#394139] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">PROTEIN</span>
                <span className="text-[9px] font-bold text-rose-500">{liveResult.macroPercentages.proteinPercent}%</span>
              </div>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-[#192418] dark:text-[#E8EDE7]">
                  {activeStats.protein}g
                </span>
              </div>
              <div className="h-1 w-full bg-rose-100/60 dark:bg-rose-950/40 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, liveResult.macroPercentages.proteinPercent * 2)}%` }} />
              </div>
            </div>

            {/* Carbs: Amber */}
            <div className="bg-[#fffcf7] dark:bg-[#272E29] border border-amber-100 dark:border-[#394139] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">CARBS</span>
                <span className="text-[9px] font-bold text-amber-500">{liveResult.macroPercentages.carbsPercent}%</span>
              </div>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-[#192418] dark:text-[#E8EDE7]">
                  {activeStats.carbs}g
                </span>
              </div>
              <div className="h-1 w-full bg-amber-100/60 dark:bg-amber-950/40 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, liveResult.macroPercentages.carbsPercent * 1.5)}%` }} />
              </div>
            </div>

            {/* Fat: Sky Blue */}
            <div className="bg-[#f8fcff] dark:bg-[#272E29] border border-sky-100 dark:border-[#394139] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider">FATS</span>
                <span className="text-[9px] font-bold text-sky-500">{liveResult.macroPercentages.fatPercent}%</span>
              </div>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-[#192418] dark:text-[#E8EDE7]">
                  {activeStats.fat}g
                </span>
              </div>
              <div className="h-1 w-full bg-sky-100/60 dark:bg-sky-950/40 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${Math.min(100, liveResult.macroPercentages.fatPercent * 1.5)}%` }} />
              </div>
            </div>

            {/* Fiber: Mint */}
            <div className="bg-[#f8fdfa] dark:bg-[#272E29] border border-emerald-100 dark:border-[#394139] p-3 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">FIBRE</span>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-[#192418] dark:text-[#E8EDE7]">
                  {activeStats.fiber}g
                </span>
              </div>
              <span className="text-[9px] text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5">
                {activeStats.fiber >= 4 ? '✓ High Fiber' : 'Dietary fiber'}
              </span>
            </div>
          </div>

          {/* Quick Dietary Presets Bar */}
          <div className="mt-3 pt-2.5 border-t border-[#f0f4ee] dark:border-[#394139] flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            <span className="text-[10px] font-bold text-[#7a8c79] dark:text-[#A2AAA1] uppercase shrink-0">
              Quick Tweaks:
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset('less_oil')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#272E29] hover:bg-[#eef7eb] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] border border-[#e8ede6] dark:border-[#394139] font-bold shrink-0 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>🌿 Halve Added Oil (-50%)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('high_protein')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#272E29] hover:bg-[#eef7eb] dark:hover:bg-[#394139] text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-[#394139] font-bold shrink-0 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>💪 Extra Protein (+60g)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('light_coconut')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#272E29] hover:bg-[#eef7eb] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] border border-[#e8ede6] dark:border-[#394139] font-bold shrink-0 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>🥥 Light Coconut (-50%)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('low_sodium')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#272E29] hover:bg-[#eef7eb] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] border border-[#e8ede6] dark:border-[#394139] font-bold shrink-0 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>🧂 Low Salt / Sodium</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INGREDIENT LIST & CUSTOMIZATION WORKBENCH                 */}
        {/* ========================================================= */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 ${mobileTab === 'ingredients' ? 'block' : 'hidden sm:block'}`}>
          {/* Section Header with Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight">
                Recipe Ingredients Checklist ({liveResult.lines.length} active items)
              </h3>
              <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] mt-0.5">
                Adjust quantities, change measurement units, or delete ingredients to customize your dish.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              {[
                { key: 'all', label: 'All Items' },
                { key: 'protein', label: 'Proteins' },
                { key: 'oil_fat', label: 'Fats & Oils' },
                { key: 'vegetable', label: 'Vegetables' },
                { key: 'spice', label: 'Spices & Gravy' }
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setCategoryFilter(f.key as any)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                    categoryFilter === f.key
                      ? 'bg-[#192418] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
                      : 'bg-[#f6f8f5] dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] border border-[#e8ede6] dark:border-[#394139]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Ingredients Table / Cards */}
          <div className="space-y-2">
            {filteredLines.length === 0 ? (
              <div className="py-8 text-center bg-[#fdfefd] dark:bg-[#272E29] border border-dashed border-[#e8ede6] dark:border-[#394139] rounded-2xl text-xs text-[#7a8c79] dark:text-[#A2AAA1]">
                No ingredients found in this category filter.
              </div>
            ) : (
              filteredLines.map((line) => {
                // Find matching raw ingredient state
                const rawItem = line.ingredient;
                // Find matching item in state to get UID
                const stateItem = ingredients.find((i) => i.ingredientId === rawItem.id);
                const uid = stateItem?.uid || rawItem.id;

                return (
                  <div
                    key={uid}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] hover:border-[#cbd7c8] dark:hover:border-[#5ba83c] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    {/* Left: Name, Notes & Category Badge */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7]">
                          {rawItem.name}
                        </span>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#f6f8f5] dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] border border-[#e8ede6] dark:border-[#394139]">
                          {rawItem.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1] mt-0.5 flex items-center gap-2 flex-wrap">
                        {line.notes && <span>{line.notes}</span>}
                        {line.notes && <span>•</span>}
                        <span>Cooked yield: ~{line.cookedGrams}g</span>
                        <span>•</span>
                        <span className="italic">{rawItem.source}</span>
                      </div>
                    </div>

                    {/* Right: Quantity Stepper, Unit Selector, Macro Pill & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Quantity & Unit Controls */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleUpdateAmount(uid, line.amount - (line.unit === 'g' || line.unit === 'ml' ? 10 : 0.5))}
                            className="p-1 hover:bg-[#edf2ea] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] transition-colors"
                            aria-label={`Decrease ${rawItem.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="0.1"
                            step={line.unit === 'g' || line.unit === 'ml' ? '5' : '0.5'}
                            value={line.amount}
                            onChange={(e) => handleUpdateAmount(uid, parseFloat(e.target.value) || 0)}
                            className="w-14 bg-transparent text-center text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateAmount(uid, line.amount + (line.unit === 'g' || line.unit === 'ml' ? 10 : 0.5))}
                            className="p-1 hover:bg-[#edf2ea] dark:hover:bg-[#394139] text-[#192418] dark:text-[#E8EDE7] transition-colors"
                            aria-label={`Increase ${rawItem.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Unit Selector */}
                        <select
                          value={line.unit}
                          onChange={(e) => handleUpdateUnit(uid, e.target.value as MeasurementUnit)}
                          className="bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-2 py-1 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none"
                        >
                          <option value="g">grams (g)</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="cup">cup</option>
                          <option value="piece">piece</option>
                          <option value="ml">ml</option>
                          <option value="clove">clove</option>
                          <option value="leaf">leaf</option>
                        </select>
                      </div>

                      {/* Line Macro Contribution Badge */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7] block">
                          {line.calories} kcal
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                          {line.protein}g P
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(uid)}
                        className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove ingredient from dish"
                        aria-label={`Remove ${rawItem.name}`}
                      >
                        <Trash2 className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ========================================================= */}
          {/* SEARCH & ADD EXTRA INGREDIENT WORKFLOW                    */}
          {/* ========================================================= */}
          <div className="p-4 bg-[#fcfdfc] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#5ba83c]" />
                Add Extra or Replacement Ingredient
              </span>
              <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">
                ICMR-NIN & USDA Verified Database
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              {/* Ingredient Search Input */}
              <div className="sm:col-span-6 relative">
                <Search className="w-3.5 h-3.5 text-[#7a8c79] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ingredientSearchQuery}
                  onChange={(e) => {
                    setIngredientSearchQuery(e.target.value);
                    if (selectedNewIngredient) setSelectedNewIngredient(null);
                  }}
                  placeholder="Search ingredient (e.g. chicken, coconut oil, paneer, egg, spinach)..."
                  className="w-full bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl pl-9 pr-3 py-2 text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#7a8c79] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30"
                />
              </div>

              {/* Amount Input */}
              <div className="sm:col-span-3 flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={newIngredientAmount}
                  onChange={(e) => setNewIngredientAmount(Math.max(0.5, parseFloat(e.target.value) || 0))}
                  placeholder="Amount"
                  className="w-full bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-2.5 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none"
                />
                <select
                  value={newIngredientUnit}
                  onChange={(e) => setNewIngredientUnit(e.target.value as MeasurementUnit)}
                  className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-2 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none"
                >
                  <option value="g">grams (g)</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="cup">cup</option>
                  <option value="piece">piece</option>
                  <option value="ml">ml</option>
                </select>
              </div>

              {/* Add Button */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  disabled={!selectedNewIngredient}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs ${
                    selectedNewIngredient
                      ? 'bg-[#5ba83c] hover:bg-[#4d9630] text-white active:scale-95'
                      : 'bg-[#e8ede6] dark:bg-[#394139] text-[#7a8c79] cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add to Recipe</span>
                </button>
              </div>
            </div>

            {/* Dropdown Suggestions */}
            {ingredientSearchQuery.trim().length > 0 && !selectedNewIngredient && (
              <div className="max-h-44 overflow-y-auto divide-y divide-[#f0f4ee] dark:divide-[#394139] bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl shadow-md text-xs">
                {searchIngredients(ingredientSearchQuery).slice(0, 7).map((ing) => (
                  <div
                    key={ing.id}
                    onClick={() => {
                      setSelectedNewIngredient(ing);
                      setIngredientSearchQuery(ing.name);
                      setNewIngredientUnit(ing.defaultUnit);
                    }}
                    className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#eef7eb] dark:hover:bg-[#272E29] transition-colors"
                  >
                    <div>
                      <span className="font-bold text-[#192418] dark:text-[#E8EDE7] block">{ing.name}</span>
                      <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] capitalize">
                        {ing.category.replace('_', ' ')} • {ing.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#192418] dark:text-[#E8EDE7] block">
                        {ing.per100g.calories} kcal
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 block">
                        {ing.per100g.protein}g P /100g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedNewIngredient && (
              <div className="flex items-center justify-between text-xs px-2 py-1 bg-[#eef7eb] dark:bg-[#1C211D] border border-[#d6ebd0] dark:border-[#394139] rounded-xl text-[#3b7e23] dark:text-[#8BAF78] font-bold">
                <span>Selected: {selectedNewIngredient.name} ({newIngredientAmount}{newIngredientUnit})</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNewIngredient(null);
                    setIngredientSearchQuery('');
                  }}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RECIPE INFO & INSTRUCTIONS VIEW (MOBILE TAB)              */}
        {/* ========================================================= */}
        {mobileTab === 'info' && (
          <div className="sm:hidden flex-1 overflow-y-auto p-4 space-y-4">
            {/* Cooking Method Card */}
            <div className="bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] p-4 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-[#3b7e23] dark:text-[#8BAF78] uppercase tracking-wider block">
                COOKING TECHNIQUE
              </span>
              <h4 className="text-sm font-extrabold text-[#192418] dark:text-[#E8EDE7]">
                {cookingMethod === 'gravy_simmered' && 'Simmered with Traditional Gravy'}
                {cookingMethod === 'boiled' && 'Slow Boiled / Stewed in Broth'}
                {cookingMethod === 'steamed' && 'Traditional Steam Preparation'}
                {cookingMethod === 'roasted' && 'Pan Roasted on Iron Tawa'}
                {cookingMethod === 'fried' && 'Shallow Fried with Tempering'}
              </h4>
              <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
                Authentic regional preparation technique that balances aroma and nutrient bioavailability.
              </p>
            </div>

            {/* Heritage & Nutrition Standards Card */}
            <div className="bg-gradient-to-br from-[#eef7eb] to-[#f7fbf6] dark:from-[#272E29] dark:to-[#1C211D] border border-[#d6ebd0] dark:border-[#394139] p-4 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5ba83c]" />
                <span className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7]">
                  {liveResult.accuracyMetadata.verificationLabel}
                </span>
              </div>
              <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
                Calculated according to ICMR-NIN raw-to-cooked conversion yield factors and USDA nutritional standards.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FOOTER ACTIONS: LOG TO TRACKER & SAVE CUSTOM DISH         */}
        {/* ========================================================= */}
        <div className="bg-[#f6f8f5] dark:bg-[#272E29] border-t border-[#e8ede6] dark:border-[#394139] p-3.5 sm:p-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Target Meal Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider shrink-0">
              Log Into:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTargetMeal(m)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                    targetMeal === m
                      ? 'bg-[#192418] dark:bg-[#8BAF78] text-white dark:text-[#192418] shadow-xs'
                      : 'bg-white dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] border border-[#e8ede6] dark:border-[#394139]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Save Customized Dish */}
            <button
              type="button"
              onClick={handleSaveCustomRecipe}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#1C211D] hover:bg-[#edf2ea] dark:hover:bg-[#394139] border border-[#e8ede6] dark:border-[#394139] text-[#192418] dark:text-[#E8EDE7] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5 text-sky-600" />
              <span>Save Recipe</span>
            </button>

            {/* Add to Food Tracker */}
            <button
              type="button"
              onClick={handleAddToFoodTracker}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to Tracker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
