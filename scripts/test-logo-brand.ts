import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- Testing NutriCoach AI Official Logo & Brand Identity Integration ---\n');

// 1. Check favicon.svg
const faviconPath = path.resolve('public/favicon.svg');
assert(fs.existsSync(faviconPath), 'public/favicon.svg exists');
const faviconContent = fs.readFileSync(faviconPath, 'utf-8');
assert(faviconContent.includes('viewBox="0 0 100 100"'), 'favicon.svg has 100x100 square viewBox');
assert(faviconContent.includes('nc-stem') && faviconContent.includes('nc-leaf'), 'favicon.svg contains geometric N paths (nc-stem & nc-leaf)');
assert(faviconContent.includes('prefers-color-scheme: dark'), 'favicon.svg supports Dark Mode automatic theme adaptation');

// 2. Check index.html
const indexHtmlPath = path.resolve('index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
assert(indexHtmlContent.includes('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'), 'index.html links directly to /favicon.svg');

// 3. Check public/icons.svg
const iconsSvgPath = path.resolve('public/icons.svg');
const iconsSvgContent = fs.readFileSync(iconsSvgPath, 'utf-8');
assert(iconsSvgContent.includes('id="nutricoach-symbol"'), 'public/icons.svg defines nutricoach-symbol');

// 4. Check NutriCoachLogo.tsx
const logoComponentPath = path.resolve('src/components/NutriCoachLogo.tsx');
assert(fs.existsSync(logoComponentPath), 'NutriCoachLogo.tsx exists');
const logoComponentContent = fs.readFileSync(logoComponentPath, 'utf-8');
assert(logoComponentContent.includes('export function NutriCoachSymbol'), 'NutriCoachLogo.tsx exports NutriCoachSymbol');
assert(logoComponentContent.includes('export default function NutriCoachLogo'), 'NutriCoachLogo.tsx exports NutriCoachLogo');
assert(logoComponentContent.includes('#162D1E') && logoComponentContent.includes('#789C6A'), 'NutriCoachLogo includes official forest and sage green brand colors');
assert(logoComponentContent.includes('#DFECE0') && logoComponentContent.includes('#8EAF7F'), 'NutriCoachLogo includes official Dark Mode luminous palette');

// 5. Check AppSidebar.tsx
const sidebarPath = path.resolve('src/components/AppSidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
assert(sidebarContent.includes('<NutriCoachLogo'), 'AppSidebar uses NutriCoachLogo component');
assert(!sidebarContent.includes('M21 3c-6.627'), 'AppSidebar no longer contains the old generic leaf icon');

// 6. Check AuthWellnessBanner.tsx
const bannerPath = path.resolve('src/components/AuthWellnessBanner.tsx');
const bannerContent = fs.readFileSync(bannerPath, 'utf-8');
assert(bannerContent.includes('<NutriCoachLogo size="lg" showTagline />'), 'AuthWellnessBanner uses NutriCoachLogo with tagline');
assert(!bannerContent.includes('M21 3c-6.627'), 'AuthWellnessBanner no longer contains the old generic leaf icon');

// 7. Check LoginPage.tsx
const loginPagePath = path.resolve('src/pages/LoginPage.tsx');
const loginPageContent = fs.readFileSync(loginPagePath, 'utf-8');
assert(loginPageContent.includes('<NutriCoachLogo size="md" className="mb-3" />'), 'LoginPage uses NutriCoachLogo');
assert(!loginPageContent.includes('M21 3c-6.627'), 'LoginPage no longer contains the old generic leaf icon');

// 8. Check SignupPage.tsx
const signupPagePath = path.resolve('src/pages/SignupPage.tsx');
const signupPageContent = fs.readFileSync(signupPagePath, 'utf-8');
assert(signupPageContent.includes('<NutriCoachLogo size="md" className="mb-2" />'), 'SignupPage uses NutriCoachLogo');
assert(!signupPageContent.includes('M21 3c-6.627'), 'SignupPage no longer contains the old generic leaf icon');

// 9. Check OnboardingPage.tsx
const onboardingPagePath = path.resolve('src/pages/OnboardingPage.tsx');
const onboardingPageContent = fs.readFileSync(onboardingPagePath, 'utf-8');
assert(onboardingPageContent.includes('<NutriCoachLogo size="md" />'), 'OnboardingPage uses NutriCoachLogo');
assert(!onboardingPageContent.includes('M21 3c-6.627'), 'OnboardingPage no longer contains the old generic leaf icon');

// 10. Check AppFooter.tsx
const footerPath = path.resolve('src/components/AppFooter.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf-8');
assert(footerContent.includes('<NutriCoachLogo size="sm" showTagline to="/" />'), 'AppFooter uses NutriCoachLogo');
assert(!footerContent.includes('M21 3c-6.627'), 'AppFooter no longer contains the old generic leaf icon');

// 11. Check DashboardPage.tsx
const dashboardPath = path.resolve('src/pages/DashboardPage.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
assert(dashboardContent.includes('<NutriCoachSymbol className="w-32 h-32" />'), 'DashboardPage uses NutriCoachSymbol watermark');
assert(!dashboardContent.includes('M21 3c-6.627'), 'DashboardPage no longer contains the old generic leaf icon');

// 12. Check AICoachPage.tsx
const coachPath = path.resolve('src/pages/AICoachPage.tsx');
const coachContent = fs.readFileSync(coachPath, 'utf-8');
assert(coachContent.includes('<NutriCoachSymbol className="w-4 h-4" />'), 'AICoachPage uses NutriCoachSymbol for bot avatar');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BRAND IDENTITY & LOGO INTEGRATION TESTS PASSED!');
}
