import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Dumbbell, BookOpen, 
  Sparkles, LineChart, Settings, Menu, X, Flame 
} from 'lucide-react';
import { getProfile, getFoodLog } from '../utils/storage';

export default function AppNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const profile = getProfile();
  const todayFoods = getFoodLog();
  const consumedCalories = todayFoods.reduce((acc, f) => acc + f.calories, 0);
  const remainingCalories = Math.round(profile.calorieTarget - consumedCalories);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Food Tracker', path: '/food', icon: Utensils },
    { name: 'Workout Planner', path: '/workouts', icon: Dumbbell },
    { name: 'Exercise Library', path: '/exercises', icon: BookOpen },
    { name: 'AI Coach', path: '/coach', icon: Sparkles, badge: 'AI' },
    { name: 'Progress', path: '/progress', icon: LineChart },
    { name: 'Profile & Goals', path: '/profile', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ccff00] to-[#99cc00] flex items-center justify-center text-black shadow-[0_0_15px_rgba(204,255,0,0.4)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-wider text-white">
                  NUTRI<span className="text-[#ccff00]">COACH</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#ccff00]/15 text-[#ccff00] px-1.5 py-0.5 rounded border border-[#ccff00]/30">
                  AI
                </span>
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 block -mt-0.5">
                PERSONAL FITNESS COMPANION
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 ${
                      isActive
                        ? 'text-black bg-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1 rounded bg-black/30 font-bold ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Header Widget & Mobile Trigger */}
          <div className="flex items-center gap-3">
            {/* Today's Remaining Calorie Mini Indicator */}
            <Link
              to="/food"
              className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-[#ccff00]/40 rounded-xl px-3 py-1.5 transition-colors group"
              title="Click to view today's food log"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <div className="text-right">
                <span className="text-[9px] text-zinc-400 uppercase font-mono block leading-none">
                  CALORIES LEFT
                </span>
                <span className="text-xs font-mono font-bold text-[#ccff00] leading-tight">
                  {remainingCalories > 0 ? `${remainingCalories} kcal` : 'Goal Hit!'}
                </span>
              </div>
            </Link>

            {/* User Profile Mini Pill */}
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center text-[11px] font-black text-[#ccff00]">
                {profile.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-zinc-200 max-w-[100px] truncate">
                {profile.name}
              </span>
            </Link>

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ccff00]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#09090d]/98 border-b border-zinc-800 px-4 py-5 shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                      : 'text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 px-2">
            <div>
              <span className="text-zinc-500 block text-[10px]">CURRENT GOAL</span>
              <span className="text-white font-bold">{profile.goal.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block text-[10px]">DAILY TARGET</span>
              <span className="text-[#ccff00] font-mono font-bold">{profile.calorieTarget} kcal</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
