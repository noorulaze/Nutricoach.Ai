import React, { useState } from 'react';
import { 
  Settings, User, Target, Dumbbell, Utensils, 
  Key, ShieldCheck, Save, RotateCcw, Check, Sparkles 
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccff00] block mb-1">
          CUSTOMIZATION & SCIENTIFIC TARGETS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
          PERSONAL PROFILE & SETTINGS
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
          Configure your physiological stats, training schedule, equipment access, dietary preferences, and optional AI model key.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* SECTION 1: BIOMETRIC BASELINE */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
            <User className="w-5 h-5 text-[#ccff00]" />
            <h2 className="text-xl font-bold font-heading text-white uppercase">
              BIOMETRIC BASELINE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Age
              </label>
              <input
                type="number"
                min="14"
                max="100"
                required
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Height (CM)
              </label>
              <input
                type="number"
                min="100"
                max="240"
                required
                value={profile.heightCm}
                onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
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
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Gender (for BMR Calculation)
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Daily Activity Level
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value="sedentary">Sedentary (Desk work, minimal exercise)</option>
                <option value="light">Light Active (1-3 workout days/wk)</option>
                <option value="moderate">Moderately Active (3-5 workout days/wk)</option>
                <option value="very_active">Very Active (6-7 workout days/wk)</option>
                <option value="athlete">Athlete / Heavy Labor (2x/day training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Primary Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as GoalType })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value="fat_loss">Fat Loss (-450 kcal deficit)</option>
                <option value="muscle_gain">Lean Muscle Hypertrophy (+300 kcal surplus)</option>
                <option value="maintenance">Body Recomposition & Maintenance (TDEE)</option>
                <option value="strength">Raw Barbell Strength (+150 kcal)</option>
                <option value="athletic_performance">Athletic Speed & Conditioning (+200 kcal)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRAINING PARAMETERS & EQUIPMENT */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
            <Dumbbell className="w-5 h-5 text-[#ccff00]" />
            <h2 className="text-xl font-bold font-heading text-white uppercase">
              TRAINING PARAMETERS & EQUIPMENT ACCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Available Equipment
              </label>
              <select
                value={profile.availableEquipment}
                onChange={(e) => setProfile({ ...profile, availableEquipment: e.target.value as EquipmentType })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value="full_gym">Full Gym (Barbells, Racks, Cables, Dumbbells)</option>
                <option value="dumbbells_only">Dumbbells Only (Adjustable/Fixed Dumbbells)</option>
                <option value="home_minimal">Home Minimal (Dumbbells + Pull-Up Bar)</option>
                <option value="bodyweight_only">Bodyweight / Calisthenics Only</option>
                <option value="resistance_bands">Resistance Bands & Bodyweight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Training Days Per Week
              </label>
              <select
                value={profile.trainingDaysPerWeek}
                onChange={(e) => setProfile({ ...profile, trainingDaysPerWeek: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value={2}>2 Days / Week</option>
                <option value={3}>3 Days / Week (Full Body Split)</option>
                <option value={4}>4 Days / Week (Upper / Lower)</option>
                <option value={5}>5 Days / Week (Push / Pull / Legs)</option>
                <option value={6}>6 Days / Week (Advanced Hypertrophy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Preferred Session Duration
              </label>
              <select
                value={profile.preferredWorkoutDurationMin}
                onChange={(e) => setProfile({ ...profile, preferredWorkoutDurationMin: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value={30}>30 Minutes (High Density)</option>
                <option value={45}>45 Minutes (Standard Optimal)</option>
                <option value={60}>60 Minutes (Complete Strength)</option>
                <option value={90}>90 Minutes (Powerlifting / High Volume)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: DIETARY PREFERENCES, ALLERGIES & BUDGET */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
            <Utensils className="w-5 h-5 text-[#ccff00]" />
            <h2 className="text-xl font-bold font-heading text-white uppercase">
              DIETARY PREFERENCES, ALLERGIES & BUDGET
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Dietary Framework
              </label>
              <select
                value={profile.dietType}
                onChange={(e) => setProfile({ ...profile, dietType: e.target.value as DietType })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
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
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Food Budget Tier
              </label>
              <select
                value={profile.budget}
                onChange={(e) => setProfile({ ...profile, budget: e.target.value as BudgetTier })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
              >
                <option value="budget">Budget-Conscious (Eggs, oats, tuna, lentils, bulk rice)</option>
                <option value="moderate">Moderate (Chicken breast, Greek yogurt, seasonal fruits)</option>
                <option value="flexible">Flexible (Fresh salmon, specialty powders, lean steaks)</option>
              </select>
            </div>
          </div>

          {/* Allergens Checklist */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
              Allergies & Intolerances (Filtered Out from AI Food Recommendations)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((allergy) => {
                const isSelected = profile.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => handleAllergyToggle(allergy)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50'
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
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
                SCIENTIFIC FORMULAS (MIFFLIN-ST JEOR)
              </span>
              <h2 className="text-xl font-bold font-heading text-white uppercase">
                CALCULATED NUTRITION TARGETS
              </h2>
            </div>
            <button
              type="button"
              onClick={handleRecalculateTargets}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RECALCULATE FROM STATS
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">DAILY CALORIES</span>
              <input
                type="number"
                value={profile.calorieTarget}
                onChange={(e) => setProfile({ ...profile, calorieTarget: Number(e.target.value) })}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">kcal/day</span>
            </div>

            <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">PROTEIN</span>
              <input
                type="number"
                value={profile.proteinTargetGrams}
                onChange={(e) => setProfile({ ...profile, proteinTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-[#ccff00] font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams (~2.0g/kg)</span>
            </div>

            <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">CARBOHYDRATES</span>
              <input
                type="number"
                value={profile.carbsTargetGrams}
                onChange={(e) => setProfile({ ...profile, carbsTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-cyan-400 font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams (fuel)</span>
            </div>

            <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">FATS</span>
              <input
                type="number"
                value={profile.fatTargetGrams}
                onChange={(e) => setProfile({ ...profile, fatTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-amber-400 font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams (hormones)</span>
            </div>

            <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-800 col-span-2 sm:col-span-1">
              <span className="text-zinc-500 text-[10px] block">DIETARY FIBER</span>
              <input
                type="number"
                value={profile.fiberTargetGrams}
                onChange={(e) => setProfile({ ...profile, fiberTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
              <span className="text-zinc-400 text-[10px]">grams (motility)</span>
            </div>
          </div>
        </div>

        {/* SECTION 5: OPTIONAL GOOGLE GEMINI API KEY CONFIGURATION */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
            <Key className="w-5 h-5 text-[#ccff00]" />
            <div>
              <h2 className="text-xl font-bold font-heading text-white uppercase">
                AI ENGINE CONFIGURATION (OPTIONAL)
              </h2>
              <span className="text-xs text-zinc-400">
                NutriCoach works fully out of the box with built-in sports science logic. You can optionally connect your personal Google Gemini API Key for open conversational inference.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
              Google Gemini API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={profile.geminiApiKey || ''}
                onChange={(e) => setProfile({ ...profile, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-2.5 rounded-xl text-xs font-mono"
              >
                {apiKeyVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-2">
              <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
              <span>
                Your API key is stored strictly inside your browser's private localStorage and is never transmitted to any third-party server.
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-4 px-10 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.35)] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE ALL PROFILE SETTINGS
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
