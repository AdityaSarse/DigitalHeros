import React from 'react';
import Button from '../common/Button';
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-28 sm:py-36 bg-[#F9F8F6] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        {/* Section Overline & Headline */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[#1A1A1A]" />
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#1A1A1A]">
            EDITORIAL MANIFESTO &bull; PHILOSOPHY
          </span>
        </div>

        <div className="mb-20">
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#1A1A1A] max-w-4xl leading-[1.02] tracking-tight">
            Golf is where it starts. <br />
            <span className="italic font-normal text-[#D4AF37]">Impact is where it goes.</span>
          </h2>
        </div>

        {/* Asymmetric 7/5 Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left 7 Columns */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <p className="drop-cap text-base sm:text-lg text-[#6C6863] leading-relaxed font-sans">
              Traditional golf memberships celebrate the sport within manicured fences. Digital Heroes expands that horizon, tying every round you play to real philanthropic impact and verified monthly cash rewards.
            </p>
            <p className="text-sm sm:text-base text-[#6C6863] leading-relaxed font-sans">
              Whether you are competing in a weekend medal round or playing dawn rounds at your municipal course, your performance generates verified support for accredited conservation, junior athletics, and health initiatives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[#1A1A1A]/15 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-serif text-lg">
                  <HeartHandshake size={18} className="text-[#D4AF37]" />
                  <span>Vetted Charities</span>
                </div>
                <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
                  Choose from accredited partner foundations with transparent disbursement tracking.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-serif text-lg">
                  <ShieldCheck size={18} className="text-[#D4AF37]" />
                  <span>Provably Fair Draws</span>
                </div>
                <p className="text-xs text-[#6C6863] leading-relaxed font-sans">
                  Deterministic server-side draw simulation with auditable winner records.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Button to="/charities" variant="text" icon={<ArrowRight size={14} />}>
                Explore Accredited Foundations
              </Button>
            </div>
          </div>

          {/* Right 5 Columns: Portrait Image with Grayscale-to-Color Reveal */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EBE5DE] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <img
                src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80"
                alt="Golfer putting on green during golden hour"
                className="w-full h-full object-cover filter grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1800ms] ease-out"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] pointer-events-none" />

              {/* Vertical Text Label */}
              <div className="absolute top-6 left-6 vertical-text text-[10px] font-mono tracking-[0.3em] uppercase text-white/90 bg-[#1A1A1A]/75 px-1.5 py-3 select-none">
                PLATE II &bull; EVENING CADENCE
              </div>
            </div>

            {/* Bottom Citation Line */}
            <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-[#6C6863]">
              <span>SANCTIONED PAR 72 RULE</span>
              <span className="text-[#D4AF37]">1-45 SCORE RANGE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
