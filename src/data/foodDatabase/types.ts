export type FoodCuisine = 
  | 'kerala' 
  | 'south_indian' 
  | 'north_indian' 
  | 'pan_indian' 
  | 'middle_eastern' 
  | 'asian' 
  | 'western' 
  | 'mediterranean';

export type FoodCategory = 
  | 'breakfast' 
  | 'staples_grains' 
  | 'curries_gravies' 
  | 'seafood' 
  | 'meat_poultry' 
  | 'vegetarian_sides' 
  | 'snacks_streetfood' 
  | 'beverages' 
  | 'desserts' 
  | 'fitness_staples';

export type DietaryType = 'vegetarian' | 'vegan' | 'non_vegetarian' | 'pescatarian';

export type VerificationStatus = 'verified' | 'estimated' | 'user_provided';

export interface ServingSize {
  label: string;
  grams: number;
  isDefault?: boolean;
}

export interface MacroPer100g {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodiumMg?: number;
}

export interface ComprehensiveFood {
  id: string;
  name: string;
  malayalamName?: string;
  manglishName?: string;
  alternateNames: string[];
  cuisine: FoodCuisine;
  region: string;
  category: FoodCategory;
  dietaryType: DietaryType;
  description: string;
  per100g: MacroPer100g;
  servings: ServingSize[];
  defaultServing: ServingSize;
  budgetFriendly: boolean;
  allergens: string[];
  verificationStatus: VerificationStatus;
  dataSource: string;
  cookingMethod?: string;
}

export interface RecipeIngredient {
  foodId: string;
  foodName: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface UserCustomRecipe {
  id: string;
  name: string;
  malayalamName?: string;
  cuisine: FoodCuisine;
  servingsYield: number;
  ingredients: RecipeIngredient[];
  totalPerServing: {
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  createdAt: string;
}

export interface FoodSearchFilters {
  query?: string;
  cuisine?: FoodCuisine | 'all';
  category?: FoodCategory | 'all';
  dietaryType?: DietaryType | 'all';
  onlyVerified?: boolean;
  highProteinOnly?: boolean;
  budgetFriendlyOnly?: boolean;
}
