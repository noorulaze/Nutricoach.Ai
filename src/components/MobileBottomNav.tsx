import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, MessageSquare, User } from 'lucide-react';

export default function MobileBottomNav() {
  const items = [
    { name: 'Dashboard', path: '/', icon: Home, end: true },
    { name: 'Food', path: '/food', icon: Utensils },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'AI Coach', path: '/coach', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8ede6] px-3 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#3b7e23] font-bold'
                  : 'text-[#7a8c79] hover:text-[#192418]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[#eef7eb]' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[#3b7e23] stroke-[2.5]' : ''}`} />
                </div>
                <span className="text-[10px] tracking-tight">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
