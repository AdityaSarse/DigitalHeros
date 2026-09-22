import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { ArrowRight, CheckCircle2, Trophy, Heart, Target, Sparkles } from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Record Your Scores',
      tagline: 'EVERY ROUND MATTERS',
      description:
        'Submit your verified round scores (between 1 and 45). Log your dates, track your performance trajectory, and maintain your active club profile.',
      icon: Target,
      image:
        'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=80',
      detailBadge: 'Score Validation: 1–45 Integer & Play Date',
    },
    {
      number: '02',
      title: 'Select Your Charity',
      tagline: 'EMPOWER A NOBLE CAUSE',
      description:
        'Select an accredited non-profit or foundation partner from our directory and set your contribution preference (minimum 10%). A portion of your membership subscription directly powers their mission.',
      icon: Heart,
      image:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      detailBadge: '10% to 100% Contributed Directly',
    },
    {
      number: '03',
      title: 'Enter The Monthly Draw',
      tagline: 'YOUR ROUNDS BECOME YOUR BALLS',
      description:
        'Your five most recent logged golf rounds automatically compile into your official draw entry for the active month. No extra ticket purchases or separate lottery numbers needed.',
      icon: Sparkles,
      image:
        'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=1200&q=80',
      detailBadge: '5 Latest Verified Scores = 1 Draw Entry',
    },
    {
      number: '04',
      title: 'Match & Claim Rewards',
      tagline: 'TRANSPARENT REWARDS',
      description:
        'At the end of each cycle, five winning numbers are deterministically drawn. Match 3, 4, or all 5 numbers to unlock substantial cash prizes, submit scorecard verification, and receive prompt payouts.',
      icon: Trophy,
      image:
        'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1200&q=80',
      detailBadge: '3 Tiers: Match 3, Match 4 & Grand Match 5',
    },
  ];

  return (
    <section id="how-it-works" className="py-28 sm:py-36 bg-[#F9F8F6] border-t border-[#1A1A1A]/10 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-3 font-semibold">
              THE MECHANICS &bull; FOUR DISCIPLINED STEPS
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] tracking-tight leading-none">
              Made For Every <span className="italic font-light">Round.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#6C6863] max-w-md font-sans leading-relaxed">
            A seamless bridge between your regular weekend golf game and genuine community impact with monthly cash draws.
          </p>
        </div>

        {/* Step Cards with Sticky Interactive Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Numbered List */}
          <div className="lg:col-span-6 flex flex-col">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`
                    py-7 sm:py-9 px-6 sm:px-8 border-t transition-all duration-300 cursor-pointer text-left
                    ${
                      isActive
                        ? 'border-[#D4AF37] bg-[#EBE5DE]/40 shadow-sm'
                        : 'border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40 bg-transparent hover:bg-[#EBE5DE]/20'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono tracking-[0.2em] font-semibold ${
                        isActive ? 'text-[#D4AF37]' : 'text-[#6C6863]'
                      }`}
                    >
                      {step.number} &mdash; STEP
                    </span>
                    <Icon
                      size={18}
                      className={isActive ? 'text-[#D4AF37]' : 'text-[#6C6863]'}
                    />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] mb-2 font-normal tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#6C6863] leading-relaxed font-sans">
                    {step.description}
                  </p>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-[#1A1A1A]/10 flex items-center gap-2 text-xs font-mono text-[#D4AF37]"
                    >
                      <CheckCircle2 size={14} />
                      <span className="tracking-wide">{step.detailBadge}</span>
                    </motion.div>
                  )}
                </div>
              );
            })}

            <div className="pt-8 border-t border-[#1A1A1A]/15">
              <Button to="/scores" variant="text" icon={<ArrowRight size={16} />}>
                Record your initial scores now
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Showcase for Active Step */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative overflow-hidden border border-[#1A1A1A]/15 aspect-[4/3] bg-[#EBE5DE] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1800ms] ease-out"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-90" />

              {/* Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-[#F9F8F6]/95 backdrop-blur-sm border border-[#1A1A1A]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block">
                    {steps[activeStep].tagline}
                  </span>
                  <div className="font-serif text-lg text-[#1A1A1A] mt-0.5 tracking-tight font-medium">
                    {steps[activeStep].title}
                  </div>
                </div>
                <div className="text-xs font-mono tracking-wider text-[#1A1A1A] border border-[#1A1A1A]/20 px-3 py-1 uppercase bg-[#EBE5DE]/50">
                  STEP {steps[activeStep].number} / 04
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
