import { 
  UserProfile, FoodItem, DayWorkout, ProgressEntry, 
  PresetFood, DietType, BudgetTier 
} from '../types';
import { FOOD_DATABASE, DEFAULT_WEEKLY_WORKOUT } from '../data/nutritionAndExerciseData';

const STORAGE_KEYS = {
  PROFILE: 'nutricoach_profile_v1',
  FOODS_PREFIX: 'nutricoach_foods_',
  WORKOUTS: 'nutricoach_workouts_v1',
  PROGRESS: 'nutricoach_progress_v1',
  CHAT_HISTORY: 'nutricoach_chat_history_v1',
  CUSTOM_FOODS: 'nutricoach_custom_foods_v1'
};

// --- DEFAULT PROFILE & TARGET CALCULATORS ---
export const calculateBMR = (weightKg: number, heightCm: number, age: number, gender: string): number => {
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    athlete: 1.9
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
};

export const calculateTargets = (
  tdee: number, 
  weightKg: number, 
  goal: string
): { calories: number; protein: number; carbs: number; fat: number; fiber: number } => {
  let calories = tdee;
  let proteinPerKg = 2.0; // default 2g per kg

  if (goal === 'fat_loss') {
    calories = Math.round(tdee - 450); // safe moderate deficit
    proteinPerKg = 2.2; // elevated to spare lean mass
  } else if (goal === 'muscle_gain') {
    calories = Math.round(tdee + 300); // lean surplus
    proteinPerKg = 2.0;
  } else if (goal === 'strength' || goal === 'athletic_performance') {
    calories = Math.round(tdee + 150);
    proteinPerKg = 2.0;
  } else {
    // maintenance
    calories = tdee;
    proteinPerKg = 1.8;
  }

  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Fat at 25% of calories
  const fatCalories = calories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Remaining calories to Carbohydrates
  const remainingCalories = Math.max(0, calories - (proteinCalories + fatCalories));
  const carbsGrams = Math.round(remainingCalories / 4);

  // Fiber: ~14g per 1000 kcal, min 28g
  const fiberGrams = Math.max(28, Math.round((calories / 1000) * 14));

  return {
    calories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
    fiber: fiberGrams
  };
};

export const getDefaultProfile = (): UserProfile => {
  const initialWeight = 78;
  const initialHeight = 178;
  const initialAge = 28;
  const initialGender = 'male';
  const initialActivity = 'moderate';
  const initialGoal = 'muscle_gain';

  const bmr = calculateBMR(initialWeight, initialHeight, initialAge, initialGender);
  const tdee = calculateTDEE(bmr, initialActivity);
  const targets = calculateTargets(tdee, initialWeight, initialGoal);

  return {
    name: 'Alex Vance',
    age: initialAge,
    gender: initialGender,
    heightCm: initialHeight,
    weightKg: initialWeight,
    goal: initialGoal,
    experienceLevel: 'intermediate',
    activityLevel: initialActivity,
    availableEquipment: 'dumbbells_only',
    trainingDaysPerWeek: 4,
    preferredWorkoutDurationMin: 45,
    dietType: 'omnivore',
    allergies: [],
    budget: 'moderate',
    tdee,
    calorieTarget: targets.calories,
    proteinTargetGrams: targets.protein,
    carbsTargetGrams: targets.carbs,
    fatTargetGrams: targets.fat,
    fiberTargetGrams: targets.fiber,
    customMacros: false,
    geminiApiKey: ''
  };
};

export const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

// --- PROFILE STORAGE ---
export const getProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      const def = getDefaultProfile();
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(def));
      return def;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultProfile();
  }
};

export const saveProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
};

