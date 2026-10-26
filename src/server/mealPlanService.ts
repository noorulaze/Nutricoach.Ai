import { 
  MealPlannerPreferences, 
  PlannedMeal, 
  DayPlan 
} from '../types/mealPlanner';
import { 
  generateAuthenticMealPlan, 
  swapSingleMealFromTemplates, 
  isMealSafeFromAllergies 
} from '../utils/authenticMealPlannerEngine';

export interface GenerateMealPlanRequest {
  preferences: MealPlannerPreferences;
  apiKey?: string;
}

export interface GenerateMealPlanResponse {
  success: boolean;
  isAIGenerated: boolean;
  needsApiKey?: boolean;
  sourceModel?: string;
  days: DayPlan[];
  error?: string;
  disclaimer: string;
}

export interface SwapMealRequest {
  preferences: MealPlannerPreferences;
  currentMeal: PlannedMeal;
  userPrompt?: string;
  apiKey?: string;
}

export interface SwapMealResponse {
  success: boolean;
  isAIGenerated: boolean;
  meal: PlannedMeal;
  error?: string;
}

const MEDICAL_DISCLAIMER = 'Estimated nutritional values for general fitness and wellness guidance only. Not medical or clinical nutrition advice.';

/**
 * Server-side generation handler for complete daily or 7-day meal plans.
 */
