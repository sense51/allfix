import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import TiltCard from '../components/TiltCard';
import AnimatedCounter from '../components/AnimatedCounter';
import ThreeHero from '../components/ThreeHero';

/* ── Service categories ────────────────────────────────────────── */
const categories = [
  {
    key: 'electric',
    label: 'Electrical',
    desc: 'Wiring, fixtures, outlets & fan installation',
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="rgba(129,140,248,0.15)" stroke="#818cf8" />
      </svg>
    ),
  },
  {
    key: 'motorcycle',
    label: 'Motorcycle',
    desc: 'Oil changes, brakes, diagnostics & tune-ups',
    accent: '#f43f5e',
    glow: 'rgba(244,63,94,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" stroke="#f43f5e" fill="rgba(244,63,94,0.12)" strokeWidth="1.5" />
        <circle cx="18.5" cy="17.5" r="3.5" stroke="#f43f5e" fill="rgba(244,63,94,0.12)" strokeWidth="1.5" />
        <path d="M15 6h-3L8 13.5H5.5" stroke="#f43f5e" strokeWidth="1.5" />
        <path d="M10 6l2.5 7.5H18.5" stroke="#f43f5e" strokeWidth="1.5" />
        <path d="M14 3h4" stroke="#f43f5e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'car',
    label: 'Automotive',
    desc: 'Engine, brakes, AC & general service',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11l1.5-4.5h11L19 11" stroke="#22d3ee" strokeWidth="1.5" />
        <rect x="2" y="11" width="20" height="7" rx="2" stroke="#22d3ee" fill="rgba(34,211,238,0.10)" strokeWidth="1.5" />
        <circle cx="7" cy="18" r="2" stroke="#22d3ee" fill="rgba(34,211,238,0.18)" strokeWidth="1.5" />
        <circle cx="17" cy="18" r="2" stroke="#22d3ee" fill="rgba(34,211,238,0.18)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'cleaning',
    label: 'Home Cleaning',
    desc: 'Deep clean, move-out, kitchen & bathroom',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" stroke="#34d399" strokeWidth="1.5" />
        <path d="M5 21V10l7-7 7 7v11" stroke="#34d399" fill="rgba(52,211,153,0.08)" strokeWidth="1.5" />
        <rect x="9" y="14" width="6" height="7" stroke="#34d399" fill="rgba(52,211,153,0.12)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'computer',
    label: 'Computer Repair',
    desc: 'Laptop, desktop, virus removal & data recovery',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="#a78bfa" fill="rgba(167,139,250,0.08)" strokeWidth="1.5" />
        <line x1="8" y1="21" x2="16" y2="21" stroke="#a78bfa" strokeWidth="1.5" />
        <line x1="12" y1="17" x2="12" y2="21" stroke="#a78bfa" strokeWidth="1.5" />
        <path d="M9 10l2 2 4-4" stroke="#a78bfa" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'phone',
    label: 'Phone Repair',
    desc: 'Screen, battery, charging port & water damage',
    accent: '#2dd4bf',
    glow: 'rgba(45,212,191,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke="#2dd4bf" fill="rgba(45,212,191,0.08)" strokeWidth="1.5" />
        <circle cx="12" cy="18" r="1.2" fill="#2dd4bf" />
        <path d="M10 10l1.5 1.5L14 9" stroke="#2dd4bf" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const stats = [
  { target: 50,   suffix: '+',  label: 'Expert Providers' },
  { target: 1200, suffix: '+',  label: 'Bookings Completed' },
  { target: 4.9,  suffix: '',   label: 'Average Rating',  decimals: 1 },
  { target: 6,    suffix: '',   label: 'Service Categories' },
];

const steps = [
  {
    n: '01',
    title: 'Find Your Service',
    desc: 'Browse 6 categories of expert home and device repair services from verified professionals.',
    color: '#6366f1',
  },
  {
    n: '02',
    title: 'Book Instantly',
    desc: 'Pick your time slot and lock in your booking. No phone tag, no waiting. Confirmation is immediate.',
    color: '#22d3ee',
  },
  {
    n: '03',
    title: 'Get It Fixed',
    desc: 'Your provider arrives on schedule. Confirm completion with your personal OTP for full security.',
    color: '#a78bfa',
  },
];

/* ── Typewriter effect ─────────────────────────────────────────── */
const WORDS = ['Electrical', 'Automotive', 'Cleaning', 'Phone Repair', 'Computer'];
function useTypewriter() {
  const [text, setText]       = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase]     = useState('typing'); // 'typing' | 'waiting' | 'erasing'

  useEffect(() => {
    const current = WORDS[wordIndex];
    let timeout;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setPhase('waiting'), 1400);
      }
    } else if (phase === 'waiting') {
      timeout = setTimeout(() => setPhase('erasing'), 300);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
      } else {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [text, phase, wordIndex]);

  return text;
}

