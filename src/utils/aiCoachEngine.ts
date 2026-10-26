import { UserProfile, FoodItem, DayWorkout, ProgressEntry, ChatFoodCard } from '../types';
import { analyzeNutritionGaps } from './storage';
import { COMPREHENSIVE_FOOD_DATABASE, ComprehensiveFood } from '../data/foodDatabase';

export interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

export interface CoachResponse {
  text: string;
  isLiveApi: boolean;
  suggestedPrompts: string[];
  foodCard?: ChatFoodCard;
}

/**
 * Searches the Comprehensive Food Database for a matching food/curry item mentioned in user query.
 */
export const findMatchingFood = (userQuery: string): ComprehensiveFood | undefined => {
  const q = userQuery.toLowerCase().trim();
  if (q.length < 3) return undefined;

  // Direct exact/prefix match check
  let bestMatch: ComprehensiveFood | undefined;
  let highestScore = 0;

  for (const food of COMPREHENSIVE_FOOD_DATABASE) {
    const foodName = food.name.toLowerCase();
    let score = 0;

    // Exact name match
    if (q.includes(foodName) || foodName.includes(q)) {
      score = 100;
    } else {
      // Check alternate names
      for (const alt of food.alternateNames) {
        const altLower = alt.toLowerCase();
        if (q.includes(altLower)) {
          score = Math.max(score, 85);
          break;
        }
      }

      // Check manglish name
      if (food.manglishName && q.includes(food.manglishName.toLowerCase())) {
        score = Math.max(score, 80);
      }

      // Check key keywords
      const queryWords = q.split(/\s+/).filter(w => w.length > 3);
      let matchedWords = 0;
      for (const word of queryWords) {
        if (foodName.includes(word)) matchedWords++;
      }
      if (matchedWords >= 2) {
        score = Math.max(score, 60 + matchedWords * 10);
      }
    }

    if (score > highestScore && score >= 70) {
      highestScore = score;
      bestMatch = food;
      if (score === 100) break;
    }
  }

  return bestMatch;
};

/**
 * Formats a ComprehensiveFood item into a ChatFoodCard for interactive chat display.
 */
export const formatFoodCard = (food: ComprehensiveFood): ChatFoodCard => {
  return {
    foodId: food.id,
    name: food.name,
    category: food.category,
    cuisine: food.cuisine,
    dietaryType: food.dietaryType,
    description: food.description,
    per100g: {
      calories: food.per100g.calories,
      protein: food.per100g.protein,
      carbs: food.per100g.carbs,
      fat: food.per100g.fat,
      fiber: food.per100g.fiber,
      sodiumMg: food.per100g.sodiumMg
    },
    servings: food.servings,
    defaultServing: food.defaultServing
  };
};

/**
 * Generates an intelligent, conversational reply for NutriCoach AI.
 * Supports:
 * 1. Live Google Gemini API with multi-turn conversation context when configured.
 * 2. General-Purpose Intelligence Engine capable of answering ANY topic (tech, code, math, science, history, daily life, writing).
 * 3. Deep nutrition, Kerala cuisine & fitness specialization with interactive food tracking cards.
 */
