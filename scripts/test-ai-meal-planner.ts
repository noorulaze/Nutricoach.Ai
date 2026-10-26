import assert from 'node:assert';
import { 
  MealPlannerPreferences, 
  PlannedMeal, 
  DayPlan, 
  SavedMealPlan 
} from '../src/types/mealPlanner';
import { 
  generateAuthenticMealPlan, 
  swapSingleMealFromTemplates, 
  isMealSafeFromAllergies,
  AUTHENTIC_MEAL_TEMPLATES 
} from '../src/utils/authenticMealPlannerEngine';
import { 
  generateShoppingListFromPlan, 
  formatShoppingListText 
} from '../src/utils/shoppingListGenerator';
import { 
  executeGenerateMealPlan, 
  executeSwapMeal 
} from '../src/server/mealPlanService';
import { 
  getDefaultMealPlannerPreferences 
} from '../src/utils/mealPlanStorage';
import { addFoodEntry, getFoodLog } from '../src/utils/storage';

// Mock localStorage for Node environment
const mockStore: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (key: string) => mockStore[key] || null,
  setItem: (key: string, val: string) => { mockStore[key] = val; },
  removeItem: (key: string) => { delete mockStore[key]; },
  clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); }
};

console.log('🥗 RUNNING NUTRICOACH AI MEAL PLANNER TEST SUITE...\n');

let passCount = 0;
const test = (desc: string, fn: () => void) => {
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passCount++;
  } catch (err: any) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
};

// =========================================================================
// TEST 1: Authentic Culinary Repertoire Coverage
// =========================================================================
console.log('[1] Authentic Kerala & Indian Culinary Repertoire:');

test('Repertoire contains at least 10 authentic curated recipes', () => {
  assert(AUTHENTIC_MEAL_TEMPLATES.length >= 10, 'Expected at least 10 meal templates');
});

test('Features authentic Kerala breakfast staples: Puttu with Kadala Curry', () => {
  const puttu = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('puttu'));
  assert(puttu, 'Puttu with Kadala Curry must be present');
  assert(puttu.cuisine === 'kerala');
  assert(puttu.mealType === 'breakfast');
  assert(puttu.ingredients.some(i => i.name.toLowerCase().includes('puttu flour') || i.name.toLowerCase().includes('ari podi')));
});

test('Features Appam with Vegetable Stew', () => {
  const appam = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('appam'));
  assert(appam, 'Appam must be present');
  assert(appam.ingredients.some(i => i.name.toLowerCase().includes('coconut milk')));
});

test('Features Idiyappam with Nadan Egg Roast', () => {
  const idiyappam = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('idiyappam'));
  assert(idiyappam, 'Idiyappam must be present');
  assert(idiyappam.dietaryType === 'non_vegetarian');
});

test('Features Kerala Fish Curry (Kudampuli Meen Curry) with Rice & Avial', () => {
  const fishCurry = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('fish curry'));
  assert(fishCurry, 'Kerala fish curry must be present');
  assert(fishCurry.ingredients.some(i => i.name.toLowerCase().includes('kudampuli') || i.name.toLowerCase().includes('tamarind')));
  assert(fishCurry.ingredients.some(i => i.name.toLowerCase().includes('matta rice') || i.name.toLowerCase().includes('rice')));
});

test('Features Kerala Sadya vegetarian feast (Sambar, Avial, Thoran, Parippu)', () => {
  const sadya = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('sadya'));
  assert(sadya, 'Sadya must be present');
  assert(sadya.dietaryType === 'vegetarian');
});

test('Features Nadan Chicken Curry with Matta Rice and Beans Thoran', () => {
  const chicken = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('chicken curry'));
  assert(chicken, 'Chicken curry must be present');
  assert(chicken.dietaryType === 'non_vegetarian');
});

test('Features North Indian staples (Paneer Butter Masala, Palak Paneer, Chapati)', () => {
  const paneer = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('paneer'));
  assert(paneer, 'Paneer meal must be present');
});

