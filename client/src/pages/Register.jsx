import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import GoogleSignIn from '../components/GoogleSignIn';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    role:     'customer',
    phone:    '',
    location: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'provider' ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isProvider = form.role === 'provider';
  const accent     = isProvider ? '#f43f5e' : '#6366f1';
  const accentB    = isProvider ? '#f97316' : '#22d3ee';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative" style={{ background: '#050508' }}>
      <SEO title="Create Account — ALLFIX" description="Join ALLFIX as a customer or service provider. Sign up free." noindex />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${accent}07, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-100">Create your account</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Join the ALLFIX community — it's free.</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7 border border-white/[0.07]"
          style={{ background: 'rgba(13,13,20,0.88)', boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)' }}
        >
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-900/30 bg-red-950/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'customer', label: 'Customer', desc: 'Book services' },
                  { val: 'provider', label: 'Provider', desc: 'Offer services' },
                ].map(({ val, label, desc }) => (
                  <label
                    key={val}
                    className="flex flex-col items-center justify-center gap-1 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: form.role === val ? accent : 'rgba(255,255,255,0.07)',
                      background:  form.role === val ? `${accent}12` : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <input type="radio" name="role" value={val} checked={form.role === val} onChange={handleChange} className="sr-only" />
                    <span className="font-bold text-sm" style={{ color: form.role === val ? accent : '#94a3b8' }}>{label}</span>
                    <span className="text-[11px] text-slate-600">{desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name + email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Full Name</label>
                <input type="text" name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Email</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Password</label>
              <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} className="input-field" placeholder="At least 6 characters" />
            </div>

            {/* Phone + location */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+1 555 000 0000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="City or area" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2"
              style={{
                background:  `linear-gradient(135deg, ${accent}, ${accentB})`,
                boxShadow:   `0 0 24px ${accent}30`,
                opacity:     loading ? 0.6 : 1,
                cursor:      loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-600">or sign up with</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <GoogleSignIn label="signup" role={form.role} />

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to={form.role === 'provider' ? '/provider/login' : '/customer/login'}
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: accent }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
