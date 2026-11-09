import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import type { Metadata } from 'next';
import { FAQ, FAQ_GROUPS, SITE } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = withOpenGraph({
  title: 'FAQ | Delivery, Payment, Cuts & Bulk Orders',
  description:
    'Answers on cold-chain meat delivery across NSW and nationwide, the $300 minimum, the crypto-only 10% discount, grass-fed provenance, cuts and bulk shares.',
  alternates: {
    canonical: `https://${SITE.domain}/faq/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
}, '/faq/');

export default function FAQPage() {
  // Combine the homepage FAQ set with every themed group for one FAQPage block.
  const allItems = [
    ...FAQ,
    ...FAQ_GROUPS.flatMap((g) => g.items),
  ];

  // De-duplicate by question (the homepage set overlaps a couple of group answers).
  const seen = new Set<string>();
  const schemaItems = allItems.filter((i) => {
    const key = i.question.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: schemaItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: `https://${SITE.domain}/faq/` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={[faqSchema, breadcrumbSchema]} />

      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6 text-center">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Customer & Delivery Help
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-300 text-sm max-w-2xl mx-auto">
          Everything about ordering 100% Australian grass-fed meat — minimum order and delivery,
          the crypto-only discount, provenance, cuts and cooking, kangaroo and specialty meat,
          wholesale shares, live poultry and raw pet feeding.
        </p>
      </div>

      {/* Section nav */}
      <nav className="flex flex-wrap gap-2 justify-center">
        {FAQ_GROUPS.map((g) => (
          <a
            key={g.heading}
            href={`#${slugify(g.heading)}`}
            className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-red-700 hover:text-white text-gray-300 text-xs font-bold rounded-lg border border-red-900/40 transition-colors"
          >
            {g.heading}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {FAQ_GROUPS.map((group) => (
          <section key={group.heading} id={slugify(group.heading)} className="space-y-4 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif border-b border-[#991B1B]/30 pb-2">
              {group.heading}
            </h2>
            {group.intro && <p className="text-sm text-gray-400 leading-relaxed">{group.intro}</p>}
            <div className="space-y-4">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] p-5 sm:p-6 rounded-2xl border border-[#991B1B]/40 shadow-sm space-y-2"
                >
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <h3 className="font-bold text-white text-sm sm:text-base font-serif">
                      {item.question}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-8">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="p-8 bg-[#141414] rounded-3xl border border-[#991B1B]/40 text-center space-y-4 shadow-xl">
        <h3 className="font-bold font-serif text-white text-lg">Still have questions?</h3>
        <p className="text-xs text-gray-300 max-w-md mx-auto">
          Our Sydney master butchers can help with custom orders, delivery, cut sheets, wholesale
          accounts and live poultry enquiries.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact/"
            className="bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md border border-red-500/30 hover:from-red-600 hover:to-red-900"
          >
            Contact the butcher team
          </Link>
        </div>
      </div>
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
