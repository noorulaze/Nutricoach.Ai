import { DayPlan, PlannedMeal, ShoppingListItem } from '../types/mealPlanner';

/**
 * Categorizes an ingredient name into standard grocery supermarket aisles.
 */
export const categorizeIngredient = (name: string): ShoppingListItem['category'] => {
  const n = name.toLowerCase();

  // Produce (Fresh vegetables, herbs, fruits)
  if (
    n.includes('onion') || n.includes('shallot') || n.includes('tomato') ||
    n.includes('ginger') || n.includes('garlic') || n.includes('chili') || n.includes('chilly') ||
    n.includes('curry leave') || n.includes('coriander leave') || n.includes('cilantro') ||
    n.includes('spinach') || n.includes('cheera') || n.includes('cabbage') || n.includes('carrot') ||
    n.includes('bean') || n.includes('potato') || n.includes('broccoli') || n.includes('cucumber') ||
    n.includes('banana') || n.includes('apple') || n.includes('lemon') || n.includes('lime') ||
    n.includes('drumstick') || n.includes('ash gourd') || n.includes('pumpkin') || n.includes('brinjal') ||
    n.includes('eggplant') || n.includes('lady finger') || n.includes('okra') || n.includes('capsicum') ||
    n.includes('cauliflower') || n.includes('mint')
  ) {
    return 'Produce';
  }

  // Proteins & Dairy
  if (
    n.includes('chicken') || n.includes('beef') || n.includes('fish') || n.includes('prawn') ||
    n.includes('egg') || n.includes('paneer') || n.includes('mutton') || n.includes('turkey') ||
    n.includes('yogurt') || n.includes('curd') || n.includes('milk') || n.includes('whey') ||
    n.includes('tofu') || n.includes('salmon') || n.includes('tuna') || n.includes('sardine') ||
    n.includes('mackerel') || n.includes('ayala') || n.includes('mathi') || n.includes('cheese')
  ) {
    return 'Proteins & Dairy';
  }

  // Grains & Pulses
  if (
    n.includes('rice') || n.includes('oat') || n.includes('dal') || n.includes('dhal') ||
    n.includes('kadala') || n.includes('chana') || n.includes('cherupayar') || n.includes('moong') ||
    n.includes('parippu') || n.includes('flour') || n.includes('atta') || n.includes('rava') ||
    n.includes('semolina') || n.includes('puttu podi') || n.includes('idiyappam podi') ||
    n.includes('bread') || n.includes('quinoa') || n.includes('pasta') || n.includes('roti') ||
    n.includes('dosa batter') || n.includes('idli batter')
  ) {
    return 'Grains & Pulses';
  }

  // Spices & Oils
  if (
    n.includes('oil') || n.includes('ghee') || n.includes('butter') || n.includes('turmeric') ||
    n.includes('chili powder') || n.includes('coriander powder') || n.includes('pepper') ||
    n.includes('mustard') || n.includes('cumin') || n.includes('jeera') || n.includes('garam masala') ||
    n.includes('cardamom') || n.includes('clove') || n.includes('cinnamon') || n.includes('fenugreek') ||
    n.includes('asafoetida') || n.includes('hing') || n.includes('salt') || n.includes('vinegar')
  ) {
    return 'Spices & Oils';
  }

  // Pantry & Other
  return 'Pantry & Other';
};

/**
 * Standardizes ingredient names for reliable deduplication (e.g. "Finely chopped onions" -> "Onions").
 */
export const cleanIngredientName = (rawName: string): string => {
  let cleaned = rawName
    .replace(/\b(fresh|finely|chopped|sliced|diced|grated|crushed|minced|roasted|boiled|peeled|cut|whole)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize first letters
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  } else {
    cleaned = rawName.trim();
  }

  return cleaned;
};

/**
 * Aggregates all ingredients across daily/weekly planned meals into a single consolidated shopping list.
 * Combines identical items with matching measurement units.
 */
export const generateShoppingListFromMeals = (meals: PlannedMeal[]): ShoppingListItem[] => {
  const map = new Map<string, ShoppingListItem>();

  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      if (ing.amount <= 0) continue;

      const cleanedName = cleanIngredientName(ing.name);
      const unit = (ing.unit || 'serving').toLowerCase().trim();
      const key = `${cleanedName.toLowerCase()}___${unit}`;

      const existing = map.get(key);
      if (existing) {
        existing.amount = Math.round((existing.amount + ing.amount) * 10) / 10;
        if (!existing.usedInMeals.includes(meal.name)) {
          existing.usedInMeals.push(meal.name);
        }
      } else {
        map.set(key, {
          id: `shop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: cleanedName,
          amount: Math.round(ing.amount * 10) / 10,
          unit: ing.unit || 'unit',
          category: categorizeIngredient(cleanedName),
          checked: false,
          usedInMeals: [meal.name]
        });
      }
    }
  }

  // Convert to array and sort by category then name
  const order: Record<ShoppingListItem['category'], number> = {
    'Produce': 1,
    'Proteins & Dairy': 2,
    'Grains & Pulses': 3,
    'Spices & Oils': 4,
    'Pantry & Other': 5
  };

  return Array.from(map.values()).sort((a, b) => {
    if (order[a.category] !== order[b.category]) {
      return order[a.category] - order[b.category];
    }
    return a.name.localeCompare(b.name);
  });
};

/**
 * Generates shopping list from a complete DayPlan array (7 days or 1 day).
 */
export const generateShoppingListFromPlan = (days: DayPlan[]): ShoppingListItem[] => {
  const allMeals = days.flatMap(d => d.meals);
  return generateShoppingListFromMeals(allMeals);
};

/**
 * Exports shopping list to formatted, human-readable text suitable for copying to clipboard or messaging apps.
 */
export const formatShoppingListText = (items: ShoppingListItem[], planTitle: string = 'NutriCoach AI Grocery List'): string => {
  const lines: string[] = [];
  lines.push(`🛒 ${planTitle}`);
  lines.push(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
  lines.push(`Total Items: ${items.length}`);
  lines.push('');

  const categories: ShoppingListItem['category'][] = [
    'Produce',
    'Proteins & Dairy',
    'Grains & Pulses',
    'Spices & Oils',
    'Pantry & Other'
  ];

  for (const cat of categories) {
    const inCat = items.filter(i => i.category === cat);
    if (inCat.length === 0) continue;

    lines.push(`─── ${cat.toUpperCase()} (${inCat.length}) ───`);
    for (const item of inCat) {
      const checkMark = item.checked ? '✓' : '•';
      lines.push(`${checkMark} ${item.name} — ${item.amount} ${item.unit}`);
    }
    lines.push('');
  }

  lines.push('✨ Created with NutriCoach AI — Personalized Meal Planner');
  return lines.join('\n');
};
