import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Beef, ArrowRight } from 'lucide-react';
import { SITE, PAGE_SEO, metaDesc, faqHeading, CONTENT_UPDATED } from '@/config/site';
import { SourcingNote } from '@/components/SourcingNote';
import { JsonLd } from '@/components/JsonLd';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { ShopFilterClient } from '@/components/ShopFilterClient';

const shopSeo = PAGE_SEO['/shop/'];

export const metadata: Metadata = withOpenGraph({
  title: shopSeo?.title
    ? { absolute: shopSeo.title }
    : 'Shop All Fresh Beef, Lamb, Poultry & Butcher Boxes',
  description: metaDesc(
    shopSeo?.description ??
      'Browse 100% Australian grass-fed beef mince, Wagyu steaks, pasture-raised lamb cutlets and bulk butcher boxes. Cold-chain across NSW, frozen courier nationwide.'
  ),
  alternates: {
    canonical: `https://${SITE.domain}/shop/`,
  },
  other: {
    'og:updated_time': CONTENT_UPDATED,
  },
}, '/shop/');

export default function ShopIndexPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `https://${SITE.domain}/shop/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="space-y-3 border-b border-[#991B1B]/40 pb-6">
        <div className="text-xs font-bold uppercase text-red-400 tracking-widest">
          100% Australian Grass-Fed Butcher & Master Market
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {shopSeo?.h1 ?? 'Craft Butcher Meat Market'}
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {shopSeo?.intro ??
            'Filter through all 11 artisanal butcher categories, subcategories, and specialty meat cuts. Ground fresh daily in Alexandria with zero preservatives or fillers. Cold-chain refrigerated delivery across NSW, frozen express courier Australia-wide.'}
        </p>
        <SourcingNote variant="meat" />
      </div>

      {/* Carcass / bulk pointer */}
      <Link
        href="/wholesale/bulk-meat-orders/"
        className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-red-500/40 bg-gradient-to-r from-[#2A1212] via-[#1C1414] to-[#1C1414] p-4 sm:p-5 hover:border-red-500 transition-colors"
      >
        <div className="w-11 h-11 shrink-0 rounded-xl bg-red-900/50 border border-red-500/40 flex items-center justify-center text-red-300">
          <Beef className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm sm:text-base font-black text-white">
            Looking for whole &amp; half carcasses, animal shares or bulk cartons?
          </div>
          <p className="text-xs text-gray-300 mt-0.5">
            Quarter / half / whole beef, lamb, pork &amp; goat shares plus 5&ndash;10kg wholesale cartons are in the Bulk Meat &amp; Animal Shares section.
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-black text-red-300 group-hover:text-red-200 border border-red-500/40 rounded-lg px-3 py-2">
          Shop Bulk &amp; Carcasses
          <ArrowRight className="w-4 h-4" />
        </span>
      </Link>

      {/* Interactive Shop Filter System */}
      <ShopFilterClient initialCategory="all" />

      {shopSeo?.faqs && <SeoFaqSection faqs={shopSeo.faqs} heading={faqHeading(shopSeo.primaryKeyword)} />}
    </div>
  );
}
