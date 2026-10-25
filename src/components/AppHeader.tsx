import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Calendar, 
  Plus, 
  Menu, 
  X, 
  Flame,
  User,
  LogOut,
  ChevronDown,
  Settings,
  ShieldCheck,
  Activity,
  MessageSquare
} from 'lucide-react';
import { getProfile, getFoodLog } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AppSidebar from './AppSidebar';
import SignOutConfirmModal from './SignOutConfirmModal';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profile = getProfile();
  const todayFoods = getFoodLog();
  const consumedCalories = todayFoods.reduce((acc, f) => acc + f.calories, 0);
  const calorieTarget = profile.calorieTarget || 1750;
  const progressPercent = Math.min(100, Math.round((consumedCalories / calorieTarget) * 100));

  const displayName = user?.name || profile.name || 'Friend';
  const firstName = displayName.split(' ')[0];
  const userEmail = user?.email || 'demo@nutricoach.ai';

  // Format today's date in style: "Today, Oct 25, 2026"
  const todayFormatted = `Today, ${new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Keyboard shortcut cmd/ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/food?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleConfirmSignOut = () => {
    setSignOutModalOpen(false);
    setProfileDropdownOpen(false);
    logout();
    showToast('Signed out safely. All your food logs and workouts are preserved.', 'info', 'Signed Out');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="w-full bg-[#f6f8f5] px-4 sm:px-6 lg:px-8 py-5 border-b border-[#e8ede6]/60 relative z-30">
        <div className="flex flex-col gap-4">
          {/* Top Row: Greeting on Left, Tools & Profile on Right */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Personalized Greeting */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-2xl bg-white border border-[#e8ede6] text-[#5e6f5e] hover:text-[#192418] hover:bg-[#edf2ea] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#192418] tracking-tight flex items-center gap-2">
                  <span>Hello, {firstName}!</span>
                  <span className="text-xl select-none" role="img" aria-label="sprout">🌱</span>
                </h1>
                <p className="text-xs sm:text-[13px] text-[#5e6f5e] font-medium mt-0.5">
                  Let's build healthier habits, one day at a time.
                </p>
              </div>
            </div>

            {/* Right: Search, Date, Notifications, Profile Dropdown */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Date Pill (hidden on small mobile) */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#e8ede6] text-xs font-medium text-[#5e6f5e] shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-[#5ba83c]" />
                <span>{todayFormatted}</span>
              </div>

              {/* Global Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                <Search className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals, nutrients, or anything..."
                  className="w-56 md:w-64 lg:w-72 pl-9 pr-10 py-2 rounded-2xl bg-white border border-[#e8ede6] text-xs text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c] transition-all shadow-xs"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8e9f8e] bg-[#f6f8f5] px-1.5 py-0.5 rounded border border-[#e8ede6] pointer-events-none">
                  ⌘ K
                </kbd>
              </form>

              {/* Notification Bell */}
              <button
                type="button"
                className="w-9 h-9 rounded-2xl bg-white border border-[#e8ede6] text-[#5e6f5e] hover:text-[#192418] hover:bg-[#edf2ea] flex items-center justify-center transition-colors shadow-xs relative"
                title="Notifications"
                onClick={() => navigate('/coach')}
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#5ba83c] absolute top-2 right-2 border-2 border-white" />
              </button>

              {/* Profile Avatar & Interactive Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl bg-white border border-[#e8ede6] hover:border-[#5ba83c]/40 hover:bg-[#edf2ea]/50 transition-all shadow-xs group"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  title="Account & Session Menu"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#eef7eb] border border-[#d6ebd0] flex items-center justify-center text-xs font-bold text-[#3b7e23] relative">
                    {displayName.charAt(0).toUpperCase()}
                    <span className="w-2 h-2 rounded-full bg-[#5ba83c] absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-[#192418] max-w-[100px] truncate">
                    {firstName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#7a8c79] group-hover:text-[#192418] transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Card */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl border border-[#e8ede6] shadow-xl p-3 z-50 animate-scale-up space-y-2">
                    {/* User Info Header */}
                    <div className="p-3 bg-[#f6f8f5] rounded-2xl border border-[#e8ede6]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#5ba83c] flex items-center justify-center text-sm font-bold text-white shadow-xs">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#192418] truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-[#7a8c79] font-medium truncate">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-[#e8ede6] flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#3b7e23] bg-[#eef7eb] px-2 py-0.5 rounded-full border border-[#d6ebd0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5ba83c] animate-pulse" />
                          Session Active
                        </span>
                        <span className="text-[10px] text-[#7a8c79]">
                          Data Protected
                        </span>
                      </div>
                    </div>

                    {/* Quick Menu Items */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#192418] hover:bg-[#f6f8f5] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#5ba83c]" />
                        <span>Profile & Biometrics</span>
                      </Link>

                      <Link
                        to="/food"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#192418] hover:bg-[#f6f8f5] transition-colors"
                      >
                        <Activity className="w-4 h-4 text-[#5ba83c]" />
                        <span>Food & Nutrition Log</span>
                      </Link>

                      <Link
                        to="/coach"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#192418] hover:bg-[#f6f8f5] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-[#5ba83c]" />
                        <span>AI Fitness Coach</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#e8ede6] my-1" />

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setSignOutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 stroke-[2.2]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub Header Action Bar: Daily Goal and + Log Food Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-1">
            {/* Daily Goal Pill */}
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white border border-[#e8ede6] shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-[#eef7eb] flex items-center justify-center text-[#5ba83c]">
                <Flame className="w-3.5 h-3.5 fill-[#5ba83c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8e9f8e]">
                  Daily Goal
                </span>
                <span className="text-xs font-bold text-[#192418] leading-tight">
                  {calorieTarget.toLocaleString()} kcal
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-16 sm:w-20 h-2 bg-[#eef7eb] rounded-full overflow-hidden ml-1">
                <div 
                  className="h-full bg-[#5ba83c] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* + Log Food Action Button */}
            <Link
              to="/food"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Food</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
        userName={displayName}
      />

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-[#f6f8f5] h-full shadow-2xl z-10 animate-fade-in flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-white border border-[#e8ede6] text-[#5e6f5e] hover:text-[#192418]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <AppSidebar onCloseMobile={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