// --- FOOD LOG STORAGE ---
export const getInitialDailyFoods = (): FoodItem[] => [
  {
    id: 'food_init_1',
    name: 'Rolled Oats with Almond Milk',
    meal: 'breakfast',
    portion: '1 bowl (60g oats, 200ml milk)',
    grams: 260,
    calories: 255,
    protein: 9.0,
    carbs: 43.0,
    fat: 5.5,
    fiber: 6.5,
    timestamp: '08:15 AM'
  },
  {
    id: 'food_init_2',
    name: 'Boiled Large Eggs (2 eggs)',
    meal: 'breakfast',
    portion: '2 large eggs',
    grams: 100,
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    fat: 9.5,
    fiber: 0,
    timestamp: '08:30 AM'
  },
  {
    id: 'food_init_3',
    name: 'Grilled Chicken Breast with Brown Rice & Broccoli',
    meal: 'lunch',
    portion: '150g chicken, 150g rice, 100g broccoli',
    grams: 400,
    calories: 445,
    protein: 51.5,
    carbs: 38.0,
    fat: 6.2,
    fiber: 5.5,
    timestamp: '01:15 PM'
  }
];

export const getFoodLog = (date: string = getTodayKey()): FoodItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOODS_PREFIX + date);
    if (!raw) {
      // Seed today's initial realistic meals
      if (date === getTodayKey()) {
        const initial = getInitialDailyFoods();
        localStorage.setItem(STORAGE_KEYS.FOODS_PREFIX + date, JSON.stringify(initial));
        return initial;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveFoodLog = (date: string, foods: FoodItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FOODS_PREFIX + date, JSON.stringify(foods));
  } catch (err) {
    console.error('Failed to save food log', err);
  }
};

export const addFoodEntry = (date: string, food: Omit<FoodItem, 'id' | 'timestamp'>): FoodItem => {
  const current = getFoodLog(date);
  const newItem: FoodItem = {
    ...food,
    id: 'food_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  const updated = [...current, newItem];
  saveFoodLog(date, updated);
  return newItem;
};

export const deleteFoodEntry = (date: string, id: string): void => {
  const current = getFoodLog(date);
  const updated = current.filter((f) => f.id !== id);
  saveFoodLog(date, updated);
};

export const updateFoodEntry = (date: string, updatedItem: FoodItem): void => {
  const current = getFoodLog(date);
  const updated = current.map((f) => (f.id === updatedItem.id ? updatedItem : f));
  saveFoodLog(date, updated);
};

// --- WORKOUTS STORAGE ---
export const getWorkoutPlan = (): DayWorkout[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(DEFAULT_WEEKLY_WORKOUT));
      return DEFAULT_WEEKLY_WORKOUT;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WEEKLY_WORKOUT;
  }
};

export const saveWorkoutPlan = (plan: DayWorkout[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save workout plan', err);
  }
};

export const toggleExerciseSetCompletion = (
  dayIndex: number, 
  exerciseId: string, 
  setIndex: number
): DayWorkout[] => {
  const plan = getWorkoutPlan();
  const targetDay = plan.find((d) => d.dayIndex === dayIndex);
  if (!targetDay) return plan;

  const targetExercise = targetDay.exercises.find((e) => e.id === exerciseId);
  if (!targetExercise) return plan;

  targetExercise.completedSets[setIndex] = !targetExercise.completedSets[setIndex];
  saveWorkoutPlan(plan);
  return plan;
};

export const toggleDayWorkoutComplete = (dayIndex: number): DayWorkout[] => {
  const plan = getWorkoutPlan();
  const targetDay = plan.find((d) => d.dayIndex === dayIndex);
  if (!targetDay) return plan;

  targetDay.completed = !targetDay.completed;
  if (targetDay.completed) {
    targetDay.completedDate = getTodayKey();
    // Mark all sets completed as well
    targetDay.exercises.forEach((ex) => {
      ex.completedSets = ex.completedSets.map(() => true);
    });
  }
  saveWorkoutPlan(plan);
  return plan;
};

