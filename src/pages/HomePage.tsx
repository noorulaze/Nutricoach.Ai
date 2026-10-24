import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, ShieldCheck, Dumbbell, Flame, Trophy, 
  Clock, MapPin, CheckCircle2, ChevronRight, Activity, Sparkles, Star
} from 'lucide-react';
import { GYM_INFO, PROGRAMS, TRAINERS, FACILITIES, TESTIMONIALS } from '../data/gymData';
import BMICalculator from '../components/BMICalculator';

interface HomePageProps {
  onOpenFreePass: () => void;
}

export default function HomePage({ onOpenFreePass }: HomePageProps) {
  return (
    <div className="space-y-24 sm:space-y-32">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Cinematic Image with dark gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
            alt="IronHub Fitness Olympic Training Floor"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/65 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_20px_rgba(204,255,0,0.2)] mb-6 animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-[#ccff00]" />
            <span>THE PINNACLE OF HARDCORE STRENGTH & ATHLETIC SCIENCE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-white uppercase leading-[0.95] max-w-5xl mx-auto mb-6">
            FORGE YOUR <span className="text-[#ccff00] neon-text-glow">ULTIMATE</span> PHYSIQUE
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Olympic-calibrated Eleiko barbells, sub-zero bio-recovery sanctuaries, and world-class master coaches. No crowded waiting lines. Zero corporate excuses. Just pure, uncompromised performance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <button
              onClick={onOpenFreePass}
              className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase text-sm tracking-wider py-4 px-8 rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-[0_0_30px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-5 h-5" /> CLAIM FREE DAY PASS
            </button>
            <Link
              to="/programs"
              className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-[#ccff00]/50 font-bold uppercase text-sm tracking-wider py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              VIEW PROGRAMS <ArrowRight className="w-4 h-4 text-[#ccff00]" />
            </Link>
          </div>

          {/* Key Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 border-t border-zinc-800/80 pt-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
              <span className="text-zinc-200 font-semibold">24/7 Biometric Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#ccff00]" />
              <span className="text-zinc-200 font-semibold">120k+ lbs of Steel Plates</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ccff00]" />
              <span className="text-zinc-200 font-semibold">Sub-Zero Plunges & Saunas</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#ccff00] text-[#ccff00]" />
              <span className="text-zinc-200 font-semibold">4.98 / 5 Rating (1,200+ Reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 bg-gradient-to-b from-[#14141c] to-[#0c0c10] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {GYM_INFO.stats.map((stat, idx) => (
            <div key={idx} className="text-center p-3 border-r last:border-r-0 border-zinc-800/80">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white tracking-wide">
                <span className="text-[#ccff00]">{stat.value.replace(/[^0-9+%k. ]/g, '')}</span>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE 4 PILLARS OF IRONHUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            WHY IRONHUB REIGNS SUPREME
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
            BUILT FOR THOSE WHO REFUSE MEDIOCRITY
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed">
            We tore up the corporate gym playbook. No high-pressure sales pitches, no broken machines left neglected for months, and no crowds taking selfies on the squat racks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-6 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white tracking-wide mb-3">
              OLYMPIC STEEL & POWER RACKS
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
              Over 16 Rogue Monster cages, Eleiko competition bumper plates, Watson revolving grip dumbbells to 150 lbs, and acoustic shock-absorbent platforms.
            </p>
            <span className="text-xs font-bold text-[#ccff00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Tour Heavy Iron Deck <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white tracking-wide mb-3">
              BIOMETRIC COACHING
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
              Real-time telemetry, 1RM velocity sensors, InBody 770 composition scans, and periodized training blueprints tailored to your neurological recovery rate.
            </p>
            <span className="text-xs font-bold text-[#ccff00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Meet Master Coaches <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white tracking-wide mb-3">
              BIO-RECOVERY SUITE
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
              Accelerate muscular supercompensation with 42°F sub-zero cold plunge tubs, 195°F Finnish saunas, medical-grade red light therapy, and Normatec compression.
            </p>
            <span className="text-xs font-bold text-[#ccff00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore Recovery Spa <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pillar 4 */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white tracking-wide mb-3">
              24/7 UNRESTRICTED ACCESS
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
              Train on your schedule. Secure biometric keycard door entry, monitored security telemetry, fully lit platforms, and private locker access day or night.
            </p>
            <span className="text-xs font-bold text-[#ccff00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Check Access Details <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
              ELITE BLUEPRINTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
              TRAINING PROGRAMS DESIGNED TO DELIVER
            </h2>
          </div>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ccff00] hover:underline"
          >
            VIEW ALL 6 SPECIALIZED PROGRAMS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROGRAMS.slice(0, 3).map((program) => (
            <div
              key={program.id}
              className="bg-zinc-900/80 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Program image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />
                  <span className="absolute top-4 left-4 bg-black/80 text-[#ccff00] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-[#ccff00]/40">
                    {program.category}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-mono">
                    <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded">
                      <Clock className="w-3.5 h-3.5 text-[#ccff00]" /> {program.durationWeeks} WEEKS
                    </span>
                    <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded text-[#ccff00]">
                      <Flame className="w-3.5 h-3.5 fill-[#ccff00]" /> {program.caloriesBurnEstimate}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-xl font-black font-heading text-white tracking-wide mb-2">
                    {program.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    {program.tagline}
                  </p>

                  <div className="space-y-2 border-t border-zinc-800/80 pt-4 mb-4 text-xs text-zinc-300">
                    {program.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/programs#${program.id}`}
                  className="w-full bg-zinc-800 hover:bg-[#ccff00] text-white hover:text-black font-extrabold uppercase text-xs tracking-wider py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  VIEW SYLLABUS & SCHEDULE <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE BIOMETRIC CALCULATOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BMICalculator />
      </section>

      {/* MEET OUR ELITE MASTER COACHES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
              WORLD-CLASS MENTORSHIP
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
              COACHED BY WORLD CHAMPIONS & SCIENTISTS
            </h2>
          </div>
          <Link
            to="/trainers"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ccff00] hover:underline"
          >
            VIEW FULL 6 COACH ROSTER <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINERS.slice(0, 4).map((trainer) => (
            <div
              key={trainer.id}
              className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl overflow-hidden transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-black/80 text-[#ccff00] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#ccff00]/30">
                    {trainer.experienceYears} YRS EXP
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-extrabold uppercase text-[#ccff00] tracking-wider block mb-1">
                    {trainer.specialty.split(',')[0]}
                  </span>
                  <h3 className="text-lg font-bold font-heading text-white tracking-wide">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{trainer.role}</p>

                  <p className="text-xs text-zinc-400 italic mt-3 border-l-2 border-[#ccff00]/50 pl-2 line-clamp-2">
                    "{trainer.quote}"
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/trainers#${trainer.id}`}
                  className="w-full bg-zinc-800 hover:bg-[#ccff00] text-zinc-200 hover:text-black font-extrabold uppercase text-[11px] tracking-wider py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  VIEW PROFILE & BOOK <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITIES PREVIEW GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            ATHLETIC ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight uppercase">
            3 METRO HUBS. OVER 115,000 SQ. FT. OF PURPOSE
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Every square foot is engineered for biomechanical efficiency, acoustically isolated for heavy drops, and filtered with hospital-grade clean air.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FACILITIES.slice(0, 3).map((facility) => (
            <div
              key={facility.id}
              className="relative rounded-2xl overflow-hidden group border border-zinc-800 shadow-xl h-80"
            >
              <img
                src={facility.image}
                alt={facility.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ccff00] bg-black/70 px-2 py-0.5 rounded border border-[#ccff00]/40">
                  {facility.sqft}
                </span>
                <h3 className="text-2xl font-black font-heading text-white tracking-wide mt-2">
                  {facility.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 mt-1">
                  {facility.description}
                </p>
                <Link
                  to="/facilities"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ccff00] hover:underline mt-3"
                >
                  Explore Zone Equipment <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MEMBER TRANSFORMATIONS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-950 via-[#101306] to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
              REAL RESULTS. ZERO FILTERS.
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
              PROVEN TRANSFORMATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {TESTIMONIALS.slice(0, 2).map((test) => (
              <div
                key={test.id}
                className="bg-black/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 relative"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#ccff00]"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white font-heading">{test.name}</h4>
                    <span className="text-xs text-zinc-400">{test.profession} • {test.duration}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 italic mb-6 leading-relaxed">
                  "{test.quote}"
                </p>

                {/* Metric pill tags */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-center text-xs">
                  {test.stats.map((s, i) => (
                    <div key={i}>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">{s.label}</span>
                      <span className="text-[#ccff00] font-black font-mono">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ccff00] hover:underline"
            >
              READ ALL 6 IN-DEPTH MEMBER CASE STUDIES <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL MASSIVE CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#ccff00]/40 p-8 sm:p-16 text-center bg-gradient-to-b from-zinc-950 to-zinc-900 shadow-[0_0_50px_rgba(204,255,0,0.15)]">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(204,255,0,0.5)]">
              <Zap className="w-8 h-8 fill-black" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading text-white uppercase tracking-tight mb-4 leading-tight">
              STOP SETTLING FOR <span className="text-[#ccff00]">AVERAGE</span>
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Join 18,500+ athletes who forged their legacy in our racks. Your first workout is completely on us. Claim your VIP pass and experience the IronHub difference today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenFreePass}
                className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase text-sm tracking-wider py-4 px-10 rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-[0_0_30px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-5 h-5" /> CLAIM MY FREE VIP PASS
              </button>
              <Link
                to="/membership"
                className="w-full sm:w-auto bg-black/60 hover:bg-black text-white border border-zinc-700 hover:border-[#ccff00] font-bold uppercase text-sm tracking-wider py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                VIEW MEMBERSHIP PLANS <ArrowRight className="w-4 h-4 text-[#ccff00]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
