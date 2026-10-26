// Polyfill localStorage for Node environment
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

(globalThis as any).localStorage = new MockLocalStorage();

import { 
  INGREDIENTS_DATABASE, INGREDIENTS_BY_ID, searchIngredients, 
  IngredientItem 
} from '../src/data/ingredientsData';
import { 
  AUTHENTIC_DISH_RECIPES, getOrGenerateDishRecipe, 
  DishRecipe 
} from '../src/data/dishRecipes';
import { 
  calculateLiveDishNutrition, calculateGramsFromUnit, 
  calculateNutritionDiff 
} from '../src/utils/nutritionCalculator';
import { COMPREHENSIVE_FOOD_DATABASE } from '../src/data/foodDatabase/index';
import { CURRIES_AND_SIDES } from '../src/data/foodDatabase/curriesAndSides';
import { saveUserCustomRecipe, getUserCustomRecipes, addFoodEntry, getFoodLog, getTodayKey } from '../src/utils/storage';

console.log('--- RUNNING NUTRICOACH AI DISH INGREDIENTS & NUTRITION CALCULATOR TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  }
}

// ============================================================================
// TEST 1: INGREDIENTS DATABASE INTEGRITY & ICMR / USDA COMPLIANCE
// ============================================================================
console.log('\n[1] Testing Ingredients Database & Nutritional Standards:');

assert(INGREDIENTS_DATABASE.length >= 45, `Ingredients database contains ${INGREDIENTS_DATABASE.length} verified items (>= 45)`);

// Check presence of essential culinary groups
const categories = new Set(INGREDIENTS_DATABASE.map(i => i.category));
assert(categories.has('protein'), 'Contains protein ingredients (chicken, beef, fish, egg, paneer, etc.)');
assert(categories.has('oil_fat'), 'Contains oil and fat ingredients (coconut oil, ghee, sunflower, etc.)');
assert(categories.has('vegetable'), 'Contains vegetable ingredients (onions, tomatoes, shallots, curry leaves, etc.)');
assert(categories.has('grain_pulse'), 'Contains grains and pulses (toor dal, kadala, moong, rice, etc.)');
assert(categories.has('spice_seasoning'), 'Contains spices and seasonings (coriander, turmeric, chili, black pepper, etc.)');

// Verify all ingredients have scientifically valid non-negative nutritional values
const allValid = INGREDIENTS_DATABASE.every(ing => 
  ing.per100g.calories >= 0 &&
  ing.per100g.protein >= 0 &&
  ing.per100g.carbs >= 0 &&
  ing.per100g.fat >= 0 &&
  ing.per100g.fiber >= 0
);
assert(allValid, 'All ingredients have non-negative, valid macronutrient profiles per 100g');

// Specific check for key Kerala ingredients
const coconutOil = INGREDIENTS_BY_ID.get('ing_coconut_oil');
assert(!!coconutOil && coconutOil.per100g.calories === 890 && coconutOil.per100g.fat > 95, 'Coconut oil is verified (890 kcal, 99.1g fat/100g)');

const chickenBreast = INGREDIENTS_BY_ID.get('ing_chicken_breast_raw');
assert(!!chickenBreast && chickenBreast.per100g.protein > 20, 'Chicken breast raw is verified with high protein (>20g/100g)');

const coconutMilk = INGREDIENTS_BY_ID.get('ing_coconut_milk_thick');
assert(!!coconutMilk && coconutMilk.per100g.fat >= 20, 'Thick coconut milk is verified (230 kcal, 24g fat/100g)');

// Test unit conversion factors
const tbspOilGrams = calculateGramsFromUnit(1, 'tbsp', coconutOil!);
assert(tbspOilGrams === 14, `1 tbsp coconut oil converts to 14g (got ${tbspOilGrams}g)`);

const cupMilkGrams = calculateGramsFromUnit(1, 'cup', coconutMilk!);
assert(cupMilkGrams === 240, `1 cup coconut milk converts to 240g (got ${cupMilkGrams}g)`);

