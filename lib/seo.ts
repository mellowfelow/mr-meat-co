import type { Metadata } from 'next';
import { SITE } from '@/config/site';

/**
 * Adds page-specific openGraph + twitter blocks to a route's metadata. Without
 * them a route inherits the root layout's homepage og:title / og:description /
 * og:url, so social previews and og:url all point at the homepage.
 */
export function withOpenGraph(meta: Metadata, path: string): Metadata {
  const t = meta.title;
  const title =
    typeof t === 'string'
      ? t.includes(SITE.name)
        ? t
        : `${t} | ${SITE.name}`
      : t && typeof t === 'object' && 'absolute' in t && t.absolute
      ? t.absolute
      : SITE.name;
  const description = typeof meta.description === 'string' ? meta.description : SITE.tagline;
  const image = { url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name };
  return {
    ...meta,
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: 'en_AU',
      title,
      description,
      url: `https://${SITE.domain}${path}`,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
}
