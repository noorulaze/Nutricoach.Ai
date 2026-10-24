import React, { useState } from 'react';
import { 
  LineChart, TrendingUp, Calendar, Plus, Scale, 
  BatteryCharging, Moon, ShieldAlert, Sparkles, X, Check, Image as ImageIcon 
} from 'lucide-react';
import { 
  getProfile, getFoodLog, getWorkoutPlan, 
  getProgressEntries, addProgressEntry, calculateTransparentProgressScore, getTodayKey 
} from '../utils/storage';
import { ProgressEntry } from '../types';
import { useToast } from '../context/ToastContext';

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

    const newEntry = addProgressEntry({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccff00] block mb-1">
            OBJECTIVE METRICS & RECOVERY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            FITNESS PROGRESS ASSESSMENT
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Focusing purely on personal consistency, strength progression, and biological recovery—never comparing you to others.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> LOG TODAY'S CHECK-IN
        </button>
      </div>

      {/* TRANSPARENT PROGRESS SCORE CARD */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#101507] to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ccff00] block mb-1">
              OBJECTIVE SCORING CRITERIA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight mb-2">
              OVERALL PROGRESS SCORE
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
              {scoreBreakdown.summary}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span>Goal: <strong className="text-white uppercase">{profile.goal.replace('_', ' ')}</strong></span>
              <span>•</span>
              <span>Current Weight: <strong className="text-[#ccff00]">{latestWeight} kg</strong></span>
              <span>•</span>
              <span>Net Change: <strong className="text-white">{Number(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg</strong></span>
            </div>
          </div>

          {/* Big Score Gauge */}
          <div className="bg-black/60 border border-zinc-800 rounded-3xl p-6 text-center w-full sm:w-64 shrink-0 shadow-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
              TRANSPARENT SCORE
            </span>
            <div className="text-6xl font-black font-heading text-[#ccff00] my-1 font-mono">
              {scoreBreakdown.totalScore}
            </div>
            <span className="text-xs text-zinc-400 font-mono">out of 100 points</span>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-500 text-left space-y-1">
              <div className="flex justify-between">
                <span>Workouts:</span>
                <span className="text-zinc-300 font-mono">{scoreBreakdown.workoutConsistencyScore}/30 pts</span>
              </div>
              <div className="flex justify-between">
                <span>Nutrition:</span>
                <span className="text-zinc-300 font-mono">{scoreBreakdown.nutritionAdherenceScore}/30 pts</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery:</span>
                <span className="text-zinc-300 font-mono">{scoreBreakdown.recoveryScore}/20 pts</span>
              </div>
              <div className="flex justify-between">
                <span>Habits:</span>
                <span className="text-zinc-300 font-mono">{scoreBreakdown.loggingHabitScore}/20 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOVERY & BIOMETRIC STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">ENERGY RATING</span>
              <span className="text-2xl font-black font-heading text-white">
                {entries[0]?.energyLevel || 8} <span className="text-xs font-normal text-zinc-400 font-mono">/ 10</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Perceived nervous system readiness for progressive overload training.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-400/15 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">SLEEP DURATION</span>
              <span className="text-2xl font-black font-heading text-white">
                {entries[0]?.sleepHours || 7.5} <span className="text-xs font-normal text-zinc-400 font-mono">hrs/night</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Deep restorative sleep drives muscle growth hormone release and mental stamina.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">LATEST BODY WEIGHT</span>
              <span className="text-2xl font-black font-heading text-white">
                {latestWeight} <span className="text-xs font-normal text-zinc-400 font-mono">kg</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Evaluated against your 3-week rolling trend line rather than day-to-day spikes.
          </p>
        </div>
      </div>

      {/* HISTORICAL CHECK-IN LOG ENTRIES */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block">
              CHRONOLOGICAL RECORD
            </span>
            <h3 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
              HISTORICAL PROGRESS ENTRIES
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{entries.length} entries recorded</span>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white text-sm bg-black/60 px-2.5 py-1 rounded border border-zinc-800">
                    {entry.date}
                  </span>
                  <span className="text-xs text-[#ccff00] font-mono font-bold">
                    {entry.weightKg} kg
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                  <span>Energy: <strong className="text-white">{entry.energyLevel}/10</strong></span>
                  <span>Sleep: <strong className="text-white">{entry.sleepHours}h</strong></span>
                  <span>Recovery: <strong className="text-white">{entry.recoveryRating}/10</strong></span>
                </div>
              </div>

              {/* Measurements row if recorded */}
              {entry.measurements && (
                <div className="flex flex-wrap gap-3 text-xs font-mono text-zinc-300 mb-2">
                  {entry.measurements.waistCm && <span>Waist: <strong>{entry.measurements.waistCm} cm</strong></span>}
                  {entry.measurements.chestCm && <span>Chest: <strong>{entry.measurements.chestCm} cm</strong></span>}
                  {entry.measurements.armsCm && <span>Arms: <strong>{entry.measurements.armsCm} cm</strong></span>}
                  {entry.measurements.thighsCm && <span>Thighs: <strong>{entry.measurements.thighsCm} cm</strong></span>}
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
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 text-xs text-zinc-500 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-300 block mb-0.5">Scientific Transparency Notice:</strong>
          Photographs and visual checks are subjective personal markers and cannot accurately measure true body composition, bone mineral density, visceral adipose tissue, or metabolic health. True body composition requires clinical modalities such as DEXA or hydrostatic weighing. NutriCoach evaluates holistic habits, strength consistency, and nutrition.
        </div>
      </div>

      {/* LOG PROGRESS ENTRY MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-fade-in space-y-4">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              BIOMETRIC LOGGING
            </span>
            <h3 className="text-2xl font-black font-heading text-white uppercase tracking-tight">
              RECORD FITNESS & RECOVERY CHECK-IN
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
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00]"
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
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-[#ccff00]"
                  />
                </div>
              </div>

              {/* Sliders for Energy & Recovery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
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
                  <div className="flex justify-between text-xs mb-1">
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
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-2">
                  OPTIONAL BODY MEASUREMENTS (CM)
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 block">WAIST</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 84"
                      value={formWaist}
                      onChange={(e) => setFormWaist(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block">CHEST</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 102"
                      value={formChest}
                      onChange={(e) => setFormChest(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block">ARMS</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 36"
                      value={formArms}
                      onChange={(e) => setFormArms(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block">THIGHS</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 58"
                      value={formThighs}
                      onChange={(e) => setFormThighs(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Private Local Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Optional Local Progress Photo (Stored Strictly On This Device)
                </label>
                <div className="flex items-center gap-3">
                  <label className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
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
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:border-[#ccff00]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all"
                >
                  SAVE CHECK-IN ENTRY
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-5 py-3.5 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-bold"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
