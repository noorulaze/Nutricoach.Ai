import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Dumbbell, 
  Utensils, Target, Flame, Heart, Activity, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  GoalType, ExperienceLevel, ActivityLevel, 
  EquipmentType, DietType, BudgetTier 
} from '../types';
import { calculateBMR, calculateTDEE, calculateTargets } from '../utils/storage';
import ThemeToggle from '../components/ThemeToggle';
import NutriCoachLogo from '../components/NutriCoachLogo';

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Body Metrics & Goals
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [goal, setGoal] = useState<GoalType>('muscle_gain');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Step 2: Training Split & Equipment
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate');
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentType>('full_gym');
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState<number>(4);
  const [preferredWorkoutDurationMin, setPreferredWorkoutDurationMin] = useState<number>(45);

  // Step 3: Nutrition, Budget & Allergies
  const [dietType, setDietType] = useState<DietType>('omnivore');
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [allergies, setAllergies] = useState<string[]>([]);

  const ALLERGEN_OPTIONS = ['Gluten', 'Dairy', 'Peanuts', 'Tree Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish'];

  const toggleAllergy = (item: string) => {
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Live calculation of Mifflin-St Jeor targets
  const liveBMR = calculateBMR(weightKg, heightCm, age, gender);
  const liveTDEE = calculateTDEE(liveBMR, activityLevel);
  const liveTargets = calculateTargets(liveTDEE, weightKg, goal);

  const handleFinishOnboarding = () => {
    completeOnboarding({
      age,
      gender,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      experienceLevel,
      availableEquipment,
      trainingDaysPerWeek,
      preferredWorkoutDurationMin,
      dietType,
      budget,
      allergies
    });

    showToast('Your personalized NutriCoach profile has been generated!', 'success', 'Profile Created');
    navigate('/', { replace: true });
  };

  const handleSkip = () => {
    completeOnboarding({});
    showToast('Applied standard baseline targets', 'info');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-[#192418] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between selection:bg-[#5ba83c]/20">
      <div className="max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8ede6]">
          <div className="flex flex-col">
            <NutriCoachLogo size="md" />
            <span className="block text-xs text-[#7a8c79] font-medium mt-1">
              First-Time Profile Setup • Welcome {user?.name || ''}
            </span>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <ThemeToggle variant="pill" />
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-[#7a8c79] hover:text-[#192418] font-bold hover:underline"
            >
              Skip for now & use defaults →
            </button>
          </div>
        </div>

        {/* Step Progression Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 1 
                ? 'bg-[#eef7eb] border-[#5ba83c] text-[#192418] shadow-xs' 
                : currentStep > 1 
                ? 'bg-white border-[#d6ebd0] text-[#3b7e23]' 
                : 'bg-white border-[#e8ede6] text-[#7a8c79]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#3b7e23]">Step 1</span>
              {currentStep > 1 && <Check className="w-3.5 h-3.5 text-[#3b7e23]" />}
            </div>
            <span className="text-xs font-bold text-[#192418] block mt-0.5">Biometrics & Goals</span>
          </div>

          <div 
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 2 
                ? 'bg-[#eef7eb] border-[#5ba83c] text-[#192418] shadow-xs' 
                : currentStep > 2 
                ? 'bg-white border-[#d6ebd0] text-[#3b7e23]' 
                : 'bg-white border-[#e8ede6] text-[#7a8c79]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#3b7e23]">Step 2</span>
              {currentStep > 2 && <Check className="w-3.5 h-3.5 text-[#3b7e23]" />}
            </div>
            <span className="text-xs font-bold text-[#192418] block mt-0.5">Training & Gear</span>
          </div>

          <div 
            className={`p-3.5 rounded-2xl border transition-all ${
              currentStep === 3 
                ? 'bg-[#eef7eb] border-[#5ba83c] text-[#192418] shadow-xs' 
                : 'bg-white border-[#e8ede6] text-[#7a8c79]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#3b7e23]">Step 3</span>
            </div>
            <span className="text-xs font-bold text-[#192418] block mt-0.5">Diet & Nutrition</span>
          </div>
        </div>

        {/* STEP CONTENT CARDS */}
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* STEP 1: Body Metrics & Goals */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
                  PHYSIOLOGICAL BASELINE
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#192418]">
                  Tell us about your body and your main objective
                </h2>
                <p className="text-xs sm:text-sm text-[#5e6f5e] mt-1 font-medium">
                  We use the Mifflin-St Jeor equation to compute your metabolic baseline.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="95"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs sm:text-sm text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Gender (for BMR)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs sm:text-sm text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Height (CM)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="230"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs sm:text-sm text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Current Weight (KG)
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="220"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs sm:text-sm text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Goal Selector */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase mb-2">
                  Primary Fitness Target
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'fat_loss', label: 'Fat Loss', desc: 'Caloric deficit (-450 kcal) to burn fat while preserving muscle mass.' },
                    { key: 'muscle_gain', label: 'Lean Muscle Hypertrophy', desc: 'Moderate surplus (+300 kcal) with high protein for progressive muscle growth.' },
                    { key: 'maintenance', label: 'Recomposition / Maintenance', desc: 'Even caloric balance to improve body composition and sustain current weight.' },
                    { key: 'strength', label: 'Raw Strength & Power', desc: 'Solid fueling for heavy multi-joint compound barbell progression.' },
                    { key: 'athletic_performance', label: 'Conditioning & Athleticism', desc: 'High energy availability for sports agility and endurance.' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setGoal(item.key as GoalType)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        goal === item.key
                          ? 'bg-[#eef7eb] border-[#5ba83c] shadow-xs'
                          : 'bg-white border-[#e8ede6] hover:border-[#cbd7c8]'
                      }`}
                    >
                      <h4 className="font-extrabold text-sm text-[#192418]">{item.label}</h4>
                      <p className="text-[11px] text-[#5e6f5e] mt-1 leading-relaxed font-medium">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                  Daily Baseline Activity
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs sm:text-sm text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
                >
                  <option value="sedentary">Sedentary (Desk work, little physical movement)</option>
                  <option value="light">Lightly Active (1-3 light workout days/wk)</option>
                  <option value="moderate">Moderately Active (3-5 strength or conditioning sessions/wk)</option>
                  <option value="very_active">Very Active (6-7 intense training days/wk)</option>
                  <option value="athlete">Athlete / Heavy Labor (2x/day training or physical trade)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Training Split & Equipment */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
                  WORKOUT PROGRAMMING
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#192418]">
                  Available equipment and weekly training routine
                </h2>
                <p className="text-xs sm:text-sm text-[#5e6f5e] mt-1 font-medium">
                  We generate your personalized workout schedule based on what gear you have available.
                </p>
              </div>

              {/* Equipment Access */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase mb-2">
                  Equipment Setup
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'full_gym', label: 'Commercial Gym', desc: 'Barbells, power racks, cable machines, dumbbells, leg press' },
                    { key: 'dumbbells_only', label: 'Dumbbells & Bench', desc: 'Adjustable dumbbells, flat/incline bench, bodyweight' },
                    { key: 'home_minimal', label: 'Home Minimalist', desc: 'Dumbbells, resistance bands, pull-up bar' },
                    { key: 'bodyweight_only', label: 'Bodyweight / Calisthenics', desc: 'Zero equipment needed—pure gravity and body leverage' },
                    { key: 'resistance_bands', label: 'Resistance Bands', desc: 'Loop & tube resistance bands for joint-friendly hypertrophy' }
                  ].map((eq) => (
                    <button
                      key={eq.key}
                      type="button"
                      onClick={() => setAvailableEquipment(eq.key as EquipmentType)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        availableEquipment === eq.key
                          ? 'bg-[#eef7eb] border-[#5ba83c] shadow-xs'
                          : 'bg-white border-[#e8ede6] hover:border-[#cbd7c8]'
                      }`}
                    >
                      <h4 className="font-extrabold text-sm text-[#192418]">{eq.label}</h4>
                      <p className="text-[11px] text-[#5e6f5e] mt-0.5 font-medium">{eq.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c]"
                  >
                    <option value="beginner">Beginner (0-1 yr consistent lifting)</option>
                    <option value="intermediate">Intermediate (1-3 yrs lifting)</option>
                    <option value="advanced">Advanced (3+ yrs structured lifting)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Training Frequency
                  </label>
                  <select
                    value={trainingDaysPerWeek}
                    onChange={(e) => setTrainingDaysPerWeek(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c]"
                  >
                    <option value={2}>2 Days / Week</option>
                    <option value={3}>3 Days / Week (Full Body)</option>
                    <option value={4}>4 Days / Week (Upper / Lower)</option>
                    <option value={5}>5 Days / Week (Push / Pull / Legs)</option>
                    <option value={6}>6 Days / Week (High Frequency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Workout Length
                  </label>
                  <select
                    value={preferredWorkoutDurationMin}
                    onChange={(e) => setPreferredWorkoutDurationMin(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c]"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Nutrition, Budget & Allergies */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
                  NUTRITION PROTOCOL
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#192418]">
                  Dietary framework, food budget, and allergens
                </h2>
                <p className="text-xs sm:text-sm text-[#5e6f5e] mt-1 font-medium">
                  We ensure meal suggestions and macro complement recommendations respect your lifestyle and budget.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Dietary Pattern
                  </label>
                  <select
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value as DietType)}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c]"
                  >
                    <option value="omnivore">Omnivore (Meat, Poultry, Dairy, Plants)</option>
                    <option value="vegetarian">Vegetarian (Dairy & Eggs, no meat)</option>
                    <option value="vegan">Vegan (100% Plant-Based)</option>
                    <option value="pescatarian">Pescatarian (Fish & Seafood)</option>
                    <option value="keto">Ketogenic (Very Low Carb, High Fat)</option>
                    <option value="paleo">Paleo (Unprocessed Whole Foods)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                    Food Budget Preference
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as BudgetTier)}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c]"
                  >
                    <option value="budget">Budget-Friendly (Eggs, oats, rice, lentils, canned fish)</option>
                    <option value="moderate">Moderate (Chicken, Greek yogurt, fresh fruit)</option>
                    <option value="flexible">Flexible (Salmon, grass-fed beef, specialty supplements)</option>
                  </select>
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase mb-2">
                  Allergies & Intolerances
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map((item) => {
                    const isSelected = allergies.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAllergy(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-[#f6f8f5] text-[#5e6f5e] border border-[#e8ede6] hover:text-[#192418]'
                        }`}
                      >
                        {isSelected ? '✕ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Targets Preview */}
              <div className="p-4 rounded-2xl bg-[#eef7eb] border border-[#d6ebd0]">
                <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
                  ESTIMATED BASELINE TARGETS (MIFFLIN-ST JEOR)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[#7a8c79] block text-[10px] font-bold">CALORIES</span>
                    <strong className="text-base font-extrabold text-[#192418]">{liveTargets.calories} kcal</strong>
                  </div>
                  <div>
                    <span className="text-[#7a8c79] block text-[10px] font-bold">PROTEIN</span>
                    <strong className="text-base font-extrabold text-rose-600">{liveTargets.protein}g</strong>
                  </div>
                  <div>
                    <span className="text-[#7a8c79] block text-[10px] font-bold">CARBS</span>
                    <strong className="text-base font-extrabold text-amber-600">{liveTargets.carbs}g</strong>
                  </div>
                  <div>
                    <span className="text-[#7a8c79] block text-[10px] font-bold">FATS</span>
                    <strong className="text-base font-extrabold text-sky-600">{liveTargets.fat}g</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-[#f0f4ee]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] border border-[#e8ede6] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as 2 | 3)}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-[#5ba83c] hover:bg-[#4d9630] text-white shadow-xs transition-all flex items-center gap-1.5 active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#5ba83c] hover:bg-[#4d9630] text-white shadow-xs transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Complete Profile & Open App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
