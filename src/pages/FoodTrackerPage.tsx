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
    { key: 'breakfast', label: 'Breakfast', icon: <Coffee className="w-4 h-4 text-amber-500" />, period: 'Morning fuel' },
    { key: 'lunch', label: 'Lunch', icon: <Sun className="w-4 h-4 text-orange-500" />, period: 'Midday recovery' },
    { key: 'dinner', label: 'Dinner', icon: <Moon className="w-4 h-4 text-sky-500" />, period: 'Evening repair' },
    { key: 'snack', label: 'Snacks & Supplements', icon: <Apple className="w-4 h-4 text-[#5ba83c]" />, period: 'Metabolic boost' }
  ];

  // Daily Totals calculation
  const totals = foods.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const caloriesRemaining = Math.max(0, Math.round(profile.calorieTarget - totals.calories));
  const caloriePercent = Math.min(100, Math.round((totals.calories / profile.calorieTarget) * 100)) || 0;

  // Gap analysis recommendations
  const gapAnalysis = analyzeNutritionGaps(profile, foods);

  // Filtered preset foods for database search
  const filteredPresetFoods = FOOD_DATABASE.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenAddModal = (meal: MealType) => {
    setEditingItem(null);
    setActiveMealCategory(meal);
    setSelectedPreset(null);
    setSearchQuery('');
    setFormName('');
    setFormPortion('');
    setFormCalories(200);
    setFormProtein(20);
    setFormCarbs(15);
    setFormFat(5);
    setFormFiber(3);
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

  const handleQuickAddSuggestion = (preset: PresetFood, meal: MealType = 'lunch') => {
    const newEntry: FoodItem = {
      id: 'food_' + Date.now(),
      name: preset.name,
      meal,
      portion: preset.defaultPortion,
      grams: preset.grams,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      fiber: preset.fiber,
      isCustom: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: preset.category,
      budgetFriendly: preset.budgetFriendly
    };
    addFoodEntry(selectedDate, newEntry);
    setFoods(getFoodLog(selectedDate));
    showToast(`Added ${preset.name} to ${meal}!`, 'success', 'Food Logged');
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a valid food name', 'error');
      return;
    }

    if (editingItem) {
      const updated: FoodItem = {
        ...editingItem,
        name: formName.trim(),
        portion: formPortion.trim() || '1 serving',
        meal: activeMealCategory,
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        fiber: Number(formFiber)
      };
      updateFoodEntry(selectedDate, updated);
      showToast(`Updated ${formName}`, 'success', 'Entry Saved');
    } else {
      const newEntry: Omit<FoodItem, 'id' | 'timestamp'> = {
        name: formName.trim(),
        portion: formPortion.trim() || '1 serving',
        grams: 100,
        meal: activeMealCategory,
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        fiber: Number(formFiber),
        isCustom: !selectedPreset
      };
      addFoodEntry(selectedDate, newEntry);
      showToast(`Added ${formName} to ${activeMealCategory}`, 'success', 'Food Logged');
    }

    setFoods(getFoodLog(selectedDate));
    setIsModalOpen(false);
  };

  const handleDeleteFood = (id: string, name: string) => {
    deleteFoodEntry(selectedDate, id);
    setFoods(getFoodLog(selectedDate));
    showToast(`Removed ${name}`, 'info', 'Item Removed');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER & DATE SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8ede6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
              PRECISION NUTRITION
            </span>
            <span className="text-xs text-[#7a8c79] font-medium">Macro & Micronutrient Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
            Food & Macronutrient Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
            Log foods by portion size, monitor macro distribution, and address nutrition gaps in real time.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 bg-white border border-[#e8ede6] p-1.5 rounded-2xl shadow-xs self-start md:self-auto">
          <button
            onClick={() => handleStepDay('prev')}
            className="p-1.5 text-[#7a8c79] hover:text-[#192418] hover:bg-[#f6f8f5] rounded-xl transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDateChange(getTodayKey())}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isToday
                ? 'bg-[#5ba83c] text-white shadow-xs'
                : 'text-[#5e6f5e] hover:text-[#192418] hover:bg-[#f6f8f5]'
            }`}
          >
            Today
          </button>

          <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-[#192418]">
            <Calendar className="w-3.5 h-3.5 text-[#5ba83c]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent text-[#192418] text-xs font-medium focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleStepDay('next')}
            className="p-1.5 text-[#7a8c79] hover:text-[#192418] hover:bg-[#f6f8f5] rounded-xl transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DAILY NUTRITION TARGETS CARD */}
      <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7a8c79] font-bold block">
              DAILY NUTRITION TARGETS
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-[#192418]">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-[#8e9f8e]">•</span>
              <span className="text-xs text-[#5e6f5e] capitalize">
                {profile.dietType} • {profile.goal.replace('_', ' ')}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#8e9f8e] italic">
            *Nutritional values are calculated estimates
          </span>
        </div>

        {/* 5-Column Macro Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Calories Hero Card */}
          <div className="col-span-2 lg:col-span-1 bg-[#f9fbf8] border border-[#e8ede6] p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#7a8c79] uppercase font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> CALORIES
                </span>
                <span className="text-[10px] text-[#5ba83c] font-bold">
                  {caloriePercent}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.calories).toLocaleString()}
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.calorieTarget.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 w-full bg-[#eef7eb] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5ba83c] rounded-full transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Target achieved!'}
              </span>
            </div>
          </div>

          {/* Protein: Pastel Coral */}
          <div className="bg-[#fff9f9] border border-rose-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-rose-500 uppercase font-bold">PROTEIN</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.protein / profile.proteinTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.protein)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.proteinTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-rose-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#fb7185] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.protein / profile.proteinTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.proteinTargetGrams - totals.protein))}g to reach target
              </span>
            </div>
          </div>

          {/* Carbs: Pastel Amber */}
          <div className="bg-[#fffcf7] border border-amber-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-amber-600 uppercase font-bold">CARBS</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.carbs / profile.carbsTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.carbs)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.carbsTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-amber-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#f59e0b] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.carbs / profile.carbsTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.carbsTargetGrams - totals.carbs))}g remaining
              </span>
            </div>
          </div>

          {/* Fats: Pastel Blue */}
          <div className="bg-[#f8fcff] border border-sky-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-sky-600 uppercase font-bold">FATS</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.fat / profile.fatTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.fat)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.fatTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-sky-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38bdf8] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fat / profile.fatTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.fatTargetGrams - totals.fat))}g remaining
              </span>
            </div>
          </div>

          {/* Fiber: Pastel Mint */}
          <div className="bg-[#f8fdfa] border border-emerald-100 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">FIBER</span>
                <span className="text-[10px] text-[#7a8c79] font-bold">
                  {Math.round((totals.fiber / profile.fiberTargetGrams) * 100)}%
                </span>
              </div>
              <div className="text-2xl font-black text-[#192418] tracking-tight">
                {Math.round(totals.fiber)}g
                <span className="text-xs text-[#7a8c79] font-normal"> / {profile.fiberTargetGrams}g</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full bg-emerald-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totals.fiber / profile.fiberTargetGrams) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a8c79] font-medium block mt-1.5">
                {Math.max(0, Math.round(profile.fiberTargetGrams - totals.fiber))}g needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 MEAL CATEGORIES LIST */}
      <div className="space-y-4">
        {meals.map((meal) => {
          const mealFoods = foods.filter((f) => f.meal === meal.key);
          const mealCalories = mealFoods.reduce((acc, f) => acc + f.calories, 0);
          const mealProtein = mealFoods.reduce((acc, f) => acc + f.protein, 0);
          const mealCarbs = mealFoods.reduce((acc, f) => acc + f.carbs, 0);
          const mealFat = mealFoods.reduce((acc, f) => acc + f.fat, 0);

          return (
            <div key={meal.key} className="bg-white border border-[#e8ede6] rounded-[24px] p-5 sm:p-6 transition-all hover:border-[#d6e2d3] shadow-xs">
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0f4ee]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f6f8f5] border border-[#e8ede6] flex items-center justify-center">
                    {meal.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#192418]">
                        {meal.label}
                      </h3>
                      <span className="text-[11px] text-[#7a8c79] hidden sm:inline">
                        • {meal.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-[#5e6f5e] mt-0.5">
                      <span className="text-[#192418] font-bold">{Math.round(mealCalories)} kcal</span>
                      <span className="text-[#cbd7c8]">|</span>
                      <span className="font-semibold text-rose-600">{mealProtein.toFixed(1)}g P</span>
                      <span className="text-[#cbd7c8]">|</span>
                      <span className="font-semibold text-amber-600">{mealCarbs.toFixed(1)}g C</span>
                      <span className="text-[#cbd7c8]">|</span>
                      <span className="font-semibold text-sky-600">{mealFat.toFixed(1)}g F</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddModal(meal.key)}
                  className="px-3.5 py-2 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Log Food</span>
                </button>
              </div>

              {/* Items in Meal */}
              <div className="mt-3">
                {mealFoods.length === 0 ? (
                  <div
                    onClick={() => handleOpenAddModal(meal.key)}
                    className="py-5 px-4 rounded-2xl border border-dashed border-[#e8ede6] hover:border-[#5ba83c]/50 text-center cursor-pointer transition-colors group bg-[#fdfefd]"
                  >
                    <span className="text-xs text-[#7a8c79] group-hover:text-[#192418] transition-colors flex items-center justify-center gap-2 font-medium">
                      <Plus className="w-3.5 h-3.5 text-[#8e9f8e] group-hover:text-[#5ba83c]" />
                      No items logged for {meal.label.toLowerCase()} yet. Click to add a meal or food entry.
                    </span>
                  </div>
                ) : (
                  <div className="divide-y divide-[#f0f4ee]">
                    {mealFoods.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2.5 rounded-xl hover:bg-[#f6f8f5] transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#192418]">{item.name}</h4>
                            <span className="text-[11px] text-[#7a8c79]">
                              ({item.portion})
                            </span>
                          </div>
                          <div className="text-xs text-[#5e6f5e] mt-0.5 flex flex-wrap items-center gap-2.5">
                            <span className="text-[#192418] font-bold">{item.calories} kcal</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-rose-600">{item.protein}g Protein</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-amber-600">{item.carbs}g Carbs</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-sky-600">{item.fat}g Fat</span>
                            <span className="text-[#cbd7c8]">•</span>
                            <span className="font-medium text-emerald-600">{item.fiber}g Fiber</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto opacity-75 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-[#7a8c79] hover:text-[#192418] rounded-xl hover:bg-white border border-transparent hover:border-[#e8ede6] transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(item.id, item.name)}
                            className="p-1.5 text-[#7a8c79] hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
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
      <div className="bg-gradient-to-br from-[#eef7eb] via-[#f7fbf6] to-[#e7f4e3] border border-[#d6ebd0] rounded-[28px] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#5ba83c]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] block">
                MACRO GAP ANALYSIS
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#192418]">
                Recommended Foods to Complete Today's Targets
              </h3>
            </div>
          </div>
          <span className="text-xs text-[#5e6f5e] font-medium self-start sm:self-auto bg-white px-3 py-1 rounded-full border border-[#d6ebd0]">
            {profile.dietType} • {profile.budget} budget
          </span>
        </div>

        <p className="text-xs text-[#5e6f5e] mb-5 max-w-2xl leading-relaxed font-medium">
          Based on what you have logged today, here are practical, nutrient-dense foods that will close your remaining protein and micronutrient gaps without exceeding your calorie ceiling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gapAnalysis.suggestedFoods.map((preset, i) => (
            <div
              key={i}
              className="bg-white border border-[#d6ebd0] p-4 rounded-2xl flex flex-col justify-between hover:border-[#5ba83c] transition-all shadow-xs group"
            >
              <div>
                <span className="text-[10px] text-[#3b7e23] uppercase font-bold block">
                  {preset.category}
                </span>
                <h4 className="font-bold text-sm text-[#192418] mt-1 group-hover:text-[#5ba83c] transition-colors">
                  {preset.name}
                </h4>
                <span className="text-[11px] text-[#7a8c79] block mt-0.5">
                  {preset.defaultPortion}
                </span>

                <div className="grid grid-cols-2 gap-1.5 bg-[#f6f8f5] p-2.5 rounded-xl my-3 text-[11px] border border-[#e8ede6]">
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">CALORIES</span>
                    <span className="text-[#192418] font-bold">{preset.calories} kcal</span>
                  </div>
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">PROTEIN</span>
                    <span className="text-rose-600 font-bold">{preset.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">CARBS</span>
                    <span className="text-amber-600 font-medium">{preset.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[#8e9f8e] block text-[9px] font-bold">FIBER</span>
                    <span className="text-emerald-600 font-medium">{preset.fiber}g</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickAddSuggestion(preset, 'dinner')}
                className="w-full py-2 bg-[#eef7eb] hover:bg-[#5ba83c] text-[#3b7e23] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#7a8c79] hover:text-[#192418] p-2 rounded-xl bg-[#f6f8f5] hover:bg-[#edf2ea] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
              {editingItem ? 'EDIT LOGGED ENTRY' : 'LOG FOOD ENTRY'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#192418] mb-4">
              {editingItem ? 'Modify Nutrition Values' : `Add Food to ${activeMealCategory.charAt(0).toUpperCase() + activeMealCategory.slice(1)}`}
            </h3>

            {/* Quick Preset Search for Adding New Foods */}
            {!editingItem && (
              <div className="mb-6 bg-[#f6f8f5] p-4 rounded-2xl border border-[#e8ede6]">
                <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-2">
                  Quick Pick From Verified Database (50+ Items)
                </label>
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-[#8e9f8e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chicken, eggs, rice, tofu, oats, tuna..."
                    className="w-full bg-white border border-[#e8ede6] rounded-xl pl-9 pr-3 py-2 text-xs text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
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
                          ? 'bg-[#5ba83c] text-white font-bold'
                          : 'bg-white text-[#192418] hover:bg-[#edf2ea]'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{preset.name}</span>
                        <span className="text-[10px] opacity-75">{preset.defaultPortion}</span>
                      </div>
                      <span className="text-[11px] font-semibold">
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
                  <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Scrambled Eggs with Sourdough"
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                    Portion / Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPortion}
                    onChange={(e) => setFormPortion(e.target.value)}
                    placeholder="e.g. 2 eggs + 1 slice (120g)"
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                  />
                </div>
              </div>

              {/* Meal Selector */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1.5">
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
                          ? 'bg-[#5ba83c] text-white shadow-xs'
                          : 'bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6]'
                      }`}
                    >
                      {m.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition Inputs */}
              <div>
                <span className="text-[10px] text-[#7a8c79] uppercase font-bold block mb-2">
                  ESTIMATED NUTRITIONAL VALUES
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div>
                    <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">CALORIES</label>
                    <input
                      type="number"
                      min="0"
                      value={formCalories}
                      onChange={(e) => setFormCalories(Number(e.target.value))}
                      className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">PROTEIN (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formProtein}
                      onChange={(e) => setFormProtein(Number(e.target.value))}
                      className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">CARBS (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formCarbs}
                      onChange={(e) => setFormCarbs(Number(e.target.value))}
                      className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">FAT (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formFat}
                      onChange={(e) => setFormFat(Number(e.target.value))}
                      className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#7a8c79] block text-[10px] font-bold mb-1">FIBER (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formFiber}
                      onChange={(e) => setFormFiber(Number(e.target.value))}
                      className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418] font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all shadow-xs active:scale-[0.98]"
                >
                  {editingItem ? 'Save Changes' : 'Log Food Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3.5 bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] rounded-2xl text-xs font-bold border border-[#e8ede6]"
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
