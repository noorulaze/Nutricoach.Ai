import { 
  MealPlannerPreferences, 
  PlannedMeal, 
  DayPlan, 
  MealIngredient, 
  MealSubstitution 
} from '../types/mealPlanner';

interface TemplateMeal {
  name: string;
  cuisine: string;
  dietaryType: 'vegetarian' | 'non_vegetarian';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTimeMin: number;
  servingSize: string;
  description: string;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  baseFiber: number;
  ingredients: MealIngredient[];
  instructions: string[];
  substitutions: MealSubstitution[];
  allergens: string[];
}

/**
 * Authentic culinary repertoire of Kerala, South/North Indian and healthy international meals.
 */
export const AUTHENTIC_MEAL_TEMPLATES: TemplateMeal[] = [
  // --- BREAKFASTS ---
  {
    name: 'Puttu with Kadala Curry',
    cuisine: 'kerala',
    dietaryType: 'vegetarian',
    mealType: 'breakfast',
    prepTimeMin: 25,
    servingSize: '1 cylindrical puttu (120g) + 1 bowl kadala curry (150g)',
    description: 'Steamed coarse rice flour layered with fresh coconut, paired with roasted black chickpea curry in a spiced shallot gravy.',
    baseCalories: 430,
    baseProtein: 14.5,
    baseCarbs: 68.0,
    baseFat: 10.5,
    baseFiber: 9.8,
    allergens: ['coconut'],
    ingredients: [
      { name: 'Rice puttu flour (Ari podi)', amount: 80, unit: 'g', notes: 'Coarse ground' },
      { name: 'Fresh grated coconut', amount: 30, unit: 'g', notes: 'Freshly scraped' },
      { name: 'Black chickpeas (Kadala)', amount: 70, unit: 'g', notes: 'Soaked and pressure cooked' },
      { name: 'Shallots', amount: 40, unit: 'g', notes: 'Thinly sliced' },
      { name: 'Coconut oil', amount: 1, unit: 'tsp', notes: 'For tempering' },
      { name: 'Mustard seeds & Curry leaves', amount: 1, unit: 'tsp', notes: 'Aromatic tempering' },
      { name: 'Kashmiri chili & Coriander powder', amount: 1, unit: 'tbsp', notes: 'Freshly roasted spices' }
    ],
    instructions: [
      'Moisten puttu flour gently with salted lukewarm water until crumbly.',
      'Layer flour and grated coconut into a puttu maker and steam for 6-8 minutes.',
      'Sauté shallots, ginger, and garlic in coconut oil with curry leaves.',
      'Add roasted spices, cooked black chickpeas, and simmer until thick gravy forms.',
      'Serve steaming hot puttu with savory kadala curry.'
    ],
    substitutions: [
      { original: 'Rice flour', substitute: 'Whole wheat (Godhambu) or Ragi flour', note: 'Higher fiber, lower glycemic index' },
      { original: 'Coconut oil', substitute: 'Olive oil', note: 'Alternative monounsaturated fat' }
    ]
  },
  {
    name: 'Appam with Vegetable Stew',
    cuisine: 'kerala',
    dietaryType: 'vegetarian',
    mealType: 'breakfast',
    prepTimeMin: 20,
    servingSize: '2 appams with 1 bowl vegetable stew (180g)',
    description: 'Crisp lacy-edged rice hoppers with soft spongy center, served with fragrant coconut milk simmered potatoes, carrots, and peas.',
    baseCalories: 360,
    baseProtein: 8.2,
    baseCarbs: 56.0,
    baseFat: 12.0,
    baseFiber: 6.2,
    allergens: ['coconut'],
    ingredients: [
      { name: 'Fermented rice appam batter', amount: 160, unit: 'g', notes: 'Naturally fermented' },
      { name: 'Thin coconut milk', amount: 120, unit: 'ml', notes: 'For cooking vegetables' },
      { name: 'Thick coconut milk', amount: 40, unit: 'ml', notes: 'Added at finish' },
      { name: 'Potatoes and carrots', amount: 80, unit: 'g', notes: 'Diced' },
      { name: 'Green peas', amount: 30, unit: 'g', notes: 'Fresh or frozen' },
      { name: 'Whole spices (Cardamom, Clove, Cinnamon)', amount: 1, unit: 'pinch', notes: 'Whole aroma' },
      { name: 'Green chilies & ginger', amount: 1, unit: 'tbsp', notes: 'Slit and crushed' }
    ],
    instructions: [
      'Pour appam batter into an appachatti, swirl evenly, cover and cook until edges turn golden.',
      'Boil diced potatoes, carrots, and green peas with ginger, slit green chilies, and whole spices in thin coconut milk.',
      'Once tender, stir in thick coconut milk, turn off flame, and temper with curry leaves in coconut oil.',
      'Serve warm appams with delicate vegetable stew.'
    ],
    substitutions: [
      { original: 'Vegetable stew', substitute: 'Egg roast or Chicken stew', note: 'If higher protein is desired' },
      { original: 'Coconut milk', substitute: 'Low-fat cow milk or almond milk', note: 'For lower calorie density' }
    ]
  },
  {
    name: 'Idiyappam with Nadan Egg Roast',
    cuisine: 'kerala',
    dietaryType: 'non_vegetarian',
    mealType: 'breakfast',
    prepTimeMin: 25,
    servingSize: '3 idiyappams + 2 boiled eggs in caramelized onion roast',
    description: 'Delicate steamed rice string hoppers paired with hard-boiled eggs simmered in rich Kerala spiced shallot and tomato roast.',
    baseCalories: 410,
    baseProtein: 18.5,
    baseCarbs: 52.0,
    baseFat: 14.0,
    baseFiber: 4.5,
    allergens: ['egg'],
    ingredients: [
      { name: 'Idiyappam rice flour', amount: 70, unit: 'g', notes: 'Roasted fine rice flour' },
      { name: 'Boiled large eggs', amount: 2, unit: 'piece', notes: 'Hard-boiled, halved' },
      { name: 'Shallots & Red onions', amount: 70, unit: 'g', notes: 'Finely sliced' },
      { name: 'Tomato', amount: 50, unit: 'g', notes: 'Chopped ripe' },
      { name: 'Coconut oil', amount: 1, unit: 'tsp', notes: 'Cold-pressed' },
      { name: 'Ginger garlic paste', amount: 1, unit: 'tsp', notes: 'Freshly pounded' },
      { name: 'Fennel & Garam masala', amount: 0.5, unit: 'tsp', notes: 'Warm aromatic spices' }
    ],
    instructions: [
      'Knead roasted rice flour with boiling salted water into soft dough. Press through seva press into steamer plates and steam for 7 minutes.',
      'Heat oil in a pan, sauté onions and shallots until golden brown and caramelized.',
      'Add ginger-garlic, tomatoes, turmeric, chili powder, and fennel powder; cook until oil separates.',
      'Toss halved boiled eggs gently into the gravy and garnish with fresh curry leaves.'
    ],
    substitutions: [
      { original: 'Boiled eggs', substitute: 'Spiced boiled chickpeas or Paneer cubes', note: 'Vegetarian alternative' },
      { original: 'Rice flour', substitute: 'Ragi idiyappam powder', note: 'Higher calcium and iron' }
    ]
  },
  {
    name: 'Masala Dosa with Sambar & Coconut Chutney',
    cuisine: 'south_indian',
    dietaryType: 'vegetarian',
    mealType: 'breakfast',
    prepTimeMin: 20,
    servingSize: '1 large crisp dosa filled with potato masala + 1 cup sambar',
    description: 'Crispy fermented rice and urad dal crepe wrapped around fragrant turmeric-tempered mashed potatoes, served with lentil vegetable stew.',
    baseCalories: 380,
    baseProtein: 9.5,
    baseCarbs: 62.0,
    baseFat: 10.5,
    baseFiber: 6.0,
    allergens: ['coconut'],
    ingredients: [
      { name: 'Fermented dosa batter (Rice & Urad dal)', amount: 120, unit: 'g', notes: 'Thin spreadable' },
      { name: 'Boiled potatoes', amount: 100, unit: 'g', notes: 'Coarsely mashed' },
      { name: 'Onions', amount: 30, unit: 'g', notes: 'Sliced' },
      { name: 'Toor dal sambar with vegetables', amount: 150, unit: 'ml', notes: 'Fresh drumstick-tomato sambar' },
      { name: 'Coconut chutney', amount: 2, unit: 'tbsp', notes: 'Roasted gram & green chili' },
      { name: 'Mustard seeds & Curry leaves', amount: 0.5, unit: 'tsp', notes: 'Tempering' }
    ],
    instructions: [
      'Sauté mustard seeds, green chilies, onions, and curry leaves in oil. Add turmeric and fold into mashed potatoes.',
      'Pour batter onto a hot cast-iron tawa and spread outwards into a thin golden crepe.',
      'Place spiced potato filling inside, roll the dosa, and serve with hot sambar and fresh chutney.'
    ],
    substitutions: [
      { original: 'Potato filling', substitute: 'Paneer or Tofu bhurji', note: 'Boosts protein by +12g' },
      { original: 'Dosa batter', substitute: 'Oats & moong dal batter', note: 'Lower glycemic index' }
    ]
  },
  {
    name: 'Rolled Oats Porridge with Banana, Chia & Almonds',
    cuisine: 'international',
    dietaryType: 'vegetarian',
    mealType: 'breakfast',
    prepTimeMin: 10,
    servingSize: '1 deep bowl (250g)',
    description: 'Hearty whole rolled oats simmered in warm milk, topped with sliced ripe bananas, crunchy roasted almonds, and omega-3 rich chia seeds.',
    baseCalories: 340,
    baseProtein: 13.0,
    baseCarbs: 54.0,
    baseFat: 8.5,
    baseFiber: 7.5,
    allergens: ['milk', 'tree_nuts'],
    ingredients: [
      { name: 'Rolled oats', amount: 50, unit: 'g', notes: 'Whole rolled' },
      { name: 'Low-fat milk (or Almond milk)', amount: 200, unit: 'ml', notes: 'Warm' },
      { name: 'Ripe banana', amount: 1, unit: 'small', notes: 'Sliced' },
      { name: 'Chia seeds', amount: 1, unit: 'tsp', notes: 'Fiber & Omega-3' },
      { name: 'Crushed almonds', amount: 10, unit: 'g', notes: 'Unsalted' },
      { name: 'Ground cinnamon', amount: 1, unit: 'pinch', notes: 'Natural sweetness' }
    ],
    instructions: [
      'Simmer rolled oats in milk on medium heat for 4-5 minutes until creamy.',
      'Pour into bowl, dust with fragrant cinnamon powder.',
      'Top with fresh banana slices, roasted almonds, and chia seeds.'
    ],
    substitutions: [
      { original: 'Cow milk', substitute: 'Oat or Almond milk', note: 'Dairy-free & vegan friendly' },
      { original: 'Almonds', substitute: 'Roasted pumpkin seeds', note: 'Nut-free allergy safe' }
    ]
  },

  // --- LUNCHES ---
  {
    name: 'Kerala Matta Rice with Nadan Chicken Curry & Beans Thoran',
    cuisine: 'kerala',
    dietaryType: 'non_vegetarian',
    mealType: 'lunch',
    prepTimeMin: 35,
    servingSize: '1 cup cooked matta rice (150g) + 1 bowl chicken curry (180g) + 1 cup beans thoran (80g)',
    description: 'Wholesome Kerala red unpolished rice served with country-style chicken thigh curry in roasted coriander gravy and stir-fried green beans with grated coconut.',
    baseCalories: 560,
    baseProtein: 38.0,
    baseCarbs: 64.0,
    baseFat: 16.0,
    baseFiber: 7.2,
    allergens: ['coconut'],
    ingredients: [
      { name: 'Cooked Kerala Matta rice', amount: 150, unit: 'g', notes: 'Fiber-rich unpolished red rice' },
      { name: 'Skinless chicken thigh/breast', amount: 140, unit: 'g', notes: 'Curry cut' },
      { name: 'Green beans', amount: 80, unit: 'g', notes: 'Finely chopped' },
      { name: 'Fresh grated coconut', amount: 20, unit: 'g', notes: 'For thoran' },
      { name: 'Shallots & Onions', amount: 60, unit: 'g', notes: 'Sliced' },
      { name: 'Tomato', amount: 40, unit: 'g', notes: 'Chopped' },
      { name: 'Cold-pressed coconut oil', amount: 1, unit: 'tsp', notes: 'Traditional cooking medium' },
      { name: 'Roasted Kerala curry spices', amount: 1.5, unit: 'tbsp', notes: 'Coriander, chili, turmeric, fennel' }
    ],
    instructions: [
      'Boil red matta rice in ample water until soft and drain excess starch.',
      'Sauté shallots, ginger, garlic, and curry leaves in coconut oil. Add roasted spice powder and tomato.',
      'Add chicken pieces, salt, and water. Simmer covered for 20 minutes until succulent and tender.',
      'For thoran: stir-fry chopped beans with green chili, shallots, turmeric, and fresh grated coconut for 5 minutes.',
      'Serve warm rice with aromatic chicken curry and crisp beans thoran.'
    ],
    substitutions: [
      { original: 'Chicken curry', substitute: 'Kerala Kadala curry or Soya chunk curry', note: 'Vegetarian substitution' },
      { original: 'Matta rice', substitute: 'Brown rice or 3 chapatis', note: 'Equivalent whole-grain carbohydrates' }
    ]
  },
  {
    name: 'Kerala Fish Curry (Kudampuli Meen Curry) with Rice & Avial',
    cuisine: 'kerala',
    dietaryType: 'non_vegetarian',
    mealType: 'lunch',
    prepTimeMin: 30,
    servingSize: '1 cup rice (150g) + 2 pieces fish curry (160g) + 1 bowl avial (120g)',
    description: 'Traditional earthen pot fish curry tangy with Malabar tamarind (kudampuli), red chili and fenugreek, served with a mixed vegetable avial in coconut-cumin paste.',
    baseCalories: 510,
    baseProtein: 34.0,
    baseCarbs: 62.0,
    baseFat: 14.0,
    baseFiber: 8.0,
    allergens: ['fish', 'coconut'],
    ingredients: [
      { name: 'King fish / Seer fish / Sardines', amount: 140, unit: 'g', notes: 'Cleaned and sliced' },
      { name: 'Cooked Matta rice', amount: 150, unit: 'g', notes: 'Warm' },
      { name: 'Mixed vegetables for avial (Carrot, Beans, Drumstick, Ash Gourd)', amount: 100, unit: 'g', notes: 'Baton cut' },
      { name: 'Malabar tamarind (Kudampuli)', amount: 2, unit: 'piece', notes: 'Soaked in warm water' },
      { name: 'Grated coconut', amount: 25, unit: 'g', notes: 'Ground coarse with cumin' },
      { name: 'Shallots, Ginger & Green chilies', amount: 40, unit: 'g', notes: 'Crushed' },
      { name: 'Kashmiri chili powder', amount: 1.5, unit: 'tbsp', notes: 'For vibrant red color' }
    ],
    instructions: [
      'In a clay meen chatti, rub sliced shallots, ginger, chili powder, turmeric, salt, and soaked kudampuli with water.',
      'Bring to boil, slide in fresh fish pieces, cover and simmer on low heat for 12 minutes until sauce thickens.',
      'Cook baton vegetables with turmeric until just tender. Fold in coarsely crushed coconut-cumin paste and fresh curry leaves.',
      'Plate warm red rice with tangy fish curry and creamy avial.'
    ],
    substitutions: [
      { original: 'Fish', substitute: 'Firm paneer or boiled eggs', note: 'Egg-vegetarian or vegetarian option' },
      { original: 'Kudampuli', substitute: 'Raw mango or kokum', note: 'Authentic souring alternative' }
    ]
  },
  {
    name: 'Kerala Sadya Plate (Sambar, Avial, Thoran, Parippu & Rice)',
    cuisine: 'kerala',
    dietaryType: 'vegetarian',
    mealType: 'lunch',
    prepTimeMin: 35,
    servingSize: '1 generous traditional plate (Matta rice + 4 accompaniments)',
    description: 'Iconic Kerala vegetarian festival plate featuring red rice, comforting yellow lentil parippu, drumstick sambar, mixed vegetable avial, and cabbage thoran.',
    baseCalories: 520,
    baseProtein: 16.5,
    baseCarbs: 88.0,
    baseFat: 11.5,
    baseFiber: 12.0,
    allergens: ['coconut'],
    ingredients: [
      { name: 'Cooked Kerala Matta rice', amount: 160, unit: 'g', notes: 'Whole grain red rice' },
      { name: 'Toor dal (for Sambar)', amount: 30, unit: 'g', notes: 'Cooked smooth' },
      { name: 'Moong dal (for Parippu)', amount: 25, unit: 'g', notes: 'Yellow roasted moong' },
      { name: 'Mixed vegetables (Drumstick, Pumpkin, Carrot, Ash gourd)', amount: 120, unit: 'g', notes: 'For Sambar and Avial' },
      { name: 'Cabbage', amount: 60, unit: 'g', notes: 'Finely shredded for thoran' },
      { name: 'Grated coconut', amount: 35, unit: 'g', notes: 'Divided between thoran & avial' },
      { name: 'Coconut oil', amount: 1, unit: 'tsp', notes: 'Tempering' }
    ],
    instructions: [
      'Simmer cooked moong dal with turmeric and crushed cumin; finish with coconut oil.',
      'Cook drumsticks, shallots, and tomatoes with toor dal, tamarind extract, and roasted sambar powder.',
      'Steam avial vegetables and gently fold in crushed coconut, green chilies, and sour curd.',
      'Stir-fry shredded cabbage with mustard seeds, green chilies, shallots, and fresh coconut.',
      'Arrange traditionally with hot red rice at center.'
    ],
    substitutions: [
      { original: 'Coconut in Thoran', substitute: 'Sesame seeds or omit', note: 'For lower fat or coconut allergy' },
      { original: 'Curd in Avial', substitute: 'Raw mango', note: 'Dairy-free vegan version' }
    ]
  },
  {
    name: 'Whole Wheat Chapati with Paneer Butter Masala & Cucumber Salad',
    cuisine: 'north_indian',
    dietaryType: 'vegetarian',
    mealType: 'lunch',
    prepTimeMin: 25,
    servingSize: '3 chapatis + 1 bowl paneer curry (160g) + fresh cucumber rings',
    description: 'Soft hand-rolled whole wheat flatbreads with cottage cheese cubes in aromatic tomato-cashew gravy with a refreshing lime-seasoned salad.',
    baseCalories: 540,
    baseProtein: 22.0,
    baseCarbs: 60.0,
    baseFat: 23.0,
    baseFiber: 7.0,
    allergens: ['milk', 'tree_nuts', 'gluten'],
    ingredients: [
      { name: 'Whole wheat flour (Atta)', amount: 75, unit: 'g', notes: 'For 3 chapatis' },
      { name: 'Fresh paneer cubes', amount: 90, unit: 'g', notes: 'Diced cottage cheese' },
      { name: 'Ripe tomatoes & onions', amount: 120, unit: 'g', notes: 'Blended puree' },
      { name: 'Cashews', amount: 10, unit: 'g', notes: 'Soaked for velvety texture' },
      { name: 'Ghee / Butter', amount: 1, unit: 'tsp', notes: 'For aroma' },
      { name: 'Kasuri methi & Garam masala', amount: 1, unit: 'tsp', notes: 'Fragrant finish' },
      { name: 'Cucumber & Lime', amount: 60, unit: 'g', notes: 'Fresh side salad' }
    ],
    instructions: [
      'Knead atta with water into supple dough; roll thin and puff over dry skillet.',
      'Sauté ginger, garlic, and onions; add pureed tomatoes and cashew paste.',
      'Simmer until glossy; fold in paneer cubes, kasuri methi, and garam masala.',
      'Serve warm with hot chapatis and sliced cucumber.'
    ],
    substitutions: [
      { original: 'Paneer', substitute: 'Firm organic tofu', note: 'Dairy-free & vegan friendly' },
      { original: 'Cashew paste', substitute: 'Melon seeds (Magaz) or poppy seeds', note: 'Nut-free allergy alternative' }
    ]
  },
  {
    name: 'Grilled Herb Chicken Breast with Brown Rice & Steamed Broccoli',
    cuisine: 'international',
    dietaryType: 'non_vegetarian',
    mealType: 'lunch',
    prepTimeMin: 20,
    servingSize: '150g grilled chicken + 1 cup brown rice (140g) + 1 cup broccoli (100g)',
    description: 'Lean chicken breast marinated in crushed garlic, rosemary, black pepper, and olive oil, served alongside nutty brown rice and steamed broccoli florets.',
    baseCalories: 480,
    baseProtein: 46.0,
    baseCarbs: 48.0,
    baseFat: 10.0,
    baseFiber: 6.5,
    allergens: [],
    ingredients: [
      { name: 'Boneless skinless chicken breast', amount: 150, unit: 'g', notes: 'Flattened evenly' },
      { name: 'Cooked brown rice', amount: 140, unit: 'g', notes: 'Steamed' },
      { name: 'Fresh broccoli florets', amount: 100, unit: 'g', notes: 'Steamed crisp-tender' },
      { name: 'Extra virgin olive oil', amount: 1, unit: 'tsp', notes: 'For sear' },
      { name: 'Garlic, Rosemary, Lemon juice & Black pepper', amount: 1, unit: 'tbsp', notes: 'Marinade' }
    ],
    instructions: [
      'Marinate chicken breast with lemon juice, crushed garlic, rosemary, and freshly cracked black pepper for 10 minutes.',
      'Sear on a hot cast-iron grill pan for 5-6 minutes per side until internal temperature reaches 74°C (165°F).',
      'Steam broccoli florets for 4 minutes until vibrant green.',
      'Serve sliced chicken over warm brown rice with broccoli.'
    ],
    substitutions: [
      { original: 'Brown rice', substitute: 'Quinoa or Sweet potato', note: 'High micronutrient alternative' },
      { original: 'Chicken breast', substitute: 'Atlantic salmon fillet', note: 'Rich in Omega-3 fatty acids' }
    ]
  },

  // --- DINNERS ---
  {
    name: 'Whole Wheat Chapati with Kerala Nadan Beef Roast & Salad',
    cuisine: 'kerala',
    dietaryType: 'non_vegetarian',
    mealType: 'dinner',
    prepTimeMin: 35,
    servingSize: '3 chapatis + 1 bowl beef roast (140g) + onion-lemon salad',
    description: 'Soft whole wheat flatbreads served with slow-roasted lean beef cubes cooked with coconut slices (thenga kothu), crushed shallots, and black pepper.',
    baseCalories: 510,
    baseProtein: 36.0,
    baseCarbs: 52.0,
    baseFat: 16.0,
    baseFiber: 6.5,
    allergens: ['gluten', 'coconut'],
    ingredients: [
      { name: 'Whole wheat flour (Atta)', amount: 75, unit: 'g', notes: 'For 3 chapatis' },
      { name: 'Lean beef cubes', amount: 120, unit: 'g', notes: 'Trimmed of excess fat' },
      { name: 'Coconut slices (Thenga kothu)', amount: 15, unit: 'g', notes: 'Thin fried slivers' },
      { name: 'Shallots', amount: 50, unit: 'g', notes: 'Crushed coarse' },
      { name: 'Cracked black pepper & Fennel', amount: 1, unit: 'tsp', notes: 'Robust Malabar aroma' },
      { name: 'Coconut oil', amount: 1, unit: 'tsp', notes: 'For roasting' }
    ],
    instructions: [
      'Pressure cook lean beef with turmeric, red chili, and ginger-garlic for 4-5 whistles.',
      'In a wide pan, roast thenga kothu in coconut oil until golden.',
      'Add crushed shallots, curry leaves, and black pepper. Add cooked beef and pan-roast until rich dark brown and dry.',
      'Serve with hot puffed chapatis and lemon onion salad.'
    ],
    substitutions: [
      { original: 'Beef', substitute: 'Mushroom & Soya chuck roast', note: 'Plant-based hearty alternative' },
      { original: 'Chapati', substitute: 'Kerala Whole wheat parotta or Appam', note: 'Alternative traditional pairing' }
    ]
  },
  {
    name: 'Appam with Light Vegetable Stew & Steamed Egg',
    cuisine: 'kerala',
    dietaryType: 'non_vegetarian',
    mealType: 'dinner',
    prepTimeMin: 20,
    servingSize: '2 appams + 1 bowl vegetable stew + 1 boiled egg',
    description: 'Soft lacy appams paired with aromatic coconut milk vegetable stew and a boiled egg for easy evening digestion and sustained satiety.',
    baseCalories: 410,
    baseProtein: 14.5,
    baseCarbs: 56.0,
    baseFat: 14.0,
    baseFiber: 5.5,
    allergens: ['egg', 'coconut'],
    ingredients: [
      { name: 'Appam batter', amount: 140, unit: 'g', notes: 'Fermented' },
      { name: 'Boiled egg', amount: 1, unit: 'piece', notes: 'Large' },
      { name: 'Carrots, beans & green peas', amount: 90, unit: 'g', notes: 'Diced' },
      { name: 'Coconut milk', amount: 120, unit: 'ml', notes: 'Medium consistency' },
      { name: 'Ginger & green chili', amount: 1, unit: 'tsp', notes: 'Subtle warmth' }
    ],
    instructions: [
      'Simmer diced vegetables with ginger, green chili, and whole cardamom in thin coconut milk.',
      'Stir in boiled egg and finish with thick coconut milk and fresh curry leaves.',
      'Swirl appams on tawa until golden and serve fresh together.'
    ],
    substitutions: [
      { original: 'Egg', substitute: 'Tofu cubes or steamed green gram', note: 'Vegetarian option' }
    ]
  },
  {
    name: 'Whole Wheat Dosa with Cherupayar Curry (Green Gram)',
    cuisine: 'kerala',
    dietaryType: 'vegetarian',
    mealType: 'dinner',
    prepTimeMin: 25,
    servingSize: '2 medium dosas + 1 bowl green gram curry (180g)',
    description: 'Crisp whole wheat dosas with protein-packed whole green gram (cherupayar) simmered with shallots, garlic, turmeric, and light coconut tempering.',
    baseCalories: 420,
    baseProtein: 17.0,
    baseCarbs: 64.0,
    baseFat: 9.0,
    baseFiber: 11.0,
    allergens: ['coconut', 'gluten'],
    ingredients: [
      { name: 'Whole wheat flour & rice batter', amount: 130, unit: 'g', notes: 'For 2 dosas' },
      { name: 'Whole green gram (Cherupayar)', amount: 60, unit: 'g', notes: 'Cooked soft' },
      { name: 'Shallots', amount: 30, unit: 'g', notes: 'Sliced' },
      { name: 'Grated coconut', amount: 20, unit: 'g', notes: 'Ground coarse with cumin' },
      { name: 'Curry leaves & mustard', amount: 0.5, unit: 'tsp', notes: 'Tempering' }
    ],
    instructions: [
      'Pressure cook green gram with turmeric and salt until tender.',
      'Grind coconut with cumin and garlic into a coarse paste and fold into the lentils; bring to a brief simmer.',
      'Temper with mustard seeds and curry leaves in coconut oil.',
      'Pour batter into hot pan to make crisp dosas and serve together.'
    ],
    substitutions: [
      { original: 'Cherupayar', substitute: 'Yellow moong dal or Masoor dal', note: 'Faster cooking lentil option' }
    ]
  },
  {
    name: 'Palak Paneer with Whole Wheat Roti',
    cuisine: 'north_indian',
    dietaryType: 'vegetarian',
    mealType: 'dinner',
    prepTimeMin: 25,
    servingSize: '2 rotis + 1 bowl palak paneer (180g)',
    description: 'Fresh spinach leaves blanched and pureed with garlic and cumin, gently folded with tender cottage cheese cubes and served with whole wheat rotis.',
    baseCalories: 440,
    baseProtein: 19.5,
    baseCarbs: 48.0,
    baseFat: 18.0,
    baseFiber: 7.8,
    allergens: ['milk', 'gluten'],
    ingredients: [
      { name: 'Fresh spinach (Palak)', amount: 150, unit: 'g', notes: 'Blanched in ice water' },
      { name: 'Paneer', amount: 80, unit: 'g', notes: 'Cubed' },
      { name: 'Atta (Whole wheat flour)', amount: 60, unit: 'g', notes: 'For 2 rotis' },
      { name: 'Garlic & Ginger', amount: 1, unit: 'tbsp', notes: 'Finely minced' },
      { name: 'Cumin seeds & Garam masala', amount: 1, unit: 'tsp', notes: 'Warm aromatics' },
      { name: 'Low-fat milk or cream', amount: 1, unit: 'tbsp', notes: 'To soften puree' }
    ],
    instructions: [
      'Blanch spinach in boiling water for 2 minutes, shock in ice water, and blend into a bright green puree.',
      'Sauté cumin and plenty of garlic in a pan. Add pureed spinach and gently simmer.',
      'Add paneer cubes, touch of garam masala, and salt. Cook for 3 minutes.',
      'Serve warm with hand-rolled rotis.'
    ],
    substitutions: [
      { original: 'Paneer', substitute: 'Firm organic tofu', note: 'Lactose-free & vegan friendly' }
    ]
  },

  // --- SNACKS ---
  {
    name: 'Roasted Chana with Spiced Green Tea',
    cuisine: 'south_indian',
    dietaryType: 'vegetarian',
    mealType: 'snack',
    prepTimeMin: 5,
    servingSize: '1 cup roasted chana (40g) + 1 cup green tea',
    description: 'Crunchy dry-roasted yellow Bengal gram tossed with a pinch of rock salt and chaat masala, paired with antioxidant green tea.',
    baseCalories: 150,
    baseProtein: 8.5,
    baseCarbs: 22.0,
    baseFat: 2.5,
    baseFiber: 5.5,
    allergens: [],
    ingredients: [
      { name: 'Dry roasted Bengal gram (Pottukadala)', amount: 40, unit: 'g', notes: 'Unsalted dry roasted' },
      { name: 'Chaat masala & Black salt', amount: 1, unit: 'pinch', notes: 'Seasoning' },
      { name: 'Fresh green tea bag', amount: 1, unit: 'cup', notes: 'Brewed hot' }
    ],
    instructions: [
      'Toss roasted chana in a small bowl with a dash of chaat masala.',
      'Brew fresh green tea in boiling water for 3 minutes.',
      'Enjoy as a high-satiety, low-fat afternoon snack.'
    ],
    substitutions: [
      { original: 'Roasted chana', substitute: 'Roasted Makhana (Foxnuts)', note: 'Lower calorie density' }
    ]
  },
  {
    name: 'Boiled Large Eggs with Cracked Black Pepper',
    cuisine: 'international',
    dietaryType: 'non_vegetarian',
    mealType: 'snack',
    prepTimeMin: 10,
    servingSize: '2 large boiled eggs',
    description: 'Perfect hard-boiled country eggs sprinkled with freshly cracked Tellicherry black pepper and pink Himalayan salt.',
    baseCalories: 145,
    baseProtein: 12.8,
    baseCarbs: 0.8,
    baseFat: 9.8,
    baseFiber: 0,
    allergens: ['egg'],
    ingredients: [
      { name: 'Large country eggs', amount: 2, unit: 'piece', notes: 'Boiled 9 minutes' },
      { name: 'Cracked black pepper & Salt', amount: 1, unit: 'pinch', notes: 'Seasoning' }
    ],
    instructions: [
      'Submerge eggs in gently boiling water and cook for 9 minutes.',
      'Transfer to cold water bath, peel shells, slice in halves, and dust with pepper.'
    ],
    substitutions: [
      { original: 'Eggs', substitute: 'Sprouted moong beans salad', note: 'Vegetarian alternative' }
    ]
  },
  {
    name: 'Sprouts & Pomegranate Chaat',
    cuisine: 'south_indian',
    dietaryType: 'vegetarian',
    mealType: 'snack',
    prepTimeMin: 10,
    servingSize: '1 bowl (140g)',
    description: 'Live sprouted green gram tossed with sweet pomegranate arils, crunchy cucumber, mint, and fresh lime juice.',
    baseCalories: 160,
    baseProtein: 8.0,
    baseCarbs: 28.0,
    baseFat: 1.2,
    baseFiber: 6.0,
    allergens: [],
    ingredients: [
      { name: 'Sprouted green moong beans', amount: 80, unit: 'g', notes: 'Freshly sprouted' },
      { name: 'Pomegranate seeds', amount: 30, unit: 'g', notes: 'Sweet arils' },
      { name: 'Diced cucumber & Tomato', amount: 30, unit: 'g', notes: 'Crunch' },
      { name: 'Lime juice & Fresh mint', amount: 1, unit: 'tbsp', notes: 'Zesty dressing' }
    ],
    instructions: [
      'Steam sprouted moong lightly for 2 minutes to soften (optional).',
      'Toss with diced cucumber, tomatoes, and pomegranate seeds in a bowl.',
      'Drizzle with fresh lime juice, sea salt, and chopped mint leaves.'
    ],
    substitutions: [
      { original: 'Moong sprouts', substitute: 'Boiled chickpeas or Edamame', note: 'Alternative legumes' }
    ]
  }
];

