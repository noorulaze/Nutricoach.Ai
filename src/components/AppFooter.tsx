import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="bg-transparent border-t border-[#e8ede6] text-[#5e6f5e] text-xs pt-8 pb-24 lg:pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#e8ede6]">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5ba83c] flex items-center justify-center text-white shadow-xs">
              <svg 
                className="w-4 h-4 fill-current" 
                viewBox="0 0 24 24"
              >
                <path d="M21 3c-6.627 0-12 5.373-12 12 0 1.258.196 2.47.558 3.606L3 21l2.394-6.558C4.196 13.31 4 12.098 4 11 4 4.373 9.373-1 16-1c2.146 0 4.148.566 5.88 1.558L21 3z" />
              </svg>
            </div>
            <div>
              <span className="font-heading font-extrabold text-[#192418] text-sm tracking-tight">
                NutriCoach <span className="text-[#5ba83c]">AI</span>
              </span>
              <span className="block text-[11px] text-[#7a8c79]">
                Better Food. Healthier You.
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#5e6f5e]">
            <Link to="/" className="hover:text-[#192418] transition-colors">Dashboard</Link>
            <span>•</span>
            <Link to="/food" className="hover:text-[#192418] transition-colors">Food Tracker</Link>
            <span>•</span>
            <Link to="/workouts" className="hover:text-[#192418] transition-colors">Workouts</Link>
            <span>•</span>
            <Link to="/exercises" className="hover:text-[#192418] transition-colors">Exercises</Link>
            <span>•</span>
            <Link to="/coach" className="hover:text-[#192418] transition-colors">AI Coach</Link>
            <span>•</span>
            <Link to="/progress" className="hover:text-[#192418] transition-colors">Progress</Link>
            <span>•</span>
            <Link to="/profile" className="hover:text-[#192418] transition-colors">Settings</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7a8c79]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5ba83c]" />
            <span>
              100% Client-Side Privacy: All personal foods, workouts, and biometrics are securely stored on your device.
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted for health & longevity</span>
            <Heart className="w-3 h-3 text-[#5ba83c] fill-[#5ba83c]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
