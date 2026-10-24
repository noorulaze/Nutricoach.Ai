import { Program, Trainer, MembershipPlan, FacilityZone, Testimonial, FAQItem } from '../types';

export const GYM_INFO = {
  name: 'IRONHUB FITNESS',
  slogan: 'FORGE YOUR ULTIMATE PHYSIQUE',
  phone: '+1 (800) 847-IRON',
  email: 'contact@ironhubfitness.com',
  headquarters: '742 Iron Forge Blvd, Metro Athletic District, NY 10001',
  locations: [
    {
      id: 'downtown',
      name: 'Downtown Flagship',
      address: '742 Iron Forge Blvd, Suite 100, New York, NY 10001',
      phone: '+1 (212) 555-IRON',
      hours: 'Open 24/7 (Staffed 6 AM - 11 PM)',
      sqft: '42,000 sq. ft.',
      features: ['Olympic Lifting Platforms', 'Sub-Zero Cryo Chamber', '50m Sled Turf', 'Fuel Bar']
    },
    {
      id: 'uptown',
      name: 'Uptown Performance Center',
      address: '1850 Lexington Ave, New York, NY 10029',
      phone: '+1 (212) 777-HUB1',
      hours: 'Mon-Sun: 5:00 AM - Midnight',
      sqft: '35,000 sq. ft.',
      features: ['Powerlifting Cage Matrix', 'Hydrotherapy Pool', 'Boxing Ring', 'Recovery Spa']
    },
    {
      id: 'westside',
      name: 'Westside Athletic Arena',
      address: '420 West 42nd St, New York, NY 10036',
      phone: '+1 (212) 999-HUB2',
      hours: 'Open 24/7 (Keycard Access)',
      sqft: '38,000 sq. ft.',
      features: ['Hammer Strength Arsenal', 'Biometric Testing Lab', 'Rooftop Calisthenics', 'Infrared Saunas']
    }
  ],
  stats: [
    { label: 'Active Iron Members', value: '18,500+' },
    { label: 'Olympic & Calibrated Racks', value: '48+' },
    { label: 'Elite Master Coaches', value: '36' },
    { label: 'Pounds of Steel & Iron', value: '120k lbs' },
    { label: 'Member Goal Success Rate', value: '99.4%' },
  ]
};

