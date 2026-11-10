'use client';

import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, type Product } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, X, RotateCcw, ChevronDown, Check, SlidersHorizontal, Flame } from 'lucide-react';

interface ShopFilterClientProps {
  initialCategory?: string;
}

// Wholesale / bulk-share products live in their own /wholesale/ section and must
// never appear in the retail shop (different pricing model + checkout).
const RETAIL_PRODUCTS = PRODUCTS.filter(
  (p) => (p.main_category || p.category || '').toLowerCase() !== 'wholesale' && !p.is_wholesale
);

/* ------------------------------------------------------------------ *
 * Strict filter rules.
 * These match on STRUCTURED fields (main_category, subcategory,
 * product_type, product_format, cooking_methods, collections,
 * pet_food_only) — never on a blob of concatenated marketing copy —
 * so the result set is predictable and stable.
 * ------------------------------------------------------------------ */

const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);
const has = (list: unknown, re: RegExp) => arr(list).some((x) => re.test(x));
const rx = (p: Product, re: RegExp) =>
  re.test(p.product_name || '') || re.test(p.full_description || p.description || '');

export const CUT_STYLE_RULES: Record<string, (p: Product) => boolean> = {
  steaks: (p) =>
    ['Steaks', 'Chops & Cutlets', 'Chops & Steaks'].includes(p.subcategory) ||
    (/\b(steak|chop|cutlet)\b/i.test(p.product_type || '') &&
      !/pack|mince|schnitzel/i.test(p.product_type || '')),

  mince: (p) =>
    !p.pet_food_only &&
    (['Mince & Diced', 'Mince', 'Stir-Fry'].includes(p.subcategory) ||
      /\b(mince|diced|strips)\b/i.test(p.product_type || '') ||
      has(p.product_format, /diced/i) ||
      has(p.cooking_methods, /stir.?fry/i)),

  slowcook: (p) =>
    ['Roasts', 'Slow Cook', 'Whole Birds'].includes(p.subcategory) ||
    has(p.cooking_methods, /slow cook|braise/i) ||
    /\b(roast|brisket|osso buco|shank|shin|cheek|silverside|corned|hock|chuck)\b/i.test(p.product_type || ''),

  bbq: (p) =>
    p.main_category === 'bbq-grill' ||
    p.subcategory === 'BBQ' ||
    /\b(skewer|kebab|kofta|burger|rib|patties|patty)\b/i.test(p.product_type || ''),

  ready: (p) =>
    p.main_category === 'ready-to-cook' ||
    p.subcategory === 'Crumbed' ||
    has(p.product_format, /crumbed|marinated|ready to cook/i) ||
    /\b(schnitzel|crumbed|kiev|cordon bleu|tenders)\b/i.test(p.product_type || ''),

  bacon: (p) =>
    ['Bacon & Ham'].includes(p.subcategory) ||
    /\b(bacon|ham)\b/i.test(p.product_type || ''),

  boxes: (p) =>
    p.main_category === 'meat-boxes' ||
    /\bpacks?\b/i.test(p.subcategory || '') ||
    /\b(box|pack)\b/i.test(p.product_type || ''),

  pet: (p) => Boolean(p.pet_food_only) || p.main_category === 'pet-food',
};

export const PROVENANCE_RULES: Record<string, (p: Product) => boolean> = {
  'grass-fed': (p) =>
    ['beef', 'lamb'].includes(p.main_category) ||
    (p.main_category === 'sausages' && ['Beef', 'Lamb'].includes(p.subcategory)) ||
    rx(p, /grass.?fed|pasture.?raised/i),

  'free-range': (p) =>
    p.main_category === 'chicken' ||
    (p.main_category === 'sausages' && p.subcategory === 'Chicken') ||
    /free.?range/i.test(p.product_type || '') ||
    rx(p, /free.?range/i),

  wagyu: (p) =>
    rx(p, /wagyu|dry.?aged/i) ||
    /wagyu|dry.?aged/i.test(p.badge || '') ||
    has(p.collections, /^premium$/i),

  frozen: (p) =>
    p.storage_type === 'Frozen' || has(p.product_format, /^frozen$/i),

  'high-protein': (p) =>
    has(p.collections, /meal prep/i) ||
    /\b(lean|high.?protein|meal.?prep)\b/i.test(p.product_name || '') ||
    (p.main_category === 'specialty-meat' &&
      /kangaroo|venison/i.test(`${p.subcategory} ${p.product_type}`)) ||
    (p.main_category === 'meat-boxes' && /lean|meal prep|protein/i.test(`${p.subcategory} ${p.product_name}`)),
};

