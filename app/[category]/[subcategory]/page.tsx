import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS, SITE, PAGE_SEO, metaDesc, faqHeading } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { GuideSection } from '@/components/GuideSection';
import { SourcingNote } from '@/components/SourcingNote';
import { SmartImage } from '@/components/SmartImage';
import { ProductCard } from '@/components/ProductCard';
import { SeafoodCatalogueClient } from '@/components/SeafoodCatalogueClient';
import { PetFoodCatalogueClient } from '@/components/PetFoodCatalogueClient';
import Link from 'next/link';

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  CATEGORIES.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      const subSlug = sub.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-');
      params.push({ category: cat.slug, subcategory: subSlug });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category: categorySlug, subcategory: subSlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return {};

  const subcategory = category.subcategories.find(
    (s) => s.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-') === subSlug
  );

  if (!subcategory) return {};

  const isSeafood = categorySlug === 'seafood';
  const isPetFood = categorySlug === 'pet-food';
  const seo = PAGE_SEO[`/${category.slug}/${subSlug}/`];

  return withOpenGraph({
    title: seo?.title
      ? { absolute: seo.title }
      : isSeafood
      ? `${subcategory} — Seafood`
      : isPetFood
      ? `${subcategory} — Pet Food`
      : `${subcategory} — ${category.name}`,
    description: metaDesc(
      seo?.description ??
        (isSeafood
          ? `Browse our ${subcategory.toLowerCase()} seafood catalogue — fresh chilled and frozen, with market-reference starting prices in AUD.`
          : isPetFood
          ? `Our ${subcategory.toLowerCase()} pet food catalogue. Pet food only — not for human consumption.`
          : `Shop fresh Australian ${subcategory.toLowerCase()} cuts from our ${category.name} selection. Cold-chain delivery across NSW, frozen courier nationwide.`)
    ),
    alternates: {
      canonical: `https://${SITE.domain}/${category.slug}/${subSlug}/`,
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  }, `/${category.slug}/${subSlug}/`);
}

export default async function TopLevelSubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category: categorySlug, subcategory: subSlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const subcategory = category.subcategories.find(
    (s) => s.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-') === subSlug
  );

  if (!subcategory) {
    notFound();
  }

  const isSeafood = categorySlug === 'seafood';
  const isPetFood = categorySlug === 'pet-food';
  const seo = PAGE_SEO[`/${category.slug}/${subSlug}/`];

  const subProducts = PRODUCTS.filter((p) => {
    const categoryMatches =
      p.category === category.slug ||
      p.main_category === category.slug ||
      p.primary_product_category?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === category.slug ||
      (Array.isArray(p.collections) && p.collections.some((c) => c.toLowerCase().includes(category.name.toLowerCase())));

    if (!categoryMatches) return false;

    const matchPrimary =
      p.subcategory &&
      p.subcategory.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-') === subSlug;
    const matchSecondary =
      Array.isArray(p.secondary_subcategories) &&
      p.secondary_subcategories.some(
        (s) => s.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-') === subSlug
      );
    const matchCollection =
      Array.isArray(p.collections) &&
      p.collections.some((c) =>
        c.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-').includes(subSlug)
      );

    return Boolean(matchPrimary || matchSecondary || matchCollection);
  });

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
          {
            '@type': 'ListItem',
            position: 3,
            name: subcategory,
            item: `https://${SITE.domain}/seafood/${subSlug}/`,
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
          {
            '@type': 'ListItem',
            position: 3,
            name: subcategory,
            item: `https://${SITE.domain}/pet-food/${subSlug}/`,
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
            name: category.name,
            item: `https://${SITE.domain}/${category.slug}/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: subcategory,
            item: `https://${SITE.domain}/${category.slug}/${subSlug}/`,
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
          <Link href={`/${category.slug}/`} className="hover:underline text-gray-400">
            {category.name}
          </Link>
          <span>/</span>
          <span>{subcategory}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {seo?.h1
            ? seo.h1
            : isSeafood
            ? `${subcategory} Products`
            : isPetFood
            ? `Pet Food — ${subcategory}`
            : `Australian ${subcategory} Cuts (${category.name})`}
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {seo?.intro
            ? seo.intro
            : isSeafood
            ? `Browse our selection of ${subcategory.toLowerCase()} products with transparent pack sizes, starting prices in AUD, and clear storage requirements.`
            : isPetFood
            ? `Raw pet meat, bones, or offal for ${subcategory.toLowerCase()}. Prepared strictly for animal dietary consumption only. Not for human consumption.`
            : `Premium fresh ${subcategory.toLowerCase()} hand-selected and trimmed by our craft butchers. High-protein, pasture-raised, delivered cold-chain across Australia.`}
        </p>
        <SourcingNote variant={isSeafood ? 'seafood' : isPetFood ? 'petfood' : categorySlug === 'live-poultry' ? 'poultry' : 'meat'} />
      </div>

      {category.image && (
        <div className="relative aspect-[21/9] sm:aspect-[3/1] w-full overflow-hidden rounded-2xl border border-[#991B1B]/40">
          <SmartImage
            src={category.image}
            alt={`${seo?.primaryKeyword ?? subcategory} — ${category.name} at Mr Meat & Co`}
            fill
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      )}

      {/* Product List or Interactive Filter */}
      {isSeafood ? (
        <SeafoodCatalogueClient initialSubcategory={subSlug} />
      ) : isPetFood ? (
        <PetFoodCatalogueClient initialSubcategory={subSlug} />
      ) : subProducts.length === 0 ? (
        <div className="bg-[#141414] p-10 text-center rounded-2xl border border-red-900/40 space-y-3">
          <h3 className="text-lg font-bold text-white">No products currently listed under {subcategory}</h3>
          <p className="text-xs text-gray-400">Check back soon or explore our full {category.name} range.</p>
          <Link
            href={`/${category.slug}/`}
            className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-xl text-xs mt-2 transition-colors"
          >
            View All {category.name} Cuts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      <GuideSection guide={seo?.guide} keyword={seo?.primaryKeyword} />

      {seo?.faqs && <SeoFaqSection faqs={seo.faqs} heading={faqHeading(seo?.primaryKeyword)} />}
    </div>
  );
}
