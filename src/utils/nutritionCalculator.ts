import { IngredientItem, MeasurementUnit, INGREDIENTS_BY_ID } from '../data/ingredientsData';
import { CookingMethodType, DishRecipeIngredient } from '../data/dishRecipes';

export interface CalculatedIngredientLine {
  ingredient: IngredientItem;
  amount: number;
  unit: MeasurementUnit;
  rawGrams: number;
  cookedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodiumMg: number;
  notes?: string;
  isRemovable?: boolean;
}

export interface MacroSummary {
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodiumMg?: number;
}

export interface DishNutritionResult {
  servings: number;
  cookingMethod: CookingMethodType;
  lines: CalculatedIngredientLine[];
  totalDish: MacroSummary;
  perServing: MacroSummary;
  macroPercentages: {
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
  accuracyMetadata: {
    isEstimate: boolean;
    verificationLabel: string;
    sources: string[];
    waterYieldNote: string;
  };
}

/**
 * Converts any measurement unit to grams for a given ingredient.
 */
export const calculateGramsFromUnit = (
  amount: number,
  unit: MeasurementUnit,
  ingredient: IngredientItem
): number => {
  if (amount <= 0) return 0;
  const factor = ingredient.unitGramFactors[unit] ?? (unit === 'g' || unit === 'ml' ? 1 : 10);
  return Math.round(amount * factor * 10) / 10;
};

/**
 * Calculates exact nutrition for a single ingredient line item based on its grams.
 */
export const calculateSingleIngredientNutrition = (
  ingredient: IngredientItem,
  amount: number,
  unit: MeasurementUnit
) => {
  const rawGrams = calculateGramsFromUnit(amount, unit, ingredient);
  const factor = rawGrams / 100;

  const yieldFactor = ingredient.cookingYieldFactor ?? 1.0;
  const cookedGrams = Math.round(rawGrams * yieldFactor);

  const calories = Math.round(ingredient.per100g.calories * factor);
  const protein = Math.round(ingredient.per100g.protein * factor * 10) / 10;
  const carbs = Math.round(ingredient.per100g.carbs * factor * 10) / 10;
  const fat = Math.round(ingredient.per100g.fat * factor * 10) / 10;
  const fiber = Math.round(ingredient.per100g.fiber * factor * 10) / 10;
  const sodiumMg = ingredient.per100g.sodiumMg ? Math.round(ingredient.per100g.sodiumMg * factor) : 0;

  return {
    rawGrams,
    cookedGrams,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sodiumMg
  };
};

/**
 * Live Recalculation Engine:
 * Sums all active ingredient lines, accounts for cooking method yield changes,
 * computes total batch and per-serving nutrition, and generates verification metadata.
 */
export const calculateLiveDishNutrition = (
  recipeIngredients: (DishRecipeIngredient & { active?: boolean })[],
  servings: number,
  cookingMethod: CookingMethodType = 'gravy_simmered',
  isRecipeEstimated: boolean = false
): DishNutritionResult => {
  const safeServings = Math.max(1, servings);
  const lines: CalculatedIngredientLine[] = [];
  const sourcesSet = new Set<string>();
  let hasEstimateIngredient = isRecipeEstimated;

  let totalRawGrams = 0;
  let totalCookedGrams = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodiumMg = 0;

  for (const item of recipeIngredients) {
    if (item.active === false || item.amount <= 0) continue;

    const ingData = INGREDIENTS_BY_ID.get(item.ingredientId);
    if (!ingData) continue;

    sourcesSet.add(ingData.source);
    if (ingData.isEstimate) hasEstimateIngredient = true;

    const lineCalc = calculateSingleIngredientNutrition(ingData, item.amount, item.unit);

    lines.push({
      ingredient: ingData,
      amount: item.amount,
      unit: item.unit,
      rawGrams: lineCalc.rawGrams,
      cookedGrams: lineCalc.cookedGrams,
      calories: lineCalc.calories,
      protein: lineCalc.protein,
      carbs: lineCalc.carbs,
      fat: lineCalc.fat,
      fiber: lineCalc.fiber,
      sodiumMg: lineCalc.sodiumMg,
      notes: item.notes,
      isRemovable: item.isRemovable ?? true
    });

    totalRawGrams += lineCalc.rawGrams;
    totalCookedGrams += lineCalc.cookedGrams;
    totalCalories += lineCalc.calories;
    totalProtein += lineCalc.protein;
    totalCarbs += lineCalc.carbs;
    totalFat += lineCalc.fat;
    totalFiber += lineCalc.fiber;
    totalSodiumMg += lineCalc.sodiumMg;
  }

  // Cooking method specific adjustments:
  // For 'gravy_simmered', liquids are retained in the gravy.
  // For 'roasted', ~10% extra moisture evaporates from vegetables & meats.
  if (cookingMethod === 'roasted') {
    totalCookedGrams = Math.round(totalCookedGrams * 0.9);
  }

  const totalDish: MacroSummary = {
    grams: Math.round(totalCookedGrams),
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10,
    sodiumMg: Math.round(totalSodiumMg)
  };

  const perServing: MacroSummary = {
    grams: Math.round(totalCookedGrams / safeServings),
    calories: Math.round(totalCalories / safeServings),
    protein: Math.round((totalProtein / safeServings) * 10) / 10,
    carbs: Math.round((totalCarbs / safeServings) * 10) / 10,
    fat: Math.round((totalFat / safeServings) * 10) / 10,
    fiber: Math.round((totalFiber / safeServings) * 10) / 10,
    sodiumMg: Math.round(totalSodiumMg / safeServings)
  };

  // Macro Energy Ratios (4 kcal/g protein, 4 kcal/g carb, 9 kcal/g fat)
  const proteinKcal = perServing.protein * 4;
  const carbsKcal = perServing.carbs * 4;
  const fatKcal = perServing.fat * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const macroPercentages = {
    proteinPercent: Math.round((proteinKcal / totalMacroKcal) * 100),
    carbsPercent: Math.round((carbsKcal / totalMacroKcal) * 100),
    fatPercent: Math.round((fatKcal / totalMacroKcal) * 100)
  };

  // Verification label and water yield note
  let verificationLabel = 'ICMR-NIN & USDA Verified Ingredient Data';
  if (hasEstimateIngredient) {
    verificationLabel = 'Custom Estimated Recipe Formula';
  }

  let waterYieldNote = 'Accounts for moisture evaporation and raw-to-cooked yield without nutrient dilution.';
  if (cookingMethod === 'gravy_simmered') {
    waterYieldNote = 'Gravy simmering retains water-soluble nutrients and dispersed cooking oils.';
  } else if (cookingMethod === 'steamed') {
    waterYieldNote = 'Steam cooking retains high dietary fiber and active micronutrients with zero added oil.';
  } else if (cookingMethod === 'roasted') {
    waterYieldNote = 'Pan roasting evaporates surface moisture for concentrated flavor and crisp texture.';
  }

  return {
    servings: safeServings,
    cookingMethod,
    lines,
    totalDish,
    perServing,
    macroPercentages,
    accuracyMetadata: {
      isEstimate: hasEstimateIngredient,
      verificationLabel,
      sources: Array.from(sourcesSet),
      waterYieldNote
    }
  };
};

/**
 * Calculates differences between customized serving nutrition and original baseline.
 */
export const calculateNutritionDiff = (
  customized: MacroSummary,
  original: MacroSummary
) => {
  return {
    caloriesDiff: Math.round(customized.calories - original.calories),
    proteinDiff: Math.round((customized.protein - original.protein) * 10) / 10,
    carbsDiff: Math.round((customized.carbs - original.carbs) * 10) / 10,
    fatDiff: Math.round((customized.fat - original.fat) * 10) / 10,
    fiberDiff: Math.round((customized.fiber - original.fiber) * 10) / 10
  };
};
