import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

const categories = [
  {
    key: 'electric',
    label: 'Electrical',
    desc: 'Wiring, fixtures, outlets & fan installation',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="rgba(249,115,22,0.15)" stroke="#f97316" />
      </svg>
    ),
  },
  {
    key: 'motorcycle',
    label: 'Motorcycle',
    desc: 'Oil changes, brakes, diagnostics & tune-ups',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" stroke="#f43f5e" fill="rgba(244,63,94,0.1)" />
        <circle cx="18.5" cy="17.5" r="3.5" stroke="#f43f5e" fill="rgba(244,63,94,0.1)" />
        <path d="M15 6h-3L8 13.5H5.5" stroke="#f43f5e" />
        <path d="M10 6l2.5 7.5H18.5" stroke="#f43f5e" />
        <path d="M14 3h4" stroke="#f43f5e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'car',
    label: 'Automotive',
    desc: 'Engine, brakes, AC & general service',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11l1.5-4.5h11L19 11" stroke="#38bdf8" />
        <rect x="2" y="11" width="20" height="7" rx="2" stroke="#38bdf8" fill="rgba(56,189,248,0.1)" />
        <circle cx="7" cy="18" r="2" stroke="#38bdf8" fill="rgba(56,189,248,0.2)" />
        <circle cx="17" cy="18" r="2" stroke="#38bdf8" fill="rgba(56,189,248,0.2)" />
        <line x1="2" y1="14" x2="22" y2="14" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    key: 'cleaning',
    label: 'Home Cleaning',
    desc: 'Deep clean, move-out, kitchen & bathroom',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" stroke="#34d399" />
        <path d="M5 21V10l7-7 7 7v11" stroke="#34d399" fill="rgba(52,211,153,0.08)" />
        <rect x="9" y="14" width="6" height="7" stroke="#34d399" fill="rgba(52,211,153,0.12)" />
        <path d="M9 10h6" stroke="#34d399" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    key: 'computer',
    label: 'Computer Repair',
    desc: 'Laptop, desktop, virus removal & data recovery',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="#a78bfa" fill="rgba(167,139,250,0.08)" />
        <line x1="8" y1="21" x2="16" y2="21" stroke="#a78bfa" />
        <line x1="12" y1="17" x2="12" y2="21" stroke="#a78bfa" />
        <path d="M9 10l2 2 4-4" stroke="#a78bfa" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'phone',
    label: 'Phone Repair',
    desc: 'Screen, battery, charging port & water damage',
    color: '#2dd4bf',
    glow: 'rgba(45,212,191,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke="#2dd4bf" fill="rgba(45,212,191,0.08)" />
        <circle cx="12" cy="18" r="1.2" fill="#2dd4bf" />
        <line x1="9" y1="6" x2="15" y2="6" stroke="#2dd4bf" strokeWidth="1" opacity="0.5" />
        <path d="M10 10l1.5 1.5L14 9" stroke="#2dd4bf" />
      </svg>
    ),
  },
];

const stats = [
  { value: 50,  suffix: '+', label: 'Providers',      icon: '🔧' },
  { value: 200, suffix: '+', label: 'Jobs Done',       icon: '✅' },
  { value: 4.8,              label: 'Avg Rating',      icon: '⭐', isFloat: true },
  { value: 24,  suffix: '/7', label: 'Support',        icon: '💬' },
];

