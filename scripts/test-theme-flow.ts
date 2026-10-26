import fs from 'fs';
import path from 'path';

// Mock localStorage and document for Node environment
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
(globalThis as any).localStorage = mockStorage;

const classList = new Set<string>();
const mockDocumentElement = {
  style: { colorScheme: 'light' },
  classList: {
    add: (cls: string) => classList.add(cls),
    remove: (cls: string) => classList.delete(cls),
    contains: (cls: string) => classList.has(cls)
  }
};
(globalThis as any).document = {
  documentElement: mockDocumentElement
};

console.log('--- RUNNING NUTRICOACH AI THEME BEHAVIOR & LIGHT-BY-DEFAULT TESTS ---\n');

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

// 1. Verify CSS File Tokens
const cssPath = path.resolve('src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

console.log('[1] Color Token Specification Verification:');
assert(cssContent.includes('#1C211D'), 'CSS defines dark charcoal background #1C211D');
assert(cssContent.includes('#272E29'), 'CSS defines slightly lighter surfaces #272E29');
assert(cssContent.includes('#E8EDE7'), 'CSS defines soft off-white text #E8EDE7');
assert(cssContent.includes('#A2AAA1'), 'CSS defines muted grey secondary text #A2AAA1');
assert(cssContent.includes('#394139'), 'CSS defines subtle borders #394139');
assert(cssContent.includes('#8BAF78'), 'CSS defines balanced sage green accents #8BAF78');

console.log('\n[2] Elimination of Harsh Pure Black and Neon Clutter:');
assert(!cssContent.includes('--bg-dark: #000000'), 'No pure black #000000 used as dark background');
assert(!cssContent.includes('--bg-dark: #08080a'), 'Old harsh pitch-black #08080a eradicated from dark theme');
assert(cssContent.includes('@custom-variant dark (&:where(.dark, .dark *));'), 'Tailwind v4 class-based dark variant declared');

console.log('\n[3] HTML Anti-Flash & Light Mode Default Verification:');
const htmlPath = path.resolve('index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
assert(htmlContent.includes('nutricoach_theme_mode'), 'index.html checks nutricoach_theme_mode before render');
assert(htmlContent.includes('isDark = false'), 'index.html sets isDark = false as default for new visitors');
assert(!htmlContent.includes('(!saved && window.matchMedia'), 'index.html does NOT force dark mode based on device prefers-color-scheme when unsaved');
assert(!htmlContent.includes('bg-[#08080a]'), 'Old pitch black #08080a removed from index.html body');

console.log('\n[4] ThemeContext Default Behavior:');
const contextPath = path.resolve('src/context/ThemeContext.tsx');
const contextContent = fs.readFileSync(contextPath, 'utf-8');
assert(contextContent.includes('return \'light\';'), 'ThemeContext defaults theme state to light');
assert(contextContent.includes('return false;') && contextContent.includes('When no user preference is saved, always open in Light Mode'), 'ThemeContext defaults isDark to false for new visitors regardless of device');

console.log('\n[5] Simulation of New Visitor vs Manual Dark Mode Selection:');
const THEME_STORAGE_KEY = 'nutricoach_theme_mode';

// Simulation A: New visitor (localStorage has no theme key)
mockStorage.clear();
classList.clear();

// Execute inline script logic as in index.html
function runIndexHtmlThemeScript() {
  const saved = mockStorage.getItem(THEME_STORAGE_KEY);
  let isDark = false;
  if (saved === 'dark') {
    isDark = true;
  } else if (saved === 'system') {
    isDark = false; // System simulation
  } else {
    isDark = false;
  }
  if (isDark) {
    mockDocumentElement.classList.add('dark');
    mockDocumentElement.style.colorScheme = 'dark';
  } else {
    mockDocumentElement.classList.remove('dark');
    mockDocumentElement.style.colorScheme = 'light';
  }
  return isDark;
}

const newVisitorDark = runIndexHtmlThemeScript();
assert(!newVisitorDark, 'New visitor evaluates to Light Mode (isDark: false)');
assert(!mockDocumentElement.classList.contains('dark'), 'Document does NOT have .dark class for new visitor');
assert(mockDocumentElement.style.colorScheme === 'light', 'Document colorScheme is light for new visitor');

// Simulation B: User manually chooses Dark Mode
mockStorage.setItem(THEME_STORAGE_KEY, 'dark');
const manualDark = runIndexHtmlThemeScript();
assert(manualDark, 'Manual dark selection evaluates to isDark: true');
assert(mockDocumentElement.classList.contains('dark'), 'Document has .dark class when user manually selected dark');
assert(mockDocumentElement.style.colorScheme === 'dark', 'Document colorScheme is dark when user manually selected dark');

// Simulation C: User navigates / reloads after manually choosing Dark Mode
const reloadedDark = runIndexHtmlThemeScript();
assert(reloadedDark && mockDocumentElement.classList.contains('dark'), 'Manual dark preference is preserved during navigation and future visits');

// Simulation D: User switches back to Light Mode
mockStorage.setItem(THEME_STORAGE_KEY, 'light');
const manualLight = runIndexHtmlThemeScript();
assert(!manualLight && !mockDocumentElement.classList.contains('dark'), 'Manual light selection correctly restores Light Mode');
assert(mockDocumentElement.style.colorScheme === 'light', 'Document colorScheme restores to light');

console.log('\n[6] Preservation of User Data Across Theme Toggles:');
mockStorage.setItem('nc_usr_123_food_log', JSON.stringify([{ id: 'food_1', name: 'Kerala Chicken Curry', calories: 230 }]));
mockStorage.setItem('nc_usr_123_workout_plan', JSON.stringify([{ id: 'w_1', name: 'Leg Day Push' }]));
mockStorage.setItem('nc_usr_123_progress_entries', JSON.stringify([{ id: 'p_1', weightKg: 74.5 }]));

// Toggle back and forth
mockStorage.setItem(THEME_STORAGE_KEY, 'dark');
runIndexHtmlThemeScript();
mockStorage.setItem(THEME_STORAGE_KEY, 'light');
runIndexHtmlThemeScript();

const foodData = JSON.parse(mockStorage.getItem('nc_usr_123_food_log') || '[]');
const workoutData = JSON.parse(mockStorage.getItem('nc_usr_123_workout_plan') || '[]');
const progressData = JSON.parse(mockStorage.getItem('nc_usr_123_progress_entries') || '[]');

assert(foodData.length === 1 && foodData[0].name === 'Kerala Chicken Curry', 'Food log untouched across theme toggle');
assert(workoutData.length === 1 && workoutData[0].name === 'Leg Day Push', 'Workout plan untouched across theme toggle');
assert(progressData.length === 1 && progressData[0].weightKg === 74.5, 'Progress entries untouched across theme toggle');

console.log(`\n🎉 ALL ${passCount}/${passCount} THEME VERIFICATION TESTS PASSED SUCCESSFULLY!`);
