import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Dumbbell } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="bg-[#060608] border-t border-zinc-800 text-zinc-500 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#ccff00] flex items-center justify-center text-black font-black text-xs">
              ⚡
            </div>
            <div>
              <span className="font-heading font-black text-white text-base tracking-wide">
                NUTRICOACH <span className="text-[#ccff00]">AI</span>
              </span>
              <span className="block text-[10px] text-zinc-500">
                Personal Evidence-Based Nutrition & Fitness Tracking
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
            <span>•</span>
            <Link to="/food" className="hover:text-white transition-colors">Food Tracker</Link>
            <span>•</span>
            <Link to="/workouts" className="hover:text-white transition-colors">Workout Planner</Link>
            <span>•</span>
            <Link to="/exercises" className="hover:text-white transition-colors">Exercise Library</Link>
            <span>•</span>
            <Link to="/coach" className="hover:text-white transition-colors">AI Coach</Link>
            <span>•</span>
            <Link to="/progress" className="hover:text-white transition-colors">Progress</Link>
            <span>•</span>
            <Link to="/profile" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
            <span>
              100% Client-Side Privacy: All personal foods, workouts, and biometrics are securely stored on your device.
            </span>
          </div>

          <div>
            NutriCoach AI • Built for individual performance, strength & longevity.
          </div>
        </div>
      </div>
    </footer>
  );
}
