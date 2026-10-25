import { ComprehensiveFood } from './types';

export const INDIAN_REGIONAL_FOODS: ComprehensiveFood[] = [
  // ==========================================
  // TAMIL NADU
  // ==========================================
  {
    id: 'tn_ven_pongal',
    name: 'Ven Pongal (Ghee Moong Dal & Rice Porridge)',
    malayalamName: 'വെൺ പൊങ്കൽ',
    manglishName: 'Ven Pongal / Ghee Pongal',
    alternateNames: ['pongal', 'ven pongal', 'ghee pongal', 'khara pongal', 'പൊങ്കൽ'],
    cuisine: 'south_indian',
    region: 'Tamil Nadu',
    category: 'breakfast',
    dietaryType: 'vegetarian',
    description: 'Comforting savory rice and split yellow moong porridge tempered generously in cow ghee with whole black peppercorns, cumin, fresh ginger, and crunchy cashews.',
    per100g: {
      calories: 168,
      protein: 4.8,
      carbs: 23.5,
      fat: 6.4,
      fiber: 2.1,
      sugar: 0.4,
      sodiumMg: 190
    },
    servings: [
      { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy', 'Tree Nuts'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Pressure Cooked & Ghee Tempered'
  },
  {
    id: 'tn_chettinad_chicken',
    name: 'Chettinad Chicken Curry (Spicy Pepper Chicken)',
    malayalamName: 'ചെട്ടിനാട് ചിക്കൻ കറി',
    manglishName: 'Chettinad Chicken Curry',
    alternateNames: ['chettinad chicken', 'tamil chicken curry', 'pepper chicken chettinad', 'ചെട്ടിനാട് ചിക്കൻ'],
    cuisine: 'south_indian',
    region: 'Tamil Nadu',
    category: 'meat_poultry',
    dietaryType: 'non_vegetarian',
    description: 'Fiery chicken curry from Chettinad prepared with freshly stone-ground kalpasi (black stone flower), star anise, fennel seeds, and heavy black pepper.',
    per100g: {
      calories: 182,
      protein: 18.2,
      carbs: 4.2,
      fat: 10.4,
      fiber: 1.2,
      sugar: 0.8,
      sodiumMg: 340
    },
    servings: [
      { label: '1 bowl with 2 chicken pieces (180g)', grams: 180, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 bowl with 2 chicken pieces (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Slow Simmered'
  },
  {
    id: 'tn_kuzhi_paniyaram',
    name: 'Kuzhi Paniyaram (Savory Fermented Dumplings)',
    malayalamName: 'കുഴി പണിയാരം',
    manglishName: 'Kuzhi Paniyaram / Gunta Ponganalu',
    alternateNames: ['paniyaram', 'kuzhi paniyaram', 'paddu', 'appe', 'കുഴി പണിയാരം'],
    cuisine: 'south_indian',
    region: 'Tamil Nadu',
    category: 'breakfast',
    dietaryType: 'vegan',
    description: 'Crispy-crusted, spongy center dumplings made from seasoned fermented idli/dosa batter with sautéed onions, mustard, green chilies, and curry leaves cooked in a special cast iron mould.',
    per100g: {
      calories: 174,
      protein: 4.2,
      carbs: 28.6,
      fat: 4.8,
      fiber: 2.2,
      sugar: 0.8,
      sodiumMg: 160
    },
    servings: [
      { label: '3 pieces (75g)', grams: 75 },
      { label: '6 pieces (150g)', grams: 150, isDefault: true }
    ],
    defaultServing: { label: '6 pieces (150g)', grams: 150, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Pan Mould Griddled'
  },

  // ==========================================
  // KARNATAKA
  // ==========================================
  {
    id: 'kar_bisi_bele_bath',
    name: 'Bisi Bele Bath (Spiced Lentil Rice with Vegetables)',
    malayalamName: 'ബിസി ബെലെ ബാത്ത്',
    manglishName: 'Bisi Bele Bath / Sambar Sadham',
    alternateNames: ['bisi bele bath', 'bisibelebath', 'karnataka sambar rice', 'ബിസി ബെലെ ബാത്ത്'],
    cuisine: 'south_indian',
    region: 'Karnataka',
    category: 'staples_grains',
    dietaryType: 'vegetarian',
    description: 'Classic Mysore dish of short grain rice and toor dal simmered with vegetables, tamarind pulp, dried coconut (kopra), and aromatic roasted spices, finished with ghee.',
    per100g: {
      calories: 148,
      protein: 4.6,
      carbs: 22.8,
      fat: 4.5,
      fiber: 3.2,
      sugar: 1.8,
      sodiumMg: 240
    },
    servings: [
      { label: '1 standard bowl (220g)', grams: 220, isDefault: true },
      { label: '1 large bowl (320g)', grams: 320 }
    ],
    defaultServing: { label: '1 standard bowl (220g)', grams: 220, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy', 'Tree Nuts'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Slow Braised'
  },
  {
    id: 'kar_ragi_mudde',
    name: 'Ragi Mudde (Steamed Finger Millet Balls)',
    malayalamName: 'റാഗി മുദ്ദെ',
    manglishName: 'Ragi Mudde / Ragi Ball',
    alternateNames: ['ragi mudde', 'ragi ball', 'millet dumpling karnataka', 'റാഗി മുദ്ദെ'],
    cuisine: 'south_indian',
    region: 'Karnataka',
    category: 'staples_grains',
    dietaryType: 'vegan',
    description: 'Whole finger millet flour cooked in boiling water and rolled into dense, smooth spherical balls with zero fat. Exceptional calcium, iron, and slow glycemic release for sustained energy.',
    per100g: {
      calories: 128,
      protein: 2.8,
      carbs: 26.5,
      fat: 0.6,
      fiber: 4.2,
      sugar: 0.2,
      sodiumMg: 20
    },
    servings: [
      { label: '1 standard ball (150g)', grams: 150, isDefault: true },
      { label: '1 large ball (220g)', grams: 220 }
    ],
    defaultServing: { label: '1 standard ball (150g)', grams: 150, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Boiled & Rolled'
  },
  {
    id: 'kar_neer_dosa',
    name: 'Neer Dosa (Delicate Mangalore Rice Crepes)',
    malayalamName: 'നീർ ദോശ',
    manglishName: 'Neer Dosa / Mangalore Dosa',
    alternateNames: ['neer dosa', 'water dosa', 'mangalore dosa', 'നീർ ദോശ'],
    cuisine: 'south_indian',
    region: 'Karnataka / Mangalore',
    category: 'breakfast',
    dietaryType: 'vegan',
    description: 'Paper-thin, lacy, non-fermented crepes made from fine ground rice and water batter. Light, gluten-free, and practically fat-free.',
    per100g: {
      calories: 142,
      protein: 2.4,
      carbs: 30.2,
      fat: 1.2,
      fiber: 0.9,
      sugar: 0.2,
      sodiumMg: 45
    },
    servings: [
      { label: '2 dosas (80g)', grams: 80 },
      { label: '3 dosas (120g)', grams: 120, isDefault: true },
      { label: '4 dosas (160g)', grams: 160 }
    ],
    defaultServing: { label: '3 dosas (120g)', grams: 120, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Tawa Pan Griddled'
  },
  {
    id: 'kar_mangalore_fish_curry',
    name: 'Mangalore Meen Gassi (Spiced Coconut Fish Curry)',
    malayalamName: 'മംഗലാപുരം മീൻ ഗസ്സി',
    manglishName: 'Mangalore Fish Curry / Meen Gassi',
    alternateNames: ['mangalore fish curry', 'meen gassi', 'karnataka fish curry', 'മംഗലാപുരം മീൻ കറി'],
    cuisine: 'south_indian',
    region: 'Karnataka / Mangalore',
    category: 'seafood',
    dietaryType: 'pescatarian',
    description: 'Tangy and piquant coastal fish curry cooked with Byadagi red chilies, coriander, tamarind, and rich freshly pressed coconut milk.',
    per100g: {
      calories: 145,
      protein: 14.8,
      carbs: 3.2,
      fat: 8.2,
      fiber: 0.8,
      sugar: 0.6,
      sodiumMg: 290
    },
    servings: [
      { label: '1 piece with gravy (140g)', grams: 140, isDefault: true },
      { label: '2 pieces with gravy (220g)', grams: 220 }
    ],
    defaultServing: { label: '1 piece with gravy (140g)', grams: 140, isDefault: true },
    budgetFriendly: true,
    allergens: ['Fish', 'Coconut'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Simmered in coconut milk'
  },

  // ==========================================
  // ANDHRA PRADESH & TELANGANA
  // ==========================================
  {
    id: 'and_hyderabadi_biryani',
    name: 'Hyderabadi Chicken Dum Biryani',
    malayalamName: 'ഹൈദരാബാദി ചിക്കൻ ബിരിയാണി',
    manglishName: 'Hyderabadi Biryani / Kachay Gosht Ki Biryani',
    alternateNames: ['hyderabadi biryani', 'hyderabadi chicken biryani', 'kacchi biryani', 'ഹൈദരാബാദി ബിരിയാണി'],
    cuisine: 'south_indian',
    region: 'Telangana / Hyderabad',
    category: 'staples_grains',
    dietaryType: 'non_vegetarian',
    description: 'Aromatic long-grain basmati rice layered with raw marinated chicken, yogurt, fried onions (birista), saffron, mint, and slow-cooked sealed under steam (dum).',
    per100g: {
      calories: 205,
      protein: 11.2,
      carbs: 24.5,
      fat: 7.2,
      fiber: 1.2,
      sugar: 1.0,
      sodiumMg: 350
    },
    servings: [
      { label: '1 standard plate (350g)', grams: 350, isDefault: true },
      { label: '1 heavy serving (450g)', grams: 450 }
    ],
    defaultServing: { label: '1 standard plate (350g)', grams: 350, isDefault: true },
    budgetFriendly: false,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017 & Culinary Standard',
    cookingMethod: 'Dum Cooked'
  },
  {
    id: 'and_pesarattu',
    name: 'Andhra Pesarattu (Whole Green Moong Dal Crepe)',
    malayalamName: 'പെസരട്ട്',
    manglishName: 'Pesarattu / Moong Dal Dosa',
    alternateNames: ['pesarattu', 'andhra pesarattu', 'moong dal dosa', 'green gram dosa', 'പെസരട്ട്'],
    cuisine: 'south_indian',
    region: 'Andhra Pradesh',
    category: 'breakfast',
    dietaryType: 'vegan',
    description: 'Nutritious unfermented crepe prepared by grinding soaked whole green moong beans with ginger, green chilies, and cumin. High in protein, low glycemic index.',
    per100g: {
      calories: 168,
      protein: 7.8,
      carbs: 26.2,
      fat: 3.8,
      fiber: 4.8,
      sugar: 0.5,
      sodiumMg: 140
    },
    servings: [
      { label: '1 pesarattu (70g)', grams: 70 },
      { label: '2 pesarattus (140g)', grams: 140, isDefault: true }
    ],
    defaultServing: { label: '2 pesarattus (140g)', grams: 140, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Tawa Pan Griddled'
  },
  {
    id: 'and_gutti_vankaya',
    name: 'Gutti Vankaya Kura (Stuffed Brinjal / Eggplant Curry)',
    malayalamName: 'ഗുട്ടി വങ്കായ കൂര',
    manglishName: 'Gutti Vankaya / Stuffed Eggplant Curry',
    alternateNames: ['gutti vankaya', 'stuffed brinjal curry', 'andhra eggplant curry', 'ഗുട്ടി വങ്കായ'],
    cuisine: 'south_indian',
    region: 'Andhra Pradesh',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    description: 'Tender baby eggplants slit crosswise, stuffed with roasted sesame, roasted peanuts, dry coconut, and coriander spice paste, and slow-cooked in tangy gravy.',
    per100g: {
      calories: 132,
      protein: 3.5,
      carbs: 10.2,
      fat: 8.8,
      fiber: 4.2,
      sugar: 3.1,
      sodiumMg: 260
    },
    servings: [
      { label: '1 medium bowl with 2 eggplants (150g)', grams: 150, isDefault: true }
    ],
    defaultServing: { label: '1 medium bowl with 2 eggplants (150g)', grams: 150, isDefault: true },
    budgetFriendly: true,
    allergens: ['Peanuts', 'Sesame'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Simmered'
  },

  // ==========================================
  // MAHARASHTRA & GUJARAT
  // ==========================================
  {
    id: 'mah_kanda_poha',
    name: 'Kanda Poha (Maharashtrian Flattened Rice with Peanuts)',
    malayalamName: 'കന്ദ പോഹ',
    manglishName: 'Kanda Poha / Onion Poha',
    alternateNames: ['poha', 'kanda poha', 'maharashtrian poha', 'flattened rice poha', 'പോഹ'],
    cuisine: 'pan_indian',
    region: 'Maharashtra',
    category: 'breakfast',
    dietaryType: 'vegan',
    description: 'Thick beaten rice flattened flakes rinsed and tossed with sautéed sliced onions, turmeric, crunchy roasted peanuts, mustard seeds, and fresh lemon juice.',
    per100g: {
      calories: 162,
      protein: 3.8,
      carbs: 27.5,
      fat: 4.2,
      fiber: 2.8,
      sugar: 1.4,
      sodiumMg: 180
    },
    servings: [
      { label: '1 medium bowl (150g)', grams: 150, isDefault: true },
      { label: '1 large bowl (220g)', grams: 220 }
    ],
    defaultServing: { label: '1 medium bowl (150g)', grams: 150, isDefault: true },
    budgetFriendly: true,
    allergens: ['Peanuts'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Sautéed'
  },
  {
    id: 'mah_misal_pav',
    name: 'Misal Pav (Sprouted Moth Bean Curry with Pav Bread)',
    malayalamName: 'മിസൽ പാവ്',
    manglishName: 'Misal Pav / Sprouted Beans Misal',
    alternateNames: ['misal pav', 'kolhapuri misal', 'sprouted moth bean curry', 'മിസൽ പാവ്'],
    cuisine: 'pan_indian',
    region: 'Maharashtra',
    category: 'breakfast',
    dietaryType: 'vegan',
    description: 'Nutritious sprouted matki (moth beans) cooked in a fiery red spiced broth (tarri/rassa), topped with crunchy farsan mix, raw onions, lemon, and served with pav bread.',
    per100g: {
      calories: 152,
      protein: 5.8,
      carbs: 21.0,
      fat: 5.2,
      fiber: 4.1,
      sugar: 1.8,
      sodiumMg: 340
    },
    servings: [
      { label: '1 bowl misal with 2 pavs (300g total)', grams: 300, isDefault: true }
    ],
    defaultServing: { label: '1 bowl misal with 2 pavs (300g total)', grams: 300, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Sprouted & Boiled'
  },
  {
    id: 'mah_pav_bhaji',
    name: 'Mumbai Pav Bhaji (Mashed Spiced Vegetable Curry with Buttered Pav)',
    malayalamName: 'പാവ് ഭാജി',
    manglishName: 'Pav Bhaji / Mumbai Pav Bhaji',
    alternateNames: ['pav bhaji', 'mumbai pav bhaji', 'mashed vegetable curry', 'പാവ് ഭാജി'],
    cuisine: 'pan_indian',
    region: 'Maharashtra / Mumbai',
    category: 'snacks_streetfood',
    dietaryType: 'vegetarian',
    description: 'Spicy mash of potatoes, cauliflower, tomatoes, green peas, and capsicum simmered with butter and pav bhaji masala on a flat tawa, served with warm butter-toasted pav buns.',
    per100g: {
      calories: 165,
      protein: 3.6,
      carbs: 23.2,
      fat: 6.4,
      fiber: 3.1,
      sugar: 2.8,
      sodiumMg: 380
    },
    servings: [
      { label: '1 plate bhaji with 2 butter pavs (320g)', grams: 320, isDefault: true }
    ],
    defaultServing: { label: '1 plate bhaji with 2 butter pavs (320g)', grams: 320, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy', 'Gluten'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017 & Culinary Standard',
    cookingMethod: 'Tawa Mashed & Toasted'
  },
  {
    id: 'guj_khaman_dhokla',
    name: 'Khaman Dhokla (Steamed Gram Flour Savory Sponge Cake)',
    malayalamName: 'ഖമൻ ധോക്ല',
    manglishName: 'Khaman Dhokla / Dhokla',
    alternateNames: ['dhokla', 'khaman dhokla', 'steamed dhokla', 'gujarati dhokla', 'ധോക്ല'],
    cuisine: 'pan_indian',
    region: 'Gujarat',
    category: 'snacks_streetfood',
    dietaryType: 'vegan',
    description: 'Fluffy, juicy yellow steamed savory snack cake made from fermented chickpea/besan batter, tempered with mustard seeds, green chilies, and coriander. Low in oil and easy to digest.',
    per100g: {
      calories: 148,
      protein: 6.2,
      carbs: 23.5,
      fat: 3.4,
      fiber: 3.2,
      sugar: 4.2,
      sodiumMg: 280
    },
    servings: [
      { label: '2 pieces (80g)', grams: 80 },
      { label: '4 pieces (160g)', grams: 160, isDefault: true }
    ],
    defaultServing: { label: '4 pieces (160g)', grams: 160, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Steamed'
  },
  {
    id: 'guj_methi_thepla',
    name: 'Methi Thepla (Spiced Fenugreek Whole Wheat Flatbread)',
    malayalamName: 'മേത്തി തെപ്ല',
    manglishName: 'Methi Thepla / Gujarati Thepla',
    alternateNames: ['thepla', 'methi thepla', 'gujarati thepla', 'fenugreek flatbread', 'തെപ്ല'],
    cuisine: 'pan_indian',
    region: 'Gujarat',
    category: 'breakfast',
    dietaryType: 'vegan',
    description: 'Thin flatbread prepared with whole wheat flour, gram flour, chopped fresh fenugreek (methi) leaves, yogurt, sesame seeds, and mild spices. Excellent travel and fiber food.',
    per100g: {
      calories: 268,
      protein: 7.8,
      carbs: 42.6,
      fat: 7.8,
      fiber: 6.4,
      sugar: 1.2,
      sodiumMg: 220
    },
    servings: [
      { label: '1 thepla (45g)', grams: 45 },
      { label: '2 theplas (90g)', grams: 90, isDefault: true },
      { label: '3 theplas (135g)', grams: 135 }
    ],
    defaultServing: { label: '2 theplas (90g)', grams: 90, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten', 'Sesame'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Tawa Pan Griddled'
  },

  // ==========================================
  // PUNJAB & NORTH INDIA
  // ==========================================
  {
    id: 'pun_paneer_butter_masala',
    name: 'Paneer Butter Masala (Rich Cottage Cheese Curry)',
    malayalamName: 'പനീർ ബട്ടർ മസാല',
    manglishName: 'Paneer Butter Masala / Paneer Makhani',
    alternateNames: ['paneer butter masala', 'paneer makhani', 'cottage cheese butter masala', 'പനീർ ബട്ടർ മസാല'],
    cuisine: 'north_indian',
    region: 'Punjab / North India',
    category: 'curries_gravies',
    dietaryType: 'vegetarian',
    description: 'Fresh Indian cottage cheese (paneer) cubes simmered in a velvety sauce of pureed tomatoes, cashews, butter, and cream with aromatic kasuri methi.',
    per100g: {
      calories: 235,
      protein: 9.8,
      carbs: 6.8,
      fat: 19.2,
      fiber: 1.4,
      sugar: 3.8,
      sodiumMg: 360
    },
    servings: [
      { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
      { label: '1 large restaurant bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
    budgetFriendly: false,
    allergens: ['Dairy', 'Tree Nuts'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017 & Culinary Standard',
    cookingMethod: 'Simmered with butter and cream'
  },
  {
    id: 'pun_butter_chicken',
    name: 'Murgh Makhani (Butter Chicken)',
    malayalamName: 'ബട്ടർ ചിക്കൻ',
    manglishName: 'Butter Chicken / Murgh Makhani',
    alternateNames: ['butter chicken', 'murgh makhani', 'punjabi butter chicken', 'ബട്ടർ ചിക്കൻ'],
    cuisine: 'north_indian',
    region: 'Punjab / Delhi',
    category: 'meat_poultry',
    dietaryType: 'non_vegetarian',
    description: 'Marinated tandoori chicken pieces cooked in a creamy tomato-butter-cashew gravy scented with dried fenugreek leaves and cardamom.',
    per100g: {
      calories: 228,
      protein: 16.5,
      carbs: 5.6,
      fat: 15.8,
      fiber: 1.1,
      sugar: 3.4,
      sodiumMg: 380
    },
    servings: [
      { label: '1 standard bowl with chicken (200g)', grams: 200, isDefault: true },
      { label: '1 large bowl (280g)', grams: 280 }
    ],
    defaultServing: { label: '1 standard bowl with chicken (200g)', grams: 200, isDefault: true },
    budgetFriendly: false,
    allergens: ['Dairy', 'Tree Nuts'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017 & Culinary Standard',
    cookingMethod: 'Tandoor grilled & Gravy simmered'
  },
  {
    id: 'pun_tandoori_chicken',
    name: 'Tandoori Chicken (Char-Grilled Yogurt Spiced Chicken)',
    malayalamName: 'തന്തൂരി ചിക്കൻ',
    manglishName: 'Tandoori Chicken',
    alternateNames: ['tandoori chicken', 'charcoal grilled chicken', 'tandoori murgh', 'തന്തൂരി ചിക്കൻ'],
    cuisine: 'north_indian',
    region: 'Punjab',
    category: 'meat_poultry',
    dietaryType: 'non_vegetarian',
    description: 'Skinless chicken legs and breasts scored and marinated in hung curd, Kashmiri chili, ginger-garlic paste, and roasted cumin, charred in a clay tandoor. Peak lean high-protein fitness food.',
    per100g: {
      calories: 186,
      protein: 26.5,
      carbs: 1.8,
      fat: 7.8,
      fiber: 0.4,
      sugar: 0.6,
      sodiumMg: 340
    },
    servings: [
      { label: '1 tandoori leg piece (120g edible meat)', grams: 120 },
      { label: '1/2 tandoori chicken (220g meat)', grams: 220, isDefault: true },
      { label: '1 tandoori breast piece (150g)', grams: 150 }
    ],
    defaultServing: { label: '1/2 tandoori chicken (220g meat)', grams: 220, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Clay Tandoor Grilled'
  },
  {
    id: 'pun_dal_makhani',
    name: 'Dal Makhani (Slow-Cooked Black Lentils & Kidney Beans)',
    malayalamName: 'ദാൽ മഖാനി',
    manglishName: 'Dal Makhani',
    alternateNames: ['dal makhani', 'black dal', 'maa ki dal', 'punjabi dal makhani', 'ദാൽ മഖാനി'],
    cuisine: 'north_indian',
    region: 'Punjab',
    category: 'curries_gravies',
    dietaryType: 'vegetarian',
    description: 'Whole black urad dal and rajma slow-simmered overnight on charcoal with butter, cream, and tomato puree until velvety rich.',
    per100g: {
      calories: 168,
      protein: 6.4,
      carbs: 16.5,
      fat: 8.8,
      fiber: 4.8,
      sugar: 1.8,
      sodiumMg: 310
    },
    servings: [
      { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Slow Simmered'
  },
  {
    id: 'pun_rajma_chawal',
    name: 'Rajma Masala (Red Kidney Beans Curry)',
    malayalamName: 'രാജ്മ മസാല',
    manglishName: 'Rajma Masala / Rajma Chawal',
    alternateNames: ['rajma', 'rajma masala', 'red kidney bean curry', 'rajma chawal', 'രാജ്മ'],
    cuisine: 'north_indian',
    region: 'Punjab / Jammu',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    description: 'Red kidney beans cooked until meltingly tender in thick onion, tomato, ginger, garlic, and garam masala gravy. Supreme plant protein and soluble fiber.',
    per100g: {
      calories: 135,
      protein: 7.2,
      carbs: 19.8,
      fat: 3.1,
      fiber: 6.4,
      sugar: 1.6,
      sodiumMg: 280
    },
    servings: [
      { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 medium bowl (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Pressure Cooked & Simmered'
  },
  {
    id: 'pun_chole_bhature',
    name: 'Amritsari Chole (Spiced White Chickpea Curry)',
    malayalamName: 'ഛോലെ / കടല കറി നോർത്ത്',
    manglishName: 'Chole Masala / Chhole',
    alternateNames: ['chole', 'chana masala', 'amritsari chole', 'punjabi chole', 'ഛോലെ'],
    cuisine: 'north_indian',
    region: 'Punjab',
    category: 'curries_gravies',
    dietaryType: 'vegan',
    description: 'Kabuli chickpeas brewed with dried anardana (pomegranate seeds) and black tea leaves for deep dark color and tangy robust flavor.',
    per100g: {
      calories: 146,
      protein: 7.5,
      carbs: 21.0,
      fat: 3.8,
      fiber: 5.8,
      sugar: 2.1,
      sodiumMg: 310
    },
    servings: [
      { label: '1 bowl (180g)', grams: 180, isDefault: true },
      { label: '1 large bowl (250g)', grams: 250 }
    ],
    defaultServing: { label: '1 bowl (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: [],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Pressure Cooked & Braised'
  },
  {
    id: 'pun_sarson_saag',
    name: 'Sarson Ka Saag (Mustard Greens & Spinach Puree)',
    malayalamName: 'സർസോം കാ സാഗ്',
    manglishName: 'Sarson Ka Saag / Mustard Greens',
    alternateNames: ['sarson ka saag', 'mustard greens saag', 'punjabi saag', 'സാ​ഗ്'],
    cuisine: 'north_indian',
    region: 'Punjab',
    category: 'vegetarian_sides',
    dietaryType: 'vegetarian',
    description: 'Slow-cooked fresh mustard leaves, spinach, and bathua pureed with maize flour (makki atta) and tempered with ginger, garlic, green chilies, and white butter.',
    per100g: {
      calories: 95,
      protein: 3.4,
      carbs: 7.8,
      fat: 5.5,
      fiber: 4.5,
      sugar: 1.2,
      sodiumMg: 190
    },
    servings: [
      { label: '1 bowl (180g)', grams: 180, isDefault: true }
    ],
    defaultServing: { label: '1 bowl (180g)', grams: 180, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Slow Braised & Pureed'
  },
  {
    id: 'pun_aloo_paratha',
    name: 'Punjabi Aloo Paratha (Whole Wheat Bread with Spiced Potato Filling)',
    malayalamName: 'ആലു പറാത്ത',
    manglishName: 'Aloo Paratha',
    alternateNames: ['aloo paratha', 'potato paratha', 'stuffed aloo paratha', 'ആലു പറാത്ത'],
    cuisine: 'north_indian',
    region: 'Punjab',
    category: 'staples_grains',
    dietaryType: 'vegetarian',
    description: 'Whole wheat flatbread rolled with a spiced mashed potato, green chili, cilantro, and amchur filling, cooked golden on tawa with a touch of ghee/butter.',
    per100g: {
      calories: 252,
      protein: 5.5,
      carbs: 39.5,
      fat: 8.2,
      fiber: 4.8,
      sugar: 1.4,
      sodiumMg: 280
    },
    servings: [
      { label: '1 paratha (120g)', grams: 120, isDefault: true },
      { label: '2 parathas (240g)', grams: 240 }
    ],
    defaultServing: { label: '1 paratha (120g)', grams: 120, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten', 'Dairy'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Tawa Pan Griddled'
  },

  // ==========================================
  // BENGAL & EAST / NORTHEAST
  // ==========================================
  {
    id: 'ben_macher_jhol',
    name: 'Bengali Macher Jhol (Light Rohu Fish Curry with Potatoes)',
    malayalamName: 'മാച്ചർ ഝോൽ',
    manglishName: 'Macher Jhol / Bengali Fish Curry',
    alternateNames: ['macher jhol', 'bengali fish curry', 'rohu fish curry', 'മാച്ചർ ഝോൽ'],
    cuisine: 'pan_indian',
    region: 'Bengal',
    category: 'seafood',
    dietaryType: 'pescatarian',
    description: 'Traditional light, aromatic fresh freshwater carp (Rohu/Katla) curry prepared with potato wedges, green chilies, turmeric, cumin, and panch phoron in mustard oil.',
    per100g: {
      calories: 125,
      protein: 15.2,
      carbs: 4.8,
      fat: 5.2,
      fiber: 0.9,
      sugar: 0.6,
      sodiumMg: 240
    },
    servings: [
      { label: '1 piece with potato & broth (160g)', grams: 160, isDefault: true },
      { label: '2 pieces with broth (240g)', grams: 240 }
    ],
    defaultServing: { label: '1 piece with potato & broth (160g)', grams: 160, isDefault: true },
    budgetFriendly: true,
    allergens: ['Fish', 'Mustard'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Simmered in mustard oil'
  },
  {
    id: 'ben_kosha_mangsho',
    name: 'Kosha Mangsho (Bengali Slow-Braised Mutton Curry)',
    malayalamName: 'കോഷ മാംശോ',
    manglishName: 'Kosha Mangsho / Bengali Mutton',
    alternateNames: ['kosha mangsho', 'bengali mutton curry', 'spicy mutton kosha', 'കോഷ മാംശോ'],
    cuisine: 'pan_indian',
    region: 'Bengal',
    category: 'meat_poultry',
    dietaryType: 'non_vegetarian',
    description: 'Goat mutton slow-cooked patiently in mustard oil with caramelized onions, yogurt, and whole garam masala until the thick dark gravy clings intensely to the tender meat.',
    per100g: {
      calories: 248,
      protein: 21.5,
      carbs: 4.2,
      fat: 16.2,
      fiber: 0.8,
      sugar: 1.5,
      sodiumMg: 350
    },
    servings: [
      { label: '1 serving (150g)', grams: 150, isDefault: true },
      { label: '1 large serving (220g)', grams: 220 }
    ],
    defaultServing: { label: '1 serving (150g)', grams: 150, isDefault: true },
    budgetFriendly: false,
    allergens: ['Dairy', 'Mustard'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017 & Culinary Standard',
    cookingMethod: 'Slow Braised'
  },
  {
    id: 'ben_mishti_doi',
    name: 'Bengali Mishti Doi (Sweetened Fermented Baked Yogurt)',
    malayalamName: 'മിഷ്ടി ദോയ്',
    manglishName: 'Mishti Doi / Sweet Curd',
    alternateNames: ['mishti doi', 'sweet curd bengal', 'bengali sweet yogurt', 'മിഷ്ടി ദോയ്'],
    cuisine: 'pan_indian',
    region: 'Bengal',
    category: 'desserts',
    dietaryType: 'vegetarian',
    description: 'Thick creamy fermented yogurt sweetened with caramelized palm jaggery (nolen gur) or caramelized sugar, traditionally set in earthen clay pots.',
    per100g: {
      calories: 148,
      protein: 4.5,
      carbs: 21.0,
      fat: 5.2,
      fiber: 0.0,
      sugar: 19.5,
      sodiumMg: 65
    },
    servings: [
      { label: '1 small clay pot / cup (100g)', grams: 100, isDefault: true },
      { label: '1 large bowl (180g)', grams: 180 }
    ],
    defaultServing: { label: '1 small clay pot / cup (100g)', grams: 100, isDefault: true },
    budgetFriendly: true,
    allergens: ['Dairy'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017',
    cookingMethod: 'Claypot Fermented'
  },
  {
    id: 'ne_chicken_momos',
    name: 'Steamed Chicken Momos (Northeast Dumplings)',
    malayalamName: 'സ്റ്റീംഡ് ചിക്കൻ മോമോസ്',
    manglishName: 'Chicken Momos / Dim Sum',
    alternateNames: ['momos', 'chicken momos', 'steamed momos', 'northeast dumplings', 'മോമോസ്'],
    cuisine: 'pan_indian',
    region: 'Northeast India / Sikkim',
    category: 'snacks_streetfood',
    dietaryType: 'non_vegetarian',
    description: 'Thin wheat wrappers folded neatly around juicy minced chicken with spring onions, garlic, and ginger, steamed until tender and served with red chili garlic chutney.',
    per100g: {
      calories: 168,
      protein: 11.2,
      carbs: 20.8,
      fat: 4.4,
      fiber: 1.2,
      sugar: 0.8,
      sodiumMg: 280
    },
    servings: [
      { label: '5 pieces (125g)', grams: 125 },
      { label: '8 pieces (200g)', grams: 200, isDefault: true }
    ],
    defaultServing: { label: '8 pieces (200g)', grams: 200, isDefault: true },
    budgetFriendly: true,
    allergens: ['Gluten'],
    verificationStatus: 'verified',
    dataSource: 'ICMR-NIN IFCT 2017 & Culinary Standard',
    cookingMethod: 'Steamed'
  }
];