// Test search helper
const chickenResults = searchIngredients('chicken');
assert(chickenResults.length >= 2, `searchIngredients('chicken') finds ${chickenResults.length} chicken ingredients`);

// ============================================================================
// TEST 2: AUTHENTIC DISH RECIPES & FALLBACK PROCEDURAL GENERATION
// ============================================================================
console.log('\n[2] Testing Authentic Dish Recipes & Recipe Generator:');

const authenticKeys = Object.keys(AUTHENTIC_DISH_RECIPES);
assert(authenticKeys.length >= 15, `Contains ${authenticKeys.length} authentic pre-configured recipes`);

// Verify required dishes have authentic recipes
const requiredRecipeKeys = [
  'curry_ker_nadan_chicken',
  'curry_ker_chicken_coconut_milk',
  'curry_ker_beef_roast',
  'curry_ker_fish_curry_kudampuli',
  'curry_ker_sardine_mathi',
  'curry_ker_egg_curry',
  'curry_ker_veg_stew',
  'curry_ker_avial',
  'curry_ker_cabbage_thoran',
  'curry_ker_kadala_curry',
  'curry_ker_parippu_curry',
  'curry_ker_sambar',
  'curry_ind_butter_chicken',
  'curry_ind_paneer_butter_masala',
  'ker_puttu_white'
];

requiredRecipeKeys.forEach(k => {
  assert(!!AUTHENTIC_DISH_RECIPES[k], `Authentic recipe present for "${k}"`);
  const r = AUTHENTIC_DISH_RECIPES[k];
  assert(r.ingredients.length >= 3, `Recipe "${k}" has detailed ingredient list (${r.ingredients.length} items)`);
  assert(r.defaultServings >= 1, `Recipe "${k}" has valid defaultServings (${r.defaultServings})`);
});

// Test Fallback Generator on non-preconfigured dish
const arbitraryDish = COMPREHENSIVE_FOOD_DATABASE.find(f => !AUTHENTIC_DISH_RECIPES[f.id]) || COMPREHENSIVE_FOOD_DATABASE[0];
const generatedRecipe = getOrGenerateDishRecipe(arbitraryDish);
assert(!!generatedRecipe && generatedRecipe.ingredients.length >= 4, `Procedurally generated realistic recipe for "${arbitraryDish.name}" with ${generatedRecipe.ingredients.length} ingredients`);

// ============================================================================
// TEST 3: LIVE NUTRITION RECALCULATION & INGREDIENT CUSTOMIZATION
// ============================================================================
console.log('\n[3] Testing Live Nutrition Recalculation Engine:');

const nadanChicken = AUTHENTIC_DISH_RECIPES['curry_ker_nadan_chicken'];
const initialCalc = calculateLiveDishNutrition(
  nadanChicken.ingredients,
  nadanChicken.defaultServings,
  nadanChicken.cookingMethod
);

assert(initialCalc.perServing.calories > 150 && initialCalc.perServing.calories < 400, `Authentic Nadan Chicken per serving calories in realistic range (${initialCalc.perServing.calories} kcal)`);
assert(initialCalc.perServing.protein > 15, `Authentic Nadan Chicken per serving protein high (${initialCalc.perServing.protein}g)`);

// 3.1: Remove Coconut Oil (simulate low-fat adjustment)
const noOilIngredients = nadanChicken.ingredients.filter(i => i.ingredientId !== 'ing_coconut_oil');
const noOilCalc = calculateLiveDishNutrition(noOilIngredients, nadanChicken.defaultServings, nadanChicken.cookingMethod);

