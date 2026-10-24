import React, { useState } from 'react';
import { X, Calendar, Clock, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Trainer } from '../types';
import { useToast } from '../context/ToastContext';

interface TrainerBookingModalProps {
  trainer: Trainer | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainerBookingModal({ trainer, isOpen, onClose }: TrainerBookingModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    sessionType: '1-on-1 Movement & Biomechanics Assessment',
    notes: ''
  });
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !trainer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsBooked(true);
      showToast(`Private session booked with ${trainer.name} for ${formData.date} at ${formData.timeSlot}!`, 'success', 'Session Confirmed');
    }, 700);
  };

  const handleFinish = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <div>
            {/* Trainer Header Mini Card */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#ccff00]/40 shrink-0"
              />
              <div>
                <span className="text-[10px] font-black uppercase text-[#ccff00] tracking-widest block">
                  BOOK 1-ON-1 COACHING
                </span>
                <h3 className="text-xl font-black text-white font-heading">{trainer.name}</h3>
                <p className="text-xs text-zinc-400">{trainer.role}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <span className="flex items-center text-[#ccff00]">
                    <Star className="w-3.5 h-3.5 fill-[#ccff00]" /> {trainer.rating}
                  </span>
                  <span>•</span>
                  <span>{trainer.experienceYears} Years Experience</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jordan Smith"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jordan@example.com"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  >
                    <option value="07:00 AM">07:00 AM - Dawn Conditioning</option>
                    <option value="09:00 AM">09:00 AM - Morning Prime</option>
                    <option value="12:00 PM">12:00 PM - Midday Power Hour</option>
                    <option value="03:00 PM">03:00 PM - Afternoon Strength</option>
                    <option value="06:00 PM">06:00 PM - Evening Heavy Duty</option>
                    <option value="08:00 PM">08:00 PM - Night Hypertrophy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Session Type
                </label>
                <select
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                >
                  <option value="1-on-1 Movement & Biomechanics Assessment">1-on-1 Movement & Biomechanics Assessment</option>
                  <option value="Barbell Kinetic Technique Deep-Dive (Squat/Bench/Dead)">Barbell Kinetic Technique Deep-Dive</option>
                  <option value="Metabolic Conditioning & VO2 Max Test">Metabolic Conditioning & VO2 Max Test</option>
                  <option value="Injury Rehabilitation & Joint Prehab Consultation">Injury Rehabilitation & Joint Prehab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Lifting History & Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share any past injuries or current PR targets..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? 'CONFIRMING SESSION...' : `CONFIRM SESSION WITH ${trainer.name.toUpperCase()}`}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                <span>Zero obligation. Free 45-min consultation included with initial trial.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#ccff00]/20 border-2 border-[#ccff00] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ccff00]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white font-heading tracking-wide mb-1">
              SESSION CONFIRMED!
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              You are booked with <span className="text-[#ccff00] font-bold">{trainer.name}</span>.
            </p>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 text-xs space-y-2 mb-6 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-500">COACH:</span>
                <span className="text-white font-bold">{trainer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">DATE & TIME:</span>
                <span className="text-[#ccff00] font-mono font-bold">{formData.date} @ {formData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">SESSION:</span>
                <span className="text-zinc-300">{formData.sessionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">LOCATION:</span>
                <span className="text-zinc-300">Downtown Flagship Performance Deck</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="bg-[#ccff00] text-black font-extrabold uppercase text-xs tracking-wider px-6 py-3 rounded-lg hover:bg-[#b8e600] transition-colors"
            >
              DONE & BACK TO ROSTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