// =========================================================================
// TEST 2: Strict Food Safety & Allergen Exclusions
// =========================================================================
console.log('\n[2] Strict Food Safety & Allergen Exclusion Engine:');

test('Detects and excludes peanuts when peanut allergy is declared', () => {
  const mockPeanutMeal = {
    ...AUTHENTIC_MEAL_TEMPLATES[0],
    name: 'Peanut Rice',
    ingredients: [{ name: 'Roasted Peanuts', amount: 50, unit: 'g' }],
    allergens: ['peanuts']
  };
  assert.strictEqual(isMealSafeFromAllergies(mockPeanutMeal, ['peanuts']), false);
  assert.strictEqual(isMealSafeFromAllergies(mockPeanutMeal, ['dairy']), true);
});

test('Detects and excludes dairy / milk / paneer when dairy allergy is declared', () => {
  const paneerMeal = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('paneer'))!;
  assert.strictEqual(isMealSafeFromAllergies(paneerMeal, ['dairy']), false);
  assert.strictEqual(isMealSafeFromAllergies(paneerMeal, ['milk']), false);
});

test('Detects and excludes wheat / gluten when gluten allergy is declared', () => {
  const chapatiMeal = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('chapati'))!;
  assert.strictEqual(isMealSafeFromAllergies(chapatiMeal, ['gluten']), false);
  assert.strictEqual(isMealSafeFromAllergies(chapatiMeal, ['wheat']), false);
});

test('Detects and excludes seafood / fish when fish allergy is declared', () => {
  const fishMeal = AUTHENTIC_MEAL_TEMPLATES.find(m => m.name.toLowerCase().includes('fish'))!;
  assert.strictEqual(isMealSafeFromAllergies(fishMeal, ['fish']), false);
  assert.strictEqual(isMealSafeFromAllergies(fishMeal, ['seafood']), false);
});

test('Generates 100% allergen-free plan when user declares multiple allergies', () => {
  const prefs: MealPlannerPreferences = {
    duration: '7_days',
    dietaryPreference: 'vegetarian',
    cuisines: ['kerala', 'south_indian'],
    allergies: ['dairy', 'gluten', 'peanuts'],
    dislikedFoods: [],
    budget: 'moderate',
    cookingTime: 'moderate',
    mealsPerDay: 3,
    availableIngredients: [],
    goal: 'balanced_eating',
    targetCalories: 1800
  };

  const plan = generateAuthenticMealPlan(prefs);
  assert.strictEqual(plan.length, 7);

  for (const day of plan) {
    for (const meal of day.meals) {
      assert(isMealSafeFromAllergies(meal, ['dairy', 'gluten', 'peanuts']), `Meal ${meal.name} violated declared allergy!`);
      const allText = `${meal.name} ${meal.description} ${meal.ingredients.map(i => i.name).join(' ')}`.toLowerCase();
      assert(!allText.includes('milk') && !allText.includes('paneer') && !allText.includes('butter') && !allText.includes('ghee'), `Meal ${meal.name} contained dairy!`);
      assert(!allText.includes('wheat') && !allText.includes('atta') && !allText.includes('chapati'), `Meal ${meal.name} contained gluten!`);
      assert(!allText.includes('peanut'), `Meal ${meal.name} contained peanut!`);
    }
  }
});

// =========================================================================
// TEST 3: Dietary Preference Enforcements (Vegetarian vs Non-Vegetarian)
// =========================================================================
console.log('\n[3] Dietary Lifestyle Enforcements:');

