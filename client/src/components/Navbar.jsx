import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
      <path
        d="M20 4a6 6 0 0 0-5.83 7.42L4.59 21A2 2 0 1 0 7.41 23.83l9.57-9.57A6 6 0 1 0 20 4z"
        fill="url(#navlg1)"
        opacity="0.9"
      />
      <path d="M18 2l-4 8h4l-4 10 8-11h-5l4-7z" fill="#fff" opacity="0.95" />
      <defs>
        <linearGradient id="navlg1" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = user
    ? [
        { to: '/services',             label: 'Browse'     },
        { to: '/blog',                 label: 'Tips'       },
        ...(user.role === 'provider' ? [{ to: '/provider/dashboard', label: 'Dashboard' }] : []),
        ...(user.role === 'customer' ? [{ to: '/customer/bookings',  label: 'Bookings'  }] : []),
        { to: '/profile',              label: user.name.split(' ')[0] },
      ]
    : [
        { to: '/services',        label: 'Browse'   },
        { to: '/blog',            label: 'Tips'     },
        { to: '/customer/login',  label: 'Sign In'  },
      ];

  return (
    <>
      {/* ── Glassmorphism sticky nav ───────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mr-8 group flex-shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center
                         shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              }}
            >
              <LogoMark />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">
              ALL<span className="text-brand-400">FIX</span>
            </span>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden sm:flex items-center gap-1 flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === l.to
                    ? 'text-brand-300 bg-brand-500/10 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA / logout — desktop */}
          <div className="hidden sm:flex items-center gap-2 ml-auto">
            {!user ? (
              <Link to="/register" className="btn-primary !py-2 !px-4">
                Get Started
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
                           text-red-400 hover:text-red-300 hover:bg-red-500/[0.08]
                           border border-transparent hover:border-red-500/20
                           transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden ml-auto w-9 h-9 flex flex-col items-center justify-center gap-1.5
                       rounded-xl hover:bg-white/[0.07] transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-2 bg-brand-400' : 'bg-slate-400'}`} />
            <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : 'bg-slate-400'}`} />
            <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2 bg-brand-400' : 'bg-slate-400'}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className={`absolute top-20 left-3 right-3 rounded-2xl border border-white/[0.08] p-2
            bg-surface-100/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]
            transition-all duration-300
            ${mobileOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-3'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                location.pathname === l.to
                  ? 'text-brand-300 bg-brand-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {l.label}
            </Link>
          ))}

          <div className="h-px bg-white/[0.06] my-2" />

          {!user ? (
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold
                         bg-brand-500 text-white rounded-xl transition-all hover:bg-brand-400"
            >
              Get Started Free
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/[0.08] rounded-xl transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}
