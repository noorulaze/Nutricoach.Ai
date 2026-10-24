import { UserProfile, FoodItem, DayWorkout, ProgressEntry } from '../types';
import { analyzeNutritionGaps } from './storage';

export interface CoachResponse {
  text: string;
  isLiveApi: boolean;
  suggestedPrompts: string[];
}

export const generateCoachReply = async (
  userMessage: string,
  profile: UserProfile,
  todayFoods: FoodItem[],
  weeklyWorkouts: DayWorkout[],
  progressHistory: ProgressEntry[]
): Promise<CoachResponse> => {
  const query = userMessage.toLowerCase().trim();

  // Context preparation
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

  const dayOfWeekIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const todayWorkout = weeklyWorkouts.find((w) => w.dayIndex === dayOfWeekIndex);
  const gapAnalysis = analyzeNutritionGaps(profile, todayFoods);
  const latestProgress = progressHistory[0];

  // CHECK 1: If live Gemini API key is configured
  if (profile.geminiApiKey && profile.geminiApiKey.trim().length > 10) {
    try {
      const systemContext = `
You are NutriCoach AI, a personal sports science and nutrition expert.
You are helping ${profile.name} (Age: ${profile.age}, Weight: ${profile.weightKg}kg, Height: ${profile.heightCm}cm, Goal: ${profile.goal.replace('_', ' ')}, Diet: ${profile.dietType}, Allergies: ${profile.allergies.join(', ') || 'None'}, Budget: ${profile.budget}).
Today's Targets: Calories: ${profile.calorieTarget} kcal, Protein: ${profile.proteinTargetGrams}g, Carbs: ${profile.carbsTargetGrams}g, Fat: ${profile.fatTargetGrams}g, Fiber: ${profile.fiberTargetGrams}g.
Today's Intake So Far: ${Math.round(totals.calories)} kcal (${Math.round(profile.calorieTarget - totals.calories)} left), Protein: ${Math.round(totals.protein)}g (${Math.round(profile.proteinTargetGrams - totals.protein)}g left), Carbs: ${Math.round(totals.carbs)}g, Fat: ${Math.round(totals.fat)}g, Fiber: ${Math.round(totals.fiber)}g.
Today's Workout: ${todayWorkout ? (todayWorkout.isRestDay ? 'Scheduled Rest Day' : `${todayWorkout.name} (${todayWorkout.completed ? 'Completed' : 'Pending'})`) : 'None'}.
Latest Energy: ${latestProgress ? latestProgress.energyLevel : 7}/10, Recovery: ${latestProgress ? latestProgress.recoveryRating : 7}/10.

Provide concise, empowering, evidence-based recommendations. Emphasize sustainable lifestyle habits and safety.
`.trim();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${profile.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemContext}\n\nUser Question: ${userMessage}` }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return {
            text: replyText,
            isLiveApi: true,
            suggestedPrompts: [
              'What should I eat for my next meal?',
              'How can I modify my workout for low equipment?',
              'Explain how to break through a weight plateau'
            ]
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local intelligence engine', err);
    }
  }

  // CHECK 2: Context-aware Local Expert Engine (Zero false claims, deterministic, highly personalized)
  let text = '';
  const remainingCalories = Math.round(profile.calorieTarget - totals.calories);
  const remainingProtein = Math.round(profile.proteinTargetGrams - totals.protein);
  const remainingFiber = Math.round(profile.fiberTargetGrams - totals.fiber);

  // Intent: Nutrition Gap / Today's Food Review
  if (
    query.includes('nutrition') ||
    query.includes('food') ||
    query.includes('meal') ||
    query.includes('macro') ||
    query.includes('eat') ||
    query.includes('protein') ||
    query.includes('calorie')
  ) {
    text = `### Today's Nutritional Review for ${profile.name}

**Current Consumption vs Daily Targets:**
- **Calories:** ${Math.round(totals.calories)} / ${profile.calorieTarget} kcal (${remainingCalories > 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal above target`})
- **Protein:** ${Math.round(totals.protein)}g / ${profile.proteinTargetGrams}g (${remainingProtein > 0 ? `${remainingProtein}g needed` : 'Target achieved! 🎉'})
- **Carbohydrates:** ${Math.round(totals.carbs)}g / ${profile.carbsTargetGrams}g
- **Fats:** ${Math.round(totals.fat)}g / ${profile.fatTargetGrams}g
- **Dietary Fiber:** ${Math.round(totals.fiber)}g / ${profile.fiberTargetGrams}g

**Actionable Gaps & Meal Strategy:**
`;

    if (remainingProtein > 15) {
      text += `1. **Prioritize Protein:** You still have **${remainingProtein}g of protein** to reach your ${profile.proteinTargetGrams}g target. For your ${profile.dietType} diet and ${profile.budget} budget, great choices are:
   - ${profile.dietType === 'vegan' ? 'Extra firm tofu, tempeh, or a plant-protein isolate shake.' : profile.dietType === 'vegetarian' ? 'Greek yogurt (0% fat), eggs, cottage cheese, or whey isolate.' : 'Canned tuna, chicken breast, or 200g Greek yogurt.'}\n`;
    } else {
      text += `1. **Protein Target Met:** Your muscle repair stimulus is well supported today!\n`;
    }

    if (remainingFiber > 8) {
      text += `2. **Fiber Boost:** You are **${remainingFiber}g below optimal fiber**. Add a cup of steamed broccoli, chia seeds, black beans, or an unpeeled apple to your next meal.\n`;
    }

    if (remainingCalories > 300) {
      text += `3. **Calorie Window:** You have ample room (${remainingCalories} kcal) for a balanced dinner combining a lean protein, complex carb, and generous fibrous greens.`;
    } else if (remainingCalories < -100) {
      text += `3. **Caloric Balance:** You have slightly exceeded your calorie target today by ${Math.abs(remainingCalories)} kcal. That is completely normal across a weekly average—do not starve tomorrow, simply keep your next meals rich in volume from vegetables and lean protein.`;
    }
  }

  // Intent: Workout Adaptation / Time / Equipment Limitation
  else if (
    query.includes('workout') ||
    query.includes('exercise') ||
    query.includes('time') ||
    query.includes('busy') ||
    query.includes('equipment') ||
    query.includes('hurt') ||
    query.includes('pain') ||
    query.includes('adapt')
  ) {
    if (todayWorkout) {
      text = `### Workout Guidance: ${todayWorkout.name}

**Today's Schedule:** ${todayWorkout.isRestDay ? 'Scheduled Rest & Recovery Day' : `${todayWorkout.name} (${todayWorkout.targetFocus})`}
**Status:** ${todayWorkout.completed ? 'Already completed today! 💪' : 'Pending completion'}

**Adaptation Guidelines:**
- **If you have limited time (<30 mins):** Switch to paired supersets. Alternate Exercise 1 (e.g. Chest/Quads) with Exercise 2 (Back/Hamstrings) with 45s rest to cut workout duration in half without sacrificing mechanical volume.
- **If equipment is missing:** Your profile is currently set to **${profile.availableEquipment.replace('_', ' ')}**. Every exercise in your plan can be substituted with dumbbells or bodyweight equivalents in the **Workout Planner** tab.
- **If experiencing joint discomfort:** Never push into sharp, stabbing joint pain. Replace deep barbell squats with goblet squats or Spanish squats, and replace flat benching with neutral-grip dumbbell presses or push-ups.`;
    } else {
      text = `You do not have a workout scheduled for today. If you feel rested, consider an active recovery walk (20–30 mins), light mobility work, or review your upcoming schedule in the **Workout Planner**.`;
    }
  }

  // Intent: Budget & Groceries
  else if (query.includes('budget') || query.includes('cheap') || query.includes('cost') || query.includes('grocery')) {
    text = `### Budget-Friendly High-Performance Staples

To hit your **${profile.proteinTargetGrams}g protein** and **${profile.calorieTarget} kcal** targets on a ${profile.budget} budget:

1. **Top Cost-Per-Gram Protein Kings:**
   - **Canned Tuna in Water:** ~30g protein per \$1.00 - \$1.50 can.
   - **Large Eggs / Egg Whites:** Complete amino acid profile, choline, and healthy fats.
   - **Dried Brown Lentils & Chickpeas:** Incredible source of both protein and prebiotic fiber (~15g fiber/cup).
   - **Bulk Whey or Soy Protein Powder:** Typically \$0.80 to \$1.10 per 25g serving.

2. **Cost-Effective Carb & Fiber Anchors:**
   - **Rolled Oats:** Whole grain complex carbs with beta-glucan fiber.
   - **Frozen Vegetables (Broccoli, Spinach):** Just as nutritious as fresh, with zero spoilage waste.
   - **Bananas & Apples:** Reliable pre-workout glycogen replenishment.`;
  }

  // Intent: Progress & Plateaus
  else if (query.includes('plateau') || query.includes('weight') || query.includes('progress') || query.includes('scale')) {
    text = `### Overcoming Plateaus & Interpreting Progress

1. **The Scale is Only 1 of 5 Metrics:**
   - Daily weight fluctuates by 1–2 kg due to sodium intake, glycogen storage (each gram of carb holds 3g of water), and bowel transit time.
   - Look at your **weekly rolling average** in the **Progress** tab rather than single-day spikes.

2. **Strength & Recovery Indicators:**
   - Are your working weights or repetitions increasing week over week?
   - Are your waist measurements dropping or staying tight while muscle density increases?

3. **Adjustment Rule of Thumb:**
   - Only adjust calories if your rolling 3-week average has not moved in the desired direction. If stalled for >21 days, adjust daily calories by 150–200 kcal or add 2,000 daily steps.`;
  }

  // Default General Coaching Advice
  else {
    text = `Hello ${profile.name}! I am your **NutriCoach AI** personal fitness and nutrition companion.

I have your real profile loaded:
- **Primary Goal:** ${profile.goal.replace('_', ' ').toUpperCase()}
- **Today's Calorie Balance:** ${Math.round(totals.calories)} / ${profile.calorieTarget} kcal
- **Protein Intake:** ${Math.round(totals.protein)} / ${profile.proteinTargetGrams}g (${remainingProtein > 0 ? `${remainingProtein}g left` : 'Target hit!'})
- **Workout Plan:** ${todayWorkout ? todayWorkout.name : 'Rest Day'}

How would you like to optimize your plan today? Ask me anything about meal ideas, nutrient timing, adapting today's exercises, or breaking through plateaus.`;
  }

  return {
    text,
    isLiveApi: false,
    suggestedPrompts: [
      'Analyze my nutrition gaps today',
      'What should I eat for dinner within my macros?',
      'Adapt my workout for 30 minutes',
      'Give me budget-friendly protein ideas'
    ]
  };
};
