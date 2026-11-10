import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import type { Metadata } from 'next';
import { SITE, PAGE_SEO, metaDesc, CONTENT_UPDATED } from '@/config/site';

const seo = PAGE_SEO['/wholesale/bulk-meat-orders/'];

export const metadata: Metadata = seo
  ? withOpenGraph({
      title: { absolute: seo.title },
      description: metaDesc(seo.description),
      alternates: { canonical: `https://${SITE.domain}/wholesale/bulk-meat-orders/` },
      other: { 'og:updated_time': CONTENT_UPDATED },
    }, '/wholesale/bulk-meat-orders/')
  : {};

export default function BulkMeatOrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
