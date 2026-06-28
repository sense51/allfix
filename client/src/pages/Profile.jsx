import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const detailIcons = {
  'Full Name': (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  'Email': (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  'Role': (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  'Phone': (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  'Location': (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  'Member since': (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Please login</h3>
        </div>
      </Layout>
    );
  }

  const details = [
    { label: 'Full Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role === 'provider' ? 'Service Provider' : 'Customer' },
    { label: 'Phone', value: user.phone || '-' },
    { label: 'Location', value: user.location || '-' },
    { label: 'Member since', value: user.created_at ? new Date(user.created_at).toLocaleDateString() : '-' },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <SEO title={user.name} description={`${user.name} — ${user.role === 'provider' ? 'Service Provider' : 'Customer'} on ALLFIX.`} noindex />

        {/* ── Profile Header ─────────────────────────────── */}
        <div className="relative mb-8 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent rounded-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-50 p-8 text-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
            <div className="relative inline-block mb-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-neon-orange flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-brand-500/25 ring-2 ring-brand-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-[3px] border-surface-50 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-100 tracking-tight">{user.name}</h1>
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
              {user.role === 'provider' ? 'Service Provider' : 'Customer'}
            </span>
          </div>
        </div>

        {/* ── Account Details ────────────────────────────── */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/10 via-neon-orange/5 to-brand-500/10 rounded-3xl blur-xl opacity-60" />
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-surface-50 shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-neon-orange flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-100">Account Details</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Your personal information</p>
                </div>
              </div>
            </div>

            {/* Details rows */}
            <div className="px-6 py-2">
              {details.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3.5 border-b border-white/[0.04] last:border-b-0 group hover:bg-white/[0.02] -mx-6 px-6 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0 group-hover:bg-brand-500/15 group-hover:scale-105 transition-all duration-200">
                    {detailIcons[d.label]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{d.label}</p>
                    <p className="text-sm font-semibold text-gray-200 mt-0.5 truncate">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
