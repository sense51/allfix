import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import articles, { getCategories } from '../data/blogData';

const categories = ['All', ...getCategories()];

const categoryIcons = {
  Electrical: '⚡',
  Motorcycle: '🏍',
  Automotive: '🚗',
  'Home Cleaning': '🧹',
  'Computer Repair': '💻',
  'Phone Repair': '📱',
};

export default function Blog() {
  const [activeCat, setActiveCat] = useState('All');

  const filtered = activeCat === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCat);

  return (
    <Layout>
      <SEO
        title="Tips & Guides"
        description="Helpful home repair guides, troubleshooting tips, and maintenance advice from ALLFIX experts."
        canonical="https://sense51.github.io/allfix/blog"
      />
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">Tips & Guides</h1>
        <p className="text-gray-500 mt-1.5">Home repair advice and troubleshooting guides</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCat === cat
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No articles yet</h3>
          <p className="text-gray-500 text-sm mt-1">Check back soon for new guides.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article, i) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className="card-hover p-5 animate-fade-in-up group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full border border-brand-100/50">
                  {categoryIcons[article.category] || '📄'} {article.category}
                </span>
                <span className="text-xs text-gray-400">{article.readTime}</span>
              </div>
              <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{article.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                <span>{article.date}</span>
                <span className="text-brand-500 font-semibold ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
