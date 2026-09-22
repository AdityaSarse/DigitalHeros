import React, { useState, useEffect } from 'react';
import { drawApi } from '../api/draws';
import { scoreApi } from '../api/scores';
import { useAuth } from '../context/AuthContext';
import GolfBall from '../components/common/GolfBall';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { Calendar, Sparkles, ShieldCheck } from 'lucide-react';

const Draws = () => {
  const { isAuthenticated } = useAuth();

  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedDrawDetails, setSelectedDrawDetails] = useState(null);
  const [userLatestScores, setUserLatestScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch published draws
  useEffect(() => {
    const fetchAllDraws = async () => {
      setLoading(true);
      try {
        const res = await drawApi.getDraws();
        if (res.data?.success && res.data.data?.draws?.length > 0) {
          const list = res.data.data.draws;
          setDraws(list);
          loadDrawDetails(list[0].id);
        } else {
          // Curated sample if no published draws yet in test DB
          const demoDraw = {
            id: 'demo-1',
            draw_month: '2026-10-01',
            prize_pool_amount: 150000,
            status: 'PUBLISHED',
          };
          setDraws([demoDraw]);
          setSelectedDraw(demoDraw);
          setSelectedDrawDetails({
            draw: demoDraw,
            draw_result: { winning_numbers: [7, 14, 21, 35, 42] },
            prize_allocations: [
              { match_type: 'FIVE_MATCH', amount_per_winner: 75000, match_count: 5 },
              { match_type: 'FOUR_MATCH', amount_per_winner: 45000, match_count: 4 },
              { match_type: 'THREE_MATCH', amount_per_winner: 30000, match_count: 3 },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching draws:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDraws();
  }, []);

  // Fetch user latest scores if authenticated for instant match comparison
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUserScores = async () => {
      try {
        const res = await scoreApi.getScores();
        if (res.data?.success) {
          setUserLatestScores(res.data.data.latest_five || []);
        }
      } catch (err) {
        console.warn('Could not load user scores for match check:', err);
      }
    };
    fetchUserScores();
  }, [isAuthenticated]);

  const loadDrawDetails = async (drawId) => {
    try {
      const res = await drawApi.getDrawById(drawId);
      if (res.data?.success) {
        setSelectedDraw(res.data.data.draw);
        setSelectedDrawDetails(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load draw details:', err);
    }
  };

  const winningNumbers = selectedDrawDetails?.draw_result?.winning_numbers || [];

  // Match analysis
  const matchedNumbers = userLatestScores.filter((num) => winningNumbers.includes(num));
  const matchCount = matchedNumbers.length;

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2">
              AUDITED DRAW PROTOCOL &bull; MONTHLY DRAWINGS
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-normal tracking-tight">
              Monthly Draw <span className="italic font-light">Results.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6C6863] mt-2 font-sans">
              Review published winning balls, verified prize allocations, and check your round matches.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-semibold uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>ALGORITHMIC INTEGRITY GUARANTEE</span>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent animate-spin" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#6C6863]">
              Loading Published Draws...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Published Draws Archive selector */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#6C6863] font-semibold">
                Draw Archive ({draws.length})
              </span>

              <div className="flex flex-col gap-3">
                {draws.map((d) => {
                  const isSelected = selectedDraw?.id === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => loadDrawDetails(d.id)}
                      className={`
                        p-6 border transition-all duration-200 cursor-pointer flex items-center justify-between bg-[#F9F8F6]
                        ${
                          isSelected
                            ? 'border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/20 shadow-sm'
                            : 'border border-[#1A1A1A]/15 hover:border-[#1A1A1A]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-[#1A1A1A]/20 flex items-center justify-center text-[#D4AF37] bg-[#EBE5DE]/30">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <div className="font-serif text-lg text-[#1A1A1A] font-medium tracking-tight">
                            {d.draw_month}
                          </div>
                          <div className="text-[10px] font-mono text-[#6C6863] uppercase tracking-wider">
                            Pool: ₹{Number(d.prize_pool_amount).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <Badge variant={isSelected ? 'active' : 'default'} size="sm">
                        {d.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Draw Showcase & Member Matcher */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Draw Showcase Card */}
              <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-12 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block mb-1">
                      OFFICIAL DRAW REPORT
                    </span>
                    <h2 className="font-serif text-3xl text-[#1A1A1A] tracking-tight">
                      Draw Cycle: {selectedDraw?.draw_month}
                    </h2>
                  </div>
                  <Badge variant="paid">
                    TOTAL POOL: ₹{Number(selectedDraw?.prize_pool_amount || 0).toLocaleString('en-IN')}
                  </Badge>
                </div>

                {/* Winning Balls Banner */}
                <div className="p-8 bg-[#EBE5DE]/20 border border-[#1A1A1A]/10 text-center my-6">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#6C6863] font-semibold block mb-6">
                    FIVE OFFICIAL WINNING NUMBERS
                  </span>

                  {winningNumbers.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                      {winningNumbers.map((num, idx) => (
                        <GolfBall
                          key={idx}
                          number={num}
                          size="lg"
                          isMatch={true}
                          label={`BALL 0${idx + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm font-mono text-[#6C6863] py-4 uppercase tracking-wider">
                      Official winning numbers will be published upon draw cycle completion.
                    </div>
                  )}
                </div>

                {/* Prize Allocations */}
                <div className="mt-10 pt-6 border-t border-[#1A1A1A]/10">
                  <h3 className="text-xs font-mono tracking-[0.2em] uppercase text-[#6C6863] font-semibold mb-4">
                    Prize Tier Distributions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 border border-[#1A1A1A]/15 bg-[#F9F8F6]">
                      <span className="text-[10px] font-mono text-[#D4AF37] font-semibold uppercase tracking-wider block">
                        5 MATCH (JACKPOT)
                      </span>
                      <div className="font-serif text-2xl text-[#1A1A1A] mt-1 tracking-tight">
                        40% Pool
                      </div>
                      <span className="text-[10px] text-[#6C6863] uppercase tracking-wider block mt-1">Grand prize winner tier</span>
                    </div>

                    <div className="p-5 border border-[#1A1A1A]/15 bg-[#F9F8F6]">
                      <span className="text-[10px] font-mono text-[#1A1A1A] font-semibold uppercase tracking-wider block">
                        4 MATCH
                      </span>
                      <div className="font-serif text-2xl text-[#1A1A1A] mt-1 tracking-tight">
                        35% Pool
                      </div>
                      <span className="text-[10px] text-[#6C6863] uppercase tracking-wider block mt-1">Secondary tier reward</span>
                    </div>

                    <div className="p-5 border border-[#1A1A1A]/15 bg-[#F9F8F6]">
                      <span className="text-[10px] font-mono text-[#6C6863] font-semibold uppercase tracking-wider block">
                        3 MATCH
                      </span>
                      <div className="font-serif text-2xl text-[#1A1A1A] mt-1 tracking-tight">
                        25% Pool
                      </div>
                      <span className="text-[10px] text-[#6C6863] uppercase tracking-wider block mt-1">Base match prize tier</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authenticated Member Match Comparison Card */}
              {isAuthenticated ? (
                <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-10 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block mb-1">
                        YOUR SCORECARD MATCH RESULT
                      </span>
                      <h3 className="font-serif text-2xl text-[#1A1A1A] tracking-tight">
                        Match Analysis
                      </h3>
                    </div>
                    {winningNumbers.length > 0 && (
                      <Badge
                        variant={matchCount >= 3 ? 'gold' : matchCount > 0 ? 'active' : 'default'}
                        size="lg"
                      >
                        {matchCount >= 3
                          ? `MATCH ${matchCount} WINNER`
                          : `${matchCount} MATCH${matchCount === 1 ? '' : 'ES'}`}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#6C6863] mb-6 font-sans">
                    Comparing your latest 5 logged scores with the published numbers for this cycle:
                  </p>

                  {/* Balls Comparison */}
                  <div className="flex flex-wrap items-center gap-5 py-6 border-y border-[#1A1A1A]/10">
                    {userLatestScores.length > 0 ? (
                      userLatestScores.map((scoreVal, i) => {
                        const isMatch = winningNumbers.includes(scoreVal);
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <GolfBall
                              number={scoreVal}
                              size="md"
                              isMatch={isMatch}
                              label={isMatch ? 'MATCH!' : `BALL 0${i + 1}`}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-[#6C6863] font-mono uppercase tracking-wider">
                        No scores recorded for this cycle. Log your scores in the Scorecard to participate.
                      </div>
                    )}
                  </div>

                  {matchCount >= 3 && (
                    <div className="mt-8 p-6 border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/15 bg-[#F9F8F6] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Sparkles size={24} className="text-[#D4AF37] shrink-0" />
                        <div>
                          <div className="text-base font-serif text-[#1A1A1A] font-medium tracking-tight">
                            Eligible for Match {matchCount} Prize Distribution
                          </div>
                          <div className="text-xs text-[#6C6863] font-sans mt-0.5">
                            Check your Winnings portal to submit scorecard verification and claim payout.
                          </div>
                        </div>
                      </div>
                      <Button to="/winners" variant="primary" size="sm">
                        Go to Winnings
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-10 text-center">
                  <p className="font-serif text-2xl text-[#1A1A1A]">
                    Log in to view your draw entry matches
                  </p>
                  <p className="text-xs sm:text-sm text-[#6C6863] mt-2 mb-6 font-sans">
                    See how your latest 5 scores performed against these official published numbers.
                  </p>
                  <Button to="/login" variant="primary" size="md">
                    Member Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Draws;
