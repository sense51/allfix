import { useState, useEffect } from 'react';
import { services as servicesApi, bookings as bookingsApi, reviews as reviewsApi } from '../api';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { CURRENCIES, formatPrice } from '../utils/currency';

const statusConfig = {
  pending:   { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  confirmed: { bg: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-500'  },
  completed: { bg: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  cancelled: { bg: 'bg-gray-50 text-gray-500 border-gray-200',    dot: 'bg-gray-400'  },
};

const categoryColor = {
  electric:   'bg-brand-50 text-brand-700',
  motorcycle: 'bg-rose-50 text-rose-700',
  car:        'bg-sky-50 text-sky-700',
  cleaning:   'bg-emerald-50 text-emerald-700',
  computer:   'bg-violet-50 text-violet-700',
  phone:      'bg-teal-50 text-teal-700',
};

/* ─── Animated stat counter ─────────────────────────────────── */
function StatCard({ stat, index }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = stat.value;
    if (target === 0) return;
    const steps = 16;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 800 / steps);
    return () => clearInterval(timer);
  }, [stat.value]);

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
      <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center text-white font-bold text-sm mb-3 shadow-sm`}>
        {stat.isRating ? stat.displayValue : count}
      </div>
      <p className="text-sm text-gray-500">{stat.label}</p>
    </div>
  );
}

/* ─── Read-only star row ─────────────────────────────────────── */
function Stars({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${sz} ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* ─── Rating bar used in summary ────────────────────────────── */
function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-right text-gray-500 font-medium">{star}</span>
      <svg className="w-3 h-3 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 text-gray-400">{count}</span>
    </div>
  );
}

/* ─── Reviews panel ─────────────────────────────────────────── */
function ReviewsPanel({ myReviews, loading }) {
  const total = myReviews.length;
  const avg = total > 0
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
    : null;

  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: myReviews.filter((r) => r.rating === s).length,
  }));

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-0.5 h-4 bg-yellow-400 rounded-full" />
        Reviews
        <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{total}</span>
      </h3>

      {loading ? (
        <div className="card p-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-14 rounded-xl" />
          ))}
        </div>
      ) : total === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No reviews yet. Complete jobs to earn ratings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Summary card */}
          <div className="card p-5 flex gap-5 items-center">
            {/* big avg */}
            <div className="text-center shrink-0 w-20">
              <div className="text-4xl font-black text-gray-900 leading-none">{avg}</div>
              <Stars rating={Math.round(Number(avg))} size="sm" />
              <p className="text-xs text-gray-400 mt-1">{total} review{total !== 1 ? 's' : ''}</p>
            </div>
            {/* distribution */}
            <div className="flex-1 space-y-1.5">
              {dist.map((d) => (
                <RatingBar key={d.star} star={d.star} count={d.count} total={total} />
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          {myReviews.map((r, i) => (
            <div key={r.id} className="card-hover p-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-3">
                {/* avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                  {r.customer_name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{r.customer_name}</span>
                      <span className="text-gray-300 mx-1.5">·</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[r.service_category] || 'bg-gray-50 text-gray-600'}`}>
                        {r.service_title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Stars + numeric */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <Stars rating={r.rating} size="sm" />
                    <span className="text-xs font-bold text-yellow-600">{r.rating}/5</span>
                  </div>

                  {r.comment && (
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      "{r.comment}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── OTP Verification Modal ─────────────────────────────────── */
function OtpModal({ booking, onClose, onVerified }) {
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter a 4-digit code');
      return;
    }
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
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        {/* header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">Verify Completion</h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{booking.title}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 mb-3">Enter Customer OTP</p>
            <input
              type="text"
              pattern="\d*"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="text-center text-3xl font-extrabold tracking-[0.5em] pl-[0.5em] w-36 py-3 border border-gray-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
              placeholder="0000"
              required
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">Ask the customer for the 4-digit code shown in their bookings list.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 !py-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || otp.length < 4}
              className="btn-primary flex-1 !py-3 disabled:opacity-50"
            >
              {submitting ? 'Verifying...' : 'Verify & Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function ProviderDashboard() {
  const [myServices, setMyServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myReviews,  setMyReviews]  = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [otpModal, setOtpModal] = useState(null); // booking obj

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: 'electric', title: '', description: '', price: '', currency: 'USD', duration_minutes: 60,
  });
  const [editId,   setEditId]   = useState(null);
  const [deleting, setDeleting] = useState(null);

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), duration_minutes: Number(form.duration_minutes) };
      if (editId) await servicesApi.update(editId, payload);
      else        await servicesApi.create(payload);
      setShowForm(false);
      setEditId(null);
      setForm({ category: 'electric', title: '', description: '', price: '', currency: 'USD', duration_minutes: 60 });
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (s) => {
    setForm({ category: s.category, title: s.title, description: s.description || '', price: s.price, currency: s.currency || 'USD', duration_minutes: s.duration_minutes });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    setDeleting(id);
    try { await servicesApi.delete(id); fetchData(); }
    catch (err) { alert('Delete failed: ' + err.message); }
    finally { setDeleting(null); }
  };

  const updateBookingStatus = async (id, status) => {
    try { await bookingsApi.updateStatus(id, status); fetchData(); }
    catch (err) { alert('Failed to update booking: ' + err.message); }
  };

  /* avg for stat card */
  const avgRating = myReviews.length > 0
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
    : '—';

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <SEO title="Provider Dashboard" description="Manage your services, bookings, and reviews on ALLFIX." noindex />
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1.5">Manage your services and bookings</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ category: 'electric', title: '', description: '', price: '', currency: 'USD', duration_minutes: 60 }); }}
          className={`btn-primary transition-all duration-200 ${showForm ? '!bg-gray-500 !bg-none' : ''}`}
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {/* Stat cards — 4 columns now */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Services',       value: myServices.length,                                                                        color: 'from-brand-500 to-brand-600' },
          { label: 'Active Bookings',value: myBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,       color: 'from-amber-500 to-orange-600' },
          { label: 'Completed',      value: myBookings.filter((b) => b.status === 'completed').length,                                color: 'from-green-500 to-emerald-600' },
          { label: 'Avg. Rating',    value: myReviews.length, isRating: true, displayValue: avgRating,                                color: 'from-yellow-400 to-amber-500' },
        ].map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </div>

      {/* Service form */}
      {showForm && (
        <div className="card p-6 mb-8 border-2 border-brand-100 animate-scale-in">
          <h3 className="font-semibold text-gray-900 mb-1">{editId ? 'Edit Service' : 'New Service'}</h3>
          <p className="text-sm text-gray-500 mb-5">{editId ? 'Update your service details' : 'List a new service for customers'}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                <input type="text" name="title" required value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. Electrical Wiring Repair" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} placeholder="Describe what this service includes..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price</label>
                <div className="flex gap-2">
                  <input type="number" name="price" required min="0" step="0.01" value={form.price} onChange={handleChange} className="input-field flex-1" placeholder="0.00" />
                  <select name="currency" value={form.currency} onChange={handleChange} className="input-field w-24 shrink-0">
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (minutes)</label>
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

      {/* Main grid: services | bookings */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Services */}
        <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-0.5 h-4 bg-brand-500 rounded-full" />
            Your Services
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{myServices.length}</span>
          </h3>
          {myServices.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No services yet. Click "Add Service" to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myServices.map((s, i) => (
                <div key={s.id} className="card-hover p-4" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge text-xs px-2 py-0.5 ${categoryColor[s.category] || 'bg-gray-50 text-gray-600'}`}>{s.category}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 truncate">{s.title}</h4>
                      <p className="text-sm text-gray-900 font-bold mt-0.5">
                        {formatPrice(s.price, s.currency)} <span className="text-gray-400 font-normal">/ {s.duration_minutes}min</span>
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button onClick={() => handleEdit(s)} className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">Edit</button>
                      <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings */}
        <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-0.5 h-4 bg-brand-500 rounded-full" />
            Bookings
            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{myBookings.length}</span>
          </h3>
          {myBookings.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myBookings.map((b, i) => {
                const sc = statusConfig[b.status] || statusConfig.pending;
                return (
                  <div key={b.id} className="card-hover p-4" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900">{b.title}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">{b.customer_name}</p>
                        <p className="text-sm text-gray-500">{new Date(b.scheduled_at).toLocaleString()}</p>
                        <span className={`badge mt-2 border ${sc.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5 animate-pulse-soft`} />
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 ml-4 shrink-0">
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">Confirm</button>
                            <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">Decline</button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => setOtpModal(b)} className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all">Complete</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reviews — full width below */}
      <ReviewsPanel myReviews={myReviews} loading={reviewsLoading} />

      {/* OTP Modal */}
      {otpModal && (
        <OtpModal
          booking={otpModal}
          onClose={() => setOtpModal(null)}
          onVerified={fetchData}
        />
      )}
    </Layout>
  );
}
