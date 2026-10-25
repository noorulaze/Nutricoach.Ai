import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AppNavbar from './components/AppNavbar';
import AppFooter from './components/AppFooter';
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

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-[#ccff00] selection:text-black antialiased relative">
      {/* Show App Navbar only on main application pages */}
      {!isAuthOrOnboardingRoute && <AppNavbar />}

      {/* App Routed Views */}
      <main className="flex-1 w-full">
        <Routes>
          {/* Public Authentication Views */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* First-time Onboarding Flow (Protected, but permits un-onboarded state) */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute allowUnonboarded>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Main Application Views (Unauthenticated visitors are redirected to /login) */}
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
      {!isAuthOrOnboardingRoute && <WorkoutTimer />}

      {/* Footer on app pages */}
      {!isAuthOrOnboardingRoute && <AppFooter />}
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
