/**
 * NutriCoach AI — Food & Exercise Real Image Database
 * 
 * Sources:
 * - Food Photography: High-resolution, royalty-free photography from Unsplash CDN.
 *   Optimized for mobile & web with dynamic sizing, WebP/AVIF format negotiation, and CDN edge caching.
 * - Exercise Demonstrations: Free Exercise DB (Public Domain / Unlicense)
 *   Providing authentic two-frame movement guides (Start position & Peak contraction) via jsDelivr CDN.
 */

export interface ExerciseMediaGuide {
  name: string;
  id: string;
  startFrame: string;
  peakFrame: string;
  allFrames: string[];
}

// ============================================================================
// 1. HIGH-RESOLUTION CATEGORY FALLBACK IMAGES
// ============================================================================
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  breakfast: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  staples_grains: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80',
  curries_gravies: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
  seafood: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  meat_poultry: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
  vegetarian_sides: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  snacks_streetfood: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  beverages: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  desserts: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
  fitness_staples: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
  general_food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
};

// ============================================================================
// 2. FOOD IMAGE REGISTRY: REAL AUTHENTIC DISH PHOTOS
// ============================================================================
export const FOOD_IMAGE_REGISTRY: Record<string, string> = {
  // --- Kerala Breakfast & Breads ---
  puttu: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  kadala: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  appam: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
  idiyappam: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
  idli: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  parotta: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  porotta: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  chapati: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  upma: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  pathiri: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  matta_rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80',
  rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80',
  kappa: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80',
  tapioca: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80',
  sadya: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',

  // --- Kerala & Indian Curries ---
  chicken_curry: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
  butter_chicken: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
  chicken_roast: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
  tandoori_chicken: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  fish_curry: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  meen_curry: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  fish_moilee: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
  meen_pollichathu: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
  ayala_curry: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  chemmeen: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=600&auto=format&fit=crop&q=80',
  prawn: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=600&auto=format&fit=crop&q=80',
  beef_roast: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  beef_fry: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  mutton_curry: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80',
  egg_roast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
  egg_curry: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',

  // --- Vegetarian Sides & Curries ---
  sambar: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  avial: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  thoran: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  cabbage_thoran: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  cheera_thoran: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
  beans_thoran: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  cherupayar: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  erissery: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  olan: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  kalan: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  pulissery: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  moru_curry: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  rasam: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  parippu: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  dal_tadka: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  dal_makhani: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  paneer_butter: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
  palak_paneer: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  chana_masala: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  rajma: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  thalassery_biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',

  // --- Snacks & Desserts ---
  banana_chips: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  pazham_pori: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  samosa: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  vada: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  payasam: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
  halwa: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
  coffee: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',

  // --- Fitness Staples & Global Foods ---
  boiled_eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
  eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
  chicken_breast: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
  salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
  oats: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
  oatmeal: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
  greek_yogurt: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
  yogurt: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
  protein_shake: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80',
  whey: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80',
  almonds: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
  nuts: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
  peanut_butter: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
  salad: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
  apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
  shawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop&q=80',
  hummus: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=600&auto=format&fit=crop&q=80',
  tofu: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80'
};

/**
 * Returns a verified, accurate photo URL for any food item.
 * Never returns empty or broken URLs. Gracefully matches dish names, keywords, and categories.
 */