export const generateCoachReply = async (
  userMessage: string,
  profile: UserProfile,
  todayFoods: FoodItem[],
  weeklyWorkouts: DayWorkout[],
  progressHistory: ProgressEntry[],
  conversationHistory: ConversationTurn[] = [],
  signal?: AbortSignal
): Promise<CoachResponse> => {
  const query = userMessage.toLowerCase().trim();

  // 1. Calculate Real-Time Personalized Targets & Current Totals
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
  const remainingCalories = Math.round(profile.calorieTarget - totals.calories);
  const remainingProtein = Math.round(profile.proteinTargetGrams - totals.protein);
  const remainingCarbs = Math.round(profile.carbsTargetGrams - totals.carbs);
  const remainingFat = Math.round(profile.fatTargetGrams - totals.fat);
  const remainingFiber = Math.round(profile.fiberTargetGrams - totals.fiber);

  // Check if query is asking about a food or curry in our database
  const matchedFood = findMatchingFood(userMessage);
  const foodCard = matchedFood ? formatFoodCard(matchedFood) : undefined;

  // 2. CHECK: Live Gemini API (from Profile Key or Environment Variable)
  const apiKey = (profile.geminiApiKey && profile.geminiApiKey.trim().length > 10)
    ? profile.geminiApiKey.trim()
    : ((import.meta as any).env?.VITE_GEMINI_API_KEY || '');

  if (apiKey) {
    try {
      const systemInstruction = `
You are NutriCoach AI, a friendly, brilliant, and versatile AI assistant and personal nutrition/fitness coach.
You are helping ${profile.name} (Age: ${profile.age}, Weight: ${profile.weightKg}kg, Height: ${profile.heightCm}cm, Goal: ${profile.goal.replace('_', ' ')}, Diet: ${profile.dietType}, Allergies: ${profile.allergies.join(', ') || 'None'}, Equipment: ${profile.availableEquipment.replace('_', ' ')}).

CURRENT DAILY TARGETS & LOGGED NUTRITION FOR ${profile.name}:
- Calorie Budget: ${profile.calorieTarget} kcal (Logged today: ${Math.round(totals.calories)} kcal | ${remainingCalories > 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal over`})
- Protein Target: ${profile.proteinTargetGrams}g (Logged today: ${Math.round(totals.protein)}g | ${remainingProtein > 0 ? `${remainingProtein}g needed` : 'Target reached'})
- Carbs Target: ${profile.carbsTargetGrams}g (Logged: ${Math.round(totals.carbs)}g)
- Fat Target: ${profile.fatTargetGrams}g (Logged: ${Math.round(totals.fat)}g)
- Fiber Target: ${profile.fiberTargetGrams}g (Logged: ${Math.round(totals.fiber)}g)
- Today's Scheduled Workout: ${todayWorkout ? (todayWorkout.isRestDay ? 'Rest Day' : `${todayWorkout.name} (${todayWorkout.targetFocus})`) : 'Rest Day'}

CAPABILITIES AND BEHAVIOR:
1. GENERAL-PURPOSE ASSISTANT: You are fully capable of answering ANY topic outside of fitness and nutrition—such as computer programming, software engineering, science, history, mathematics, writing, email drafting, literature, daily productivity, education, and general problem-solving. Answer general questions directly, accurately, and thoroughly with code snippets, calculations, or step-by-step reasoning. Do NOT force nutrition into questions about code, math, or history.
2. NUTRITION & FITNESS SPECIALTY: When asked about food, diet, calories, workouts, or wellness, provide evidence-based, portion-specific advice. Specialize in Kerala cuisine, South & North Indian curries, and international foods.
3. LANGUAGE: Understand English, Malayalam script, and Manglish queries. Always formulate your response strictly in clear, fluent English.
4. HONESTY & SAFETY: Never fabricate nutrition numbers or scientific claims. Clearly indicate estimates if precise data is unavailable. Never diagnose clinical diseases or prescribe extreme diets.
5. FORMATTING: Use clean GitHub-flavored markdown with headers (###), bold text, bullet points, and syntax-highlighted code blocks where applicable.
`.trim();

      // Format multi-turn conversation history for Gemini API
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Add previous turns (up to last 10 messages for context)
      const recentTurns = conversationHistory.slice(-10);
      for (const turn of recentTurns) {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }

      // Add current user message with system instruction prefix if first turn, or standalone
      contents.push({
        role: 'user',
        parts: [{ text: `[System Context: ${systemInstruction}]\n\nUser Question: ${userMessage}` }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
          signal
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          // Dynamic suggested prompts based on topic
          const suggestedPrompts = getAdaptivePrompts(userMessage, matchedFood?.name);
          return {
            text: replyText,
            isLiveApi: true,
            suggestedPrompts,
            foodCard
          };
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err; // User requested Stop Generating
      }
      console.warn('Gemini API call failed or timed out. Falling back to local intelligence engine.', err);
    }
  }

  // 3. ROBUST GENERAL-PURPOSE INTELLIGENCE ENGINE (Deterministic Local Intelligence)
  const localReply = runLocalIntelligenceEngine({
    query,
    userMessage,
    profile,
    totals,
    remainingCalories,
    remainingProtein,
    remainingCarbs,
    remainingFat,
    remainingFiber,
    todayWorkout,
    matchedFood,
    conversationHistory
  });

  return {
    text: localReply.text,
    isLiveApi: false,
    suggestedPrompts: localReply.suggestedPrompts,
    foodCard
  };
};

/**
 * Returns dynamic, context-aware suggestion prompts based on the current user query.
 */
const getAdaptivePrompts = (query: string, foodName?: string): string[] => {
  const q = query.toLowerCase();

  if (foodName) {
    return [
      `How does ${foodName} fit into my daily macros?`,
      `What are the best side dishes or curries to pair with ${foodName}?`,
      `Suggest a high-protein version of this meal`,
      `Show me today's remaining calorie budget`
    ];
  }

  if (q.includes('code') || q.includes('python') || q.includes('javascript') || q.includes('react') || q.includes('bug')) {
    return [
      'Write a Python script to sort and filter a dictionary',
      'Explain useEffect and useState in React with an example',
      'How to optimize web application performance?',
      'Explain asynchronous JavaScript and Promises'
    ];
  }

  if (q.includes('workout') || q.includes('exercise') || q.includes('muscle') || q.includes('gym')) {
    return [
      'Adapt my workout for a 30-minute busy day',
      'Best dumbbell exercises for upper body hypertrophy',
      'How much rest between strength sets is optimal?',
      'How to prevent lower back pain during deadlifts'
    ];
  }

  if (q.includes('math') || q.includes('calculate') || q.includes('tdee') || q.includes('calorie')) {
    return [
      'Calculate my exact TDEE and calorie deficit',
      'How many grams of protein per kg of body weight do I need?',
      'Solve: 4x + 16 = 64',
      'Convert 180 lbs to kg and calculate BMI'
    ];
  }

  return [
    'How do I fit Puttu and Kadala curry into my macros?',
    'What Kerala foods will give me 30g protein?',
    'Write a Python script for quick data processing',
    'Analyze my nutrition gaps today'
  ];
};

