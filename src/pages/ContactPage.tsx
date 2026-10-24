import React, { useState } from 'react';
import { 
  Zap, Mail, Phone, MapPin, Clock, MessageSquare, 
  Send, ShieldCheck, CheckCircle2, Car, Train, ArrowRight 
} from 'lucide-react';
import { GYM_INFO } from '../data/gymData';
import { useToast } from '../context/ToastContext';

interface ContactPageProps {
  onOpenFreePass: () => void;
}

export default function ContactPage({ onOpenFreePass }: ContactPageProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: GYM_INFO.locations[0].id,
    subject: 'Membership Inquiry & Pricing',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeLocationTab, setActiveLocationTab] = useState(GYM_INFO.locations[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast(`Thank you ${formData.name}. Our concierge team will reach out within 2 hours!`, 'success', 'Message Transmitted');
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: GYM_INFO.locations[0].id,
      subject: 'Membership Inquiry & Pricing',
      message: ''
    });
  };

  const selectedLoc = GYM_INFO.locations.find((l) => l.id === activeLocationTab) || GYM_INFO.locations[0];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-radial-gradient">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> 24/7 ATHLETE SUPPORT & FLAGSHIP DIRECTORY
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            CONNECT WITH <span className="text-[#ccff00]">THE CONCIERGE</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Have questions about biometric coaching, private locker availability, Olympic platforms, or scheduling a private facility walkthrough? We are here 24 hours a day.
          </p>
        </div>
      </section>

      {/* DIRECT CONTACT TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Phone */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 hover:border-[#ccff00]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-wider block">
              24/7 MEMBER HOTLINE
            </span>
            <h3 className="text-xl font-bold font-heading text-white tracking-wide mt-1 mb-2">
              {GYM_INFO.phone}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Immediate front desk concierge assistance and keycard access authorization.
            </p>
          </div>

          {/* Card 2: Email */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 hover:border-[#ccff00]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-wider block">
              DIRECT INBOX
            </span>
            <h3 className="text-xl font-bold font-heading text-white tracking-wide mt-1 mb-2">
              {GYM_INFO.email}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Guaranteed response within 2 hours for corporate passes and trainer requests.
            </p>
          </div>

          {/* Card 3: Free Pass Quick CTA */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_25px_rgba(204,255,0,0.1)]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ccff00] text-black flex items-center justify-center mb-4 font-black">
                ⚡
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-wider block">
                FREE 1-DAY PASS
              </span>
              <h3 className="text-xl font-bold font-heading text-white tracking-wide mt-1 mb-2">
                TEST THE RACKS FOR FREE
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Zero hassle. Instant digital barcode pass sent straight to your phone.
              </p>
            </div>
            <button
              onClick={onOpenFreePass}
              className="mt-4 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3 px-4 rounded-xl transition-all"
            >
              CLAIM GUEST PASS NOW
            </button>
          </div>
        </div>
      </section>

      {/* FORM & LOCATIONS DUAL COLUMN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {!submitted ? (
              <div>
                <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-1">
                  SECURE TRANSMISSION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight mb-2">
                  SEND A DIRECT MESSAGE
                </h2>
                <p className="text-xs text-zinc-400 mb-8">
                  Whether you're inquiring about corporate rates, personal coaching availability, or custom event hosting, our management team will reply promptly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jordan Hunter"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jordan@example.com"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Preferred Flagship
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                      >
                        {GYM_INFO.locations.map((loc) => (
                          <option key={loc.id} value={loc.id} className="bg-zinc-900">
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Subject Matter
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                    >
                      <option value="Membership Inquiry & Pricing">Membership Inquiry & Pricing</option>
                      <option value="1-on-1 Master Coach Booking">1-on-1 Master Coach Booking</option>
                      <option value="Private Event & Filming Production">Private Event & Filming Production</option>
                      <option value="Corporate Wellness Partnership">Corporate Wellness Partnership</option>
                      <option value="Powerlifting Meet Registration">Powerlifting Meet Registration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you are looking for..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING MESSAGE...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> TRANSMIT MESSAGE TO CONCIERGE
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                    <span>Your privacy is paramount. Zero spam. Encrypted communication.</span>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ccff00]/20 border-2 border-[#ccff00] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ccff00]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-heading text-white mb-2">
                  TRANSMISSION RECEIVED
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our management desk has logged your ticket and will reply within 2 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-lg transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            )}
          </div>

          {/* Locations Directory Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
                FLAGSHIP FACILITIES
              </span>
              <h3 className="text-2xl font-black font-heading text-white uppercase tracking-tight mb-6">
                METRO LOCATIONS DIRECTORY
              </h3>

              {/* Location Select Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {GYM_INFO.locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocationTab(loc.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                      activeLocationTab === loc.id
                        ? 'bg-[#ccff00] text-black shadow-lg font-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {loc.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Active Location Details */}
              <div className="space-y-4 text-xs border-t border-zinc-800 pt-4">
                <div>
                  <span className="text-zinc-500 uppercase font-mono block">CAMPUS NAME</span>
                  <div className="text-white font-heading text-lg font-bold">{selectedLoc.name}</div>
                  <span className="text-[#ccff00] font-mono text-[11px]">{selectedLoc.sqft}</span>
                </div>

                <div>
                  <span className="text-zinc-500 uppercase font-mono block">ADDRESS</span>
                  <div className="text-zinc-200 font-medium flex items-start gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
                    <span>{selectedLoc.address}</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 uppercase font-mono block">HOURS OF OPERATION</span>
                  <div className="text-zinc-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>{selectedLoc.hours}</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 uppercase font-mono block">DIRECT DESK PHONE</span>
                  <div className="text-white font-mono font-bold flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span>{selectedLoc.phone}</span>
                  </div>
                </div>

                {/* Features in this campus */}
                <div>
                  <span className="text-zinc-500 uppercase font-mono block mb-1.5">KEY CAMPUS AMENITIES</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLoc.features.map((feat, i) => (
                      <span
                        key={i}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded text-[11px]"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated Map Card */}
                <div className="pt-2">
                  <div className="h-44 rounded-xl overflow-hidden relative border border-zinc-800 bg-zinc-900 flex items-center justify-center group">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                      alt="Tactical Map"
                      className="w-full h-full object-cover filter brightness-[0.35] contrast-150 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-8 h-8 rounded-full bg-[#ccff00] text-black flex items-center justify-center animate-bounce mb-1">
                        <MapPin className="w-4 h-4 fill-black" />
                      </div>
                      <span className="text-white font-mono font-bold text-xs uppercase">
                        {selectedLoc.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        40.7589° N, 73.9851° W • METRO TRANSIT ACCESSIBLE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
