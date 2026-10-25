import React, { useState } from 'react';
import { 
  LineChart, TrendingUp, Calendar, Plus, Scale, 
  BatteryCharging, Moon, ShieldAlert, Sparkles, X, Check, 
  Image as ImageIcon, Award, Activity, Heart
} from 'lucide-react';
import { 
  getProfile, getFoodLog, getWorkoutPlan, 
  getProgressEntries, addProgressEntry, calculateTransparentProgressScore, getTodayKey 
} from '../utils/storage';
import { ProgressEntry } from '../types';
import { useToast } from '../context/ToastContext';
import WeightTrendChart from '../components/WeightTrendChart';

export default function ProgressPage() {
  const { showToast } = useToast();
  const profile = getProfile();
  const todayFoods = getFoodLog();
  const workoutPlan = getWorkoutPlan();
  const [entries, setEntries] = useState<ProgressEntry[]>(() => getProgressEntries());
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [formWeight, setFormWeight] = useState<number>(profile.weightKg);
  const [formEnergy, setFormEnergy] = useState<number>(8);
  const [formRecovery, setFormRecovery] = useState<number>(8);
  const [formSleep, setFormSleep] = useState<number>(7.5);
  const [formWaist, setFormWaist] = useState<string>('');
  const [formChest, setFormChest] = useState<string>('');
  const [formArms, setFormArms] = useState<string>('');
  const [formThighs, setFormThighs] = useState<string>('');
  const [formNotes, setFormNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);

  const scoreBreakdown = calculateTransparentProgressScore(profile, todayFoods, workoutPlan, entries);

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Please select a photo under 2MB for local storage', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoDataUrl(reader.result as string);
      showToast('Photo attached locally', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();

    addProgressEntry({
      date: getTodayKey(),
      weightKg: Number(formWeight) || profile.weightKg,
      energyLevel: Number(formEnergy),
      sleepHours: Number(formSleep),
      recoveryRating: Number(formRecovery),
      notes: formNotes,
      measurements: {
        waistCm: formWaist ? Number(formWaist) : undefined,
        chestCm: formChest ? Number(formChest) : undefined,
        armsCm: formArms ? Number(formArms) : undefined,
        thighsCm: formThighs ? Number(formThighs) : undefined
      },
      photoDataUrl
    });

    setEntries(getProgressEntries());
    setIsLogModalOpen(false);
    showToast('Progress entry recorded successfully', 'success', 'Entry Saved');
    setPhotoDataUrl(undefined);
    setFormNotes('');
  };

  // Weight trajectory analysis
  const latestWeight = entries[0]?.weightKg || profile.weightKg;
  const oldestWeight = entries[entries.length - 1]?.weightKg || profile.weightKg;
  const weightDelta = (latestWeight - oldestWeight).toFixed(1);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8ede6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
              HEALTH ANALYTICS
            </span>
            <span className="text-xs text-[#7a8c79] font-medium">Objective Consistency & Biometrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192418] tracking-tight">
            Fitness Progress Assessment
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6f5e] mt-0.5 font-medium">
            Focusing purely on personal consistency, strength progression, and biological recovery.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all shadow-xs flex items-center gap-1.5 self-start md:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log Today's Check-in</span>
        </button>
      </div>

      {/* TRANSPARENT PROGRESS SCORE CARD */}
      <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23] bg-[#eef7eb] px-2.5 py-0.5 rounded-full border border-[#d6ebd0]">
                SCORING ALGORITHM
              </span>
              <span className="text-xs text-[#7a8c79] font-medium">Transparent 100-Point Audit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#192418] tracking-tight mb-2">
              Overall Habit & Consistency Score
            </h2>
            <p className="text-[#5e6f5e] text-xs sm:text-sm leading-relaxed mb-4 font-medium">
              {scoreBreakdown.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5e6f5e] bg-[#f6f8f5] p-3 rounded-2xl border border-[#e8ede6]">
              <span>Goal: <strong className="text-[#192418] uppercase">{profile.goal.replace('_', ' ')}</strong></span>
              <span className="text-[#cbd7c8]">•</span>
              <span>Current Weight: <strong className="text-[#5ba83c]">{latestWeight} kg</strong></span>
              <span className="text-[#cbd7c8]">•</span>
              <span>Net Trajectory: <strong className="text-[#192418]">{Number(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg</strong></span>
            </div>
          </div>

          {/* Transparent Score Display Card */}
          <div className="bg-[#f9fbf8] border border-[#d6ebd0] rounded-3xl p-6 text-center w-full sm:w-64 shrink-0 shadow-xs">
            <span className="text-[10px] text-[#7a8c79] uppercase font-bold block">
              TOTAL SCORE
            </span>
            <div className="text-5xl font-black text-[#5ba83c] my-2 tracking-tight">
              {scoreBreakdown.totalScore}
            </div>
            <span className="text-xs text-[#7a8c79] font-medium">out of 100 points</span>

            <div className="mt-4 pt-3 border-t border-[#e8ede6] text-[11px] text-[#5e6f5e] text-left space-y-1.5 font-medium">
              <div className="flex justify-between items-center">
                <span>Workouts:</span>
                <span className="text-[#192418] font-bold">{scoreBreakdown.workoutConsistencyScore}/30</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nutrition:</span>
                <span className="text-[#192418] font-bold">{scoreBreakdown.nutritionAdherenceScore}/30</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Recovery:</span>
                <span className="text-[#192418] font-bold">{scoreBreakdown.recoveryScore}/20</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Habits:</span>
                <span className="text-[#192418] font-bold">{scoreBreakdown.loggingHabitScore}/20</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WEIGHT TREND VISUALIZATION CARD */}
      <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0f4ee]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-[#5ba83c]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b7e23]">
                BIOMETRIC TRAJECTORY
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#192418]">Body Weight Trend Curve</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#5e6f5e]">
            <span>Target: <strong className="text-[#192418]">{profile.weightKg} kg</strong></span>
            <span className="text-[#cbd7c8]">•</span>
            <span>Latest: <strong className="text-[#5ba83c]">{latestWeight} kg</strong></span>
          </div>
        </div>

        <WeightTrendChart entries={entries} targetWeight={profile.weightKg} />
      </div>

      {/* RECOVERY & BIOMETRIC STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e8ede6] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#7a8c79] uppercase font-bold block">ENERGY RATING</span>
              <span className="text-2xl font-black text-[#192418]">
                {entries[0]?.energyLevel || 8} <span className="text-xs text-[#7a8c79] font-normal">/ 10</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-[#5e6f5e] mt-2 leading-relaxed font-medium">
            Perceived nervous system readiness for progressive overload training.
          </p>
        </div>

        <div className="bg-white border border-[#e8ede6] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#7a8c79] uppercase font-bold block">SLEEP DURATION</span>
              <span className="text-2xl font-black text-[#192418]">
                {entries[0]?.sleepHours || 7.5} <span className="text-xs text-[#7a8c79] font-normal">hrs</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-[#5e6f5e] mt-2 leading-relaxed font-medium">
            Deep restorative sleep drives muscle growth hormone release and mental stamina.
          </p>
        </div>

        <div className="bg-white border border-[#e8ede6] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#eef7eb] border border-[#d6ebd0] flex items-center justify-center text-[#5ba83c]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#7a8c79] uppercase font-bold block">RECOVERY RATING</span>
              <span className="text-2xl font-black text-[#192418]">
                {entries[0]?.recoveryRating || 8} <span className="text-xs text-[#7a8c79] font-normal">/ 10</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-[#5e6f5e] mt-2 leading-relaxed font-medium">
            Soreness resolution and biological readiness calculated from rest intervals.
          </p>
        </div>
      </div>

      {/* HISTORICAL CHECK-IN LOG ENTRIES */}
      <div className="bg-white border border-[#e8ede6] rounded-[28px] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0f4ee]">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block">
              CHRONOLOGICAL RECORD
            </span>
            <h3 className="text-lg font-extrabold text-[#192418]">
              Historical Check-In Log
            </h3>
          </div>
          <span className="text-xs text-[#5e6f5e] font-medium bg-[#f6f8f5] px-3 py-1 rounded-full border border-[#e8ede6]">
            {entries.length} entries recorded
          </span>
        </div>

        <div className="space-y-3.5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#fcfdfc] border border-[#e8ede6] rounded-2xl p-4 sm:p-5 hover:border-[#cbd7c8] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0f4ee] mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#192418] text-xs bg-[#f6f8f5] px-2.5 py-1 rounded-lg border border-[#e8ede6]">
                    {entry.date}
                  </span>
                  <span className="text-xs text-[#5ba83c] font-bold">
                    {entry.weightKg} kg
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#5e6f5e]">
                  <span>Energy: <strong className="text-[#192418]">{entry.energyLevel}/10</strong></span>
                  <span className="text-[#cbd7c8]">•</span>
                  <span>Sleep: <strong className="text-[#192418]">{entry.sleepHours}h</strong></span>
                  <span className="text-[#cbd7c8]">•</span>
                  <span>Recovery: <strong className="text-[#192418]">{entry.recoveryRating}/10</strong></span>
                </div>
              </div>

              {/* Measurements row if recorded */}
              {entry.measurements && (
                <div className="flex flex-wrap gap-3 text-xs text-[#5e6f5e] mb-2 font-medium">
                  {entry.measurements.waistCm && <span>Waist: <strong className="text-[#192418]">{entry.measurements.waistCm} cm</strong></span>}
                  {entry.measurements.chestCm && <span>Chest: <strong className="text-[#192418]">{entry.measurements.chestCm} cm</strong></span>}
                  {entry.measurements.armsCm && <span>Arms: <strong className="text-[#192418]">{entry.measurements.armsCm} cm</strong></span>}
                  {entry.measurements.thighsCm && <span>Thighs: <strong className="text-[#192418]">{entry.measurements.thighsCm} cm</strong></span>}
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <p className="text-xs text-[#5e6f5e] italic mt-1 leading-relaxed font-medium">
                  "{entry.notes}"
                </p>
              )}

              {/* Photo preview if attached */}
              {entry.photoDataUrl && (
                <div className="mt-3 pt-3 border-t border-[#f0f4ee] flex items-center gap-3">
                  <img
                    src={entry.photoDataUrl}
                    alt="Private progress record"
                    className="w-16 h-16 rounded-xl object-cover border border-[#e8ede6]"
                  />
                  <div className="text-[11px] text-[#7a8c79]">
                    <span className="text-[#192418] font-bold block">Private Local Photo Record</span>
                    <span>Stored only on this device for your private personal milestone tracking.</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MANDATORY SCIENTIFIC HEALTH NOTICE */}
      <div className="bg-[#fcfdfc] border border-[#e8ede6] rounded-2xl p-4 text-xs text-[#5e6f5e] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#192418] block mb-0.5 font-bold">Scientific Transparency Notice:</strong>
          Photographs and visual checks are subjective personal markers and cannot accurately measure true body composition, bone mineral density, visceral adipose tissue, or metabolic health. True body composition requires clinical modalities such as DEXA or hydrostatic weighing. NutriCoach evaluates holistic habits, strength consistency, and nutrition.
        </div>
      </div>

      {/* LOG PROGRESS ENTRY MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-[#e8ede6] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in space-y-4">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-5 right-5 text-[#7a8c79] hover:text-[#192418] p-2 rounded-xl bg-[#f6f8f5] hover:bg-[#edf2ea] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-bold uppercase text-[#3b7e23] tracking-wider block mb-1">
              BIOMETRIC LOGGING
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#192418]">
              Record Today's Physical Check-in
            </h3>

            <form onSubmit={handleSubmitEntry} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                    Body Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] font-bold focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                    Sleep Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="14"
                    value={formSleep}
                    onChange={(e) => setFormSleep(Number(e.target.value))}
                    className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl px-3.5 py-2.5 text-xs text-[#192418] font-bold focus:outline-none focus:ring-2 focus:ring-[#5ba83c]/30 focus:border-[#5ba83c]"
                  />
                </div>
              </div>

              {/* Energy & Recovery Ratings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                    Energy Level: {formEnergy}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formEnergy}
                    onChange={(e) => setFormEnergy(Number(e.target.value))}
                    className="w-full accent-[#5ba83c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                    Recovery Rating: {formRecovery}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formRecovery}
                    onChange={(e) => setFormRecovery(Number(e.target.value))}
                    className="w-full accent-[#5ba83c]"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1.5">
                  Optional Tape Measurements (cm)
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Waist"
                    value={formWaist}
                    onChange={(e) => setFormWaist(e.target.value)}
                    className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418]"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Chest"
                    value={formChest}
                    onChange={(e) => setFormChest(e.target.value)}
                    className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418]"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Arms"
                    value={formArms}
                    onChange={(e) => setFormArms(e.target.value)}
                    className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418]"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Thighs"
                    value={formThighs}
                    onChange={(e) => setFormThighs(e.target.value)}
                    className="bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-2 text-[#192418]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                  Daily Notes & Subjective Reflection
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="How did you feel today? Any joint aches, digestion notes, or high energy moments?"
                  className="w-full bg-[#f6f8f5] border border-[#e8ede6] rounded-xl p-3 text-xs text-[#192418] placeholder-[#8e9f8e] focus:outline-none focus:border-[#5ba83c]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-[#192418] uppercase tracking-wider mb-1">
                  Private Progress Photo (Client-Side Only)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-[#5e6f5e] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#eef7eb] file:text-[#3b7e23] hover:file:bg-[#e2f2dd] cursor-pointer"
                  />
                  {photoDataUrl && (
                    <span className="text-xs text-[#5ba83c] font-bold">✓ Attached</span>
                  )}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#5ba83c] hover:bg-[#4d9630] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all shadow-xs active:scale-[0.98]"
                >
                  Save Progress Check-in
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-5 py-3.5 bg-[#f6f8f5] text-[#5e6f5e] hover:text-[#192418] rounded-2xl text-xs font-bold border border-[#e8ede6]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