// --- PROGRESS HISTORY STORAGE ---
export const getInitialProgress = (): ProgressEntry[] => [
  {
    id: 'prog_1',
    date: '2026-10-03',
    weightKg: 79.5,
    energyLevel: 6,
    sleepHours: 6.5,
    recoveryRating: 6,
    measurements: { waistCm: 86, chestCm: 102, armsCm: 35 },
    notes: 'Starting cycle, feeling slightly sluggish but motivated.'
  },
  {
    id: 'prog_2',
    date: '2026-10-10',
    weightKg: 79.0,
    energyLevel: 7,
    sleepHours: 7.2,
    recoveryRating: 7,
    measurements: { waistCm: 85, chestCm: 103, armsCm: 35.5 },
    notes: 'Workouts felt sharper. Upped water intake to 3L.'
  },
  {
    id: 'prog_3',
    date: '2026-10-17',
    weightKg: 78.4,
    energyLevel: 8,
    sleepHours: 7.5,
    recoveryRating: 8,
    measurements: { waistCm: 84, chestCm: 103.5, armsCm: 36 },
    notes: 'Hit all 4 lifting sessions. Recovery feeling noticeably faster.'
  },
  {
    id: 'prog_4',
    date: getTodayKey(),
    weightKg: 78.0,
    energyLevel: 9,
    sleepHours: 8.0,
    recoveryRating: 9,
    measurements: { waistCm: 83.5, chestCm: 104, armsCm: 36.5 },
    notes: 'Great energy, strength continuing to tick up steadily.'
  }
];

export const getProgressEntries = (): ProgressEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      const initial = getInitialProgress();
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialProgress();
  }
};

export const saveProgressEntries = (entries: ProgressEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save progress', err);
  }
};

export const addProgressEntry = (entry: Omit<ProgressEntry, 'id'>): ProgressEntry => {
  const current = getProgressEntries();
  const newEntry: ProgressEntry = {
    ...entry,
    id: 'prog_' + Date.now()
  };
  const updated = [newEntry, ...current].sort((a, b) => b.date.localeCompare(a.date));
  saveProgressEntries(updated);
  return newEntry;
};

// --- TRANSPARENT PROGRESS SCORE CALCULATOR ---
export interface ScoreBreakdown {
  totalScore: number;
  workoutConsistencyScore: number; // Max 30
  nutritionAdherenceScore: number; // Max 30
  recoveryScore: number; // Max 20
  loggingHabitScore: number; // Max 20
  summary: string;
}

export const calculateTransparentProgressScore = (
  profile: UserProfile,
  todayFoods: FoodItem[],
  workouts: DayWorkout[],
  progress: ProgressEntry[]
): ScoreBreakdown => {
  // 1. Workout Consistency (Target days vs completed this week)
  const trainingDays = workouts.filter((w) => !w.isRestDay);
  const completedTrainingDays = trainingDays.filter((w) => w.completed).length;
  const targetDays = Math.max(1, profile.trainingDaysPerWeek);
  const workoutRatio = Math.min(1, completedTrainingDays / targetDays);
  const workoutConsistencyScore = Math.round(workoutRatio * 30);

  // 2. Nutrition Adherence (Today's calories & protein vs target)
  const totalCalories = todayFoods.reduce((acc, f) => acc + f.calories, 0);
  const totalProtein = todayFoods.reduce((acc, f) => acc + f.protein, 0);
  
  const calRatio = profile.calorieTarget > 0 ? Math.min(1.15, totalCalories / profile.calorieTarget) : 0;
  const proteinRatio = profile.proteinTargetGrams > 0 ? Math.min(1.15, totalProtein / profile.proteinTargetGrams) : 0;
  
  // Scored best when between 85% and 105% of target
  let calScorePart = 15;
  if (calRatio < 0.6) calScorePart = 8;
  else if (calRatio < 0.85) calScorePart = 12;
  else if (calRatio <= 1.05) calScorePart = 15;
  else calScorePart = 11; // slight overshoot

  let proScorePart = 15;
  if (proteinRatio < 0.6) proScorePart = 7;
  else if (proteinRatio < 0.85) proScorePart = 12;
  else proScorePart = 15;

  const nutritionAdherenceScore = calScorePart + proScorePart;

  // 3. Recovery & Energy (from latest progress log)
  const latestEntry = progress[0];
  let recoveryScore = 15;
  if (latestEntry) {
    const avgScore = (latestEntry.energyLevel + latestEntry.recoveryRating) / 2;
    recoveryScore = Math.round((avgScore / 10) * 20);
  }

  // 4. Logging Habits (Food entries logged today + progress count)
  let loggingHabitScore = 14;
  if (todayFoods.length >= 3) loggingHabitScore = 20;
  else if (todayFoods.length >= 1) loggingHabitScore = 16;
  else loggingHabitScore = 6;

  const totalScore = Math.min(100, Math.max(0, workoutConsistencyScore + nutritionAdherenceScore + recoveryScore + loggingHabitScore));

  let summary = 'Steady baseline established. Prioritize hitting daily protein and completing scheduled workouts.';
  if (totalScore >= 85) {
    summary = 'Exceptional adherence! Nutrition and workout frequency are in optimal synchronization for rapid adaptation.';
  } else if (totalScore >= 70) {
    summary = 'Strong positive momentum. Close remaining nutrient gaps to accelerate recovery and performance.';
  } else if (totalScore >= 50) {
    summary = 'Moderate consistency. Focus on pre-logging meals and locking in your designated training days.';
  }

  return {
    totalScore,
    workoutConsistencyScore,
    nutritionAdherenceScore,
    recoveryScore,
    loggingHabitScore,
    summary
  };
};

