import React, { useState } from 'react';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Edit3, 
  Plus, 
  Heart, 
  ShieldCheck, 
  AlertTriangle, 
  ChefHat, 
  Sparkles,
  Info
} from 'lucide-react';
import { PlannedMeal } from '../../types/mealPlanner';
import FoodImage from '../common/FoodImage';

interface PlannedMealCardProps {
  meal: PlannedMeal;
  onSwapMeal: (meal: PlannedMeal) => void;
  onEditMeal: (meal: PlannedMeal) => void;
  onLogMeal: (meal: PlannedMeal) => void;
  onToggleFavorite: (meal: PlannedMeal) => void;
  isFavorite?: boolean;
}

export default function PlannedMealCard({
  meal,
  onSwapMeal,
  onEditMeal,
  onLogMeal,
  onToggleFavorite,
  isFavorite = false
}: PlannedMealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const mealTypeLabels: Record<PlannedMeal['mealType'], { label: string; badgeClass: string }> = {
    breakfast: {
      label: 'Breakfast',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
    },
    lunch: {
      label: 'Lunch',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
    },
    dinner: {
      label: 'Dinner',
      badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40'
    },
    snack: {
      label: 'Snack / Refuel',
      badgeClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/40'
    }
  };

  const currentMeta = mealTypeLabels[meal.mealType] || mealTypeLabels.lunch;

  return (
    <div className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[28px] p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${currentMeta.badgeClass}`}>
              {currentMeta.label}
            </span>
            <span className="text-[11px] font-bold text-[#7a8c79] dark:text-[#A2AAA1] capitalize">
              {meal.cuisine.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(meal)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isFavorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-[#8e9f8e] dark:text-[#7a8c79] hover:text-rose-500 hover:bg-[#f6f8f5] dark:hover:bg-[#272E29]'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Log Button */}
            <button
              type="button"
              onClick={() => onLogMeal(meal)}
              className="p-2 rounded-xl text-[#5ba83c] dark:text-[#8BAF78] hover:bg-[#eef7eb] dark:hover:bg-[#243022] transition-colors cursor-pointer"
              title="Add to Food Tracker Diary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Food Photo Banner */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3 border border-[#e8ede6] dark:border-[#394139] shadow-2xs bg-[#f4f7f3] dark:bg-[#272E29] group">
          <FoodImage
            name={meal.name}
            imageUrl={meal.imageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={meal.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold drop-shadow-xs">
            <span className="flex items-center gap-1 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{meal.prepTimeMin} min prep</span>
            </span>
            <span className="bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 truncate max-w-[160px]">
              {meal.servingSize}
            </span>
          </div>
        </div>

        {/* Meal Name & Description */}
        <h3 className="text-base sm:text-lg font-black text-[#192418] dark:text-[#E8EDE7] tracking-tight leading-snug">
          {meal.name}
        </h3>
        
        <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] line-clamp-2 mt-1 leading-relaxed">
          {meal.description}
        </p>

        {/* Serving Size & Prep Time */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-[#7a8c79] dark:text-[#A2AAA1] mt-2.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
            <span>{meal.prepTimeMin} min prep</span>
          </span>
          <span>•</span>
          <span className="truncate">{meal.servingSize}</span>
        </div>

        {/* Nutritional Breakdown Badges */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-2.5 my-3 text-center">
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1]">Calories</span>
            <span className="text-xs font-black text-[#192418] dark:text-[#E8EDE7]">{meal.calories}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1]">Protein</span>
            <span className="text-xs font-black text-[#5ba83c] dark:text-[#8BAF78]">{meal.protein}g</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1]">Carbs</span>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">{meal.carbs}g</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#7a8c79] dark:text-[#A2AAA1]">Fat</span>
            <span className="text-xs font-black text-sky-600 dark:text-sky-400">{meal.fat}g</span>
          </div>
        </div>

        {/* Estimate Label */}
        <div className="flex items-center gap-1 text-[10px] text-[#7a8c79] dark:text-[#A2AAA1] font-medium px-1">
          <Info className="w-3 h-3 text-[#5ba83c] dark:text-[#8BAF78] shrink-0" />
          <span>Estimated values • {meal.fiber}g fiber</span>
        </div>
      </div>

      {/* Expanded Recipe & Preparation Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#f0f4ee] dark:border-[#272E29] space-y-4 animate-fade-in text-xs">
          
          {/* Ingredients Breakdown */}
          <div>
            <h4 className="font-extrabold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78]" />
              <span>Ingredients ({meal.ingredients.length})</span>
            </h4>
            <div className="divide-y divide-[#f0f4ee] dark:divide-[#272E29] bg-[#f9fbf8] dark:bg-[#222823] rounded-2xl p-2.5 border border-[#e8ede6] dark:border-[#394139]">
              {meal.ingredients.map((ing, idx) => (
                <div key={idx} className="py-1.5 px-1 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">{ing.name}</span>
                  <span className="text-[#7a8c79] dark:text-[#A2AAA1] font-semibold">
                    {ing.amount} {ing.unit} {ing.notes ? `(${ing.notes})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Instructions */}
          {meal.instructions && meal.instructions.length > 0 && (
            <div>
              <h4 className="font-extrabold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider text-[11px] mb-2">
                Preparation Steps
              </h4>
              <ol className="space-y-1.5 pl-4 list-decimal text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
                {meal.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Smart Substitutions */}
          {meal.substitutions && meal.substitutions.length > 0 && (
            <div>
              <h4 className="font-extrabold text-[#192418] dark:text-[#E8EDE7] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Substitutions</span>
              </h4>
              <div className="space-y-1.5">
                {meal.substitutions.map((sub, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-[11px]">
                    <span className="font-bold text-amber-900 dark:text-amber-200">{sub.original} → {sub.substitute}: </span>
                    <span className="text-amber-800 dark:text-amber-300/90">{sub.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergen Information */}
          <div className="p-2.5 rounded-xl bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              {meal.allergens && meal.allergens.length > 0 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-[#5e6f5e] dark:text-[#A2AAA1]">
                    Contains: <strong className="text-[#192418] dark:text-[#E8EDE7] capitalize">{meal.allergens.join(', ')}</strong>
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5ba83c] dark:text-[#8BAF78] shrink-0" />
                  <span className="text-[#5ba83c] dark:text-[#8BAF78] font-bold">
                    No major common allergens detected
                  </span>
                </>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Card Action Controls Footer */}
      <div className="pt-3 mt-3 border-t border-[#f0f4ee] dark:border-[#272E29] flex items-center justify-between gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-[#5ba83c] dark:text-[#8BAF78] hover:underline flex items-center gap-1 py-1 px-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Recipe' : 'View Recipe'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1.5">
          {/* Swap Meal Button */}
          <button
            type="button"
            onClick={() => onSwapMeal(meal)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-all flex items-center gap-1 cursor-pointer"
            title="Replace this meal with an alternative"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </button>

          {/* Edit Meal Button */}
          <button
            type="button"
            onClick={() => onEditMeal(meal)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] text-[11px] font-bold text-[#5e6f5e] dark:text-[#A2AAA1] hover:text-[#192418] dark:hover:text-[#E8EDE7] transition-all flex items-center gap-1 cursor-pointer"
            title="Edit ingredients and servings"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Log to Diary Button */}
          <button
            type="button"
            onClick={() => onLogMeal(meal)}
            className="px-2.5 py-1.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
            title="Add this meal to Food Tracker"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Meal</span>
          </button>
        </div>
      </div>

    </div>
  );
}
