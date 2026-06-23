import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { services as servicesApi } from '../api';
import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';

const categories = [
  { key: '', label: 'All Services' },
  { key: 'electric', label: 'Electrical' },
  { key: 'motorcycle', label: 'Motorcycle' },
  { key: 'car', label: 'Automotive' },
  { key: 'cleaning', label: 'Cleaning' },
  { key: 'computer', label: 'Computer Repair' },
  { key: 'phone', label: 'Phone Repair' },
];

function SkeletonCard() {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-5 w-12" />
      </div>
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
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
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    servicesApi
      .list(activeCategory || undefined)
      .then(setList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryClick = (key) => {
    const params = key ? { category: key } : {};
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="mb-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900">Browse Services</h2>
        <p className="text-gray-500 mt-1.5">
          {activeCategory
            ? `Showing ${categories.find((c) => c.key === activeCategory)?.label || ''} services`
            : 'Find the perfect professional for your needs'}
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No services found</h3>
          <p className="text-gray-500 text-sm mt-1">
            {activeCategory
              ? 'No services in this category yet. Check back soon!'
              : 'No services available at the moment.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            <span className="font-medium text-gray-600">{list.length}</span> service{list.length !== 1 && 's'} found
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
