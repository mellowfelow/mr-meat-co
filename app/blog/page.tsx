import React from 'react';
import { withOpenGraph } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { POSTS, SITE, CONTENT_UPDATED } from '@/config/site';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = withOpenGraph({
  title: 'Butchery Masterclass & Cooking Guides Sydney',
  description: 'Master butchery tips, fat ratios for beef mince, dry-aging techniques, and cold-chain storage from Sydney master butchers.',
  alternates: {
    canonical: `https://${SITE.domain}/blog/`,
  },
  other: {
    'og:updated_time': CONTENT_UPDATED,
  },
}, '/blog/');

export default function BlogIndexPage() {
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
        name: 'Blog',
        item: `https://${SITE.domain}/blog/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={breadcrumbSchema} />

      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Craft Butchery Knowledge
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          Butchery Masterclass & Culinary Guides
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          Learn expert techniques on choosing beef mince fat ratios, pan-searing dry-aged steaks, and preserving maximum flavor in Australian pasture-raised meats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}/`}
            className="group bg-[#141414] rounded-2xl border border-[#991B1B]/40 overflow-hidden shadow-sm hover:border-red-500/80 hover:shadow-red-950/40 transition-all flex flex-col"
          >
            <div className="relative aspect-[16/9] bg-[#0D0D0D] overflow-hidden">
              <SmartImage
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span className="text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-white text-lg mt-2 group-hover:text-red-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="pt-3 border-t border-[#991B1B]/30 text-xs font-bold text-red-400 flex items-center justify-between">
                <span>Read Masterclass</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
