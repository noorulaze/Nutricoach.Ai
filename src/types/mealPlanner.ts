export type PlanDuration = '1_day' | '7_days';
export type PlanDietaryPreference = 'vegetarian' | 'non_vegetarian' | 'flexible';
export type PlanCuisine = 'kerala' | 'south_indian' | 'north_indian' | 'international' | 'fusion';
export type PlanBudget = 'budget' | 'moderate' | 'flexible';
export type PlanCookingTime = 'quick' | 'moderate' | 'relaxed';
export type PlanGoal = 'balanced_eating' | 'muscle_gain' | 'fat_loss' | 'fitness_support' | 'custom';

export interface MealPlannerPreferences {
  duration: PlanDuration;
  dietaryPreference: PlanDietaryPreference;
  cuisines: PlanCuisine[];
  allergies: string[];
  dislikedFoods: string[];
  budget: PlanBudget;
  cookingTime: PlanCookingTime;
  mealsPerDay: number; // 2, 3, 4, 5
  availableIngredients: string[];
  goal: PlanGoal;
  customGoalText?: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export interface MealIngredient {
  id?: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface MealSubstitution {
  original: string;
  substitute: string;
  note: string;
}

export interface PlannedMeal {
  id: string;
  dayIndex: number; // 0 to 6 (0 = Monday / Day 1)
  dayName: string;  // "Monday", "Tuesday", etc. or "Today"
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  cuisine: string;
  description: string;
  servings: number;
  servingSize: string; // e.g. "1 bowl (180g)"
  prepTimeMin: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: MealIngredient[];
  instructions: string[];
  substitutions: MealSubstitution[];
  allergens: string[];
  isEstimate: boolean;
  isFavorite?: boolean;
}

export interface DayPlan {
  dayIndex: number;
  dayName: string;
  dateKey?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  meals: PlannedMeal[];
}

export interface SavedMealPlan {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  duration: PlanDuration;
  preferences: MealPlannerPreferences;
  days: DayPlan[];
  isAIGenerated: boolean;
  sourceModel?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'Produce' | 'Proteins & Dairy' | 'Grains & Pulses' | 'Spices & Oils' | 'Pantry & Other';
  checked: boolean;
  usedInMeals: string[];
}
