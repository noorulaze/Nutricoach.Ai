import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Dumbbell, Phone, MapPin } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';

interface NavbarProps {
  onOpenFreePass: () => void;
}

export default function Navbar({ onOpenFreePass }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Membership', path: '/membership' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3.5'
          : 'bg-zinc-950/60 backdrop-blur-sm border-b border-zinc-800/40 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ccff00] to-[#99cc00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] group-hover:scale-105 transition-transform duration-200">
            <Zap className="w-6 h-6 fill-black stroke-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-heading text-2xl sm:text-3xl font-black tracking-wider text-white">
                IRON<span className="text-[#ccff00]">HUB</span>
              </span>
            </div>
            <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-zinc-400 block -mt-0.5">
              FITNESS SANCTUARY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-[#ccff00] bg-zinc-900 border border-[#ccff00]/30 shadow-[0_0_12px_rgba(204,255,0,0.15)]'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFreePass}
            className="hidden sm:inline-flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(204,255,0,0.35)]"
          >
            <Dumbbell className="w-4 h-4" />
            <span>FREE DAY PASS</span>
          </button>

          {/* Hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6 text-[#ccff00]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-xl px-5 py-6 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-bold uppercase tracking-wider flex items-center justify-between ${
                    isActive
                      ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30'
                      : 'text-zinc-200 hover:text-white hover:bg-zinc-900'
                  }`
                }
              >
                <span>{link.name}</span>
                <span className="text-xs text-zinc-500">→</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-4">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFreePass();
              }}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black text-sm font-black uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              <Dumbbell className="w-4 h-4" /> CLAIM FREE DAY PASS
            </button>

            <div className="text-xs text-zinc-400 space-y-1.5 px-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>{GYM_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>3 Metro Flagship Locations</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
