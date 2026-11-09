import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS, WHOLESALE_BULK_SUBCATEGORIES, SITE, abs, metaDesc, productTitle } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { ProductAddToCartForm } from '@/app/shop/[category]/[slug]/ProductAddToCartForm';
import { ProductCard } from '@/components/ProductCard';
import { BulkOrderContactSection } from '@/components/BulkOrderContactSection';
import { WholesaleNav } from '@/components/WholesaleNav';
import {
  Truck,
  ShieldCheck,
  Package,
  Layers,
  Snowflake,
  ChevronRight,
  ArrowLeft,
  Info,
  Scale,
  CalendarClock,
} from 'lucide-react';

export async function generateStaticParams() {
  const wholesaleProducts = PRODUCTS.filter(
    (p) => (p.main_category || p.category || '').toLowerCase() === 'wholesale' || p.is_wholesale
  );

  return wholesaleProducts.map((p) => ({
    subcategory: (p.subcategory || '').toLowerCase().replace(/\s+/g, '-'),
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string; slug: string }>;
}) {
  const { subcategory: subSlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  const canonical = `https://${SITE.domain}/wholesale/bulk-meat-orders/${subSlug}/${product.slug}/`;
  // Variants share a product name (e.g. "Whole Beef Share" 200kg / 250kg), so
  // use the per-product seo_title (carries the size) like the /shop/ products do.
  const fullTitle = productTitle(product.seo_title, product.product_name || product.name);
  const shortTitle = productTitle(String(product.seo_title || '').split(' | ')[0], product.product_name || product.name);
  const title = fullTitle.length > 65 && shortTitle.length <= 65 ? shortTitle : fullTitle;
  const description = metaDesc(product.seo_meta_description || product.short_description || product.description);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: product.main_image || product.image }],
    },
  };
}

