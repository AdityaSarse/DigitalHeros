import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-20 px-6 sm:px-12 max-w-[1600px] mx-auto overflow-hidden">
      {/* Top Overline and Decorative Line */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px w-12 bg-[#1A1A1A]" />
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#1A1A1A]">
          VOL. 01 &bull; THE EDITORIAL GOLF COLLECTIVE
        </span>
      </div>

      {/* Main Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end my-auto">
        {/* Left Column: Massive Headline & Copy */}
        <div className="lg:col-span-8 flex flex-col items-start text-left">
          <h1 className="font-serif text-6xl sm:text-8xl lg:text-9xl text-[#1A1A1A] font-normal tracking-tight leading-[0.92]">
            Play Your Game. <br />
            <span className="italic font-normal text-[#D4AF37]">Power A Cause.</span> <br />
            Win Rewards.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 pt-8 border-t border-[#1A1A1A]/15 w-full">
            <p className="md:col-span-8 text-base sm:text-lg text-[#6C6863] font-sans leading-relaxed">
              Track your regular golf scores, allocate direct contributions to verified charities, and transform your latest five rounds into audited monthly cash draw entries.
            </p>

            <div className="md:col-span-4 flex flex-col gap-3">
              <Button to="/register" variant="primary" size="md">
                Apply To Club
              </Button>
              <Button href="#how-it-works" variant="outline" size="md" icon={<ArrowUpRight size={14} />}>
                The Process
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Portrait Imagery with 1800ms Grayscale-to-Color Transition */}
        <div className="lg:col-span-4 relative group">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#EBE5DE] shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            <img
              src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=85"
              alt="Championship golf fairway during morning mist"
              className="w-full h-full object-cover filter grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1800ms] ease-out"
            />
            {/* Inner Framing Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] pointer-events-none" />

            {/* Vertical Margin Label */}
            <div className="absolute bottom-6 right-6 vertical-text text-[10px] font-mono tracking-[0.3em] uppercase text-white/90 bg-[#1A1A1A]/75 px-1.5 py-3 select-none">
              FIG. 01 &bull; DAWN ON FAIRWAY
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="pt-12 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[#6C6863]">
        <div className="flex items-center gap-6">
          <span>PAR 72 PROTOCOL</span>
          <span>&bull;</span>
          <span>5-SCORE DRAW QUALIFIER</span>
        </div>
        <div className="flex items-center gap-2 text-[#1A1A1A]">
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={14} className="text-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