test('Strict Vegetarian plan contains ZERO meat, chicken, beef, fish, or egg', () => {
  const prefs: MealPlannerPreferences = {
    duration: '7_days',
    dietaryPreference: 'vegetarian',
    cuisines: ['kerala', 'south_indian', 'north_indian'],
    allergies: [],
    dislikedFoods: [],
    budget: 'moderate',
    cookingTime: 'moderate',
    mealsPerDay: 3,
    availableIngredients: [],
    goal: 'balanced_eating',
    targetCalories: 1800
  };

  const plan = generateAuthenticMealPlan(prefs);
  for (const day of plan) {
    for (const meal of day.meals) {
      const text = `${meal.name} ${meal.description} ${meal.ingredients.map(i => i.name).join(' ')}`.toLowerCase();
      assert(!text.includes('chicken'), `Vegetarian plan contained chicken in ${meal.name}`);
      assert(!text.includes('beef'), `Vegetarian plan contained beef in ${meal.name}`);
      assert(!text.includes('fish'), `Vegetarian plan contained fish in ${meal.name}`);
      assert(!text.includes('egg') || text.includes('eggplant'), `Vegetarian plan contained egg in ${meal.name}`);
    }
  }
});

// =========================================================================
// TEST 4: Duration (1-Day vs 7-Days) and Meal Count Allocation
// =========================================================================
console.log('\n[4] Plan Duration & Meals Per Day Customization:');

test('Generates 1-Day plan with exactly 1 day labeled Today', () => {
  const prefs: MealPlannerPreferences = {
    duration: '1_day',
    dietaryPreference: 'flexible',
    cuisines: ['kerala'],
    allergies: [],
    dislikedFoods: [],
    budget: 'moderate',
    cookingTime: 'moderate',
    mealsPerDay: 3,
    availableIngredients: [],
    goal: 'balanced_eating',
    targetCalories: 2000
  };

  const plan = generateAuthenticMealPlan(prefs);
  assert.strictEqual(plan.length, 1);
  assert.strictEqual(plan[0].dayName, 'Today');
  assert.strictEqual(plan[0].meals.length, 3);
});

test('Generates 7-Day plan with all 7 days (Monday through Sunday)', () => {
  const prefs: MealPlannerPreferences = {
    duration: '7_days',
    dietaryPreference: 'flexible',
    cuisines: ['kerala'],
    allergies: [],
    dislikedFoods: [],
    budget: 'moderate',
    cookingTime: 'moderate',
    mealsPerDay: 4, // Breakfast, Lunch, Snack, Dinner
    availableIngredients: [],
    goal: 'balanced_eating',
    targetCalories: 2000
  };

  const plan = generateAuthenticMealPlan(prefs);
  assert.strictEqual(plan.length, 7);
  assert.strictEqual(plan[0].dayName, 'Monday');
  assert.strictEqual(plan[6].dayName, 'Sunday');
  assert.strictEqual(plan[0].meals.length, 4);
});

// =========================================================================
// TEST 5: Single Meal Replacement / Swapping
// =========================================================================
console.log('\n[5] Single Meal Swapping & Independent Replacement:');

test('Replaces one meal while preserving day and meal type without touching other meals', () => {
  const prefs: MealPlannerPreferences = {
    duration: '7_days',
    dietaryPreference: 'non_vegetarian',
    cuisines: ['kerala'],
    allergies: [],
    dislikedFoods: [],
    budget: 'moderate',
    cookingTime: 'moderate',
    mealsPerDay: 3,
    availableIngredients: [],
    goal: 'balanced_eating',
    targetCalories: 1800
  };

  const originalMeal: PlannedMeal = {
    id: 'meal_orig_1',
    dayIndex: 2,
    dayName: 'Wednesday',
    mealType: 'lunch',
    name: 'Kerala Matta Rice with Nadan Chicken Curry & Beans Thoran',
    cuisine: 'kerala',
    description: 'Chicken curry with rice',
    servings: 1,
    servingSize: '1 portion',
    prepTimeMin: 35,
    calories: 560,
    protein: 38,
    carbs: 64,
    fat: 16,
    fiber: 7,
    ingredients: [{ name: 'Chicken', amount: 140, unit: 'g' }],
    instructions: ['Cook chicken'],
    substitutions: [],
    allergens: ['coconut'],
    isEstimate: true
  };

  const replaced = swapSingleMealFromTemplates(originalMeal, prefs, 'fish curry');
  assert.notStrictEqual(replaced.name, originalMeal.name, 'Meal name should be replaced');
  assert.strictEqual(replaced.dayIndex, originalMeal.dayIndex, 'Day index must be preserved');
  assert.strictEqual(replaced.dayName, originalMeal.dayName, 'Day name must be preserved');
  assert.strictEqual(replaced.mealType, originalMeal.mealType, 'Meal type must match original slot');
});

