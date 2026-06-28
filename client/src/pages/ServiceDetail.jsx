import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { services as servicesApi, bookings as bookingsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { formatPrice } from '../utils/currency';

const categoryConfig = {
  electric:   { label: 'Electrical',     accent: '#818cf8', glow: 'rgba(129,140,248,0.15)' },
  motorcycle: { label: 'Motorcycle',     accent: '#f43f5e', glow: 'rgba(244,63,94,0.15)'   },
  car:        { label: 'Automotive',     accent: '#22d3ee', glow: 'rgba(34,211,238,0.15)'  },
  cleaning:   { label: 'Cleaning',       accent: '#34d399', glow: 'rgba(52,211,153,0.15)'  },
  computer:   { label: 'Computer Repair',accent: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
  phone:      { label: 'Phone Repair',   accent: '#2dd4bf', glow: 'rgba(45,212,191,0.15)'  },
};

export default function ServiceDetail() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [service,      setService]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [bookingDate,  setBookingDate]  = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [message,      setMessage]      = useState('');
  const [msgType,      setMsgType]      = useState('success');
  const [booking,      setBooking]      = useState(false);

  useEffect(() => {
    servicesApi.get(id)
      .then(setService)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/customer/login');
    setBooking(true);
    try {
      await bookingsApi.create({ service_id: Number(id), scheduled_at: bookingDate, notes: bookingNotes });
      setMsgType('success');
      setMessage('Booking confirmed! Check your bookings page.');
      setBookingDate('');
      setBookingNotes('');
    } catch (err) {
      setMsgType('error');
      setMessage(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-brand-500 rounded-full animate-spin" />
          <div className="skeleton h-4 w-40" />
        </div>
      </div>
    </Layout>
  );

  if (!service) return (
    <Layout>
      <div className="text-center py-24 animate-scale-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.07]"
          style={{ background: 'rgba(13,13,20,0.8)' }}>
          <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-300 mb-2">Service not found</h3>
        <Link to="/services" className="text-brand-400 hover:text-brand-300 font-semibold text-sm transition-colors">
          ← Browse all services
        </Link>
      </div>
    </Layout>
  );

  const cfg = categoryConfig[service.category] || categoryConfig.car;
  const minDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <Layout>
      <SEO
        title={`${service.title} — ALLFIX`}
        description={service.description || `Book ${service.title} by ${service.provider_name}. ${formatPrice(service.price, service.currency)} / ${service.duration_minutes} min.`}
      />

      {/* Back */}
      <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors animate-fade-in">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 12L6 8l4-4" />
        </svg>
        All services
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Main info ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero card */}
          <div
            className="relative overflow-hidden rounded-3xl p-8 border border-white/[0.07] animate-fade-in-up"
            style={{
              background: 'rgba(13,13,20,0.9)',
              boxShadow: `0 0 60px ${cfg.glow}, 0 30px 60px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Glow orb */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${cfg.glow}, transparent 70%)`,
                transform: 'translate(20%, -20%)',
              }}
            />

            <div className="relative z-10">
              {/* Category + rating */}
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="badge text-[11px]"
                  style={{ background: `${cfg.accent}14`, color: cfg.accent, border: `1px solid ${cfg.accent}30` }}
                >
                  {cfg.label}
                </span>
                {service.avg_rating > 0 && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {Number(service.avg_rating).toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-slate-100 mb-3">{service.title}</h1>
              {service.description && (
                <p className="text-slate-400 leading-relaxed">{service.description}</p>
              )}

              {/* Price + duration row */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/[0.06]">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Price</p>
                  <p className="text-2xl font-black text-slate-100">{formatPrice(service.price, service.currency)}</p>
                </div>
                <div className="w-px h-10 bg-white/[0.07]" />
                <div>
                  <p className="text-xs text-slate-600 mb-1">Duration</p>
                  <p className="text-2xl font-black text-slate-100">{service.duration_minutes}m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Provider info */}
          <div
            className="rounded-2xl p-6 border border-white/[0.07] animate-fade-in-up"
            style={{ background: 'rgba(13,13,20,0.8)', animationDelay: '80ms' }}
          >
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">About the provider</h2>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                style={{ background: cfg.accent }}
              >
                {service.provider_name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-100">{service.provider_name}</p>
                {service.location && <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 flex-shrink-0" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-4-4-4z" />
                    <circle cx="8" cy="5.5" r="1.5" />
                  </svg>
                  {service.location}
                </p>}
                {service.phone && <p className="text-sm text-slate-500 mt-0.5">{service.phone}</p>}
              </div>
            </div>
            {service.bio && (
              <p className="text-sm text-slate-500 mt-4 leading-relaxed border-t border-white/[0.06] pt-4">{service.bio}</p>
            )}
          </div>
        </div>

        {/* ── Booking panel ── */}
        <div className="lg:col-span-1">
          <div
            className="sticky top-24 rounded-2xl p-6 border border-white/[0.08] animate-fade-in-up"
            style={{
              background: 'rgba(16,16,26,0.95)',
              boxShadow: `0 30px 60px rgba(0,0,0,0.4), 0 0 40px ${cfg.glow}`,
              animationDelay: '120ms',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: cfg.accent }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Book This Service</span>
            </div>

            <div className="text-3xl font-black text-slate-100 mb-1">{formatPrice(service.price, service.currency)}</div>
            <p className="text-xs text-slate-500 mb-6">{service.duration_minutes} minute session</p>

            {/* Message */}
            {message && (
              <div
                className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                  msgType === 'success'
                    ? 'text-emerald-400 border-emerald-900/30 bg-emerald-950/20'
                    : 'text-red-400 border-red-900/30 bg-red-950/20'
                }`}
              >
                {message}
              </div>
            )}

            {user?.role === 'customer' ? (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    min={minDate}
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Notes (optional)</label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={e => setBookingNotes(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Describe the issue or any special instructions…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={booking}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${cfg.accent}, #6366f1)`,
                    boxShadow: `0 0 24px ${cfg.glow}`,
                    opacity: booking ? 0.6 : 1,
                  }}
                >
                  {booking ? 'Booking…' : 'Confirm Booking'}
                </button>
              </form>
            ) : user?.role === 'provider' ? (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500">Providers cannot book services.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to="/customer/login" className="block w-full text-center py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: `linear-gradient(135deg, ${cfg.accent}, #6366f1)` }}>
                  Sign in to book
                </Link>
                <Link to="/register" className="block w-full text-center btn-secondary !py-3">Create free account</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
