import React, { useState } from 'react';
import { 
  Zap, Star, Trophy, Flame, Dumbbell, ShieldCheck, 
  ArrowRight, CheckCircle2, Play, MessageSquare, PlusCircle 
} from 'lucide-react';
import { TESTIMONIALS } from '../data/gymData';
import { useToast } from '../context/ToastContext';

interface TestimonialsPageProps {
  onOpenFreePass: () => void;
}

export default function TestimonialsPage({ onOpenFreePass }: TestimonialsPageProps) {
  const { showToast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<string>('All');
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyForm, setStoryForm] = useState({
    name: '',
    email: '',
    achievement: '',
    story: '',
    coach: 'Marcus Vance'
  });

  const goals = ['All', 'Fat Loss', 'Hypertrophy', 'Strength', 'Rehab'];

  const filteredTestimonials = TESTIMONIALS.filter((test) => {
    if (selectedGoal === 'All') return true;
    return test.category === selectedGoal;
  });

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingStory(true);

    setTimeout(() => {
      setIsSubmittingStory(false);
      setShowStoryModal(false);
      showToast(`Thank you ${storyForm.name}! Your transformation story has been received for the Iron Spotlight.`, 'success', 'Story Submitted');
      setStoryForm({ name: '', email: '', achievement: '', story: '', coach: 'Marcus Vance' });
    }, 700);
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-radial-gradient">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> 100% VERIFIED TRANSFORMATIONS
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            REAL BLOOD. REAL <span className="text-[#ccff00]">TRIUMPH</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto mb-10">
            Read unfiltered case studies from software engineers, emergency physicians, collegiate competitors, and parents who transformed their bodies and reclaimed their power at IronHub.
          </p>

          {/* Social Proof Stats Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl shadow-xl text-xs">
            <div className="flex items-center gap-2">
              <div className="flex text-[#ccff00]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#ccff00]" />
                ))}
              </div>
              <span className="font-bold text-white font-mono text-sm">4.98 / 5.0</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="text-zinc-300 font-semibold">
              <span className="text-[#ccff00] font-mono font-bold">1,240+</span> Verified Reviews
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-[#ccff00]" /> Google & Trustpilot Audited
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS & SUBMIT BUTTON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {goals.map((goal) => (
              <button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedGoal === goal
                    ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowStoryModal(true)}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-[#ccff00]/40 text-[#ccff00] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" /> SUBMIT YOUR TRANSFORMATION
          </button>
        </div>
      </section>

      {/* TESTIMONIALS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((test) => (
            <div
              key={test.id}
              className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-[#ccff00]/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group shadow-xl"
            >
              <div>
                {/* Member Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#ccff00] shrink-0"
                  />
                  <div>
                    <div className="flex text-[#ccff00] gap-0.5 mb-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#ccff00]" />
                      ))}
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white tracking-wide">
                      {test.name}
                    </h3>
                    <p className="text-xs text-zinc-400">{test.profession} • Age {test.age}</p>
                  </div>
                </div>

                {/* Achievement Highlight */}
                <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl p-3 mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#ccff00] tracking-wider block">
                    KEY MILESTONE
                  </span>
                  <div className="text-white text-xs font-bold mt-0.5">
                    {test.achievement}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-zinc-300 text-xs sm:text-sm italic leading-relaxed mb-6">
                  "{test.quote}"
                </p>

                {/* Metric pill tags */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-center mb-6">
                  {test.stats.map((s, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] text-zinc-500 uppercase block font-bold">{s.label}</span>
                      <span className="text-[#ccff00] font-black font-mono text-xs sm:text-sm">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>Timeline: <strong className="text-white">{test.duration}</strong></span>
                <span>Coach: <strong className="text-[#ccff00]">{test.trainer.split(' ')[0]}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO CASE STUDIES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
              CINEMATIC DOCUSERIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
              WATCH: "FORGED IN IRON" MINI-STORIES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video Card 1 */}
            <div
              onClick={() => showToast('Playing Member Spotlight: Overcoming 10 Years of Sedentary Living', 'info', 'Video Player')}
              className="relative h-72 rounded-2xl overflow-hidden cursor-pointer group border border-zinc-800 shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80"
                alt="David Sterling Video Case Study"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.5)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-black translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700">
                <span className="text-[10px] font-mono font-bold text-[#ccff00] uppercase block">
                  EPISODE 01 • 4 MINS
                </span>
                <h4 className="text-white font-bold text-sm">
                  David Sterling: Reversing Metabolic Decline at 40
                </h4>
              </div>
            </div>

            {/* Video Card 2 */}
            <div
              onClick={() => showToast('Playing Member Spotlight: From ACL Tear to Powerlifting Platform', 'info', 'Video Player')}
              className="relative h-72 rounded-2xl overflow-hidden cursor-pointer group border border-zinc-800 shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80"
                alt="Sarah Mitchell Video Case Study"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.5)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-black translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700">
                <span className="text-[10px] font-mono font-bold text-[#ccff00] uppercase block">
                  EPISODE 02 • 5 MINS
                </span>
                <h4 className="text-white font-bold text-sm">
                  Dr. Sarah Mitchell: 315-lb Squat After Joint Reconstruction
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight mb-4">
          YOUR TRANSFORMATION STORY STARTS WITH REP ONE
        </h2>
        <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
          Every champion featured here was once standing where you are right now. Take the step.
        </p>
        <button
          onClick={onOpenFreePass}
          className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-4 px-10 rounded-xl transition-all shadow-[0_0_25px_rgba(204,255,0,0.35)]"
        >
          CLAIM 1-DAY FREE PASS TODAY
        </button>
      </section>

      {/* SUBMIT STORY MODAL */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in my-8">
            <h3 className="text-2xl font-black font-heading text-white mb-1">
              SHARE YOUR IRON STORY
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Inspire the next wave of lifters. Submissions selected receive 3 months complimentary Fuel Bar shakes.
            </p>

            <form onSubmit={handleStorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={storyForm.name}
                  onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                  placeholder="e.g. Alex Hunter"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={storyForm.email}
                  onChange={(e) => setStoryForm({ ...storyForm, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Your Primary Achievement *
                </label>
                <input
                  type="text"
                  required
                  value={storyForm.achievement}
                  onChange={(e) => setStoryForm({ ...storyForm, achievement: e.target.value })}
                  placeholder="e.g. Lost 30 lbs and hit a 405 lb squat"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Your Story & Journey
                </label>
                <textarea
                  rows={3}
                  required
                  value={storyForm.story}
                  onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                  placeholder="Describe how training at IronHub impacted your life..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingStory}
                  className="flex-1 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3 rounded-lg"
                >
                  {isSubmittingStory ? 'SENDING...' : 'SUBMIT STORY'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  className="px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold"
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
