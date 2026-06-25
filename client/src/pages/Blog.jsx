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
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
          Tips & Guides
        </h1>
        <p className="text-gray-400 mt-2">Home repair advice and troubleshooting guides</p>
      </div>

      <div className="flex gap-2 mb-10 flex-wrap animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCat === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                : 'bg-surface-50 border border-white/[0.06] text-gray-400 hover:border-amber-500/20 hover:text-amber-300 hover:bg-amber-500/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 bg-surface-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-200">No articles yet</h3>
          <p className="text-gray-500 text-sm mt-1">Check back soon for new guides.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article, i) => (
            <Link
              key={article.id}
              to={`/blog/${article.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-50 p-5
                         animate-fade-in-up transition-all duration-500
                         hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(251,191,36,0.06) 0%, transparent 60%)' }}
              />
              <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

              <div className="relative flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                  {categoryIcons[article.category] || '📄'} {article.category}
                </span>
                <span className="text-xs text-gray-500">{article.readTime}</span>
              </div>
              <h2 className="relative font-semibold text-gray-100 mb-2 group-hover:text-amber-300 transition-colors duration-300">
                {article.title}
              </h2>
              <p className="relative text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{article.excerpt}</p>
              <div className="relative mt-4 flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-white/[0.06]">
                <span>{article.date}</span>
                <span className="text-amber-400 font-semibold ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
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
