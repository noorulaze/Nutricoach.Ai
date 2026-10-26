export type GoalType = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'athletic_performance' | 'strength';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';

export type EquipmentType = 'full_gym' | 'dumbbells_only' | 'home_minimal' | 'bodyweight_only' | 'resistance_bands';

export type DietType = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';

export type BudgetTier = 'budget' | 'moderate' | 'flexible';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  goal: GoalType;
  experienceLevel: ExperienceLevel;
  activityLevel: ActivityLevel;
  availableEquipment: EquipmentType;
  trainingDaysPerWeek: number;
  preferredWorkoutDurationMin: number;
  dietType: DietType;
  allergies: string[];
  budget: BudgetTier;
  
  // Calculated & Customizable Targets
  tdee: number;
  calorieTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
  fiberTargetGrams: number;
  customMacros: boolean;
  
  // AI Integration
  geminiApiKey?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  meal: MealType;
  portion: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  isCustom?: boolean;
  timestamp: string;
  category?: string;
  budgetFriendly?: boolean;
  malayalamName?: string;
  cuisine?: string;
  verificationStatus?: 'verified' | 'estimated' | 'user_provided';
}

export * from '../data/foodDatabase/types';

export interface PresetFood {
  name: string;
  category: 'Protein' | 'Carb' | 'Fat' | 'Produce' | 'Dairy / Alternative';
  defaultPortion: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  budgetFriendly: boolean;
  suitableDiets: DietType[];
  allergens: string[];
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  weightKg?: number;
  restSeconds: number;
  instructions: string;
  completedSets: boolean[];
}

export interface DayWorkout {
  id: string;
  dayIndex: number; // 0 = Mon, 6 = Sun
  dayName: string;
  name: string;
  isRestDay: boolean;
  targetFocus: string;
  durationMinutes: number;
  exercises: WorkoutExercise[];
  completed: boolean;
  completedDate?: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body' | 'Cardio';
  primaryMuscle: string;
  secondaryMuscles: string[];
  requiredEquipment: EquipmentType[];
  difficulty: ExperienceLevel;
  instructions: string[];
  formTips: string[];
  avoidMistakes: string[];
}

export interface ProgressEntry {
  id: string;
  date: string;
  weightKg: number;
  energyLevel: number; // 1-10
  sleepHours: number;
  recoveryRating: number; // 1-10
  notes?: string;
  measurements?: {
    waistCm?: number;
    chestCm?: number;
    armsCm?: number;
    thighsCm?: number;
  };
  photoDataUrl?: string; // Stored locally
}

export interface ChatFoodCard {
  foodId: string;
  name: string;
  category: string;
  cuisine: string;
  dietaryType: string;
  description: string;
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodiumMg?: number;
  };
  servings: {
    label: string;
    grams: number;
    isDefault?: boolean;
  }[];
  defaultServing: {
    label: string;
    grams: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  contextSummary?: string;
  actionSuggestions?: { label: string; action: string }[];
  foodCard?: ChatFoodCard;
  isError?: boolean;
}

export type AuthProviderType = 'email' | 'google' | 'apple';

export interface LinkedSocialProvider {
  provider: 'google' | 'apple';
  providerUserId: string; // The Google or Apple 'sub' identifier
  email: string;
  linkedAt: string;
  avatarUrl?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  onboarded: boolean;
  authProvider?: AuthProviderType;
  linkedProviders?: LinkedSocialProvider[];
}

export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  salt?: string;
  createdAt: string;
  onboarded: boolean;
  authProvider?: AuthProviderType;
  avatarUrl?: string;
  linkedProviders?: LinkedSocialProvider[];
  emailVerified?: boolean;
}

export * from './mealPlanner';
