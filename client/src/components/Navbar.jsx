import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Brand logo — wrench + lightning bolt fused ──────────────── */
function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
      {/* Wrench body */}
      <path
        d="M20 4a6 6 0 0 0-5.83 7.42L4.59 21A2 2 0 1 0 7.41 23.83l9.57-9.57A6 6 0 1 0 20 4z"
        fill="url(#lg1)"
        opacity="0.9"
      />
      {/* Lightning bolt overlay */}
      <path
        d="M18 2l-4 8h4l-4 10 8-11h-5l4-7z"
        fill="#fff"
        opacity="0.95"
      />
      <defs>
        <linearGradient id="lg1" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9500" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = user
    ? [
        { to: '/services', label: 'Browse' },
        ...(user.role === 'provider' ? [{ to: '/provider/dashboard', label: 'Dashboard' }] : []),
        ...(user.role === 'customer' ? [{ to: '/customer/bookings', label: 'My Bookings' }] : []),
        { to: '/profile', label: user.name.split(' ')[0] },
      ]
    : [
        { to: '/services', label: 'Browse' },
        { to: '/login',    label: 'Sign In' },
      ];

  return (
    <>
      {/* ── Floating glass pill navbar ───────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4 px-4">
        <div
          className={`pointer-events-auto flex items-center gap-1 px-3 py-2 rounded-full
            transition-all duration-500
            ${scrolled
              ? 'bg-white/80 backdrop-blur-2xl border border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)]'
              : 'bg-white/50 backdrop-blur-md border border-gray-200/40 shadow-sm'
            }`}
          style={{ minWidth: 'max-content' }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 mr-4 pl-1 group"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-neon-orange flex items-center justify-center
                            shadow-[0_2px_12px_rgba(249,115,22,0.2)] group-hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)]
                            transition-all duration-300 group-hover:scale-105">
              <LogoMark />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-gray-900">
              ALL<span className="text-brand-500">FIX</span>
            </span>
          </Link>

          {/* Nav items */}
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${location.pathname === l.to
                  ? 'bg-brand-50 text-brand-600 border border-brand-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {l.label}
            </Link>
          ))}

          {/* CTA / logout */}
          {!user ? (
            <Link
              to="/register"
              className="ml-2 px-4 py-1.5 rounded-full text-sm font-semibold
                         bg-brand-500 text-white
                         hover:bg-brand-600
                         shadow-[0_2px_12px_rgba(249,115,22,0.2)] hover:shadow-[0_4px_18px_rgba(249,115,22,0.35)]
                         transition-all duration-300"
            >
              Get Started
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 rounded-full text-sm font-medium
                         text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100
                         transition-all duration-200 flex items-center gap-1.5"
            >
              <LogoutIcon />
              <span className="hidden sm:inline">Out</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden ml-1 w-8 h-8 flex flex-col items-center justify-center gap-1.5
                       rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <span className={`block w-4 h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-4 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-4 h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown ─────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div
          className={`absolute top-20 left-4 right-4 rounded-2xl border border-gray-100 p-3 transition-all duration-300
            bg-white/95 backdrop-blur-2xl shadow-xl
            ${mobileOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {navLinks.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold
                         bg-brand-500 text-white rounded-xl transition-all hover:bg-brand-600"
            >
              Get Started Free →
            </Link>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogoutIcon /> Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
