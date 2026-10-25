import React from 'react';
import { 
  Leaf, 
  Utensils, 
  Sparkles, 
  TrendingUp, 
  Heart, 
  ShoppingBag, 
  Calendar 
} from 'lucide-react';
import grainBowlImg from '../assets/food/grain-bowl.jpg';

export default function AuthWellnessBanner() {
  return (
    <div className="relative w-full lg:w-[54%] xl:w-[56%] bg-gradient-to-br from-[#f2f7ef] via-[#f7faf5] to-[#ebf4e8] p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Decorative Botanical Foliage in background */}
      <div className="absolute -top-10 -left-10 w-48 h-48 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-[#5ba83c]">
          <path d="M40 0C60 40 80 80 120 100C160 120 180 160 200 200C160 180 120 160 100 120C80 80 40 60 0 40Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 -right-12 w-64 h-64 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-[#5ba83c]">
          <path d="M100 0C120 60 160 100 200 120C160 140 120 180 100 200C80 140 40 100 0 80C40 60 80 20 100 0Z" />
        </svg>
      </div>
      <div className="absolute -bottom-10 -left-10 w-52 h-52 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-[#5ba83c]">
          <path d="M0 100C40 120 80 160 100 200C120 160 160 120 200 100C160 80 120 40 100 0C80 40 40 80 0 100Z" />
        </svg>
      </div>

      {/* Top Brand Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#5ba83c] flex items-center justify-center text-white shadow-xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M21 3c-6.627 0-12 5.373-12 12 0 1.258.196 2.47.558 3.606L3 21l2.394-6.558C4.196 13.31 4 12.098 4 11 4 4.373 9.373-1 16-1c2.146 0 4.148.566 5.88 1.558L21 3z" />
          </svg>
        </div>
        <div>
          <span className="font-heading font-black text-2xl text-[#192418] tracking-tight block leading-tight">
            NutriCoach <span className="text-[#5ba83c]">AI</span>
          </span>
          <span className="text-xs font-semibold text-[#7a8c79] block">
            Better Food. Healthier You.
          </span>
        </div>
      </div>

      {/* Main Presentation Area */}
      <div className="relative z-10 my-auto py-8 lg:py-12">
        {/* Main Heading matching the mockup */}
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#192418] leading-[1.12] tracking-tight">
            Your Personal<br />
            <span className="text-[#65a33c]">Nutrition Coach</span><br />
            Powered by AI
          </h1>

          <p className="text-xs sm:text-sm text-[#5e6f5e] font-medium leading-relaxed mt-4 max-w-md">
            Get personalized meal plans, track your nutrition, stay active and build healthier habits — all in one place.
          </p>
        </div>

        {/* Two-Column Showcase: Features List on Left + Hero Bowl with Floating Badges on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-8">
          
          {/* Left Column: 4 Feature Pillars */}
          <div className="md:col-span-5 space-y-4">
            {/* 1. Personalized Meal Plans */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#eaf4e6] border border-[#d8ecd2] flex items-center justify-center text-[#5ba83c] shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-[#5ba83c]/20" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#192418] leading-tight">
                  Personalized Meal Plans
                </h4>
                <p className="text-[11px] text-[#7a8c79] font-medium mt-0.5">
                  Based on your goals & preferences
                </p>
              </div>
            </div>

            {/* 2. Nutrition Tracking */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#e6f4fb] border border-[#cbeaf8] flex items-center justify-center text-[#38bdf8] shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#192418] leading-tight">
                  Nutrition Tracking
                </h4>
                <p className="text-[11px] text-[#7a8c79] font-medium mt-0.5">
                  Know what your body needs
                </p>
              </div>
            </div>

            {/* 3. AI Health Coach */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#fef9e8] border border-[#fef0c7] flex items-center justify-center text-[#f59e0b] shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 fill-[#f59e0b]/20" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#192418] leading-tight">
                  AI Health Coach
                </h4>
                <p className="text-[11px] text-[#7a8c79] font-medium mt-0.5">
                  Ask anything, anytime
                </p>
              </div>
            </div>

            {/* 4. Track Progress */}
            <div className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#f3f0fc] border border-[#e4dcfb] flex items-center justify-center text-[#8b5cf6] shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#192418] leading-tight">
                  Track Progress
                </h4>
                <p className="text-[11px] text-[#7a8c79] font-medium mt-0.5">
                  See your journey, stay motivated
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Circular Grain Bowl + Floating Badges */}
          <div className="md:col-span-7 relative flex items-center justify-center py-6">
            {/* The Main Round Grain Bowl */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
              <img
                src={grainBowlImg}
                alt="Nutritious grain bowl with avocado, chickpeas, and fresh greens"
                className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white transition-transform duration-700 hover:scale-102"
              />

              {/* Floating Badge 1: Balanced Nutrition (Top Right) */}
              <div className="absolute -top-3 -right-2 sm:right-2 bg-white/95 backdrop-blur-xs border border-[#e8ede6] shadow-md rounded-2xl py-2 px-3 flex items-center gap-2 animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-[#eaf4e6] flex items-center justify-center text-[#5ba83c]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-extrabold text-[#192418] block leading-tight">
                    Balanced Nutrition
                  </span>
                  <span className="text-[9px] text-[#7a8c79] font-medium block">
                    Fuel your body right
                  </span>
                </div>
              </div>

              {/* Floating Badge 2: Smart Meal Plans (Top Left) */}
              <div className="absolute top-10 -left-6 sm:-left-4 bg-white/95 backdrop-blur-xs border border-[#e8ede6] shadow-md rounded-2xl py-2 px-3 flex items-center gap-2 animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-[#e6f4fb] flex items-center justify-center text-[#38bdf8]">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-extrabold text-[#192418] block leading-tight">
                    Smart Meal Plans
                  </span>
                  <span className="text-[9px] text-[#7a8c79] font-medium block">
                    For your goals
                  </span>
                </div>
              </div>

              {/* Floating Badge 3: Better Health (Bottom Left) */}
              <div className="absolute -bottom-2 -left-2 sm:left-4 bg-white/95 backdrop-blur-xs border border-[#e8ede6] shadow-md rounded-2xl py-2 px-3 flex items-center gap-2 animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-extrabold text-[#192418] block leading-tight">
                    Better Health
                  </span>
                  <span className="text-[9px] text-[#7a8c79] font-medium block">
                    Every day
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Script / Handwriting Motto matching the mockup */}
      <div className="relative z-10 pt-4">
        <div className="inline-flex items-center gap-2 text-[#467b2d] font-serif italic text-base sm:text-lg">
          <span>Healthy Habits, Better Tomorrow</span>
          <span className="text-xl">🍃</span>
        </div>
      </div>

    </div>
  );
}
