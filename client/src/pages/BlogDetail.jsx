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
        <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '));
      return (
        <ul key={i} className="space-y-1.5 my-3">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <span>{item.replace('- ', '')}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return (
        <p key={i} className="text-sm font-bold text-gray-900 mt-6 mb-2">
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    }

    return (
      <p key={i} className="text-sm text-gray-600 leading-relaxed mb-3">
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
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Article not found</h1>
          <Link to="/blog" className="text-brand-600 hover:text-brand-700 font-semibold text-sm mt-2 inline-block transition-colors">
            &larr; Back to Tips & Guides
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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors mb-6"
        >
          &larr; Back to Tips & Guides
        </Link>

        <article className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100/50">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{article.readTime}</span>
            <span className="text-xs text-gray-400">{article.date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-gray-500 text-sm mb-8 pb-6 border-b border-gray-100">
            {article.excerpt}
          </p>

          <div className="prose prose-sm max-w-none">
            {renderContent(article.content)}
          </div>
        </article>

        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
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
