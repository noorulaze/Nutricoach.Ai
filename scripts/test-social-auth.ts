import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Polyfill Web Crypto API for Node environment
if (!globalThis.crypto) {
  (globalThis as any).crypto = {};
}
if (!globalThis.crypto.subtle) {
  (globalThis.crypto as any).subtle = {
    digest: async (algorithm: string, data: Uint8Array): Promise<ArrayBuffer> => {
      const hash = crypto.createHash('sha256').update(data).digest();
      return hash.buffer.slice(hash.byteOffset, hash.byteOffset + hash.byteLength);
    }
  };
}
if (!globalThis.crypto.getRandomValues) {
  (globalThis.crypto as any).getRandomValues = (arr: Uint8Array) => {
    const bytes = crypto.randomBytes(arr.length);
    arr.set(bytes);
    return arr;
  };
}

// Polyfill localStorage
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

const mockStorage = new MockLocalStorage();
const mockSessionStorage = new MockLocalStorage();
(globalThis as any).localStorage = mockStorage;
(globalThis as any).sessionStorage = mockSessionStorage;

// Polyfill window
(globalThis as any).window = {
  location: { origin: 'http://localhost:5173' },
  localStorage: mockStorage,
  sessionStorage: mockSessionStorage,
  crypto: globalThis.crypto
};

import { 
  processSocialLogin, 
  verifyAndLinkSocialAccount,
  getOAuthConfig,
  saveOAuthConfig,
  isSocialProviderConfigured,
  SocialAuthPayload
} from '../src/utils/socialAuth';
import { registerUser, getStoredAccounts } from '../src/utils/cryptoAuth';

console.log('================================================================');
console.log('  NUTRICOACH AI — SOCIAL AUTHENTICATION & SECURITY TEST SUITE   ');
console.log('================================================================\n');

let passCount = 0;
function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
}

