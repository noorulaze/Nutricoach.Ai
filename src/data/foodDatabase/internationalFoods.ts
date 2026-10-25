import { ComprehensiveFood } from './types';

export const INTERNATIONAL_FOODS: ComprehensiveFood[] = [
  // ==========================================
  // MIDDLE EASTERN
  // ==========================================
  {
    id: 'mid_chicken_shawarma_wrap',
    name: 'Chicken Shawarma Wrap (Pita, Garlic Toum & Pickles)',
    malayalamName: 'ചിക്കൻ ഷവർമ്മ',
    manglishName: 'Chicken Shawarma Wrap',
    alternateNames: ['shawarma', 'chicken shawarma', 'shawarma roll', 'lebanese shawarma', 'ഷവർമ്മ'],
    cuisine: 'middle_eastern',
    region: 'Middle East',
    category: 'snacks_streetfood',
    dietaryType: 'non_vegetarian',
    description: 'Thinly shaved rotisserie spiced chicken wrapped in warm pita bread with garlic sauce (toum), pickled turnips, cucumber, and french fries.',
    per100g: {
      calories: 220,
      protein: 14.5,
      carbs: 22.8,
      fat: 8.8,
      fiber: 1.8,
      sugar: 1.4,
      sodiumMg: 420
    },
    servings: [
      { label: '1 regular wrap (180g)', grams: 180, isDefault: true },
      { label: '1 large wrap (260g)', grams: 260 }
    ],
    defaultServing: { label: '1 regular wrap (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten', 'Eggs'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central & Middle Eastern Nutritional Survey',
    cookingMethod: 'Vertical Spit Roasted'
  },
  {
    id: 'mid_hummus',
    name: 'Authentic Hummus (Chickpea Puree with Tahini & Olive Oil)',
    malayalamName: 'ഹുമ്മൂസ്',
    manglishName: 'Hummus / Hommus',
    alternateNames: ['hummus', 'hommus', 'chickpea dip', 'tahini hummus', 'ഹുമ്മൂസ്'],
    cuisine: 'middle_eastern',
    region: 'Middle East / Levant',
    category: 'vegetarian_sides',
    dietaryType: 'vegan',
    description: 'Silky smooth blend of cooked chickpeas, sesame tahini, fresh lemon juice, crushed garlic, and drizzled extra virgin olive oil. Rich in heart-healthy monounsaturated fats and fiber.',
    per100g: {
      calories: 166,
      protein: 7.9,
      carbs: 14.3,
      fat: 9.6,
      fiber: 6.0,
      sugar: 0.8,
      sodiumMg: 380
    },
    servings: [
      { label: '2 tablespoons dip (40g)', grams: 40 },
      { label: '1 small bowl (100g)', grams: 100, isDefault: true },
      { label: '1 restaurant plate (180g)', grams: 180 }
    ],
    defaultServing: { label: '1 small bowl (100g)', grams: 100, isDefault: true },
    budgetFriendly: true,
    allergens: ['Sesame'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Blended Puree'
  },
  {
    id: 'mid_falafel',
    name: 'Falafel (Crispy Herbed Chickpea Patties)',
    malayalamName: 'ഫലാഫൽ',
    manglishName: 'Falafel',
    alternateNames: ['falafel', 'chickpea patties', 'middle eastern falafel', 'ഫലാഫൽ'],
    cuisine: 'middle_eastern',
    region: 'Middle East',
    category: 'snacks_streetfood',
    dietaryType: 'vegan',
    description: 'Crisp deep-fried patties made of soaked raw chickpeas, fresh parsley, coriander, cumin, and garlic.',
    per100g: {
      calories: 333,
      protein: 13.3,
      carbs: 31.8,
      fat: 17.8,
      fiber: 9.8,
      sugar: 1.8,
      sodiumMg: 290
    },
    servings: [
      { label: '3 pieces (75g)', grams: 75 },
      { label: '5 pieces (125g)', grams: 125, isDefault: true }
    ],
    defaultServing: { label: '5 pieces (125g)', grams: 125, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Deep Fried'
  },
  {
    id: 'mid_tabbouleh',
    name: 'Tabbouleh (Fresh Parsley & Bulgur Salad with Lemon & Olive Oil)',
    malayalamName: 'തബൂല സാലഡ്',
    manglishName: 'Tabbouleh Salad',
    alternateNames: ['tabbouleh', 'tabouli', 'parsley salad', 'തബൂല'],
    cuisine: 'middle_eastern',
    region: 'Levant',
    category: 'vegetarian_sides',
    dietaryType: 'vegan',
    description: 'Refreshing herb salad composed mainly of finely chopped fresh flat-leaf parsley, mint, diced firm tomatoes, soaked fine bulgur wheat, lemon juice, and extra virgin olive oil.',
    per100g: {
      calories: 98,
      protein: 2.2,
      carbs: 8.5,
      fat: 6.8,
      fiber: 2.8,
      sugar: 1.5,
      sodiumMg: 160
    },
    servings: [
      { label: '1 small bowl (100g)', grams: 100 },
      { label: '1 medium bowl (160g)', grams: 160, isDefault: true }
    ],
    defaultServing: { label: '1 medium bowl (160g)', grams: 160, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Raw Salad'
  },

  // ==========================================
  // MEDITERRANEAN & ITALIAN
  // ==========================================
  {
    id: 'med_pasta_pomodoro',
    name: 'Whole Wheat Pasta Pomodoro (Marinara & Fresh Basil)',
    malayalamName: 'പാസ്ത പോമോഡോറോ',
    manglishName: 'Pasta Pomodoro / Marinara Pasta',
    alternateNames: ['pasta pomodoro', 'pasta marinara', 'whole wheat pasta', 'spaghetti pomodoro', 'പാസ്ത'],
    cuisine: 'mediterranean',
    region: 'Italy',
    category: 'staples_grains',
    dietaryType: 'vegan',
    description: 'Al dente whole wheat penne or spaghetti tossed in slow-simmered San Marzano tomatoes, garlic, extra virgin olive oil, and fresh torn basil leaves.',
    per100g: {
      calories: 145,
      protein: 5.2,
      carbs: 26.8,
      fat: 2.4,
      fiber: 3.8,
      sugar: 2.6,
      sodiumMg: 210
    },
    servings: [
      { label: '1 plate (220g cooked)', grams: 220, isDefault: true },
      { label: '1 large bowl (300g cooked)', grams: 300 }
    ],
    defaultServing: { label: '1 plate (220g cooked)', grams: 220, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Boiled & Sautéed'
  },
  {
    id: 'med_pizza_margherita',
    name: 'Classic Neapolitan Pizza Margherita (1 Slice)',
    malayalamName: 'പിസ്സ മാർഗരിറ്റ',
    manglishName: 'Pizza Margherita',
    alternateNames: ['pizza margherita', 'margherita pizza', 'italian pizza slice', 'പിസ്സ'],
    cuisine: 'mediterranean',
    region: 'Italy',
    category: 'snacks_streetfood',
    dietaryType: 'vegetarian',
    description: 'Thin fermented dough crust topped with crushed plum tomatoes, fresh whole milk mozzarella, basil, and a light drizzle of olive oil, baked in wood-fired oven.',
    per100g: {
      calories: 250,
      protein: 11.2,
      carbs: 30.5,
      fat: 9.6,
      fiber: 2.1,
      sugar: 2.5,
      sodiumMg: 520
    },
    servings: [
      { label: '1 slice (105g)', grams: 105, isDefault: true },
      { label: '2 slices (210g)', grams: 210 },
      { label: '1 small 8-inch personal pizza (280g)', grams: 280 }
    ],
    defaultServing: { label: '1 slice (105g)', grams: 105, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten', 'Dairy'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Wood-fired Baked'
  },
  {
    id: 'med_minestrone_soup',
    name: 'Italian Minestrone Vegetable & Bean Soup',
    malayalamName: 'മിനസ്ട്രോൺ സൂപ്പ്',
    manglishName: 'Minestrone Soup',
    alternateNames: ['minestrone', 'minestrone soup', 'italian vegetable soup', 'സൂപ്പ്'],
    cuisine: 'mediterranean',
    region: 'Italy',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    description: 'Hearty, slow-cooked soup packed with cannellini white beans, zucchini, carrots, celery, tomatoes, and small ditalini pasta in an aromatic herb broth.',
    per100g: {
      calories: 62,
      protein: 3.1,
      carbs: 10.5,
      fat: 0.9,
      fiber: 2.6,
      sugar: 2.0,
      sodiumMg: 240
    },
    servings: [
      { label: '1 medium soup bowl (250g)', grams: 250, isDefault: true },
      { label: '1 large soup bowl (350g)', grams: 350 }
    ],
    defaultServing: { label: '1 medium soup bowl (250g)', grams: 250, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Slow Simmered'
  },

  // ==========================================
  // ASIAN (CHINESE, JAPANESE, KOREAN, THAI)
  // ==========================================
  {
    id: 'asn_veg_fried_rice',
    name: 'Vegetable Egg Fried Rice (Wok-Tossed)',
    malayalamName: 'എഗ്ഗ് ഫ്രൈഡ് റൈസ്',
    manglishName: 'Egg Fried Rice / Veg Fried Rice',
    alternateNames: ['fried rice', 'egg fried rice', 'chinese fried rice', 'ഫ്രൈഡ് റൈസ്'],
    cuisine: 'asian',
    region: 'East Asia',
    category: 'staples_grains',
    dietaryType: 'vegetarian',
    description: 'Chilled cooked jasmine rice wok-tossed over high heat with scrambled eggs, scallions, carrots, green peas, light soy sauce, and sesame oil.',
    per100g: {
      calories: 174,
      protein: 5.4,
      carbs: 26.2,
      fat: 5.5,
      fiber: 1.5,
      sugar: 0.8,
      sodiumMg: 360
    },
    servings: [
      { label: '1 bowl (180g)', grams: 180 },
      { label: '1 standard takeout plate (280g)', grams: 280, isDefault: true },
      { label: '1 large bowl (380g)', grams: 380 }
    ],
    defaultServing: { label: '1 standard takeout plate (280g)', grams: 280, isDefault: true },
    budgetFriendly: true,
    allergens: ['Eggs', 'Soy', 'Sesame'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'High Heat Wok Tossed'
  },
  {
    id: 'asn_stir_fry_tofu_veg',
    name: 'Stir-Fried Tofu with Broccoli & Garlic Soy',
    malayalamName: 'ടോഫു ബ്രോക്കോളി ഫ്രൈ',
    manglishName: 'Tofu Broccoli Stir Fry',
    alternateNames: ['tofu stir fry', 'tofu broccoli', 'vegan asian stir fry', 'ടോഫു'],
    cuisine: 'asian',
    region: 'East Asia',
    category: 'vegetarian_sides',
    dietaryType: 'vegan',
    description: 'Firm tofu cubes seared crisp and tossed with fresh broccoli florets, snap peas, garlic, ginger, and tamari soy sauce. Ideal clean vegan muscle building meal.',
    per100g: {
      calories: 105,
      protein: 8.8,
      carbs: 4.8,
      fat: 6.0,
      fiber: 2.6,
      sugar: 1.4,
      sodiumMg: 280
    },
    servings: [
      { label: '1 standard bowl (200g)', grams: 200, isDefault: true },
      { label: '1 large plate (300g)', grams: 300 }
    ],
    defaultServing: { label: '1 standard bowl (200g)', grams: 200, isDefault: true },
    budgetFriendly: true,
    allergens: ['Soy'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Wok Seared'
  },
  {
    id: 'asn_salmon_sushi_roll',
    name: 'Salmon Avocado Sushi Roll (Maki Roll, 6 Pieces)',
    malayalamName: 'സാൽമൺ സൂഷി റോൾ',
    manglishName: 'Salmon Sushi Roll',
    alternateNames: ['sushi', 'salmon sushi', 'salmon avocado roll', 'maki roll', 'സൂഷി'],
    cuisine: 'asian',
    region: 'Japan',
    category: 'seafood',
    dietaryType: 'pescatarian',
    description: 'Fresh sushi-grade Atlantic salmon and avocado wrapped in seasoned sushi rice and crisp toasted nori seaweed. Clean source of lean protein and heart-healthy fats.',
    per100g: {
      calories: 172,
      protein: 8.5,
      carbs: 23.5,
      fat: 5.2,
      fiber: 1.8,
      sugar: 2.1,
      sodiumMg: 310
    },
    servings: [
      { label: '6 piece roll (180g)', grams: 180, isDefault: true },
      { label: '8 piece roll (240g)', grams: 240 }
    ],
    defaultServing: { label: '6 piece roll (180g)', grams: 180, isDefault: true },
    budgetFriendly: false,
    allergens: ['Fish'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Raw Fresh Assembly'
  },
  {
    id: 'asn_miso_soup',
    name: 'Traditional Japanese Miso Soup with Silken Tofu & Wakame',
    malayalamName: 'മിസോ സൂപ്പ്',
    manglishName: 'Miso Soup',
    alternateNames: ['miso soup', 'japanese miso', 'tofu wakame soup', 'മിസോ സൂപ്പ്'],
    cuisine: 'asian',
    region: 'Japan',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    description: 'Soothing fermented soybean paste (miso) dissolved in kelp dashi broth with cubes of soft silken tofu, dried wakame seaweed, and scallions. Probiotic gut-healing soup.',
    per100g: {
      calories: 34,
      protein: 2.8,
      carbs: 3.2,
      fat: 1.2,
      fiber: 0.9,
      sugar: 0.6,
      sodiumMg: 410
    },
    servings: [
      { label: '1 traditional bowl (180ml / 180g)', grams: 180, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 traditional bowl (180ml / 180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: ['Soy'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Gently Simmered'
  },
  {
    id: 'asn_edamame_pods',
    name: 'Steamed Edamame Pods with Sea Salt',
    malayalamName: 'എഡമാമെ',
    manglishName: 'Edamame / Steamed Green Soybeans',
    alternateNames: ['edamame', 'steamed soybeans', 'green soybeans snack', 'എഡമാമെ'],
    cuisine: 'asian',
    region: 'Japan',
    category: 'snacks_streetfood',
    dietaryType: 'vegan',
    description: 'Whole young green soybean pods steamed tender and sprinkled with coarse mineral sea salt. Complete plant protein containing all 9 essential amino acids.',
    per100g: {
      calories: 122,
      protein: 11.9,
      carbs: 8.9,
      fat: 5.2,
      fiber: 5.2,
      sugar: 2.2,
      sodiumMg: 240
    },
    servings: [
      { label: '1 bowl in pods (150g gross, approx 80g beans)', grams: 80, isDefault: true },
      { label: '1 cup shelled beans (150g)', grams: 150 }
    ],
    defaultServing: { label: '1 bowl in pods (150g gross, approx 80g beans)', grams: 80, isDefault: true },
    budgetFriendly: true,
    allergens: ['Soy'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Steamed'
  },
  {
    id: 'asn_korean_bibimbap',
    name: 'Korean Bibimbap Rice Bowl (Beef or Tofu with Sautéed Veggies)',
    malayalamName: 'ബിബിംബാപ്',
    manglishName: 'Bibimbap Bowl',
    alternateNames: ['bibimbap', 'korean rice bowl', 'dolsot bibimbap', 'ബിബിംബാപ്'],
    cuisine: 'asian',
    region: 'Korea',
    category: 'staples_grains',
    dietaryType: 'non_vegetarian',
    description: 'Steamed rice bowl topped with seasoned namul vegetables (spinach, bean sprouts, carrots, shiitake mushrooms), lean beef, fried egg, and gochujang chili paste.',
    per100g: {
      calories: 156,
      protein: 7.2,
      carbs: 21.5,
      fat: 4.8,
      fiber: 2.4,
      sugar: 2.5,
      sodiumMg: 320
    },
    servings: [
      { label: '1 complete meal bowl (350g)', grams: 350, isDefault: true }
    ],
    defaultServing: { label: '1 complete meal bowl (350g)', grams: 350, isDefault: true },
    budgetFriendly: false,
    allergens: ['Soy', 'Sesame', 'Eggs'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Assembled Fresh & Sautéed'
  },
  {
    id: 'asn_pad_thai',
    name: 'Thai Pad Thai (Stir-Fried Rice Noodles with Tofu & Shrimp)',
    malayalamName: 'പാഡ് തായ് ന്യൂഡിൽസ്',
    manglishName: 'Pad Thai Noodles',
    alternateNames: ['pad thai', 'thai noodles', 'stir fried rice noodles', 'പാഡ് തായ്'],
    cuisine: 'asian',
    region: 'Thailand',
    category: 'staples_grains',
    dietaryType: 'pescatarian',
    description: 'Flat rice noodles stir-fried in a sweet, sour, and savory tamarind sauce with pressed tofu, shrimp, egg, bean sprouts, chives, and crushed roasted peanuts.',
    per100g: {
      calories: 184,
      protein: 7.8,
      carbs: 26.5,
      fat: 5.6,
      fiber: 1.8,
      sugar: 4.8,
      sodiumMg: 420
    },
    servings: [
      { label: '1 plate (300g)', grams: 300, isDefault: true }
    ],
    defaultServing: { label: '1 plate (300g)', grams: 300, isDefault: true },
    budgetFriendly: false,
    allergens: ['Shellfish', 'Peanuts', 'Eggs', 'Soy'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Wok Stir Fried'
  },
  {
    id: 'asn_thai_green_curry',
    name: 'Thai Green Curry with Chicken & Bamboo Shoots',
    malayalamName: 'തായ് ഗ്രീൻ കറി',
    manglishName: 'Thai Green Curry',
    alternateNames: ['thai green curry', 'green curry chicken', 'kaeng khiao wan', 'തായ് കറി'],
    cuisine: 'asian',
    region: 'Thailand',
    category: 'curries_gravies',
    dietaryType: 'non_vegetarian',
    description: 'Fragrant spicy curry made with fresh green chili paste, lemongrass, galangal, kaffir lime leaves, chicken breast, and creamy coconut milk.',
    per100g: {
      calories: 148,
      protein: 11.5,
      carbs: 4.2,
      fat: 9.6,
      fiber: 1.2,
      sugar: 2.1,
      sodiumMg: 380
    },
    servings: [
      { label: '1 bowl with chicken & vegetables (200g)', grams: 200, isDefault: true },
      { label: '1 large bowl (280g)', grams: 280 }
    ],
    defaultServing: { label: '1 bowl with chicken & vegetables (200g)', grams: 200, isDefault: true },
    budgetFriendly: false,
    allergens: ['Fish', 'Coconut'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central',
    cookingMethod: 'Simmered in coconut milk'
  },

  // ==========================================
  // WESTERN & FITNESS STAPLES
  // ==========================================
  {
    id: 'fit_grilled_chicken_breast',
    name: 'Grilled Skinless Chicken Breast',
    malayalamName: 'ഗ്രിൽഡ് ചിക്കൻ ബ്രെസ്റ്റ്',
    manglishName: 'Grilled Chicken Breast',
    alternateNames: ['chicken breast', 'grilled chicken', 'skinless chicken', 'chicken steak', 'ഗ്രിൽഡ് ചിക്കൻ'],
    cuisine: 'western',
    region: 'Global / Western',
    category: 'fitness_staples',
    dietaryType: 'non_vegetarian',
    description: 'Lean boneless skinless chicken breast seasoned with black pepper, garlic, and sea salt, flame-grilled. High biological value protein with minimal saturated fat.',
    per100g: {
      calories: 165,
      protein: 31.0,
      carbs: 0.0,
      fat: 3.6,
      fiber: 0.0,
      sugar: 0.0,
      sodiumMg: 74
    },
    servings: [
      { label: '1 small breast (120g cooked)', grams: 120 },
      { label: '1 medium breast (160g cooked)', grams: 160, isDefault: true },
      { label: '1 large breast (220g cooked)', grams: 220 }
    ],
    defaultServing: { label: '1 medium breast (160g cooked)', grams: 160, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central (FDC ID: 171077)',
    cookingMethod: 'Flame Grilled'
  },
  {
    id: 'fit_atlantic_salmon',
    name: 'Pan-Seared Atlantic Salmon Fillet',
    malayalamName: 'സാൽമൺ ഫില്ലറ്റ്',
    manglishName: 'Salmon Fillet / Seared Salmon',
    alternateNames: ['salmon', 'salmon fillet', 'atlantic salmon', 'grilled salmon', 'സാൽമൺ'],
    cuisine: 'western',
    region: 'Global / Western',
    category: 'fitness_staples',
    dietaryType: 'pescatarian',
    description: 'Fresh Atlantic salmon fillet seared skin-crisp with olive oil, lemon, and dill. Outstanding source of long-chain EPA/DHA omega-3 fatty acids and astaxanthin.',
    per100g: {
      calories: 208,
      protein: 22.0,
      carbs: 0.0,
      fat: 12.5,
      fiber: 0.0,
      sugar: 0.0,
      sodiumMg: 59
    },
    servings: [
      { label: '1 standard fillet (150g)', grams: 150, isDefault: true },
      { label: '1 large fillet (200g)', grams: 200 }
    ],
    defaultServing: { label: '1 standard fillet (150g)', grams: 150, isDefault: true },
    budgetFriendly: false,
    allergens: ['Fish'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central (FDC ID: 173686)',
    cookingMethod: 'Pan Seared'
  },
  {
    id: 'fit_greek_yogurt',
    name: 'Plain Non-Fat Greek Yogurt (0% Fat)',
    malayalamName: 'ഗ്രീക്ക് യോഗർട്ട്',
    manglishName: 'Greek Yogurt / Strained Dahi',
    alternateNames: ['greek yogurt', 'strained yogurt', '0% yogurt', 'high protein curd', 'യോഗർട്ട്'],
    cuisine: 'western',
    region: 'Global / Western',
    category: 'fitness_staples',
    dietaryType: 'vegetarian',
    description: 'Triple-strained live culture non-fat yogurt with whey liquid removed. Twice the protein concentration of regular curd with live active probiotics.',
    per100g: {
      calories: 59,
      protein: 10.2,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0.0,
      sugar: 3.2,
      sodiumMg: 36
    },
    servings: [
      { label: '1 small cup (100g)', grams: 100 },
      { label: '1 standard tub (170g)', grams: 170, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 standard tub (170g)', grams: 170, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central (FDC ID: 170903)',
    cookingMethod: 'Cultured Dairy'
  },
  {
    id: 'fit_canned_tuna',
    name: 'Canned Light Chunk Tuna in Water (Drained)',
    malayalamName: 'ട്യൂണ മീൻ',
    manglishName: 'Canned Tuna in Water',
    alternateNames: ['tuna', 'canned tuna', 'chunk light tuna', 'tuna in water', 'ചൂര മീൻ'],
    cuisine: 'western',
    region: 'Global / Western',
    category: 'fitness_staples',
    dietaryType: 'pescatarian',
    description: 'Solid chunk light tuna packed in pure spring water and drained. Very lean protein source with virtually zero carbohydrates or fat.',
    per100g: {
      calories: 116,
      protein: 25.5,
      carbs: 0.0,
      fat: 1.0,
      fiber: 0.0,
      sugar: 0.0,
      sodiumMg: 330
    },
    servings: [
      { label: '1 drained can (130g)', grams: 130, isDefault: true },
      { label: '1/2 can (65g)', grams: 65 }
    ],
    defaultServing: { label: '1 drained can (130g)', grams: 130, isDefault: true },
    budgetFriendly: true,
    allergens: ['Fish'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central (FDC ID: 175159)',
    cookingMethod: 'Cooked & Canned'
  },
  {
    id: 'fit_rolled_oats',
    name: 'Rolled Oats (Cooked with Water)',
    malayalamName: 'ഓട്സ്',
    manglishName: 'Rolled Oats / Oatmeal',
    alternateNames: ['oats', 'rolled oats', 'oatmeal', 'porridge oats', 'ഓട്സ്'],
    cuisine: 'western',
    region: 'Global / Western',
    category: 'fitness_staples',
    dietaryType: 'vegan',
    description: 'Whole grain rolled oat groats simmered in water. Rich in cholesterol-lowering beta-glucan soluble fiber with steady low-glycemic energy release.',
    per100g: {
      calories: 71,
      protein: 2.5,
      carbs: 12.0,
      fat: 1.4,
      fiber: 1.8,
      sugar: 0.3,
      sodiumMg: 4
    },
    servings: [
      { label: '1 small bowl (150g cooked from 40g dry)', grams: 150 },
      { label: '1 standard bowl (250g cooked from 60g dry)', grams: 250, isDefault: true }
    ],
    defaultServing: { label: '1 standard bowl (250g cooked from 60g dry)', grams: 250, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central (FDC ID: 173904)',
    cookingMethod: 'Boiled with water'
  },
  {
    id: 'fit_boiled_eggs',
    name: 'Whole Large Hard-Boiled Eggs',
    malayalamName: 'പുഴുങ്ങിയ മുട്ട',
    manglishName: 'Boiled Eggs / Mutta Puzhungiyathu',
    alternateNames: ['boiled egg', 'hard boiled egg', 'large egg', 'mutta', 'മുട്ട', 'പുഴുങ്ങിയ മുട്ട'],
    cuisine: 'western',
    region: 'Global',
    category: 'fitness_staples',
    dietaryType: 'non_vegetarian',
    description: 'Whole chicken eggs gently boiled in shell until firm yolk. Complete gold standard protein source with natural choline, lutein, and healthy fats.',
    per100g: {
      calories: 143,
      protein: 12.6,
      carbs: 0.7,
      fat: 9.5,
      fiber: 0.0,
      sugar: 0.4,
      sodiumMg: 124
    },
    servings: [
      { label: '1 large egg (50g)', grams: 50 },
      { label: '2 large eggs (100g)', grams: 100, isDefault: true },
      { label: '3 large eggs (150g)', grams: 150 }
    ],
    defaultServing: { label: '2 large eggs (100g)', grams: 100, isDefault: true },
    budgetFriendly: true,
    allergens: ['Eggs'],
    verificationStatus: 'verified',
    dataSource: 'USDA FoodData Central (FDC ID: 171287)',
    cookingMethod: 'Boiled in Shell'
  },
  {
    id: 'fit_whey_isolate',
    name: '100% Whey Protein Isolate Shake (in Water)',
    malayalamName: 'വേ പ്രോട്ടീൻ ഷേക്ക്',
    manglishName: 'Whey Protein Shake',
    alternateNames: ['whey protein', 'protein powder', 'whey isolate', 'post workout shake', 'പ്രോട്ടീൻ'],
    cuisine: 'western',
    region: 'Global',
    category: 'fitness_staples',
    dietaryType: 'vegetarian',
    description: 'Cross-flow micro-filtered whey protein isolate dissolved in water. Ultra-fast absorbing leucine-rich complete protein for muscle protein synthesis.',
    per100g: {
      calories: 375,
      protein: 85.0,
      carbs: 3.5,
      fat: 1.5,
      fiber: 0.5,
      sugar: 1.0,
      sodiumMg: 180
    },
    servings: [
      { label: '1 scoop in water (30g powder = 25g protein)', grams: 30, isDefault: true },
      { label: '1.5 scoops (45g powder = 38g protein)', grams: 45 },
      { label: '2 scoops (60g powder = 51g protein)', grams: 60 }
    ],
    defaultServing: { label: '1 scoop in water (30g powder = 25g protein)', grams: 30, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'Standard Sports Nutrition Formulation',
    cookingMethod: 'Blended Powder in Water'
  }
];
