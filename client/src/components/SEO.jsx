import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'ALLFIX';
const SITE_URL = 'https://sense51.github.io/allfix';
const DEFAULT_DESC = 'Find trusted professionals for electrical, automotive, cleaning, computer & phone repair. Book in seconds.';
const DEFAULT_OG_IMAGE = ''; // add path to og-image.png when you have one

export default function SEO({
  title,
  description = DEFAULT_DESC,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonical,
  noindex = false,
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Home Services Marketplace`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={ogTitle || pageTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || pageTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
}
