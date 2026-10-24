import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import TopBanner from './components/TopBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FreePassModal from './components/FreePassModal';
import WorkoutTimer from './components/WorkoutTimer';

// 8 Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import TrainersPage from './pages/TrainersPage';
import MembershipPage from './pages/MembershipPage';
import FacilitiesPage from './pages/FacilitiesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [isFreePassOpen, setIsFreePassOpen] = useState(false);

  const handleOpenFreePass = () => {
    setIsFreePassOpen(true);
  };

  const handleCloseFreePass = () => {
    setIsFreePassOpen(false);
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col font-sans selection:bg-[#ccff00] selection:text-black antialiased relative">
          {/* Top Promotional Announcement Banner */}
          <TopBanner />

          {/* Sticky Header Navbar */}
          <Navbar onOpenFreePass={handleOpenFreePass} />

          {/* Main Routing Views */}
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="/about" element={<AboutPage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="/programs" element={<ProgramsPage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/membership" element={<MembershipPage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="/facilities" element={<FacilitiesPage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="/testimonials" element={<TestimonialsPage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="/contact" element={<ContactPage onOpenFreePass={handleOpenFreePass} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Member Workout Stopwatch & Tabata Timer */}
          <WorkoutTimer />

          {/* Comprehensive Footer */}
          <Footer onOpenFreePass={handleOpenFreePass} />

          {/* Universal 1-Day VIP Pass Modal */}
          <FreePassModal isOpen={isFreePassOpen} onClose={handleCloseFreePass} />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
