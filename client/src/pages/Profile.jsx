import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.07]"
            style={{ background: 'rgba(13,13,20,0.8)' }}>
            <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-300 mb-2">Please sign in</h3>
          <Link to="/customer/login" className="btn-primary">Sign In</Link>
        </div>
      </Layout>
    );
  }

  const isProvider = user.role === 'provider';
  const accent     = isProvider ? '#f43f5e' : '#6366f1';
  const accentB    = isProvider ? '#f97316' : '#22d3ee';

  const details = [
    { label: 'Full Name',     value: user.name,           icon: '👤' },
    { label: 'Email',         value: user.email,          icon: '✉' },
    { label: 'Role',          value: isProvider ? 'Service Provider' : 'Customer', icon: '🛡' },
    { label: 'Phone',         value: user.phone    || '—', icon: '📱' },
    { label: 'Location',      value: user.location || '—', icon: '📍' },
    { label: 'Member Since',  value: user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : '—', icon: '📅' },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <SEO title={`${user.name} — ALLFIX`} description={`${user.name} — ${isProvider ? 'Service Provider' : 'Customer'} on ALLFIX.`} noindex />

        {/* ── Profile header ── */}
        <div className="relative mb-8 animate-fade-in-up">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/[0.07] p-8 text-center"
            style={{
              background: 'rgba(13,13,20,0.9)',
              boxShadow: `0 0 60px ${accent}0a, 0 30px 60px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Top glow edge */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }}
            />
            {/* Glow orb */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${accent}10, transparent 70%)` }}
            />

            {/* Avatar */}
            <div className="relative inline-block mb-5">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-glow-lg animate-float"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accentB})` }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-surface flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-100 tracking-tight">{user.name}</h1>

            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: `${accent}14`, color: accent, border: `1px solid ${accent}30` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: accent }} />
              {isProvider ? 'Service Provider' : 'Customer'}
            </div>

            {/* Quick action links */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {isProvider ? (
                <Link to="/provider/dashboard" className="btn-secondary !text-xs !py-2 !px-4">
                  Dashboard →
                </Link>
              ) : (
                <Link to="/customer/bookings" className="btn-secondary !text-xs !py-2 !px-4">
                  My Bookings →
                </Link>
              )}
              <Link to="/services" className="btn-ghost !text-xs !py-2 !px-4">Browse Services</Link>
            </div>
          </div>
        </div>

        {/* ── Account details ── */}
        <div
          className="rounded-2xl border border-white/[0.07] overflow-hidden animate-fade-in-up"
          style={{ background: 'rgba(13,13,20,0.85)', animationDelay: '80ms' }}
        >
          {/* Section header */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Account Details</h2>
              <p className="text-xs text-slate-500">Your personal information</p>
            </div>
          </div>

          {/* Detail rows */}
          <div className="px-6 py-2">
            {details.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3.5 border-b border-white/[0.04] last:border-b-0 group hover:bg-white/[0.02] -mx-6 px-6 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                  style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}
                >
                  {d.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider">{d.label}</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5 truncate">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
