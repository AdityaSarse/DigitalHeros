import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#1A1A1A] text-[#F9F8F6] border-t border-[#1A1A1A] pt-28 pb-16 overflow-hidden">
      {/* Huge Subtle Watermark Graphic Behind Columns */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-black text-white/[0.02] select-none pointer-events-none whitespace-nowrap tracking-tighter">
        DIGITAL HEROES
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center bg-[#1A1A1A]">
                <span className="font-serif text-[#D4AF37] text-base font-bold">H</span>
              </div>
              <span className="font-serif text-xl tracking-tight text-[#F9F8F6] font-medium">
                DIGITAL HEROES
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#EBE5DE]/70 max-w-sm leading-relaxed mt-2 font-sans">
              An editorial collective uniting recreational golf performance with audited philanthropic endowments and monthly member drawings.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37]">
              <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
              <span>100% AUDITED DRAW PROTOCOL</span>
            </div>
          </div>

          {/* Col 1: Explore */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              Index
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-mono uppercase tracking-[0.18em] text-[#EBE5DE]/70">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  &bull; The Club
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#D4AF37] transition-colors">
                  &bull; The Process
                </a>
              </li>
              <li>
                <Link to="/charities" className="hover:text-[#D4AF37] transition-colors">
                  &bull; Charities
                </Link>
              </li>
              <li>
                <Link to="/draws" className="hover:text-[#D4AF37] transition-colors">
                  &bull; Monthly Draws
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Member Access */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              Membership
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-mono uppercase tracking-[0.18em] text-[#EBE5DE]/70">
              <li>
                <Link to="/login" className="hover:text-[#D4AF37] transition-colors">
                  &bull; Member Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#D4AF37] transition-colors">
                  &bull; Application
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#D4AF37] transition-colors">
                  &bull; Member Portal
                </Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-[#D4AF37] transition-colors">
                  &bull; Prize Claims
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              Standards
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-mono uppercase tracking-[0.18em] text-[#EBE5DE]/70">
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Verification
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Audit Reports
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Privacy Terms
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  &bull; Integrity Protocol
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Dispatch */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              The Dispatch
            </span>
            <p className="text-xs text-[#EBE5DE]/60 leading-relaxed font-sans">
              Private notices delivered when each monthly draw simulation is audited and published.
            </p>
            <form onSubmit={handleSubscribe} className="mt-2 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-transparent border-b border-white/30 py-2.5 pr-8 text-xs text-[#F9F8F6] placeholder-[#EBE5DE]/40 placeholder:font-serif placeholder:italic focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-2.5 text-[#F9F8F6] hover:text-[#D4AF37] transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check size={16} className="text-[#D4AF37]" /> : <ArrowRight size={16} />}
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] text-[#D4AF37] font-mono tracking-wider">
                  &bull; Subscribed to monthly dispatch.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-[#EBE5DE]/50">
          <div>
            &copy; {new Date().getFullYear()} Digital Heroes. All rights reserved. Play with intention.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#F9F8F6] cursor-pointer">PAR 72 STANDARD</span>
            <span className="hover:text-[#F9F8F6] cursor-pointer">PROVABLY FAIR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