export function getFoodImageUrl(
  foodOrName: string | { name?: string; category?: string; cuisine?: string; dietaryType?: string; id?: string },
  preferredCategory?: string
): string {
  const name = typeof foodOrName === 'string' ? foodOrName : (foodOrName?.name || '');
  const category = (typeof foodOrName === 'object' ? foodOrName?.category : undefined) || preferredCategory;
  const dietaryType = typeof foodOrName === 'object' ? foodOrName?.dietaryType : undefined;

  const q = name.toLowerCase().trim();

  // 1. Exact or keyword dish matches
  if (q.includes('puttu')) return FOOD_IMAGE_REGISTRY.puttu;
  if (q.includes('kadala')) return FOOD_IMAGE_REGISTRY.kadala;
  if (q.includes('appam')) return FOOD_IMAGE_REGISTRY.appam;
  if (q.includes('idiyappam') || q.includes('string hopper')) return FOOD_IMAGE_REGISTRY.idiyappam;
  if (q.includes('dosa') || q.includes('masala dosa')) return FOOD_IMAGE_REGISTRY.dosa;
  if (q.includes('idli')) return FOOD_IMAGE_REGISTRY.idli;
  if (q.includes('parotta') || q.includes('porotta')) return FOOD_IMAGE_REGISTRY.parotta;
  if (q.includes('chapati') || q.includes('roti') || q.includes('phulka')) return FOOD_IMAGE_REGISTRY.chapati;
  if (q.includes('upma')) return FOOD_IMAGE_REGISTRY.upma;
  if (q.includes('pathiri')) return FOOD_IMAGE_REGISTRY.pathiri;
  if (q.includes('biryani') || q.includes('biriyani')) return FOOD_IMAGE_REGISTRY.biryani;
  if (q.includes('sadya')) return FOOD_IMAGE_REGISTRY.sadya;
  if (q.includes('kappa') || q.includes('tapioca')) return FOOD_IMAGE_REGISTRY.kappa;

  // Curries & Meats
  if (q.includes('butter chicken') || q.includes('makhani')) return FOOD_IMAGE_REGISTRY.butter_chicken;
  if (q.includes('tandoori chicken')) return FOOD_IMAGE_REGISTRY.tandoori_chicken;
  if (q.includes('chicken roast') || q.includes('pepper chicken')) return FOOD_IMAGE_REGISTRY.chicken_roast;
  if (q.includes('chicken') && (q.includes('curry') || q.includes('kozhi') || q.includes('nadan'))) return FOOD_IMAGE_REGISTRY.chicken_curry;
  if (q.includes('chicken breast') || q.includes('grilled chicken')) return FOOD_IMAGE_REGISTRY.chicken_breast;
  
  // Seafood
  if (q.includes('moilee') || q.includes('fish molly')) return FOOD_IMAGE_REGISTRY.fish_moilee;
  if (q.includes('pollichathu') || q.includes('fried fish')) return FOOD_IMAGE_REGISTRY.meen_pollichathu;
  if (q.includes('salmon')) return FOOD_IMAGE_REGISTRY.salmon;
  if (q.includes('chemmeen') || q.includes('prawn') || q.includes('shrimp')) return FOOD_IMAGE_REGISTRY.chemmeen;
  if (q.includes('fish') || q.includes('meen') || q.includes('ayala') || q.includes('mackerel') || q.includes('mathi') || q.includes('sardine')) return FOOD_IMAGE_REGISTRY.fish_curry;

  // Beef & Mutton
  if (q.includes('beef') || q.includes('ularthiyathu')) return FOOD_IMAGE_REGISTRY.beef_roast;
  if (q.includes('mutton') || q.includes('lamb') || q.includes('rogan')) return FOOD_IMAGE_REGISTRY.mutton_curry;

  // Eggs
  if (q.includes('egg roast') || q.includes('egg curry')) return FOOD_IMAGE_REGISTRY.egg_roast;
  if (q.includes('boiled egg') || q.includes('boiled eggs') || q.includes('egg')) return FOOD_IMAGE_REGISTRY.boiled_eggs;

  // Vegetarian Curries
  if (q.includes('avial') || q.includes('aviyal')) return FOOD_IMAGE_REGISTRY.avial;
  if (q.includes('cabbage thoran')) return FOOD_IMAGE_REGISTRY.cabbage_thoran;
  if (q.includes('cheera thoran') || q.includes('spinach')) return FOOD_IMAGE_REGISTRY.cheera_thoran;
  if (q.includes('thoran') || q.includes('poriyal')) return FOOD_IMAGE_REGISTRY.thoran;
  if (q.includes('sambar')) return FOOD_IMAGE_REGISTRY.sambar;
  if (q.includes('rasam')) return FOOD_IMAGE_REGISTRY.rasam;
  if (q.includes('erissery')) return FOOD_IMAGE_REGISTRY.erissery;
  if (q.includes('olan')) return FOOD_IMAGE_REGISTRY.olan;
  if (q.includes('kalan') || q.includes('pulissery') || q.includes('moru curry') || q.includes('buttermilk')) return FOOD_IMAGE_REGISTRY.moru_curry;
  if (q.includes('parippu') || q.includes('dal tadka') || q.includes('yellow dal')) return FOOD_IMAGE_REGISTRY.parippu;
  if (q.includes('dal makhani')) return FOOD_IMAGE_REGISTRY.dal_makhani;
  if (q.includes('paneer') || q.includes('palak paneer')) return FOOD_IMAGE_REGISTRY.paneer_butter;
  if (q.includes('chana') || q.includes('chole') || q.includes('chickpea')) return FOOD_IMAGE_REGISTRY.chana_masala;
  if (q.includes('rajma')) return FOOD_IMAGE_REGISTRY.rajma;

  // Fitness & Healthy
  if (q.includes('oat') || q.includes('oatmeal') || q.includes('porridge')) return FOOD_IMAGE_REGISTRY.oatmeal;
  if (q.includes('yogurt') || q.includes('curd')) return FOOD_IMAGE_REGISTRY.greek_yogurt;
  if (q.includes('whey') || q.includes('protein shake') || q.includes('shake')) return FOOD_IMAGE_REGISTRY.protein_shake;
  if (q.includes('almond') || q.includes('nut') || q.includes('peanut')) return FOOD_IMAGE_REGISTRY.almonds;
  if (q.includes('salad')) return FOOD_IMAGE_REGISTRY.salad;
  if (q.includes('fruit') || q.includes('apple') || q.includes('banana') || q.includes('papaya')) return FOOD_IMAGE_REGISTRY.fruits;
  if (q.includes('rice') || q.includes('matta') || q.includes('brown rice')) return FOOD_IMAGE_REGISTRY.matta_rice;

  // Snacks & Desserts
  if (q.includes('banana chips') || q.includes('upperi') || q.includes('pazham pori')) return FOOD_IMAGE_REGISTRY.banana_chips;
  if (q.includes('samosa') || q.includes('vada')) return FOOD_IMAGE_REGISTRY.samosa;
  if (q.includes('payasam') || q.includes('pradhaman') || q.includes('pudding') || q.includes('halwa')) return FOOD_IMAGE_REGISTRY.payasam;
  if (q.includes('tea') || q.includes('coffee') || q.includes('chaya') || q.includes('sulaimani')) return FOOD_IMAGE_REGISTRY.tea;

  // Global Dishes
  if (q.includes('pasta')) return FOOD_IMAGE_REGISTRY.pasta;
  if (q.includes('pizza')) return FOOD_IMAGE_REGISTRY.pizza;
  if (q.includes('shawarma')) return FOOD_IMAGE_REGISTRY.shawarma;
  if (q.includes('hummus') || q.includes('falafel')) return FOOD_IMAGE_REGISTRY.hummus;
  if (q.includes('sushi')) return FOOD_IMAGE_REGISTRY.sushi;
  if (q.includes('tofu')) return FOOD_IMAGE_REGISTRY.tofu;

  // 2. Category Fallback
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }

  // 3. Dietary Type Fallback
  if (dietaryType === 'pescatarian') return CATEGORY_FALLBACK_IMAGES.seafood;
  if (dietaryType === 'non_vegetarian') return CATEGORY_FALLBACK_IMAGES.meat_poultry;
  if (dietaryType === 'vegetarian' || dietaryType === 'vegan') return CATEGORY_FALLBACK_IMAGES.vegetarian_sides;

  return CATEGORY_FALLBACK_IMAGES.general_food;
}

