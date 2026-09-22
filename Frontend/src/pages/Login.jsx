import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message || 'Invalid email or password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center pt-28 pb-16 px-6 relative">
      <div className="relative z-10 w-full max-w-md">
        {/* Editorial Brand Crest */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center bg-[#F9F8F6]">
              <span className="font-serif text-[#D4AF37] text-sm font-bold">H</span>
            </div>
            <span className="font-serif text-xl tracking-tight text-[#1A1A1A] font-medium">
              DIGITAL HEROES
            </span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-tight">
            Member Sign In
          </h1>
          <p className="text-[11px] text-[#6C6863] mt-2 font-mono tracking-[0.2em] uppercase">
            Access your scores, causes &amp; draw allocations
          </p>
        </div>

        {/* Card with 0px radius */}
        <div className="bg-[#F9F8F6] border border-[#1A1A1A]/15 p-8 sm:p-10 shadow-[0_20px_50px_rgba(26,26,26,0.06)]">
          {error && (
            <div className="mb-6 p-4 border border-rose-500/30 bg-rose-50 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
                Member Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2.5 pl-8 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                />
                <Mail size={16} className="absolute left-0 top-3 text-[#6C6863]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#1A1A1A] block mb-2 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  className="w-full bg-transparent border-b border-[#1A1A1A]/30 py-2.5 pl-8 pr-2 text-sm text-[#1A1A1A] placeholder-[#6C6863]/50 focus:outline-none focus:border-[#D4AF37] transition-colors font-sans"
                />
                <Lock size={16} className="absolute left-0 top-3 text-[#6C6863]" />
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
                {isSubmitting ? 'Authenticating...' : 'Sign In To Clubhouse'}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 text-center text-xs text-[#6C6863]">
            Not yet a member?{' '}
            <Link
              to="/register"
              className="text-[#1A1A1A] hover:text-[#D4AF37] underline underline-offset-4 transition-colors font-medium"
            >
              Apply to join the circle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
