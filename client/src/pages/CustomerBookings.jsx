import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookings as bookingsApi, reviews as reviewsApi } from '../api';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { formatPrice } from '../utils/currency';

const statusConfig = {
  pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Pending' },
  confirmed: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'Confirmed' },
  completed: { bg: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', label: 'Completed' },
  cancelled: { bg: 'bg-gray-50 text-gray-500 border-gray-200', dot: 'bg-gray-400', label: 'Cancelled' },
};

const statusOrder = ['pending', 'confirmed', 'completed'];

function Timeline({ status }) {
  if (status === 'cancelled') return null;
  return (
    <div className="flex items-center gap-1">
      {statusOrder.map((s, i) => {
        const currentIdx = statusOrder.indexOf(status);
        const isReached = i <= currentIdx;
        const isLast = i === statusOrder.length - 1;
        return (
          <div key={s} className="flex items-center">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isReached ? 'bg-brand-500' : 'bg-gray-200'
            }`} />
            {!isLast && (
              <div className={`w-6 h-0.5 transition-colors duration-300 ${i < currentIdx ? 'bg-brand-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Star selector ─────────────────────────────────────────── */
function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const active = hovered || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform duration-100 focus:outline-none`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg
            className={`${sizes[size]} transition-colors duration-100 ${
              star <= active ? 'text-yellow-400' : 'text-gray-200'
            }`}
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

/* ── Review Modal ──────────────────────────────────────────── */
function ReviewModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating'); return; }
    setError('');
    setSubmitting(true);
    try {
      const review = await reviewsApi.create({
        booking_id: booking.id,
        rating,
        comment: comment.trim() || undefined,
      });
      onSubmitted(booking.id, review);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* backdrop */
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
              <h3 className="font-bold text-gray-900 text-lg leading-tight">Rate Your Experience</h3>
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
          {/* star picker */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 mb-3">How was the service?</p>
            <div className="flex justify-center mb-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <p className={`text-sm font-medium h-5 transition-all duration-200 ${rating ? 'text-yellow-600' : 'text-gray-300'}`}>
              {ratingLabels[rating]}
            </p>
          </div>

          {/* provider chip */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
              {booking.provider_name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{booking.provider_name}</p>
              <p className="text-xs text-gray-400 capitalize">{booking.category} service</p>
            </div>
          </div>

          {/* comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Comments <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Share your experience with others…"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
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
              disabled={submitting || rating === 0}
              className="btn-primary flex-1 !py-3 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Existing review badge ─────────────────────────────────── */
function ReviewBadge({ review }) {
  return (
    <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
      <StarRating value={review.rating} readonly size="sm" />
      <span className="text-xs font-semibold text-yellow-700">{review.rating}/5</span>
      {review.comment && (
        <span className="text-xs text-gray-500 truncate max-w-[180px]">"{review.comment}"</span>
      )}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [cancelling, setCancelling] = useState(null);
  const [reviewModal, setReviewModal] = useState(null); // booking obj
  // map of bookingId → review obj (null = checked, no review; undefined = not yet fetched)
  const [reviewMap, setReviewMap] = useState({});

  useEffect(() => {
    bookingsApi.list().then(setBookings).catch(console.error);
  }, []);

  // Fetch reviews for completed bookings lazily after list loads
  useEffect(() => {
    const completed = bookings.filter((b) => b.status === 'completed');
    completed.forEach((b) => {
      if (reviewMap[b.id] === undefined) {
        // mark as fetching
        setReviewMap((prev) => ({ ...prev, [b.id]: 'loading' }));
        reviewsApi
          .get(b.id)
          .then((r) => setReviewMap((prev) => ({ ...prev, [b.id]: r })))
          .catch(() => setReviewMap((prev) => ({ ...prev, [b.id]: null })));
      }
    });
  }, [bookings]);

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      const updated = await bookingsApi.updateStatus(id, 'cancelled');
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: updated.status } : b)));
    } catch (err) {
      alert('Cancel failed: ' + err.message);
    } finally {
      setCancelling(null);
    }
  };

  const handleReviewSubmitted = useCallback((bookingId, review) => {
    setReviewMap((prev) => ({ ...prev, [bookingId]: review }));
  }, []);

  return (
    <Layout>
      <div className="mb-8 animate-fade-in-up">
        <SEO title="My Bookings" description="Track and manage your service bookings on ALLFIX." noindex />
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1.5">Track and manage your service bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card p-12 text-center animate-scale-in">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No bookings yet</h3>
          <p className="text-gray-500 text-sm mt-1 mb-5">Browse services and book your first one!</p>
          <Link to="/services" className="btn-primary">Browse Services</Link>
        </div>
      ) : (
        <div className="space-y-3">
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
                className={`card-hover p-5 animate-fade-in-up ${isCancelling ? 'opacity-50 scale-[0.98]' : ''}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{b.title}</h3>
                      <span className={`badge border ${sc.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5 animate-pulse-soft`} />
                        {sc.label}
                      </span>
                    </div>

                    <Timeline status={b.status} />
                    {b.status === 'cancelled' && (
                      <span className="text-xs text-gray-400 mt-1 inline-block">Booking cancelled</span>
                    )}

                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-gray-500 mt-3">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg">
                        {b.provider_name}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg">
                        {new Date(b.scheduled_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg">
                        {new Date(b.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="mt-3 font-bold text-gray-900">{formatPrice(b.price, b.currency)}</div>

                    {/* OTP completion badge */}
                    {b.status === 'confirmed' && b.otp && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-brand-50 border border-brand-100/50 rounded-xl px-4 py-2.5">
                        <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Completion OTP:</span>
                        <span className="text-sm font-extrabold text-brand-900 tracking-widest bg-white border border-brand-200/50 px-2.5 py-0.5 rounded-lg select-all">
                          {b.otp}
                        </span>
                        <span className="text-[11px] text-gray-500 font-normal ml-1">Share this OTP with the provider to complete the job.</span>
                      </div>
                    )}

                    {/* Review section */}
                    {hasReview && <ReviewBadge review={existingReview} />}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        disabled={isCancelling}
                        className="btn-danger text-sm whitespace-nowrap disabled:opacity-50"
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}

                    {canReview && (
                      <button
                        onClick={() => setReviewModal(b)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                          bg-yellow-50 text-yellow-700 border border-yellow-200
                          hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-200
                          whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Leave a Review
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