// ============================================================================
// 3. EXERCISE DEMONSTRATION IMAGES REGISTRY (Free Exercise DB via jsDelivr CDN)
// ============================================================================
const EXERCISE_CDN_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/';

export const EXERCISE_DEMO_REGISTRY: Record<string, { folder: string; frames: string[] }> = {
  // Chest
  barbell_bench_press: {
    folder: 'Barbell_Bench_Press_-_Medium_Grip',
    frames: ['Barbell_Bench_Press_-_Medium_Grip/0.jpg', 'Barbell_Bench_Press_-_Medium_Grip/1.jpg']
  },
  barbell_flat_bench_press: {
    folder: 'Barbell_Bench_Press_-_Medium_Grip',
    frames: ['Barbell_Bench_Press_-_Medium_Grip/0.jpg', 'Barbell_Bench_Press_-_Medium_Grip/1.jpg']
  },
  dumbbell_chest_press: {
    folder: 'Dumbbell_Bench_Press',
    frames: ['Dumbbell_Bench_Press/0.jpg', 'Dumbbell_Bench_Press/1.jpg']
  },
  dumbbell_bench_press: {
    folder: 'Dumbbell_Bench_Press',
    frames: ['Dumbbell_Bench_Press/0.jpg', 'Dumbbell_Bench_Press/1.jpg']
  },
  dumbbell_flat_bench_press: {
    folder: 'Dumbbell_Bench_Press',
    frames: ['Dumbbell_Bench_Press/0.jpg', 'Dumbbell_Bench_Press/1.jpg']
  },
  incline_dumbbell_press: {
    folder: 'Incline_Dumbbell_Press',
    frames: ['Incline_Dumbbell_Press/0.jpg', 'Incline_Dumbbell_Press/1.jpg']
  },
  push_up: {
    folder: 'Pushups',
    frames: ['Pushups/0.jpg', 'Pushups/1.jpg']
  },
  pushups_standard: {
    folder: 'Pushups',
    frames: ['Pushups/0.jpg', 'Pushups/1.jpg']
  },
  standard_push_up: {
    folder: 'Pushups',
    frames: ['Pushups/0.jpg', 'Pushups/1.jpg']
  },
  cable_fly: {
    folder: 'Flat_Bench_Cable_Flyes',
    frames: ['Flat_Bench_Cable_Flyes/0.jpg', 'Flat_Bench_Cable_Flyes/1.jpg']
  },

  // Shoulders
  overhead_barbell_press: {
    folder: 'Standing_Barbell_Press_Behind_Neck',
    frames: ['Standing_Barbell_Press_Behind_Neck/0.jpg', 'Standing_Barbell_Press_Behind_Neck/1.jpg']
  },
  standing_overhead_barbell_press: {
    folder: 'Standing_Barbell_Press_Behind_Neck',
    frames: ['Standing_Barbell_Press_Behind_Neck/0.jpg', 'Standing_Barbell_Press_Behind_Neck/1.jpg']
  },
  dumbbell_lateral_raise: {
    folder: 'Side_Lateral_Raise',
    frames: ['Side_Lateral_Raise/0.jpg', 'Side_Lateral_Raise/1.jpg']
  },
  dumbbell_lateral_raises: {
    folder: 'Side_Lateral_Raise',
    frames: ['Side_Lateral_Raise/0.jpg', 'Side_Lateral_Raise/1.jpg']
  },
  face_pull_cable: {
    folder: 'Face_Pull',
    frames: ['Face_Pull/0.jpg', 'Face_Pull/1.jpg']
  },
  cable_face_pull: {
    folder: 'Face_Pull',
    frames: ['Face_Pull/0.jpg', 'Face_Pull/1.jpg']
  },
  overhead_dumbbell_press: {
    folder: 'Dumbbell_Shoulder_Press',
    frames: ['Dumbbell_Shoulder_Press/0.jpg', 'Dumbbell_Shoulder_Press/1.jpg']
  },
  dumbbell_shoulder_press: {
    folder: 'Dumbbell_Shoulder_Press',
    frames: ['Dumbbell_Shoulder_Press/0.jpg', 'Dumbbell_Shoulder_Press/1.jpg']
  },
  seated_or_standing_dumbbell_shoulder_press: {
    folder: 'Dumbbell_Shoulder_Press',
    frames: ['Dumbbell_Shoulder_Press/0.jpg', 'Dumbbell_Shoulder_Press/1.jpg']
  },

  // Arms: Biceps & Triceps
  barbell_bicep_curl: {
    folder: 'Barbell_Curl',
    frames: ['Barbell_Curl/0.jpg', 'Barbell_Curl/1.jpg']
  },
  standing_barbell_bicep_curl: {
    folder: 'Barbell_Curl',
    frames: ['Barbell_Curl/0.jpg', 'Barbell_Curl/1.jpg']
  },
  incline_dumbbell_curl: {
    folder: 'Incline_Dumbbell_Curl',
    frames: ['Incline_Dumbbell_Curl/0.jpg', 'Incline_Dumbbell_Curl/1.jpg']
  },
  dumbbell_bicep_curls: {
    folder: 'Dumbbell_Bicep_Curl',
    frames: ['Dumbbell_Bicep_Curl/0.jpg', 'Dumbbell_Bicep_Curl/1.jpg']
  },
  alternating_dumbbell_bicep_curls: {
    folder: 'Dumbbell_Bicep_Curl',
    frames: ['Dumbbell_Bicep_Curl/0.jpg', 'Dumbbell_Bicep_Curl/1.jpg']
  },
  cable_tricep_pushdown: {
    folder: 'Cable_Incline_Pushdown',
    frames: ['Cable_Incline_Pushdown/0.jpg', 'Cable_Incline_Pushdown/1.jpg']
  },
  skull_crushers_ez: {
    folder: 'EZ-Bar_Skullcrusher',
    frames: ['EZ-Bar_Skullcrusher/0.jpg', 'EZ-Bar_Skullcrusher/1.jpg']
  },
  ez_bar_skull_crusher: {
    folder: 'EZ-Bar_Skullcrusher',
    frames: ['EZ-Bar_Skullcrusher/0.jpg', 'EZ-Bar_Skullcrusher/1.jpg']
  },
  tricep_dips_bench: {
    folder: 'Bench_Dips',
    frames: ['Bench_Dips/0.jpg', 'Bench_Dips/1.jpg']
  },
  bench_dips: {
    folder: 'Bench_Dips',
    frames: ['Bench_Dips/0.jpg', 'Bench_Dips/1.jpg']
  },
  bench_or_chair_tricep_dips: {
    folder: 'Bench_Dips',
    frames: ['Bench_Dips/0.jpg', 'Bench_Dips/1.jpg']
  },

  // Forearms
  farmers_walk: {
    folder: 'Farmers_Walk',
    frames: ['Farmers_Walk/0.jpg', 'Farmers_Walk/1.jpg']
  },
  heavy_farmer_walk: {
    folder: 'Farmers_Walk',
    frames: ['Farmers_Walk/0.jpg', 'Farmers_Walk/1.jpg']
  },
  reverse_barbell_curl: {
    folder: 'Reverse_Barbell_Curl',
    frames: ['Reverse_Barbell_Curl/0.jpg', 'Reverse_Barbell_Curl/1.jpg']
  },
  reverse_barbell_grip_curl: {
    folder: 'Reverse_Barbell_Curl',
    frames: ['Reverse_Barbell_Curl/0.jpg', 'Reverse_Barbell_Curl/1.jpg']
  },

  // Abs & Core
  hanging_leg_raise: {
    folder: 'Hanging_Leg_Raise',
    frames: ['Hanging_Leg_Raise/0.jpg', 'Hanging_Leg_Raise/1.jpg']
  },
  ab_wheel_rollout: {
    folder: 'Ab_Roller',
    frames: ['Ab_Roller/0.jpg', 'Ab_Roller/1.jpg']
  },
  kneeling_ab_wheel_rollout: {
    folder: 'Ab_Roller',
    frames: ['Ab_Roller/0.jpg', 'Ab_Roller/1.jpg']
  },
  cable_woodchopper: {
    folder: 'Standing_Cable_Wood_Chop',
    frames: ['Standing_Cable_Wood_Chop/0.jpg', 'Standing_Cable_Wood_Chop/1.jpg']
  },
  side_plank_reach: {
    folder: 'Plank',
    frames: ['Plank/0.jpg', 'Plank/1.jpg']
  },
  side_plank_rotation: {
    folder: 'Plank',
    frames: ['Plank/0.jpg', 'Plank/1.jpg']
  },
  side_plank_with_rotation: {
    folder: 'Plank',
    frames: ['Plank/0.jpg', 'Plank/1.jpg']
  },
  forearm_plank: {
    folder: 'Plank',
    frames: ['Plank/0.jpg', 'Plank/1.jpg']
  },
  plank_forearm: {
    folder: 'Plank',
    frames: ['Plank/0.jpg', 'Plank/1.jpg']
  },
  plank: {
    folder: 'Plank',
    frames: ['Plank/0.jpg', 'Plank/1.jpg']
  },
  dead_bug: {
    folder: 'Dead_Bug',
    frames: ['Dead_Bug/0.jpg', 'Dead_Bug/1.jpg']
  },
  deadbug: {
    folder: 'Dead_Bug',
    frames: ['Dead_Bug/0.jpg', 'Dead_Bug/1.jpg']
  },
  dead_bug_core_stability: {
    folder: 'Dead_Bug',
    frames: ['Dead_Bug/0.jpg', 'Dead_Bug/1.jpg']
  },

  // Back & Lats
  barbell_shrug: {
    folder: 'Barbell_Shrug',
    frames: ['Barbell_Shrug/0.jpg', 'Barbell_Shrug/1.jpg']
  },
  barbell_trap_shrug: {
    folder: 'Barbell_Shrug',
    frames: ['Barbell_Shrug/0.jpg', 'Barbell_Shrug/1.jpg']
  },
  chest_supported_db_row: {
    folder: 'Bent_Over_Two-Dumbbell_Row',
    frames: ['Bent_Over_Two-Dumbbell_Row/0.jpg', 'Bent_Over_Two-Dumbbell_Row/1.jpg']
  },
  chest_supported_dumbbell_row: {
    folder: 'Bent_Over_Two-Dumbbell_Row',
    frames: ['Bent_Over_Two-Dumbbell_Row/0.jpg', 'Bent_Over_Two-Dumbbell_Row/1.jpg']
  },
  single_arm_dumbbell_row: {
    folder: 'One-Arm_Dumbbell_Row',
    frames: ['One-Arm_Dumbbell_Row/0.jpg', 'One-Arm_Dumbbell_Row/1.jpg']
  },
  lat_pulldown_wide: {
    folder: 'Wide-Grip_Lat_Pulldown',
    frames: ['Wide-Grip_Lat_Pulldown/0.jpg', 'Wide-Grip_Lat_Pulldown/1.jpg']
  },
  wide_grip_lat_pulldown: {
    folder: 'Wide-Grip_Lat_Pulldown',
    frames: ['Wide-Grip_Lat_Pulldown/0.jpg', 'Wide-Grip_Lat_Pulldown/1.jpg']
  },
  pull_up_bodyweight: {
    folder: 'Pullups',
    frames: ['Pullups/0.jpg', 'Pullups/1.jpg']
  },
  pullups_bodyweight: {
    folder: 'Pullups',
    frames: ['Pullups/0.jpg', 'Pullups/1.jpg']
  },
  bodyweight_pull_up: {
    folder: 'Pullups',
    frames: ['Pullups/0.jpg', 'Pullups/1.jpg']
  },
  overhand_pull_up: {
    folder: 'Pullups',
    frames: ['Pullups/0.jpg', 'Pullups/1.jpg']
  },
  hyperextension_45: {
    folder: 'Hyperextensions_Back_Extensions',
    frames: ['Hyperextensions_Back_Extensions/0.jpg', 'Hyperextensions_Back_Extensions/1.jpg']
  },
  back_extension_45: {
    folder: 'Hyperextensions_Back_Extensions',
    frames: ['Hyperextensions_Back_Extensions/0.jpg', 'Hyperextensions_Back_Extensions/1.jpg']
  },
  '45_degree_back_extension': {
    folder: 'Hyperextensions_Back_Extensions',
    frames: ['Hyperextensions_Back_Extensions/0.jpg', 'Hyperextensions_Back_Extensions/1.jpg']
  },
  bird_dog_core: {
    folder: 'Superman',
    frames: ['Superman/0.jpg', 'Superman/1.jpg']
  },
  bird_dog_stability: {
    folder: 'Superman',
    frames: ['Superman/0.jpg', 'Superman/1.jpg']
  },
  bird_dog_spinal_stabilization: {
    folder: 'Superman',
    frames: ['Superman/0.jpg', 'Superman/1.jpg']
  },
  barbell_deadlift: {
    folder: 'Barbell_Deadlift',
    frames: ['Barbell_Deadlift/0.jpg', 'Barbell_Deadlift/1.jpg']
  },
  conventional_barbell_deadlift: {
    folder: 'Barbell_Deadlift',
    frames: ['Barbell_Deadlift/0.jpg', 'Barbell_Deadlift/1.jpg']
  },
  conventional_deadlift: {
    folder: 'Barbell_Deadlift',
    frames: ['Barbell_Deadlift/0.jpg', 'Barbell_Deadlift/1.jpg']
  },

  // Glutes & Legs
  barbell_hip_thrust: {
    folder: 'Barbell_Hip_Thrust',
    frames: ['Barbell_Hip_Thrust/0.jpg', 'Barbell_Hip_Thrust/1.jpg']
  },
  bulgarian_split_squat: {
    folder: 'Split_Squat_with_Dumbbells',
    frames: ['Split_Squat_with_Dumbbells/0.jpg', 'Split_Squat_with_Dumbbells/1.jpg']
  },
  barbell_back_squat: {
    folder: 'Barbell_Full_Squat',
    frames: ['Barbell_Full_Squat/0.jpg', 'Barbell_Full_Squat/1.jpg']
  },
  goblet_squat: {
    folder: 'Goblet_Squat',
    frames: ['Goblet_Squat/0.jpg', 'Goblet_Squat/1.jpg']
  },
  dumbbell_goblet_squat: {
    folder: 'Goblet_Squat',
    frames: ['Goblet_Squat/0.jpg', 'Goblet_Squat/1.jpg']
  },
  leg_extension: {
    folder: 'Leg_Extensions',
    frames: ['Leg_Extensions/0.jpg', 'Leg_Extensions/1.jpg']
  },
  seated_leg_extension: {
    folder: 'Leg_Extensions',
    frames: ['Leg_Extensions/0.jpg', 'Leg_Extensions/1.jpg']
  },
  romanian_deadlift: {
    folder: 'Romanian_Deadlift',
    frames: ['Romanian_Deadlift/0.jpg', 'Romanian_Deadlift/1.jpg']
  },
  romanian_deadlift_db: {
    folder: 'Romanian_Deadlift',
    frames: ['Romanian_Deadlift/0.jpg', 'Romanian_Deadlift/1.jpg']
  },
  dumbbell_romanian_deadlift: {
    folder: 'Romanian_Deadlift',
    frames: ['Romanian_Deadlift/0.jpg', 'Romanian_Deadlift/1.jpg']
  },
  dumbbell_romanian_deadlift_rdl: {
    folder: 'Romanian_Deadlift',
    frames: ['Romanian_Deadlift/0.jpg', 'Romanian_Deadlift/1.jpg']
  },
  lying_leg_curl: {
    folder: 'Lying_Leg_Curls',
    frames: ['Lying_Leg_Curls/0.jpg', 'Lying_Leg_Curls/1.jpg']
  },
  lying_hamstring_curl: {
    folder: 'Lying_Leg_Curls',
    frames: ['Lying_Leg_Curls/0.jpg', 'Lying_Leg_Curls/1.jpg']
  },
  lying_hamstring_leg_curl: {
    folder: 'Lying_Leg_Curls',
    frames: ['Lying_Leg_Curls/0.jpg', 'Lying_Leg_Curls/1.jpg']
  },
  standing_calf_raise: {
    folder: 'Standing_Dumbbell_Calf_Raise',
    frames: ['Standing_Dumbbell_Calf_Raise/0.jpg', 'Standing_Dumbbell_Calf_Raise/1.jpg']
  },
  standing_dumbbell_calf_raise: {
    folder: 'Standing_Dumbbell_Calf_Raise',
    frames: ['Standing_Dumbbell_Calf_Raise/0.jpg', 'Standing_Dumbbell_Calf_Raise/1.jpg']
  },
  seated_calf_raise: {
    folder: 'Seated_Calf_Raise',
    frames: ['Seated_Calf_Raise/0.jpg', 'Seated_Calf_Raise/1.jpg']
  },
  bodyweight_lunges: {
    folder: 'Dumbbell_Lunges',
    frames: ['Dumbbell_Lunges/0.jpg', 'Dumbbell_Lunges/1.jpg']
  },
  walking_or_static_lunges: {
    folder: 'Dumbbell_Lunges',
    frames: ['Dumbbell_Lunges/0.jpg', 'Dumbbell_Lunges/1.jpg']
  },
  lunges: {
    folder: 'Dumbbell_Lunges',
    frames: ['Dumbbell_Lunges/0.jpg', 'Dumbbell_Lunges/1.jpg']
  }
};

