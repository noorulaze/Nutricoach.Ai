import React, { useState } from 'react';
import { 
  Utensils, Plus, Trash2, Edit2, Search, 
  ChevronLeft, ChevronRight, Calendar, Sparkles, X, 
  CheckCircle2, Flame, Apple, Coffee, Moon, Sun, AlertCircle
} from 'lucide-react';
import { 
  getProfile, getFoodLog, addFoodEntry, 
  deleteFoodEntry, updateFoodEntry, analyzeNutritionGaps, getTodayKey 
} from '../utils/storage';
import { FOOD_DATABASE } from '../data/nutritionAndExerciseData';
import { FoodItem, MealType, PresetFood } from '../types';
import { useToast } from '../context/ToastContext';

export default function FoodTrackerPage() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [foods, setFoods] = useState<FoodItem[]>(() => getFoodLog(selectedDate));

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [activeMealCategory, setActiveMealCategory] = useState<MealType>('breakfast');
  
  // Quick Search Database State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<PresetFood | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPortion, setFormPortion] = useState('');
  const [formCalories, setFormCalories] = useState<number>(200);
  const [formProtein, setFormProtein] = useState<number>(20);
  const [formCarbs, setFormCarbs] = useState<number>(15);
  const [formFat, setFormFat] = useState<number>(5);
  const [formFiber, setFormFiber] = useState<number>(3);

  const profile = getProfile();

  // Reload foods on date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setFoods(getFoodLog(newDate));
  };

  const handleStepDay = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    if (isNaN(current.getTime())) return;
    current.setDate(current.getDate() + (direction === 'prev' ? -1 : 1));
    const nextStr = current.toISOString().split('T')[0];
    handleDateChange(nextStr);
  };

  const isToday = selectedDate === getTodayKey();

  const meals: { key: MealType; label: string; icon: React.ReactNode; period: string }[] = [
    { key: 'breakfast', label: 'Breakfast', icon: <Coffee className="w-4 h-4 text-amber-400" />, period: 'Morning fuel' },
    { key: 'lunch', label: 'Lunch', icon: <Sun className="w-4 h-4 text-yellow-400" />, period: 'Midday recovery' },
    { key: 'dinner', label: 'Dinner', icon: <Moon className="w-4 h-4 text-cyan-400" />, period: 'Evening repair' },
    { key: 'snack', label: 'Snacks & Supplements', icon: <Apple className="w-4 h-4 text-[#ccff00]" />, period: 'Metabolic boost' }
  ];

  const handleOpenAddModal = (meal: MealType) => {
    setEditingItem(null);
    setActiveMealCategory(meal);
    setSelectedPreset(null);
    setSearchQuery('');
    setFormName('');
    setFormPortion('1 serving');
    setFormCalories(180);
    setFormProtein(18);
    setFormCarbs(15);
    setFormFat(4);
    setFormFiber(2);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setActiveMealCategory(item.meal);
    setFormName(item.name);
    setFormPortion(item.portion);
    setFormCalories(item.calories);
    setFormProtein(item.protein);
    setFormCarbs(item.carbs);
    setFormFat(item.fat);
    setFormFiber(item.fiber);
    setIsModalOpen(true);
  };

  const handleSelectPreset = (preset: PresetFood) => {
    setSelectedPreset(preset);
    setFormName(preset.name);
    setFormPortion(preset.defaultPortion);
    setFormCalories(preset.calories);
    setFormProtein(preset.protein);
    setFormCarbs(preset.carbs);
    setFormFat(preset.fat);
    setFormFiber(preset.fiber);
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      const updated: FoodItem = {
        ...editingItem,
        name: formName,
        meal: activeMealCategory,
        portion: formPortion,
        calories: Number(formCalories) || 0,
        protein: Number(formProtein) || 0,
        carbs: Number(formCarbs) || 0,
        fat: Number(formFat) || 0,
        fiber: Number(formFiber) || 0
      };
      updateFoodEntry(selectedDate, updated);
      showToast(`${formName} updated`, 'info');
    } else {
      addFoodEntry(selectedDate, {
        name: formName,
        meal: activeMealCategory,
        portion: formPortion,
        grams: 100,
        calories: Number(formCalories) || 0,
        protein: Number(formProtein) || 0,
        carbs: Number(formCarbs) || 0,
        fat: Number(formFat) || 0,
        fiber: Number(formFiber) || 0
      });
      showToast(`${formName} logged to ${activeMealCategory}`, 'success');
    }

    const updatedLog = getFoodLog(selectedDate);
    setFoods(updatedLog);
    setIsModalOpen(false);
  };

  const handleDeleteFood = (id: string, name: string) => {
    deleteFoodEntry(selectedDate, id);
    const updatedLog = getFoodLog(selectedDate);
    setFoods(updatedLog);
    showToast(`${name} removed`, 'info');
  };

  const handleQuickAddSuggestion = (preset: PresetFood, meal: MealType = 'dinner') => {
    addFoodEntry(selectedDate, {
      name: preset.name,
      meal,
      portion: preset.defaultPortion,
      grams: preset.grams,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      fiber: preset.fiber
    });
    setFoods(getFoodLog(selectedDate));
    showToast(`Added ${preset.name} to ${meal}!`, 'success', 'Food Logged');
  };

  // Calculated totals
  const totals = foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const gapAnalysis = analyzeNutritionGaps(profile, foods);

  const filteredPresetFoods = FOOD_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const caloriesRemaining = Math.max(0, profile.calorieTarget - totals.calories);
  const caloriePercent = Math.min(100, Math.round((totals.calories / profile.calorieTarget) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header with Sleek Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
              PRECISION NUTRITION
            </span>
            <span className="text-xs text-zinc-500 font-mono">Macro & Micronutrient Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Food & Macronutrient Tracker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Log foods by portion size, monitor macro distribution, and address nutrition gaps in real time.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-1.5 rounded-2xl shadow-sm self-start md:self-auto">
          <button
            onClick={() => handleStepDay('prev')}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDateChange(getTodayKey())}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
              isToday
                ? 'bg-[#ccff00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            Today
          </button>

          <div className="flex items-center gap-1.5 px-2 text-xs font-mono text-white">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleStepDay('next')}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DAILY NUTRITION DASHBOARD CARD */}
      <div className="app-card-elevated p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
              DAILY NUTRITION TARGETS
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-semibold text-white">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-mono">
                {profile.dietType} • {profile.goal.replace('_', ' ')}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            *Nutritional values are calculated estimates
          </span>
        </div>

        {/* 5-Column Macro Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Calories Hero Card */}
          <div className="col-span-2 lg:col-span-1 bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> CALORIES
                </span>
                <span className="text-[10px] font-mono text-[#ccff00] font-bold">
                  {caloriePercent}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {Math.round(totals.calories)}
                <span className="text-xs text-zinc-500 font-normal"> / {profile.calorieTarget}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
                {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Target achieved!'}
              </span>
            </div>
          </div>

          {/* Protein */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-[#ccff00]/30 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#ccff00] uppercase font-bold">PROTEIN</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {Math.round((totals.protein / profile.proteinTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {Math.round(totals.protein)}g
                <span className="text-xs text-zinc-500 font-normal"> / {profile.proteinTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ccff00] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.protein / profile.proteinTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
                {Math.max(0, Math.round(profile.proteinTargetGrams - totals.protein))}g to reach target
              </span>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-cyan-400/30 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">CARBOHYDRATES</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {Math.round((totals.carbs / profile.carbsTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {Math.round(totals.carbs)}g
                <span className="text-xs text-zinc-500 font-normal"> / {profile.carbsTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.carbs / profile.carbsTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
                {Math.max(0, Math.round(profile.carbsTargetGrams - totals.carbs))}g remaining
              </span>
            </div>
          </div>

          {/* Fat */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-amber-400/30 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">FATS</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {Math.round((totals.fat / profile.fatTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {Math.round(totals.fat)}g
                <span className="text-xs text-zinc-500 font-normal"> / {profile.fatTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fat / profile.fatTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
                {Math.max(0, Math.round(profile.fatTargetGrams - totals.fat))}g remaining
              </span>
            </div>
          </div>

          {/* Fiber */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-400/30 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">FIBER</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {Math.round((totals.fiber / profile.fiberTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {Math.round(totals.fiber)}g
                <span className="text-xs text-zinc-500 font-normal"> / {profile.fiberTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fiber / profile.fiberTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
                {Math.max(0, Math.round(profile.fiberTargetGrams - totals.fiber))}g needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 MEAL CATEGORIES LIST */}
      <div className="space-y-5">
        {meals.map((meal) => {
          const mealFoods = foods.filter((f) => f.meal === meal.key);
          const mealCalories = mealFoods.reduce((acc, f) => acc + f.calories, 0);
          const mealProtein = mealFoods.reduce((acc, f) => acc + f.protein, 0);
          const mealCarbs = mealFoods.reduce((acc, f) => acc + f.carbs, 0);
          const mealFat = mealFoods.reduce((acc, f) => acc + f.fat, 0);

          return (
            <div key={meal.key} className="app-card p-5 sm:p-6 transition-all hover:border-zinc-700/80">
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    {meal.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {meal.label}
                      </h3>
                      <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                        • {meal.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-0.5">
                      <span className="text-white font-bold">{Math.round(mealCalories)} kcal</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-[#ccff00]">{mealProtein.toFixed(1)}g P</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-cyan-400">{mealCarbs.toFixed(1)}g C</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-amber-400">{mealFat.toFixed(1)}g F</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddModal(meal.key)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-[#ccff00] text-zinc-200 hover:text-black border border-zinc-700/80 hover:border-[#ccff00] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Food</span>
                </button>
              </div>

              {/* Items in Meal */}
              <div className="mt-3">
                {mealFoods.length === 0 ? (
                  <div
                    onClick={() => handleOpenAddModal(meal.key)}
                    className="py-5 px-4 rounded-xl border border-dashed border-zinc-800 hover:border-[#ccff00]/40 text-center cursor-pointer transition-colors group"
                  >
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#ccff00]" />
                      No items logged for {meal.label.toLowerCase()} yet. Click to add a meal or food entry.
                    </span>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-900">
                    {mealFoods.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2.5 rounded-xl hover:bg-zinc-900/40 transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                            <span className="text-[11px] font-mono text-zinc-500">
                              ({item.portion})
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 font-mono mt-0.5 flex flex-wrap items-center gap-2.5">
                            <span className="text-white font-bold">{item.calories} kcal</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-[#ccff00]">{item.protein}g Protein</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-cyan-400">{item.carbs}g Carbs</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-amber-400">{item.fat}g Fat</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-emerald-400">{item.fiber}g Fiber</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto opacity-75 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(item.id, item.name)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLEMENTARY FOOD SUGGESTIONS BASED ON GAPS */}
      <div className="app-card-elevated p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ccff00] font-bold block">
                MACRO GAP ANALYSIS
              </span>
              <h3 className="text-lg font-bold text-white">
                Recommended Foods to Complete Today's Targets
              </h3>
            </div>
          </div>
          <span className="text-xs text-zinc-400 font-mono self-start sm:self-auto bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {profile.dietType} • {profile.budget} budget
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-6 max-w-2xl leading-relaxed">
          Based on what you have logged today, here are practical, nutrient-dense foods that will close your remaining protein and micronutrient gaps without exceeding your calorie ceiling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gapAnalysis.suggestedFoods.map((preset, i) => (
            <div
              key={i}
              className="bg-zinc-900/80 border border-zinc-800/90 p-4 rounded-2xl flex flex-col justify-between hover:border-[#ccff00]/40 transition-all group"
            >
              <div>
                <span className="text-[10px] font-mono text-[#ccff00] uppercase font-bold block">
                  {preset.category}
                </span>
                <h4 className="font-bold text-sm text-white mt-1 group-hover:text-[#ccff00] transition-colors">
                  {preset.name}
                </h4>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  {preset.defaultPortion}
                </span>

                <div className="grid grid-cols-2 gap-1.5 bg-black/60 p-2.5 rounded-xl my-3 text-[11px] font-mono border border-zinc-850">
                  <div>
                    <span className="text-zinc-500 block text-[9px]">CALORIES</span>
                    <span className="text-white font-bold">{preset.calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">PROTEIN</span>
                    <span className="text-[#ccff00] font-bold">{preset.protein}g</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">CARBS</span>
                    <span className="text-cyan-400 font-medium">{preset.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">FIBER</span>
                    <span className="text-emerald-400 font-medium">{preset.fiber}g</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickAddSuggestion(preset, 'dinner')}
                className="w-full py-2 bg-zinc-800 hover:bg-[#ccff00] text-zinc-200 hover:text-black font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Dinner</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT FOOD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              {editingItem ? 'EDIT LOGGED ENTRY' : 'LOG FOOD ENTRY'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {editingItem ? 'Modify Nutrition Values' : `Add Food to ${activeMealCategory.charAt(0).toUpperCase() + activeMealCategory.slice(1)}`}
            </h3>

            {/* Quick Preset Search for Adding New Foods */}
            {!editingItem && (
              <div className="mb-6 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Quick Pick From Verified Database (50+ Items)
                </label>
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chicken, eggs, rice, tofu, oats, tuna..."
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {filteredPresetFoods.slice(0, 8).map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedPreset?.name === preset.name
                          ? 'bg-[#ccff00] text-black font-bold'
                          : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{preset.name}</span>
                        <span className="text-[10px] opacity-75">{preset.defaultPortion}</span>
                      </div>
                      <span className="font-mono text-[11px]">
                        {preset.calories} kcal • {preset.protein}g P
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual / Custom Nutrition Form */}
            <form onSubmit={handleSaveFood} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Scrambled Eggs with Sourdough"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Portion / Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPortion}
                    onChange={(e) => setFormPortion(e.target.value)}
                    placeholder="e.g. 2 eggs + 1 slice (120g)"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              {/* Meal Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Designated Meal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {meals.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setActiveMealCategory(m.key)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        activeMealCategory === m.key
                          ? 'bg-[#ccff00] text-black shadow'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {m.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition Inputs */}
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-2">
                  ESTIMATED NUTRITIONAL VALUES
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div>
                    <label className="text-zinc-400 block text-[10px] mb-1">CALORIES</label>
                    <input
                      type="number"
                      min="0"
                      value={formCalories}
                      onChange={(e) => setFormCalories(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block text-[10px] mb-1">PROTEIN (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formProtein}
                      onChange={(e) => setFormProtein(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block text-[10px] mb-1">CARBS (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formCarbs}
                      onChange={(e) => setFormCarbs(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block text-[10px] mb-1">FAT (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formFat}
                      onChange={(e) => setFormFat(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block text-[10px] mb-1">FIBER (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formFiber}
                      onChange={(e) => setFormFiber(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                >
                  {editingItem ? 'Save Changes' : 'Log Food Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
