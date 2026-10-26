import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  Activity, 
  MessageSquare, 
  TrendingUp, 
  User, 
  Settings, 
  LogOut,
  Sprout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SignOutConfirmModal from './SignOutConfirmModal';
import ThemeToggle from './ThemeToggle';
import NutriCoachLogo from './NutriCoachLogo';

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export default function AppSidebar({ onCloseMobile }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setSignOutModalOpen(false);
    logout();
    showToast('Signed out safely. All your food logs and workouts are preserved.', 'info', 'Signed Out');
    navigate('/login', { replace: true });
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home, end: true },
    { name: 'Food Tracker', path: '/food', icon: Utensils },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Exercises', path: '/exercises', icon: Activity },
    { name: 'AI Coach', path: '/coach', icon: MessageSquare },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/profile#settings', icon: Settings },
  ];

  return (
    <>
      <aside className="w-64 xl:w-72 bg-[#f6f8f5] dark:bg-[#1C211D] border-r border-[#e8ede6] dark:border-[#394139] flex flex-col justify-between shrink-0 p-5 min-h-screen sticky top-0 select-none transition-colors duration-200">
        {/* Brand Header */}
        <div>
          <div className="px-2 py-3 mb-6">
            <NutriCoachLogo 
              to="/" 
              onClick={onCloseMobile}
              size="md"
              showTagline
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] font-bold shadow-xs'
                        : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#edf2ea] dark:hover:bg-[#313A33]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive 
                          ? 'stroke-[#3b7e23] dark:stroke-[#8BAF78] stroke-[2.5]' 
                          : 'stroke-[#5e6f5e] dark:stroke-[#A2AAA1]'
                      }`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Theme Switcher, Sprout Motivation Card & Sign out */}
        <div className="space-y-3 pt-6">
          {/* Sprout Card matching the reference image */}
          <div className="bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] rounded-3xl p-4 sm:p-5 text-center shadow-xs">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/80 dark:bg-[#272E29] flex items-center justify-center text-[#5ba83c] dark:text-[#8BAF78] shadow-xs mb-3">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] leading-snug">
              Small steps<br />give big results.
            </h4>
            <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] mt-1 font-medium">
              Stay consistent,<br />stay healthy!
            </p>
          </div>

          {/* Theme Mode Quick Selector in Sidebar */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-[#edf2ea] dark:bg-[#222823] border border-[#e8ede6] dark:border-[#394139]">
            <span className="text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1]">
              Appearance
            </span>
            <ThemeToggle variant="icon" />
          </div>

          {/* Sign Out Action */}
          <button
            type="button"
            onClick={() => setSignOutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-semibold text-[#7a8c79] dark:text-[#A2AAA1] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Confirmation Modal */}
      <SignOutConfirmModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        userName={user?.name || 'Alex'}
      />
    </>
  );
}
