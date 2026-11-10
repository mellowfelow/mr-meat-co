'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { ArrowRight, MessageSquare, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { CONTACT, SHOP } from '@/config/site';
import { useCustomStoreImages } from '@/lib/useCustomImages';

const HERO_SLIDES = [
  {
    id: 1,
    tag: "Australian Craft Butcher · Alexandria, Sydney",
    title: "Grass-Fed Meat Boxes & Craft Butcher Cuts, Delivered",
    description: "100% Australian pasture-raised beef, fresh gourmet beef mince, dry-aged Wagyu steaks, and custom freezer boxes delivered to your door — refrigerated cold-chain vans across NSW, frozen express courier Australia-wide.",
    image: "/images/hero/hero-1.webp",
    ctaText: "Shop Fresh Beef & Meats",
    ctaLink: "/shop/",
    isH1: true,
  },
  {
    id: 2,
    tag: "100% Australian Pasture-Raised Beef",
    title: "Prime Scotch Fillets, Wagyu & Dry-Aged Steaks",
    description: "Hand-selected by master butchers in Alexandria. Vacuum sealed for peak freshness and tenderness. Free cold-chain delivery across NSW on orders $300+; frozen courier Australia-wide.",
    image: "/images/hero/hero-2.webp",
    ctaText: "Explore Steak Collection",
    ctaLink: "/beef/steaks/",
    isH1: false,
  },
  {
    id: 3,
    tag: "Freshly Ground Daily in Alexandria",
    title: "Artisanal Gourmet Mince, Sausages & Burgers",
    description: "Ground whole-carcass muscle cuts with optimal meat-to-fat ratios. Zero fillers, artificial preservatives, or binders.",
    image: "/images/hero/hero-3.webp",
    ctaText: "Shop Mince & Diced",
    ctaLink: "/beef/mince-diced/",
    isH1: false,
  },
  {
    id: 4,
    tag: "Slow Cooking & Family Roasts",
    title: "Mouthwatering Briskets, Ribs & Oxtail Cuts",
    description: "Perfect for winter braising, smoker BBQ, or slow roasting. Australian pasture-raised cuts packed fresh for your kitchen.",
    image: "/images/hero/hero-4.webp",
    ctaText: "Shop Slow Cooking Cuts",
    ctaLink: "/beef/slow-cook/",
    isH1: false,
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Slides 2-4 are only mounted once the first paint is done, so their images
  // don't compete with slide 1 (the LCP element) for bandwidth.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 3500);
    return () => clearTimeout(t);
  }, []);
  const customHeroImages = useCustomStoreImages('tmc_gdrive_hero_images');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const getSlideImage = (slideId: number, defaultImage: string) => {
    const custom = customHeroImages[`hero-${slideId}`];
    if (!custom) {
      return defaultImage;
    }
    return custom;
  };

  return (
    <section className="relative bg-[#0D0D0D] text-white overflow-hidden border-b border-red-900/40 min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Background Image Carousel with Scrim Overlay */}
      {HERO_SLIDES.map((slide, idx) => {
        if (idx !== 0 && !armed && idx !== currentSlide) return null;
        const slideImage = getSlideImage(slide.id, slide.image);
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <SmartImage
              src={slideImage}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover object-center scale-105 transition-transform duration-10000"
            />
            {/* Multi-stage dark gradient scrim for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-black/60" />
          </div>
        );
      })}

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 w-full">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#1A1A1A]/80 border border-red-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-400 tracking-wide uppercase backdrop-blur-md">
            <Flame className="w-4 h-4 text-red-500" />
            <span>{HERO_SLIDES[currentSlide].tag}</span>
          </div>

          {/* H1 strictly on Slide 1, styled div/p on other slides */}
          {HERO_SLIDES[currentSlide].isH1 ? (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-serif text-white drop-shadow-md">
              {HERO_SLIDES[currentSlide].title}
            </h1>
          ) : (
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-serif text-white drop-shadow-md">
              {HERO_SLIDES[currentSlide].title}
            </div>
          )}

          <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-medium">
            {HERO_SLIDES[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              href={HERO_SLIDES[currentSlide].ctaLink}
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-black text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>{HERO_SLIDES[currentSlide].ctaText}</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>

            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 px-6 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all backdrop-blur-sm"
            >
              <MessageSquare className="w-5 h-5 text-red-400" />
              <span>WhatsApp Direct Order</span>
            </a>
          </div>

          {/* Quick Badges */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4 sm:gap-6 text-xs text-gray-300 font-semibold">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Free Delivery on Orders ${SHOP.freeShippingThreshold}+</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>100% Australian Beef</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>10% Off with Crypto</span>
            </span>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-3">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="p-3 rounded-full bg-black/60 border border-zinc-700 text-white hover:bg-red-700 hover:text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 px-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group flex h-6 items-center justify-center px-1"
            >
              <span
                className={`block h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'w-8 bg-red-600' : 'w-2.5 bg-white/40 group-hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="p-3 rounded-full bg-black/60 border border-zinc-700 text-white hover:bg-red-700 hover:text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
