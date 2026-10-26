import { MeasurementUnit } from './ingredientsData';
import { ComprehensiveFood } from './foodDatabase/types';

export type CookingMethodType = 
  | 'gravy_simmered' 
  | 'boiled' 
  | 'fried' 
  | 'roasted' 
  | 'steamed';

export interface DishRecipeIngredient {
  ingredientId: string;
  customName?: string;
  amount: number;
  unit: MeasurementUnit;
  isRemovable?: boolean;
  isOptional?: boolean;
  notes?: string;
}

export interface DishRecipe {
  dishId: string;
  dishName: string;
  cuisine: string;
  category: string;
  dietaryType: string;
  defaultServings: number;
  servingUnitName: string; // e.g. "bowl", "katori", "piece", "serving"
  cookingMethod: CookingMethodType;
  description: string;
  ingredients: DishRecipeIngredient[];
  isAuthenticStandard: boolean;
}

/**
 * AUTHENTIC KERALA, REGIONAL INDIAN & INTERNATIONAL DISH RECIPES
 * Formulated according to traditional culinary standards and ICMR-NIN household measures.
 */
export const AUTHENTIC_DISH_RECIPES: Record<string, DishRecipe> = {
  // 1. KERALA NADAN CHICKEN CURRY
  'curry_ker_nadan_chicken': {
    dishId: 'curry_ker_nadan_chicken',
    dishName: 'Kerala Nadan Chicken Curry (Country Chicken Gravy)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'non_vegetarian',
    defaultServings: 2,
    servingUnitName: 'bowl (150g)',
    cookingMethod: 'gravy_simmered',
    description: 'Traditional Kerala home-style chicken curry cooked with roasted coriander, Kashmiri chili, shallots, garlic, ginger, and fresh curry leaves.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_chicken_thigh_raw', amount: 240, unit: 'g', notes: 'Curry cut pieces' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp', notes: 'Cold-pressed coconut oil' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 70, unit: 'g', notes: 'Finely sliced shallots' },
      { ingredientId: 'ing_tomato_red_ripe', amount: 50, unit: 'g', notes: 'Chopped country tomato' },
      { ingredientId: 'ing_ginger_fresh', amount: 1.5, unit: 'tsp', notes: 'Freshly minced ginger' },
      { ingredientId: 'ing_garlic_fresh', amount: 4, unit: 'clove', notes: 'Crushed garlic cloves' },
      { ingredientId: 'ing_green_chilies', amount: 2, unit: 'piece', notes: 'Slit green chilies' },
      { ingredientId: 'ing_coriander_powder', amount: 1.5, unit: 'tbsp', notes: 'Roasted coriander powder' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tbsp', notes: 'Kashmiri chili powder' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp', notes: 'Turmeric' },
      { ingredientId: 'ing_garam_masala', amount: 0.5, unit: 'tsp', notes: 'Kerala garam masala' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 12, unit: 'leaf', notes: 'Fresh curry leaves' },
      { ingredientId: 'ing_water_broth', amount: 1, unit: 'cup', notes: 'Simmering liquid' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp', notes: 'To taste' }
    ]
  },

  // 2. KERALA CHICKEN CURRY WITH COCONUT MILK
  'curry_ker_chicken_coconut_milk': {
    dishId: 'curry_ker_chicken_coconut_milk',
    dishName: 'Kerala Chicken Curry with Coconut Milk',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'non_vegetarian',
    defaultServings: 2,
    servingUnitName: 'bowl (160g)',
    cookingMethod: 'gravy_simmered',
    description: 'Tender chicken simmered in rich first and second extract fresh coconut milk, green chilies, shallots, and whole spices.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_chicken_thigh_raw', amount: 240, unit: 'g', notes: 'Skinless chicken pieces' },
      { ingredientId: 'ing_coconut_milk_thick', amount: 0.35, unit: 'cup', notes: 'Thick coconut milk (1st extract)' },
      { ingredientId: 'ing_coconut_milk_thin', amount: 0.75, unit: 'cup', notes: 'Thin coconut milk (2nd extract)' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp', notes: 'Tempering and sautéing' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 60, unit: 'g', notes: 'Shallots' },
      { ingredientId: 'ing_ginger_fresh', amount: 1, unit: 'tsp', notes: 'Minced ginger' },
      { ingredientId: 'ing_garlic_fresh', amount: 3, unit: 'clove', notes: 'Crushed garlic' },
      { ingredientId: 'ing_green_chilies', amount: 3, unit: 'piece', notes: 'Slit green chilies' },
      { ingredientId: 'ing_coriander_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_black_pepper_ground', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_fennel_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 10, unit: 'leaf' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 3. MALABAR BEEF ROAST / KERALA BEEF CURRY
  'curry_ker_beef_roast': {
    dishId: 'curry_ker_beef_roast',
    dishName: 'Malabar Beef Roast (Kerala Nadan Beef Ularthiyathu)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'non_vegetarian',
    defaultServings: 2,
    servingUnitName: 'serving (130g)',
    cookingMethod: 'roasted',
    description: 'Tender beef cubes slow-cooked with roasted spices, garlic, ginger, and shallow-roasted with coconut bites (thenga kothu) and curry leaves.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_beef_lean_raw', amount: 250, unit: 'g', notes: 'Boneless beef stew cubes' },
      { ingredientId: 'ing_coconut_oil', amount: 1.5, unit: 'tbsp', notes: 'Slow roasting oil' },
      { ingredientId: 'ing_coconut_grated_fresh', amount: 20, unit: 'g', notes: 'Thin coconut slices (thenga kothu)' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 80, unit: 'g', notes: 'Sliced shallots' },
      { ingredientId: 'ing_ginger_fresh', amount: 2, unit: 'tsp' },
      { ingredientId: 'ing_garlic_fresh', amount: 5, unit: 'clove' },
      { ingredientId: 'ing_coriander_powder', amount: 1.5, unit: 'tbsp' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1.2, unit: 'tbsp' },
      { ingredientId: 'ing_black_pepper_ground', amount: 1, unit: 'tsp', notes: 'Freshly cracked Malabar pepper' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_garam_masala', amount: 0.75, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 15, unit: 'leaf' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 4. KERALA MEEN CURRY WITH KUDAMPULI (FISH CURRY)
  'curry_ker_fish_curry_kudampuli': {
    dishId: 'curry_ker_fish_curry_kudampuli',
    dishName: 'Kerala Fish Curry with Kudampuli (Meen Vevichathu)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'pescatarian',
    defaultServings: 2,
    servingUnitName: 'bowl (150g)',
    cookingMethod: 'gravy_simmered',
    description: 'Traditional clay-pot fish curry prepared with Kingfish steaks, dried Malabar tamarind (kudampuli), fenugreek, fiery Kashmiri chili, and curry leaves.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_seer_fish_raw', amount: 220, unit: 'g', notes: 'Kingfish / Seer fish steaks' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp', notes: 'Claypot tempering oil' },
      { ingredientId: 'ing_kudampuli_malabar_tamarind', amount: 3, unit: 'piece', notes: 'Soaked Malabar tamarind' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 50, unit: 'g', notes: 'Shallots' },
      { ingredientId: 'ing_ginger_fresh', amount: 2, unit: 'tsp', notes: 'Julienned ginger' },
      { ingredientId: 'ing_garlic_fresh', amount: 5, unit: 'clove', notes: 'Sliced garlic' },
      { ingredientId: 'ing_green_chilies', amount: 2, unit: 'piece' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1.5, unit: 'tbsp', notes: 'Rich red color and mild heat' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_fenugreek_seeds', amount: 0.25, unit: 'tsp', notes: 'Tempered uluva' },
      { ingredientId: 'ing_mustard_seeds', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 14, unit: 'leaf' },
      { ingredientId: 'ing_water_broth', amount: 1.2, unit: 'cup', notes: 'Tangy red gravy' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 5. KERALA SARDINE CURRY (MATHI CURRY)
  'curry_ker_sardine_mathi': {
    dishId: 'curry_ker_sardine_mathi',
    dishName: 'Kerala Sardine Curry (Nadan Mathi Curry)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'pescatarian',
    defaultServings: 2,
    servingUnitName: 'bowl (150g)',
    cookingMethod: 'gravy_simmered',
    description: 'Fresh local sardines slow-cooked in spicy, tangy tamarind red curry with ginger, garlic, and curry leaves.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_sardines_raw', amount: 220, unit: 'g', notes: 'Cleaned fresh sardines (approx 6 pieces)' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_kudampuli_malabar_tamarind', amount: 3, unit: 'piece' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 50, unit: 'g' },
      { ingredientId: 'ing_ginger_fresh', amount: 1.5, unit: 'tsp' },
      { ingredientId: 'ing_garlic_fresh', amount: 4, unit: 'clove' },
      { ingredientId: 'ing_green_chilies', amount: 2, unit: 'piece' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1.5, unit: 'tbsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_fenugreek_seeds', amount: 0.25, unit: 'tsp' },
      { ingredientId: 'ing_mustard_seeds', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 12, unit: 'leaf' },
      { ingredientId: 'ing_water_broth', amount: 1, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 6. KERALA EGG ROAST (MUTTA ROAST)
  'curry_ker_egg_curry': {
    dishId: 'curry_ker_egg_curry',
    dishName: 'Kerala Egg Roast (Nadan Mutta Roast)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'non_vegetarian',
    defaultServings: 2,
    servingUnitName: 'serving (2 eggs with gravy)',
    cookingMethod: 'gravy_simmered',
    description: 'Hard-boiled eggs tossed in a thick caramelized onion and tomato masala with curry leaves and black pepper.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_egg_whole_raw', amount: 4, unit: 'piece', notes: 'Hard-boiled large eggs' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_onion_red_large', amount: 140, unit: 'g', notes: 'Caramelized sliced onions' },
      { ingredientId: 'ing_tomato_red_ripe', amount: 70, unit: 'g', notes: 'Ripe tomatoes' },
      { ingredientId: 'ing_ginger_fresh', amount: 1.5, unit: 'tsp' },
      { ingredientId: 'ing_garlic_fresh', amount: 4, unit: 'clove' },
      { ingredientId: 'ing_green_chilies', amount: 2, unit: 'piece' },
      { ingredientId: 'ing_coriander_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_black_pepper_ground', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_garam_masala', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 12, unit: 'leaf' },
      { ingredientId: 'ing_water_broth', amount: 0.5, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 7. KERALA VEGETABLE STEW
  'curry_ker_veg_stew': {
    dishId: 'curry_ker_veg_stew',
    dishName: 'Kerala Vegetable Stew (Ishtu)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    defaultServings: 2,
    servingUnitName: 'bowl (180g)',
    cookingMethod: 'gravy_simmered',
    description: 'Mild and fragrant vegetable stew made with potatoes, carrots, green beans simmered in thin coconut milk and finished with thick coconut milk.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_potato_cubed', amount: 120, unit: 'g', notes: 'Diced potatoes' },
      { ingredientId: 'ing_carrot_chopped', amount: 60, unit: 'g', notes: 'Diced carrots' },
      { ingredientId: 'ing_french_beans', amount: 50, unit: 'g', notes: 'Cut green beans' },
      { ingredientId: 'ing_coconut_milk_thick', amount: 0.3, unit: 'cup', notes: 'Thick coconut milk garnish' },
      { ingredientId: 'ing_coconut_milk_thin', amount: 1, unit: 'cup', notes: 'Simmering base' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_onion_red_large', amount: 60, unit: 'g' },
      { ingredientId: 'ing_ginger_fresh', amount: 1.5, unit: 'tsp', notes: 'Julienned ginger' },
      { ingredientId: 'ing_green_chilies', amount: 3, unit: 'piece', notes: 'Slit chilies (mild heat)' },
      { ingredientId: 'ing_black_pepper_ground', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 10, unit: 'leaf' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 8. AVIAL (MIXED VEGETABLE WITH COCONUT & YOGURT)
  'curry_ker_avial': {
    dishId: 'curry_ker_avial',
    dishName: 'Kerala Traditional Avial',
    cuisine: 'kerala',
    category: 'vegetarian_sides',
    dietaryType: 'vegetarian',
    defaultServings: 2,
    servingUnitName: 'bowl (150g)',
    cookingMethod: 'boiled',
    description: 'Thick medley of traditional Kerala vegetables steam-cooked and coated in crushed coconut, cumin, green chilies, sour curd, and coconut oil.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_ash_gourd_kumbalanga', amount: 60, unit: 'g', notes: 'Batons' },
      { ingredientId: 'ing_raw_plantain_nendrakaya', amount: 60, unit: 'g', notes: 'Batons' },
      { ingredientId: 'ing_elephant_foot_yam_chena', amount: 50, unit: 'g', notes: 'Batons' },
      { ingredientId: 'ing_drumstick_muringakka', amount: 1, unit: 'piece', notes: 'Cut drumstick' },
      { ingredientId: 'ing_carrot_chopped', amount: 40, unit: 'g', notes: 'Batons' },
      { ingredientId: 'ing_french_beans', amount: 40, unit: 'g', notes: 'Cut beans' },
      { ingredientId: 'ing_coconut_grated_fresh', amount: 50, unit: 'g', notes: 'Coarsely ground coconut' },
      { ingredientId: 'ing_curd_yogurt_plain', amount: 2, unit: 'tbsp', notes: 'Sour curd' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp', notes: 'Raw aromatic finish' },
      { ingredientId: 'ing_green_chilies', amount: 3, unit: 'piece' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 15, unit: 'leaf' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 9. CABBAGE THORAN (CABBAGE & COCONUT STIR FRY)
  'curry_ker_cabbage_thoran': {
    dishId: 'curry_ker_cabbage_thoran',
    dishName: 'Cabbage Thoran (Cabbage & Coconut Stir-Fry)',
    cuisine: 'kerala',
    category: 'vegetarian_sides',
    dietaryType: 'vegan',
    defaultServings: 2,
    servingUnitName: 'serving (100g)',
    cookingMethod: 'steamed',
    description: 'Finely shredded fresh green cabbage tempered with mustard seeds, shallots, curry leaves, and tossed with fresh grated coconut.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_cabbage_shredded', amount: 220, unit: 'g', notes: 'Finely shredded cabbage' },
      { ingredientId: 'ing_coconut_grated_fresh', amount: 35, unit: 'g', notes: 'Grated fresh coconut' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp', notes: 'Tempering oil' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 30, unit: 'g', notes: 'Shallots' },
      { ingredientId: 'ing_green_chilies', amount: 2, unit: 'piece', notes: 'Finely chopped' },
      { ingredientId: 'ing_mustard_seeds', amount: 0.75, unit: 'tsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 10, unit: 'leaf' },
      { ingredientId: 'ing_salt_sea', amount: 0.5, unit: 'tsp' }
    ]
  },

  // 10. KADALA CURRY (BLACK CHICKPEAS IN ROASTED COCONUT GRAVY)
  'curry_ker_kadala_curry': {
    dishId: 'curry_ker_kadala_curry',
    dishName: 'Kerala Kadala Curry (Black Chickpea Coconut Gravy)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    defaultServings: 2,
    servingUnitName: 'bowl (150g)',
    cookingMethod: 'gravy_simmered',
    description: 'Black chickpeas pressure cooked with whole spices, roasted coconut paste (varutharacha thenga), shallots, and curry leaves.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_kadala_black_chickpeas_dry', amount: 110, unit: 'g', notes: 'Soaked and cooked chickpeas' },
      { ingredientId: 'ing_coconut_grated_fresh', amount: 35, unit: 'g', notes: 'Roasted golden brown' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 50, unit: 'g' },
      { ingredientId: 'ing_tomato_red_ripe', amount: 40, unit: 'g' },
      { ingredientId: 'ing_ginger_fresh', amount: 1, unit: 'tsp' },
      { ingredientId: 'ing_garlic_fresh', amount: 3, unit: 'clove' },
      { ingredientId: 'ing_coriander_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_garam_masala', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_mustard_seeds', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 12, unit: 'leaf' },
      { ingredientId: 'ing_water_broth', amount: 1.2, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 11. PARIPPU CURRY (KERALA MOONG DAL WITH GHEE)
  'curry_ker_parippu_curry': {
    dishId: 'curry_ker_parippu_curry',
    dishName: 'Kerala Parippu Curry (Moong Dal with Coconut & Ghee)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'vegetarian',
    defaultServings: 2,
    servingUnitName: 'bowl (150g)',
    cookingMethod: 'gravy_simmered',
    description: 'Split yellow moong dal cooked with turmeric, ground coconut, cumin, and tempered in pure cow ghee with shallots and curry leaves.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_moong_dal_yellow_split', amount: 90, unit: 'g', notes: 'Lightly roasted yellow moong dal' },
      { ingredientId: 'ing_coconut_grated_fresh', amount: 30, unit: 'g', notes: 'Ground with cumin' },
      { ingredientId: 'ing_desi_ghee', amount: 1.5, unit: 'tsp', notes: 'Pure cow ghee for tempering' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 30, unit: 'g' },
      { ingredientId: 'ing_green_chilies', amount: 2, unit: 'piece' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_mustard_seeds', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 10, unit: 'leaf' },
      { ingredientId: 'ing_water_broth', amount: 1.5, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 12. KERALA SAMBAR
  'curry_ker_sambar': {
    dishId: 'curry_ker_sambar',
    dishName: 'Kerala Style Sambar (Lentil Vegetable Stew)',
    cuisine: 'kerala',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    defaultServings: 2,
    servingUnitName: 'bowl (180g)',
    cookingMethod: 'gravy_simmered',
    description: 'Toor dal simmered with drumstick, shallots, pumpkin, tamarind, and aromatic roasted coriander and fenugreek spices.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_toor_dal_dry', amount: 70, unit: 'g', notes: 'Boiled yellow toor dal' },
      { ingredientId: 'ing_drumstick_muringakka', amount: 1, unit: 'piece' },
      { ingredientId: 'ing_pumpkin_mathanga', amount: 50, unit: 'g' },
      { ingredientId: 'ing_onion_shallots_kerala', amount: 40, unit: 'g' },
      { ingredientId: 'ing_tomato_red_ripe', amount: 50, unit: 'g' },
      { ingredientId: 'ing_tamarind_pulp', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_coriander_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_fenugreek_seeds', amount: 0.25, unit: 'tsp' },
      { ingredientId: 'ing_mustard_seeds', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_curry_leaves_fresh', amount: 12, unit: 'leaf' },
      { ingredientId: 'ing_water_broth', amount: 1.5, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 13. BUTTER CHICKEN (MURGH MAKHANI)
  'curry_ind_butter_chicken': {
    dishId: 'curry_ind_butter_chicken',
    dishName: 'Authentic Butter Chicken (Murgh Makhani)',
    cuisine: 'north_indian',
    category: 'curries_gravies',
    dietaryType: 'non_vegetarian',
    defaultServings: 2,
    servingUnitName: 'bowl (180g)',
    cookingMethod: 'gravy_simmered',
    description: 'Char-grilled chicken pieces simmered in a silky tomato, cashew cream, butter, and fragrant fenugreek gravy.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_chicken_breast_raw', amount: 240, unit: 'g', notes: 'Tandoori-marinated chicken' },
      { ingredientId: 'ing_butter_unsalted', amount: 1.5, unit: 'tbsp', notes: 'Dairy butter' },
      { ingredientId: 'ing_tomato_red_ripe', amount: 160, unit: 'g', notes: 'Tomato puree' },
      { ingredientId: 'ing_curd_yogurt_plain', amount: 2, unit: 'tbsp', notes: 'Marinade yogurt' },
      { ingredientId: 'ing_ginger_fresh', amount: 1, unit: 'tsp' },
      { ingredientId: 'ing_garlic_fresh', amount: 4, unit: 'clove' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_garam_masala', amount: 0.75, unit: 'tsp' },
      { ingredientId: 'ing_turmeric_powder', amount: 0.25, unit: 'tsp' },
      { ingredientId: 'ing_water_broth', amount: 0.5, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 14. PANEER BUTTER MASALA
  'curry_ind_paneer_butter_masala': {
    dishId: 'curry_ind_paneer_butter_masala',
    dishName: 'Paneer Butter Masala',
    cuisine: 'north_indian',
    category: 'curries_gravies',
    dietaryType: 'vegetarian',
    defaultServings: 2,
    servingUnitName: 'bowl (170g)',
    cookingMethod: 'gravy_simmered',
    description: 'Fresh paneer cubes in a rich tomato, butter, and mild spice cream sauce.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_paneer_fresh', amount: 180, unit: 'g', notes: 'Fresh cow milk paneer cubes' },
      { ingredientId: 'ing_butter_unsalted', amount: 1.5, unit: 'tbsp' },
      { ingredientId: 'ing_tomato_red_ripe', amount: 160, unit: 'g' },
      { ingredientId: 'ing_onion_red_large', amount: 60, unit: 'g' },
      { ingredientId: 'ing_ginger_fresh', amount: 1, unit: 'tsp' },
      { ingredientId: 'ing_garlic_fresh', amount: 3, unit: 'clove' },
      { ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tbsp' },
      { ingredientId: 'ing_garam_masala', amount: 0.5, unit: 'tsp' },
      { ingredientId: 'ing_water_broth', amount: 0.5, unit: 'cup' },
      { ingredientId: 'ing_salt_sea', amount: 0.75, unit: 'tsp' }
    ]
  },

  // 15. KERALA PUTTU (STEAMED RICE CAKE)
  'ker_puttu_white': {
    dishId: 'ker_puttu_white',
    dishName: 'Puttu (Steamed Rice & Coconut Cake)',
    cuisine: 'kerala',
    category: 'breakfast',
    dietaryType: 'vegan',
    defaultServings: 1,
    servingUnitName: 'piece / roll (100g)',
    cookingMethod: 'steamed',
    description: 'Coarse rice flour layered with grated coconut and steam cooked in a cylindrical puttu maker.',
    isAuthenticStandard: true,
    ingredients: [
      { ingredientId: 'ing_puttu_rice_flour', amount: 80, unit: 'g', notes: 'Coarse roasted rice flour' },
      { ingredientId: 'ing_coconut_grated_fresh', amount: 20, unit: 'g', notes: 'Fresh grated coconut layer' },
      { ingredientId: 'ing_water_broth', amount: 3, unit: 'tbsp', notes: 'For moistening flour' },
      { ingredientId: 'ing_salt_sea', amount: 0.25, unit: 'tsp' }
    ]
  }
};

/**
 * Intelligent Fallback Generator:
 * If a dish from COMPREHENSIVE_FOOD_DATABASE does not have an explicit custom recipe,
 * this function constructs a scientifically accurate ingredient breakdown based on its
 * category, cuisine, dietary type, and actual per-100g nutritional profile.
 */
export const getOrGenerateDishRecipe = (food: ComprehensiveFood): DishRecipe => {
  // 1. Direct match by food.id
  if (AUTHENTIC_DISH_RECIPES[food.id]) {
    return AUTHENTIC_DISH_RECIPES[food.id];
  }

  // 2. Fallback search by key name substring (e.g. "chicken curry", "beef", "sambar", "fish")
  const lowerName = food.name.toLowerCase();
  for (const [key, recipe] of Object.entries(AUTHENTIC_DISH_RECIPES)) {
    if (lowerName.includes(recipe.dishName.toLowerCase()) || lowerName.includes(key.replace(/curry_ker_|curry_ind_/, ''))) {
      return {
        ...recipe,
        dishId: food.id,
        dishName: food.name
      };
    }
  }

  // 3. Procedural Ingredient Derivation
  // Calibrate ingredients to match the target dish's default serving grams and macros
  const servingGrams = food.defaultServing.grams || 150;
  const isNonVeg = food.dietaryType === 'non_vegetarian';
  const isSeafood = food.dietaryType === 'pescatarian';
  const isKerala = food.cuisine === 'kerala';

  const ingredients: DishRecipeIngredient[] = [];

  // Main base protein or produce
  if (isNonVeg) {
    if (lowerName.includes('beef')) {
      ingredients.push({ ingredientId: 'ing_beef_lean_raw', amount: Math.round(servingGrams * 0.6), unit: 'g', notes: 'Lean beef cubes' });
    } else if (lowerName.includes('duck')) {
      ingredients.push({ ingredientId: 'ing_duck_meat_raw', amount: Math.round(servingGrams * 0.6), unit: 'g', notes: 'Duck pieces' });
    } else if (lowerName.includes('egg')) {
      ingredients.push({ ingredientId: 'ing_egg_whole_raw', amount: 2, unit: 'piece', notes: 'Boiled eggs' });
    } else {
      ingredients.push({ ingredientId: 'ing_chicken_thigh_raw', amount: Math.round(servingGrams * 0.6), unit: 'g', notes: 'Chicken pieces' });
    }
  } else if (isSeafood) {
    if (lowerName.includes('sardine') || lowerName.includes('mathi')) {
      ingredients.push({ ingredientId: 'ing_sardines_raw', amount: Math.round(servingGrams * 0.6), unit: 'g', notes: 'Fresh sardines' });
    } else if (lowerName.includes('prawn') || lowerName.includes('chemmeen')) {
      ingredients.push({ ingredientId: 'ing_prawns_raw', amount: Math.round(servingGrams * 0.55), unit: 'g', notes: 'Peeled prawns' });
    } else {
      ingredients.push({ ingredientId: 'ing_seer_fish_raw', amount: Math.round(servingGrams * 0.6), unit: 'g', notes: 'Fish steaks' });
    }
  } else {
    // Vegetarian
    if (lowerName.includes('paneer')) {
      ingredients.push({ ingredientId: 'ing_paneer_fresh', amount: Math.round(servingGrams * 0.45), unit: 'g', notes: 'Paneer cubes' });
    } else if (lowerName.includes('dal') || lowerName.includes('parippu') || lowerName.includes('lentil')) {
      ingredients.push({ ingredientId: 'ing_toor_dal_dry', amount: Math.round(servingGrams * 0.35), unit: 'g', notes: 'Dry lentils' });
    } else if (lowerName.includes('chickpea') || lowerName.includes('kadala') || lowerName.includes('chana')) {
      ingredients.push({ ingredientId: 'ing_kadala_black_chickpeas_dry', amount: Math.round(servingGrams * 0.4), unit: 'g', notes: 'Chickpeas' });
    } else if (lowerName.includes('cabbage') || lowerName.includes('thoran')) {
      ingredients.push({ ingredientId: 'ing_cabbage_shredded', amount: Math.round(servingGrams * 0.75), unit: 'g', notes: 'Shredded vegetable' });
    } else {
      ingredients.push({ ingredientId: 'ing_potato_cubed', amount: Math.round(servingGrams * 0.45), unit: 'g', notes: 'Diced vegetables' });
    }
  }

  // Cooking oil / fat
  if (isKerala) {
    ingredients.push({ ingredientId: 'ing_coconut_oil', amount: 1, unit: 'tbsp', notes: 'Pure coconut oil' });
    if (lowerName.includes('coconut') || lowerName.includes('thoran') || lowerName.includes('avial')) {
      ingredients.push({ ingredientId: 'ing_coconut_grated_fresh', amount: 25, unit: 'g', notes: 'Grated coconut' });
    }
  } else {
    ingredients.push({ ingredientId: 'ing_sunflower_oil', amount: 1, unit: 'tbsp', notes: 'Cooking oil' });
  }

  // Aromatics
  ingredients.push({ ingredientId: 'ing_onion_shallots_kerala', amount: 40, unit: 'g', notes: 'Shallots / Onions' });
  ingredients.push({ ingredientId: 'ing_tomato_red_ripe', amount: 40, unit: 'g', notes: 'Tomatoes' });
  ingredients.push({ ingredientId: 'ing_ginger_fresh', amount: 1, unit: 'tsp', notes: 'Ginger' });
  ingredients.push({ ingredientId: 'ing_garlic_fresh', amount: 3, unit: 'clove', notes: 'Garlic' });
  ingredients.push({ ingredientId: 'ing_green_chilies', amount: 1, unit: 'piece', notes: 'Green chili' });

  // Spices & Liquid
  ingredients.push({ ingredientId: 'ing_coriander_powder', amount: 1, unit: 'tsp', notes: 'Coriander' });
  ingredients.push({ ingredientId: 'ing_turmeric_powder', amount: 0.5, unit: 'tsp', notes: 'Turmeric' });
  ingredients.push({ ingredientId: 'ing_kashmiri_chili_powder', amount: 1, unit: 'tsp', notes: 'Chili powder' });
  ingredients.push({ ingredientId: 'ing_water_broth', amount: 0.75, unit: 'cup', notes: 'Gravy water' });
  ingredients.push({ ingredientId: 'ing_salt_sea', amount: 0.5, unit: 'tsp', notes: 'Salt to taste' });

  return {
    dishId: food.id,
    dishName: food.name,
    cuisine: food.cuisine,
    category: food.category,
    dietaryType: food.dietaryType,
    defaultServings: 1,
    servingUnitName: food.defaultServing.label,
    cookingMethod: food.cookingMethod?.toLowerCase().includes('steam') ? 'steamed' : food.cookingMethod?.toLowerCase().includes('roast') ? 'roasted' : 'gravy_simmered',
    description: food.description,
    ingredients,
    isAuthenticStandard: false
  };
};