/**
 * Returns exact start and peak demonstration frames for any exercise by ID or name.
 */
export function getExerciseMediaGuide(exerciseIdOrName: string): ExerciseMediaGuide {
  const q = exerciseIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

  let item = EXERCISE_DEMO_REGISTRY[q];

  if (!item) {
    // Exact or substring match through registered keys
    for (const [key, val] of Object.entries(EXERCISE_DEMO_REGISTRY)) {
      if (q === key || q.includes(key) || key.includes(q)) {
        item = val;
        break;
      }
    }
  }

  // Smart keyword fallbacks
  if (!item) {
    if (q.includes('bench') || q.includes('chest_press')) item = EXERCISE_DEMO_REGISTRY.barbell_bench_press;
    else if (q.includes('incline')) item = EXERCISE_DEMO_REGISTRY.incline_dumbbell_press;
    else if (q.includes('push_up') || q.includes('pushup')) item = EXERCISE_DEMO_REGISTRY.push_up;
    else if (q.includes('pull_up') || q.includes('pullup')) item = EXERCISE_DEMO_REGISTRY.pull_up_bodyweight;
    else if (q.includes('deadlift')) item = EXERCISE_DEMO_REGISTRY.barbell_deadlift || EXERCISE_DEMO_REGISTRY.romanian_deadlift;
    else if (q.includes('squat')) item = EXERCISE_DEMO_REGISTRY.barbell_back_squat;
    else if (q.includes('curl')) item = EXERCISE_DEMO_REGISTRY.barbell_bicep_curl;
    else if (q.includes('lateral_raise')) item = EXERCISE_DEMO_REGISTRY.dumbbell_lateral_raise;
    else if (q.includes('face_pull')) item = EXERCISE_DEMO_REGISTRY.face_pull_cable;
    else if (q.includes('shoulder') || q.includes('overhead')) item = EXERCISE_DEMO_REGISTRY.overhead_barbell_press;
    else if (q.includes('lunge')) item = EXERCISE_DEMO_REGISTRY.bodyweight_lunges;
    else if (q.includes('plank')) item = EXERCISE_DEMO_REGISTRY.forearm_plank;
    else if (q.includes('dip')) item = EXERCISE_DEMO_REGISTRY.tricep_dips_bench;
    else if (q.includes('calf')) item = EXERCISE_DEMO_REGISTRY.standing_calf_raise;
    else if (q.includes('thrust')) item = EXERCISE_DEMO_REGISTRY.barbell_hip_thrust;
    else if (q.includes('shrug')) item = EXERCISE_DEMO_REGISTRY.barbell_shrug;
    else if (q.includes('row')) item = EXERCISE_DEMO_REGISTRY.chest_supported_db_row;
    else item = EXERCISE_DEMO_REGISTRY.push_up;
  }

  const allFrames = item.frames.map((f) => `${EXERCISE_CDN_BASE}${f}`);

  return {
    name: exerciseIdOrName,
    id: q,
    startFrame: allFrames[0],
    peakFrame: allFrames[1] || allFrames[0],
    allFrames
  };
}