// --- NUTRITION GAP ANALYSIS & FOOD SUGGESTIONS ---
export interface NutritionGap {
  nutrient: 'protein' | 'fiber' | 'calories' | 'fat' | 'carbs';
  target: number;
  consumed: number;
  remaining: number;
  severity: 'low' | 'moderate' | 'high';
  message: string;
}

export const analyzeNutritionGaps = (
  profile: UserProfile,
  todayFoods: FoodItem[]
): {
  gaps: NutritionGap[];
  suggestedFoods: PresetFood[];
} => {
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

  const gaps: NutritionGap[] = [];

  // Protein gap
  const proteinRemaining = Math.round(profile.proteinTargetGrams - totals.protein);
  if (proteinRemaining > 15) {
    gaps.push({
      nutrient: 'protein',
      target: profile.proteinTargetGrams,
      consumed: Math.round(totals.protein),
      remaining: proteinRemaining,
      severity: proteinRemaining > 40 ? 'high' : 'moderate',
      message: `You are ${proteinRemaining}g short of your daily protein target for muscle repair.`
    });
  }

  // Fiber gap
  const fiberRemaining = Math.round(profile.fiberTargetGrams - totals.fiber);
  if (fiberRemaining > 8) {
    gaps.push({
      nutrient: 'fiber',
      target: profile.fiberTargetGrams,
      consumed: Math.round(totals.fiber),
      remaining: fiberRemaining,
      severity: fiberRemaining > 15 ? 'high' : 'moderate',
      message: `You need approximately ${fiberRemaining}g more dietary fiber for gut motility and satiety.`
    });
  }

  // Calories gap
  const caloriesRemaining = Math.round(profile.calorieTarget - totals.calories);
  if (caloriesRemaining > 250) {
    gaps.push({
      nutrient: 'calories',
      target: profile.calorieTarget,
      consumed: Math.round(totals.calories),
      remaining: caloriesRemaining,
      severity: 'moderate',
      message: `${caloriesRemaining} kcal remaining in your daily budget.`
    });
  }

  // Filter food database to find practical recommendations based on gaps + user preferences
  const isBudget = profile.budget === 'budget';
  const diet = profile.dietType;
  const allergies = profile.allergies.map((a) => a.toLowerCase());

  const candidates = FOOD_DATABASE.filter((food) => {
    // Diet check
    if (!food.suitableDiets.includes(diet)) return false;
    // Allergy check
    const hasAllergen = food.allergens.some((al) => allergies.includes(al.toLowerCase()));
    if (hasAllergen) return false;
    // Budget check
    if (isBudget && !food.budgetFriendly) return false;
    return true;
  });

  // Sort candidates by relevance to the primary gap
  let sortedSuggestions = [...candidates];
  if (proteinRemaining > 20) {
    sortedSuggestions.sort((a, b) => b.protein - a.protein);
  } else if (fiberRemaining > 10) {
    sortedSuggestions.sort((a, b) => b.fiber - a.fiber);
  } else {
    sortedSuggestions.sort((a, b) => b.calories - a.calories);
  }

  return {
    gaps,
    suggestedFoods: sortedSuggestions.slice(0, 4)
  };
};
