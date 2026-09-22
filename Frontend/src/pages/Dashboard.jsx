import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { scoreApi } from '../api/scores';
import { charityApi } from '../api/charities';
import { subscriptionApi } from '../api/subscription';
import { drawApi } from '../api/draws';
import { winnerApi } from '../api/winners';
import GolfBall from '../components/common/GolfBall';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Calendar,
  Heart,
  Target,
  Trophy,
  ArrowRight,
  Plus,
  CreditCard,
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [scoresData, setScoresData] = useState({ scores: [], latest_five: [] });
  const [myCharity, setMyCharity] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [latestDraw, setLatestDraw] = useState(null);
  const [winnings, setWinnings] = useState({ winners: [], total: 0 });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [scoresRes, charityRes, subRes, drawsRes, winRes] = await Promise.allSettled([
          scoreApi.getScores(),
          charityApi.getMyCharity(),
          subscriptionApi.getSubscription(),
          drawApi.getDraws(),
          winnerApi.getMyWinnings(),
        ]);

        if (scoresRes.status === 'fulfilled' && scoresRes.value.data?.success) {
          setScoresData(scoresRes.value.data.data);
        }

        if (charityRes.status === 'fulfilled' && charityRes.value.data?.success) {
          setMyCharity(charityRes.value.data.data);
        }

        if (subRes.status === 'fulfilled' && subRes.value.data?.success) {
          setSubscription(subRes.value.data.data);
        }

        if (drawsRes.status === 'fulfilled' && drawsRes.value.data?.success) {
          const pubDraws = drawsRes.value.data.data?.draws || [];
          if (pubDraws.length > 0) {
            setLatestDraw(pubDraws[0]);
          }
        }

        if (winRes.status === 'fulfilled' && winRes.value.data?.success) {
          setWinnings(winRes.value.data.data);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Member';
  const latestFive = scoresData.latest_five || [];

  const totalPrizeWon = (winnings.winners || []).reduce((acc, w) => acc + (Number(w.prize_amount) || 0), 0);
  const pendingPrize = (winnings.winners || [])
    .filter((w) => w.payout_status === 'PENDING')
    .reduce((acc, w) => acc + (Number(w.prize_amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2">
              MEMBER PORTAL &bull; PRIVATE DASHBOARD
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-normal tracking-tight">
              Welcome back, <span className="italic font-light">{displayName}.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6C6863] mt-2 font-sans">
              Your game. Your noble impact. Your monthly draw contender standing.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button to="/scores" variant="primary" size="md" icon={<Plus size={15} />}>
              Add New Score
            </Button>
            <Button to="/draws" variant="outline" size="md">
              View Draw Results
            </Button>
          </div>
        </div>

        {/* Overview Grid - 5 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Active Draw Entry (Latest 5 Scores) */}
          <div className="lg:col-span-2 bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
                    Current Monthly Draw Entry
                  </span>
                </div>
                <Badge variant={latestFive.length === 5 ? 'active' : 'pending'}>
                  {latestFive.length === 5 ? 'ENTRY QUALIFIED' : `${latestFive.length}/5 SCORES RECORDED`}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-[#6C6863] leading-relaxed mb-6 font-sans">
                Your latest five submitted scores automatically compile as your balls for the next monthly draw.
              </p>

              {/* Balls Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-6 border-y border-[#1A1A1A]/10 my-2">
                {latestFive.length > 0 ? (
                  latestFive.map((scoreVal, i) => (
                    <GolfBall
                      key={i}
                      number={scoreVal}
                      size="lg"
                      label={`ROUND 0${i + 1}`}
                    />
                  ))
                ) : (
                  <div className="text-xs text-[#6C6863] font-mono py-4 uppercase tracking-wider">
                    No scores recorded yet. Submit your first rounds to establish your entry.
                  </div>
                )}

                {/* Empty placeholder balls if less than 5 */}
                {Array.from({ length: Math.max(0, 5 - latestFive.length) }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="w-16 h-16 border border-dashed border-[#1A1A1A]/20 flex flex-col items-center justify-center text-[10px] font-mono text-[#6C6863]"
                  >
                    <span>--</span>
                    <span className="text-[8px] uppercase tracking-wider">SLOT {latestFive.length + i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-[#6C6863] uppercase tracking-wider">
                Total Scores in Archive: <strong className="text-[#1A1A1A]">{scoresData.total || 0}</strong>
              </span>
              <Button to="/scores" variant="text" size="sm" icon={<ArrowRight size={14} />}>
                Manage Scorecard
              </Button>
            </div>
          </div>

          {/* Card 2: Subscription Status */}
          <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
                    Membership Tier
                  </span>
                </div>
                <Badge variant={subscription?.status === 'ACTIVE' ? 'active' : 'default'}>
                  {subscription?.status || 'NO PLAN'}
                </Badge>
              </div>

              <div className="mt-4">
                <div className="font-serif text-3xl text-[#1A1A1A] tracking-tight">
                  {subscription?.plan ? `${subscription.plan} PASS` : 'Free Tier'}
                </div>
                <p className="text-xs text-[#6C6863] mt-2 leading-relaxed font-sans">
                  {subscription?.status === 'ACTIVE'
                    ? `Auto-renews on ${new Date(subscription.renewal_date).toLocaleDateString('en-IN')}`
                    : 'Subscribe to activate automatic entry into every monthly cash draw.'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#D4AF37]">
                {subscription?.plan ? `₹${subscription.amount} / Cycle` : 'From ₹499/mo'}
              </span>
              <Button to="/subscription" variant="text" size="sm" icon={<ArrowRight size={14} />}>
                {subscription?.status === 'ACTIVE' ? 'Manage Plan' : 'Choose Plan'}
              </Button>
            </div>
          </div>

          {/* Card 3: Selected Charity */}
          <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
                    Designated Cause
                  </span>
                </div>
                {myCharity && (
                  <Badge variant="gold">
                    {myCharity.contribution_percentage}% ALLOCATED
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <div className="font-serif text-2xl text-[#1A1A1A] tracking-tight">
                  {myCharity?.charities?.name || 'No Charity Selected'}
                </div>
                <p className="text-xs text-[#6C6863] mt-2 leading-relaxed line-clamp-2 font-sans">
                  {myCharity?.charities?.description ||
                    'Select a certified partner cause to receive a share of your monthly membership.'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#6C6863] uppercase tracking-wider">
                {myCharity ? 'Donation Active' : 'Selection Required'}
              </span>
              <Button to="/charities" variant="text" size="sm" icon={<ArrowRight size={14} />}>
                {myCharity ? 'Switch Cause' : 'Select Cause'}
              </Button>
            </div>
          </div>

          {/* Card 4: Upcoming / Latest Draw */}
          <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
                    Draw Cycle
                  </span>
                </div>
                <Badge variant="active">
                  {latestDraw?.status || 'SCHEDULED'}
                </Badge>
              </div>

              <div className="mt-4">
                <div className="font-serif text-2xl text-[#1A1A1A] tracking-tight">
                  {latestDraw?.draw_month || 'Active Month'}
                </div>
                <div className="text-xs font-mono text-[#D4AF37] font-semibold mt-1 uppercase tracking-wider">
                  Prize Pool: ₹{Number(latestDraw?.prize_pool_amount || 150000).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-[#6C6863] mt-2 leading-relaxed font-sans">
                  Published winning numbers are automatically evaluated against your latest 5 rounds.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#6C6863] uppercase tracking-wider">Audited protocol</span>
              <Button to="/draws" variant="text" size="sm" icon={<ArrowRight size={14} />}>
                View Draws
              </Button>
            </div>
          </div>

          {/* Card 5: Member Winnings */}
          <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
                    Total Winnings
                  </span>
                </div>
                <Badge variant={totalPrizeWon > 0 ? 'paid' : 'default'}>
                  {winnings.total || 0} AWARDS
                </Badge>
              </div>

              <div className="mt-4">
                <div className="font-serif text-3xl text-[#1A1A1A] tracking-tight">
                  ₹{totalPrizeWon.toLocaleString('en-IN')}
                </div>
                {pendingPrize > 0 && (
                  <div className="text-xs text-[#D4AF37] font-mono mt-1 uppercase tracking-wider">
                    &bull; ₹{pendingPrize.toLocaleString('en-IN')} pending verification
                  </div>
                )}
                <p className="text-xs text-[#6C6863] mt-2 leading-relaxed font-sans">
                  Submit scorecard verification to clear pending payouts into your account.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#6C6863] uppercase tracking-wider">Claims &amp; Proofs</span>
              <Button to="/winners" variant="text" size="sm" icon={<ArrowRight size={14} />}>
                Review Claims
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
