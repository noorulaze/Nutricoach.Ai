import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Utensils, 
  DollarSign, 
  ShieldAlert, 
  Check, 
  Flame, 
  Target,
  Plus
} from 'lucide-react';
import { 
  MealPlannerPreferences, 
  PlanDuration, 
  PlanDietaryPreference, 
  PlanCuisine, 
  PlanBudget, 
  PlanCookingTime, 
  PlanGoal 
} from '../../types/mealPlanner';

interface MealPreferenceModalProps {
  isOpen: boolean;
  initialPreferences: MealPlannerPreferences;
  onClose: () => void;
  onSubmit: (preferences: MealPlannerPreferences) => void;
  isGenerating?: boolean;
}

const COMMON_ALLERGIES = [
  'Peanuts', 
  'Dairy / Milk', 
  'Gluten / Wheat', 
  'Shellfish', 
  'Fish', 
  'Eggs', 
  'Tree Nuts', 
  'Soy', 
  'Mustard', 
  'Sesame', 
  'Coconut'
];

const CUISINE_OPTIONS: { id: PlanCuisine; label: string; desc: string }[] = [
  { id: 'kerala', label: 'Kerala Authentic', desc: 'Puttu, Appam, Fish Curry, Avial, Thoran' },
  { id: 'south_indian', label: 'South Indian', desc: 'Dosa, Idli, Sambar, Rasam, Chutneys' },
  { id: 'north_indian', label: 'North Indian', desc: 'Chapati, Dal Tadka, Paneer, Subzis' },
  { id: 'international', label: 'International', desc: 'Grilled proteins, Oatmeal, Salads, Wraps' }
];

