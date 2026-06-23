import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { services as servicesApi, bookings as bookingsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { formatPrice } from '../utils/currency';

const categoryConfig = {
  electric:  { label: 'Electrical',     gradient: 'from-brand-500 to-brand-600'   },
  motorcycle:{ label: 'Motorcycle',     gradient: 'from-rose-500 to-pink-600'    },
  car:       { label: 'Automotive',     gradient: 'from-sky-500 to-blue-600'     },
  cleaning:  { label: 'Cleaning',       gradient: 'from-emerald-500 to-green-600'},
  computer:  { label: 'Computer Repair',gradient: 'from-violet-500 to-purple-600'},
  phone:     { label: 'Phone Repair',   gradient: 'from-teal-500 to-cyan-600'   },
};

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    servicesApi
      .get(id)
      .then(setService)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await bookingsApi.create({
        service_id: Number(id),
        scheduled_at: bookingDate,
        notes: bookingNotes,
      });
      setMessageType('success');
      setMessage('Booking confirmed! Check your bookings page.');
      setBookingDate('');
      setBookingNotes('');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
            <div className="skeleton h-4 w-40" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Service not found</h3>
          <Link to="/services" className="text-brand-600 hover:text-brand-700 font-semibold text-sm mt-2 inline-block transition-colors">
            &larr; Browse services
          </Link>
        </div>
      </Layout>
    );
  }

  const cfg = categoryConfig[service.category] || categoryConfig.car;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: service.provider_name,
      address: service.location ? { '@type': 'PostalAddress', addressLocality: service.location } : undefined,
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.currency || 'USD',
    },
    category: service.category,
  };

  return (
    <Layout>
      <SEO
        title={service.title}
        description={`${service.title} — ${service.description?.slice(0, 150)}. Book ${service.provider_name} on ALLFIX.`}
        canonical={`https://sense51.github.io/allfix/services/${service.id}`}
      />
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/services" className="hover:text-brand-600 transition-colors">Services</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-medium">{service.title}</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6 animate-fade-in-up">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${cfg.gradient} text-white`}>
                  {cfg.label}
                </span>
                {service.avg_rating > 0 && (
                  <span className="flex items-center gap-1 text-sm text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {service.avg_rating}
                  </span>
                )}
              </div>

              <h1 className="text-xl font-bold text-gray-900">{service.title}</h1>
              <p className="text-gray-600 mt-3 leading-relaxed text-sm">{service.description}</p>

              <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Price</span>
                  <div className="text-2xl font-bold text-gray-900">{formatPrice(service.price, service.currency)}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium">Duration</span>
                  <div className="text-sm font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
                    ~{service.duration_minutes} min
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-0.5 h-3.5 bg-brand-500 rounded-full" />
                Service Provider
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  {service.provider_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{service.provider_name}</h4>
                  {service.location && (
                    <p className="text-sm text-gray-500 mt-0.5">{service.location}</p>
                  )}
                  {service.bio && (
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{service.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-0.5 h-4 bg-brand-500 rounded-full" />
                {user?.role === 'customer' ? 'Book This Service' : 'Want to book?'}
              </h3>

              {message && (
                <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
                  messageType === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Sign in to book this service.</p>
                  <Link to="/login" className="btn-primary w-full text-center !py-3 text-sm">Sign In</Link>
                  <Link to="/register" className="btn-secondary w-full text-center !py-3 text-sm">Create Account</Link>
                </div>
              ) : user.role === 'customer' ? (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="input-field"
                      rows={3}
                      placeholder="Describe the issue..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full !py-3">
                    Confirm Booking
                  </button>
                </form>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="font-medium text-gray-700 mb-1">You're a provider</p>
                  <p>Switch to a customer account to book services.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
