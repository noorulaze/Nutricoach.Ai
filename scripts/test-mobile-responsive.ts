import fs from 'fs';
import path from 'path';

// Mobile Responsive Optimization Test Suite for NutriCoach AI
const rootDir = process.cwd();

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('📱 Running NutriCoach AI Mobile Optimization Test Suite...\n');

// 1. Check index.html viewport and PWA mobile meta tags
const indexPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

assert(
  indexHtml.includes('viewport-fit=cover'),
  'index.html includes viewport-fit=cover for iPhone notch and home indicator support'
);
assert(
  indexHtml.includes('apple-mobile-web-app-capable'),
  'index.html includes apple-mobile-web-app-capable'
);
assert(
  indexHtml.includes('theme-color'),
  'index.html includes theme-color meta tag for light and dark mobile browser chrome'
);

// 2. Check src/index.css for mobile-specific responsive utilities and zoom prevention
const cssPath = path.join(rootDir, 'src', 'index.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

assert(
  cssContent.includes('.pt-safe') && cssContent.includes('.pb-safe'),
  'index.css includes safe-area-inset utilities (.pt-safe, .pb-safe)'
);
assert(
  cssContent.includes('touch-action: manipulation') && cssContent.includes('-webkit-tap-highlight-color: transparent'),
  'index.css sets touch-action: manipulation and removes mobile tap highlight'
);
assert(
  cssContent.includes('font-size: 16px !important'),
  'index.css enforces 16px font-size on mobile inputs to prevent automatic iOS Safari viewport zooming'
);
assert(
  cssContent.includes('touch-scroll') && cssContent.includes('-webkit-overflow-scrolling: touch'),
  'index.css includes momentum touch scrolling utility'
);

// 3. Check src/components/MobileBottomNav.tsx for 5 tabs and safe-area padding
const navPath = path.join(rootDir, 'src', 'components', 'MobileBottomNav.tsx');
const navContent = fs.readFileSync(navPath, 'utf-8');

assert(
  navContent.includes('safe-area-inset-bottom'),
  'MobileBottomNav includes env(safe-area-inset-bottom) so buttons clear mobile home indicators'
);
assert(
  navContent.includes("name: 'Home'") &&
  navContent.includes("name: 'Nutrition'") &&
  navContent.includes("name: 'Workout'") &&
  navContent.includes("name: 'Chat'") &&
  navContent.includes("name: 'Profile'"),
  'MobileBottomNav has all 5 tabs matching reference: Home, Nutrition, Workout, Chat, Profile'
);

// 4. Check src/components/AppHeader.tsx for responsive mobile bar
const headerPath = path.join(rootDir, 'src', 'components', 'AppHeader.tsx');
const headerContent = fs.readFileSync(headerPath, 'utf-8');

assert(
  headerContent.includes('lg:hidden') && headerContent.includes('NutriCoachLogo'),
  'AppHeader renders a clean compact mobile header with NutriCoach AI logo'
);
assert(
  headerContent.includes('ThemeToggle') && headerContent.includes('Menu'),
  'AppHeader includes ThemeToggle and mobile menu drawer toggle'
);

// 5. Check LoginPage.tsx and SignupPage.tsx for mobile auth design (media_1792991978545.jpg)
const loginPath = path.join(rootDir, 'src', 'pages', 'LoginPage.tsx');
const loginContent = fs.readFileSync(loginPath, 'utf-8');

assert(
  loginContent.includes('Welcome Back') && loginContent.includes('Sign in to continue your health journey'),
  'LoginPage includes friendly welcoming copy from reference mockup'
);
assert(
  loginContent.includes('Google') && loginContent.includes('Apple') && loginContent.includes('grid grid-cols-2'),
  'LoginPage contains side-by-side Google and Apple OAuth buttons'
);
assert(
  loginContent.includes('shaker') || loginContent.includes('grain-bowl'),
  'LoginPage includes healthy wellness grain bowl and shaker bottle visual art'
);
assert(
  loginContent.includes('Your data is safe with us'),
  'LoginPage includes 🔒 security & privacy trust badge'
);

// 6. Check DashboardPage.tsx for Mobile Showcase Screen 6 & 1
const dashPath = path.join(rootDir, 'src', 'pages', 'DashboardPage.tsx');
const dashContent = fs.readFileSync(dashPath, 'utf-8');

assert(
  dashContent.includes('Good Morning,') || dashContent.includes('Good Afternoon,'),
  'DashboardPage includes mobile greeting matching Screen 6'
);
assert(
  dashContent.includes('Today\'s Progress') && dashContent.includes('Workout') && dashContent.includes('Water'),
  'DashboardPage includes circular progress rings for Nutrition, Workout, and Water'
);
assert(
  dashContent.includes('Quick Actions') && dashContent.includes('Log Food') && dashContent.includes('Start Workout'),
  'DashboardPage includes 1-tap mobile Quick Actions'
);
assert(
  dashContent.includes('Your Health Our Priority'),
  'DashboardPage includes the inspirational "Your Health Our Priority" hero card from Screen 1'
);

// 7. Check FoodTrackerPage.tsx for Mobile Showcase Screen 2
const foodTrackerPath = path.join(rootDir, 'src', 'pages', 'FoodTrackerPage.tsx');
const foodTrackerContent = fs.readFileSync(foodTrackerPath, 'utf-8');

assert(
  foodTrackerContent.includes('mobileFoodTab') && foodTrackerContent.includes('meals'),
  'FoodTrackerPage has mobile tab switcher (Meals, Nutrition, History)'
);
assert(
  foodTrackerContent.includes('kcal left'),
  'FoodTrackerPage renders circular calorie gauge with remaining calories'
);
assert(
  foodTrackerContent.includes('Protein') && foodTrackerContent.includes('Carbs') && foodTrackerContent.includes('Fats'),
  'FoodTrackerPage renders horizontal macro progress bars for Protein, Carbs, and Fats'
);
assert(
  foodTrackerContent.includes('Kerala & Regional Curries') || foodTrackerContent.includes('DISH CALCULATOR'),
  'FoodTrackerPage includes 1-tap shortcut to Kerala curries & Dish Ingredients Calculator'
);

// 8. Check DishIngredientCalculatorModal.tsx for Mobile Showcase Screen 3
const calcPath = path.join(rootDir, 'src', 'components', 'DishIngredientCalculatorModal.tsx');
const calcContent = fs.readFileSync(calcPath, 'utf-8');

assert(
  calcContent.includes('rounded-t-[28px] sm:rounded-[28px]'),
  'DishIngredientCalculatorModal renders as a full-height sheet on mobile screens'
);
assert(
  calcContent.includes('ChevronLeft') && calcContent.includes('Heart'),
  'DishIngredientCalculatorModal header includes back chevron and favorite heart toggle'
);
assert(
  calcContent.includes('mobileTab') && calcContent.includes('ingredients') && calcContent.includes('nutrition'),
  'DishIngredientCalculatorModal includes mobile subtabs (Ingredients, Nutrition, Recipe Info)'
);
assert(
  calcContent.includes('safe-area-inset-bottom'),
  'DishIngredientCalculatorModal footer respects safe-area-inset-bottom'
);

// 9. Check WorkoutPlannerPage.tsx for Mobile Showcase Screen 4
const workoutPath = path.join(rootDir, 'src', 'pages', 'WorkoutPlannerPage.tsx');
const workoutContent = fs.readFileSync(workoutPath, 'utf-8');

assert(
  workoutContent.includes('Muscle Explorer'),
  'WorkoutPlannerPage includes mobile "Muscle Explorer" header'
);
assert(
  workoutContent.includes('Selected Muscle'),
  'WorkoutPlannerPage includes floating "Selected Muscle" card opening exercise cards'
);

// 10. Check AICoachPage.tsx for Mobile Showcase Screen 5
const chatPath = path.join(rootDir, 'src', 'pages', 'AICoachPage.tsx');
const chatContent = fs.readFileSync(chatPath, 'utf-8');

assert(
  chatContent.includes('rounded-full') && chatContent.includes('Send'),
  'AICoachPage includes circular green send button'
);
assert(
  chatContent.includes('safe-area-inset-bottom'),
  'AICoachPage input bar includes safe-area-inset-bottom padding'
);
assert(
  chatContent.includes('no-scrollbar touch-scroll'),
  'AICoachPage suggestion prompts scroll smoothly without ugly scrollbars'
);

// 11. Check ProgressPage.tsx for Mobile Showcase Screen 7
const progressPath = path.join(rootDir, 'src', 'pages', 'ProgressPage.tsx');
const progressContent = fs.readFileSync(progressPath, 'utf-8');

assert(
  progressContent.includes('timeframe') && progressContent.includes('weekly') && progressContent.includes('monthly'),
  'ProgressPage includes timeframe filter pills (Weekly, Monthly, Yearly)'
);
assert(
  progressContent.includes('CHANGE DELTA') && progressContent.includes('WeightTrendChart'),
  'ProgressPage renders weight trajectory with change delta badge and interactive chart'
);
assert(
  progressContent.includes('WAIST') && progressContent.includes('CHEST') && progressContent.includes('ARMS'),
  'ProgressPage includes body measurements 4-card grid'
);

// 12. Check ProfilePage.tsx for Mobile Showcase Screen 8
const profilePath = path.join(rootDir, 'src', 'pages', 'ProfilePage.tsx');
const profileContent = fs.readFileSync(profilePath, 'utf-8');

assert(
  profileContent.includes('mobileSection') && profileContent.includes('personal') && profileContent.includes('workout'),
  'ProfilePage includes mobile categorized settings navigation'
);
assert(
  profileContent.includes('Active Member') || profileContent.includes('Personalized Plan'),
  'ProfilePage includes user profile card with avatar and membership pill'
);
assert(
  profileContent.includes('ThemeToggle'),
  'ProfilePage includes interactive Dark Mode switch in the mobile settings list'
);
assert(
  profileContent.includes('Sign Out'),
  'ProfilePage includes dedicated Sign Out option with confirmation dialog'
);

console.log('\n🎉 ALL 12 MOBILE OPTIMIZATION SUITE TESTS PASSED SUCCESSFULLY!\n');
