import type { Metadata } from 'next';
import { SITE, abs } from '@/config/site';

type OgImage = { url: string | URL; width?: number; height?: number; alt?: string };

/**
 * Fills in a route's openGraph + twitter blocks so every indexable page carries
 * its own og:url / og:title / og:description / og:image and matching twitter:*.
 * Next.js replaces (not merges) the root layout's openGraph when a route sets
 * its own, so any field a route omits (url, siteName, type...) is lost. Run every
 * route's metadata through this.
 *
 * `path` defaults to the route's canonical URL. An existing openGraph image
 * (e.g. a product photo) is kept; otherwise the site OG card is used.
 */
export function withOpenGraph(meta: Metadata, path?: string): Metadata {
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

  const canonical = meta.alternates?.canonical;
  const url =
    path !== undefined
      ? `https://${SITE.domain}${path}`
      : typeof canonical === 'string'
      ? canonical
      : canonical instanceof URL
      ? canonical.toString()
      : `https://${SITE.domain}/`;

  const existing = meta.openGraph as { images?: OgImage | OgImage[]; type?: string } | undefined;
  const rawImages = existing?.images;
  const images: OgImage[] = Array.isArray(rawImages)
    ? rawImages
    : rawImages
    ? [rawImages]
    : [{ url: abs(SITE.ogImage), width: 1200, height: 630, alt: SITE.name }];
  const normalised = images
    .filter((i) => i && i.url)
    .map((i) => ({ ...i, url: abs(String(i.url)) }));
  const ogType = (existing?.type as 'website' | 'article' | undefined) ?? 'website';

  return {
    ...meta,
    openGraph: {
      type: ogType,
      siteName: SITE.name,
      locale: 'en_AU',
      title,
      description,
      url,
      images: normalised,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: normalised.map((i) => i.url),
    },
  };
}
