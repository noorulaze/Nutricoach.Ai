import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  User,
  LogOut,
  ChevronDown,
  Activity,
  MessageSquare
} from 'lucide-react';
import { getProfile } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AppSidebar from './AppSidebar';
import SignOutConfirmModal from './SignOutConfirmModal';
import ThemeToggle from './ThemeToggle';

import NutriCoachLogo from './NutriCoachLogo';

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
  const displayName = user?.name || profile.name || 'Nooru';
  const firstName = displayName.split(' ')[0] || 'Nooru';
  const userEmail = user?.email || 'nooru@nutricoach.ai';

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
      <header className="w-full bg-[#f6f8f5] dark:bg-[#1C211D] px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 border-b border-[#e8ede6]/60 dark:border-[#394139]/60 relative z-30 transition-colors">
        <div className="flex flex-col gap-3 sm:gap-4">
          
          {/* MOBILE VIEW (< 1024px): Matches 10-screen reference layout (Logo on left, Hamburger & Theme on right) */}
          <div className="flex lg:hidden items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2" aria-label="NutriCoach AI Home">
              <NutriCoachLogo variant="horizontal" size="sm" />
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle variant="icon" />
              
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#edf2ea] dark:hover:bg-[#313A33] transition-colors shadow-2xs"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW (>= 1024px): Preserved full desktop header */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Left: Personalized Greeting */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#192418] dark:text-[#E8EDE7] tracking-tight flex items-center gap-2">
                  <span>Hello, {firstName}!</span>
                  <span className="text-xl select-none" role="img" aria-label="sprout">🌱</span>
                </h1>
                <p className="text-xs sm:text-[13px] text-[#5e6f5e] dark:text-[#A2AAA1] font-medium mt-0.5">
                  Let's build healthier habits, one day at a time.
                </p>
              </div>
            </div>

            {/* Right: Search, Theme Toggle, Notifications, Profile Dropdown */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Global Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                <Search className="w-4 h-4 text-[#8e9f8e] dark:text-[#7A8279] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals, nutrients, or anything..."
                  className="w-52 md:w-60 lg:w-72 pl-9 pr-10 py-2 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] dark:placeholder-[#7A8279] focus:outline-none focus:ring-2 focus:ring-[#8BAF78]/30 focus:border-[#8BAF78] transition-all shadow-xs"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8e9f8e] dark:text-[#7A8279] bg-[#f6f8f5] dark:bg-[#1C211D] px-1.5 py-0.5 rounded border border-[#e8ede6] dark:border-[#394139] pointer-events-none">
                  ⌘ K
                </kbd>
              </form>

              {/* Theme Mode Toggle Button */}
              <ThemeToggle />

              {/* Notification Bell */}
              <button
                type="button"
                className="w-9 h-9 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#edf2ea] dark:hover:bg-[#313A33] flex items-center justify-center transition-colors shadow-xs relative"
                title="Notifications & AI Coach"
                onClick={() => navigate('/coach')}
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78] absolute top-2 right-2 border-2 border-white dark:border-[#272E29]" />
              </button>

              {/* Profile Avatar & Interactive Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] hover:border-[#8BAF78]/40 hover:bg-[#edf2ea]/50 dark:hover:bg-[#313A33] transition-all shadow-xs group"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  title="Account & Session Menu"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] flex items-center justify-center text-xs font-bold text-[#3b7e23] dark:text-[#8BAF78] relative">
                    {displayName.charAt(0).toUpperCase()}
                    <span className="w-2 h-2 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78] absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-[#272E29]" />
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-[#192418] dark:text-[#E8EDE7] max-w-[100px] truncate">
                    {firstName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#7a8c79] dark:text-[#A2AAA1] group-hover:text-[#192418] dark:group-hover:text-[#E8EDE7] transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Card */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#272E29] rounded-3xl border border-[#e8ede6] dark:border-[#394139] shadow-xl p-3 z-50 animate-scale-up space-y-2">
                    {/* User Info Header */}
                    <div className="p-3 bg-[#f6f8f5] dark:bg-[#1C211D] rounded-2xl border border-[#e8ede6] dark:border-[#394139]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#5ba83c] dark:bg-[#8BAF78] flex items-center justify-center text-sm font-bold text-white dark:text-[#161D15] shadow-xs">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium truncate">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-[#e8ede6] dark:border-[#394139] flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#243022] px-2 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#3A4B35]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5ba83c] dark:bg-[#8BAF78] animate-pulse" />
                          Session Active
                        </span>
                        <span className="text-[10px] text-[#7a8c79] dark:text-[#A2AAA1]">
                          Data Protected
                        </span>
                      </div>
                    </div>

                    {/* Quick Menu Items */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#192418] dark:text-[#E8EDE7] hover:bg-[#f6f8f5] dark:hover:bg-[#1C211D] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78]" />
                        <span>Profile & Biometrics</span>
                      </Link>

                      <Link
                        to="/food"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#192418] dark:text-[#E8EDE7] hover:bg-[#f6f8f5] dark:hover:bg-[#1C211D] transition-colors"
                      >
                        <Activity className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78]" />
                        <span>Food & Nutrition Log</span>
                      </Link>

                      <Link
                        to="/coach"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#192418] dark:text-[#E8EDE7] hover:bg-[#f6f8f5] dark:hover:bg-[#1C211D] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78]" />
                        <span>AI Fitness Coach</span>
                      </Link>
                    </div>

                    {/* Appearance Switcher inside Dropdown */}
                    <div className="px-3 py-2 bg-[#f6f8f5] dark:bg-[#1C211D] rounded-2xl border border-[#e8ede6] dark:border-[#394139] flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1]">
                        Theme
                      </span>
                      <ThemeToggle variant="segmented" />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#e8ede6] dark:bg-[#394139] my-1" />

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setSignOutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 stroke-[2.2]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
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
          <div className="relative w-72 max-w-[85vw] bg-[#f6f8f5] dark:bg-[#1C211D] h-full shadow-2xl z-10 animate-fade-in flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]"
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
