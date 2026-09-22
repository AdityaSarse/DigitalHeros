import React from 'react';
import Button from '../common/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

const ClubCTASection = () => {
  return (
    <section className="py-32 sm:py-44 bg-[#1A1A1A] text-[#F9F8F6] border-t border-[#F9F8F6]/10 relative overflow-hidden text-center">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10">
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] font-semibold block mb-8">
          THE INVITATION &bull; JOIN THE PATRONAGE
        </span>

        {/* Oversized Wordmark Split with Architectural Gold Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-6">
          <span className="font-serif text-6xl sm:text-8xl lg:text-9xl text-[#F9F8F6] font-normal tracking-tight">
            DIGITAL
          </span>

          <div className="w-16 h-16 sm:w-20 sm:h-20 border border-[#D4AF37] bg-[#1A1A1A] flex items-center justify-center my-2 sm:my-0 shadow-lg">
            <Sparkles size={26} className="text-[#D4AF37]" />
          </div>

          <span className="font-serif text-6xl sm:text-8xl lg:text-9xl text-[#F9F8F6] font-light italic tracking-tight">
            HEROES
          </span>
        </div>

        {/* Supporting Line */}
        <p className="font-serif italic text-2xl sm:text-3xl text-[#EBE5DE]/80 max-w-2xl mx-auto mt-6 mb-3">
          Your game. Your cause. Your chance.
        </p>
        <p className="text-xs sm:text-sm font-sans text-[#EBE5DE]/50 max-w-md mx-auto mb-12 uppercase tracking-widest font-mono">
          Membership is open to all recreational & competitive players
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Button to="/register" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
            Apply For Membership
          </Button>
          <Button to="/charities" variant="outline" size="lg" className="border-[#F9F8F6]/30 text-[#F9F8F6] hover:border-[#D4AF37] hover:text-[#D4AF37]">
            Discover Our Causes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClubCTASection;
