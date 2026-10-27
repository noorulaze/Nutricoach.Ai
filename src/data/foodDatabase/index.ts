import { ComprehensiveFood, FoodSearchFilters, ServingSize, UserCustomRecipe } from './types';
import { KERALA_FOODS } from './keralaFoods';
import { INDIAN_REGIONAL_FOODS } from './indianRegionalFoods';
import { INTERNATIONAL_FOODS } from './internationalFoods';
import { CURRIES_AND_SIDES } from './curriesAndSides';
import { PresetFood, FoodItem, MealType } from '../../types';
import { getFoodImageUrl } from '../../utils/foodImageDatabase';

export * from './types';
export * from './keralaFoods';
export * from './indianRegionalFoods';
export * from './internationalFoods';
export * from './curriesAndSides';

// Complete Combined Database with extensive Curries and Side Dishes
const foodMap = new Map<string, ComprehensiveFood>();
[...CURRIES_AND_SIDES, ...KERALA_FOODS, ...INDIAN_REGIONAL_FOODS, ...INTERNATIONAL_FOODS].forEach((f) => {
  if (!foodMap.has(f.id)) {
    foodMap.set(f.id, f);
  }
});

export const COMPREHENSIVE_FOOD_DATABASE: ComprehensiveFood[] = Array.from(foodMap.values());

/**
 * Calculates exact nutritional values for any specified gram weight of a food item.
 */
export const calculatePortionNutrition = (
  food: ComprehensiveFood,
  grams: number
) => {
  const factor = Math.max(0, grams) / 100;
  return {
    grams: Math.round(grams),
    calories: Math.round(food.per100g.calories * factor),
    protein: Math.round(food.per100g.protein * factor * 10) / 10,
    carbs: Math.round(food.per100g.carbs * factor * 10) / 10,
    fat: Math.round(food.per100g.fat * factor * 10) / 10,
    fiber: Math.round(food.per100g.fiber * factor * 10) / 10,
    sugar: food.per100g.sugar !== undefined ? Math.round(food.per100g.sugar * factor * 10) / 10 : undefined,
    sodiumMg: food.per100g.sodiumMg !== undefined ? Math.round(food.per100g.sodiumMg * factor) : undefined
  };
};

/**
 * Normalizes text for search comparison (strips accents, lowercase, removes excess punctuation).
 */
const normalizeSearchToken = (text: string): string => {
  return text.toLowerCase().trim();
};

/**
 * High-performance multilingual search supporting English, Manglish, and Malayalam Unicode script.
 */
export const searchFoods = (
  filters: FoodSearchFilters,
  customFoods: ComprehensiveFood[] = []
): ComprehensiveFood[] => {
  const allFoods = [...customFoods, ...COMPREHENSIVE_FOOD_DATABASE];
  const query = filters.query ? normalizeSearchToken(filters.query) : '';

  return allFoods.filter((item) => {
    // 1. Text Search (Multilingual: English, Malayalam, Manglish, Alternate Names)
    if (query) {
      const matchName = normalizeSearchToken(item.name).includes(query);
      const matchMalayalam = item.malayalamName ? item.malayalamName.includes(query) : false;
      const matchManglish = item.manglishName ? normalizeSearchToken(item.manglishName).includes(query) : false;
      const matchAlternates = item.alternateNames.some((alt) => normalizeSearchToken(alt).includes(query));
      const matchCategory = normalizeSearchToken(item.category).includes(query);
      const matchRegion = normalizeSearchToken(item.region).includes(query);
      const matchCooking = item.cookingMethod ? normalizeSearchToken(item.cookingMethod).includes(query) : false;

      if (!matchName && !matchMalayalam && !matchManglish && !matchAlternates && !matchCategory && !matchRegion && !matchCooking) {
        return false;
      }
    }

    // 2. Cuisine Filter
    if (filters.cuisine && filters.cuisine !== 'all') {
      if (item.cuisine !== filters.cuisine) return false;
    }

    // 3. Category Filter
    if (filters.category && filters.category !== 'all') {
      if (item.category !== filters.category) return false;
    }

    // 4. Dietary Type Filter
    if (filters.dietaryType && filters.dietaryType !== 'all') {
      if (filters.dietaryType === 'vegetarian') {
        if (item.dietaryType !== 'vegetarian' && item.dietaryType !== 'vegan') return false;
      } else if (filters.dietaryType === 'vegan') {
        if (item.dietaryType !== 'vegan') return false;
      } else if (filters.dietaryType === 'pescatarian') {
        if (item.dietaryType !== 'pescatarian' && item.dietaryType !== 'vegetarian' && item.dietaryType !== 'vegan') return false;
      } else if (filters.dietaryType === 'non_vegetarian') {
        if (item.dietaryType !== 'non_vegetarian') return false;
      }
    }

    // 5. High Protein Filter (>12g protein per 100g or >15g per serving)
    if (filters.highProteinOnly) {
      const defaultServingGrams = item.defaultServing.grams;
      const defaultProtein = (item.per100g.protein * defaultServingGrams) / 100;
      if (item.per100g.protein < 12 && defaultProtein < 15) return false;
    }

    // 6. Budget Friendly Filter
    if (filters.budgetFriendlyOnly && !item.budgetFriendly) {
      return false;
    }

    // 7. Verified Only Filter
    if (filters.onlyVerified && item.verificationStatus !== 'verified') {
      return false;
    }

    return true;
  });
};

