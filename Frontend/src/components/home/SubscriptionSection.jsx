import React from 'react';
import Button from '../common/Button';
import { Check, Sparkles } from 'lucide-react';

const SubscriptionSection = () => {
  const plans = [
    {
      id: 'MONTHLY',
      name: 'Monthly Membership',
      price: '₹499',
      period: '/ month',
      description: 'Flexible month-to-month access to the draw and regular charity contributions.',
      features: [
        'Automatic entry to every monthly draw',
        'Real-time golf score tracking (1–45)',
        'Your 5 latest scores become draw balls',
        'Direct chosen charity contribution',
        'Full access to Match 3, 4, and 5 prize pools',
        'Member winnings dashboard and payout claims',
      ],
      isPopular: false,
      ctaText: 'Choose Monthly Plan',
    },
    {
      id: 'YEARLY',
      name: 'Annual Patron',
      price: '₹4,999',
      period: '/ year',
      savings: '2 Months Complimentary',
      description: 'For dedicated players committed to year-round impact and maximum draw rewards.',
      features: [
        'All 12 monthly draws throughout the year',
        'Priority verification on winning claims',
        'Enhanced charity contribution match',
        'Permanent scorecard archive & analytics',
        'Eligibility for annual patron jackpot bonuses',
        'Private member concierge & payout support',
      ],
      isPopular: true,
      ctaText: 'Choose Annual Patron Plan',
    },
  ];

  return (
    <section className="py-28 sm:py-36 bg-[#F9F8F6] border-t border-[#1A1A1A]/10 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-3">
            MEMBERSHIP TIERS &bull; HONEST PRIVILEGE
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] tracking-tight leading-none">
            Join The <span className="italic font-light">Circle.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#6C6863] leading-relaxed font-sans">
            One transparent subscription. Your regular golf game powers genuine causes and unlocks monthly audited cash rewards.
          </p>
        </div>

        {/* 2 Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 bg-[#F9F8F6]
                ${
                  plan.isPopular
                    ? 'border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/20 shadow-[0_20px_50px_rgba(26,26,26,0.06)]'
                    : 'border-t-2 border-[#1A1A1A]/30 border-x border-b border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40'
                }
              `}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-8 bg-[#1A1A1A] text-[#D4AF37] text-[10px] font-mono uppercase tracking-[0.2em] px-3.5 py-1 border border-[#D4AF37]/50 flex items-center gap-1.5 font-semibold">
                  <Sparkles size={11} />
                  RECOMMENDED PATRON
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight">{plan.name}</h3>
                  {plan.savings && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A] bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2.5 py-0.5 font-semibold">
                      {plan.savings}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#6C6863] mt-3 mb-8 leading-relaxed font-sans">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-[#1A1A1A]/10">
                  <span className="font-serif text-5xl sm:text-6xl text-[#1A1A1A] tracking-tight">{plan.price}</span>
                  <span className="text-sm font-sans text-[#6C6863]">{plan.period}</span>
                </div>

                {/* Features List */}
                <div className="flex flex-col gap-3.5 mb-12">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
                    Included Privileges:
                  </span>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#1A1A1A]">
                      <Check size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  to={`/register?plan=${plan.id}`}
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full justify-center"
                >
                  {plan.ctaText}
                </Button>
                <div className="text-[10px] font-mono text-center text-[#6C6863] mt-4 uppercase tracking-[0.15em]">
                  No Hidden Fees &bull; Cancel Anytime
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
