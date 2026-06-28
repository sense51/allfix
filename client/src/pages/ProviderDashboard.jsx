import { useState, useEffect } from 'react';
import { services as servicesApi, bookings as bookingsApi, reviews as reviewsApi } from '../api';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import AnimatedCounter from '../components/AnimatedCounter';
import { CURRENCIES, formatPrice } from '../utils/currency';

const categoryConfig = {
  electric:   { label: 'Electrical',     accent: '#818cf8' },
  motorcycle: { label: 'Motorcycle',     accent: '#f43f5e' },
  car:        { label: 'Automotive',     accent: '#22d3ee' },
  cleaning:   { label: 'Cleaning',       accent: '#34d399' },
  computer:   { label: 'Computer Repair',accent: '#a78bfa' },
  phone:      { label: 'Phone Repair',   accent: '#2dd4bf' },
};

const statusConfig = {
  pending:   { cls: 'status-pending',   dot: '#f59e0b', label: 'Pending'   },
  confirmed: { cls: 'status-confirmed', dot: '#6366f1', label: 'Confirmed' },
  completed: { cls: 'status-completed', dot: '#10b981', label: 'Completed' },
  cancelled: { cls: 'status-cancelled', dot: '#6b7280', label: 'Cancelled' },
};

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* ── OTP Modal ── */
function OtpModal({ booking, onClose, onVerified }) {
  const [otp, setOtp]             = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await bookingsApi.updateStatus(booking.id, 'completed', otp);
      onVerified();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in border border-white/[0.08]"
        style={{ background: 'rgba(16,16,26,0.98)', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.1)' }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Verify Completion</h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{booking.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.07] text-slate-500 transition-all ml-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-300 mb-3">Enter Customer OTP</p>
            <input
              type="text"
              pattern="\d*"
              maxLength={4}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              className="input-field text-center text-3xl font-extrabold tracking-[0.5em] pl-[0.5em] !py-4"
              placeholder="0000"
              required
              autoFocus
            />
            <p className="text-xs text-slate-600 mt-2">Ask the customer for their 4-digit OTP code.</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm text-red-400 border border-red-900/30 bg-red-950/20">{error}</div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 !py-3">Cancel</button>
            <button
              type="submit"
              disabled={submitting || otp.length < 4}
              className="btn-primary flex-1 !py-3"
            >
              {submitting ? 'Verifying…' : 'Complete Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function ProviderDashboard() {
  const [myServices, setMyServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myReviews,  setMyReviews]  = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [otpModal, setOtpModal]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm] = useState({
    category: 'electric', title: '', description: '', price: '', currency: 'USD', duration_minutes: 60,
  });
  const [editId,   setEditId]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab]           = useState('services');

  const fetchData = () => {
    servicesApi.my().then(setMyServices).catch(console.error);
    bookingsApi.list().then(setMyBookings).catch(console.error);
    setReviewsLoading(true);
    reviewsApi.forProvider()
      .then(setMyReviews)
      .catch(console.error)
      .finally(() => setReviewsLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), duration_minutes: Number(form.duration_minutes) };
      if (editId) await servicesApi.update(editId, payload);
      else        await servicesApi.create(payload);
      setShowForm(false); setEditId(null);
      setForm({ category: 'electric', title: '', description: '', price: '', currency: 'USD', duration_minutes: 60 });
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = s => {
    setForm({ category: s.category, title: s.title, description: s.description || '', price: s.price, currency: s.currency || 'USD', duration_minutes: s.duration_minutes });
    setEditId(s.id); setShowForm(true); setTab('services');
  };

  const handleDelete = async id => {
    if (!confirm('Delete this service?')) return;
    setDeleting(id);
    try { await servicesApi.delete(id); fetchData(); }
    catch (err) { alert('Delete failed: ' + err.message); }
    finally { setDeleting(null); }
  };

  const updateBookingStatus = async (id, status) => {
    try { await bookingsApi.updateStatus(id, status); fetchData(); }
    catch (err) { alert('Failed: ' + err.message); }
  };

  const avgRating = myReviews.length > 0
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length)
    : 0;

  const stats = [
    { label: 'Services',       value: myServices.length,                                                              accent: '#6366f1', icon: '◈' },
    { label: 'Active',         value: myBookings.filter(b => ['pending','confirmed'].includes(b.status)).length,      accent: '#f59e0b', icon: '⏳' },
    { label: 'Completed',      value: myBookings.filter(b => b.status === 'completed').length,                        accent: '#10b981', icon: '✓'  },
    { label: 'Avg. Rating',    value: parseFloat(avgRating.toFixed(1)), decimals: 1, suffix: '', accent: '#f59e0b',   icon: '★'  },
  ];

  const TABS = ['services', 'bookings', 'reviews'];

  return (
    <Layout>
      <SEO title="Provider Dashboard — ALLFIX" description="Manage your services, bookings, and reviews." noindex />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black text-slate-100">Provider Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage services, bookings, and reviews</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ category: 'electric', title: '', description: '', price: '', currency: 'USD', duration_minutes: 60 }); setTab('services'); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`rounded-2xl p-5 border border-white/[0.06] animate-fade-in-up stagger-${i + 1}`}
            style={{ background: 'rgba(13,13,20,0.8)', boxShadow: `0 0 20px ${s.accent}0a` }}
          >
            <div className="text-2xl font-black mb-1" style={{ color: s.accent }}>
              <AnimatedCounter target={s.value} decimals={s.decimals || 0} duration={1200} />
            </div>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Service form ── */}
      {showForm && (
        <div
          className="rounded-2xl p-6 mb-8 border border-brand-500/20 animate-scale-in"
          style={{ background: 'rgba(13,13,20,0.9)', boxShadow: '0 0 30px rgba(99,102,241,0.08)' }}
        >
          <h3 className="font-bold text-slate-100 mb-1">{editId ? 'Edit Service' : 'New Service'}</h3>
          <p className="text-sm text-slate-500 mb-5">{editId ? 'Update your service details' : 'List a new service for customers to book'}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  <option value="electric">Electrical</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Automotive</option>
                  <option value="cleaning">Home Cleaning</option>
                  <option value="computer">Computer Repair</option>
                  <option value="phone">Phone Repair</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Title</label>
                <input type="text" name="title" required value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. Electrical Wiring Repair" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} placeholder="Describe what this service includes…" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Price</label>
                <div className="flex gap-2">
                  <input type="number" name="price" required min="0" step="0.01" value={form.price} onChange={handleChange} className="input-field flex-1" placeholder="0.00" />
                  <select name="currency" value={form.currency} onChange={handleChange} className="input-field w-24 shrink-0">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Duration (minutes)</label>
                <input type="number" name="duration_minutes" min="15" value={form.duration_minutes} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editId ? 'Update Service' : 'Create Service'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-6 border-b border-white/[0.06] pb-0">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-200 rounded-t-lg border-b-2 ${
              tab === t
                ? 'text-brand-300 border-brand-500 bg-brand-500/5'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            {t}
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
              {t === 'services' ? myServices.length : t === 'bookings' ? myBookings.length : myReviews.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Services tab ── */}
      {tab === 'services' && (
        <div className="space-y-3 animate-fade-in">
          {myServices.length === 0 ? (
            <EmptyState icon="◈" text='No services yet. Click "+ Add Service" to get started.' />
          ) : myServices.map((s, i) => {
            const cfg = categoryConfig[s.category] || categoryConfig.electric;
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between gap-4 p-4 rounded-2xl border border-white/[0.06] animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
                style={{ background: 'rgba(13,13,20,0.8)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.accent}18`, border: `1px solid ${cfg.accent}30` }}>
                    <span className="text-base" style={{ color: cfg.accent }}>◈</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono font-bold" style={{ color: cfg.accent }}>{cfg.label}</span>
                    <h4 className="font-bold text-slate-100 truncate text-sm">{s.title}</h4>
                    <p className="text-xs text-slate-500">{formatPrice(s.price, s.currency)} / {s.duration_minutes}min</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(s)} className="btn-ghost !py-1.5 !px-3 !text-xs text-brand-400">Edit</button>
                  <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id} className="btn-danger !py-1.5 !px-3 !text-xs">
                    {deleting === s.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bookings tab ── */}
      {tab === 'bookings' && (
        <div className="space-y-3 animate-fade-in">
          {myBookings.length === 0 ? (
            <EmptyState icon="📅" text="No bookings yet. Bookings will appear here once customers book your services." />
          ) : myBookings.map((b, i) => {
            const sc = statusConfig[b.status] || statusConfig.pending;
            return (
              <div
                key={b.id}
                className={`flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/[0.06] animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
                style={{ background: 'rgba(13,13,20,0.8)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={sc.cls}>{sc.label}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{b.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{b.customer_name} · {new Date(b.scheduled_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="btn-primary !py-1.5 !px-3 !text-xs">Confirm</button>
                      <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="btn-danger !py-1.5 !px-3 !text-xs">Decline</button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => setOtpModal(b)} className="btn-secondary !py-1.5 !px-3 !text-xs text-emerald-400 border-emerald-500/30">Complete</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reviews tab ── */}
      {tab === 'reviews' && (
        <div className="space-y-3 animate-fade-in">
          {reviewsLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
          ) : myReviews.length === 0 ? (
            <EmptyState icon="★" text="No reviews yet. Complete jobs to earn ratings from customers." />
          ) : myReviews.map((r, i) => (
            <div
              key={r.id}
              className={`p-4 rounded-2xl border border-white/[0.06] animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
              style={{ background: 'rgba(13,13,20,0.8)' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {r.customer_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-100 text-sm">{r.customer_name}</span>
                      <span className="text-slate-700 mx-1.5">·</span>
                      <span className="text-xs text-slate-500">{r.service_title}</span>
                    </div>
                    <span className="text-xs text-slate-600">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Stars rating={r.rating} />
                    <span className="text-xs font-bold text-amber-400">{r.rating}/5</span>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed border-l-2 border-white/[0.08] pl-3">
                      "{r.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTP Modal */}
      {otpModal && (
        <OtpModal booking={otpModal} onClose={() => setOtpModal(null)} onVerified={fetchData} />
      )}
    </Layout>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-16 rounded-2xl border border-dashed border-white/[0.07]" style={{ background: 'rgba(13,13,20,0.5)' }}>
      <div className="text-3xl mb-3 opacity-30">{icon}</div>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">{text}</p>
    </div>
  );
}
