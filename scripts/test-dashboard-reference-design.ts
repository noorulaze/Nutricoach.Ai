import fs from 'fs';
import path from 'path';

console.log('🌱 RUNNING NUTRICOACH AI DASHBOARD REFERENCE DESIGN TEST SUITE...\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Inspect AppHeader.tsx
const appHeaderPath = path.resolve('src/components/AppHeader.tsx');
const appHeaderContent = fs.readFileSync(appHeaderPath, 'utf-8');

console.log('[1] Header Bar & Duplicate Top Navigation Fix:');
assert(!appHeaderContent.includes('topNavItems.map'), 'Duplicate horizontal navigation removed from AppHeader');
assert(!appHeaderContent.includes('Center Desktop Navigation'), 'No duplicate center navigation block in AppHeader');
assert(appHeaderContent.includes('Hello, {firstName}!'), 'Personalized greeting header preserved');
assert(appHeaderContent.includes('global-search-input'), 'Global search input with ⌘K shortcut preserved');
assert(appHeaderContent.includes('ThemeToggle'), 'Theme toggle mode switch preserved in header');
assert(appHeaderContent.includes('Bell'), 'Notification bell with alert indicator preserved');
assert(appHeaderContent.includes('profileDropdownOpen'), 'Profile avatar and interactive dropdown menu preserved');

// 2. Inspect AppSidebar.tsx
const sidebarPath = path.resolve('src/components/AppSidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

console.log('\n[2] Desktop Sidebar Navigation & Branding:');
assert(sidebarContent.includes('NutriCoachLogo'), 'Official NutriCoach AI logo with folded-leaf symbol');
assert(sidebarContent.includes("name: 'Dashboard'"), 'Dashboard navigation route preserved');
assert(sidebarContent.includes("name: 'Food Tracker'"), 'Food Tracker route preserved');
assert(sidebarContent.includes("name: 'AI Meal Planner'"), 'AI Meal Planner route preserved in sidebar');
assert(sidebarContent.includes("name: 'Workouts'"), 'Workouts route preserved');
assert(sidebarContent.includes("name: 'Exercises'"), 'Exercises route preserved');
assert(sidebarContent.includes("name: 'AI Coach'"), 'AI Coach route preserved');
assert(sidebarContent.includes("name: 'Progress'"), 'Progress route preserved');
assert(sidebarContent.includes("name: 'Profile'"), 'Profile route preserved');
assert(sidebarContent.includes("name: 'Settings'"), 'Settings route preserved');
assert(sidebarContent.includes('Small steps'), 'Sidebar sprout motivation card: "Small steps give big results."');
assert(sidebarContent.includes('stay healthy!'), 'Sidebar sprout subtitle: "Stay consistent, stay healthy!"');

// 3. Inspect DashboardPage.tsx
const dashboardPath = path.resolve('src/pages/DashboardPage.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');

console.log('\n[3] Top Controls Row (Date, Daily Goal, + Log Food):');
assert(dashboardContent.includes('todayFormatted'), 'Date badge rendered (Today, MMM d, yyyy)');
assert(dashboardContent.includes('Daily Goal'), 'Daily Goal pill rendered');
assert(dashboardContent.includes('targetCalories.toLocaleString()'), 'Target calories dynamically formatted');
assert(dashboardContent.includes('+ Log Food') || dashboardContent.includes('Log Food'), '+ Log Food action button present');
assert(dashboardContent.includes('to="/food"'), 'Log Food button routes directly to /food');

console.log('\n[4] Row 1: Daily Wellness Tip & Calories Donut Card:');
assert(dashboardContent.includes('Daily Wellness Tip'), 'Daily Wellness Tip badge present');
assert(dashboardContent.includes('Eat more whole foods,'), 'Reference headline: "Eat more whole foods, less processed foods."');
assert(dashboardContent.includes('Whole foods give you more nutrients'), 'Reference description present');
assert(dashboardContent.includes('Learn More'), 'Learn More action button with whole foods modal');
assert(dashboardContent.includes('grainBowlImg'), 'Circular hero photography rendered for grain bowl');
assert(dashboardContent.includes('Calories'), 'Calories title present');
assert(dashboardContent.includes('displayCalories.toLocaleString()'), 'Dynamic calorie intake calculation');
assert(dashboardContent.includes('Remaining'), 'Remaining calories displayed');
assert(dashboardContent.includes('Food'), 'Food calories dot legend present');
assert(dashboardContent.includes('Exercise'), 'Exercise calories dot legend present');

console.log('\n[5] Row 2: Daily Activity, Macronutrients & Hydration:');
assert(dashboardContent.includes('Daily Activity'), 'Daily Activity card title present');
assert(dashboardContent.includes('Last 7 days'), 'Timeframe selector dropdown present');
assert(dashboardContent.includes('polyline'), 'Activity SVG trend line chart present');
assert(dashboardContent.includes('6,842'), 'Steps counter present');
assert(dashboardContent.includes('32 min'), 'Active Minutes counter present');
assert(dashboardContent.includes('Macronutrients'), 'Macronutrients card title present');
assert(dashboardContent.includes('Protein'), 'Protein macronutrient row present');
assert(dashboardContent.includes('Carbs'), 'Carbs macronutrient row present');
assert(dashboardContent.includes('Fats'), 'Fats macronutrient row present');
assert(dashboardContent.includes('Fiber'), 'Fiber macronutrient row present');
assert(dashboardContent.includes('Hydration'), 'Hydration card title present');
assert(dashboardContent.includes('waterGlasses'), 'Interactive hydration glass count');
assert(dashboardContent.includes("You're doing great!"), 'Hydration motivation text present');
assert(dashboardContent.includes('Log Water'), '+ Log Water interactive button present');

console.log('\n[6] Row 3: Today\'s Meals & AI Coach Stack:');
assert(dashboardContent.includes("Today's Meals"), "Today's Meals section title present");
assert(dashboardContent.includes("Breakfast"), 'Breakfast meal card present');
assert(dashboardContent.includes("Lunch"), 'Lunch meal card present');
assert(dashboardContent.includes("Dinner"), 'Dinner meal card present');
assert(dashboardContent.includes("Snacks"), 'Snacks meal card present');
assert(dashboardContent.includes("mealCards.map"), 'Meal cards mapped cleanly with real data fallback');
assert(dashboardContent.includes('AIRobotAvatar'), 'Friendly AI Robot mascot avatar rendered');
assert(dashboardContent.includes('AI Nutrition Coach'), 'AI Nutrition Coach card title present');
assert(dashboardContent.includes('Ask AI Coach'), 'Ask AI Coach action button present');
assert(dashboardContent.includes('Healthy food builds a healthy mind.'), 'Motivational quote card present');
assert(dashboardContent.includes('LeavesIllustration'), 'Flowing green leaves illustration rendered in quote card');

console.log('\n[7] Theme & Responsive Support:');
assert(dashboardContent.includes('dark:bg-[#272E29]'), 'Dark mode card background classes present');
assert(dashboardContent.includes('dark:border-[#394139]'), 'Dark mode border classes present');
assert(dashboardContent.includes('dark:text-[#E8EDE7]'), 'Dark mode text contrast classes present');
assert(dashboardContent.includes('lg:hidden'), 'Optimized mobile view layout preserved');
assert(dashboardContent.includes('hidden lg:block'), 'Full 12-column desktop layout preserved');

console.log('\n================================================================');
if (failCount === 0) {
  console.log(`🎉 ALL ${passCount} DASHBOARD REFERENCE DESIGN ASSERTIONS PASSED!`);
} else {
  console.error(`💥 ${failCount} ASSERTIONS FAILED!`);
  process.exit(1);
}
console.log('================================================================\n');