export const PROGRAMS: Program[] = [
  {
    id: 'titan-hypertrophy',
    title: 'Titan Hypertrophy Matrix',
    category: 'Hypertrophy',
    tagline: 'Scientific muscle building protocol utilizing high tension & progressive overload',
    description: 'Designed for serious lifters seeking maximum muscular development and density. Combines mechanical tension, metabolic stress, and calculated deload cycles backed by neuromuscular science.',
    intensity: 5,
    durationWeeks: 12,
    sessionsPerWeek: 5,
    targetFocus: 'Maximum Muscle Mass & Symmetry',
    coach: 'Marcus "Valkyrie" Vance',
    coachRole: 'IFBB Pro & Head of Hypertrophy',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Periodized Push/Pull/Legs high-stimulus split',
      'In-app 1RM percentage calculator and logging',
      'Personalized intra-workout nutrition blueprint',
      'Weekly coach video review of compound lift mechanics',
      'Hypertrophy stimulus-to-fatigue ratio optimization'
    ],
    curriculum: [
      { phase: 'Phase 1: Foundation & Density', focus: 'Establishing neurological mind-muscle connection & volume baseline', duration: 'Weeks 1-4' },
      { phase: 'Phase 2: Mechanical Overload', focus: 'Heavy compound multi-joint loading (80-88% 1RM) with RPE 8-9 targets', duration: 'Weeks 5-8' },
      { phase: 'Phase 3: Peak Vascular Sarcoplasm', focus: 'Blood flow restriction & high density dropsets for maximum hypertrophy', duration: 'Weeks 9-12' }
    ],
    caloriesBurnEstimate: '550 - 750 kcal/session',
    difficulty: 'Advanced'
  },
  {
    id: 'iron-barbell-power',
    title: 'Iron Powerlifting Protocol',
    category: 'Strength',
    tagline: 'Raw kinetic strength designed to shatter your Squat, Bench, and Deadlift ceilings',
    description: 'Master the big three lifts with Olympic-calibrated Eleiko barbells and calibrated steel plates. Build unbreakable core stability, explosive hip drive, and impenetrable tendon strength.',
    intensity: 5,
    durationWeeks: 10,
    sessionsPerWeek: 4,
    targetFocus: 'Maximum 1RM Strength & Central Nervous System Drive',
    coach: 'Dmitri "The Anvil" Volkov',
    coachRole: 'USAPL National Champion & Strength Director',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Conjugate & Linear Periodization blending',
      'Velocity-based barbell tracking sensors access',
      'Custom chalk, belt, and wrap fitting analysis',
      'Deadlift deficit & chain resistance protocols',
      'Meet simulation mock meet with certified judges'
    ],
    curriculum: [
      { phase: 'Phase 1: Volume Accumulation', focus: 'Submaximal volume to build kinetic groove and work capacity', duration: 'Weeks 1-3' },
      { phase: 'Phase 2: Neuromuscular Transmutation', focus: 'Triples and doubles at 88-94% with paused variations', duration: 'Weeks 4-7' },
      { phase: 'Phase 3: The Taper & 1RM Peak', focus: 'CNS recovery, singles at 95%+, peaking for record attempts', duration: 'Weeks 8-10' }
    ],
    caloriesBurnEstimate: '450 - 650 kcal/session',
    difficulty: 'Advanced'
  },
  {
    id: 'metabolic-shred-hiit',
    title: 'Metabolic Shred & Conditioning',
    category: 'HIIT',
    tagline: 'High-octane anaerobic intervals to torch fat while preserving hard-earned lean muscle',
    description: 'Utilizing curved Woodway treadmills, Concept2 rowers, SkiErgs, assault bikes, and kettlebell complexes. Skyrocket VO2 max and stimulate EPOC for post-exercise caloric burn up to 36 hours.',
    intensity: 4,
    durationWeeks: 8,
    sessionsPerWeek: 4,
    targetFocus: 'Rapid Fat Oxidation & Cardiovascular Conditioning',
    coach: 'Elena Rostova',
    coachRole: 'Tier 3 Conditioning Specialist & Ex-Track Athlete',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Heart-rate telemetry monitored on studio screens',
      'Contrast intervals (Tabata, EMOM, AMRAP)',
      'Plyometric power development for explosiveness',
      'Targeted lactate-threshold buffering drills',
      'Body composition DEXA scan at start and conclusion'
    ],
    curriculum: [
      { phase: 'Phase 1: Aerobic Base & Lactate Threshold', focus: 'Engine building and anaerobic recovery pacing', duration: 'Weeks 1-2' },
      { phase: 'Phase 2: Sprint-Interval Acceleration', focus: 'Peak heart rate zone 4-5 micro-bursts', duration: 'Weeks 3-5' },
      { phase: 'Phase 3: The Inferno Finisher', focus: 'High density circuit complexes with minimal rest', duration: 'Weeks 6-8' }
    ],
    caloriesBurnEstimate: '700 - 950 kcal/session',
    difficulty: 'All Levels'
  },
  {
    id: 'athletic-performance-hybrid',
    title: 'Apex Tactical Athlete',
    category: 'Athletics',
    tagline: 'Develop speed, rotational power, agility, and elite deceleration capacity',
    description: 'Trained like tier-1 athletes and combat sport competitors. Features multi-planar medicine ball throws, sled prowler pushes, hex bar jumps, and reactive agility drills.',
    intensity: 4,
    durationWeeks: 12,
    sessionsPerWeek: 4,
    targetFocus: 'Power Output, Multidirectional Speed, Durability',
    coach: 'Jaxson Reed',
    coachRole: 'CSCS, Tactical Conditioning Specialist',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
    features: [
      '50m indoor turf drills with digital timing gates',
      'Rotational power training with Keiser pneumatic cable systems',
      'Anti-rotational core stabilization protocols',
      'Deceleration mechanics for injury prevention',
      'Agility ladder and reactive optical reaction pods'
    ],
    curriculum: [
      { phase: 'Phase 1: Force Absorption & Kinetic Linkage', focus: 'Landing mechanics and unilateral balance', duration: 'Weeks 1-4' },
      { phase: 'Phase 2: Explosive Rate of Force Development', focus: 'Olympic clean pulls and sled sprint acceleration', duration: 'Weeks 5-8' },
      { phase: 'Phase 3: Game-Speed Agility & Chaos Drills', focus: 'Reactive change of direction under acute fatigue', duration: 'Weeks 9-12' }
    ],
    caloriesBurnEstimate: '600 - 800 kcal/session',
    difficulty: 'Intermediate'
  },
  {
    id: 'valkyrie-womens-sculpt',
    title: 'Valkyrie Women’s Strength & Glute Lab',
    category: 'Women',
    tagline: 'Heavy barbell hip thrusts, posterior chain hypertrophy, and sculpted athletic posture',
    description: 'A scientifically engineered barbell program focused on glute development, back taper, waist tightening, and empowering strength without bulky burnout.',
    intensity: 4,
    durationWeeks: 10,
    sessionsPerWeek: 4,
    targetFocus: 'Glute Hypertrophy, Posterior Chain, Athletic Definition',
    coach: 'Sienna Sterling',
    coachRole: 'Glute Biomechanics Specialist & NASM-CPT',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Glute Drive & Booty Builder dedicated machine circuits',
      'Hip internal/external rotation activation warmups',
      'Postural thoracic spine strengthening for upright poise',
      'Progressive RPE barbell hip thrust progression',
      'Female hormone & menstrual phase training adaptation'
    ],
    curriculum: [
      { phase: 'Phase 1: Neuromuscular Glute Activation', focus: 'Waking dormant motor units and mind-muscle connection', duration: 'Weeks 1-3' },
      { phase: 'Phase 2: Progressive Overload & Mechanical Strain', focus: 'Heavy 6-10 rep range hip thrusts, RDLs, Bulgarian split squats', duration: 'Weeks 4-7' },
      { phase: 'Phase 3: Constant Tension Sarcoplasmic Pump', focus: 'Banded drop sets, abduction pyramids, and finisher burns', duration: 'Weeks 8-10' }
    ],
    caloriesBurnEstimate: '500 - 700 kcal/session',
    difficulty: 'All Levels'
  },
  {
    id: 'bio-recovery-mobility',
    title: 'Bio-Recovery & Joint Mobility Sanctuary',
    category: 'Recovery',
    tagline: 'Rebuild connective tissue, optimize nervous system parasympathetic tone, and eliminate pain',
    description: 'Combining functional range conditioning (FRC), infrared thermal sauna therapy, cold water immersion protocols, and active myofascial release for rapid tissue restoration.',
    intensity: 2,
    durationWeeks: 6,
    sessionsPerWeek: 3,
    targetFocus: 'Joint Longevity, Fascial Decompression, Central Nervous System Reset',
    coach: 'Dr. Aaron Chen, DPT',
    coachRole: 'Doctor of Physical Therapy & Recovery Specialist',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
    features: [
      'Access to Finnish dry saunas and 42°F sub-zero cold plunge tubs',
      'Normatec 3 pneumatic compression boots sessions',
      'Controlled articular rotations (CARs) for joint health',
      'Breathwork and vagus nerve stimulation coaching',
      'Theragun PRO percussive therapy stations'
    ],
    curriculum: [
      { phase: 'Phase 1: Decompress & Release', focus: 'Spine traction and hip flexor inhibition release', duration: 'Weeks 1-2' },
      { phase: 'Phase 2: Active Joint Capsule Mobility', focus: 'End-range isometric strength at deep joint angles', duration: 'Weeks 3-4' },
      { phase: 'Phase 3: Full-Chain Dynamic Integration', focus: 'Restoring functional locomotion and painless movement', duration: 'Weeks 5-6' }
    ],
    caloriesBurnEstimate: '250 - 350 kcal/session',
    difficulty: 'Beginner'
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus "Valkyrie" Vance',
    role: 'Head of Bodybuilding & Hypertrophy',
    specialty: 'Maximal Muscle Hypertrophy & Contest Prep',
    category: 'Master',
    experienceYears: 14,
    bio: 'Former IFBB Classic Physique competitor with over a decade of coaching Olympians, powerlifters, and transformation champions. Specializes in biomechanical tension curves and zero-wasted-effort training.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=1000&q=80',
    certifications: ['IFBB Pro Card Holder', 'CSCS Certified', 'Precision Nutrition Level 2'],
    achievements: ['Coached 24 IFBB Pro Card Earners', 'Over 1,200 successful client body transformations', 'Featured in Muscle & Fitness 2024'],
    quote: 'The weight does not know what your excuses are. Every millimeter of growth is earned in the fire.',
    rating: 4.98,
    reviewCount: 214,
    clientsTrained: 890,
    socials: { instagram: '@marcus_ironhub', youtube: 'MarcusVanceIron', twitter: '@marcusvance' }
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Director of Metabolic Conditioning',
    specialty: 'High Intensity Intervals & Fat Shredding',
    category: 'Conditioning',
    experienceYears: 9,
    bio: 'Former Olympic-track sprinter and elite obstacle course champion. Elena brings relentless energy and precise physiological science to ignite cardiovascular engines and build unmatched mental resilience.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80',
    certifications: ['EXOS Performance Specialist', 'NASM Master Trainer', 'Oxygen Advantage Coach'],
    achievements: ['National Masters 400m Silver Medalist', 'Created the 8-Week Iron Inferno Protocol', 'Trained 450+ marathon and HYROX finishers'],
    quote: 'Comfort is the poison of champions. Breathe through the burn and claim your standard.',
    rating: 4.96,
    reviewCount: 188,
    clientsTrained: 640,
    socials: { instagram: '@elena_shred', youtube: 'ElenaConditioning' }
  },
  {
    id: 'dmitri-volkov',
    name: 'Dmitri "The Anvil" Volkov',
    role: 'Head Strength & Powerlifting Coach',
    specialty: 'Barbell Dynamics, 1RM Peaking, Spinal Biomechanics',
    category: 'Strength',
    experienceYears: 16,
    bio: 'With an 825 lb raw squat and a 780 lb raw deadlift, Dmitri has coached world-record holding powerlifters and collegiate football linemen. He demands uncompromising barbell technique and mental fortitude.',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1000&q=80',
    certifications: ['USAPL Senior International Coach', 'IPF Master Referee', 'B.S. Exercise Physiology'],
    achievements: ['Raw Total 2,150 lbs at 242 lbs class', 'Coached 5 World IPF Powerlifting Champions', 'Over 200 athletes coached to 500+ lb deadlifts'],
    quote: 'Discipline is doing what you hate to do, but doing it like you love it until the iron bends to your will.',
    rating: 4.99,
    reviewCount: 310,
    clientsTrained: 1100,
    socials: { instagram: '@dmitri_theanvil', twitter: '@dmitrivolkov' }
  },
  {
    id: 'sienna-sterling',
    name: 'Sienna Sterling',
    role: 'Lead Female Physique Specialist',
    specialty: 'Glute Biomechanics & Athletic Waist Sculpting',
    category: 'Master',
    experienceYears: 8,
    bio: 'Biomechanics authority known worldwide for her data-backed approach to female muscle architecture and glute hypertrophy. Sienna eliminates fad training to build fierce, strong, athletic physiques.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=80',
    certifications: ['NASM-CPT, CES', 'Certified Glute Specialist', 'Pre & Postnatal Fitness Coach'],
    achievements: ['Keynote Speaker at National Strength Expo', 'Authored The Glute Architecture Blueprint', 'Over 700 women coached to deadlift 2x bodyweight'],
    quote: 'Strong women don’t shrink into spaces; we build power that commands the room.',
    rating: 4.97,
    reviewCount: 265,
    clientsTrained: 780,
    socials: { instagram: '@sienna_ironsculpt', youtube: 'SiennaSterlingFit' }
  },
  {
    id: 'dr-aaron-chen',
    name: 'Dr. Aaron Chen, DPT',
    role: 'Director of Sports Medicine & Bio-Recovery',
    specialty: 'Injury Rehabilitation, Fascial Mobility & Cryotherapy',
    category: 'Rehab',
    experienceYears: 12,
    bio: 'Doctor of Physical Therapy and former orthopedic consultant for Olympic weightlifters. Dr. Chen integrates musculoskeletal ultrasound, dry needling, and thermal protocols to keep lifters pain-free and unstoppable.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80',
    certifications: ['Doctor of Physical Therapy (DPT)', 'FRC Mobility Specialist (FRCms)', 'Dry Needling Certified Level 2'],
    achievements: ['Rehabilitated 500+ post-op ACL and rotator cuff athletes', 'Designed the IronHub Cold-Heat Thermal Protocol', 'Advisory board member for American Journal of Sports Physio'],
    quote: 'Longevity is your greatest performance enhancer. Treat your recovery with the same ferocity as your training.',
    rating: 5.0,
    reviewCount: 195,
    clientsTrained: 520,
    socials: { instagram: '@dr_aaron_chen', twitter: '@aaronchendpt' }
  },
  {
    id: 'jaxson-reed',
    name: 'Jaxson Reed',
    role: 'Head of Tactical & Hybrid Athleticism',
    specialty: 'Rotational Power, Unilateral Athletics & Sprinting',
    category: 'Conditioning',
    experienceYears: 11,
    bio: 'Former collegiate decathlete and tactical trainer for emergency service personnel. Jaxson bridges the gap between raw barbell power and fluid, lightning-fast athletic movement in all 3 planes.',
    image: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=1000&q=80',
    certifications: ['NSCA-CSCS', 'USA Weightlifting Level 2', 'Functional Movement Systems (FMS)'],
    achievements: ['Trained 30+ NCAA Division I athletes', '4.41s 40-yard dash record holder', 'Creator of the Apex Tactical Conditioning Series'],
    quote: 'Don’t just look like an athlete on the beach. Move like a predator on the field.',
    rating: 4.95,
    reviewCount: 160,
    clientsTrained: 490,
    socials: { instagram: '@jaxson_tactical' }
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'iron-basic',
    name: 'IRON BASIC',
    badge: 'CORE ACCESS',
    tagline: 'Pure, unadulterated access to our world-class gym floor and heavy steel equipment.',
    monthlyPrice: 49,
    annualPricePerMonth: 39,
    popular: false,
    idealFor: 'Self-guided lifters who need top-tier equipment and zero fluff.',
    highlightPerks: [
      'Unlimited gym floor access during all operating hours',
      'Full access to heavy iron, dumbbells up to 150 lbs, & racks',
      'Luxury locker rooms with rainfall showers & saunas',
      'IronHub mobile workout tracker & QR check-in'
    ],
    features: [
      { name: 'Gym Floor & Free Weights Access', included: true },
      { name: 'Calibrated Barbells & Heavy Racks', included: true },
      { name: 'Cardio & Turf Zone Access', included: true },
      { name: 'Luxury Locker Room & Rainfall Showers', included: true },
      { name: 'IronHub Mobile Training App', included: true },
      { name: 'Dry Sauna Access', included: true },
      { name: 'Group Classes & HIIT Sessions', included: false },
      { name: 'Sub-Zero Cold Plunge Access', included: false },
      { name: 'Free Monthly 1-on-1 Personal Training', included: false },
      { name: '24/7 All-Location Access Keycard', included: false },
      { name: 'Infrared Recovery Pods', included: false },
      { name: 'Guest Passes Every Month', included: false },
      { name: 'VIP Fuel Bar 20% Discount', included: false }
    ]
  },
  {
    id: 'iron-pro',
    name: 'IRON PRO',
    badge: 'MOST POPULAR',
    tagline: 'The complete training experience with unlimited high-energy classes and recovery amenities.',
    monthlyPrice: 89,
    annualPricePerMonth: 69,
    popular: true,
    idealFor: 'Dedicated fitness enthusiasts who want elite classes, community, and recovery.',
    highlightPerks: [
      'Unlimited access to ALL Group Classes & HIIT sessions',
      'Cold Plunge & Contrast Therapy recovery suite access',
      '2 Free Personal Training Sessions per month included',
      'All 3 IronHub Metro Location privileges'
    ],
    features: [
      { name: 'Gym Floor & Free Weights Access', included: true },
      { name: 'Calibrated Barbells & Heavy Racks', included: true },
      { name: 'Cardio & Turf Zone Access', included: true },
      { name: 'Luxury Locker Room & Rainfall Showers', included: true },
      { name: 'IronHub Mobile Training App', included: true },
      { name: 'Dry Sauna Access', included: true },
      { name: 'Group Classes & HIIT Sessions', included: true },
      { name: 'Sub-Zero Cold Plunge Access', included: true },
      { name: 'Free Monthly 1-on-1 Personal Training', included: true },
      { name: '24/7 All-Location Access Keycard', included: true },
      { name: 'Infrared Recovery Pods', included: false },
      { name: 'Guest Passes Every Month (2 Passes)', included: true },
      { name: 'VIP Fuel Bar 10% Discount', included: true }
    ]
  },
  {
    id: 'iron-elite-black',
    name: 'IRON ELITE BLACK',
    badge: 'VIP EXECUTIVE',
    tagline: 'The ultimate pinnacle of athletic luxury, personalized science, and total bio-optimization.',
    monthlyPrice: 149,
    annualPricePerMonth: 119,
    popular: false,
    idealFor: 'Executives, competitive lifters, and athletes who demand the absolute highest standard.',
    highlightPerks: [
      '24/7 Unrestricted VIP Keycard across all global locations',
      'Weekly 1-on-1 Master Trainer coaching session included',
      'Unlimited Sub-Zero Cryotherapy, Infrared, & Hyperbaric oxygen',
      'Dedicated personal permanent locker & complimentary laundry'
    ],
    features: [
      { name: 'Gym Floor & Free Weights Access', included: true },
      { name: 'Calibrated Barbells & Heavy Racks', included: true },
      { name: 'Cardio & Turf Zone Access', included: true },
      { name: 'Luxury Locker Room & Rainfall Showers', included: true },
      { name: 'IronHub Mobile Training App', included: true },
      { name: 'Dry Sauna Access', included: true },
      { name: 'Group Classes & HIIT Sessions', included: true },
      { name: 'Sub-Zero Cold Plunge Access', included: true },
      { name: 'Weekly 1-on-1 Master Trainer Sessions', included: true },
      { name: '24/7 All-Location Access Keycard', included: true },
      { name: 'Infrared Recovery Pods & Hyperbaric Oxygen', included: true },
      { name: 'Unlimited VIP Guest Passes', included: true },
      { name: 'Complimentary Fuel Bar Shakes & 25% Pro-Shop Discount', included: true }
    ]
  }
];