export function ShopFilterClient({ initialCategory = 'all' }: ShopFilterClientProps) {
  const [prevInitialCategory, setPrevInitialCategory] = useState<string>(initialCategory);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedCutStyle, setSelectedCutStyle] = useState<string>('all');
  const [selectedProvenance, setSelectedProvenance] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  // Only the first PAGE_SIZE cards are rendered up front (the full 330-card
  // grid made /shop/ a ~1.5MB document); "Show more" reveals the rest.
  const PAGE_SIZE = 60;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const filterSig = `${selectedCategory}|${selectedSubcategory}|${selectedCutStyle}|${selectedProvenance}|${selectedPriceRange}|${searchQuery}|${sortBy}`;
  const [prevFilterSig, setPrevFilterSig] = useState<string>(filterSig);
  if (prevFilterSig !== filterSig) {
    setPrevFilterSig(filterSig);
    setVisibleCount(PAGE_SIZE);
  }

  if (prevInitialCategory !== initialCategory) {
    setPrevInitialCategory(initialCategory);
    setSelectedCategory(initialCategory);
  }

  // Reset subcategory when main category changes
  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubcategory('all');
  };

  // Get current active category object
  const currentCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES.find((c) => c.slug === selectedCategory) || null;
  }, [selectedCategory]);

  // Compute available subcategories for the selected category or overall
  const availableSubcategories = useMemo(() => {
    if (currentCategoryObj) {
      return currentCategoryObj.subcategories;
    }
    // Aggregate unique subcategories across all products
    const subs = new Set<string>();
    RETAIL_PRODUCTS.forEach((p) => {
      if (p.subcategory) subs.add(p.subcategory);
    });
    return Array.from(subs);
  }, [currentCategoryObj]);

  // Filter products based on all filter parameters
  const filteredProducts = useMemo(() => {
    return RETAIL_PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Subcategory Filter
      if (selectedSubcategory !== 'all') {
        const subLower = selectedSubcategory.toLowerCase();
        const primaryMatch = product.subcategory && product.subcategory.toLowerCase() === subLower;
        const secondaryMatch = Array.isArray(product.secondary_subcategories) && product.secondary_subcategories.some((s) => s.toLowerCase() === subLower);
        if (!primaryMatch && !secondaryMatch) {
          return false;
        }
      }

      // 3. Cut & Cooking Style Filter (strict, structured)
      if (selectedCutStyle !== 'all') {
        const rule = CUT_STYLE_RULES[selectedCutStyle];
        if (rule && !rule(product)) return false;
      }

      // 4. Craft Provenance & Attribute Filter (strict, structured)
      if (selectedProvenance !== 'all') {
        const rule = PROVENANCE_RULES[selectedProvenance];
        if (rule && !rule(product)) return false;
      }

      // 5. Price Range Filter
      if (selectedPriceRange !== 'all') {
        const pPrice = product.price ?? 0;
        if (product.price === null) return false;
        if (selectedPriceRange === 'under-30' && pPrice >= 30) return false;
        if (selectedPriceRange === '30-60' && (pPrice < 30 || pPrice > 60)) return false;
        if (selectedPriceRange === 'over-60' && pPrice <= 60) return false;
      }

      // 6. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const fullText = `${product.name} ${product.category} ${product.subcategory || ''} ${product.description} ${product.shortDescription}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCategory, selectedSubcategory, selectedCutStyle, selectedProvenance, selectedPriceRange, searchQuery, sortBy]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedSubcategory !== 'all') count++;
    if (selectedCutStyle !== 'all') count++;
    if (selectedProvenance !== 'all') count++;
    if (selectedPriceRange !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedSubcategory, selectedCutStyle, selectedProvenance, selectedPriceRange, searchQuery]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedCutStyle('all');
    setSelectedProvenance('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: RETAIL_PRODUCTS.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.slug] = RETAIL_PRODUCTS.filter((p) => p.category === cat.slug).length;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. TOP MOBILE & DESKTOP CATEGORY NAV (HORIZONTALLY SCROLLABLE) */}
      <div className="bg-[#1C1414] p-3 sm:p-4 rounded-2xl border border-[#991B1B]/40 shadow-xl">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Butcher Categories ({CATEGORIES.length})
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-300">
            {filteredProducts.length} Items Available
          </span>
        </div>

        <div className="flex items-center space-x-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-red-900/40 flex-nowrap">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`shrink-0 flex-shrink-0 min-w-max px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white border border-red-400/50 shadow-md shadow-red-950/50'
                : 'bg-[#281818] hover:bg-[#382020] text-gray-200 border border-[#991B1B]/40'
            }`}
          >
            <span>All Meats</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold font-mono shrink-0 ${
              selectedCategory === 'all' ? 'bg-white text-red-900' : 'bg-[#120D0D] text-red-400 border border-red-900/40'
            }`}>
              {categoryCounts.all}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            const count = categoryCounts[cat.slug] || 0;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`shrink-0 flex-shrink-0 min-w-max px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white border border-red-400/50 shadow-md shadow-red-950/50'
                    : 'bg-[#281818] hover:bg-[#382020] text-gray-200 border border-[#991B1B]/40'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold font-mono shrink-0 ${
                  isActive ? 'bg-white text-red-900' : 'bg-[#120D0D] text-red-400 border border-red-900/40'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SEARCH BAR & CONTROLS ROW */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1C1414] p-4 rounded-2xl border border-[#991B1B]/40">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Scotch Fillet, Beef Mince, Lamb Cutlets, Schnitzel..."
            className="w-full pl-11 pr-10 py-3 bg-[#120D0D] border border-[#991B1B]/40 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
          />
          <Search className="w-4 h-4 text-red-500 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center space-x-3">
          {/* Sort Selector */}
          <div className="relative flex-1 md:flex-initial min-w-[170px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-bold py-3 pl-3.5 pr-8 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="featured">Sort: Butcher Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <ChevronDown className="w-4 h-4 text-red-500 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center space-x-2 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white font-black px-4 py-3 rounded-xl text-xs shadow-md border border-red-400/30"
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
            <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* 3. ACTIVE FILTER CHIPS BAR */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-[#281818] p-3 rounded-xl border border-[#991B1B]/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 mr-1">
            Active Filters:
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Category: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
              <button type="button" onClick={() => setSelectedCategory('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSubcategory !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Sub: {selectedSubcategory}</span>
              <button type="button" onClick={() => setSelectedSubcategory('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCutStyle !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Cut: {selectedCutStyle}</span>
              <button type="button" onClick={() => setSelectedCutStyle('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedProvenance !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Claim: {selectedProvenance}</span>
              <button type="button" onClick={() => setSelectedProvenance('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPriceRange !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Price: {selectedPriceRange}</span>
              <button type="button" onClick={() => setSelectedPriceRange('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Keyword: &quot;{searchQuery}&quot;</span>
              <button type="button" onClick={() => setSearchQuery('')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="ml-auto flex items-center space-x-1 text-[11px] text-red-400 hover:underline font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* 4. MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTER PANEL */}
        <aside className="hidden lg:block space-y-6 bg-[#1C1414] p-5 rounded-2xl border border-[#991B1B]/40 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#991B1B]/30">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-red-500" />
              <h2 className="font-bold text-white text-sm font-serif">Refine Meat Cuts</h2>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-red-400 hover:underline font-bold"
              >
                Clear ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Filter Group 1: Subcategories */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              {currentCategoryObj ? `${currentCategoryObj.name} Subcategories` : 'Popular Subcategories'}
            </label>
            <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedSubcategory === 'all'
                    ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                    : 'text-gray-300 hover:bg-[#281818]'
                }`}
              >
                <span>All Subcategories</span>
                {selectedSubcategory === 'all' && <Check className="w-3 h-3 text-red-400" />}
              </button>
              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedSubcategory.toLowerCase() === sub.toLowerCase()
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{sub}</span>
                  {selectedSubcategory.toLowerCase() === sub.toLowerCase() && (
                    <Check className="w-3 h-3 text-red-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 2: Cut & Cooking Style */}
          <div className="space-y-2 pt-3 border-t border-[#991B1B]/30">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              Cut & Cooking Style
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Cuts & Styles' },
                { id: 'steaks', label: '🥩 Steaks & Cutlets' },
                { id: 'mince', label: '🍳 Mince, Diced & Stir-Fry' },
                { id: 'slowcook', label: '🍲 Slow Cook & Roasts' },
                { id: 'bbq', label: '🔥 BBQ, Ribs & Skewers' },
                { id: 'ready', label: '🥖 Crumbed & Ready-to-Cook' },
                { id: 'bacon', label: '🥓 Bacon & Ham' },
                { id: 'boxes', label: '📦 Meat Boxes & Bundles' },
                { id: 'pet', label: '🐶 BARF Raw Pet Food' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCutStyle(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCutStyle === item.id
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedCutStyle === item.id && <Check className="w-3 h-3 text-red-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 3: Provenance & Attributes */}
          <div className="space-y-2 pt-3 border-t border-[#991B1B]/30">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              Craft Provenance & Attributes
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Attributes' },
                { id: 'grass-fed', label: '🌿 100% Grass-Fed / Pasture-Raised' },
                { id: 'free-range', label: '🐔 Free-Range Poultry' },
                { id: 'wagyu', label: '🌟 Wagyu & Dry-Aged Premium' },
                { id: 'frozen', label: '❄️ Frozen' },
                { id: 'high-protein', label: '💪 High Protein / Meal Prep' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProvenance(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedProvenance === item.id
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedProvenance === item.id && <Check className="w-3 h-3 text-red-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 4: Price Bucket */}
          <div className="space-y-2 pt-3 border-t border-[#991B1B]/30">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              Price Range (AUD)
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-30', label: 'Under $30 (Everyday Cuts)' },
                { id: '30-60', label: '$30 – $60 (Roasts & Steaks)' },
                { id: 'over-60', label: '$60+ (Meat Boxes & Wagyu)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPriceRange(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedPriceRange === item.id
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedPriceRange === item.id && <Check className="w-3 h-3 text-red-400" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID CONTAINER */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#1C1414] p-10 text-center rounded-2xl border border-[#991B1B]/40 space-y-4">
              <div className="w-12 h-12 bg-[#281818] border border-[#991B1B]/40 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">No Meat Cuts Match Your Filter Criteria</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Try resetting or relaxing your category, subcategory, or price filters to view our full selection of 100% Australian grass-fed beef and fresh meats.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md border border-red-400/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
          {filteredProducts.length > visibleCount && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="min-h-[44px] rounded-xl border border-red-800/60 bg-[#1A1A1A] px-8 py-3 text-sm font-bold text-white hover:bg-[#281818]"
              >
                Show more products ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE SLIDE-OVER FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#1C1414] border-l border-[#991B1B]/40 h-full overflow-y-auto p-6 flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#991B1B]/30">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-red-500" />
                  <h3 className="font-black text-white text-base font-serif">Meat Filters</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Subcategories */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Subcategory</label>
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('all')}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                      selectedSubcategory === 'all'
                        ? 'bg-[#B91C1C] text-white font-bold'
                        : 'bg-[#281818] text-gray-200'
                    }`}
                  >
                    All Subcategories
                  </button>
                  {availableSubcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                        selectedSubcategory.toLowerCase() === sub.toLowerCase()
                          ? 'bg-[#B91C1C] text-white font-bold'
                          : 'bg-[#281818] text-gray-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Cut & Style */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Cut & Style</label>
                <select
                  value={selectedCutStyle}
                  onChange={(e) => setSelectedCutStyle(e.target.value)}
                  className="w-full bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs p-3 rounded-xl"
                >
                  <option value="all">All Cuts & Styles</option>
                  <option value="steaks">🥩 Steaks & Cutlets</option>
                  <option value="mince">🍳 Mince, Diced & Stir-Fry</option>
                  <option value="slowcook">🍲 Slow Cook & Roasts</option>
                  <option value="bbq">🔥 BBQ, Ribs & Skewers</option>
                  <option value="ready">🥖 Crumbed & Ready-to-Cook</option>
                  <option value="bacon">🥓 Bacon & Ham</option>
                  <option value="boxes">📦 Meat Boxes & Bundles</option>
                  <option value="pet">🐶 BARF Raw Pet Food</option>
                </select>
              </div>

              {/* Mobile Provenance */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Craft Attributes</label>
                <select
                  value={selectedProvenance}
                  onChange={(e) => setSelectedProvenance(e.target.value)}
                  className="w-full bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs p-3 rounded-xl"
                >
                  <option value="all">All Attributes</option>
                  <option value="grass-fed">🌿 100% Grass-Fed / Pasture-Raised</option>
                  <option value="free-range">🐔 Free-Range Poultry</option>
                  <option value="wagyu">🌟 Wagyu & Dry-Aged Premium</option>
                  <option value="frozen">❄️ Frozen</option>
                  <option value="high-protein">💪 High Protein / Meal Prep</option>
                </select>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs p-3 rounded-xl"
                >
                  <option value="all">All Prices</option>
                  <option value="under-30">Under $30</option>
                  <option value="30-60">$30 – $60</option>
                  <option value="over-60">$60+</option>
                </select>
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="pt-4 border-t border-[#991B1B]/30 flex gap-2">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 bg-[#281818] text-white py-3 rounded-xl text-xs font-bold border border-[#991B1B]/30"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-[2] bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white py-3 rounded-xl text-xs font-black shadow-md border border-red-400/30"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
