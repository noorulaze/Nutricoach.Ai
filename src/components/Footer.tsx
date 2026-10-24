import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck, Dumbbell, Award, Flame } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  onOpenFreePass: () => void;
}

export default function Footer({ onOpenFreePass }: FooterProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast(`Welcome to the Iron Circle! Workout protocols sent to ${email}`, 'success', 'Subscribed to Newsletter');
    setEmail('');
  };

  return (
    <footer className="bg-[#060608] border-t border-zinc-800 text-zinc-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#ccff00]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Call to Action Bar */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10 mb-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 mb-3">
              <Flame className="w-3.5 h-3.5" /> The Iron Intel Newsletter
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide mb-2">
              GET WEEKLY TRAINING PROTOCOLS & NUTRITION MACROS
            </h3>
            <p className="text-zinc-400 text-sm">
              Join 45,000+ athletes receiving raw scientific periodization, lift breakdowns, and private invitation drops directly from our head coaches.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-black/80 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] flex-1"
              />
              <button
                type="submit"
                className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(204,255,0,0.3)]"
              >
                JOIN THE FORGE <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-[#ccff00] mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> You are now subscribed to Iron Intel. Check your inbox!
              </p>
            )}
          </form>
        </div>

        {/* Main Footer Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ccff00] to-[#99cc00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                <Zap className="w-6 h-6 fill-black stroke-black" />
              </div>
              <span className="font-heading text-2xl font-black tracking-wider text-white">
                IRON<span className="text-[#ccff00]">HUB</span>
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Engineered without compromise. We bridge raw hardcore barbell training with cutting-edge athletic sports science and luxury recovery amenities.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <Phone className="w-4 h-4 text-[#ccff00]" />
                <span className="font-mono">{GYM_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-300">
                <Mail className="w-4 h-4 text-[#ccff00]" />
                <span>{GYM_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#ccff00]" />
                <span>{GYM_INFO.headquarters}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenFreePass}
                className="inline-flex items-center gap-2 text-xs font-black text-black bg-[#ccff00] hover:bg-[#b8e600] px-4 py-2 rounded-lg uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)]"
              >
                <Dumbbell className="w-3.5 h-3.5" /> Claim Free VIP Day Pass
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-heading text-base font-bold tracking-wider mb-4 border-l-2 border-[#ccff00] pl-2.5">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#ccff00] transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#ccff00] transition-colors">About Our Story</Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-[#ccff00] transition-colors">Training Programs</Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-[#ccff00] transition-colors">Elite Coach Roster</Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-[#ccff00] transition-colors">Sanctuary Facilities</Link>
              </li>
            </ul>
          </div>

          {/* Membership & Proof Column */}
          <div>
            <h4 className="text-white font-heading text-base font-bold tracking-wider mb-4 border-l-2 border-[#ccff00] pl-2.5">
              MEMBERSHIP
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/membership" className="hover:text-[#ccff00] transition-colors">Pricing & Tiers</Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-[#ccff00] transition-colors">Member Transformations</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#ccff00] transition-colors">Contact Concierge</Link>
              </li>
              <li>
                <button
                  onClick={onOpenFreePass}
                  className="hover:text-[#ccff00] transition-colors text-left"
                >
                  1-Day VIP Pass
                </button>
              </li>
              <li>
                <Link to="/membership#faq" className="hover:text-[#ccff00] transition-colors">Membership FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Locations & Operating Hours */}
          <div>
            <h4 className="text-white font-heading text-base font-bold tracking-wider mb-4 border-l-2 border-[#ccff00] pl-2.5">
              LOCATIONS
            </h4>
            <div className="space-y-3.5 text-xs">
              {GYM_INFO.locations.map((loc) => (
                <div key={loc.id} className="border-b border-zinc-800/60 pb-2.5">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                    {loc.name}
                  </div>
                  <div className="text-zinc-400 mt-0.5">{loc.address.split(',')[0]}</div>
                  <div className="text-zinc-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#ccff00]" /> {loc.hours}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-6 border-y border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ccff00]" />
            <span>USAPL & IPF Olympic-Grade Certified Equipment</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
            <span>24/7 Biometric Keycard & Telemetry Surveillance</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#ccff00]" />
            <span>Over 120,000 lbs of Calibrated Free Steel</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 IRONHUB FITNESS LLC. All rights reserved. Forged for those who refuse average.</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-zinc-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-zinc-300">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-zinc-300">Facility Code</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
