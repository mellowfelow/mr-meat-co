import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS, WHOLESALE_BULK_SUBCATEGORIES, SITE, PAGE_SEO, metaDesc, faqHeading } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';
import { WholesaleNav } from '@/components/WholesaleNav';
import { BulkOrderContactSection } from '@/components/BulkOrderContactSection';
import { JsonLd } from '@/components/JsonLd';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { GuideSection } from '@/components/GuideSection';
import { SourcingNote } from '@/components/SourcingNote';
import { SmartImage } from '@/components/SmartImage';
import { ChevronRight, Layers, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return WHOLESALE_BULK_SUBCATEGORIES.map((sub) => ({
    subcategory: sub.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}) {
  const { subcategory: subSlug } = await params;
  const subcategory = WHOLESALE_BULK_SUBCATEGORIES.find((s) => s.slug === subSlug);

  if (!subcategory) return {};

  const seo = PAGE_SEO[`/wholesale/bulk-meat-orders/${subcategory.slug}/`];

  return withOpenGraph({
    title: seo?.title
      ? { absolute: seo.title }
      : `${subcategory.name} - Bulk Meat Orders & Animal Shares | ${SITE.name}`,
    description: metaDesc(
      seo?.description ??
        `Shop large-quantity ${subcategory.name.toLowerCase()} orders, freezer cartons and animal shares. Add to cart or request custom bulk pricing.`
    ),
    alternates: {
      canonical: `https://${SITE.domain}/wholesale/bulk-meat-orders/${subcategory.slug}/`,
    },
  }, `/wholesale/bulk-meat-orders/${subcategory.slug}/`);
}

export default async function BulkSubcategoryPage({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}) {
  const { subcategory: subSlug } = await params;
  const subcategory = WHOLESALE_BULK_SUBCATEGORIES.find((s) => s.slug === subSlug);

  if (!subcategory) {
    notFound();
  }

  const seo = PAGE_SEO[`/wholesale/bulk-meat-orders/${subSlug}/`];

  const products = PRODUCTS.filter((p) => {
    const isWholesale = (p.main_category || p.category || '').toLowerCase() === 'wholesale' || p.is_wholesale;
    const matchesSub = (p.subcategory || '').toLowerCase().replace(/\s+/g, '-') === subSlug;
    return isWholesale && matchesSub;
  });

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
        name: 'Wholesale',
        item: `https://${SITE.domain}/wholesale/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Bulk Meat Orders & Animal Shares',
        item: `https://${SITE.domain}/wholesale/bulk-meat-orders/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: subcategory.name,
        item: `https://${SITE.domain}/wholesale/bulk-meat-orders/${subcategory.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <JsonLd data={[breadcrumbSchema]} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/wholesale/" className="hover:text-white transition-colors">Wholesale</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/wholesale/bulk-meat-orders/" className="hover:text-white transition-colors">
          Bulk Meat Orders & Animal Shares
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-red-400 font-semibold">{subcategory.name}</span>
      </nav>

      {/* Wholesale Nav Bar */}
      <WholesaleNav />

      {/* Header Banner */}
      <div className="bg-[#141414] rounded-3xl border border-[#991B1B]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <Link
            href="/wholesale/bulk-meat-orders/"
            className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Bulk Categories</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-full text-red-300 text-xs font-bold uppercase tracking-wider block">
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <span>Bulk Meat Orders & Animal Shares</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
            {seo?.h1 ?? `${subcategory.name} Bulk Orders & Shares`}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {seo?.intro ??
              `Shop wholesale carton quantities, animal shares, and freezer packs of ${subcategory.name.toLowerCase()}. Listed items can be added directly to cart with fixed pricing. For higher volumes, contact our butcher team for a custom quote.`}
          </p>
          <SourcingNote variant="meat" />
        </div>
      </div>

      {subcategory.image && (
        <div className="relative aspect-[21/9] sm:aspect-[3/1] w-full overflow-hidden rounded-2xl border border-[#991B1B]/40">
          <SmartImage
            src={subcategory.image}
            alt={`${seo?.primaryKeyword ?? subcategory.name} — bulk and carcass shares at Mr Meat & Co`}
            fill
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      )}

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-serif text-white">
            Available {subcategory.name} Packs ({products.length})
          </h2>
          <span className="text-xs text-gray-400">
            Fixed prices in Australian Dollars (AUD)
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.product_id || product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-[#141414] rounded-2xl border border-[#991B1B]/40 text-center text-gray-400">
            No products currently found in this category.
          </div>
        )}
      </div>

      {/* Contact Section */}
      <BulkOrderContactSection defaultCategory={subcategory.name} />

      <GuideSection guide={seo?.guide} keyword={seo?.primaryKeyword} />

      {seo?.faqs && <SeoFaqSection faqs={seo.faqs} heading={faqHeading(seo?.primaryKeyword)} />}
    </div>
  );
}