export default function Landing() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const word      = useTypewriter();

  return (
    <div className="min-h-screen" style={{ background: '#050508' }}>
      <SEO
        title="ALLFIX — Home Services Marketplace"
        description="Find trusted professionals for electrical, automotive, cleaning, computer & phone repair. Book in seconds."
      />

      {/* ── Ambient background layers ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="bg-ambient absolute inset-0" />
      </div>

      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        {/* Three.js particle canvas */}
        <ThreeHero />

        {/* Radial gradient spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <div className="h-px w-8 bg-gradient-to-r from-brand-500 to-transparent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-400/80">
                Home Services Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
              <span className="text-slate-100">Fix anything.</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 60%, #a78bfa 100%)' }}
              >
                {word}
                <span className="animate-pulse-soft ml-0.5 text-brand-400">|</span>
              </span>
            </h1>

            {/* Sub */}
            <p className="text-slate-400 text-lg leading-relaxed max-w-[52ch] mb-10 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
              Connect with verified local experts for every repair and service.
              Book instantly, track in real time, confirm with OTP.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
              <Link
                to="/services"
                className="btn-primary !py-3.5 !px-7 !text-base gap-2"
              >
                Browse Services
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69L5.22 13.72a.75.75 0 000 1.06z" clipRule="evenodd" />
                </svg>
              </Link>
              {!user && (
                <Link to="/register" className="btn-secondary !py-3.5 !px-7 !text-base">
                  Join Free
                </Link>
              )}
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '360ms' }}>
              <div className="flex -space-x-2">
                {['#6366f1','#22d3ee','#a78bfa','#34d399'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c }}>
                    {['A','B','C','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Trusted by 1,200+ customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <div className="w-px h-8 bg-gradient-to-b from-brand-500/50 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400/60" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-16 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className={`text-center animate-fade-in-up stagger-${i + 1}`}>
                <div className="text-4xl md:text-5xl font-black gradient-text mb-1">
                  <AnimatedCounter
                    target={s.target}
                    suffix={s.suffix}
                    decimals={s.decimals || 0}
                    duration={1600}
                  />
                </div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORIES — 3D Tilt Cards
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="section-title mb-3">What we fix</h2>
            <p className="section-sub text-slate-400">
              Six categories of on-demand repair and maintenance, handled by certified local pros.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <TiltCard
                key={cat.key}
                className={`animate-fade-in-up stagger-${i + 1}`}
                intensity={10}
              >
                <Link
                  to={`/services?category=${cat.key}`}
                  className="group block relative overflow-hidden rounded-2xl p-6 h-full
                             border border-white/[0.06] transition-all duration-400"
                  style={{
                    background: 'rgba(13,13,20,0.85)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${cat.accent}40`;
                    e.currentTarget.style.boxShadow   = `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${cat.glow}`;
                    e.currentTarget.style.background  = `rgba(16,16,26,0.95)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow   = 'none';
                    e.currentTarget.style.background  = 'rgba(13,13,20,0.85)';
                  }}
                >
                  {/* Glow orb */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${cat.glow}, transparent 70%)`,
                      transform: 'translate(30%, -30%)',
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${cat.accent}18, ${cat.accent}08)`,
                      border: `1px solid ${cat.accent}30`,
                      boxShadow: `0 0 20px ${cat.glow}`,
                    }}
                  >
                    {cat.icon}
                  </div>

                  {/* Text */}
                  <h3 className="font-bold text-lg text-slate-100 mb-1.5 group-hover:text-white transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                    {cat.desc}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-1 mt-4 text-xs font-medium" style={{ color: cat.accent }}>
                    <span>Explore</span>
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: steps */}
            <div>
              <h2 className="section-title mb-12">How it works</h2>
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={step.n} className={`flex gap-5 animate-fade-in-up stagger-${i + 1}`}>
                    {/* Number + line */}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}22, ${step.color}10)`,
                          border: `1px solid ${step.color}35`,
                          color: step.color,
                        }}
                      >
                        {step.n}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px flex-1 bg-gradient-to-b from-white/[0.08] to-transparent min-h-[2rem]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-2">
                      <h3 className="text-slate-100 font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D floating card mockup */}
            <div className="relative flex items-center justify-center h-80 lg:h-full">
              {/* Glow rings */}
              <div className="absolute w-72 h-72 rounded-full border border-brand-500/10 animate-spin-slow" />
              <div className="absolute w-52 h-52 rounded-full border border-cyan-400/10 animate-spin-slow" style={{ animationDirection: 'reverse' }} />

              {/* Central mock card */}
              <div
                className="relative z-10 w-60 rounded-2xl p-6 border border-white/[0.08] animate-float"
                style={{
                  background: 'linear-gradient(145deg, rgba(18,18,28,0.95), rgba(13,13,20,0.90))',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Electrical Repair</div>
                    <div className="text-[10px] text-slate-500">by Kevin M.</div>
                  </div>
                </div>
                <div className="h-px bg-white/[0.06] mb-4" />
                <div className="space-y-2.5">
                  {[['Status', 'Confirmed', '#22d3ee'], ['Date', 'Tomorrow 10am', '#818cf8'], ['OTP', '••••', '#a78bfa']].map(([k, v, c]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-slate-600">{k}</span>
                      <span className="font-medium" style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 w-full py-2 rounded-lg text-[11px] font-bold text-center"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                  View Booking
                </div>
              </div>

              {/* Floating orbiting dot */}
              <div className="absolute w-3 h-3 rounded-full bg-brand-400 shadow-glow-sm animate-orbit opacity-80" />
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan animate-orbit opacity-60" style={{ animationDelay: '-4s', animationDuration: '6s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(99,102,241,0.09) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="rounded-3xl p-12 border border-white/[0.07]"
            style={{
              background: 'linear-gradient(145deg, rgba(16,16,26,0.95), rgba(13,13,20,0.90))',
              boxShadow: '0 0 80px rgba(99,102,241,0.08), 0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">Live & accepting bookings</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-100 mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-[44ch] mx-auto leading-relaxed">
              Join hundreds of customers and providers already using ALLFIX every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!user ? (
                <>
                  <Link to="/register" className="btn-primary !py-4 !px-8 !text-base">
                    Create Free Account
                  </Link>
                  <Link to="/services" className="btn-secondary !py-4 !px-8 !text-base">
                    Browse Services
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'provider' ? '/provider/dashboard' : '/services'}
                  className="btn-primary !py-4 !px-8 !text-base"
                >
                  {user.role === 'provider' ? 'Go to Dashboard' : 'Find a Service'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.05] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)' }}>
              <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
                <path d="M20 4a6 6 0 0 0-5.83 7.42L4.59 21A2 2 0 1 0 7.41 23.83l9.57-9.57A6 6 0 1 0 20 4z" fill="white" opacity=".4" />
                <path d="M17 3l-4 8h4l-4 10 8-11h-5l4-7z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-300">ALL<span className="text-brand-400">FIX</span></span>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} ALLFIX. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/services" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Services</Link>
            <Link to="/blog" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
