import { PresetFood, ExerciseDefinition, DayWorkout } from '../types';

export const FOOD_DATABASE: PresetFood[] = [
  // PROTEINS
  {
    name: 'Grilled Chicken Breast',
    category: 'Protein',
    defaultPortion: '150g cooked',
    grams: 150,
    calories: 247,
    protein: 46.5,
    carbs: 0,
    fat: 5.4,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'keto', 'paleo'],
    allergens: []
  },
  {
    name: 'Canned Tuna in Water',
    category: 'Protein',
    defaultPortion: '1 can (130g drained)',
    grams: 130,
    calories: 150,
    protein: 33,
    carbs: 0,
    fat: 1.5,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'pescatarian', 'keto', 'paleo'],
    allergens: ['Fish']
  },
  {
    name: 'Whole Large Eggs (2 eggs)',
    category: 'Protein',
    defaultPortion: '2 large eggs (100g)',
    grams: 100,
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    fat: 9.5,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'pescatarian', 'keto', 'paleo'],
    allergens: ['Eggs']
  },
  {
    name: 'Egg Whites (Liquid/Cooked)',
    category: 'Protein',
    defaultPortion: '150g',
    grams: 150,
    calories: 78,
    protein: 16.5,
    carbs: 1.1,
    fat: 0.2,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'pescatarian', 'keto'],
    allergens: ['Eggs']
  },
  {
    name: 'Atlantic Salmon Fillet',
    category: 'Protein',
    defaultPortion: '150g cooked',
    grams: 150,
    calories: 312,
    protein: 34,
    carbs: 0,
    fat: 18.5,
    fiber: 0,
    budgetFriendly: false,
    suitableDiets: ['omnivore', 'pescatarian', 'keto', 'paleo'],
    allergens: ['Fish']
  },
  {
    name: 'Extra Firm Tofu',
    category: 'Protein',
    defaultPortion: '150g raw',
    grams: 150,
    calories: 144,
    protein: 15.2,
    carbs: 3.5,
    fat: 8.6,
    fiber: 2.3,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['Soy']
  },
  {
    name: 'Cooked Brown Lentils',
    category: 'Protein',
    defaultPortion: '1 cup cooked (200g)',
    grams: 200,
    calories: 230,
    protein: 17.9,
    carbs: 39.8,
    fat: 0.8,
    fiber: 15.6,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: []
  },
  {
    name: 'Black Beans (Boiled/Canned)',
    category: 'Protein',
    defaultPortion: '1 cup cooked (170g)',
    grams: 170,
    calories: 227,
    protein: 15.2,
    carbs: 40.8,
    fat: 0.9,
    fiber: 15.0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: []
  },
  {
    name: 'Lean Ground Beef (93/7)',
    category: 'Protein',
    defaultPortion: '150g cooked',
    grams: 150,
    calories: 255,
    protein: 39.0,
    carbs: 0,
    fat: 10.5,
    fiber: 0,
    budgetFriendly: false,
    suitableDiets: ['omnivore', 'keto', 'paleo'],
    allergens: []
  },
  {
    name: 'Whey Protein Isolate',
    category: 'Protein',
    defaultPortion: '1 scoop (30g)',
    grams: 30,
    calories: 115,
    protein: 26.0,
    carbs: 1.0,
    fat: 0.5,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'pescatarian', 'keto'],
    allergens: ['Dairy / Whey']
  },
  {
    name: 'Plant Protein Powder (Pea & Rice)',
    category: 'Protein',
    defaultPortion: '1 scoop (32g)',
    grams: 32,
    calories: 120,
    protein: 24.0,
    carbs: 2.0,
    fat: 1.5,
    fiber: 1.5,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: []
  },

  // DAIRY & ALTERNATIVES
  {
    name: 'Plain Non-Fat Greek Yogurt',
    category: 'Dairy / Alternative',
    defaultPortion: '200g (approx 3/4 cup)',
    grams: 200,
    calories: 118,
    protein: 20.6,
    carbs: 7.2,
    fat: 0.8,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'pescatarian', 'keto'],
    allergens: ['Dairy']
  },
  {
    name: 'Low-Fat Cottage Cheese (2%)',
    category: 'Dairy / Alternative',
    defaultPortion: '150g (approx 1/2 cup)',
    grams: 150,
    calories: 129,
    protein: 18.2,
    carbs: 6.8,
    fat: 3.5,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'pescatarian', 'keto'],
    allergens: ['Dairy']
  },
  {
    name: 'Unsweetened Almond Milk',
    category: 'Dairy / Alternative',
    defaultPortion: '1 cup (240ml)',
    grams: 240,
    calories: 30,
    protein: 1.0,
    carbs: 1.0,
    fat: 2.5,
    fiber: 1.0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: ['Tree Nuts']
  },
  {
    name: 'Soy Milk (Unsweetened)',
    category: 'Dairy / Alternative',
    defaultPortion: '1 cup (240ml)',
    grams: 240,
    calories: 80,
    protein: 7.0,
    carbs: 4.0,
    fat: 4.0,
    fiber: 1.0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['Soy']
  },

  // COMPLEX CARBS
  {
    name: 'Rolled Oats (Dry)',
    category: 'Carb',
    defaultPortion: '1/2 cup dry (50g)',
    grams: 50,
    calories: 190,
    protein: 6.5,
    carbs: 34.0,
    fat: 3.0,
    fiber: 5.0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['Gluten (unless certified GF)']
  },
  {
    name: 'Cooked Brown Rice',
    category: 'Carb',
    defaultPortion: '1 cup cooked (195g)',
    grams: 195,
    calories: 218,
    protein: 4.5,
    carbs: 45.8,
    fat: 1.6,
    fiber: 3.5,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: []
  },
  {
    name: 'Baked Sweet Potato',
    category: 'Carb',
    defaultPortion: '1 medium (150g)',
    grams: 150,
    calories: 135,
    protein: 3.0,
    carbs: 31.0,
    fat: 0.2,
    fiber: 4.5,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'paleo'],
    allergens: []
  },
  {
    name: 'Cooked Quinoa',
    category: 'Carb',
    defaultPortion: '1 cup cooked (185g)',
    grams: 185,
    calories: 222,
    protein: 8.1,
    carbs: 39.4,
    fat: 3.6,
    fiber: 5.2,
    budgetFriendly: false,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: []
  },
  {
    name: 'Whole Grain Sourdough / Bread',
    category: 'Carb',
    defaultPortion: '1 slice (45g)',
    grams: 45,
    calories: 110,
    protein: 4.5,
    carbs: 21.0,
    fat: 1.2,
    fiber: 3.0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['Gluten']
  },

  // HEALTHY FATS
  {
    name: 'Extra Virgin Olive Oil',
    category: 'Fat',
    defaultPortion: '1 tbsp (14g)',
    grams: 14,
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 13.5,
    fiber: 0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: []
  },
  {
    name: 'Raw Almonds',
    category: 'Fat',
    defaultPortion: '1 oz / 28g (approx 23 nuts)',
    grams: 28,
    calories: 164,
    protein: 6.0,
    carbs: 6.1,
    fat: 14.2,
    fiber: 3.5,
    budgetFriendly: false,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: ['Tree Nuts']
  },
  {
    name: 'Natural Peanut Butter',
    category: 'Fat',
    defaultPortion: '2 tbsp (32g)',
    grams: 32,
    calories: 190,
    protein: 8.0,
    carbs: 7.0,
    fat: 16.0,
    fiber: 2.0,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
    allergens: ['Peanuts']
  },
  {
    name: 'Hass Avocado',
    category: 'Fat',
    defaultPortion: '1/2 medium avocado (75g)',
    grams: 75,
    calories: 120,
    protein: 1.5,
    carbs: 6.4,
    fat: 11.0,
    fiber: 5.0,
    budgetFriendly: false,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: []
  },
  {
    name: 'Chia Seeds',
    category: 'Fat',
    defaultPortion: '1 tbsp (12g)',
    grams: 12,
    calories: 58,
    protein: 2.0,
    carbs: 5.0,
    fat: 3.7,
    fiber: 4.1,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: []
  },

  // PRODUCE (FIBER & MICRONUTRIENTS)
  {
    name: 'Fresh Steamed Broccoli',
    category: 'Produce',
    defaultPortion: '1 cup chopped (90g)',
    grams: 90,
    calories: 31,
    protein: 2.6,
    carbs: 6.0,
    fat: 0.3,
    fiber: 2.4,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: []
  },
  {
    name: 'Baby Spinach (Raw)',
    category: 'Produce',
    defaultPortion: '2 cups raw (60g)',
    grams: 60,
    calories: 14,
    protein: 1.7,
    carbs: 2.2,
    fat: 0.2,
    fiber: 1.3,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'],
    allergens: []
  },
  {
    name: 'Medium Banana',
    category: 'Produce',
    defaultPortion: '1 medium (118g)',
    grams: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'paleo'],
    allergens: []
  },
  {
    name: 'Fresh Blueberries',
    category: 'Produce',
    defaultPortion: '1 cup (150g)',
    grams: 150,
    calories: 84,
    protein: 1.1,
    carbs: 21.4,
    fat: 0.5,
    fiber: 3.6,
    budgetFriendly: false,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'paleo'],
    allergens: []
  },
  {
    name: 'Medium Apple with Skin',
    category: 'Produce',
    defaultPortion: '1 medium (180g)',
    grams: 180,
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fat: 0.3,
    fiber: 4.4,
    budgetFriendly: true,
    suitableDiets: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'paleo'],
    allergens: []
  }
];

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // CHEST
  {
    id: 'barbell_bench_press',
    name: 'Barbell Flat Bench Press',
    category: 'Chest',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    requiredEquipment: ['full_gym'],
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on the bench with eyes directly under the racked bar.',
      'Grip the bar slightly wider than shoulder width with feet planted firmly.',
      'Unrack the bar, retract your shoulder blades, and lower the bar under control to mid-chest.',
      'Press upward with power while maintaining arch and foot pressure until arms lock out.'
    ],
    formTips: ['Keep wrists neutral', 'Tuck elbows at roughly 45–60 degrees to protect shoulders', 'Maintain constant upper back tightness'],
    avoidMistakes: ['Bouncing the barbell off your sternum', 'Flaring elbows directly out at 90 degrees', 'Lifting feet off the floor']
  },
  {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Flat Bench Press',
    category: 'Chest',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoid', 'Triceps'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal'],
    difficulty: 'beginner',
    instructions: [
      'Sit on the bench edge with dumbbells on your knees. Lie back kick-starting the weights into position.',
      'Press both dumbbells up over your chest with neutral wrists.',
      'Lower down slowly until you feel a comfortable chest stretch.',
      'Drive upward bringing the weights together without clanging.'
    ],
    formTips: ['Full range of motion allows deeper stretch than a straight barbell', 'Inhale on the descent, exhale on the press'],
    avoidMistakes: ['Dropping elbows below bench height excessively if shoulder pain occurs', 'Rushing the negative eccentric portion']
  },
  {
    id: 'pushups_standard',
    name: 'Standard Push-Up',
    category: 'Chest',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Core', 'Triceps', 'Shoulders'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'bodyweight_only', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Place hands slightly wider than shoulder-width on the floor in a tall plank position.',
      'Brace core and glutes to keep body in a rigid straight line from head to heels.',
      'Lower chest down until it hovers an inch above the floor.',
      'Push the ground away to return to top plank position.'
    ],
    formTips: ['Screw your hands into the floor to engage lats', 'Look slightly forward of your fingertips'],
    avoidMistakes: ['Sagging lower back or piking hips high into the air', 'Flaring elbows wide']
  },

  // BACK
  {
    id: 'barbell_deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    primaryMuscle: 'Posterior Chain (Glutes, Hamstrings, Erector Spinae)',
    secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearms'],
    requiredEquipment: ['full_gym'],
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width apart, midfoot directly under the bar.',
      'Hinge at hips, bend knees slightly, and grip bar just outside knees.',
      'Pull chest up, engage lats, and pull the slack out of the barbell.',
      'Drive feet through the floor, extending hips and knees simultaneously to stand tall.'
    ],
    formTips: ['Keep barbell dragging against shins and thighs throughout', 'Think of pushing the earth away, not pulling with the lower back'],
    avoidMistakes: ['Rounding the lumbar spine under load', 'Hyperextending back at lockout']
  },
  {
    id: 'single_arm_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    category: 'Back',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Rhomboids', 'Rear Deltoid', 'Biceps'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal'],
    difficulty: 'beginner',
    instructions: [
      'Place one knee and one hand on a flat bench with spine neutral.',
      'Hold a dumbbell in opposite hand letting arm hang down fully.',
      'Drive your elbow back toward your hip, squeezing your back at the top.',
      'Lower under control to a full stretch.'
    ],
    formTips: ['Pull with your elbow, not your wrist or bicep', 'Keep torso parallel to bench without rotating'],
    avoidMistakes: ['Using momentum to jerk the weight up', 'Twisting torso excessively']
  },
  {
    id: 'pullups_bodyweight',
    name: 'Overhand Pull-Up',
    category: 'Back',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Mid Traps'],
    requiredEquipment: ['full_gym', 'bodyweight_only', 'home_minimal'],
    difficulty: 'intermediate',
    instructions: [
      'Hang from a pull-up bar with an overhand grip slightly wider than shoulder-width.',
      'Engage scapulae down and back from a dead hang.',
      'Pull your chest up toward the bar until your chin clears it.',
      'Lower under steady control back to full arm extension.'
    ],
    formTips: ['Drive elbows down toward your back pockets', 'Avoid swinging legs for momentum'],
    avoidMistakes: ['Cutting range of motion short at top or bottom', 'Kicking legs frantically']
  },

  // LEGS
  {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    primaryMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Core'],
    requiredEquipment: ['full_gym'],
    difficulty: 'intermediate',
    instructions: [
      'Rest barbell across upper traps (high bar) or rear delts (low bar).',
      'Step back, set feet shoulder-width apart with toes angled slightly out.',
      'Inhale deep into diaphragm, brace core, and descend by breaking at hips and knees.',
      'Squat until hips drop below parallel with knees, then drive up through midfoot.'
    ],
    formTips: ['Keep chest up and knees tracking in line with toes', 'Maintain neutral spine throughout'],
    avoidMistakes: ['Knees caving inward (valgus collapse)', 'Heels rising off the floor']
  },
  {
    id: 'dumbbell_goblet_squat',
    name: 'Dumbbell Goblet Squat',
    category: 'Legs',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Upper Back', 'Core'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal'],
    difficulty: 'beginner',
    instructions: [
      'Hold one dumbbell vertically against your sternum with both hands cupping the top.',
      'Stand with feet shoulder-width apart.',
      'Sit down between your hips, keeping your torso upright.',
      'Drive back up through midfoot to a full stand.'
    ],
    formTips: ['Great for building deep hip mobility and squat posture', 'Elbows can track inside knees at the bottom'],
    avoidMistakes: ['Letting dumbbell drift away from your chest', 'Rounding upper back']
  },
  {
    id: 'romanian_deadlift_db',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Legs',
    primaryMuscle: 'Hamstrings & Glutes',
    secondaryMuscles: ['Lower Back', 'Forearms'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal'],
    difficulty: 'beginner',
    instructions: [
      'Stand holding dumbbells in front of thighs with feet hip-width apart.',
      'With soft knees, hinge hips straight back as if trying to touch the wall behind you.',
      'Lower dumbbells down shins until hamstrings feel fully stretched.',
      'Squeeze glutes and drive hips forward to return to standing.'
    ],
    formTips: ['Knees stay at constant slight bend; the movement is purely a hip hinge', 'Keep dumbbells glued close to legs'],
    avoidMistakes: ['Squatting instead of hinging', 'Letting lower back round at bottom']
  },
  {
    id: 'bodyweight_lunges',
    name: 'Walking or Static Lunges',
    category: 'Legs',
    primaryMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Calves', 'Core Balance'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'bodyweight_only', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Step forward with one leg, landing with heel first.',
      'Lower hips until both front and rear knees form roughly 90-degree angles.',
      'Keep torso upright and front knee directly over ankle.',
      'Push off front heel to return or step into the next stride.'
    ],
    formTips: ['Keep hips level throughout the movement', 'Lightly graze or hover rear knee above floor'],
    avoidMistakes: ['Front knee collapsing inward', 'Taking steps too short causing front knee to push forward past toes']
  },

  // SHOULDERS
  {
    id: 'overhead_dumbbell_press',
    name: 'Seated or Standing Dumbbell Shoulder Press',
    category: 'Shoulders',
    primaryMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Traps'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal'],
    difficulty: 'beginner',
    instructions: [
      'Hold dumbbells at shoulder height with palms facing forward or slightly angled inward.',
      'Brace core, press both weights smoothly overhead until arms are extended.',
      'Lower under control back to shoulder level.'
    ],
    formTips: ['Avoid overarching your lower back by keeping ribs pulled down', 'Press in a slight natural arc'],
    avoidMistakes: ['Flaring elbows completely backward', 'Using excessive leg drive during strict presses']
  },
  {
    id: 'dumbbell_lateral_raises',
    name: 'Dumbbell Lateral Raises',
    category: 'Shoulders',
    primaryMuscle: 'Lateral Deltoid (Side Shoulder)',
    secondaryMuscles: ['Traps'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Stand tall holding light dumbbells at your sides with a slight forward torso lean.',
      'Lead with your elbows to raise arms out to the sides until parallel to the floor.',
      'Pause for a split second, then lower under 2-second tempo.'
    ],
    formTips: ['Think of pouring water from a pitcher at the top', 'Use moderate weights for high reps with zero swinging'],
    avoidMistakes: ['Shrugging shoulders into ears with traps', 'Swinging hips to launch heavy dumbbells']
  },

  // ARMS
  {
    id: 'dumbbell_bicep_curls',
    name: 'Alternating Dumbbell Bicep Curls',
    category: 'Arms',
    primaryMuscle: 'Biceps Brachii',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Stand holding dumbbells with palms facing thighs.',
      'Curl one dumbbell up while rotating palm upward (supinating) to face your shoulder.',
      'Squeeze bicep hard at the peak, then lower slowly.',
      'Alternate arms or perform together.'
    ],
    formTips: ['Keep elbows pinned firmly against ribcage', 'Do not lean back to assist lift'],
    avoidMistakes: ['Swinging upper arms forward to turn curl into a shoulder movement', 'Dropping weights rapidly']
  },
  {
    id: 'tricep_dips_bench',
    name: 'Bench or Chair Tricep Dips',
    category: 'Arms',
    primaryMuscle: 'Triceps Brachii',
    secondaryMuscles: ['Anterior Deltoid', 'Chest'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'bodyweight_only'],
    difficulty: 'beginner',
    instructions: [
      'Place hands shoulder-width on bench edge, knuckles forward.',
      'Extend legs forward with heels on floor.',
      'Lower hips by bending elbows until upper arms are parallel to bench.',
      'Push through palms to fully extend arms and squeeze triceps.'
    ],
    formTips: ['Keep back close to the bench as you descend', 'Bend knees to make it easier; elevate feet to make it harder'],
    avoidMistakes: ['Shrugging shoulders upward during descent', 'Going too deep straining anterior shoulder capsule']
  },

  // CORE
  {
    id: 'plank_forearm',
    name: 'Forearm Plank',
    category: 'Core',
    primaryMuscle: 'Rectus Abdominis & Transverse Abdominis',
    secondaryMuscles: ['Glutes', 'Serratus Anterior'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'bodyweight_only', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Rest on forearms with elbows directly under shoulders, feet together.',
      'Tuck pelvis into posterior tilt, engage glutes, and pull belly button to spine.',
      'Maintain an unbroken straight line from head to heels.',
      'Breathe steadily while maintaining tension.'
    ],
    formTips: ['Actively pull elbows toward toes to double core tension', 'Never let lower back sag'],
    avoidMistakes: ['Holding breath', 'Piking hips into the air to relieve core']
  },
  {
    id: 'deadbug',
    name: 'Dead Bug Core Stability',
    category: 'Core',
    primaryMuscle: 'Deep Core & Spinal Stabilizers',
    secondaryMuscles: ['Hip Flexors'],
    requiredEquipment: ['full_gym', 'dumbbells_only', 'home_minimal', 'bodyweight_only', 'resistance_bands'],
    difficulty: 'beginner',
    instructions: [
      'Lie on your back with arms reaching toward ceiling and knees bent at 90 degrees.',
      'Press lower back flat into floor with zero gap.',
      'Simultaneously lower right arm overhead and extend left leg straight out hovering above floor.',
      'Return to center and switch sides under control.'
    ],
    formTips: ['If lower back arches off floor, do not extend leg as low', 'Move slowly with full breath control'],
    avoidMistakes: ['Arching lower back', 'Rushing through repetitions']
  }
];