assert(noOilCalc.totalDish.calories < initialCalc.totalDish.calories, `Removing coconut oil reduces total calories (${noOilCalc.totalDish.calories} < ${initialCalc.totalDish.calories})`);
assert(noOilCalc.totalDish.fat < initialCalc.totalDish.fat, `Removing coconut oil reduces total fat (${noOilCalc.totalDish.fat}g < ${initialCalc.totalDish.fat}g)`);
assert(Math.abs(noOilCalc.totalDish.protein - initialCalc.totalDish.protein) < 0.1, `Removing coconut oil does NOT change protein (${noOilCalc.totalDish.protein}g == ${initialCalc.totalDish.protein}g)`);

// 3.2: Add Extra Chicken Breast (+100g)
const extraChickenIngredients = [
  ...nadanChicken.ingredients,
  { ingredientId: 'ing_chicken_breast_raw', amount: 100, unit: 'g' as const, notes: 'Extra chicken' }
];
const extraChickenCalc = calculateLiveDishNutrition(extraChickenIngredients, nadanChicken.defaultServings, nadanChicken.cookingMethod);

assert(extraChickenCalc.totalDish.protein > initialCalc.totalDish.protein + 20, `Adding 100g chicken breast increases protein significantly (${extraChickenCalc.totalDish.protein}g > ${initialCalc.totalDish.protein}g)`);
assert(extraChickenCalc.totalDish.calories > initialCalc.totalDish.calories + 100, `Adding 100g chicken breast increases calories as expected (+${extraChickenCalc.totalDish.calories - initialCalc.totalDish.calories} kcal)`);

// 3.3: Servings Scaling (1 serving vs 2 servings vs 4 servings)
const calcServings1 = calculateLiveDishNutrition(nadanChicken.ingredients, 1, nadanChicken.cookingMethod);
const calcServings2 = calculateLiveDishNutrition(nadanChicken.ingredients, 2, nadanChicken.cookingMethod);
const calcServings4 = calculateLiveDishNutrition(nadanChicken.ingredients, 4, nadanChicken.cookingMethod);

assert(calcServings1.totalDish.calories === calcServings2.totalDish.calories, 'Total dish batch calories remain constant regardless of serving count');
assert(calcServings1.perServing.calories === calcServings2.perServing.calories * 2, 'Per serving calories scale inversely with serving count (1 serv == 2 * 2 serv)');
assert(calcServings4.perServing.calories === Math.round(calcServings2.perServing.calories / 2), '4 servings per-serving calories is half of 2 servings');

// 3.4: Cooking Method Moisture & Yield Adjustment
const calcSimmered = calculateLiveDishNutrition(nadanChicken.ingredients, 2, 'gravy_simmered');
const calcRoasted = calculateLiveDishNutrition(nadanChicken.ingredients, 2, 'roasted');

assert(calcRoasted.totalDish.calories === calcSimmered.totalDish.calories, 'Cooking method preserves macronutrient calorie totals without inventing or destroying energy');
assert(calcRoasted.totalDish.grams < calcSimmered.totalDish.grams, `Roasted method accounts for moisture loss (${calcRoasted.totalDish.grams}g < ${calcSimmered.totalDish.grams}g)`);

// 3.5: Test Delta Comparison
const diff = calculateNutritionDiff(extraChickenCalc.perServing, initialCalc.perServing);
assert(diff.caloriesDiff > 0, `Delta correctly reflects calorie increase (+${diff.caloriesDiff} kcal)`);
assert(diff.proteinDiff > 0, `Delta correctly reflects protein increase (+${diff.proteinDiff}g P)`);

// ============================================================================
// TEST 4: ACCURACY METADATA & REPUTABLE SOURCING
// ============================================================================
console.log('\n[4] Testing Accuracy Labels & Edible Portions:');

assert(initialCalc.accuracyMetadata.isEstimate === false, 'Authentic recipe is marked verified (not estimate)');
assert(initialCalc.accuracyMetadata.verificationLabel.includes('ICMR-NIN & USDA Verified'), 'Displays ICMR-NIN & USDA Verified label');
assert(initialCalc.accuracyMetadata.sources.length >= 1, `Lists reliable data sources: ${initialCalc.accuracyMetadata.sources.join(', ')}`);

