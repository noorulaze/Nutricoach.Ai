import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Plus, 
  Check, 
  Utensils 
} from 'lucide-react';
import { PlannedMeal } from '../../types/mealPlanner';
import { addFoodEntry, getTodayKey } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { getFoodImageUrl } from '../../utils/foodImageDatabase';
import FoodImage from '../common/FoodImage';

interface LogMealToTrackerModalProps {
  meal: PlannedMeal | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LogMealToTrackerModal({
  meal,
  isOpen,
  onClose
}: LogMealToTrackerModalProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [mealCategory, setMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  React.useEffect(() => {
    if (meal && isOpen) {
      setMealCategory(meal.mealType);
      setSelectedDate(getTodayKey());
      setPortionMultiplier(1);
    }
  }, [meal, isOpen]);

  if (!isOpen || !meal) return null;

  const scaledCalories = Math.round(meal.calories * portionMultiplier);
  const scaledProtein = Math.round(meal.protein * portionMultiplier * 10) / 10;
  const scaledCarbs = Math.round(meal.carbs * portionMultiplier * 10) / 10;
  const scaledFat = Math.round(meal.fat * portionMultiplier * 10) / 10;
  const scaledFiber = Math.round(meal.fiber * portionMultiplier * 10) / 10;

  const handleConfirmLog = () => {
    addFoodEntry(selectedDate, {
      name: meal.name,
      meal: mealCategory,
      portion: portionMultiplier === 1 ? meal.servingSize : `${portionMultiplier}x (${meal.servingSize})`,
      grams: 200 * portionMultiplier,
      calories: scaledCalories,
      protein: scaledProtein,
      carbs: scaledCarbs,
      fat: scaledFat,
      fiber: scaledFiber,
      imageUrl: meal.imageUrl || getFoodImageUrl(meal.name, mealCategory),
      isCustom: true,
      cuisine: meal.cuisine
    });

    showToast(`Logged "${meal.name}" to ${mealCategory} on ${selectedDate}!`, 'success', 'Food Diary Updated');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-5 sm:p-7 shadow-2xl animate-fade-in space-y-4 text-xs">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#f0f4ee] dark:border-[#272E29]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eef7eb] dark:bg-[#243022] text-[#5ba83c] dark:text-[#8BAF78] flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#192418] dark:text-[#E8EDE7]">
                Log to Food Tracker
              </h3>
              <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1]">
                Record this meal directly to your daily nutritional diary.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#7a8c79] hover:text-[#192418] dark:text-[#A2AAA1] dark:hover:text-[#E8EDE7] rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Preview Card */}
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
            <h4 className="font-extrabold text-sm text-[#192418] dark:text-[#E8EDE7] truncate">
              {meal.name}
            </h4>
            <span className="text-[11px] text-[#7a8c79] dark:text-[#A2AAA1] block truncate">
              {meal.servingSize}
            </span>
            <div className="flex items-center gap-2.5 font-bold text-xs pt-0.5">
              <span className="text-[#192418] dark:text-[#E8EDE7]">{scaledCalories} kcal</span>
              <span className="text-[#5ba83c] dark:text-[#8BAF78]">{scaledProtein}g P</span>
              <span className="text-amber-600 dark:text-amber-400">{scaledCarbs}g C</span>
              <span className="text-sky-600 dark:text-sky-400">{scaledFat}g F</span>
            </div>
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-1">
            Target Diary Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[#5ba83c] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-xl pl-10 pr-3.5 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7] cursor-pointer"
            />
          </div>
        </div>

        {/* Meal Category */}
        <div>
          <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-1.5">
            Meal Slot
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setMealCategory(cat)}
                className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                  mealCategory === cat
                    ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78]'
                    : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Serving Portion Multiplier */}
        <div>
          <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider mb-1.5">
            Portion Eaten
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.5, 1, 1.5, 2].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setPortionMultiplier(m)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  portionMultiplier === m
                    ? 'border-[#5ba83c] bg-[#eef7eb] dark:bg-[#243022] text-[#3b7e23] dark:text-[#8BAF78]'
                    : 'border-[#e8ede6] dark:border-[#394139] bg-white dark:bg-[#272E29] text-[#5e6f5e] dark:text-[#A2AAA1]'
                }`}
              >
                {m}x
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLog}
            className="px-5 py-2.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-extrabold uppercase shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Log</span>
          </button>
        </div>

      </div>
    </div>
  );
}
