import React from 'react';
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

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export default function AppSidebar({ onCloseMobile }: AppSidebarProps) {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('You have been signed out safely.', 'info', 'Signed Out');
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
    <aside className="w-64 xl:w-72 bg-[#f6f8f5] border-r border-[#e8ede6] flex flex-col justify-between shrink-0 p-5 min-h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div>
        <Link 
          to="/" 
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-2 py-3 mb-6 group cursor-pointer"
        >
          {/* Stylized Leaf Logo */}
          <div className="w-10 h-10 rounded-2xl bg-[#5ba83c] flex items-center justify-center text-white shadow-sm shadow-[#5ba83c]/30 group-hover:scale-105 transition-transform">
            <svg 
              className="w-5 h-5 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M21 3c-6.627 0-12 5.373-12 12 0 1.258.196 2.47.558 3.606L3 21l2.394-6.558C4.196 13.31 4 12.098 4 11 4 4.373 9.373-1 16-1c2.146 0 4.148.566 5.88 1.558L21 3z" />
            </svg>
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl text-[#192418] tracking-tight block leading-tight">
              NutriCoach <span className="text-[#5ba83c]">AI</span>
            </span>
            <span className="text-[11px] font-medium text-[#7a8c79] block">
              Better Food. Healthier You.
            </span>
          </div>
        </Link>

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
                      ? 'bg-[#eef7eb] text-[#3b7e23] font-bold shadow-xs'
                      : 'text-[#5e6f5e] hover:text-[#192418] hover:bg-[#edf2ea]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'stroke-[#3b7e23] stroke-[2.5]' : 'stroke-[#5e6f5e]'
                    }`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Sprout Motivation Card & Sign out */}
      <div className="space-y-3 pt-6">
        {/* Sprout Card matching the reference image */}
        <div className="bg-[#eef7eb] border border-[#d6ebd0] rounded-3xl p-5 text-center shadow-xs">
          <div className="w-10 h-10 mx-auto rounded-full bg-white/80 flex items-center justify-center text-[#5ba83c] shadow-xs mb-3">
            <Sprout className="w-5 h-5 text-[#5ba83c] stroke-[2.2]" />
          </div>
          <h4 className="text-xs font-bold text-[#192418] leading-snug">
            Small steps<br />give big results.
          </h4>
          <p className="text-[11px] text-[#5e6f5e] mt-1 font-medium">
            Stay consistent,<br />stay healthy!
          </p>
        </div>

        {/* Sign Out Action */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-medium text-[#7a8c79] hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
