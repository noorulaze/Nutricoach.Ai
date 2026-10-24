import React, { useState } from 'react';
import { 
  Zap, Star, Award, ShieldCheck, Dumbbell, 
  ArrowRight, Users, CheckCircle2, Calendar, MessageSquare 
} from 'lucide-react';
import { TRAINERS } from '../data/gymData';
import { Trainer } from '../types';
import TrainerBookingModal from '../components/TrainerBookingModal';

export default function TrainersPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [activeTrainerForBooking, setActiveTrainerForBooking] = useState<Trainer | null>(null);

  const specialties = ['All', 'Master', 'Strength', 'Conditioning', 'Rehab'];

  const filteredTrainers = TRAINERS.filter((trainer) => {
    if (selectedSpecialty === 'All') return true;
    return trainer.category === selectedSpecialty;
  });

  return (
    <div className="space-y-20 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-radial-gradient">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> WORLD-CLASS MENTORSHIP & BIOMECHANICS
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            THE <span className="text-[#ccff00]">ELITE</span> COACH ROSTER
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Our trainers are not commercial gym employees reading a generic tablet. They are IFBB Pro champions, USAPL powerlifting directors, Doctors of Physical Therapy, and national collegiate coaches.
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedSpecialty === spec
                  ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {spec === 'Master' ? 'Master Coaches' : spec}
            </button>
          ))}
        </div>
      </section>

      {/* TRAINERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              id={trainer.id}
              className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/50 rounded-2xl overflow-hidden transition-all duration-300 group shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/80 text-[#ccff00] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#ccff00]/40">
                      {trainer.category} COACH
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/80 border border-zinc-700 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#ccff00] text-[#ccff00]" />
                    <span>{trainer.rating}</span>
                    <span className="text-zinc-500 text-[10px]">({trainer.reviewCount})</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 font-mono">
                    <span className="bg-black/80 px-2 py-0.5 rounded border border-zinc-800">
                      {trainer.experienceYears} YEARS EXP
                    </span>
                    <span className="bg-black/80 px-2 py-0.5 rounded text-[#ccff00] border border-zinc-800">
                      {trainer.clientsTrained}+ ATHLETES
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-widest block mb-1">
                    {trainer.specialty}
                  </span>
                  <h3 className="text-2xl font-black font-heading text-white tracking-wide mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">{trainer.role}</p>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {trainer.bio}
                  </p>

                  <p className="text-xs text-zinc-400 italic mb-4 border-l-2 border-[#ccff00] pl-3 py-0.5 bg-zinc-900/40 rounded-r">
                    "{trainer.quote}"
                  </p>

                  {/* Certifications tags */}
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2">
                      CERTIFICATIONS & CREDENTIALS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Achievements */}
                  <div className="space-y-1.5 border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
                    {trainer.achievements.slice(0, 2).map((ach, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveTrainerForBooking(trainer)}
                  className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> BOOK 1-ON-1 SESSION WITH {trainer.name.split(' ')[0].toUpperCase()}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE IRON STANDARD HIRING PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
              WHY OUR COACHES ARE DIFFERENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight mb-3">
              ONLY 1 IN 50 COACHES PASS OUR TRIAL
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We do not accept weekend online certificates. Every coach undergoes a 60-day barbell kinematics review, practical joint mobility exams, and live Olympic lift cueing evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] font-bold">
                01
              </div>
              <h4 className="font-bold text-white text-sm">Biomechanical Analysis</h4>
              <p className="text-zinc-400">Deep examination of human kinetics, spinal loading, and hip angle anatomy under load.</p>
            </div>

            <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] font-bold">
                02
              </div>
              <h4 className="font-bold text-white text-sm">Injury Prehab & Rehab</h4>
              <p className="text-zinc-400">Mandatory training in joint decompression, fascial release, and return-to-sport protocols.</p>
            </div>

            <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00] font-bold">
                03
              </div>
              <h4 className="font-bold text-white text-sm">Unwavering Empathy & Drive</h4>
              <p className="text-zinc-400">Zero tolerance for disengaged trainers checking phones. Our coaches are in the trenches with you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <TrainerBookingModal
        trainer={activeTrainerForBooking}
        isOpen={!!activeTrainerForBooking}
        onClose={() => setActiveTrainerForBooking(null)}
      />
    </div>
  );
}