export const executeGenerateMealPlan = async (
  payload: GenerateMealPlanRequest,
  serverEnvApiKey?: string
): Promise<GenerateMealPlanResponse> => {
  const prefs = payload.preferences;
  if (!prefs) {
    return {
      success: false,
      isAIGenerated: false,
      days: [],
      error: 'Missing meal planner preferences.',
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  // 1. Resolve API Key (server env first, then user-provided profile key)
  const resolvedApiKey = serverEnvApiKey || process.env.GEMINI_API_KEY || payload.apiKey;

  // 2. If NO API key is available, run authentic culinary engine and indicate configuration guidance
  if (!resolvedApiKey || resolvedApiKey.trim().length < 10) {
    const authenticDays = generateAuthenticMealPlan(prefs);
    return {
      success: true,
      isAIGenerated: false,
      needsApiKey: true,
      sourceModel: 'NutriCoach Authentic Culinary Engine (ICMR-NIN Standard)',
      days: authenticDays,
      disclaimer: MEDICAL_DISCLAIMER
    };
  }

  // 3. AI Service Call via Google Gemini API
  try {
    const daysCount = prefs.duration === '1_day' ? 1 : 7;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].slice(0, daysCount);

    const prompt = `
You are the executive clinical chef and sports nutritionist for NutriCoach AI.
Generate an authentic, highly detailed, portion-precise personalized meal plan for ${daysCount} day(s) (${dayNames.join(', ')}).

USER PREFERENCES & CONSTRAINTS:
- Duration: ${prefs.duration === '1_day' ? '1 Day (Today)' : '7 Days (Weekly)'}
- Dietary Preference: ${prefs.dietaryPreference.toUpperCase()} (${prefs.dietaryPreference === 'vegetarian' ? 'STRICTLY VEGETARIAN: No meat, poultry, fish, seafood or egg' : 'Non-Vegetarian / Flexible'})
- Preferred Cuisines: ${prefs.cuisines.join(', ')} (Feature authentic Kerala dishes like Puttu, Appam, Idiyappam, Dosa, Idli, Kerala Matta Rice, Chicken/Fish/Egg curries, Sambar, Avial, Thoran, Olan, Erissery, Kadala curry, Cherupayar curry, Parippu curry, and balanced international meals)
- Declared Allergies & Avoidances: ${prefs.allergies.length > 0 ? prefs.allergies.join(', ') : 'None'}
- Disliked Foods: ${prefs.dislikedFoods.length > 0 ? prefs.dislikedFoods.join(', ') : 'None'}
- Budget Tier: ${prefs.budget}
- Cooking Time: ${prefs.cookingTime}
- Meals Per Day: ${prefs.mealsPerDay || 3}
- Available Pantry Ingredients: ${prefs.availableIngredients.length > 0 ? prefs.availableIngredients.join(', ') : 'Standard kitchen staples'}
- Primary Goal: ${prefs.goal}
- Target Daily Calories: ~${prefs.targetCalories || 1800} kcal (Protein: ~${prefs.targetProtein || 110}g, Carbs: ~${prefs.targetCarbs || 200}g, Fat: ~${prefs.targetFat || 50}g)

CRITICAL FOOD SAFETY & ALLERGY DIRECTIVE:
${prefs.allergies.length > 0 ? `NEVER include, suggest, or use any declared allergens: [${prefs.allergies.join(', ')}] or their derivatives under any circumstances.` : ''}

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON array of objects representing each day. Do not wrap in markdown quotes if possible, or use standard json block.
JSON structure must match:
[
  {
    "dayIndex": 0,
    "dayName": "Monday",
    "totalCalories": 1820,
    "totalProtein": 112,
    "totalCarbs": 205,
    "totalFat": 48,
    "totalFiber": 32,
    "meals": [
      {
        "id": "meal_0_breakfast",
        "dayIndex": 0,
        "dayName": "Monday",
        "mealType": "breakfast",
        "name": "Puttu with Kadala Curry",
        "cuisine": "kerala",
        "description": "Steamed coarse rice layered with coconut, served with roasted black chickpea shallot gravy.",
        "servings": 1,
        "servingSize": "1 piece puttu (120g) + 1 bowl curry (150g)",
        "prepTimeMin": 25,
        "calories": 420,
        "protein": 14.5,
        "carbs": 66.0,
        "fat": 10.5,
        "fiber": 9.5,
        "ingredients": [
          { "name": "Rice puttu flour", "amount": 80, "unit": "g", "notes": "Coarse" },
          { "name": "Fresh grated coconut", "amount": 25, "unit": "g" },
          { "name": "Black chickpeas (Kadala)", "amount": 70, "unit": "g" }
        ],
        "instructions": [
          "Moisten puttu podi with salted warm water.",
          "Steam in puttu maker for 6-8 minutes.",
          "Simmer boiled chickpeas with shallots and roasted spices."
        ],
        "substitutions": [
          { "original": "Rice flour", "substitute": "Wheat or Ragi puttu flour", "note": "Higher fiber" }
        ],
        "allergens": ["coconut"],
        "isEstimate": true
      }
    ]
  }
]
`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${resolvedApiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API call returned non-200, falling back to authentic engine', errText);
      const fallbackDays = generateAuthenticMealPlan(prefs);
      return {
        success: true,
        isAIGenerated: false,
        sourceModel: 'NutriCoach Authentic Culinary Engine (Network Fallback)',
        days: fallbackDays,
        disclaimer: MEDICAL_DISCLAIMER
      };
    }

    const data: any = await response.json();
    const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonText) {
      throw new Error('Empty response from AI service');
    }

    // Clean and parse JSON
    const cleanedJson = rawJsonText
      .replace(/^```json/im, '')
      .replace(/^```/im, '')
      .replace(/```$/im, '')
      .trim();

    const parsedDays: DayPlan[] = JSON.parse(cleanedJson);

    // Validate and sanitize parsed days against declared allergies
    for (const day of parsedDays) {
      for (let i = 0; i < day.meals.length; i++) {
        const meal = day.meals[i];
        if (!isMealSafeFromAllergies(meal, prefs.allergies)) {
          console.warn(`Allergen detected in AI generated meal ${meal.name}, replacing with safe template`);
          day.meals[i] = swapSingleMealFromTemplates(meal, prefs);
        }
        // Ensure unique IDs
        if (!meal.id || meal.id.startsWith('meal_0')) {
          meal.id = `meal_${day.dayIndex}_${meal.mealType}_${Date.now()}_${i}`;
        }
        meal.isEstimate = true;
      }
      // Re-sum day totals
      day.totalCalories = day.meals.reduce((s, m) => s + m.calories, 0);
      day.totalProtein = Math.round(day.meals.reduce((s, m) => s + m.protein, 0) * 10) / 10;
      day.totalCarbs = Math.round(day.meals.reduce((s, m) => s + m.carbs, 0) * 10) / 10;
      day.totalFat = Math.round(day.meals.reduce((s, m) => s + m.fat, 0) * 10) / 10;
      day.totalFiber = Math.round(day.meals.reduce((s, m) => s + m.fiber, 0) * 10) / 10;
    }

    return {
      success: true,
      isAIGenerated: true,
      sourceModel: 'Google Gemini 2.5 Flash',
      days: parsedDays,
      disclaimer: MEDICAL_DISCLAIMER
    };
  } catch (err: any) {
    console.error('Error generating AI meal plan, falling back to authentic engine', err);
    const fallbackDays = generateAuthenticMealPlan(prefs);
    return {
      success: true,
      isAIGenerated: false,
      sourceModel: 'NutriCoach Authentic Culinary Engine (Automatic Recovery)',
      days: fallbackDays,
      error: err?.message,
      disclaimer: MEDICAL_DISCLAIMER
    };
  }
};

/**
 * Server-side handler for swapping / regenerating a single meal.
 */
export const executeSwapMeal = async (
  payload: SwapMealRequest,
  serverEnvApiKey?: string
): Promise<SwapMealResponse> => {
  const { preferences, currentMeal, userPrompt, apiKey } = payload;
  if (!preferences || !currentMeal) {
    return {
      success: false,
      isAIGenerated: false,
      meal: currentMeal,
      error: 'Missing meal swap payload parameters.'
    };
  }

  const resolvedApiKey = serverEnvApiKey || process.env.GEMINI_API_KEY || apiKey;

  // If no API key, use authentic template swap
  if (!resolvedApiKey || resolvedApiKey.trim().length < 10) {
    const replaced = swapSingleMealFromTemplates(currentMeal, preferences, userPrompt);
    return {
      success: true,
      isAIGenerated: false,
      meal: replaced
    };
  }

  // Call Gemini for targeted single meal swap
  try {
    const prompt = `
You are the executive clinical chef for NutriCoach AI.
Generate ONE single replacement meal to replace "${currentMeal.name}" (${currentMeal.mealType}) on ${currentMeal.dayName}.

USER PREFERENCES & CONSTRAINTS:
- Meal Type: ${currentMeal.mealType}
- Dietary Preference: ${preferences.dietaryPreference}
- Cuisines: ${preferences.cuisines.join(', ')}
- Declared Allergies (STRICTLY FORBIDDEN): ${preferences.allergies.join(', ') || 'None'}
- Disliked Foods: ${preferences.dislikedFoods.join(', ') || 'None'}
- User Specific Request / Note: ${userPrompt || 'Provide an authentic, healthy alternative with similar nutritional density'}
- Target Calories for this meal: ~${currentMeal.calories} kcal (Protein: ~${currentMeal.protein}g)

Respond ONLY with a single JSON object matching:
{
  "id": "meal_swap_${Date.now()}",
  "dayIndex": ${currentMeal.dayIndex},
  "dayName": "${currentMeal.dayName}",
  "mealType": "${currentMeal.mealType}",
  "name": "Dish Name",
  "cuisine": "kerala",
  "description": "Short culinary description.",
  "servings": 1,
  "servingSize": "1 portion",
  "prepTimeMin": 20,
  "calories": 400,
  "protein": 20,
  "carbs": 50,
  "fat": 12,
  "fiber": 6,
  "ingredients": [
    { "name": "Ingredient 1", "amount": 100, "unit": "g" }
  ],
  "instructions": [
    "Step 1", "Step 2"
  ],
  "substitutions": [
    { "original": "Item", "substitute": "Alt", "note": "Reason" }
  ],
  "allergens": [],
  "isEstimate": true
}
`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${resolvedApiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      }
    );

    if (response.ok) {
      const data: any = await response.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJson) {
        const cleaned = rawJson.replace(/^```json/im, '').replace(/^```/im, '').replace(/```$/im, '').trim();
        const parsed: PlannedMeal = JSON.parse(cleaned);
        if (isMealSafeFromAllergies(parsed, preferences.allergies)) {
          parsed.id = `meal_swap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          parsed.isEstimate = true;
          return {
            success: true,
            isAIGenerated: true,
            meal: parsed
          };
        }
      }
    }
  } catch (err) {
    console.warn('AI meal swap failed, falling back to template swap', err);
  }

  const fallback = swapSingleMealFromTemplates(currentMeal, preferences, userPrompt);
  return {
    success: true,
    isAIGenerated: false,
    meal: fallback
  };
};