// Custom recipe with estimated flag
const customCalc = calculateLiveDishNutrition(nadanChicken.ingredients, 2, 'gravy_simmered', true);
assert(customCalc.accuracyMetadata.isEstimate === true, 'Customized or unverified dish correctly marks isEstimate: true');
assert(customCalc.accuracyMetadata.verificationLabel.includes('Estimated Recipe Formula'), 'Correctly warns user of Estimated Formula when exact data unavailable');

// ============================================================================
// TEST 5: STORAGE & DIRECT FOOD TRACKER INTEGRATION
// ============================================================================
console.log('\n[5] Testing User Recipe Storage & Direct Food Logging:');

// Test saving custom recipe to user account
const customRecipeObj = {
  id: 'test_custom_dish_' + Date.now(),
  name: 'Alex Custom Chicken Curry',
  cuisine: 'kerala' as const,
  servingsYield: 3,
  ingredients: [
    { foodId: 'ing_chicken_breast_raw', foodName: 'Chicken Breast', grams: 300, calories: 360, protein: 67.5, carbs: 0, fat: 7.8, fiber: 0 },
    { foodId: 'ing_coconut_oil', foodName: 'Coconut Oil', grams: 14, calories: 125, protein: 0, carbs: 0, fat: 13.9, fiber: 0 }
  ],
  totalPerServing: {
    grams: 140,
    calories: 162,
    protein: 22.5,
    carbs: 0,
    fat: 7.2,
    fiber: 0
  },
  createdAt: new Date().toISOString()
};

saveUserCustomRecipe(customRecipeObj);
const savedRecipes = getUserCustomRecipes();
const foundSaved = savedRecipes.some(r => r.id === customRecipeObj.id);
assert(foundSaved, 'Customized dish saved successfully to user custom recipes');

// Test logging customized dish to today's food tracker
const today = getTodayKey();
const loggedEntry = {
  name: 'Kerala Nadan Chicken Curry (Customized)',
  meal: 'lunch' as const,
  portion: '1 serving (150g, customized)',
  grams: 150,
  calories: initialCalc.perServing.calories,
  protein: initialCalc.perServing.protein,
  carbs: initialCalc.perServing.carbs,
  fat: initialCalc.perServing.fat,
  fiber: initialCalc.perServing.fiber,
  isCustom: true,
  category: 'curries_gravies',
  cuisine: 'kerala',
  verificationStatus: 'verified' as const
};

const newLogItem = addFoodEntry(today, loggedEntry);
assert(!!newLogItem.id, 'addFoodEntry generates unique item ID for customized dish');
const currentFoods = getFoodLog(today);
const foundInLog = currentFoods.some(f => f.name === 'Kerala Nadan Chicken Curry (Customized)');
assert(foundInLog, 'Customized dish successfully logged and persisted to Food Tracker daily log');

// ============================================================================
// TEST 6: STRICT ENGLISH ONLY VERIFICATION
// ============================================================================
console.log('\n[6] Testing English Only Content:');

const allIngredientNames = INGREDIENTS_DATABASE.map(i => i.name).join(' ');
const hasNonAsciiInIngredients = /[^\x00-\x7F]/.test(allIngredientNames);
assert(!hasNonAsciiInIngredients, 'Ingredients database contains 100% clean English names (0 non-ASCII characters)');

const allRecipeNames = Object.values(AUTHENTIC_DISH_RECIPES).map(r => r.dishName + ' ' + r.description).join(' ');
const hasNonAsciiInRecipes = /[^\x00-\x7F]/.test(allRecipeNames);
assert(!hasNonAsciiInRecipes, 'Authentic recipes contain 100% clean English text (0 non-ASCII characters)');

// Summary
console.log(`\n🎉 DISH INGREDIENTS & NUTRITION CALCULATOR TESTS COMPLETE: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
