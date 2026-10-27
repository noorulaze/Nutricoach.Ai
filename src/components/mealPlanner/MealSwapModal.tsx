import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  Flame, 
  Utensils 
} from 'lucide-react';
import { PlannedMeal } from '../../types/mealPlanner';
import FoodImage from '../common/FoodImage';

interface MealSwapModalProps {
  meal: PlannedMeal | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSwap: (meal: PlannedMeal, userPrompt?: string) => Promise<void>;
  isSwapping?: boolean;
}

const QUICK_SUGGESTIONS = [
  'Surprise me with Kerala authentic dish',
  'High protein alternative',
  'Quick prep under 20 minutes',
  'Comforting lentil / curry dish',
  'Light & easy to digest'
];

export default function MealSwapModal({
  meal,
  isOpen,
  onClose,
  onConfirmSwap,
  isSwapping = false
}: MealSwapModalProps) {
  const [prompt, setPrompt] = useState('');

  if (!isOpen || !meal) return null;

  const handleSwap = async (customPrompt?: string) => {
    const finalPrompt = customPrompt !== undefined ? customPrompt : prompt;
    await onConfirmSwap(meal, finalPrompt);
    setPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-5 sm:p-7 shadow-2xl animate-fade-in space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#f0f4ee] dark:border-[#272E29]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#243022] px-2.5 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#3A4B35]">
              MEAL REPLACEMENT
            </span>
            <h2 className="text-xl font-black text-[#192418] dark:text-[#E8EDE7] mt-1">
              Swap This Meal
            </h2>
            <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1]">
              Regenerate only this meal while preserving the rest of your plan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSwapping}
            className="p-2 text-[#7a8c79] hover:text-[#192418] dark:text-[#A2AAA1] dark:hover:text-[#E8EDE7] rounded-xl cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Meal Summary Card */}
        <div className="bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#e8ede6] dark:border-[#394139] shadow-2xs bg-white dark:bg-[#1C211D]">
            <FoodImage
              name={meal.name}
              imageUrl={meal.imageUrl}
              className="w-full h-full object-cover"
              alt={meal.name}
            />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] font-black uppercase text-[#7a8c79] dark:text-[#A2AAA1] block">
              CURRENT SELECTION • {meal.dayName} ({meal.mealType})
            </span>
            <h4 className="font-extrabold text-sm text-[#192418] dark:text-[#E8EDE7] truncate">
              {meal.name}
            </h4>
            <div className="flex items-center gap-2 text-xs font-bold text-[#5ba83c] dark:text-[#8BAF78]">
              <span>{meal.calories} kcal</span>
              <span>•</span>
              <span>{meal.protein}g P</span>
              <span>•</span>
              <span>{meal.prepTimeMin} min</span>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <label className="block text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
            What would you prefer instead?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                  prompt === sug
                    ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] font-bold'
                    : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#1C211D] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5]'
                }`}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div>
          <label className="block text-[11px] font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-1.5">
            Or Type Custom Instructions (Optional)
          </label>
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Something with eggs and spinach, or no coconut"
            className="w-full bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSwapping}
            className="px-4 py-2.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSwap()}
            disabled={isSwapping}
            className="px-5 py-2.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-extrabold uppercase shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin' : ''}`} />
            <span>{isSwapping ? 'Regenerating...' : 'Swap Meal'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
