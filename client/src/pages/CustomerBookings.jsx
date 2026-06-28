import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookings as bookingsApi, reviews as reviewsApi } from '../api';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { formatPrice } from '../utils/currency';

const statusConfig = {
  pending:   { cls: 'status-pending',   dot: '#f59e0b', label: 'Pending'   },
  confirmed: { cls: 'status-confirmed', dot: '#6366f1', label: 'Confirmed' },
  completed: { cls: 'status-completed', dot: '#10b981', label: 'Completed' },
  cancelled: { cls: 'status-cancelled', dot: '#6b7280', label: 'Cancelled' },
};

const statusOrder = ['pending', 'confirmed', 'completed'];

function Timeline({ status }) {
  if (status === 'cancelled') return null;
  const currentIdx = statusOrder.indexOf(status);
  return (
    <div className="flex items-center gap-1 my-2">
      {statusOrder.map((s, i) => {
        const reached = i <= currentIdx;
        return (
          <div key={s} className="flex items-center">
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: reached ? '#6366f1' : 'rgba(255,255,255,0.1)' }}
            />
            {i < statusOrder.length - 1 && (
              <div
                className="w-8 h-0.5 transition-colors duration-300"
                style={{ background: i < currentIdx ? '#6366f1' : 'rgba(255,255,255,0.08)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const active = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform duration-100 focus:outline-none`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg
            className={`${sizes[size]} transition-colors duration-100 ${star <= active ? 'text-amber-400' : 'text-slate-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ booking, onClose, onSubmitted }) {
  const [rating,     setRating]     = useState(0);
  const [comment,    setComment]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const labels = ['','Poor','Fair','Good','Very Good','Excellent'];

  const handleSubmit = async e => {
    e.preventDefault();
    if (!rating) { setError('Please select a rating'); return; }
    setError('');
    setSubmitting(true);
    try {
      const review = await reviewsApi.create({ booking_id: booking.id, rating, comment: comment.trim() || undefined });
      onSubmitted(booking.id, review);
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
        className="w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden animate-scale-in"
        style={{ background: 'rgba(16,16,26,0.98)', boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.08)' }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Rate Your Experience</h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{booking.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/[0.07] text-slate-500 transition-all ml-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-300 mb-3">How was the service?</p>
            <div className="flex justify-center mb-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <p className={`text-sm font-medium h-5 transition-all ${rating ? 'text-amber-400' : 'text-slate-700'}`}>
              {labels[rating]}
            </p>
          </div>

          {/* Provider chip */}
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
              {booking.provider_name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">{booking.provider_name}</p>
              <p className="text-xs text-slate-500 capitalize">{booking.category} service</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              Comments <span className="font-normal text-slate-600">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Share your experience…"
              maxLength={500}
            />
            <p className="text-xs text-slate-600 mt-1 text-right">{comment.length}/500</p>
          </div>

          {error && <div className="px-4 py-3 rounded-xl text-sm text-red-400 border border-red-900/30 bg-red-950/20">{error}</div>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 !py-3">Cancel</button>
            <button type="submit" disabled={submitting || !rating} className="btn-primary flex-1 !py-3">
              {submitting ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</span> : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomerBookings() {
  const [bookings,    setBookings]    = useState([]);
  const [cancelling,  setCancelling]  = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewMap,   setReviewMap]   = useState({});

  useEffect(() => {
    bookingsApi.list().then(setBookings).catch(console.error);
  }, []);

  useEffect(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    completed.forEach(b => {
      if (reviewMap[b.id] === undefined) {
        setReviewMap(prev => ({ ...prev, [b.id]: 'loading' }));
        reviewsApi.get(b.id)
          .then(r => setReviewMap(prev => ({ ...prev, [b.id]: r })))
          .catch(() => setReviewMap(prev => ({ ...prev, [b.id]: null })));
      }
    });
  }, [bookings]);

  const cancelBooking = async id => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      const updated = await bookingsApi.updateStatus(id, 'cancelled');
      setBookings(bookings.map(b => b.id === id ? { ...b, status: updated.status } : b));
    } catch (err) {
      alert('Cancel failed: ' + err.message);
    } finally {
      setCancelling(null);
    }
  };

  const handleReviewSubmitted = useCallback((bookingId, review) => {
    setReviewMap(prev => ({ ...prev, [bookingId]: review }));
  }, []);

  return (
    <Layout>
      <SEO title="My Bookings — ALLFIX" description="Track and manage your service bookings." noindex />

      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-black text-slate-100">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage your service bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-dashed border-white/[0.07] animate-scale-in"
          style={{ background: 'rgba(13,13,20,0.5)' }}>
          <div className="text-4xl mb-4 opacity-20">📅</div>
          <h3 className="text-lg font-bold text-slate-300">No bookings yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Browse services and book your first one!</p>
          <Link to="/services" className="btn-primary">Browse Services</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b, i) => {
            const sc = statusConfig[b.status] || statusConfig.pending;
            const isCancelling = cancelling === b.id;
            const existingReview = reviewMap[b.id];
            const isLoadingReview = existingReview === 'loading';
            const hasReview = existingReview && existingReview !== 'loading';
            const canReview = b.status === 'completed' && !isLoadingReview && !hasReview;

            return (
              <div
                key={b.id}
                className={`rounded-2xl p-5 border border-white/[0.06] transition-all duration-300 animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
                style={{
                  background: 'rgba(13,13,20,0.85)',
                  opacity: isCancelling ? 0.5 : 1,
                  transform: isCancelling ? 'scale(0.99)' : 'scale(1)',
                }}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-slate-100">{b.title}</h3>
                      <span className={sc.cls}>{sc.label}</span>
                    </div>

                    <Timeline status={b.status} />

                    {/* Meta info chips */}
                    <div className="flex flex-wrap gap-2 text-xs mt-3">
                      {[
                        b.provider_name,
                        new Date(b.scheduled_at).toLocaleDateString(),
                        new Date(b.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      ].map((val, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-slate-400 border border-white/[0.06]"
                          style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {val}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 font-black text-slate-100 text-lg">{formatPrice(b.price, b.currency)}</div>

                    {/* OTP badge for confirmed bookings */}
                    {b.status === 'confirmed' && b.otp && (
                      <div
                        className="mt-3 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-brand-500/20"
                        style={{ background: 'rgba(99,102,241,0.08)' }}
                      >
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wide">Completion OTP</span>
                        <span
                          className="font-mono text-base font-black text-white tracking-[0.3em] px-3 py-1 rounded-lg select-all"
                          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
                        >
                          {b.otp}
                        </span>
                        <span className="text-[11px] text-slate-500">Share with provider</span>
                      </div>
                    )}

                    {/* Existing review badge */}
                    {hasReview && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-400/20"
                        style={{ background: 'rgba(245,158,11,0.07)' }}>
                        <StarRating value={existingReview.rating} readonly size="sm" />
                        <span className="text-xs font-bold text-amber-400">{existingReview.rating}/5</span>
                        {existingReview.comment && (
                          <span className="text-xs text-slate-500 truncate max-w-[160px]">"{existingReview.comment}"</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        disabled={isCancelling}
                        className="btn-danger whitespace-nowrap"
                      >
                        {isCancelling ? 'Cancelling…' : 'Cancel'}
                      </button>
                    )}
                    {canReview && (
                      <button
                        onClick={() => setReviewModal(b)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                                   border border-amber-400/20 text-amber-400 hover:bg-amber-400/10 transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewModal && (
        <ReviewModal
          booking={reviewModal}
          onClose={() => setReviewModal(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </Layout>
  );
}
