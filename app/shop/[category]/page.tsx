import React from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, SITE, metaDesc } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { withOpenGraph } from '@/lib/seo';
import { ShopFilterClient } from '@/components/ShopFilterClient';
import Link from 'next/link';

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return {};

  return withOpenGraph({
    title: `${category.name} — Grass-Fed Butcher Sydney`,
    description: metaDesc(category.description),
    // The /{slug}/ page is the canonical category page (nav + PAGE_SEO target).
    // This /shop/{slug}/ filter view points at it to avoid duplicate content.
    alternates: {
      canonical: `https://${SITE.domain}/${category.slug}/`,
    },
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

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
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://${SITE.domain}/shop/${category.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="space-y-3 border-b border-[#991B1B]/40 pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400">
          <Link href="/shop/" className="hover:underline text-gray-400">
            Shop
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {category.name} Cuts & Products
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Interactive Shop Filter pre-selected to this category */}
      <ShopFilterClient initialCategory={category.slug} />
    </div>
  );
}
