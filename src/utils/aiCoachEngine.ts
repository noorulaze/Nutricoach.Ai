import { UserProfile, FoodItem, DayWorkout, ProgressEntry } from '../types';
import { analyzeNutritionGaps } from './storage';
import { COMPREHENSIVE_FOOD_DATABASE } from '../data/foodDatabase';

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

  const remainingCalories = Math.round(profile.calorieTarget - totals.calories);
  const remainingProtein = Math.round(profile.proteinTargetGrams - totals.protein);
  const remainingFiber = Math.round(profile.fiberTargetGrams - totals.fiber);

  // CHECK 1: If live Gemini API key is configured
  if (profile.geminiApiKey && profile.geminiApiKey.trim().length > 10) {
    try {
      const systemContext = `
You are NutriCoach AI, a world-class personal fitness and nutrition coach specializing in sports science, clinical nutrition, Kerala cuisine, Indian regional culinary traditions, and global fitness diets.
You are assisting ${profile.name} (Age: ${profile.age}, Weight: ${profile.weightKg}kg, Height: ${profile.heightCm}cm, Goal: ${profile.goal.replace('_', ' ')}, Diet: ${profile.dietType}, Allergies: ${profile.allergies.join(', ') || 'None'}, Budget: ${profile.budget}).

User's Daily Targets:
- Calories: ${profile.calorieTarget} kcal
- Protein: ${profile.proteinTargetGrams}g
- Carbs: ${profile.carbsTargetGrams}g
- Fat: ${profile.fatTargetGrams}g
- Fiber: ${profile.fiberTargetGrams}g

Today's Food Intake Logged So Far:
- Calories: ${Math.round(totals.calories)} kcal (${remainingCalories > 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal above`})
- Protein: ${Math.round(totals.protein)}g (${remainingProtein > 0 ? `${remainingProtein}g needed` : 'Target achieved'})
- Carbs: ${Math.round(totals.carbs)}g
- Fat: ${Math.round(totals.fat)}g
- Fiber: ${Math.round(totals.fiber)}g

Today's Scheduled Workout: ${todayWorkout ? (todayWorkout.isRestDay ? 'Scheduled Rest Day' : `${todayWorkout.name} (${todayWorkout.completed ? 'Completed' : 'Pending'})`) : 'None'}.
Latest Energy: ${latestProgress ? latestProgress.energyLevel : 7}/10, Recovery: ${latestProgress ? latestProgress.recoveryRating : 7}/10.