export const DEFAULT_WEEKLY_WORKOUT: DayWorkout[] = [
  {
    id: 'workout_mon',
    dayIndex: 0,
    dayName: 'Monday',
    name: 'Upper Body Strength & Posture',
    isRestDay: false,
    targetFocus: 'Chest, Back & Shoulders',
    durationMinutes: 45,
    completed: false,
    exercises: [
      {
        id: 'e1',
        exerciseId: 'dumbbell_bench_press',
        name: 'Dumbbell Flat Bench Press',
        targetMuscle: 'Chest',
        sets: 3,
        reps: '8-10 reps',
        weightKg: 20,
        restSeconds: 90,
        instructions: 'Lower with 2-second control; drive up with power without clanging.',
        completedSets: [false, false, false]
      },
      {
        id: 'e2',
        exerciseId: 'single_arm_dumbbell_row',
        name: 'Single-Arm Dumbbell Row',
        targetMuscle: 'Back',
        sets: 3,
        reps: '10-12 reps per side',
        weightKg: 18,
        restSeconds: 75,
        instructions: 'Drive elbow back towards hip; squeeze lat at the top.',
        completedSets: [false, false, false]
      },
      {
        id: 'e3',
        exerciseId: 'overhead_dumbbell_press',
        name: 'Dumbbell Shoulder Press',
        targetMuscle: 'Shoulders',
        sets: 3,
        reps: '10 reps',
        weightKg: 14,
        restSeconds: 75,
        instructions: 'Brace core, press overhead without excessive lower back arching.',
        completedSets: [false, false, false]
      },
      {
        id: 'e4',
        exerciseId: 'plank_forearm',
        name: 'Forearm Plank',
        targetMuscle: 'Core',
        sets: 3,
        reps: '45 seconds',
        restSeconds: 60,
        instructions: 'Maintain rigid straight line from shoulders to heels; pull elbows toward toes.',
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: 'workout_tue',
    dayIndex: 1,
    dayName: 'Tuesday',
    name: 'Lower Body & Posterior Chain',
    isRestDay: false,
    targetFocus: 'Quads, Glutes & Hamstrings',
    durationMinutes: 45,
    completed: false,
    exercises: [
      {
        id: 'e5',
        exerciseId: 'dumbbell_goblet_squat',
        name: 'Dumbbell Goblet Squat',
        targetMuscle: 'Quads & Glutes',
        sets: 4,
        reps: '10 reps',
        weightKg: 22,
        restSeconds: 90,
        instructions: 'Keep weight close to chest, descend below parallel, drive through midfoot.',
        completedSets: [false, false, false, false]
      },
      {
        id: 'e6',
        exerciseId: 'romanian_deadlift_db',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        targetMuscle: 'Hamstrings & Glutes',
        sets: 3,
        reps: '10-12 reps',
        weightKg: 20,
        restSeconds: 90,
        instructions: 'Soft knees, hinge hips straight back, feel deep stretch in hamstrings.',
        completedSets: [false, false, false]
      },
      {
        id: 'e7',
        exerciseId: 'bodyweight_lunges',
        name: 'Walking Lunges',
        targetMuscle: 'Quads & Balance',
        sets: 3,
        reps: '12 steps per leg',
        restSeconds: 60,
        instructions: 'Keep torso tall, front knee over ankle, rear knee lightly tapping floor.',
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: 'workout_wed',
    dayIndex: 2,
    dayName: 'Wednesday',
    name: 'Active Recovery & Core Reset',
    isRestDay: true,
    targetFocus: 'Light Walk, Mobility & Rest',
    durationMinutes: 20,
    completed: false,
    exercises: [
      {
        id: 'e8',
        exerciseId: 'deadbug',
        name: 'Dead Bug Core Stability',
        targetMuscle: 'Deep Core',
        sets: 3,
        reps: '10 reps per side',
        restSeconds: 45,
        instructions: 'Keep lower back pressed flat into floor throughout all reps.',
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: 'workout_thu',
    dayIndex: 3,
    dayName: 'Thursday',
    name: 'Push & Core Hypertrophy',
    isRestDay: false,
    targetFocus: 'Chest, Shoulders & Triceps',
    durationMinutes: 45,
    completed: false,
    exercises: [
      {
        id: 'e9',
        exerciseId: 'pushups_standard',
        name: 'Push-Ups (Chest Focus)',
        targetMuscle: 'Chest',
        sets: 3,
        reps: '12-15 reps',
        restSeconds: 60,
        instructions: 'Controlled descent, elbows at 45 degrees, full push at top.',
        completedSets: [false, false, false]
      },
      {
        id: 'e10',
        exerciseId: 'dumbbell_lateral_raises',
        name: 'Dumbbell Lateral Raises',
        targetMuscle: 'Side Delts',
        sets: 4,
        reps: '12-15 reps',
        weightKg: 8,
        restSeconds: 60,
        instructions: 'Lead with elbows, pause at horizontal, control the 2-second negative.',
        completedSets: [false, false, false, false]
      },
      {
        id: 'e11',
        exerciseId: 'tricep_dips_bench',
        name: 'Bench Tricep Dips',
        targetMuscle: 'Triceps',
        sets: 3,
        reps: '12 reps',
        restSeconds: 60,
        instructions: 'Keep back close to bench, squeeze triceps hard at lockout.',
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: 'workout_fri',
    dayIndex: 4,
    dayName: 'Friday',
    name: 'Pull & Posterior Strength',
    isRestDay: false,
    targetFocus: 'Back, Biceps & Hamstrings',
    durationMinutes: 45,
    completed: false,
    exercises: [
      {
        id: 'e12',
        exerciseId: 'pullups_bodyweight',
        name: 'Pull-Ups / Assisted Pull-Ups',
        targetMuscle: 'Lats & Back',
        sets: 3,
        reps: '6-8 reps',
        restSeconds: 90,
        instructions: 'Drive elbows to floor, clear chin over bar, full stretch at bottom.',
        completedSets: [false, false, false]
      },
      {
        id: 'e13',
        exerciseId: 'single_arm_dumbbell_row',
        name: 'Dumbbell Row (Heavy)',
        targetMuscle: 'Upper Back',
        sets: 3,
        reps: '8-10 reps',
        weightKg: 22,
        restSeconds: 75,
        instructions: 'Strict form with zero torso twisting.',
        completedSets: [false, false, false]
      },
      {
        id: 'e14',
        exerciseId: 'dumbbell_bicep_curls',
        name: 'Bicep Curls',
        targetMuscle: 'Biceps',
        sets: 3,
        reps: '10-12 reps',
        weightKg: 12,
        restSeconds: 60,
        instructions: 'Keep elbows fixed, rotate wrists up, no momentum.',
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: 'workout_sat',
    dayIndex: 5,
    dayName: 'Saturday',
    name: 'Full Body Conditioning & Core',
    isRestDay: false,
    targetFocus: 'Metabolic Conditioning & Full Body',
    durationMinutes: 35,
    completed: false,
    exercises: [
      {
        id: 'e15',
        exerciseId: 'dumbbell_goblet_squat',
        name: 'Goblet Squats (Tempo)',
        targetMuscle: 'Full Body',
        sets: 3,
        reps: '12 reps',
        weightKg: 18,
        restSeconds: 60,
        instructions: '3 seconds down, 1 second pause, explode up.',
        completedSets: [false, false, false]
      },
      {
        id: 'e16',
        exerciseId: 'pushups_standard',
        name: 'Standard Push-Ups',
        targetMuscle: 'Upper Body',
        sets: 3,
        reps: '12 reps',
        restSeconds: 60,
        instructions: 'Focus on maximum tension throughout core and chest.',
        completedSets: [false, false, false]
      },
      {
        id: 'e17',
        exerciseId: 'plank_forearm',
        name: 'Forearm Plank Finisher',
        targetMuscle: 'Core',
        sets: 3,
        reps: '60 seconds',
        restSeconds: 45,
        instructions: 'Endurance test: squeeze glutes, breathe deep.',
        completedSets: [false, false, false]
      }
    ]
  },
  {
    id: 'workout_sun',
    dayIndex: 6,
    dayName: 'Sunday',
    name: 'Full Rest & Recovery Day',
    isRestDay: true,
    targetFocus: 'Sleep, Meal Prep & Central Nervous System Reset',
    durationMinutes: 0,
    completed: false,
    exercises: []
  }
];
