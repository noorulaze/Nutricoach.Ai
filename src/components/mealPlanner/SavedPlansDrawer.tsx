import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Flame
} from 'lucide-react';
import { SavedMealPlan } from '../../types/mealPlanner';
import { useToast } from '../../context/ToastContext';

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SavedMealPlan[];
  onLoadPlan: (plan: SavedMealPlan) => void;
  onDeletePlan: (planId: string) => void;
}

export default function SavedPlansDrawer({
  isOpen,
  onClose,
  savedPlans,
  onLoadPlan,
  onDeletePlan
}: SavedPlansDrawerProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-[#1C211D] border-l border-[#e8ede6] dark:border-[#394139] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto touch-scroll">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#f0f4ee] dark:border-[#272E29]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eef7eb] dark:bg-[#243022] text-[#5ba83c] dark:text-[#8BAF78] flex items-center justify-center font-bold">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#192418] dark:text-[#E8EDE7]">
                  Saved Meal Plans
                </h3>
                <span className="text-xs text-[#7a8c79] dark:text-[#A2AAA1]">
                  {savedPlans.length} plans stored in your library
                </span>
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

          {/* List of Plans */}
          <div className="py-4 space-y-3">
            {savedPlans.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#f6f8f5] dark:bg-[#272E29] flex items-center justify-center text-[#7a8c79] mx-auto">
                  <Bookmark className="w-6 h-6 opacity-40" />
                </div>
                <h4 className="font-bold text-sm text-[#192418] dark:text-[#E8EDE7]">
                  No Saved Plans Yet
                </h4>
                <p className="text-xs text-[#5e6f5e] dark:text-[#A2AAA1] max-w-xs mx-auto">
                  When you create a meal plan you love, click "Save Plan" to revisit it anytime.
                </p>
              </div>
            ) : (
              savedPlans.map(plan => {
                const avgCalories = Math.round(
                  plan.days.reduce((acc, d) => acc + d.totalCalories, 0) / Math.max(1, plan.days.length)
                );
                const totalMeals = plan.days.reduce((acc, d) => acc + d.meals.length, 0);

                return (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl bg-[#f9fbf8] dark:bg-[#222823] border border-[#e8ede6] dark:border-[#394139] hover:border-[#5ba83c]/50 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#5ba83c] dark:text-[#8BAF78] tracking-wider block">
                          {plan.duration === '1_day' ? '1 Day Plan' : '7 Days (Weekly)'}
                        </span>
                        <h4 className="font-extrabold text-sm text-[#192418] dark:text-[#E8EDE7]">
                          {plan.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${plan.name}" from your saved library?`)) {
                            onDeletePlan(plan.id);
                            showToast(`Deleted "${plan.name}"`, 'info');
                          }
                        }}
                        className="p-1 text-[#8e9f8e] hover:text-rose-500 rounded-lg cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-[#7a8c79] dark:text-[#A2AAA1]">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#5ba83c]" />
                        <span>~{avgCalories} kcal/day</span>
                      </span>
                      <span>•</span>
                      <span>{totalMeals} total meals</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#f0f4ee] dark:border-[#272E29]">
                      <span className="text-[10px] text-[#8e9f8e] dark:text-[#7a8c79]">
                        {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          onLoadPlan(plan);
                          onClose();
                          showToast(`Loaded "${plan.name}"!`, 'success');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <span>Open Plan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#f0f4ee] dark:border-[#272E29]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] cursor-pointer"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