export default async function BulkProductDetailPage({
  params,
}: {
  params: Promise<{ subcategory: string; slug: string }>;
}) {
  const { subcategory: subSlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const subcategory = WHOLESALE_BULK_SUBCATEGORIES.find(
    (s) => s.slug === subSlug || s.name.toLowerCase() === (product.subcategory || '').toLowerCase()
  );

  // Variants of one product (e.g. 200kg / 250kg shares) share a name, so the H1 adds the pack size to keep each page's heading unique.
  const sharesName =
    PRODUCTS.filter(
      (p) => (p.product_name || p.name) === (product.product_name || product.name) && (p.is_wholesale || (p.main_category || p.category || '').toLowerCase() === 'wholesale')
    ).length > 1;

  const relatedProducts = PRODUCTS.filter(
    (p) =>
      ((p.main_category || p.category || '').toLowerCase() === 'wholesale' || p.is_wholesale) &&
      p.slug !== product.slug
  ).slice(0, 4);

  const formatPriceUnit = () => {
    if (!product.price_type) return 'per item';
    switch (product.price_type) {
      case 'per_kg':
        return 'per kg';
      case 'per_pack':
        return 'per pack';
      case 'per_box':
        return 'per box';
      case 'fixed_pack_price':
        return 'fixed pack price';
      case 'fixed_box_price':
        return 'fixed carton price';
      default:
        return product.price_type.replace(/_/g, ' ');
    }
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name || product.name,
    image: [abs(product.main_image || product.image)],
    description: product.full_description || product.description,
    sku: product.SKU || product.slug,
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://${SITE.domain}/wholesale/bulk-meat-orders/${subSlug}/${product.slug}/`,
      priceCurrency: SITE.currency,
      price: product.price || 0,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE.name,
      },
    },
  };

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
        name: subcategory ? subcategory.name : product.subcategory || 'Bulk',
        item: `https://${SITE.domain}/wholesale/bulk-meat-orders/${subSlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: product.product_name || product.name,
        item: `https://${SITE.domain}/wholesale/bulk-meat-orders/${subSlug}/${product.slug}/`,
      },
    ],
  };

  const storageType = product.storage_type || 'Fresh Chilled';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <JsonLd data={[productSchema, breadcrumbSchema]} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center space-x-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/wholesale/" className="hover:text-white transition-colors">Wholesale</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/wholesale/bulk-meat-orders/" className="hover:text-white transition-colors">
          Bulk Meat Orders & Animal Shares
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/wholesale/bulk-meat-orders/${subSlug}/`} className="hover:text-white transition-colors">
          {subcategory ? subcategory.name : product.subcategory}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-red-400 font-semibold truncate max-w-xs">{product.product_name || product.name}</span>
      </nav>

      {/* Wholesale Navigation */}
      <WholesaleNav />

      {/* Back button */}
      <div>
        <Link
          href={`/wholesale/bulk-meat-orders/${subSlug}/`}
          className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {subcategory ? subcategory.name : 'Bulk Category'}</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 shadow-2xl text-white">
        {/* Product Image Frame */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#991B1B]/30 p-4">
            <SmartImage
              src={product.main_image || product.image}
              alt={product.product_name || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-2"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md z-10">
                {product.badge}
              </span>
            )}
            <span
              className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-10 border flex items-center gap-1.5 ${
                storageType === 'Frozen'
                  ? 'bg-sky-950 text-sky-200 border-sky-500/50'
                  : storageType === 'To be confirmed'
                  ? 'bg-amber-950 text-amber-200 border-amber-500/50'
                  : 'bg-emerald-950 text-emerald-200 border-emerald-500/50'
              }`}
            >
              {storageType === 'Frozen' && <Snowflake className="w-3.5 h-3.5 text-sky-300" />}
              <span>Storage: {storageType}</span>
            </span>
          </div>

          {/* Quick Wholesale Logistics Specs */}
          <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#991B1B]/40 space-y-2.5 text-xs text-gray-300">
            <div className="flex items-center space-x-2 font-bold text-red-400">
              <Truck className="w-4 h-4 text-red-400 shrink-0" />
              <span>Cold-Chain Refrigerated Delivery across NSW · Frozen Courier Australia-Wide</span>
            </div>
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <CalendarClock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bulk orders cut and prepared fresh to schedule (3-7 days lead time)</span>
            </div>
            <div className="flex items-center space-x-2 font-bold text-gray-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fixed wholesale rate listed — Add directly to cart</span>
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category Tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
                Bulk Meat Orders & Animal Shares &gt; {product.subcategory}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
                {product.stock_status || 'In Stock'}
              </span>
            </div>

            {/* Product Name (Field 1: SEPARATE) */}
            <h1 className="text-2xl sm:text-4xl font-black text-white font-serif leading-tight">
              {sharesName && product.pack_size
                ? `${product.product_name || product.name} (${product.pack_size})`
                : product.product_name || product.name}
            </h1>

            {/* Price & Pack Size & Price Unit (Fields 2, 3, 4: SEPARATE) */}
            <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#991B1B]/40 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">
                    Listed Fixed Price ({formatPriceUnit()})
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ${(product.price || 0).toFixed(2)}{' '}
                    <span className="text-sm font-normal text-gray-400">AUD</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">
                    Pack Size / Format
                  </span>
                  <span className="text-sm font-black text-red-300">
                    {product.pack_size || 'Standard Bulk Pack'}
                  </span>
                </div>
              </div>

              {/* Weight or Animal Share Notice */}
              {product.approximate_weight && (
                <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-1 font-semibold text-gray-400">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    Approximate Pack Weight:
                  </span>
                  <span className="font-bold text-white">{product.approximate_weight}</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-gray-200 leading-relaxed font-medium">
              {product.short_description || product.shortDescription}
            </p>

            {/* Full Description */}
            {product.full_description && (
              <p className="text-xs text-gray-400 leading-relaxed">
                {product.full_description}
              </p>
            )}

            {/* Bulk Product Contents / Cut Breakdown */}
            {product.product_contents && product.product_contents.length > 0 && (
              <div className="p-4 bg-[#1E1414] rounded-2xl border border-red-800/40 space-y-3">
                <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
                  <span className="font-bold text-red-400 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-red-400" />
                    Included Cuts & Pack Contents
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.product_contents.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 text-gray-200 bg-[#120E0E] p-2 rounded-lg border border-red-950"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bulk Order Notice */}
            {product.bulk_order_notice && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{product.bulk_order_notice}</p>
              </div>
            )}
          </div>

          {/* Add to Cart Section (Normal ecommerce product) */}
          <div className="pt-2">
            <ProductAddToCartForm product={product} />
          </div>
        </div>
      </div>

      {/* "Need More Than This?" Contact Section on every Bulk PDP */}
      <BulkOrderContactSection
        productContext={`${product.product_name || product.name} (${product.pack_size || 'Bulk'})`}
        defaultCategory={subcategory ? subcategory.name : product.subcategory}
      />

      {/* Related Bulk Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#991B1B]/40">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-serif text-white">
              Other Bulk Meat Options & Animal Shares
            </h2>
            <Link
              href="/wholesale/bulk-meat-orders/"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>View all bulk products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.product_id || p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
