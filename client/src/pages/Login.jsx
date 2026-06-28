import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import GoogleSignIn from '../components/GoogleSignIn';

/* ── Animated background rings for the brand panel ─── */
function BrandPanel({ isProvider }) {
  const accent = isProvider ? '#f43f5e' : '#6366f1';
  const accentB = isProvider ? '#f97316' : '#22d3ee';

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(145deg, rgba(13,13,20,0.98), rgba(8,8,12,1))`,
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Glow center */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accent}18, transparent 70%)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Concentric rings */}
      {[200, 260, 320, 380].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border pointer-events-none animate-spin-slow"
          style={{
            width: size, height: size,
            borderColor: `${i % 2 === 0 ? accent : accentB}18`,
            animationDuration: `${12 + i * 5}s`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Center icon */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-glow-lg animate-float"
          style={{ background: `linear-gradient(135deg, ${accent}44, ${accentB}22)`, border: `1px solid ${accent}40` }}
        >
          {isProvider ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          )}
        </div>

        <div className="text-center px-8">
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            {isProvider ? 'Grow your business' : 'Find trusted help'}
          </h3>
          <p className="text-sm text-slate-500 max-w-[24ch] leading-relaxed">
            {isProvider
              ? 'List your services and receive bookings from customers in your area.'
              : 'Book verified professionals for any home or device repair.'}
          </p>
        </div>

        {/* Mini feature list */}
        <div className="flex flex-col gap-2 text-sm">
          {(isProvider
            ? ['Set your own pricing', 'Manage bookings', 'OTP job verification']
            : ['Instant booking', 'Real-time tracking', 'Secure OTP confirmation']
          ).map(f => (
            <div key={f} className="flex items-center gap-2 text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = useMemo(() => location.pathname.includes('provider') ? 'provider' : 'customer', [location.pathname]);
  const [mode,     setMode]     = useState('password');
  const [form,     setForm]     = useState({ email: '', password: '', phone: '', otp: '' });
  const [error,    setError]    = useState('');
  const [otpSent,  setOtpSent]  = useState(false);
  const [sending,  setSending]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const isProvider = role === 'provider';
  const accent     = isProvider ? '#f43f5e' : '#6366f1';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(isProvider ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendOtp(form.phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(form.phone, form.otp);
      navigate(isProvider ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: '#050508' }}>
      <SEO
        title={`${isProvider ? 'Provider' : 'Customer'} Sign In — ALLFIX`}
        description="Sign in to your ALLFIX account to manage bookings and services."
        noindex
      />
      <BrandPanel isProvider={isProvider} />

      {/* ── Form panel ─── */}
      <div className="flex items-center justify-center p-8 relative">
        {/* Ambient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${accent}08, transparent 70%)` }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                {isProvider ? 'Provider Portal' : 'Customer Portal'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-100">Welcome back</h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Sign in as a <span className="font-semibold" style={{ color: accent }}>{isProvider ? 'provider' : 'customer'}</span>
            </p>
          </div>

          {/* Tab: password / OTP */}
          <div className="flex rounded-xl border border-white/[0.07] p-1 mb-6" style={{ background: 'rgba(13,13,20,0.7)' }}>
            {['password', 'otp'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setOtpSent(false); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={mode === m ? { background: accent } : {}}
              >
                {m === 'password' ? 'Password' : 'Phone OTP'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-900/30 bg-red-950/20">
              {error}
            </div>
          )}

          {/* ── Password form ─── */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                  style={{ '--tw-ring-color': `${accent}40` }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${accent}, ${isProvider ? '#f97316' : '#22d3ee'})`, boxShadow: `0 0 20px ${accent}35` }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* ── OTP form ─── */}
          {mode === 'otp' && !otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 555 000 0000"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${accent}, ${isProvider ? '#f97316' : '#22d3ee'})` }}
              >
                {sending ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </form>
          )}

          {mode === 'otp' && otpSent && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  required
                  value={form.otp}
                  onChange={handleChange}
                  className="input-field font-mono tracking-[0.3em] text-center text-lg"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-xs text-slate-600 mt-2">OTP sent to {form.phone}</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${accent}, ${isProvider ? '#f97316' : '#22d3ee'})` }}
              >
                {loading ? 'Verifying…' : 'Verify & Sign In'}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} className="w-full btn-ghost text-sm">
                Resend OTP
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-600">or continue with</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <GoogleSignIn label="signin" role={role} />

          {/* Switch role / register links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-500">
              No account?{' '}
              <Link to="/register" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: accent }}>
                Create one free
              </Link>
            </p>
            <p className="text-xs text-slate-600">
              {isProvider ? (
                <>Looking to book a service?{' '}
                  <Link to="/customer/login" className="text-brand-400 hover:text-brand-300 transition-colors">Customer login</Link>
                </>
              ) : (
                <>Are you a provider?{' '}
                  <Link to="/provider/login" className="text-rose-400 hover:text-rose-300 transition-colors">Provider login</Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
