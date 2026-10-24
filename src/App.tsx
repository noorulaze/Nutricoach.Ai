import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import AppNavbar from './components/AppNavbar';
import AppFooter from './components/AppFooter';
import WorkoutTimer from './components/WorkoutTimer';

// NutriCoach AI Pages
import DashboardPage from './pages/DashboardPage';
import FoodTrackerPage from './pages/FoodTrackerPage';
import WorkoutPlannerPage from './pages/WorkoutPlannerPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import AICoachPage from './pages/AICoachPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col font-sans selection:bg-[#ccff00] selection:text-black antialiased relative">
          {/* Main App Navigation Bar */}
          <AppNavbar />

          {/* App Routed Views */}
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/food" element={<FoodTrackerPage />} />
              <Route path="/workouts" element={<WorkoutPlannerPage />} />
              <Route path="/exercises" element={<ExerciseLibraryPage />} />
              <Route path="/coach" element={<AICoachPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Personal Training Stopwatch & Tabata Timer */}
          <WorkoutTimer />

          {/* App Footer */}
          <AppFooter />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