export const FACILITIES: FacilityZone[] = [
  {
    id: 'heavy-iron-arsenal',
    name: 'Heavy Iron & Olympic Arena',
    subtitle: 'Where steel meets pure will',
    sqft: '14,000 sq. ft.',
    description: 'Outfitted with 16 custom Rogue Monster Power Racks, Eleiko Olympic bumper plates, Watson specialty dumbbells scaling to 150 lbs, and competition deadlift platforms.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    equipmentHighlights: [
      '16 Rogue Monster Racks with safety straps & monolifts',
      'Watson rotating handle dumbbells from 5 lbs to 150 lbs',
      '6 Eleiko IPF-certified competition powerlifting benches',
      'Reverse Hyperextensions & Westside Barbell Inverse Curls',
      'Full lineup of Hammer Strength Plate-Loaded isolateral machines'
    ],
    amenities: ['Magnesium Chalk Stations', 'Barbell Jack stands', 'Banded resistance pegs', 'Deadlift deadening drop mats'],
    hours: '24/7 Open Access'
  },
  {
    id: 'cardio-metabolic-theater',
    name: 'Metabolic & Cardio Theater',
    subtitle: 'High-altitude simulation & kinetic endurance',
    sqft: '8,500 sq. ft.',
    description: 'Curved Woodway non-motorized treadmills, Concept2 RowErgs and SkiErgs, StairMaster Gauntlets, and stadium-grade sound systems engineered for high output.',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
    equipmentHighlights: [
      '20 Woodway Curve motorless natural kinetic treadmills',
      '12 Concept2 RowErgs with PM5 performance monitors',
      '8 Concept2 SkiErgs on floor stands',
      '14 Assault AirBikes with high-wattage resistance',
      '10 StairMaster 10G Gauntlet stepmills with OverDrive training'
    ],
    amenities: ['Heart Rate Live Telemetry', 'Wireless charging docks', 'Filtered chilled water stations', 'Disinfectant mist towers'],
    hours: '24/7 Open Access'
  },
  {
    id: 'turf-tactical-zone',
    name: '50-Meter Performance Turf Track',
    subtitle: 'Sprint, sled, throw, and dominate',
    sqft: '7,500 sq. ft.',
    description: 'Commercial sprint turf designed for sled pushes, prowler drag sprints, medicine ball slams against reinforced concrete ballistic walls, and heavy tire flips.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    equipmentHighlights: [
      '50-meter seamless high-density indoor sprint turf',
      'Heavy-duty Torque Fitness tank sleds & Dog Sleds',
      'Ballistic Kevlar medicine balls (10 lbs to 50 lbs)',
      '100-foot battle ropes and Olympic gymnastics rings rig',
      'Commercial tractor tires (300 lb, 500 lb, 750 lb)'
    ],
    amenities: ['Laser timing gates for 40-yd dash', 'Agility cones & hurdle sets', 'Pliable crash mats'],
    hours: '24/7 Open Access'
  },
  {
    id: 'bio-recovery-sanctuary',
    name: 'Bio-Recovery & Cryo Sanctuary',
    subtitle: 'Accelerated rejuvenation & autonomic reset',
    sqft: '6,000 sq. ft.',
    description: 'An oasis of athletic restoration featuring 42°F sub-zero cold plunge tubs, custom cedar Finnish saunas at 195°F, infrared red-light booths, and Normatec air compression suits.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    equipmentHighlights: [
      '4 Plunge Pro commercial cold plunge tubs (filtered 40-45°F)',
      '2 Custom Western Red Cedar Finnish dry saunas (up to 200°F)',
      'Full-body medical-grade Red Light Therapy panels (660nm & 850nm)',
      '6 Normatec 3 pneumatic compression leg/arm/hip stations',
      'Hyperbaric mild oxygen chamber for cellular repair'
    ],
    amenities: ['Eucalyptus infused chilled towels', 'Private change suites', 'Hydration electrolyte fountain', 'Low-ambient soundscape'],
    hours: '6:00 AM - 11:00 PM Daily'
  },
  {
    id: 'fuel-bar-lounge',
    name: 'The Fuel Bar & Executive Lounge',
    subtitle: 'Post-workout biological optimization',
    sqft: '6,000 sq. ft.',
    description: 'Chef-crafted high-protein smoothies, cold-pressed juices, espresso bar, and high-speed Wi-Fi lounge where members can work, network, and recharge.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    equipmentHighlights: [
      'Made-to-order grass-fed whey and vegan isolate smoothies',
      'Artisanal espresso and single-origin cold brew on tap',
      'Macro-balanced pre-packaged chef meals to go',
      'Supplement dispensary (creatine, EAAs, electrolytes)',
      'Executive workstations with gigabit fiber and private booths'
    ],
    amenities: ['Complimentary high-speed Wi-Fi', 'USB-C ultra-fast charging at every booth', 'Air purification systems'],
    hours: '6:00 AM - 10:00 PM Daily'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'jordan-k',
    name: 'Jordan Keller',
    age: 32,
    profession: 'Software Architect',
    category: 'Fat Loss',
    achievement: 'Dropped 42 lbs of fat while adding 15 lbs of lean mass',
    quote: 'Before IronHub, I was working 14 hours a day glued to a monitor with constant back spasms. The coaches didn’t just give me workouts; they engineered an entire lifestyle transformation. IronHub feels like training in an Olympic facility designed for superheroes.',
    duration: '8 Months',
    trainer: 'Elena Rostova & Marcus Vance',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Weight', value: '-42 lbs' },
      { label: 'Body Fat', value: '31% → 14%' },
      { label: 'Deadlift', value: '185 → 405 lbs' }
    ],
    rating: 5
  },
  {
    id: 'sarah-m',
    name: 'Sarah Mitchell',
    age: 29,
    profession: 'Emergency Room Physician',
    category: 'Strength',
    achievement: 'Overcame chronic knee pain & hit 315 lb Squat PR',
    quote: 'As an ER doctor, I need raw energy and mental clarity under extreme pressure. Training in the Iron Arena has made me physically unbreakable. The coaching staff is in a league of their own compared to any generic luxury gym.',
    duration: '1 Year',
    trainer: 'Dmitri Volkov',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Squat', value: '135 → 315 lbs' },
      { label: 'Bench Press', value: '95 → 185 lbs' },
      { label: 'Resting HR', value: '72 → 51 bpm' }
    ],
    rating: 5
  },
  {
    id: 'david-c',
    name: 'David Sterling',
    age: 41,
    profession: 'Private Equity Managing Director',
    category: 'Hypertrophy',
    achievement: 'Built 22 lbs of muscle & reversed pre-diabetes',
    quote: 'At age 40, my doctors warned me about metabolic markers. Joining IronHub on the Elite Black membership changed my destiny. The cold plunges, biometric testing, and Marcus’s programming gave me the physique I dreamed of in my twenties.',
    duration: '14 Months',
    trainer: 'Marcus Vance',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Lean Mass', value: '+22 lbs' },
      { label: 'HbA1c', value: '6.1 → 5.2' },
      { label: 'Energy Score', value: '10/10' }
    ],
    rating: 5
  },
  {
    id: 'maya-t',
    name: 'Maya Torres',
    age: 26,
    profession: 'Professional Contemporary Dancer',
    category: 'Rehab',
    achievement: 'Fully rehabbed torn meniscus & returned to stage',
    quote: 'When orthopedic surgeons told me my dance career was at risk, Dr. Aaron Chen and the recovery sanctuary saved my livelihood. The infrared saunas, FRC mobility, and guided strength work brought me back stronger than ever.',
    duration: '6 Months',
    trainer: 'Dr. Aaron Chen, DPT',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Knee Flexion', value: 'Full 100%' },
      { label: 'Jump Height', value: '+6 inches' },
      { label: 'Pain Level', value: '8/10 → 0/10' }
    ],
    rating: 5
  },
  {
    id: 'brandon-w',
    name: 'Brandon Cole',
    age: 35,
    profession: 'Former College Football Safety',
    category: 'Strength',
    achievement: 'Joined the 1,500 lb Powerlifting Total Club',
    quote: 'You can tell this gym was built by lifters who respect the iron. The calibrated Eleiko plates, the chalk allowed everywhere, and Dmitri’s eye for barbell kinematics are unmatched on the East Coast.',
    duration: '2 Years',
    trainer: 'Dmitri Volkov',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Total', value: '1,535 lbs' },
      { label: 'Squat', value: '550 lbs' },
      { label: 'Deadlift', value: '605 lbs' }
    ],
    rating: 5
  },
  {
    id: 'chloe-b',
    name: 'Chloe Bennett',
    age: 31,
    profession: 'Brand Strategist & Mom of Two',
    category: 'Fat Loss',
    achievement: 'Lost 35 lbs post-pregnancy & regained athletic confidence',
    quote: 'Sienna and the Valkyrie program gave me back my athletic identity. IronHub is welcoming, intense, clean, and completely devoid of creepy commercial gym attitudes. It’s my sacred temple every morning at 6 AM.',
    duration: '9 Months',
    trainer: 'Sienna Sterling',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    stats: [
      { label: 'Waist Size', value: '-7 inches' },
      { label: 'Hip Thrust', value: '135 → 335 lbs' },
      { label: 'Self Confidence', value: 'Sky High' }
    ],
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How do I claim my Free 1-Day VIP Pass?',
    answer: 'Simply click "Claim Free Pass" anywhere on our site, choose your preferred flagship location, and select your date. We will send an instant digital barcode to your email and SMS. Show it at the front desk for full VIP access including lockers and recovery amenities.',
    category: 'Membership'
  },
  {
    question: 'Are memberships locked into long-term contracts?',
    answer: 'No. All our monthly plans operate on transparent month-to-month terms with a simple 30-day cancellation notice. Our annual membership offers a 20% discount plus zero initiation fee if you choose to commit for a full year of transformation.',
    category: 'Membership'
  },
  {
    question: 'What are your operating hours and staffed hours?',
    answer: 'Downtown and Westside locations are open 24/7, 365 days a year with secure biometric keycard access. Uptown is open 5:00 AM to midnight daily. Professional staff and personal trainers are on deck from 6:00 AM to 11:00 PM.',
    category: 'General'
  },
  {
    question: 'Is chalk allowed, and what is your policy on heavy deadlifts?',
    answer: 'Absolutely. We provide high-grade magnesium chalk blocks at every platform and rack. Dropping calibrated bumpers and heavy deadlifts are celebrated on our shock-absorbent acoustic drop platforms.',
    category: 'Training'
  },
  {
    question: 'Can I freeze my membership if I travel or sustain an injury?',
    answer: 'Yes! Members can freeze their account for up to 3 months per calendar year with zero maintenance fees via the IronHub mobile member portal or through our concierge desk.',
    category: 'Membership'
  },
  {
    question: 'Are personal training sessions included in the membership?',
    answer: 'IRON PRO includes 2 complimentary personal coaching sessions every month. IRON ELITE BLACK includes weekly 1-on-1 sessions with our Master Coaches. Additional private training packs can be booked directly through our trainers.',
    category: 'Coaching'
  },
  {
    question: 'Do you offer guest privileges?',
    answer: 'IRON PRO members receive 2 complimentary guest passes per month. IRON ELITE BLACK members enjoy unlimited VIP guest privileges (1 guest per visit).',
    category: 'Membership'
  },
  {
    question: 'What hygiene and recovery standards do you maintain?',
    answer: 'We utilize hospital-grade UV-C sterilization systems in all air ducts and 24/7 antimicrobial filtration. Cold plunge water passes through triple ozone and 5-micron sediment filtration with automated temperature control checked every hour.',
    category: 'Facilities'
  }
];