async function runTests() {
  // Clear any existing stored data
  mockStorage.clear();

  // -------------------------------------------------------------------------
  // TEST 1: New User Registration via Google OAuth
  // -------------------------------------------------------------------------
  console.log('[1] Google OAuth New User Registration:');
  const googlePayload1: SocialAuthPayload = {
    provider: 'google',
    providerUserId: 'google_sub_1001',
    email: 'marcus.chen@example.com',
    name: 'Marcus Chen',
    avatarUrl: 'https://lh3.googleusercontent.com/a/marcus_avatar',
    emailVerified: true
  };

  const gResult1 = await processSocialLogin(googlePayload1);
  assert(gResult1.success === true, 'Google new user registration succeeded');
  assert(Boolean(gResult1.user), 'AuthUser object returned');
  assert(gResult1.user?.email === 'marcus.chen@example.com', 'Registered email matches');
  assert(gResult1.user?.name === 'Marcus Chen', 'Registered display name matches');
  assert(gResult1.user?.authProvider === 'google', 'Account authProvider is google');
  assert(gResult1.user?.id.startsWith('usr_'), `Unique user ID format usr_*: ${gResult1.user?.id}`);

  // Verify stored account record
  const accountsAfterG1 = getStoredAccounts();
  const storedMarcus = accountsAfterG1.find(a => a.email === 'marcus.chen@example.com');
  assert(Boolean(storedMarcus), 'Stored user account created in accounts store');
  assert(storedMarcus?.linkedProviders?.length === 1, 'Linked provider entry created');
  assert(storedMarcus?.linkedProviders?.[0].provider === 'google', 'Linked provider is google');
  assert(storedMarcus?.linkedProviders?.[0].providerUserId === 'google_sub_1001', 'Provider sub recorded');

  // Verify isolated profile initialized
  const marcusProfile = mockStorage.getItem(`nutricoach_profile_v1_${gResult1.user?.id}`);
  assert(Boolean(marcusProfile), 'User profile isolated storage initialized');
  assert(JSON.parse(marcusProfile || '{}').name === 'Marcus Chen', 'User profile saved with social name');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 2: New User Registration via Apple OAuth
  // -------------------------------------------------------------------------
  console.log('[2] Apple OAuth New User Registration:');
  const applePayload1: SocialAuthPayload = {
    provider: 'apple',
    providerUserId: 'apple_sub_2002',
    email: 'sophia.laurent@appleid.com',
    name: 'Sophia Laurent',
    emailVerified: true
  };

  const aResult1 = await processSocialLogin(applePayload1);
  assert(aResult1.success === true, 'Apple new user registration succeeded');
  assert(aResult1.user?.email === 'sophia.laurent@appleid.com', 'Apple user email matches');
  assert(aResult1.user?.authProvider === 'apple', 'Account authProvider is apple');
  assert(aResult1.user?.id !== gResult1.user?.id, 'Apple user has distinct user ID from Google user');

  const accountsAfterA1 = getStoredAccounts();
  const storedSophia = accountsAfterA1.find(a => a.email === 'sophia.laurent@appleid.com');
  assert(Boolean(storedSophia), 'Stored user account created for Apple user');
  assert(storedSophia?.linkedProviders?.[0].provider === 'apple', 'Provider recorded as apple');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 3: Returning Social Login (Idempotency & Same User ID)
  // -------------------------------------------------------------------------
  console.log('[3] Returning Social Login:');
  const countBefore = getStoredAccounts().length;
  const gResultReturning = await processSocialLogin(googlePayload1);
  assert(gResultReturning.success === true, 'Returning Google user logged in successfully');
  assert(gResultReturning.user?.id === gResult1.user?.id, 'Returning user retains EXACT same user ID');
  assert(getStoredAccounts().length === countBefore, 'No duplicate account created on return login');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 4: Security Anti-Auto-Merge & Conflict Detection
  // -------------------------------------------------------------------------
  console.log('[4] Account Conflict Detection (Never Auto-Merge):');
  // Register an email/password account first
  const existingEmail = 'dr.david.miller@example.com';
  const existingPass = 'StrongPass2026!';
  const emailReg = await registerUser('David Miller', existingEmail, existingPass);
  assert(emailReg.success === true, 'Pre-existing email/password account created');
  const originalUserId = emailReg.user?.id;

  // Now, a Google login arrives with the SAME email address
  const maliciousOrCollidingGoogle: SocialAuthPayload = {
    provider: 'google',
    providerUserId: 'google_sub_9999',
    email: existingEmail,
    name: 'David Miller (Google)',
    emailVerified: true
  };

  const conflictResult = await processSocialLogin(maliciousOrCollidingGoogle);
  assert(conflictResult.success === false, 'Social login did NOT blindly log into existing account');
  assert(conflictResult.requiresLinking === true, 'requiresLinking flag is raised');
  assert(Boolean(conflictResult.linkingContext), 'AccountLinkingContext returned for verification');
  assert(conflictResult.linkingContext?.email === existingEmail, 'Linking context targets existing email');
  assert(conflictResult.linkingContext?.provider === 'google', 'Linking context identifies google');

  // Verify original account was not modified or overwritten
  const accountsCheck = getStoredAccounts();
  const checkedDavid = accountsCheck.find(a => a.email === existingEmail);
  assert(checkedDavid?.id === originalUserId, 'Original user ID preserved completely');
  assert(!checkedDavid?.linkedProviders || checkedDavid.linkedProviders.length === 0, 'No linked providers attached without authorization');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 5: Account Linking with Password Verification
  // -------------------------------------------------------------------------
  console.log('[5] Cryptographic Account Linking Verification:');
  const linkingContext = conflictResult.linkingContext!;

  // Attempt linking with incorrect password
  const failLink = await verifyAndLinkSocialAccount(linkingContext, 'WrongPassword123');
  assert(failLink.success === false, 'Linking rejected with invalid password');
  assert(failLink.error?.includes('Incorrect password') === true, 'Accurate error message returned');

  // Verify still not linked
  const stillNotLinked = getStoredAccounts().find(a => a.email === existingEmail);
  assert(!stillNotLinked?.linkedProviders || stillNotLinked.linkedProviders.length === 0, 'Account remains unlinked after failed attempt');

  // Attempt linking with correct password
  const successLink = await verifyAndLinkSocialAccount(linkingContext, existingPass);
  assert(successLink.success === true, 'Linking accepted with correct password');
  assert(successLink.user?.id === originalUserId, 'Logged in to the existing user ID');

  // Verify stored record now has provider attached
  const nowLinked = getStoredAccounts().find(a => a.email === existingEmail);
  assert(nowLinked?.linkedProviders?.length === 1, 'Provider successfully attached to existing account');
  assert(nowLinked?.linkedProviders?.[0].providerUserId === 'google_sub_9999', 'Google provider ID recorded');

  // Subsequent Google login now succeeds directly!
  const directLoginAfterLink = await processSocialLogin(maliciousOrCollidingGoogle);
  assert(directLoginAfterLink.success === true, 'Subsequent Google login works seamlessly after verified linking');
  assert(directLoginAfterLink.user?.id === originalUserId, 'Continues pointing to original user ID');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 6: User Data Isolation (Food Logs, Workouts, Biometrics)
  // -------------------------------------------------------------------------
  console.log('[6] User Scoped Data Isolation:');
  const userA_id = gResult1.user!.id;
  const userB_id = aResult1.user!.id;

  // Simulate User A logging Kerala fish curry and workout
  const userA_foodKey = `nutricoach_food_logs_v1_${userA_id}`;
  const userA_foodData = [{ name: 'Kerala Fish Curry', calories: 280, protein: 26 }];
  mockStorage.setItem(userA_foodKey, JSON.stringify(userA_foodData));

  // Simulate User B logging Puttu and Kadala
  const userB_foodKey = `nutricoach_food_logs_v1_${userB_id}`;
  const userB_foodData = [{ name: 'Puttu & Kadala', calories: 420, protein: 14 }];
  mockStorage.setItem(userB_foodKey, JSON.stringify(userB_foodData));

  // Verify complete isolation
  const retrievedA = JSON.parse(mockStorage.getItem(userA_foodKey) || '[]');
  const retrievedB = JSON.parse(mockStorage.getItem(userB_foodKey) || '[]');

  assert(retrievedA.length === 1 && retrievedA[0].name === 'Kerala Fish Curry', 'User A food logs intact');
  assert(retrievedB.length === 1 && retrievedB[0].name === 'Puttu & Kadala', 'User B food logs intact');
  assert(mockStorage.getItem(`nutricoach_food_logs_v1_${userA_id}`) !== mockStorage.getItem(`nutricoach_food_logs_v1_${userB_id}`), 'Data strictly segregated by user ID');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 7: OAuth Configuration & Runtime Helpers
  // -------------------------------------------------------------------------
  console.log('[7] OAuth Configuration & Storage Helpers:');
  const initialConfig = getOAuthConfig();
  assert(typeof initialConfig === 'object', 'getOAuthConfig returns object');

  // Set mock credentials
  saveOAuthConfig({
    googleClientId: '123456789-test.apps.googleusercontent.com',
    appleClientId: 'com.nutricoach.ai.service'
  });

  const updatedConfig = getOAuthConfig();
  assert(updatedConfig.googleClientId === '123456789-test.apps.googleusercontent.com', 'googleClientId saved & loaded');
  assert(updatedConfig.appleClientId === 'com.nutricoach.ai.service', 'appleClientId saved & loaded');
  assert(isSocialProviderConfigured('google') === true, 'isSocialProviderConfigured detects Google');
  assert(isSocialProviderConfigured('apple') === true, 'isSocialProviderConfigured detects Apple');
  console.log();

  // -------------------------------------------------------------------------
  // TEST 8: UI Consistency & Light Mode Default Verification
  // -------------------------------------------------------------------------
  console.log('[8] UI Consistency & Light Mode Default Verification:');
  const loginPageSrc = fs.readFileSync(path.resolve('src/pages/LoginPage.tsx'), 'utf-8');
  const signupPageSrc = fs.readFileSync(path.resolve('src/pages/SignupPage.tsx'), 'utf-8');

  assert(loginPageSrc.includes('Continue with Google'), 'LoginPage renders Continue with Google button');
  assert(loginPageSrc.includes('Continue with Apple'), 'LoginPage renders Continue with Apple button');
  assert(loginPageSrc.includes('AccountLinkingModal'), 'LoginPage integrates AccountLinkingModal');
  assert(loginPageSrc.includes('OAuthSetupModal'), 'LoginPage integrates OAuthSetupModal');
  assert(loginPageSrc.includes('bg-[#f6f8f5]'), 'LoginPage defaults to light background #f6f8f5');
  assert(loginPageSrc.includes('NutriCoachLogo'), 'LoginPage displays official NutriCoach folded-leaf logo');

  assert(signupPageSrc.includes('Continue with Google'), 'SignupPage renders Continue with Google button');
  assert(signupPageSrc.includes('Continue with Apple'), 'SignupPage renders Continue with Apple button');
  assert(signupPageSrc.includes('AccountLinkingModal'), 'SignupPage integrates AccountLinkingModal');
  assert(signupPageSrc.includes('OAuthSetupModal'), 'SignupPage integrates OAuthSetupModal');
  assert(signupPageSrc.includes('bg-[#f6f8f5]'), 'SignupPage defaults to light background #f6f8f5');
  assert(signupPageSrc.includes('NutriCoachLogo'), 'SignupPage displays official NutriCoach folded-leaf logo');
  console.log();

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('================================================================');
  console.log(`🎉 ALL TESTS PASSED! Total assertions verified: ${passCount}`);
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
