import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Dumbbell, BookOpen, 
  Sparkles, LineChart, Settings, Flame, Menu, X, 
  User, LogOut 
} from 'lucide-react';
import { getProfile, getFoodLog } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import NutriCoachLogo from './NutriCoachLogo';

export default function AppNavbar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const profile = getProfile();
  const todayFoods = getFoodLog();
  const consumedCalories = todayFoods.reduce((acc, f) => acc + f.calories, 0);
  const remainingCalories = Math.round(profile.calorieTarget - consumedCalories);

  const displayName = user?.name || profile.name;

  const handleLogout = () => {
    logout();
    showToast('You have been signed out safely.', 'info', 'Signed Out');
    navigate('/login', { replace: true });
  };

  const primaryNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Food Tracker', path: '/food', icon: Utensils },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Exercises', path: '/exercises', icon: BookOpen },
    { name: 'AI Coach', path: '/coach', icon: Sparkles, badge: 'AI' },
    { name: 'Progress', path: '/progress', icon: LineChart },
  ];

  // Mobile Bottom Navigation items (5 key pillars)
  const mobileBottomItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Food', path: '/food', icon: Utensils },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Coach', path: '/coach', icon: Sparkles },
    { name: 'Progress', path: '/progress', icon: LineChart },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/[0.07] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <NutriCoachLogo to="/" size="md" theme="dark" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#12141c]/80 p-1 rounded-2xl border border-white/[0.06]">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 ${
                        isActive
                          ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-black font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Widget: Calorie Chip & Profile & Sign Out */}
            <div className="flex items-center gap-2.5">
              {/* Daily Calorie Summary Mini Chip */}
              <Link
                to="/food"
                className="flex items-center gap-2.5 bg-[#12141c] hover:bg-[#181b24] border border-white/[0.08] hover:border-[#ccff00]/40 rounded-xl px-3 py-1.5 transition-all group"
                title="View today's food log"
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-zinc-400 font-mono leading-none uppercase">
                    {remainingCalories >= 0 ? 'CALORIES LEFT' : 'OVER TARGET'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ccff00] leading-tight">
                    {Math.abs(remainingCalories)} kcal
                  </span>
                </div>
              </Link>

              {/* Profile & Settings Button */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                      : 'bg-[#12141c] hover:bg-[#181b24] text-zinc-300 border-white/[0.08]'
                  }`
                }
                title="Profile & Settings"
              >
                <div className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center text-xs font-bold">
                  {displayName.charAt(0)}
                </div>
                <span className="text-xs font-semibold hidden md:inline max-w-[90px] truncate">
                  {displayName.split(' ')[0]}
                </span>
                <Settings className="w-3.5 h-3.5 opacity-60" />
              </NavLink>

              {/* Sign Out Button (Desktop) */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-zinc-400 hover:text-red-400 hover:bg-[#181b24] rounded-xl border border-white/[0.08] text-xs font-semibold transition-colors"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Sign Out</span>
              </button>

              {/* Mobile Drawer Toggle (Tablet/Mobile) */}
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-xl bg-[#12141c] border border-white/[0.08] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileDrawerOpen ? <X className="w-5 h-5 text-[#ccff00]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden bg-[#0d0f15]/98 border-b border-white/[0.08] px-4 py-4 shadow-2xl animate-fade-in space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#ccff00] text-black font-bold shadow'
                        : 'bg-[#141720] text-zinc-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center text-xs text-zinc-400 px-1">
              <span>Goal: <strong className="text-white uppercase">{profile.goal.replace('_', ' ')}</strong></span>
              <span className="text-[#ccff00] font-mono font-bold">{profile.calorieTarget} kcal/day</span>
            </div>

            {/* Mobile Sign Out Button */}
            <div className="pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({displayName})</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Fixed Bar (App Experience on Phones) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#090a0f]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 py-2 flex items-center justify-around shadow-2xl">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#ccff00] font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[#ccff00] stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
