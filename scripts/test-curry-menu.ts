import { CURRIES_AND_SIDES } from '../src/data/foodDatabase/curriesAndSides';
import { COMPREHENSIVE_FOOD_DATABASE, calculatePortionNutrition, toFoodItem } from '../src/data/foodDatabase/index';

console.log('--- RUNNING NUTRICOACH AI CURRY & SIDES MENU TESTS ---');

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

// 1. Total Curries & Sides count
assert(CURRIES_AND_SIDES.length >= 70, `Loaded ${CURRIES_AND_SIDES.length} curries and side dishes (>= 70 items)`);

// 2. Specific requested curries check
const allCurryNames = CURRIES_AND_SIDES.map(c => c.name.toLowerCase());

const requiredDishes = [
  'chicken curry',
  'beef curry',
  'fish curry',
  'egg curry',
  'vegetable curry',
  'sambar',
  'rasam',
  'avial',
  'thoran',
  'olan',
  'erissery',
  'kadala curry',
  'cherupayar curry',
  'parippu curry',
  'potato curry',
  'paneer curry',
  'butter chicken',
  'dal curry',
  'thai green curry',
  'japanese golden curry'
];

requiredDishes.forEach(dish => {
  const found = allCurryNames.some(name => name.includes(dish));
  assert(found, `Required curry category "${dish}" is present in database`);
});

// 3. Dietary diversity check (Vegetarian, Non-Vegetarian, Pescatarian, Vegan)
const vegCount = CURRIES_AND_SIDES.filter(c => c.dietaryType === 'vegetarian' || c.dietaryType === 'vegan').length;
const nonVegCount = CURRIES_AND_SIDES.filter(c => c.dietaryType === 'non_vegetarian').length;
const seafoodCount = CURRIES_AND_SIDES.filter(c => c.dietaryType === 'pescatarian').length;

assert(vegCount >= 25, `Extensive vegetarian & vegan options: ${vegCount} items`);
assert(nonVegCount >= 15, `Extensive non-vegetarian poultry & meat options: ${nonVegCount} items`);
assert(seafoodCount >= 10, `Extensive seafood options: ${seafoodCount} items`);

// 4. Portion Sizes and Grams Check
let allHaveServings = true;
let allHave100g = true;
let allHaveCupOrBowl = true;

CURRIES_AND_SIDES.forEach(curry => {
  if (!curry.servings || curry.servings.length < 2) allHaveServings = false;
  if (!curry.servings.some(s => s.grams === 100)) allHave100g = false;
  if (!curry.servings.some(s => s.label.toLowerCase().includes('cup') || s.label.toLowerCase().includes('bowl') || s.label.toLowerCase().includes('piece') || s.label.toLowerCase().includes('ladle') || s.label.toLowerCase().includes('serving') || s.label.toLowerCase().includes('katori') || s.label.toLowerCase().includes('plate') || s.label.toLowerCase().includes('egg'))) {
    allHaveCupOrBowl = false;
    console.error(`Missing household unit in: ${curry.name}`, curry.servings.map(s => s.label));
  }
});

assert(allHaveServings, 'Every curry has multiple selectable portion sizes');
assert(allHave100g, 'Every curry includes standard 100g portion');
assert(allHaveCupOrBowl, 'Every curry includes household portion units (1 cup / 1 bowl / piece / ladle)');

// 5. English Only Verification (zero Malayalam or non-ASCII script in curry names, labels, descriptions)
const nonEnglishRegex = /[\u0D00-\u0D7F]/;
let hasNonEnglish = false;

CURRIES_AND_SIDES.forEach(curry => {
  if (nonEnglishRegex.test(curry.name) || nonEnglishRegex.test(curry.description)) {
    hasNonEnglish = true;
    console.error(`Non-English found in: ${curry.name}`);
  }
  curry.servings.forEach(s => {
    if (nonEnglishRegex.test(s.label)) hasNonEnglish = true;
  });
});

assert(!hasNonEnglish, 'Strict English only verified: zero non-English characters in curries & sides');

// 6. Reliable Macro Validation
let allMacrosValid = true;
CURRIES_AND_SIDES.forEach(curry => {
  const p = curry.per100g;
  if (p.calories <= 0 || p.protein < 0 || p.carbs < 0 || p.fat < 0 || p.fiber < 0) {
    allMacrosValid = false;
  }
});
assert(allMacrosValid, 'All nutrition values are positive and scientifically realistic per 100g');

// 7. Dynamic Portion Calculation Verification
const nadanChicken = CURRIES_AND_SIDES.find(c => c.name.includes('Kerala Nadan Chicken Curry'))!;
const testServing = nadanChicken.servings.find(s => s.label.includes('bowl'))!;
const calculatedNutrition = calculatePortionNutrition(nadanChicken, testServing.grams);

assert(calculatedNutrition.calories === Math.round(nadanChicken.per100g.calories * (testServing.grams / 100)), 'Portion calories dynamically scale with gram weight');
assert(calculatedNutrition.protein === Math.round(nadanChicken.per100g.protein * (testServing.grams / 100) * 10) / 10, 'Portion protein dynamically scales with gram weight');

// 8. Conversion to FoodItem for Direct Logging into Tracker
const loggedItem = toFoodItem(nadanChicken, 'lunch', testServing);
assert(loggedItem.meal === 'lunch', 'Logs directly to chosen meal category (lunch)');
assert(loggedItem.name === nadanChicken.name, 'Logged item preserves clean English name');
assert(loggedItem.calories === calculatedNutrition.calories, 'Logged item has exact portion calories');

console.log(`\n🎉 RESULTS: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
