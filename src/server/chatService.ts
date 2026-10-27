import { UserProfile, FoodItem, DayWorkout, ProgressEntry, ChatFoodCard, GoalType } from '../types';
import { COMPREHENSIVE_FOOD_DATABASE, ComprehensiveFood } from '../data/foodDatabase';
import { formatFoodCard, findMatchingFood } from '../utils/aiCoachEngine';
import { generateIntelligentAnswer, KnowledgeContext } from '../utils/chatKnowledgeEngine';

export interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'model'; text: string }>;
  profile?: UserProfile;
  todayFoods?: FoodItem[];
  weeklyWorkouts?: DayWorkout[];
  progressHistory?: ProgressEntry[];
  apiKey?: string;
}

export interface ChatResponse {
  success: boolean;
  text: string;
  isLiveApi: boolean;
  needsApiKey?: boolean;
  isAuthError?: boolean;
  isRateLimit?: boolean;
  suggestedPrompts: string[];
  foodCard?: ChatFoodCard;
  error?: string;
}

/**
 * Executes a chat query on the backend.
 * 1. Resolves API key securely from server environment or user configuration.
 * 2. If valid key present, makes live Google Gemini API request with multi-turn history.
 * 3. Handles auth errors, rate limits, and model fallbacks with clear actionable feedback.
 * 4. If no API key is configured, invokes the comprehensive local intelligence engine.
 * 5. NEVER returns a generic welcome message in response to a user prompt.
 */
