import React, { useState } from 'react';
import { X, Check, Dumbbell, ShieldCheck, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';
import { useToast } from '../context/ToastContext';

interface FreePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreePassModal({ isOpen, onClose }: FreePassModalProps) {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [passData, setPassData] = useState({
    name: '',
    email: '',
    phone: '',
    location: GYM_INFO.locations[0].id,
    date: new Date().toISOString().split('T')[0],
    goal: 'Hypertrophy & Muscle Building'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passId, setPassId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedCode = 'IH-' + Math.floor(100000 + Math.random() * 900000);
      setPassId(generatedCode);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast(`VIP Guest Pass ${generatedCode} reserved for ${passData.name}!`, 'success', 'Pass Confirmed');
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  const selectedLoc = GYM_INFO.locations.find((l) => l.id === passData.location) || GYM_INFO.locations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#15151c] to-[#0d0d12] border border-zinc-700/70 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(204,255,0,0.15)] my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free VIP Access
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mb-2">
              EXPERIENCE THE <span className="text-[#ccff00]">IRON STANDARD</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Claim your complimentary 1-Day VIP Guest Pass. Includes access to all heavy lifting platforms, cardio arena, recovery saunas, and cold plunges.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={passData.name}
                    onChange={(e) => setPassData({ ...passData, name: e.target.value })}
                    placeholder="e.g. Alex Hunter"
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={passData.email}
                    onChange={(e) => setPassData({ ...passData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={passData.phone}
                    onChange={(e) => setPassData({ ...passData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Preferred Location *
                  </label>
                  <select
                    value={passData.location}
                    onChange={(e) => setPassData({ ...passData, location: e.target.value })}
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  >
                    {GYM_INFO.locations.map((loc) => (
                      <option key={loc.id} value={loc.id} className="bg-zinc-900 text-white">
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Date of Visit
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={passData.date}
                    onChange={(e) => setPassData({ ...passData, date: e.target.value })}
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Primary Goal
                  </label>
                  <select
                    value={passData.goal}
                    onChange={(e) => setPassData({ ...passData, goal: e.target.value })}
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors"
                  >
                    <option value="Hypertrophy & Muscle Building" className="bg-zinc-900">Hypertrophy & Muscle Building</option>
                    <option value="Powerlifting & Pure Strength" className="bg-zinc-900">Powerlifting & Pure Strength</option>
                    <option value="Fat Loss & HIIT Conditioning" className="bg-zinc-900">Fat Loss & HIIT Conditioning</option>
                    <option value="Athletic Speed & Agility" className="bg-zinc-900">Athletic Speed & Agility</option>
                    <option value="Bio-Recovery & Joint Mobility" className="bg-zinc-900">Bio-Recovery & Joint Mobility</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-[0_0_25px_rgba(204,255,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      GENERATING PASS...
                    </span>
                  ) : (
                    <>
                      <Dumbbell className="w-5 h-5" /> CLAIM MY FREE DAY PASS NOW
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#ccff00]" /> No Credit Card Required
                </span>
                <span>•</span>
                <span>Instant Digital Delivery</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Pass Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#ccff00]/20 border-2 border-[#ccff00] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ccff00]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-2xl font-black text-white font-heading tracking-wide mb-1">
              YOU'RE IN THE FORGE!
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Your VIP pass has been reserved. Check your email for barcode entry details.
            </p>

            {/* Simulated Digital Pass Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-[#ccff00]/40 rounded-xl p-5 text-left mb-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-[#ccff00] text-black font-mono font-bold text-xs px-3 py-1 rounded-bl-lg">
                VIP GUEST
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-black font-heading text-white tracking-wider">IRONHUB</span>
                <span className="text-xs text-[#ccff00] font-mono tracking-widest font-bold">PASS: {passId}</span>
              </div>

              <div className="space-y-2 text-xs border-t border-zinc-800 pt-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">GUEST:</span>
                  <span className="text-white font-bold">{passData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">FACILITY:</span>
                  <span className="text-[#ccff00] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedLoc.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">VALID DATE:</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {passData.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ACCESS:</span>
                  <span className="text-zinc-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ccff00]" /> Full Facility & Recovery Suite
                  </span>
                </div>
              </div>

              {/* Barcode graphic */}
              <div className="mt-4 pt-3 border-t border-dashed border-zinc-700/80 text-center">
                <div className="flex justify-center items-center gap-1 h-8 px-4 opacity-75">
                  {[4,2,6,1,3,5,2,4,7,2,3,5,1,4,2,6,3,1,5,4,2,5,3,2,6,4].map((h, i) => (
                    <div key={i} className="bg-white w-1" style={{ height: `${h * 4}px` }} />
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">PRESENT AT FRONT DESK FOR SCAN</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs tracking-wider px-6 py-3 rounded-lg transition-colors"
              >
                DONE & CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
