import React, { useState } from 'react';
import { 
  Zap, Check, X as CloseIcon, ShieldCheck, Dumbbell, 
  Sparkles, ArrowRight, ChevronDown, ChevronUp, HelpCircle 
} from 'lucide-react';
import { MEMBERSHIP_PLANS, FAQS } from '../data/gymData';
import { MembershipPlan } from '../types';
import CheckoutModal from '../components/CheckoutModal';

interface MembershipPageProps {
  onOpenFreePass: () => void;
}

export default function MembershipPage({ onOpenFreePass }: MembershipPageProps) {
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<MembershipPlan | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Matrix features list
  const matrixFeatures = [
    { name: 'Gym Floor & Free Weights Access', basic: true, pro: true, elite: true },
    { name: 'Calibrated Barbells & Heavy Monster Racks', basic: true, pro: true, elite: true },
    { name: 'Cardio & 50m Performance Turf Track', basic: true, pro: true, elite: true },
    { name: 'Luxury Rainfall Showers & Locker Rooms', basic: true, pro: true, elite: true },
    { name: 'IronHub Mobile Workout Telemetry App', basic: true, pro: true, elite: true },
    { name: 'Dry Cedar Finnish Saunas', basic: true, pro: true, elite: true },
    { name: 'Group Classes & Signature HIIT Sessions', basic: false, pro: true, elite: true },
    { name: 'Sub-Zero 42°F Cold Plunge Access', basic: false, pro: true, elite: true },
    { name: 'Free Monthly 1-on-1 Personal Training', basic: false, pro: '2x / month', elite: 'Weekly 1-on-1' },
    { name: '24/7 Keycard Access Across All 3 Metro Locations', basic: false, pro: true, elite: true },
    { name: 'Infrared Red Light & Hyperbaric Oxygen Pods', basic: false, pro: false, elite: true },
    { name: 'Guest Passes Every Month', basic: false, pro: '2 Passes', elite: 'Unlimited' },
    { name: 'Permanent Private Locker & Laundry Service', basic: false, pro: false, elite: true },
    { name: 'Fuel Bar Smoothies & Pro-Shop Discount', basic: false, pro: '10% Off', elite: '25% Off + Daily Free Shake' },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-radial-gradient">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> TRANSPARENT MEMBERSHIPS • ZERO HIDDEN FEES
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            INVEST IN YOUR <span className="text-[#ccff00]">POWER</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto mb-10">
            No 2-year lock-in traps. No predatory cancellation fees. Just elite steel, world-class coaching, and recovery facilities built to elevate your performance.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-zinc-900 border border-zinc-700/80 p-1.5 rounded-2xl shadow-xl">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                !annualBilling
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MONTH-TO-MONTH
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                annualBilling
                  ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>ANNUAL (SAVE 20%)</span>
              <span className="bg-black/80 text-[#ccff00] text-[10px] px-2 py-0.5 rounded font-mono">
                $0 INITIATION
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 TIERS PRICING CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = annualBilling ? plan.annualPricePerMonth : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative shadow-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-[#ccff00] shadow-[0_0_40px_rgba(204,255,0,0.15)] lg:-translate-y-4'
                    : 'bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ccff00] text-black font-mono font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    ⚡ MOST POPULAR CHOICE
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-black font-mono uppercase tracking-widest text-[#ccff00]">
                        {plan.badge}
                      </span>
                      <h3 className="text-3xl font-black font-heading text-white tracking-wide mt-1">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-6 min-h-[36px]">
                    {plan.tagline}
                  </p>

                  {/* Pricing Display */}
                  <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800/80 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black font-heading text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="text-zinc-400 text-xs font-semibold">/ month</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 block mt-1">
                      {annualBilling ? 'Billed annually ($0 enrollment fee)' : 'Billed monthly • Cancel anytime'}
                    </span>
                  </div>

                  {/* Ideal For */}
                  <div className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 mb-6">
                    <span className="font-bold text-white block mb-0.5">BEST SUITED FOR:</span>
                    <span className="text-zinc-400">{plan.idealFor}</span>
                  </div>

                  {/* Key Highlight Perks */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider block">
                      KEY PERKS INCLUDED:
                    </span>
                    {plan.highlightPerks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-200">
                        <Check className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => setSelectedPlanForCheckout(plan)}
                    className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_25px_rgba(204,255,0,0.35)] transform hover:-translate-y-0.5'
                        : 'bg-zinc-800 hover:bg-[#ccff00] text-white hover:text-black'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>GET STARTED WITH {plan.name}</span>
                  </button>

                  <div className="text-center">
                    <button
                      onClick={onOpenFreePass}
                      className="text-[11px] text-zinc-400 hover:text-[#ccff00] transition-colors"
                    >
                      Or test with a Free 1-Day Pass →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DETAILED COMPARISON MATRIX TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            FEATURE-BY-FEATURE BREAKDOWN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            MEMBERSHIP PRIVILEGES MATRIX
          </h2>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-heading text-sm">
                  <th className="py-5 px-6 font-bold text-white">AMENITIES & PRIVILEGES</th>
                  <th className="py-5 px-6 font-bold text-center">IRON BASIC</th>
                  <th className="py-5 px-6 font-bold text-center text-[#ccff00]">IRON PRO</th>
                  <th className="py-5 px-6 font-bold text-center text-white">IRON ELITE BLACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {matrixFeatures.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4 px-6 text-zinc-200 font-medium">{row.name}</td>
                    
                    {/* Basic */}
                    <td className="py-4 px-6 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <Check className="w-4 h-4 text-[#ccff00] mx-auto" />
                        ) : (
                          <CloseIcon className="w-4 h-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-zinc-300 font-semibold">{row.basic}</span>
                      )}
                    </td>

                    {/* Pro */}
                    <td className="py-4 px-6 text-center bg-zinc-900/30">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-4 h-4 text-[#ccff00] mx-auto" />
                        ) : (
                          <CloseIcon className="w-4 h-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-[#ccff00] font-bold">{row.pro}</span>
                      )}
                    </td>

                    {/* Elite Black */}
                    <td className="py-4 px-6 text-center">
                      {typeof row.elite === 'boolean' ? (
                        row.elite ? (
                          <Check className="w-4 h-4 text-[#ccff00] mx-auto" />
                        ) : (
                          <CloseIcon className="w-4 h-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-white font-bold">{row.elite}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DROP-IN & TRAVELER PASS CARD */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              TRAVELING THROUGH METRO NY?
            </span>
            <h3 className="text-2xl font-black font-heading text-white mb-1">
              SINGLE DAY DROP-IN PASS ($25)
            </h3>
            <p className="text-xs text-zinc-400">
              Visiting for business or training with friends? Full access to lifting platform and showers.
            </p>
          </div>
          <button
            onClick={onOpenFreePass}
            className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-6 py-3.5 rounded-xl transition-all whitespace-nowrap shadow-[0_0_15px_rgba(204,255,0,0.3)]"
          >
            GET A 1-DAY PASS
          </button>
        </div>
      </section>

      {/* FAQS ACCORDION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            GOT QUESTIONS?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-heading text-lg font-bold text-white hover:text-[#ccff00] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#ccff00] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#ccff00] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        plan={selectedPlanForCheckout}
        annual={annualBilling}
        isOpen={!!selectedPlanForCheckout}
        onClose={() => setSelectedPlanForCheckout(null)}
      />
    </div>
  );
}