// =========================================================================
// TEST 6: Consolidated Grocery Shopping List Aggregation
// =========================================================================
console.log('\n[6] Consolidated Grocery Shopping List Generator:');

test('Combines repeated ingredients across days and categorizes into supermarket aisles', () => {
  const day1Meals: PlannedMeal[] = [
    {
      id: 'm1',
      dayIndex: 0,
      dayName: 'Monday',
      mealType: 'lunch',
      name: 'Curry 1',
      cuisine: 'kerala',
      description: '',
      servings: 1,
      servingSize: '1',
      prepTimeMin: 20,
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 10,
      fiber: 5,
      ingredients: [
        { name: 'Shallots', amount: 50, unit: 'g' },
        { name: 'Coconut oil', amount: 1, unit: 'tbsp' },
        { name: 'Chicken breast', amount: 200, unit: 'g' }
      ],
      instructions: [],
      substitutions: [],
      allergens: [],
      isEstimate: true
    },
    {
      id: 'm2',
      dayIndex: 0,
      dayName: 'Monday',
      mealType: 'dinner',
      name: 'Curry 2',
      cuisine: 'kerala',
      description: '',
      servings: 1,
      servingSize: '1',
      prepTimeMin: 20,
      calories: 400,
      protein: 20,
      carbs: 40,
      fat: 10,
      fiber: 5,
      ingredients: [
        { name: 'Shallots', amount: 30, unit: 'g' },
        { name: 'Coconut oil', amount: 1, unit: 'tbsp' },
        { name: 'Chicken breast', amount: 150, unit: 'g' }
      ],
      instructions: [],
      substitutions: [],
      allergens: [],
      isEstimate: true
    }
  ];

  const shoppingList = generateShoppingListFromPlan([{
    dayIndex: 0,
    dayName: 'Monday',
    totalCalories: 800,
    totalProtein: 40,
    totalCarbs: 80,
    totalFat: 20,
    totalFiber: 10,
    meals: day1Meals
  }]);

  assert(shoppingList.length === 3, `Expected 3 consolidated items, got ${shoppingList.length}`);

  const shallots = shoppingList.find(i => i.name.toLowerCase() === 'shallots');
  assert(shallots, 'Shallots must be present');
  assert.strictEqual(shallots.amount, 80, '50g + 30g shallots must equal 80g');
  assert.strictEqual(shallots.category, 'Produce');

  const oil = shoppingList.find(i => i.name.toLowerCase().includes('coconut oil'));
  assert(oil, 'Coconut oil must be present');
  assert.strictEqual(oil.amount, 2, '1 tbsp + 1 tbsp must equal 2 tbsp');
  assert.strictEqual(oil.category, 'Spices & Oils');

  const chicken = shoppingList.find(i => i.name.toLowerCase().includes('chicken'));
  assert(chicken, 'Chicken must be present');
  assert.strictEqual(chicken.amount, 350, '200g + 150g chicken must equal 350g');
  assert.strictEqual(chicken.category, 'Proteins & Dairy');

  const formatted = formatShoppingListText(shoppingList, 'My Weekly List');
  assert(formatted.includes('PRODUCE'));
  assert(formatted.includes('PROTEINS & DAIRY'));
  assert(formatted.includes('Shallots — 80 g'));
});

// =========================================================================
// TEST 7: Food Tracker Diary Integration
// =========================================================================
console.log('\n[7] Food Tracker Diary Direct Integration:');