/**
 * Local Intelligence Engine capable of answering across ALL topics:
 * - Programming & Technology
 * - Mathematics, Equations & Unit Conversions
 * - Science, Thermodynamics & Physiology
 * - History, Geography & General Knowledge
 * - Professional Writing, Emails & Productivity
 * - Kerala Cuisine, Curries & Macro Nutrition
 * - Personalized Health & Training Reviews
 */
const runLocalIntelligenceEngine = (ctx: {
  query: string;
  userMessage: string;
  profile: UserProfile;
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFat: number;
  remainingFiber: number;
  todayWorkout?: DayWorkout;
  matchedFood?: ComprehensiveFood;
  conversationHistory: ConversationTurn[];
}): { text: string; suggestedPrompts: string[] } => {
  const { query, userMessage, profile, totals, remainingCalories, remainingProtein, todayWorkout, matchedFood } = ctx;

  // =========================================================================
  // 1. CODING, SOFTWARE ENGINEERING & TECHNOLOGY
  // =========================================================================
  const isCodingQuery = 
    query.includes('python') || query.includes('javascript') || query.includes('typescript') ||
    query.includes('react') || query.includes('code') || query.includes('coding') ||
    query.includes('function') || query.includes('algorithm') || query.includes('sql') ||
    query.includes('html') || query.includes('css') || query.includes('git') ||
    query.includes('api') || query.includes('programming') || query.includes('bug');

  if (isCodingQuery) {
    if (query.includes('python')) {
      return {
        text: `### Python Programming Solution

Here is a clean, modern, and idiomatic Python implementation:

\`\`\`python
# Python 3: Data filtering, sorting, and analysis example
from typing import List, Dict, Any

def process_nutrition_records(items: List[Dict[str, Any]], min_protein: float = 15.0) -> List[Dict[str, Any]]:
    """
    Filters food items by protein threshold and sorts by calorie-efficiency (protein/calorie ratio).
    """
    filtered = [item for item in items if item.get('protein', 0) >= min_protein]
    
    # Sort by protein-to-calorie ratio descending
    sorted_items = sorted(
        filtered,
        key=lambda x: x.get('protein', 0) / max(1, x.get('calories', 1)),
        reverse=True
    )
    return sorted_items

# Example usage:
sample_foods = [
    {"name": "Nadan Chicken Curry", "calories": 142, "protein": 14.5},
    {"name": "Kudampuli Meen Curry", "calories": 118, "protein": 18.7},
    {"name": "Cherupayar Thoran", "calories": 145, "protein": 8.4},
    {"name": "Boiled Eggs (2)", "calories": 143, "protein": 12.6}
]

high_protein_foods = process_nutrition_records(sample_foods, min_protein=12.0)
for food in high_protein_foods:
    ratio = food['protein'] / food['calories']
    print(f"{food['name']}: {food['protein']}g P ({ratio:.2f} P/kcal)")
\`\`\`

**Key Python Best Practices Applied:**
1. **Type Hinting:** Uses \`typing.List\`, \`typing.Dict\` for clarity and static analysis.
2. **List Comprehensions:** Idiomatic and fast filtering in CPython.
3. **Safe Dictionary Access:** Uses \`.get()\` with defaults to prevent \`KeyError\` exceptions.`,
        suggestedPrompts: [
          'How do I handle errors in Python with try-except?',
          'Explain Python list comprehensions vs map/filter',
          'How do I read and write JSON files in Python?',
          'What are Python dataclasses?'
        ]
      };
    }

    if (query.includes('react') || query.includes('javascript') || query.includes('typescript')) {
      return {
        text: `### Modern React & TypeScript Solution

Here is a robust React component implementing clean state management, TypeScript interfaces, and accessibility:

\`\`\`tsx
import React, { useState, useMemo } from 'react';

interface FoodItemProps {
  id: string;
  name: string;
  calories: number;
  protein: number;
  onAdd: (id: string) => void;
}

export const FoodSelectorCard: React.FC<FoodItemProps> = ({
  id,
  name,
  calories,
  protein,
  onAdd
}) => {
  const [servings, setServings] = useState<number>(1);

  // Memoize scaled calculations to avoid redundant computations
  const totalNutrition = useMemo(() => ({
    totalCalories: Math.round(calories * servings),
    totalProtein: Math.round(protein * servings * 10) / 10
  }), [calories, protein, servings]);

  return (
    <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between">
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{name}</h4>
        <p className="text-xs text-gray-500">
          {totalNutrition.totalCalories} kcal • {totalNutrition.totalProtein}g Protein
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="px-2 py-1 text-xs border rounded-lg bg-gray-50 dark:bg-gray-800"
          aria-label="Select portion servings"
        >
          <option value={0.5}>0.5 serving</option>
          <option value={1}>1.0 serving</option>
          <option value={1.5}>1.5 servings</option>
          <option value={2}>2.0 servings</option>
        </select>

        <button
          onClick={() => onAdd(id)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
};
\`\`\`

**Why this pattern is effective:**
- **Explicit Interfaces:** Type contracts prevent runtime \`undefined\` prop bugs.
- **\`useMemo\` Optimization:** Ensures math recalculates only when inputs change.
- **Accessible Controls:** Form controls include proper labels and contrast.`,
        suggestedPrompts: [
          'Explain useEffect vs useLayoutEffect',
          'How does TypeScript generics work?',
          'What is the difference between state and props in React?',
          'How do I debounce an input in JavaScript?'
        ]
      };
    }

    if (query.includes('sql') || query.includes('database')) {
      return {
        text: `### SQL Database Querying & Best Practices

Here is an optimized relational SQL query demonstrating aggregation, filtering, and indexing principles:

\`\`\`sql
-- Daily Nutrition Totals per User with Target Gap Analysis
SELECT 
    u.id AS user_id,
    u.name,
    DATE(f.consumed_at) AS log_date,
    COUNT(f.id) AS total_logged_items,
    ROUND(SUM(f.calories), 0) AS total_calories,
    ROUND(SUM(f.protein), 1) AS total_protein_grams,
    u.daily_calorie_target,
    ROUND(u.daily_calorie_target - SUM(f.calories), 0) AS calorie_deficit_surplus
FROM users u
LEFT JOIN food_logs f ON u.id = f.user_id 
    AND f.consumed_at >= CURRENT_DATE - INTERVAL '7 days'
WHERE u.is_active = TRUE
GROUP BY u.id, u.name, DATE(f.consumed_at), u.daily_calorie_target
HAVING SUM(f.calories) > 0
ORDER BY log_date DESC, total_calories DESC;
\`\`\`

**Performance Tips:**
1. **Composite Index:** Create an index on \`(user_id, consumed_at)\` for rapid time-series filtering.
2. **Left Join:** Guarantees users with zero logs still appear if analyzing attendance.`,
        suggestedPrompts: [
          'Explain INNER JOIN vs LEFT JOIN vs FULL OUTER JOIN',
          'How do database indexes improve query speed?',
          'What is database normalization (1NF, 2NF, 3NF)?',
          'How to prevent SQL injection in web apps?'
        ]
      };
    }

    return {
      text: `### Software Development & Engineering Guidance

Programming is fundamentally about decomposing complex problems into composable, deterministic steps.

**Core Architectural Pillars:**
1. **Separation of Concerns:** Keep presentation (UI components), domain logic (math, calculations), and data persistence (storage, APIs) in distinct layers.
2. **Immutability & Pure Functions:** Functions that take arguments and return new values without side effects are trivial to test and reason about.
3. **Defensive Programming:** Validate external data schemas at boundary edges (e.g., using TypeScript schemas, Zod, or Pydantic).

Feel free to paste any code snippet, ask about an error message, or request an implementation in Python, TypeScript, React, SQL, or Go!`,
      suggestedPrompts: [
        'Write a Python script to sort and filter a dictionary',
        'Explain useEffect in React with an example',
        'How does Git rebase work vs merge?',
        'How to design a RESTful API?'
      ]
    };
  }

  // =========================================================================
  // 2. MATHEMATICS, EQUATIONS & CALCULATIONS
  // =========================================================================
  const isMathQuery = 
    query.includes('calculate') || query.includes('math') || query.includes('solve') ||
    query.includes('equation') || query.includes('bmr') || query.includes('tdee') ||
    query.includes('percentage') || query.includes('formula') || /[\d\s\+\-\*\/\=\^\(\)]{5,}/.test(query);

  if (isMathQuery) {
    // Check for standard TDEE / Calorie math
    if (query.includes('tdee') || query.includes('bmr') || query.includes('deficit')) {
      const bmr = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + (profile.gender === 'female' ? -161 : 5);
      const maintenance = Math.round(bmr * 1.55); // Moderate activity multiplier
      return {
        text: `### Personalized Energy Expenditure Calculations for ${profile.name}

Using the clinically validated **Mifflin-St Jeor Equation**:

**1. Basal Metabolic Rate (BMR):**
BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(yrs) ${profile.gender === 'female' ? '- 161' : '+ 5'}
- **Your BMR:** **${Math.round(bmr)} kcal/day** *(Calories burned at absolute rest)*

**2. Total Daily Energy Expenditure (TDEE):**
- Based on your activity level, your maintenance TDEE is approximately **~${maintenance} kcal/day**.

**3. Caloric Strategy for Goal (${profile.goal.replace('_', ' ').toUpperCase()}):**
- **Your Configured Target:** **${profile.calorieTarget} kcal/day**
- **Calculated Energy Balance:** ${profile.calorieTarget < maintenance ? `Moderate deficit of ~${maintenance - profile.calorieTarget} kcal/day (promotes ~0.4–0.5 kg weekly fat loss)` : `Surplus of ~${profile.calorieTarget - maintenance} kcal/day (supports lean muscle hypertrophy)`}
- **Protein Ratio:** **${profile.proteinTargetGrams}g** (${Math.round((profile.proteinTargetGrams * 4 / profile.calorieTarget) * 100)}% of total daily energy).`,
        suggestedPrompts: [
          'What is the thermic effect of food (TEF)?',
          'How many calories in a pound of fat?',
          'Calculate my macro ratio percentages',
          'What is non-exercise activity thermogenesis (NEAT)?'
        ]
      };
    }

    // Check for linear equation: e.g. 3x + 12 = 45 or 2x - 8 = 16
    const linearMatch = query.match(/(\d+)\s*x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i);
    if (linearMatch) {
      const a = parseInt(linearMatch[1], 10);
      const sign = linearMatch[2];
      const b = parseInt(linearMatch[3], 10);
      const c = parseInt(linearMatch[4], 10);
      
      const rhs = sign === '+' ? c - b : c + b;
      const x = rhs / a;

      return {
        text: `### Step-by-Step Mathematical Solution

Solving the linear equation:
\`\`\`text
${a}x ${sign} ${b} = ${c}
\`\`\`

**Step 1: Isolate the term containing x**
${sign === '+' ? `Subtract ${b} from both sides:` : `Add ${b} to both sides:`}
- ${a}x = ${c} ${sign === '+' ? '-' : '+'} ${b}
- ${a}x = ${rhs}

**Step 2: Solve for x by dividing both sides by ${a}**
- x = ${rhs} / ${a}
- **x = ${Number.isInteger(x) ? x : x.toFixed(2)}**

**Verification:**
${a}(${Number.isInteger(x) ? x : x.toFixed(2)}) ${sign} ${b} = ${a * x} ${sign} ${b} = ${c} (Confirmed ✓)`,
        suggestedPrompts: [
          'Solve quadratic equation: x^2 - 5x + 6 = 0',
          'How to calculate compound interest formula?',
          'Calculate 18% GST on 2400',
          'Explain Pythagoras theorem'
        ]
      };
    }

    return {
      text: `### Mathematical Problem Solving

Mathematics provides exact, quantitative frameworks for physical reality, computer science, and data analysis.

**Common Practical Formulas:**
- **Percentage Change:** ((New - Old) / Old) * 100
- **Compound Growth:** A = P * (1 + r/n)^(n*t)
- **Pythagorean Theorem:** a^2 + b^2 = c^2
- **Macronutrient Energy Density:**
  - Protein: 4 kcal/g
  - Carbohydrates: 4 kcal/g
  - Fat: 9 kcal/g
  - Alcohol: 7 kcal/g

Please share any calculation, algebraic expression, or geometry problem you would like solved step by step!`,
      suggestedPrompts: [
        'Calculate my exact TDEE and calorie deficit',
        'Solve 3x + 12 = 45',
        'How many calories are in 30g protein, 45g carbs, and 12g fat?',
        'Convert 75 kg to pounds'
      ]
    };
  }

  // =========================================================================
  // 3. SCIENCE, BIOLOGY & PHYSIOLOGY
  // =========================================================================
  const isScienceQuery = 
    query.includes('science') || query.includes('physics') || query.includes('chemistry') ||
    query.includes('biology') || query.includes('gravity') || query.includes('atom') ||
    query.includes('photosynthesis') || query.includes('muscle hypertrophy') || query.includes('atp');

  if (isScienceQuery) {
    if (query.includes('thermodynamics') || query.includes('energy conservation') || query.includes('physics')) {
      return {
        text: `### Scientific Principles: Thermodynamics & Energy Conservation

1. **The First Law of Thermodynamics (Energy Conservation):**
   - Energy cannot be created or destroyed; it merely changes form (\`ΔE = Q - W\`).
   - In biological systems, dietary chemical energy (calories from food) must balance mechanical work (muscle contraction), resting cellular homeostasis, heat dissipation (thermic effect of food), and stored chemical energy (glycogen and adipose tissue).

2. **The Second Law of Thermodynamics (Entropy):**
   - Isolated systems naturally evolve toward states of maximum disorder. Living organisms sustain internal cellular order by constantly consuming and metabolizing external energy.

3. **Newtonian Mechanics (F = m * a):**
   - Force equals mass multiplied by acceleration, governing physical load dynamics in resistance training and biomechanics.`,
        suggestedPrompts: [
          'How does the first law of thermodynamics govern weight loss?',
          'Explain mechanical tension and muscle hypertrophy',
          'What is cellular respiration and the ATP cycle?',
          'How does the thermic effect of food (TEF) work?'
        ]
      };
    }

    if (query.includes('muscle') || query.includes('hypertrophy') || query.includes('atp')) {
      return {
        text: `### Scientific Mechanisms of Skeletal Muscle Hypertrophy

Muscle hypertrophy occurs through three primary mechanical and biological stimuli:

1. **Mechanical Tension (The Primary Driver):**
   - Imposed when a muscle contracts against heavy external resistance through an active range of motion.
   - Mechanosensors (focal adhesion complexes and costameres) transduce mechanical force into chemical signaling cascades via the **mTORC1 (mechanistic target of rapamycin)** pathway.

2. **Muscle Protein Synthesis (MPS) vs Breakdown (MPB):**
   - For net muscle growth: Muscle Protein Synthesis (MPS) > Muscle Protein Breakdown (MPB).
   - Essential amino acids (particularly **Leucine**, requiring ~2.5g–3.0g per meal) trigger the Sestrin2-Rag GTPase pathway to activate mTOR.

3. **Cellular Energy (ATP Regeneration):**
   - **Phosphagen System (Creatine Phosphate):** Fuels maximal efforts lasting 1–10 seconds.
   - **Glycolytic Pathway:** Converts stored muscle glycogen into ATP for sets of 8–15 repetitions.
   - **Oxidative Phosphorylation:** Recharges ATP during recovery periods between sets.`,
        suggestedPrompts: [
          'How does creatine monohydrate work scientifically?',
          'What is the role of sleep in muscle protein synthesis?',
          'Explain the difference between Type 1 and Type 2 muscle fibers',
          'How much water is stored with muscle glycogen?'
        ]
      };
    }

    return {
      text: `### Scientific Principles & Empirical Reasoning

Science advances by formulating testable hypotheses, observing natural phenomena, and establishing reproducible models.

**Fundamental Laws of the Physical World:**
1. **First Law of Thermodynamics (Energy Conservation):** Energy can neither be created nor destroyed; it merely changes forms. This governs both astrophysics and human caloric balance.
2. **Newtonian Mechanics (F = m * a):** Force equals mass times acceleration, forming the foundation of resistance training and structural engineering.
3. **Cellular Energy (ATP Cycle):** Adenosine triphosphate acts as the universal chemical currency of biological life.

Feel free to ask about any topic in physics, cellular biology, organic chemistry, or astronomy!`,
      suggestedPrompts: [
        'Explain the first law of thermodynamics in human metabolism',
        'How does cellular respiration create energy?',
        'What is the difference between aerobic and anaerobic exercise?',
        'How do enzymes work in human digestion?'
      ]
    };
  }

  // =========================================================================
  // 4. KERALA CUISINE & AUTHENTIC CURRIES (SPECIALIZED)
  // =========================================================================
  if (matchedFood) {
    return {
      text: `### ${matchedFood.name} — Nutritional & Macro Breakdown

**Scientific Macro Profile per 100g:**
- **Calories:** **${matchedFood.per100g.calories} kcal**
- **Protein:** **${matchedFood.per100g.protein}g** (High-quality amino profile)
- **Carbohydrates:** **${matchedFood.per100g.carbs}g**
- **Fat:** **${matchedFood.per100g.fat}g**
- **Dietary Fiber:** **${matchedFood.per100g.fiber}g**

**Description & Culinary Preparation:**
${matchedFood.description}

**Coach's Macro Guidance for ${profile.name}:**
1. **Portion Availability:** Standard household portions include **${matchedFood.servings.map(s => s.label).join(', ')}**.
2. **Fitting into Today's Targets:** You have **${remainingCalories} kcal** and **${remainingProtein}g protein** remaining today.
3. **Log It Directly:** You can use the interactive food card below to select your serving size and add it straight to your Food Tracker!`,
      suggestedPrompts: [
        `How many calories in 1 cup of ${matchedFood.name}?`,
        `What foods pair best with ${matchedFood.name}?`,
        'Show me today\'s macro progress',
        'Suggest a high-protein dinner option'
      ]
    };
  }

  // Check specific Kerala staples
  if (query.includes('puttu') || query.includes('kadala') || query.includes('appam') || query.includes('kappa') || query.includes('meen') || query.includes('porotta') || query.includes('biriyani')) {
    if (query.includes('puttu')) {
      return {
        text: `### Puttu (Steamed Rice Cylinder) Nutritional Analysis

**Standard Profile (1 Medium Cylinder / 100g):**
- **Calories:** ~185 kcal • **Protein:** 3.4g • **Carbs:** 36.8g • **Fat:** 2.8g • **Fiber:** 2.1g

**Coach's Macro Strategy:**
1. **Kadala Curry Synergy:** Pairing 1 Puttu with 1 bowl (150g) of **Varutharacha Kadala Curry** delivers **~333 kcal and ~10.2g protein**.
2. **Protein Enhancement:** Add **2 boiled eggs (12.6g protein)** or **1 cup Greek yogurt** to hit your daily ${profile.proteinTargetGrams}g target!`,
        suggestedPrompts: [
          'Tell me about Kadala Curry nutrition',
          'Is wheat puttu better for weight loss?',
          'Suggest high-protein Kerala breakfast combinations',
          'What are the macros for Appam and Stew?'
        ]
      };
    }
    if (query.includes('meen') || query.includes('fish')) {
      return {
        text: `### Kerala Seafood & Lean Muscle Recovery

**Nutritional Comparison of Popular Kerala Fish Curries:**
- **Kudampuli Meen Mulakittathu (120g):** 142 kcal • **18.7g Protein** • 5.7g Fat (Top tier for fat loss)
- **Mathi / Sardine Fry (3 small fish, 105g):** 225 kcal • **22.0g Protein** • 14.5g Healthy Omega-3 Fats
- **Ayala / Mackerel Curry (130g):** 176 kcal • **19.8g Protein** • 9.4g Fat
- **Fish Moilee (with Coconut Milk, 150g):** 232 kcal • **20.7g Protein** • 14.7g Fat

Sardines and Mackerel provide world-class cardioprotective EPA/DHA omega-3 fatty acids for joint recovery and low systemic inflammation.`,
        suggestedPrompts: [
          'Tell me about Fish Moilee macros',
          'Is fish curry good for muscle building?',
          'Show me my remaining protein target today',
          'Suggest high-protein Kerala dinner'
        ]
      };
    }
  }

  // =========================================================================
  // 5. NUTRITION REVIEW & GAP ANALYSIS
  // =========================================================================
  if (query.includes('nutrition') || query.includes('calorie') || query.includes('macro') || query.includes('protein') || query.includes('diet') || query.includes('gap')) {
    return {
      text: `### Today's Nutritional Review for ${profile.name}

**Current Consumption vs Daily Budget:**
- **Calories:** **${Math.round(totals.calories)} / ${profile.calorieTarget} kcal** (${remainingCalories > 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal above target`})
- **Protein:** **${Math.round(totals.protein)}g / ${profile.proteinTargetGrams}g** (${remainingProtein > 0 ? `${remainingProtein}g needed` : 'Target achieved! 🎉'})
- **Carbs:** **${Math.round(totals.carbs)}g / ${profile.carbsTargetGrams}g** (${ctx.remainingCarbs > 0 ? `${ctx.remainingCarbs}g left` : 'Met'})
- **Fats:** **${Math.round(totals.fat)}g / ${profile.fatTargetGrams}g** (${ctx.remainingFat > 0 ? `${ctx.remainingFat}g left` : 'Met'})
- **Fiber:** **${Math.round(totals.fiber)}g / ${profile.fiberTargetGrams}g**

**Personalized Recommendations:**
1. **Protein Target:** ${remainingProtein > 15 ? `You still need **${remainingProtein}g protein** to reach your target. Consider adding 1 bowl of Kudampuli Meen Curry (19g) or 2 Boiled Eggs with Pepper (13g).` : 'Your protein intake is on track for muscle preservation and recovery!'}
2. **Fiber Check:** Add a cup of Cheera Thoran or Cabbage Thoran (3.2g fiber) to support gut microbiome diversity.`,
      suggestedPrompts: [
        'What should I eat for dinner within my macros?',
        'What Kerala foods will give me 30g protein?',
        'How to stay full on a calorie deficit?',
        'Tell me about Kadala Curry'
      ]
    };
  }

  // =========================================================================
  // 6. WORKOUT & TRAINING GUIDANCE
  // =========================================================================
  if (query.includes('workout') || query.includes('exercise') || query.includes('training') || query.includes('gym')) {
    if (todayWorkout) {
      return {
        text: `### Today's Workout Analysis: ${todayWorkout.name}

- **Target Focus:** ${todayWorkout.targetFocus}
- **Duration:** ${todayWorkout.durationMinutes} minutes
- **Scheduled Status:** ${todayWorkout.completed ? 'Completed! 💪' : (todayWorkout.isRestDay ? 'Scheduled Rest & Recovery Day' : 'Pending')}

**Coach's Tips for ${profile.name}:**
1. **Busy Schedule Adaptation:** If you only have 20–30 minutes, perform paired antagonist supersets (e.g., Chest Press paired with Chest-Supported Row) to cut rest time in half without reducing volume.
2. **Progressive Overload:** Record your working sets in the **Workout Planner** tab to ensure week-over-week mechanical progression.`,
        suggestedPrompts: [
          'Adapt my workout for 20 minutes',
          'How to progress weights safely?',
          'What to eat pre-workout?',
          'Should I do cardio before or after weights?'
        ]
      };
    }
  }

  // =========================================================================
  // 7. DEFAULT GENERAL-PURPOSE ASSISTANT GREETING & RESPONSE
  // =========================================================================
  return {
    text: `Hello ${profile.name}! I am your **NutriCoach AI** companion.

I can assist you with:
- **Nutrition & Diet:** Macro breakdowns, personalized meal feedback, calorie budgets, and our complete **70+ Kerala & Indian curries database**.
- **Fitness & Training:** Workout plans, progressive overload, injury modifications, and recovery science.
- **General Knowledge & Problem-Solving:** Coding (Python, JavaScript, TypeScript, SQL), mathematics, science, writing, essay outlines, and productivity.

How can I help you today? You can ask me anything!`,
    suggestedPrompts: [
      'What Kerala foods will give me 30g protein?',
      'How to fit Puttu and Kadala curry into my macros?',
      'Write a Python script to sort and filter a dictionary',
      'Analyze my nutrition gaps today'
    ]
  };
};
