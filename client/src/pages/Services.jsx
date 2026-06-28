import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { services as servicesApi } from '../api';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import SEO from '../components/SEO';

const categories = [
  { key: '',           label: 'All',           accent: '#6366f1' },
  { key: 'electric',   label: 'Electrical',    accent: '#818cf8' },
  { key: 'motorcycle', label: 'Motorcycle',    accent: '#f43f5e' },
  { key: 'car',        label: 'Automotive',    accent: '#22d3ee' },
  { key: 'cleaning',   label: 'Cleaning',      accent: '#34d399' },
  { key: 'computer',   label: 'Computer',      accent: '#a78bfa' },
  { key: 'phone',      label: 'Phone Repair',  accent: '#2dd4bf' },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 border border-white/[0.06] animate-fade-in" style={{ background: 'rgba(13,13,20,0.8)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-5 w-10 rounded-full" />
      </div>
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton h-7 w-7 rounded-lg" />
          <div className="skeleton h-4 w-20" />
        </div>
        <div className="skeleton h-5 w-16" />
      </div>
    </div>
  );
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = searchParams.get('category') || '';
  const activeCfg = categories.find(c => c.key === activeCategory) || categories[0];

  useEffect(() => {
    setLoading(true);
    servicesApi
      .list(activeCategory || undefined)
      .then(setList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryClick = (key) => {
    setSearchParams(key ? { category: key } : {});
  };

  return (
    <Layout>
      <SEO
        title={activeCategory
          ? `${categories.find(c => c.key === activeCategory)?.label || ''} Services — ALLFIX`
          : 'Browse Services — ALLFIX'}
        description="Browse electrical, automotive, cleaning, computer & phone repair services. Book trusted professionals instantly."
      />

      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-black text-slate-100 mb-2">Browse Services</h1>
        <p className="text-slate-500">
          {activeCategory
            ? `Showing ${activeCfg.label} services — ${list.length} available`
            : `Find the right professional for any job`}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 mb-8 flex-wrap animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              id={`filter-${cat.key || 'all'}`}
              onClick={() => handleCategoryClick(cat.key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: isActive ? `${cat.accent}20` : 'rgba(255,255,255,0.04)',
                color: isActive ? cat.accent : '#64748b',
                border: `1px solid ${isActive ? `${cat.accent}40` : 'rgba(255,255,255,0.07)'}`,
                boxShadow: isActive ? `0 0 12px ${cat.accent}25` : 'none',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-24 animate-scale-in">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.07]"
            style={{ background: 'rgba(13,13,20,0.8)' }}
          >
            <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-300 mb-1">No services found</h3>
          <p className="text-slate-600 text-sm">
            {activeCategory ? 'No services in this category yet.' : 'No services available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}
    </Layout>
  );
}
