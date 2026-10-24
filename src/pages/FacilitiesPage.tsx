import React, { useState } from 'react';
import { 
  Zap, Clock, ShieldCheck, Dumbbell, Sparkles, 
  CheckCircle2, ArrowRight, Expand, X, MapPin 
} from 'lucide-react';
import { FACILITIES, GYM_INFO } from '../data/gymData';
import { FacilityZone } from '../types';

interface FacilitiesPageProps {
  onOpenFreePass: () => void;
}

export default function FacilitiesPage({ onOpenFreePass }: FacilitiesPageProps) {
  const [selectedZone, setSelectedZone] = useState<FacilityZone>(FACILITIES[0]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80', title: 'Heavy Iron Rogue Cage Matrix' },
    { url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1000&q=80', title: 'Woodway Curve Cardio Deck' },
    { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80', title: '50-Meter Sprint & Sled Turf' },
    { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80', title: 'Cedar Sauna & Recovery Spa' },
    { url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80', title: 'Eleiko Calibrated Bumper Station' },
    { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80', title: 'Fuel Bar & Executive Co-Working' }
  ];

  const brandPartners = [
    { name: 'ELEIKO', tagline: 'IPF Certified Olympic Steel' },
    { name: 'ROGUE FITNESS', tagline: 'Monster Series 3x3 Racks' },
    { name: 'HAMMER STRENGTH', tagline: 'Iso-Lateral Heavy Mechanics' },
    { name: 'WOODWAY', tagline: 'Curved Motorless Velocity' },
    { name: 'CONCEPT2', tagline: 'RowErgs & SkiErgs' },
    { name: 'PLUNGE PRO', tagline: 'Sub-Zero Cryo Immersion' }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* HERO BANNER */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-radial-gradient">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 mb-4">
            <Zap className="w-3.5 h-3.5" /> 115,000+ TOTAL SQ. FT. OF OLYMPIC GRADE SPACE
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white uppercase tracking-tight mb-6">
            SANCTUARY OF <span className="text-[#ccff00]">POWER</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Architecturally designed for sound dampening, maximal biomechanical flow, and clinical hygiene. You will never wait for a squat rack or fight for 45-lb plates.
          </p>
        </div>
      </section>

      {/* INTERACTIVE ZONE EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            VIRTUAL ZONE TOUR
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            EXPLORE THE FORGE ZONES
          </h2>
        </div>

        {/* Zone Selector Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {FACILITIES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedZone.id === zone.id
                  ? 'bg-[#ccff00] text-black shadow-[0_0_25px_rgba(204,255,0,0.35)]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* Selected Zone Deep-Dive Card */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Zone Photography with Lightbox Trigger */}
            <div className="relative h-80 sm:h-96 lg:h-full min-h-[380px] overflow-hidden group">
              <img
                src={selectedZone.image}
                alt={selectedZone.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <button
                onClick={() => setLightboxImage(selectedZone.image)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-[#ccff00] hover:text-black text-white p-2.5 rounded-xl border border-zinc-700 transition-colors"
                title="Expand image"
              >
                <Expand className="w-4 h-4" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] font-mono font-bold uppercase bg-[#ccff00] text-black px-2.5 py-1 rounded">
                  {selectedZone.sqft}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-wide mt-2">
                  {selectedZone.name}
                </h3>
                <p className="text-zinc-300 text-xs italic mt-0.5">{selectedZone.subtitle}</p>
              </div>
            </div>

            {/* Zone Specifications & Amenities */}
            <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-between">
              <div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  {selectedZone.description}
                </p>

                {/* Equipment Spec Checklist */}
                <div className="mb-6">
                  <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-[#ccff00]" /> EQUIPMENT ARSENAL IN THIS ZONE
                  </h4>
                  <div className="space-y-2.5">
                    {selectedZone.equipmentHighlights.map((eq, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-200">
                        <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ccff00]" /> DEDICATED ZONE AMENITIES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedZone.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                  <Clock className="w-4 h-4 text-[#ccff00]" />
                  <span>{selectedZone.hours}</span>
                </div>
                <button
                  onClick={onOpenFreePass}
                  className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center gap-2"
                >
                  EXPERIENCE THIS ZONE <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND PARTNERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
              ZERO BUDGET COMPROMISES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-tight">
              EQUIPMENT PARTNERS OF RECORD
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {brandPartners.map((bp, i) => (
              <div
                key={i}
                className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 hover:border-[#ccff00]/40 transition-colors"
              >
                <div className="font-heading text-lg font-black text-white tracking-wider">
                  {bp.name}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">{bp.tagline}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase text-[#ccff00] tracking-widest block mb-2">
            GALLERY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase tracking-tight">
            THE ARCHITECTURE OF INTENSITY
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setLightboxImage(img.url)}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group border border-zinc-800 shadow-lg"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="text-right">
                  <span className="bg-black/70 text-[#ccff00] p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity inline-block">
                    <Expand className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-white font-bold text-sm bg-black/70 px-3 py-1.5 rounded-lg border border-zinc-800 self-start">
                  {img.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLINICAL HYGIENE ASSURANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-950 via-[#0d1404] to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              <ShieldCheck className="w-3.5 h-3.5" /> CLINICAL HYGIENE & STERILIZATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-wide">
              HOSPITAL-GRADE AIR & WATER PURITY
            </h3>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              We replace our facility air every 6 minutes with dual MERV-16 UV-C scrubbers. Cold plunge water undergoes 5-stage mechanical, ozone, and ultraviolet sanitation 24 hours a day.
            </p>
          </div>
          <button
            onClick={onOpenFreePass}
            className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] whitespace-nowrap"
          >
            SEE IT IN PERSON (FREE PASS)
          </button>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-5xl w-full max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-700">
            <img
              src={lightboxImage}
              alt="Facility zoomed preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full border border-zinc-600 hover:bg-[#ccff00] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
