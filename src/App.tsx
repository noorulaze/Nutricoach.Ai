import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
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
  const location = useLocation();
  const isAuthOrOnboardingRoute = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/onboarding';

  if (isAuthOrOnboardingRoute) {
    return (
      <main className="min-h-screen bg-[#f6f8f5] text-[#192418] flex flex-col font-sans antialiased">
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-[#192418] flex font-sans antialiased selection:bg-[#5ba83c]/20 selection:text-[#192418]">
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
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
