import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, CreditCard, Sparkles, User, Mail, Lock } from 'lucide-react';
import { MembershipPlan } from '../types';
import { useToast } from '../context/ToastContext';

interface CheckoutModalProps {
  plan: MembershipPlan | null;
  annual: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ plan, annual, isOpen, onClose }: CheckoutModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '999'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [memberId, setMemberId] = useState('');

  if (!isOpen || !plan) return null;

  const price = annual ? plan.annualPricePerMonth : plan.monthlyPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = 'IRON-' + Math.floor(100000 + Math.random() * 900000);
      setMemberId(generatedId);
      setIsProcessing(false);
      setIsCompleted(true);
      showToast(`Welcome to IronHub! Your ${plan.name} membership ID is ${generatedId}`, 'success', 'Membership Activated');
    }, 800);
  };

  const handleFinish = () => {
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e0e13] border border-zinc-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40">
                {plan.badge || 'MEMBERSHIP TIER'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white font-heading tracking-wide mb-1">
              JOIN {plan.name}
            </h3>
            <p className="text-zinc-400 text-xs mb-6">{plan.tagline}</p>

            {/* Price Preview Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase font-semibold block">BILLED {annual ? 'ANNUALLY (20% OFF)' : 'MONTHLY'}</span>
                <span className="text-2xl font-black text-white font-heading">${price}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <div className="text-right text-[11px] text-[#ccff00] font-semibold">
                <span>$0 Initiation Fee</span>
                <div className="text-zinc-500 font-normal">30-day money-back guarantee</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Marcus Ray"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@example.com"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              {/* Simulated Card Input */}
              <div className="pt-2 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Payment Method (Encrypted Demo Checkout)
                </label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#ccff00]" />
                    <span className="font-mono text-white">4242 •••• •••• 4242</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <Lock className="w-3 h-3 text-[#ccff00]" /> 256-Bit SSL
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>ACTIVATING MEMBERSHIP...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" /> ACTIVATE MEMBERSHIP (${price}/MO)
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 text-center">
                <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                <span>Cancel anytime online with 30 days notice. Zero hidden fees.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#ccff00]/20 border-2 border-[#ccff00] rounded-full flex items-center justify-center mx-auto mb-4 text-[#ccff00]">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white font-heading tracking-wide mb-1">
              MEMBERSHIP ACTIVE!
            </h3>
            <p className="text-zinc-400 text-xs mb-6">
              Welcome to IRONHUB FITNESS. Your digital keycard is now initialized.
            </p>

            {/* Member Digital Card */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border-2 border-[#ccff00] rounded-2xl p-6 text-left mb-6 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-heading text-xl font-black text-white tracking-wider">
                    IRON<span className="text-[#ccff00]">HUB</span>
                  </span>
                  <div className="text-[10px] text-[#ccff00] font-mono tracking-widest uppercase">
                    {plan.name}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#ccff00] flex items-center justify-center text-black font-black text-xs">
                  ⚡
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">MEMBER NAME</span>
                <div className="text-white font-bold text-sm tracking-wide">{formData.name}</div>
              </div>

              <div className="flex justify-between items-end border-t border-zinc-800 pt-3 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">KEYCARD ID</span>
                  <span className="text-[#ccff00] font-bold">{memberId}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">STATUS</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" /> ACTIVE
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-6 py-3 rounded-lg transition-colors"
            >
              ACCESS MEMBER PORTAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
