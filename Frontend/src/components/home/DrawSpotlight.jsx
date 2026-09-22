import React, { useState, useEffect } from 'react';
import { drawApi } from '../../api/draws';
import GolfBall from '../common/GolfBall';
import Button from '../common/Button';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const DrawSpotlight = () => {
  const [latestDraw, setLatestDraw] = useState(null);

  useEffect(() => {
    const fetchDraw = async () => {
      try {
        const res = await drawApi.getDraws();
        if (res.data?.success && res.data.data?.draws?.length > 0) {
          const pubDraw = res.data.data.draws[0];
          const detailRes = await drawApi.getDrawById(pubDraw.id);
          if (detailRes.data?.success) {
            setLatestDraw(detailRes.data.data);
          } else {
            setLatestDraw({ draw: pubDraw });
          }
        }
      } catch (err) {
        console.warn('Could not fetch latest draw spotlight:', err);
      }
    };
    fetchDraw();
  }, []);

  const sampleNumbers = latestDraw?.draw_result?.winning_numbers || [7, 14, 21, 35, 42];
  const prizePool = latestDraw?.draw?.prize_pool_amount || 150000;

  return (
    <section className="py-28 sm:py-36 bg-[#1A1A1A] text-[#F9F8F6] border-t border-[#F9F8F6]/10 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="relative border border-[#F9F8F6]/15 bg-[#1A1A1A] p-8 sm:p-16">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-semibold tracking-[0.2em] uppercase">
                <Calendar size={14} />
                <span>
                  {latestDraw?.draw?.draw_month ? `DRAW CYCLE \u2022 ${latestDraw.draw.draw_month}` : 'MONTHLY DRAW SPOTLIGHT'}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-[#F9F8F6] leading-[1.1] tracking-tight">
                Deterministic Draws. <br />
                <span className="italic font-light text-[#D4AF37]">Guaranteed Member Payouts.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#EBE5DE]/70 leading-relaxed font-sans">
                At the conclusion of each month, our automated system processes every active subscriber's five verified round scores against the five officially published numbers. Match 3, 4, or 5 to receive your share of the prize pool.
              </p>

              <div className="flex items-center gap-10 py-6 border-y border-[#F9F8F6]/10 my-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EBE5DE]/50 mb-1">
                    Prize Pool
                  </div>
                  <div className="font-serif text-2xl sm:text-4xl text-[#D4AF37] tracking-tight">
                    ₹{Number(prizePool).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="w-px h-12 bg-[#F9F8F6]/15" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EBE5DE]/50 mb-1">
                    Draw Status
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#D4AF37] flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] animate-ping inline-block" />
                    <span>{latestDraw?.draw?.status || 'ACTIVE CYCLE'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6">
                <Button to="/draws" variant="primary" size="md">
                  View Published Results
                </Button>
                <Button to="/scores" variant="text" size="md" icon={<ArrowRight size={14} />} className="text-[#F9F8F6] hover:text-[#D4AF37]">
                  Enter Your 5 Scores
                </Button>
              </div>
            </div>

            {/* Right: Architectural Winning Numbers Board */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 sm:p-12 border border-[#F9F8F6]/15 bg-[#1A1A1A] text-center">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold mb-8 block">
                {latestDraw?.draw_result ? 'OFFICIAL WINNING NUMBERS' : 'OFFICIAL 5-BALL REVEAL'}
              </span>

              {/* Golf Balls Display */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-4">
                {sampleNumbers.map((num, i) => (
                  <GolfBall
                    key={i}
                    number={num}
                    size="lg"
                    isMatch={i === 0 || i === 2}
                    label={`BALL 0${i + 1}`}
                  />
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-[#F9F8F6]/10 w-full flex items-center justify-between text-xs font-mono text-[#EBE5DE]/60">
                <span className="flex items-center gap-2 text-[#F9F8F6]">
                  <ShieldCheck size={14} className="text-[#D4AF37]" />
                  Provably Audited
                </span>
                <span className="tracking-wider uppercase">Match 3 / 4 / 5 Tiers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrawSpotlight;
