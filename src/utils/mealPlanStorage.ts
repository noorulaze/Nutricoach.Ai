import { 
  SavedMealPlan, 
  PlannedMeal, 
  MealPlannerPreferences,
  PlanDuration
} from '../types/mealPlanner';
import { getProfile, getUserScopedKey } from './storage';

export const MEAL_PLAN_STORAGE_KEYS = {
  ACTIVE_PLAN: 'nutricoach_active_meal_plan_v1',
  SAVED_PLANS: 'nutricoach_saved_meal_plans_v1',
  FAV_MEALS: 'nutricoach_fav_planned_meals_v1',
  PREFERENCES: 'nutricoach_meal_planner_prefs_v1'
};

/**
 * Returns default preferences derived from user's current saved profile.
 */
export const getDefaultMealPlannerPreferences = (): MealPlannerPreferences => {
  const profile = getProfile();

  // Map profile dietType to meal plan preference
  let dietaryPreference: MealPlannerPreferences['dietaryPreference'] = 'flexible';
  if (profile.dietType === 'vegetarian' || profile.dietType === 'vegan') {
    dietaryPreference = 'vegetarian';
  } else if (profile.dietType === 'omnivore' || profile.dietType === 'pescatarian') {
    dietaryPreference = 'non_vegetarian';
  }

  // Map profile budget
  let budget: MealPlannerPreferences['budget'] = 'moderate';
  if (profile.budget === 'budget') budget = 'budget';
  else if (profile.budget === 'flexible') budget = 'flexible';

  // Map profile goal
  let goal: MealPlannerPreferences['goal'] = 'balanced_eating';
  if (profile.goal === 'fat_loss') goal = 'fat_loss';
  else if (profile.goal === 'muscle_gain' || profile.goal === 'strength') goal = 'muscle_gain';
  else if (profile.goal === 'athletic_performance') goal = 'fitness_support';

  return {
    duration: '7_days',
    dietaryPreference,
    cuisines: ['kerala', 'south_indian'],
    allergies: profile.allergies || [],
    dislikedFoods: [],
    budget,
    cookingTime: 'moderate',
    mealsPerDay: 3,
    availableIngredients: [],
    goal,
    targetCalories: profile.calorieTarget || 1800,
    targetProtein: profile.proteinTargetGrams || 110,
    targetCarbs: profile.carbsTargetGrams || 200,
    targetFat: profile.fatTargetGrams || 50
  };
};

/**
 * Retrieves the user's saved preferences or returns default profile-derived preferences.
 */
export const getMealPlannerPreferences = (): MealPlannerPreferences => {
  try {
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.PREFERENCES);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const def = getDefaultMealPlannerPreferences();
      localStorage.setItem(key, JSON.stringify(def));
      return def;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get meal planner preferences', err);
    return getDefaultMealPlannerPreferences();
  }
};

/**
 * Persists the user's meal planner preferences.
 */
export const saveMealPlannerPreferences = (prefs: MealPlannerPreferences): void => {
  try {
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.PREFERENCES);
    localStorage.setItem(key, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save meal planner preferences', err);
  }
};

/**
 * Retrieves the currently active meal plan (daily or 7-day).
 */
export const getActiveMealPlan = (): SavedMealPlan | null => {
  try {
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.ACTIVE_PLAN);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get active meal plan', err);
    return null;
  }
};

/**
 * Saves or updates the currently active meal plan.
 */
export const saveActiveMealPlan = (plan: SavedMealPlan): void => {
  try {
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.ACTIVE_PLAN);
    localStorage.setItem(key, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save active meal plan', err);
  }
};

/**
 * Retrieves the list of all saved meal plans in user library.
 */
export const getSavedMealPlans = (): SavedMealPlan[] => {
  try {
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.SAVED_PLANS);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get saved meal plans', err);
    return [];
  }
};

/**
 * Saves a meal plan into user's permanent saved library.
 */
export const saveMealPlanToLibrary = (plan: SavedMealPlan): void => {
  try {
    const current = getSavedMealPlans();
    const existingIndex = current.findIndex(p => p.id === plan.id);
    let updated: SavedMealPlan[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
      updated = [plan, ...current];
    }
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.SAVED_PLANS);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save meal plan to library', err);
  }
};

/**
 * Removes a meal plan from the user's saved library.
 */
export const deleteSavedMealPlan = (id: string): void => {
  try {
    const current = getSavedMealPlans();
    const filtered = current.filter(p => p.id !== id);
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.SAVED_PLANS);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete saved meal plan', err);
  }
};

/**
 * Retrieves all bookmarked favorite planned meals.
 */
export const getFavoritePlannedMeals = (): PlannedMeal[] => {
  try {
    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.FAV_MEALS);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get favorite planned meals', err);
    return [];
  }
};

/**
 * Toggles a planned meal in the user's favorites list.
 * Returns true if now favorited, false if unfavorited.
 */
export const toggleFavoritePlannedMeal = (meal: PlannedMeal): boolean => {
  try {
    const current = getFavoritePlannedMeals();
    const existing = current.findIndex(m => m.name.toLowerCase() === meal.name.toLowerCase());
    let updated: PlannedMeal[];
    let isNowFav = false;

    if (existing >= 0) {
      updated = current.filter((_, idx) => idx !== existing);
      isNowFav = false;
    } else {
      updated = [{ ...meal, isFavorite: true }, ...current];
      isNowFav = true;
    }

    const key = getUserScopedKey(MEAL_PLAN_STORAGE_KEYS.FAV_MEALS);
    localStorage.setItem(key, JSON.stringify(updated));
    return isNowFav;
  } catch (err) {
    console.error('Failed to toggle favorite planned meal', err);
    return false;
  }
};

/**
 * Checks if a planned meal is favorited.
 */
export const isFavoritePlannedMeal = (mealName: string): boolean => {
  try {
    const current = getFavoritePlannedMeals();
    return current.some(m => m.name.toLowerCase() === mealName.toLowerCase());
  } catch {
    return false;
  }
};
