import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { getArticle } from '../data/blogData';

function renderContent(markdown) {
  return markdown.split('\n\n').map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-lg font-bold text-gray-100 mt-8 mb-3">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul key={i} className="space-y-1.5 my-3">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-gray-400 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span>{item.replace('- ', '')}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return (
        <p key={i} className="text-sm font-bold text-gray-100 mt-6 mb-2">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    }

    return (
      <p key={i} className="text-sm text-gray-400 leading-relaxed mb-3">
        {trimmed}
      </p>
    );
  });
}

export default function BlogDetail() {
  const { id } = useParams();
  const article = getArticle(id);

  if (!article) {
    return (
      <Layout>
        <div className="text-center py-20 animate-scale-in">
          <div className="w-16 h-16 bg-surface-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-200">Article not found</h1>
          <Link to="/blog" className="text-amber-400 hover:text-amber-300 font-semibold text-sm mt-2 inline-block transition-colors">
            &larr; Back to <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">Tips & Guides</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: 'ALLFIX' },
    datePublished: new Date(article.date).toISOString(),
    articleSection: article.category,
  };

  return (
    <Layout>
      <SEO
        title={article.title}
        description={article.excerpt}
        canonical={`https://sense51.github.io/allfix/blog/${article.id}`}
      />
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <div className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-amber-400 transition-colors mb-6 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span> Back to <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">Tips & Guides</span>
        </Link>

        <article className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {article.category}
            </span>
            <span className="text-xs text-gray-500">{article.readTime}</span>
            <span className="text-xs text-gray-500">{article.date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-100 leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-gray-400 text-sm mb-8 pb-6 border-b border-white/[0.06]">
            {article.excerpt}
          </p>

          <div>
            {renderContent(article.content)}
          </div>
        </article>

        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-sm text-gray-500 mb-4">Need professional help with this?</p>
          <Link
            to="/services"
            className="btn-primary inline-flex !px-6 !py-3 text-sm !rounded-full"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </Layout>
  );
}