/**
 * Converts a ComprehensiveFood entry to the legacy PresetFood interface for backwards compatibility.
 */
export const toPresetFood = (
  food: ComprehensiveFood,
  serving?: ServingSize
): PresetFood => {
  const targetServing = serving || food.defaultServing;
  const nutrition = calculatePortionNutrition(food, targetServing.grams);

  // Map category to legacy categories
  let legacyCategory: PresetFood['category'] = 'Produce';
  if (food.category === 'meat_poultry' || food.category === 'seafood' || food.category === 'fitness_staples') {
    legacyCategory = 'Protein';
  } else if (food.category === 'breakfast' || food.category === 'staples_grains') {
    legacyCategory = 'Carb';
  } else if (food.category === 'desserts' || food.category === 'snacks_streetfood') {
    legacyCategory = 'Fat';
  } else if (food.allergens.includes('Dairy')) {
    legacyCategory = 'Dairy / Alternative';
  }

  return {
    name: food.name,
    category: legacyCategory,
    defaultPortion: targetServing.label,
    grams: targetServing.grams,
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    fiber: nutrition.fiber,
    budgetFriendly: food.budgetFriendly,
    suitableDiets: food.dietaryType === 'vegan' 
      ? ['omnivore', 'vegetarian', 'vegan', 'pescatarian']
      : food.dietaryType === 'vegetarian'
      ? ['omnivore', 'vegetarian', 'pescatarian']
      : food.dietaryType === 'pescatarian'
      ? ['omnivore', 'pescatarian']
      : ['omnivore'],
    allergens: food.allergens,
    imageUrl: food.imageUrl || getFoodImageUrl(food)
  };
};

/**
 * Creates a logged FoodItem from a ComprehensiveFood item and selected portion.
 */
export const toFoodItem = (
  food: ComprehensiveFood,
  meal: MealType,
  serving: ServingSize,
  customGrams?: number
): Omit<FoodItem, 'id' | 'timestamp'> => {
  const grams = customGrams && customGrams > 0 ? customGrams : serving.grams;
  const nutrition = calculatePortionNutrition(food, grams);

  const portionLabel = customGrams && customGrams !== serving.grams
    ? `${serving.label.split('(')[0].trim()} (${grams}g)`
    : serving.label;

  return {
    name: food.name,
    meal,
    portion: portionLabel,
    grams,
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    fiber: nutrition.fiber,
    isCustom: food.verificationStatus === 'user_provided',
    category: food.category,
    budgetFriendly: food.budgetFriendly,
    malayalamName: undefined,
    cuisine: food.cuisine,
    imageUrl: food.imageUrl || getFoodImageUrl(food),
    verificationStatus: food.verificationStatus
  };
};

/**
 * Converts a UserCustomRecipe into a ComprehensiveFood item so it can be searched and logged like any other food.
 */
export const customRecipeToComprehensiveFood = (recipe: UserCustomRecipe): ComprehensiveFood => {
  const servingGrams = recipe.totalPerServing.grams;
  const factor = 100 / Math.max(1, servingGrams);

  return {
    id: recipe.id,
    name: recipe.name,
    malayalamName: recipe.malayalamName,
    manglishName: recipe.name,
    alternateNames: [recipe.name.toLowerCase()],
    cuisine: recipe.cuisine || 'kerala',
    region: 'Custom Recipe',
    category: 'curries_gravies',
    dietaryType: 'vegetarian',
    description: `User-created custom recipe with ${recipe.ingredients.length} ingredients. Yields ${recipe.servingsYield} serving(s).`,
    per100g: {
      calories: Math.round(recipe.totalPerServing.calories * factor),
      protein: Math.round(recipe.totalPerServing.protein * factor * 10) / 10,
      carbs: Math.round(recipe.totalPerServing.carbs * factor * 10) / 10,
      fat: Math.round(recipe.totalPerServing.fat * factor * 10) / 10,
      fiber: Math.round(recipe.totalPerServing.fiber * factor * 10) / 10
    },
    servings: [
      { label: `1 serving (${recipe.totalPerServing.grams}g)`, grams: recipe.totalPerServing.grams, isDefault: true }
    ],
    defaultServing: { label: `1 serving (${recipe.totalPerServing.grams}g)`, grams: recipe.totalPerServing.grams, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'user_provided',
    dataSource: 'User Custom Recipe Builder'
  };
};
