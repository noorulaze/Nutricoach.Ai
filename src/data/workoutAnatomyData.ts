export interface MuscleGroupInfo {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  defaultView: 'front' | 'back';
  tips: {
    focus: string;
    equipment: string;
    rest: string;
    target: string;
  };
  exercises: AnatomyExercise[];
}

export interface AnatomyExercise {
  id: string;
  name: string;
  primaryMuscle: string;
  targetMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sets: string;
  reps: string;
  restSeconds: number;
  restText: string;
  equipment: string;
  demoGraphic: string; // Key for visual illustration
  instructions: string[];
  formTips: string[];
  avoidMistakes: string[];
}

export const MUSCLE_GROUPS: MuscleGroupInfo[] = [
  // 1. CHEST
  {
    id: 'chest',
    name: 'Chest',
    scientificName: 'Pectoralis Major',
    description: 'The chest muscles help with pushing movements and upper body strength. They are essential for many daily activities and sports performance.',
    defaultView: 'front',
    tips: {
      focus: 'Middle & upper chest',
      equipment: 'Barbell, dumbbells, cables, bodyweight',
      rest: '45–90 seconds',
      target: 'Strength & muscle growth'
    },
    exercises: [
      {
        id: 'barbell_bench_press',
        name: 'Barbell Bench Press',
        primaryMuscle: 'Chest',
        targetMuscles: ['Chest', 'Triceps'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '8–12 reps',
        restSeconds: 90,
        restText: '90s rest',
        equipment: 'Barbell & Flat Bench',
        demoGraphic: 'bench_press',
        instructions: [
          'Lie flat on the bench with eyes under the racked bar. Plant your feet flat on the floor.',
          'Grip the bar slightly wider than shoulder-width. Retract your shoulder blades and brace your core.',
          'Unrack the bar and lower it under control to your mid-chest line.',
          'Drive upward smoothly while keeping your wrists stacked directly over your forearms.'
        ],
        formTips: [
          'Keep shoulder blades pinched together throughout the lift.',
          'Tuck elbows at roughly 45 to 60 degrees from your torso to protect the rotator cuff.'
        ],
        avoidMistakes: [
          'Bouncing the bar forcefully off your sternum.',
          'Allowing your butt to lift off the bench.'
        ]
      },
      {
        id: 'dumbbell_chest_press',
        name: 'Dumbbell Chest Press',
        primaryMuscle: 'Chest',
        targetMuscles: ['Chest', 'Triceps'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '8–12 reps',
        restSeconds: 75,
        restText: '60–90s rest',
        equipment: 'Dumbbells & Flat Bench',
        demoGraphic: 'db_press',
        instructions: [
          'Sit on the bench edge with dumbbells resting on your thighs.',
          'Lie back and use your knees to help kick the dumbbells into starting position over your chest.',
          'Lower the dumbbells out and down in a natural arc until you feel a comfortable stretch in your pecs.',
          'Press the weights back up toward the ceiling without clashing them together at the top.'
        ],
        formTips: [
          'Allows greater range of motion and natural wrist rotation than a straight barbell.',
          'Control the 2-second eccentric lowering phase.'
        ],
        avoidMistakes: [
          'Dropping elbows excessively below bench height if shoulder discomfort occurs.',
          'Rushing through the bottom stretch.'
        ]
      },
      {
        id: 'incline_dumbbell_press',
        name: 'Incline Dumbbell Press',
        primaryMuscle: 'Chest',
        targetMuscles: ['Chest', 'Shoulders'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '8–12 reps',
        restSeconds: 75,
        restText: '60–90s rest',
        equipment: 'Dumbbells & Incline Bench (30°)',
        demoGraphic: 'incline_press',
        instructions: [
          'Adjust the bench to a 30-degree incline. Sit back with dumbbells resting on your knees.',
          'Kick dumbbells up to shoulder height, squeeze shoulder blades back into the pad.',
          'Press the dumbbells up vertically until your arms are extended.',
          'Lower smoothly until your hands reach upper chest height.'
        ],
        formTips: [
          'Keep the bench at 30° — steeper angles shift focus away from the clavicular chest to the deltoids.',
          'Maintain firm upper back contact with the pad.'
        ],
        avoidMistakes: [
          'Setting the incline too steep (45°+ shifts load to front delts).',
          'Flaring elbows out to 90 degrees.'
        ]
      },
      {
        id: 'push_up',
        name: 'Push Up',
        primaryMuscle: 'Chest',
        targetMuscles: ['Chest', 'Triceps'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '10–20 reps',
        restSeconds: 50,
        restText: '45–60s rest',
        equipment: 'Bodyweight',
        demoGraphic: 'push_up',
        instructions: [
          'Place hands on the floor slightly wider than shoulder width in a high plank.',
          'Brace your core, glutes, and thighs to form a rigid line from crown to heels.',
          'Lower your chest until it hovers roughly 1 inch above the floor.',
          'Press through your whole hand to return to the starting plank.'
        ],
        formTips: [
          'Screw your palms into the floor to actively engage your lats and stabilize shoulders.',
          'Keep your neck neutral by gazing slightly ahead of your hands.'
        ],
        avoidMistakes: [
          'Sagging lower back or piking your hips up.',
          'Performing half reps without chest depth.'
        ]
      },
      {
        id: 'cable_fly',
        name: 'Cable Fly',
        primaryMuscle: 'Chest',
        targetMuscles: ['Chest'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '12–15 reps',
        restSeconds: 50,
        restText: '45–60s rest',
        equipment: 'Cable Crossover Machine',
        demoGraphic: 'cable_fly',
        instructions: [
          'Set pulleys at chest height. Take a handle in each hand and step forward into a staggered stance.',
          'With a slight bend in your elbows, open your arms out wide until you feel a deep chest stretch.',
          'Bring your hands forward in an hugging arc until your hands meet in front of your sternum.',
          'Squeeze your pecs hard for 1 second at peak contraction.'
        ],
        formTips: [
          'Maintain a fixed soft bend at the elbows throughout the whole movement.',
          'Do not let the weight stack pull your arms behind your shoulders.'
        ],
        avoidMistakes: [
          'Turning the fly into a press by excessively bending and extending elbows.',
          'Leaning excessively forward with rounded upper back.'
        ]
      }
    ]
  },

  // 2. SHOULDERS
  {
    id: 'shoulders',
    name: 'Shoulders',
    scientificName: 'Deltoideus (Anterior, Lateral, Posterior)',
    description: 'The shoulder complex provides 3D upper-body width, overhead pressing power, and critical glenohumeral stability.',
    defaultView: 'front',
    tips: {
      focus: 'Lateral, anterior & rear delts',
      equipment: 'Dumbbells, barbell, cables',
      rest: '60–90 seconds',
      target: 'Width, overhead strength & posture'
    },
    exercises: [
      {
        id: 'overhead_barbell_press',
        name: 'Standing Overhead Barbell Press',
        primaryMuscle: 'Shoulders',
        targetMuscles: ['Shoulders', 'Triceps', 'Core'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '6–10 reps',
        restSeconds: 90,
        restText: '90s rest',
        equipment: 'Barbell & Squat/Power Rack',
        demoGraphic: 'overhead_press',
        instructions: [
          'Rest the bar across front deltoids with hands just outside shoulders.',
          'Squeeze glutes and brace core firmly. Press the bar straight upward.',
          'As the bar clears your forehead, move your head slightly forward so the bar locks out directly over your midfoot.'
        ],
        formTips: ['Keep forearms vertical when viewed from front and side', 'Engage abs to prevent excessive lumbar arching.'],
        avoidMistakes: ['Bending the knees to bounce the weight (push press)', 'Leaning back excessively.']
      },
      {
        id: 'dumbbell_lateral_raise',
        name: 'Dumbbell Lateral Raise',
        primaryMuscle: 'Shoulders',
        targetMuscles: ['Shoulders'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '12–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Dumbbells',
        demoGraphic: 'lateral_raise',
        instructions: [
          'Stand tall holding dumbbells at your sides with palms facing inward.',
          'Raise weights out to the sides with elbows leading, until arms are parallel to the floor.',
          'Pause momentarily at the top, then lower with control over 2 seconds.'
        ],
        formTips: ['Think of pouring water from a pitcher at top position', 'Keep shoulders pressed down away from your ears.'],
        avoidMistakes: ['Swinging your hips and torso to heave the weight up', 'Lifting hands above elbow height.']
      },
      {
        id: 'face_pull_cable',
        name: 'Cable Face Pull',
        primaryMuscle: 'Shoulders',
        targetMuscles: ['Shoulders', 'Upper Back'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '15–20 reps',
        restSeconds: 45,
        restText: '45–60s rest',
        equipment: 'Cable Machine & Rope Attachment',
        demoGraphic: 'face_pull',
        instructions: [
          'Set rope attachment at eye level. Grip the rope with thumbs pointing backward.',
          'Step back to create cable tension. Pull the rope directly toward your bridge of nose.',
          'Externally rotate shoulders as you pull so your hands end beside your ears.'
        ],
        formTips: ['Essential movement for shoulder health and correcting rounded posture.'],
        avoidMistakes: ['Using too much weight and leaning backward', 'Pulling down toward your chest instead of your face.']
      }
    ]
  },

  // 3. BICEPS
  {
    id: 'biceps',
    name: 'Biceps',
    scientificName: 'Biceps Brachii',
    description: 'The biceps brachii flexes the elbow, supinates the forearm, and assists in shoulder flexion during pulling movements.',
    defaultView: 'front',
    tips: {
      focus: 'Long and short heads of biceps',
      equipment: 'Dumbbells, EZ-bar, cables, pull-up bar',
      rest: '45–75 seconds',
      target: 'Peak, arm thickness & pull strength'
    },
    exercises: [
      {
        id: 'barbell_bicep_curl',
        name: 'Standing Barbell Bicep Curl',
        primaryMuscle: 'Biceps',
        targetMuscles: ['Biceps', 'Forearms'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '8–12 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Straight Barbell or EZ-Curl Bar',
        demoGraphic: 'bicep_curl',
        instructions: [
          'Grip the barbell shoulder-width apart with underhand palms-up grip.',
          'Keep upper arms pinned comfortably to your ribs. Curl bar toward chest.',
          'Contract biceps at the top, then lower smoothly through the full range.'
        ],
        formTips: ['Avoid swinging elbows forward during the curl.'],
        avoidMistakes: ['Using momentum from your hips', 'Dropping the bar quickly without tension.']
      },
      {
        id: 'incline_dumbbell_curl',
        name: 'Incline Dumbbell Curl',
        primaryMuscle: 'Biceps',
        targetMuscles: ['Biceps'],
        difficulty: 'Intermediate',
        sets: '3 sets',
        reps: '10–12 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Incline Bench (45°) & Dumbbells',
        demoGraphic: 'incline_curl',
        instructions: [
          'Lie back on an incline bench set to 45 degrees, arms hanging naturally down.',
          'Curl dumbbells upward while keeping your upper arms stationary behind your torso.',
          'Supinate wrists (turn pinky up) as you reach the top of the curl.'
        ],
        formTips: ['Creates maximum stretch on the long head of the biceps.'],
        avoidMistakes: ['Lifting shoulders off the bench pad to finish the rep.']
      }
    ]
  },

  // 4. TRICEPS
  {
    id: 'triceps',
    name: 'Triceps',
    scientificName: 'Triceps Brachii',
    description: 'Comprising two-thirds of upper-arm mass, the triceps extends the elbow and is the prime engine behind all pushing power.',
    defaultView: 'back',
    tips: {
      focus: 'Lateral, medial & long heads',
      equipment: 'Cables, dumbbells, bodyweight, EZ-bar',
      rest: '45–75 seconds',
      target: 'Arm size, lockout power & elbow resilience'
    },
    exercises: [
      {
        id: 'cable_tricep_pushdown',
        name: 'Cable Tricep Pushdown',
        primaryMuscle: 'Triceps',
        targetMuscles: ['Triceps'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '10–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Cable Machine & Rope or Straight Bar',
        demoGraphic: 'tricep_pushdown',
        instructions: [
          'Stand facing cable stack with upper arms tucked tight against your ribcage.',
          'Push the handle down toward your thighs by flexing your triceps.',
          'Lock elbows out and spread the rope slightly at the bottom for peak contraction.'
        ],
        formTips: ['Keep elbows glued in place as a stationary pivot point.'],
        avoidMistakes: ['Letting elbows flare forward and upward during the eccentric return.']
      },
      {
        id: 'skull_crushers_ez',
        name: 'EZ-Bar Skull Crusher',
        primaryMuscle: 'Triceps',
        targetMuscles: ['Triceps'],
        difficulty: 'Intermediate',
        sets: '3 sets',
        reps: '10–12 reps',
        restSeconds: 75,
        restText: '75s rest',
        equipment: 'EZ-Bar & Flat Bench',
        demoGraphic: 'skull_crusher',
        instructions: [
          'Lie flat on the bench holding the EZ-bar with hands close on inner knurling.',
          'Extend arms straight over your shoulders, then tilt upper arms slightly backward.',
          'Bend elbows to lower the bar toward your forehead or crown of head.',
          'Press the bar back to starting position using triceps extension.'
        ],
        formTips: ['Tilting upper arms 10° backward maintains continuous tension at lockout.'],
        avoidMistakes: ['Flaring elbows out sideways; keep them parallel.']
      }
    ]
  },

  // 5. FOREARMS
  {
    id: 'forearms',
    name: 'Forearms',
    scientificName: 'Brachioradialis & Forearm Flexors/Extensors',
    description: 'Forearm musculature dictates grip strength, wrist stability, and full transmission of pulling power to the barbell.',
    defaultView: 'front',
    tips: {
      focus: 'Brachioradialis, wrist flexors & extensors',
      equipment: 'Dumbbells, barbell, farmer bars',
      rest: '45–60 seconds',
      target: 'Crushing grip & forearm development'
    },
    exercises: [
      {
        id: 'farmers_walk',
        name: 'Heavy Farmer Walk',
        primaryMuscle: 'Forearms',
        targetMuscles: ['Forearms', 'Trapezius', 'Core'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '40–50 meters',
        restSeconds: 90,
        restText: '90s rest',
        equipment: 'Heavy Dumbbells or Kettlebells',
        demoGraphic: 'farmers_walk',
        instructions: [
          'Deadlift two heavy dumbbells or kettlebells from the floor with neutral spine.',
          'Stand tall with chest proud, shoulders pulled back and down.',
          'Walk forward in smooth, controlled strides while keeping weights steady at your sides.'
        ],
        formTips: ['Breathe diaphragmatically and keep core tight.'],
        avoidMistakes: ['Slouching shoulders forward or taking erratic strides.']
      },
      {
        id: 'reverse_barbell_curl',
        name: 'Reverse Barbell Grip Curl',
        primaryMuscle: 'Forearms',
        targetMuscles: ['Forearms', 'Biceps'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '12–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Barbell or EZ-Bar',
        demoGraphic: 'reverse_curl',
        instructions: [
          'Grip the barbell with an overhand (pronated) palms-down grip.',
          'Keep wrists neutral and curl the bar up toward upper chest.',
          'Lower under control to heavily load the brachioradialis.'
        ],
        formTips: ['Keep wrists locked straight; do not let them hyperextend backward.'],
        avoidMistakes: ['Using excessive weight that bends your wrists backwards.']
      }
    ]
  },

  // 6. ABS
  {
    id: 'abs',
    name: 'Abs',
    scientificName: 'Rectus Abdominis',
    description: 'The rectus abdominis flexes the lumbar spine, stabilizes the pelvis, and provides the defined six-pack midsection.',
    defaultView: 'front',
    tips: {
      focus: 'Upper, mid & lower abdominal wall',
      equipment: 'Bodyweight, pull-up bar, ab wheel, cables',
      rest: '45–60 seconds',
      target: 'Core endurance, pelvic control & definition'
    },
    exercises: [
      {
        id: 'hanging_leg_raise',
        name: 'Hanging Leg Raise',
        primaryMuscle: 'Abs',
        targetMuscles: ['Abs', 'Hip Flexors'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '10–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Pull-Up Bar',
        demoGraphic: 'hanging_leg_raise',
        instructions: [
          'Hang from a pull-up bar with overhand grip and engaged shoulders.',
          'Brace core and raise your legs up together until parallel to the floor.',
          'Curl your pelvis slightly upward at top to maximize abdominal contraction.',
          'Lower legs smoothly without swinging.'
        ],
        formTips: ['Focus on posterior pelvic tilt (curling hips) rather than just lifting thighs.'],
        avoidMistakes: ['Swinging your whole body to use momentum.']
      },
      {
        id: 'ab_wheel_rollout',
        name: 'Kneeling Ab Wheel Rollout',
        primaryMuscle: 'Abs',
        targetMuscles: ['Abs', 'Lats', 'Core'],
        difficulty: 'Advanced',
        sets: '3 sets',
        reps: '8–12 reps',
        restSeconds: 75,
        restText: '75s rest',
        equipment: 'Ab Wheel / Roller',
        demoGraphic: 'ab_wheel',
        instructions: [
          'Kneel on a soft mat holding the ab wheel with straight arms.',
          'Round your upper back slightly and brace abs hard.',
          'Roll the wheel forward smoothly, extending your body toward the floor.',
          'Pull from your abs to roll back to the starting kneeling position.'
        ],
        formTips: ['Never let your lower back sag into hyperextension.'],
        avoidMistakes: ['Rolling out further than your core strength can control safely.']
      }
    ]
  },

  // 7. OBLIQUES
  {
    id: 'obliques',
    name: 'Obliques',
    scientificName: 'External & Internal Obliques',
    description: 'The obliques control trunk rotation, resist lateral flexion, and frame the waistline with defined athletic ridges.',
    defaultView: 'front',
    tips: {
      focus: 'Rotational power & lateral stability',
      equipment: 'Cables, medicine ball, bodyweight',
      rest: '45–60 seconds',
      target: 'Waistline tapering & anti-rotation stability'
    },
    exercises: [
      {
        id: 'cable_woodchopper',
        name: 'Cable Woodchopper',
        primaryMuscle: 'Obliques',
        targetMuscles: ['Obliques', 'Abs', 'Shoulders'],
        difficulty: 'Intermediate',
        sets: '3 sets each side',
        reps: '12–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Cable Machine',
        demoGraphic: 'woodchopper',
        instructions: [
          'Set high pulley. Stand perpendicular to the machine with feet shoulder-width.',
          'Grip handle with both hands, arms extended.',
          'Rotate your torso downward across your body toward your opposite hip.',
          'Control the return back to the high starting point.'
        ],
        formTips: ['Rotate through your thoracic spine and hips, not your knees.'],
        avoidMistakes: ['Bending your elbows to pull with arms instead of rotating with core.']
      },
      {
        id: 'side_plank_reach',
        name: 'Side Plank with Rotation',
        primaryMuscle: 'Obliques',
        targetMuscles: ['Obliques', 'Shoulders'],
        difficulty: 'Beginner',
        sets: '3 sets each side',
        reps: '10–12 reps',
        restSeconds: 45,
        restText: '45s rest',
        equipment: 'Bodyweight',
        demoGraphic: 'side_plank',
        instructions: [
          'Prop yourself onto one forearm and outer edge of bottom foot.',
          'Hold straight line from head to ankles, top arm pointing to ceiling.',
          'Reach your top hand under your torso, rotating slightly inward.',
          'Return to tall side plank with hips held high.'
        ],
        formTips: ['Keep bottom hip elevated away from the floor.'],
        avoidMistakes: ['Letting hips drop downward or sagging forward.']
      }
    ]
  },

  // 8. UPPER BACK
  {
    id: 'upper_back',
    name: 'Upper Back',
    scientificName: 'Trapezius & Rhomboids',
    description: 'The trapezius and rhomboids anchor the scapulae, protect shoulder mechanics, and construct dense upper-back thickness.',
    defaultView: 'back',
    tips: {
      focus: 'Mid/upper traps & rhomboids',
      equipment: 'Barbell, dumbbells, cables, chest-supported bench',
      rest: '60–90 seconds',
      target: 'Back thickness & posture alignment'
    },
    exercises: [
      {
        id: 'barbell_shrug',
        name: 'Barbell Trap Shrug',
        primaryMuscle: 'Upper Back',
        targetMuscles: ['Upper Back'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '12–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Barbell & Squat Rack',
        demoGraphic: 'shrug',
        instructions: [
          'Hold barbell with shoulder-width overhand grip, arms hanging straight.',
          'Elevate your shoulders toward your ears in a direct vertical shrug.',
          'Hold at peak contraction for 1.5 seconds, then lower smoothly.'
        ],
        formTips: ['Shrug straight up and down; never roll your shoulders in circles.'],
        avoidMistakes: ['Rolling shoulders backward or forward (damages rotator cuff joints).']
      },
      {
        id: 'chest_supported_db_row',
        name: 'Chest-Supported Dumbbell Row',
        primaryMuscle: 'Upper Back',
        targetMuscles: ['Upper Back', 'Lats', 'Rear Delts'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '10–12 reps',
        restSeconds: 75,
        restText: '75s rest',
        equipment: 'Incline Bench (30–45°) & Dumbbells',
        demoGraphic: 'db_row_supported',
        instructions: [
          'Lie prone (face down) on an incline bench with dumbbells hanging down.',
          'Retract shoulder blades and pull dumbbells up with elbows flaring out at 45°.',
          'Squeeze shoulder blades hard at the top, then lower with control.'
        ],
        formTips: ['Takes 100% of the strain off your lumbar spine.'],
        avoidMistakes: ['Lifting chest off the pad to heave the weights.']
      }
    ]
  },

  // 9. LATS
  {
    id: 'lats',
    name: 'Lats',
    scientificName: 'Latissimus Dorsi',
    description: 'The largest muscles of the upper body, the lats pull the arms down and back, creating the coveted V-taper silhouette.',
    defaultView: 'back',
    tips: {
      focus: 'Latissimus dorsi width & pulling capacity',
      equipment: 'Pull-up bar, cable lat pulldown, barbell',
      rest: '60–90 seconds',
      target: 'V-taper width & pulling dominance'
    },
    exercises: [
      {
        id: 'lat_pulldown_wide',
        name: 'Wide-Grip Lat Pulldown',
        primaryMuscle: 'Lats',
        targetMuscles: ['Lats', 'Biceps', 'Upper Back'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '10–12 reps',
        restSeconds: 75,
        restText: '75s rest',
        equipment: 'Lat Pulldown Machine',
        demoGraphic: 'lat_pulldown',
        instructions: [
          'Sit securely under thigh pads with wide overhand grip on the bar.',
          'Lean back very slightly (~10°), chest proud.',
          'Drive elbows down and back toward your back pockets until bar reaches upper chest.',
          'Slowly control the ascent to feel a complete lat stretch.'
        ],
        formTips: ['Focus on driving your elbows down, rather than curling with your hands.'],
        avoidMistakes: ['Yanking the bar down using aggressive momentum and swinging backward.']
      },
      {
        id: 'pull_up_bodyweight',
        name: 'Bodyweight Pull-Up',
        primaryMuscle: 'Lats',
        targetMuscles: ['Lats', 'Biceps', 'Upper Back', 'Core'],
        difficulty: 'Advanced',
        sets: '3–4 sets',
        reps: '6–12 reps',
        restSeconds: 90,
        restText: '90s rest',
        equipment: 'Pull-Up Bar',
        demoGraphic: 'pull_up',
        instructions: [
          'Hang from bar with hands slightly wider than shoulder width.',
          'Depress scapulae, brace core, and pull yourself up until chin clears the bar.',
          'Lower smoothly over 2–3 seconds to a full dead hang.'
        ],
        formTips: ['A dead hang at the bottom maximizes lat stretch and hypertrophy.'],
        avoidMistakes: ['Kipping or swinging legs to cheat the rep.']
      }
    ]
  },

  // 10. LOWER BACK
  {
    id: 'lower_back',
    name: 'Lower Back',
    scientificName: 'Erector Spinae',
    description: 'The erector spinae muscles span the vertebral column, maintaining posture, resisting spinal flexion, and transferring lower-body power.',
    defaultView: 'back',
    tips: {
      focus: 'Spinal erection & posterior chain stability',
      equipment: 'Back extension bench, barbell, bodyweight mat',
      rest: '60–90 seconds',
      target: 'Spinal resilience & injury prevention'
    },
    exercises: [
      {
        id: 'hyperextension_45',
        name: '45-Degree Back Extension',
        primaryMuscle: 'Lower Back',
        targetMuscles: ['Lower Back', 'Glutes', 'Hamstrings'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '12–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: '45° Hyperextension Bench',
        demoGraphic: 'hyperextension',
        instructions: [
          'Position hips on pad just below hip crease so you can hinge freely.',
          'Cross arms over chest or hold a light plate. Lower torso toward the floor.',
          'Engage erectors and glutes to raise torso back into a straight line.'
        ],
        formTips: ['Raise until body is straight; do not over-hyperextend the spine.'],
        avoidMistakes: ['Jerking up quickly at the top of the range.']
      },
      {
        id: 'bird_dog_core',
        name: 'Bird-Dog Spinal Stabilization',
        primaryMuscle: 'Lower Back',
        targetMuscles: ['Lower Back', 'Glutes', 'Core'],
        difficulty: 'Beginner',
        sets: '3 sets each side',
        reps: '10–12 reps',
        restSeconds: 45,
        restText: '45s rest',
        equipment: 'Exercise Mat',
        demoGraphic: 'bird_dog',
        instructions: [
          'Start on all fours with hands under shoulders, knees under hips.',
          'Simultaneously reach your right arm straight forward and left leg straight back.',
          'Hold at full extension for 2 seconds with hips and shoulders level.',
          'Return with control and alternate sides.'
        ],
        formTips: ['Gold-standard physical therapy exercise for spinal stability.'],
        avoidMistakes: ['Arching the lower back or rotating the pelvis sideways.']
      }
    ]
  },

  // 11. GLUTES
  {
    id: 'glutes',
    name: 'Glutes',
    scientificName: 'Gluteus Maximus & Medius',
    description: 'The body’s most powerful hip extensors, the glutes drive running speed, jumping height, squatting force, and protect knees and lower back.',
    defaultView: 'back',
    tips: {
      focus: 'Hip extension & abduction power',
      equipment: 'Barbell & bench, cables, resistance bands, dumbbells',
      rest: '60–90 seconds',
      target: 'Athletic power & glute development'
    },
    exercises: [
      {
        id: 'barbell_hip_thrust',
        name: 'Barbell Hip Thrust',
        primaryMuscle: 'Glutes',
        targetMuscles: ['Glutes', 'Hamstrings'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '8–12 reps',
        restSeconds: 90,
        restText: '90s rest',
        equipment: 'Barbell, Foam Pad & Sturdy Bench',
        demoGraphic: 'hip_thrust',
        instructions: [
          'Sit on floor with upper back against bench pad, barbell with pad across hips.',
          'Plant feet flat roughly shoulder-width with shins vertical at top of lift.',
          'Drive through your heels to extend hips until thighs and torso align.',
          'Squeeze glutes hard at the top for 1 full second, then lower under control.'
        ],
        formTips: ['Keep chin tucked to chest throughout the entire motion to keep spine neutral.'],
        avoidMistakes: ['Hyperextending lower back instead of finishing with glute contraction.']
      },
      {
        id: 'bulgarian_split_squat',
        name: 'Bulgarian Split Squat',
        primaryMuscle: 'Glutes',
        targetMuscles: ['Glutes', 'Quadriceps', 'Hamstrings'],
        difficulty: 'Intermediate',
        sets: '3 sets each leg',
        reps: '10–12 reps',
        restSeconds: 75,
        restText: '75s rest',
        equipment: 'Dumbbells & Flat Bench',
        demoGraphic: 'split_squat',
        instructions: [
          'Stand facing away from bench. Elevate one rear foot onto the bench surface.',
          'Step forward so front knee stays over ankle when lowered.',
          'Lower back knee toward floor while keeping torso slightly pitched forward for glute focus.',
          'Push through front heel to return to top.'
        ],
        formTips: ['Leaning torso forward at 15–20° shifts maximum load onto the lead glute.'],
        avoidMistakes: ['Placing front foot too close to the bench, jamming the front knee.']
      }
    ]
  },

  // 12. QUADRICEPS
  {
    id: 'quadriceps',
    name: 'Quadriceps',
    scientificName: 'Quadriceps Femoris (Rectus Femoris, Vastus Medialis/Lateralis)',
    description: 'The four-headed front thigh complex extends the knee, stabilizes leg alignment, and forms the bedrock of squatting strength.',
    defaultView: 'front',
    tips: {
      focus: 'Knee extension & anterior thigh sweep',
      equipment: 'Barbell, leg press machine, dumbbells, bodyweight',
      rest: '75–120 seconds',
      target: 'Leg drive, hypertrophy & joint health'
    },
    exercises: [
      {
        id: 'barbell_back_squat',
        name: 'Barbell Back Squat',
        primaryMuscle: 'Quadriceps',
        targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Hamstrings'],
        difficulty: 'Advanced',
        sets: '3–4 sets',
        reps: '6–10 reps',
        restSeconds: 120,
        restText: '90–120s rest',
        equipment: 'Barbell & Squat Rack',
        demoGraphic: 'squat',
        instructions: [
          'Rest bar across upper traps. Unrack and take 2 clean steps back.',
          'Stand with feet slightly wider than shoulders, toes angled out 15–30 degrees.',
          'Inhale deep, brace core, and descend by breaking hips and knees simultaneously.',
          'Reach depth below parallel, then drive upward through whole foot.'
        ],
        formTips: ['Keep chest up and push knees in line with your toes throughout the descent.'],
        avoidMistakes: ['Allowing knees to cave inward (valgus collapse)', 'Rising onto toes.']
      },
      {
        id: 'goblet_squat',
        name: 'Dumbbell Goblet Squat',
        primaryMuscle: 'Quadriceps',
        targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '10–12 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Single Dumbbell or Kettlebell',
        demoGraphic: 'goblet_squat',
        instructions: [
          'Hold dumbbell vertically against your sternum with palms cupped under top plate.',
          'Descend smoothly between your thighs until elbows lightly touch inner knees.',
          'Drive through feet to stand tall, keeping dumbbell pinned against your chest.'
        ],
        formTips: ['Superb movement to master deep squat mechanics safely.'],
        avoidMistakes: ['Letting weight drift away from your chest.']
      },
      {
        id: 'leg_extension',
        name: 'Seated Leg Extension',
        primaryMuscle: 'Quadriceps',
        targetMuscles: ['Quadriceps'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '12–15 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Leg Extension Machine',
        demoGraphic: 'leg_extension',
        instructions: [
          'Adjust back pad so knees line up with the machine’s pivot point.',
          'Place shin pad just above ankles. Grip side handles firmly.',
          'Extend knees smoothly until legs are straight out in front.',
          'Pause for 1 second at top squeeze, then lower with continuous control.'
        ],
        formTips: ['Isolates the rectus femoris and vastus medialis with zero spinal compression.'],
        avoidMistakes: ['Kicking weights up rapidly using joint momentum.']
      }
    ]
  },

  // 13. HAMSTRINGS
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    scientificName: 'Biceps Femoris & Semitendinosus',
    description: 'Running down the posterior thigh, the hamstrings flex the knee, decelerate sprint strides, and extend the hips in all deadlift patterns.',
    defaultView: 'back',
    tips: {
      focus: 'Knee flexion & hip hinge strength',
      equipment: 'Barbell, dumbbells, leg curl machine',
      rest: '60–90 seconds',
      target: 'Hamstring curve, sprinting speed & knee balance'
    },
    exercises: [
      {
        id: 'romanian_deadlift',
        name: 'Dumbbell Romanian Deadlift (RDL)',
        primaryMuscle: 'Hamstrings',
        targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
        difficulty: 'Intermediate',
        sets: '3–4 sets',
        reps: '8–12 reps',
        restSeconds: 75,
        restText: '75s rest',
        equipment: 'Pair of Dumbbells or Barbell',
        demoGraphic: 'rdl',
        instructions: [
          'Stand tall with dumbbells in front of thighs, knees softly unlocked (15° bend).',
          'Push your hips straight back as if trying to touch the wall behind you.',
          'Slide dumbbells down your shins until you feel a deep hamstring stretch at mid-shin.',
          'Drive hips forward and squeeze glutes to return to standing.'
        ],
        formTips: ['Keep the bend in your knees fixed; this is a pure hip hinge, not a squat.'],
        avoidMistakes: ['Rounding the lumbar spine or allowing dumbbells to drift away from legs.']
      },
      {
        id: 'lying_leg_curl',
        name: 'Lying Hamstring Leg Curl',
        primaryMuscle: 'Hamstrings',
        targetMuscles: ['Hamstrings'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '10–14 reps',
        restSeconds: 60,
        restText: '60s rest',
        equipment: 'Lying Leg Curl Machine',
        demoGraphic: 'leg_curl',
        instructions: [
          'Lie face down with roller pad positioned just below calf bellies on Achilles.',
          'Grip handles firmly and keep hips pressed flat into the bench pad.',
          'Curl heels up toward glutes in a powerful contraction.',
          'Lower the weight smoothly over 3 seconds to full extension.'
        ],
        formTips: ['Do not allow your hips to lift off the bench during the curl.'],
        avoidMistakes: ['Arching lower back violently to complete the rep.']
      }
    ]
  },

  // 14. CALVES
  {
    id: 'calves',
    name: 'Calves',
    scientificName: 'Gastrocnemius & Soleus',
    description: 'The calf muscles plantarflex the ankle, absorb landing ground impact, and provide lower-leg athletic definition and sprint propulsion.',
    defaultView: 'back',
    tips: {
      focus: 'Gastrocnemius (standing) & soleus (seated)',
      equipment: 'Calf raise block, dumbbells, smith machine',
      rest: '45–60 seconds',
      target: 'Ankle stability, explosive pop & calf volume'
    },
    exercises: [
      {
        id: 'standing_calf_raise',
        name: 'Standing Dumbbell Calf Raise',
        primaryMuscle: 'Calves',
        targetMuscles: ['Calves'],
        difficulty: 'Beginner',
        sets: '3–4 sets',
        reps: '15–20 reps',
        restSeconds: 45,
        restText: '45s rest',
        equipment: 'Step / Block & Dumbbells',
        demoGraphic: 'standing_calf',
        instructions: [
          'Stand with balls of feet on edge of a raised block, heels hanging off.',
          'Lower heels down deep to achieve a full stretch across the Achilles tendon.',
          'Drive up onto the balls of your big toes as high as possible.',
          'Pause at peak height for 1 second before descending.'
        ],
        formTips: ['The 2-second pause at the bottom stretch eliminates elastic tendon bounce.'],
        avoidMistakes: ['Bouncing rapidly without controlled pauses.']
      },
      {
        id: 'seated_calf_raise',
        name: 'Seated Calf Raise',
        primaryMuscle: 'Calves',
        targetMuscles: ['Calves'],
        difficulty: 'Beginner',
        sets: '3 sets',
        reps: '15–20 reps',
        restSeconds: 45,
        restText: '45s rest',
        equipment: 'Seated Calf Machine or Bench + Dumbbells',
        demoGraphic: 'seated_calf',
        instructions: [
          'Sit with knees bent at 90 degrees, balls of feet on block, pad over lower thighs.',
          'Drop heels down for deep soleus stretch.',
          'Press through balls of feet to raise knees upward to peak contraction.'
        ],
        formTips: ['Knees bent at 90° isolates the soleus muscle underneath the gastrocnemius.'],
        avoidMistakes: ['Rushing the negative eccentric portion.']
      }
    ]
  }
];

export const getMuscleGroupById = (id: string): MuscleGroupInfo => {
  const found = MUSCLE_GROUPS.find((m) => m.id.toLowerCase() === id.toLowerCase());
  return found || MUSCLE_GROUPS[0];
};
