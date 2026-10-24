import React, { useState } from 'react';
import { 
  Settings, User, Target, Dumbbell, Utensils, 
  Key, ShieldCheck, Save, RotateCcw, Check, Sparkles, Activity 
} from 'lucide-react';
import { 
  getProfile, saveProfile, calculateBMR, 
  calculateTDEE, calculateTargets, getDefaultProfile 
} from '../utils/storage';
import { 
  UserProfile, GoalType, ExperienceLevel, 
  ActivityLevel, EquipmentType, DietType, BudgetTier 
} from '../types';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(() => getProfile());
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  // Common allergens list
  const ALLERGEN_OPTIONS = [
    'Gluten', 'Dairy', 'Peanuts', 'Tree Nuts', 
    'Eggs', 'Soy', 'Fish', 'Shellfish'
  ];

  const handleAllergyToggle = (allergy: string) => {
    const exists = profile.allergies.includes(allergy);
    const updated = exists
      ? profile.allergies.filter((a) => a !== allergy)
      : [...profile.allergies, allergy];
    setProfile({ ...profile, allergies: updated });
  };

  const handleRecalculateTargets = () => {
    const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const targets = calculateTargets(tdee, profile.weightKg, profile.goal);

    const updated: UserProfile = {
      ...profile,
      tdee,
      calorieTarget: targets.calories,
      proteinTargetGrams: targets.protein,
      carbsTargetGrams: targets.carbs,
      fatTargetGrams: targets.fat,
      fiberTargetGrams: targets.fiber
    };

    setProfile(updated);
    saveProfile(updated);
    showToast('BMR, TDEE, and daily macro targets recalculated!', 'success', 'Targets Updated');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    showToast('Personal profile and settings saved successfully!', 'success', 'Settings Saved');
  };

  const handleResetToDefault = () => {
    const def = getDefaultProfile();
    setProfile(def);
    saveProfile(def);
    showToast('Reset to default profile baseline', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
            PERSONAL CONFIGURATION
          </span>
          <span className="text-xs text-zinc-500 font-mono">BMR & Macronutrient Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Personal Profile & Fitness Parameters
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Configure your physiological parameters, training split, equipment access, dietary preferences, and optional AI model key.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* SECTION 1: BIOMETRIC BASELINE */}
        <div className="app-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Biometric Baseline
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Physical parameters for energy expenditure modeling</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="14"
                max="100"
                required
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Height (CM)
              </label>
              <input
                type="number"
                min="100"
                max="240"
                required
                value={profile.heightCm}
                onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Current Weight (KG)
              </label>
              <input
                type="number"
                min="35"
                max="250"
                step="0.5"
                required
                value={profile.weightKg}
                onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Gender (for BMR)
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Daily Activity Level
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value="sedentary">Sedentary (Desk work, minimal exercise)</option>
                <option value="light">Light Active (1-3 workout days/wk)</option>
                <option value="moderate">Moderately Active (3-5 workout days/wk)</option>
                <option value="very_active">Very Active (6-7 workout days/wk)</option>
                <option value="athlete">Athlete / Heavy Labor (2x/day training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Primary Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as GoalType })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value="fat_loss">Fat Loss (-450 kcal deficit)</option>
                <option value="muscle_gain">Lean Muscle Hypertrophy (+300 kcal surplus)</option>
                <option value="maintenance">Body Recomposition & Maintenance</option>
                <option value="strength">Raw Barbell Strength (+150 kcal)</option>
                <option value="athletic_performance">Athletic Speed & Conditioning (+200 kcal)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRAINING PARAMETERS & EQUIPMENT */}
        <div className="app-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-orange-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Training Parameters & Equipment
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Routine tailoring based on gear access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Available Equipment
              </label>
              <select
                value={profile.availableEquipment}
                onChange={(e) => setProfile({ ...profile, availableEquipment: e.target.value as EquipmentType })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value="full_gym">Full Gym (Barbells, Racks, Cables)</option>
                <option value="dumbbells_only">Dumbbells Only (Home Free Weights)</option>
                <option value="home_minimal">Home Minimal (Dumbbells + Pull-Up Bar)</option>
                <option value="bodyweight_only">Bodyweight / Calisthenics Only</option>
                <option value="resistance_bands">Resistance Bands & Bodyweight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Training Days / Week
              </label>
              <select
                value={profile.trainingDaysPerWeek}
                onChange={(e) => setProfile({ ...profile, trainingDaysPerWeek: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value={2}>2 Days / Week</option>
                <option value={3}>3 Days / Week (Full Body Split)</option>
                <option value={4}>4 Days / Week (Upper / Lower)</option>
                <option value={5}>5 Days / Week (Push / Pull / Legs)</option>
                <option value={6}>6 Days / Week (Advanced Hypertrophy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Target Session Length
              </label>
              <select
                value={profile.preferredWorkoutDurationMin}
                onChange={(e) => setProfile({ ...profile, preferredWorkoutDurationMin: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value={30}>30 Minutes (High Density)</option>
                <option value={45}>45 Minutes (Optimal Balance)</option>
                <option value={60}>60 Minutes (Complete Strength)</option>
                <option value={90}>90 Minutes (Powerlifting / High Volume)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: DIETARY PREFERENCES & BUDGET */}
        <div className="app-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Dietary Framework & Grocery Budget
              </h2>
              <span className="text-xs text-zinc-400 font-mono">Nutritional style and budget constraints</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Dietary Framework
              </label>
              <select
                value={profile.dietType}
                onChange={(e) => setProfile({ ...profile, dietType: e.target.value as DietType })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value="omnivore">Omnivore (Standard Complete)</option>
                <option value="vegetarian">Vegetarian (Dairy & Eggs included)</option>
                <option value="vegan">Vegan (100% Plant-Based)</option>
                <option value="pescatarian">Pescatarian (Fish & Seafood)</option>
                <option value="keto">Ketogenic (Low Carb, High Fat)</option>
                <option value="paleo">Paleo (Whole Unprocessed Foods)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Food Budget Tier
              </label>
              <select
                value={profile.budget}
                onChange={(e) => setProfile({ ...profile, budget: e.target.value as BudgetTier })}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] cursor-pointer"
              >
                <option value="budget">Budget-Conscious (Eggs, oats, canned tuna, lentils, rice)</option>
                <option value="moderate">Moderate (Chicken breast, Greek yogurt, seasonal produce)</option>
                <option value="flexible">Flexible (Fresh salmon, specialty powders, lean beef cuts)</option>
              </select>
            </div>
          </div>

          {/* Allergens Checklist */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Allergies & Intolerances (Filtered out from recommendations)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((allergy) => {
                const isSelected = profile.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => handleAllergyToggle(allergy)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                      isSelected
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✕ ' : '+ '}
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 4: NUTRITIONAL TARGETS & RECALCULATE */}
        <div className="app-card-elevated p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
                SCIENTIFIC FORMULAS (MIFFLIN-ST JEOR)
              </span>
              <h2 className="text-lg font-bold text-white">
                Daily Macro & Energy Architecture
              </h2>
            </div>
            <button
              type="button"
              onClick={handleRecalculateTargets}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalculate From Stats</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block font-semibold">DAILY CALORIES</span>
              <input
                type="number"
                value={profile.calorieTarget}
                onChange={(e) => setProfile({ ...profile, calorieTarget: Number(e.target.value) })}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">kcal/day</span>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block font-semibold">PROTEIN</span>
              <input
                type="number"
                value={profile.proteinTargetGrams}
                onChange={(e) => setProfile({ ...profile, proteinTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-[#ccff00] font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams (~2.0g/kg)</span>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block font-semibold">CARBOHYDRATES</span>
              <input
                type="number"
                value={profile.carbsTargetGrams}
                onChange={(e) => setProfile({ ...profile, carbsTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-cyan-400 font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams</span>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block font-semibold">FATS</span>
              <input
                type="number"
                value={profile.fatTargetGrams}
                onChange={(e) => setProfile({ ...profile, fatTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-amber-400 font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams</span>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 col-span-2 sm:col-span-1">
              <span className="text-zinc-500 text-[10px] block font-semibold">DIETARY FIBER</span>
              <input
                type="number"
                value={profile.fiberTargetGrams}
                onChange={(e) => setProfile({ ...profile, fiberTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams</span>
            </div>
          </div>
        </div>

        {/* SECTION 5: OPTIONAL GOOGLE GEMINI API KEY */}
        <div className="app-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                AI Engine Configuration (Optional)
              </h2>
              <span className="text-xs text-zinc-400">
                NutriCoach operates out of the box with built-in sports intelligence. You may optionally connect your Gemini key.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
              Google Gemini API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={profile.geminiApiKey || ''}
                onChange={(e) => setProfile({ ...profile, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors"
              >
                {apiKeyVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-[#ccff00] shrink-0" />
              <span>
                Your API key is stored securely in your private browser localStorage and is never transmitted to any third-party server.
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Profile Settings</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline font-mono"
          >
            Reset to Initial Baseline
          </button>
        </div>
      </form>
    </div>
  );
}