test('Logs planned meal directly to user food tracker diary', () => {
  const testDate = '2026-10-26';
  const initialFoods = getFoodLog(testDate);

  const mealToLog: PlannedMeal = {
    id: 'test_plan_meal_1',
    dayIndex: 0,
    dayName: 'Monday',
    mealType: 'breakfast',
    name: 'Puttu with Kadala Curry',
    cuisine: 'kerala',
    description: 'Steamed puttu with black chickpeas',
    servings: 1,
    servingSize: '1 bowl',
    prepTimeMin: 20,
    calories: 430,
    protein: 14.5,
    carbs: 68.0,
    fat: 10.5,
    fiber: 9.8,
    ingredients: [],
    instructions: [],
    substitutions: [],
    allergens: ['coconut'],
    isEstimate: true
  };

  addFoodEntry(testDate, {
    name: mealToLog.name,
    meal: mealToLog.mealType,
    portion: mealToLog.servingSize,
    grams: 270,
    calories: mealToLog.calories,
    protein: mealToLog.protein,
    carbs: mealToLog.carbs,
    fat: mealToLog.fat,
    fiber: mealToLog.fiber,
    isCustom: true,
    cuisine: mealToLog.cuisine
  });

  const updatedFoods = getFoodLog(testDate);
  assert(updatedFoods.length === initialFoods.length + 1, 'Food log entry count should increment by 1');
  const loggedItem = updatedFoods[updatedFoods.length - 1];
  assert.strictEqual(loggedItem.name, 'Puttu with Kadala Curry');
  assert.strictEqual(loggedItem.calories, 430);
  assert.strictEqual(loggedItem.protein, 14.5);
  assert.strictEqual(loggedItem.meal, 'breakfast');
});

// =========================================================================
// TEST 8: Server-Side API Handlers & Fallback Engine
// =========================================================================
console.log('\n[8] Server-Side API Handlers & Fallback Engine:');

test('executeGenerateMealPlan handles requests cleanly without throwing when API key is missing', async () => {
  const prefs: MealPlannerPreferences = {
    duration: '7_days',
    dietaryPreference: 'flexible',
    cuisines: ['kerala'],
    allergies: [],
    dislikedFoods: [],
    budget: 'moderate',
    cookingTime: 'moderate',
    mealsPerDay: 3,
    availableIngredients: [],
    goal: 'balanced_eating',
    targetCalories: 1800
  };

  const response = await executeGenerateMealPlan({ preferences: prefs }, '');
  assert.strictEqual(response.success, true);
  assert.strictEqual(response.needsApiKey, true);
  assert(response.days.length === 7);
  assert(response.disclaimer.includes('Estimated nutritional values'));
});

test('executeSwapMeal handles single meal replacement cleanly', async () => {
  const prefs = getDefaultMealPlannerPreferences();
  const sampleMeal = AUTHENTIC_MEAL_TEMPLATES[0];
  const plannedMeal: PlannedMeal = {
    id: 'test_m1',
    dayIndex: 0,
    dayName: 'Monday',
    mealType: 'breakfast',
    name: sampleMeal.name,
    cuisine: sampleMeal.cuisine,
    description: sampleMeal.description,
    servings: 1,
    servingSize: sampleMeal.servingSize,
    prepTimeMin: sampleMeal.prepTimeMin,
    calories: sampleMeal.baseCalories,
    protein: sampleMeal.baseProtein,
    carbs: sampleMeal.baseCarbs,
    fat: sampleMeal.baseFat,
    fiber: sampleMeal.baseFiber,
    ingredients: sampleMeal.ingredients,
    instructions: sampleMeal.instructions,
    substitutions: sampleMeal.substitutions,
    allergens: sampleMeal.allergens,
    isEstimate: true
  };

  const res = await executeSwapMeal({ preferences: prefs, currentMeal: plannedMeal }, '');
  assert.strictEqual(res.success, true);
  assert(res.meal);
  assert.strictEqual(res.meal.mealType, 'breakfast');
});

console.log(`\n================================================================`);
console.log(`🎉 ALL ${passCount} AI MEAL PLANNER TESTS PASSED!`);
console.log(`================================================================\n`);
