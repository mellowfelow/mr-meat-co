import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE, CATEGORIES, PRODUCTS, POSTS, FAQ, BRAND, CONTACT, SHOP, PAGE_SEO, metaDesc, abs } from '@/config/site';
import { withOpenGraph } from '@/lib/seo';
import { ProductCard } from '@/components/ProductCard';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { HeroSlider } from '@/components/HeroSlider';
import { CategoryGridClient } from '@/components/CategoryGridClient';
import { Truck, ShieldCheck, Percent, Utensils, MessageSquare, ArrowRight, Award, Flame, CheckCircle2 } from 'lucide-react';

export function generateMetadata(): Metadata {
  const seo = PAGE_SEO['/'];
  if (!seo) return {};
  return withOpenGraph({
    title: { absolute: seo.title },
    description: metaDesc(seo.description),
    alternates: { canonical: `https://${SITE.domain}/` },
  }, '/');
}

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 8);

  // Schema LD JSON structures
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': ['Store', 'Organization'],
    name: SITE.name,
    legalName: SITE.legalName,
    description: BRAND.description,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'ABN',
      name: 'Australian Business Number',
      value: SITE.abn,
    },
    vatID: `ABN ${SITE.abn}`,
    foundingDate: BRAND.foundingYear,
    foundingLocation: { '@type': 'Place', name: BRAND.foundingLocation },
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address,
      addressLocality: 'Alexandria, Sydney',
      addressRegion: 'NSW',
      postalCode: '2015',
      addressCountry: CONTACT.country,
    },
    url: `https://${SITE.domain}/`,
    logo: `https://${SITE.domain}/images/logo.png`,
    image: `https://${SITE.domain}/og-card.png`,
    telephone: CONTACT.phone,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACT.phone,
      areaServed: 'AU',
      availableLanguage: 'en',
    },
    ...(BRAND.sameAs.length ? { sameAs: BRAND.sameAs } : {}),
    areaServed: ['New South Wales', 'Sydney Metro', 'Central Coast NSW', 'Wollongong', 'Australia'],
    numberOfItems: PRODUCTS.length,
    knowsAbout: ['Grass-Fed Beef', 'Premium Beef Mince', 'Dry-Aged Wagyu', 'Australian Lamb', 'Artisanal Sausages'],
    priceRange: '$',
    brand: { '@type': 'Brand', name: SITE.name },
    makesOffer: {
      '@type': 'AggregateOffer',
      priceCurrency: SITE.currency,
      lowPrice: 22.0,
      highPrice: 295.0,
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: `https://${SITE.domain}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://${SITE.domain}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="space-y-16 pb-16">
      <JsonLd data={[storeSchema, websiteSchema, faqSchema]} />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#141414] p-6 rounded-2xl border border-red-900/40 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#1A1A1A] text-red-500 border border-red-900/50 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Free Cold-Chain Across NSW</p>
              <p className="text-xs text-gray-400 mt-1">Free refrigerated van delivery across NSW on orders ${SHOP.freeShippingThreshold}+. Shipped frozen by express courier elsewhere in Australia.</p>
            </div>
          </div>

          <div className="bg-[#141414] p-6 rounded-2xl border border-red-900/40 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#1A1A1A] text-red-500 border border-red-900/50 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Australian Pasture</p>
              <p className="text-xs text-gray-400 mt-1">100-day grass-fed certified livestock with zero growth hormones or fillers.</p>
            </div>
          </div>

          <div className="bg-[#141414] p-6 rounded-2xl border border-red-900/40 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#1A1A1A] text-red-500 border border-red-900/50 rounded-xl flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">10% Off with Crypto</p>
              <p className="text-xs text-gray-400 mt-1">Instant 10% discount when you pay with crypto (BTC / USDT). PayID &amp; bank transfer also accepted.</p>
            </div>
          </div>

          <div className="bg-[#141414] p-6 rounded-2xl border border-red-900/40 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#1A1A1A] text-red-500 border border-red-900/50 rounded-xl flex items-center justify-center shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Whole-Carcass Butchery</p>
              <p className="text-xs text-gray-400 mt-1">Ground fresh daily by Alexandria master butchers with zero preservatives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Fresh Butcher Categories Grid */}
      <CategoryGridClient />

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#991B1B]/30 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
              Fresh Daily Cuts
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              Sydney&apos;s Best Selling Beef & Meats
            </h2>
          </div>
          <Link
            href="/shop/"
            className="text-sm font-bold text-red-400 hover:underline flex items-center space-x-1 mt-2 md:mt-0"
          >
            <span>View All {PRODUCTS.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Authority "About Our Sydney Butcher Workshop" Section */}
      <section className="bg-[#141414] border-y border-[#991B1B]/40 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
              Factual Brand Authority
            </span>
            <h2 className="text-3xl font-black text-white font-serif leading-tight">
              About Mr Meat & Co Workshop in Alexandria, Sydney
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Founded in {BRAND.foundingYear} at {BRAND.foundingLocation}, Mr Meat & Co was built on an uncompromising principle: delivering 100% Australian pasture-raised and grass-fed meats directly from local farms to households across NSW and — shipped frozen by express courier — nationwide, with zero middlemen or artificial additives.
            </p>

            <div className="space-y-3 pt-2">
              {BRAND.differentiation.map((diff, i) => (
                <div key={i} className="flex items-start space-x-3 text-sm text-gray-200 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                href="/about/"
                className="bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white px-6 py-3 rounded-xl text-xs font-black tracking-wide transition-colors border border-red-500/30"
              >
                Read Our Full Story & Principles →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#991B1B]/40 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-white font-serif border-b border-[#991B1B]/30 pb-3">
                Historical Milestones & Footprint
              </h3>
              <div className="space-y-4 text-xs">
                {BRAND.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <span className="px-2.5 py-1 bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white font-black rounded-lg shrink-0">
                      {m.year}
                    </span>
                    <p className="text-gray-300 font-medium pt-0.5">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] text-white rounded-3xl p-8 lg:p-12 border border-[#991B1B]/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-3 py-1 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-black uppercase rounded-md tracking-wider">
              Wholesale & Foodservice
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              Supplying Sydney&apos;s Top Restaurants & Cafes
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Custom portion cuts, vacuum sealing, volume tier discounts, and scheduled morning delivery across Sydney and NSW for chefs, restaurants, and caterers.
            </p>
          </div>
          <Link
            href="/wholesale/"
            className="bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white px-8 py-4 rounded-xl font-black text-sm tracking-wide shrink-0 transition-colors shadow-lg border border-red-500/30"
          >
            Apply for Wholesale Pricing →
          </Link>
        </div>
      </section>

      {/* Masterclass & Butchery Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#991B1B]/30 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
              Butchery Masterclass
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              Guides & Cooking Techniques
            </h2>
          </div>
          <Link href="/blog/" className="text-sm font-bold text-red-400 hover:underline">
            View All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="bg-[#141414] rounded-2xl border border-[#991B1B]/40 overflow-hidden shadow-sm hover:shadow-red-950/50 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-gray-900">
                <SmartImage src={post.image} alt={post.title} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px" className="object-cover" />
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-red-400 uppercase">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="text-gray-400">{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-2 line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </div>
                <span className="text-xs font-bold text-red-400 pt-2 border-t border-[#991B1B]/30">
                  Read Masterclass →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Meat Box Delivery — Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ.map((item, idx) => (
            <div key={idx} className="bg-[#141414] p-6 rounded-2xl border border-[#991B1B]/40 shadow-sm space-y-2">
              <h3 className="font-bold text-white text-base font-serif flex items-center space-x-2">
                <span className="text-red-400">Q:</span>
                <span>{item.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-6">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
