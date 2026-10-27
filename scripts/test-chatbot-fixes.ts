import { generateCoachReply } from '../src/utils/aiCoachEngine';
import { executeChat } from '../src/server/chatService';
import { UserProfile, FoodItem, DayWorkout, ProgressEntry } from '../src/types';

// Standard test user profile
const mockProfile: UserProfile = {
  name: 'azz',
  age: 26,
  gender: 'male',
  heightCm: 175,
  weightKg: 72,
  goal: 'muscle_gain',
  experienceLevel: 'intermediate',
  activityLevel: 'moderate',
  availableEquipment: 'full_gym',
  trainingDaysPerWeek: 4,
  preferredWorkoutDurationMin: 50,
  dietType: 'omnivore',
  allergies: [],
  budget: 'moderate',
  tdee: 2400,
  calorieTarget: 2600,
  proteinTargetGrams: 160,
  carbsTargetGrams: 300,
  fatTargetGrams: 75,
  fiberTargetGrams: 35,
  customMacros: false,
  geminiApiKey: ''
};

const mockFoods: FoodItem[] = [
  {
    id: 'food_1',
    name: 'Boiled Eggs (2)',
    meal: 'breakfast',
    portion: '2 eggs',
    grams: 100,
    calories: 143,
    protein: 12.6,
    carbs: 0.8,
    fat: 9.5,
    fiber: 0,
    timestamp: '08:30'
  }
];

const mockWorkouts: DayWorkout[] = [
  {
    dayIndex: (new Date().getDay() + 6) % 7,
    name: 'Upper Body Hypertrophy',
    targetFocus: 'Chest, Back & Shoulders',
    durationMinutes: 50,
    completed: false,
    isRestDay: false,
    exercises: []
  }
];

const mockProgress: ProgressEntry[] = [];

// The repeated welcome text that caused the bug
const FORBIDDEN_WELCOME_SNIPPET = 'i am your nutricoach ai companion';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (detail) console.error(`   Details: ${detail}`);
    testsFailed++;
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🤖 RUNNING NUTRICHOACH AI CHATBOT REGRESSION & UNIT TESTS');
  console.log('======================================================\n');

  // Test 1: Capital of Japan
  {
    const query = 'What is the capital of Japan?';
    const reply = await generateCoachReply(query, mockProfile, mockFoods, mockWorkouts, mockProgress);
    const textLower = reply.text.toLowerCase();
    
    assert(
      !textLower.includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 1: Does NOT return repeated welcome message for "What is the capital of Japan?"'
    );
    assert(
      textLower.includes('tokyo'),
      'Test 1: Accurately identifies Tokyo as the capital of Japan'
    );
  }

  // Test 2: Photosynthesis
  {
    const query = 'Explain photosynthesis in simple English.';
    const reply = await generateCoachReply(query, mockProfile, mockFoods, mockWorkouts, mockProgress);
    const textLower = reply.text.toLowerCase();
    
    assert(
      !textLower.includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 2: Does NOT return repeated welcome message for "Explain photosynthesis in simple English."'
    );
    assert(
      textLower.includes('photosynthesis') && (textLower.includes('sunlight') || textLower.includes('chlorophyll') || textLower.includes('glucose')),
      'Test 2: Accurately explains photosynthesis in simple English'
    );
  }

  // Test 3: Math 25 * 16
  {
    const query = 'What is 25 multiplied by 16?';
    const reply = await generateCoachReply(query, mockProfile, mockFoods, mockWorkouts, mockProgress);
    const textLower = reply.text.toLowerCase();
    
    assert(
      !textLower.includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 3: Does NOT return repeated welcome message for "What is 25 multiplied by 16?"'
    );
    assert(
      reply.text.includes('400'),
      'Test 3: Accurately calculates 25 * 16 = 400'
    );
  }

  // Test 4: Explain Protein in simple terms
  {
    const query = 'Explain protein in simple terms.';
    const reply = await generateCoachReply(query, mockProfile, mockFoods, mockWorkouts, mockProgress);
    const textLower = reply.text.toLowerCase();
    
    assert(
      !textLower.includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 4: Does NOT return repeated welcome message for "Explain protein in simple terms."'
    );
    assert(
      (textLower.includes('amino acid') || textLower.includes('building block') || textLower.includes('muscle')) && !textLower.includes("today's nutritional review for"),
      'Test 4: Explains protein conceptually without defaulting to today\'s log review'
    );
  }

  // Test 5: Debug JavaScript function
  {
    const query = 'Help me debug a JavaScript function.';
    const reply = await generateCoachReply(query, mockProfile, mockFoods, mockWorkouts, mockProgress);
    const textLower = reply.text.toLowerCase();
    
    assert(
      !textLower.includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 5: Does NOT return repeated welcome message for "Help me debug a JavaScript function."'
    );
    assert(
      textLower.includes('debug') && (textLower.includes('console.log') || textLower.includes('async') || textLower.includes('undefined') || textLower.includes('function')),
      'Test 5: Provides comprehensive, practical JavaScript debugging guidance'
    );
  }

  // Test 6: Kerala Sadya in Manglish
  {
    const query = 'Kerala sadya-yil enthellam und?';
    const reply = await generateCoachReply(query, mockProfile, mockFoods, mockWorkouts, mockProgress);
    const textLower = reply.text.toLowerCase();
    
    assert(
      !textLower.includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 6: Does NOT return repeated welcome message for "Kerala sadya-yil enthellam und?"'
    );
    assert(
      (textLower.includes('avial') || textLower.includes('sambar') || textLower.includes('parippu') || textLower.includes('payasam')),
      'Test 6: Lists Kerala Sadya courses in English (Avial, Sambar, Parippu, Payasam)'
    );
  }

  // Test 7: Backend /api/chat service execution
  {
    const serverResult = await executeChat({
      message: 'What is 15% of 800?',
      profile: mockProfile,
      todayFoods: mockFoods
    });
    
    assert(
      serverResult.success === true && serverResult.text.includes('120'),
      'Test 7: Backend chat service evaluates percentage correctly (15% of 800 = 120)'
    );
    assert(
      !serverResult.text.toLowerCase().includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 7: Backend chat service does NOT return welcome message'
    );
  }

  // Test 8: Backend invalid API key handling
  {
    const authTestResult = await executeChat({
      message: 'Tell me about healthy carbs',
      apiKey: 'invalid_key_123456789'
    });
    
    assert(
      authTestResult.isAuthError === true,
      'Test 8: Backend chat service detects invalid API key format and flags isAuthError'
    );
    assert(
      authTestResult.text.includes('Invalid Gemini API Key'),
      'Test 8: Returns clear, actionable feedback to the user instead of crashing'
    );
  }

  // Test 9: Multi-turn conversation context continuity
  {
    const history = [
      { role: 'user' as const, text: 'Tell me about Kudampuli Meen Curry' },
      { role: 'model' as const, text: 'Kudampuli Meen Curry has 118 kcal and 18.7g protein per serving.' }
    ];
    
    const followUp = await generateCoachReply(
      'How does that fit into my protein target?',
      mockProfile,
      mockFoods,
      mockWorkouts,
      mockProgress,
      history
    );
    
    assert(
      !followUp.text.toLowerCase().includes(FORBIDDEN_WELCOME_SNIPPET),
      'Test 9: Follow-up query does NOT return welcome message'
    );
    assert(
      followUp.text.length > 50,
      'Test 9: Generates meaningful multi-turn follow-up answer'
    );
  }

  console.log('\n======================================================');
  console.log(`TEST RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('======================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
