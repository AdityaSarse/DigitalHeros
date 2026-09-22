import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscriptionApi } from '../api/subscription';
import Button from '../components/common/Button';
import { Lock, Mail, User, AlertCircle } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'MONTHLY';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    const res = await register({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password,
    });

    if (res.success) {
      try {
        if (selectedPlan === 'MONTHLY' || selectedPlan === 'YEARLY') {
          await subscriptionApi.createSubscription({ plan: selectedPlan });
        }
      } catch (subErr) {
        console.warn('Initial subscription auto-activation notice:', subErr);
      }
      navigate('/dashboard');
    } else {
      setError(res.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center pt-28 pb-16 px-6 relative">
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center bg-[#F9F8F6]">
              <span className="font-serif text-[#D4AF37] text-sm font-bold">H</span>
            </div>
            <span className="font-serif text-xl tracking-tight text-[#1A1A1A] font-medium">
              DIGITAL HEROES
            </span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight">
            Apply For Membership
          </h1>
          <div className="mt-2 inline-block border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-0.5 text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] font-semibold">
            {selectedPlan === 'YEARLY' ? 'Annual Patron Tier' : 'Monthly Member Tier'}
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-10 shadow-[0_20px_50px_rgba(26,26,26,0.06)]">
          {error && (
            <div className="mb-6 p-4 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-1 font-semibold">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Marcus"
                    required
                    className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 pl-7 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                  />
                  <User size={14} className="absolute left-0 top-2.5 text-[#6C6863]" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-1 font-semibold">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                    required
                    className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 pl-7 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                  />
                  <User size={14} className="absolute left-0 top-2.5 text-[#6C6863]" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-1 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 pl-7 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                />
                <Mail size={14} className="absolute left-0 top-2.5 text-[#6C6863]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-1 font-semibold">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  minLength={6}
                  className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 pl-7 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                />
                <Lock size={14} className="absolute left-0 top-2.5 text-[#6C6863]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-1 font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2 pl-7 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                />
                <Lock size={14} className="absolute left-0 top-2.5 text-[#6C6863]" />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? 'Creating Membership...' : 'Complete Registration'}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 text-center text-xs text-[#6C6863]">
            Already holding a membership?{' '}
            <Link
              to="/login"
              className="text-[#1A1A1A] hover:text-[#D4AF37] underline underline-offset-4 transition-colors font-medium"
            >
              Sign in to Clubhouse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