Core Instructions:
1. Understand Malayalam terms (e.g., പുട്ട്, കടലക്കറി, അപ്പം, കപ്പ, മീൻ കറി, ബിരിയാണി, പൊറോട്ട, അവിയൽ, സംഭാരം) and Manglish queries (e.g. "puttu", "kadala", "kappa", "meen curry", "biriyani", "porotta", "chaaya", "chappathi").
2. Clarify portions where necessary and provide precise calorie and macro guidance based on ICMR-NIN Indian Food Composition Tables (IFCT 2017) and USDA standards.
3. Suggest cultural protein additions (e.g. boiled eggs, meen mulakittathu, mathi fry, cherupayar sundal, chicken stew, paneer, soya chunks) without exceeding saturated fat or calorie limits.
4. Keep advice clear, actionable, evidence-based, and encouraging.
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
              'What Kerala foods will give me 30g protein?',
              'How to fit Puttu and Kadala curry into my macros?',
              'Suggest a low-calorie traditional Kerala dinner',
              'Analyze my nutrition gaps today'
            ]
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local intelligence engine', err);
    }
  }

  // CHECK 2: Local Intelligence Engine with Deep Cultural & Scientific Reasoning
  let text = '';

  // Intent: Specific Kerala & Indian food query
  const isKeralaQuery = 
    query.includes('puttu') || query.includes('kadala') || query.includes('appam') ||
    query.includes('idiyappam') || query.includes('kappa') || query.includes('tapioca') ||
    query.includes('meen') || query.includes('fish curry') || query.includes('sardine') ||
    query.includes('mathi') || query.includes('ayala') || query.includes('chemmeen') ||
    query.includes('prawn') || query.includes('beef') || query.includes('porotta') ||
    query.includes('biriyani') || query.includes('biryani') || query.includes('avial') ||
    query.includes('thoran') || query.includes('sambar') || query.includes('rasam') ||
    query.includes('kanji') || query.includes('payasam') || query.includes('pazham pori') ||
    query.includes('sulaimani') || query.includes('sambharam') || query.includes('cherupayar') ||
    query.includes('പുട്ട്') || query.includes('കടല') || query.includes('മീൻ') ||
    query.includes('കപ്പ') || query.includes('അപ്പം') || query.includes('ബിരിയാണി');

  if (isKeralaQuery) {
    if (query.includes('puttu') || query.includes('പുട്ട്')) {
      text = `### Puttu (Steamed Rice Cake) Nutritional & Fitness Breakdown

**Nutritional Profile (1 Medium Cylinder / 100g):**
- **Calories:** ~185 kcal
- **Carbohydrates:** 36.8g (Clean complex carbs)
- **Protein:** 3.4g
- **Fat:** 2.8g (From fresh coconut gratings)
- **Fiber:** 2.1g

**Coach's Macro Guidance for ${profile.name}:**
1. **The Kadala Curry Pairing:** Pairing 1 piece of Puttu with 1 bowl (150g) of **Kadala Curry** provides **~333 kcal and ~10.2g protein**.
2. **Protein Enhancement Tip:** Because Puttu is carb-dominant, add **2 boiled eggs (12.6g protein)** or a cup of **Cherupayar Sundal (8.4g protein)** to reach your **${profile.proteinTargetGrams}g daily protein target**.
3. **Weight Management Tip:** If you are in a fat-loss phase (${profile.calorieTarget} kcal budget), try **Godhambu Puttu (Wheat)** or **Ragi Puttu (Finger Millet)** for double the fiber (4.5g–5.8g) and longer satiety!`;
    } 
    else if (query.includes('kappa') || query.includes('tapioca') || query.includes('കപ്പ')) {
      text = `### Steamed Tapioca (Kappa / Vevichathu) & Fish Curry

**Nutritional Profile (1 Plate Steamed Kappa / 220g):**
- **Calories:** ~312 kcal
- **Carbohydrates:** 74.8g (Energy-dense root starch)
- **Protein:** 2.4g
- **Fat:** 0.4g (without coconut tempering)
- **Fiber:** 5.3g

**Sports Nutrition Strategy:**
1. **Pre/Post-Workout Carb Loading:** Kappa is fantastic 2–3 hours before heavy leg training or right after long workouts to rapidly replenish muscle glycogen.
2. **The Golden Pairing (Kudampuli Meen Curry):** Pair your kappa with **Kudampuli Meen Mulakittathu (Kerala Fish Curry without coconut milk)**. 120g of fish curry adds **18.7g of pure lean protein and omega-3s** with only ~140 kcal!
3. **Avoid the Coconut Oil Trap:** Restaurant *Kappa Biryani* or *Kappa Thalichathu* often contains heavy coconut oil and beef fat (~550–700 kcal). Choose plain boiled kappa with spicy homestyle fish curry to stay clean.`;
    }
    else if (query.includes('meen') || query.includes('fish') || query.includes('mathi') || query.includes('ayala') || query.includes('മീൻ')) {
      text = `### Kerala Seafood & Lean Muscle Building

**Nutritional Comparison of Kerala Fish Preparations:**
- **Kudampuli Meen Mulakittathu (120g):** 142 kcal • **18.7g Protein** • 5.7g Fat (Top tier for fat loss)
- **Mathi / Sardine Fry (3 small fish, 105g):** 225 kcal • **22.0g Protein** • 14.5g Healthy Omega-3 Fats
- **Ayala / Mackerel Curry (130g):** 176 kcal • **19.8g Protein** • 9.4g Fat
- **Fish Moilee (with Coconut Milk, 150g):** 232 kcal • **20.7g Protein** • 14.7g Fat

**Coach's Recommendation for ${profile.name}:**
Fresh sea fish like **Mathi (Sardines)** and **Ayala (Mackerel)** are among the world's richest sources of cardioprotective EPA/DHA omega-3 fatty acids and vitamin D. For optimal muscle recovery, having grilled or claypot-curried fish 3–4 times per week is phenomenal!`;
    }
    else if (query.includes('porotta') || query.includes('പൊറോട്ട')) {
      text = `### Kerala Porotta: Calorie Reality & Smart Moderation

**Nutrition Breakdown (2 Malabar Porottas / 160g):**
- **Calories:** **~518 kcal**
- **Carbohydrates:** 77.6g (Refined Maida)
- **Fat:** 18.9g (From oil used during kneading and layering)
- **Protein:** 10.9g
- **Dietary Fiber:** 3.4g

**When Paired with Beef Fry / BDF (120g):**
- Total meal calories: **~848 kcal** (Fat: 40g, Protein: 39g).
- That accounts for **${Math.round((848 / profile.calorieTarget) * 100)}% of your daily ${profile.calorieTarget} kcal budget**!

**Smart Strategies to Enjoy It:**
1. Limit to **1 porotta** paired with a high-protein dish like **Nadan Chicken Curry** or **Egg Roast** and a side of cucumber slices.
2. Switch to **Whole Wheat Porotta (Godhambu Porotta)** or **Chapatis (3 chapatis = 254 kcal, 7.5g fiber)** on regular training days.
3. Schedule your porotta on high-intensity training days so the carbohydrates fuel intense mechanical output!`;
    }
    else if (query.includes('biriyani') || query.includes('biryani') || query.includes('ബിരിയാണി')) {
      text = `### Malabar & Thalassery Biryani in Your Fitness Plan

**Nutritional Profile (1 Standard Restaurant Plate / 350g):**
- **Calories:** ~680 kcal
- **Protein:** ~36.4g (Generous chicken or mutton portion)
- **Carbohydrates:** ~81.2g (Fragrant Khaima/Jeerakasala rice)
- **Fat:** ~23.8g (Pure cow ghee and chicken rendering)

**How to Fit It into Today's Targets:**
- You have **${remainingCalories} kcal** remaining today.
- **Coach's Hack:** Eat the spiced chicken and boiled egg first to secure your protein intake and trigger satiety hormones (GLP-1 and PYY). Eat half to two-thirds of the ghee rice, and pair with fresh onion raita and lemon pickle.`;
    }
    else {
      text = `### Kerala Cuisine Fitness Guide

Traditional Kerala cooking has incredible nutritional strengths:
1. **Superfood Staples:** Steamed red **Matta Rice** contains valuable magnesium, selenium, and intact fiber compared to polished white rice.
2. **Digestive Spices:** Ginger, garlic, curry leaves, fenugreek, and Malabar tamarind (*kudampuli*) provide potent anti-inflammatory and digestive benefits.
3. **High-Protein Traditional Champions:**
   - **Kudampuli Meen Curry:** 18g+ protein per serving with almost zero fat.
   - **Cherupayar Sundal / Thoran:** 8.4g protein & 6.2g fiber per cup.
   - **Nadan Mutta Roast (2 eggs):** 20.4g protein.
4. **Hydration Champion:** Replace sugary drinks with **Sambharam (Spiced Buttermilk with crushed ginger and curry leaves)** or fresh **Elaneer (Tender Coconut Water)** for natural electrolytes!`;
    }
  }

  // Intent: Nutrition Gap / Today's Food Review
  else if (
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
      text += `1. **Prioritize Protein:** You still have **${remainingProtein}g of protein** to reach your ${profile.proteinTargetGrams}g target. Top practical suggestions for your ${profile.dietType} diet:
   - **Kerala / Indian:** ${profile.dietType === 'vegetarian' ? 'Cherupayar Sundal (8g), Paneer Bhurji (18g), or 200g Greek Yogurt/Curd.' : 'Kudampuli Meen Curry (19g), 2 Boiled Eggs with Pepper (13g), or Nadan Chicken Breast Roast (31g).'}\n`;
    } else {
      text += `1. **Protein Target Met:** Your muscle repair stimulus is well supported today!\n`;
    }

    if (remainingFiber > 8) {
      text += `2. **Fiber Boost:** You are **${remainingFiber}g below optimal fiber**. Add a cup of Cheera/Cabbage Thoran (3g), steamed broccoli, or an unpeeled apple to your next meal.\n`;
    }

    if (remainingCalories > 300) {
      text += `3. **Calorie Window:** You have ample room (${remainingCalories} kcal) for a balanced dinner combining a lean protein, complex carb, and generous fibrous greens.`;
    } else if (remainingCalories < -100) {
      text += `3. **Caloric Balance:** You have slightly exceeded your calorie target today by ${Math.abs(remainingCalories)} kcal. That is completely normal across a weekly average—keep your next meals rich in volume from vegetables and lean protein.`;
    }
  }

  // Intent: Workout Guidance
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
- **If experiencing joint discomfort:** Never push into sharp, stabbing joint pain. Replace deep barbell squats with goblet squats, and replace flat benching with neutral-grip dumbbell presses or push-ups.`;
    } else {
      text = `You do not have a workout scheduled for today. If you feel rested, consider an active recovery walk (20–30 mins), light mobility work, or review your upcoming schedule in the **Workout Planner**.`;
    }
  }

  // Intent: Budget & Groceries
  else if (query.includes('budget') || query.includes('cheap') || query.includes('cost') || query.includes('grocery')) {
    text = `### Budget-Friendly High-Performance Staples

