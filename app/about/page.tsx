import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import type { Metadata } from 'next';
import { SITE, BRAND, CONTACT } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { ShieldCheck, MapPin, Truck, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = withOpenGraph({
  title: 'About Our Sydney Craft Butcher Workshop',
  description: 'Mr Meat & Co — an Alexandria, Sydney craft butcher since 2018. 100% Australian grass-fed beef, whole-carcass butchery, cold-chain across NSW and nationwide.',
  alternates: {
    canonical: `https://${SITE.domain}/about/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
}, '/about/');

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE.name}`,
    description: BRAND.description,
    url: `https://${SITE.domain}/about/`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE.name,
      legalName: SITE.legalName,
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
        addressCountry: CONTACT.country,
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
        name: 'About',
        item: `https://${SITE.domain}/about/`,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <JsonLd data={[aboutSchema, breadcrumbSchema]} />

      {/* Header */}
      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Artisanal Heritage Since {BRAND.foundingYear}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif leading-tight">
          About Mr Meat & Co Workshop
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Craft butchery rooted in Australian pasture tradition, absolute transparency, and direct refrigerated cold-chain delivery across NSW — with frozen express-courier dispatch Australia-wide.
        </p>
      </div>

      {/* Featured Photo */}
      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-[#991B1B]/40 shadow-2xl">
        <SmartImage
          src="https://picsum.photos/seed/about-butcher/1200/600"
          alt="Mr Meat & Co Alexandria Sydney Workshop"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
          <span className="text-red-400 text-xs font-bold uppercase tracking-widest">
            Alexandria, NSW
          </span>
          <span className="text-white text-2xl font-black font-serif">
            Traditional Whole-Carcass Craft Butchery
          </span>
        </div>
      </div>

      {/* Longform Narrative Story (>700 words) */}
      <div className="bg-[#141414] p-8 sm:p-12 rounded-3xl border border-[#991B1B]/40 shadow-sm space-y-8 text-gray-300 leading-relaxed text-sm sm:text-base">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white font-serif">
            Our Founding Principles & Sydney Origins
          </h2>
          <p>
            Established in {BRAND.foundingYear} in Alexandria, Sydney, Mr Meat & Co was created to solve a growing problem in modern Australian meat retail: the disconnect between pasture-raised farmers and urban home cooks. As industrial supermarkets pushed central processing, chemical preservatives, and water-pumped meats into pre-packaged trays, our founders set out to build a traditional, transparent, whole-carcass craft butcher workshop.
          </p>
          <p>
            We believe that extraordinary meals begin with extraordinary livestock stewardship. Every piece of beef, lamb, and poultry handled in our Sydney workshop originates from 100% Australian family farms that adhere to strict 100-day grass-fed and free-range pasture grazing standards. By working directly with producers across regional New South Wales, the Riverina, and the Central Tablelands, we guarantee complete traceability from paddock to plate.
          </p>
        </section>

        <section className="space-y-4 border-t border-[#991B1B]/30 pt-6">
          <h2 className="text-2xl font-black text-white font-serif">
            Freshness Without Preservatives: Daily In-House Butchery
          </h2>
          <p>
            The cornerstone of our workshop is our signature Grass-Fed Premium Beef Mince. While mass-market mince is often reconstituted from frozen trim blocks and treated with nitrogen gas to artificially extend shelf color, our beef mince is ground fresh every single morning using whole chuck, brisket, and flank trim from freshly broken primals.
          </p>
          <p>
            We maintain exact lean-to-fat ratios—85/15 for our everyday premium mince and 80/20 for our Wagyu Reserve blend—without adding water, synthetic binding agents, or artificial nitrates. Our master butchers trim, portion, and vacuum-pack or butcher-wrap each order specifically for your scheduled delivery window, ensuring that the meat you receive retains its natural muscle structure, high protein density, and rich authentic beef flavor.
          </p>
        </section>

        <section className="space-y-4 border-t border-[#991B1B]/30 pt-6">
          <h2 className="text-2xl font-black text-white font-serif">
            Temperature-Controlled Cold-Chain Express Delivery
          </h2>
          <p>
            Craft butchery is only half of the equation; maintaining an unbroken cold chain until the parcel arrives at your kitchen counter is equally crucial. To achieve this, Mr Meat & Co engineered a specialized refrigerated packaging and logistics framework.
          </p>
          <p>
            Every order is carefully packed inside 100% recyclable thermal insulated box liners alongside heavy-duty non-toxic gel ice packs capable of sustaining sub-4°C internal temperatures for up to 36 hours. Our fleet of specialized refrigerated delivery vehicles services Sydney Metro and regional NSW, including Wollongong and the Central Coast. For the rest of Australia, orders are snap-frozen and sent in insulated packaging by express courier. Whether you are home or at work, your meat order stays safely chilled until you are ready to transfer it to your refrigerator or freezer.
          </p>
        </section>

        <section className="space-y-4 border-t border-[#991B1B]/30 pt-6">
          <h2 className="text-2xl font-black text-white font-serif">
            Direct Ordering, PayID & Crypto Innovation
          </h2>
          <p>
            We believe in passing operational savings directly back to our customers. By streamlining our ordering process through direct web-assisted order drafts, WhatsApp messaging, PayID, and direct Cryptocurrency payments (Bitcoin BTC and Tether USDT), we bypass expensive credit card processing fees.
          </p>
          <p>
            We pass those savings directly to you: every customer who pays with cryptocurrency (Bitcoin BTC or Tether USDT) automatically receives an instant 10% discount off their total order. PayID and bank transfer are also accepted with no card surcharge. Combined with free refrigerated delivery across NSW on orders over $300 AUD, households across New South Wales — and, by frozen express courier, the rest of Australia — enjoy premium restaurant-grade butcher meats at fair, transparent pricing.
          </p>
        </section>

        <div className="p-6 bg-[#1A1A1A] rounded-2xl border border-[#991B1B]/40 space-y-3 pt-4">
          <h3 className="font-bold text-white font-serif text-base">
            Core Quality Commitments:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-200">
            {BRAND.differentiation.map((d, i) => (
              <div key={i} className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center bg-[#141414] text-white p-10 rounded-3xl space-y-4 border border-[#991B1B]/50 shadow-2xl">
        <h3 className="text-2xl font-bold font-serif">Taste the Difference of Real Craft Butchery</h3>
        <p className="text-xs text-gray-300 max-w-lg mx-auto">
          Minimum order $300 AUD. Free cold-chain delivery across NSW; frozen express courier Australia-wide.
        </p>
        <Link
          href="/shop/"
          className="inline-block bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white border border-red-500/30 px-8 py-3.5 rounded-xl text-xs font-black tracking-wide shadow-lg"
        >
          Shop Fresh Beef & Meats Now →
        </Link>
      </div>
    </div>
  );
}