function Counter({ stat, index }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const target = stat.value;
      const steps = 30;
      let i = 0;
      const timer = setInterval(() => {
        i++;
        const progress = i / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setVal(stat.isFloat ? +(target * eased).toFixed(1) : Math.round(target * eased));
        if (i >= steps) clearInterval(timer);
      }, 40);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [stat]);

  return (
    <div
      ref={ref}
      className="card flex flex-col items-center justify-center text-center p-6 gap-1
                 animate-fade-in-up group hover:border-brand-500/20 hover:shadow-md transition-all duration-500"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="text-2xl mb-1">{stat.icon}</div>
      <div className="text-3xl font-extrabold text-gray-100 tracking-tight tabular-nums">
        {val}{stat.suffix}
      </div>
      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();

  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  const setSectionRef = useCallback((key) => (el) => {
    sectionRefs.current[key] = el;
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible((prev) => ({ ...prev, [e.target.dataset.key]: true }));
        });
      },
      { threshold: 0.1 }
    );
    Object.entries(sectionRefs.current).forEach(([, el]) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Professional Repair & Home Services"
        canonical="https://sense51.github.io/allfix/"
      />
      <div className="min-h-screen relative overflow-x-hidden bg-surface">
        {/* Blueprint grid */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-grid-blueprint" />
        {/* Scan line */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-scan-line" />
        {/* Ambient glow */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-ambient-glow" />

        <Navbar />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

          {/* ── HERO ─────────────────────────────────────────── */}
          <section className="min-h-[80vh] flex flex-col justify-center relative mb-24">

            {/* Top eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 w-max mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
              <span>Trusted by <strong className="text-brand-300 font-bold">1,000+</strong> homeowners</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-[76px] font-extrabold text-gray-100 leading-[1.1] tracking-[-0.02em] max-w-4xl animate-fade-in-up"
              style={{ animationDelay: '80ms' }}
            >
              Professional repair &<br />
              <span
                className="inline-block bg-gradient-to-r from-brand-400 via-[#ff8a00] to-brand-500 bg-clip-text text-transparent"
              >
                home services.
              </span>
            </h1>

            <p
              className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '160ms' }}
            >
              Find verified professionals for electrical, automotive, cleaning, computer & phone repair.
              Book in seconds, get it done today.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
              {!user && (
                <Link to="/register" className="btn-primary !px-7 !py-3.5 !text-base !rounded-full group">
                  Get Started Free
                  <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center
                                   group-hover:translate-x-0.5 transition-transform duration-300">
                    →
                  </span>
                </Link>
              )}
              <Link to="/services" className="btn-secondary !px-7 !py-3.5 !text-base !rounded-full">
                Browse Services
              </Link>
            </div>

            {/* Floating service chips */}
            <div className="mt-14 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '360ms' }}>
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  to={`/services?category=${cat.key}`}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold
                             border transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                  style={{
                    borderColor: `${cat.color}30`,
                    background: `${cat.color}12`,
                    color: cat.color,
                  }}
                >
                  <span className="w-3.5 h-3.5 shrink-0">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── STATS ────────────────────────────────────────── */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-28">
            {stats.map((s, i) => <Counter key={i} stat={s} index={i} />)}
          </section>

          {/* ── CATEGORIES BENTO GRID ─────────────────────── */}
          <section
            ref={setSectionRef('cats')}
            data-key="cats"
            className="mb-28"
          >
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-400 mb-3">Services</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 tracking-tight leading-tight">
                  What do you need<br className="hidden sm:block" /> fixed today?
                </h2>
              </div>
              <Link
                to="/services"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400
                           hover:text-brand-300 transition-colors group"
              >
                View all
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.key}
                  to={`/services?category=${cat.key}`}
                  className={`group relative overflow-hidden rounded-2xl p-6 border border-white/[0.06] bg-surface-50 shadow-sm hover:shadow-md hover:border-white/[0.12] transition-all duration-500
                    ${visible.cats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
                  `}
                  style={{
                    transitionDelay: `${i * 70}ms`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-[0.3] transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 30% 50%, ${cat.glow} 0%, transparent 65%)` }}
                  />

                  {/* Top stripe accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
                  />

                  {/* Icon container */}
                  <div
                    className="relative mb-5 w-14 h-14 rounded-2xl flex items-center justify-center
                               ring-1 transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: `${cat.color}15`,
                      boxShadow: `0 0 0 1px ${cat.color}25, inset 0 1px 0 ${cat.color}10`,
                    }}
                  >
                    {cat.icon}
                  </div>

                  <h3
                    className="text-base font-bold text-gray-100 mb-1.5 transition-colors duration-300"
                  >
                    {cat.label}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{cat.desc}</p>

                  {/* Arrow reveal */}
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold
                               opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0
                               transition-all duration-300"
                    style={{ color: cat.color }}
                  >
                    Browse services →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── HOW IT WORKS ─────────────────────────────── */}
          <section
            ref={setSectionRef('how')}
            data-key="how"
            className="mb-28"
          >
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-400 mb-3">Process</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 tracking-tight">How it works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px]
                              bg-gradient-to-r from-transparent via-brand-500/20 to-transparent z-0" />

              {[
                {
                  step: '01',
                  title: 'Browse',
                  desc: 'Explore 6 service categories and filter by your exact need.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                    </svg>
                  ),
                  color: '#f97316',
                },
                {
                  step: '02',
                  title: 'Book a Pro',
                  desc: 'Choose a verified provider and pick a time that works for you.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2" />
                    </svg>
                  ),
                  color: '#38bdf8',
                },
                {
                  step: '03',
                  title: 'Get It Done',
                  desc: 'Sit back while trusted experts handle everything. Leave a review.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
                      <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  color: '#34d399',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative card group p-7 transition-all duration-500 bg-surface-50 border border-white/[0.06] shadow-sm
                    ${visible.how ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                    hover:-translate-y-1 hover:shadow-md hover:border-white/[0.12]`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span
                    className="absolute top-3 right-5 text-6xl font-black select-none leading-none"
                    style={{ color: `${item.color}08` }}
                  >
                    {item.step}
                  </span>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${item.color}15`, color: item.color, boxShadow: `0 0 0 1px ${item.color}25` }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── PROVIDER CTA ─────────────────────────────── */}
          {!user && (
            <section className="relative overflow-hidden rounded-3xl mb-16 border border-brand-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.04] via-transparent to-brand-500/[0.02]" />
              <div className="absolute inset-0 bg-grid-blueprint opacity-50" />
              <div className="absolute w-96 h-96 -top-24 -right-24"
                style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />
              <div className="absolute w-64 h-64 -bottom-12 -left-12"
                style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)' }} />

              <div className="relative z-10 px-8 py-16 sm:py-20 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-400 mb-4">For Professionals</p>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-100 tracking-tight leading-tight mb-4">
                  Are you a skilled<br />
                  <span className="text-brand-400">professional?</span>
                </h2>
                <p className="text-gray-300 max-w-md mx-auto mb-10 leading-relaxed">
                  Join ALLFIX and start earning by offering your services to customers in your area.
                  Free to join, no setup fees.
                </p>
                <Link
                  to="/register"
                  className="btn-primary !px-8 !py-4 !text-base !rounded-full group inline-flex"
                >
                  Register as a Provider
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center
                                   group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
                <p className="mt-4 text-sm text-gray-400">
                  Already registered?{' '}
                  <Link to="/provider/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </section>
          )}

          {/* ── FOOTER ───────────────────────────────────── */}
          <footer className="text-center py-8 border-t border-white/[0.06]">
            <p className="text-gray-400 text-sm">
              © 2026 <span className="text-gray-200 font-semibold">ALLFIX</span>. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>);
}