/**
 * Validates if a template meal is safe against user's declared allergies.
 */
export const isMealSafeFromAllergies = (meal: TemplateMeal | PlannedMeal, declaredAllergies: string[]): boolean => {
  if (!declaredAllergies || declaredAllergies.length === 0) return true;

  const allergySet = declaredAllergies.map(a => a.toLowerCase().trim());
  const mealAllergens = (meal.allergens || []).map(a => a.toLowerCase().trim());

  // Check declared allergens list on meal
  for (const allergy of allergySet) {
    if (mealAllergens.some(ma => ma.includes(allergy) || allergy.includes(ma))) {
      return false;
    }
  }

  // Deep check ingredients text and meal name
  const textToCheck = `${meal.name} ${meal.description} ${meal.ingredients.map(i => i.name).join(' ')}`.toLowerCase();
  for (const allergy of allergySet) {
    if (allergy.length < 3) continue;
    if (textToCheck.includes(allergy)) return false;
    
    // Check specific allergen synonyms
    if (allergy === 'dairy' || allergy === 'milk' || allergy === 'lactose') {
      if (textToCheck.includes('milk') || textToCheck.includes('paneer') || textToCheck.includes('cheese') || textToCheck.includes('curd') || textToCheck.includes('yogurt') || textToCheck.includes('ghee') || textToCheck.includes('butter')) {
        return false;
      }
    }
    if (allergy === 'gluten' || allergy === 'wheat') {
      if (textToCheck.includes('wheat') || textToCheck.includes('atta') || textToCheck.includes('maida') || textToCheck.includes('chapati') || textToCheck.includes('roti') || textToCheck.includes('bread')) {
        return false;
      }
    }
    if (allergy === 'nut' || allergy === 'nuts' || allergy === 'peanuts') {
      if (textToCheck.includes('peanut') || textToCheck.includes('groundnut') || textToCheck.includes('almond') || textToCheck.includes('cashew') || textToCheck.includes('walnut')) {
        return false;
      }
    }
    if (allergy === 'seafood' || allergy === 'fish') {
      if (textToCheck.includes('fish') || textToCheck.includes('prawn') || textToCheck.includes('shrimp') || textToCheck.includes('crab') || textToCheck.includes('sardine') || textToCheck.includes('ayala') || textToCheck.includes('mathi')) {
        return false;
      }
    }
    if (allergy === 'egg' || allergy === 'eggs') {
      if (textToCheck.includes('egg') || textToCheck.includes('mutta')) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Scales a template meal's macros and ingredients by a calibration factor.
 */
export const scalePlannedMeal = (
  template: TemplateMeal, 
  dayIndex: number, 
  dayName: string, 
  scaleFactor: number = 1.0
): PlannedMeal => {
  const sf = Math.max(0.6, Math.min(1.6, scaleFactor));

  return {
    id: `meal_${dayIndex}_${template.mealType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    dayIndex,
    dayName,
    mealType: template.mealType,
    name: template.name,
    cuisine: template.cuisine,
    description: template.description,
    servings: 1,
    servingSize: template.servingSize,
    prepTimeMin: template.prepTimeMin,
    calories: Math.round(template.baseCalories * sf),
    protein: Math.round(template.baseProtein * sf * 10) / 10,
    carbs: Math.round(template.baseCarbs * sf * 10) / 10,
    fat: Math.round(template.baseFat * sf * 10) / 10,
    fiber: Math.round(template.baseFiber * sf * 10) / 10,
    ingredients: template.ingredients.map(ing => ({
      ...ing,
      amount: Math.round(ing.amount * sf * 10) / 10
    })),
    instructions: [...template.instructions],
    substitutions: [...template.substitutions],
    allergens: [...template.allergens],
    isEstimate: true
  };
};

/**
 * Generates an authentic personalized meal plan based on preferences.
 * Used by the server API and client fallback.
 */
export const generateAuthenticMealPlan = (prefs: MealPlannerPreferences): DayPlan[] => {
  const daysCount = prefs.duration === '1_day' ? 1 : 7;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayPlans: DayPlan[] = [];

  // Filter templates matching diet and allergies
  const safeTemplates = AUTHENTIC_MEAL_TEMPLATES.filter(tpl => {
    // Dietary check
    if (prefs.dietaryPreference === 'vegetarian' && tpl.dietaryType !== 'vegetarian') {
      return false;
    }
    // Disliked foods check
    if (prefs.dislikedFoods && prefs.dislikedFoods.length > 0) {
      const dislikes = prefs.dislikedFoods.map(d => d.toLowerCase());
      const desc = `${tpl.name} ${tpl.description}`.toLowerCase();
      if (dislikes.some(d => desc.includes(d))) return false;
    }
    // Strict allergy check
    return isMealSafeFromAllergies(tpl, prefs.allergies);
  });

  // Segregate by meal type
  const breakfasts = safeTemplates.filter(t => t.mealType === 'breakfast');
  const lunches = safeTemplates.filter(t => t.mealType === 'lunch');
  const dinners = safeTemplates.filter(t => t.mealType === 'dinner');
  const snacks = safeTemplates.filter(t => t.mealType === 'snack');

  // Fallback defaults if heavily restricted
  const defaultB = breakfasts.length > 0 ? breakfasts : safeTemplates;
  const defaultL = lunches.length > 0 ? lunches : safeTemplates;
  const defaultD = dinners.length > 0 ? dinners : safeTemplates;
  const defaultS = snacks.length > 0 ? snacks : safeTemplates;

  const targetCal = prefs.targetCalories || 1800;

  for (let d = 0; d < daysCount; d++) {
    const dayName = prefs.duration === '1_day' ? 'Today' : dayNames[d % 7];
    const plannedMeals: PlannedMeal[] = [];

    // Select meals based on mealsPerDay
    // 2 meals: Brunch (Lunch template) + Dinner
    // 3 meals: Breakfast + Lunch + Dinner
    // 4 meals: Breakfast + Lunch + Snack + Dinner
    // 5 meals: Breakfast + Snack + Lunch + Snack + Dinner
    const mealCount = Math.max(2, Math.min(5, prefs.mealsPerDay || 3));

    // Calculate approximate calorie allocation per meal
    let scaleFactor = 1.0;
    if (targetCal) {
      scaleFactor = targetCal / 1800;
    }

    if (mealCount === 2) {
      const lTpl = defaultL[d % defaultL.length];
      const dTpl = defaultD[(d + 1) % defaultD.length];
      plannedMeals.push(scalePlannedMeal(lTpl, d, dayName, scaleFactor * 1.2));
      plannedMeals.push(scalePlannedMeal(dTpl, d, dayName, scaleFactor * 1.2));
    } else if (mealCount === 3) {
      const bTpl = defaultB[d % defaultB.length];
      const lTpl = defaultL[(d + 1) % defaultL.length];
      const dTpl = defaultD[(d + 2) % defaultD.length];
      plannedMeals.push(scalePlannedMeal(bTpl, d, dayName, scaleFactor));
      plannedMeals.push(scalePlannedMeal(lTpl, d, dayName, scaleFactor));
      plannedMeals.push(scalePlannedMeal(dTpl, d, dayName, scaleFactor));
    } else if (mealCount === 4) {
      const bTpl = defaultB[d % defaultB.length];
      const lTpl = defaultL[(d + 1) % defaultL.length];
      const sTpl = defaultS[d % defaultS.length];
      const dTpl = defaultD[(d + 2) % defaultD.length];
      plannedMeals.push(scalePlannedMeal(bTpl, d, dayName, scaleFactor * 0.9));
      plannedMeals.push(scalePlannedMeal(lTpl, d, dayName, scaleFactor * 0.9));
      plannedMeals.push(scalePlannedMeal(sTpl, d, dayName, scaleFactor * 0.8));
      plannedMeals.push(scalePlannedMeal(dTpl, d, dayName, scaleFactor * 0.9));
    } else {
      // 5 meals
      const bTpl = defaultB[d % defaultB.length];
      const s1Tpl = defaultS[d % defaultS.length];
      const lTpl = defaultL[(d + 1) % defaultL.length];
      const s2Tpl = defaultS[(d + 1) % defaultS.length];
      const dTpl = defaultD[(d + 2) % defaultD.length];
      plannedMeals.push(scalePlannedMeal(bTpl, d, dayName, scaleFactor * 0.8));
      plannedMeals.push(scalePlannedMeal(s1Tpl, d, dayName, scaleFactor * 0.7));
      plannedMeals.push(scalePlannedMeal(lTpl, d, dayName, scaleFactor * 0.8));
      plannedMeals.push(scalePlannedMeal(s2Tpl, d, dayName, scaleFactor * 0.7));
      plannedMeals.push(scalePlannedMeal(dTpl, d, dayName, scaleFactor * 0.8));
    }

    // Compute day totals
    const totalCalories = plannedMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = Math.round(plannedMeals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
    const totalCarbs = Math.round(plannedMeals.reduce((acc, m) => acc + m.carbs, 0) * 10) / 10;
    const totalFat = Math.round(plannedMeals.reduce((acc, m) => acc + m.fat, 0) * 10) / 10;
    const totalFiber = Math.round(plannedMeals.reduce((acc, m) => acc + m.fiber, 0) * 10) / 10;

    dayPlans.push({
      dayIndex: d,
      dayName,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      meals: plannedMeals
    });
  }

  return dayPlans;
};

/**
 * Replaces / swaps a single meal with an alternative matching meal type and allergies.
 */
export const swapSingleMealFromTemplates = (
  currentMeal: PlannedMeal, 
  prefs: MealPlannerPreferences,
  userPrompt?: string
): PlannedMeal => {
  const safeTemplates = AUTHENTIC_MEAL_TEMPLATES.filter(tpl => {
    if (tpl.mealType !== currentMeal.mealType) return false;
    if (tpl.name.toLowerCase() === currentMeal.name.toLowerCase()) return false;
    if (prefs.dietaryPreference === 'vegetarian' && tpl.dietaryType !== 'vegetarian') return false;
    return isMealSafeFromAllergies(tpl, prefs.allergies);
  });

  const candidates = safeTemplates.length > 0 
    ? safeTemplates 
    : AUTHENTIC_MEAL_TEMPLATES.filter(tpl => tpl.mealType === currentMeal.mealType);

  // If user prompt has keywords (e.g. "chicken", "oats", "quick"), try to match
  let chosen = candidates[0];
  if (userPrompt && userPrompt.trim().length > 0) {
    const p = userPrompt.toLowerCase();
    const match = candidates.find(c => c.name.toLowerCase().includes(p) || c.description.toLowerCase().includes(p));
    if (match) chosen = match;
    else chosen = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    chosen = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];
  }

  return scalePlannedMeal(chosen, currentMeal.dayIndex, currentMeal.dayName, 1.0);
};