export async function executeChat(
  payload: ChatRequest,
  serverEnvApiKey?: string
): Promise<ChatResponse> {
  const userMessage = payload.message?.trim();
  if (!userMessage) {
    return {
      success: false,
      isLiveApi: false,
      text: 'Please enter a message to ask NutriCoach AI.',
      suggestedPrompts: [
        'Explain protein in simple terms',
        'What is the capital of Japan?',
        'Kerala sadya-yil enthellam und?'
      ],
      error: 'Empty message'
    };
  }

  const profile: UserProfile = payload.profile || {
    name: 'Friend',
    age: 28,
    gender: 'male',
    heightCm: 178,
    weightKg: 75,
    goal: 'maintenance' as GoalType,
    experienceLevel: 'intermediate',
    activityLevel: 'moderate',
    availableEquipment: 'dumbbells_only',
    trainingDaysPerWeek: 4,
    preferredWorkoutDurationMin: 45,
    dietType: 'omnivore',
    allergies: [],
    budget: 'moderate',
    tdee: 2200,
    calorieTarget: 2000,
    proteinTargetGrams: 140,
    carbsTargetGrams: 200,
    fatTargetGrams: 60,
    fiberTargetGrams: 30,
    customMacros: false,
    geminiApiKey: ''
  };

  const todayFoods = payload.todayFoods || [];
  const weeklyWorkouts = payload.weeklyWorkouts || [];
  const progressHistory = payload.progressHistory || [];
  const conversationHistory = (payload.conversationHistory || []).filter(
    (turn) => !turn.text.toLowerCase().includes('i am your nutricoach ai companion')
  );

  const matchedFood = findMatchingFood(userMessage);
  const foodCard = matchedFood ? formatFoodCard(matchedFood) : undefined;

  // Resolve API key securely on server
  const resolvedApiKey =
    serverEnvApiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    payload.apiKey;

  // 1. LIVE GOOGLE GEMINI API CALL (If API key provided)
  if (resolvedApiKey && resolvedApiKey.trim().length > 10) {
    const key = resolvedApiKey.trim();

    // Check for obvious invalid placeholder keys
    if (key.includes('invalid') || key.length < 20) {
      return {
        success: false,
        isLiveApi: false,
        isAuthError: true,
        text: '⚠️ **Invalid Gemini API Key**: The configured API key is not valid. Please enter a valid API key from Google AI Studio in Settings.',
        suggestedPrompts: [
          'What is the capital of Japan?',
          'Explain photosynthesis in simple English',
          'What is 25 multiplied by 16?'
        ],
        error: 'Invalid API key format'
      };
    }

    try {
      const totals = todayFoods.reduce(
        (acc, f) => ({
          calories: acc.calories + f.calories,
          protein: acc.protein + f.protein,
          carbs: acc.carbs + f.carbs,
          fat: acc.fat + f.fat,
          fiber: acc.fiber + f.fiber
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );

      const systemInstruction = `
You are NutriCoach AI, a brilliant, friendly, and versatile AI assistant and personal nutrition/fitness companion.
You are helping ${profile.name} (Goal: ${profile.goal.replace('_', ' ')}, Diet: ${profile.dietType}, Daily Target: ${profile.calorieTarget} kcal, ${profile.proteinTargetGrams}g Protein).
Logged today: ${Math.round(totals.calories)} kcal, ${Math.round(totals.protein)}g Protein.

GUIDELINES:
1. GENERAL-PURPOSE CAPABILITY: Answer ANY question accurately, including math calculations, world geography, history, biology, computer programming (Python, TypeScript, JavaScript, SQL), writing, and everyday problem-solving. Do NOT force nutrition into questions about code, math, or history.
2. NUTRITION & KERALA CUISINE: When asked about diet or workouts, give portion-specific, evidence-based advice. Specialize in Kerala dishes (Puttu, Kadala, Meen Curry, Avial, Thoran, Sambar, Sadya).
3. LANGUAGE: Understand English, Malayalam, and Manglish. Respond clearly in fluent English.
4. FORMAT: Use clear GitHub markdown with headers, bold text, bullet points, and syntax-highlighted code blocks.
`.trim();

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add recent turns for context
      const recentTurns = conversationHistory.slice(-8);
      for (const turn of recentTurns) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }

      // Add current user message with system instruction
      contents.push({
        role: 'user',
        parts: [{ text: `[System Instruction: ${systemInstruction}]\n\nUser Question: ${userMessage}` }]
      });

      // Try primary model: gemini-2.0-flash
      let modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
      let response = await fetch(modelEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      // Fallback model if 404
      if (response.status === 404) {
        modelEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        response = await fetch(modelEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });
      }

      if (response.ok) {
        const data: any = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return {
            success: true,
            text: replyText,
            isLiveApi: true,
            suggestedPrompts: [
              'Tell me more about this',
              'How does this relate to my nutrition goals?',
              'Show me a practical example',
              'What are the key takeaways?'
            ],
            foodCard
          };
        }
      }

      // Check HTTP error codes from Google API
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        const errorJson: any = await response.json().catch(() => ({}));
        const errorMsg = errorJson.error?.message || 'Invalid API key or unauthorized';
        return {
          success: false,
          isLiveApi: false,
          isAuthError: true,
          text: `⚠️ **Gemini API Authentication Error**: ${errorMsg}. Please verify your Google AI Studio API key in Settings.`,
          suggestedPrompts: [
            'What is the capital of Japan?',
            'Explain photosynthesis in simple English',
            'What is 25 multiplied by 16?'
          ],
          error: errorMsg
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          isLiveApi: false,
          isRateLimit: true,
          text: '⚠️ **Gemini API Rate Limit Reached**: The free-tier rate limit has been temporarily exceeded. Please wait a minute and try again.',
          suggestedPrompts: ['Retry in a few seconds'],
          error: 'Rate limit reached'
        };
      }
    } catch (err: any) {
      console.warn('Backend Gemini API call error:', err);
    }
  }

  // 2. COMPREHENSIVE INTELLIGENCE ENGINE (When no API key is provided)
  const totals = todayFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const dayOfWeekIndex = (new Date().getDay() + 6) % 7;
  const todayWorkout = weeklyWorkouts.find((w) => w.dayIndex === dayOfWeekIndex);

  const knowledgeCtx: KnowledgeContext = {
    query: userMessage.toLowerCase().trim(),
    userMessage,
    profile,
    totals,
    remainingCalories: Math.round(profile.calorieTarget - totals.calories),
    remainingProtein: Math.round(profile.proteinTargetGrams - totals.protein),
    remainingCarbs: Math.round(profile.carbsTargetGrams - totals.carbs),
    remainingFat: Math.round(profile.fatTargetGrams - totals.fat),
    remainingFiber: Math.round(profile.fiberTargetGrams - totals.fiber),
    todayWorkout,
    matchedFood,
    conversationHistory
  };

  const intelligentReply = generateIntelligentAnswer(knowledgeCtx);

  return {
    success: true,
    text: intelligentReply.text,
    isLiveApi: false,
    needsApiKey: true,
    suggestedPrompts: intelligentReply.suggestedPrompts,
    foodCard: intelligentReply.foodCard || foodCard
  };
}
