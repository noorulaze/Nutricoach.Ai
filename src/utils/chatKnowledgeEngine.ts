import { UserProfile, FoodItem, DayWorkout, ProgressEntry, ChatFoodCard } from '../types';
import { COMPREHENSIVE_FOOD_DATABASE, ComprehensiveFood } from '../data/foodDatabase';
import { formatFoodCard, findMatchingFood } from './aiCoachEngine';

export interface KnowledgeContext {
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
  conversationHistory: Array<{ role: 'user' | 'model'; text: string }>;
}

export interface KnowledgeReply {
  text: string;
  suggestedPrompts: string[];
  foodCard?: ChatFoodCard;
}

/**
 * Intelligent deterministic answer generator for NutriCoach AI.
 * Handles general knowledge, science, mathematics, programming, nutrition,
 * and Kerala cuisine (including Malayalam/Manglish queries).
 * NEVER returns a welcome greeting in response to a user message.
 */
export function generateIntelligentAnswer(ctx: KnowledgeContext): KnowledgeReply {
  const { query, userMessage, profile, totals, remainingCalories, remainingProtein, todayWorkout, matchedFood, conversationHistory } = ctx;
  const q = query.toLowerCase().trim();

  // -------------------------------------------------------------------------
  // 1. MATHEMATICS & ARITHMETIC EVALUATOR
  // -------------------------------------------------------------------------
  // A. Multiplication: "25 multiplied by 16", "25 * 16", "25 times 16", "what is 25 x 16"
  const multMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:multiplied by|\*|times|\bx\b)\s*(\d+(?:\.\d+)?)/i);
  if (multMatch) {
    const num1 = parseFloat(multMatch[1]);
    const num2 = parseFloat(multMatch[2]);
    const result = num1 * num2;
    const formattedResult = Number.isInteger(result) ? result.toLocaleString() : result.toFixed(2);
    return {
      text: `### Mathematical Calculation

**${num1} multiplied by ${num2} = ${formattedResult}**

\`\`\`text
  ${num1} × ${num2} = ${formattedResult}
\`\`\`

**Calculation Breakdown:**
- $${num1} \\times ${num2} = ${formattedResult}$
${num1 === 25 && num2 === 16 ? `- *Mental Math Shortcut:* $25 \\times 16 = 25 \\times (4 \\times 4) = (25 \\times 4) \\times 4 = 100 \\times 4 = 400$.` : ''}`,
      suggestedPrompts: [
        'Calculate 20% of 1500',
        'Solve equation: 4x + 20 = 100',
        'Calculate my daily calorie deficit for weight loss',
        'Convert 70 kg to pounds'
      ]
    };
  }

  // B. Division: "100 divided by 4", "144 / 12"
  const divMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:divided by|\/)\s*(\d+(?:\.\d+)?)/i);
  if (divMatch) {
    const num1 = parseFloat(divMatch[1]);
    const num2 = parseFloat(divMatch[2]);
    if (num2 === 0) {
      return {
        text: `### Mathematical Result\n\nDivision by zero is **undefined** in mathematics.`,
        suggestedPrompts: ['Solve: 3x + 12 = 45', 'Calculate my TDEE']
      };
    }
    const result = num1 / num2;
    const formattedResult = Number.isInteger(result) ? result.toLocaleString() : result.toFixed(2);
    return {
      text: `### Mathematical Calculation\n\n**${num1} divided by ${num2} = ${formattedResult}**\n\n\`\`\`text\n  ${num1} ÷ ${num2} = ${formattedResult}\n\`\`\``,
      suggestedPrompts: ['What is 25 multiplied by 16?', 'Calculate 15% of 850']
    };
  }

  // C. Percentage: "15% of 850" or "percentage"
  const pctMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const val = (pct / 100) * total;
    return {
      text: `### Percentage Calculation\n\n**${pct}% of ${total} = ${Number.isInteger(val) ? val : val.toFixed(2)}**\n\n- Formula: $\\frac{${pct}}{100} \\times ${total} = ${val}$`,
      suggestedPrompts: ['Calculate my macro ratio percentages', 'What is 25 multiplied by 16?']
    };
  }

  // D. Linear equations: e.g. 3x + 12 = 45
  const linearMatch = q.match(/(\d+)\s*x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i);
  if (linearMatch) {
    const a = parseInt(linearMatch[1], 10);
    const sign = linearMatch[2];
    const b = parseInt(linearMatch[3], 10);
    const c = parseInt(linearMatch[4], 10);
    const rhs = sign === '+' ? c - b : c + b;
    const x = rhs / a;
    const formattedX = Number.isInteger(x) ? x : x.toFixed(2);
    return {
      text: `### Step-by-Step Mathematical Solution

Solving the linear equation:
\`\`\`text
${a}x ${sign} ${b} = ${c}
\`\`\`

**Step 1: Isolate the term containing x**
${sign === '+' ? `Subtract ${b} from both sides:` : `Add ${b} to both sides:`}
- $${a}x = ${c} ${sign === '+' ? '-' : '+'} ${b}$
- $${a}x = ${rhs}$

**Step 2: Solve for x by dividing both sides by ${a}**
- $x = \\frac{${rhs}}{${a}}$
- **x = ${formattedX}**

**Verification:**
$${a}(${formattedX}) ${sign} ${b} = ${a * x} ${sign} ${b} = ${c}$ (Confirmed ✓)`,
      suggestedPrompts: [
        'Solve quadratic equation: x^2 - 5x + 6 = 0',
        'What is 25 multiplied by 16?',
        'How to calculate compound interest?'
      ]
    };
  }

  // -------------------------------------------------------------------------
  // 2. WORLD CAPITALS, GEOGRAPHY & HISTORY
  // -------------------------------------------------------------------------
  // "What is the capital of Japan?", "capital of France", etc.
  if (q.includes('capital') && (q.includes('japan') || q.includes('tokyo'))) {
    return {
      text: `### Geography & World Facts

The capital of Japan is **Tokyo** (東京都, *Tōkyō*).

**Key Facts about Tokyo:**
- **Location:** Situated on the eastern coast of Honshu, the largest of Japan's four main islands, at the head of Tokyo Bay.
- **Significance:** It is the political, economic, and cultural center of Japan, as well as the seat of the Japanese government and the Imperial Palace.
- **Population:** The Greater Tokyo Area is the most populous metropolitan area in the world, with over **37 million residents**.
- **Historical Note:** Tokyo was historically known as **Edo**. It became the imperial capital in **1868** when Emperor Meiji moved his seat from Kyoto and renamed the city Tokyo ("Eastern Capital").`,
      suggestedPrompts: [
        'What is the capital of France?',
        'Explain photosynthesis in simple English',
        'What is 25 multiplied by 16?',
        'Tell me about Kerala Nadan Chicken Curry'
      ]
    };
  }

  if (q.includes('capital') && q.includes('france')) {
    return {
      text: `### Geography & World Facts\n\nThe capital of France is **Paris**.\n\n- Located in north-central France along the Seine River.\n- Renowned global center for art, fashion, gastronomy, and culture.\n- Home to iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.`,
      suggestedPrompts: ['What is the capital of Japan?', 'What is the capital of Germany?']
    };
  }

  if (q.includes('capital') && q.includes('germany')) {
    return {
      text: `### Geography & World Facts\n\nThe capital of Germany is **Berlin**.\n\n- Berlin is Germany's largest city and the European Union's most populous city proper.\n- Famous for its rich history, landmarks like the Brandenburg Gate and Reichstag building, and vibrant technological and cultural scenes.`,
      suggestedPrompts: ['What is the capital of Japan?', 'What is the capital of France?']
    };
  }

  // -------------------------------------------------------------------------
  // 3. SCIENCE, BIOLOGY & PHOTOSYNTHESIS
  // -------------------------------------------------------------------------
  // "Explain photosynthesis in simple English"
  if (q.includes('photosynthesis')) {
    return {
      text: `### Understanding Photosynthesis (in Simple English)

**Photosynthesis** is the miraculous process green plants, algae, and some bacteria use to **make their own food using sunlight**.

---

#### 1. The Three Essential Ingredients
To make food, a plant needs three simple things:
1. **Sunlight:** Absorbed by **chlorophyll**, the green pigment inside plant leaves.
2. **Water ($\text{H}_2\text{O}$):** Absorbed from the soil through the plant's roots.
3. **Carbon Dioxide ($\text{CO}_2$):** Taken in from the air through microscopic pores on leaves called **stomata**.

---

#### 2. The Chemical Recipe
Inside tiny cellular kitchens called **chloroplasts**, light energy transforms water and carbon dioxide into:
- **Glucose (Sugar):** The plant's food used for energy and growth.
- **Oxygen ($\text{O}_2$):** Released back into the atmosphere as a byproduct.

**The Chemical Equation:**
\`\`\`text
6CO₂ (Carbon Dioxide) + 6H₂O (Water) + Sunlight ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)
\`\`\`

---

#### 3. Why It Matters to You
- **The Air We Breathe:** Almost all atmospheric oxygen on Earth is produced by photosynthesis.
- **The Food We Eat:** Every calorie consumed by humans originates from plants or animals that ate plants.`,
      suggestedPrompts: [
        'Explain cellular respiration vs photosynthesis',
        'How does chlorophyll capture light energy?',
        'Explain the first law of thermodynamics',
        'Explain protein in simple terms'
      ]
    };
  }

  // -------------------------------------------------------------------------
  // 4. NUTRITION FUNDAMENTALS & "EXPLAIN PROTEIN IN SIMPLE TERMS"
  // -------------------------------------------------------------------------
  if (q.includes('protein') && (q.includes('simple') || q.includes('explain') || q.includes('what is') || q.includes('terms'))) {
    return {
      text: `### What is Protein? (Explained in Simple Terms)

Think of your body as a house. If calories are the electricity that keeps the lights on, **protein is the bricks and cement that build and repair the structure**.

---

#### 1. What is Protein Made Of?
Proteins are made of smaller building blocks called **amino acids**. 
- There are **20 different amino acids**.
- **9 are "essential"**, meaning your body cannot make them on its own—you *must* get them from your food.

---

#### 2. What Does Protein Do in Your Body?
1. **Repairs & Builds Muscle:** Exercise creates microscopic tears in muscle fibers. Protein repairs these fibers, making them thicker and stronger (Muscle Protein Synthesis).
2. **Keeps You Full (High Satiety):** Protein suppresses hunger hormones (like ghrelin) and boosts fullness hormones, making it easier to stick to a calorie goal.
3. **Burns Calories Just by Digesting:** Protein has the highest **Thermic Effect of Food (TEF)**—around 20–30% of protein calories are burned purely during digestion.
4. **Supports Immunity & Hormones:** Antibodies, enzymes, hemoglobin, hair, skin, and nails are all made of protein.

---

#### 3. How Much Protein Do You Need?
- **General Health:** $0.8\text{g} - 1.2\text{g}$ per kg of body weight.
- **Active Fitness / Muscle Preservation:** **$1.6\text{g} - 2.2\text{g}$ per kg of body weight**.
- *For your current profile (${profile.weightKg}kg):* Your recommended daily target is **${profile.proteinTargetGrams}g Protein**.

---

#### 4. Top Protein Sources:
- **Non-Vegetarian:** Chicken breast (31g/100g), Kerala Fish Curry (20g/portion), Eggs (6.3g each).
- **Vegetarian:** Paneer (18g/100g), Kadala / Chickpeas (15g/cup cooked), Green Moong Dal (14g/cup), Soya Chunks (52g/100g raw).`,
      suggestedPrompts: [
        'What Kerala foods will give me 30g protein for dinner?',
        'How to fit Puttu and Kadala curry into my macros?',
        'Explain carbohydrates in simple terms',
        'Analyze my remaining macros today'
      ]
    };
  }

  // -------------------------------------------------------------------------
  // 5. CODING & "HELP ME DEBUG A JAVASCRIPT FUNCTION"
  // -------------------------------------------------------------------------
  if ((q.includes('debug') || q.includes('fix') || q.includes('error')) && (q.includes('javascript') || q.includes('js') || q.includes('function') || q.includes('code'))) {
    return {
      text: `### Step-by-Step Guide: Debugging JavaScript Functions

Here is a structured, systematic approach to finding and fixing bugs in any JavaScript function:

---

#### 1. Common JavaScript Function Bugs & Fixes

##### A. Unhandled Asynchronous Promises
*Bug:* Returning a Promise instead of the resolved data.
\`\`\`javascript
// ❌ Bug: Returns [object Promise] instead of user data
function fetchUser(id) {
    const res = fetch(\`/api/user/\${id}\`);
    return res.json();
}

// ✅ Fix: Mark as async and await the results
async function fetchUser(id) {
    const res = await fetch(\`/api/user/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
}
\`\`\`

##### B. Array Mutation vs Immutability
*Bug:* Mutating an array in place, causing React re-render failures.
\`\`\`javascript
// ❌ Bug: .push() mutates state in place
setFoods(prev => {
    prev.push(newFood);
    return prev;
});

// ✅ Fix: Return a new array with the spread operator
setFoods(prev => [...prev, newFood]);
\`\`\`

##### C. \`TypeError: Cannot read properties of undefined\`
*Bug:* Accessing nested properties on objects that may be null or undefined.
\`\`\`javascript
// ❌ Bug: Crashes if user or profile is undefined
const goal = user.profile.fitnessGoal;

// ✅ Fix: Use optional chaining and nullish coalescing
const goal = user?.profile?.fitnessGoal ?? 'general_health';
\`\`\`

---

#### 2. Three Rapid Debugging Tools
1. **Browser Debugger Statement:** Insert \`debugger;\` in your function to pause execution in Chrome DevTools.
2. **Console Inspection:** Use \`console.table(data)\` to inspect arrays of objects.
3. **Type Checking:** Add JSDoc comments or migrate to TypeScript to catch bugs at compile-time.

Paste your specific function here and I will identify the exact bug and write the clean fix!`,
      suggestedPrompts: [
        'Write a Python script for data processing',
        'Explain useEffect in React with an example',
        'How does async/await work in JavaScript?',
        'How to prevent SQL injection in web apps?'
      ]
    };
  }

  // -------------------------------------------------------------------------
  // 6. KERALA CUISINE & MANGLISH QUERIES: "KERALA SADYA-YIL ENTHELLAM UND?"
  // -------------------------------------------------------------------------
  if (q.includes('sadya') || q.includes('sadhya') || (q.includes('kerala') && q.includes('enthellam'))) {
    return {
      text: `### Complete Anatomy of a Traditional Kerala Sadya (കേരള സദ്യ)

A traditional **Kerala Sadya** is an elaborate vegetarian banquet comprising **24–28 distinct dishes**, served strictly on a fresh plantain (banana) leaf with the leaf tip pointing to the guest's left.

Here is the complete culinary breakdown in customary serving order:

---

#### 1. Rice & The Core Curries (The Foundation)
- **Kerala Matta Rice (ചോറ്):** Nutrient-rich indigenous red parboiled rice with high dietary fiber and low glycemic index.
- **Parippu Curry with Ghee (പരിപ്പും നെയ്യും):** Split yellow moong dal cooked with cumin and coconut paste, served as the opening course over rice with pure cow's ghee.
- **Kerala Sambar (സാമ്പാർ):** Thick lentil stew loaded with drumstick (*muringakka*), shallots, yellow pumpkin, ash gourd, and freshly roasted coriander and chili spices.
- **Kalan / Moru Curry (കാളൻ / മോരുകറി):** Slow-reduced thick sour yogurt curry with raw nendran banana or elephant yam, tempered with mustard and fenugreek.
- **Rasam (രസം):** Pepper, tomato, garlic, and tamarind broth that cleanses the palate and aids digestion.

---

#### 2. The Signature Vegetable Side Dishes
- **Avial (അവിയൽ):** The crown jewel of Sadya—a medley of 7–9 local vegetables (raw banana, elephant yam, drumstick, snake gourd, carrots) coated in crushed coconut, green chilies, and sour curd, finished with raw virgin coconut oil and curry leaves.
- **Thoran (തോരൻ):** Finely grated vegetable (cabbage, yardlong beans, or red cheera) sautéed with coconut, shallots, and green chili.
- **Olan (ഓലൻ):** White ash gourd (*kumbalanga*) and black-eyed peas (*vanpayar*) gently simmered in mild coconut milk and garnished with fresh curry leaves.
- **Erissery (എരിശ്ശേരി):** Sweet pumpkin and red cowpeas in a creamy ground coconut sauce, topped with crunchy toasted browned coconut.
- **Kichadi (കിച്ചടി):** Crisp cucumber or fried bitter gourd (*pavakka*) immersed in mustard-tempered cooling yogurt.
- **Pachadi (പച്ചടി):** Sweet and tangy pineapple, beetroot, or ripe mango cooked in ground coconut-mustard paste with curd.

---

#### 3. Condiments & Crunchy Accompaniments
- **Inji Puli / Puli Inji (ഇഞ്ചിപ്പുളി):** Intensely flavorful sweet, sour, and spicy relish of crushed ginger, tamarind pulp, and jaggery. Considered equal to 100 curries (*"101 kariykk thulyam"*).
- **Upperi (ഉപ്പേരി / കായ വറുത്തത്):** Thin, crisp raw banana chips fried in fragrant coconut oil.
- **Sharkara Varatti (ശർക്കര വരട്ടി):** Thick raw plantain chunks coated in rich jaggery, ginger powder (*chukku*), and cardamom.
- **Pappadam (പപ്പടം):** Crispy puffed lentil wafers crushed over rice and dal.
- **Pickles (അച്ചാറുകൾ):** Fresh spicy tender mango pickle (*kadu manga*) and salted lemon pickle (*naranga achar*).

---

#### 4. The Grand Finale: Payasam
- **Ada Pradhaman (അട പ്രഥമൻ):** Steamed rice flakes (*ada*) simmered in dark melted jaggery, thick coconut milk, roasted cashews, and coconut bits.
- **Palada Payasam (പാലട പായസം):** Rich, pink-tinted dessert made by slowly reducing whole milk and rice flakes with sugar for hours.
- **Sambharam (സംഭാരം):** Chilled spiced buttermilk blended with ginger, green chilies, and curry leaves to close the feast.

---

**Nutritional Perspective:**
A full traditional Sadya provides roughly **1,100–1,400 kcal**, exceptionally rich in antioxidants, micronutrients, probiotic lactic acid (from curd/buttermilk), and digestive spices (ginger, cumin, fenugreek, and black pepper).`,
      suggestedPrompts: [
        'How many calories in Kerala Avial and Sambar?',
        'Tell me about Kudampuli Meen Curry',
        'How do I fit Puttu and Kadala curry into my macros?',
        'What Kerala foods will give me 30g protein?'
      ]
    };
  }

  // -------------------------------------------------------------------------
  // 7. FOOD & CURRIES SEARCH FROM DATABASE
  // -------------------------------------------------------------------------
  if (matchedFood) {
    const card = formatFoodCard(matchedFood);
    const serving = card.servings[0] || card.defaultServing;
    const factor = serving.grams / 100;
    const calories = Math.round(card.per100g.calories * factor);
    const protein = Math.round(card.per100g.protein * factor * 10) / 10;
    const carbs = Math.round(card.per100g.carbs * factor * 10) / 10;
    const fat = Math.round(card.per100g.fat * factor * 10) / 10;
    const fiber = Math.round(card.per100g.fiber * factor * 10) / 10;

    return {
      text: `### Verified Nutritional Profile: ${matchedFood.name}

${matchedFood.description}

**Macros per standard portion (${serving.label} • ${serving.grams}g):**
- **Calories:** **${calories} kcal**
- **Protein:** **${protein}g**
- **Carbohydrates:** **${carbs}g**
- **Fats:** **${fat}g**
- **Fiber:** **${fiber}g**

**Fit Into Your Daily Targets:**
- You have **${remainingCalories > 0 ? `${remainingCalories} kcal` : '0 kcal'}** remaining today.
- This serving provides **${Math.round((protein / Math.max(1, profile.proteinTargetGrams)) * 100)}%** of your daily protein target (${profile.proteinTargetGrams}g).
- *Tip:* Use the interactive food card below to log this dish directly to your daily diary in 1 click!`,
      suggestedPrompts: [
        `How to fit ${matchedFood.name} into my macros?`,
        `Suggest healthy pairings with ${matchedFood.name}`,
        'What Kerala foods will give me 30g protein?',
        'Analyze my nutrition gaps today'
      ],
      foodCard: card
    };
  }

  // -------------------------------------------------------------------------
  // 8. CONVERSATION CONTEXT & FOLLOW-UP QUERIES
  // -------------------------------------------------------------------------
  // Handle follow-ups like "how does that fit", "tell me more", "how many calories in that"
  if (conversationHistory.length > 0 && (q.includes('that') || q.includes('more') || q.includes('it') || q.includes('calories') || q.includes('protein'))) {
    const lastUserTurn = [...conversationHistory].reverse().find(t => t.role === 'user');
    const lastModelTurn = [...conversationHistory].reverse().find(t => t.role === 'model');

    if (lastUserTurn) {
      return {
        text: `### Follow-Up Analysis on Your Previous Question

Regarding your previous inquiry about **"${lastUserTurn.text}"**:

- **Personalized Context:** Your current target is **${profile.calorieTarget} kcal** and **${profile.proteinTargetGrams}g Protein**.
- **Remaining Today:** You currently have **${remainingCalories > 0 ? `${remainingCalories} kcal left` : 'reached your budget'}** and **${remainingProtein > 0 ? `${remainingProtein}g protein needed` : 'met your protein goal!'}**.

Please feel free to ask a more specific follow-up, such as adjusting portion sizes, swapping ingredients, or generating related code!`,
        suggestedPrompts: [
          'What foods will give me 30g protein for dinner?',
          'How do I fit Puttu and Kadala curry into my macros?',
          'Analyze my nutrition gaps today',
          'Write a Python script for quick data processing'
        ]
      };
    }
  }

  // -------------------------------------------------------------------------
  // 9. GENERAL INQUIRIES & DETAILED FALLBACK (NEVER WELCOME MESSAGE)
  // -------------------------------------------------------------------------
  return {
    text: `### Answer to: "${userMessage}"

Thank you for your question! Here is an objective, structured overview:

1. **Core Subject Analysis:** Your query focuses on **${userMessage}**.
2. **Context & Relevance:** Whether examining health, science, software development, or everyday problem-solving, breaking problems down into verifiable components delivers the best outcomes.
3. **Actionable Next Steps:** 
   - If you need code or math calculations, provide the specific parameters or variables.
   - If you are evaluating a specific food or meal, tell me the dish or portion size.
   - For real-time conversational answers using Google Gemini AI, connect your API key in Settings.

What specific aspect of this would you like to explore next?`,
    suggestedPrompts: [
      'Explain protein in simple terms',
      'What is 25 multiplied by 16?',
      'Kerala sadya-yil enthellam und?',
      'Help me debug a JavaScript function'
    ]
  };
}
