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

    showToast('Personalized profile created! Welcome to your dashboard.', 'success', 'Setup Complete');
    navigate('/', { replace: true });
  };

  const handleSkip = () => {
    completeOnboarding();
    showToast('Loaded recommended baseline targets. You can edit them anytime in Settings.', 'info');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      <div className="max-w-4xl mx-auto w-full space-y-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00] flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_rgba(204,255,0,0.3)]">
              ⚡
            </div>
            <div>
              <span className="font-heading font-black text-white text-lg tracking-wider">
                NUTRICOACH <span className="text-[#ccff00]">AI</span>
              </span>
              <span className="block text-[10px] text-zinc-400 font-mono">
                First-Time Profile Setup • Welcome {user?.name || ''}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-zinc-400 hover:text-white font-mono hover:underline self-start sm:self-auto"
          >
            Skip for now & use defaults →
          </button>
        </div>

        {/* Step Progression Pills */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className={`p-3 rounded-2xl border transition-all ${
              currentStep === 1 
                ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]' 
                : currentStep > 1 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-400' 
                : 'bg-zinc-950/60 border-zinc-900 text-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">Step 1</span>
              {currentStep > 1 && <Check className="w-3.5 h-3.5 text-[#ccff00]" />}
            </div>
            <span className="text-xs font-bold text-white block mt-0.5">Biometrics & Goals</span>
          </div>

          <div 
            className={`p-3 rounded-2xl border transition-all ${
              currentStep === 2 
                ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]' 
                : currentStep > 2 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-400' 
                : 'bg-zinc-950/60 border-zinc-900 text-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">Step 2</span>
              {currentStep > 2 && <Check className="w-3.5 h-3.5 text-[#ccff00]" />}
            </div>
            <span className="text-xs font-bold text-white block mt-0.5">Training & Gear</span>
          </div>

          <div 
            className={`p-3 rounded-2xl border transition-all ${
              currentStep === 3 
                ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]' 
                : 'bg-zinc-950/60 border-zinc-900 text-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00]">Step 3</span>
            </div>
            <span className="text-xs font-bold text-white block mt-0.5">Diet & Nutrition</span>
          </div>
        </div>

        {/* STEP CONTENT CARDS */}
        <div className="app-card-elevated p-6 sm:p-8 space-y-6">
          {/* STEP 1: Body Metrics & Goals */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
                  PHYSIOLOGICAL BASELINE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Tell us about your body and your main objective
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  We use the Mifflin-St Jeor equation to compute your metabolic baseline.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="95"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Gender (for BMR)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-[#ccff00] cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Height (CM)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="230"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Current Weight (KG)
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="220"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Goal Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
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
                          ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white">{item.label}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Daily Baseline Activity
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-[#ccff00] cursor-pointer"
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
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
                  WORKOUT PROGRAMMING
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Available equipment and weekly training routine
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  We generate your personalized workout schedule based on what gear you have available.
                </p>
              </div>

              {/* Equipment Access */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                  What equipment do you have access to?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'full_gym', label: 'Commercial Gym', desc: 'Barbells, squat racks, cable towers, leg press, dumbbells.' },
                    { key: 'dumbbells_only', label: 'Dumbbells Only', desc: 'Set of adjustable or fixed dumbbells and an open floor.' },
                    { key: 'home_minimal', label: 'Home Minimal', desc: 'Dumbbells, pull-up bar, resistance bands.' },
                    { key: 'bodyweight_only', label: 'Bodyweight / Calisthenics', desc: 'Zero equipment needed. Pull-ups, push-ups, dips, core.' },
                    { key: 'resistance_bands', label: 'Bands & Bodyweight', desc: 'Resistance loop bands and calisthenics progressions.' }
                  ].map((eq) => (
                    <button
                      key={eq.key}
                      type="button"
                      onClick={() => setAvailableEquipment(eq.key as EquipmentType)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        availableEquipment === eq.key
                          ? 'bg-zinc-900 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white">{eq.label}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{eq.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Training Days Per Week
                  </label>
                  <select
                    value={trainingDaysPerWeek}
                    onChange={(e) => setTrainingDaysPerWeek(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-[#ccff00] cursor-pointer"
                  >
                    <option value={2}>2 Days / Week (Full Body Maintenance)</option>
                    <option value={3}>3 Days / Week (Full Body Split)</option>
                    <option value={4}>4 Days / Week (Upper / Lower Split)</option>
                    <option value={5}>5 Days / Week (Push / Pull / Legs)</option>
                    <option value={6}>6 Days / Week (High Frequency Hypertrophy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Preferred Workout Duration
                  </label>
                  <select
                    value={preferredWorkoutDurationMin}
                    onChange={(e) => setPreferredWorkoutDurationMin(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-[#ccff00] cursor-pointer"
                  >
                    <option value={30}>30 Minutes (High Intensity / Supersetting)</option>
                    <option value={45}>45 Minutes (Optimal Strength & Hypertrophy)</option>
                    <option value={60}>60 Minutes (Complete High Volume Session)</option>
                    <option value={90}>90 Minutes (Powerlifting / Extended Rest)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Nutrition & Allergies */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
                  DIETARY ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Dietary preferences, grocery budget, and food allergies
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Our smart food recommendation assistant will filter recipes and suggest practical staples matching your constraints.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Dietary Framework
                  </label>
                  <select
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value as DietType)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-[#ccff00] cursor-pointer"
                  >
                    <option value="omnivore">Omnivore (Standard Complete)</option>
                    <option value="vegetarian">Vegetarian (Dairy & Eggs included)</option>
                    <option value="vegan">Vegan (100% Plant-Based)</option>
                    <option value="pescatarian">Pescatarian (Fish & Seafood)</option>
                    <option value="keto">Ketogenic (Low Carb, High Fat)</option>
                    <option value="paleo">Paleo (Whole Unprocessed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                    Food Budget Tier
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as BudgetTier)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:border-[#ccff00] cursor-pointer"
                  >
                    <option value="budget">Budget-Conscious (Bulk eggs, oats, tuna, lentils, rice)</option>
                    <option value="moderate">Moderate (Chicken breasts, Greek yogurt, seasonal fruits)</option>
                    <option value="flexible">Flexible (Fresh salmon, specialty protein powders, lean beef)</option>
                  </select>
                </div>
              </div>

              {/* Allergens Checklist */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                  Allergies & Intolerances (Filtered out from recommendations)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map((item) => {
                    const isSelected = allergies.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAllergy(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                          isSelected
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✕ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC LIVE CALCULATION PREVIEW CARD */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-[#ccff00] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> LIVE METABOLIC PROJECTION
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Mifflin-St Jeor Formula
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[9px] uppercase block">DAILY TARGET</span>
                <span className="text-white font-bold text-base">{liveTargets.calories}</span>
                <span className="text-zinc-400 text-[10px] ml-1">kcal</span>
              </div>
              <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[9px] uppercase block">PROTEIN</span>
                <span className="text-[#ccff00] font-bold text-base">{liveTargets.protein}g</span>
                <span className="text-zinc-400 text-[10px] ml-1">~2.0g/kg</span>
              </div>
              <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[9px] uppercase block">CARBS</span>
                <span className="text-cyan-400 font-bold text-base">{liveTargets.carbs}g</span>
              </div>
              <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-850">
                <span className="text-zinc-500 text-[9px] uppercase block">FATS</span>
                <span className="text-amber-400 font-bold text-base">{liveTargets.fat}g</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3)}
                className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs rounded-xl shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-6 py-3 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.35)] flex items-center gap-1.5 transition-all"
              >
                <span>Save & Launch My Dashboard</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
