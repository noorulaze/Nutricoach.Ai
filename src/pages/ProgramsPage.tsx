import React, { useState } from 'react';
import { 
  Zap, Search, Flame, Clock, Calendar, User, 
  ArrowRight, CheckCircle2, SlidersHorizontal, Dumbbell 
} from 'lucide-react';
import { PROGRAMS } from '../data/gymData';
import { Program } from '../types';
import ProgramModal from '../components/ProgramModal';

interface ProgramsPageProps {
  onOpenFreePass: () => void;
}

export default function ProgramsPage({ onOpenFreePass }: ProgramsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProgram, setActiveModalProgram] = useState<Program | null>(null);

  const categories = ['All', 'Hypertrophy', 'Strength', 'HIIT', 'Athletics', 'Women', 'Recovery'];

  const filteredPrograms = PROGRAMS.filter((prog) => {
    const matchesCategory = selectedCategory === 'All' || prog.category === selectedCategory;
    const matchesSearch =
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.targetFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.coach.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-20 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-radial-gradient">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> SCIENTIFIC PERIODIZATION BLUEPRINTS
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            ENGINEERED <span className="text-[#ccff00]">TRAINING</span> PROTOCOLS
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Every program at IronHub is engineered by collegiate exercise physiologists and IFBB/USAPL champions. Designed for progressive overload, maximum muscular adaptation, and injury-free progression.
          </p>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat === 'Women' ? "Women's Strength" : cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by goal or coach..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
            />
          </div>
        </div>
      </section>

      {/* PROGRAMS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white font-heading">NO PROGRAMS FOUND</h3>
            <p className="text-zinc-500 text-xs mt-1">Try tweaking your search keywords or selecting 'All'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                id={program.id}
                className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/50 rounded-2xl overflow-hidden transition-all duration-300 group shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    <span className="absolute top-4 left-4 bg-black/80 text-[#ccff00] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#ccff00]/40">
                      {program.category}
                    </span>
                    <span className="absolute top-4 right-4 bg-black/80 text-zinc-300 text-[10px] font-mono uppercase px-2.5 py-1 rounded border border-zinc-700">
                      {program.difficulty}
                    </span>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
                      <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded">
                        <Clock className="w-3.5 h-3.5 text-[#ccff00]" /> {program.durationWeeks} WEEKS
                      </span>
                      <span className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded text-[#ccff00]">
                        <Flame className="w-3.5 h-3.5 fill-[#ccff00]" /> {program.sessionsPerWeek}X / WK
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        TARGET FOCUS:
                      </span>
                      <div className="flex items-center gap-0.5 text-[#ccff00]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Flame
                            key={i}
                            className={`w-3.5 h-3.5 ${i < program.intensity ? 'fill-[#ccff00]' : 'text-zinc-700'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black font-heading text-white tracking-wide mb-2">
                      {program.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                      {program.tagline}
                    </p>

                    <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Head Coach:</span>
                        <span className="text-white font-bold flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#ccff00]" /> {program.coach}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1 text-zinc-400">
                        <span>Burn Estimate:</span>
                        <span className="text-[#ccff00] font-mono font-bold">{program.caloriesBurnEstimate}</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-zinc-800/80 pt-4 mb-2 text-xs text-zinc-300">
                      {program.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => setActiveModalProgram(program)}
                    className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase text-xs tracking-wider py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] flex items-center justify-center gap-2"
                  >
                    VIEW FULL SYLLABUS <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onOpenFreePass}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold uppercase text-[11px] tracking-wider py-2.5 rounded-xl border border-zinc-800 transition-colors"
                  >
                    BOOK FREE TRIAL CLASS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 1-ON-1 COACHING VS GROUP COMPARISON MATRIX */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            METHODOLOGY COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            1-ON-1 MASTER COACHING VS. SIGNATURE TEAM PROTOCOLS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Group Blueprint */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              SIGNATURE TEAM PROTOCOLS
            </span>
            <h3 className="text-2xl font-black font-heading text-white mb-2">
              HIGH ENERGY SQUAD ENVIRONMENT
            </h3>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              Ideal for lifters who thrive in competitive camaraderie, structured weekly splits, and high-octane atmosphere under head coach direction.
            </p>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>12 to 16 athletes max per session for attentive coaching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>Synchronized interval timers and heart-rate telemetry displays</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>Full access included in IRON PRO and IRON ELITE tiers</span>
              </li>
            </ul>
          </div>

          {/* 1-on-1 Private */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 shadow-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
              1-ON-1 PRIVATE MENTORSHIP
            </span>
            <h3 className="text-2xl font-black font-heading text-white mb-2">
              SURGICAL BIOMECHANICAL FOCUS
            </h3>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              Unrestricted attention from our master coaches. Tailored millimeter barbell bar-path corrections, personalized daily macro adjustments, and injury prehab.
            </p>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>Dedicated private platform during all sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>Velocity-based barbell sensor kinematics analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>Direct 24/7 coach WhatsApp access for nutrition checks</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Active Modal */}
      <ProgramModal
        program={activeModalProgram}
        isOpen={!!activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
        onClaimPass={onOpenFreePass}
      />
    </div>
  );
}
