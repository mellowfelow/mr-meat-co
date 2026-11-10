import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PRODUCTS, SITE, PAGE_SEO, metaDesc, abs, faqHeading, CONTENT_UPDATED } from '@/config/site';
import { withOpenGraph } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { GuideSection } from '@/components/GuideSection';
import { SourcingNote } from '@/components/SourcingNote';
import { SmartImage } from '@/components/SmartImage';
import { ProductCard } from '@/components/ProductCard';

const seo = PAGE_SEO['/christmas-ham/'];

export const metadata: Metadata = seo
  ? withOpenGraph({
      title: { absolute: seo.title },
      description: metaDesc(seo.description),
      alternates: { canonical: `https://${SITE.domain}/christmas-ham/` },
      other: { 'og:updated_time': CONTENT_UPDATED },
    }, '/christmas-ham/')
  : {};

const HAM_SLUGS = ['whole-bone-in-christmas-ham', 'half-leg-christmas-ham', 'boneless-christmas-ham'];

export default function ChristmasHamPage() {
  const hams = HAM_SLUGS
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Christmas Ham', item: `https://${SITE.domain}/christmas-ham/` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema} />

      <div className="space-y-3 border-b border-red-900/40 pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-500">
          <Link href="/" className="hover:underline text-gray-400">Home</Link>
          <span>/</span>
          <span>Christmas Ham</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {seo?.h1 ?? 'Christmas Ham — Whole & Half Leg'}
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {seo?.intro ??
            'Australian bone-in leg ham for the Christmas table — whole, half and boneless. Pre-order for a December delivery window.'}
        </p>
        <SourcingNote variant="meat" />
      </div>

      {hams[0]?.main_image && (
        <div className="relative aspect-[21/9] sm:aspect-[3/1] w-full overflow-hidden rounded-2xl border border-[#991B1B]/40">
          <SmartImage
            src={hams[0].main_image}
            alt={`${seo?.primaryKeyword ?? 'Christmas ham'} — whole bone-in leg ham from Mr Meat & Co`}
            fill
            sizes="(max-width: 1024px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      )}

      <div className="bg-[#1C1414] border border-amber-500/40 rounded-2xl p-5 text-sm text-amber-200/90 leading-relaxed">
        <strong className="text-amber-300">Pre-order now for December.</strong> Christmas hams are cured and cooked to
        order and sell out every year. Choose your delivery window at checkout — aim for a few days before Christmas,
        not the 24th. Priced from; final price is set by the finished weight of your ham.
      </div>

      {hams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hams.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      <section className="bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 space-y-4">
        <h2 className="text-2xl font-black text-white font-serif">How to glaze and serve your ham</h2>
        <div className="text-sm text-gray-300 leading-relaxed space-y-3">
          <p>
            Your ham arrives fully cooked and cured — you&apos;re only finishing it. Run a knife around the shank, then
            slide your fingers under the skin and peel it off in one piece, leaving the fat behind. Score the fat in a
            diamond pattern about 5mm deep, stud with cloves if you like, and brush generously with glaze.
          </p>
          <p>
            Bake at 160°C, brushing with more glaze every 15–20 minutes, until deep amber and lacquered — about 45–60
            minutes for a half ham, 1–1.5 hours for a whole leg. Rest 15 minutes before carving. For the full method
            and three glaze recipes, read our{' '}
            <Link href="/blog/christmas-ham-glaze-guide/" className="text-red-400 font-semibold underline underline-offset-2 hover:text-red-300">
              Christmas ham glaze guide
            </Link>.
          </p>
        </div>
      </section>

      <GuideSection guide={seo?.guide} keyword={seo?.primaryKeyword} />

      {seo?.faqs && <SeoFaqSection faqs={seo.faqs} heading={faqHeading(seo?.primaryKeyword)} />}
    </div>
  );
}
