import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        'Logging my weekend rounds on Digital Heroes completely transformed my relationship with the game. Knowing my regular scores fund grassroots junior golf clinics while keeping me in contention for monthly draws makes every putt feel truly meaningful.',
      author: 'Marcus Vance',
      role: 'Handicap 4.2 &bull; Member since 2024',
      club: 'Royal Oaks Country Club',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'When my October scores matched 4 balls in the monthly draw, the verification process was seamless. Within 48 hours my scorecard was validated and the payout transferred directly. Highly professional, discreet, and club-class.',
      author: 'Elena Rostova',
      role: 'Handicap 11.8 &bull; Match 4 Winner',
      club: 'Silverstone Links',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'The combination of vetted charitable impact and authentic tournament-style excitement is unmatched. It avoids the noise of casual betting apps and delivers an editorial, prestigious club experience.',
      author: 'Devon Sterling',
      role: 'Handicap 6.5 &bull; Annual Patron',
      club: 'St. Andrews Heritage Guild',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === testimonials.length - 1 ? 0 : prevIdx + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-28 sm:py-36 bg-[#F9F8F6] border-t border-[#1A1A1A]/10 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-3">
            TESTIMONIALS &bull; THE CIRCLE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight leading-none">
            Voices of the <span className="italic font-light">Patronage.</span>
          </h2>
        </div>

        {/* Big Kinfolk-style Quote Container */}
        <div className="relative min-h-[340px] flex flex-col justify-between p-8 sm:p-16 border-l-4 border-l-[#D4AF37] border-y border-r border-[#1A1A1A]/15 bg-[#F9F8F6] shadow-[0_15px_45px_rgba(26,26,26,0.04)]">
          <Quote
            size={56}
            className="text-[#D4AF37]/20 absolute top-8 right-8 pointer-events-none"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col justify-between h-full"
            >
              <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1A1A1A] leading-[1.6] italic mb-12">
                &ldquo;{current.quote}&rdquo;
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-[#1A1A1A]/10">
                <div className="flex items-center gap-4">
                  <img
                    src={current.avatar}
                    alt={current.author}
                    className="w-12 h-12 object-cover border border-[#1A1A1A]/20"
                  />
                  <div>
                    <h4 className="font-serif text-lg text-[#1A1A1A] font-medium tracking-tight">{current.author}</h4>
                    <p
                      className="text-xs text-[#6C6863] font-sans"
                      dangerouslySetInnerHTML={{ __html: current.role }}
                    />
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                    HOME CLUB
                  </span>
                  <span className="text-xs text-[#1A1A1A] font-medium">{current.club}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 transition-all duration-300 cursor-pointer ${
                  currentIndex === i ? 'w-10 bg-[#D4AF37]' : 'w-4 bg-[#1A1A1A]/20'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] bg-[#F9F8F6] flex items-center justify-center text-[#1A1A1A] hover:text-[#D4AF37] transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] bg-[#F9F8F6] flex items-center justify-center text-[#1A1A1A] hover:text-[#D4AF37] transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
