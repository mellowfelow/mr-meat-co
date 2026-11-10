'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/config/site';
import { SmartImage } from '@/components/SmartImage';
import { ArrowRight } from 'lucide-react';
import { useCustomStoreImages } from '@/lib/useCustomImages';

export function CategoryGridClient() {
  const customCategoryImages = useCustomStoreImages('tmc_gdrive_category_images');

  const getCategoryImage = (slug: string, defaultImage: string) => {
    const custom = customCategoryImages[slug];
    if (!custom) {
      return defaultImage;
    }
    return custom;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-red-900/40 pb-4">
        <div>
          <span className="text-xs font-bold uppercase text-red-500 tracking-widest">
            Artisanal Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Shop Fresh Butcher Categories
          </h2>
        </div>
        <Link
          href="/shop/"
          className="text-sm font-bold text-red-500 hover:underline flex items-center space-x-1 mt-2 md:mt-0"
        >
          <span>Explore All Categories</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const categoryImage = getCategoryImage(cat.slug, cat.image);

          return (
            <div
              key={cat.slug}
              className="group relative rounded-2xl overflow-hidden border border-red-900/40 bg-[#141414] shadow-md hover:shadow-red-900/20 transition-all duration-300 flex flex-col"
            >
              <Link href={`/${cat.slug}/`} className="block relative aspect-[4/3] bg-gray-900 overflow-hidden">
                <SmartImage
                  src={categoryImage}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-black uppercase text-red-500 tracking-wider mb-1">
                    Fresh Butcher Category
                  </div>
                  <h3 className="text-xl font-bold font-serif">{cat.name}</h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mt-1">{cat.description}</p>
                </div>
              </Link>

              {/* Subcategories Pills */}
              <div className="p-4 bg-[#1A1A1A] border-t border-zinc-800 space-y-2">
                <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Select Subcategory:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => {
                    const subSlug = sub
                      .toLowerCase()
                      .replace(/ & /g, '-')
                      .replace(/ \/ /g, '-')
                      .replace(/ /g, '-');
                    return (
                      <Link
                        key={sub}
                        href={`/${cat.slug}/${subSlug}/`}
                        aria-label={`${sub} ${cat.name}`}
                        className="px-2.5 py-1.5 bg-[#222] hover:bg-red-700 hover:text-white text-gray-300 rounded-md text-[11px] font-medium transition-colors border border-white/10"
                      >
                        {sub}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
