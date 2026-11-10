import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE, SHOP, CONTACT, abs, productTitle, metaDesc, CONTENT_UPDATED } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { ProductAddToCartForm } from '@/app/shop/[category]/[slug]/ProductAddToCartForm';
import { ProductCard } from '@/components/ProductCard';
import { Truck, ShieldCheck, MessageSquare, ArrowLeft, ShieldAlert, Snowflake, Package } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => {
    const subSlug = (p.subcategory || 'cuts')
      .toLowerCase()
      .replace(/ & /g, '-')
      .replace(/ \/ /g, '-')
      .replace(/ /g, '-');
    return {
      category: p.category,
      subcategory: subSlug,
      slug: p.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { slug, category: categorySlug, subcategory: subSlug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  const mc = (product.main_category || product.category || '') as string;
  const isSeafood = mc === 'seafood';
  const isPetFood = mc === 'pet-food' || product.pet_food_only;
  const isWholesale = mc.toLowerCase() === 'wholesale' || product.is_wholesale;
  const canonicalUrl = isSeafood
    ? `https://${SITE.domain}/seafood/${subSlug}/${product.slug}/`
    : isPetFood
    ? `https://${SITE.domain}/pet-food/${subSlug}/${product.slug}/`
    : isWholesale
    ? `https://${SITE.domain}/wholesale/bulk-meat-orders/${subSlug}/${product.slug}/`
    : `https://${SITE.domain}/shop/${product.category}/${product.slug}/`;

  return withOpenGraph({
    title: { absolute: productTitle(product.SEO_title || product.seo_title, product.product_name || product.name) },
    description: metaDesc(product.SEO_meta_description || product.seo_meta_description || product.full_description || product.description),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: { images: [{ url: product.main_image || product.image }] },
    other: {
      'og:updated_time': CONTENT_UPDATED,
    },
  });
}

export default async function TopLevelProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { category: categorySlug, subcategory: subSlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug && p.category === categorySlug);

  if (!product) {
    notFound();
  }

  const isSeafood = (product.main_category || product.category) === 'seafood';
  const isPetFood = (product.main_category || product.category) === 'pet-food' || product.pet_food_only;
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 4);

  const productCanonical = isSeafood
    ? `https://${SITE.domain}/seafood/${subSlug}/${product.slug}/`
    : isPetFood
    ? `https://${SITE.domain}/pet-food/${subSlug}/${product.slug}/`
    : `https://${SITE.domain}/shop/${product.category}/${product.slug}/`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name || product.name,
    image: [abs(product.main_image || product.image)],
    description: product.full_description || product.description,
    sku: product.SKU || product.product_id || product.slug,
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'Offer',
      url: productCanonical,
      priceCurrency: SITE.currency,
      price: product.price || 0,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock_status === 'In Stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE.name,
      },
    },
  };

  const breadcrumbElements = isSeafood
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
          name: product.subcategory || 'Fish',
          item: `https://${SITE.domain}/seafood/${subSlug}/`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.product_name || product.name,
          item: productCanonical,
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
          name: product.subcategory || 'Raw Mince',
          item: `https://${SITE.domain}/pet-food/${subSlug}/`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.product_name || product.name,
          item: productCanonical,
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
          name: category ? category.name : product.category,
          item: `https://${SITE.domain}/${product.category}/`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.product_name || product.name,
          item: productCanonical,
        },
      ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbElements,
  };

  const displayPrice = product.price !== null && product.price !== undefined
    ? `$${product.price.toFixed(2)}`
    : 'Inquire for Price';

  const formatPriceUnit = () => {
    switch (product.price_type) {
      case 'per_kg':
        return 'per kg';
      case 'per_pack':
        return 'per pack';
      case 'per_item':
        return 'per item';
      case 'fixed_pack_price':
        return 'fixed pack price';
      case 'fixed_box_price':
        return 'fixed box price';
      default:
        return 'per pack';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <Link
            href={isSeafood ? '/seafood/' : isPetFood ? '/pet-food/' : `/${product.category}/`}
            className="hover:text-white transition-colors"
          >
            {isSeafood ? 'Seafood' : isPetFood ? 'Pet Food' : (category?.name || product.category)}
          </Link>
          <span>&gt;</span>
          <Link
            href={isSeafood ? `/seafood/${subSlug}/` : isPetFood ? `/pet-food/${subSlug}/` : `/${product.category}/${subSlug}/`}
            className="hover:text-white transition-colors"
          >
            {product.subcategory}
          </Link>
          <span>&gt;</span>
          <span className="text-red-400 font-bold truncate max-w-[200px] sm:max-w-none">
            {product.product_name || product.name}
          </span>
        </nav>

        <Link
          href={isSeafood ? `/seafood/${subSlug}/` : isPetFood ? `/pet-food/${subSlug}/` : `/${product.category}/`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-red-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {product.subcategory || (isPetFood ? 'Pet Food' : category ? category.name : 'Category')}</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#141414] p-6 sm:p-8 rounded-3xl border border-red-900/40">
        {/* Product Image Stage */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-white rounded-2xl overflow-hidden p-4 shadow-xl border border-zinc-800">
            <SmartImage
              src={product.main_image || product.image}
              alt={product.product_name || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-4"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-lg border border-red-400/40">
                {product.badge}
              </span>
            )}
            <span
              className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md shadow border flex items-center gap-1.5 ${
                product.storage_type === 'Frozen'
                  ? 'bg-sky-950/90 text-sky-200 border-sky-500/50'
                  : product.storage_type === 'Refrigerated'
                  ? 'bg-purple-950/90 text-purple-200 border-purple-500/50'
                  : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              }`}
            >
              {product.storage_type === 'Frozen' && <Snowflake className="w-3.5 h-3.5 text-sky-300" />}
              {product.storage_type || 'Fresh Chilled'}
            </span>
          </div>

          <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-bold text-white">
              <Truck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Free Cold-Chain Delivery across NSW on orders ${SHOP.freeShippingThreshold}+ · Frozen Courier Australia-Wide</span>
            </div>
            <div className="flex items-center space-x-2 font-bold text-gray-200">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Sealed for freshness — transport maintained in refrigerated conditions</span>
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Subcategory */}
            <div>
              <div className="text-xs font-bold uppercase text-red-400 tracking-widest mb-1 flex items-center gap-2">
                <span>{product.main_category || product.category}</span>
                <span>/</span>
                <span>{product.subcategory}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-serif leading-tight">
                {product.product_name || product.name}
              </h1>
            </div>

            {/* Price, Pack Size, Price Unit */}
            <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#991B1B]/40 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-red-400">{displayPrice}</span>
                  <span className="text-xs text-gray-400 font-semibold ml-2">AUD</span>
                </div>
                <span className="text-xs uppercase font-bold text-gray-400 bg-[#141414] px-3 py-1 rounded border border-zinc-800">
                  {formatPriceUnit()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Pack size:</span>
                  <strong className="text-white font-bold">{product.pack_size || product.weight || 'Standard Pack'}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Storage:</span>
                  <strong className={product.storage_type === 'Frozen' ? 'text-sky-300 font-bold' : 'text-emerald-300 font-bold'}>
                    {product.storage_type || 'Fresh Chilled'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Stock Status: {product.stock_status || 'In Stock'}</span>
            </div>

            {/* Descriptions */}
            <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
              <p className="font-semibold text-white">{product.short_description || product.shortDescription}</p>
              <p className="text-xs text-gray-400">{product.full_description || product.description}</p>
            </div>

            {/* Allergen Notice Card */}
            {isSeafood && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-amber-300 block uppercase tracking-wider">
                    Allergen Notice:
                  </span>
                  <p className="text-amber-200/90 leading-relaxed">
                    Contains Fish / Crustacean Shellfish. Always check supplier allergen information and physical packaging label before consumption.
                  </p>
                </div>
              </div>
            )}

            {/* Pet Food Warning Banner */}
            {isPetFood && (
              <div className="p-4 bg-amber-950/40 border-2 border-amber-500/80 rounded-2xl flex items-start gap-3 shadow-lg">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-black text-amber-300 block text-sm uppercase tracking-wider">
                    PET FOOD ONLY — NOT FOR HUMAN CONSUMPTION
                  </span>
                  <p className="text-amber-200/90 leading-relaxed font-medium">
                    This product is strictly formulated and prepared for pet dietary consumption only. Not for human consumption.
                  </p>
                </div>
              </div>
            )}

            {/* Box Contents Breakdown (for Pet Packs / Value Packs with box_contents array) */}
            {product.box_contents && product.box_contents.length > 0 && (
              <div className="p-3.5 bg-[#1A1A1A] rounded-xl border border-zinc-800 text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider">
                  <Package className="w-4 h-4 text-red-400" />
                  <span>Box Contents ({product.approximate_total_weight || product.pack_size}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.box_contents.map((item, idx) => (
                    <div key={idx} className="bg-[#141414] px-3 py-2 rounded-lg border border-zinc-800 flex items-center justify-between">
                      <span className="text-gray-200 font-medium">{item.name}</span>
                      <strong className="text-red-400 font-bold ml-2 shrink-0">{item.quantity}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pack Contents Breakdown (for Value Packs with dictionary) */}
            {product.pack_contents && !product.box_contents && (
              <div className="p-3.5 bg-[#1A1A1A] rounded-xl border border-zinc-800 text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-white uppercase tracking-wider">
                  <Package className="w-4 h-4 text-red-400" />
                  <span>Pack Contents:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.pack_contents).map(([item, qty]) => (
                    <div key={item} className="bg-[#141414] px-2.5 py-1.5 rounded border border-zinc-800 flex justify-between">
                      <span className="capitalize text-gray-300">{item.replace(/_/g, ' ')}</span>
                      <strong className="text-white">{qty}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safe Handling & Feeding Instructions for Pet Food */}
            {isPetFood && (
              <div className="space-y-3">
                <div className="p-3 bg-[#1A1A1A] rounded-xl border border-zinc-800 text-xs text-gray-300 space-y-1">
                  <span className="font-bold text-amber-400 block uppercase tracking-wider">Safe Pet Food Handling:</span>
                  <p className="leading-relaxed">
                    {product.handling_instructions || "Keep frozen until ready to use. Thaw thoroughly in the refrigerator. Wash hands, utensils, and surfaces thoroughly with warm soapy water after handling raw pet meat. Keep separate from human food."}
                  </p>
                </div>
                <div className="p-3 bg-[#1A1A1A] rounded-xl border border-zinc-800 text-xs text-gray-300 space-y-1">
                  <span className="font-bold text-gray-300 block uppercase tracking-wider">Feeding Guidance:</span>
                  <p className="leading-relaxed">
                    {product.feeding_instructions || "Feed raw according to verified supplier feeding guidelines and your veterinarian's portion recommendations for your pet's size, weight, and activity."}
                  </p>
                </div>
              </div>
            )}

            {/* Cooking Methods (for human food) */}
            {!isPetFood && product.cooking_methods && product.cooking_methods.length > 0 && (
              <div className="text-xs text-gray-300 space-y-1.5">
                <span className="font-bold text-red-400 uppercase tracking-wider block">Recommended Cooking Methods:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.cooking_methods.map((method) => (
                    <span key={method} className="px-2.5 py-1 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-gray-200 font-medium">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Instructions */}
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-zinc-800 text-xs text-gray-300 space-y-1">
              <span className="font-bold text-white block uppercase tracking-wider">Storage Instructions:</span>
              <p>{product.storage_instructions || `Keep ${product.storage_type?.toLowerCase() || 'refrigerated'}. Follow package storage and consume within recommended timeframe.`}</p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-3">
            <ProductAddToCartForm product={product} />
          </div>

          {/* Quick WhatsApp Inquiry */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-gray-400">
            <span>Special pack size or custom request?</span>
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                `Hi Mr Meat & Co, I have a question about ${product.product_name || product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 font-bold hover:underline flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-bold font-serif text-white">
            More {product.subcategory || (category ? category.name : 'Seafood')} Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
