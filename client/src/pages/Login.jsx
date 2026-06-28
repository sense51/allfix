import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import GoogleSignIn from '../components/GoogleSignIn';

export default function Login() {
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = useMemo(() => location.pathname.includes('provider') ? 'provider' : 'customer', [location.pathname]);
  const [mode, setMode] = useState('password');
  const [form, setForm] = useState({ email: '', password: '', phone: '', otp: '' });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const isProvider = role === 'provider';
  const label = isProvider ? 'Provider' : 'Customer';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate(isProvider ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(err.message);
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
    setVerifying(true);
    try {
      await verifyOtp(form.phone, form.otp);
      navigate(isProvider ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold mx-auto shadow-sm mb-4 ${isProvider ? 'bg-gradient-to-br from-brand-500 to-neon-orange' : 'bg-brand-500'}`}>
              {isProvider ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <path d="M9 9l2 2 4-4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              )}
            </div>
            <SEO title={`${label} Sign In`} description={`Sign in to your ALLFIX ${label.toLowerCase()} account.`} noindex />
            <h1 className="text-xl font-bold text-gray-900">{isProvider ? 'Provider Sign In' : 'Welcome back'}</h1>
            <p className="text-gray-500 text-sm mt-1">{isProvider ? 'Access your dashboard and manage bookings' : 'Sign in to your account'}</p>
          </div>

          <div className="card p-6">
            <div className="flex mb-5 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => { setMode('password'); setError(''); setOtpSent(false); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => { setMode('otp'); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === 'otp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                OTP
              </button>
            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                {error}
              </div>
            )}

            {mode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" className="btn-primary w-full !py-3">Sign In</button>
              </form>
            ) : !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full !py-3 disabled:opacity-50">
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">OTP Code</label>
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength={6}
                    value={form.otp}
                    onChange={handleChange}
                    className="input-field text-center text-xl tracking-widest font-bold"
                    placeholder="000000"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
                <button type="submit" disabled={verifying} className="btn-primary w-full !py-3 disabled:opacity-50">
                  {verifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : 'Verify OTP'}
                </button>
                <button type="button" onClick={() => { setOtpSent(false); setError(''); }} className="w-full text-sm text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                  &larr; Change phone number
                </button>
              </form>
            )}

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface-50 px-3 text-gray-500">or continue with</span>
              </div>
            </div>
            <GoogleSignIn label="signin" role={role} />
            <p className="mt-5 text-center text-sm text-gray-400">
              {isProvider ? "Don't have a provider account? " : "Don't have an account? "}
              <Link to="/register" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Create one
              </Link>
            </p>
            {!isProvider && (
              <p className="mt-2 text-center text-sm text-gray-400">
                Are you a provider?{' '}
                <Link to="/provider/login" className="text-brand-500 font-semibold hover:text-brand-400 transition-colors">
                  Sign in here
                </Link>
              </p>
            )}
            {isProvider && (
              <p className="mt-2 text-center text-sm text-gray-400">
                Are you a customer?{' '}
                <Link to="/customer/login" className="text-brand-500 font-semibold hover:text-brand-400 transition-colors">
                  Sign in here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