To hit your **${profile.proteinTargetGrams}g protein** and **${profile.calorieTarget} kcal** targets on a ${profile.budget} budget:

1. **Top Cost-Effective Regional Protein Champions:**
   - **Fresh Coastal Sardines (Mathi) / Mackerel (Ayala):** Incredible value per gram of protein and omega-3s.
   - **Large Eggs / Egg Whites:** Complete amino acid profile with highest bioavailability.
   - **Whole Green Moong (Cherupayar) & Black Chickpeas (Kadala):** High protein + 5–6g prebiotic fiber per serving.
   - **Soya Chunks:** ~52g protein per 100g dry weight at minimal grocery expense.

2. **Cost-Effective Carb & Fiber Anchors:**
   - **Kerala Matta Rice / Brown Rice:** Satiating, intact minerals.
   - **Local Spinach (Cheera), Cabbage, and Green Papaya:** Fresh, seasonal, zero spoilage.
   - **Oats & Bananas:** Fast, high-energy pre-workout fuel.`;
  }

  // Intent: Progress & Plateaus
  else if (query.includes('plateau') || query.includes('weight') || query.includes('progress') || query.includes('scale')) {
    text = `### Overcoming Plateaus & Interpreting Progress

1. **The Scale is Only 1 of 5 Metrics:**
   - Daily weight fluctuates by 1–2 kg due to sodium intake, glycogen storage (each gram of carb binds 3g of water), and bowel transit time.
   - Look at your **weekly rolling average** in the **Progress** tab rather than single-day spikes.

