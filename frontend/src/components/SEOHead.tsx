/**
 * SEOHead — per-page meta tags (title, description, canonical, OG, Twitter)
 * and optional JSON-LD SoftwareApplication schema for tool pages.
 *
 * SPA pages share index.html, so unique <title> / <meta> per page must be
 * injected via Helmet so Googlebot, link-preview crawlers, and AI bots
 * all see correct per-URL signal.
 */

import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://translationforfree.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/placeholder.svg`;

export interface SEOHeadProps {
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/shift-subtitles". Use "/" for the home page. */
  path: string;
  ogImage?: string;
  /** When provided, also emit JSON-LD SoftwareApplication schema for this tool. */
  toolSchema?: {
    name: string;
    description: string;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, path, ogImage, toolSchema }) => {
  const canonical = `${SITE_URL}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  const schema = toolSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: toolSchema.name,
        description: toolSchema.description,
        url: canonical,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