export default function MealPreferenceModal({
  isOpen,
  initialPreferences,
  onClose,
  onSubmit,
  isGenerating = false
}: MealPreferenceModalProps) {
  const [duration, setDuration] = useState<PlanDuration>(initialPreferences.duration);
  const [dietaryPreference, setDietaryPreference] = useState<PlanDietaryPreference>(initialPreferences.dietaryPreference);
  const [cuisines, setCuisines] = useState<PlanCuisine[]>(initialPreferences.cuisines);
  const [allergies, setAllergies] = useState<string[]>(initialPreferences.allergies || []);
  const [customAllergy, setCustomAllergy] = useState('');
  const [dislikedInput, setDislikedInput] = useState((initialPreferences.dislikedFoods || []).join(', '));
  const [budget, setBudget] = useState<PlanBudget>(initialPreferences.budget);
  const [cookingTime, setCookingTime] = useState<PlanCookingTime>(initialPreferences.cookingTime);
  const [mealsPerDay, setMealsPerDay] = useState<number>(initialPreferences.mealsPerDay || 3);
  const [pantryInput, setPantryInput] = useState((initialPreferences.availableIngredients || []).join(', '));
  const [goal, setGoal] = useState<PlanGoal>(initialPreferences.goal);
  const [targetCalories, setTargetCalories] = useState<number>(initialPreferences.targetCalories || 1800);

  useEffect(() => {
    if (isOpen) {
      setDuration(initialPreferences.duration);
      setDietaryPreference(initialPreferences.dietaryPreference);
      setCuisines(initialPreferences.cuisines);
      setAllergies(initialPreferences.allergies || []);
      setDislikedInput((initialPreferences.dislikedFoods || []).join(', '));
      setBudget(initialPreferences.budget);
      setCookingTime(initialPreferences.cookingTime);
      setMealsPerDay(initialPreferences.mealsPerDay || 3);
      setPantryInput((initialPreferences.availableIngredients || []).join(', '));
      setGoal(initialPreferences.goal);
      setTargetCalories(initialPreferences.targetCalories || 1800);
    }
  }, [isOpen, initialPreferences]);

  if (!isOpen) return null;

  const toggleCuisine = (c: PlanCuisine) => {
    if (cuisines.includes(c)) {
      if (cuisines.length > 1) {
        setCuisines(cuisines.filter(item => item !== c));
      }
    } else {
      setCuisines([...cuisines, c]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    const clean = allergy.toLowerCase();
    if (allergies.some(a => a.toLowerCase() === clean)) {
      setAllergies(allergies.filter(a => a.toLowerCase() !== clean));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const addCustomAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies([...allergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dislikedFoods = dislikedInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const availableIngredients = pantryInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const prefs: MealPlannerPreferences = {
      ...initialPreferences,
      duration,
      dietaryPreference,
      cuisines,
      allergies,
      dislikedFoods,
      budget,
      cookingTime,
      mealsPerDay,
      availableIngredients,
      goal,
      targetCalories
    };

    onSubmit(prefs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-5 sm:p-8 shadow-2xl my-4 animate-fade-in max-h-[92vh] overflow-y-auto touch-scroll">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f4ee] dark:border-[#272E29]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#243022] px-2.5 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#3A4B35]">
                PREFERENCE PROFILE
              </span>
              <span className="text-xs text-[#7a8c79] dark:text-[#A2AAA1] font-medium">NutriCoach AI Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight">
              Personalize Your Meal Plan
            </h2>
            <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] mt-0.5">
              Customize duration, authentic cuisines, dietary safety, and macro goals.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-[#7a8c79] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] rounded-2xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-5">
          
          {/* 1. Plan Duration */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
              Plan Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDuration('1_day')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  duration === '1_day'
                    ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] shadow-xs'
                    : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5]'
                }`}
              >
                <div>
                  <span className="block font-black text-sm">1 Day Plan</span>
                  <span className="text-[11px] opacity-80">Full day daily focus</span>
                </div>
                {duration === '1_day' && <Check className="w-4 h-4 text-[#5ba83c] shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setDuration('7_days')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                  duration === '7_days'
                    ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] shadow-xs'
                    : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5]'
                }`}
              >
                <div>
                  <span className="block font-black text-sm">7 Days (Full Week)</span>
                  <span className="text-[11px] opacity-80">Mon to Sun structured menu</span>
                </div>
                {duration === '7_days' && <Check className="w-4 h-4 text-[#5ba83c] shrink-0" />}
              </button>
            </div>
          </div>

          {/* 2. Dietary Preference */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
              Dietary Lifestyle
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, seafood, egg' },
                { id: 'non_vegetarian', label: 'Non-Vegetarian', desc: 'Chicken, fish, beef, eggs' },
                { id: 'flexible', label: 'Flexible', desc: 'Mixed balanced diet' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDietaryPreference(opt.id as PlanDietaryPreference)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                    dietaryPreference === opt.id
                      ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] shadow-xs'
                      : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5]'
                  }`}
                >
                  <span className="block font-bold">{opt.label}</span>
                  <span className="text-[10px] opacity-75 font-medium leading-tight block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Preferred Cuisines */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
              Preferred Cuisines (Multi-select)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CUISINE_OPTIONS.map(c => {
                const isSelected = cuisines.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCuisine(c.id)}
                    className={`p-3 rounded-2xl border text-xs transition-all text-left flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78] font-bold shadow-xs'
                        : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5]'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{c.label}</span>
                      <span className="text-[10px] opacity-75 leading-tight block mt-0.5">{c.desc}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#5ba83c] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Strict Allergen Protection (Food Safety First) */}
          <div className="bg-[#fcfaf7] dark:bg-[#212621] border border-[#f3e9dc] dark:border-[#3d3830] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider">
                  Food Allergies & Exclusions
                </h4>
                <p className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1]">
                  NutriCoach AI strictly eliminates declared allergens from all recommendations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_ALLERGIES.map(allergy => {
                const isChecked = allergies.some(a => a.toLowerCase() === allergy.toLowerCase());
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    }`}
                  >
                    {isChecked ? `✕ ${allergy}` : `+ ${allergy}`}
                  </button>
                );
              })}
            </div>

            {/* Custom Allergy Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customAllergy}
                onChange={e => setCustomAllergy(e.target.value)}
                placeholder="Add other ingredient to avoid (e.g. Mushroom, Sesame)"
                className="flex-1 bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3 py-2 text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]"
              />
              <button
                type="button"
                onClick={addCustomAllergy}
                className="px-3.5 py-2 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* 5. Meals Per Day & Cooking Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
                Meals Per Day
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMealsPerDay(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      mealsPerDay === num
                        ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78]'
                        : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1]'
                    }`}
                  >
                    {num} meals
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
                Available Cooking Time
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'quick', label: '< 20 min' },
                  { id: 'moderate', label: '20-40 min' },
                  { id: 'relaxed', label: '40+ min' }
                ].map(ct => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => setCookingTime(ct.id as PlanCookingTime)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      cookingTime === ct.id
                        ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78]'
                        : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1]'
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Budget & Primary Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
                Food Budget
              </label>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value as PlanBudget)}
                className="w-full bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-2.5 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c] cursor-pointer"
              >
                <option value="budget">Economical (Budget-friendly staples & local pulses)</option>
                <option value="moderate">Moderate (Standard home cooking balance)</option>
                <option value="flexible">Flexible (Premium proteins, salmon, specialty spices)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-2">
                Target Calories / Day
              </label>
              <div className="relative">
                <Flame className="w-4 h-4 text-[#5ba83c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1200"
                  max="4500"
                  step="50"
                  value={targetCalories}
                  onChange={e => setTargetCalories(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]"
                />
              </div>
            </div>
          </div>

          {/* 7. Disliked Foods & Available Pantry Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-1.5">
                Disliked Foods (Optional)
              </label>
              <input
                type="text"
                value={dislikedInput}
                onChange={e => setDislikedInput(e.target.value)}
                placeholder="e.g. Bitter gourd, Capsicum, Okra"
                className="w-full bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl px-3.5 py-2.5 text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-1.5">
                Available In My Pantry (Optional)
              </label>
              <input
                type="text"
                value={pantryInput}
                onChange={e => setPantryInput(e.target.value)}
                placeholder="e.g. Eggs, Rice, Kadala, Oats, Chicken"
                className="w-full bg-white dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl px-3.5 py-2.5 text-xs text-[#192418] dark:text-[#E8EDE7] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#f0f4ee] dark:border-[#272E29] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-5 py-3 rounded-2xl border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-3 rounded-2xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Plan...' : 'Generate My Meal Plan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
