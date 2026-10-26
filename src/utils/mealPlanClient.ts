import { 
  MealPlannerPreferences, 
  PlannedMeal, 
  DayPlan 
} from '../types/mealPlanner';
import { 
  GenerateMealPlanResponse, 
  SwapMealResponse, 
  executeGenerateMealPlan, 
  executeSwapMeal 
} from '../server/mealPlanService';
import { getProfile } from './storage';

/**
 * Client-side invocation to generate a personalized meal plan.
 * Connects to the secure backend endpoint POST /api/generate-meal-plan,
 * with seamless in-memory fallback if running in environments without network routing.
 */
export const requestGenerateMealPlan = async (
  preferences: MealPlannerPreferences,
  apiKeyOverride?: string
): Promise<GenerateMealPlanResponse> => {
  const profile = getProfile();
  const effectiveKey = apiKeyOverride || profile.geminiApiKey || '';

  try {
    const res = await fetch('/api/generate-meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferences,
        apiKey: effectiveKey
      })
    });

    if (res.ok) {
      const data: GenerateMealPlanResponse = await res.json();
      return data;
    }
  } catch (netErr) {
    console.info('Backend endpoint not reachable via HTTP, executing service directly:', netErr);
  }

  // Fallback: execute service directly
  return executeGenerateMealPlan({
    preferences,
    apiKey: effectiveKey
  });
};

/**
 * Client-side invocation to replace / swap a single meal in the current plan.
 */
export const requestSwapMeal = async (
  preferences: MealPlannerPreferences,
  currentMeal: PlannedMeal,
  userPrompt?: string,
  apiKeyOverride?: string
): Promise<SwapMealResponse> => {
  const profile = getProfile();
  const effectiveKey = apiKeyOverride || profile.geminiApiKey || '';

  try {
    const res = await fetch('/api/swap-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preferences,
        currentMeal,
        userPrompt,
        apiKey: effectiveKey
      })
    });

    if (res.ok) {
      const data: SwapMealResponse = await res.json();
      return data;
    }
  } catch (netErr) {
    console.info('Swap endpoint not reachable via HTTP, executing service directly:', netErr);
  }

  // Fallback: execute service directly
  return executeSwapMeal({
    preferences,
    currentMeal,
    userPrompt,
    apiKey: effectiveKey
  });
};
