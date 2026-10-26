import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'segmented';
  className?: string;
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 rounded-2xl bg-[#edf2ea] dark:bg-[#222823] border border-[#e8ede6] dark:border-[#394139] ${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            theme === 'light'
              ? 'bg-white text-[#192418] shadow-xs'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
          aria-label="Light theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            theme === 'dark'
              ? 'bg-[#272E29] text-[#E8EDE7] shadow-xs border border-[#394139]'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
          aria-label="Dark theme"
        >
          <Moon className="w-3.5 h-3.5 text-[#8BAF78]" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            theme === 'system'
              ? 'bg-white dark:bg-[#272E29] text-[#192418] dark:text-[#E8EDE7] shadow-xs border border-[#e8ede6] dark:border-[#394139]'
              : 'text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7]'
          }`}
          aria-label="System theme"
        >
          <span>Auto</span>
        </button>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#192418] dark:text-[#E8EDE7] hover:border-[#8BAF78]/50 transition-all shadow-xs ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-[#8BAF78] stroke-[2.2]" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default: Icon only button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-2xl bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#edf2ea] dark:hover:bg-[#313A33] flex items-center justify-center transition-all shadow-xs relative group ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-[#5ba83c] group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
