import { webcrypto } from 'node:crypto';

// Setup browser mocks for Node environment
const storageBackend = new Map<string, string>();
const sessionBackend = new Map<string, string>();

(globalThis as any).localStorage = {
  getItem: (key: string) => storageBackend.get(key) ?? null,
  setItem: (key: string, val: string) => storageBackend.set(key, String(val)),
  removeItem: (key: string) => storageBackend.delete(key),
  clear: () => storageBackend.clear(),
  get length() { return storageBackend.size; },
  key: (i: number) => Array.from(storageBackend.keys())[i] || null,
};

(globalThis as any).sessionStorage = {
  getItem: (key: string) => sessionBackend.get(key) ?? null,
  setItem: (key: string, val: string) => sessionBackend.set(key, String(val)),
  removeItem: (key: string) => sessionBackend.delete(key),
  clear: () => sessionBackend.clear(),
};

(globalThis as any).window = {
  crypto: webcrypto
};

// Import directly from source
import { 
  ensureDemoAccount, 
  authenticateUser, 
  saveAuthSession, 
  getAuthSession, 
  clearAuthSession, 
  getActiveUserId,
  registerUser
} from '../src/utils/cryptoAuth';
import { 
  getFoodLog, 
  saveFoodLog, 
  getWorkoutPlan, 
  saveWorkoutPlan, 
  getProgressEntries, 
  addProgressEntry,
  getProfile
} from '../src/utils/storage';

console.log('--- RUNNING NUTRICOACH AI SESSION & AUTHENTICATION TESTS ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

async function run() {
  // Test 1: Ensure demo account is created
  console.log('\n[1] Demo Account Creation:');
  const demo = await ensureDemoAccount();
  assert(demo.email === 'demo@nutricoach.ai', 'Demo account email matches demo@nutricoach.ai');
  assert(demo.id === 'usr_demo_alex', 'Demo account id is usr_demo_alex');

  // Test 2: Authenticate valid demo account
  console.log('\n[2] Authentication Flow:');
  const authRes = await authenticateUser('demo@nutricoach.ai', 'Password123!');
  assert(authRes.success === true, 'Valid credentials login successfully');
  assert(authRes.user?.id === 'usr_demo_alex', 'Returned user id is usr_demo_alex');

  // Test 3: Authenticate with invalid password
  const failRes = await authenticateUser('demo@nutricoach.ai', 'WrongPassword!');
  assert(failRes.success === false, 'Invalid credentials fail authentication');

  // Test 4: Save session
  console.log('\n[3] Session Persistence:');
  saveAuthSession(authRes.user!, true);
  const activeSession = getAuthSession();
  assert(activeSession !== null, 'Active session is restored');
  assert(activeSession?.email === 'demo@nutricoach.ai', 'Session email matches');
  assert(getActiveUserId() === 'usr_demo_alex', 'Active user ID is usr_demo_alex');

  // Test 5: Save food items, workouts, progress
  console.log('\n[4] User Data Scoping & Operations:');
  const today = '2026-10-25';
  saveFoodLog(today, [
    {
      id: 'food_test_1',
      name: 'Kerala Appam with Vegetable Stew',
      meal: 'breakfast',
      portion: '2 appams + 1 bowl stew',
      grams: 320,
      calories: 345,
      protein: 7.5,
      carbs: 52.0,
      fat: 11.0,
      fiber: 4.5,
      timestamp: '08:30 AM'
    }
  ]);

  const savedFoods = getFoodLog(today);
  assert(savedFoods.length === 1, 'One food item recorded');
  assert(savedFoods[0].name === 'Kerala Appam with Vegetable Stew', 'Food name correctly stored');

  // Add progress entry
  addProgressEntry({
    date: today,
    weightKg: 77.5,
    energyLevel: 8,
    sleepHours: 7.5,
    recoveryRating: 8,
    measurements: { waistCm: 81 },
    notes: 'Good energy, consistent diet'
  });
  const progress = getProgressEntries();
  assert(progress.length > 0, 'Progress entry recorded for usr_demo_alex');

  // Test 6: Safe Logout & Session Termination
  console.log('\n[5] Safe Session Termination (Logout):');
  clearAuthSession();

  assert(getAuthSession() === null, 'Session is null after logout');
  assert(getActiveUserId() === '', 'Active user ID is cleared after logout');
  assert(localStorage.getItem('nutricoach_auth_session_v1') === null, 'Session key removed from localStorage');
  assert(sessionStorage.getItem('nutricoach_auth_session_v1') === null, 'Session key removed from sessionStorage');

  // Test 7: Verify User Data is NEVER Deleted
  console.log('\n[6] Data Preservation Verification:');
  const rawSavedFoods = localStorage.getItem(`nutricoach_foods_${today}_usr_demo_alex`);
  const rawProgress = localStorage.getItem('nutricoach_progress_v1_usr_demo_alex');

  assert(rawSavedFoods !== null, 'CRITICAL: Food log was NOT deleted upon logout');
  assert(rawProgress !== null, 'CRITICAL: Progress entries were NOT deleted upon logout');
  const parsedFoods = JSON.parse(rawSavedFoods!);
  assert(parsedFoods[0].name === 'Kerala Appam with Vegetable Stew', 'Preserved food content 100% intact');

  // Test 8: Re-authentication restores access
  console.log('\n[7] Re-authentication & Restoring Data:');
  const reAuthRes = await authenticateUser('demo@nutricoach.ai', 'Password123!');
  saveAuthSession(reAuthRes.user!, true);
  assert(getActiveUserId() === 'usr_demo_alex', 'Active user restored to usr_demo_alex');
  const reloadedFoods = getFoodLog(today);
  assert(reloadedFoods.length === 1 && reloadedFoods[0].name === 'Kerala Appam with Vegetable Stew', 'Reloaded user data matches original');
  const reloadedProgress = getProgressEntries();
  assert(reloadedProgress.length > 0 && reloadedProgress[0].weightKg === 77.5, 'Reloaded progress intact');

  // Test 9: Multi-User Data Isolation
  console.log('\n[8] Multi-User Data Isolation:');
  const reg2 = await registerUser('Priya Nair', 'priya@example.com', 'Healthy2026!');
  assert(reg2.success === true, 'Registered second user');
  saveAuthSession(reg2.user!, true);
  assert(getActiveUserId() === reg2.user!.id, 'Active user switched to second user');

  saveFoodLog(today, [
    {
      id: 'food_priya_1',
      name: 'Kerala Puttu and Kadala Curry',
      meal: 'breakfast',
      portion: '1 piece puttu with kadala',
      grams: 350,
      calories: 410,
      protein: 14.0,
      carbs: 68.0,
      fat: 8.5,
      fiber: 9.0,
      timestamp: '09:00 AM'
    }
  ]);

  const priyaFoods = getFoodLog(today);
  assert(priyaFoods.length === 1 && priyaFoods[0].name === 'Kerala Puttu and Kadala Curry', "Priya's food logged separately");

  // Switch back to Alex
  clearAuthSession();
  saveAuthSession(demo, true);
  const alexFoodsAgain = getFoodLog(today);
  assert(alexFoodsAgain.length === 1 && alexFoodsAgain[0].name === 'Kerala Appam with Vegetable Stew', "Alex's food intact and completely isolated from Priya");

  console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
}

run().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
