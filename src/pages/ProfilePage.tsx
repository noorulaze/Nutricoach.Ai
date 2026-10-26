import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, User, Target, Dumbbell, Utensils, 
  Key, ShieldCheck, Save, RotateCcw, Check, Sparkles, Activity,
  LogOut, Lock, Database, Sun, Moon
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
import { useAuth } from '../context/AuthContext';
import SignOutConfirmModal from '../components/SignOutConfirmModal';
import ThemeToggle from '../components/ThemeToggle';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(() => getProfile());
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  const handleConfirmSignOut = () => {
    setSignOutModalOpen(false);
    logout();
    showToast('Signed out safely. All your food logs and workouts are preserved.', 'info', 'Signed Out');
    navigate('/login', { replace: true });
  };

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#e8ede6]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
            PERSONAL CONFIGURATION
          </span>
          <span className="text-xs text-[#7a8c79] font-medium">BMR & Macronutrient Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
          Personal Profile & Fitness Parameters
        </h1>
        <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
          Configure your physiological parameters, training split, equipment access, dietary preferences, and optional AI model key.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* SECTION 1: BIOMETRIC BASELINE */}
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f4ee]">
            <div className="w-8 h-8 rounded-xl bg-[#eef7eb] border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#192418]">
                Biometric Baseline
              </h2>
              <span className="text-xs text-[#7a8c79] font-medium">Physical parameters for energy expenditure modeling</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="14"
                max="100"
                required
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Height (CM)
              </label>
              <input
                type="number"
                min="100"
                max="240"
                required
                value={profile.heightCm}
                onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
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
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Gender (for BMR)
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Daily Activity Level
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
              >
                <option value="sedentary">Sedentary (Desk work, minimal exercise)</option>
                <option value="light">Light Active (1-3 workout days/wk)</option>
                <option value="moderate">Moderately Active (3-5 workout days/wk)</option>
                <option value="very_active">Very Active (6-7 workout days/wk)</option>
                <option value="athlete">Athlete / Heavy Labor (2x/day training)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Primary Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as GoalType })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
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
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f4ee]">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#192418]">
                Training Parameters & Equipment
              </h2>
              <span className="text-xs text-[#7a8c79] font-medium">Routine tailoring based on gear access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Available Equipment
              </label>
              <select
                value={profile.availableEquipment}
                onChange={(e) => setProfile({ ...profile, availableEquipment: e.target.value as EquipmentType })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
              >
                <option value="full_gym">Full Gym (Barbells, Racks, Cables)</option>
                <option value="dumbbells_only">Dumbbells Only (Home Free Weights)</option>
                <option value="home_minimal">Home Minimal (Dumbbells + Pull-Up Bar)</option>
                <option value="bodyweight_only">Bodyweight / Calisthenics Only</option>
                <option value="resistance_bands">Resistance Bands & Bodyweight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Training Days / Week
              </label>
              <select
                value={profile.trainingDaysPerWeek}
                onChange={(e) => setProfile({ ...profile, trainingDaysPerWeek: Number(e.target.value) })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
              >
                <option value={2}>2 Days / Week</option>
                <option value={3}>3 Days / Week (Full Body Split)</option>
                <option value={4}>4 Days / Week (Upper / Lower)</option>
                <option value={5}>5 Days / Week (Push / Pull / Legs)</option>
                <option value={6}>6 Days / Week (Advanced Hypertrophy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Target Session Length
              </label>
              <select
                value={profile.preferredWorkoutDurationMin}
                onChange={(e) => setProfile({ ...profile, preferredWorkoutDurationMin: Number(e.target.value) })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
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
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f4ee]">
            <div className="w-8 h-8 rounded-xl bg-[#eef7eb] border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c]">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#192418]">
                Dietary Framework & Grocery Budget
              </h2>
              <span className="text-xs text-[#7a8c79] font-medium">Nutritional style and budget constraints</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Dietary Framework
              </label>
              <select
                value={profile.dietType}
                onChange={(e) => setProfile({ ...profile, dietType: e.target.value as DietType })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
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
              <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
                Food Budget Tier
              </label>
              <select
                value={profile.budget}
                onChange={(e) => setProfile({ ...profile, budget: e.target.value as BudgetTier })}
                className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] cursor-pointer"
              >
                <option value="budget">Budget-Conscious (Eggs, oats, canned tuna, lentils, rice)</option>
                <option value="moderate">Moderate (Chicken breast, Greek yogurt, seasonal produce)</option>
                <option value="flexible">Flexible (Fresh salmon, specialty powders, lean beef cuts)</option>
              </select>
            </div>
          </div>

          {/* Allergens Checklist */}
          <div>
            <label className="block text-xs font-bold text-[#192418] uppercase mb-2">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-[#f6f8f5] text-[#5e6f5e] border border-[#e8ede6] hover:text-[#192418]'
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
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0f4ee]">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block">
                SCIENTIFIC FORMULAS (MIFFLIN-ST JEOR)
              </span>
              <h2 className="text-lg font-extrabold text-[#192418]">
                Daily Macro & Energy Architecture
              </h2>
            </div>
            <button
              type="button"
              onClick={handleRecalculateTargets}
              className="bg-[#eef7eb] hover:bg-[#e2f2dd] text-[#3b7e23] font-bold text-xs px-4 py-2 rounded-2xl transition-all border border-[#d6ebd0] flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalculate From Stats</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-[#f9fbf8] p-3.5 rounded-2xl border border-[#e8ede6]">
              <span className="text-[#7a8c79] text-[10px] block font-bold">DAILY CALORIES</span>
              <input
                type="number"
                value={profile.calorieTarget}
                onChange={(e) => setProfile({ ...profile, calorieTarget: Number(e.target.value) })}
                className="w-full bg-transparent text-[#192418] font-black text-lg focus:outline-none"
              />
              <span className="text-[#8e9f8e] text-[10px]">kcal/day</span>
            </div>

            <div className="bg-rose-50/40 p-3.5 rounded-2xl border border-rose-100">
              <span className="text-rose-600 text-[10px] block font-bold">PROTEIN</span>
              <input
                type="number"
                value={profile.proteinTargetGrams}
                onChange={(e) => setProfile({ ...profile, proteinTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-rose-600 font-black text-lg focus:outline-none"
              />
              <span className="text-[#8e9f8e] text-[10px]">grams (~2.0g/kg)</span>
            </div>

            <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100">
              <span className="text-amber-600 text-[10px] block font-bold">CARBOHYDRATES</span>
              <input
                type="number"
                value={profile.carbsTargetGrams}
                onChange={(e) => setProfile({ ...profile, carbsTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-amber-600 font-black text-lg focus:outline-none"
              />
              <span className="text-[#8e9f8e] text-[10px]">grams</span>
            </div>

            <div className="bg-sky-50/40 p-3.5 rounded-2xl border border-sky-100">
              <span className="text-sky-600 text-[10px] block font-bold">FATS</span>
              <input
                type="number"
                value={profile.fatTargetGrams}
                onChange={(e) => setProfile({ ...profile, fatTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-sky-600 font-black text-lg focus:outline-none"
              />
              <span className="text-[#8e9f8e] text-[10px]">grams</span>
            </div>

            <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100 col-span-2 sm:col-span-1">
              <span className="text-emerald-600 text-[10px] block font-bold">DIETARY FIBER</span>
              <input
                type="number"
                value={profile.fiberTargetGrams}
                onChange={(e) => setProfile({ ...profile, fiberTargetGrams: Number(e.target.value) })}
                className="w-full bg-transparent text-emerald-600 font-black text-lg focus:outline-none"
              />
              <span className="text-[#8e9f8e] text-[10px]">grams</span>
            </div>
          </div>
        </div>

        {/* SECTION 5: OPTIONAL GOOGLE GEMINI API KEY */}
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f4ee]">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#192418]">
                AI Engine Configuration (Optional)
              </h2>
              <span className="text-xs text-[#5e6f5e] font-medium">
                NutriCoach operates out of the box with built-in sports intelligence. You may optionally connect your Gemini key.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#192418] uppercase mb-1.5">
              Google Gemini API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={profile.geminiApiKey || ''}
                onChange={(e) => setProfile({ ...profile, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="flex-1 bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-4 py-2.5 text-xs text-[#192418] font-bold focus:border-[#5ba83c] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="bg-[#f6f8f5] hover:bg-[#edf2ea] border border-[#e8ede6] text-[#5e6f5e] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                {apiKeyVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#7a8c79] mt-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#5ba83c] shrink-0" />
              <span>
                Your API key is stored securely in your private browser localStorage and is never transmitted to any third-party server.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 6: ACCOUNT, SECURITY & SESSION MANAGEMENT */}
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0f4ee]">
            <div className="w-8 h-8 rounded-xl bg-[#eef7eb] border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#192418]">
                Account & Session Management
              </h2>
              <span className="text-xs text-[#5e6f5e] font-medium">
                Active session status and data preservation architecture
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Details Pill */}
            <div className="bg-[#f6f8f5] border border-[#e8ede6] rounded-2xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#7a8c79] tracking-wider block">
                Active NutriCoach Profile
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5ba83c] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  {(user?.name || profile.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#192418] truncate">
                    {user?.name || profile.name}
                  </p>
                  <p className="text-[11px] text-[#5e6f5e] font-medium truncate">
                    {user?.email || 'demo@nutricoach.ai'}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#3b7e23] bg-[#eef7eb] px-2.5 py-1 rounded-full border border-[#d6ebd0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5ba83c] animate-pulse" />
                  Authenticated Session
                </span>
                <span className="text-[10px] text-[#7a8c79]">
                  ID: {user?.id || 'usr_demo_alex'}
                </span>
              </div>
            </div>

            {/* Data Preservation Guarantee Callout */}
            <div className="bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2d6a1b] dark:text-[#8BAF78]">
                <ShieldCheck className="w-4 h-4 text-[#5ba83c] dark:text-[#8BAF78] shrink-0" />
                <span>Zero Data Loss Guarantee</span>
              </div>
              <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1] leading-relaxed">
                Signing out clears only your active session token. <strong className="text-[#192418] dark:text-[#E8EDE7]">Your logged meals, custom recipes, training routines, and progress records remain safely preserved</strong> in your browser's private storage and will be reloaded immediately upon your next login.
              </p>
            </div>

            {/* Visual Theme Appearance Card */}
            <div className="bg-[#f6f8f5] dark:bg-[#1C211D] border border-[#e8ede6] dark:border-[#394139] rounded-2xl p-4 space-y-3 col-span-1 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#edf2ea] dark:bg-[#222823] border border-[#e8ede6] dark:border-[#394139] text-[#5ba83c] dark:text-[#8BAF78] flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#192418] dark:text-[#E8EDE7]">
                      Theme Appearance
                    </h4>
                    <p className="text-[11px] text-[#5e6f5e] dark:text-[#A2AAA1]">
                      Switch between Light Wellness (#f6f8f5) and Dark Charcoal (#1C211D) with balanced sage accents (#8BAF78).
                    </p>
                  </div>
                </div>
                <ThemeToggle variant="segmented" />
              </div>
            </div>
          </div>

          {/* Sign Out Card Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4">
            <div>
              <h4 className="text-xs font-bold text-[#192418]">
                End Current Session
              </h4>
              <p className="text-[11px] text-[#5e6f5e]">
                Safely sign out on this device. You will be redirected to the Login page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSignOutModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4 text-rose-600 stroke-[2.2]" />
              <span>Sign Out of NutriCoach AI</span>
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e8ede6]">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold uppercase text-xs tracking-wider py-3.5 px-8 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save All Profile Settings</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-[#7a8c79] hover:text-[#192418] underline font-medium"
          >
            Reset to Initial Baseline
          </button>
        </div>
      </form>

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
        userName={user?.name || profile.name || 'Friend'}
      />
    </div>
  );
}
