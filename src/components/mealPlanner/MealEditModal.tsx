import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Calculator, 
  Clock, 
  ChefHat 
} from 'lucide-react';
import { PlannedMeal, MealIngredient } from '../../types/mealPlanner';
import { INGREDIENTS_DATABASE, IngredientItem } from '../../data/ingredientsData';

interface MealEditModalProps {
  meal: PlannedMeal | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMeal: PlannedMeal) => void;
}

export default function MealEditModal({
  meal,
  isOpen,
  onClose,
  onSave
}: MealEditModalProps) {
  const [name, setName] = useState('');
  const [servings, setServings] = useState(1);
  const [prepTimeMin, setPrepTimeMin] = useState(20);
  const [ingredients, setIngredients] = useState<MealIngredient[]>([]);
  
  // New ingredient adder state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientItem | null>(null);
  const [newAmount, setNewAmount] = useState(50);
  const [newUnit, setNewUnit] = useState('g');

  useEffect(() => {
    if (meal && isOpen) {
      setName(meal.name);
      setServings(meal.servings || 1);
      setPrepTimeMin(meal.prepTimeMin || 20);
      setIngredients(meal.ingredients.map(i => ({ ...i })));
    }
  }, [meal, isOpen]);

  if (!isOpen || !meal) return null;

  // Calculate live nutrition based on ingredients and servings
  // Each ingredient contributes to calories, protein, carbs, fat
  const calculateNutrition = () => {
    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    for (const ing of ingredients) {
      if (ing.amount <= 0) continue;
      // Search matching ingredient in ingredients database
      const found = INGREDIENTS_DATABASE.find(
        i => i.name.toLowerCase() === ing.name.toLowerCase() ||
             i.id === ing.id ||
             ing.name.toLowerCase().includes(i.name.toLowerCase())
      );

      // Estimate grams
      let grams = ing.amount;
      const unit = ing.unit.toLowerCase();
      if (unit === 'tbsp') grams = ing.amount * 14;
      else if (unit === 'tsp') grams = ing.amount * 5;
      else if (unit === 'cup' || unit === 'bowl') grams = ing.amount * 150;
      else if (unit === 'piece' || unit === 'egg') grams = ing.amount * 50;
      else if (unit === 'clove') grams = ing.amount * 4;

      if (found) {
        const factor = grams / 100;
        totalCals += found.per100g.calories * factor;
        totalProt += found.per100g.protein * factor;
        totalCarbs += found.per100g.carbs * factor;
        totalFat += found.per100g.fat * factor;
        totalFiber += (found.per100g.fiber || 0) * factor;
      } else {
        // Balanced generic estimate per 100g
        const factor = grams / 100;
        totalCals += 150 * factor;
        totalProt += 6 * factor;
        totalCarbs += 18 * factor;
        totalFat += 4 * factor;
        totalFiber += 2 * factor;
      }
    }

    const safeServings = Math.max(1, servings);
    return {
      calories: Math.max(50, Math.round(totalCals * safeServings)),
      protein: Math.max(1, Math.round(totalProt * safeServings * 10) / 10),
      carbs: Math.max(1, Math.round(totalCarbs * safeServings * 10) / 10),
      fat: Math.max(1, Math.round(totalFat * safeServings * 10) / 10),
      fiber: Math.max(0.5, Math.round(totalFiber * safeServings * 10) / 10)
    };
  };

  const currentMacros = calculateNutrition();

  const handleUpdateIngredient = (index: number, field: keyof MealIngredient, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient) return;
    setIngredients([
      ...ingredients,
      {
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        amount: newAmount,
        unit: newUnit,
        notes: ''
      }
    ]);
    setSelectedIngredient(null);
    setSearchQuery('');
  };

  const handleSave = () => {
    const updated: PlannedMeal = {
      ...meal,
      name,
      servings,
      prepTimeMin,
      ingredients,
      calories: currentMacros.calories,
      protein: currentMacros.protein,
      carbs: currentMacros.carbs,
      fat: currentMacros.fat,
      fiber: currentMacros.fiber,
      servingSize: `${servings} serving${servings > 1 ? 's' : ''}`,
      isEstimate: true
    };
    onSave(updated);
  };

  const filteredDatabase = searchQuery.trim().length > 1
    ? INGREDIENTS_DATABASE.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-[32px] p-5 sm:p-7 shadow-2xl my-4 animate-fade-in max-h-[92vh] overflow-y-auto touch-scroll">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#f0f4ee] dark:border-[#272E29]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] dark:text-[#8BAF78] bg-[#eef7eb] dark:bg-[#243022] px-2.5 py-0.5 rounded-full border border-[#d6ebd0] dark:border-[#3A4B35]">
              RECIPE & NUTRITION EDITOR
            </span>
            <h2 className="text-xl font-black text-[#192418] dark:text-[#E8EDE7] mt-1">
              Edit Planned Meal
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#7a8c79] hover:text-[#192418] dark:text-[#A2AAA1] dark:hover:text-[#E8EDE7] rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 pt-4 text-xs">
          {/* Meal Name */}
          <div>
            <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">Meal Title</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#192418] dark:text-[#E8EDE7]"
            />
          </div>

          {/* Servings & Prep Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">Number of Servings</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 rounded-lg bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] font-black text-[#192418] dark:text-[#E8EDE7]"
                >
                  -
                </button>
                <span className="font-black text-sm text-[#192418] dark:text-[#E8EDE7] px-2">{servings}</span>
                <button
                  type="button"
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 rounded-lg bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] font-black text-[#192418] dark:text-[#E8EDE7]"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] dark:text-[#E8EDE7] mb-1">Prep Time (min)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={prepTimeMin}
                onChange={e => setPrepTimeMin(Number(e.target.value))}
                className="w-full bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3.5 py-2 text-xs font-bold text-[#192418] dark:text-[#E8EDE7]"
              />
            </div>
          </div>

          {/* Recalculated Live Nutrition Summary */}
          <div className="bg-[#eef7eb] dark:bg-[#243022] border border-[#d6ebd0] dark:border-[#3A4B35] rounded-2xl p-3 flex items-center justify-around text-center">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#3b7e23] dark:text-[#8BAF78]">Calories</span>
              <span className="text-sm font-black text-[#192418] dark:text-[#E8EDE7]">{currentMacros.calories} kcal</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#3b7e23] dark:text-[#8BAF78]">Protein</span>
              <span className="text-sm font-black text-[#3b7e23] dark:text-[#8BAF78]">{currentMacros.protein}g</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#3b7e23] dark:text-[#8BAF78]">Carbs</span>
              <span className="text-sm font-black text-amber-700 dark:text-amber-300">{currentMacros.carbs}g</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#3b7e23] dark:text-[#8BAF78]">Fat</span>
              <span className="text-sm font-black text-sky-700 dark:text-sky-300">{currentMacros.fat}g</span>
            </div>
          </div>

          {/* Ingredient Lines */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-xs text-[#192418] dark:text-[#E8EDE7] uppercase">
                Ingredients & Quantities ({ingredients.length})
              </label>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto touch-scroll pr-1">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#f9fbf8] dark:bg-[#222823] p-2 rounded-xl border border-[#e8ede6] dark:border-[#394139]">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={e => handleUpdateIngredient(i, 'name', e.target.value)}
                    className="flex-1 bg-transparent text-xs font-bold text-[#192418] dark:text-[#E8EDE7] focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    value={ing.amount}
                    onChange={e => handleUpdateIngredient(i, 'amount', Number(e.target.value))}
                    className="w-16 bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-lg px-2 py-1 text-xs font-bold text-center"
                  />
                  <select
                    value={ing.unit}
                    onChange={e => handleUpdateIngredient(i, 'unit', e.target.value)}
                    className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-lg px-2 py-1 text-xs font-bold"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="piece">piece</option>
                    <option value="cup">cup</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(i)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Ingredient Section */}
          <div className="bg-[#f6f8f5] dark:bg-[#272E29] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-3 space-y-2">
            <span className="font-bold text-xs text-[#192418] dark:text-[#E8EDE7] block">
              + Add Ingredient from Food Database
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search food item (e.g. Chicken, Coconut oil, Oats)"
                className="flex-1 bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-xl px-3 py-1.5 text-xs text-[#192418] dark:text-[#E8EDE7]"
              />
            </div>

            {/* Search Suggestions */}
            {filteredDatabase.length > 0 && (
              <div className="divide-y divide-[#e8ede6] dark:divide-[#394139] bg-white dark:bg-[#1C211D] rounded-xl border border-[#e8ede6] dark:border-[#394139] overflow-hidden">
                {filteredDatabase.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedIngredient(item);
                      setSearchQuery(item.name);
                    }}
                    className="w-full text-left p-2 hover:bg-[#f6f8f5] dark:hover:bg-[#272E29] text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-bold text-[#192418] dark:text-[#E8EDE7]">{item.name}</span>
                    <span className="text-[#7a8c79] text-[10px]">{item.per100g.calories} kcal/100g</span>
                  </button>
                ))}
              </div>
            )}

            {selectedIngredient && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  value={newAmount}
                  onChange={e => setNewAmount(Number(e.target.value))}
                  className="w-16 bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-lg px-2 py-1 text-xs font-bold text-center"
                />
                <select
                  value={newUnit}
                  onChange={e => setNewUnit(e.target.value)}
                  className="bg-white dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-lg px-2 py-1 text-xs font-bold"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="piece">piece</option>
                  <option value="cup">cup</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3 py-1 bg-[#5ba83c] hover:bg-[#4d9630] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Add to Recipe
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#f0f4ee] dark:border-[#272E29] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e8ede6] dark:border-[#394139] text-xs font-bold text-[#5e6f5e] dark:text-[#A2AAA1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#5ba83c] hover:bg-[#4d9630] text-white text-xs font-extrabold uppercase shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
