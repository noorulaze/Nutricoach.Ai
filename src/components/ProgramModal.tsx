import React from 'react';
import { X, Flame, Clock, Calendar, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { Program } from '../types';

interface ProgramModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimPass: () => void;
}

export default function ProgramModal({ program, isOpen, onClose, onClaimPass }: ProgramModalProps) {
  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f0f14] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in">
        {/* Header Hero Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-[#0f0f14]/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-zinc-300 hover:text-white p-2 rounded-full border border-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ccff00] bg-black/60 px-2.5 py-1 rounded border border-[#ccff00]/40">
              {program.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-wide mt-2">
              {program.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-zinc-300 text-sm leading-relaxed">{program.description}</p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px]">INTENSITY</span>
              <div className="flex items-center gap-1 text-[#ccff00] mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-3.5 h-3.5 ${i < program.intensity ? 'fill-[#ccff00]' : 'text-zinc-700'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px]">DURATION</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#ccff00]" /> {program.durationWeeks} Weeks
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px]">FREQUENCY</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#ccff00]" /> {program.sessionsPerWeek}x / week
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px]">LEAD COACH</span>
              <span className="font-bold text-white truncate flex items-center gap-1 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#ccff00]" /> {program.coach.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-3">
              WHAT’S INCLUDED IN THIS BLUEPRINT
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {program.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Phases */}
          <div>
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-3">
              SYLLABUS & PROGRESSION PHASES
            </h4>
            <div className="space-y-2.5">
              {program.curriculum.map((curr, idx) => (
                <div key={idx} className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 text-xs">
                  <div className="flex justify-between items-center font-bold text-white mb-1">
                    <span className="text-[#ccff00]">{curr.phase}</span>
                    <span className="text-zinc-500 font-mono text-[11px]">{curr.duration}</span>
                  </div>
                  <p className="text-zinc-400">{curr.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onClaimPass();
              }}
              className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2"
            >
              BOOK TRIAL FOR THIS PROGRAM <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-bold text-zinc-300 uppercase tracking-wider"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