2. **Strength & Recovery Indicators:**
   - Are your working weights or repetitions increasing week over week?
   - Are your waist measurements dropping or staying tight while muscle density increases?

3. **Adjustment Rule of Thumb:**
   - Only adjust calories if your rolling 3-week average has not moved in the desired direction. If stalled for >21 days, adjust daily calories by 150–200 kcal or add 2,000 daily steps.`;
  }

  // Default Greeting
  else {
    text = `Hello ${profile.name}! I am your **NutriCoach AI** personal fitness and nutrition companion.

I have your real profile loaded:
- **Primary Goal:** ${profile.goal.replace('_', ' ').toUpperCase()}
- **Today's Calorie Balance:** ${Math.round(totals.calories)} / ${profile.calorieTarget} kcal (${remainingCalories > 0 ? `${remainingCalories} kcal left` : 'Target reached!'})
- **Protein Intake:** ${Math.round(totals.protein)} / ${profile.proteinTargetGrams}g (${remainingProtein > 0 ? `${remainingProtein}g left` : 'Target hit!'})
- **Workout Plan:** ${todayWorkout ? todayWorkout.name : 'Rest Day'}

I now support comprehensive **Kerala cuisine, Indian regional foods, and international dishes** with authentic Malayalam & English search! How can I help you optimize your food or workout today?`;
  }

  return {
    text,
    isLiveApi: false,
    suggestedPrompts: [
      'What Kerala foods will give me 30g protein?',
      'How to fit Puttu and Kadala curry into my macros?',
      'Analyze my nutrition gaps today',
      'What should I eat for dinner within my macros?'
    ]
  };
};
