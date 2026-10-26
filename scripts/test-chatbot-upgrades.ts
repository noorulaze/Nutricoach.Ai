import { generateCoachReply, findMatchingFood, formatFoodCard } from '../src/utils/aiCoachEngine';
import { getDefaultProfile, getFoodLog, addFoodEntry, getTodayKey, clearUserSession } from '../src/utils/storage';
import { UserProfile, FoodItem } from '../src/types';

// Mock localStorage and sessionStorage for Node test environment
const mockStorage: Record<string, string> = {};
const mockStorageInstance = {
  getItem: (k: string) => mockStorage[k] || null,
  setItem: (k: string, v: string) => { mockStorage[k] = v; },
  removeItem: (k: string) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  length: 0,
  key: () => null
};

if (typeof (globalThis as any).localStorage === 'undefined') {
  (globalThis as any).localStorage = mockStorageInstance;
}
if (typeof (globalThis as any).sessionStorage === 'undefined') {
  (globalThis as any).sessionStorage = mockStorageInstance;
}

console.log('--- RUNNING NUTRICOACH AI CHATBOT AUTOMATED TESTS ---');

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

async function runTests() {
  const profile: UserProfile = getDefaultProfile();
  const todayFoods: FoodItem[] = getFoodLog();
  const workouts = [];
  const progress = [];

  // =========================================================================
  // TEST 1: Coding & Software Engineering (General-Purpose AI Assistant)
  // =========================================================================
  console.log('\n[1] Testing Coding & Software Engineering:');
  const pythonReply = await generateCoachReply(
    'Write a Python script to sort a list of food items by protein ratio',
    profile,
    todayFoods,
    workouts,
    progress
  );

  assert(pythonReply.text.includes('```python'), 'Contains syntax-formatted Python code block');
  assert(pythonReply.text.includes('def process_nutrition_records') || pythonReply.text.includes('def '), 'Contains Python function definition');
  assert(!pythonReply.text.toLowerCase().includes('i can only talk about food'), 'Does not restrict answer to nutrition only');

  const reactReply = await generateCoachReply(
    'Explain how to build a React TypeScript component with state and memoization',
    profile,
    todayFoods,
    workouts,
    progress
  );
  assert(reactReply.text.includes('```tsx') || reactReply.text.includes('```typescript'), 'Contains React/TypeScript code block');
  assert(reactReply.text.includes('useMemo') || reactReply.text.includes('useState'), 'Explains React hooks correctly');

  // =========================================================================
  // TEST 2: Mathematics & Computations
  // =========================================================================
  console.log('\n[2] Testing Mathematics & Step-by-Step Problem Solving:');
  const mathReply = await generateCoachReply(
    'Solve for x in this equation: 3x + 12 = 45',
    profile,
    todayFoods,
    workouts,
    progress
  );

  assert(mathReply.text.includes('Step 1') && mathReply.text.includes('Step 2'), 'Provides step-by-step mathematical explanation');
  assert(mathReply.text.includes('11'), 'Correctly calculates x = 11');

  const bmrReply = await generateCoachReply(
    'Calculate my BMR and TDEE based on my profile',
    profile,
    todayFoods,
    workouts,
    progress
  );
  assert(bmrReply.text.includes('Basal Metabolic Rate') && bmrReply.text.includes('TDEE'), 'Calculates BMR and TDEE correctly');

  // =========================================================================
  // TEST 3: Science & Physiology
  // =========================================================================
  console.log('\n[3] Testing Science, Thermodynamics & Physiology:');
  const thermoReply = await generateCoachReply(
    'Explain the first law of thermodynamics in physics',
    profile,
    todayFoods,
    workouts,
    progress
  );
  assert(thermoReply.text.includes('Thermodynamics') || thermoReply.text.includes('Energy Conservation'), 'Explains fundamental physical law');

  const hypertrophyReply = await generateCoachReply(
    'Explain how skeletal muscle hypertrophy works physiologically',
    profile,
    todayFoods,
    workouts,
    progress
  );
  assert(hypertrophyReply.text.includes('Mechanical Tension') || hypertrophyReply.text.includes('Hypertrophy') || hypertrophyReply.text.includes('mTOR'), 'Explains physiological hypertrophy pathway');

  // =========================================================================
  // TEST 4: Kerala Cuisine & Curry Intelligence with Interactive Food Card
  // =========================================================================
  console.log('\n[4] Testing Curry Knowledge & Interactive Food Card Attachment:');
  const curryReply = await generateCoachReply(
    'How many calories and protein in Kerala Nadan Chicken Curry?',
    profile,
    todayFoods,
    workouts,
    progress
  );

  assert(curryReply.text.includes('Kerala Nadan Chicken Curry'), 'Mentions the authentic dish name');
  assert(Boolean(curryReply.foodCard), 'Attaches interactive foodCard for instant logging');
  assert(curryReply.foodCard?.name.includes('Chicken Curry'), 'Food card name matches query');
  assert(curryReply.foodCard?.per100g.calories === 142, 'Food card per-100g calories are verified (142 kcal)');
  assert(curryReply.foodCard?.servings.length! >= 3, 'Food card contains multiple portion choices');

  // Test Sambar / Avial food card
  const sambarReply = await generateCoachReply(
    'Tell me about Kerala Sambar nutrition and portion sizes',
    profile,
    todayFoods,
    workouts,
    progress
  );
  assert(Boolean(sambarReply.foodCard), 'Attaches interactive foodCard for Kerala Sambar');

  // =========================================================================
  // TEST 5: Direct Food Tracker Logging Integration
  // =========================================================================
  console.log('\n[5] Testing Direct Food Tracker Logging Integration:');
  if (curryReply.foodCard) {
    const card = curryReply.foodCard;
    const testServing = card.servings[0]; // e.g. 150g
    const factor = testServing.grams / 100;
    const testCalories = Math.round(card.per100g.calories * factor);
    const testProtein = Math.round(card.per100g.protein * factor * 10) / 10;

    const logged = addFoodEntry(getTodayKey(), {
      name: card.name,
      meal: 'lunch',
      portion: testServing.label,
      grams: testServing.grams,
      calories: testCalories,
      protein: testProtein,
      carbs: Math.round(card.per100g.carbs * factor * 10) / 10,
      fat: Math.round(card.per100g.fat * factor * 10) / 10,
      fiber: Math.round(card.per100g.fiber * factor * 10) / 10
    });

    assert(logged.name === card.name, 'Logged food item name matches card');
    assert(logged.meal === 'lunch', 'Logged to target meal category (lunch)');
    assert(logged.calories === testCalories, 'Logged item has exact calculated portion calories');

    // Verify stored log
    const updatedLog = getFoodLog(getTodayKey());
    const found = updatedLog.some(item => item.name === card.name && item.calories === testCalories);
    assert(found, 'Item persisted to localStorage food log');
  }

  // =========================================================================
  // TEST 6: Strict English Only Output Verification
  // =========================================================================
  console.log('\n[6] Testing Strict English Only Output:');
  const nonEnglishRegex = /[\u0D00-\u0D7F]/;
  const queriesToTest = [
    'How do I fit Puttu and Kadala curry into my macros?',
    'What Kerala foods will give me 30g protein?',
    'Tell me about Kudampuli Meen Mulakittathu',
    'Write a quick Python script'
  ];

  let hasNonEnglish = false;
  for (const q of queriesToTest) {
    const res = await generateCoachReply(q, profile, todayFoods, workouts, progress);
    if (nonEnglishRegex.test(res.text)) {
      hasNonEnglish = true;
      console.error(`Non-English character detected in reply for query: ${q}`);
    }
  }
  assert(!hasNonEnglish, 'Zero non-English characters in AI responses (100% clean English)');

  // =========================================================================
  // TEST 7: Multi-turn Conversation & Context Awareness
  // =========================================================================
  console.log('\n[7] Testing Multi-Turn Context Continuity:');
  const history = [
    { role: 'user' as const, text: 'Tell me about Kadala Curry' },
    { role: 'model' as const, text: 'Kadala Curry is a traditional Kerala dish made with black chickpeas.' }
  ];

  const followUpReply = await generateCoachReply(
    'How does that fit into my remaining protein today?',
    profile,
    todayFoods,
    workouts,
    progress,
    history
  );

  assert(followUpReply.text.length > 50, 'Generates context-aware follow-up response');
  assert(followUpReply.suggestedPrompts.length >= 3, 'Provides relevant suggested follow-up prompts');

  console.log(`\n🎉 RESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
