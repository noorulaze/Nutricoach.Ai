import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';
import NutriCoachLogo from './NutriCoachLogo';

export default function AppFooter() {
  return (
    <footer className="bg-transparent border-t border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] text-xs pt-8 pb-24 lg:pb-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#e8ede6] dark:border-[#394139]">
          {/* Logo & Subtitle */}
          <div>
            <NutriCoachLogo size="sm" showTagline to="/" />
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#5e6f5e] dark:text-[#A2AAA1]">
            <Link to="/" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">Dashboard</Link>
            <span>•</span>
            <Link to="/food" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">Food Tracker</Link>
            <span>•</span>
            <Link to="/workouts" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">Workouts</Link>
            <span>•</span>
            <Link to="/exercises" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">Exercises</Link>
            <span>•</span>
            <Link to="/coach" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">AI Coach</Link>
            <span>•</span>
            <Link to="/progress" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">Progress</Link>
            <span>•</span>
            <Link to="/profile" className="hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-colors">Settings</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78]" />
            <span>
              100% Client-Side Privacy: All personal foods, workouts, and biometrics are securely stored on your device.
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted for health & longevity</span>
            <Heart className="w-3 h-3 text-[#5ba83c] dark:text-[#8BAF78] fill-[#5ba83c] dark:fill-[#8BAF78]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
