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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
              HEALTH ANALYTICS
            </span>
            <span className="text-xs text-zinc-500 font-mono">Objective Consistency & Biometrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fitness Progress Assessment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Focusing purely on personal consistency, strength progression, and biological recovery—never comparing you to others.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Today's Check-in</span>
        </button>
      </div>

      {/* TRANSPARENT PROGRESS SCORE CARD */}
      <div className="app-card-elevated p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/20">
                SCORING ALGORITHM
              </span>
              <span className="text-xs text-zinc-400 font-mono">Transparent 100-Point Audit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Overall Habit & Consistency Score
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
              {scoreBreakdown.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
              <span>Goal: <strong className="text-white uppercase">{profile.goal.replace('_', ' ')}</strong></span>
              <span className="text-zinc-600">•</span>
              <span>Current Weight: <strong className="text-[#ccff00]">{latestWeight} kg</strong></span>
              <span className="text-zinc-600">•</span>
              <span>Net Trajectory: <strong className="text-white">{Number(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg</strong></span>
            </div>
          </div>

          {/* Transparent Score Display Card */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 text-center w-full sm:w-64 shrink-0 shadow-lg">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              TOTAL SCORE
            </span>
            <div className="text-5xl font-extrabold text-[#ccff00] my-2 font-mono tracking-tight">
              {scoreBreakdown.totalScore}
            </div>
            <span className="text-xs text-zinc-400 font-mono">out of 100 points</span>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 text-left space-y-1.5 font-mono">
              <div className="flex justify-between items-center">
                <span>Workouts:</span>
                <span className="text-white font-bold">{scoreBreakdown.workoutConsistencyScore}/30</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nutrition:</span>
                <span className="text-white font-bold">{scoreBreakdown.nutritionAdherenceScore}/30</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Recovery:</span>
                <span className="text-white font-bold">{scoreBreakdown.recoveryScore}/20</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Habits:</span>
                <span className="text-white font-bold">{scoreBreakdown.loggingHabitScore}/20</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WEIGHT TREND VISUALIZATION CARD */}
      <div className="app-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-[#ccff00]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00]">
                BIOMETRIC TRAJECTORY
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Body Weight Trend Curve</h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-zinc-400">Target: <strong className="text-white">{profile.weightKg} kg</strong></span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Latest: <strong className="text-[#ccff00]">{latestWeight} kg</strong></span>
          </div>
        </div>

        <WeightTrendChart entries={entries} targetWeight={profile.weightKg} />
      </div>

      {/* RECOVERY & BIOMETRIC STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="app-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">ENERGY RATING</span>
              <span className="text-2xl font-bold text-white font-mono">
                {entries[0]?.energyLevel || 8} <span className="text-xs text-zinc-500 font-normal">/ 10</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Perceived nervous system readiness for progressive overload training.
          </p>
        </div>

        <div className="app-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">SLEEP DURATION</span>
              <span className="text-2xl font-bold text-white font-mono">
                {entries[0]?.sleepHours || 7.5} <span className="text-xs text-zinc-500 font-normal">hrs</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Deep restorative sleep drives muscle growth hormone release and mental stamina.
          </p>
        </div>

        <div className="app-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">RECOVERY RATING</span>
              <span className="text-2xl font-bold text-white font-mono">
                {entries[0]?.recoveryRating || 8} <span className="text-xs text-zinc-500 font-normal">/ 10</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Soreness resolution and biological readiness calculated from rest intervals.
          </p>
        </div>
      </div>

      {/* HISTORICAL CHECK-IN LOG ENTRIES */}
      <div className="app-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
              CHRONOLOGICAL RECORD
            </span>
            <h3 className="text-lg font-bold text-white">
              Historical Check-In Log
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {entries.length} entries recorded
          </span>
        </div>

        <div className="space-y-3.5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 hover:border-zinc-700/80 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/60 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white text-xs bg-black/60 px-2.5 py-1 rounded-lg border border-zinc-800">
                    {entry.date}
                  </span>
                  <span className="text-xs text-[#ccff00] font-mono font-bold">
                    {entry.weightKg} kg
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                  <span>Energy: <strong className="text-white">{entry.energyLevel}/10</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span>Sleep: <strong className="text-white">{entry.sleepHours}h</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span>Recovery: <strong className="text-white">{entry.recoveryRating}/10</strong></span>
                </div>
              </div>

              {/* Measurements row if recorded */}
              {entry.measurements && (
                <div className="flex flex-wrap gap-3 text-xs font-mono text-zinc-300 mb-2">
                  {entry.measurements.waistCm && <span>Waist: <strong className="text-white">{entry.measurements.waistCm} cm</strong></span>}
                  {entry.measurements.chestCm && <span>Chest: <strong className="text-white">{entry.measurements.chestCm} cm</strong></span>}
                  {entry.measurements.armsCm && <span>Arms: <strong className="text-white">{entry.measurements.armsCm} cm</strong></span>}
                  {entry.measurements.thighsCm && <span>Thighs: <strong className="text-white">{entry.measurements.thighsCm} cm</strong></span>}
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <p className="text-xs text-zinc-400 italic mt-1 leading-relaxed">
                  "{entry.notes}"
                </p>
              )}

              {/* Photo preview if attached */}
              {entry.photoDataUrl && (
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-3">
                  <img
                    src={entry.photoDataUrl}
                    alt="Private progress record"
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-700"
                  />
                  <div className="text-[11px] text-zinc-500">
                    <span className="text-zinc-300 font-bold block">Private Local Photo Record</span>
                    <span>Stored only on this device for your private personal milestone tracking.</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MANDATORY SCIENTIFIC HEALTH NOTICE */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 text-xs text-zinc-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-200 block mb-0.5">Scientific Transparency Notice:</strong>
          Photographs and visual checks are subjective personal markers and cannot accurately measure true body composition, bone mineral density, visceral adipose tissue, or metabolic health. True body composition requires clinical modalities such as DEXA or hydrostatic weighing. NutriCoach evaluates holistic habits, strength consistency, and nutrition.
        </div>
      </div>

      {/* LOG PROGRESS ENTRY MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in space-y-4">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              BIOMETRIC LOGGING
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Record Fitness & Recovery Check-In
            </h3>

            <form onSubmit={handleSubmitEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Body Weight (KG) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Sleep Last Night (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formSleep}
                    onChange={(e) => setFormSleep(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Sliders for Energy & Recovery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-semibold uppercase text-[10px]">Energy Rating:</span>
                    <span className="text-[#ccff00] font-mono font-bold">{formEnergy}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formEnergy}
                    onChange={(e) => setFormEnergy(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-semibold uppercase text-[10px]">Recovery Score:</span>
                    <span className="text-[#ccff00] font-mono font-bold">{formRecovery}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formRecovery}
                    onChange={(e) => setFormRecovery(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                </div>
              </div>

              {/* Optional Circumference Measurements */}
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-2">
                  OPTIONAL BODY MEASUREMENTS (CM)
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">WAIST</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 84"
                      value={formWaist}
                      onChange={(e) => setFormWaist(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">CHEST</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 102"
                      value={formChest}
                      onChange={(e) => setFormChest(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">ARMS</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 36"
                      value={formArms}
                      onChange={(e) => setFormArms(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">THIGHS</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 58"
                      value={formThighs}
                      onChange={(e) => setFormThighs(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Private Local Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                  Optional Local Progress Photo (Stored Strictly On This Device)
                </label>
                <div className="flex items-center gap-3">
                  <label className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                    <ImageIcon className="w-4 h-4 text-[#ccff00]" /> Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoDataUrl && (
                    <span className="text-xs text-[#ccff00] font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Photo Attached
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Daily Notes & Subjective Feeling
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Hit a PR on bench, energy was high after eating carb-rich lunch..."
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all"
                >
                  Save Check-In Entry
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-5 py-3.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold border border-zinc-800"
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
