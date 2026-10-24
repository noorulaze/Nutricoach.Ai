import React, { useState } from 'react';
import { 
  Utensils, Plus, Trash2, Edit2, Search, 
  Check, X, AlertCircle, Sparkles, Filter, ChevronDown, CheckCircle2 
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
  const [refreshKey, setRefreshKey] = useState(0);

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

  const meals: { key: MealType; label: string; icon: string }[] = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snacks & Supplements', icon: '🍎' }
  ];

  const handleOpenAddModal = (meal: MealType) => {
    setEditingItem(null);
    setActiveMealCategory(meal);
    setSelectedPreset(null);
    setSearchQuery('');
    setFormName('');
    setFormPortion('1 serving');
    setFormCalories(150);
    setFormProtein(15);
    setFormCarbs(15);
    setFormFat(3);
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
      showToast(`${formName} added to ${activeMealCategory}`, 'success');
    }

    const updatedLog = getFoodLog(selectedDate);
    setFoods(updatedLog);
    setIsModalOpen(false);
  };

  const handleDeleteFood = (id: string, name: string) => {
    deleteFoodEntry(selectedDate, id);
    const updatedLog = getFoodLog(selectedDate);
    setFoods(updatedLog);
    showToast(`${name} deleted`, 'info');
  };

  // Quick add suggestion directly into today's log
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccff00] block mb-1">
            DAILY NUTRITION TRACKER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            MEALS & MACRONUTRIENT BALANCE
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Estimated nutrient values. Track food by portion size and observe nutritional completeness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ccff00]"
          />
        </div>
      </div>

      {/* DAILY TARGET VS CONSUMED PROGRESS DASHBOARD */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-mono font-bold uppercase text-zinc-400">
            DAY SUMMARY ({selectedDate})
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            *Nutritional values are calculated estimates
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {/* Calories */}
          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">CALORIES</span>
            <div className="text-xl sm:text-2xl font-black font-heading text-white mt-1">
              {Math.round(totals.calories)}
              <span className="text-xs font-normal text-zinc-400 font-mono"> / {profile.calorieTarget}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-orange-400 rounded-full"
                style={{ width: `${Math.min(100, (totals.calories / profile.calorieTarget) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
              {Math.round(profile.calorieTarget - totals.calories)} kcal remaining
            </span>
          </div>

          {/* Protein */}
          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">PROTEIN</span>
            <div className="text-xl sm:text-2xl font-black font-heading text-[#ccff00] mt-1">
              {Math.round(totals.protein)}g
              <span className="text-xs font-normal text-zinc-400 font-mono"> / {profile.proteinTargetGrams}g</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-[#ccff00] rounded-full"
                style={{ width: `${Math.min(100, (totals.protein / profile.proteinTargetGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
              {Math.round(profile.proteinTargetGrams - totals.protein)}g to target
            </span>
          </div>

          {/* Carbs */}
          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">CARBOHYDRATES</span>
            <div className="text-xl sm:text-2xl font-black font-heading text-cyan-400 mt-1">
              {Math.round(totals.carbs)}g
              <span className="text-xs font-normal text-zinc-400 font-mono"> / {profile.carbsTargetGrams}g</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${Math.min(100, (totals.carbs / profile.carbsTargetGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
              {Math.round(profile.carbsTargetGrams - totals.carbs)}g remaining
            </span>
          </div>

          {/* Fat */}
          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">FATS</span>
            <div className="text-xl sm:text-2xl font-black font-heading text-amber-400 mt-1">
              {Math.round(totals.fat)}g
              <span className="text-xs font-normal text-zinc-400 font-mono"> / {profile.fatTargetGrams}g</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${Math.min(100, (totals.fat / profile.fatTargetGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
              {Math.round(profile.fatTargetGrams - totals.fat)}g remaining
            </span>
          </div>

          {/* Fiber */}
          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">DIETARY FIBER</span>
            <div className="text-xl sm:text-2xl font-black font-heading text-emerald-400 mt-1">
              {Math.round(totals.fiber)}g
              <span className="text-xs font-normal text-zinc-400 font-mono"> / {profile.fiberTargetGrams}g</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, (totals.fiber / profile.fiberTargetGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1.5">
              {Math.max(0, Math.round(profile.fiberTargetGrams - totals.fiber))}g needed
            </span>
          </div>
        </div>
      </div>

      {/* 4 MEAL CATEGORIES LIST */}
      <div className="space-y-6">
        {meals.map((meal) => {
          const mealFoods = foods.filter((f) => f.meal === meal.key);
          const mealCalories = mealFoods.reduce((acc, f) => acc + f.calories, 0);
          const mealProtein = mealFoods.reduce((acc, f) => acc + f.protein, 0);

          return (
            <div
              key={meal.key}
              className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meal.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white tracking-wide">
                      {meal.label}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono">
                      {mealCalories} kcal • {mealProtein.toFixed(1)}g Protein
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddModal(meal.key)}
                  className="bg-zinc-900 hover:bg-[#ccff00] text-zinc-200 hover:text-black border border-zinc-700 font-bold uppercase text-xs tracking-wider px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD TO {meal.label.toUpperCase()}
                </button>
              </div>

              {/* Items in Meal */}
              <div className="divide-y divide-zinc-900 mt-2">
                {mealFoods.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">
                    No items logged for {meal.label.toLowerCase()} yet.
                  </div>
                ) : (
                  mealFoods.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group hover:bg-zinc-900/30 px-2 rounded-xl transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-500">
                            ({item.portion})
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5 space-x-3">
                          <span className="text-white font-bold">{item.calories} kcal</span>
                          <span className="text-[#ccff00]">{item.protein}g P</span>
                          <span className="text-cyan-400">{item.carbs}g C</span>
                          <span className="text-amber-400">{item.fat}g F</span>
                          <span className="text-emerald-400">{item.fiber}g Fiber</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Edit portion or macros"
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
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLEMENTARY FOOD SUGGESTIONS BASED ON GAPS */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#101507] to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
              NUTRIENT COMPLIANCE ASSISTANT
            </span>
            <h3 className="text-xl font-bold font-heading text-white">
              SMART MEAL RECOMMENDATIONS
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
            Tailored to {profile.dietType} • {profile.budget} budget
          </span>
        </div>

        <p className="text-xs text-zinc-300 mb-6 max-w-2xl leading-relaxed">
          Based on your recorded meals today, here are practical, nutrient-dense foods that will help close your remaining macro and fiber gaps without exceeding your calorie ceiling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gapAnalysis.suggestedFoods.map((preset, i) => (
            <div
              key={i}
              className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-[#ccff00]/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono text-[#ccff00] block">{preset.category}</span>
                <h4 className="font-bold text-sm text-white mt-0.5">{preset.name}</h4>
                <span className="text-[11px] text-zinc-400 block">{preset.defaultPortion}</span>

                <div className="grid grid-cols-2 gap-1 bg-black/60 p-2 rounded-lg my-3 text-[11px] font-mono">
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
                    <span className="text-cyan-400">{preset.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">FIBER</span>
                    <span className="text-emerald-400">{preset.fiber}g</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickAddSuggestion(preset, 'dinner')}
                className="w-full py-2 bg-zinc-800 hover:bg-[#ccff00] text-zinc-200 hover:text-black font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3 h-3" /> ADD TO DINNER
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT FOOD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              {editingItem ? 'EDIT LOGGED ENTRY' : 'LOG FOOD ENTRY'}
            </span>
            <h3 className="text-2xl font-black font-heading text-white uppercase tracking-tight mb-4">
              {editingItem ? 'MODIFY NUTRITION VALUES' : `ADD TO ${activeMealCategory.toUpperCase()}`}
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
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-none">
                  {filteredPresetFoods.slice(0, 8).map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedPreset?.name === preset.name
                          ? 'bg-[#ccff00] text-black font-bold'
                          : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
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
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
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
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              {/* Meal Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Designated Meal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {meals.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setActiveMealCategory(m.key)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        activeMealCategory === m.key
                          ? 'bg-[#ccff00] text-black shadow'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
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
                    <label className="text-zinc-500 block text-[10px]">CALORIES</label>
                    <input
                      type="number"
                      min="0"
                      value={formCalories}
                      onChange={(e) => setFormCalories(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">PROTEIN (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formProtein}
                      onChange={(e) => setFormProtein(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">CARBS (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formCarbs}
                      onChange={(e) => setFormCarbs(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">FAT (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formFat}
                      onChange={(e) => setFormFat(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block text-[10px]">FIBER (G)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formFiber}
                      onChange={(e) => setFormFiber(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                >
                  {editingItem ? 'SAVE CHANGES' : 'LOG FOOD ENTRY'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-bold"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
