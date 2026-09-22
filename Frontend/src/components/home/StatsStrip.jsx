import React from 'react';
import CountUp from '../common/CountUp';

const StatsStrip = () => {
  const stats = [
    {
      index: 'I',
      value: 5,
      suffix: '',
      title: 'Scores Per Entry',
      description: 'Your five most recent verified golf rounds form your unique monthly draw entry.',
    },
    {
      index: 'II',
      value: 30,
      suffix: 'd',
      title: 'Monthly Cycles',
      description: 'Transparent algorithmic draws executed reliably on the final day of every month.',
    },
    {
      index: 'III',
      value: 3,
      suffix: ' Tiers',
      title: 'Match Tiers',
      description: 'Reward pools allocated across Match 3, Match 4, and the complete Match 5 Jackpot.',
    },
    {
      index: 'IV',
      value: 100,
      suffix: '%',
      title: 'Charity Backed',
      description: 'A guaranteed portion of every subscription supports member-selected philanthropic causes.',
    },
  ];

  return (
    <section className="bg-[#1A1A1A] text-[#F9F8F6] border-y border-[#1A1A1A] py-24 sm:py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((stat) => (
            <div
              key={stat.index}
              className="flex flex-col lg:px-8 first:lg:pl-0 last:lg:pr-0 group text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase">
                  PART {stat.index}
                </span>
              </div>

              <div className="font-serif text-5xl lg:text-6xl text-[#F9F8F6] font-normal tracking-tight group-hover:text-[#D4AF37] transition-colors duration-500">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>

              <h3 className="mt-4 text-sm font-serif text-[#F9F8F6] font-normal tracking-wide">
                {stat.title}
              </h3>

              <p className="mt-2 text-xs text-[#EBE5DE]/60 leading-relaxed font-sans">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
