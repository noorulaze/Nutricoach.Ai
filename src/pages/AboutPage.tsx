import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, ShieldCheck, Award, HeartHandshake, Flame, 
  Dumbbell, Target, Clock, ArrowRight, Users, CheckCircle2 
} from 'lucide-react';

interface AboutPageProps {
  onOpenFreePass: () => void;
}

export default function AboutPage({ onOpenFreePass }: AboutPageProps) {
  const milestones = [
    {
      year: '2014',
      title: 'The Underground Forge',
      desc: 'Founded in a 2,500 sq. ft. Brooklyn warehouse by 3 competitive powerlifters frustrated by commercial gyms banning chalk, deadlifts, and heavy effort.'
    },
    {
      year: '2017',
      title: 'Downtown Flagship Launch',
      desc: 'Opened our 42,000 sq. ft. flagship on Iron Forge Blvd with 16 custom Rogue racks and Eleiko calibrated Olympic plates. 1,000 founding members joined within 48 hours.'
    },
    {
      year: '2020',
      title: 'The Bio-Recovery Revolution',
      desc: 'Integrated full sports medicine and physical therapy on-site, introducing medical-grade sub-zero cold plunge tubs and 195°F cedar Finnish dry saunas.'
    },
    {
      year: '2023',
      title: 'Uptown & Westside Expansion',
      desc: 'Added 73,000 sq. ft. across two new premier locations, bringing 50-meter indoor sprint sled turf and biometric telemetry to all Metro members.'
    },
    {
      year: '2026',
      title: 'The Golden Standard of Strength',
      desc: 'Now home to 18,500+ passionate members, 36 world-class coaches, and recognized as the benchmark hardcore athletic facility in the nation.'
    }
  ];

  const values = [
    {
      icon: Dumbbell,
      title: 'UNCOMPROMISED EQUIPMENT',
      desc: 'We never buy plastic or compromise on tolerances. Every barbell is tested for tensile whip, every plate is calibrated, and every rack is bolted to concrete.'
    },
    {
      icon: Target,
      title: 'DATA-BACKED PERIODIZATION',
      desc: 'We eliminate guessing games. Our programs blend neuromuscular fatigue monitoring, velocity-based training, and nutritional bio-individuality.'
    },
    {
      icon: Users,
      title: 'AN UNBREAKABLE TRIBE',
      desc: 'Egos stay at the turnstiles. Whether you are squatting 135 lbs for the first time or deadlifting 700 lbs, you will receive the exact same respect.'
    },
    {
      icon: ShieldCheck,
      title: 'LONGEVITY & RECOVERY',
      desc: 'True strength is sustainable. We prioritize joint integrity, myofascial health, and nervous system replenishment so you remain active for decades.'
    }
  ];

  const leaders = [
    {
      name: 'Viktor Sterling',
      role: 'Founder & CEO',
      bio: 'Former collegiate decathlete and national master powerlifter. Viktor established IronHub with a relentless mission to build a temple worthy of true lifters.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Dr. Rebecca Vance, Ph.D.',
      role: 'Head of Sports Biomechanics',
      bio: 'Published sports physiology researcher and former Olympic trainer specializing in kinetic motor unit recruitment and eccentric loading protocols.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Cole Remington',
      role: 'Director of Facility Operations',
      bio: 'Mechanical engineer and former competitive strongman. Cole personally oversees our 120,000 lbs of steel calibrations, air purification, and cold plunge telemetry.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-radial-gradient">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2000&q=80"
            alt="IronHub Gym Community"
            className="w-full h-full object-cover object-center filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#08080a]/80 to-[#08080a]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> OUR ORIGIN & SACRED MISSION
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            WHERE PASSION MEETS <span className="text-[#ccff00]">STEEL</span>
          </h1>
          <p className="text-base sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            IronHub was born out of anger with conventional corporate gyms that traded heavy iron for smoothies and banned the noise of hard work. We built a cathedral where discipline is revered.
          </p>
        </div>
      </section>

      {/* THE MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block">
              THE IRON MANIFESTO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white uppercase tracking-tight">
              A REFUGIUM FOR THE COMMITTED LIFTER
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              In 2014, commercial fitness had lost its soul. Free weights were shrinking, squat racks were being replaced by vibration plates, and dropping a deadlift resulted in a buzzer alarm.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We took our life savings, leased an underground garage, and ordered 10,000 pounds of raw steel plates. We believed that if you treat athletes with respect, provide them with Olympic-grade equipment, and surround them with passionate coaches, extraordinary transformations happen.
            </p>

            <div className="space-y-3 pt-2 text-sm text-zinc-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ccff00] shrink-0" />
                <span>Zero wait times: We maintain a strict member-to-rack ratio limit.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ccff00] shrink-0" />
                <span>Chalk allowed & provided at every single barbell station.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ccff00] shrink-0" />
                <span>Integrated sports science, DEXA scanning, and cryo recovery.</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenFreePass}
                className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] inline-flex items-center gap-2"
              >
                <Dumbbell className="w-4 h-4" /> VISIT US WITH A FREE VIP PASS
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                alt="IronHub Sanctuary Atmosphere"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-zinc-950/90 border border-zinc-700/80 rounded-xl p-4 backdrop-blur-md">
                  <span className="text-[10px] font-mono uppercase text-[#ccff00] tracking-wider block font-bold">
                    ESTABLISHED 2014
                  </span>
                  <div className="text-white font-heading text-lg font-bold">
                    "WE DO NOT ADAPT TO WEAKNESS. WE TRAIN TO CONQUER IT."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            OUR SACRED PRINCIPLES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
            WHAT GUIDES EVERY REP & DECISION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white tracking-wide mb-2">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIMELINE / MILESTONES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            A DECADE OF EVOLUTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
            THE CHRONICLES OF IRONHUB
          </h2>
        </div>

        <div className="relative border-l-2 border-zinc-800 ml-4 sm:ml-32 space-y-12">
          {milestones.map((ms, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10 group">
              {/* Year indicator on desktop */}
              <div className="sm:absolute sm:-left-32 sm:text-right font-mono font-bold text-lg text-[#ccff00] mb-1 sm:mb-0">
                {ms.year}
              </div>

              {/* Dot on line */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-900 border-2 border-[#ccff00] group-hover:scale-125 transition-transform" />

              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 group-hover:border-[#ccff00]/30 transition-colors">
                <h3 className="text-xl font-bold font-heading text-white tracking-wide mb-2">
                  {ms.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERSHIP SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            STEWARDS OF THE FORGE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
            EXECUTIVE LEADERSHIP & SCIENCE BOARD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-[#ccff00]/40 transition-all"
            >
              <div className="h-72 overflow-hidden relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-wider block mb-1">
                  {leader.role}
                </span>
                <h3 className="text-xl font-bold font-heading text-white tracking-wide mb-2">
                  {leader.name}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY IMPACT & MEETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 mb-3">
              <HeartHandshake className="w-3.5 h-3.5" /> GIVING BACK THROUGH STRENGTH
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-wide mb-3">
              $450,000+ RAISED FOR YOUTH ATHLETICS
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Every November, IronHub hosts the "Deadlift for Hope" powerlifting meet where 100% of registration fees fund inner-city high school weight rooms, wrestling gear, and youth strength coaching.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/contact"
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center gap-2"
            >
              SPONSOR / PARTICIPATE IN MEETS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
