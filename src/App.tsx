import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AppSidebar from './components/AppSidebar';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import MobileBottomNav from './components/MobileBottomNav';
import WorkoutTimer from './components/WorkoutTimer';

// NutriCoach AI Authentication & Onboarding Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';

// NutriCoach AI Main Application Pages
import DashboardPage from './pages/DashboardPage';
import FoodTrackerPage from './pages/FoodTrackerPage';
import WorkoutPlannerPage from './pages/WorkoutPlannerPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import AICoachPage from './pages/AICoachPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';

function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isAuthOrOnboardingRoute = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/onboarding';

  // While initializing authentication session from storage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8f5] dark:bg-[#1C211D] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] text-xl font-bold animate-pulse shadow-xs">
          🌱
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#5e6f5e] dark:text-[#A2AAA1]">
          <div className="w-2 h-2 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78] animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78] animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78] animate-bounce [animation-delay:0.4s]" />
          <span className="ml-1 text-[#192418] dark:text-[#E8EDE7] font-medium">Verifying session...</span>
        </div>
      </div>
    );
  }

  // When logged out or on public auth routes, completely prevent protected UI mounting
  if (!isAuthenticated || !user || isAuthOrOnboardingRoute) {
    return (
      <main className="min-h-screen bg-[#f6f8f5] dark:bg-[#1C211D] text-[#192418] dark:text-[#E8EDE7] flex flex-col font-sans antialiased">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute allowUnonboarded>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          {/* Any protected path accessed while logged out redirects directly to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5] dark:bg-[#1C211D] text-[#192418] dark:text-[#E8EDE7] flex font-sans antialiased selection:bg-[#8BAF78]/25 selection:text-[#192418] dark:selection:text-[#E8EDE7]">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <AppHeader />

        {/* App Routed Content */}
        <main className="flex-1 w-full pb-16 lg:pb-6">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/food" 
              element={
                <ProtectedRoute>
                  <FoodTrackerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/workouts" 
              element={
                <ProtectedRoute>
                  <WorkoutPlannerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exercises" 
              element={
                <ProtectedRoute>
                  <ExerciseLibraryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coach" 
              element={
                <ProtectedRoute>
                  <AICoachPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Floating Personal Training Timer on app pages */}
        <WorkoutTimer />

        {/* Footer */}
        <AppFooter />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
