import React from 'react';
import { notFound } from 'next/navigation';
import { POSTS, SITE, abs, fitTitle, metaDesc } from '@/config/site';
import { withOpenGraph } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { Article } from '@/components/Article';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return withOpenGraph({
    // fitted to <=60 chars with the brand suffix when it fits
    title: { absolute: fitTitle(post.seoTitle || post.title) },
    description: metaDesc(post.metaDescription || post.excerpt || ''),
    alternates: {
      canonical: `https://${SITE.domain}/blog/${post.slug}/`,
    },
    openGraph: {
      images: [{ url: abs(post.image) }],
      type: 'article',
    },
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const words = (t: string) => new Set(t.toLowerCase().match(/[a-z]{4,}/g) || []);
  const mine = words(`${post.title} ${post.primaryKeyword || ''}`);
  const related = POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = p.category === post.category ? 2 : 0;
      for (const w of words(`${p.title} ${p.primaryKeyword || ''}`)) if (mine.has(w)) score++;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (b.p.date > a.p.date ? 1 : -1))
    .slice(0, 3)
    .map((x) => x.p);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [abs(post.image)],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Organization',
      name: SITE.name,
      url: `https://${SITE.domain}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `https://${SITE.domain}/images/logo.png`,
      },
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${SITE.domain}/blog/${post.slug}/`,
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
        name: 'Blog',
        item: `https://${SITE.domain}/blog/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://${SITE.domain}/blog/${post.slug}/`,
      },
    ],
  };

  const faqSchema = post.faqs && post.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  const schemas = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={schemas} />

      <Link href="/blog/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Masterclass Articles</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-xs font-bold text-red-400 uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1 text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif leading-tight">
          {post.title}
        </h1>
        <p className="text-base text-gray-300 leading-relaxed font-medium">
          {post.excerpt}
        </p>
      </div>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#991B1B]/40 shadow-md">
        <SmartImage src={post.image} alt={post.title} fill priority className="object-cover" />
      </div>

      {/* Content body */}
      <div className="bg-[#141414] p-6 sm:p-10 lg:p-12 rounded-3xl border border-[#991B1B]/40 shadow-sm max-w-none">
        {post.content ? <Article content={post.content} /> : <p className="text-gray-200">{post.excerpt}</p>}
      </div>

      {/* Article FAQ */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 space-y-4">
          <h2 className="text-2xl font-black text-white font-serif">Frequently asked questions</h2>
          <div className="divide-y divide-[#991B1B]/20">
            {post.faqs.map((f, i) => (
              <div key={i} className="py-4">
                <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">{f.question}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related guides — internal links between posts (each guide was previously linked only from /blog/) */}
      {related.length > 0 && (
        <nav aria-label="Related guides" className="bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 space-y-4">
          <h2 className="text-2xl font-black text-white font-serif">Related guides</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}/`}
                  className="block h-full rounded-2xl border border-[#991B1B]/30 bg-[#1A1A1A] p-4 hover:border-red-600 transition-colors"
                >
                  <span className="block text-[11px] font-bold uppercase tracking-wide text-red-400">{r.category}</span>
                  <span className="mt-1 block text-sm font-bold text-white leading-snug">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Bottom CTA Box */}
      <div className="bg-[#141414] text-white p-8 rounded-3xl space-y-4 text-center border border-[#991B1B]/50 shadow-xl">
        <h3 className="text-xl font-bold font-serif">
          {post.cta?.note || '100% Australian meat — cold-chain across NSW, frozen courier Australia-wide.'}
        </h3>
        <Link
          href={post.cta?.href || '/shop/'}
          className="inline-block bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] hover:from-red-600 hover:to-red-900 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wide shadow-lg border border-red-500/30"
        >
          {post.cta?.label || 'Shop the full range →'}
        </Link>
      </div>
    </div>
  );
}
