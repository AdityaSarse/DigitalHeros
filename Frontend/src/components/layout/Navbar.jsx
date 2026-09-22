import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Shield, LogOut, User, Trophy, Calendar, Target } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'the club', to: '/' },
    { label: 'the process', to: '/#how-it-works' },
    { label: 'charities', to: '/charities' },
    { label: 'draws', to: '/draws' },
  ];

  const authenticatedLinks = [
    { label: 'dashboard', to: '/dashboard', icon: User },
    { label: 'scorecard', to: '/scores', icon: Target },
    { label: 'patronage', to: '/subscription', icon: Calendar },
    { label: 'winnings', to: '/winners', icon: Trophy },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            : 'bg-transparent border-b border-[#1A1A1A]/5 py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center bg-[#F9F8F6] group-hover:border-[#D4AF37] transition-colors duration-500">
              <span className="font-serif text-[#1A1A1A] group-hover:text-[#D4AF37] text-base leading-none font-bold transition-colors duration-500">
                H
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-[#1A1A1A] font-medium leading-none">
                DIGITAL HEROES
              </span>
              <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-[#6C6863] mt-1">
                EDITORIAL GOLF &bull; AUDITED DRAWS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-xs font-mono uppercase tracking-[0.25em] transition-colors duration-500 relative group py-1 ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#1A1A1A] hover:text-[#D4AF37]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-[#D4AF37] transition-all duration-500 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <span className="w-px h-4 bg-[#1A1A1A]/15" />
                {authenticatedLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={`text-xs font-mono uppercase tracking-[0.22em] transition-colors duration-500 flex items-center gap-1.5 ${
                        isActive ? 'text-[#D4AF37]' : 'text-[#6C6863] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-mono uppercase tracking-[0.22em] text-[#D4AF37] hover:text-[#1A1A1A] flex items-center gap-1.5 px-3 py-1.5 border border-[#D4AF37] transition-colors duration-500"
              >
                <Shield size={12} />
                <span>Command</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-xs font-mono text-[#1A1A1A] hover:text-[#D4AF37] transition-colors py-1.5 px-3 border border-[#1A1A1A]/20 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-[#D4AF37]"></span>
                  <span>{profile?.first_name || user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#6C6863] hover:text-rose-600 p-2 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-xs font-mono uppercase tracking-[0.22em] text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500"
                >
                  Member Access
                </Link>
                <Button to="/register" variant="primary" size="sm">
                  Apply To Club
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#1A1A1A] p-2 hover:bg-[#EBE5DE]/50 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-[#F9F8F6] pt-24 px-8 pb-12 flex flex-col justify-between overflow-y-auto border-b border-[#1A1A1A]/10">
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              INDEX &bull; DIRECTORY
            </span>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-serif text-3xl text-[#1A1A1A] hover:text-[#D4AF37] transition-colors capitalize"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <div className="flex flex-col gap-4 pt-6 border-t border-[#1A1A1A]/10">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
                  MEMBER PASS
                </span>
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="font-serif text-2xl text-[#1A1A1A] hover:text-[#D4AF37] transition-colors capitalize flex items-center gap-3"
                  >
                    <link.icon size={18} className="text-[#D4AF37]" />
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="font-serif text-2xl text-[#D4AF37] hover:text-[#1A1A1A] flex items-center gap-3"
                  >
                    <Shield size={18} />
                    Command Center
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-[#1A1A1A]/10 flex flex-col gap-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-serif text-[#1A1A1A]">
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div className="text-xs font-mono text-[#6C6863]">{user?.email}</div>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button to="/login" variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
                <Button to="/register" variant="primary" className="w-full justify-center">
                  Apply To Club
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
