import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, MessageSquare, User } from 'lucide-react';

export default function MobileBottomNav() {
  const items = [
    { name: 'Home', path: '/', icon: Home, end: true },
    { name: 'Nutrition', path: '/food', icon: Utensils },
    { name: 'Workout', path: '/workouts', icon: Dumbbell },
    { name: 'Chat', path: '/coach', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1C211D]/95 backdrop-blur-md border-t border-[#e8ede6] dark:border-[#394139] px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-colors select-none"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all min-w-[56px] ${
                isActive
                  ? 'text-[#3b7e23] dark:text-[#8BAF78] font-bold'
                  : 'text-[#7a8c79] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#eef7eb] dark:bg-[#243022]' : ''
                }`}>
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[#3b7e23] dark:stroke-[#8BAF78] stroke-[2.4] scale-105' : 'stroke-[1.8]'}`} />
                </div>
                <span className="text-[10px] tracking-tight font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
