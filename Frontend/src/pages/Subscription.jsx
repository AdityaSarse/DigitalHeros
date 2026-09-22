import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../api/subscription';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { CreditCard, Check, AlertCircle, Sparkles } from 'lucide-react';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await subscriptionApi.getSubscription();
      if (res.data?.success) {
        setSubscription(res.data.data);
      }
    } catch (err) {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSubscribe = async (planKey) => {
    setError(null);
    setSubscribingPlan(planKey);

    try {
      const res = await subscriptionApi.createSubscription({ plan: planKey });
      if (res.data?.success) {
        setSuccessMsg(`Successfully activated your ${planKey} subscription.`);
        fetchSubscription();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setError(err.customMessage || 'Subscription creation failed.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setSubscribingPlan(null);
    }
  };

  const handleCancelConfirm = async () => {
    setCancelling(true);
    try {
      const res = await subscriptionApi.cancelSubscription();
      if (res.data?.success) {
        setSuccessMsg('Your subscription has been cancelled.');
        setCancelModalOpen(false);
        fetchSubscription();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setError(err.customMessage || 'Failed to cancel subscription.');
    } finally {
      setCancelling(false);
    }
  };

  const plans = [
    {
      id: 'MONTHLY',
      name: 'Monthly Membership',
      price: '₹499',
      period: '/ month',
      description: 'Ideal for month-to-month access to the draw with no long-term commitment.',
      features: [
        'Automatic entry to every monthly draw',
        'Your latest 5 scores become draw balls',
        'Direct chosen charity contribution',
        'Match 3, 4, and 5 prize pool claims',
      ],
      isPopular: false,
    },
    {
      id: 'YEARLY',
      name: 'Annual Patron',
      price: '₹4,999',
      period: '/ year',
      savings: '2 Months Complimentary',
      description: 'For dedicated golfers committed to maximum draw rewards and year-round charity support.',
      features: [
        'All 12 monthly draws throughout the year',
        'Priority verification on winning claims',
        'Enhanced charity contribution match',
        'Annual patron jackpot bonus pools',
      ],
      isPopular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 px-6 sm:px-12">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block mb-2">
              BILLING &bull; CLUBHOUSE MEMBERSHIP
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-normal tracking-tight">
              Membership <span className="italic font-light">Privileges.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6C6863] mt-2 font-sans">
              Maintain an active membership to qualify your latest five scores into every monthly draw.
            </p>
          </div>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#1A1A1A] text-xs font-mono flex items-center gap-2 font-medium">
            <Check size={16} className="text-[#D4AF37]" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-4 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Current Active Plan Banner */}
        {subscription && (
          <div className="bg-[#F9F8F6] border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/15 p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-[#D4AF37]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A] font-semibold">
                  Current Membership Standing
                </span>
              </div>
              <Badge variant={subscription.status === 'ACTIVE' ? 'active' : 'pending'}>
                {subscription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1A1A1A]/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block mb-1">
                  Plan Tier
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] block tracking-tight">
                  {subscription.plan} PASS
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block mb-1">
                  Billing Cycle
                </span>
                <span className="text-sm font-sans text-[#1A1A1A] mt-1 block">
                  ₹{subscription.amount} / {subscription.plan === 'MONTHLY' ? 'Month' : 'Year'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#6C6863] block mb-1">
                  {subscription.status === 'ACTIVE' ? 'Next Renewal Date' : 'Ended On'}
                </span>
                <span className="text-sm font-mono text-[#D4AF37] font-semibold mt-1 block">
                  {subscription.renewal_date
                    ? new Date(subscription.renewal_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
            </div>

            {subscription.status === 'ACTIVE' && (
              <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex justify-end">
                <Button
                  onClick={() => setCancelModalOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                >
                  Cancel Membership
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan =
              subscription?.status === 'ACTIVE' && subscription?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`
                  relative p-8 sm:p-12 flex flex-col justify-between border transition-all duration-300 bg-[#F9F8F6]
                  ${
                    isCurrentPlan
                      ? 'border-t-4 border-[#1A1A1A] border-x border-b border-[#1A1A1A]/20 shadow-md'
                      : plan.isPopular
                      ? 'border-t-4 border-[#D4AF37] border-x border-b border-[#1A1A1A]/20 shadow-[0_20px_50px_rgba(26,26,26,0.06)]'
                      : 'border-t-2 border-[#1A1A1A]/30 border-x border-b border-[#1A1A1A]/15'
                  }
                `}
              >
                {isCurrentPlan ? (
                  <div className="absolute -top-3.5 left-8 bg-[#1A1A1A] text-[#F9F8F6] text-[10px] font-mono font-semibold uppercase tracking-[0.2em] px-3.5 py-1 border border-[#1A1A1A] flex items-center gap-1.5">
                    <Check size={12} />
                    CURRENT ACTIVE PLAN
                  </div>
                ) : plan.isPopular ? (
                  <div className="absolute -top-3.5 left-8 bg-[#1A1A1A] text-[#D4AF37] text-[10px] font-mono font-semibold uppercase tracking-[0.2em] px-3.5 py-1 border border-[#D4AF37]/50 flex items-center gap-1.5">
                    <Sparkles size={11} />
                    RECOMMENDED PATRON
                  </div>
                ) : null}

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

                  <div className="flex flex-col gap-3.5 mb-12">
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
                    onClick={() => handleSubscribe(plan.id)}
                    variant={isCurrentPlan ? 'outline' : plan.isPopular ? 'primary' : 'outline'}
                    size="lg"
                    disabled={isCurrentPlan || subscribingPlan === plan.id}
                    className="w-full justify-center"
                  >
                    {isCurrentPlan
                      ? 'Current Active Plan'
                      : subscribingPlan === plan.id
                      ? 'Activating...'
                      : `Subscribe ${plan.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Membership"
        subtitle="CONFIRM CANCELLATION"
      >
        <p className="text-sm text-[#6C6863] leading-relaxed mb-6 font-sans">
          Are you sure you wish to cancel your active subscription? Your logged scores will remain in your archive, but they will no longer qualify for upcoming monthly draw prize pools.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A1A1A]/10">
          <Button onClick={() => setCancelModalOpen(false)} variant="ghost" size="sm">
            Keep Membership
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="outline"
            size="md"
            disabled={cancelling}
            className="text-rose-600 border-rose-400 hover:bg-rose-50"
          >
            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Subscription;
