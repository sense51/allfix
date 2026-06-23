import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

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
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <SEO title={user.name} description={`${user.name} — ${user.role === 'provider' ? 'Service Provider' : 'Customer'} on ALLFIX.`} noindex />
          <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 text-sm capitalize">{user.role}</p>
        </div>

        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-0.5 h-4 bg-brand-500 rounded-full" />
            Account Details
          </h3>
          <div className="space-y-0 divide-y divide-gray-100">
            {details.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">{d.label}</span>
                <span className="text-sm font-medium text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
