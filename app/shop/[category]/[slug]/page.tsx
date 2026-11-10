import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE, SHOP, CONTACT, abs, productTitle, metaDesc, CONTENT_UPDATED } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { ProductAddToCartForm } from './ProductAddToCartForm';
import { ProductCard } from '@/components/ProductCard';
import { Truck, ShieldCheck, Flame, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  const mc = (product.main_category || product.category) as string;
  const isSeafood = mc === 'seafood';
  const isPetFood = mc === 'pet-food' || (product as { pet_food_only?: boolean }).pet_food_only;
  const isWholesale = mc.toLowerCase() === 'wholesale' || (product as { is_wholesale?: boolean }).is_wholesale;
  const sub = (product.subcategory || '').toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-');
  // pet-food / seafood products are canonical at their category path; wholesale at the bulk route — never /shop/
  const canonical =
    isSeafood ? `https://${SITE.domain}/seafood/${sub}/${product.slug}/`
    : isPetFood ? `https://${SITE.domain}/pet-food/${sub}/${product.slug}/`
    : isWholesale ? `https://${SITE.domain}/wholesale/bulk-meat-orders/${sub}/${product.slug}/`
    : `https://${SITE.domain}/shop/${product.category}/${product.slug}/`;

  const p = product as {
    SEO_title?: string; seo_title?: string;
    SEO_meta_description?: string; seo_meta_description?: string;
    full_description?: string; short_description?: string;
    product_name?: string; name: string; description: string; shortDescription?: string;
    main_image?: string; image?: string;
  };

  return withOpenGraph({
    title: { absolute: productTitle(p.SEO_title || p.seo_title, p.product_name || p.name) },
    description: metaDesc(
      p.SEO_meta_description || p.seo_meta_description || p.full_description || p.description
    ),
    alternates: {
      canonical,
    },
    openGraph: { images: [{ url: p.main_image || p.image || abs(SITE.ogImage) }] },
    other: {
      'og:updated_time': CONTENT_UPDATED,
    },
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug && p.category === categorySlug);

  if (!product) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  const priceValidUntil = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [abs(product.main_image || product.image)],
    description: product.description,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
      priceCurrency: SITE.currency,
      price: product.price || 0,
      priceValidUntil,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE.name,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: SITE.currency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'AU',
          addressRegion: 'NSW',
        },
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
        name: category ? category.name : 'Category',
        item: `https://${SITE.domain}/${product.category}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <JsonLd data={[productSchema, breadcrumbSchema]} />

      {/* Back Link & Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
        <Link href={`/${product.category}/`} className="flex items-center space-x-1 hover:text-red-400">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {category ? category.name : 'Category'}</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 shadow-sm text-white">
        {/* Product Image Frame */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#991B1B]/30 p-4">
            <SmartImage
              src={product.image}
              alt={product.name}
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
          </div>

          <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#991B1B]/40 space-y-2 text-xs text-gray-300">
            <div className="flex items-center space-x-2 font-bold text-red-400">
              <Truck className="w-4 h-4 text-red-400" />
              <span>Free Cold-Chain Delivery across NSW on orders $300+ · Frozen Courier Australia-Wide</span>
            </div>
            <div className="flex items-center space-x-2 font-bold text-gray-200">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>100% Australian Pasture-Raised & Hormone-Free Beef</span>
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 1. Product Name */}
            <div>
              <div className="text-xs font-bold uppercase text-red-400 tracking-widest mb-1">
                {product.main_category || product.category} &gt; {product.subcategory}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-serif leading-tight">
                {product.product_name || product.name}
              </h1>
            </div>

            {/* 3. Price & 4. Pack Size & 5. Price Unit */}
            <div className="flex items-baseline space-x-3 pt-1 border-t border-[#991B1B]/40">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {product.price !== null && product.price !== undefined
                  ? `$${product.price.toFixed(2)}`
                  : 'Inquire'}
              </span>
              <span className="text-sm font-semibold text-gray-300">
                AUD ({product.pack_size || product.weight || 'Pack'} — {product.price_type === 'per_kg' ? 'per kg' : product.price_type === 'per_pack' ? 'per pack' : 'per item'})
              </span>
            </div>

            {/* 6. Stock Status */}
            <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Stock Status: {product.stock_status || 'In Stock'}</span>
            </div>

            {/* 7. Short Description */}
            <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
              <p className="font-semibold text-white">{product.short_description || product.shortDescription}</p>
              <p className="text-xs text-gray-400">{product.full_description || product.description}</p>
            </div>

            {/* Box Contents & Total Weight (For Meat Boxes) */}
            {product.category === 'meat-boxes' && (
              <div className="p-4 bg-[#1e1414] rounded-2xl border border-red-800/50 space-y-3">
                <div className="flex items-center justify-between border-b border-red-900/40 pb-2">
                  <span className="font-bold text-red-400 text-sm uppercase tracking-wider">
                    Box Contents & Specifications
                  </span>
                  {product.approximate_total_weight && (
                    <span className="bg-red-900/60 text-red-200 text-xs font-bold px-2.5 py-1 rounded-md">
                      Approx Total Weight: {product.approximate_total_weight}
                    </span>
                  )}
                </div>

                {product.box_contents && product.box_contents.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {product.box_contents.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-gray-200 bg-[#141414] p-2 rounded-lg border border-zinc-800">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                        <span className="font-bold text-white">{item.quantity}</span>
                        <span className="text-gray-300">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-300">
                    Customise your box by selecting your preferred cuts across beef, chicken, lamb, pork & sausages. Minimum order value of $199.00 applies.
                  </p>
                )}
              </div>
            )}

            {/* 8. Cooking Method */}
            {product.cooking_methods && product.cooking_methods.length > 0 && (
              <div className="text-xs text-gray-300 space-y-1">
                <span className="font-bold text-red-400 uppercase tracking-wider block">Recommended Cooking Method:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.cooking_methods.map((method) => (
                    <span key={method} className="px-2.5 py-1 bg-[#222] border border-[#991B1B]/40 rounded-md text-gray-200 font-medium">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients & Allergen Information (for Ready to Cook & Prepared items) */}
            {(product.ingredients || product.allergen_information) && (
              <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#991B1B]/40 text-xs text-gray-300 space-y-2">
                {product.ingredients && (
                  <div>
                    <span className="font-bold text-white block uppercase tracking-wider mb-0.5">Ingredients:</span>
                    <p className="text-gray-300 leading-relaxed">{product.ingredients}</p>
                  </div>
                )}
                {product.allergen_information && (
                  <div>
                    <span className="font-bold text-red-400 block uppercase tracking-wider mb-0.5">Allergen Information:</span>
                    <p className="text-gray-200 font-semibold">{product.allergen_information}</p>
                  </div>
                )}
              </div>
            )}

            {/* 9. Storage Information */}
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#991B1B]/40 text-xs text-gray-300 space-y-1">
              <span className="font-bold text-white block uppercase tracking-wider">Storage Information:</span>
              <p>{product.storage_type || 'Fresh Chilled'}: {product.storage_instructions || 'Keep refrigerated below 4°C. Consume within 3 days or freeze.'}</p>
            </div>
          </div>

          {/* 10. Add to Cart Button */}
          <div className="pt-2">
            <ProductAddToCartForm product={product} />
          </div>

          {/* Quick WhatsApp Inquiry */}
          <div className="pt-4 border-t border-[#991B1B]/30 flex items-center justify-between text-xs text-gray-400">
            <span>Have custom cutting requirements?</span>
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                `Hi Sydney Butcher, I have a question about ${product.product_name || product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 font-bold hover:underline flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Butcher via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-bold font-serif text-white">
            More Cuts From {category ? category.name : 'This Category'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
