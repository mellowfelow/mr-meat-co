import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS, SITE, PAGE_SEO, metaDesc, faqHeading, productTitle, CONTENT_UPDATED } from '@/config/site';
import { GuideSection } from '@/components/GuideSection';
import { SourcingNote } from '@/components/SourcingNote';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { ProductCard } from '@/components/ProductCard';
import { ShopFilterClient } from '@/components/ShopFilterClient';
import { SeafoodCatalogueClient } from '@/components/SeafoodCatalogueClient';
import { PetFoodCatalogueClient } from '@/components/PetFoodCatalogueClient';
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

  const isSeafood = categorySlug === 'seafood';
  const isPetFood = categorySlug === 'pet-food';
  const seo = PAGE_SEO[`/${category.slug}/`];

  return withOpenGraph({
    title: {
      absolute: productTitle(
        seo?.title,
        isSeafood
          ? 'Seafood Catalogue | Fish, Prawns & Salmon'
          : isPetFood
          ? 'Pet Food Catalogue | Raw Pet Mince, Bones & Offal'
          : `${category.name} Cuts & Products | Sydney Delivery`
      ),
    },
    description: metaDesc(
      seo?.description ??
        (isSeafood
          ? `Browse our seafood catalogue — Barramundi, Snapper, Flathead, King Prawns and Tasmanian Salmon portions. Fresh chilled and frozen.`
          : isPetFood
          ? `Raw pet food catalogue — raw mince, bones and offal. Pet food only, not for human consumption.`
          : category.description)
    ),
    alternates: {
      canonical: `https://${SITE.domain}/${category.slug}/`,
    },
    other: {
      'og:updated_time': CONTENT_UPDATED,
    },
  }, `/${category.slug}/`);
}

export default async function TopLevelCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const isSeafood = categorySlug === 'seafood';
  const isPetFood = categorySlug === 'pet-food';
  const isLivePoultry = categorySlug === 'live-poultry';
  const seo = PAGE_SEO[`/${category.slug}/`];

  const livePoultryProducts = isLivePoultry
    ? PRODUCTS.filter((p) => (p.main_category || p.category) === 'live-poultry')
    : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: isSeafood
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://${SITE.domain}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Seafood',
            item: `https://${SITE.domain}/seafood/`,
          },
        ]
      : isPetFood
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://${SITE.domain}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Pet Food',
            item: `https://${SITE.domain}/pet-food/`,
          },
        ]
      : [
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
            item: `https://${SITE.domain}/${category.slug}/`,
          },
        ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="space-y-3 border-b border-red-900/40 pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-500">
          <Link href="/" className="hover:underline text-gray-400">
            Home
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {seo?.h1
            ? seo.h1
            : isSeafood
            ? 'Seafood Product Catalogue'
            : isPetFood
            ? 'Pet Food Product Catalogue'
            : `${category.name} Cuts & Fresh Meat`}
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {seo?.intro
            ? seo.intro
            : isSeafood
            ? 'Explore our complete seafood catalogue featuring fresh chilled and frozen fish fillets, raw and cooked prawns, and salmon portions. All prices are in AUD with clear storage and allergen information.'
            : isPetFood
            ? 'Raw pet meat, bones, and offal prepared strictly for animal diets. Pet food only — not for human consumption. Keep frozen until use.'
            : category.description}
        </p>

        <SourcingNote
          variant={isLivePoultry ? 'poultry' : isPetFood ? 'petfood' : isSeafood ? 'seafood' : 'meat'}
        />

        {/* Subcategories Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-red-500 uppercase mr-1">Subcategories:</span>
          {category.subcategories.map((sub) => {
            const subSlug = sub.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-');
            return (
              <Link
                key={sub}
                href={`/${category.slug}/${subSlug}/`}
                className="px-3 py-1 bg-[#1A1A1A] hover:bg-red-700 hover:text-white text-white text-xs font-bold rounded-lg border border-red-900/40 transition-colors"
              >
                {sub}
              </Link>
            );
          })}
        </div>
      </div>

      {category.image && (
        <div className="relative aspect-[21/9] sm:aspect-[3/1] w-full overflow-hidden rounded-2xl border border-[#991B1B]/40">
          <SmartImage
            src={category.image}
            alt={`${seo?.primaryKeyword ?? category.name} — ${category.name} at Mr Meat & Co, an Australian craft butcher`}
            fill
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      )}

      {/* Interactive Filter System */}
      {isSeafood ? (
        <SeafoodCatalogueClient initialSubcategory="all" />
      ) : isPetFood ? (
        <PetFoodCatalogueClient initialSubcategory="all" />
      ) : isLivePoultry ? (
        <div className="space-y-6">
          <div className="bg-[#1C1414] border border-amber-500/40 rounded-2xl p-5 text-sm text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300">Live birds — pickup or local delivery only.</strong> Live poultry is
            collected from our farm partner by appointment, or delivered within a limited Sydney radius. Birds are
            sold vaccinated and sexed where stated. Minimum numbers may apply for welfare reasons. This range is not
            part of the $300 cold-chain meat delivery.
          </div>
          {livePoultryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {livePoultryProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Live poultry stock is listed seasonally. Contact us for current availability.</p>
          )}
        </div>
      ) : (
        <ShopFilterClient initialCategory={category.slug} />
      )}

      <GuideSection guide={seo?.guide} keyword={seo?.primaryKeyword} />

      {seo?.faqs && <SeoFaqSection faqs={seo.faqs} heading={faqHeading(seo?.primaryKeyword)} />}
    </div>
  );
}
