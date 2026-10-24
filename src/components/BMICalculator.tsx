import React, { useState } from 'react';
import { Calculator, ArrowRight, Flame, Target, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('imperial');
  const [weight, setWeight] = useState<string>('185');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('10');
  const [weightKg, setWeightKg] = useState<string>('84');
  const [heightCm, setHeightCm] = useState<string>('178');
  const [activity, setActivity] = useState<string>('moderate');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Calculate BMI
  let bmi = 0;
  let weightInKg = 0;

  if (unit === 'imperial') {
    const totalInches = (parseFloat(heightFeet) || 0) * 12 + (parseFloat(heightInches) || 0);
    const weightVal = parseFloat(weight) || 0;
    if (totalInches > 0 && weightVal > 0) {
      bmi = (weightVal / (totalInches * totalInches)) * 703;
      weightInKg = weightVal * 0.453592;
    }
  } else {
    const heightM = (parseFloat(heightCm) || 0) / 100;
    const weightVal = parseFloat(weightKg) || 0;
    if (heightM > 0 && weightVal > 0) {
      bmi = weightVal / (heightM * heightM);
      weightInKg = weightVal;
    }
  }

  // Determine category
  let category = 'Normal Weight';
  let badgeColor = 'text-[#ccff00] border-[#ccff00]/40 bg-[#ccff00]/10';
  let recommendedProgram = {
    title: 'Titan Hypertrophy Matrix',
    id: 'titan-hypertrophy',
    reason: 'Ideal for muscle mass building, body recomposition, and structural density.'
  };

  if (bmi < 18.5) {
    category = 'Lean / Underweight';
    badgeColor = 'text-blue-400 border-blue-400/40 bg-blue-500/10';
    recommendedProgram = {
      title: 'Titan Hypertrophy Matrix',
      id: 'titan-hypertrophy',
      reason: 'Focus on caloric surplus and heavy compound muscle hypertrophy to build dense mass.'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Athletic / Optimal';
    badgeColor = 'text-[#ccff00] border-[#ccff00]/40 bg-[#ccff00]/10';
    recommendedProgram = {
      title: 'Iron Powerlifting Protocol',
      id: 'iron-barbell-power',
      reason: 'Push for raw strength ceilings, central nervous system adaptation, and PR records.'
    };
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Muscular / Recomp Zone';
    badgeColor = 'text-yellow-400 border-yellow-400/40 bg-yellow-500/10';
    recommendedProgram = {
      title: 'Metabolic Shred & Conditioning',
      id: 'metabolic-shred-hiit',
      reason: 'Elevate VO2 max, accelerate lipid oxidation, and preserve lean athletic muscle.'
    };
  } else {
    category = 'High Mass / Shred Required';
    badgeColor = 'text-red-400 border-red-400/40 bg-red-500/10';
    recommendedProgram = {
      title: 'Apex Tactical Athlete',
      id: 'athletic-performance-hybrid',
      reason: 'Reclaim multi-planar agility, joint durability, and high calorie expenditure.'
    };
  }

  // Approximate TDEE
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725
  };
  const baseBMR = gender === 'male' ? weightInKg * 24 : weightInKg * 22;
  const estimatedTDEE = Math.round(baseBMR * (activityMultipliers[activity] || 1.55));

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10 items-stretch">
        {/* Left Input Form */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide">
                  BIOMETRIC PERFORMANCE CALCULATOR
                </h3>
                <p className="text-xs text-zinc-400">Compute your target indices and tailored program match</p>
              </div>
            </div>

            {/* Units Toggle */}
            <div className="flex items-center bg-black/80 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  unit === 'imperial' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                US / LBS
              </button>
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  unit === 'metric' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                METRIC / KG
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Biological Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    gender === 'male'
                      ? 'bg-zinc-800 border-[#ccff00] text-[#ccff00]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    gender === 'female'
                      ? 'bg-zinc-800 border-[#ccff00] text-[#ccff00]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Current Activity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]"
              >
                <option value="sedentary">Desk Work (1-2x/wk)</option>
                <option value="light">Light Training (3x/wk)</option>
                <option value="moderate">Consistent Lifting (4-5x/wk)</option>
                <option value="heavy">Athlete / 2-a-Days (6+x/wk)</option>
              </select>
            </div>

            {/* Height & Weight Inputs */}
            {unit === 'imperial' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Height (Feet & Inches)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="Feet"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                    />
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="Inches"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Weight (LBS)
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 185"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Height (CM)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g. 178"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Weight (KG)
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="250"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g. 84"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="w-full lg:w-80 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-1">
              ESTIMATED METRIC SCORE
            </span>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
                {bmi > 0 ? bmi.toFixed(1) : '--'}
              </span>
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${badgeColor}`}>
                {category}
              </span>
            </div>

            <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Maintenance TDEE:
                </span>
                <span className="font-mono font-bold text-white">~{estimatedTDEE} kcal/day</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Target className="w-3.5 h-3.5 text-[#ccff00]" /> Fat Loss Target:
                </span>
                <span className="font-mono font-bold text-[#ccff00]">~{estimatedTDEE - 500} kcal</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Dumbbell className="w-3.5 h-3.5 text-cyan-400" /> Hypertrophy Surplus:
                </span>
                <span className="font-mono font-bold text-cyan-300">~{estimatedTDEE + 350} kcal</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">
              RECOMMENDED PROTOCOL
            </span>
            <div className="font-bold text-sm text-white mb-1">{recommendedProgram.title}</div>
            <p className="text-[11px] text-zinc-400 mb-3">{recommendedProgram.reason}</p>
            <Link
              to={`/programs#${recommendedProgram.id}`}
              className="inline-flex items-center justify-center gap-1.5 w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors"
            >
              EXPLORE PROGRAM <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
