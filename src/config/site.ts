export interface Product {
  product_id: string;
  product_name: string;
  main_category: string;
  subcategory: string;
  primary_product_category?: string;
  secondary_subcategories?: string[];
  collections: string[];
  tags?: string[];
  slug: string;
  short_description: string;
  full_description: string;
  price: number | null;
  sale_price: number | null;
  price_type: 'per_kg' | 'per_item' | 'per_pack' | 'per_box' | 'fixed_box_price' | 'from_price' | 'variable_weight' | 'configurable_box_price' | 'fixed_pack_price';
  currency?: string;
  weight: string | null;
  pack_size: string | null;
  stock_status: 'In Stock' | 'Out of Stock' | 'Pre-Order' | 'Seasonal' | 'Discontinued';
  storage_type: 'Fresh Chilled' | 'Frozen' | 'Refrigerated' | 'To be confirmed' | string;
  product_type: string;
  cut_type?: string;
  cutType?: string;
  animal_protein?: string;
  pet_food_only?: boolean;
  human_consumption_warning?: string;
  feeding_instructions?: string;
  handling_instructions?: string;
  cooking_methods: string[];
  product_format: string[];
  quality_attributes: string[] | null;
  country_of_origin: string | null;
  supplier: string | null;
  quality_claims?: string | string[] | null;
  ingredients: string | null;
  allergen_information: string | null;
  storage_instructions: string | null;
  use_by_date?: string | null;
  cooking_instructions: string | null;
  SKU: string;
  barcode_or_GTIN: string | null;
  main_image: string;
  gallery_images: string[];
  SEO_title: string;
  SEO_meta_description: string;
  seo_title?: string;
  seo_meta_description?: string;
  breadcrumb_path: string;

  // Wholesale Bulk & Animal Share specific fields
  is_wholesale?: boolean;
  approximate_weight?: string | null;
  bulk_order_notice?: string | null;
  product_contents?: string[] | null;
  is_animal_share?: boolean;

  // Meat Box & Value Pack specific fields
  approximate_total_weight?: string | null;
  box_contents?: { name: string; quantity: string; slug?: string }[];
  pack_contents?: Record<string, string>;
  included_product_references?: string[];
  min_order_value?: number;

  // Compatibility aliases for UI rendering
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  image: string;
  featured?: boolean;
  badge?: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  subcategories: string[];
  image: string;
}

export interface Post {
  slug: string;
  title: string;
  /** Optional ≤60-char title for <title>/SERP; falls back to `title`. */
  seoTitle?: string;
  excerpt: string;
  /** Optional ~150-char meta description; falls back to `excerpt`. */
  metaDescription?: string;
  category: string;
  date: string;
  updated?: string;
  readTime: string;
  image: string;
  content?: string;
  /** Primary keyword this post targets (for the strategy record). */
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  /** Article FAQ section — also emitted as FAQPage JSON-LD. */
  faqs?: FAQItem[];
  /** Bottom-of-post call to action. */
  cta?: { label: string; href: string; note?: string };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const SITE = {
  name: "Mr Meat & Co",
  legalName: "Mr Meat & Co",
  abn: "71 635 847 908",
  tagline: "Australian Online Meat Shop & Craft Butcher Direct to Door",
  domain: "mrmeatandco.com.au",
  locale: "en-AU",
  currency: "AUD",
  primaryColor: "#B91C1C",
  gscVerification: "pending",
  indexNowKey: "mrmeatandco-indexnow-key-2026",
  cartKey: "tmc-cart-v1",
  // 1200x630 social card — used as the default OG/Twitter image sitewide.
  ogImage: "/og-card.png",
};

/** Absolute-URL helper — schema.org image fields, sitemap image entries and
 *  OG tags all need a full https:// URL, never a site-relative path. */
export function abs(path: string | undefined | null): string {
  if (!path) return `https://${SITE.domain}/`;
  if (/^https?:\/\//.test(path)) return path;
  return `https://${SITE.domain}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** One canonical brand sentence — reuse verbatim in llms.txt, agent files,
 *  hero copy and schema descriptions so the entity reads consistently. */
export const BRAND_STATEMENT =
  "Mr Meat & Co is an Australian online meat shop and craft butcher, grinding and cutting fresh daily in Alexandria, Sydney and delivering cold-chain across NSW and — snap-frozen by express courier — nationwide.";

/** FAQ section heading that carries the page's focus keyword into an H2
 *  (RankMath "keyword in subheading"). Falls back to a generic heading. */
export function faqHeading(kw?: string | null): string {
  if (!kw) return "Frequently asked questions";
  const titled = kw.replace(/\b\w/g, (c) => c.toUpperCase());
  return `${titled} — Frequently Asked Questions`;
}

/** Turn a subcategory display name into its URL slug — must match the logic
 *  in app/[category]/[subcategory]/page.tsx exactly. */
export function subcategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ \/ /g, "-")
    .replace(/ /g, "-");
}

/** Last date real site content changed. Drives sitemap <lastmod> and
 *  og:updated_time so they stay stable between deploys instead of being stamped
 *  with every build time (Google discards lastmod it can't trust). Bump this
 *  only when content genuinely changes. */
export const CONTENT_UPDATED = "2026-11-10T00:00:00.000Z";

const DESC_SUFFIX = " Cold-chain refrigerated delivery across NSW from our Alexandria, Sydney butchery.";
const DESC_SUFFIX_SHORT = " Cold-chain delivery across NSW.";
const BOILERPLATE_DESC = /^(.*?) available from Australian Online Meat Shop\.[^.]*\.?$/i;

/** Clamp a meta description to a search-safe length (~155 chars) at a word
 *  boundary, and lengthen thin ones (<120 chars) to a useful ~120-158. Descriptions
 *  in PAGE_SEO are written long-form; this trims them for the <meta> tag without
 *  touching the on-page copy. */
export function metaDesc(s?: string | null, fallback?: string): string {
  let t = (s || fallback || SITE.tagline).replace(/\s+/g, " ").trim();
  const bp = BOILERPLATE_DESC.exec(t);
  if (bp) {
    t = `Buy ${bp[1]} online from ${SITE.name}. Dispatched from our Alexandria, Sydney butchery with cold-chain refrigerated delivery across NSW.`;
  } else if (t.length < 120) {
    const stem = `${t.replace(/[\s]+$/, "")}${/[.!?]$/.test(t) ? "" : "."}`;
    if (stem.length + DESC_SUFFIX.length <= 158) t = stem + DESC_SUFFIX;
    else if (stem.length + DESC_SUFFIX_SHORT.length <= 158) t = stem + DESC_SUFFIX_SHORT;
  }
  if (t.length <= 158) return t;
  const cut = t.slice(0, 156);
  const at = cut.lastIndexOf(" ");
  return (at > 110 ? cut.slice(0, at) : cut).replace(/[\s,;:.–—-]+$/, "");
}

const TITLE_MAX = 60;

/** Fit a title to <=60 chars with the brand appended when it fits. Drops trailing
 *  " | " segments first, then the brand, then truncates at a word boundary. */
export function fitTitle(raw: string): string {
  const base = raw.replace(/\s+/g, " ").trim();
  const segs = base.split(" | ");
  while (segs.length > 1 && `${segs.join(" | ")} | ${SITE.name}`.length > TITLE_MAX) segs.pop();
  const withBrand = `${segs.join(" | ")} | ${SITE.name}`;
  if (withBrand.length <= TITLE_MAX) return withBrand;
  if (base.length <= TITLE_MAX) return base;
  const cut = base.slice(0, TITLE_MAX);
  const at = cut.lastIndexOf(" ");
  return cut.slice(0, at > 35 ? at : TITLE_MAX).replace(/[\s,;:&|–—-]+$/, "").replace(/\s+(and|or|with|for|to|the|a|in|of)$/i, "");
}

/**
 * Normalise a product/page title so the brand appears exactly once at the end.
 * Strips a trailing "— Mr Meat & Co" that some source seo_title values already
 * carry, plus generic boilerplate segments, then fits to 60 chars. A bare product
 * name (no seo_title) is enriched with a delivery qualifier so it isn't a thin
 * 15-25 char title.
 * Use with `title: { absolute: productTitle(...) }` to bypass the layout template.
 */
export function productTitle(raw?: string | null, name?: string | null): string {
  let base = (raw || name || "").replace(/\s+/g, " ").trim();
  base = base.replace(/\s*[|–—-]\s*Mr Meat\s*&\s*Co\b.*$/i, "");
  base = base.replace(/\s*\|\s*Australian Online Meat Shop\b/i, "");
  base = base.replace(/\s*\|\s*(Sydney Craft Butcher|Pet Food Catalogue|Seafood Catalogue)\b/i, "");
  base = base.replace(/[\s|–—-]+$/, "").trim();
  if (!base) base = (name || SITE.name).trim();
  if ((!raw || base.toLowerCase() === (name || "").trim().toLowerCase()) && `${base} | ${SITE.name}`.length < 40) {
    for (const q of [" Online | Sydney Delivery", " | Sydney Delivery"]) {
      const cand = `${base}${q} | ${SITE.name}`;
      if (cand.length <= TITLE_MAX) return cand;
    }
  }
  return fitTitle(base);
}

export const CONTACT = {
  email: "orders@mrmeatandco.com.au",
  /** Entity-encoded form for rendering the address as visible text
   *  (use with dangerouslySetInnerHTML). The plain `email` stays for mailto: links. */
  emailHtml: "orders&#64;mrmeatandco.com.au",
  phone: "+61 480 811 308",
  whatsapp: "+61 480 811 308",
  address: "Unit 4, 120 Sydney Butcher Way, Alexandria NSW 2015",
  hq: "Sydney, NSW, Australia",
  country: "Australia",
};

export const SHOP = {
  minOrder: 300,
  freeShippingThreshold: 300,
  shippingFee: 0,
  cryptoDiscount: 10,
  paymentMethods: ["PayID", "Direct Bank Transfer", "crypto-BTC", "crypto-USDT"],
};

export const FORMS = {
  provider: "smtp",
  // SMTP credentials live ONLY in Vercel env vars, never in the repo:
  //   EMAIL_SERVER_HOST / EMAIL_SERVER_PORT / EMAIL_SERVER_SECURE
  //   EMAIL_SERVER_USER / EMAIL_SERVER_PASSWORD / EMAIL_FROM
  // All forms POST JSON to /api/contact, which sends via nodemailer (Zoho SMTP).
  // If the env vars are absent the route simulates success and the form still
  // redirects to its thank-you page (no email sent) — safe for local/preview.
  contactEmail: "orders@mrmeatandco.com.au",
  orderEmail: "orders@mrmeatandco.com.au",
  wholesaleEmail: "orders@mrmeatandco.com.au",
  turnstileSiteKey: "",
};

export const CHAT = {
  channels: [
    { type: "whatsapp", label: "WhatsApp Direct", value: "+61 480 811 308", url: "https://wa.me/61480811308" },
    { type: "email", label: "Order Email", value: "orders@mrmeatandco.com.au", url: "mailto:orders@mrmeatandco.com.au" },
    { type: "phone", label: "Call or Text", value: "+61 480 811 308", url: "tel:+61480811308" },
  ]
};

export const BRAND = {
  foundingYear: "2018",
  foundingLocation: "Sydney, NSW, Australia",
  description: "Mr Meat & Co is a simple, high-quality Australian online meat shop delivering craft butcher meats, pasture-raised beef, free-range poultry, sweet lamb, and family meat boxes directly to your door.",
  differentiation: [
    "Strict 12-Category Australian Meat Taxonomy",
    "Whole-Carcass Craft Butchery & Precision Cuts",
    "Temperature-Controlled Cold-Chain Express Delivery across Australia",
    "Direct PayID, Bank Transfer & 10% Crypto Discount Checkout"
  ],
  milestones: [
    { year: "2018", event: "Founded in Sydney as an Australian craft butcher committed to local livestock." },
    { year: "2020", event: "Launched cold-chain online ordering for Australian home cooks." },
    { year: "2024", event: "Standardised a clean Australian meat catalogue taxonomy across 11 core categories." },
  ],
  // Add real, live profile URLs only. Fake sameAs entries weaken the entity
  // signal (Google follows them). Empty until the accounts actually exist.
  sameAs: [] as string[],
  awards: ["Sydney Fine Food Produce Gold Award 2024", "NSW Australian Meat Industry Council Retailer 2025"],
};

// EXACT 12 APPROVED CATEGORIES & SUBCATEGORIES
export const CATEGORIES: Category[] = [
  {
    slug: "beef",
    name: "Beef",
    description: "Australian beef cuts, dry-aged steaks, F1 Wagyu, fresh beef mince, slow-cook roasts, offal, and stock bones for broth.",
    subcategories: ["Steaks", "Wagyu", "Roasts", "Mince & Diced", "Slow Cook", "BBQ", "Offal", "Bones & Broth"],
    image: "/images/categories/beef.webp",
  },
  {
    slug: "chicken",
    name: "Chicken",
    description: "Australian chicken breasts, thighs, drumsticks, wings, whole birds, lean mince, and crumbed schnitzels.",
    subcategories: ["Breast", "Thighs", "Drumsticks", "Wings", "Whole Birds", "Mince", "Crumbed"],
    image: "/images/categories/chicken.webp",
  },
  {
    slug: "lamb",
    name: "Lamb",
    description: "Australian lamb cutlets, loin chops, leg roasts, shoulder, shanks, and mince.",
    subcategories: ["Chops & Cutlets", "Roasts", "Slow Cook", "Mince & Diced", "BBQ"],
    image: "/images/categories/lamb.webp",
  },
  {
    slug: "pork",
    name: "Pork",
    description: "Australian pork cuts, crispy pork belly, ribs, pork shoulder roasts, cutlets, mince, bacon, ham, Christmas hams, and stock bones for broth.",
    subcategories: ["Roasts", "Belly & Ribs", "Chops & Steaks", "Mince", "Bacon & Ham", "Bones & Broth"],
    image: "/images/categories/pork.webp",
  },
  {
    slug: "sausages",
    name: "Sausages",
    description: "Australian craft sausages made with beef, pork, chicken, lamb, and gourmet flavor blends.",
    subcategories: ["Beef", "Pork", "Chicken", "Lamb", "Gourmet Flavours"],
    image: "/images/categories/sausages.webp",
  },
  {
    slug: "bbq-grill",
    name: "BBQ & Grill",
    description: "Australian barbecue essentials—steak packs, sausage packs, ribs, skewers, and burger patties.",
    subcategories: ["Steak Packs", "Sausage Packs", "Ribs", "Skewers", "Burgers"],
    image: "/images/categories/bbq-grill.webp",
  },
  {
    slug: "meat-boxes",
    name: "Meat Boxes",
    description: "Household meat boxes, value freezer stockers, BBQ boxes, premium steak bundles, and lean protein prep.",
    subcategories: ["Family", "Value", "BBQ", "Premium Steak", "Lean / Meal Prep", "Build a Box"],
    image: "/images/categories/meat-boxes.webp",
  },
  {
    slug: "ready-to-cook",
    name: "Ready to Cook",
    description: "Chef-prepared weeknight dinners—chicken schnitzels, crumbed steak, marinated cuts, kebabs, and burger patties.",
    subcategories: ["Schnitzels", "Marinated Cuts", "Kebabs", "Burger Patties"],
    image: "/images/categories/ready-to-cook.webp",
  },
  {
    slug: "specialty-meat",
    name: "Specialty Meat",
    description: "Australian specialty cuts including veal schnitzels and cutlets, goat, wild kangaroo, farmed rabbit, and game meats such as venison, wild boar, crocodile and emu.",
    subcategories: ["Veal", "Goat", "Kangaroo", "Rabbit", "Game"],
    image: "/images/categories/specialty-meat.webp",
  },
  {
    slug: "seafood",
    name: "Seafood",
    description: "Fish fillets and portions, raw and cooked prawns, and salmon portions.",
    subcategories: ["Fish", "Prawns", "Salmon"],
    image: "/images/categories/seafood.webp",
  },
  {
    slug: "pet-food",
    name: "Pet Food",
    description: "Natural raw BARF pet food—pet mince, beef marrow bones, and chicken frames.",
    subcategories: ["Raw Mince", "Bones", "Offal"],
    image: "/images/categories/pet-food.webp",
  },
  {
    slug: "live-poultry",
    name: "Live Poultry",
    description: "Live birds for backyard flocks — point-of-lay hens, young pullets, dual-purpose and meat birds, and bantams. Farm pickup or local Sydney delivery only.",
    subcategories: ["Laying Hens", "Pullets", "Meat Birds", "Bantams"],
    image: "/images/point-of-lay-hens-brown-egg.webp",
  },
];

// APPROVED OPTIONAL COLLECTIONS
export const COLLECTIONS = [
  "Best Sellers",
  "Specials",
  "BBQ",
  "Family Meals",
  "Meal Prep",
  "Premium",
  "Budget Friendly",
  "Slow Cooking",
  "Weekend Roast",
  "New Arrivals",
  "Fresh Chilled",
  "Frozen",
];

// HELPER TO CREATE PRODUCT RECORD ACCORDING TO SPECIFICATION
function createProduct(
  id: string,
  name: string,
  mainCategory: string,
  subcategory: string,
  slug: string,
  price: number | null,
  weight: string | null,
  packSize: string | null,
  priceType: 'per_kg' | 'per_item' | 'per_pack' | 'per_box' | 'fixed_box_price' | 'from_price' | 'variable_weight' | 'configurable_box_price' | 'fixed_pack_price',
  shortDesc: string,
  fullDesc: string,
  productType: string,
  cookingMethods: string[],
  productFormat: string[],
  qualityAttributes: string[] | null,
  collections: string[],
  mainImage: string,
  options?: {
    featured?: boolean;
    badge?: string;
    stockStatus?: 'In Stock' | 'Out of Stock' | 'Pre-Order' | 'Seasonal' | 'Discontinued';
    storageType?: 'Fresh Chilled' | 'Frozen' | 'Refrigerated' | 'To be confirmed' | string;
    animal_protein?: string;
    pet_food_only?: boolean;
    human_consumption_warning?: string;
    feeding_instructions?: string;
    handling_instructions?: string;
    ingredients?: string | null;
    allergens?: string | null;
    allergen_information?: string | null;
    secondary_subcategories?: string[];
    primary_product_category?: string;
    country_of_origin?: string;
    supplier?: string;
    quality_claims?: string;
    use_by_date?: string;
    approximate_weight?: string | null;
    bulk_order_notice?: string | null;
    product_contents?: string[] | null;
    is_animal_share?: boolean;
    approximate_total_weight?: string | null;
    box_contents?: { name: string; quantity: string; slug?: string }[];
    included_product_references?: string[];
    min_order_value?: number;
    seo_title?: string;
    seo_meta_description?: string;
    breadcrumb_path?: string;
    pack_contents?: Record<string, string>;
    storage_instructions?: string;
    cooking_instructions?: string;
  }
): Product {
  const isWholesale = mainCategory.toLowerCase() === 'wholesale';
  const isMeatBox = mainCategory === 'meat-boxes' || mainCategory === 'Meat Boxes';
  const isSeafood = mainCategory === 'seafood' || mainCategory === 'Seafood';
  const isPetFood = mainCategory === 'pet-food' || mainCategory === 'Pet Food';
  const stock_status = options?.stockStatus || 'In Stock';
  const storage_type = options?.storageType || (isPetFood ? 'Frozen' : 'Fresh Chilled');

  const displayCategoryName = isWholesale
    ? 'Wholesale'
    : isMeatBox
    ? 'Meat Boxes'
    : isSeafood
    ? 'Seafood'
    : isPetFood
    ? 'Pet Food'
    : mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1);

  return {
    product_id: id,
    product_name: name,
    main_category: mainCategory,
    subcategory: subcategory,
    primary_product_category: options?.primary_product_category,
    secondary_subcategories: options?.secondary_subcategories || [],
    collections: collections,
    slug: slug,
    short_description: shortDesc,
    full_description: fullDesc,
    price: price,
    sale_price: null,
    price_type: priceType,
    currency: "AUD",
    weight: weight,
    pack_size: packSize,
    stock_status: stock_status,
    storage_type: storage_type,
    product_type: productType,
    animal_protein: options?.animal_protein,
    pet_food_only: isPetFood || options?.pet_food_only || false,
    human_consumption_warning: isPetFood ? (options?.human_consumption_warning || "Pet Food Only — Not for Human Consumption") : options?.human_consumption_warning,
    feeding_instructions: isPetFood ? (options?.feeding_instructions || "Refer to verified supplier instructions or seek veterinary advice") : undefined,
    handling_instructions: isPetFood ? (options?.handling_instructions || "To be confirmed from verified supplier information") : undefined,
    cooking_methods: cookingMethods,
    product_format: productFormat,
    quality_attributes: qualityAttributes,
    country_of_origin: options?.country_of_origin || (isWholesale || isSeafood || isPetFood ? "To be confirmed" : "Australia"),
    supplier: options?.supplier || (isWholesale || isSeafood || isPetFood ? "To be confirmed" : "Verified Local Australian Farms & Master Butchers"),
    quality_claims: options?.quality_claims || (isWholesale || isSeafood || isPetFood ? "None supplied" : "Fresh Chilled & Vacuum Sealed"),
    ingredients: options?.ingredients || (isWholesale || isSeafood || isPetFood ? "To be confirmed" : null),
    allergen_information: options?.allergen_information || options?.allergens || (isSeafood ? "Contains Fish or Crustacean Shellfish — verify exact allergen information from supplier label" : isPetFood ? "To be confirmed" : null),
    storage_instructions: options?.storage_instructions || (storage_type === 'Frozen' ? "Keep frozen at or below -18°C. Thaw in refrigerator before use." : storage_type === 'Refrigerated' ? "Keep refrigerated below 4°C. Consume within 3 days of opening." : storage_type === 'To be confirmed' ? "To be confirmed upon ordering." : "Keep refrigerated below 4°C. Consume within 3 days or freeze immediately."),
    use_by_date: options?.use_by_date || "To be confirmed",
    cooking_instructions: isPetFood ? "Pet Food Only — Not for Human Consumption. Handle with appropriate hygiene procedures." : (options?.cooking_instructions || "Cook thoroughly to safe internal temperature before consuming."),
    SKU: `SKU-${id}`,
    barcode_or_GTIN: null,
    main_image: mainImage,
    gallery_images: [mainImage],
    SEO_title: options?.seo_title || `${name} | Australian Online Meat Shop`,
    SEO_meta_description: options?.seo_meta_description || `${name} available from Australian Online Meat Shop. Market-reference pricing in AUD.`,
    seo_title: options?.seo_title || `${name} | Australian Online Meat Shop`,
    seo_meta_description: options?.seo_meta_description || `${name} available from Australian Online Meat Shop. Market-reference pricing in AUD.`,
    breadcrumb_path: options?.breadcrumb_path || (isWholesale ? `Home > Wholesale > Bulk Meat Orders > ${subcategory} > ${name}` : `Home > ${displayCategoryName} > ${subcategory} > ${name}`),

    // Wholesale Bulk & Animal Share specific fields
    is_wholesale: isWholesale,
    approximate_weight: options?.approximate_weight || packSize || weight,
    bulk_order_notice: options?.bulk_order_notice,
    product_contents: options?.product_contents,
    is_animal_share: options?.is_animal_share,

    // Meat Box specific fields
    approximate_total_weight: options?.approximate_total_weight || weight,
    box_contents: options?.box_contents || [],
    pack_contents: options?.pack_contents,
    included_product_references: options?.included_product_references || [],
    min_order_value: options?.min_order_value,

    // Aliases
    name: name,
    category: mainCategory,
    description: fullDesc,
    shortDescription: shortDesc,
    image: mainImage,
    featured: options?.featured || false,
    badge: options?.badge,
  };
}

// APPROVED INITIAL PRODUCT LIST ONLY
export const PRODUCTS: Product[] = [
  // 1. BEEF — STEAKS
  createProduct(
    "PRD-BEEF-001",
    "Scotch Fillet Steak",
    "beef",
    "Steaks",
    "scotch-fillet-steak",
    36.99,
    "1kg",
    "1kg",
    "per_kg",
    "Tender beef scotch fillet steak suitable for barbecue, grill or pan-frying.",
    "Scotch fillet steak cut for easy cooking. Ideal for pan-searing or grilling over medium-high heat.",
    "Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Steaks", "Fresh Chilled"],
    "/images/scotch-fillet-steak.webp",
    { featured: true, badge: "Popular Cut" }
  ),
  createProduct(
    "PRD-BEEF-002",
    "Porterhouse Steak",
    "beef",
    "Steaks",
    "porterhouse-steak",
    34.99,
    "1kg",
    "1kg",
    "per_kg",
    "Classic porterhouse beef steak ideal for pan-searing or barbecue grilling.",
    "Well-trimmed porterhouse steak suitable for pan-frying, barbecue, or oven finishes.",
    "Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Steaks", "Fresh Chilled"],
    "/images/porterhouse-steak.webp"
  ),
  createProduct(
    "PRD-BEEF-003",
    "Rump Steak",
    "beef",
    "Steaks",
    "rump-steak",
    23.99,
    "1kg",
    "1kg",
    "per_kg",
    "Full-flavoured beef rump steak trimmed for barbecue grilling and pan-frying.",
    "Flavorful beef rump steak suitable for high-heat pan-searing or grilling on the barbecue.",
    "Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Steaks", "BBQ", "Fresh Chilled"],
    "/images/rump-steak.webp",
    { secondary_subcategories: ["BBQ"] }
  ),
  createProduct(
    "PRD-BEEF-004",
    "Eye Fillet Steak",
    "beef",
    "Steaks",
    "eye-fillet-steak",
    45.99,
    "1kg",
    "1kg",
    "per_kg",
    "Tender beef eye fillet steak prepared for gentle pan-searing or grilling.",
    "Lean and soft eye fillet beef steak cut to order. Perfect for quick pan-searing or quick grilling.",
    "Steak",
    ["Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Steaks", "Fresh Chilled"],
    "/images/eye-fillet-steak.webp",
    { featured: true, badge: "Tender Cut" }
  ),
  createProduct(
    "PRD-BEEF-005",
    "Beef Chuck Steak",
    "beef",
    "Steaks",
    "beef-chuck-steak",
    19.49,
    "1kg",
    "1kg",
    "per_kg",
    "Versatile beef chuck steak for pan-frying, barbecue or slow cooking.",
    "Beef chuck steak suitable for braising, slow cooking or barbecue marinating.",
    "Steak",
    ["Pan-Fry", "BBQ", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Steaks", "Slow Cooking", "Fresh Chilled"],
    "/images/beef-chuck-steak.webp"
  ),
  createProduct(
    "PRD-BEEF-006",
    "Beef Minute Steak",
    "beef",
    "Steaks",
    "beef-minute-steak",
    9.99,
    "500g",
    "500g",
    "per_pack",
    "Thinly sliced beef minute steak for quick pan-frying or steak sandwiches.",
    "Thinly cut beef minute steaks designed for high-heat quick cooking in under two minutes.",
    "Steak",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Steaks", "Fresh Chilled"],
    "/images/beef-minute-steak.webp"
  ),
  createProduct(
    "PRD-BEEF-007",
    "Crumbed Beef Schnitzel",
    "beef",
    "Steaks",
    "crumbed-beef-schnitzel",
    24.99,
    "1kg",
    "1kg",
    "per_kg",
    "Tender beef schnitzel coated in crisp breadcrumbs for pan-frying or air frying.",
    "Tenderised beef steaks lightly coated in fine breadcrumbs ready for pan-frying or air-frying.",
    "Schnitzel",
    ["Pan-Fry", "Air Fryer"],
    ["Fresh Chilled"],
    null,
    ["Steaks", "Ready to Cook"],
    "/images/crumbed-beef-schnitzel.webp"
  ),
  createProduct(
    "PRD-BEEF-008",
    "Beef Stir-Fry Strips",
    "beef",
    "Steaks",
    "beef-stir-fry-strips",
    14.99,
    "500g",
    "500g",
    "per_pack",
    "Thinly sliced beef strips prepared for quick wok stir-frying and skillet dishes.",
    "Evenly sliced beef strips trimmed for quick stir-fry meals with vegetables and sauces.",
    "Strips",
    ["Stir-Fry"],
    ["Fresh Chilled"],
    null,
    ["Steaks", "Mince & Diced", "Ready to Cook"],
    "/images/beef-stir-fry-strips.webp",
    { secondary_subcategories: ["Mince & Diced", "BBQ"] }
  ),

  // BEEF — ROASTS
  createProduct(
    "PRD-BEEF-009",
    "Beef Topside Roast",
    "beef",
    "Roasts",
    "beef-topside-roast",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Lean beef topside roast suitable for traditional oven roasting.",
    "Boneless beef topside roast offering clean slices for traditional Sunday roasts.",
    "Roast",
    ["Roast"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Roasts", "Fresh Chilled"],
    "/images/beef-topside-roast.webp"
  ),
  createProduct(
    "PRD-BEEF-010",
    "Beef Silverside Roast",
    "beef",
    "Roasts",
    "beef-silverside-roast",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Lean beef silverside cut prepared for roasting or pot roasting.",
    "Uncured beef silverside cut ideal for oven roasting or slow braising.",
    "Roast",
    ["Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Roasts", "Slow Cooking"],
    "/images/beef-silverside-roast.webp"
  ),
  createProduct(
    "PRD-BEEF-011",
    "Beef Rump Roast",
    "beef",
    "Roasts",
    "beef-rump-roast",
    23.99,
    "1kg",
    "1kg",
    "per_kg",
    "Full-flavoured beef rump roast cut for oven roasting.",
    "Prime beef rump roast cut with a outer fat cap for basting during oven roasting.",
    "Roast",
    ["Roast"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Roasts", "Fresh Chilled"],
    "/images/beef-rump-roast.webp"
  ),
  createProduct(
    "PRD-BEEF-012",
    "Beef Blade Roast",
    "beef",
    "Roasts",
    "beef-blade-roast",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Flavourful beef blade roast for slow oven roasting or pot roast cooking.",
    "Beef blade roast cut suitable for slow pot roasting to develop rich beefy flavours.",
    "Roast",
    ["Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Roasts", "Slow Cooking"],
    "/images/beef-blade-roast.webp"
  ),
  createProduct(
    "PRD-BEEF-013",
    "Corned Beef Silverside",
    "beef",
    "Roasts",
    "corned-beef-silverside",
    14.95,
    "1kg",
    "1kg",
    "per_kg",
    "Traditional pickled corned beef silverside for pot simmering or slow cooking.",
    "Brine-cured corned beef silverside cut ready for gentle pot simmering or slow cooking.",
    "Corned Beef",
    ["Slow Cook", "Boil"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Roasts", "Slow Cooking"],
    "/images/corned-beef-silverside.webp"
  ),
  createProduct(
    "PRD-BEEF-014",
    "Rolled Beef Roast",
    "beef",
    "Roasts",
    "rolled-beef-roast",
    22.99,
    "1kg",
    "1kg",
    "per_kg",
    "Hand-rolled tied beef roast prepared for oven roasting.",
    "Hand-rolled and netted beef roast designed for uniform roasting and easy carving.",
    "Roast",
    ["Roast"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Roasts", "Fresh Chilled"],
    "/images/rolled-beef-roast.webp"
  ),

  // BEEF — MINCE & DICED
  createProduct(
    "PRD-BEEF-015",
    "Regular Beef Mince",
    "beef",
    "Mince & Diced",
    "regular-beef-mince",
    14.99,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh ground regular beef mince suitable for everyday family meals.",
    "Fresh ground regular beef mince with standard fat ratio for burgers, meatballs and Bolognese.",
    "Mince",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled"],
    null,
    ["Mince & Diced", "Family Meals"],
    "/images/regular-beef-mince.webp"
  ),
  createProduct(
    "PRD-BEEF-016",
    "Premium Beef Mince",
    "beef",
    "Mince & Diced",
    "premium-beef-mince",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Freshly prepared premium beef mince ground for burgers and savoury dishes.",
    "Finely ground premium beef mince with balanced lean meat content.",
    "Mince",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled"],
    null,
    ["Mince & Diced", "Fresh Chilled"],
    "/images/premium-beef-mince.webp",
    { featured: true, badge: "Popular Mince" }
  ),
  createProduct(
    "PRD-BEEF-017",
    "Lean Beef Mince",
    "beef",
    "Mince & Diced",
    "lean-beef-mince",
    17.99,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh ground lean beef mince ideal for wholesome everyday cooking.",
    "Lean ground beef mince trimmed for lower fat content in tacos, pasta dishes and chilli.",
    "Mince",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled"],
    null,
    ["Mince & Diced", "Meal Prep"],
    "/images/lean-beef-mince.webp"
  ),
  createProduct(
    "PRD-BEEF-018",
    "Extra Lean Beef Mince",
    "beef",
    "Mince & Diced",
    "extra-lean-beef-mince",
    20.99,
    "1kg",
    "1kg",
    "per_kg",
    "Extra lean ground beef mince for health-conscious meal preparation.",
    "Extra lean beef mince ground from trimmed muscle cuts for high-protein meal prep.",
    "Mince",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled"],
    null,
    ["Mince & Diced", "Meal Prep"],
    "/images/extra-lean-beef-mince.webp"
  ),
  createProduct(
    "PRD-BEEF-019",
    "Diced Beef",
    "beef",
    "Mince & Diced",
    "diced-beef",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Hand-diced beef cubes ready for slow-cooked stews, curries and casseroles.",
    "Uniformly diced beef pieces suitable for slow-cooking in casseroles, stews and curries.",
    "Diced",
    ["Slow Cook", "Braise", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Mince & Diced", "Slow Cooking"],
    "/images/diced-beef.webp",
    { secondary_subcategories: ["Slow Cook"] }
  ),

  // BEEF — SLOW COOK
  createProduct(
    "PRD-BEEF-020",
    "Beef Brisket",
    "beef",
    "Slow Cook",
    "beef-brisket",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Beef brisket cut for slow cooking, smoking, or braising.",
    "Beef brisket cut with fat layer suitable for low-and-slow smoking, roasting or braising.",
    "Roast",
    ["Slow Cook", "BBQ", "Smoke"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking", "BBQ"],
    "/images/beef-brisket.webp",
    { featured: true, badge: "Slow Cook Cut" }
  ),
  createProduct(
    "PRD-BEEF-021",
    "Beef Chuck Roast",
    "beef",
    "Slow Cook",
    "beef-chuck-roast",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Beef chuck roast for pot roasting and tender braised dishes.",
    "Beef chuck roast suitable for pot roasts, breaking down into tender pulled beef.",
    "Roast",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking"],
    "/images/beef-chuck-roast.webp"
  ),
  createProduct(
    "PRD-BEEF-022",
    "Beef Short Ribs",
    "beef",
    "Slow Cook",
    "beef-short-ribs",
    20.99,
    "1kg",
    "1kg",
    "per_kg",
    "Meaty bone-in beef short ribs for slow cooking or barbecue smoking.",
    "Bone-in beef short ribs cut for slow braising or low-and-slow barbecue smoking.",
    "Ribs",
    ["Slow Cook", "BBQ"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking", "BBQ"],
    "/images/beef-short-ribs.webp",
    { secondary_subcategories: ["BBQ"] }
  ),
  createProduct(
    "PRD-BEEF-023",
    "Beef Ribs",
    "beef",
    "Slow Cook",
    "beef-ribs",
    20.99,
    "1kg",
    "1kg",
    "per_kg",
    "Beef ribs cut for slow cooking, braising or barbecue grilling.",
    "Meaty beef ribs suitable for oven braising, slow cooking or smoking.",
    "Ribs",
    ["Slow Cook", "BBQ"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking", "BBQ"],
    "/images/beef-ribs.webp",
    { secondary_subcategories: ["BBQ"] }
  ),
  createProduct(
    "PRD-BEEF-024",
    "Beef Shin",
    "beef",
    "Slow Cook",
    "beef-shin",
    16.99,
    "1kg",
    "1kg",
    "per_kg",
    "Gelatin-rich beef shin for deep-flavoured stews and braises.",
    "Beef shin cut suitable for long braising to release collagen and build rich gravies.",
    "Slow-Cook Cut",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking"],
    "/images/beef-shin.webp"
  ),
  createProduct(
    "PRD-BEEF-025",
    "Beef Osso Buco",
    "beef",
    "Slow Cook",
    "beef-osso-buco",
    11.50,
    "1kg",
    "1kg",
    "per_kg",
    "Cross-cut beef shank with bone marrow center for classic braised dishes.",
    "Cross-cut beef shank slices with center bone marrow for traditional slow braised casseroles.",
    "Osso Buco",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking"],
    "/images/beef-osso-buco.webp"
  ),
  createProduct(
    "PRD-BEEF-026",
    "Beef Cheeks",
    "beef",
    "Slow Cook",
    "beef-cheeks",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Trimmed beef cheeks for tender slow braising.",
    "Well-trimmed beef cheeks that melt when braised slowly in red wine or stock.",
    "Slow-Cook Cut",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking"],
    "/images/beef-cheeks.webp"
  ),

  // BEEF — BBQ
    createProduct(
    "PRD-BEEF-029",
    "Marinated Beef Strips",
    "beef",
    "BBQ",
    "marinated-beef-strips",
    14.99,
    "500g",
    "500g",
    "per_pack",
    "Pre-marinated beef strips for fast barbecue hotplate cooking or stir-frying.",
    "Beef strips in light savory marinade ready to cook quickly on hot barbecue plates.",
    "Strips",
    ["BBQ", "Grill", "Stir-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Ready to Cook"],
    "/images/marinated-beef-strips.webp"
  ),

  // BEEF — OFFAL
  createProduct(
    "PRD-BEEF-030",
    "Beef Liver",
    "beef",
    "Offal",
    "beef-liver",
    12.99,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh beef liver sliced for pan-frying or quick braising.",
    "Freshly prepared beef liver trimmed and sliced for pan-searing with onions or quick braising.",
    "Offal",
    ["Pan-Fry", "Braise"],
    ["Fresh Chilled"],
    null,
    ["Offal"],
    "/images/beef-liver.webp"
  ),
  createProduct(
    "PRD-BEEF-031",
    "Beef Kidney",
    "beef",
    "Offal",
    "beef-kidney",
    12.99,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh beef kidney for traditional steak and kidney pies or braises.",
    "Fresh beef kidney prepared and trimmed for slow braising or casserole pie fillings.",
    "Offal",
    ["Braise", "Slow Cook"],
    ["Fresh Chilled"],
    null,
    ["Offal"],
    "/images/beef-kidney.webp"
  ),
  createProduct(
    "PRD-BEEF-032",
    "Beef Heart",
    "beef",
    "Offal",
    "beef-heart",
    14.99,
    "1kg",
    "1kg",
    "per_kg",
    "Lean beef heart cut for slow cooking or quick grilling.",
    "Trimmed beef heart cut for marinating and grilling or slow casserole cooking.",
    "Offal",
    ["Slow Cook", "Grill"],
    ["Fresh Chilled"],
    null,
    ["Offal"],
    "/images/beef-heart.webp"
  ),
  createProduct(
    "PRD-BEEF-033",
    "Beef Marrow Bones",
    "beef",
    "Bones & Broth",
    "beef-marrow-bones",
    9.99,
    "1kg",
    "1kg",
    "per_kg",
    "Grass-fed beef marrow bones, cut canoe and round for roasting and broth.",
    "Human-grade grass-fed beef marrow bones, cross-cut into canoe and round pieces. Roast at 220°C for 20 minutes and spread the marrow on toast, or add to a long-simmered bone broth for richness and body.",
    "Beef Bones",
    ["Roast", "Slow Cook", "Broth"],
    ["Fresh Chilled"],
    null,
    ["Beef > Bones & Broth", "Slow Cooking", "Fresh Chilled"],
    "/images/beef-marrow-bones.webp"
  ),
  createProduct(
    "PRD-BEEF-034",
    "Beef Tongue",
    "beef",
    "Offal",
    "beef-tongue",
    19.99,
    "1kg",
    "1kg",
    "per_kg",
    "Whole beef tongue prepared for gentle simmering and braising.",
    "Fresh beef tongue suitable for slow pot simmering, pressing, or slicing.",
    "Offal",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled"],
    null,
    ["Offal"],
    "/images/beef-tongue.webp"
  ),

  // 1b. BEEF — WAGYU (F1 cross)
  createProduct(
    "PRD-BEEF-038",
    "Wagyu Scotch Fillet Steak",
    "beef",
    "Wagyu",
    "wagyu-scotch-fillet-steak",
    79.99,
    "1kg",
    "1kg",
    "per_kg",
    "F1 Wagyu scotch fillet — richly marbled, from Wagyu-cross Australian cattle.",
    "Australian F1 Wagyu scotch fillet steak. F1 means first-cross Wagyu genetics over our grass-fed Angus base, giving noticeably heavier marbling than our standard scotch fillet while staying an approachable, everyday-splurge price. Sear hot and pull it at medium-rare — the extra fat renders and self-bastes the steak as it cooks.",
    "Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Wagyu", "Steaks", "Fresh Chilled"],
    "/images/wagyu-scotch-fillet-steak.webp",
    { featured: true, badge: "F1 Wagyu", quality_claims: "F1 Wagyu-Cross, Fresh Chilled & Vacuum Sealed" }
  ),
  createProduct(
    "PRD-BEEF-039",
    "Wagyu Porterhouse Steak",
    "beef",
    "Wagyu",
    "wagyu-porterhouse-steak",
    69.99,
    "1kg",
    "1kg",
    "per_kg",
    "F1 Wagyu porterhouse — firm-grained with the extra marbling of Wagyu genetics.",
    "Australian F1 Wagyu porterhouse (sirloin). Wagyu-cross genetics over our grass-fed Angus base add fine marbling through a firmer, leaner-grained cut than scotch fillet — beefy flavour with a buttery finish. Render the fat cap first, then sear hard both sides.",
    "Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Wagyu", "Steaks", "Fresh Chilled"],
    "/images/porterhouse-steak.webp",
    { badge: "F1 Wagyu", quality_claims: "F1 Wagyu-Cross, Fresh Chilled & Vacuum Sealed" }
  ),
  createProduct(
    "PRD-BEEF-040",
    "Wagyu Rump Steak",
    "beef",
    "Wagyu",
    "wagyu-rump-steak",
    49.99,
    "1kg",
    "1kg",
    "per_kg",
    "F1 Wagyu rump — the value entry point into our Wagyu range.",
    "Australian F1 Wagyu rump steak. Wagyu-cross genetics carry extra marbling into a hard-working, big-flavoured cut, giving most of the Wagyu eating-quality lift at a lower price point than scotch fillet or porterhouse. Cook medium-rare and rest well, then slice against the grain.",
    "Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Wagyu", "Steaks", "BBQ", "Fresh Chilled"],
    "/images/wagyu-rump-steak.webp",
    { secondary_subcategories: ["BBQ"], badge: "F1 Wagyu", quality_claims: "F1 Wagyu-Cross, Fresh Chilled & Vacuum Sealed" }
  ),
  createProduct(
    "PRD-BEEF-041",
    "Wagyu Beef Mince",
    "beef",
    "Wagyu",
    "wagyu-beef-mince",
    26.99,
    "1kg",
    "1kg",
    "per_kg",
    "F1 Wagyu beef mince — extra marbling for burgers, meatballs and bolognese.",
    "Ground fresh from F1 Wagyu-cross trim. The extra fat and marbling that make Wagyu steaks so rich come through in mince too — juicier burgers and meatballs with no need to add extra fat. Same no-filler standard as our regular mince, just from the Wagyu-cross line.",
    "Mince",
    ["BBQ", "Pan-Fry", "Bake"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Wagyu", "Mince & Diced", "Fresh Chilled"],
    "/images/premium-beef-mince.webp",
    { badge: "F1 Wagyu", quality_claims: "F1 Wagyu-Cross, Fresh Chilled & Vacuum Sealed" }
  ),

  // 2. CHICKEN (33 PRODUCTS ACROSS 7 SUBCATEGORIES)
  // --- BREAST ---
  createProduct(
    "PRD-CHICKEN-001",
    "Chicken Breast Fillets",
    "chicken",
    "Breast",
    "chicken-breast-fillets",
    13.50,
    "1kg",
    "1kg",
    "per_kg",
    "Lean, boneless chicken breast fillets for daily meals.",
    "Tender and versatile chicken breast fillets. Great for grilling, roasting, pan-frying, or slicing into stir-fries.",
    "Chicken Breast",
    ["BBQ", "Grill", "Pan-Fry", "Roast"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Best Sellers", "Meal Prep", "Fresh Chilled"],
    "/images/chicken-breast-fillets.webp",
    { featured: true, badge: "Best Seller" }
  ),
  createProduct(
    "PRD-CHICKEN-002",
    "Skinless Chicken Breast Fillets",
    "chicken",
    "Breast",
    "skinless-chicken-breast-fillets",
    15.00,
    "1kg",
    "1kg",
    "per_kg",
    "Trimmed skinless chicken breast fillets, high in protein.",
    "Hand-trimmed skinless chicken breast fillets with clean edges. Ideal for healthy meal prep, grilling, and oven bakes.",
    "Chicken Breast",
    ["BBQ", "Grill", "Pan-Fry", "Roast"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep", "Fresh Chilled"],
    "/images/skinless-chicken-breast-fillets.webp"
  ),
  createProduct(
    "PRD-CHICKEN-003",
    "Chicken Breast Butterfly",
    "chicken",
    "Breast",
    "chicken-breast-butterfly",
    16.00,
    "1kg",
    "1kg",
    "per_kg",
    "Butterflied chicken breast for quick and even cooking.",
    "Butterflied chicken breast cutlets that cook evenly and rapidly. Perfect for pan-frying schnitzels, grilling, or BBQ cutlets.",
    "Chicken Breast",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Fresh Chilled"],
    "/images/chicken-breast-butterfly.webp"
  ),
  createProduct(
    "PRD-CHICKEN-004",
    "Chicken Tenderloins",
    "chicken",
    "Breast",
    "chicken-tenderloins",
    8.99,
    "500g",
    "500g",
    "per_pack",
    "Tender inner chicken breast strips for quick meals.",
    "Lean and succulent chicken breast tenderloins. Quick-cooking strips ideal for air fryer snacks, grilling, or pan-frying.",
    "Chicken Tenderloin",
    ["Pan-Fry", "Grill", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep", "Fresh Chilled"],
    "/images/chicken-tenderloins.webp"
  ),
  createProduct(
    "PRD-CHICKEN-005",
    "Diced Chicken Breast",
    "chicken",
    "Breast",
    "diced-chicken-breast",
    16.50,
    "1kg",
    "1kg",
    "per_kg",
    "Uniformly diced chicken breast pieces ready for cooking.",
    "Fresh chicken breast hand-diced into uniform bite-sized pieces. Saves prep time for stir-fries, curries, and skewers.",
    "Diced Chicken",
    ["Stir-Fry", "Pan-Fry", "Curry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep", "Fresh Chilled"],
    "/images/diced-chicken-breast.webp"
  ),

  // --- THIGHS ---
  createProduct(
    "PRD-CHICKEN-006",
    "Chicken Thigh Fillets",
    "chicken",
    "Thighs",
    "chicken-thigh-fillets",
    17.00,
    "1kg",
    "1kg",
    "per_kg",
    "Juicy chicken thigh fillets for curries and barbecues.",
    "Flavorful and moist chicken thigh fillets. Holds moisture exceptionally well for slow simmering, roasting, or grilling.",
    "Chicken Thigh",
    ["BBQ", "Grill", "Pan-Fry", "Roast"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Best Sellers", "Family Meals", "Fresh Chilled"],
    "/images/chicken-thigh-fillets.webp",
    { featured: true, badge: "Juicy & Tender" }
  ),
  createProduct(
    "PRD-CHICKEN-007",
    "Skinless Chicken Thigh Fillets",
    "chicken",
    "Thighs",
    "skinless-chicken-thigh-fillets",
    17.00,
    "1kg",
    "1kg",
    "per_kg",
    "Skinless chicken thigh fillets, rich in natural flavor.",
    "Hand-trimmed skinless chicken thigh fillets. Excellent for traybakes, stir-fries, and flame-grilled skewers.",
    "Chicken Thigh",
    ["BBQ", "Grill", "Pan-Fry", "Roast"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Fresh Chilled"],
    "/images/skinless-chicken-thigh-fillets.webp"
  ),
  createProduct(
    "PRD-CHICKEN-008",
    "Bone-In Chicken Thighs",
    "chicken",
    "Thighs",
    "bone-in-chicken-thighs",
    12.99,
    "1kg",
    "1kg",
    "per_kg",
    "Bone-in chicken thighs with skin for crispy roasting.",
    "Succulent bone-in chicken thighs that deliver rich broth and crispy skin when roasted or grilled over charcoal.",
    "Chicken Thigh",
    ["Roast", "BBQ", "Grill"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Budget Friendly", "Family Meals"],
    "/images/bone-in-chicken-thighs.webp"
  ),
  createProduct(
    "PRD-CHICKEN-009",
    "Chicken Thigh Cutlets",
    "chicken",
    "Thighs",
    "chicken-thigh-cutlets",
    10.99,
    "1kg",
    "1kg",
    "per_kg",
    "Bone-in chicken thigh cutlets with skin-on.",
    "Trimmed bone-in chicken thigh cutlets. Perfect for slow roasting, casseroles, and flavorful traybake dinners.",
    "Chicken Cutlet",
    ["Roast", "BBQ", "Grill"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Budget Friendly"],
    "/images/chicken-thigh-cutlets.webp"
  ),
  createProduct(
    "PRD-CHICKEN-010",
    "Diced Chicken Thigh",
    "chicken",
    "Thighs",
    "diced-chicken-thigh",
    16.50,
    "1kg",
    "1kg",
    "per_kg",
    "Diced chicken thigh pieces for curries and casseroles.",
    "Juicy chicken thigh diced into generous bite-sized chunks. Ideal for Indian curries, stir-fries, and hotpots.",
    "Diced Chicken",
    ["Stir-Fry", "Curry", "Pan-Fry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep"],
    "/images/diced-chicken-thigh.webp"
  ),

  // --- DRUMSTICKS ---
  createProduct(
    "PRD-CHICKEN-011",
    "Chicken Drumsticks",
    "chicken",
    "Drumsticks",
    "chicken-drumsticks",
    7.00,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh chicken drumsticks for baking and air-frying.",
    "Budget-friendly fresh chicken drumsticks. Great for family traybakes, barbecue glazes, and crispy air-fryer dinners.",
    "Chicken Drumstick",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Budget Friendly", "Family Meals"],
    "/images/chicken-drumsticks.webp"
  ),
  createProduct(
    "PRD-CHICKEN-012",
    "Chicken Maryland",
    "chicken",
    "Drumsticks",
    "chicken-maryland",
    10.00,
    "1kg",
    "1kg",
    "per_kg",
    "Whole leg cut containing drumstick and thigh.",
    "Classic bone-in chicken Maryland cut (thigh and drumstick attached). Ideal for Sunday roasts and lemon-herb barbecue.",
    "Chicken Maryland",
    ["Roast", "BBQ"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Family Meals"],
    "/images/chicken-maryland.webp"
  ),
  createProduct(
    "PRD-CHICKEN-013",
    "Chicken Leg Quarters",
    "chicken",
    "Drumsticks",
    "chicken-leg-quarters",
    9.99,
    "1kg",
    "1kg",
    "per_kg",
    "Generous chicken leg quarters for roasting.",
    "Fresh chicken leg quarters with thigh and drumstick attached. Generous portions for slow roasting or smoking.",
    "Chicken Leg Quarter",
    ["Roast", "BBQ", "Slow Cook"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Budget Friendly"],
    "/images/chicken-leg-quarters.webp"
  ),
  createProduct(
    "PRD-CHICKEN-014",
    "Marinated Chicken Drumsticks",
    "chicken",
    "Drumsticks",
    "marinated-chicken-drumsticks",
    10.99,
    "1kg",
    "1kg",
    "per_kg",
    "Pre-marinated chicken drumsticks ready for the grill.",
    "Fresh chicken drumsticks tumbled in savory marinade. Ready to bake or grill for quick weeknight family meals.",
    "Marinated Chicken",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook", "BBQ"],
    "/images/marinated-chicken-drumsticks.webp"
  ),

  // --- WINGS ---
  createProduct(
    "PRD-CHICKEN-015",
    "Chicken Wings",
    "chicken",
    "Wings",
    "chicken-wings",
    7.00,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh chicken wings for smoking, roasting, and BBQ.",
    "Fresh full-three-joint chicken wings. Perfect for sticky barbecue glazes, oven roasting, or crispy air-frying.",
    "Chicken Wings",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["BBQ", "Budget Friendly"],
    "/images/chicken-wings.webp"
  ),
  createProduct(
    "PRD-CHICKEN-016",
    "Chicken Wingettes",
    "chicken",
    "Wings",
    "chicken-wingettes",
    9.99,
    "1kg",
    "1kg",
    "per_kg",
    "Mid-joint wingette portions for easy eating.",
    "Trimmed chicken wingettes (flats). Uniform size for quick air-frying, sticky Buffalo wing sauce, or grilling.",
    "Chicken Wingettes",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["BBQ"],
    "/images/chicken-wingettes.webp"
  ),
  createProduct(
    "PRD-CHICKEN-017",
    "Chicken Drumettes",
    "chicken",
    "Wings",
    "chicken-drumettes",
    7.00,
    "1kg",
    "1kg",
    "per_kg",
    "Meaty drumette wing portions.",
    "Meaty upper wing drumette portions. Great for party platters, baking in soy glaze, or crispy air-frying.",
    "Chicken Drumettes",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["BBQ", "Budget Friendly"],
    "/images/chicken-drumettes.webp"
  ),
  createProduct(
    "PRD-CHICKEN-018",
    "Marinated Chicken Wings",
    "chicken",
    "Wings",
    "marinated-chicken-wings",
    10.99,
    "1kg",
    "1kg",
    "per_kg",
    "Pre-marinated chicken wings for instant baking.",
    "Chicken wings glazed in savory house marinade. Pop straight onto the BBQ plate or into the air fryer.",
    "Marinated Chicken Wings",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook", "BBQ"],
    "/images/marinated-chicken-wings.webp"
  ),
  createProduct(
    "PRD-CHICKEN-019",
    "BBQ Chicken Wings",
    "chicken",
    "Wings",
    "bbq-chicken-wings",
    10.99,
    "1kg",
    "1kg",
    "per_kg",
    "Barbecue-style glazed chicken wings.",
    "Fresh chicken wings coated in smoky barbecue seasoning. Cooks up caramelised and juicy on the grill.",
    "BBQ Chicken Wings",
    ["BBQ", "Roast", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["BBQ", "Ready to Cook"],
    "/images/bbq-chicken-wings.webp"
  ),

  // --- WHOLE BIRDS ---
  createProduct(
    "PRD-CHICKEN-020",
    "Whole Chicken",
    "chicken",
    "Whole Birds",
    "whole-chicken",
    18.99,
    "1.5kg",
    "1.5kg",
    "per_item",
    "Fresh 1.5kg whole chicken for family Sunday roasts.",
    "Fresh 1.5kg whole chicken. Perfectly sized for roasting with garlic and herbs, slow cooking, or outdoor barbecue.",
    "Whole Chicken",
    ["Roast", "BBQ", "Slow Cook"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Family Meals"],
    "/images/whole-chicken.webp"
  ),
  createProduct(
    "PRD-CHICKEN-021",
    "Large Whole Chicken",
    "chicken",
    "Whole Birds",
    "large-whole-chicken",
    23.99,
    "2kg",
    "2kg",
    "per_item",
    "Generous 2kg whole bird for larger family gatherings.",
    "Fresh 2kg whole roasting chicken. Plump and juicy, ideal for feeding a full family roast dinner with leftover cold cuts.",
    "Whole Chicken",
    ["Roast", "BBQ", "Slow Cook"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Family Meals"],
    "/images/large-whole-chicken.webp"
  ),
  createProduct(
    "PRD-CHICKEN-022",
    "Spatchcock Chicken",
    "chicken",
    "Whole Birds",
    "spatchcock-chicken",
    13.99,
    "1kg",
    "1kg",
    "per_kg",
    "Butterflied spatchcock chicken for fast, flat grilling.",
    "Butterflied young whole chicken flattened for rapid and even grilling on the barbecue or under the broiler.",
    "Spatchcock Chicken",
    ["BBQ", "Roast", "Grill"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["BBQ"],
    "/images/spatchcock-chicken.webp"
  ),
  createProduct(
    "PRD-CHICKEN-023",
    "Free-Range Whole Chicken",
    "chicken",
    "Whole Birds",
    "free-range-whole-chicken",
    20.99,
    "1.5kg",
    "1.5kg",
    "per_item",
    "1.5kg free-range whole chicken for roasting.",
    "Fresh 1.5kg whole free-range chicken. Raised with free pasture access for superior natural texture and flavor.",
    "Free-Range Chicken",
    ["Roast", "BBQ"],
    ["Fresh Chilled"],
    ["Free-Range"],
    ["Specials", "Family Meals"],
    "/images/free-range-whole-chicken.webp",
    { quality_claims: "Free-Range" }
  ),

  // --- MINCE ---
  createProduct(
    "PRD-CHICKEN-024",
    "Chicken Mince",
    "chicken",
    "Mince",
    "chicken-mince",
    14.00,
    "1kg",
    "1kg",
    "per_kg",
    "Fresh lean chicken mince ground daily.",
    "Fresh ground chicken mince. Excellent for chicken burgers, san choy bow, meatballs, or light pasta sauces.",
    "Chicken Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep", "Budget Friendly"],
    "/images/chicken-mince.webp"
  ),
  createProduct(
    "PRD-CHICKEN-025",
    "Chicken Breast Mince",
    "chicken",
    "Mince",
    "chicken-breast-mince",
    14.00,
    "1kg",
    "1kg",
    "per_kg",
    "Extra lean chicken breast mince.",
    "Ground specifically from lean chicken breast fillets. Very high in protein and low in fat for clean meal prep.",
    "Chicken Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep"],
    "/images/chicken-breast-mince.webp"
  ),
  createProduct(
    "PRD-CHICKEN-026",
    "Chicken Thigh Mince",
    "chicken",
    "Mince",
    "chicken-thigh-mince",
    16.50,
    "1kg",
    "1kg",
    "per_kg",
    "Flavorful chicken thigh mince for juicy patties.",
    "Ground from rich chicken thigh fillets. Delivers extra juicy texture in chicken burgers, dumplings, and koftas.",
    "Chicken Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Fresh Chilled"],
    "/images/chicken-thigh-mince.webp"
  ),
  createProduct(
    "PRD-CHICKEN-027",
    "Lean Chicken Mince",
    "chicken",
    "Mince",
    "lean-chicken-mince",
    8.49,
    "500g",
    "500g",
    "per_pack",
    "500g pack of extra lean chicken mince.",
    "Fresh 500g portion of lean chicken mince. Perfect portion size for quick weeknight dinners and meal prep dishes.",
    "Chicken Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Meal Prep"],
    "/images/lean-chicken-mince.webp"
  ),

  // --- CRUMBED ---
  createProduct(
    "PRD-CHICKEN-028",
    "Crumbed Chicken Schnitzel",
    "chicken",
    "Crumbed",
    "crumbed-chicken-schnitzel",
    17.99,
    "1kg",
    "1kg",
    "per_kg",
    "Hand-crumbed chicken schnitzels ready to cook.",
    "Hand-pounded chicken breast coated in golden breadcrumbs. Fry or air-fry for golden pub-style chicken parmigianas.",
    "Chicken Schnitzel",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Best Sellers", "Family Meals", "Ready to Cook"],
    "/images/chicken-breast-schnitzel.webp",
    { featured: true, badge: "Family Favorite" }
  ),
  createProduct(
    "PRD-CHICKEN-029",
    "Chicken Breast Schnitzel",
    "chicken",
    "Crumbed",
    "chicken-breast-schnitzel",
    17.99,
    "1kg",
    "1kg",
    "per_kg",
    "Classic chicken breast schnitzels in crisp breadcrumbs.",
    "Lean chicken breast cutlets coated in seasoned crispy crumb. Quick to pan-fry for sandwiches, salads, and dinner plates.",
    "Chicken Schnitzel",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook", "Family Meals"],
    "/images/chicken-breast-schnitzel.webp"
  ),
  createProduct(
    "PRD-CHICKEN-030",
    "Chicken Tenders",
    "chicken",
    "Crumbed",
    "chicken-tenders",
    10.99,
    "500g",
    "500g",
    "per_pack",
    "500g pack of tender chicken strips.",
    "Succulent inner breast tenderloin strips. Ready for dipping, wrap fillings, or quick air-fryer family snacks.",
    "Chicken Tenders",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook"],
    "/images/chicken-tenders.webp"
  ),
  createProduct(
    "PRD-CHICKEN-031",
    "Crumbed Chicken Tenders",
    "chicken",
    "Crumbed",
    "crumbed-chicken-tenders",
    11.99,
    "500g",
    "500g",
    "per_pack",
    "500g crumbed chicken tenderloin strips.",
    "Hand-crumbed chicken breast tenderloins. Crisp up golden in the air fryer for kids meals and snack platters.",
    "Chicken Tenders",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook"],
    "/images/crumbed-chicken-tenders.webp"
  ),
  createProduct(
    "PRD-CHICKEN-032",
    "Chicken Kiev",
    "chicken",
    "Crumbed",
    "chicken-kiev",
    13.00,
    "2 pieces",
    "2 pieces",
    "per_pack",
    "Classic garlic butter filled chicken kievs (2 pack).",
    "Plump chicken breast cutlets stuffed with rich garlic butter and herbs, finished in a crisp golden breadcrumb shell.",
    "Chicken Kiev",
    ["Oven", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook"],
    "/images/chicken-kiev.webp"
  ),
  createProduct(
    "PRD-CHICKEN-033",
    "Chicken Cordon Bleu",
    "chicken",
    "Crumbed",
    "chicken-cordon-bleu",
    13.00,
    "2 pieces",
    "2 pieces",
    "per_pack",
    "Ham and cheese filled crumbed chicken breast (2 pack).",
    "Chicken breast wrapped around savory ham and melted cheese, enveloped in golden breadcrumbs. Bake in the oven until molten.",
    "Chicken Cordon Bleu",
    ["Oven", "Air Fryer"],
    ["Fresh Chilled"],
    ["None supplied"],
    ["Ready to Cook"],
    "/images/chicken-cordon-bleu.webp"
  ),

  // 3. LAMB
  createProduct(
    "PRD-LAMB-001",
    "Lamb Cutlet",
    "lamb",
    "Chops & Cutlets",
    "lamb-cutlets",
    34.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Tender, sweet, and succulent frenched pasture-raised Australian lamb cutlets.",
    "Our frenched lamb cutlets are hand-trimmed by expert butchers. Sweet, tender, and quick to sear on the pan, grill, or barbecue.",
    "Cutlet",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "BBQ", "Fresh Chilled"],
    "/images/lamb-cutlets.webp",
    { featured: true, badge: "Popular Cut", secondary_subcategories: ["BBQ"] }
  ),
  createProduct(
    "PRD-LAMB-002",
    "Lamb Loin Chops",
    "lamb",
    "Chops & Cutlets",
    "lamb-loin-chops",
    44.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Tender T-bone style lamb loin chops combining loin and tenderloin meat in every cut.",
    "Plump lamb loin chops cut thick. Ideal for grilling, pan-searing, or barbecuing over medium-high heat with garlic and rosemary.",
    "Chop",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Fresh Chilled"],
    "/images/lamb-loin-chops.webp"
  ),
  createProduct(
    "PRD-LAMB-003",
    "Lamb Forequarter Chops",
    "lamb",
    "Chops & Cutlets",
    "lamb-forequarter-chops",
    26.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Full-flavored shoulder chops great for slow grilling, braising, or slow cooking.",
    "Sourced from the lamb shoulder with natural marbling that delivers rich lamb flavor. Excellent for slow grilling or oven braising.",
    "Chop",
    ["BBQ", "Grill", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Slow Cooking"],
    "/images/lamb-forequarter-chops.webp"
  ),
  createProduct(
    "PRD-LAMB-004",
    "Lamb Shoulder Chops",
    "lamb",
    "Chops & Cutlets",
    "lamb-shoulder-chops",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Flavorful marbled lamb shoulder chops, perfect for low-and-slow barbecue or braising.",
    "Tender lamb shoulder chops cut for versatile home cooking. Great for slow grilling on the barbecue or braising in stews.",
    "Chop",
    ["BBQ", "Grill", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Family Meals"],
    "/images/lamb-shoulder-chops.webp"
  ),
  createProduct(
    "PRD-LAMB-005",
    "Lamb Chump Chops",
    "lamb",
    "Chops & Cutlets",
    "lamb-chump-chops",
    29.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Meaty rump chops cut from the top of the leg, thick, juicy, and full of flavor.",
    "Thick-cut lamb chump chops cut from the rump. Meaty and succulent, perfect for pan-frying or grilling on the barbecue.",
    "Chop",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Fresh Chilled"],
    "/images/lamb-chump-chops.webp"
  ),
  createProduct(
    "PRD-LAMB-006",
    "Bone-In Leg of Lamb",
    "lamb",
    "Roasts",
    "bone-in-leg-of-lamb",
    47.50,
    "2.5kg",
    "Approximately 2.5kg",
    "per_item",
    "Classic bone-in leg roast for traditional family Sunday roasts with crispy skin.",
    "The classic Australian Sunday roast centerpiece. Bone-in leg of lamb with natural fat cap for juicy, tender roasted meat.",
    "Roast",
    ["Roast", "BBQ"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Weekend Roast", "Family Meals"],
    "/images/bone-in-leg-of-lamb.webp",
    { featured: true, badge: "Sunday Roast" }
  ),
  createProduct(
    "PRD-LAMB-007",
    "Boneless Leg of Lamb",
    "lamb",
    "Roasts",
    "boneless-leg-of-lamb",
    62.48,
    "2.5kg",
    "Approximately 2.5kg",
    "per_item",
    "Hand-deboned leg roast, easy to slice and carve for family gatherings.",
    "Hand-deboned and netted leg of lamb roast. Easy to slice and serve for Sunday roasts, butterflied barbecue, or oven roasting.",
    "Roast",
    ["Roast", "BBQ"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast", "Family Meals"],
    "/images/boneless-leg-of-lamb.webp"
  ),
  createProduct(
    "PRD-LAMB-008",
    "Lamb Shoulder Roast",
    "lamb",
    "Roasts",
    "lamb-shoulder-roast",
    27.00,
    "1.5kg",
    "Approximately 1.5kg",
    "per_item",
    "Bone-in lamb shoulder roast ideal for slow 6-hour roasting until tender.",
    "Bone-in lamb shoulder roast packed with rich marbling. Perfect for low-and-slow oven roasting until the meat melts off the bone.",
    "Roast",
    ["Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast", "Slow Cooking"],
    "/images/lamb-shoulder-roast.webp",
    { secondary_subcategories: ["Slow Cook"] }
  ),
  createProduct(
    "PRD-LAMB-009",
    "Boneless Lamb Shoulder Roast",
    "lamb",
    "Roasts",
    "boneless-lamb-shoulder-roast",
    44.98,
    "1.5kg",
    "Approximately 1.5kg",
    "per_item",
    "Deboned lamb shoulder roast netted for easy carving and pull-apart slow roasts.",
    "Deboned and netted lamb shoulder roast. Ideal for slow roasting or smoking on the barbecue for pulled lamb sandwiches.",
    "Roast",
    ["Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast", "Slow Cooking"],
    "/images/boneless-lamb-shoulder-roast.webp",
    { secondary_subcategories: ["Slow Cook"] }
  ),
  createProduct(
    "PRD-LAMB-010",
    "Rolled Lamb Roast",
    "lamb",
    "Roasts",
    "rolled-lamb-roast",
    44.98,
    "1.5kg",
    "Approximately 1.5kg",
    "per_item",
    "Rolled and tied lamb roast for uniform roasting and easy slicing.",
    "Rolled and tied boneless lamb roast prepared by our butchers. Ensures even cooking and effortless carving for roast dinners.",
    "Roast",
    ["Roast"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast"],
    "/images/rolled-lamb-roast.webp"
  ),
  createProduct(
    "PRD-LAMB-011",
    "Lamb Rack",
    "lamb",
    "Roasts",
    "lamb-rack",
    34.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Premium frenched lamb rack, elegant centerpiece for special dinner occasions.",
    "Frenched 8-rib lamb rack with tender loin meat. Roast whole or cut into individual cutlets for a high-end dining experience at home.",
    "Rack",
    ["Roast", "Grill"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Weekend Roast", "Fresh Chilled"],
    "/images/lamb-rack.webp",
    { featured: true, badge: "Chef's Cut", secondary_subcategories: ["Chops & Cutlets"] }
  ),
  createProduct(
    "PRD-LAMB-012",
    "Lamb Shanks",
    "lamb",
    "Slow Cook",
    "lamb-shanks",
    19.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Meaty hind shanks that melt into tender stew meat during slow red wine braising.",
    "Meaty lamb shanks cut from pasture-raised lambs. Slow braise in red wine, rosemary, and root vegetables for rich winter comfort food.",
    "Shank",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Slow Cooking"],
    "/images/lamb-shanks.webp",
    { featured: true, badge: "Winter Classic" }
  ),
  createProduct(
    "PRD-LAMB-013",
    "Lamb Shoulder",
    "lamb",
    "Slow Cook",
    "lamb-shoulder",
    18.00,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Well-marbled lamb shoulder, cut for low-and-slow braising and stews.",
    "Bone-in lamb shoulder section with rich connective tissue that softens into gelatin during slow cooking.",
    "Shoulder",
    ["Slow Cook", "Roast"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking"],
    "/images/lamb-shoulder.webp"
  ),
  createProduct(
    "PRD-LAMB-014",
    "Diced Lamb",
    "lamb",
    "Slow Cook",
    "diced-lamb",
    29.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Trimmed hand-diced lamb shoulder cubes for stews, curries, and tagines.",
    "Tender hand-diced lamb shoulder cubes. Braises into melt-in-your-mouth morsels in curries, stews, and casseroles.",
    "Diced",
    ["Slow Cook", "Curry", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking", "Meal Prep"],
    "/images/diced-lamb.webp",
    { secondary_subcategories: ["Mince & Diced"] }
  ),
  createProduct(
    "PRD-LAMB-015",
    "Lamb Neck Chops",
    "lamb",
    "Slow Cook",
    "lamb-neck-chops",
    21.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Gelatin-rich lamb neck chops that create silky, flavorful slow-cooked stews.",
    "Gelatin-rich lamb neck chops. Ideal for long slow simmering in casseroles and traditional Irish stews for deep flavor.",
    "Chop",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking"],
    "/images/lamb-neck-chops.webp"
  ),
  createProduct(
    "PRD-LAMB-016",
    "Lamb Ribs",
    "lamb",
    "Slow Cook",
    "lamb-ribs",
    19.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Juicy lamb ribs ideal for slow baking, braising, or smoking.",
    "Meaty lamb ribs ready for low-and-slow baking, braising, or smoking on the barbecue.",
    "Ribs",
    ["Slow Cook", "BBQ"],
    ["Fresh Chilled"],
    null,
    ["Slow Cooking", "BBQ"],
    "/images/lamb-ribs.webp",
    { secondary_subcategories: ["BBQ"] }
  ),
  createProduct(
    "PRD-LAMB-017",
    "Lamb Breast",
    "lamb",
    "Slow Cook",
    "lamb-breast",
    18.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Flavorful lamb breast cut for rolling, stuffing, or slow simmering.",
    "Traditional lamb breast cut. Great for rolling with herbs, slow roasting, or simmering down in hearty broth.",
    "Breast",
    ["Slow Cook", "Roast"],
    ["Fresh Chilled"],
    null,
    ["Slow Cooking"],
    "/images/lamb-breast.webp"
  ),
  createProduct(
    "PRD-LAMB-018",
    "Lamb Mince",
    "lamb",
    "Mince & Diced",
    "lamb-mince",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Fresh ground lamb for Greek moussaka, koftas, burgers, and shepherd's pie.",
    "Freshly ground lamb mince prepared in-house daily. Perfect for shepherd's pie, Mediterranean koftas, moussaka, and burgers.",
    "Mince",
    ["Pan-Fry", "BBQ", "Curry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Family Meals", "Meal Prep"],
    "/images/lamb-mince.webp"
  ),
  createProduct(
    "PRD-LAMB-019",
    "Lean Lamb Mince",
    "lamb",
    "Mince & Diced",
    "lean-lamb-mince",
    13.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Trimmed lean lamb mince, high in protein and lower in fat for daily meals.",
    "Extra trimmed lean lamb mince. High protein option for healthy meals, stuffed capsicums, and lean burger patties.",
    "Mince",
    ["Pan-Fry", "BBQ", "Curry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Meal Prep"],
    "/images/lean-lamb-mince.webp"
  ),
  createProduct(
    "PRD-LAMB-020",
    "Lamb Stir-Fry Strips",
    "lamb",
    "Mince & Diced",
    "lamb-stir-fry-strips",
    17.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Tender lamb strips sliced for quick stir-fries, fajitas, or warm salads.",
    "Finely sliced tender lamb leg or shoulder strips. Perfect for quick wok stir-fries, warm lamb salads, or souvlaki wraps.",
    "Strips",
    ["Stir-Fry", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Quick Meals"],
    "/images/lamb-stir-fry-strips.webp"
  ),
   createProduct(
    "PRD-LAMB-022",
    "Lamb BBQ Chops",
    "lamb",
    "BBQ",
    "lamb-bbq-chops",
    29.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Thick-cut lamb chops selected specifically for sizzling barbecue cooking.",
    "Thick-cut lamb shoulder or forequarter chops selected for outdoor barbecue grilling. Sizzle over hot coals for rich flavor.",
    "Chop",
    ["BBQ", "Grill"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ"],
    "/images/lamb-bbq-chops.webp",
    { secondary_subcategories: ["Chops & Cutlets"] }
  ),
    createProduct(
    "PRD-LAMB-025",
    "Marinated Lamb Chops",
    "lamb",
    "BBQ",
    "marinated-lamb-chops",
    34.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Fresh lamb chops tumbled in garlic, rosemary, and herb marinade.",
    "Tender lamb chops infused with garlic, rosemary, and olive oil marinade. Ready to drop straight onto the barbecue.",
    "Marinated Lamb",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ"],
    "/images/marinated-lamb-chops.webp",
    { secondary_subcategories: ["Chops & Cutlets"] }
  ),
    // 4. PORK
  // PORK — ROASTS
  createProduct(
    "PRD-PORK-001",
    "Pork Loin Roast",
    "pork",
    "Roasts",
    "pork-loin-roast",
    38.99,
    "1.5kg",
    "Approximately 1.5kg",
    "per_item",
    "Lean tender pork loin roast with scored skin for crispy crackling.",
    "Center-cut pork loin roast with rind scored for crispy oven crackling. Tender, juicy, and perfect for Sunday roast dinners.",
    "Pork Roast",
    ["Roast", "BBQ"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Weekend Roast", "Fresh Chilled"],
    "/images/pork-loin-roast.webp",
    { featured: true, badge: "Crispy Crackling" }
  ),
  createProduct(
    "PRD-PORK-002",
    "Pork Shoulder Roast",
    "pork",
    "Roasts",
    "pork-shoulder-roast",
    35.99,
    "2kg",
    "Approximately 2kg",
    "per_item",
    "Well-marbled pork shoulder roast ideal for crispy crackling roast or slow pulled pork.",
    "Generous pork shoulder roast with internal marbling that stays succulent during roasting or long slow cooking for pulled pork.",
    "Pork Roast",
    ["Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast", "Slow Cooking", "Family Meals"],
    "/images/pork-shoulder-roast.webp",
    { secondary_subcategories: ["Slow Cook"] }
  ),
  createProduct(
    "PRD-PORK-003",
    "Rolled Pork Roast",
    "pork",
    "Roasts",
    "rolled-pork-roast",
    32.99,
    "1.5kg",
    "Approximately 1.5kg",
    "per_item",
    "Hand-rolled and tied boneless pork roast for easy carving and even roasting.",
    "Hand-rolled boneless pork roast prepared by our craft butchers. Easy to slice and roast evenly with beautiful skin crackling.",
    "Pork Roast",
    ["Roast"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast", "Family Meals"],
    "/images/rolled-pork-roast.webp"
  ),
  createProduct(
    "PRD-PORK-004",
    "Pork Leg Roast",
    "pork",
    "Roasts",
    "pork-leg-roast",
    27.48,
    "2.5kg",
    "Approximately 2.5kg",
    "per_item",
    "Generous family-sized pork leg roast for lean slices and golden crackling.",
    "Classic bone-in or netted pork leg roast. Lean, tender roast meat with scored fat cap for golden crunchy crackling.",
    "Pork Roast",
    ["Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Weekend Roast", "Family Meals", "Budget Friendly"],
    "/images/pork-leg-roast.webp"
  ),
  createProduct(
    "PRD-PORK-005",
    "Pork Hock",
    "pork",
    "Roasts",
    "pork-hock",
    15.99,
    "600g",
    "Approximately 600g",
    "per_kg",
    "Gelatin-rich meaty pork hock ideal for German schweinshaxe, soups, and slow braises.",
    "Meaty pork hock with thick rind and collagen-rich connective tissue. Braise slowly or roast for crispy skin schweinshaxe.",
    "Pork Hock",
    ["Slow Cook", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking", "Budget Friendly"],
    "/images/pork-hock.webp",
    { secondary_subcategories: ["Slow Cook"] }
  ),

  // PORK — BELLY & RIBS
  createProduct(
    "PRD-PORK-006",
    "Pork Belly",
    "pork",
    "Belly & Ribs",
    "pork-belly",
    35.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Succulent score-cut pork belly with layers of tender meat and golden crackling fat.",
    "Thick-layered pork belly cut with rind scored ready for roasting or braising. Delivers ultra-crispy crackling and melt-in-the-mouth meat.",
    "Pork Belly",
    ["Roast", "BBQ", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "BBQ", "Weekend Roast"],
    "/images/pork-belly.webp",
    { featured: true, badge: "Popular Cut" }
  ),
  createProduct(
    "PRD-PORK-007",
    "Pork Belly Slices",
    "pork",
    "Belly & Ribs",
    "pork-belly-slices",
    18.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Thick-sliced pork belly pieces perfect for Korean BBQ, pan-searing, or grilling.",
    "Thickly cut pork belly strips with rind-on or off. Ideal for quick sizzling on the barbecue grill or pan for Korean samgyeopsal.",
    "Pork Belly",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Fresh Chilled"],
    "/images/pork-belly-slices.webp"
  ),
  createProduct(
    "PRD-PORK-008",
    "Pork Spare Ribs",
    "pork",
    "Belly & Ribs",
    "pork-spare-ribs",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Meaty pork spare ribs ready for sticky barbecue glaze and low-and-slow smoking.",
    "Generous, meaty pork spare ribs cut from the belly section. Perfect for low-and-slow smoking, baking, or barbecue grilling.",
    "Pork Ribs",
    ["BBQ", "Grill", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "BBQ", "Slow Cooking"],
    "/images/pork-spare-ribs.webp"
  ),
  createProduct(
    "PRD-PORK-009",
    "American-Style Pork Ribs",
    "pork",
    "Belly & Ribs",
    "american-style-pork-ribs",
    19.99,
    "600g",
    "600g Pack",
    "per_pack",
    "Baby back style rack of pork ribs trimmed for tender fall-off-the-bone barbecue.",
    "Curved baby back loin pork ribs trimmed American style. Apply dry rub and slow roast or smoke for fall-off-the-bone tenderness.",
    "Pork Ribs",
    ["BBQ", "Grill", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Slow Cooking"],
    "/images/american-style-pork-ribs.webp"
  ),
  createProduct(
    "PRD-PORK-010",
    "Pork Rashers",
    "pork",
    "Belly & Ribs",
    "pork-rashers",
    14.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Thick-cut fresh uncured pork belly rashers for sizzling on the barbecue or pan.",
    "Thick slices of fresh pork belly rashers. Sizzle over high heat for crispy edges and tender pork flavor.",
    "Pork Belly",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Fresh Chilled"],
    "/images/pork-rashers.webp"
  ),

  // PORK — CHOPS & STEAKS
  createProduct(
    "PRD-PORK-011",
    "Pork Cutlets",
    "pork",
    "Chops & Steaks",
    "pork-cutlets",
    23.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Thick bone-in pork loin cutlets for juicy grilling, searing, or baking.",
    "Hand-cut bone-in pork loin cutlets. The bone keeps the meat moist and flavorful during quick pan-searing or barbecue grilling.",
    "Pork Cutlet",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "BBQ", "Family Meals"],
    "/images/pork-cutlets.webp",
    { featured: true, badge: "Butcher's Cut" }
  ),
  createProduct(
    "PRD-PORK-012",
    "Pork Loin Steaks",
    "pork",
    "Chops & Steaks",
    "pork-loin-steaks",
    25.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Boneless lean pork loin steaks trimmed for quick mid-week dinners.",
    "Boneless center-cut pork loin steaks trimmed lean. Fast cooking and versatile for marinades, pan-frying, or grilling.",
    "Pork Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Family Meals", "Meal Prep"],
    "/images/pork-loin-steaks.webp"
  ),
  createProduct(
    "PRD-PORK-013",
    "Pork Scotch Fillet",
    "pork",
    "Chops & Steaks",
    "pork-scotch-fillet",
    29.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Juicy marbled pork neck steaks offering rich tenderness and flavor.",
    "Pork scotch fillet steaks cut from the neck loin with natural intermuscular fat. Stays exceptionally juicy when pan-seared or grilled.",
    "Pork Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "BBQ", "Fresh Chilled"],
    "/images/pork-scotch-fillet.webp"
  ),
  createProduct(
    "PRD-PORK-014",
    "Pork Neck Steaks",
    "pork",
    "Chops & Steaks",
    "pork-neck-steaks",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Flavorful marbled pork neck steaks ideal for barbecue grilling and pan frying.",
    "Thickly sliced pork neck steaks with fine marbling throughout. Highly forgiving on the grill or hot pan for juicy pork dishes.",
    "Pork Steak",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Family Meals"],
    "/images/pork-neck-steaks.webp"
  ),
  createProduct(
    "PRD-PORK-015",
    "Pork Schnitzel",
    "pork",
    "Chops & Steaks",
    "pork-schnitzel",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Tender tenderised pork steaks ready for crumbing and pan-frying or air frying.",
    "Hand-cut lean pork loin steaks tenderised thin. Ideal for crumbing for classic pork schnitzel or quick air-fryer cooking.",
    "Pork Schnitzel",
    ["Pan-Fry", "Air Fryer"],
    ["Fresh Chilled"],
    null,
    ["Family Meals", "Quick Meals"],
    "/images/pork-schnitzel.webp"
  ),

  // PORK — MINCE
  createProduct(
    "PRD-PORK-016",
    "Pork Mince",
    "pork",
    "Mince",
    "pork-mince",
    12.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Freshly ground pork mince for dumplings, meatballs, burgers, and stir-fries.",
    "Ground pork mince prepared in-house daily. Perfect for Asian dumplings, Vietnamese pork patties, meatballs, and San Choy Bow.",
    "Pork Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Budget Friendly", "Family Meals", "Meal Prep"],
    "/images/pork-mince.webp"
  ),
  createProduct(
    "PRD-PORK-017",
    "Lean Pork Mince",
    "pork",
    "Mince",
    "lean-pork-mince",
    8.99,
    "500g",
    "500g Pack",
    "per_pack",
    "Extra-trimmed lean pork mince for healthy stir-fries, burgers, and pasta.",
    "Extra-trimmed lean ground pork mince. Higher protein content with lower fat for clean meal prep, stuffed capsicums, and stir-fries.",
    "Pork Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Meal Prep", "Budget Friendly"],
    "/images/lean-pork-mince.webp"
  ),
  createProduct(
    "PRD-PORK-018",
    "Premium Pork Mince",
    "pork",
    "Mince",
    "premium-pork-mince",
    16.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Finely ground pork mince prepared from select muscle cuts for smooth texture.",
    "Finely ground pork mince from trimmed muscle cuts. Excellent binder and flavor for gourmet sausages, burgers, and terrines.",
    "Pork Mince",
    ["Pan-Fry", "BBQ", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Fresh Chilled", "Meal Prep"],
    "/images/premium-pork-mince.webp"
  ),
  createProduct(
    "PRD-PORK-019",
    "Diced Pork",
    "pork",
    "Mince",
    "diced-pork",
    19.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Trimmed hand-diced pork shoulder cubes for sweet and sour pork, curries, and stews.",
    "Tender hand-diced pork shoulder cubes. Great for stir-frying in sweet and sour pork, slow-cooking in pork stews, or curries.",
    "Diced Pork",
    ["Stir-Fry", "Slow Cook", "Curry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Slow Cooking", "Meal Prep"],
    "/images/diced-pork.webp",
    { secondary_subcategories: ["Slow Cook"] }
  ),

  // PORK — BACON & HAM
  createProduct(
    "PRD-PORK-020",
    "Streaky Bacon",
    "pork",
    "Bacon & Ham",
    "streaky-bacon",
    9.99,
    "500g",
    "500g",
    "per_pack",
    "Streaky pork belly bacon rashers for crispy breakfast cooking.",
    "Cured pork belly streaky bacon. Crisps up beautifully on the pan or grill for breakfast feasts, burgers, and wraps.",
    "Bacon",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Fresh Chilled", "Sliced"],
    null,
    ["Bacon", "Best Sellers", "Breakfast", "Deli Favourites"],
    "/images/streaky-bacon.webp",
    { primary_product_category: "Pork", secondary_subcategories: ["Bacon"] }
  ),
  createProduct(
    "PRD-PORK-021",
    "Middle Bacon",
    "pork",
    "Bacon & Ham",
    "middle-bacon",
    7.99,
    "500g",
    "500g",
    "per_pack",
    "Full rashers of middle bacon combining lean eye bacon and streaky bacon.",
    "Traditional Australian middle bacon rashers featuring both the lean eye loin and streaky belly strip. Cured for classic breakfast cooking.",
    "Bacon",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Fresh Chilled", "Sliced"],
    null,
    ["Bacon", "Breakfast", "Deli Favourites"],
    "/images/middle-bacon.webp",
    { featured: true, badge: "Breakfast Classic", primary_product_category: "Pork", secondary_subcategories: ["Bacon"] }
  ),
  createProduct(
    "PRD-PORK-022",
    "Rindless Short Cut Bacon",
    "pork",
    "Bacon & Ham",
    "rindless-short-cut-bacon",
    17.99,
    "1kg",
    "1kg",
    "per_pack",
    "1kg pack of lean rindless short cut bacon rashers.",
    "Trimmed rindless short cut eye bacon rashers with fat removed. High lean protein ratio for healthy breakfast rolls, eggs benedict, and wraps.",
    "Bacon",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Fresh Chilled", "Sliced"],
    null,
    ["Bacon", "Breakfast", "Fresh Chilled"],
    "/images/rindless-short-cut-bacon.webp",
    { primary_product_category: "Pork", secondary_subcategories: ["Bacon"] }
  ),
  createProduct(
    "PRD-PORK-023",
    "Leg Ham Off the Bone",
    "pork",
    "Bacon & Ham",
    "leg-ham-off-the-bone",
    29.99,
    "1kg",
    "1kg",
    "per_kg",
    "Traditional leg ham off the bone for sandwiches, lunches, and grazing platters.",
    "Carved leg ham off the bone crafted from pork leg. Lightly cured with natural spices. Ready to eat for sandwiches, wraps, and deli platters.",
    "Leg Ham",
    ["No Cooking Required", "Roast"],
    ["Fresh Chilled", "Sliced", "Cooked"],
    null,
    ["Ham", "Best Sellers", "Deli Favourites"],
    "/images/leg-ham-off-the-bone.webp",
    { primary_product_category: "Pork", secondary_subcategories: ["Ham"] }
  ),
  createProduct(
    "PRD-PORK-024",
    "Ham Steaks",
    "pork",
    "Bacon & Ham",
    "ham-steaks",
    12.99,
    "500g",
    "500g",
    "per_pack",
    "Thick-cut cooked leg ham steaks ready to pan-sear or grill.",
    "Thick-cut slices of cooked leg ham. Quick to pan-fry or grill on the barbecue for classic Aussie ham and pineapple dinners.",
    "Ham Steak",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Fresh Chilled", "Cooked"],
    null,
    ["Ham", "Deli Favourites"],
    "/images/ham-steaks.webp",
    { primary_product_category: "Pork", secondary_subcategories: ["Ham"] }
  ),

  // 5. SAUSAGES
  // SAUSAGES — BEEF
  createProduct(
    "PRD-SAUSAGE-001",
    "Thick Beef Sausages",
    "sausages",
    "Beef",
    "thick-beef-sausages",
    17.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Traditional thick beef sausages made with coarse ground beef for barbecue dinners.",
    "Classic Australian butcher shop thick beef sausages. Prepared with ground beef and balanced seasonings for juicy barbecue grilling and family dinners.",
    "Beef Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Best Sellers", "BBQ", "Family Meals"],
    "/images/thick-beef-sausages.webp",
    { featured: true, badge: "Family Favorite" }
  ),
  createProduct(
    "PRD-SAUSAGE-002",
    "Thin Beef Sausages",
    "sausages",
    "Beef",
    "thin-beef-sausages",
    17.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Classic thin beef sausages that sizzle quickly on the pan or barbecue grill.",
    "Thin beef sausages crafted for fast cooking on weekday pan-fries or weekend barbecues. Sizzle evenly with savory beef flavor.",
    "Beef Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Family Meals"],
    "/images/thin-beef-sausages.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-003",
    "Beef Chipolatas",
    "sausages",
    "Beef",
    "beef-chipolatas",
    9.20,
    "500g",
    "500g Pack",
    "per_pack",
    "Slender beef chipolatas perfect for big breakfasts, kids' meals, or party platters.",
    "Slender, thin-cased beef chipolatas that cook in minutes. Great for cooked breakfast spreads, appetizers, or quick dinners.",
    "Beef Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Breakfast", "Family Meals"],
    "/images/beef-chipolatas.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-004",
    "Beef Sausage Patties",
    "sausages",
    "Beef",
    "beef-sausage-patties",
    13.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Seasoned ground beef sausage patties ideal for breakfast muffin rolls and burger grills.",
    "Seasoned beef sausage patties pressed for easy pan-frying or grilling. Perfect for morning breakfast rolls, egg muffins, or classic barbecue burgers.",
    "Beef Sausage Patty",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Breakfast", "Budget Friendly"],
    "/images/beef-sausage-patties.webp"
  ),

  // SAUSAGES — PORK
  createProduct(
    "PRD-SAUSAGE-005",
    "Pork Sausages",
    "sausages",
    "Pork",
    "pork-sausages",
    18.40,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Traditional pork sausages seasoned for bangers and mash or barbecue grilling.",
    "Classic butcher-style pork sausages crafted with ground pork and subtle savory seasonings. Ideal for bangers and mash, casserole, or hot off the grill.",
    "Pork Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Best Sellers", "BBQ", "Family Meals"],
    "/images/pork-sausages.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-006",
    "Pork Chipolatas",
    "sausages",
    "Pork",
    "pork-chipolatas",
    9.20,
    "500g",
    "500g Pack",
    "per_pack",
    "Slender pork chipolatas that cook in minutes for breakfast spreads or entertaining.",
    "Slender pork chipolatas with a smooth texture and mild flavor. Quick to pan-fry for cooked breakfasts or festive roast side dishes.",
    "Pork Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Breakfast", "Family Meals"],
    "/images/pork-chipolatas.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-007",
    "Pork & Sage Sausages",
    "sausages",
    "Pork",
    "pork-sage-sausages",
    9.45,
    "500g",
    "500g Pack",
    "per_pack",
    "Savoury pork sausages infused with rubbed sage and warm herbal seasonings.",
    "Savoury pork sausages seasoned with rubbed garden sage and warm spices. Delivers rich, aromatic flavor whether grilled or pan-fried.",
    "Pork Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Gourmet", "Specials"],
    "/images/pork-sage-sausages.webp",
    { secondary_subcategories: ["Gourmet Flavours"] }
  ),
  createProduct(
    "PRD-SAUSAGE-008",
    "Italian Pork Sausages",
    "sausages",
    "Pork",
    "italian-pork-sausages",
    9.55,
    "500g",
    "500g Pack",
    "per_pack",
    "Traditional Italian-style pork sausages seasoned with toasted fennel seed and spices.",
    "Rustic Italian pork sausages crafted with ground pork, toasted fennel seeds, and cracked pepper. Great for pasta sauces, pizza toppings, or sizzling on the grill.",
    "Pork Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Best Sellers", "Gourmet", "BBQ"],
    "/images/italian-pork-sausages.webp",
    { secondary_subcategories: ["Gourmet Flavours"], featured: true, badge: "Authentic Recipe" }
  ),

  // SAUSAGES — CHICKEN
  createProduct(
    "PRD-SAUSAGE-009",
    "Chicken Sausages",
    "sausages",
    "Chicken",
    "chicken-sausages",
    18.50,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Light and savory chicken sausages crafted for family barbecues and pan-frying.",
    "Juicy chicken sausages made from ground chicken meat and mild garden seasonings. A lighter alternative for family meals and barbecues.",
    "Chicken Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Family Meals", "BBQ"],
    "/images/chicken-sausages.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-010",
    "Chicken Chipolatas",
    "sausages",
    "Chicken",
    "chicken-chipolatas",
    9.25,
    "500g",
    "500g Pack",
    "per_pack",
    "Slender chicken chipolatas ideal for quick pan-frying and light breakfasts.",
    "Thin chicken chipolatas seasoned lightly for quick cooking. Perfect for breakfast plates or casual finger-food platters.",
    "Chicken Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Breakfast", "Family Meals"],
    "/images/chicken-chipolatas.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-011",
    "Chicken, Lemon & Tarragon Sausages",
    "sausages",
    "Chicken",
    "chicken-lemon-tarragon-sausages",
    9.25,
    "500g",
    "500g Pack",
    "per_pack",
    "Gourmet chicken sausages infused with zesty lemon and aromatic tarragon.",
    "Gourmet chicken sausages blended with citrusy lemon zest and aromatic French tarragon. Bright and fragrant flavor profile ideal for summer grilling.",
    "Chicken Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Gourmet", "Specials"],
    "/images/chicken-lemon-tarragon-sausages.webp",
    { secondary_subcategories: ["Gourmet Flavours"] }
  ),
  createProduct(
    "PRD-SAUSAGE-012",
    "Chicken & Herb Sausages",
    "sausages",
    "Chicken",
    "chicken-herb-sausages",
    9.25,
    "500g",
    "500g Pack",
    "per_pack",
    "Succulent chicken sausages mixed with parsley, thyme, and garden herbs.",
    "Chicken sausages blended with chopped fresh parsley, thyme, and garden herbs. Mild and aromatic for everyday pan-searing or grilling.",
    "Chicken Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Family Meals", "BBQ"],
    "/images/chicken-herb-sausages.webp"
  ),

  // SAUSAGES — LAMB
  createProduct(
    "PRD-SAUSAGE-013",
    "Lamb Sausages",
    "sausages",
    "Lamb",
    "lamb-sausages",
    19.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Rich and hearty lamb sausages coarsely ground and seasoned with mild spices.",
    "Robust lamb sausages made with coarsely ground lamb meat and savory herbs. Rich flavor that pairs beautifully with grilled vegetables or mash.",
    "Lamb Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Best Sellers", "BBQ"],
    "/images/lamb-sausages.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-014",
    "Lamb Chipolatas",
    "sausages",
    "Lamb",
    "lamb-chipolatas",
    10.25,
    "500g",
    "500g Pack",
    "per_pack",
    "Delicate lamb chipolatas that cook fast on the pan or grill for breakfast or tapas.",
    "Thinly cased lamb chipolatas offering concentrated savory lamb flavor in a quick-cooking format. Great for hot breakfasts or tapas skewers.",
    "Lamb Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Breakfast", "Gourmet"],
    "/images/lamb-chipolatas.webp"
  ),
  createProduct(
    "PRD-SAUSAGE-015",
    "Lamb & Rosemary Sausages",
    "sausages",
    "Lamb",
    "lamb-rosemary-sausages",
    10.25,
    "500g",
    "500g Pack",
    "per_pack",
    "Classic pairing of tender ground lamb with chopped garden rosemary and garlic.",
    "Crafted with ground lamb, finely chopped fresh rosemary, and a touch of garlic. A classic gourmet combination for barbecues and Sunday roasts.",
    "Lamb Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Best Sellers", "Gourmet", "BBQ"],
    "/images/lamb-rosemary-sausages.webp"
  ),

  // SAUSAGES — GOURMET FLAVOURS
  createProduct(
    "PRD-SAUSAGE-016",
    "Beef Pepper & Worcestershire Sausages",
    "sausages",
    "Gourmet Flavours",
    "beef-pepper-worcestershire-sausages",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Gourmet beef sausages seasoned with cracked black pepper and tangy Worcestershire sauce.",
    "Coarse ground beef sausages seasoned with cracked black peppercorns and rich Worcestershire sauce. A bold, savory gourmet favorite on the barbecue grill.",
    "Gourmet Beef Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Gourmet", "BBQ", "Specials"],
    "/images/beef-pepper-worcestershire-sausages.webp",
    { secondary_subcategories: ["Beef"] }
  ),
  createProduct(
    "PRD-SAUSAGE-017",
    "Beef & Lamb Merguez Sausages",
    "sausages",
    "Gourmet Flavours",
    "beef-lamb-merguez-sausages",
    10.25,
    "500g",
    "500g Pack",
    "per_pack",
    "Spicy North African style beef and lamb merguez sausages blended with harissa and cumin.",
    "Traditional spicy merguez sausages combining ground beef and lamb with harissa chili, cumin, coriander, and garlic. Delivers a warm, vibrant spice profile.",
    "Gourmet Beef and Lamb Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Gourmet", "BBQ"],
    "/images/beef-lamb-merguez-sausages.webp",
    { secondary_subcategories: ["Beef", "Lamb"] }
  ),
  createProduct(
    "PRD-SAUSAGE-018",
    "Breakfast Sausages",
    "sausages",
    "Gourmet Flavours",
    "breakfast-sausages",
    9.20,
    "500g",
    "500g Pack",
    "per_pack",
    "Mildly seasoned breakfast sausages crafted for morning fry-ups and eggs.",
    "Classic breakfast sausages mildly seasoned with gentle herbs and pepper. Quick to cook in the skillet alongside eggs, bacon, and grilled tomatoes.",
    "Breakfast Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["Breakfast", "Family Meals"],
    "/images/breakfast-sausages.webp",
    { secondary_subcategories: ["Pork"] }
  ),

  // 6. BBQ & GRILL
  // STEAK PACKS
  createProduct(
    "PRD-BBQ-001",
    "BBQ Rump Steak Pack",
    "bbq-grill",
    "Steak Packs",
    "bbq-rump-steak-pack",
    27.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Value pack of tender rump steaks cut for high-heat barbecue grilling.",
    "Our BBQ Rump Steak Pack delivers rich, beefy flavor with a fine ribbon of outer fat that caramelises beautifully over hot barbecue grills.",
    "Beef Steak Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Best Sellers"],
    "/images/bbq-rump-steak-pack.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-002",
    "BBQ Porterhouse Steak Pack",
    "bbq-grill",
    "Steak Packs",
    "bbq-porterhouse-steak-pack",
    34.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Premium porterhouse steaks with tender strip loin and dark fat cap.",
    "Juicy porterhouse steaks trimmed to perfection for outdoor barbecue gatherings. Ideal for searing over open flame.",
    "Beef Steak Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Steak Packs"],
    "/images/bbq-porterhouse-steak-pack.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-003",
    "BBQ Scotch Fillet Steak Pack",
    "bbq-grill",
    "Steak Packs",
    "bbq-scotch-fillet-steak-pack",
    39.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Highly marbled scotch fillet steaks delivering maximum succulence.",
    "Scotch fillet steaks with natural intramuscular marbling that melts into tender richness on a hot barbecue plate.",
    "Beef Steak Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Steak Packs", "Best Sellers"],
    "/images/bbq-scotch-fillet-steak-pack.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-004",
    "Mixed BBQ Steak Pack",
    "bbq-grill",
    "Steak Packs",
    "mixed-bbq-steak-pack",
    42.99,
    "1.5kg",
    "1.5kg Pack",
    "per_pack",
    "Variety pack featuring rump, porterhouse, and scotch fillet steaks.",
    "A versatile assortment of popular beef steaks designed to satisfy different preferences at family barbecues.",
    "Mixed Steak Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Steak Packs", "Family Meals"],
    "/images/mixed-bbq-steak-pack.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-005",
    "Family BBQ Steak Pack",
    "bbq-grill",
    "Steak Packs",
    "family-bbq-steak-pack",
    54.99,
    "2kg",
    "2kg Pack",
    "per_pack",
    "Generous 2kg bulk steak pack ideal for large weekend gatherings.",
    "Feed the family with this generous 2kg selection of prime grilling steaks, hand-cut by our master butchers.",
    "Beef Steak Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["BBQ", "Steak Packs", "Family Meals"],
    "/images/family-bbq-steak-pack.webp",
    { primary_product_category: "Beef" }
  ),

  // SAUSAGE PACKS
  createProduct(
    "PRD-BBQ-006",
    "BBQ Beef Sausage Pack",
    "bbq-grill",
    "Sausage Packs",
    "bbq-beef-sausage-pack",
    17.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Classic Australian beef sausages crafted for barbecue hotplates.",
    "Traditional beef sausages made with ground beef and balanced seasoning, perfect for sizzles and family cookouts.",
    "Beef Sausage Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Sausage Packs", "Best Sellers"],
    "/images/bbq-beef-sausage-pack.webp",
    { primary_product_category: "Sausages" }
  ),
  createProduct(
    "PRD-BBQ-007",
    "BBQ Thin Sausage Pack",
    "bbq-grill",
    "Sausage Packs",
    "bbq-thin-sausage-pack",
    17.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Quick-cooking thin beef sausages ideal for sausage sizzles.",
    "Thinly cased beef sausages designed for fast, even cooking over charcoal or gas barbecue plates.",
    "Beef Sausage Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Sausage Packs"],
    "/images/bbq-thin-sausage-pack.webp",
    { primary_product_category: "Sausages" }
  ),
  createProduct(
    "PRD-BBQ-008",
    "Gourmet Sausage Pack",
    "bbq-grill",
    "Sausage Packs",
    "gourmet-sausage-pack",
    24.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Selection of artisan flavoured sausages for gourmet grilling.",
    "Hand-crafted gourmet sausages packed with distinct herb and spice profiles for an elevated barbecue experience.",
    "Gourmet Sausage Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Sausage Packs"],
    "/images/gourmet-sausage-pack.webp",
    { primary_product_category: "Sausages" }
  ),
  createProduct(
    "PRD-BBQ-009",
    "Mixed Sausage Pack",
    "bbq-grill",
    "Sausage Packs",
    "mixed-sausage-pack",
    20.99,
    "1kg",
    "1kg Pack",
    "per_pack",
    "Assorted beef, pork, and chicken sausages in one convenient pack.",
    "Enjoy variety on the grill with a combination of our most popular beef, pork, and chicken sausages.",
    "Mixed Sausage Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Sausage Packs"],
    "/images/mixed-sausage-pack.webp",
    { primary_product_category: "Sausages" }
  ),
  createProduct(
    "PRD-BBQ-010",
    "Breakfast Sausage Pack",
    "bbq-grill",
    "Sausage Packs",
    "breakfast-sausage-pack",
    9.20,
    "500g",
    "500g Pack",
    "per_pack",
    "Savory small-diameter sausages tailored for barbecue breakfasts.",
    "Delicate breakfast sausages made with mild spices, perfect alongside eggs and bacon on the flat top grill.",
    "Breakfast Sausage Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Sausage Packs"],
    "/images/breakfast-sausage-pack.webp",
    { primary_product_category: "Sausages" }
  ),

  // RIBS
  createProduct(
    "PRD-BBQ-011",
    "Beef Ribs for BBQ",
    "bbq-grill",
    "Ribs",
    "beef-ribs-for-bbq",
    20.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Meaty beef ribs cut for slow smoking or flame roasting.",
    "Substantial beef ribs with generous meat coverage, ideal for low-and-slow smoking or barbecue roasting.",
    "Beef Ribs",
    ["BBQ", "Smoke", "Slow Cook"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Ribs"],
    "/images/beef-ribs-for-bbq.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-012",
    "Beef Short Ribs for BBQ",
    "bbq-grill",
    "Ribs",
    "beef-short-ribs-for-bbq",
    20.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Thick-cut beef short ribs packed with rich intermuscular fat.",
    "Flavour-packed beef short ribs trimmed for low-and-slow barbecue smoking to achieve pull-apart tenderness.",
    "Beef Short Ribs",
    ["BBQ", "Smoke", "Slow Cook"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Ribs"],
    "/images/beef-short-ribs-for-bbq.webp",
    { primary_product_category: "Beef" }
  ),
   createProduct(
    "PRD-BBQ-014",
    "BBQ Pork Ribs",
    "bbq-grill",
    "Ribs",
    "bbq-pork-ribs",
    29.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Seasoned pork ribs prepared specifically for flame grilling.",
    "Tender pork ribs seasoned for direct barbecue cooking, yielding crispy edges and juicy meat.",
    "Marinated Pork Ribs",
    ["BBQ", "Grill", "Slow Cook"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Ribs", "Best Sellers"],
    "/images/bbq-pork-ribs.webp",
    { primary_product_category: "Pork" }
  ),
  createProduct(
    "PRD-BBQ-015",
    "Lamb Ribs for BBQ",
    "bbq-grill",
    "Ribs",
    "lamb-ribs-for-bbq",
    24.99,
    "1kg",
    "1kg Pack",
    "per_kg",
    "Succulent lamb ribs cut for high-heat or slow-roasted grilling.",
    "Flavorful lamb ribs with rich fat layers that render into crispy, savory perfection over open grill flames.",
    "Lamb Ribs",
    ["BBQ", "Grill", "Slow Cook"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Ribs"],
    "/images/lamb-ribs-for-bbq.webp",
    { primary_product_category: "Lamb" }
  ),

  // SKEWERS
  createProduct(
    "PRD-BBQ-016",
    "Marinated Chicken Skewers",
    "bbq-grill",
    "Skewers",
    "marinated-chicken-skewers",
    14.00,
    "4 skewers",
    "4 skewers",
    "per_pack",
    "Hand-threaded chicken skewers lightly marinated for grilling.",
    "Tender diced chicken threaded onto wooden skewers, pre-seasoned for rapid cooking on barbecue plates.",
    "Chicken Skewers",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers"],
    "/images/marinated-chicken-skewers.webp",
    { primary_product_category: "Chicken" }
  ),
  createProduct(
    "PRD-BBQ-017",
    "Chicken Breast Kebabs",
    "bbq-grill",
    "Skewers",
    "chicken-breast-kebabs",
    14.00,
    "4 skewers",
    "4 skewers",
    "per_pack",
    "Lean chicken breast cubes threaded into easy-to-cook kebabs.",
    "Trimmed lean chicken breast pieces on bamboo skewers, offering a quick-cooking protein choice for outdoor grilling.",
    "Chicken Kebabs",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers"],
    "/images/chicken-breast-kebabs.webp",
    { primary_product_category: "Chicken" }
  ),
  createProduct(
    "PRD-BBQ-018",
    "Beef Kebabs",
    "bbq-grill",
    "Skewers",
    "beef-kebabs",
    18.00,
    "4 skewers",
    "4 skewers",
    "per_pack",
    "Diced rump beef skewers prepared for fast barbecue searing.",
    "Juicy beef cubes threaded onto skewers, designed to sear quickly over hot barbecue coals or gas burners.",
    "Beef Kebabs",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers"],
    "/images/beef-kebabs.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-019",
    "Beef & Vegetable Kebabs",
    "bbq-grill",
    "Skewers",
    "beef-vegetable-kebabs",
    18.00,
    "4 skewers",
    "4 skewers",
    "per_pack",
    "Beef pieces paired with fresh garden vegetables on skewers.",
    "Tender beef cubes layered with crisp bell peppers and onions for colorful, balanced grill skewers.",
    "Beef Kebabs",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers"],
    "/images/beef-vegetable-kebabs.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-020",
    "Lamb Skewers",
    "bbq-grill",
    "Skewers",
    "lamb-skewers",
    15.99,
    "4 skewers",
    "4 skewers",
    "per_pack",
    "Diced lamb shoulder skewers cut for intense flame caramelisation.",
    "Diced lamb shoulder pieces with light seasoning on skewers, delivering traditional Mediterranean grill flavors.",
    "Lamb Skewers",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers"],
    "/images/lamb-skewers.webp",
    { primary_product_category: "Lamb" }
  ),
  createProduct(
    "PRD-BBQ-021",
    "Lamb Kofta Skewers",
    "bbq-grill",
    "Skewers",
    "lamb-kofta-skewers",
    12.00,
    "4 skewers",
    "4 skewers",
    "per_pack",
    "Spiced minced lamb moulded onto skewers for quick grilling.",
    "Seasoned ground lamb shaped around wooden skewers, crafted for rapid high-heat searing over hot coals.",
    "Lamb Kofta",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers"],
    "/images/lamb-kofta-skewers.webp",
    { primary_product_category: "Lamb" }
  ),
  createProduct(
    "PRD-BBQ-022",
    "Mixed BBQ Skewer Pack",
    "bbq-grill",
    "Skewers",
    "mixed-bbq-skewer-pack",
    50.00,
    "9 skewers",
    "9 skewers",
    "per_pack",
    "Variety pack containing beef, chicken, and lamb skewers.",
    "A crowd-pleasing selection of 9 skewers featuring beef, chicken, and lamb for diverse grill offerings.",
    "Mixed Meat Skewer Pack",
    ["BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Skewers", "Family Meals"],
    "/images/mixed-bbq-skewer-pack.webp",
    { primary_product_category: "Mixed Meat" }
  ),

  // BURGERS
  createProduct(
    "PRD-BBQ-023",
    "Beef Burger Patties",
    "bbq-grill",
    "Burgers",
    "beef-burger-patties",
    18.00,
    "10 patties",
    "10 patties",
    "per_pack",
    "Bulk pack of classic ground beef patties for family burger nights.",
    "Juicy 100% beef burger patties seasoned lightly for optimal searing on barbecue flat tops and grills.",
    "Beef Burger Patties",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Burgers", "Best Sellers"],
    "/images/beef-burger-patties.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-024",
    "Premium Beef Burger Patties",
    "bbq-grill",
    "Burgers",
    "premium-beef-burger-patties",
    15.00,
    "4 patties",
    "4 patties",
    "per_pack",
    "Thick gourmet beef patties coarsely ground for maximum steak-like texture.",
    "Thick-cut prime beef patties crafted to hold juices and deliver robust beef flavor on high-heat grills.",
    "Beef Burger Patties",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Burgers"],
    "/images/premium-beef-burger-patties.webp",
    { primary_product_category: "Beef" }
  ),
  createProduct(
    "PRD-BBQ-025",
    "Chicken Burger Patties",
    "bbq-grill",
    "Burgers",
    "chicken-burger-patties",
    14.99,
    "4 patties",
    "4 patties",
    "per_pack",
    "Lightly seasoned ground chicken patties for healthier burger options.",
    "Delicate chicken patties made with quality minced chicken breast and thigh meat, seasoned for clean grill flavor.",
    "Chicken Burger Patties",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Burgers"],
    "/images/chicken-burger-patties.webp",
    { primary_product_category: "Chicken" }
  ),
  createProduct(
    "PRD-BBQ-026",
    "Lamb Burger Patties",
    "bbq-grill",
    "Burgers",
    "lamb-burger-patties",
    15.99,
    "4 patties",
    "4 patties",
    "per_pack",
    "Savory ground lamb patties infused with herbs for Mediterranean-style burgers.",
    "Flavourful lamb patties seasoned with subtle herbs, perfect for pairing with tzatziki and fresh salad in burger buns.",
    "Lamb Burger Patties",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Burgers"],
    "/images/lamb-burger-patties.webp",
    { primary_product_category: "Lamb" }
  ),
  createProduct(
    "PRD-BBQ-027",
    "Beef & Chicken Burger Box",
    "bbq-grill",
    "Burgers",
    "beef-chicken-burger-box",
    50.00,
    "8 patties",
    "8 patties",
    "per_pack",
    "Combination box of prime beef patties and seasoned chicken patties.",
    "A convenient mixed box containing 4 beef burger patties and 4 chicken burger patties for family cookouts.",
    "Mixed Burger Pack",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled"],
    null,
    ["BBQ", "Burgers", "Family Meals"],
    "/images/beef-chicken-burger-box.webp",
    { primary_product_category: "Mixed Meat" }
  ),

  // 7. MEAT BOXES
  // FAMILY SUBCATEGORY
  createProduct(
    "PRD-BOX-001",
    "Family Meat Box",
    "meat-boxes",
    "Family",
    "family-meat-box",
    99.00,
    "5kg",
    "5kg Box",
    "fixed_box_price",
    "5kg household essential meat box with beef mince, chicken breasts, pork chops, sausages & drumsticks.",
    "Our Family Meat Box is packed with 5kg of everyday butcher staples for weeknight dinners and family meals. Contains 1kg Beef Mince, 1kg Chicken Breast Fillets, 1kg Pork Loin Chops, 1kg Beef Sausages, and 1kg Chicken Drumsticks. Delivered fresh chilled and vacuum sealed for ultimate convenience.",
    "Mixed Family Meat Box",
    ["BBQ", "Grill", "Pan-Fry", "Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Best Sellers", "Family Meals", "Budget Friendly"],
    "/images/family-meat-box.webp",
    {
      featured: true,
      badge: "Best Seller",
      approximate_total_weight: "5kg",
      box_contents: [
        { name: "Premium Beef Mince", quantity: "1kg", slug: "premium-beef-mince" },
        { name: "Chicken Breast Fillets", quantity: "1kg", slug: "chicken-breast-fillets" },
        { name: "Pork Loin Steaks", quantity: "1kg", slug: "pork-loin-steaks" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Chicken Drumsticks", quantity: "1kg", slug: "chicken-drumsticks" }
      ],
      included_product_references: ["premium-beef-mince", "chicken-breast-fillets", "pork-loin-steaks", "thick-beef-sausages", "chicken-drumsticks"]
    }
  ),
  createProduct(
    "PRD-BOX-002",
    "Weekly Family Meat Box",
    "meat-boxes",
    "Family",
    "weekly-family-meat-box",
    150.00,
    "7kg",
    "7kg Box",
    "fixed_box_price",
    "7kg variety meat box designed for a full week of family meals across beef, chicken, pork and lamb.",
    "Take the stress out of weekly meal planning with our 7kg Weekly Family Meat Box. Includes a balanced mix of 1kg Beef Mince, 1kg Chicken Breast Fillets, 1kg Chicken Thigh Fillets, 1kg Beef Sausages, 1kg Pork Loin Chops, 1kg Lamb Forequarter Chops, and 1kg Rump Steak.",
    "Mixed Family Meat Box",
    ["BBQ", "Grill", "Pan-Fry", "Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Family Meals"],
    "/images/weekly-family-meat-box.webp",
    {
      badge: "Weekly Value",
      approximate_total_weight: "7kg",
      box_contents: [
        { name: "Premium Beef Mince", quantity: "1kg", slug: "premium-beef-mince" },
        { name: "Chicken Breast Fillets", quantity: "1kg", slug: "chicken-breast-fillets" },
        { name: "Chicken Thigh Fillets", quantity: "1kg", slug: "chicken-thigh-fillets" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Pork Loin Steaks", quantity: "1kg", slug: "pork-loin-steaks" },
        { name: "Lamb Forequarter Chops", quantity: "1kg", slug: "lamb-forequarter-chops" },
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" }
      ],
      included_product_references: ["premium-beef-mince", "chicken-breast-fillets", "chicken-thigh-fillets", "thick-beef-sausages", "pork-loin-steaks", "lamb-forequarter-chops", "bbq-rump-steak-pack"]
    }
  ),
  createProduct(
    "PRD-BOX-003",
    "Large Family Meat Box",
    "meat-boxes",
    "Family",
    "large-family-meat-box",
    185.00,
    "10kg",
    "10kg Box",
    "fixed_box_price",
    "10kg bulk family meat box providing maximum variety and savings for larger households.",
    "A generous 10kg selection of fresh meats for busy families. Features 2kg Beef Mince, 2kg Chicken Breast Fillets, 1kg Chicken Drumsticks, 1kg Beef Sausages, 1kg Pork Loin Chops, 1kg Lamb Forequarter Chops, 1kg Rump Steak, and 1kg Diced Beef.",
    "Mixed Family Meat Box",
    ["BBQ", "Grill", "Pan-Fry", "Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Family Meals", "Budget Friendly"],
    "/images/large-family-meat-box.webp",
    {
      badge: "Bulk Saver",
      approximate_total_weight: "10kg",
      box_contents: [
        { name: "Premium Beef Mince", quantity: "2kg", slug: "premium-beef-mince" },
        { name: "Chicken Breast Fillets", quantity: "2kg", slug: "chicken-breast-fillets" },
        { name: "Chicken Drumsticks", quantity: "1kg", slug: "chicken-drumsticks" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Pork Loin Steaks", quantity: "1kg", slug: "pork-loin-steaks" },
        { name: "Lamb Forequarter Chops", quantity: "1kg", slug: "lamb-forequarter-chops" },
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" },
        { name: "Diced Beef", quantity: "1kg", slug: "diced-beef" }
      ],
      included_product_references: ["premium-beef-mince", "chicken-breast-fillets", "chicken-drumsticks", "thick-beef-sausages", "pork-loin-steaks", "lamb-forequarter-chops", "bbq-rump-steak-pack", "diced-beef"]
    }
  ),

  // VALUE SUBCATEGORY
  createProduct(
    "PRD-BOX-004",
    "Value Meat Box",
    "meat-boxes",
    "Value",
    "value-meat-box",
    85.00,
    "5kg",
    "5kg Box",
    "fixed_box_price",
    "Budget-friendly 5kg meat box loaded with versatile everyday staples for family cooking.",
    "Stretch your grocery budget with our 5kg Value Meat Box. Carefully selected cuts including 1kg Beef Mince, 1kg Beef Sausages, 1kg Chicken Drumsticks, 1kg Pork Loin Chops, and 1kg Diced Beef—ideal for slow cooking, roasting, and grilling.",
    "Value Meat Box",
    ["BBQ", "Pan-Fry", "Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Budget Friendly", "Family Meals"],
    "/images/value-meat-box.webp",
    {
      badge: "Great Value",
      approximate_total_weight: "5kg",
      box_contents: [
        { name: "Premium Beef Mince", quantity: "1kg", slug: "premium-beef-mince" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Chicken Drumsticks", quantity: "1kg", slug: "chicken-drumsticks" },
        { name: "Pork Loin Steaks", quantity: "1kg", slug: "pork-loin-steaks" },
        { name: "Diced Beef", quantity: "1kg", slug: "diced-beef" }
      ],
      included_product_references: ["premium-beef-mince", "thick-beef-sausages", "chicken-drumsticks", "pork-loin-steaks", "diced-beef"]
    }
  ),
  createProduct(
    "PRD-BOX-005",
    "Freezer Filler Meat Box",
    "meat-boxes",
    "Value",
    "freezer-filler-meat-box",
    185.00,
    "10kg",
    "10kg Box",
    "fixed_box_price",
    "10kg bulk freezer stocker pack vacuum-sealed for long shelf life and meal planning.",
    "Stock your home freezer with 10kg of high-demand butcher staples. Contains 2kg Beef Mince, 2kg Chicken Breast Fillets, 1kg Chicken Drumsticks, 1kg Beef Sausages, 1kg Pork Mince, 1kg Pork Loin Chops, 1kg Lamb Forequarter Chops, and 1kg Diced Beef.",
    "Bulk Meat Box",
    ["BBQ", "Grill", "Pan-Fry", "Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Budget Friendly", "Family Meals"],
    "/images/freezer-filler-meat-box.webp",
    {
      badge: "Freezer Pack",
      approximate_total_weight: "10kg",
      box_contents: [
        { name: "Premium Beef Mince", quantity: "2kg", slug: "premium-beef-mince" },
        { name: "Chicken Breast Fillets", quantity: "2kg", slug: "chicken-breast-fillets" },
        { name: "Chicken Drumsticks", quantity: "1kg", slug: "chicken-drumsticks" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Pork Mince", quantity: "1kg", slug: "pork-mince" },
        { name: "Pork Loin Steaks", quantity: "1kg", slug: "pork-loin-steaks" },
        { name: "Lamb Forequarter Chops", quantity: "1kg", slug: "lamb-forequarter-chops" },
        { name: "Diced Beef", quantity: "1kg", slug: "diced-beef" }
      ],
      included_product_references: ["premium-beef-mince", "chicken-breast-fillets", "chicken-drumsticks", "thick-beef-sausages", "pork-mince", "pork-loin-steaks", "lamb-forequarter-chops", "diced-beef"]
    }
  ),
  createProduct(
    "PRD-BOX-006",
    "Budget Meat Box",
    "meat-boxes",
    "Value",
    "budget-meat-box",
    115.00,
    "7kg",
    "7kg Box",
    "fixed_box_price",
    "7kg economical butcher box offering maximum value without sacrificing quality or freshness.",
    "Our 7kg Budget Meat Box delivers incredible value with 1kg Beef Mince, 1kg Chicken Drumsticks, 1kg Chicken Wings, 1kg Beef Sausages, 1kg Pork Loin Chops, 1kg Lamb Forequarter Chops, and 1kg Diced Beef.",
    "Value Meat Box",
    ["BBQ", "Pan-Fry", "Roast", "Slow Cook"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Budget Friendly"],
    "/images/budget-meat-box.webp",
    {
      badge: "Budget Choice",
      approximate_total_weight: "7kg",
      box_contents: [
        { name: "Premium Beef Mince", quantity: "1kg", slug: "premium-beef-mince" },
        { name: "Chicken Drumsticks", quantity: "1kg", slug: "chicken-drumsticks" },
        { name: "Chicken Wings", quantity: "1kg", slug: "chicken-wings" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Pork Loin Steaks", quantity: "1kg", slug: "pork-loin-steaks" },
        { name: "Lamb Forequarter Chops", quantity: "1kg", slug: "lamb-forequarter-chops" },
        { name: "Diced Beef", quantity: "1kg", slug: "diced-beef" }
      ],
      included_product_references: ["premium-beef-mince", "chicken-drumsticks", "chicken-wings", "thick-beef-sausages", "pork-loin-steaks", "lamb-forequarter-chops", "diced-beef"]
    }
  ),

  // BBQ SUBCATEGORY
  createProduct(
    "PRD-BOX-007",
    "BBQ Meat Box",
    "meat-boxes",
    "BBQ",
    "bbq-meat-box",
    85.00,
    "5kg",
    "5kg Box",
    "fixed_box_price",
    "5kg barbecue feast featuring rump steaks, sausages, burger patties, drumsticks and pork ribs.",
    "Fire up the grill with 5kg of barbecue favorites! Includes 1kg Rump Steak, 1kg Beef Sausages, 10 Beef Burger Patties, 1kg Chicken Drumsticks, and 1kg Pork Spare Ribs.",
    "BBQ Meat Box",
    ["BBQ", "Grill"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["BBQ"],
    "/images/bbq-meat-box.webp",
    {
      badge: "Grill Ready",
      approximate_total_weight: "5kg",
      box_contents: [
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Beef Burger Patties", quantity: "10 patties", slug: "beef-burger-patties" },
        { name: "Chicken Drumsticks", quantity: "1kg", slug: "chicken-drumsticks" },
        { name: "Pork Spare Ribs", quantity: "1kg", slug: "pork-spare-ribs" }
      ],
      included_product_references: ["bbq-rump-steak-pack", "thick-beef-sausages", "beef-burger-patties", "chicken-drumsticks", "pork-spare-ribs"]
    }
  ),
  createProduct(
    "PRD-BOX-008",
    "Family BBQ Meat Box",
    "meat-boxes",
    "BBQ",
    "family-bbq-meat-box",
    130.00,
    "7kg",
    "7kg Box",
    "fixed_box_price",
    "7kg family barbecue box with steaks, sausages, skewers, patties, ribs and lamb chops.",
    "Everything you need for a weekend family barbecue. Contains 1kg Rump Steak, 1kg Porterhouse Steak, 1kg Beef Sausages, 10 Beef Burger Patties, 4 Marinated Chicken Skewers, 1kg Pork Spare Ribs, and 1kg Lamb BBQ Chops.",
    "BBQ Meat Box",
    ["BBQ", "Grill"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["BBQ", "Family Meals"],
    "/images/family-bbq-meat-box.webp",
    {
      approximate_total_weight: "7kg",
      box_contents: [
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" },
        { name: "Porterhouse Steak", quantity: "1kg", slug: "bbq-porterhouse-steak-pack" },
        { name: "Beef Sausages", quantity: "1kg", slug: "thick-beef-sausages" },
        { name: "Beef Burger Patties", quantity: "10 patties", slug: "beef-burger-patties" },
        { name: "Marinated Chicken Skewers", quantity: "4 skewers", slug: "marinated-chicken-skewers" },
        { name: "Pork Spare Ribs", quantity: "1kg", slug: "pork-spare-ribs" },
        { name: "Lamb BBQ Chops", quantity: "1kg", slug: "lamb-bbq-chops" }
      ],
      included_product_references: ["bbq-rump-steak-pack", "bbq-porterhouse-steak-pack", "thick-beef-sausages", "beef-burger-patties", "marinated-chicken-skewers", "pork-spare-ribs", "lamb-bbq-chops"]
    }
  ),
  createProduct(
    "PRD-BOX-009",
    "Entertainer BBQ Meat Box",
    "meat-boxes",
    "BBQ",
    "entertainer-bbq-meat-box",
    210.00,
    "10kg",
    "10kg Box",
    "fixed_box_price",
    "10kg ultimate grilling box for outdoor parties, large barbecues and social gatherings.",
    "Host the ultimate barbecue with 10kg of prime grilling meats: 2kg Rump Steak, 1kg Porterhouse Steak, 2kg Beef Sausages, 10 Beef Burger Patties, 8 Chicken Skewers, 1kg Pork Spare Ribs, 1kg Lamb BBQ Chops, and 1kg Beef Ribs.",
    "BBQ Meat Box",
    ["BBQ", "Grill"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["BBQ", "Specials"],
    "/images/entertainer-bbq-meat-box.webp",
    {
      badge: "Ultimate BBQ",
      approximate_total_weight: "10kg",
      box_contents: [
        { name: "Rump Steak", quantity: "2kg", slug: "bbq-rump-steak-pack" },
        { name: "Porterhouse Steak", quantity: "1kg", slug: "bbq-porterhouse-steak-pack" },
        { name: "Beef Sausages", quantity: "2kg", slug: "thick-beef-sausages" },
        { name: "Beef Burger Patties", quantity: "10 patties", slug: "beef-burger-patties" },
        { name: "Chicken Skewers", quantity: "8 skewers", slug: "marinated-chicken-skewers" },
        { name: "Pork Spare Ribs", quantity: "1kg", slug: "pork-spare-ribs" },
        { name: "Lamb BBQ Chops", quantity: "1kg", slug: "lamb-bbq-chops" },
        { name: "Beef Ribs", quantity: "1kg", slug: "beef-ribs-for-bbq" }
      ],
      included_product_references: ["bbq-rump-steak-pack", "bbq-porterhouse-steak-pack", "thick-beef-sausages", "beef-burger-patties", "marinated-chicken-skewers", "pork-spare-ribs", "lamb-bbq-chops", "beef-ribs-for-bbq"]
    }
  ),

  // PREMIUM STEAK SUBCATEGORY
  createProduct(
    "PRD-BOX-010",
    "Steak Lover Meat Box",
    "meat-boxes",
    "Premium Steak",
    "steak-lover-meat-box",
    125.00,
    "3kg",
    "3kg Box",
    "fixed_box_price",
    "3kg selection of prime Australian steaks including scotch fillet, porterhouse, and rump.",
    "A dream collection for steak enthusiasts. Features 1kg Scotch Fillet Steak, 1kg Porterhouse Steak, and 1kg Rump Steak hand-cut by our master butchers.",
    "Premium Steak Box",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Premium", "Best Sellers"],
    "/images/steak-lover-meat-box.webp",
    {
      badge: "Steak Lover",
      approximate_total_weight: "3kg",
      box_contents: [
        { name: "Scotch Fillet Steak", quantity: "1kg", slug: "bbq-scotch-fillet-steak-pack" },
        { name: "Porterhouse Steak", quantity: "1kg", slug: "bbq-porterhouse-steak-pack" },
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" }
      ],
      included_product_references: ["bbq-scotch-fillet-steak-pack", "bbq-porterhouse-steak-pack", "bbq-rump-steak-pack"]
    }
  ),
  createProduct(
    "PRD-BOX-011",
    "Premium Steak Box",
    "meat-boxes",
    "Premium Steak",
    "premium-steak-box",
    175.00,
    "4kg",
    "4kg Box",
    "fixed_box_price",
    "4kg curated luxury steak selection featuring eye fillet, scotch fillet, porterhouse, and rump.",
    "Indulge in 4kg of prime beef steaks: 1kg Eye Fillet Steak, 1kg Scotch Fillet Steak, 1kg Porterhouse Steak, and 1kg Rump Steak.",
    "Premium Steak Box",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Premium"],
    "/images/premium-steak-box.webp",
    {
      badge: "Premium Choice",
      approximate_total_weight: "4kg",
      box_contents: [
        { name: "Eye Fillet Steak", quantity: "1kg", slug: "eye-fillet-steak" },
        { name: "Scotch Fillet Steak", quantity: "1kg", slug: "bbq-scotch-fillet-steak-pack" },
        { name: "Porterhouse Steak", quantity: "1kg", slug: "bbq-porterhouse-steak-pack" },
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" }
      ],
      included_product_references: ["eye-fillet-steak", "bbq-scotch-fillet-steak-pack", "bbq-porterhouse-steak-pack", "bbq-rump-steak-pack"]
    }
  ),
  createProduct(
    "PRD-BOX-012",
    "Ultimate Steak Box",
    "meat-boxes",
    "Premium Steak",
    "ultimate-steak-box",
    250.00,
    "5kg",
    "5kg Box",
    "fixed_box_price",
    "5kg master butcher steak box with scotch fillet, eye fillet, porterhouse, rump, and T-Bone.",
    "The definitive 5kg steak lover's collection containing 1kg Eye Fillet Steak, 1kg Scotch Fillet Steak, 1kg Porterhouse Steak, 1kg Rump Steak, and 1kg T-Bone Steak.",
    "Premium Steak Box",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Premium", "Specials"],
    "/images/ultimate-steak-box.webp",
    {
      featured: true,
      badge: "Ultimate Luxury",
      approximate_total_weight: "5kg",
      box_contents: [
        { name: "Eye Fillet Steak", quantity: "1kg", slug: "eye-fillet-steak" },
        { name: "Scotch Fillet Steak", quantity: "1kg", slug: "bbq-scotch-fillet-steak-pack" },
        { name: "Porterhouse Steak", quantity: "1kg", slug: "bbq-porterhouse-steak-pack" },
        { name: "Rump Steak", quantity: "1kg", slug: "bbq-rump-steak-pack" },
        { name: "Porterhouse Steak", quantity: "1kg", slug: "porterhouse-steak" }
      ],
      included_product_references: ["eye-fillet-steak", "bbq-scotch-fillet-steak-pack", "bbq-porterhouse-steak-pack", "bbq-rump-steak-pack", "porterhouse-steak"]
    }
  ),

  // LEAN / MEAL PREP SUBCATEGORY
  createProduct(
    "PRD-BOX-013",
    "Lean Protein Meat Box",
    "meat-boxes",
    "Lean / Meal Prep",
    "lean-protein-meat-box",
    110.00,
    "5kg",
    "5kg Box",
    "fixed_box_price",
    "5kg lean meat box packed with skinless chicken breast, lean beef mince, and chicken mince.",
    "Ideal for clean eating and weekly fitness prep. Includes 2kg Chicken Breast Fillets, 1kg Lean Beef Mince, 1kg Chicken Mince, and 1kg Diced Chicken Breast.",
    "Lean Protein Box",
    ["Grill", "Pan-Fry", "Roast", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Meal Prep"],
    "/images/lean-protein-meat-box.webp",
    {
      badge: "Lean & Healthy",
      approximate_total_weight: "5kg",
      box_contents: [
        { name: "Chicken Breast Fillets", quantity: "2kg", slug: "chicken-breast-fillets" },
        { name: "Lean Beef Mince", quantity: "1kg", slug: "lean-beef-mince" },
        { name: "Chicken Mince", quantity: "1kg", slug: "chicken-mince" },
        { name: "Diced Chicken Breast", quantity: "1kg", slug: "diced-chicken-breast" }
      ],
      included_product_references: ["chicken-breast-fillets", "lean-beef-mince", "chicken-mince", "diced-chicken-breast"]
    }
  ),
  createProduct(
    "PRD-BOX-014",
    "Meal Prep Meat Box",
    "meat-boxes",
    "Lean / Meal Prep",
    "meal-prep-meat-box",
    150.00,
    "7kg",
    "7kg Box",
    "fixed_box_price",
    "7kg meal prep box designed for batch cooking with chicken breast, lean beef, stir-fry strips, and diced lamb.",
    "Streamline your weekly batch cooking with 7kg of versatile lean proteins: 2kg Chicken Breast Fillets, 1kg Chicken Thigh Fillets, 1kg Lean Beef Mince, 1kg Chicken Mince, 1kg Diced Chicken Breast, 500g Beef Stir-Fry Strips, and 500g Diced Lamb.",
    "Meal Prep Meat Box",
    ["Grill", "Pan-Fry", "Roast", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Meal Prep"],
    "/images/meal-prep-meat-box.webp",
    {
      badge: "Batch Cooker",
      approximate_total_weight: "7kg",
      box_contents: [
        { name: "Chicken Breast Fillets", quantity: "2kg", slug: "chicken-breast-fillets" },
        { name: "Chicken Thigh Fillets", quantity: "1kg", slug: "chicken-thigh-fillets" },
        { name: "Lean Beef Mince", quantity: "1kg", slug: "lean-beef-mince" },
        { name: "Chicken Mince", quantity: "1kg", slug: "chicken-mince" },
        { name: "Diced Chicken Breast", quantity: "1kg", slug: "diced-chicken-breast" },
        { name: "Beef Stir-Fry Strips", quantity: "500g", slug: "beef-stir-fry-strips" },
        { name: "Diced Lamb", quantity: "500g", slug: "diced-lamb" }
      ],
      included_product_references: ["chicken-breast-fillets", "chicken-thigh-fillets", "lean-beef-mince", "chicken-mince", "diced-chicken-breast", "beef-stir-fry-strips", "diced-lamb"]
    }
  ),
  createProduct(
    "PRD-BOX-015",
    "Chicken Protein Box",
    "meat-boxes",
    "Lean / Meal Prep",
    "chicken-protein-box",
    90.00,
    "5kg",
    "5kg Box",
    "fixed_box_price",
    "5kg all-chicken prep box featuring breast fillets, thigh fillets, chicken mince, and diced breast.",
    "Focused 5kg chicken selection for high-protein meal preparation. Contains 2kg Chicken Breast Fillets, 1kg Chicken Thigh Fillets, 1kg Chicken Mince, and 1kg Diced Chicken Breast.",
    "Chicken Protein Box",
    ["Grill", "Pan-Fry", "Roast", "Stir-Fry"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Meal Prep"],
    "/images/chicken-protein-box.webp",
    {
      approximate_total_weight: "5kg",
      box_contents: [
        { name: "Chicken Breast Fillets", quantity: "2kg", slug: "chicken-breast-fillets" },
        { name: "Chicken Thigh Fillets", quantity: "1kg", slug: "chicken-thigh-fillets" },
        { name: "Chicken Mince", quantity: "1kg", slug: "chicken-mince" },
        { name: "Diced Chicken Breast", quantity: "1kg", slug: "diced-chicken-breast" }
      ],
      included_product_references: ["chicken-breast-fillets", "chicken-thigh-fillets", "chicken-mince", "diced-chicken-breast"]
    }
  ),

  // BUILD A BOX SUBCATEGORY
  createProduct(
    "PRD-BOX-016",
    "Build Your Own Meat Box",
    "meat-boxes",
    "Build a Box",
    "build-your-own-meat-box",
    199.00,
    "Custom (Min $199)",
    "Custom Box",
    "configurable_box_price",
    "Customise your own meat box with your favorite cuts across beef, chicken, lamb, pork, sausages & BBQ.",
    "Build a custom meat box tailored to your family's exact taste and cooking preferences. Select from our complete range of fresh Australian beef, chicken, lamb, pork, sausages, and BBQ items. Minimum order value of $199.00 applies.",
    "Custom Meat Box",
    ["Customer Selected"],
    ["Fresh Chilled", "Vacuum Sealed"],
    ["Australian"],
    ["Specials", "New Arrivals"],
    "/images/family-meat-box.webp",
    {
      featured: true,
      badge: "Custom Builder",
      approximate_total_weight: "Custom",
      min_order_value: 199.00,
      box_contents: [],
      included_product_references: []
    }
  ),

  // 8. READY TO COOK
  // SCHNITZELS
  createProduct(
    "PRD-RTC-001",
    "Chicken Schnitzel",
    "ready-to-cook",
    "Schnitzels",
    "rtc-chicken-schnitzel",
    26.00,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Hand-pounded chicken breast coated in golden herb breadcrumbs.",
    "Hand-cut Australian chicken breast coated in golden herb breadcrumbs. Pan fry in butter or bake for quick pub-style dinners at home.",
    "Schnitzel",
    ["Pan-Fry", "Air Fryer"],
    ["Fresh Chilled", "Crumbed", "Ready to Cook"],
    ["Australian"],
    ["Best Sellers", "Family Meals"],
    "/images/parmesan-herb-chicken-schnitzel.webp",
    {
      featured: true,
      badge: "Chef Prepared",
      ingredients: "Australian Chicken Breast Fillets (70%), Wheat Flour, Water, Breadcrumbs (Wheat Flour, Salt, Yeast, Natural Colours), Salt, Spices, Herb Mix (Parsley, Thyme), Vegetable Oil.",
      allergens: "Contains Wheat (Gluten). May contain traces of Milk, Egg, Soy, Sesame."
    }
  ),
  createProduct(
    "PRD-RTC-002",
    "Crumbed Beef Steak",
    "ready-to-cook",
    "Schnitzels",
    "crumbed-steak",
    28.00,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Tenderized Australian beef steak lightly crumbed in seasoned breadcrumbs.",
    "Tenderized beef cutlets coated in house seasoned breadcrumbs. Quick-fry for traditional Australian country beef schnitzels.",
    "Schnitzel",
    ["Pan-Fry", "Air Fryer"],
    ["Fresh Chilled", "Crumbed", "Ready to Cook"],
    ["Australian"],
    ["Family Meals"],
    "/images/crumbed-steak.webp",
    {
      ingredients: "Australian Beef Tenderized Steak (70%), Wheat Flour, Water, Seasoned Breadcrumbs (Wheat Flour, Salt, Yeast, Black Pepper, Garlic Powder, Onion Powder), Salt, Spices.",
      allergens: "Contains Wheat (Gluten). May contain traces of Milk, Egg, Soy."
    }
  ),
  createProduct(
    "PRD-RTC-007",
    "Crumbed Pork Loin Schnitzel",
    "ready-to-cook",
    "Schnitzels",
    "crumbed-pork-loin-schnitzel",
    27.00,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Lean Australian pork loin steaks coated in crisp golden breadcrumbs.",
    "Lean pork loin fillets lightly pounded and crumbed with savoury herbs. Pan fry or air-fry for a quick family weeknight meal.",
    "Schnitzel",
    ["Pan-Fry", "Air Fryer"],
    ["Fresh Chilled", "Crumbed", "Ready to Cook"],
    ["Australian"],
    ["Family Meals"],
    "/images/crumbed-pork-loin-schnitzel.webp",
    {
      ingredients: "Australian Pork Loin Fillet (70%), Wheat Flour, Water, Breadcrumbs (Wheat Flour, Salt, Yeast), Salt, Cracked Black Pepper, Sage.",
      allergens: "Contains Wheat (Gluten). May contain traces of Milk, Egg, Soy."
    }
  ),
  createProduct(
    "PRD-RTC-008",
    "Parmesan & Herb Crumbed Chicken Schnitzel",
    "ready-to-cook",
    "Schnitzels",
    "parmesan-herb-chicken-schnitzel",
    28.50,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Chicken breast fillets coated in aged parmesan cheese and Italian herb breadcrumb crust.",
    "Premium chicken breast cutlets crusted with freshly grated aged parmesan and fragrant Italian herbs. Cooks to a crispy, savoury golden crust.",
    "Schnitzel",
    ["Pan-Fry", "Air Fryer", "Roast"],
    ["Fresh Chilled", "Crumbed", "Ready to Cook"],
    ["Australian"],
    ["Best Sellers", "Family Meals"],
    "/images/parmesan-herb-chicken-schnitzel.webp",
    {
      badge: "Gourmet Crumb",
      ingredients: "Australian Chicken Breast Fillets (68%), Wheat Flour, Parmesan Cheese (Milk, Salt, Cultures, Enzyme) (5%), Breadcrumbs (Wheat Flour, Salt, Yeast), Rosemary, Oregano, Garlic Powder.",
      allergens: "Contains Wheat (Gluten), Milk. May contain traces of Egg, Soy."
    }
  ),
  createProduct(
    "PRD-RTC-009",
    "Gluten-Free Chicken Schnitzel",
    "ready-to-cook",
    "Schnitzels",
    "gluten-free-chicken-schnitzel",
    29.00,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Tender chicken breast coated in a certified gluten-free crispy rice & maize crumb.",
    "Prepared in a clean environment using 100% gluten-free crumb ingredients. Delivers pub-style crispy texture without any gluten.",
    "Schnitzel",
    ["Pan-Fry", "Air Fryer"],
    ["Fresh Chilled", "Crumbed", "Ready to Cook"],
    ["Australian"],
    ["Family Meals"],
    "/images/gluten-free-chicken-schnitzel.webp",
    {
      badge: "Gluten-Free",
      ingredients: "Australian Chicken Breast Fillets (72%), Rice Flour, Maize Flour, Tapioca Starch, Water, Gluten-Free Breadcrumbs (Rice Flour, Maize Starch, Salt, Dextrose), Salt, Parsley, Spices.",
      allergens: "Gluten-Free. May contain traces of Soy, Sesame."
    }
  ),

  // MARINATED CUTS
  createProduct(
    "PRD-RTC-003",
    "Honey Soy Chicken Thigh Fillets",
    "ready-to-cook",
    "Marinated Cuts",
    "marinated-chicken",
    25.00,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Chicken thighs tossed in sweet Australian honey, soy sauce, and garlic marinade.",
    "Juicy skinless chicken thigh fillets steeped in sweet sticky honey soy glaze. Perfect for quick stir-frying, traybake roasting or grilling.",
    "Fillet",
    ["Pan-Fry", "Roast", "Stir-Fry", "BBQ"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["Family Meals", "Meal Prep"],
    "/images/marinated-chicken.webp",
    {
      ingredients: "Australian Chicken Thigh Fillets (85%), Honey Soy Sauce (Water, Sugar, Soy Sauce [Soybeans, Wheat, Salt], Honey (5%), Garlic, Ginger, Thickener [1422], Sesame Oil, Natural Colour).",
      allergens: "Contains Soy, Wheat (Gluten), Sesame."
    }
  ),
  createProduct(
    "PRD-RTC-010",
    "Garlic & Herb Lamb Rump Cutlets",
    "ready-to-cook",
    "Marinated Cuts",
    "garlic-herb-lamb-rump-cutlets",
    36.00,
    "800g",
    "1 x 800g Pack",
    "per_pack",
    "Tender lamb rump cutlets marinated with roasted garlic, rosemary and thyme.",
    "Tender Australian lamb rump cutlets steeped in cold-pressed canola oil, crushed garlic, and garden herbs. Sear on the pan or BBQ in under 8 minutes.",
    "Chops / Cutlets",
    ["Pan-Fry", "BBQ", "Grill"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["Premium", "BBQ"],
    "/images/garlic-herb-lamb-rump-cutlets.webp",
    {
      badge: "Premium Cut",
      ingredients: "Australian Lamb Rump Cutlets (88%), Marinade (Canola Oil, Dehydrated Garlic (3%), Parsley, Rosemary, Salt, Black Pepper, Natural Flavours).",
      allergens: "Gluten-Free. May contain traces of Soy, Sesame."
    }
  ),
  createProduct(
    "PRD-RTC-011",
    "Smoky BBQ Pork Spare Ribs",
    "ready-to-cook",
    "Marinated Cuts",
    "smoky-bbq-pork-spare-ribs",
    29.50,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Meaty pork spare ribs smothered in hickory smoky BBQ glaze.",
    "Tender pork spare ribs marinated in rich brown sugar and hickory smoke glaze. Slow roast in the oven or glaze over hot barbecue charcoal.",
    "Ribs",
    ["BBQ", "Roast", "Grill"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Family Meals"],
    "/images/smoky-bbq-pork-spare-ribs.webp",
    {
      ingredients: "Australian Pork Spare Ribs (82%), Smoky BBQ Glaze (Tomato Paste, Brown Sugar, Vinegar, Water, Molasses, Hickory Smoke Flavour, Spices, Salt, Mustard Flour, Garlic).",
      allergens: "Contains Mustard. May contain traces of Soy, Gluten, Sesame."
    }
  ),
  createProduct(
    "PRD-RTC-012",
    "Portuguese Chilli & Lime Chicken Drumsticks",
    "ready-to-cook",
    "Marinated Cuts",
    "portuguese-chilli-lime-chicken-drumsticks",
    18.50,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Plump chicken drumsticks coated in zesty lime, sweet paprika and chili marinade.",
    "Juicy bone-in chicken drumsticks marinated in Peri Peri style spices, lime zest, and sweet paprika. Oven bake for golden crispy skin.",
    "Bone-In",
    ["Roast", "BBQ", "Air Fryer"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["Budget Friendly", "BBQ"],
    "/images/portuguese-chilli-lime-chicken-drumsticks.webp",
    {
      ingredients: "Australian Chicken Drumsticks (88%), Portuguese Marinade (Canola Oil, Paprika, Lime Juice Concentrate (2%), Chili Powder, Garlic, Oregano, Salt, Sugar).",
      allergens: "Gluten-Free. May contain traces of Soy, Sesame, Milk."
    }
  ),
  createProduct(
    "PRD-RTC-013",
    "Mediterranean Lemon Herb Lamb Chops",
    "ready-to-cook",
    "Marinated Cuts",
    "mediterranean-lemon-herb-lamb-chops",
    32.00,
    "1kg",
    "1 x 1kg Pack",
    "per_kg",
    "Lamb loin chops infused with Greek extra virgin olive oil, lemon juice, and oregano.",
    "Succulent Australian lamb loin chops marinated with zesty lemon, crushed garlic, and Greek oregano. Ideal for rapid grilling over hot embers.",
    "Chops / Cutlets",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Family Meals"],
    "/images/mediterranean-lemon-herb-lamb-chops.webp",
    {
      ingredients: "Australian Lamb Loin Chops (88%), Lemon Herb Marinade (Olive Oil, Concentrated Lemon Juice (3%), Garlic, Oregano, Thyme, Black Pepper, Salt).",
      allergens: "Gluten-Free. May contain traces of Soy, Sesame."
    }
  ),

  // KEBABS
  createProduct(
    "PRD-RTC-004",
    "BBQ Beef Kebabs",
    "ready-to-cook",
    "Kebabs",
    "bbq-beef-kebabs",
    27.00,
    "800g",
    "8 Kebabs",
    "per_pack",
    "Diced rump beef skewers with fresh capsicum and red onion in garlic BBQ marinade.",
    "Hand-threaded skewers combining tender diced beef rump, sweet red capsicum, and crisp red onion. Pre-marinated for rapid grilling.",
    "Skewer",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Family Meals"],
    "/images/beef-kebabs.webp",
    {
      ingredients: "Australian Diced Beef (75%), Fresh Red Capsicum, Fresh Red Onion, BBQ Marinade (Water, Sugar, Tomato Paste, Vinegar, Molasses, Spices, Salt, Garlic).",
      allergens: "Gluten-Free. May contain traces of Soy, Mustard."
    }
  ),
  createProduct(
    "PRD-RTC-014",
    "Honey Soy Chicken Kebabs",
    "ready-to-cook",
    "Kebabs",
    "honey-soy-chicken-kebabs",
    24.00,
    "800g",
    "8 Kebabs",
    "per_pack",
    "Chicken thigh skewers threaded with green capsicum in sweet honey soy glaze.",
    "Juicy chicken thigh pieces and crunchy bell peppers on wooden skewers. Kids love the sweet glaze and tender chicken.",
    "Skewer",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Family Meals"],
    "/images/honey-soy-chicken-kebabs.webp",
    {
      ingredients: "Australian Diced Chicken Thigh (75%), Fresh Green Capsicum, Fresh Onion, Honey Soy Marinade (Water, Soy Sauce [Soybeans, Wheat], Honey, Garlic, Ginger, Sesame Oil).",
      allergens: "Contains Soy, Wheat (Gluten), Sesame."
    }
  ),
  createProduct(
    "PRD-RTC-015",
    "Garlic & Rosemary Lamb Kebabs",
    "ready-to-cook",
    "Kebabs",
    "garlic-rosemary-lamb-kebabs",
    29.50,
    "800g",
    "8 Kebabs",
    "per_pack",
    "Tender diced lamb shoulder skewers marinated with crushed garlic and fresh rosemary.",
    "Succulent diced lamb shoulder, red capsicum, and onion on wooden skewers. Marinated in cold-pressed canola oil, rosemary, and sea salt.",
    "Skewer",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Premium"],
    "/images/garlic-rosemary-lamb-kebabs.webp",
    {
      ingredients: "Australian Diced Lamb Shoulder (75%), Fresh Red Capsicum, Onion, Marinade (Canola Oil, Garlic, Rosemary, Pepper, Sea Salt).",
      allergens: "Gluten-Free. May contain traces of Soy, Sesame."
    }
  ),
  createProduct(
    "PRD-RTC-016",
    "Greek Style Lemon Oregano Chicken Kebabs",
    "ready-to-cook",
    "Kebabs",
    "greek-lemon-oregano-chicken-kebabs",
    24.50,
    "800g",
    "8 Kebabs",
    "per_pack",
    "Chicken breast skewers with zucchini and red onion in zesty Mediterranean marinade.",
    "Lean diced chicken breast interspersed with sliced fresh zucchini and red onion. Marinated with lemon juice, garlic, and wild Greek oregano.",
    "Skewer",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Meal Prep"],
    "/images/greek-lemon-oregano-chicken-kebabs.webp",
    {
      ingredients: "Australian Diced Chicken Breast (75%), Fresh Red Onion, Zucchini, Marinade (Olive Oil, Lemon Juice, Garlic, Greek Oregano, Sea Salt, Black Pepper).",
      allergens: "Gluten-Free. May contain traces of Soy."
    }
  ),
  createProduct(
    "PRD-RTC-017",
    "Spicy Peri Peri Chicken Kebabs",
    "ready-to-cook",
    "Kebabs",
    "spicy-peri-peri-chicken-kebabs",
    24.50,
    "800g",
    "8 Kebabs",
    "per_pack",
    "Chicken thigh skewers threaded with red capsicum in spicy Peri Peri chili marinade.",
    "For heat lovers! Chicken thigh cutlets marinated in fiery chili, paprika, lemon, and garlic marinade on bamboo skewers.",
    "Skewer",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Fresh Chilled", "Marinated", "Ready to Cook"],
    ["Australian"],
    ["BBQ"],
    "/images/spicy-peri-peri-chicken-kebabs.webp",
    {
      badge: "Spicy",
      ingredients: "Australian Diced Chicken Thigh (75%), Fresh Red Capsicum, Onion, Peri Peri Marinade (Water, Red Chili, Garlic, Lemon Juice, Paprika, Vinegar, Salt, Spices).",
      allergens: "Gluten-Free. May contain traces of Soy, Mustard."
    }
  ),

  // BURGER PATTIES
  createProduct(
    "PRD-RTC-005",
    "Classic Beef Burger Patties",
    "ready-to-cook",
    "Burger Patties",
    "rtc-burger-patties",
    24.00,
    "1.08kg",
    "6 x 180g Patties",
    "per_pack",
    "Thick Aussie beef patties crafted from brisket and chuck for juicy burgers.",
    "Thick 180g butcher-style patties minced from grass-fed beef brisket and chuck. Seasoned lightly for natural meaty flavour.",
    "Burger",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled", "Ready to Cook"],
    ["Australian"],
    ["Best Sellers", "BBQ"],
    "/images/rtc-burger-patties.webp",
    {
      featured: true,
      badge: "Quick Dinner",
      ingredients: "Australian Beef (92%), Seasoning (Rice Flour, Salt, Onion Powder, Black Pepper, Garlic Powder, Natural Preservative [223 - Sulphites]).",
      allergens: "Contains Sulphites. Gluten-Free."
    }
  ),
  createProduct(
    "PRD-RTC-018",
    "Gourmet Wagyu Beef Patties",
    "ready-to-cook",
    "Burger Patties",
    "gourmet-wagyu-beef-patties",
    32.00,
    "1.08kg",
    "6 x 180g Patties",
    "per_pack",
    "Mouth-watering Wagyu beef patties with rich marbling for ultimate juiciness.",
    "Hand-pressed patties ground from Australian Wagyu beef trim. Delivers buttery texture and intense beef flavour when seared hot on the plate.",
    "Burger",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled", "Ready to Cook"],
    ["Australian"],
    ["Premium", "BBQ"],
    "/images/gourmet-wagyu-beef-patties.webp",
    {
      badge: "Wagyu",
      ingredients: "Australian Wagyu Beef (95%), Sea Salt, Cracked Black Pepper, Garlic Powder, Natural Rosemary Extract.",
      allergens: "Preservative-Free & Gluten-Free."
    }
  ),
  createProduct(
    "PRD-RTC-019",
    "Herb & Garlic Lamb Patties",
    "ready-to-cook",
    "Burger Patties",
    "herb-garlic-lamb-patties",
    28.00,
    "1.08kg",
    "6 x 180g Patties",
    "per_pack",
    "Aussie lamb patties seasoned with crushed garlic, garden rosemary, and mint.",
    "Savory 180g lamb patties blended with fresh herbs and garlic. Outstanding served on warm flatbreads with tzatziki sauce.",
    "Burger",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled", "Ready to Cook"],
    ["Australian"],
    ["BBQ", "Family Meals"],
    "/images/herb-garlic-lamb-patties.webp",
    {
      ingredients: "Australian Lamb (90%), Rice Flour, Garlic (2%), Rosemary, Mint, Salt, Black Pepper, Onion Powder, Natural Preservative [223 - Sulphites].",
      allergens: "Contains Sulphites. Gluten-Free."
    }
  ),
  createProduct(
    "PRD-RTC-020",
    "Chicken & Chive Burger Patties",
    "ready-to-cook",
    "Burger Patties",
    "chicken-chive-burger-patties",
    25.00,
    "1.08kg",
    "6 x 180g Patties",
    "per_pack",
    "Lean chicken mince patties blended with fresh chopped chives and white pepper.",
    "Juicy chicken burger patties crafted from lean chicken breast and thigh meat, seasoned with onion, garlic and fresh chives.",
    "Burger",
    ["Pan-Fry", "BBQ", "Air Fryer"],
    ["Fresh Chilled", "Ready to Cook"],
    ["Australian"],
    ["Meal Prep", "Family Meals"],
    "/images/chicken-chive-burger-patties.webp",
    {
      ingredients: "Australian Chicken (90%), Fresh Chives (3%), Rice Flour, Salt, White Pepper, Onion Powder, Garlic Powder.",
      allergens: "Gluten-Free. May contain traces of Soy."
    }
  ),
  createProduct(
    "PRD-RTC-021",
    "Pork & Apple Burger Patties",
    "ready-to-cook",
    "Burger Patties",
    "pork-apple-burger-patties",
    25.50,
    "1.08kg",
    "6 x 180g Patties",
    "per_pack",
    "Savoury Australian pork patties sweetened with real dried apple pieces and sage.",
    "Classic combination of juicy pork mince, sweet dried apple cubes, sage, and sea salt. A sweet and savoury twist on weeknight burgers.",
    "Burger",
    ["Pan-Fry", "BBQ"],
    ["Fresh Chilled", "Ready to Cook"],
    ["Australian"],
    ["Family Meals"],
    "/images/pork-apple-burger-patties.webp",
    {
      ingredients: "Australian Pork (88%), Dried Apple Pieces (5%), Rice Flour, Sage, Salt, Black Pepper, Onion Powder.",
      allergens: "Gluten-Free. May contain traces of Soy."
    }
  ),

  // STIR-FRY
   // 9. DELI & CURED
   // 10. SPECIALTY MEAT
  createProduct(
    "PRD-SPEC-001",
    "Veal Schnitzel",
    "specialty-meat",
    "Veal",
    "veal-schnitzel",
    13.05,
    "450g",
    "Approximately 450g",
    "per_pack",
    "Delicate veal schnitzels for pan-frying, air-frying, or oven baking.",
    "Tender veal schnitzels prepared for quick weeknight cooking. Pan-fry in butter or air-fry for crispy veal schnitzels.",
    "Veal Schnitzel",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Frozen"],
    null,
    ["Specialty Meat > Veal", "Frozen Meat", "Ready to Cook"],
    "/images/veal-schnitzel.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-002",
    "Crumbed Veal Schnitzel",
    "specialty-meat",
    "Veal",
    "crumbed-veal-schnitzel",
    5.00,
    "1 schnitzel",
    "1 schnitzel",
    "per_item",
    "Single crumbed veal schnitzel ready to cook.",
    "Crumbed veal schnitzel prepared for quick cooking in the pan, air fryer, or oven.",
    "Crumbed Veal Schnitzel",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Frozen", "Crumbed"],
    null,
    ["Specialty Meat > Veal", "Frozen Meat", "Ready to Cook"],
    "/images/crumbed-veal-schnitzel.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-003",
    "Veal Cutlets",
    "specialty-meat",
    "Veal",
    "veal-cutlets",
    22.99,
    "500g",
    "500g",
    "per_pack",
    "Bone-in tender veal cutlets for pan-searing or grilling.",
    "Tender bone-in veal cutlets perfect for pan-searing with sage butter, grilling, or cooking on the barbecue.",
    "Veal Cutlet",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Frozen"],
    null,
    ["Specialty Meat > Veal", "Frozen Meat", "Gourmet Cooking", "BBQ"],
    "/images/veal-cutlets.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-004",
    "Veal Osso Buco",
    "specialty-meat",
    "Veal",
    "veal-osso-buco",
    30.00,
    "1kg",
    "1kg",
    "per_kg",
    "Cross-cut bone-in veal shin for classic slow-cooked Osso Buco.",
    "Cross-cut veal shin with marrow bone attached. Braise slowly with tomatoes, white wine, herbs, and gremolata.",
    "Veal Osso Buco",
    ["Slow Cook", "Braise"],
    ["Frozen"],
    null,
    ["Specialty Meat > Veal", "Frozen Meat", "Slow Cooking"],
    "/images/veal-osso-buco.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-005",
    "Veal Mince",
    "specialty-meat",
    "Veal",
    "veal-mince",
    14.99,
    "500g",
    "500g",
    "per_pack",
    "Finely ground lean veal mince for meatballs, pasta, and burgers.",
    "Mild finely ground veal mince ideal for delicate meatballs, bolognese, terrines, and burgers.",
    "Veal Mince",
    ["Pan-Fry", "BBQ", "Pasta Sauce"],
    ["Frozen"],
    null,
    ["Specialty Meat > Veal", "Frozen Meat", "Family Meals"],
    "/images/veal-mince.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-006",
    "Veal Diced",
    "specialty-meat",
    "Veal",
    "veal-diced",
    16.99,
    "500g",
    "500g",
    "per_pack",
    "Diced tender veal pieces for stews, braises, and mild curries.",
    "Trimmed diced veal pieces prepared for slow stews, goulash, and curries.",
    "Diced Veal",
    ["Slow Cook", "Braise", "Curry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Veal", "Frozen Meat", "Slow Cooking"],
    "/images/veal-diced.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-007",
    "Goat Shoulder",
    "specialty-meat",
    "Goat",
    "goat-shoulder",
    29.99,
    "1kg",
    "1kg",
    "per_kg",
    "Bone-in goat shoulder for slow roasting and traditional curries.",
    "Bone-in goat shoulder cut suited for slow braising, roasting, and spiced curries until tender.",
    "Goat Shoulder",
    ["Slow Cook", "Roast", "Curry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Goat", "Frozen Meat", "Slow Cooking"],
    "/images/goat-shoulder.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-008",
    "Goat Leg",
    "specialty-meat",
    "Goat",
    "goat-leg",
    37.00,
    "1kg",
    "1kg",
    "per_kg",
    "Whole bone-in goat leg for slow roasting and family feasts.",
    "Bone-in goat leg prepared for slow roasting with garlic, rosemary, and spices.",
    "Goat Leg",
    ["Roast", "Slow Cook"],
    ["Frozen"],
    null,
    ["Specialty Meat > Goat", "Frozen Meat", "Slow Cooking"],
    "/images/goat-leg.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-009",
    "Goat Curry Pieces",
    "specialty-meat",
    "Goat",
    "goat-curry-pieces",
    24.99,
    "1kg",
    "1kg",
    "per_kg",
    "Bone-in diced goat pieces ideal for slow-cooked curries.",
    "Bone-in goat meat cut into curry-sized pieces. Essential for Caribbean, Indian, and Mediterranean goat curries.",
    "Goat Curry Pieces",
    ["Slow Cook", "Curry", "Braise"],
    ["Frozen"],
    null,
    ["Specialty Meat > Goat", "Frozen Meat", "Slow Cooking"],
    "/images/goat-curry-pieces.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-010",
    "Diced Goat Meat",
    "specialty-meat",
    "Goat",
    "diced-goat-meat",
    40.00,
    "1kg",
    "1kg",
    "per_kg",
    "Boneless diced goat meat for curries and braises.",
    "Trimmed boneless diced goat meat prepared for slow-cooked curries, tagines, and braises.",
    "Diced Goat",
    ["Slow Cook", "Curry", "Braise"],
    ["Frozen"],
    null,
    ["Specialty Meat > Goat", "Frozen Meat", "Slow Cooking"],
    "/images/diced-goat-meat.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-011",
    "Goat Loin Chops",
    "specialty-meat",
    "Goat",
    "goat-loin-chops",
    22.50,
    "500g",
    "500g",
    "per_pack",
    "Tender goat loin chops for grilling and barbecue cooking.",
    "Goat loin chops cut for quick pan-frying, grilling, or BBQ cooking with herbs and lemon.",
    "Goat Chops",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Goat", "Frozen Meat", "BBQ"],
    "/images/goat-loin-chops.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-012",
    "Goat Rack",
    "specialty-meat",
    "Goat",
    "goat-rack",
    28.00,
    "500g",
    "500g",
    "per_pack",
    "Bone-in goat rack for roasting or grilling.",
    "French-trimmed bone-in goat rack suitable for oven roasting or barbecue grilling.",
    "Goat Rack",
    ["Roast", "Grill", "BBQ"],
    ["Frozen"],
    null,
    ["Specialty Meat > Goat", "Frozen Meat", "Gourmet Cooking", "BBQ"],
    "/images/goat-rack.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-013",
    "Kangaroo Fillets",
    "specialty-meat",
    "Kangaroo",
    "kangaroo-fillets",
    15.99,
    "400g",
    "400g",
    "per_pack",
    "Kangaroo loin fillets for pan-frying, grilling, and BBQ cooking.",
    "Kangaroo loin fillets prepared for quick pan-searing or grilling to medium-rare.",
    "Kangaroo Fillet",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Frozen"],
    null,
    ["Specialty Meat > Kangaroo", "Frozen Meat", "BBQ", "Game Meat"],
    "/images/kangaroo-fillets.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-014",
    "Kangaroo Steaks",
    "specialty-meat",
    "Kangaroo",
    "kangaroo-steaks",
    18.99,
    "500g",
    "500g",
    "per_pack",
    "Portioned kangaroo steaks for high-heat grilling.",
    "Portioned kangaroo steaks best cooked fast on hot skillet or barbecue to medium rare.",
    "Kangaroo Steak",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Frozen"],
    null,
    ["Specialty Meat > Kangaroo", "Frozen Meat", "BBQ", "Game Meat"],
    "/images/kangaroo-steaks.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-015",
    "Kangaroo Mince",
    "specialty-meat",
    "Kangaroo",
    "kangaroo-mince",
    10.99,
    "1kg",
    "1kg",
    "per_pack",
    "Ground kangaroo mince for burgers, pasta, and stir-fries.",
    "Finely ground kangaroo mince suitable for healthy burgers, bolognese, meatballs, and stir-fries.",
    "Kangaroo Mince",
    ["Pan-Fry", "BBQ", "Pasta Sauce"],
    ["Frozen"],
    null,
    ["Specialty Meat > Kangaroo", "Frozen Meat", "Game Meat"],
    "/images/kangaroo-mince.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-016",
    "Kangaroo Sausages",
    "specialty-meat",
    "Kangaroo",
    "kangaroo-sausages",
    12.99,
    "500g",
    "500g",
    "per_pack",
    "Seasoned kangaroo sausages for barbecue and pan cooking.",
    "Seasoned kangaroo meat sausages crafted for barbecue grilling and frying.",
    "Kangaroo Sausage",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Kangaroo", "Frozen Meat", "BBQ", "Game Meat"],
    "/images/kangaroo-sausages.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-017",
    "Kangaroo Stir-Fry Strips",
    "specialty-meat",
    "Kangaroo",
    "kangaroo-stir-fry-strips",
    17.99,
    "500g",
    "500g",
    "per_pack",
    "Thinly sliced kangaroo strips for quick stir-fry meals.",
    "Pre-sliced kangaroo strips prepared for high-heat wok stir-frying with vegetables and sauce.",
    "Kangaroo Strips",
    ["Stir-Fry", "Pan-Fry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Kangaroo", "Frozen Meat", "Game Meat"],
    "/images/kangaroo-stir-fry-strips.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-018",
    "Venison Backstrap",
    "specialty-meat",
    "Game",
    "venison-backstrap",
    31.00,
    "500g",
    "500g",
    "per_pack",
    "Tender venison backstrap loin for pan-searing or roasting.",
    "Prime venison backstrap loin prepared for pan-searing or quick roasting to medium-rare.",
    "Venison Backstrap",
    ["Pan-Fry", "Grill", "Roast"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat", "Gourmet Cooking"],
    "/images/venison-backstrap.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-019",
    "Venison Mince",
    "specialty-meat",
    "Game",
    "venison-mince",
    26.00,
    "1kg",
    "1kg",
    "per_kg",
    "Ground venison mince for burgers, pies, and ragu.",
    "Finely ground venison mince suited for game burgers, savory cottage pies, and pasta ragu.",
    "Venison Mince",
    ["Pan-Fry", "BBQ", "Pasta Sauce"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat"],
    "/images/venison-mince.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-020",
    "Venison Osso Buco",
    "specialty-meat",
    "Game",
    "venison-osso-buco",
    26.00,
    "1kg",
    "1kg",
    "per_kg",
    "Cross-cut venison shank pieces for rich slow braises.",
    "Bone-in cross-cut venison shank slices prepared for slow cooking in red wine and herb broths.",
    "Venison Osso Buco",
    ["Slow Cook", "Braise"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Slow Cooking", "Game Meat"],
    "/images/venison-osso-buco.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-021",
    "Venison Shanks",
    "specialty-meat",
    "Game",
    "venison-shanks",
    26.00,
    "1kg",
    "1kg",
    "per_kg",
    "Whole venison shanks for slow-cooked winter meals.",
    "Whole bone-in venison shanks ready for braising slowly until the meat falls off the bone.",
    "Venison Shanks",
    ["Slow Cook", "Braise"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Slow Cooking", "Game Meat"],
    "/images/venison-shanks.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-022",
    "Wild Boar Fillet",
    "specialty-meat",
    "Game",
    "wild-boar-fillet",
    32.99,
    "500g",
    "500g",
    "per_pack",
    "Tender wild boar tenderloin fillet for roasting or grilling.",
    "Wild boar tenderloin fillet prepared for quick roasting, pan-searing, or grilling.",
    "Wild Boar Fillet",
    ["Roast", "Grill", "Pan-Fry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat", "Gourmet Cooking"],
    "/images/wild-boar-fillet.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-023",
    "Game Meat Selection Box",
    "specialty-meat",
    "Game",
    "game-meat-selection-box",
    105.00,
    "3kg",
    "Approximately 3kg",
    "fixed_box_price",
    "Curated box containing kangaroo fillets, kangaroo mince, venison mince, venison backstrap, and goat curry pieces.",
    "Curated game meat selection box. Contains approximately 3kg of specialty meat cuts including Kangaroo Fillets (400g), Kangaroo Mince (1kg), Venison Mince (500g), Venison Backstrap (500g), and Goat Curry Pieces (600g).",
    "Mixed Game Meat Box",
    ["Pan-Fry", "Grill", "Roast", "Slow Cook"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Meat Boxes", "Game Meat"],
    "/images/game-meat-selection-box.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "To be confirmed",
      supplier: "To be confirmed",
      ingredients: "To be confirmed",
      allergens: "To be confirmed",
      quality_claims: "None supplied",
      use_by_date: "To be confirmed",
      approximate_total_weight: "Approximately 3kg",
      box_contents: [
        { name: "Kangaroo Fillets", quantity: "400g", slug: "kangaroo-fillets" },
        { name: "Kangaroo Mince", quantity: "1kg", slug: "kangaroo-mince" },
        { name: "Venison Mince", quantity: "500g", slug: "venison-mince" },
        { name: "Venison Backstrap", quantity: "500g", slug: "venison-backstrap" },
        { name: "Goat Curry Pieces", quantity: "600g", slug: "goat-curry-pieces" }
      ]
    }
  ),

  // SPECIALTY MEAT — RABBIT
  createProduct(
    "PRD-SPEC-024",
    "Whole Rabbit",
    "specialty-meat",
    "Rabbit",
    "whole-rabbit",
    24.00,
    "Approximately 1.2kg",
    "1 whole rabbit",
    "per_item",
    "Whole farmed Australian rabbit, cleaned and ready for pot-roasting or jointing.",
    "Whole farmed rabbit, cleaned and trussed. Lean, delicate white meat — pot-roast whole with bacon and white wine, or joint it for a slow braise. Approximately 1.2kg per bird.",
    "Rabbit",
    ["Roast", "Slow Cook", "Braise"],
    ["Frozen"],
    null,
    ["Specialty Meat > Rabbit", "Frozen Meat", "Game Meat", "Gourmet Cooking"],
    "/images/whole-rabbit.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian rabbit farm",
      ingredients: "Rabbit",
      allergens: "None",
      quality_claims: "Farmed Australian rabbit",
      use_by_date: "To be confirmed",
      seo_title: "Buy Whole Rabbit Meat | Farmed Australian Rabbit — Mr Meat & Co",
      seo_meta_description: "Buy whole farmed Australian rabbit online — lean, delicate white meat for pot-roasting or braising. Delivered frozen across Sydney and Australia-wide."
    }
  ),
  createProduct(
    "PRD-SPEC-025",
    "Rabbit Portions (Jointed)",
    "specialty-meat",
    "Rabbit",
    "rabbit-portions-jointed",
    22.00,
    "1kg",
    "1kg",
    "per_pack",
    "Jointed farmed rabbit — legs, shoulders and saddle pieces for braising.",
    "Farmed rabbit jointed into legs, shoulders and saddle pieces. Ideal for the classic braise with mustard and cream, a hunter-style tomato and olive stew, or a rabbit ragu.",
    "Rabbit",
    ["Slow Cook", "Braise", "Casserole"],
    ["Frozen"],
    null,
    ["Specialty Meat > Rabbit", "Frozen Meat", "Slow Cooking", "Game Meat"],
    "/images/rabbit-portions-jointed.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian rabbit farm",
      ingredients: "Rabbit",
      allergens: "None",
      quality_claims: "Farmed Australian rabbit",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-026",
    "Rabbit Loin Fillets",
    "specialty-meat",
    "Rabbit",
    "rabbit-loin-fillets",
    18.00,
    "400g",
    "400g",
    "per_pack",
    "Boneless rabbit loin fillets for a fast pan-fry.",
    "Boneless rabbit loin (backstrap) fillets — the quick-cooking cut. Wrap in prosciutto and pan-fry 3–4 minutes, or slice for a stir-fry. Very lean, so don't overcook.",
    "Rabbit",
    ["Pan-Fry", "Grill"],
    ["Frozen"],
    null,
    ["Specialty Meat > Rabbit", "Frozen Meat", "Game Meat", "Gourmet Cooking"],
    "/images/rabbit-loin-fillets.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian rabbit farm",
      ingredients: "Rabbit",
      allergens: "None",
      quality_claims: "Farmed Australian rabbit",
      use_by_date: "To be confirmed"
    }
  ),

  // SPECIALTY MEAT — GAME: CROCODILE & EMU
  createProduct(
    "PRD-SPEC-027",
    "Crocodile Tail Fillet",
    "specialty-meat",
    "Game",
    "crocodile-tail-fillet",
    26.00,
    "300g",
    "300g",
    "per_pack",
    "Farmed Australian crocodile tail fillet — pale, lean, mild white meat.",
    "Farmed saltwater crocodile tail fillet. Pale, firm and very lean with a mild flavour between chicken and fish. Best pan-fried or grilled fast and hot, or diced for a curry. Don't overcook — it dries quickly.",
    "Crocodile",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat", "Gourmet Cooking"],
    "/images/crocodile-tail-fillet.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian crocodile farm",
      ingredients: "Crocodile",
      allergens: "None",
      quality_claims: "Farmed Australian crocodile",
      use_by_date: "To be confirmed",
      seo_title: "Buy Crocodile Meat | Farmed Australian Croc Tail Fillet — Mr Meat & Co",
      seo_meta_description: "Buy Australian farmed crocodile meat online — lean, mild tail fillet for grilling or curry. Delivered frozen across Sydney and Australia-wide."
    }
  ),
  createProduct(
    "PRD-SPEC-028",
    "Crocodile Boneless Portions",
    "specialty-meat",
    "Game",
    "crocodile-boneless-portions",
    23.00,
    "500g",
    "500g",
    "per_pack",
    "Diced boneless crocodile leg and body meat for curries and skewers.",
    "Boneless crocodile leg and body meat, diced. A little firmer than the tail — ideal marinated on skewers, in a Thai-style curry, or slow-simmered in coconut milk.",
    "Crocodile",
    ["Grill", "BBQ", "Slow Cook", "Curry"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat"],
    "/images/crocodile-boneless-portions.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian crocodile farm",
      ingredients: "Crocodile",
      allergens: "None",
      quality_claims: "Farmed Australian crocodile",
      use_by_date: "To be confirmed"
    }
  ),
  createProduct(
    "PRD-SPEC-029",
    "Emu Fillet",
    "specialty-meat",
    "Game",
    "emu-fillet",
    28.00,
    "400g",
    "400g",
    "per_pack",
    "Australian emu fan fillet — a dark, lean, beef-like red meat from a bird.",
    "Emu fan fillet — deep red, very lean, and tender, eating more like a fine beef fillet than poultry. Sear hard and fast, pull at rare to medium-rare, and rest well. High in iron and low in fat.",
    "Emu",
    ["Pan-Fry", "Grill", "BBQ"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat", "Gourmet Cooking"],
    "/images/emu-fillet.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian emu farm",
      ingredients: "Emu",
      allergens: "None",
      quality_claims: "Farmed Australian emu",
      use_by_date: "To be confirmed",
      seo_title: "Buy Emu Meat | Australian Emu Fillet — Mr Meat & Co",
      seo_meta_description: "Buy Australian emu meat online — a dark, lean, low-fat red meat. Emu fan fillet delivered frozen across Sydney and Australia-wide."
    }
  ),
  createProduct(
    "PRD-SPEC-030",
    "Emu Mince",
    "specialty-meat",
    "Game",
    "emu-mince",
    19.00,
    "500g",
    "500g",
    "per_pack",
    "Ground emu — an ultra-lean red mince for burgers, chilli and meatballs.",
    "Ground emu meat, very lean (typically under 4% fat). Use it for game burgers, chilli con carne, kofta or meatballs — add a little olive oil or grated onion to keep it moist.",
    "Emu Mince",
    ["Pan-Fry", "BBQ", "Pasta Sauce"],
    ["Frozen"],
    null,
    ["Specialty Meat > Game", "Frozen Meat", "Game Meat"],
    "/images/emu-mince.webp",
    {
      storageType: "Frozen",
      primary_product_category: "Specialty Meat",
      country_of_origin: "Australia",
      supplier: "Licensed Australian emu farm",
      ingredients: "Emu",
      allergens: "None",
      quality_claims: "Farmed Australian emu",
      use_by_date: "To be confirmed"
    }
  ),

  // BEEF — BONES & BROTH
  createProduct(
    "PRD-BEEF-036",
    "Beef Knuckle & Joint Bones",
    "beef",
    "Bones & Broth",
    "beef-soup-bones",
    9.00,
    "1kg",
    "1kg",
    "per_kg",
    "Collagen-rich beef knuckle and joint bones — the backbone of a gelatinous broth.",
    "Human-grade grass-fed beef knuckle and joint bones, cut to fit a stockpot. High in collagen, they set a broth to a soft jelly when chilled. Roast first for colour, then simmer 12–24 hours with a splash of vinegar.",
    "Beef Bones",
    ["Slow Cook", "Broth"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Beef > Bones & Broth", "Slow Cooking", "Fresh Chilled", "Budget Friendly"],
    "/images/beef-soup-bones.webp",
    {
      seo_title: "Beef Bones for Bone Broth | Knuckle & Joint — Mr Meat & Co",
      seo_meta_description: "Buy beef bones for broth online — collagen-rich knuckle and joint bones for a gelatinous stock. Grass-fed, human-grade, delivered cold across Sydney."
    }
  ),
  createProduct(
    "PRD-BEEF-037",
    "Meaty Beef Shin Bones",
    "beef",
    "Bones & Broth",
    "meaty-beef-shin-bones",
    14.00,
    "1kg",
    "1kg",
    "per_kg",
    "Cross-cut beef shin bones with plenty of meat still on — broth plus a meal.",
    "Cross-cut grass-fed beef shin bones with a generous collar of meat and a marrow centre. Use them for a deeply savoury broth that also yields shredded beef for soup, pho or tacos.",
    "Beef Bones",
    ["Slow Cook", "Broth", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Beef > Bones & Broth", "Slow Cooking", "Fresh Chilled"],
    "/images/meaty-beef-shin-bones.webp",
    {
      seo_title: "Meaty Beef Shin Bones | For Broth & Pho — Mr Meat & Co",
      seo_meta_description: "Buy meaty beef shin bones online — cross-cut, marrow-centred, ideal for a savoury broth or pho. Grass-fed, delivered cold across Sydney."
    }
  ),

  // PORK — CHRISTMAS HAM
  createProduct(
    "PRD-PORK-025",
    "Whole Bone-In Christmas Ham",
    "pork",
    "Bacon & Ham",
    "whole-bone-in-christmas-ham",
    189.00,
    "Approximately 7–9kg",
    "1 whole leg",
    "from_price",
    "Whole bone-in Australian leg ham, fully cooked and traditionally cured — the Christmas centrepiece.",
    "A whole bone-in leg ham from Australian pork, wood-smoked and fully cooked. Feeds a large crowd with a week of leftovers. Skin, score, glaze and warm through, or serve cold. Priced from — final price by weight. Pre-order for a December delivery window; hams sell out.",
    "Christmas Ham",
    ["Glaze", "Roast", "Serve Cold"],
    ["Fresh Chilled"],
    null,
    ["Pork > Bacon & Ham", "Christmas", "Premium", "Fresh Chilled"],
    "/images/whole-bone-in-christmas-ham.webp",
    {
      stockStatus: "Pre-Order",
      badge: "Christmas — Pre-Order",
      country_of_origin: "Australia",
      supplier: "Verified Local Australian Farms & Master Butchers",
      quality_claims: "Australian pork, traditionally cured, fully cooked",
      secondary_subcategories: [],
      seo_title: "Whole Christmas Ham Delivery Sydney | Bone-In Leg Ham — Mr Meat & Co",
      seo_meta_description: "Order a whole bone-in Christmas ham for December delivery in Sydney. Fully cooked Australian leg ham, priced from $189. Pre-order early — hams sell out."
    }
  ),
  createProduct(
    "PRD-PORK-026",
    "Half Leg Christmas Ham",
    "pork",
    "Bacon & Ham",
    "half-leg-christmas-ham",
    109.00,
    "Approximately 4–6kg",
    "Half leg",
    "from_price",
    "Half bone-in leg ham — the Christmas ham for a smaller table.",
    "A half bone-in leg ham from Australian pork, wood-smoked and fully cooked. Feeds 4–8 with leftovers. Same cure and quality as the whole leg, in a size that fits a normal fridge. Priced from — final price by weight. Pre-order for December delivery.",
    "Christmas Ham",
    ["Glaze", "Roast", "Serve Cold"],
    ["Fresh Chilled"],
    null,
    ["Pork > Bacon & Ham", "Christmas", "Fresh Chilled"],
    "/images/half-leg-christmas-ham.webp",
    {
      stockStatus: "Pre-Order",
      badge: "Christmas — Pre-Order",
      country_of_origin: "Australia",
      supplier: "Verified Local Australian Farms & Master Butchers",
      quality_claims: "Australian pork, traditionally cured, fully cooked",
      seo_title: "Half Christmas Ham | Half Leg Ham Delivery Sydney — Mr Meat & Co",
      seo_meta_description: "Order a half bone-in Christmas ham for December delivery in Sydney. Fully cooked Australian leg ham, priced from $109. Pre-order early."
    }
  ),
  createProduct(
    "PRD-PORK-027",
    "Boneless Christmas Ham",
    "pork",
    "Bacon & Ham",
    "boneless-christmas-ham",
    129.00,
    "Approximately 3.5–4.5kg",
    "1 boneless ham",
    "from_price",
    "Boneless leg ham — the easy-carve Christmas ham.",
    "A boneless Australian leg ham, wood-smoked and fully cooked, netted and ready to glaze. No bone to work around — carves into clean, even slices and stores compactly. Priced from — final price by weight. Pre-order for December delivery.",
    "Christmas Ham",
    ["Glaze", "Roast", "Serve Cold"],
    ["Fresh Chilled"],
    null,
    ["Pork > Bacon & Ham", "Christmas", "Fresh Chilled"],
    "/images/boneless-christmas-ham.webp",
    {
      stockStatus: "Pre-Order",
      badge: "Christmas — Pre-Order",
      country_of_origin: "Australia",
      supplier: "Verified Local Australian Farms & Master Butchers",
      quality_claims: "Australian pork, traditionally cured, fully cooked",
      seo_title: "Boneless Christmas Ham Delivery Sydney | Easy-Carve Leg Ham — Mr Meat & Co",
      seo_meta_description: "Order a boneless Christmas ham for December delivery in Sydney. Fully cooked Australian leg ham, easy to carve, priced from $129. Pre-order early."
    }
  ),

  // PORK — BONES & BROTH
  createProduct(
    "PRD-PORK-028",
    "Pork Neck Bones",
    "pork",
    "Bones & Broth",
    "pork-neck-bones",
    8.00,
    "1kg",
    "1kg",
    "per_kg",
    "Meaty Australian pork neck bones for tonkotsu, nilaga and stock.",
    "Human-grade Australian pork neck bones with plenty of meat and marrow. The workhorse bone for a milky tonkotsu ramen broth, a Filipino nilaga, or a everyday pork stock. Blanch first, then simmer hard.",
    "Pork Bones",
    ["Slow Cook", "Broth"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Pork > Bones & Broth", "Slow Cooking", "Fresh Chilled", "Budget Friendly"],
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1200&auto=format&fit=crop",
    {
      seo_title: "Buy Pork Bones Online | Pork Neck Bones for Broth — Mr Meat & Co",
      seo_meta_description: "Buy Australian pork neck bones online — meaty, marrow-rich bones for tonkotsu ramen broth and stock. Human-grade, delivered cold across Sydney."
    }
  ),
  createProduct(
    "PRD-PORK-029",
    "Pork Trotters (Split)",
    "pork",
    "Bones & Broth",
    "pork-trotters",
    7.00,
    "1kg",
    "1kg",
    "per_kg",
    "Split Australian pork trotters — pure gelatine for broth, brawn and braises.",
    "Split Australian pork trotters (pig's feet). Almost all skin, cartilage and bone — they give a broth its body and shine, and are the base of brawn, souse and a proper tonkotsu. Also braise them whole, slow, until sticky.",
    "Pork Bones",
    ["Slow Cook", "Broth", "Braise"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Pork > Bones & Broth", "Slow Cooking", "Fresh Chilled", "Budget Friendly"],
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1200&auto=format&fit=crop",
    {
      seo_title: "Pork Trotters | Split Pig's Feet for Broth & Brawn — Mr Meat & Co",
      seo_meta_description: "Buy split Australian pork trotters online — pure gelatine for tonkotsu broth, brawn and sticky braises. Delivered cold across Sydney."
    }
  ),

  // 12. LIVE POULTRY (pickup / local delivery only — not part of cold-chain meat delivery)
  createProduct(
    "PRD-LIVE-001",
    "Point-of-Lay Hens (Brown Egg Layers)",
    "live-poultry",
    "Laying Hens",
    "point-of-lay-hens-brown-egg",
    32.00,
    "16–20 weeks",
    "Per bird (min. 2)",
    "per_item",
    "Vaccinated point-of-lay ISA Brown / Hyline hens, ready to start laying within weeks.",
    "Point-of-lay hens at 16–20 weeks — vaccinated, sexed females that will begin laying brown eggs within a few weeks of settling in. ISA Brown and Hyline strains: hardy, docile and reliable, 280–320 eggs in the first year. Sold in minimum lots of two for welfare. Farm pickup by appointment or local Sydney delivery — not part of the cold-chain meat delivery.",
    "Live Bird",
    [],
    ["Live Bird"],
    null,
    ["Live Poultry > Laying Hens"],
    "/images/point-of-lay-hens-brown-egg.webp",
    {
      stockStatus: "Seasonal",
      badge: "Pickup / Local Only",
      storageType: "To be confirmed",
      country_of_origin: "Australia",
      supplier: "Partner poultry farm, NSW",
      quality_claims: "Vaccinated (Marek's, Newcastle/IB), sexed pullets",
      cooking_instructions: "Live animal — not for consumption. Provide a predator-proof coop, clean water, layer feed and shell grit.",
      handling_instructions: "Transport in a ventilated pet carrier or poultry box. Keep calm, shaded and out of wind.",
      seo_title: "Point-of-Lay Hens for Sale Sydney | ISA Brown Layers — Mr Meat & Co",
      seo_meta_description: "Point-of-lay laying hens for sale near Sydney — vaccinated, sexed ISA Brown and Hyline pullets at 16–20 weeks. Farm pickup or local delivery."
    }
  ),
  createProduct(
    "PRD-LIVE-002",
    "Australorp Point-of-Lay Hens (Dual-Purpose)",
    "live-poultry",
    "Laying Hens",
    "australorp-point-of-lay-hens",
    38.00,
    "16–20 weeks",
    "Per bird (min. 2)",
    "per_item",
    "Australian Australorp POL hens — a calm dual-purpose heritage layer.",
    "Point-of-lay Australorp hens — the Australian heritage breed, calm and glossy black, laying around 250 tinted eggs a year and holding condition well as a table bird too. Vaccinated, sexed, minimum two birds. Farm pickup or local Sydney delivery only.",
    "Live Bird",
    [],
    ["Live Bird"],
    null,
    ["Live Poultry > Laying Hens"],
    "/images/australorp-point-of-lay-hens.webp",
    {
      stockStatus: "Seasonal",
      badge: "Pickup / Local Only",
      storageType: "To be confirmed",
      country_of_origin: "Australia",
      supplier: "Partner poultry farm, NSW",
      quality_claims: "Vaccinated, sexed pullets, heritage breed",
      cooking_instructions: "Live animal — not for consumption. Provide a predator-proof coop, clean water, layer feed and shell grit.",
      handling_instructions: "Transport in a ventilated pet carrier or poultry box. Keep calm, shaded and out of wind."
    }
  ),
  createProduct(
    "PRD-LIVE-003",
    "Young Pullets (10–14 weeks)",
    "live-poultry",
    "Pullets",
    "young-pullets-grower",
    22.00,
    "10–14 weeks",
    "Per bird (min. 3)",
    "per_item",
    "Feathered brown-egg-layer pullets to grow on to point of lay.",
    "Young pullets at 10–14 weeks — past the heat-lamp stage, fully feathered and hardy, on grower feed. Cheaper per bird than point of lay and easy to tame if you handle them daily. Brown-egg layer strains. Vaccinated, sexed, minimum three. Farm pickup or local Sydney delivery only.",
    "Live Bird",
    [],
    ["Live Bird"],
    null,
    ["Live Poultry > Pullets"],
    "/images/young-pullets-grower.webp",
    {
      stockStatus: "Seasonal",
      badge: "Pickup / Local Only",
      storageType: "To be confirmed",
      country_of_origin: "Australia",
      supplier: "Partner poultry farm, NSW",
      quality_claims: "Vaccinated, sexed pullets",
      cooking_instructions: "Live animal — not for consumption. House draught-free with grower feed until ~18 weeks, then switch to layer feed.",
      handling_instructions: "Transport in a ventilated pet carrier or poultry box. Keep calm, shaded and out of wind."
    }
  ),
  createProduct(
    "PRD-LIVE-004",
    "Table / Meat Birds (Straight-Run)",
    "live-poultry",
    "Meat Birds",
    "table-meat-birds-straight-run",
    14.00,
    "Day-old to 4 weeks",
    "Per bird (min. 6)",
    "per_item",
    "Fast-growing straight-run meat chickens for home table-bird raising.",
    "Fast-growing meat-strain chickens, sold straight-run (unsexed) from day-old to four weeks depending on season. Reach 2–3kg live weight in 7–9 weeks on a meat-bird ration. Minimum six birds. Farm pickup or local Sydney delivery only. We can refer you to licensed small-scale processors near Sydney.",
    "Live Bird",
    [],
    ["Live Bird"],
    null,
    ["Live Poultry > Meat Birds"],
    "/images/table-meat-birds-straight-run.webp",
    {
      stockStatus: "Seasonal",
      badge: "Pickup / Local Only",
      storageType: "To be confirmed",
      country_of_origin: "Australia",
      supplier: "Partner poultry farm, NSW",
      quality_claims: "Straight-run meat strain",
      cooking_instructions: "Live animal — not for consumption. Brood day-olds at 32°C reducing weekly; feed a starter/grower meat-bird ration.",
      handling_instructions: "Transport day-olds in a warm ventilated box. Keep older birds calm, shaded and out of wind."
    }
  ),
  createProduct(
    "PRD-LIVE-005",
    "Bantams — Silkie & Pekin (Seasonal)",
    "live-poultry",
    "Bantams",
    "bantams-silkie-pekin",
    45.00,
    "Point of lay / grown",
    "Per bird (min. 2)",
    "per_item",
    "Friendly Silkie and Pekin bantams — pet birds, broodies and small-space layers.",
    "A rotating seasonal selection of bantams — usually Silkie and Pekin, occasionally other fancy breeds. Small, calm and famously good with children; Silkies are the classic broody hen. They lay small eggs and can't fly well, so fencing is simple. Minimum two birds. Availability is limited — contact us for the current list. Farm pickup or local Sydney delivery only.",
    "Live Bird",
    [],
    ["Live Bird"],
    null,
    ["Live Poultry > Bantams"],
    "/images/bantams-silkie-pekin.webp",
    {
      stockStatus: "Seasonal",
      badge: "Pickup / Local Only",
      storageType: "To be confirmed",
      country_of_origin: "Australia",
      supplier: "Partner poultry farm, NSW",
      quality_claims: "Fancy bantam breeds, availability seasonal",
      cooking_instructions: "Live animal — not for consumption. Provide a predator-proof coop, clean water and appropriate feed.",
      handling_instructions: "Transport in a ventilated pet carrier. Keep calm, shaded and out of wind."
    }
  ),

  // 11. SEAFOOD
  // SEAFOOD — FISH
  createProduct(
    "PRD-SEA-001",
    "Barramundi Fillets",
    "seafood",
    "Fish",
    "barramundi-fillets",
    19.00,
    "500g",
    "500g",
    "per_pack",
    "Barramundi fillets prepared for pan-frying, grilling, barbecue or oven baking.",
    "Barramundi fillets in a 500g pack. Clean, mild white fish suited for pan-frying, barbecue grilling, or oven baking.",
    "Barramundi Fillet",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Best Sellers", "Fresh Seafood", "Weeknight Meals"],
    "/images/barramundi-fillets.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Barramundi Fillets | Seafood Catalogue",
      seo_meta_description: "Barramundi Fillets in 500g pack size for $19.00 AUD. Fresh Chilled storage with pan-fry, grill, BBQ and oven cooking methods.",
      breadcrumb_path: "Home > Seafood > Fish > Barramundi Fillets"
    }
  ),
  createProduct(
    "PRD-SEA-002",
    "Barramundi Portions",
    "seafood",
    "Fish",
    "barramundi-portions",
    19.95,
    "250g",
    "250g",
    "per_pack",
    "Barramundi portions in 250g pack, frozen, for pan-fry, grill, BBQ or oven.",
    "Individually frozen barramundi portions in a 250g pack. Suitable for pan-frying, barbecue grilling, or oven baking.",
    "Barramundi Portion",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Frozen"],
    null,
    ["Frozen Seafood", "Weeknight Meals"],
    "/images/barramundi-portions.webp",
    {
      storageType: "Frozen",
      seo_title: "Barramundi Portions | Seafood Catalogue",
      seo_meta_description: "Barramundi Portions in 250g pack size for $19.95 AUD. Frozen storage for pan-fry, grill, BBQ and oven cooking.",
      breadcrumb_path: "Home > Seafood > Fish > Barramundi Portions"
    }
  ),
  createProduct(
    "PRD-SEA-003",
    "Barramundi Bites",
    "seafood",
    "Fish",
    "barramundi-bites",
    25.00,
    "500g",
    "500g",
    "per_pack",
    "Seasoned barramundi pieces in 500g pack for pan-fry, air fryer or oven.",
    "Seasoned barramundi bite-sized pieces in a 500g pack. Convenient for quick pan-frying, air frying, or oven baking.",
    "Seasoned Barramundi Pieces",
    ["Pan-Fry", "Air Fryer", "Oven"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Family Meals", "Weeknight Meals"],
    "/images/barramundi-bites.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Barramundi Bites | Seafood Catalogue",
      seo_meta_description: "Barramundi Bites in 500g pack size for $25.00 AUD. Fresh Chilled seasoned barramundi pieces for pan-fry, air fryer and oven.",
      breadcrumb_path: "Home > Seafood > Fish > Barramundi Bites"
    }
  ),
  createProduct(
    "PRD-SEA-004",
    "Snapper Fillets",
    "seafood",
    "Fish",
    "snapper-fillets",
    29.99,
    "500g",
    "500g",
    "per_pack",
    "Snapper fillets in 500g pack for pan-frying, grilling, BBQ or oven baking.",
    "Fresh chilled snapper fillets in a 500g pack. Delicate white fish fillets suitable for pan-frying, grilling, BBQ, or oven baking.",
    "Snapper Fillet",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Fresh Seafood", "Best Sellers", "Weeknight Meals"],
    "/images/snapper-fillets.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Snapper Fillets | Seafood Catalogue",
      seo_meta_description: "Snapper Fillets in 500g pack size for $29.99 AUD. Fresh Chilled storage with pan-fry, grill, BBQ and oven cooking methods.",
      breadcrumb_path: "Home > Seafood > Fish > Snapper Fillets"
    }
  ),
  createProduct(
    "PRD-SEA-005",
    "Flathead Fillets",
    "seafood",
    "Fish",
    "flathead-fillets",
    24.99,
    "500g",
    "500g",
    "per_pack",
    "Flathead fillets in 500g pack for pan-frying, grilling, air fryer or oven.",
    "Fresh chilled flathead fillets in a 500g pack. Sweet and tender fillets ideal for pan-frying, air frying, grilling, or oven baking.",
    "Flathead Fillet",
    ["Pan-Fry", "Grill", "Air Fryer", "Oven"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Family Meals", "Weeknight Meals"],
    "/images/flathead-fillets.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Flathead Fillets | Seafood Catalogue",
      seo_meta_description: "Flathead Fillets in 500g pack size for $24.99 AUD. Fresh Chilled storage for pan-fry, grill, air fryer and oven cooking.",
      breadcrumb_path: "Home > Seafood > Fish > Flathead Fillets"
    }
  ),
  createProduct(
    "PRD-SEA-006",
    "Threadfin Salmon Fillets",
    "seafood",
    "Fish",
    "threadfin-salmon-fillets",
    24.99,
    "500g",
    "500g",
    "per_pack",
    "Threadfin salmon fillets in 500g pack for pan-frying, grilling, BBQ or oven.",
    "Fresh chilled threadfin salmon fillets in a 500g pack. Firm white fish fillets suitable for pan-frying, barbecue grilling, or oven baking.",
    "Threadfin Salmon Fillet",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Weeknight Meals"],
    "/images/threadfin-salmon-fillets.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Threadfin Salmon Fillets | Seafood Catalogue",
      seo_meta_description: "Threadfin Salmon Fillets in 500g pack size for $24.99 AUD. Fresh Chilled storage with pan-fry, grill, BBQ and oven methods.",
      breadcrumb_path: "Home > Seafood > Fish > Threadfin Salmon Fillets"
    }
  ),

  // SEAFOOD — PRAWNS
  createProduct(
    "PRD-SEA-007",
    "School Prawns",
    "seafood",
    "Prawns",
    "school-prawns",
    21.00,
    "1kg",
    "1kg",
    "per_kg",
    "Whole raw school prawns sold per kg for BBQ, grill, pan-fry or boiling.",
    "Fresh chilled whole raw school prawns in a 1kg pack. Suitable for barbecue grilling, pan-frying, or quick boiling.",
    "Whole Raw Prawns",
    ["BBQ", "Grill", "Pan-Fry", "Boil"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "BBQ Seafood", "Entertaining"],
    "/images/school-prawns.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "School Prawns | Seafood Catalogue",
      seo_meta_description: "School Prawns in 1kg pack size for $21.00 AUD per kg. Fresh Chilled whole raw prawns for BBQ, grill, pan-fry and boil.",
      breadcrumb_path: "Home > Seafood > Prawns > School Prawns"
    }
  ),
  createProduct(
    "PRD-SEA-008",
    "Medium Green King Prawns",
    "seafood",
    "Prawns",
    "medium-green-king-prawns",
    29.90,
    "1kg",
    "1kg",
    "per_kg",
    "Raw medium green king prawns sold per kg for BBQ, grill, pan-fry or boil.",
    "Fresh chilled raw medium green king prawns in a 1kg pack. Suitable for barbecue skewers, pan-frying with garlic butter, or boiling.",
    "Raw King Prawns",
    ["BBQ", "Grill", "Pan-Fry", "Boil"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "BBQ Seafood", "Best Sellers", "Entertaining"],
    "/images/medium-green-king-prawns.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Medium Green King Prawns | Seafood Catalogue",
      seo_meta_description: "Medium Green King Prawns in 1kg pack size for $29.90 AUD per kg. Fresh Chilled raw king prawns for BBQ, grill, pan-fry and boil.",
      breadcrumb_path: "Home > Seafood > Prawns > Medium Green King Prawns"
    }
  ),
  createProduct(
    "PRD-SEA-009",
    "Large Green King Prawns",
    "seafood",
    "Prawns",
    "large-green-king-prawns",
    42.99,
    "1kg",
    "1kg",
    "per_kg",
    "Raw large green king prawns sold per kg for BBQ, grill, pan-fry or boiling.",
    "Fresh chilled raw large green king prawns in a 1kg pack. Sized for barbecue grilling, butterflying, or roasting.",
    "Raw King Prawns",
    ["BBQ", "Grill", "Pan-Fry", "Boil"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "BBQ Seafood", "Entertaining"],
    "/images/large-green-king-prawns.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Large Green King Prawns | Seafood Catalogue",
      seo_meta_description: "Large Green King Prawns in 1kg pack size for $42.99 AUD per kg. Fresh Chilled raw king prawns for BBQ, grill, pan-fry and boil.",
      breadcrumb_path: "Home > Seafood > Prawns > Large Green King Prawns"
    }
  ),
  createProduct(
    "PRD-SEA-010",
    "XL Raw King Prawns",
    "seafood",
    "Prawns",
    "xl-raw-king-prawns",
    50.00,
    "1kg",
    "1kg",
    "per_kg",
    "Extra large raw king prawns sold per kg for BBQ, grill, pan-fry or boiling.",
    "Fresh chilled extra large raw king prawns in a 1kg pack. Large prawn cut for barbecue grilling, butterflying, or whole cooking.",
    "Raw King Prawns",
    ["BBQ", "Grill", "Pan-Fry", "Boil"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "BBQ Seafood", "Entertaining"],
    "/images/xl-raw-king-prawns.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "XL Raw King Prawns | Seafood Catalogue",
      seo_meta_description: "XL Raw King Prawns in 1kg pack size for $50.00 AUD per kg. Fresh Chilled extra large raw king prawns for BBQ and grill.",
      breadcrumb_path: "Home > Seafood > Prawns > XL Raw King Prawns"
    }
  ),
  createProduct(
    "PRD-SEA-011",
    "Whole Cooked Prawns",
    "seafood",
    "Prawns",
    "whole-cooked-prawns",
    59.00,
    "1kg",
    "1kg",
    "per_pack",
    "Whole cooked prawns (1kg pack), frozen, ready to eat, BBQ or grill.",
    "Frozen whole cooked prawns in a 1kg pack. Thaw and peel for immediate serving, or warm gently on the barbecue.",
    "Cooked Prawns",
    ["Ready to Eat", "BBQ", "Grill"],
    ["Frozen", "Cooked"],
    null,
    ["Frozen Seafood", "Entertaining", "Best Sellers"],
    "/images/whole-cooked-prawns.webp",
    {
      storageType: "Frozen",
      seo_title: "Whole Cooked Prawns | Seafood Catalogue",
      seo_meta_description: "Whole Cooked Prawns in 1kg pack size for $59.00 AUD per pack. Frozen storage with ready to eat, BBQ and grill options.",
      breadcrumb_path: "Home > Seafood > Prawns > Whole Cooked Prawns"
    }
  ),
  createProduct(
    "PRD-SEA-012",
    "Raw Banana Prawns",
    "seafood",
    "Prawns",
    "raw-banana-prawns",
    12.50,
    "500g",
    "500g",
    "per_pack",
    "Raw banana prawns in 500g pack for BBQ, grill, pan-fry or boiling.",
    "Fresh chilled raw banana prawns in a 500g pack. Tender prawns suited for stir-fries, curries, pan-searing, and boiling.",
    "Raw Prawns",
    ["BBQ", "Grill", "Pan-Fry", "Boil"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Specials", "Weeknight Meals"],
    "/images/raw-banana-prawns.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Raw Banana Prawns | Seafood Catalogue",
      seo_meta_description: "Raw Banana Prawns in 500g pack size for $12.50 AUD. Fresh Chilled raw prawns for BBQ, grill, pan-fry and boil.",
      breadcrumb_path: "Home > Seafood > Prawns > Raw Banana Prawns"
    }
  ),
  createProduct(
    "PRD-SEA-013",
    "Prawn Meat",
    "seafood",
    "Prawns",
    "prawn-meat",
    40.00,
    "500g",
    "500g",
    "per_pack",
    "Peeled raw prawn meat in 500g pack for stir-fry, pan-fry, curry or pasta.",
    "Fresh chilled peeled raw prawn meat in a 500g pack. Ready to cook for quick stir-fries, pan-searing, curries, and pasta dishes.",
    "Prawn Meat",
    ["Stir-Fry", "Pan-Fry", "Curry", "Pasta"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Weeknight Meals"],
    "/images/prawn-meat.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Prawn Meat | Seafood Catalogue",
      seo_meta_description: "Prawn Meat in 500g pack size for $40.00 AUD. Fresh Chilled peeled prawn meat for stir-fry, pan-fry, curry and pasta.",
      breadcrumb_path: "Home > Seafood > Prawns > Prawn Meat"
    }
  ),

  // SEAFOOD — SALMON
  createProduct(
    "PRD-SEA-014",
    "Tasmanian Salmon Portions",
    "seafood",
    "Salmon",
    "tasmanian-salmon-portions",
    24.95,
    "500g",
    "500g",
    "per_pack",
    "Salmon portions in 500g pack for pan-frying, grilling, BBQ or oven baking.",
    "Fresh chilled salmon portions in a 500g pack. Portioned cuts suitable for pan-frying, barbecue grilling, or oven baking.",
    "Salmon Portions",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled", "Vacuum Sealed"],
    null,
    ["Fresh Seafood", "Best Sellers", "Weeknight Meals"],
    "/images/tasmanian-salmon-portions.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Tasmanian Salmon Portions | Seafood Catalogue",
      seo_meta_description: "Tasmanian Salmon Portions in 500g pack size for $24.95 AUD. Fresh Chilled storage with pan-fry, grill, BBQ and oven methods.",
      breadcrumb_path: "Home > Seafood > Salmon > Tasmanian Salmon Portions"
    }
  ),
  createProduct(
    "PRD-SEA-015",
    "Skin-On Salmon Portions",
    "seafood",
    "Salmon",
    "skin-on-salmon-portions",
    24.95,
    "500g",
    "500g",
    "per_pack",
    "Skin-on salmon portions in 500g pack for pan-fry, grill, BBQ or oven.",
    "Fresh chilled skin-on salmon portions in a 500g pack. Suitable for pan-searing skin-side down for crispy skin, grilling, or baking.",
    "Salmon Portions",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Weeknight Meals"],
    "/images/skin-on-salmon-portions.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Skin-On Salmon Portions | Seafood Catalogue",
      seo_meta_description: "Skin-On Salmon Portions in 500g pack size for $24.95 AUD. Fresh Chilled salmon portions for crispy skin pan-fry, grill, BBQ and oven.",
      breadcrumb_path: "Home > Seafood > Salmon > Skin-On Salmon Portions"
    }
  ),
  createProduct(
    "PRD-SEA-016",
    "Skinless Salmon Portions",
    "seafood",
    "Salmon",
    "skinless-salmon-portions",
    26.95,
    "500g",
    "500g",
    "per_pack",
    "Skinless salmon portions in 500g pack for pan-fry, grill, BBQ or oven.",
    "Fresh chilled skinless salmon portions in a 500g pack. Trimmed skinless cuts suitable for pan-searing, gentle baking, or poaching.",
    "Salmon Portions",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Weeknight Meals"],
    "/images/skinless-salmon-portions.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Skinless Salmon Portions | Seafood Catalogue",
      seo_meta_description: "Skinless Salmon Portions in 500g pack size for $26.95 AUD. Fresh Chilled storage with pan-fry, grill, BBQ and oven cooking.",
      breadcrumb_path: "Home > Seafood > Salmon > Skinless Salmon Portions"
    }
  ),
  createProduct(
    "PRD-SEA-017",
    "Salmon Fillets",
    "seafood",
    "Salmon",
    "salmon-fillets",
    49.90,
    "1kg",
    "1kg",
    "per_kg",
    "Salmon fillets sold per kg in 1kg pack for pan-fry, grill, BBQ or oven.",
    "Fresh chilled salmon fillets in a 1kg pack. Large fillet cut suitable for family dinners, whole roasting, or portioning.",
    "Salmon Fillet",
    ["Pan-Fry", "Grill", "BBQ", "Oven"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Family Meals"],
    "/images/salmon-fillets.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Salmon Fillets | Seafood Catalogue",
      seo_meta_description: "Salmon Fillets in 1kg pack size for $49.90 AUD per kg. Fresh Chilled salmon fillets for pan-fry, grill, BBQ and oven.",
      breadcrumb_path: "Home > Seafood > Salmon > Salmon Fillets"
    }
  ),
  createProduct(
    "PRD-SEA-018",
    "Whole Salmon",
    "seafood",
    "Salmon",
    "whole-salmon",
    99.00,
    "Approximately 3kg",
    "Approximately 3kg",
    "per_item",
    "Whole salmon (approx. 3kg) for roasting, BBQ or grilling.",
    "Fresh chilled whole salmon (approx. 3kg). Prepared for whole oven roasting, barbecue, or custom cutting.",
    "Whole Salmon",
    ["Roast", "BBQ", "Grill"],
    ["Fresh Chilled"],
    null,
    ["Fresh Seafood", "Entertaining", "Family Meals"],
    "/images/whole-salmon.webp",
    {
      storageType: "Fresh Chilled",
      seo_title: "Whole Salmon | Seafood Catalogue",
      seo_meta_description: "Whole Salmon (Approximately 3kg) for $99.00 AUD per item. Fresh Chilled whole salmon for roasting, BBQ and grilling.",
      breadcrumb_path: "Home > Seafood > Salmon > Whole Salmon"
    }
  ),
  createProduct(
    "PRD-SEA-019",
    "Hot Smoked Salmon",
    "seafood",
    "Salmon",
    "hot-smoked-salmon",
    8.50,
    "150g",
    "150g",
    "per_pack",
    "Hot smoked salmon in 150g pack, refrigerated, ready to eat.",
    "Hot smoked salmon in a 150g pack. Ready to eat cold or flaked into salads, pasta, and platters.",
    "Smoked Salmon",
    ["Ready to Eat"],
    ["Refrigerated"],
    null,
    ["Specials", "Entertaining"],
    "/images/hot-smoked-salmon.webp",
    {
      storageType: "Refrigerated",
      seo_title: "Hot Smoked Salmon | Seafood Catalogue",
      seo_meta_description: "Hot Smoked Salmon in 150g pack size for $8.50 AUD. Refrigerated smoked salmon ready to eat.",
      breadcrumb_path: "Home > Seafood > Salmon > Hot Smoked Salmon"
    }
  ),

  // SEAFOOD — VALUE PACKS
   // 12. PET FOOD (24 Approved Catalogue Products)
  // Raw Mince (7 items)
  createProduct(
    "PRD-PET-001",
    "Beef Pet Mince",
    "pet-food",
    "Raw Mince",
    "beef-pet-mince",
    14.00,
    "1kg",
    "1kg",
    "per_pack",
    "Raw beef pet mince, 1kg frozen pack.",
    "Frozen raw beef pet mince, portioned into a 1kg pack for easy defrosting — ground from the same Australian beef trim as our human-grade cuts, kept completely separate from the retail range. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Frozen Pet Food", "Best Sellers"],
    "/images/beef-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Beef Pet Mince, 1kg frozen pack, $14.00 AUD — ground from Australian beef trim, kept separate from our retail range. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Beef Pet Mince"
    }
  ),
  createProduct(
    "PRD-PET-002",
    "Beef & Offal Pet Mince",
    "pet-food",
    "Raw Mince",
    "beef-and-offal-pet-mince",
    50.00,
    "10kg",
    "10kg",
    "per_box",
    "Frozen 10kg bulk raw beef and offal pet mince box.",
    "Bulk 10kg box of frozen raw beef and offal pet mince. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Bulk Pet Food", "Frozen Pet Food"],
    "/images/beef-and-offal-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef & Offal Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Beef & Offal Pet Mince in 10kg bulk box for $50.00 AUD. Frozen raw pet mince. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Beef & Offal Pet Mince"
    }
  ),
  createProduct(
    "PRD-PET-003",
    "Chicken Pet Mince",
    "pet-food",
    "Raw Mince",
    "chicken-pet-mince",
    6.60,
    "1kg",
    "1kg",
    "per_pack",
    "Raw chicken pet mince, 1kg frozen pack.",
    "Frozen raw chicken pet mince in a 1kg pack, ground from chicken frame and trim — a leaner option than beef mince for pets on a raw diet. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Frozen Pet Food", "Best Sellers"],
    "/images/chicken-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Chicken Pet Mince, 1kg frozen pack, $6.60 AUD — a leaner raw-diet option ground from chicken frame and trim. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Chicken Pet Mince"
    }
  ),
  createProduct(
    "PRD-PET-004",
    "Chicken & Beef Pet Mince",
    "pet-food",
    "Raw Mince",
    "chicken-and-beef-pet-mince",
    7.70,
    "1kg",
    "1kg",
    "per_pack",
    "Mixed chicken & beef pet mince, 1kg frozen pack.",
    "A frozen 1kg blend of raw chicken and beef pet mince, giving a mixed-protein option without buying two separate packs. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Frozen Pet Food"],
    "/images/chicken-and-beef-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Mixed Protein",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken & Beef Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Chicken & Beef Pet Mince, 1kg frozen pack, $7.70 AUD — a mixed-protein blend in one pack. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Chicken & Beef Pet Mince"
    }
  ),
  createProduct(
    "PRD-PET-005",
    "Kangaroo Pet Mince",
    "pet-food",
    "Raw Mince",
    "kangaroo-pet-mince",
    15.00,
    "1kg",
    "1kg",
    "per_pack",
    "Raw kangaroo pet mince, 1kg frozen pack.",
    "Frozen raw kangaroo pet mince in a 1kg pack — a lean, novel-protein option for pets with sensitivities to more common meats. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Frozen Pet Food", "Best Sellers"],
    "/images/kangaroo-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Kangaroo Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Kangaroo Pet Mince, 1kg frozen pack, $15.00 AUD — a lean novel-protein option for pets with sensitivities. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Kangaroo Pet Mince"
    }
  ),
  createProduct(
    "PRD-PET-006",
    "Kangaroo & Chicken Pet Mince",
    "pet-food",
    "Raw Mince",
    "kangaroo-and-chicken-pet-mince",
    100.00,
    "10kg",
    "10kg",
    "per_box",
    "Frozen 10kg bulk raw kangaroo and chicken pet mince box.",
    "Bulk 10kg box of frozen raw kangaroo and chicken pet mince. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Bulk Pet Food", "Frozen Pet Food"],
    "/images/kangaroo-and-chicken-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Mixed Protein",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Kangaroo & Chicken Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Kangaroo & Chicken Pet Mince in 10kg bulk box for $100.00 AUD. Frozen raw pet mince. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Kangaroo & Chicken Pet Mince"
    }
  ),
  createProduct(
    "PRD-PET-007",
    "Diced Kangaroo & Beef Pet Mince",
    "pet-food",
    "Raw Mince",
    "diced-kangaroo-and-beef-pet-mince",
    8.99,
    "600g",
    "600g",
    "per_pack",
    "Frozen 600g diced raw kangaroo and beef pet mince.",
    "Frozen diced raw kangaroo and beef pet mince in a 600g pack. Pet food only — not for human consumption.",
    "Pet Mince",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Raw Mince", "Frozen Pet Food"],
    "/images/diced-kangaroo-and-beef-pet-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Mixed Protein",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Diced Kangaroo & Beef Pet Mince | Pet Food Catalogue",
      seo_meta_description: "Diced Kangaroo & Beef Pet Mince in 600g pack size for $8.99 AUD. Frozen raw pet mince. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Raw Mince > Diced Kangaroo & Beef Pet Mince"
    }
  ),

  // Bones (8 items)
  createProduct(
    "PRD-PET-008",
    "Beef Marrow Bones for Dogs",
    "pet-food",
    "Bones",
    "beef-marrow-bones-for-dogs",
    10.00,
    "2kg",
    "2kg",
    "per_pack",
    "Frozen 2kg raw beef marrow bones for dogs.",
    "Frozen raw beef marrow bones for dogs in a 2kg pack. Pet food only — not for human consumption.",
    "Bones",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food", "Best Sellers"],
    "/images/beef-marrow-bones-for-dogs.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef Marrow Bones for Dogs | Pet Food Catalogue",
      seo_meta_description: "Beef Marrow Bones for Dogs in 2kg pack size for $10.00 AUD. Frozen raw beef bones. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Bones > Beef Marrow Bones for Dogs"
    }
  ),
  createProduct(
    "PRD-PET-009",
    "Beef Brisket Bones for Dogs",
    "pet-food",
    "Bones",
    "beef-brisket-bones-for-dogs",
    10.00,
    "2kg",
    "2kg",
    "per_pack",
    "Frozen 2kg raw beef brisket bones for dogs.",
    "Frozen raw beef brisket bones for dogs in a 2kg pack. Pet food only — not for human consumption.",
    "Bones",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food"],
    "/images/beef-brisket-bones-for-dogs.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef Brisket Bones for Dogs | Pet Food Catalogue",
      seo_meta_description: "Beef Brisket Bones for Dogs in 2kg pack size for $10.00 AUD. Frozen raw beef bones. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Bones > Beef Brisket Bones for Dogs"
    }
  ),
  createProduct(
    "PRD-PET-010",
    "Chicken Frames",
    "pet-food",
    "Bones",
    "chicken-frames",
    6.00,
    "2 frames",
    "2 frames",
    "per_pack",
    "Frozen pack of 2 raw chicken frames for pets.",
    "Frozen raw chicken frames (2 frames per pack). Pet food only — not for human consumption.",
    "Frames",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food", "Best Sellers"],
    "/images/chicken-frames.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken Frames | Pet Food Catalogue",
      seo_meta_description: "Chicken Frames (2 frames pack) for $6.00 AUD. Frozen raw chicken frames. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Bones > Chicken Frames"
    }
  ),
  createProduct(
    "PRD-PET-011",
    "Chicken Frames Bulk Box",
    "pet-food",
    "Bones",
    "chicken-frames-bulk-box",
    40.00,
    "10kg",
    "10kg",
    "per_box",
    "Frozen 10kg bulk box of raw chicken frames for pets.",
    "Bulk 10kg box of frozen raw chicken frames. Pet food only — not for human consumption.",
    "Frames",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Bulk Pet Food", "Frozen Pet Food"],
    "/images/chicken-frames-bulk-box.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken Frames Bulk Box | Pet Food Catalogue",
      seo_meta_description: "Chicken Frames Bulk Box (10kg) for $40.00 AUD. Frozen bulk raw chicken frames. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Bones > Chicken Frames Bulk Box"
    }
  ),
  createProduct(
    "PRD-PET-012",
    "Chicken Necks",
    "pet-food",
    "Bones",
    "chicken-necks",
    6.00,
    "1kg",
    "1kg",
    "per_pack",
    "Raw chicken necks for pets, 1kg frozen pack.",
    "Frozen raw chicken necks in a 1kg pack — a soft, edible-bone option raw feeders use to work bone content into a dog's diet. Pet food only — not for human consumption.",
    "Necks",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food"],
    "/images/chicken-necks.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken Necks | Pet Food Catalogue",
      seo_meta_description: "Chicken Necks, 1kg frozen pack, $6.00 AUD — a soft edible-bone option for working bone content into a raw diet. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Bones > Chicken Necks"
    }
  ),
  createProduct(
    "PRD-PET-013",
    "Chicken Feet",
    "pet-food",
    "Bones",
    "chicken-feet",
    6.00,
    "1kg",
    "1kg",
    "per_pack",
    "Raw chicken feet for pets, 1kg frozen pack.",
    "Frozen raw chicken feet in a 1kg pack — a natural, cartilage-rich chew popular with raw feeders for joint support. Pet food only — not for human consumption.",
    "Feet",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food"],
    "/images/chicken-feet.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken Feet | Pet Food Catalogue",
      seo_meta_description: "Chicken Feet, 1kg frozen pack, $6.00 AUD — a natural, cartilage-rich chew for joint support. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Bones > Chicken Feet"
    }
  ),
  createProduct(
    "PRD-PET-014",
    "Turkey Necks",
    "pet-food",
    "Bones",
    "turkey-necks",
    15.00,
    "4 pieces",
    "4 pieces",
    "per_pack",
    "Frozen pack of 4 raw turkey necks for pets.",
    "Frozen raw turkey necks (4 pieces per pack). Pet food only — not for human consumption.",
    "Necks",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food"],
    "/images/turkey-necks.webp",
    {
      storageType: "Frozen",
      animal_protein: "Turkey",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Turkey Necks | Pet Food Catalogue",
      seo_meta_description: "Turkey Necks (4 pieces pack) for $15.00 AUD. Frozen raw turkey necks. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Bones > Turkey Necks"
    }
  ),
  createProduct(
    "PRD-PET-015",
    "Kangaroo Tails",
    "pet-food",
    "Bones",
    "kangaroo-tails",
    13.00,
    "1kg",
    "1kg",
    "per_pack",
    "Raw kangaroo tails for pets, 1kg frozen pack.",
    "Frozen raw kangaroo tails in a 1kg pack — a long-lasting recreational chew that also works bone and cartilage into a raw diet. Pet food only — not for human consumption.",
    "Tails",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Bones", "Frozen Pet Food"],
    "/images/kangaroo-tails.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Kangaroo Tails | Pet Food Catalogue",
      seo_meta_description: "Kangaroo Tails, 1kg frozen pack, $13.00 AUD — a long-lasting recreational chew with bone and cartilage. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Bones > Kangaroo Tails"
    }
  ),

  // Offal (5 items)
  createProduct(
    "PRD-PET-016",
    "Beef Liver for Pets",
    "pet-food",
    "Offal",
    "beef-liver-for-pets",
    6.00,
    "250g",
    "250g",
    "per_pack",
    "Frozen 250g raw beef liver for pets.",
    "Frozen raw beef liver in a 250g pack. Pet food only — not for human consumption.",
    "Liver",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Offal", "Frozen Pet Food"],
    "/images/beef-liver-for-pets.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef Liver for Pets | Pet Food Catalogue",
      seo_meta_description: "Beef Liver for Pets in 250g pack size for $6.00 AUD. Frozen raw beef liver. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Offal > Beef Liver for Pets"
    }
  ),
  createProduct(
    "PRD-PET-017",
    "Beef Heart for Pets",
    "pet-food",
    "Offal",
    "beef-heart-for-pets",
    8.99,
    "500g",
    "500g",
    "per_pack",
    "Frozen 500g raw beef heart for pets.",
    "Frozen raw beef heart in a 500g pack. Pet food only — not for human consumption.",
    "Heart",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Offal", "Frozen Pet Food"],
    "/images/beef-heart-for-pets.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef Heart for Pets | Pet Food Catalogue",
      seo_meta_description: "Beef Heart for Pets in 500g pack size for $8.99 AUD. Frozen raw beef heart. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Offal > Beef Heart for Pets"
    }
  ),
  createProduct(
    "PRD-PET-018",
    "Beef Kidney for Pets",
    "pet-food",
    "Offal",
    "beef-kidney-for-pets",
    8.99,
    "500g",
    "500g",
    "per_pack",
    "Frozen 500g raw beef kidney for pets.",
    "Frozen raw beef kidney in a 500g pack. Pet food only — not for human consumption.",
    "Kidney",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Offal", "Frozen Pet Food"],
    "/images/beef-kidney-for-pets.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Beef Kidney for Pets | Pet Food Catalogue",
      seo_meta_description: "Beef Kidney for Pets in 500g pack size for $8.99 AUD. Frozen raw beef kidney. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Offal > Beef Kidney for Pets"
    }
  ),
  createProduct(
    "PRD-PET-019",
    "Mixed Beef Offal for Pets",
    "pet-food",
    "Offal",
    "mixed-beef-offal-for-pets",
    14.99,
    "1kg",
    "1kg",
    "per_pack",
    "Mixed raw beef offal for pets, 1kg frozen pack.",
    "A frozen 1kg mix of raw beef offal — heart, liver and kidney — giving pets the organ-meat variety a balanced raw diet needs, without buying each separately. Pet food only — not for human consumption.",
    "Mixed Offal",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Offal", "Frozen Pet Food"],
    "/images/mixed-beef-offal-for-pets.webp",
    {
      storageType: "Frozen",
      animal_protein: "Beef",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Mixed Beef Offal for Pets | Pet Food Catalogue",
      seo_meta_description: "Mixed Beef Offal for Pets, 1kg frozen pack, $14.99 AUD — heart, liver and kidney in one mix. Pet food only.",
      breadcrumb_path: "Home > Pet Food > Offal > Mixed Beef Offal for Pets"
    }
  ),
  createProduct(
    "PRD-PET-020",
    "Chicken Livers for Pets",
    "pet-food",
    "Offal",
    "chicken-livers-for-pets",
    6.99,
    "500g",
    "500g",
    "per_pack",
    "Frozen 500g raw chicken livers for pets.",
    "Frozen raw chicken livers in a 500g pack. Pet food only — not for human consumption.",
    "Liver",
    ["Pet Food Only — Serve According to Verified Supplier Instructions"],
    ["Frozen"],
    null,
    ["Offal", "Frozen Pet Food"],
    "/images/chicken-livers-for-pets.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      pet_food_only: true,
      human_consumption_warning: "Pet Food Only — Not for Human Consumption",
      seo_title: "Chicken Livers for Pets | Pet Food Catalogue",
      seo_meta_description: "Chicken Livers for Pets in 500g pack size for $6.99 AUD. Frozen raw chicken livers. Pet food only — not for human consumption.",
      breadcrumb_path: "Home > Pet Food > Offal > Chicken Livers for Pets"
    }
  ),

  // Pet Packs (4 items)
   // ==========================================
  // WHOLESALE — BULK MEAT ORDERS & ANIMAL SHARES (30 PRODUCTS)
  // ==========================================

  // --- 1. BULK BEEF (7 Products) ---
  // Product 1: Quarter Beef Share
  createProduct(
    "quarter-beef-share",
    "Quarter Beef Share",
    "Wholesale",
    "Bulk Beef",
    "quarter-beef-share",
    799.00,
    "Approximately 50kg",
    "Approximately 50kg",
    "fixed_pack_price",
    "Quarter Beef Share (approx. 50kg). Portioned beef cuts for family freezer storage.",
    "Quarter Beef Share (approximately 50kg). Portioned beef cuts packaged for family freezer storage. Final selection includes assorted steaks, roasts, mince, sausages, slow-cook cuts, ribs, and bones where available.",
    "Bulk Beef Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Beef"],
    "/images/quarter-beef-share.webp",
    {
      storageType: "To be confirmed",
      animal_protein: "Beef",
      is_animal_share: true,
      approximate_weight: "Approximately 50kg",
      product_contents: ["Steaks", "Roasts", "Mince", "Sausages", "Slow-cook cuts", "Ribs", "Bones", "Offal where available"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Quarter Beef Share | Bulk Beef Orders",
      seo_meta_description: "Quarter Beef Share (Approximately 50kg) for $799.00 AUD fixed pack price. Portioned beef cuts for family freezer storage.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Quarter Beef Share"
    }
  ),

  // Product 2: Half Beef Share
  createProduct(
    "half-beef-share",
    "Half Beef Share",
    "Wholesale",
    "Bulk Beef",
    "half-beef-share",
    1549.00,
    "Approximately 100kg",
    "Approximately 100kg",
    "fixed_pack_price",
    "Half Beef Share (approx. 100kg). High volume bulk beef cuts for chest freezers.",
    "Half Beef Share (approximately 100kg). High-volume bulk beef cuts prepared for chest freezers. Includes balanced forequarter and hindquarter cuts: premium steaks, hearty roasts, bulk mince, artisan sausages, slow-cook braises, ribs, and soup bones.",
    "Bulk Beef Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Beef"],
    "/images/half-beef-share.webp",
    {
      storageType: "To be confirmed",
      animal_protein: "Beef",
      is_animal_share: true,
      approximate_weight: "Approximately 100kg",
      product_contents: ["Steaks", "Roasts", "Mince", "Sausages", "Slow-cook cuts", "Ribs", "Bones", "Offal where available"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Beef Share | Bulk Beef Orders",
      seo_meta_description: "Half Beef Share (Approximately 100kg) for $1,549.00 AUD fixed pack price. High volume bulk beef cuts for chest freezers.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Half Beef Share"
    }
  ),

  // Product 3: Whole Beef Share (200kg)
  createProduct(
    "whole-beef-share-200kg",
    "Whole Beef Share",
    "Wholesale",
    "Bulk Beef",
    "whole-beef-share-200kg",
    3398.00,
    "Approximately 200kg",
    "Approximately 200kg",
    "fixed_pack_price",
    "Whole Beef Share (approx. 200kg). Full carcass butchered cuts for maximum volume.",
    "Whole Beef Share (approximately 200kg). Full carcass butchered cuts providing maximum volume and exceptional value per kilogram. Yields comprehensive cuts from prime steaks to slow-cooked cuts, roasts, mince, ribs, and bones.",
    "Bulk Beef Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Beef"],
    "/images/whole-beef-share-200kg.webp",
    {
      storageType: "To be confirmed",
      animal_protein: "Beef",
      is_animal_share: true,
      approximate_weight: "Approximately 200kg",
      product_contents: ["Steaks", "Roasts", "Mince", "Sausages", "Slow-cook cuts", "Ribs", "Bones", "Offal where available"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Beef Share (200kg) | Bulk Meat Orders",
      seo_meta_description: "Whole Beef Share (Approximately 200kg) for $3,398.00 AUD fixed pack price. Full carcass butchered cuts for maximum volume.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Whole Beef Share"
    }
  ),

  // Product 4: Whole Beef Share (250kg)
  createProduct(
    "whole-beef-share-250kg",
    "Whole Beef Share",
    "Wholesale",
    "Bulk Beef",
    "whole-beef-share-250kg",
    4247.50,
    "Approximately 250kg",
    "Approximately 250kg",
    "fixed_pack_price",
    "Whole Beef Share (approx. 250kg). Heavyweight full carcass beef share.",
    "Whole Beef Share (approximately 250kg). Heavyweight full carcass beef share offering comprehensive whole animal butchery yield for commercial kitchens, clubs, or extended family freezer sharing.",
    "Bulk Beef Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Beef"],
    "/images/whole-beef-share-250kg.webp",
    {
      storageType: "To be confirmed",
      animal_protein: "Beef",
      is_animal_share: true,
      approximate_weight: "Approximately 250kg",
      product_contents: ["Steaks", "Roasts", "Mince", "Sausages", "Slow-cook cuts", "Ribs", "Bones", "Offal where available"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Beef Share (250kg) | Bulk Meat Orders",
      seo_meta_description: "Whole Beef Share (Approximately 250kg) for $4,247.50 AUD fixed pack price. Heavyweight full carcass beef share.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Whole Beef Share"
    }
  ),

  // Product 5: Bulk Beef Mince Box (5kg)
  createProduct(
    "bulk-beef-mince-box-5kg",
    "Bulk Beef Mince Box",
    "Wholesale",
    "Bulk Beef",
    "bulk-beef-mince-box-5kg",
    74.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Beef Mince Box (5kg). Fresh chilled ground beef mince carton.",
    "Bulk Beef Mince Box (5kg). Fresh chilled ground beef mince supplied in a wholesale carton. Ideal for high-volume family meal preparation, bolognese, burgers, and meatballs.",
    "Bulk Beef Mince",
    ["Pan Fry", "Bake", "Slow Cook", "Grill"],
    ["Bulk Carton", "Ground Meat"],
    null,
    ["Bulk Meat Orders", "Bulk Beef", "Bulk Mince"],
    "/images/bulk-beef-mince-box-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Beef",
      approximate_weight: "5kg",
      seo_title: "Bulk Beef Mince Box (5kg) | Wholesale Meat Orders",
      seo_meta_description: "Bulk Beef Mince Box (5kg) for $74.95 AUD fixed pack price. Fresh chilled ground beef mince carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Bulk Beef Mince Box"
    }
  ),

  // Product 6: Bulk Beef Mince Box (10kg)
  createProduct(
    "bulk-beef-mince-box-10kg",
    "Bulk Beef Mince Box",
    "Wholesale",
    "Bulk Beef",
    "bulk-beef-mince-box-10kg",
    149.90,
    "10kg",
    "10kg",
    "fixed_pack_price",
    "Bulk Beef Mince Box (10kg). Commercial master carton of fresh chilled ground beef mince.",
    "Bulk Beef Mince Box (10kg). Master carton of fresh chilled ground beef mince. Perfectly proportioned for meal prep services, catering, foodservice, and large households.",
    "Bulk Beef Mince",
    ["Pan Fry", "Bake", "Slow Cook", "Grill"],
    ["Bulk Carton", "Ground Meat"],
    null,
    ["Bulk Meat Orders", "Bulk Beef", "Bulk Mince"],
    "/images/bulk-beef-mince-box-10kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Beef",
      approximate_weight: "10kg",
      seo_title: "Bulk Beef Mince Box (10kg) | Wholesale Meat Orders",
      seo_meta_description: "Bulk Beef Mince Box (10kg) for $149.90 AUD fixed pack price. Commercial master carton of fresh chilled ground beef mince.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Bulk Beef Mince Box"
    }
  ),

  // Product 7: Bulk Whole Rump
  createProduct(
    "bulk-whole-rump",
    "Bulk Whole Rump",
    "Wholesale",
    "Bulk Beef",
    "bulk-whole-rump",
    80.00,
    "Approximately 3kg to 4kg",
    "Approximately 3kg to 4kg",
    "fixed_pack_price",
    "Bulk Whole Rump (approx. 3kg to 4kg). Sub-primal whole beef cut.",
    "Bulk Whole Rump (approximately 3kg to 4kg). Whole sub-primal beef cut ready for portioning into your own thick steaks, tender stir-fry strips, roasts, or barbecue skewers.",
    "Bulk Beef Cut",
    ["Roast", "Grill", "Pan Fry"],
    ["Whole Sub-primal", "Bulk Cut"],
    null,
    ["Bulk Meat Orders", "Bulk Beef", "Bulk Cuts"],
    "/images/bulk-whole-rump.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Beef",
      approximate_weight: "Approximately 3kg to 4kg",
      seo_title: "Bulk Whole Rump | Bulk Beef Orders",
      seo_meta_description: "Bulk Whole Rump (Approximately 3kg to 4kg) for $80.00 AUD fixed pack price. Sub-primal whole beef cut.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Beef > Bulk Whole Rump"
    }
  ),

  // --- 1b. BULK WAGYU (F1 cross, 2 Products) ---
  createProduct(
    "bulk-wagyu-mince-box-5kg",
    "Bulk F1 Wagyu Mince Box",
    "Wholesale",
    "Bulk Wagyu",
    "bulk-wagyu-mince-box-5kg",
    119.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk F1 Wagyu Mince Box (5kg) — wholesale carton at a discount to our retail Wagyu mince rate.",
    "Bulk F1 Wagyu Mince Box (5kg). Fresh chilled F1 Wagyu-cross mince supplied in a wholesale carton, at a discount to the per-kg retail price. Suits restaurants, caterers and high-volume households wanting Wagyu richness in burgers, meatballs and bolognese without steak pricing.",
    "Bulk Beef Mince",
    ["Pan Fry", "Bake", "Slow Cook", "Grill"],
    ["Bulk Carton", "Ground Meat"],
    null,
    ["Bulk Meat Orders", "Bulk Wagyu", "Bulk Mince"],
    "/images/premium-beef-mince.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Beef",
      approximate_weight: "5kg",
      badge: "F1 Wagyu",
      seo_title: "Bulk F1 Wagyu Mince Box (5kg) | Wholesale Meat Orders",
      seo_meta_description: "Bulk F1 Wagyu Mince Box (5kg) for $119.95 AUD fixed pack price. Fresh chilled F1 Wagyu-cross mince carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Wagyu > Bulk F1 Wagyu Mince Box"
    }
  ),
  createProduct(
    "bulk-wagyu-whole-rump",
    "Bulk F1 Wagyu Whole Rump",
    "Wholesale",
    "Bulk Wagyu",
    "bulk-wagyu-whole-rump",
    159.00,
    "Approximately 3kg to 4kg",
    "Approximately 3kg to 4kg",
    "fixed_pack_price",
    "Bulk F1 Wagyu Whole Rump (approx. 3kg to 4kg) — sub-primal Wagyu-cross beef cut.",
    "Bulk F1 Wagyu Whole Rump (approximately 3kg to 4kg). Whole Wagyu-cross sub-primal ready for portioning into your own steaks, stir-fry strips or BBQ cuts — our lowest-priced entry into Wagyu at wholesale volume.",
    "Bulk Beef Cut",
    ["Roast", "Grill", "Pan Fry"],
    ["Whole Sub-primal", "Bulk Cut"],
    null,
    ["Bulk Meat Orders", "Bulk Wagyu", "Bulk Cuts"],
    "/images/wagyu-rump-steak.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Beef",
      approximate_weight: "Approximately 3kg to 4kg",
      badge: "F1 Wagyu",
      seo_title: "Bulk F1 Wagyu Whole Rump | Bulk Wagyu Orders",
      seo_meta_description: "Bulk F1 Wagyu Whole Rump (Approximately 3kg to 4kg) for $159.00 AUD fixed pack price. Sub-primal Wagyu-cross beef cut.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Wagyu > Bulk F1 Wagyu Whole Rump"
    }
  ),

  // --- 2. BULK LAMB (4 Products) ---
  // Product 8: Half Lamb Share
  createProduct(
    "half-lamb-share",
    "Half Lamb Share",
    "Wholesale",
    "Bulk Lamb",
    "half-lamb-share",
    250.00,
    "Approximately 12.5kg",
    "Approximately 12.5kg",
    "fixed_pack_price",
    "Half Lamb Share (approx. 12.5kg). Portioned lamb leg, chops, shanks, and shoulder cuts.",
    "Half Lamb Share (approximately 12.5kg). Portioned fresh chilled lamb carcass half. Includes leg roast, loin chops, BBQ chops, shanks, shoulder, ribs, and lamb mince.",
    "Bulk Lamb Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Lamb"],
    "/images/half-lamb-share.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Lamb",
      is_animal_share: true,
      approximate_weight: "Approximately 12.5kg",
      product_contents: ["Lamb leg", "Lamb loin chops", "Lamb BBQ chops", "Lamb shanks", "Lamb shoulder", "Lamb mince", "Lamb ribs"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Lamb Share | Bulk Lamb Orders",
      seo_meta_description: "Half Lamb Share (Approximately 12.5kg) for $250.00 AUD fixed pack price. Portioned lamb leg, chops, shanks, and shoulder cuts.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Lamb > Half Lamb Share"
    }
  ),

  // Product 9: Whole Lamb Share (12-13kg)
  createProduct(
    "whole-lamb-share",
    "Whole Lamb Share",
    "Wholesale",
    "Bulk Lamb",
    "whole-lamb-share",
    290.99,
    "Approximately 12kg to 13kg",
    "Approximately 12kg to 13kg",
    "from_price",
    "Whole Lamb Share (approx. 12kg to 13kg). Whole lamb carcass portioned for family freezer stocking.",
    "Whole Lamb Share (approximately 12kg to 13kg). Whole lamb carcass portioned into convenient cuts for family freezer stocking. Includes whole and half roasts, loin chops, forequarter chops, shanks, ribs, and mince.",
    "Bulk Lamb Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Lamb"],
    "/images/whole-lamb-share.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Lamb",
      is_animal_share: true,
      approximate_weight: "Approximately 12kg to 13kg",
      product_contents: ["Lamb leg", "Lamb loin chops", "Lamb BBQ chops", "Lamb shanks", "Lamb shoulder", "Lamb mince", "Lamb ribs"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Lamb Share (12-13kg) | Bulk Lamb Orders",
      seo_meta_description: "Whole Lamb Share (Approximately 12kg to 13kg) from $290.99 AUD. Whole lamb carcass portioned for family freezer stocking.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Lamb > Whole Lamb Share"
    }
  ),

  // Product 10: Whole Lamb Share (13-17kg)
  createProduct(
    "whole-lamb-share-13-17kg",
    "Whole Lamb Share",
    "Wholesale",
    "Bulk Lamb",
    "whole-lamb-share-13-17kg",
    310.99,
    "Approximately 13kg to 17kg",
    "Approximately 13kg to 17kg",
    "fixed_pack_price",
    "Whole Lamb Share (approx. 13kg to 17kg). Heavyweight whole lamb carcass portioned cuts.",
    "Whole Lamb Share (approximately 13kg to 17kg). Heavyweight whole lamb carcass butchered and portioned into vacuum-ready cuts. Features prime legs, tender loin chops, cutlets, shanks, shoulder roasts, and ribs.",
    "Bulk Lamb Share",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Lamb"],
    "/images/whole-lamb-share-13-17kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Lamb",
      is_animal_share: true,
      approximate_weight: "Approximately 13kg to 17kg",
      product_contents: ["Lamb leg", "Lamb loin chops", "Lamb BBQ chops", "Lamb shanks", "Lamb shoulder", "Lamb mince", "Lamb ribs"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Lamb Share (13-17kg) | Bulk Lamb Orders",
      seo_meta_description: "Whole Lamb Share (Approximately 13kg to 17kg) for $310.99 AUD fixed pack price. Heavyweight whole lamb carcass portioned cuts.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Lamb > Whole Lamb Share"
    }
  ),

  // Product 11: Bulk Lamb Variety Pack (6kg)
  createProduct(
    "bulk-lamb-variety-pack",
    "Bulk Lamb Variety Pack",
    "Wholesale",
    "Bulk Lamb",
    "bulk-lamb-variety-pack",
    135.50,
    "6kg",
    "6kg",
    "fixed_pack_price",
    "Bulk Lamb Variety Pack (6kg). Everyday lamb roasts, chops, ribs, and shanks.",
    "Bulk Lamb Variety Pack (6kg). A balanced selection of fresh chilled Australian lamb cuts including leg roasts, loin chops, BBQ chops, shanks, shoulder, and ribs.",
    "Bulk Lamb Pack",
    ["Roast", "Grill", "Slow Cook", "Pan Fry"],
    ["Bulk Carton", "Assorted Cuts"],
    null,
    ["Bulk Meat Orders", "Bulk Lamb", "Bulk Cuts"],
    "/images/bulk-lamb-variety-pack.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Lamb",
      approximate_weight: "6kg",
      product_contents: ["Lamb leg", "Lamb loin chops", "Lamb BBQ chops", "Lamb shanks", "Lamb shoulder", "Lamb mince", "Lamb ribs"],
      seo_title: "Bulk Lamb Variety Pack (6kg) | Bulk Lamb Orders",
      seo_meta_description: "Bulk Lamb Variety Pack (6kg) for $135.50 AUD fixed pack price. Everyday lamb roasts, chops, ribs, and shanks.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Lamb > Bulk Lamb Variety Pack"
    }
  ),

  // --- 3. BULK PORK (3 Products) ---
  // Product 12: Half Pork Share
  createProduct(
    "half-pork-share",
    "Half Pork Share",
    "Wholesale",
    "Bulk Pork",
    "half-pork-share",
    385.00,
    "Approximately 30kg to 35kg",
    "Approximately 30kg to 35kg",
    "fixed_pack_price",
    "Half Pork Share (approx. 30kg to 35kg). Portioned pork leg, chops, ribs, and belly.",
    "Half Pork Share (approximately 30kg to 35kg). Portioned fresh chilled pork carcass half. Includes roasting leg, loin chops, grilling chops, spare ribs, pork belly, and pickled pork cuts.",
    "Bulk Pork Share",
    ["Roast", "Grill", "Pan Fry", "Slow Cook"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Pork"],
    "/images/half-pork-share.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Pork",
      is_animal_share: true,
      approximate_weight: "Approximately 30kg to 35kg",
      product_contents: ["Pork leg", "Pork loin chops", "Pork grilling chops", "Pork spare ribs", "Pickled pork"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Pork Share | Bulk Pork Orders",
      seo_meta_description: "Half Pork Share (Approximately 30kg to 35kg) for $385.00 AUD fixed pack price. Portioned pork leg, chops, ribs, and belly.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Pork > Half Pork Share"
    }
  ),

  // Product 13: Bulk Pork Variety Pack (11kg)
  createProduct(
    "bulk-pork-variety-pack",
    "Bulk Pork Variety Pack",
    "Wholesale",
    "Bulk Pork",
    "bulk-pork-variety-pack",
    169.90,
    "11kg",
    "11kg",
    "fixed_pack_price",
    "Bulk Pork Variety Pack (11kg). Fresh chilled pork leg, chops, ribs, and roasts.",
    "Bulk Pork Variety Pack (11kg). Assorted carton of fresh chilled pork cuts including pork leg roasts, loin chops, grilling chops, spare ribs, and pickled pork cuts.",
    "Bulk Pork Pack",
    ["Roast", "Grill", "Pan Fry", "Slow Cook"],
    ["Bulk Carton", "Assorted Cuts"],
    null,
    ["Bulk Meat Orders", "Bulk Pork", "Bulk Cuts"],
    "/images/bulk-pork-variety-pack.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Pork",
      approximate_weight: "11kg",
      product_contents: ["Pork leg", "Pork loin chops", "Pork grilling chops", "Pork spare ribs", "Pickled pork"],
      seo_title: "Bulk Pork Variety Pack (11kg) | Bulk Pork Orders",
      seo_meta_description: "Bulk Pork Variety Pack (11kg) for $169.90 AUD fixed pack price. Fresh chilled pork leg, chops, ribs, and roasts.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Pork > Bulk Pork Variety Pack"
    }
  ),

  // Product 14: Bulk Pork Fillet (Min 500g)
  createProduct(
    "bulk-pork-fillet",
    "Bulk Pork Fillet",
    "Wholesale",
    "Bulk Pork",
    "bulk-pork-fillet",
    24.99,
    "Minimum 500g",
    "Minimum 500g",
    "per_kg",
    "Bulk Pork Fillet (min. 500g). Lean fresh chilled pork tenderloin fillet.",
    "Bulk Pork Fillet (minimum 500g). Exceptionally tender, lean, fresh chilled pork tenderloin fillets sold at a competitive per-kilogram rate for wholesale meal prep and catering.",
    "Pork Fillet",
    ["Pan Fry", "Roast", "Stir Fry"],
    ["Whole Fillet", "Lean Cut"],
    null,
    ["Bulk Meat Orders", "Bulk Pork", "Bulk Cuts"],
    "/images/bulk-pork-fillet.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Pork",
      approximate_weight: "Minimum 500g",
      seo_title: "Bulk Pork Fillet | Bulk Pork Orders",
      seo_meta_description: "Bulk Pork Fillet (Minimum 500g) for $24.99 AUD per kg. Lean fresh chilled pork tenderloin fillet.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Pork > Bulk Pork Fillet"
    }
  ),

  // --- 4. BULK CHICKEN (6 Products) ---
  // Product 15: Bulk Chicken Breast Fillets (2kg - $25.98)
  createProduct(
    "bulk-chicken-breast-fillets-2kg",
    "Bulk Chicken Breast Fillets",
    "Wholesale",
    "Bulk Chicken",
    "bulk-chicken-breast-fillets-2kg",
    25.98,
    "2kg",
    "2kg",
    "fixed_pack_price",
    "Bulk Chicken Breast Fillets (2kg). Fresh chilled boneless skinless chicken breast.",
    "Bulk Chicken Breast Fillets (2kg). Fresh chilled boneless, skinless Australian chicken breast fillets packed for bulk household convenience.",
    "Bulk Chicken",
    ["Pan Fry", "Bake", "Grill", "Stir Fry"],
    ["Bulk Pack", "Boneless"],
    null,
    ["Bulk Meat Orders", "Bulk Chicken", "Bulk Cuts"],
    "/images/bulk-chicken-breast-fillets-2kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Chicken",
      approximate_weight: "2kg",
      seo_title: "Bulk Chicken Breast Fillets (2kg) | Bulk Chicken Orders",
      seo_meta_description: "Bulk Chicken Breast Fillets (2kg) for $25.98 AUD fixed pack price. Fresh chilled boneless skinless chicken breast.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Chicken > Bulk Chicken Breast Fillets"
    }
  ),

  // Product 16: Bulk Chicken Breast Fillets (2kg Portion - $29.98)
  createProduct(
    "bulk-chicken-breast-fillets-2kg-portion",
    "Bulk Chicken Breast Fillets",
    "Wholesale",
    "Bulk Chicken",
    "bulk-chicken-breast-fillets-2kg-portion",
    29.98,
    "2kg",
    "2kg",
    "fixed_pack_price",
    "Bulk Chicken Breast Fillets (2kg). Fresh chilled trimmed chicken breasts.",
    "Bulk Chicken Breast Fillets (2kg). Premium trimmed, fresh chilled chicken breast fillets ready for high-protein meal prep, slicing, or grilling.",
    "Bulk Chicken",
    ["Pan Fry", "Bake", "Grill", "Stir Fry"],
    ["Bulk Pack", "Boneless"],
    null,
    ["Bulk Meat Orders", "Bulk Chicken", "Bulk Cuts"],
    "/images/bulk-chicken-breast-fillets-2kg-portion.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Chicken",
      approximate_weight: "2kg",
      seo_title: "Bulk Trimmed Chicken Breast Fillets (2kg) | Bulk Chicken Orders",
      seo_meta_description: "Bulk Chicken Breast Fillets (2kg) for $29.98 AUD fixed pack price. Fresh chilled trimmed chicken breasts.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Chicken > Bulk Chicken Breast Fillets"
    }
  ),

  // Product 17: Bulk Chicken Drumsticks (2kg - $15.98)
  createProduct(
    "bulk-chicken-drumsticks-2kg",
    "Bulk Chicken Drumsticks",
    "Wholesale",
    "Bulk Chicken",
    "bulk-chicken-drumsticks-2kg",
    15.98,
    "2kg",
    "2kg",
    "fixed_pack_price",
    "Bulk Chicken Drumsticks (2kg). Fresh chilled bone-in chicken drumsticks.",
    "Bulk Chicken Drumsticks (2kg). Fresh chilled Australian chicken drumsticks packed in a 2kg value bag. Ideal for baking, grilling, and family weeknight dinners.",
    "Bulk Chicken",
    ["Roast", "Bake", "Grill", "BBQ"],
    ["Bulk Pack", "Bone-In"],
    null,
    ["Bulk Meat Orders", "Bulk Chicken", "Bulk Cuts"],
    "/images/bulk-chicken-drumsticks-2kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Chicken",
      approximate_weight: "2kg",
      seo_title: "Bulk Chicken Drumsticks (2kg) | Bulk Chicken Orders",
      seo_meta_description: "Bulk Chicken Drumsticks (2kg) for $15.98 AUD fixed pack price. Fresh chilled bone-in chicken drumsticks.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Chicken > Bulk Chicken Drumsticks"
    }
  ),

  // Product 18: Bulk Chicken Breast Schnitzel Box (5kg - $99.00)
  createProduct(
    "bulk-chicken-breast-schnitzel-box-5kg",
    "Bulk Chicken Breast Schnitzel Box",
    "Wholesale",
    "Bulk Chicken",
    "bulk-chicken-breast-schnitzel-box-5kg",
    99.00,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Chicken Breast Schnitzel Box (5kg). Frozen crumbed chicken breast schnitzels.",
    "Bulk Chicken Breast Schnitzel Box (5kg). Frozen tender crumbed chicken breast schnitzels ready for shallow frying or baking. Ideal for canteens, catering, or bulk family freezer storage.",
    "Bulk Chicken Schnitzel",
    ["Pan Fry", "Bake", "Air Fry"],
    ["Bulk Carton", "Crumbed"],
    null,
    ["Bulk Meat Orders", "Bulk Chicken", "Bulk Carton"],
    "/images/bulk-chicken-breast-schnitzel-box-5kg.webp",
    {
      storageType: "Frozen",
      animal_protein: "Chicken",
      approximate_weight: "5kg",
      seo_title: "Bulk Chicken Breast Schnitzel Box (5kg) | Bulk Orders",
      seo_meta_description: "Bulk Chicken Breast Schnitzel Box (5kg) for $99.00 AUD fixed pack price. Frozen crumbed chicken breast schnitzels.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Chicken > Bulk Chicken Breast Schnitzel Box"
    }
  ),

  // Product 19: Bulk Chicken Thigh Fillets (5kg - $74.95)
  createProduct(
    "bulk-chicken-thigh-fillets-5kg",
    "Bulk Chicken Thigh Fillets",
    "Wholesale",
    "Bulk Chicken",
    "bulk-chicken-thigh-fillets-5kg",
    74.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Chicken Thigh Fillets (5kg). Fresh chilled boneless skinless chicken thighs.",
    "Bulk Chicken Thigh Fillets (5kg). Fresh chilled boneless skinless chicken thigh fillets packed in a 5kg commercial master bag. Perfect for curries, stir-fries, and barbecue skewers.",
    "Bulk Chicken",
    ["Pan Fry", "Bake", "Grill", "Curry", "BBQ"],
    ["Bulk Carton", "Boneless"],
    null,
    ["Bulk Meat Orders", "Bulk Chicken", "Bulk Cuts"],
    "/images/bulk-chicken-thigh-fillets-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Chicken",
      approximate_weight: "5kg",
      seo_title: "Bulk Chicken Thigh Fillets (5kg) | Bulk Chicken Orders",
      seo_meta_description: "Bulk Chicken Thigh Fillets (5kg) for $74.95 AUD fixed pack price. Fresh chilled boneless skinless chicken thighs.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Chicken > Bulk Chicken Thigh Fillets"
    }
  ),

  // Product 20: Bulk Chicken Wings (5kg - $35.00)
  createProduct(
    "bulk-chicken-wings-5kg",
    "Bulk Chicken Wings",
    "Wholesale",
    "Bulk Chicken",
    "bulk-chicken-wings-5kg",
    35.00,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Chicken Wings (5kg). Fresh chilled chicken wings carton.",
    "Bulk Chicken Wings (5kg). Fresh chilled 3-joint chicken wings packed in a 5kg wholesale carton. Excellent for buffalo wings, oven roasting, and smoking.",
    "Bulk Chicken",
    ["Roast", "Bake", "Grill", "BBQ", "Deep Fry"],
    ["Bulk Carton", "Bone-In"],
    null,
    ["Bulk Meat Orders", "Bulk Chicken", "Bulk Cuts"],
    "/images/bulk-chicken-wings-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Chicken",
      approximate_weight: "5kg",
      seo_title: "Bulk Chicken Wings (5kg) | Bulk Chicken Orders",
      seo_meta_description: "Bulk Chicken Wings (5kg) for $35.00 AUD fixed pack price. Fresh chilled chicken wings carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Chicken > Bulk Chicken Wings"
    }
  ),

  // --- 5. BULK GOAT (5 Products) ---
  // Product 21: Half Goat Share (~11kg - $282.15)
  createProduct(
    "bulk-goat-side",
    "Half Goat Share",
    "Wholesale",
    "Bulk Goat",
    "bulk-goat-side",
    282.15,
    "Approximately 11kg",
    "Approximately 11kg",
    "fixed_pack_price",
    "Half Goat Share (approx. 11kg). Half goat carcass portioned into legs, shoulder, ribs, and curry pieces.",
    "Half Goat Share (approximately 11kg). Half goat carcass portioned into primal cuts including leg roasts, shoulder, ribs, shanks, and diced bone-in curry pieces.",
    "Bulk Goat Share",
    ["Slow Cook", "Curry", "Roast", "Stew"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Goat"],
    "/images/bulk-goat-side.webp",
    {
      storageType: "To be confirmed",
      animal_protein: "Goat",
      is_animal_share: true,
      approximate_weight: "Approximately 11kg",
      product_contents: ["Goat leg", "Goat shoulder", "Goat shanks", "Goat ribs", "Goat curry pieces"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Goat Share (~11kg) | Bulk Goat Orders",
      seo_meta_description: "Half Goat Share (Approximately 11kg) for $282.15 AUD fixed pack price. Half goat carcass portioned into legs, shoulder, ribs, and curry pieces.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Goat > Half Goat Share"
    }
  ),

  // Product 22: Bulk Goat Curry Pieces (2.5kg - $42.48)
  createProduct(
    "bulk-goat-curry-pieces-2-5kg",
    "Bulk Goat Curry Pieces",
    "Wholesale",
    "Bulk Goat",
    "bulk-goat-curry-pieces-2-5kg",
    42.48,
    "2.5kg",
    "2.5kg",
    "fixed_pack_price",
    "Bulk Goat Curry Pieces (2.5kg). Bone-in fresh chilled diced goat pieces.",
    "Bulk Goat Curry Pieces (2.5kg). Bone-in fresh chilled diced goat pieces expertly chopped for authentic slow-cooked curries, stews, and biryanis.",
    "Bulk Goat",
    ["Slow Cook", "Curry", "Stew"],
    ["Bulk Pack", "Bone-In", "Diced"],
    null,
    ["Bulk Meat Orders", "Bulk Goat", "Bulk Cuts"],
    "/images/bulk-goat-curry-pieces-2-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Goat",
      approximate_weight: "2.5kg",
      seo_title: "Bulk Goat Curry Pieces (2.5kg) | Bulk Goat Orders",
      seo_meta_description: "Bulk Goat Curry Pieces (2.5kg) for $42.48 AUD fixed pack price. Bone-in fresh chilled diced goat pieces.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Goat > Bulk Goat Curry Pieces"
    }
  ),

  // Product 23: Bulk Goat Curry Pieces (5kg - $84.95)
  createProduct(
    "bulk-goat-curry-pieces-5kg",
    "Bulk Goat Curry Pieces",
    "Wholesale",
    "Bulk Goat",
    "bulk-goat-curry-pieces-5kg",
    84.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Goat Curry Pieces (5kg). Fresh chilled bone-in diced goat curry carton.",
    "Bulk Goat Curry Pieces (5kg). Master carton of fresh chilled bone-in diced goat pieces. Prepared for restaurant kitchens, catering events, and large gatherings.",
    "Bulk Goat",
    ["Slow Cook", "Curry", "Stew"],
    ["Bulk Carton", "Bone-In", "Diced"],
    null,
    ["Bulk Meat Orders", "Bulk Goat", "Bulk Cuts"],
    "/images/bulk-goat-curry-pieces-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Goat",
      approximate_weight: "5kg",
      seo_title: "Bulk Goat Curry Pieces (5kg) | Bulk Goat Orders",
      seo_meta_description: "Bulk Goat Curry Pieces (5kg) for $84.95 AUD fixed pack price. Fresh chilled bone-in diced goat curry carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Goat > Bulk Goat Curry Pieces"
    }
  ),

  // Product 24: Bulk Goat Ribs (~1kg - $17.99/kg)
  createProduct(
    "bulk-goat-ribs",
    "Bulk Goat Ribs",
    "Wholesale",
    "Bulk Goat",
    "bulk-goat-ribs",
    17.99,
    "Approximately 1kg",
    "Approximately 1kg",
    "per_kg",
    "Bulk Goat Ribs (approx. 1kg). Fresh chilled bone-in goat ribs.",
    "Bulk Goat Ribs (approximately 1kg). Fresh chilled bone-in goat ribs perfect for low-and-slow barbecue smoking, braising, or roasting with aromatic spices.",
    "Bulk Goat",
    ["Slow Cook", "BBQ", "Roast", "Braise"],
    ["Bone-In", "Bulk Ribs"],
    null,
    ["Bulk Meat Orders", "Bulk Goat", "Bulk Cuts"],
    "/images/bulk-goat-ribs.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Goat",
      approximate_weight: "Approximately 1kg",
      seo_title: "Bulk Goat Ribs | Bulk Goat Orders",
      seo_meta_description: "Bulk Goat Ribs (Approximately 1kg) for $17.99 AUD per kg. Fresh chilled bone-in goat ribs.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Goat > Bulk Goat Ribs"
    }
  ),

  // --- 6. BULK SAUSAGES (3 Products) ---
  // Product 25: Bulk Beef Sausages (5kg - $89.95)
  createProduct(
    "bulk-beef-sausages-5kg",
    "Bulk Beef Sausages",
    "Wholesale",
    "Bulk Sausages",
    "bulk-beef-sausages-5kg",
    89.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Beef Sausages (5kg). Fresh chilled classic butcher beef sausages.",
    "Bulk Beef Sausages (5kg). Fresh chilled traditional Aussie butcher beef sausages packed in a 5kg carton. Perfect for sausage sizzles, school fundraisers, and barbecue catering.",
    "Bulk Sausages",
    ["Grill", "BBQ", "Pan Fry"],
    ["Bulk Carton", "Fresh Sausages"],
    null,
    ["Bulk Meat Orders", "Bulk Sausages", "Bulk Cuts"],
    "/images/bulk-beef-sausages-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Sausages",
      approximate_weight: "5kg",
      seo_title: "Bulk Beef Sausages (5kg) | Bulk Sausage Orders",
      seo_meta_description: "Bulk Beef Sausages (5kg) for $89.95 AUD fixed pack price. Fresh chilled classic butcher beef sausages.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Sausages > Bulk Beef Sausages"
    }
  ),

  // Product 26: Bulk Beef Sausages (10kg - $179.90)
  createProduct(
    "bulk-beef-sausages-10kg",
    "Bulk Beef Sausages",
    "Wholesale",
    "Bulk Sausages",
    "bulk-beef-sausages-10kg",
    179.90,
    "10kg",
    "10kg",
    "fixed_pack_price",
    "Bulk Beef Sausages (10kg). Master carton of fresh chilled beef sausages.",
    "Bulk Beef Sausages (10kg). Master carton of fresh chilled classic butcher beef sausages. Designed for large community events, sporting clubs, food trucks, and caterers.",
    "Bulk Sausages",
    ["Grill", "BBQ", "Pan Fry"],
    ["Bulk Carton", "Fresh Sausages"],
    null,
    ["Bulk Meat Orders", "Bulk Sausages", "Bulk Cuts"],
    "/images/bulk-beef-sausages-10kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Sausages",
      approximate_weight: "10kg",
      seo_title: "Bulk Beef Sausages (10kg) | Bulk Sausage Orders",
      seo_meta_description: "Bulk Beef Sausages (10kg) for $179.90 AUD fixed pack price. Master carton of fresh chilled beef sausages.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Sausages > Bulk Beef Sausages"
    }
  ),

  // Product 27: Bulk Gourmet Sausages (5kg - $124.95)
  createProduct(
    "bulk-gourmet-sausages-5kg",
    "Bulk Gourmet Sausages",
    "Wholesale",
    "Bulk Sausages",
    "bulk-gourmet-sausages-5kg",
    124.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Gourmet Sausages (5kg). Fresh chilled handcrafted gourmet sausages.",
    "Bulk Gourmet Sausages (5kg). Handcrafted gourmet sausage links made with artisan seasonings, packed in a 5kg wholesale box for premium barbecue gatherings and bistro service.",
    "Bulk Gourmet Sausages",
    ["Grill", "BBQ", "Pan Fry"],
    ["Bulk Carton", "Gourmet Sausages"],
    null,
    ["Bulk Meat Orders", "Bulk Sausages", "Bulk Cuts"],
    "/images/bulk-gourmet-sausages-5kg.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Sausages",
      approximate_weight: "5kg",
      seo_title: "Bulk Gourmet Sausages (5kg) | Bulk Sausage Orders",
      seo_meta_description: "Bulk Gourmet Sausages (5kg) for $124.95 AUD fixed pack price. Fresh chilled handcrafted gourmet sausages.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Sausages > Bulk Gourmet Sausages"
    }
  ),

  // --- 7. BULK PORK (whole carcass share) ---
  createProduct(
    "whole-pork-share",
    "Whole Pork Share",
    "Wholesale",
    "Bulk Pork",
    "whole-pork-share",
    520.00,
    "Approximately 45kg",
    "Approximately 45kg",
    "fixed_pack_price",
    "Whole Pork Share (approx. 45kg). Full pork carcass portioned into roasts, belly, ribs, chops, and mince.",
    "Whole Pork Share (approximately 45kg). A full pork carcass broken down by our butchers into leg and shoulder roasts, pork belly, spare ribs, loin chops, and mince. Vacuum sealed and snap frozen in labelled family portions.",
    "Bulk Pork Share",
    ["Roast", "Slow Cook", "BBQ", "Pan-Fry"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Pork"],
    "/images/whole-pork-share.webp",
    {
      storageType: "Frozen",
      animal_protein: "Pork",
      is_animal_share: true,
      approximate_weight: "Approximately 45kg",
      product_contents: ["Pork leg roast", "Pork shoulder roast", "Pork belly", "Spare ribs", "Loin chops", "Pork mince"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Pork Share (~45kg) | Bulk Pork Orders",
      seo_meta_description: "Whole Pork Share (Approximately 45kg) for $520.00 AUD fixed pack price. Full pork carcass portioned into roasts, belly, ribs, chops, and mince.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Pork > Whole Pork Share"
    }
  ),

  // --- 8. BULK GOAT (whole carcass share) ---
  createProduct(
    "whole-goat-share",
    "Whole Goat Share",
    "Wholesale",
    "Bulk Goat",
    "whole-goat-share",
    540.00,
    "Approximately 22kg",
    "Approximately 22kg",
    "fixed_pack_price",
    "Whole Goat Share (approx. 22kg). Full goat carcass portioned into legs, shoulders, ribs, shanks, and curry pieces.",
    "Whole Goat Share (approximately 22kg). A full goat carcass portioned by our butchers into leg roasts, shoulders, ribs, shanks, and bone-in diced curry pieces. Ideal for large families, restaurants, and catering.",
    "Bulk Goat Share",
    ["Slow Cook", "Curry", "Roast", "Stew"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Goat"],
    "/images/whole-goat-share.webp",
    {
      storageType: "To be confirmed",
      animal_protein: "Goat",
      is_animal_share: true,
      approximate_weight: "Approximately 22kg",
      product_contents: ["Goat leg", "Goat shoulder", "Goat shanks", "Goat ribs", "Goat curry pieces"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Goat Share (~22kg) | Bulk Goat Orders",
      seo_meta_description: "Whole Goat Share (Approximately 22kg) for $540.00 AUD fixed pack price. Full goat carcass portioned into legs, shoulders, ribs, shanks, and curry pieces.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Goat > Whole Goat Share"
    }
  ),

  // --- 9. BULK VEAL (5 Products) ---
  createProduct(
    "half-veal-share",
    "Half Veal Share",
    "Wholesale",
    "Bulk Veal",
    "half-veal-share",
    260.00,
    "Approximately 14kg",
    "Approximately 14kg",
    "fixed_pack_price",
    "Half Veal Share (approx. 14kg). Half milk-fed veal carcass portioned into schnitzel, cutlets, roasts, osso buco, and mince.",
    "Half Veal Share (approximately 14kg). Half a milk-fed veal carcass broken down by our butchers into leg schnitzel, cutlets, shoulder roast, osso buco shanks, and mince. Vacuum sealed and snap frozen in labelled portions.",
    "Bulk Veal Share",
    ["Pan-Fry", "Slow Cook", "Braise", "Roast"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Veal"],
    "/images/half-veal-share.webp",
    {
      storageType: "Frozen",
      animal_protein: "Veal",
      is_animal_share: true,
      approximate_weight: "Approximately 14kg",
      product_contents: ["Veal schnitzel", "Veal cutlets", "Shoulder roast", "Osso buco", "Veal mince"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Veal Share (~14kg) | Bulk Veal Orders",
      seo_meta_description: "Half Veal Share (Approximately 14kg) for $260.00 AUD fixed pack price. Half milk-fed veal carcass portioned into schnitzel, cutlets, roasts, osso buco, and mince.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Veal > Half Veal Share"
    }
  ),
  createProduct(
    "whole-veal-share",
    "Whole Veal Share",
    "Wholesale",
    "Bulk Veal",
    "whole-veal-share",
    495.00,
    "Approximately 28kg",
    "Approximately 28kg",
    "fixed_pack_price",
    "Whole Veal Share (approx. 28kg). Full milk-fed veal carcass portioned into schnitzel, cutlets, roasts, osso buco, and mince.",
    "Whole Veal Share (approximately 28kg). A full milk-fed veal carcass portioned by our butchers into leg schnitzel, cutlets, rack, shoulder and leg roasts, osso buco shanks, and mince. Vacuum sealed and snap frozen in labelled portions.",
    "Bulk Veal Share",
    ["Pan-Fry", "Slow Cook", "Braise", "Roast"],
    ["Whole Carcass Share", "Assorted Portioned Cuts"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Veal"],
    "/images/whole-veal-share.webp",
    {
      storageType: "Frozen",
      animal_protein: "Veal",
      is_animal_share: true,
      approximate_weight: "Approximately 28kg",
      product_contents: ["Veal schnitzel", "Veal cutlets", "Veal rack", "Shoulder & leg roasts", "Osso buco", "Veal mince"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Veal Share (~28kg) | Bulk Veal Orders",
      seo_meta_description: "Whole Veal Share (Approximately 28kg) for $495.00 AUD fixed pack price. Full milk-fed veal carcass portioned into schnitzel, cutlets, roasts, osso buco, and mince.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Veal > Whole Veal Share"
    }
  ),
  createProduct(
    "bulk-veal-mince",
    "Bulk Veal Mince",
    "Wholesale",
    "Bulk Veal",
    "bulk-veal-mince",
    109.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Veal Mince (5kg). Fresh chilled premium veal mince carton.",
    "Bulk Veal Mince (5kg). Lean, delicately flavoured milk-fed veal mince packed in a 5kg wholesale carton for ragu, meatballs, and fine-dining service.",
    "Bulk Veal",
    ["Pan-Fry", "Slow Cook", "Pasta Sauce"],
    ["Bulk Carton", "Minced"],
    null,
    ["Bulk Meat Orders", "Bulk Veal", "Bulk Cuts"],
    "/images/veal-mince.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Veal",
      approximate_weight: "5kg",
      seo_title: "Bulk Veal Mince (5kg) | Bulk Veal Orders",
      seo_meta_description: "Bulk Veal Mince (5kg) for $109.95 AUD fixed pack price. Fresh chilled premium veal mince carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Veal > Bulk Veal Mince"
    }
  ),
  createProduct(
    "bulk-veal-schnitzel",
    "Bulk Veal Schnitzel",
    "Wholesale",
    "Bulk Veal",
    "bulk-veal-schnitzel",
    139.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Veal Schnitzel (5kg). Fresh chilled thinly sliced veal schnitzel carton.",
    "Bulk Veal Schnitzel (5kg). Thinly sliced, tenderised leg veal schnitzel steaks packed in a 5kg wholesale carton. Crumb in-house or pan-fry plain.",
    "Bulk Veal",
    ["Pan-Fry", "Oven", "Air Fryer"],
    ["Bulk Carton", "Thinly Sliced"],
    null,
    ["Bulk Meat Orders", "Bulk Veal", "Bulk Cuts"],
    "/images/veal-schnitzel.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Veal",
      approximate_weight: "5kg",
      seo_title: "Bulk Veal Schnitzel (5kg) | Bulk Veal Orders",
      seo_meta_description: "Bulk Veal Schnitzel (5kg) for $139.95 AUD fixed pack price. Fresh chilled thinly sliced veal schnitzel carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Veal > Bulk Veal Schnitzel"
    }
  ),
  createProduct(
    "bulk-diced-veal",
    "Bulk Diced Veal",
    "Wholesale",
    "Bulk Veal",
    "bulk-diced-veal",
    124.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Diced Veal (5kg). Fresh chilled diced veal shoulder carton.",
    "Bulk Diced Veal (5kg). Trimmed diced veal shoulder in a 5kg wholesale carton, cut for osso buco-style braises, blanquette, and slow-cooked casseroles.",
    "Bulk Veal",
    ["Slow Cook", "Braise", "Stew"],
    ["Bulk Carton", "Diced"],
    null,
    ["Bulk Meat Orders", "Bulk Veal", "Bulk Cuts"],
    "/images/veal-diced.webp",
    {
      storageType: "Fresh Chilled",
      animal_protein: "Veal",
      approximate_weight: "5kg",
      seo_title: "Bulk Diced Veal (5kg) | Bulk Veal Orders",
      seo_meta_description: "Bulk Diced Veal (5kg) for $124.95 AUD fixed pack price. Fresh chilled diced veal shoulder carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Veal > Bulk Diced Veal"
    }
  ),

  // --- 10. BULK KANGAROO (5 Products) ---
  createProduct(
    "half-kangaroo-share",
    "Half Kangaroo Share",
    "Wholesale",
    "Bulk Kangaroo",
    "half-kangaroo-share",
    159.00,
    "Approximately 10kg",
    "Approximately 10kg",
    "fixed_pack_price",
    "Half Kangaroo Share (approx. 10kg). Boned-out wild kangaroo portioned into fillets, steaks, diced, mince, and sausages.",
    "Half Kangaroo Share (approximately 10kg). Boned-out wild-harvested Australian kangaroo, portioned into rump fillets, leg steaks, diced, mince, and sausages. Snap frozen in labelled family portions.",
    "Bulk Kangaroo Share",
    ["BBQ", "Grill", "Pan-Fry", "Slow Cook"],
    ["Whole Carcass Share", "Assorted Portioned Cuts", "Frozen"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Kangaroo"],
    "/images/kangaroo-steaks.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      is_animal_share: true,
      approximate_weight: "Approximately 10kg",
      product_contents: ["Kangaroo fillets", "Leg steaks", "Diced kangaroo", "Kangaroo mince", "Kangaroo sausages"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Kangaroo Share (~10kg) | Bulk Kangaroo Orders",
      seo_meta_description: "Half Kangaroo Share (Approximately 10kg) for $159.00 AUD fixed pack price. Boned-out wild kangaroo portioned into fillets, steaks, diced, mince, and sausages.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Kangaroo > Half Kangaroo Share"
    }
  ),
  createProduct(
    "whole-kangaroo-share",
    "Whole Kangaroo Share",
    "Wholesale",
    "Bulk Kangaroo",
    "whole-kangaroo-share",
    299.00,
    "Approximately 20kg",
    "Approximately 20kg",
    "fixed_pack_price",
    "Whole Kangaroo Share (approx. 20kg). Boned-out wild kangaroo portioned into fillets, steaks, diced, mince, and sausages.",
    "Whole Kangaroo Share (approximately 20kg). A full boned-out wild-harvested Australian kangaroo, portioned into rump fillets, leg steaks, diced, mince, and sausages. Snap frozen in labelled family portions for lean high-protein eating.",
    "Bulk Kangaroo Share",
    ["BBQ", "Grill", "Pan-Fry", "Slow Cook"],
    ["Whole Carcass Share", "Assorted Portioned Cuts", "Frozen"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Kangaroo"],
    "/images/kangaroo-steaks.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      is_animal_share: true,
      approximate_weight: "Approximately 20kg",
      product_contents: ["Kangaroo fillets", "Leg steaks", "Diced kangaroo", "Kangaroo mince", "Kangaroo sausages"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Kangaroo Share (~20kg) | Bulk Kangaroo Orders",
      seo_meta_description: "Whole Kangaroo Share (Approximately 20kg) for $299.00 AUD fixed pack price. Boned-out wild kangaroo portioned into fillets, steaks, diced, mince, and sausages.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Kangaroo > Whole Kangaroo Share"
    }
  ),
  createProduct(
    "bulk-kangaroo-mince",
    "Bulk Kangaroo Mince",
    "Wholesale",
    "Bulk Kangaroo",
    "bulk-kangaroo-mince",
    74.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Kangaroo Mince (5kg). Frozen lean wild kangaroo mince carton.",
    "Bulk Kangaroo Mince (5kg). Ultra-lean, high-protein wild-harvested Australian kangaroo mince, snap frozen in a 5kg wholesale carton for meal-prep kitchens and pet-diet formulators.",
    "Bulk Kangaroo",
    ["Pan-Fry", "BBQ", "Pasta Sauce"],
    ["Bulk Carton", "Minced", "Frozen"],
    null,
    ["Bulk Meat Orders", "Bulk Kangaroo", "Bulk Cuts"],
    "/images/kangaroo-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      approximate_weight: "5kg",
      seo_title: "Bulk Kangaroo Mince (5kg) | Bulk Kangaroo Orders",
      seo_meta_description: "Bulk Kangaroo Mince (5kg) for $74.95 AUD fixed pack price. Frozen lean wild kangaroo mince carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Kangaroo > Bulk Kangaroo Mince"
    }
  ),
  createProduct(
    "bulk-kangaroo-fillets",
    "Bulk Kangaroo Fillets",
    "Wholesale",
    "Bulk Kangaroo",
    "bulk-kangaroo-fillets",
    109.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Kangaroo Fillets (5kg). Frozen wild kangaroo fillet (rump) carton.",
    "Bulk Kangaroo Fillets (5kg). Prime wild-harvested kangaroo fillets (rump), snap frozen in a 5kg wholesale carton. Best served rare to medium-rare over high heat.",
    "Bulk Kangaroo",
    ["BBQ", "Grill", "Pan-Fry"],
    ["Bulk Carton", "Frozen"],
    null,
    ["Bulk Meat Orders", "Bulk Kangaroo", "Bulk Cuts"],
    "/images/kangaroo-fillets.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      approximate_weight: "5kg",
      seo_title: "Bulk Kangaroo Fillets (5kg) | Bulk Kangaroo Orders",
      seo_meta_description: "Bulk Kangaroo Fillets (5kg) for $109.95 AUD fixed pack price. Frozen wild kangaroo fillet carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Kangaroo > Bulk Kangaroo Fillets"
    }
  ),
  createProduct(
    "bulk-kangaroo-sausages",
    "Bulk Kangaroo Sausages",
    "Wholesale",
    "Bulk Kangaroo",
    "bulk-kangaroo-sausages",
    84.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Kangaroo Sausages (5kg). Frozen lean kangaroo sausage carton.",
    "Bulk Kangaroo Sausages (5kg). Lean wild kangaroo sausages with a light seasoning blend, snap frozen in a 5kg wholesale carton for barbecue caterers and lean-diet menus.",
    "Bulk Kangaroo",
    ["Grill", "BBQ", "Pan-Fry"],
    ["Bulk Carton", "Frozen"],
    null,
    ["Bulk Meat Orders", "Bulk Kangaroo", "Bulk Cuts"],
    "/images/kangaroo-sausages.webp",
    {
      storageType: "Frozen",
      animal_protein: "Kangaroo",
      approximate_weight: "5kg",
      seo_title: "Bulk Kangaroo Sausages (5kg) | Bulk Kangaroo Orders",
      seo_meta_description: "Bulk Kangaroo Sausages (5kg) for $84.95 AUD fixed pack price. Frozen lean kangaroo sausage carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Kangaroo > Bulk Kangaroo Sausages"
    }
  ),

  // --- 11. BULK GAME (5 Products) ---
  createProduct(
    "half-venison-share",
    "Half Venison Share",
    "Wholesale",
    "Bulk Game",
    "half-venison-share",
    440.00,
    "Approximately 20kg",
    "Approximately 20kg",
    "fixed_pack_price",
    "Half Venison Share (approx. 20kg). Half farmed venison carcass portioned into backstrap, roasts, osso buco, diced, and mince.",
    "Half Venison Share (approximately 20kg). Half a farmed deer carcass broken down by our butchers into backstrap, leg and shoulder roasts, osso buco shanks, diced, and mince. Snap frozen in labelled portions for game menus.",
    "Bulk Game Share",
    ["BBQ", "Roast", "Slow Cook", "Braise"],
    ["Whole Carcass Share", "Assorted Portioned Cuts", "Frozen"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Game"],
    "/images/venison-backstrap.webp",
    {
      storageType: "Frozen",
      animal_protein: "Venison",
      is_animal_share: true,
      approximate_weight: "Approximately 20kg",
      product_contents: ["Venison backstrap", "Leg & shoulder roasts", "Osso buco", "Diced venison", "Venison mince"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Half Venison Share (~20kg) | Bulk Game Orders",
      seo_meta_description: "Half Venison Share (Approximately 20kg) for $440.00 AUD fixed pack price. Half farmed venison carcass portioned into backstrap, roasts, osso buco, diced, and mince.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Game > Half Venison Share"
    }
  ),
  createProduct(
    "whole-venison-share",
    "Whole Venison Share",
    "Wholesale",
    "Bulk Game",
    "whole-venison-share",
    835.00,
    "Approximately 40kg",
    "Approximately 40kg",
    "fixed_pack_price",
    "Whole Venison Share (approx. 40kg). Full farmed venison carcass portioned into backstrap, roasts, osso buco, diced, and mince.",
    "Whole Venison Share (approximately 40kg). A full farmed deer carcass portioned by our butchers into backstrap, rack, leg and shoulder roasts, osso buco shanks, diced, and mince. Snap frozen in labelled portions for restaurant game menus and stocked freezers.",
    "Bulk Game Share",
    ["BBQ", "Roast", "Slow Cook", "Braise"],
    ["Whole Carcass Share", "Assorted Portioned Cuts", "Frozen"],
    null,
    ["Bulk Meat Orders", "Animal Shares", "Bulk Game"],
    "/images/venison-backstrap.webp",
    {
      storageType: "Frozen",
      animal_protein: "Venison",
      is_animal_share: true,
      approximate_weight: "Approximately 40kg",
      product_contents: ["Venison backstrap", "Venison rack", "Leg & shoulder roasts", "Osso buco", "Diced venison", "Venison mince"],
      bulk_order_notice: "Weight is approximate and can vary by animal size, trimming, cut selection and processing yield. Please ensure you have sufficient freezer capacity before ordering.",
      seo_title: "Whole Venison Share (~40kg) | Bulk Game Orders",
      seo_meta_description: "Whole Venison Share (Approximately 40kg) for $835.00 AUD fixed pack price. Full farmed venison carcass portioned into backstrap, roasts, osso buco, diced, and mince.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Game > Whole Venison Share"
    }
  ),
  createProduct(
    "bulk-venison-mince",
    "Bulk Venison Mince",
    "Wholesale",
    "Bulk Game",
    "bulk-venison-mince",
    99.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Venison Mince (5kg). Frozen lean farmed venison mince carton.",
    "Bulk Venison Mince (5kg). Rich, lean farmed venison mince snap frozen in a 5kg wholesale carton for game ragu, sausage rolls, burgers, and terrines.",
    "Bulk Game",
    ["Pan-Fry", "Slow Cook", "Pasta Sauce"],
    ["Bulk Carton", "Minced", "Frozen"],
    null,
    ["Bulk Meat Orders", "Bulk Game", "Bulk Cuts"],
    "/images/venison-mince.webp",
    {
      storageType: "Frozen",
      animal_protein: "Venison",
      approximate_weight: "5kg",
      seo_title: "Bulk Venison Mince (5kg) | Bulk Game Orders",
      seo_meta_description: "Bulk Venison Mince (5kg) for $99.95 AUD fixed pack price. Frozen lean farmed venison mince carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Game > Bulk Venison Mince"
    }
  ),
  createProduct(
    "bulk-venison-osso-buco",
    "Bulk Venison Osso Buco",
    "Wholesale",
    "Bulk Game",
    "bulk-venison-osso-buco",
    134.95,
    "5kg",
    "5kg",
    "fixed_pack_price",
    "Bulk Venison Osso Buco (5kg). Frozen bone-in venison shank slices carton.",
    "Bulk Venison Osso Buco (5kg). Cross-cut bone-in farmed venison shank, snap frozen in a 5kg wholesale carton for long, red-wine braises and winter game menus.",
    "Bulk Game",
    ["Slow Cook", "Braise", "Stew"],
    ["Bulk Carton", "Bone-In", "Frozen"],
    null,
    ["Bulk Meat Orders", "Bulk Game", "Bulk Cuts"],
    "/images/venison-osso-buco.webp",
    {
      storageType: "Frozen",
      animal_protein: "Venison",
      approximate_weight: "5kg",
      seo_title: "Bulk Venison Osso Buco (5kg) | Bulk Game Orders",
      seo_meta_description: "Bulk Venison Osso Buco (5kg) for $134.95 AUD fixed pack price. Frozen bone-in venison shank slices carton.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Game > Bulk Venison Osso Buco"
    }
  ),
  createProduct(
    "bulk-game-meat-box",
    "Bulk Game Meat Box",
    "Wholesale",
    "Bulk Game",
    "bulk-game-meat-box",
    189.95,
    "Approximately 8kg",
    "Approximately 8kg",
    "fixed_pack_price",
    "Bulk Game Meat Box (approx. 8kg). Mixed frozen game selection — venison, kangaroo, and wild boar.",
    "Bulk Game Meat Box (approximately 8kg). A mixed wholesale selection of frozen game — venison backstrap and mince, kangaroo fillets, and wild boar — portioned and labelled for restaurant game menus and adventurous home cooks.",
    "Bulk Game",
    ["BBQ", "Slow Cook", "Roast", "Pan-Fry"],
    ["Bulk Box", "Assorted Portioned Cuts", "Frozen"],
    null,
    ["Bulk Meat Orders", "Bulk Game", "Bulk Cuts"],
    "/images/game-meat-selection-box.webp",
    {
      storageType: "Frozen",
      animal_protein: "Mixed Game",
      approximate_weight: "Approximately 8kg",
      product_contents: ["Venison backstrap", "Venison mince", "Kangaroo fillets", "Wild boar"],
      bulk_order_notice: "Contents and weight are approximate and vary with seasonal game availability.",
      seo_title: "Bulk Game Meat Box (~8kg) | Bulk Game Orders",
      seo_meta_description: "Bulk Game Meat Box (Approximately 8kg) for $189.95 AUD fixed pack price. Mixed frozen game selection of venison, kangaroo, and wild boar.",
      breadcrumb_path: "Home > Wholesale > Bulk Meat Orders > Bulk Game > Bulk Game Meat Box"
    }
  ),
];

export interface WholesaleSubcategory {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const WHOLESALE_BULK_SUBCATEGORIES: WholesaleSubcategory[] = [
  {
    slug: "bulk-beef",
    name: "Bulk Beef",
    description: "Quarter, half and whole beef carcass shares, bulk mince boxes and whole rump sub-primals. Angus and Angus-cross.",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bulk-wagyu",
    name: "Bulk Wagyu",
    description: "5kg F1 Wagyu mince cartons and whole Wagyu rump sub-primals at wholesale pricing.",
    image: "/images/wagyu-rump-steak.webp",
  },
  {
    slug: "bulk-lamb",
    name: "Bulk Lamb",
    description: "Half and whole lamb carcass shares, and bulk 6kg lamb variety packs.",
    image: "https://images.unsplash.com/photo-1602498456745-e9503b30470b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bulk-pork",
    name: "Bulk Pork",
    description: "Half and whole pork carcass shares, 11kg pork variety packs and whole pork fillets.",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bulk-chicken",
    name: "Bulk Chicken",
    description: "Bulk chicken breast fillets, drumsticks, thigh fillets, chicken wings and 5kg schnitzel cartons.",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bulk-goat",
    name: "Bulk Goat",
    description: "Half and whole goat carcass shares, 2.5kg and 5kg diced goat curry cartons, and bone-in goat ribs.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bulk-sausages",
    name: "Bulk Sausages",
    description: "5kg and 10kg cartons of butcher beef sausages and 5kg gourmet sausage links.",
    image: "https://images.unsplash.com/photo-1585325701165-351af916e581?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "bulk-veal",
    name: "Bulk Veal",
    description: "Half and whole rose veal carcass shares, plus 5kg cartons of veal mince, schnitzel, and diced veal.",
    image: "/images/veal-schnitzel.webp",
  },
  {
    slug: "bulk-kangaroo",
    name: "Bulk Kangaroo",
    description: "Half and whole boned-out kangaroo shares, plus 5kg frozen cartons of kangaroo mince, fillets, and sausages.",
    image: "/images/kangaroo-fillets.webp",
  },
  {
    slug: "bulk-game",
    name: "Bulk Game",
    description: "Half and whole farmed venison carcass shares, frozen venison mince and osso buco, plus mixed game boxes.",
    image: "/images/venison-backstrap.webp",
  },
];

export const POSTS: Post[] = [
  {
    slug: "beef-mince-fat-ratio-guide",
    title: "Beef Mince: Fat Ratios, Cuts & How to Buy It in Australia",
    excerpt: "What the fat ratio on beef mince actually means, which grind suits bolognese vs burgers vs meatballs, and how to buy beef mince online without overpaying.",
    category: "Meat Education",
    date: "2026-03-04",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/premium-beef-mince.webp",
    primaryKeyword: "beef mince fat ratio",
    seoTitle: "Beef Mince Fat Ratio: 80/20, Lean & How to Buy It",
    metaDescription: "Beef mince fat ratio explained — what 80/20, lean and extra-lean actually mean, which grind suits bolognese vs burgers vs meatballs, and how to buy beef mince online.",
    secondaryKeywords: ["lean beef mince", "beef mince fat ratio", "beef mince price per kg", "extra lean beef mince", "buy beef mince online"],
    content: `Beef mince is the most-cooked cut in the Australian kitchen, yet the label tells you almost nothing. "Regular", "premium", "lean", "extra lean" — none of it is regulated the way you'd expect. Here is what actually matters when you buy beef mince, and how to match the grind to the dish.

## What the fat ratio means

Fat ratio is written as lean-to-fat: **80/20** means 80% lean meat, 20% fat. At Mr Meat & Co every batch of [beef mince](/beef/mince-diced/) is labelled with its real ratio because it changes how the dish behaves:

- **90/10 – 95/5 (extra lean):** meatballs, koftas, meal-prep, anything simmered in sauce. Holds shape, low shrinkage, but can dry out if grilled.
- **80/20 (premium):** the all-rounder. Bolognese, cottage pie, tacos, san choy bau. Enough fat for flavour and moisture without a greasy pan.
- **75/25 – 70/30 (regular):** burgers and rissoles. That extra fat bastes the patty as it sears and keeps it juicy medium.

## Which cut is your mince ground from?

Cheap supermarket mince is trim — the offcuts left after primals are broken down, blended for a target fat percentage with added water and sometimes preservative. A butcher's mince is ground from named muscles:

- **Chuck** — the classic mince cut. Well-marbled, beefy, roughly 80/20 on its own.
- **Brisket / short rib blend** — the "smash burger" blend. Deep flavour, higher fat.
- **Rump or topside** — where lean and extra-lean mince comes from.

Ours is [ground fresh daily in Alexandria](/about/) with nothing added — no water, no fillers, no preservative.

## How much should beef mince cost?

As a rough guide for grass-fed butcher mince delivered in Sydney: premium 80/20 sits around \$16–20/kg, extra-lean around \$20–24/kg, and a Wagyu or dry-aged blend higher again. Buying a [5kg or 10kg bulk box](/wholesale/bulk-meat-orders/bulk-beef/) drops the per-kg price meaningfully if you have freezer space.

## Storing and freezing

Fresh mince keeps 2–3 days in the coldest part of the fridge. To freeze, portion into 500g flat packs (they thaw fast and stack well), press out the air, and use within 3 months. Thaw in the fridge overnight, never on the bench — mince has a huge surface area and warms dangerously quickly.

## The quick reference

| Dish | Ratio | Cut |
|---|---|---|
| Bolognese, chilli, tacos | 80/20 | Chuck |
| Burgers, rissoles | 70/30 | Chuck + brisket |
| Meatballs, kofta, meatloaf | 90/10 | Rump |
| Meal prep, bariatric, low-fat | 95/5 | Topside |

Ready to cook? Browse [fresh beef mince](/beef/mince-diced/) or build it into a [family meat box](/meat-boxes/family/).`,
    faqs: [
      { question: "What fat ratio is Mr Meat & Co beef mince?", answer: "Our premium beef mince is roughly 80/20 (80% lean), ground from chuck. Lean mince is about 90/10 and extra-lean around 95/5, ground from rump and topside. Every pack is labelled with its real ratio." },
      { question: "Is your beef mince ground fresh?", answer: "Yes. It's ground daily by our Alexandria butchers from whole muscle cuts, with no added water, fillers or preservative. Order by mid-morning for same-window Sydney delivery." },
      { question: "How much is beef mince per kg?", answer: "Grass-fed premium mince is around $16–20/kg delivered in Sydney; extra-lean sits higher. Bulk 5kg and 10kg boxes bring the per-kg price down — see our bulk beef page." },
      { question: "Can I buy beef mince in bulk?", answer: "Yes — 5kg and 10kg bulk beef mince boxes are available on our wholesale page, snap-frozen in 1kg portions, delivered across Sydney and Australia-wide for wholesale orders." },
    ],
    cta: { label: "Shop fresh beef mince →", href: "/beef/mince-diced/", note: "Grass-fed beef mince, ground fresh daily in Alexandria." },
  },
  {
    slug: "pork-mince-recipes-ideas",
    title: "10 Things to Make With Pork Mince (Beyond Bolognese)",
    excerpt: "Pork mince is cheaper than beef, cooks faster, and carries flavour beautifully. Ten fast dinners plus how to buy pork mince online in Australia.",
    category: "Recipes",
    date: "2026-03-18",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/premium-pork-mince.webp",
    primaryKeyword: "pork mince recipes",
    seoTitle: "Pork Mince Recipes: 10 Fast Dinners Beyond Bolognese",
    metaDescription: "Pork mince recipes for fast weeknight dinners — ten ideas beyond bolognese, why pork mince beats beef for speed and flavour, and how to buy it online in Australia.",
    secondaryKeywords: ["pork mince", "what to do with pork mince", "pork mince dinner", "lean pork mince", "buy pork mince online"],
    content: `[Pork mince](/pork/mince/) is one of the best-value proteins on the butcher's counter and it takes on marinades and aromatics far better than beef. If you only ever make bolognese with it, here are ten reasons to keep a pack in the fridge.

## Fast weeknight dinners

1. **San choy bau** — pork mince, garlic, ginger, water chestnuts, oyster and soy, spooned into iceberg cups. 12 minutes.
2. **Thai basil pork (pad krapow)** — high heat, fish sauce, chilli, a fried egg on top. The definitive 15-minute dinner.
3. **Pork and fennel ragu** — brown the mince hard, add fennel seed, white wine, milk and tomato, simmer 40 minutes. Pappardelle.
4. **Bao / steamed buns** — pork mince, hoisin, spring onion. Freeze the filling in portions.
5. **Larb** — Lao/Thai salad: pork mince cooked dry, toasted rice powder, lime, mint, shallot.
6. **Wontons and dumplings** — pork mince with cabbage and chives is the standard filling; make 100 and freeze on a tray.
7. **Meatballs in tomato** — pork mince stays more tender than beef; add fennel and parmesan for a porchetta note.
8. **Pork and prawn spring rolls** — a small amount of [prawn meat](/seafood/prawns/) folded through lifts the whole roll.
9. **Sausage rolls from scratch** — pork mince, breadcrumb, sage, nutmeg, wrapped in puff. Our [sausage roll guide](/blog/sausage-rolls-from-scratch/) has the full method.
10. **Pork burgers** — 80/20 pork mince, apple, sage; better than a beef burger on a lazy Sunday.

## Buying pork mince

Ask for **lean pork mince** (around 90/10) for stir-fries and dumplings where you don't want a greasy result, or standard mince for burgers and ragu. Ours is Australian, ground fresh, no fillers. You can [buy pork mince online](/pork/mince/) with the rest of your order, or grab a [bulk pack](/wholesale/bulk-meat-orders/bulk-pork/) if you batch-cook.

## Handling

Pork mince spoils a touch faster than beef — use within 2 days or freeze in flat 500g packs. Always cook pork mince through (no pink juices); it's quick, so it's rarely a problem.`,
    faqs: [
      { question: "What fat content is pork mince?", answer: "Standard Australian pork mince is around 80/20. Lean pork mince is closer to 90/10 and is the better choice for dumplings, san choy bau and stir-fries where you don't want fat pooling in the pan." },
      { question: "Is pork mince cheaper than beef mince?", answer: "Usually yes — pork mince typically sits a few dollars per kg below beef mince, which makes it a strong value protein for family dinners and batch cooking." },
      { question: "Can you freeze pork mince?", answer: "Yes. Portion it into flat 500g packs, press out the air and freeze for up to 3 months. Thaw in the fridge overnight and cook it through — never refreeze thawed raw mince." },
      { question: "Does pork mince need to be fully cooked?", answer: "Yes, cook pork mince until no pink remains and juices run clear (72°C). Because it's finely ground it cooks in minutes, so this is easy to hit without drying it out." },
    ],
    cta: { label: "Shop pork mince →", href: "/pork/mince/", note: "Australian pork mince, ground fresh — lean or standard." },
  },
  {
    slug: "chicken-schnitzel-method",
    title: "The Only Chicken Schnitzel Method You Need (Oven, Air-Fryer or Pan)",
    excerpt: "How to make a crunchy, even chicken schnitzel every time — the crumb, the pound, the fat, and the three cooking methods compared.",
    category: "Recipes",
    date: "2026-04-01",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/chicken-breast-schnitzel.webp",
    primaryKeyword: "chicken schnitzel recipe",
    seoTitle: "Chicken Schnitzel Recipe & Method (Oven, Air-Fryer, Pan)",
    metaDescription: "A chicken schnitzel recipe and method for a crunchy, even crust every time — the crumb, the pound, the fat, and the three cooking methods compared.",
    secondaryKeywords: ["chicken schnitzel", "homemade chicken schnitzel", "how to cook chicken schnitzel", "crumbed chicken", "gluten free schnitzel"],
    content: `A great [chicken schnitzel](/ready-to-cook/schnitzels/) is about three things: even thickness, a dry-then-wet-then-dry crumb, and enough hot fat. Get those right and the cooking method barely matters.

## The prep

1. **Butterfly and pound.** Slice a chicken breast in half horizontally, then pound each piece between baking paper to an even 1cm. Even thickness is the whole game — thin edges burn before a thick centre cooks.
2. **Season the meat, not just the crumb.** Salt the chicken 15 minutes ahead.
3. **Three-stage crumb.** Flour (shake off the excess) → beaten egg → breadcrumb. Panko gives the loudest crunch; a 50/50 panko and fine dry crumb gives a more traditional pub schnitzel. Press the crumb on firmly and rest the crumbed schnitzels on a rack for 10 minutes so the coating sets.

**Gluten-free:** swap the flour for rice flour or cornflour and use a [gluten-free crumb](/ready-to-cook/schnitzels/) — the method is identical.

## The three methods

**Pan-fry (best crunch).** 4–5mm of neutral oil in a wide pan over medium-high. 2–3 minutes a side until deep gold. Drain on a rack, not paper (paper steams the base soft). Internal temp 74°C.

**Oven (hands-off, for a crowd).** 220°C fan, schnitzels on a preheated oven tray with a light spray of oil both sides, 8 minutes, flip, 6–8 more. Not quite as crisp as the pan but you can do twelve at once.

**Air-fryer (fastest, least oil).** 200°C, spray both sides, 6 minutes, flip, 4–5 more. Excellent result for one or two; the basket limits batch size.

## Make it a parmigiana

Top the cooked schnitzel with [beef or pork ragu](/pork/mince/) or a quick napolitana, mozzarella and shaved ham, then grill until bubbling. Cook the schnitzel fully first — the grill is only there to melt the cheese.

## Buying vs crumbing your own

Our butchers crumb [chicken schnitzel](/ready-to-cook/schnitzels/) fresh daily — same three-stage method, ready to cook. We also do [beef schnitzel](/ready-to-cook/schnitzels/), pork and veal. If you want to crumb your own, start with [chicken breast fillets](/chicken/breast/).`,
    faqs: [
      { question: "How do you make chicken schnitzel crispy?", answer: "Pound the chicken to an even 1cm, use a three-stage flour-egg-crumb coating pressed on firmly, rest the crumbed schnitzels 10 minutes, then cook in 4–5mm of hot oil and drain on a rack rather than paper towel." },
      { question: "What's the best way to cook chicken schnitzel — oven, pan or air-fryer?", answer: "Pan-frying gives the best crunch. The air-fryer is fastest with the least oil and works well for one or two. The oven is best when you're cooking for a crowd — up to twelve at once at 220°C fan." },
      { question: "What internal temperature should chicken schnitzel reach?", answer: "74°C in the thickest part. A pounded 1cm schnitzel gets there in about 5–6 minutes total, so overcooking is the bigger risk than undercooking." },
      { question: "Can you make gluten-free chicken schnitzel?", answer: "Yes — replace the flour with rice flour or cornflour and use a gluten-free breadcrumb. The pound, coat, rest and cook steps are exactly the same. We also sell a ready-crumbed gluten-free chicken schnitzel." },
    ],
    cta: { label: "Shop crumbed schnitzels →", href: "/ready-to-cook/schnitzels/", note: "Chicken, beef, pork & veal schnitzel — crumbed fresh daily." },
  },
  {
    slug: "chicken-mince-weeknight-dinners",
    title: "Chicken Mince: 12 Fast Weeknight Dinners",
    excerpt: "Chicken mince is lean, quick and cheap. Twelve dinners on the table in under 30 minutes, plus how to stop chicken mince going dry.",
    category: "Recipes",
    date: "2026-04-15",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/chicken-mince.webp",
    primaryKeyword: "chicken mince recipes",
    seoTitle: "Chicken Mince Recipes: 12 Fast Weeknight Dinners",
    metaDescription: "Chicken mince recipes for fast weeknight dinners — twelve on the table in under 30 minutes, plus how to stop chicken mince going dry.",
    secondaryKeywords: ["chicken mince", "chicken mince dinner", "recipes using chicken mince", "lean chicken mince", "what to make with chicken mince"],
    content: `[Chicken mince](/chicken/mince/) is the leanest common mince, which is its strength and its weakness — it cooks in minutes but turns to sawdust if you push it. The fix is fat and moisture: a splash of oil, an aromatic paste, and a sauce it can finish in.

## 12 dinners under 30 minutes

1. **Chicken larb** — dry-fried mince, toasted rice powder, lime, fish sauce, herbs, in lettuce cups.
2. **Chicken and corn soup** — mince stirred into stock with creamed corn and egg ribbons.
3. **Thai basil chicken** — chilli, garlic, oyster sauce, basil, fried egg.
4. **Chicken bolognese** — lighter than beef; good with pappardelle and lots of parmesan.
5. **Chicken meatballs** — bind with grated zucchini and ricotta so they stay moist; bake and drop into tomato or broth.
6. **San choy bau** — the chicken version, with water chestnut and hoisin.
7. **Chicken kofta** — mince with garlic, cumin, coriander, mint; grill on skewers ([kebab skewers here](/bbq-grill/skewers/)).
8. **Chicken burgers** — add grated apple or onion for moisture; 74°C internal.
9. **Chicken taco filling** — mince with chipotle, lime, a little stock to keep it saucy.
10. **Chicken and vegetable dumplings** — freeze a batch on a tray.
11. **Chicken ragu pasta bake** — mince, béchamel, penne, cheese, 20 minutes in the oven.
12. **Chicken rissoles** — mince, breadcrumb, egg, herbs; pan-fry and serve with mash.

## Stop it drying out

- Don't buy the leanest grind for burgers and meatballs — ask for **chicken thigh mince** (around 85/15) instead of breast mince (95/5).
- Add a wet binder: grated vegetable, ricotta, an egg, or a spoon of yoghurt.
- Take it off the heat the moment it's cooked through. Carryover finishes it.

## Buying chicken mince

We grind [chicken mince](/chicken/mince/) fresh from Australian free-range birds — breast mince for the leanest option, thigh mince where you want more moisture and flavour. Lean chicken mince is also the base of our [raw pet mince range](/pet-food/raw-mince/) for dogs on a poultry diet.`,
    faqs: [
      { question: "Why does chicken mince go dry?", answer: "Breast mince is around 95% lean, so there's almost no fat to keep it moist, and it overcooks in seconds. Use thigh mince for burgers and meatballs, add a wet binder like grated zucchini or ricotta, and pull it off the heat as soon as it's cooked through." },
      { question: "Is chicken mince healthy?", answer: "Chicken breast mince is one of the leanest minces available — high protein, low fat. Thigh mince has more fat and flavour but is still leaner than most beef or pork mince." },
      { question: "What's the difference between chicken breast mince and thigh mince?", answer: "Breast mince (about 95/5) is very lean and pale — best for soups, larb and meal prep. Thigh mince (about 85/15) is darker, richer and more forgiving — better for burgers, koftas and meatballs." },
      { question: "Can you freeze chicken mince?", answer: "Yes, in flat 500g portions for up to 3 months. Thaw in the fridge and always cook chicken mince through to 74°C." },
    ],
    cta: { label: "Shop chicken mince →", href: "/chicken/mince/", note: "Free-range chicken mince — breast or thigh, ground fresh." },
  },
  {
    slug: "how-to-cook-lamb-chops",
    title: "How to Cook Lamb Chops: Grill, Pan & Oven Times",
    excerpt: "Loin, forequarter, chump and cutlet — which lamb chop suits which method, plus exact times and temperatures for pink, tender chops.",
    category: "Recipes",
    date: "2026-05-06",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/lamb-loin-chops.webp",
    primaryKeyword: "how to cook lamb chops",
    metaDescription: "How to cook lamb chops — loin, forequarter, chump and cutlet, which cut suits which method, plus exact times and temperatures for pink, tender chops.",
    secondaryKeywords: ["lamb chops recipe", "lamb chops in oven", "best way to cook lamb chops", "lamb cutlets", "grilled lamb chops"],
    content: `Not all [lamb chops](/lamb/chops-cutlets/) are the same cut, and that's why recipes disagree. Match the chop to the method and they're a 10-minute dinner.

## Know your chop

- **Cutlet** — from the rack. Small, lean, a long clean bone. Fast, high heat only. 90 seconds to 2 minutes a side.
- **Loin chop (mini T-bone)** — tender eye plus a strip of belly. The all-rounder. Grill or pan, 2–3 minutes a side.
- **Chump chop** — from the rump end. Bigger, meatier, a little more work. Grill hot then rest, or braise.
- **Forequarter / BBQ chop** — from the shoulder. Fattier, more connective tissue, cheapest. Rewards a lower-and-slower approach or a marinade.

## The method (loin chops and cutlets)

1. **Temper.** Out of the fridge 20–30 minutes. Pat dry.
2. **Season.** Salt generously, a little oil.
3. **Sear.** Heavy pan or grill on high. Stand the chops on their fat edge first for a minute to render, then flat.
4. **Times for a 2–2.5cm loin chop:**
   - Rare 50°C — ~2 min/side
   - Medium-rare 55–57°C — ~2.5 min/side
   - Medium 60°C — ~3 min/side
5. **Rest** 5 minutes, loosely covered. This is not optional — resting lamb is the difference between juicy and grey.

## In the oven

For forequarter chops or a big batch: brown in a pan, then 180°C for 8–12 minutes to a medium finish, or 160°C for 25–30 minutes if you want them falling-apart. A quick marinade — garlic, rosemary, lemon, olive oil, 2 hours — transforms the cheaper chops.

## Buying

For a fast weeknight grill, choose [loin chops or cutlets](/lamb/chops-cutlets/). For a slow-cooked, budget-friendly tray, choose [forequarter chops or lamb shoulder](/lamb/slow-cook/). All our lamb is Australian grass-fed. Feeding a crowd? A [lamb BBQ pack](/bbq-grill/) or a [whole lamb share](/wholesale/bulk-meat-orders/bulk-lamb/) works out cheaper per kilo.`,
    faqs: [
      { question: "What's the best way to cook lamb chops?", answer: "For loin chops and cutlets: high heat, render the fat edge first, then 2–3 minutes a side to medium-rare (55–57°C) and rest 5 minutes. For forequarter chops, marinate and either grill hot or braise low in the oven." },
      { question: "How long do you cook lamb chops in the oven?", answer: "Brown them in a pan first, then 180°C for 8–12 minutes for a medium finish, or 160°C for 25–30 minutes for tender, well-done forequarter chops." },
      { question: "What temperature should lamb chops be?", answer: "50°C for rare, 55–57°C for medium-rare (the sweet spot for loin chops and cutlets), 60°C for medium. Always rest 5 minutes — the temperature climbs another 2–3°C." },
      { question: "What's the difference between a lamb chop and a cutlet?", answer: "A cutlet comes from the rack — small, lean, with a long frenched bone. A loin chop is a mini T-bone with a tender eye and a strip of belly fat. Chump chops come from the rump and are larger and meatier." },
    ],
    cta: { label: "Shop lamb chops & cutlets →", href: "/lamb/chops-cutlets/", note: "Australian grass-fed lamb — loin chops, cutlets, chump & forequarter." },
  },
  {
    slug: "homemade-burger-patty",
    title: "The Ultimate Homemade Burger Patty (Ratio, Bind, Sear)",
    excerpt: "The fat ratio, why you shouldn't add egg or breadcrumb, the dimple trick, and how to buy burger patties or the right mince to make your own.",
    category: "Recipes",
    date: "2026-05-20",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/premium-beef-burger-patties.webp",
    primaryKeyword: "burger patty recipe",
    seoTitle: "Homemade Burger Patty Recipe (Ratio, Bind, Sear)",
    metaDescription: "A homemade burger patty recipe that holds together — the fat ratio, why to skip egg and breadcrumb, the dimple trick, and the mince to ask your butcher for.",
    secondaryKeywords: ["homemade burger patties", "best burger patty recipe", "beef burger patties", "burger patty ratio", "how to make burger patties"],
    content: `A pub burger patty and a rissole are not the same thing. A rissole has egg, breadcrumb and herbs and holds together softly. A burger patty is just seasoned beef and fat, seared hard. Here's the burger.

## The ratio

**70/30 or 75/25.** That much fat sounds like a lot until you realise most of it renders out in the pan and bastes the patty as it cooks. Leaner than 80/20 and you get a dry, tight burger. [Chuck mince](/beef/mince-diced/) is naturally close to the mark; a chuck-and-brisket blend is the steakhouse standard.

## The build

1. **Handle it as little as possible.** Overworked mince goes dense and springy. Divide, gently form, stop.
2. **No egg, no breadcrumb, no onion in the mix.** Season the outside only, with salt, just before it hits the pan — salt in the mix dissolves the protein and makes it bouncy.
3. **Size:** 150–180g per patty, pressed wider than your bun (it shrinks and puffs).
4. **The dimple.** Press a thumb-deep well in the centre of each raw patty. It stops the patty doming into a meatball as it cooks.

## The cook

- **Smash burger:** thin ball of mince onto a screaming-hot flat pan, smash flat for 30 seconds, flip once, cheese, done in 2 minutes. Maximum crust.
- **Pub patty:** 2–2.5cm patty, high heat, 3 minutes a side for medium (65°C), rest 3 minutes.

Don't press the patty while it cooks — you're squeezing out the juice you paid for.

## Buying

We make [beef burger patties](/bbq-grill/burgers/) from the same chuck blend — plus [lamb, chicken and pork patties](/ready-to-cook/burger-patties/) and a Wagyu patty. If you'd rather form your own, buy [premium beef mince](/beef/mince-diced/) at 80/20 or ask the butcher for a burger blend. For a party, the [BBQ meat pack](/bbq-grill/) bundles patties, sausages and buns' worth of everything.`,
    faqs: [
      { question: "What is the best fat ratio for burger patties?", answer: "70/30 to 75/25. Most of that fat renders out during the sear and bastes the patty. Anything leaner than 80/20 gives a dry, tight burger. Chuck mince, or a chuck-and-brisket blend, hits it naturally." },
      { question: "Should you put egg and breadcrumb in burger patties?", answer: "No — that makes a rissole, not a burger. A burger patty is just mince and fat, formed gently and seasoned on the outside only, right before it cooks. Salt in the mix makes the patty bouncy." },
      { question: "Why put a dimple in a burger patty?", answer: "A thumb-deep well in the centre of the raw patty stops it doming into a ball as the proteins contract. The patty cooks flat and sits properly in the bun." },
      { question: "How long do you cook a burger patty?", answer: "A 2–2.5cm pub patty: 3 minutes a side over high heat for medium (65°C), then rest 3 minutes. A smashed patty: 30 seconds under the press, flip once, done in about 2 minutes total." },
    ],
    cta: { label: "Shop burger patties →", href: "/bbq-grill/burgers/", note: "Beef, lamb, chicken, pork & Wagyu patties — no fillers." },
  },
  {
    slug: "lamb-ribs-low-and-slow",
    title: "Low-and-Slow Lamb Ribs (Australian Cut Guide + Recipe)",
    excerpt: "Lamb ribs vs lamb breast, how to render the fat, and a foolproof oven or BBQ method for sticky, tender lamb ribs.",
    category: "Recipes",
    date: "2026-06-03",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/lamb-ribs.webp",
    primaryKeyword: "lamb ribs recipe",
    seoTitle: "Lamb Ribs Recipe: Low-and-Slow (Oven or BBQ)",
    metaDescription: "A lamb ribs recipe for sticky, tender results — lamb ribs vs breast, how to render the fat, and a foolproof low-and-slow oven or BBQ method.",
    secondaryKeywords: ["lamb ribs", "lamb spare ribs", "lamb breast", "how to cook lamb ribs", "bbq lamb ribs"],
    content: `[Lamb ribs](/lamb/slow-cook/) are one of the best-value cuts in the shop and one of the most underused. They are fatty, gelatinous and cheap — everything you want for low-and-slow.

## Lamb ribs vs lamb breast

They're the same part of the animal. **Lamb breast** is the whole flap; **lamb ribs** (or lamb spare ribs) are the breast cut into individual bones or a rack. If you buy a whole breast, score the fat cap in a diamond pattern before cooking.

The catch: lamb ribs are **very fatty**. The technique is all about rendering that fat so what's left is meltingly tender meat and crisp edges, not a greasy tray.

## The method

**Oven (reliable):**
1. Season the ribs — salt, pepper, a little cumin and garlic. Or a Chinese five-spice and soy marinade.
2. 160°C, ribs on a rack over a tray so the fat drips away, 1.5–2 hours until the meat pulls back from the bone.
3. Drain the tray. Brush with a glaze — honey and soy, or a quick BBQ sauce.
4. 220°C for 10–15 minutes to lacquer and crisp. Watch it; the sugar burns fast.

**BBQ (better):** indirect heat, 130–150°C, 2.5–3 hours, glaze in the last 20 minutes over direct heat.

## Serve

Sticky lamb ribs want something sharp alongside — a slaw with rice vinegar, pickled onion, or a herby yoghurt. Cut between the bones only after they've rested 10 minutes.

## Buying

Our [lamb ribs](/lamb/slow-cook/) are Australian grass-fed, sold as racks or portioned. If you're doing a big BBQ, the [BBQ ribs section](/bbq-grill/ribs/) also has beef ribs and pork ribs, and a [half or whole lamb share](/wholesale/bulk-meat-orders/bulk-lamb/) gives you the ribs plus every other cut at a bulk price.`,
    faqs: [
      { question: "Are lamb ribs and lamb breast the same?", answer: "They come from the same part of the animal. Lamb breast is the whole flap; lamb ribs (or lamb spare ribs) are that breast cut into individual bones or a rack. Lamb ribs are naturally very fatty, so the cooking is about rendering that fat slowly." },
      { question: "How long do you cook lamb ribs?", answer: "In the oven: 160°C for 1.5–2 hours on a rack so the fat drips away, then a hot glaze for 10–15 minutes at 220°C. On the BBQ: indirect at 130–150°C for 2.5–3 hours." },
      { question: "Why are my lamb ribs greasy?", answer: "The fat hasn't rendered enough, or it pooled in the tray. Cook the ribs on a rack over a drip tray, give them the full low-and-slow time, and drain the tray before you glaze and crisp them." },
      { question: "Are lamb ribs a cheap cut?", answer: "Yes — lamb ribs are one of the best-value cuts in the shop. They're fatty and full of connective tissue, which is exactly what you want for a low-and-slow cook, and they cost a fraction of chops or a rack." },
    ],
    cta: { label: "Shop lamb for slow cooking →", href: "/lamb/slow-cook/", note: "Lamb ribs, shanks, neck & shoulder — grass-fed, built for the braise." },
  },
  {
    slug: "kangaroo-meat-buyers-guide",
    title: "Kangaroo Meat: The Complete Australian Buyer's Guide",
    excerpt: "Is kangaroo meat healthy? How much does it cost? Is it sustainable? Everything Australians ask before buying kangaroo — and how to cook it without it going tough.",
    category: "Meat Education",
    date: "2026-06-17",
    updated: "2026-09-02",
    readTime: "9 min read",
    image: "/images/categories/specialty-meat.webp",
    primaryKeyword: "kangaroo meat",
    secondaryKeywords: ["is kangaroo meat healthy", "kangaroo meat price", "is kangaroo cheaper than beef", "how to cook kangaroo", "kangaroo meat for dogs", "buy kangaroo meat"],
    content: `Kangaroo is the only large animal Australians eat that is wild-harvested rather than farmed, and it's one of the leanest red meats on earth. Here are straight answers to the questions people actually search before they [buy kangaroo meat](/specialty-meat/kangaroo/).

## Is kangaroo meat healthy?

Yes, on most measures it's exceptional. Kangaroo is:

- **Very lean** — typically under 2% fat, versus 10–20% for most beef cuts.
- **High protein** — around 22g per 100g.
- **High in iron and zinc** — more iron per serve than beef.
- **A natural source of conjugated linoleic acid (CLA)** — because the animals graze on native pasture their whole lives.

The trade-off is that "very lean" means "easy to overcook". More on that below.

## How much does kangaroo meat cost?

Kangaroo generally sits **below premium beef and roughly level with mid-range beef** per kilo. Kangaroo mince and diced are the best value; fillet (rump) is the premium cut and still usually cheaper than a beef eye fillet. See current pricing on our [kangaroo range](/specialty-meat/kangaroo/) or, for volume, the [bulk kangaroo page](/wholesale/bulk-meat-orders/bulk-kangaroo/).

## Is kangaroo cheaper than beef?

Cut for cut, usually yes — especially mince, sausages and diced. Whole-animal economics help: kangaroo isn't raised, fed, watered or housed, so the input cost is lower.

## Is kangaroo meat sustainable and ethical?

Kangaroo harvesting is a government-regulated wild harvest with annual quotas set below population growth. The animals live wild with no feedlot, no land clearing and no methane-intensive farming footprint. Many environmental scientists consider well-managed kangaroo harvest one of the lowest-impact red meats available. As with any meat, sourcing from a licensed processor matters — ours is.

## How do you cook kangaroo so it isn't tough?

The number one rule: **cook it rare to medium-rare, and rest it.** With almost no fat, kangaroo has nothing to protect it past medium — it goes from tender to liver-textured very quickly.

- **Steaks and fillet:** screaming hot pan or grill, 2 minutes a side max for a 2cm steak, target 52–55°C, rest 5 minutes.
- **Mince:** treat like very lean beef — plenty of oil, aromatics, and a sauce to finish in. Great for chilli, ragu and rissoles.
- **Diced:** low-and-slow only — a 2-hour curry or stew, where the collagen has time to soften.
- **Sausages:** medium heat, don't chase colour.

A marinade with a little oil (olive, sesame) genuinely helps — it replaces the fat the meat doesn't have.

## Does kangaroo taste gamey?

Mildly. It's a clean, iron-rich, slightly sweet flavour — closer to a good grass-fed beef than to venison. A red-wine or juniper marinade leans into it; a soy-ginger or chimichurri approach softens it.

## Can dogs eat kangaroo meat?

Yes — kangaroo is a popular **novel protein for dogs with allergies** to chicken or beef, and it's very lean. We sell [kangaroo pet mince and bulk kangaroo for dogs](/pet-food/raw-mince/) separately from the human range. Feed it as part of a balanced raw diet, not as the whole meal.

## Quick reference

| Cut | Method | Target temp / time |
|---|---|---|
| Fillet / rump steak | Hot sear | 52–55°C, ~2 min/side, rest 5 min |
| Mince | Pan-fry with oil + sauce | Cooked through, don't dry out |
| Diced | Slow braise / curry | 2 hours+ |
| Sausages | Medium heat | Cooked through |

Browse the full [kangaroo range](/specialty-meat/kangaroo/) — steaks, mince, sausages and fillet, delivered across Sydney and Australia-wide.`,
    faqs: [
      { question: "Is kangaroo meat healthy?", answer: "Yes — it's one of the leanest red meats available, typically under 2% fat, around 22g protein per 100g, and higher in iron and zinc than beef. It's also a natural source of CLA because the animals graze native pasture. The catch is it overcooks easily." },
      { question: "How much does kangaroo meat cost per kg?", answer: "Kangaroo generally sits below premium beef and roughly level with mid-range beef. Mince and diced are the best value; fillet is the premium cut but still usually cheaper than beef eye fillet." },
      { question: "Is kangaroo cheaper than beef?", answer: "Cut for cut, usually yes — particularly mince, sausages and diced. Because kangaroo is wild-harvested rather than raised, fed and housed, the input cost is lower." },
      { question: "Is kangaroo meat sustainable and ethical?", answer: "Kangaroo harvest is a government-regulated wild harvest with annual quotas set below population growth. There's no feedlot, land clearing or intensive farming footprint, which is why many scientists rate well-managed kangaroo among the lowest-impact red meats." },
      { question: "How do you cook kangaroo so it doesn't go tough?", answer: "Cook steaks and fillet rare to medium-rare only — hot pan, about 2 minutes a side for a 2cm steak, target 52–55°C, then rest 5 minutes. Diced kangaroo needs a slow 2-hour braise. A little oil in a marinade replaces the fat the meat lacks." },
      { question: "Can dogs eat kangaroo meat?", answer: "Yes — kangaroo is a popular novel protein for dogs with chicken or beef allergies, and it's very lean. We sell kangaroo pet mince and bulk kangaroo for dogs separately from the human range; feed it as part of a balanced raw diet." },
      { question: "Does kangaroo meat taste gamey?", answer: "Only mildly. It's a clean, slightly sweet, iron-rich flavour closer to good grass-fed beef than to venison. A soy-ginger marinade or chimichurri softens it; red wine and juniper lean into it." },
    ],
    cta: { label: "Shop kangaroo meat →", href: "/specialty-meat/kangaroo/", note: "Lean Australian kangaroo — steaks, mince, sausages & fillet." },
  },
  {
    slug: "what-is-veal-how-to-cook-it",
    title: "Veal Explained: What It Is, How It's Raised, and How to Cook It",
    excerpt: "What age is a veal calf? Is rose veal ethical? How is veal different from beef? A clear guide plus where to buy veal mince and schnitzel in Australia.",
    category: "Meat Education",
    date: "2026-07-01",
    updated: "2026-09-02",
    readTime: "7 min read",
    image: "/images/veal-cutlets.webp",
    primaryKeyword: "what is veal",
    seoTitle: "What Is Veal? How It's Raised and How to Cook It",
    metaDescription: "What is veal — the age, how rose veal is raised versus the crate system, how it differs from beef, and how to cook schnitzel, osso buco and scaloppine.",
    secondaryKeywords: ["what is veal", "veal vs beef", "is veal ethical", "rose veal", "veal schnitzel", "buy veal mince"],
    content: `Veal carries more myths than almost any meat. Here's what it actually is, how the Australian product is raised, and how to cook it.

## What is veal?

Veal is meat from a young cattle beast, generally slaughtered between **8 weeks and 8 months** of age. Because the animal is young, the meat is pale pink, fine-grained, low in fat and mild in flavour — closer in texture to pork than to beef.

## Isn't veal cruel?

The reputation comes from an old European system — "white veal" — where calves were kept anaemic and immobilised in crates to keep the meat pale. **That system is banned or abandoned in Australia.**

Australian veal is almost all **"rose veal" or bobby/pasture veal**: calves raised with their group, able to move, fed milk and often grass or grain, producing meat that is pink ("rose") rather than white. It's a by-product of the dairy industry — dairy cows must calve to produce milk, and male dairy calves have historically had little use. Rose veal turns that into a genuine, higher-welfare food product. Our veal is Australian rose veal.

## Veal vs beef — the differences

| | Veal | Beef |
|---|---|---|
| Colour | Pale pink | Deep red |
| Fat | Very low, little marbling | Moderate to high |
| Flavour | Mild, delicate, slightly sweet | Rich, savoury, "beefy" |
| Texture | Fine, tender | Firmer, more chew |
| Best for | Schnitzel, scaloppine, osso buco, mince | Steaks, roasts, slow cooks |

Because veal is lean, it dries out faster than beef — cook it gently and don't chase a hard sear on thin cuts.

## How to cook the main cuts

- **[Veal schnitzel / scaloppine](/specialty-meat/veal/):** pounded thin, crumbed or floured, 60–90 seconds a side in butter and oil. The classic Wiener schnitzel and vitello.
- **Veal cutlet:** a small chop off the rack — pan-sear medium, 3 minutes a side, baste with butter.
- **Veal osso buco:** cross-cut shank. The braise: brown, then 2–2.5 hours at 160°C in wine, stock and gremolata. The marrow is the prize.
- **Veal mince:** the base of a proper Bolognese (with pork and beef), or delicate meatballs. [Buy veal mince here](/specialty-meat/veal/).

## Where to buy veal in Australia

Veal has become hard to find at supermarkets. We carry Australian rose veal — schnitzel, cutlets, osso buco, diced and mince — on the [veal range](/specialty-meat/veal/), with [bulk veal](/wholesale/bulk-meat-orders/bulk-veal/) for restaurants and caterers.`,
    faqs: [
      { question: "What age is a veal calf?", answer: "Veal comes from young cattle generally between 8 weeks and 8 months old. The young age is why the meat is pale pink, fine-grained and mild." },
      { question: "Is Australian veal ethical?", answer: "The old 'white veal' crate system is banned or abandoned in Australia. Australian veal is almost all rose veal — calves raised in groups, able to move, fed milk and often grass — and it's a genuine use for male dairy calves that would otherwise have little value." },
      { question: "What's the difference between veal and beef?", answer: "Veal is pale pink, very low in fat, fine-textured and mild. Beef is deep red, more marbled, firmer and richer. Veal suits schnitzel, scaloppine, osso buco and delicate mince; beef suits steaks and roasts." },
      { question: "Does veal taste like lamb?", answer: "No. Veal is milder and sweeter than both lamb and beef, with almost none of lamb's distinctive fat flavour. Its texture is closer to pork." },
      { question: "Where can I buy veal mince and schnitzel in Australia?", answer: "Veal is increasingly hard to find in supermarkets. Mr Meat & Co carries Australian rose veal — schnitzel, cutlets, osso buco, diced and mince — with bulk veal available for restaurants and caterers." },
      { question: "How do you cook veal so it stays tender?", answer: "Veal is lean, so cook it gently. Pound schnitzel thin and flash-fry 60–90 seconds a side; sear cutlets to medium only; braise osso buco low and slow for 2+ hours. Never cook thin veal cuts past medium." },
    ],
    cta: { label: "Shop Australian rose veal →", href: "/specialty-meat/veal/", note: "Rose veal — schnitzel, cutlets, osso buco, diced & mince." },
  },
  {
    slug: "beef-cuts-for-slow-cooking",
    title: "Beef Cuts for Slow Cooking: Brisket, Cheek, Chuck, Shin & Oxtail",
    excerpt: "The best beef cuts for a slow cooker, braise or smoker — what each one does, how long it needs, and why the cheap cuts win.",
    category: "Meat Education",
    date: "2026-07-15",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/beef-brisket.webp",
    primaryKeyword: "slow cooker beef cuts",
    seoTitle: "Slow Cooker Beef Cuts: Brisket, Cheek, Chuck, Shin",
    metaDescription: "The best slow cooker beef cuts — brisket, cheek, chuck, shin and oxtail: what each one does, how long it needs, and why the cheap cuts win a long braise.",
    secondaryKeywords: ["best beef cut for slow cooker", "beef brisket", "beef cheeks", "gravy beef", "beef for stew"],
    content: `Slow cooking is where the cheap [beef cuts](/beef/slow-cook/) beat the expensive ones. The muscles that work hardest — shoulder, shin, tail, cheek — are packed with collagen, and collagen melts into gelatine given enough time and moisture. A rump steak in a slow cooker just goes dry and stringy; a chuck roast goes silky.

## The cuts, ranked for the pot

**Beef cheek.** The best-kept secret. Two solid muscles from the jaw, pure collagen, no waste. 3 hours at 160°C in red wine and stock and it's a knife-and-spoon dish. Richer than any other cut.

**Chuck (blade / bolar).** The workhorse of the stew and the slow cooker. Well-marbled shoulder, holds together in chunks, forgiving of timing. This is your Sunday beef ragu.

**Brisket.** The BBQ and corned-beef cut. Two muscles (point and flat) with a fat cap between. Low-and-slow only — 8–12 hours in a smoker, or 4 hours covered at 150°C in the oven, or overnight for corned beef. [See our brisket](/beef/slow-cook/).

**Shin / gravy beef.** Cross-cut lower leg with a marrow bone. The gelatine machine — it thickens a stew or a pho broth all by itself. 2.5–3 hours.

**Osso buco.** Beef shin cut into thick cross-sections with the bone. Same as shin but presented as portions — the marrow is the treat.

**Oxtail.** The tail, cut into segments. Fatty, gelatinous, deeply beefy. 3–4 hours. Makes the best stew and the best stock you'll cook.

**Short rib.** Rib bones with a thick meat cap. The steakhouse braise — 3 hours, then reduced sauce.

## The universal method

1. **Pat dry, brown hard** in batches (don't crowd — you want colour, not steam).
2. **Soften aromatics** in the same pot — onion, carrot, celery, garlic.
3. **Deglaze** with wine, stout or stock, scraping the fond.
4. **Return the beef**, add liquid to come two-thirds up, plus tomato / bay / thyme.
5. **Low and covered** — 150–160°C oven or "low" on the slow cooker — until a fork twists with no resistance. That's the only doneness test that matters.
6. **Rest, skim the fat, reduce the sauce** if it needs body.

## Buying

For the freezer, a [half or quarter beef share](/wholesale/bulk-meat-orders/bulk-beef/) gives you the brisket, shin, cheek and chuck all at once at a bulk price. Otherwise pick from the [beef slow-cook range](/beef/slow-cook/).`,
    faqs: [
      { question: "What is the best beef cut for a slow cooker?", answer: "Chuck (blade or bolar) is the most forgiving all-rounder. Beef cheek gives the richest, silkiest result. Shin or gravy beef thickens the sauce by itself. Avoid lean cuts like rump or topside — they dry out." },
      { question: "How long does beef brisket take?", answer: "8–12 hours in a smoker at 110–120°C, about 4 hours covered at 150°C in a domestic oven, or overnight simmered for corned beef. It's done when a probe slides in with no resistance, around 92–96°C internal." },
      { question: "Why do cheap beef cuts work better for slow cooking?", answer: "The hardest-working muscles — shoulder, shin, tail, cheek — are full of collagen. Long, moist, low-temperature cooking melts collagen into gelatine, which makes the meat tender and the sauce rich. Lean, tender cuts have no collagen to convert, so they just dry out." },
      { question: "How do you know when slow-cooked beef is done?", answer: "Not by temperature or the clock — by feel. A fork or skewer should twist in the meat with no resistance and the fibres should pull apart easily. If it's still tight, it needs more time." },
    ],
    cta: { label: "Shop beef for slow cooking →", href: "/beef/slow-cook/", note: "Brisket, cheek, shin, oxtail & chuck — grass-fed, built for the braise." },
  },
  {
    slug: "king-vs-tiger-vs-banana-prawns",
    title: "King vs Tiger vs Banana Prawns: Which to Buy",
    excerpt: "The difference between Australia's common prawn types, whether frozen prawns beat fresh, and how much prawns cost per kg.",
    category: "Meat Education",
    date: "2026-07-29",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/categories/seafood.webp",
    primaryKeyword: "king vs tiger prawns",
    seoTitle: "King vs Tiger Prawns (and Banana): Which to Buy",
    metaDescription: "King vs tiger prawns (and banana prawns) — the difference between Australia's common types, whether frozen beats fresh, and how much prawns cost per kg.",
    secondaryKeywords: ["types of prawns australia", "prawns price per kg", "are frozen prawns as good as fresh", "green king prawns", "buy prawns"],
    content: `Standing at the [prawn cabinet](/seafood/prawns/) the names blur together. Here's what actually separates them.

## The main players

**Banana prawns.** Pale, almost translucent when raw, turning bright orange cooked. Sweet, tender, slightly softer flesh. Trawled in northern Australia. The value option and the classic "prawn cocktail" prawn.

**Tiger prawns (black tiger).** Bold dark stripes when raw. Firm, meaty, holds its shape on a skewer or grill. The all-rounder — the prawn most people picture. Farmed and wild-caught.

**King prawns.** A group of species (eastern king, western king) rather than one. The largest common prawn, firm and full-flavoured. Premium price. "Green king prawns" just means raw (uncooked) king prawns.

**School prawns.** Small, eaten shell-on, often just salt-and-pepper fried whole. Cheap, brilliant with a beer.

## King vs tiger — which is bigger?

King prawns are generally the largest. A large tiger and a medium king can overlap, but if you want the biggest prawn on the plate, buy kings. If you want the best price-to-meat ratio and a prawn that won't fall apart on the BBQ, buy tigers.

## Raw ("green") vs cooked

Buy **raw** if you're cooking them — you control the doneness and they don't turn rubbery. Buy **cooked** only for cold dishes (cocktails, salads) or if you truly won't cook them. Raw prawns should smell of clean sea, not ammonia.

## Are frozen prawns as good as fresh?

Usually **better**, unless you're on the wharf. Almost all prawns are snap-frozen on the boat within hours of the catch. The "fresh" prawns in a cabinet have often been thawed from that same frozen stock and are ageing. Buy them frozen, thaw what you need in the fridge, and you're eating them closer to their peak.

## How much do prawns cost?

It moves with the season, but as a guide: banana prawns are the value buy, tigers mid-range, king prawns premium, and everything spikes in December. See current [prawn pricing](/seafood/prawns/).

## Cooking

- **BBQ / grill:** shell on, split down the back, 2 minutes a side until just opaque.
- **Garlic prawns:** peeled, hot butter and garlic, 90 seconds — pull them the instant they curl into a C (an O means overcooked).
- **Salt and pepper:** dusted in seasoned cornflour, flash-fried.

Browse [prawns and the full seafood range](/seafood/).`,
    faqs: [
      { question: "What's the difference between king, tiger and banana prawns?", answer: "Banana prawns are pale, sweet and tender — the value option. Tiger prawns are striped, firm and meaty — the best all-rounder for grilling. King prawns are the largest and most premium, firm and full-flavoured." },
      { question: "Are king or tiger prawns bigger?", answer: "King prawns are generally the largest common prawn. Large tigers and medium kings overlap, but for the biggest prawn on the plate, buy kings; for the best value and a prawn that holds up on the BBQ, buy tigers." },
      { question: "Are frozen prawns as good as fresh?", answer: "Usually better. Most prawns are snap-frozen on the boat within hours of the catch. Cabinet 'fresh' prawns are often thawed from that same stock and ageing. Buy frozen, thaw what you need in the fridge." },
      { question: "What does 'green prawns' mean?", answer: "Green prawns are simply raw (uncooked) prawns — nothing to do with colour. Buy raw/green prawns whenever you're cooking them yourself so you control the doneness." },
      { question: "How much do prawns cost per kg?", answer: "It varies by species and season — banana prawns are the value buy, tigers mid-range, king prawns premium — and prices rise sharply in December. Check our prawns page for current pricing." },
    ],
    cta: { label: "Shop prawns & seafood →", href: "/seafood/prawns/", note: "Raw and cooked prawns — king, tiger & banana." },
  },
  {
    slug: "how-much-meat-per-person",
    title: "How Much Meat Per Person? (BBQ, Roast & Curry Charts)",
    excerpt: "Exact per-person quantities for a BBQ, a Sunday roast, a curry and a grazing board — so you buy enough without a fortnight of leftovers.",
    category: "Buying Guide",
    date: "2026-08-05",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/categories/meat-boxes.webp",
    primaryKeyword: "how much meat per person",
    metaDescription: "How much meat per person — exact quantities for a BBQ, a Sunday roast, a curry and a grazing board, so you buy enough without a fortnight of leftovers.",
    secondaryKeywords: ["meat per person bbq", "how much roast per person", "how much brisket per person", "meat quantities for a party"],
    content: `The two questions every host asks: how much meat, and which cuts. Here are the numbers, then how to buy them.

## The rules of thumb

**Boneless, meat as the main:** 200–250g per adult raw. Big eaters or a crowd of blokes: 300g.
**Bone-in (chops, ribs, wings, roast on the bone):** 350–450g per adult raw — you're paying for bone weight.
**Meat as one of several dishes (curry night, tacos, a spread):** 125–175g per adult.
**Kids under 12:** roughly half an adult portion.
**Always add ~15%** if there's no other substantial food, or if it's a long grazing event.

## BBQ (meat as the event)

| Guests | Sausages | Steak / chops | Skewers | Total meat |
|---|---|---|---|---|
| 6 | 9–12 | 1kg | 12 | ~2.5kg |
| 12 | 18–24 | 2kg | 24 | ~5kg |
| 20 | 30–40 | 3.5kg | 40 | ~8.5kg |

A [BBQ meat pack](/bbq-grill/) is built to these ratios; for 20+ a [half lamb](/wholesale/bulk-meat-orders/bulk-lamb/) or bulk boxes are cheaper per kilo.

## Sunday roast

| Diners | Boneless roast (beef/pork/lamb) | Bone-in (leg of lamb, rib roast) | Whole chicken |
|---|---|---|---|
| 4 | 800g–1kg | 1.4–1.8kg | 1 x 1.6kg |
| 6 | 1.2–1.5kg | 2–2.7kg | 1 x 2.2kg or 2 birds |
| 10 | 2–2.5kg | 3.5–4.5kg | 2 x 2kg |

Buy a slightly bigger roast than you need — the leftovers are the point, and a bigger joint cooks more evenly.

## Brisket / low-and-slow

Brisket loses ~40% of its raw weight to rendering and trim. For **pulled brisket as the main**, buy **700–800g raw per person**. A 5kg packer brisket feeds 6–8 properly.

## Curry / stew

150–175g of diced or mince per person, since rice, dahl and vegetables carry the plate. A 1kg pack of [diced beef](/beef/slow-cook/) or [lamb](/lamb/slow-cook/) does 6.

## Grazing / charcuterie board

80–120g of sliced meats per person as a starter, 150g if it's the meal.

## Buying to a number

Work out your total kilos, then decide: a [meat box](/meat-boxes/) if you want it curated, a [BBQ pack](/bbq-grill/) for a cookout, or a [bulk / carcass share](/wholesale/bulk-meat-orders/) if you've got the freezer and want the best price.`,
    faqs: [
      { question: "How much meat per person for a BBQ?", answer: "If meat is the main event, plan 250–350g per adult raw across sausages, steak and skewers — roughly 2.5kg for 6 people, 5kg for 12, 8.5kg for 20. Halve it for kids and add 15% if there's no other substantial food." },
      { question: "How much roast per person?", answer: "Boneless roast: 200–250g per person raw. Bone-in (leg of lamb, rib roast): 350–450g. A 1.2–1.5kg boneless joint feeds 6; buy slightly bigger for even cooking and leftovers." },
      { question: "How much brisket per person?", answer: "Brisket loses about 40% of its raw weight to rendering and trim, so buy 700–800g raw per person for pulled brisket as the main. A 5kg brisket feeds 6–8." },
      { question: "How much meat for a curry?", answer: "About 150–175g of diced meat or mince per person, because rice, dahl and vegetables carry most of the plate. A 1kg pack of diced beef or lamb serves 6." },
    ],
    cta: { label: "Shop meat boxes & BBQ packs →", href: "/meat-boxes/", note: "Curated boxes and BBQ packs built to feed the room." },
  },
  {
    slug: "buying-a-quarter-half-whole-beef",
    title: "Buying a Quarter, Half or Whole Beef: Weights, Cuts & Freezer Space",
    excerpt: "What you actually get in a beef share, how much freezer space you need, the real per-kilo saving, and how the cut sheet works.",
    category: "Buying Guide",
    date: "2026-08-12",
    updated: "2026-09-02",
    readTime: "7 min read",
    image: "/images/whole-beef-share-200kg.webp",
    primaryKeyword: "quarter beef share",
    seoTitle: "Quarter Beef Share: Weights, Cuts & Freezer Space",
    metaDescription: "A quarter beef share explained — what you actually get, how much freezer space you need, the real per-kilo saving, and how the cut sheet works.",
    secondaryKeywords: ["half a beef", "buying a whole cow", "beef share australia", "how much freezer space for half a cow", "wholesale beef"],
    content: `Buying beef by the [quarter, half or whole animal](/wholesale/bulk-meat-orders/bulk-beef/) is how families used to stock the freezer, and it's back for good reason: the per-kilo price of premium grass-fed beef drops sharply when you buy the whole thing.

## What you actually get

A beef carcass isn't all steak. A typical breakdown of usable meat from a side:

- **~25–30% premium** — scotch fillet, porterhouse, eye fillet, rump, sirloin
- **~30–35% roasting and casserole** — topside, silverside, blade, chuck, brisket
- **~25–30% mince and diced** — from the trim
- **~10% bones, shin, offal** — stock gold

**Quarter beef** (~40–55kg of packed meat) — a "mixed quarter" is half front, half hind, so you get a spread of steaks, roasts and mince.
**Half beef** (~80–110kg) — the standard family buy.
**Whole beef** (~160–220kg) — for two households to split, or a serious freezer.

Exact weights vary with the animal — that's why it's sold as "approximately".

## The cut sheet

When you order a half or whole, you tell us how you want it broken down:

- Steak thickness (2cm / 2.5cm / 3cm)
- Roast sizes (small family / large)
- How much mince vs diced from the trim
- Whether you want the offal, bones, and cuts like oxtail and cheek
- Sausages made from some of the trim (small fee)

If you don't want to think about it, our standard cut sheet is a sensible all-rounder.

## Freezer space

Rough rule: **1kg of packed meat ≈ 1.5 litres of freezer space.**

| Share | Packed weight | Freezer needed |
|---|---|---|
| Quarter | 40–55kg | ~85L — a large chest freezer drawer, or half a 200L chest |
| Half | 80–110kg | ~170L — a dedicated 200–250L chest freezer |
| Whole | 160–220kg | ~330L — a 400L+ chest freezer, or split with another household |

## The saving

It varies with the market, but buying premium grass-fed beef by the half typically lands **20–35% below** buying the same cuts individually — because you're taking the whole animal, trim and all, not just the glamour cuts. The mince and sausage alone often cover a chunk of the cost.

## How it's delivered

Vacuum-sealed, labelled by cut, snap-frozen, delivered cold across Sydney (and Australia-wide for larger orders). You'll want to be home and have the freezer cleared.

Start on the [bulk beef page](/wholesale/bulk-meat-orders/bulk-beef/), or read [how much meat per person](/blog/how-much-meat-per-person/) to sanity-check the quantity.`,
    faqs: [
      { question: "How much meat is in a quarter, half or whole beef?", answer: "Roughly: a quarter gives 40–55kg of packed meat, a half 80–110kg, and a whole 160–220kg. Exact weights vary with the animal, which is why shares are sold as 'approximately'." },
      { question: "How much freezer space do I need for half a cow?", answer: "About 170 litres — a dedicated 200–250L chest freezer. Use the rule of 1kg of packed meat per 1.5 litres of freezer space. A quarter needs about 85L; a whole beef needs 330L+ or a second household to split with." },
      { question: "How much do you save buying beef in bulk?", answer: "Typically 20–35% below buying the same cuts individually, because you take the whole animal — trim, mince and bones included — not just the premium steaks. The mince and sausage yield alone often covers a large share of the cost." },
      { question: "What is a cut sheet?", answer: "It's your instructions for how the carcass is broken down — steak thickness, roast sizes, how much mince versus diced, whether you want offal, bones, oxtail and cheek, and whether some trim becomes sausages. We have a sensible standard sheet if you'd rather not choose." },
      { question: "How is a beef share delivered?", answer: "Vacuum-sealed and labelled by cut, snap-frozen, delivered cold-chain across Sydney and Australia-wide for larger orders. Be home for the delivery and clear the freezer first." },
    ],
    cta: { label: "Shop bulk & carcass shares →", href: "/wholesale/bulk-meat-orders/bulk-beef/", note: "Quarter, half & whole beef — custom cut, snap-frozen, delivered." },
  },
  {
    slug: "raw-feeding-dogs-starter-guide",
    title: "Raw Feeding for Dogs: A Beginner's Starter Guide (BARF Ratios)",
    excerpt: "The 80/10/10 ratio explained, how much raw to feed by dog weight, which bones are safe, and how to transition without upsetting your dog's stomach.",
    category: "Pet Feeding",
    date: "2026-08-19",
    updated: "2026-09-02",
    readTime: "8 min read",
    image: "/images/categories/pet-food.webp",
    primaryKeyword: "raw feeding for dogs",
    seoTitle: "Raw Feeding for Dogs: A Beginner's Starter Guide",
    metaDescription: "Raw feeding for dogs, explained — the 80/10/10 BARF ratio, how much to feed by weight, which bones are safe, and how to transition without an upset stomach.",
    secondaryKeywords: ["barf diet", "raw feeding ratios", "how much raw to feed dog", "how to transition dog to raw", "raw meaty bones for dogs"],
    content: `Raw feeding — often called **BARF** (Biologically Appropriate Raw Food) or **PMR** (Prey Model Raw) — means feeding a dog fresh raw meat, bone and organ instead of processed kibble. Done properly it's simple. Done carelessly it causes deficiencies. Here's the starting framework.

> This is general information, not veterinary advice. Talk to your vet before switching, especially for puppies, seniors, or dogs with health conditions.

## The 80/10/10 ratio

A balanced raw diet, by weight, over a week (not every meal):

- **80% muscle meat** — [raw mince](/pet-food/raw-mince/), chunks, mince with a little ground bone
- **10% raw edible bone** — [raw meaty bones](/pet-food/bones/), chicken frames, necks
- **5% liver** — the single most nutrient-dense organ; don't skip or overdo it
- **5% other secreting organ** — kidney, spleen, pancreas, brain

"Secreting organ" is the key phrase — heart, tripe and lung are muscle for these purposes, not organ. See our [pet offal range](/pet-food/offal/).

## How much to feed

**Adult dogs:** 2–3% of ideal body weight per day.

| Dog weight | 2% (needs to lose) | 2.5% (maintain) | 3% (active / underweight) |
|---|---|---|---|
| 5kg | 100g | 125g | 150g |
| 15kg | 300g | 375g | 450g |
| 30kg | 600g | 750g | 900g |
| 45kg | 900g | 1125g | 1350g |

**Puppies:** 5–10% of *current* weight, dropping as they grow — or roughly 2–3% of their expected *adult* weight. Puppies need it split across 3–4 meals.

Weigh your dog monthly and adjust. You're aiming for a visible waist and easily-felt (not visible) ribs.

## Which bones are safe

**Safe, raw only:** chicken necks and frames, turkey necks, lamb ribs and flaps, brisket bones, oxtail. Match the bone to the dog — a chicken neck for a chihuahua, a lamb rib rack or brisket bone for a labrador.

**Never:** cooked bones of any kind (they splinter), weight-bearing leg bones of large animals (they crack teeth), or any bone small enough to swallow whole.

Always supervise bone time. Bones are a few times a week, not daily.

## Transitioning

Two approaches:

1. **Cold turkey** (most raw feeders): fast for 12–24 hours, then start raw. Works for most healthy adult dogs.
2. **Gradual** (sensitive stomachs): replace 25% of the old food with raw, hold 3–4 days, increase. Over ~2 weeks.

Start with **one protein** — chicken or beef — for the first 1–2 weeks. Once stools are firm, add a second protein, then bone, then organ. Loose stool early on usually means too much organ or bone, or too fast a change.

## Novel proteins for allergies

If your dog reacts to chicken and beef, [kangaroo](/pet-food/raw-mince/) is the go-to novel protein in Australia — very lean, single-source, rarely triggers a reaction.

## Handling and safety

Treat raw pet food like raw meat for people: keep it frozen, thaw in the fridge, feed within 2 days of thawing, wash bowls and surfaces, don't leave it down for hours. Our raw pet range is delivered frozen and clearly separated from the human range.

Browse [raw pet mince](/pet-food/raw-mince/), [bones](/pet-food/bones/) and [offal](/pet-food/offal/).`,
    faqs: [
      { question: "What is the 80/10/10 raw feeding ratio?", answer: "Over a week, by weight: 80% muscle meat, 10% raw edible bone, 5% liver and 5% other secreting organ (kidney, spleen, pancreas). Heart and tripe count as muscle, not organ." },
      { question: "How much raw food should I feed my dog?", answer: "Adult dogs: 2–3% of ideal body weight per day — about 375g for a 15kg dog to maintain weight, 750g for a 30kg dog. Puppies: 5–10% of current weight, split across 3–4 meals. Weigh monthly and adjust." },
      { question: "Which bones are safe for dogs?", answer: "Raw only — chicken necks and frames, turkey necks, lamb ribs, brisket bones, oxtail — matched to the dog's size. Never feed cooked bones (they splinter), large weight-bearing leg bones, or any bone small enough to swallow whole. Always supervise." },
      { question: "How do I transition my dog to raw food?", answer: "Either fast 12–24 hours then start raw (works for most healthy adults), or replace 25% of the old food at a time over about two weeks for sensitive stomachs. Start with one protein for 1–2 weeks, then add bone, then organ." },
      { question: "What's the best raw protein for a dog with allergies?", answer: "Kangaroo is the leading novel protein in Australia for dogs that react to chicken or beef — it's very lean, single-source and rarely triggers a reaction. We sell kangaroo pet mince and bulk kangaroo for dogs." },
      { question: "Is raw pet food safe to handle?", answer: "Treat it exactly like raw meat for people — keep it frozen, thaw in the fridge, feed within 2 days of thawing, wash bowls and surfaces, and don't leave it down for hours. Our raw pet range is delivered frozen and kept separate from the human range." },
    ],
    cta: { label: "Shop raw pet food →", href: "/pet-food/raw-mince/", note: "Raw mince, bones & offal for dogs — delivered frozen." },
  },
  {
    slug: "venison-and-game-meat-guide",
    title: "Venison & Game Meat: Cooking Lean Cuts Without Drying Them Out",
    excerpt: "How to cook venison, wild boar and rabbit — the lean-meat rules, marinades that work, and where to buy game meat online in Australia.",
    category: "Meat Education",
    date: "2026-08-26",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/venison-backstrap.webp",
    primaryKeyword: "how to cook venison",
    seoTitle: "How to Cook Venison & Game Meat Without Drying It Out",
    metaDescription: "How to cook venison and other game — the lean-meat rules for venison, wild boar and rabbit, marinades that work, and where to buy game meat online in Australia.",
    secondaryKeywords: ["venison vs beef", "game meat", "wild boar meat", "rabbit meat", "buy game meat online", "cooking venison backstrap"],
    content: `[Game meat](/specialty-meat/game/) — venison, wild boar, rabbit — is lean, dark and full-flavoured. The mistakes people make are all the same mistake: cooking it like beef.

## The lean-meat rules

Game animals run for a living, so they carry almost no intramuscular fat. That means:

1. **Fast cuts, cook rare to medium-rare, and rest.** Backstrap, loin, rump — hot and quick, pull at 52–55°C, rest 5–10 minutes. Past medium it turns dry and livery.
2. **Tough cuts, low and slow with added fat and moisture.** Shoulder, shank, neck — braise 2.5–3 hours with stock, wine and something fatty (bacon, olive oil, butter).
3. **Add fat everywhere.** Bard a roast with bacon or caul fat, finish a steak with a knob of butter, blend a little pork fat into game mince and sausages.
4. **Marinate the fast cuts.** Oil, acid (red wine, juniper, balsamic), aromatics — 4–24 hours. It seasons, tenderises slightly, and replaces the missing fat.

## The animals

**Venison (deer).** Australia's farmed venison is mild, clean and only faintly gamey — a good gateway. [Backstrap](/specialty-meat/game/) for quick cooking, [osso buco and shanks](/specialty-meat/game/) for braises, mince for game ragu and sausage rolls.

**Wild boar.** Darker and stronger than pork, low in fat, needs slow cooking or grinding. Excellent in a ragu or a rillette.

**Rabbit.** Delicate, lean, almost all white meat. Best jointed and braised (rabbit with mustard and cream is the classic) or the loins flash-fried. Easy to overcook.

## Venison vs beef — nutrition

Per 100g, venison has **roughly a third of the fat of a lean beef steak**, similar or higher protein, and more iron. The flavour is more mineral and slightly sweet. If you like a good grass-fed sirloin, you'll like venison backstrap.

## Where to buy game meat in Australia

Supermarkets don't carry it. We stock farmed venison, wild boar and rabbit on the [game range](/specialty-meat/game/), plus a mixed [game box](/specialty-meat/game/) if you want to try a few, and [bulk game](/wholesale/bulk-meat-orders/bulk-game/) for restaurants. Delivered across Sydney and Australia-wide.`,
    faqs: [
      { question: "How do you cook venison so it isn't dry?", answer: "For fast cuts like backstrap and loin: hot and quick, pull at 52–55°C for medium-rare, rest 5–10 minutes. For shoulder and shank: braise 2.5–3 hours with stock, wine and added fat. Never cook fast venison cuts past medium." },
      { question: "What's the difference between venison and beef?", answer: "Venison has roughly a third of the fat of a lean beef steak, similar or higher protein, and more iron. The flavour is more mineral and slightly sweet, and only faintly gamey in Australian farmed venison." },
      { question: "Does game meat taste gamey?", answer: "Australian farmed venison is mild and clean with only a faint gamey note. Wild boar is stronger and darker than pork. Rabbit is delicate and mild. Marinades with red wine or juniper lean into the flavour; soy or citrus soften it." },
      { question: "Where can I buy game meat in Australia?", answer: "Game meat isn't sold in supermarkets. Mr Meat & Co stocks farmed venison, wild boar and rabbit, a mixed game box, and bulk game for restaurants — delivered across Sydney and Australia-wide." },
      { question: "Why add fat to game meat?", answer: "Game animals carry almost no intramuscular fat, so dishes can taste dry and lean. Bard roasts with bacon, finish steaks with butter, and blend pork fat into game mince and sausages to restore richness and moisture." },
    ],
    cta: { label: "Shop game meat →", href: "/specialty-meat/game/", note: "Venison, wild boar & rabbit — Australian, delivered nationwide." },
  },
  {
    slug: "sausage-rolls-from-scratch",
    title: "Sausage Rolls From Scratch (With Real Butcher's Sausage Meat)",
    excerpt: "The filling ratio, why sausage meat beats plain mince, the soggy-bottom fix, and how to freeze a big batch raw.",
    category: "Recipes",
    date: "2026-09-01",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/thick-beef-sausages.webp",
    primaryKeyword: "sausage roll recipe",
    seoTitle: "Sausage Roll Recipe With Real Butcher's Sausage Meat",
    metaDescription: "A sausage roll recipe using real butcher's sausage meat — the filling ratio, why it beats plain mince, the soggy-bottom fix, and how to freeze a batch raw.",
    secondaryKeywords: ["homemade sausage rolls", "sausage meat", "sausage roll filling", "how to freeze sausage rolls", "best sausage roll recipe"],
    content: `A good sausage roll is 80% filling, and the filling should not be plain mince. It should be seasoned, slightly fatty, and bound just enough to slice cleanly. That's what [sausage meat](/sausages/) is.

## Why sausage meat, not mince

[Sausage meat](/sausages/) — sausage mixture without the casing — is already seasoned (sage, pepper, nutmeg, sometimes rusk) and ground to the right fat level (around 75/25) for a juicy roll. Plain lean mince makes a dense, dry sausage roll that needs a lot of help.

If you can only get mince, use **pork mince at 80/20** and add: 1 slice of bread blitzed to crumb per 500g, 1 egg, 1 grated onion (squeezed dry), 1 tsp each salt, sage, pepper, ¼ tsp nutmeg.

## The filling (makes ~24 party rolls)

- 800g [sausage meat](/sausages/) (or the pork mince mix above)
- 1 grated apple or 1 grated carrot, squeezed dry — moisture and a touch of sweet
- 1 small onion, grated and squeezed
- 30g fresh breadcrumb
- 1 egg
- Extra sage, thyme, a little Worcestershire

Mix by hand until just combined. Fry a teaspoon to taste and adjust the salt.

## The build

1. Cut ready-rolled puff pastry sheets in half. Pipe or spoon a 3cm log of filling down the long edge.
2. Egg-wash the far edge, roll, seal seam-side down.
3. **The soggy-bottom fix:** chill the rolls 20 minutes, then cut, then bake on a **preheated tray** or a wire rack over a tray. Cold pastry + hot tray = a crisp base.
4. Slash the tops, egg-wash, scatter sesame or fennel seed.
5. **220°C for 15 minutes, then 190°C for 10–15** until deep gold and the filling reads 72°C.

## Freezing

Freeze them **raw**, cut and spaced on a tray, then bag once solid. Bake from frozen — same temps, add 8–10 minutes. Far better than freezing them cooked.

## Buying

We make [sausage meat and gourmet sausages](/sausages/) fresh, plus ready-to-bake [sausage rolls](/ready-to-cook/) if you want to skip the pastry work. For a party, order [sausages in bulk](/wholesale/bulk-meat-orders/bulk-sausages/).`,
    faqs: [
      { question: "What meat do you use for sausage rolls?", answer: "Sausage meat — sausage mixture without the casing. It's already seasoned and ground to about 75/25 fat, which gives a juicy roll. If you only have mince, use pork mince at 80/20 and add crumb, egg, grated onion and sage, pepper, nutmeg." },
      { question: "How do you stop sausage rolls having a soggy bottom?", answer: "Chill the assembled rolls 20 minutes before cutting, then bake them on a preheated oven tray or a wire rack set over a tray. Cold pastry meeting a hot surface sets a crisp base immediately." },
      { question: "Can you freeze sausage rolls?", answer: "Yes — and freeze them raw, not cooked. Cut and space them on a tray, freeze until solid, then bag. Bake straight from frozen at the same temperatures, adding 8–10 minutes." },
      { question: "What temperature do you bake sausage rolls?", answer: "220°C for 15 minutes to puff and colour the pastry, then drop to 190°C for another 10–15 minutes until deep gold and the filling reaches 72°C." },
    ],
    cta: { label: "Shop sausages & sausage meat →", href: "/sausages/", note: "Gourmet sausages and sausage meat, made fresh — no fillers." },
  },
  {
    slug: "australian-beef-cuts-explained",
    title: "Australian Beef Cuts Explained: Names, Uses & Overseas Equivalents",
    seoTitle: "Australian Beef Cuts Explained: Cuts, Uses & US/UK Names",
    excerpt: "Scotch fillet, porterhouse, eye fillet, rump — what each Australian beef cut is, how to cook it, and what it's called in the US and UK.",
    category: "Meat Education",
    date: "2026-03-11",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/scotch-fillet-steak.webp",
    primaryKeyword: "australian beef cuts",
    metaDescription: "Australian beef cuts explained — scotch fillet, porterhouse, eye fillet, rump and more: what each cut is, how to cook it, and its US and UK names.",
    secondaryKeywords: ["scotch fillet vs porterhouse", "eye fillet", "rump steak", "beef cut names australia", "what is scotch fillet"],
    content: `Australian beef names blend British butchery with local habit, so a recipe from the US or UK can leave you guessing at the counter. Here's the map.

## The premium grilling steaks

**Scotch fillet** (US: ribeye / boneless rib; UK: rib-eye). From the fore-rib. Heavily marbled, rich, forgiving — the most flavourful steak and the hardest to overcook. Sear hot, medium-rare, 3 min/side for 2.5cm. [Shop scotch fillet](/beef/steaks/).

**Porterhouse / sirloin** (US: New York strip / striploin; UK: sirloin). From the short loin. Firm, fine-grained, a fat cap on one edge — render that edge first. Slightly leaner and beefier than scotch.

**Eye fillet** (US: tenderloin / filet mignon; UK: fillet). The tenderloin muscle, which does no work — the softest cut, mild flavour, lowest fat. Don't take it past medium.

**Rump** (US: sirloin / rump; UK: rump). From the hindquarter. Several muscles, so texture varies across the steak — bold flavour, great value, best medium-rare and sliced against the grain.

**T-bone / bone-in porterhouse** — porterhouse plus a strip of eye fillet, divided by the bone.

## Roasting cuts

- **Topside / round** — lean, tidy, budget roast. Cook to medium-rare and slice thin, or it's dry.
- **Silverside** — the corned-beef cut; also a pot roast.
- **Blade / bolar** — shoulder, some connective tissue — a slow roast or a pot roast.
- **Standing rib roast / prime rib** — scotch fillet on the bone. The special-occasion roast.

## Slow-cook and value cuts

Brisket, chuck, shin/gravy beef, cheek, oxtail, short rib — covered in our [slow-cooking guide](/blog/beef-cuts-for-slow-cooking/).

## Mince and diced

Chuck for standard [mince](/beef/mince-diced/), rump for lean, brisket blend for burgers. Diced is usually chuck or round.

## Buying tip

If a US recipe says "chuck roast", buy blade or chuck. "Flank" or "skirt" — ask us, they're small cuts we cut to order. "London broil" isn't a cut, it's a method — use rump. Browse the [full beef range](/beef/).`,
    faqs: [
      { question: "What is scotch fillet called overseas?", answer: "Ribeye or boneless rib steak in the US, rib-eye in the UK. It comes from the fore-rib, is heavily marbled and rich, and is the most forgiving premium steak to cook." },
      { question: "What's the difference between scotch fillet and porterhouse?", answer: "Scotch fillet (ribeye) is from the fore-rib — more marbled, richer, more forgiving. Porterhouse (sirloin/NY strip) is from the short loin — firmer, finer-grained, slightly leaner and beefier, with a fat cap on one edge." },
      { question: "What is eye fillet?", answer: "The tenderloin — known as filet mignon in the US and fillet in the UK. It's the muscle that does no work, so it's the softest cut, with a mild flavour and the lowest fat. Cook it no further than medium." },
      { question: "What US cut is Australian rump steak?", answer: "It overlaps with US 'sirloin' and 'rump'. It's from the hindquarter, made of several muscles so texture varies, with bold flavour and good value. Cook medium-rare and slice against the grain." },
    ],
    cta: { label: "Shop beef steaks →", href: "/beef/steaks/", note: "Grass-fed scotch fillet, porterhouse, eye fillet & rump." },
  },
  {
    slug: "cold-chain-meat-delivery-explained",
    title: "How Cold-Chain Meat Delivery Actually Works (And Why It Matters)",
    seoTitle: "How Cold-Chain Meat Delivery Works",
    excerpt: "What an unbroken cold chain means, how we pack meat for a Sydney summer, and what to do with your box the moment it arrives.",
    category: "Buying Guide",
    date: "2026-01-14",
    updated: "2026-09-02",
    readTime: "4 min read",
    image: "/images/hero/hero-2.webp",
    primaryKeyword: "meat delivery",
    metaDescription: "How meat delivery cold chain works — what an unbroken cold chain means, how meat is packed for an Australian summer, and what to do with your box on arrival.",
    secondaryKeywords: ["cold chain delivery", "how is meat delivered", "meat delivery sydney", "is delivered meat safe", "refrigerated meat delivery"],
    content: `"Cold chain" means the meat never leaves safe refrigeration temperature — from our [Alexandria butchery](/about/) to your fridge. Break it anywhere and you lose shelf life and, in a Sydney February, food safety. Here's how it holds together.

## The danger zone

Bacteria multiply fastest between **5°C and 60°C**. The goal for delivery is to keep meat **at or below 5°C** the entire time, or frozen product **below −12°C**.

## How we pack

- **Chilled to the core first.** Product goes out at 0–2°C, not fridge-temp — that buffer is what carries it through the trip.
- **Insulated liners + food-safe gel packs / dry ice** sized to the order and the forecast. A 5kg order in January gets more coolant than the same order in July.
- **Frozen and chilled separated** so the frozen items don't partially thaw the chilled ones and vice versa.
- **Refrigerated vans** for the Sydney metro run — the box is cold when it's packed and cold when it's handed over.

## What to do when it arrives

1. **Unpack straight away.** Don't leave the box on the porch.
2. **Check it's cold** — the meat should feel refrigerator-cold or frozen-solid. Gel packs may have softened; that's normal and fine as long as the meat is cold.
3. **Fridge the chilled items** in the coldest part (usually the bottom shelf), frozen items straight to the freezer.
4. **Re-portion and freeze** anything you won't use in 2–3 days. Flat 500g mince packs, single-meal steak packs.

## Shelf life once delivered

- Mince, sausages: 2–3 days chilled
- Steaks, chops, diced: 3–5 days chilled
- Roasts (whole muscle): 4–6 days chilled
- Vacuum-sealed: add 2–4 days
- Frozen: 3–6 months depending on cut

## If something's not right

If a delivery arrives above fridge temperature or you have any doubt, don't cook it — contact us with a photo and we'll replace it. That's the whole point of buying from a butcher rather than a marketplace.

Ready to order? Start at the [shop](/shop/) or pick a [meat box](/meat-boxes/).`,
    faqs: [
      { question: "Is meat delivered to your door safe?", answer: "Yes, when it's cold-chain delivered. The meat should arrive at or below 5°C (or frozen solid). Unpack it immediately, check it's cold, and refrigerate or freeze it straight away. If it arrives warm, don't cook it — contact us for a replacement." },
      { question: "How is meat kept cold during delivery?", answer: "It's chilled to 0–2°C before packing, wrapped in insulated liners with gel packs or dry ice sized to the order and the weather, with frozen and chilled items separated, and run on refrigerated vans across Sydney metro." },
      { question: "How long does delivered meat last in the fridge?", answer: "Mince and sausages 2–3 days, steaks and chops 3–5 days, whole-muscle roasts 4–6 days, vacuum-sealed a few days longer. Freeze anything you won't use in that window." },
      { question: "Do the gel packs need to still be frozen when it arrives?", answer: "Not necessarily. The gel packs can soften on a warm day and the meat is still fine — what matters is that the meat itself is refrigerator-cold or frozen-solid when you unpack it." },
    ],
    cta: { label: "Shop the full range →", href: "/shop/", note: "Cold-chain delivery across Sydney — packed for the forecast." },
  },
  {
    slug: "perfect-pork-crackling",
    title: "Perfect Pork Crackling Every Time (The Butcher's Method)",
    excerpt: "Why crackling fails, the dry-skin trick, the salt question, and which pork roast cut gives the best crackle.",
    category: "Recipes",
    date: "2026-04-08",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/pork-belly.webp",
    primaryKeyword: "pork crackling",
    metaDescription: "Perfect pork crackling every time — why crackling fails, the dry-skin trick, the salt question, and which pork roast cut gives the best crackle.",
    secondaryKeywords: ["how to get crispy crackling", "pork roast crackling", "pork belly crackling", "best pork roast for crackling", "why is my crackling not crispy"],
    content: `Crackling fails for one of three reasons: the skin was wet, the scoring was wrong, or the heat was wrong. Fix all three and it works every time.

## Choose the cut

- **[Pork belly](/pork/belly-ribs/)** — the highest fat-to-skin ratio, the most reliable crackle, the richest result.
- **Pork leg / loin roast** ([pork roasts](/pork/roasts/)) — leaner meat, still excellent crackling if you prep the skin. The Sunday-roast choice.
- **Pork scotch (neck) roast** — great meat, but the skin is usually removed — not a crackling cut.

Ask us to **score the rind** for you — deep, even lines about 5–7mm apart, through the skin and just into the fat but not the meat.

## Dry the skin — this is the whole game

Moisture in the skin steams instead of crackling. Options, best to quickest:

1. **Fridge, uncovered, overnight** (or up to 2 days) on a rack. The single most effective step.
2. **Boiling water pour** over the skin, then pat bone-dry, then fridge.
3. **Paper towel + hairdryer** if you forgot — 5 minutes on cool.

Just before cooking: rub the skin with a little oil and a generous, even layer of fine salt. Salt draws out the last moisture and seasons the crackle. Keep salt off the meat sides.

## The heat

**Blast, then roast.**
1. Oven as hot as it goes — 240–250°C. Pork on a rack, skin up. 25–30 minutes until the skin has blistered and crackled across the whole surface.
2. Drop to 170–180°C and roast to temperature: **belly** ~1.5–2 hrs total, **leg/loin** to 65°C internal then rest to 70°C.
3. If patches haven't crackled, cut them off, lay them on a tray and give them 5–10 minutes back at 240°C or under the grill (watch closely).

**Rest the meat** 15–20 minutes — but rest it uncovered so the crackling stays crisp.

## Buying

[Pork belly](/pork/belly-ribs/) and [pork roasts](/pork/roasts/) come rind-on and scored on request. All Australian.`,
    faqs: [
      { question: "Why is my pork crackling not crispy?", answer: "Almost always moisture in the skin — it steams instead of crackling. Dry the scored rind uncovered in the fridge overnight, pat it bone-dry, rub with oil and fine salt, then blast at 240–250°C for 25–30 minutes before dropping the heat to roast the meat." },
      { question: "What's the best pork roast for crackling?", answer: "Pork belly is the most reliable — the highest fat-to-skin ratio. Leg and loin roasts also crackle well if you prep the skin properly. Pork scotch (neck) usually has the skin removed and isn't a crackling cut." },
      { question: "Do you put salt on pork crackling?", answer: "Yes — a generous, even layer of fine salt rubbed into the oiled skin just before cooking. It draws out the last of the moisture and seasons the crackle. Keep the salt off the meat sides of the roast." },
      { question: "How do you fix crackling that hasn't crisped?", answer: "Cut the soft skin off the rested roast, lay it flat on a tray, and give it 5–10 minutes back at 240°C or under the grill — watching it closely so it doesn't burn." },
    ],
    cta: { label: "Shop pork belly & roasts →", href: "/pork/belly-ribs/", note: "Rind-on pork, scored on request — Australian." },
  },
  {
    slug: "how-to-roast-a-leg-of-lamb",
    title: "How to Roast a Leg of Lamb (Bone-In or Boneless)",
    excerpt: "Timing charts by weight and doneness, bone-in vs boneless, and how to get a rosy pink centre with a crust.",
    category: "Recipes",
    date: "2026-04-22",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/bone-in-leg-of-lamb.webp",
    primaryKeyword: "how to roast a leg of lamb",
    metaDescription: "How to roast a leg of lamb — timing charts by weight and doneness, bone-in vs boneless, and how to get a rosy pink centre with a proper crust.",
    secondaryKeywords: ["roast lamb cooking time", "bone in vs boneless leg of lamb", "leg of lamb per person", "lamb roast temperature", "easter roast lamb"],
    content: `A [leg of lamb](/lamb/roasts/) is the easiest impressive roast — one big muscle group, hard to ruin if you use a thermometer.

## Bone-in or boneless?

| | Bone-in | Boneless (butterflied or rolled) |
|---|---|---|
| Flavour | Slightly better (bone + marrow) | Very good |
| Carving | Trickier around the bone | Easy, even slices |
| Cooking | A little slower, more even | Faster; butterflied is fastest of all |
| Stuffing | No | Yes — garlic, rosemary, anchovy, lemon |
| Feeds | 350–450g per person raw | 250–300g per person raw |

For a first roast, ask us to **bone and roll** the leg, or **butterfly** it for a 30-minute BBQ or oven cook.

## The method (bone-in, ~2kg)

1. **Temper** 1 hour out of the fridge.
2. **Stud and rub.** Slit the surface, push in garlic slivers and rosemary. Rub with oil, salt, pepper.
3. **Sear the oven.** 220°C for 20 minutes to build a crust.
4. **Drop to 180°C** and roast to your target — pull it 3°C early and rest:
   - Rare 52°C — ~15 min/500g at 180°C
   - Medium-rare 56–58°C — ~18 min/500g
   - Medium 62°C — ~22 min/500g
   - Well done 70°C — ~28 min/500g
   A 2kg leg to medium-rare: roughly 20 min sear + 70 min at 180°C. **Always confirm with a thermometer** in the thickest part, away from the bone.
5. **Rest 20 minutes**, loosely tented. Make gravy from the tin while it rests.

## Butterflied leg (fast)

Flat on a tray or over BBQ coals, skin/fat side to the heat first. 220°C or medium-high coals, ~15 minutes a side, target 56°C, rest 10. A marinade — garlic, lemon, oregano, oil — for a few hours first.

## Per person & buying

Bone-in: 350–450g raw per person (a 2–2.5kg leg feeds 5–6). Boneless: 250–300g. See [how much meat per person](/blog/how-much-meat-per-person/). All our [lamb roasts](/lamb/roasts/) are Australian grass-fed; bone, roll or butterfly on request.`,
    faqs: [
      { question: "How long do you roast a leg of lamb?", answer: "After a 20-minute sear at 220°C, drop to 180°C: about 18 minutes per 500g for medium-rare (56–58°C), 22 min/500g for medium. A 2kg bone-in leg to medium-rare is roughly 90 minutes total. Always confirm with a thermometer and rest 20 minutes." },
      { question: "Bone-in or boneless leg of lamb — which is better?", answer: "Bone-in has slightly better flavour and stays a touch more even; boneless carves into clean slices, cooks faster, and can be stuffed. For an easy first roast, have the leg boned and rolled, or butterflied for a quick cook." },
      { question: "What temperature should roast lamb be?", answer: "52°C for rare, 56–58°C for medium-rare (the classic pink roast), 62°C for medium, 70°C for well done. Pull the roast 3°C below target — it climbs while resting." },
      { question: "How much leg of lamb per person?", answer: "Bone-in: 350–450g raw per person, so a 2–2.5kg leg feeds 5–6. Boneless: 250–300g per person. Buy slightly bigger for leftovers and more even cooking." },
    ],
    cta: { label: "Shop lamb roasts →", href: "/lamb/roasts/", note: "Grass-fed leg of lamb — bone-in, rolled or butterflied." },
  },
  {
    slug: "corned-beef-silverside-guide",
    title: "Corned Beef & Silverside: How to Cook It So It's Not Dry",
    excerpt: "Simmer vs slow cooker, the liquid, how long per kilo, and what to do with the leftovers.",
    category: "Recipes",
    date: "2026-05-13",
    updated: "2026-09-02",
    readTime: "4 min read",
    image: "/images/corned-beef-silverside.webp",
    primaryKeyword: "how to cook corned beef",
    seoTitle: "How to Cook Corned Beef & Silverside So It's Not Dry",
    metaDescription: "How to cook corned beef silverside so it stays tender — simmer vs slow cooker, the liquid, how long per kilo, and what to do with the leftovers.",
    secondaryKeywords: ["corned silverside", "corned beef slow cooker", "how long to cook corned beef", "corned beef cooking liquid", "silverside recipe"],
    content: `[Corned silverside](/beef/roasts/) is silverside (or brisket) cured in a salt-and-spice brine. It's cheap, forgiving and freezes well cooked. The one way to ruin it is to boil it hard or slice it hot.

## The cooking liquid

Cover the corned beef with cold water and add: 1 quartered onion, 2 bay leaves, 1 tbsp brown sugar, 1 tbsp malt or brown vinegar, 6 peppercorns, 4 cloves. The sugar and vinegar balance the salt and keep the meat tender; skip them and it can taste harsh.

Some people add a splash of the brine from the pack — fine, but taste first, it can be very salty.

## Stovetop

Bring to a bare simmer (never a rolling boil — that toughens it), then **cook gently, covered, 45–50 minutes per 500g**. A 1.5kg piece is about 2.5 hours. It's done when a skewer slides in with light resistance.

## Slow cooker

Same liquid, **low for 8–9 hours or high for 4–5**. The most hands-off method and hard to overdo.

## The rest — don't skip it

Turn off the heat and let the meat sit **in its liquid for 20–30 minutes** before lifting it out. Slice against the grain. Slicing it straight from the pot loses all the juice.

## White sauce & leftovers

Classic accompaniment: a parsley white sauce or a mustard sauce made with some of the cooking liquid. Leftovers: corned beef hash, a Reuben, fritters, or sliced cold in sandwiches for a week. It freezes well sliced.

## Buying

Our [corned silverside](/beef/roasts/) is Australian grass-fed, brined in-house without added phosphates. Also great as a bulk buy in a [beef share](/wholesale/bulk-meat-orders/bulk-beef/).`,
    faqs: [
      { question: "How long do you cook corned beef?", answer: "On the stovetop at a bare simmer: 45–50 minutes per 500g, so about 2.5 hours for a 1.5kg piece. In a slow cooker: 8–9 hours on low or 4–5 on high. It's done when a skewer slides in with light resistance." },
      { question: "Why is my corned beef tough or dry?", answer: "Usually a hard boil (keep it at a bare simmer), or slicing it straight out of the pot. Let the cooked meat rest in its liquid for 20–30 minutes, then slice against the grain." },
      { question: "What do you put in the water for corned beef?", answer: "Cold water to cover, plus a quartered onion, 2 bay leaves, 1 tbsp brown sugar, 1 tbsp malt or brown vinegar, peppercorns and a few cloves. The sugar and vinegar balance the cure's saltiness and keep the meat tender." },
      { question: "Can you freeze cooked corned beef?", answer: "Yes — it freezes well sliced, for up to 3 months. It's also excellent cold in sandwiches for about a week, or in hash and fritters." },
    ],
    cta: { label: "Shop corned silverside →", href: "/beef/roasts/", note: "Grass-fed silverside, brined in-house — no added phosphates." },
  },
  {
    slug: "nitrate-free-bacon-explained",
    title: "Nitrate-Free Bacon: What the Label Really Means",
    excerpt: "Nitrates vs nitrites, why 'uncured' bacon still contains them, and what to look for if you want genuinely additive-free bacon and ham.",
    category: "Meat Education",
    date: "2026-06-10",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/streaky-bacon.webp",
    primaryKeyword: "nitrate free bacon",
    metaDescription: "Nitrate free bacon, explained — nitrates vs nitrites, why 'uncured' bacon still contains them, and what to look for if you want genuinely additive-free bacon.",
    secondaryKeywords: ["preservative free bacon", "uncured bacon", "bacon without nitrates", "is nitrate free bacon better", "additive free bacon australia"],
    content: `"Nitrate-free" and "uncured" bacon labels are among the most misunderstood in the shop. Here's the honest version.

## Nitrates, nitrites and why bacon uses them

Curing salts contain **sodium nitrite** (and sometimes nitrate, which converts to nitrite). They do three jobs: prevent *Clostridium botulinum* (botulism) in cured meat, fix the pink colour, and create the "bacon" flavour. The food-safety job is the important one.

## "Uncured" / "no added nitrates" — the catch

Most bacon labelled "uncured" or "no added nitrates or nitrites" is still cured — just with **celery juice or celery powder** instead of a measured curing salt. Celery is naturally very high in nitrate, which bacteria in the cure convert to nitrite. The end product can contain **similar or even higher** nitrite levels than conventionally cured bacon, with less precision about the dose.

So "uncured bacon" is largely a labelling technicality, not a nitrate-free product.

## What genuinely additive-free bacon looks like

Truly nitrate/nitrite-free bacon exists but it's different:

- It's **grey-brown when cooked**, not pink — there's no nitrite to fix the colour.
- It has a **shorter shelf life** and must be kept properly cold.
- It tastes more like **salted, smoked pork** than classic bacon.
- The label will say something like "cured with salt only" or "salt and sugar cure, no nitrates or nitrites, no celery".

## Our position

Mr Meat & Co [bacon](/pork/bacon-ham/) is available in a **salt-and-sugar cure with no added nitrates, nitrites or celery powder** — genuinely additive-free, sold clearly as such, with the shorter shelf life that implies. We also carry a lightly-cured traditional bacon. Both are Australian pork, and neither is water-pumped.

## Should you care?

For most people, occasional conventionally-cured bacon is not a meaningful health concern — the WHO's processed-meat classification is about regular high intake. If you eat bacon most days, or you're avoiding nitrites specifically, the salt-only cure is worth seeking out. Just know what you're getting: it's a different product, not the same bacon with the "bad bit" removed.

Browse [bacon and ham](/pork/bacon-ham/).`,
    faqs: [
      { question: "Is 'uncured' or 'nitrate-free' bacon actually free of nitrates?", answer: "Usually not. Most 'uncured' bacon is cured with celery juice or celery powder, which is naturally very high in nitrate that bacteria convert to nitrite — often to similar or higher levels than conventional curing salt, with less dose control." },
      { question: "What does genuinely nitrate-free bacon look like?", answer: "It's grey-brown when cooked rather than pink, has a shorter shelf life, tastes more like salted smoked pork, and the label says it's cured with salt only — no nitrates, nitrites or celery powder." },
      { question: "Is nitrate-free bacon healthier?", answer: "For occasional eaters the difference is small — the health concern with processed meat is about regular high intake. If you eat bacon most days or are specifically avoiding nitrites, a true salt-only cure is worth it, but it's a genuinely different product." },
      { question: "Does Mr Meat & Co sell additive-free bacon?", answer: "Yes — a salt-and-sugar cure with no added nitrates, nitrites or celery powder, sold clearly as such with the shorter shelf life that implies. We also carry a lightly-cured traditional bacon. Both are Australian pork and neither is water-pumped." },
    ],
    cta: { label: "Shop bacon & ham →", href: "/pork/bacon-ham/", note: "Salt-cured and traditional bacon — Australian pork, no water added." },
  },
  {
    slug: "grass-fed-vs-grain-fed-beef",
    title: "Grass-Fed vs Grain-Fed Beef: Taste, Nutrition & What the Labels Mean",
    excerpt: "The real differences between grass-fed and grain-fed beef, what 'grass-fed' legally means in Australia, and which to buy for which dish.",
    category: "Meat Education",
    date: "2026-07-08",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/categories/beef.webp",
    primaryKeyword: "grass fed vs grain fed beef",
    seoTitle: "Grass-Fed vs Grain-Fed Beef: Taste, Nutrition, Labels",
    metaDescription: "Grass-fed vs grain-fed beef — the real differences in taste and nutrition, what 'grass-fed' legally means in Australia, and which to buy for which dish.",
    secondaryKeywords: ["is grass fed beef better", "grass fed beef australia", "grain fed beef", "what does grass fed mean", "pasture raised beef"],
    content: `Every beef label in Australia says grass-fed, grain-fed, grain-finished or pasture-raised. Here's what actually separates them.

## The systems

**Grass-fed (pasture-raised):** the animal eats pasture and forage its whole life. In Australia this is the majority system — our climate suits it. Cattle grow more slowly, so they're typically older at slaughter.

**Grain-fed:** cattle are raised on pasture, then moved to a feedlot for a "finishing" period (60–120+ days) on a grain ration. Faster weight gain, more consistent marbling, a milder flavour. Most premium restaurant Wagyu and Angus is grain-finished.

**Grain-finished** means the same as grain-fed — a short grain period at the end.

## What "grass-fed" legally means here

Australia has a **voluntary certified standard** (the Pasture-fed Cattle Assurance System, PCAS) that requires a lifetime pasture diet, no feedlot, no added hormones (HGP-free) and no antibiotics for growth. Not all "grass-fed" beef is PCAS-certified, but the term generally means no feedlot finishing. Our beef is Australian grass-fed.

## Taste

- **Grass-fed:** more mineral, "beefier", a yellower fat (from beta-carotene in grass), firmer texture. Rewards a good sear and medium-rare.
- **Grain-fed:** milder, sweeter, softer, whiter fat, more even marbling. More forgiving for people who cook steak to medium-well.

Neither is "better" — it's a flavour preference. Many people who think they don't like grass-fed have just overcooked it.

## Nutrition

Grass-fed beef is modestly higher in **omega-3s, CLA and vitamin E**, and often slightly leaner. The differences are real but not dramatic — beef is not a major omega-3 source either way. The bigger nutritional story is the cut you choose and the portion size.

## Which to buy

- **Fast, high-heat cooking (steaks, stir-fry):** grass-fed if you'll cook it medium-rare; grain-fed if you like it more done.
- **Low and slow (brisket, cheek, ragu):** grass-fed — the deeper flavour carries a long cook, and marbling matters less.
- **Mince and burgers:** grass-fed chuck has plenty of flavour; the fat ratio matters more than the feed.

Browse [grass-fed beef](/beef/) or read [Australian beef cuts explained](/blog/australian-beef-cuts-explained/).`,
    faqs: [
      { question: "Is grass-fed beef better than grain-fed?", answer: "Neither is objectively better — it's a flavour preference. Grass-fed is more mineral and 'beefy' with firmer texture and yellower fat; grain-fed is milder, sweeter and softer with more even marbling. Grass-fed is modestly higher in omega-3s and CLA." },
      { question: "What does grass-fed mean in Australia?", answer: "It generally means the cattle ate pasture and forage their whole life with no feedlot finishing. The voluntary PCAS certification goes further, requiring a lifetime pasture diet, no added hormones and no antibiotics for growth." },
      { question: "Why is grass-fed beef fat yellow?", answer: "Beta-carotene from fresh grass is stored in the fat, giving it a creamy-yellow colour. Grain-fed cattle eat little green forage in the finishing period, so their fat is whiter. Yellow fat is a sign of a grass diet, not a fault." },
      { question: "Does grass-fed beef taste gamey?", answer: "It shouldn't. It has a stronger, more mineral beef flavour than grain-fed, but not a gamey one. If grass-fed beef tastes off to you, it's most often been overcooked — try it medium-rare with a proper rest." },
    ],
    cta: { label: "Shop grass-fed beef →", href: "/beef/", note: "100% Australian grass-fed beef — steaks, roasts, mince & more." },
  },
  {
    slug: "bone-broth-from-beef-bones",
    title: "Bone Broth From Beef Bones: A Simple, Gelatin-Rich Method",
    excerpt: "Which bones to use, why you roast them first, the vinegar question, and how to get a broth that sets like jelly.",
    category: "Recipes",
    date: "2026-08-02",
    updated: "2026-09-02",
    readTime: "5 min read",
    image: "/images/beef-marrow-bones.webp",
    primaryKeyword: "bone broth from beef bones",
    metaDescription: "Bone broth from beef bones — which bones to use, why you roast them first, the vinegar question, and how to get a broth that sets like jelly.",
    secondaryKeywords: ["beef bone broth recipe", "which bones for bone broth", "how to make bone broth", "beef stock bones", "gelatin bone broth"],
    content: `A good beef broth should **set to a wobble in the fridge** — that's the collagen turning to gelatine. Getting there is about bone choice and time, not much else.

## Which bones

Use a mix:

- **Knuckle and joint bones** — the collagen. These are what make it set.
- **Marrow bones** — richness and fat. [Beef marrow bones here](/beef/offal/).
- **Meaty bones** — shin, neck, oxtail, short rib — flavour and body. A little meat on the bones makes a huge difference.
- **Optional:** a split trotter or two for extra gelatine.

Aim for **roughly half collagen-rich bones, half meaty bones**. Ask us for a "bone broth mix".

## The method

1. **Roast the bones.** 220°C for 30–40 minutes until deep brown. This is the difference between a pale, flat broth and a deep, savoury one. Roast an onion (skin on), a carrot and a stick of celery alongside for the last 20 minutes.
2. **Into the pot.** Bones and vegetables, cover with cold water by 5cm. Add 2 bay leaves, a few peppercorns, and **2 tbsp of vinegar** (apple cider or white) — the acid helps extract minerals and doesn't affect the taste at that dose.
3. **Barely simmer, lid ajar.** Skim the grey foam in the first 30 minutes. Then leave it: **12–24 hours** on the stove's lowest setting, or a slow cooker on low, or a pressure cooker for 3 hours.
4. **Top up** with hot water if the bones ever poke above the surface.
5. **Strain**, cool, then lift the fat off the top once cold (keep it for cooking).

## Will it set?

If you used enough collagen-rich bones and simmered long enough, chilled broth will be jelly-firm. If it's liquid, it still tastes great — next time use more knuckle/joint bones and less water.

## Storage

Fridge 5 days. Freeze in jars (leave headspace) or ice-cube trays for 6 months. Reduce it hard first if freezer space is tight — add water back when you use it.

## Buying

We sell [beef marrow bones, knuckle and shin](/beef/offal/) and a ready "bone broth mix". These are human-grade — for the [dog version see pet bones](/pet-food/bones/).`,
    faqs: [
      { question: "Which bones make the best bone broth?", answer: "A mix of collagen-rich bones (knuckle, joint) for the gel and meaty bones (shin, neck, oxtail, short rib) for flavour — roughly half and half. A marrow bone or two adds richness. Ask your butcher for a 'bone broth mix'." },
      { question: "Why roast bones before making broth?", answer: "Roasting the bones (and some vegetables) at 220°C for 30–40 minutes builds deep, savoury flavour and colour. Unroasted bones give a pale, flat-tasting broth." },
      { question: "Do you need vinegar in bone broth?", answer: "Add about 2 tablespoons of apple cider or white vinegar per large pot. The acid helps draw minerals from the bones and doesn't affect the flavour at that amount. It's helpful but not essential." },
      { question: "Why didn't my bone broth set?", answer: "Not enough collagen-rich bones, too much water, or not enough time. Chilled broth sets to a jelly when you've used plenty of knuckle and joint bones and simmered 12–24 hours. Liquid broth still tastes great — just adjust next batch." },
    ],
    cta: { label: "Shop broth bones & marrow →", href: "/beef/offal/", note: "Beef marrow, knuckle & shin — human-grade bone broth mix." },
  },
  {
    slug: "christmas-ham-glaze-guide",
    title: "Christmas Ham: How to Score, Glaze & Serve a Whole Leg",
    excerpt: "Choosing the ham, removing the skin without wrecking the fat, three glazes, and the timing so it's warm for lunch.",
    category: "Recipes",
    date: "2026-08-16",
    updated: "2026-09-02",
    readTime: "6 min read",
    image: "/images/leg-ham-off-the-bone.webp",
    primaryKeyword: "christmas ham glaze",
    seoTitle: "Christmas Ham Glaze: How to Score, Glaze & Serve",
    metaDescription: "Three Christmas ham glaze recipes plus method — choosing the ham, removing the skin without wrecking the fat, and the timing so it's warm for lunch.",
    secondaryKeywords: ["how to glaze a ham", "ham glaze recipe", "how to score a ham", "whole leg ham", "buy christmas ham"],
    content: `A [whole leg ham](/christmas-ham/) is already fully cooked — your job is just to skin it, score it, glaze it and warm it through. It's the least stressful part of Christmas lunch if you plan the timing.

## Choosing the ham

- **Bone-in leg** — the classic. Best flavour, best value per kg, the showpiece. 7–10kg feeds a big crowd with leftovers for a week.
- **Half leg** — same thing, for a smaller table (4–6kg).
- **Boneless leg** — easiest to carve, slightly less flavour, good if carving space is tight.

Order early — [Christmas hams](/christmas-ham/) sell out, and you want it delivered a few days ahead, not on the 24th.

## Skin and score

1. Run a knife around the shank end, then slide your fingers under the skin and peel it back in one piece, leaving the fat layer intact. Keep the skin — lay it back over the leftover ham to stop it drying.
2. **Score the fat** in a diamond pattern, ~2cm apart, about 5mm deep — into the fat, not the meat.
3. Stud each diamond with a clove if you like (optional).

## Three glazes (for a whole leg)

- **Classic brown sugar:** 1.5 cups brown sugar, ½ cup honey, ⅓ cup Dijon, 2 tbsp orange juice. Whisk to a paste.
- **Maple-mustard:** 1 cup maple syrup, ⅓ cup wholegrain mustard, 2 tbsp cider vinegar, pinch of clove.
- **Marmalade-whisky:** 1 cup orange marmalade, ¼ cup whisky, 2 tbsp brown sugar, warmed to loosen.

## Cook

1. Ham on a rack in a deep tray, 1 cup water in the base. 160°C.
2. Brush a first coat of glaze. Bake 20 minutes.
3. Re-glaze every 15–20 minutes, **3–4 coats total**, until deep amber and lacquered — about **1.5–2 hours for a 7–9kg leg** (you're heating it through to ~55°C in the centre, and building the crust).
4. If the top isn't dark enough, 5 minutes under the grill — watch it.
5. **Rest 20 minutes** before carving.

## Serve & store

Serve warm or at room temperature. Store the leftover ham wrapped in a damp tea towel or a ham bag (not plastic) in the fridge, re-dampening the cloth every couple of days — it keeps 2 weeks. The bone makes the best [pea and ham soup](/pork/) or a stock.

Order your [Christmas ham](/christmas-ham/) now for December delivery.`,
    faqs: [
      { question: "How do you glaze a Christmas ham?", answer: "Skin the ham, score the fat in a 2cm diamond pattern, then bake at 160°C brushing on glaze every 15–20 minutes for 3–4 coats until deep amber — about 1.5–2 hours for a 7–9kg leg. Finish under the grill for 5 minutes if needed, then rest 20 minutes." },
      { question: "Do you need to cook a Christmas ham?", answer: "A whole leg ham is already fully cooked and cured. You're only skinning, scoring, glazing and warming it through to about 55°C in the centre while building the lacquered crust. It can also be served cold." },
      { question: "How do you store leftover ham?", answer: "Wrap it in a damp tea towel or a cotton ham bag — not plastic — and keep it in the fridge, re-dampening the cloth every couple of days. It keeps about two weeks. Lay the reserved skin back over the cut face to stop it drying." },
      { question: "What size Christmas ham do I need?", answer: "A 7–10kg bone-in leg feeds a large crowd with a week of leftovers. A half leg (4–6kg) suits a table of 4–6. Order early — hams sell out and you want it delivered a few days before, not on Christmas Eve." },
    ],
    cta: { label: "Order a Christmas ham →", href: "/christmas-ham/", note: "Whole and half leg hams — order now for December delivery." },
  },
  {
    slug: "what-is-angus-beef",
    title: "What Is Angus Beef? Breed, Grading & Why It's Prized",
    seoTitle: "What Is Angus Beef? Breed, Marbling & Why It's Prized",
    excerpt: "Angus is a cattle breed, not a cut or a grade. Here's what makes Angus and Angus-cross beef different, how it's graded, and why our beef is Angus.",
    category: "Meat Education",
    date: "2026-09-11",
    readTime: "5 min read",
    image: "/images/scotch-fillet-steak.webp",
    primaryKeyword: "angus beef",
    metaDescription: "What is Angus beef? The Angus cattle breed explained — marbling, grading, Angus vs Angus-cross, and why our grass-fed beef comes from Angus cattle.",
    secondaryKeywords: ["angus cattle meat", "black angus beef", "australian black angus beef", "is angus beef good", "angus cross beef"],
    content: `"Angus beef" gets used loosely, but it's simple once you know what it actually means: Angus is a breed of cattle, not a cut, a grade, or a farming method. It sits alongside grass-fed and dry-aged as one more thing that affects how your steak turns out — not a replacement for either.

## Angus is a breed

Aberdeen Angus originated in north-east Scotland and was brought to Australia in the 1800s. It's a naturally polled (hornless), predominantly black breed, bred for generations to marble well and finish efficiently on pasture. Because Angus genetics marble more consistently than many other breeds, "Angus" became shorthand in butchery and menus for reliably good beef — even though within any breed, individual animals still vary.

## Angus vs Angus-cross

Very little Australian beef is 100% purebred Angus from birth to plate. Most premium Australian beef — including ours — is **Angus or Angus-cross**: cattle bred from Angus bulls over a commercial cow herd, carrying enough Angus genetics to get the marbling and eating-quality benefit while staying suited to Australian pasture conditions. This is completely standard practice and is what most butchers and supermarkets mean when they say "Angus beef" unless they specifically say "purebred" or "full-blood."

## What Angus genetics actually change

- **Marbling** — the fine flecks of intramuscular fat that baste the meat as it cooks and carry flavour. Angus cattle marble more readily than most other British and European breeds.
- **Consistency** — because the breed has been selected for this trait for so long, an Angus-influenced animal is more likely to grade well than an unselected one.
- **Tenderness** — marbling and consistent finishing both help here, though how the animal is raised (grass-fed vs grain-finished) and how the meat is aged still matter just as much.

What Angus genetics **don't** change: whether the animal was grass-fed or grain-finished, whether it had added hormones, or how it was cut and packed. Those are separate questions — see our [grass-fed vs grain-fed guide](/blog/grass-fed-vs-grain-fed-beef/) for that half of the picture.

## "Certified Angus Beef" vs Angus beef

You may have seen "Certified Angus Beef" — that's a specific branded program (originally American) with its own marbling and carcase specifications, separate from simply being an Angus-cross animal. We don't use that trademarked program; when we say our beef is Angus or Angus-cross, we mean the genetics, not a third-party certification stamp.

## Our beef

Mr Meat & Co's beef is Australian, grass-fed and pasture-raised, from Angus and Angus-cross cattle — HGP-free with no feedlot grain finishing. Angus genetics are why the marbling holds up on cuts like [scotch fillet and porterhouse](/beef/steaks/) even without grain finishing. Browse the [full beef range](/beef/) or read our [Australian beef cuts guide](/blog/australian-beef-cuts-explained/) for what to do with each one.`,
    faqs: [
      { question: "Is Angus a breed or a grade?", answer: "A breed. Angus cattle originated in Scotland and were bred for generations to marble well and finish efficiently on pasture. It isn't a cut, a certification, or a farming method." },
      { question: "What's the difference between Angus and Angus-cross beef?", answer: "Purebred Angus is 100% Angus genetics from birth. Angus-cross is bred from Angus bulls over a commercial herd, carrying enough Angus genetics for the marbling benefit. Most Australian \"Angus beef\", including ours, is Angus or Angus-cross — that's standard industry practice, not a lesser product." },
      { question: "Is Angus beef better than regular beef?", answer: "Angus genetics tend to marble more consistently than many other breeds, which generally means more even flavour and tenderness. But how the animal was raised — grass-fed vs grain-finished, and how it's aged — matters just as much as the breed." },
      { question: "Is your beef Angus?", answer: "Yes — our beef is Australian, grass-fed and pasture-raised, from Angus and Angus-cross cattle, HGP-free with no feedlot grain finishing." },
    ],
    cta: { label: "Shop grass-fed Angus beef →", href: "/beef/", note: "Australian, grass-fed, Angus and Angus-cross — cut fresh in Alexandria." },
  },
  {
    slug: "what-is-wagyu-beef",
    title: "What Is Wagyu Beef? F1 vs Full-Blood, Grading & How to Cook It",
    seoTitle: "What Is Wagyu Beef? F1 vs Full-Blood & Grading",
    excerpt: "Wagyu is a breed, not a grade. Here's what F1 and full-blood actually mean, how marbling and grading work, and how to cook it without wasting the marbling.",
    category: "Meat Education",
    date: "2026-09-11",
    readTime: "6 min read",
    image: "/images/scotch-fillet-steak.webp",
    primaryKeyword: "wagyu beef",
    metaDescription: "What is Wagyu beef? The Wagyu cattle breed explained — F1 vs full-blood, marbling and grading, and how to cook Wagyu steak without wasting the marbling.",
    secondaryKeywords: ["f1 wagyu", "wagyu steak", "wagyu meat", "full blood wagyu", "what is f1 wagyu"],
    content: `"Wagyu" gets used as a byword for expensive steak, but like Angus, it's a breed name first. What varies enormously — and what actually determines the price you pay — is how much Wagyu genetics an animal carries and how it graded.

## Wagyu is a breed, not a grade

Wagyu (literally "Japanese cattle") is a group of Japanese cattle breeds developed over centuries for one trait above all: the ability to marble intramuscular fat far more heavily than most other cattle. That marbling is what gives Wagyu its buttery texture and low melting point.

## F1 vs full-blood vs purebred

This is the distinction that actually matters for your wallet:

- **F1 Wagyu** — first-cross: one Wagyu parent, one non-Wagyu parent (commonly Angus in Australia). Roughly half Wagyu genetics. This is the most common tier sold by Australian butchers and the one we carry — real marbling lift over standard beef, at a fraction of full-blood pricing.
- **Full-blood Wagyu** — both parents are Wagyu, but the animal isn't necessarily born or raised in Japan. Heavier marbling than F1, priced accordingly.
- **Purebred / Japanese Wagyu (Kobe, A5, etc.)** — specific Japanese bloodlines and regional certification programs (Kobe beef is a protected designation, not a generic term) with the highest marbling and the highest price. Very little of this reaches Australian retail, and "Kobe-style" on a menu almost never means the real, certified product.

Most beef marketed simply as "Wagyu beef" in Australia — including most restaurant and butcher Wagyu — is F1. That's not a downgrade; it's the practical, everyday tier of a breed that gets exponentially more expensive as the Wagyu percentage climbs.

## How marbling is graded

Australia uses the **AUS-MEAT marbling score** (0–9+), assessed on the cut face of the ribeye. Standard grass-fed beef typically sits at 0–2. F1 Wagyu commonly grades in the 4–6 range — a clear step up. Full-blood and Japanese Wagyu can reach 7–9+, where the marbling is so heavy the meat looks almost pink-white rather than red. Higher isn't always "better" for every dish — a heavily marbled steak is rich in small portions but can feel one-note if you're used to a leaner steak.

## Does the extra marbling change how you cook it?

Yes, a little. The higher fat content makes Wagyu more forgiving than a lean cut, but it still rewards restraint:

- **Season simply** — just salt. Wagyu's flavour is the point; heavy marinades and sauces waste it.
- **Cook hot and fast** — a hot pan or grill renders the surface fat and marbling quickly without overcooking the centre.
- **Pull it at medium-rare** — around 52–55°C internal. Past medium, the rendered fat starts to taste greasy rather than rich.
- **Rest it** — as long as you cooked it, so the fat re-sets through the meat instead of pooling on the board.
- **Portion smaller** — because Wagyu is richer, 150–200g per person is usually enough, versus 200–250g for a standard steak.

## Our Wagyu

We carry **F1 Wagyu** — Wagyu genetics over the same grass-fed Angus base as the rest of our beef — in scotch fillet, porterhouse, rump and mince. Browse the [Wagyu range](/beef/wagyu/), or for the base breed behind it, read [what is Angus beef](/blog/what-is-angus-beef/).`,
    faqs: [
      { question: "What does F1 Wagyu mean?", answer: "First-cross — one Wagyu parent, one non-Wagyu parent (commonly Angus in Australia), so roughly half Wagyu genetics. It's the most common Wagyu tier sold in Australia, offering a real marbling lift over standard beef without full-blood pricing." },
      { question: "Is Wagyu a grade or a breed?", answer: "A breed. Wagyu ('Japanese cattle') is a group of Japanese cattle breeds developed for exceptionally heavy marbling. Grading (like AUS-MEAT marble score 0–9+) measures how much that genetic trait shows up in a specific animal." },
      { question: "What's the difference between F1 and full-blood Wagyu?", answer: "F1 is roughly half Wagyu genetics (one Wagyu parent); full-blood means both parents are Wagyu. Full-blood carries heavier marbling and costs significantly more. Purebred Japanese Wagyu (Kobe, A5) sits above both again, and rarely reaches Australian retail in genuine form." },
      { question: "How should I cook Wagyu steak?", answer: "Simply — salt only, hot and fast in a pan or on the grill, pulled at medium-rare (52–55°C internal), then rested as long as it cooked. The extra marbling is forgiving, but overcooking past medium turns the rendered fat greasy instead of rich." },
    ],
    cta: { label: "Shop F1 Wagyu →", href: "/beef/wagyu/", note: "Scotch fillet, porterhouse, rump and mince — F1 Wagyu over our grass-fed Angus base." },
  },
];

export const PAGES = {
  about: true,
  faq: true,
  blog: true,
  wholesale: true,
  search: true,
};

/* ------------------------------------------------------------------ *
 * PAGE_SEO — per-URL on-page SEO (from the keyword strategy).
 * Keyed by canonical path (with leading + trailing slash).
 * Category / subcategory / landing pages read this for their title,
 * meta description, H1, keyword-rich intro and an FAQ block (which is
 * also emitted as FAQPage JSON-LD). Pages without an entry fall back
 * to sensible defaults.
 * ------------------------------------------------------------------ */
export interface PageSeo {
  title: string;
  description: string;
  h1?: string;
  intro?: string;
  primaryKeyword?: string;
  supportingKeywords?: string[];
  faqs?: FAQItem[];
  /** Optional long-form buying/cooking guide (markdown) rendered under the
   *  product grid. Adds depth, keyword-bearing H3s and outbound links. */
  guide?: string;
}

export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "Meat Box Delivery & Craft Butcher — Mr Meat & Co",
    description: "Meat box delivery from an Australian craft butcher — grass-fed beef, free-range chicken, lamb and pork, cut fresh in Sydney, cold-chain across NSW and nationwide.",
    h1: "Grass-Fed Meat Boxes & Craft Butcher Cuts, Delivered",
    primaryKeyword: "meat box",
    supportingKeywords: ["meat box delivery", "butcher box", "meat subscription", "grass fed meat delivery", "online butcher australia"],
    faqs: [
      { question: "Where do you deliver?", answer: "Refrigerated cold-chain vans cover the whole of NSW — Sydney Metro plus regional runs including Wollongong and the Central Coast. Everywhere else in Australia is served by frozen express courier. Orders are packed cold so the box is still cold at your door." },
      { question: "What's the minimum order for delivery?", answer: "$300 AUD. Orders over $300 get free temperature-controlled delivery anywhere in NSW; interstate orders over $300 pay only a quoted frozen-courier freight fee." },
      { question: "Is all your meat Australian and grass-fed?", answer: "Our beef and lamb are 100% Australian grass-fed and pasture-raised. Chicken is free-range, pork is Australian, and everything is cut or ground fresh in our Alexandria butchery with no added water, fillers or preservative." },
      { question: "How does the 10% discount work?", answer: "Pay with cryptocurrency (Bitcoin or Tether/USDT) and 10% comes off your order total automatically. PayID and bank transfer are also accepted with no card surcharge, but no discount." },
      { question: "Can I order a meat box or a subscription?", answer: "Yes — choose from family, value, premium-steak, lean meal-prep and BBQ boxes, or build your own. Boxes can be ordered one-off or on a repeat schedule." },
      { question: "Can I buy wholesale or in bulk?", answer: "Yes — quarter, half and whole carcass shares and 5–10kg cartons are on our Bulk Meat & Animal Shares page, for households with freezer space and for restaurants and caterers." },
    ],
  },
  "/shop/": {
    title: "Buy Meat Online Australia — Shop All Cuts | Mr Meat & Co",
    description: "Buy meat online in Australia — grass-fed beef, free-range chicken, lamb, pork, sausages, BBQ packs, seafood, specialty and raw pet food. Cut fresh, delivered cold.",
    h1: "Shop All Fresh Meat — Beef, Lamb, Chicken, Pork & More",
    primaryKeyword: "buy meat online",
    supportingKeywords: ["meat online", "online butcher", "order meat online australia", "fresh meat delivery", "butcher box online"],
    faqs: [
      { question: "How fresh is the meat when it arrives?", answer: "Cut or ground the day it's dispatched and chilled to 0–2°C before packing. Mince and sausages keep 2–3 days in the fridge, steaks and chops 3–5, whole-muscle roasts 4–6 — freeze anything beyond that." },
      { question: "What areas do you deliver to?", answer: "All of NSW by refrigerated cold-chain van — Sydney Metro plus regional runs including Wollongong and the Central Coast. Everywhere else in Australia is served by frozen express courier, with freight quoted at checkout." },
      { question: "Can I filter by cut, cooking style or price?", answer: "Yes — the shop filters by category and subcategory, by cut and cooking style (steaks, mince, slow-cook, BBQ, ready-to-cook), by attributes like grass-fed and high-protein, and by price band." },
    ],
  },
  "/wholesale/": {
    title: "Wholesale Meat Supplier Sydney | Mr Meat & Co",
    description: "Wholesale meat supplier in Sydney — bulk cartons, carcass shares, custom cut sheets and standing weekly supply for restaurants, clubs and caterers.",
    h1: "Wholesale Meat Supplier — Bulk Cartons & Trade Supply",
    primaryKeyword: "wholesale meat supplier",
    supportingKeywords: ["restaurant meat supplier sydney", "bulk meat supplier", "trade meat supply", "butcher wholesale", "commercial meat supplier"],
    intro: "Mr Meat & Co is a wholesale meat supplier for Sydney restaurants, clubs, pubs and caterers — shop bulk cartons, freezer packs and whole or half animal shares online at fixed AUD pricing, or submit a trade application for a custom cut sheet and standing weekly supply. Everything is cut and ground fresh in our Alexandria butchery, delivered by refrigerated cold-chain van across NSW and by frozen express courier nationwide.",
    faqs: [
      { question: "Is there a minimum order for wholesale?", answer: "Listed bulk cartons and animal shares can be added to cart at the standard $300 site minimum. Standing trade accounts are set up from around 50kg per week — submit the trade application and our butchery team will send a rate sheet." },
      { question: "Do you deliver wholesale orders outside Sydney?", answer: "Yes. Refrigerated cold-chain vans run six days a week across NSW — Sydney Metro plus regional runs including Wollongong and the Central Coast. Interstate trade orders are dispatched snap-frozen by express courier with freight quoted per order." },
      { question: "Can you cut to our specification?", answer: "Yes — custom fat ratios on mince (80/20, 85/15, 75/25), portion weights on steaks, and full cut sheets on carcass shares. Tell us your prep and service needs in the trade application." },
      { question: "What payment terms do you offer trade accounts?", answer: "New accounts order prepaid by PayID or bank transfer. Crypto settlement (BTC or USDT) earns the 10% instant discount. Standing accounts with a delivery history can request 7-day terms." },
      { question: "Do you supply restaurants and food service directly?", answer: "Yes — restaurants, clubs, pubs, caterers and meal-prep businesses. You get a named contact in the butchery, a fixed weekly price sheet, and consistent cut specs run to run." },
    ],
    guide: "## Choosing a wholesale meat supplier\n\nA wholesale meat supplier is judged on three things: consistency of the cut, reliability of the cold chain, and how easy it is to get a real person on the phone when an order changes. Mr Meat & Co runs all three out of one butchery in Alexandria, so the person cutting your order is the person you brief.\n\n### Bulk cartons vs standing supply\n\nFor a cafe, a small venue or a meal-prep run, the listed bulk cartons and freezer packs are the simplest path — fixed price, add to cart, delivered cold. For a venue putting through 50kg or more a week, a standing trade account is better value: you get a weekly price sheet, locked cut specs, and priority on the delivery run.\n\n### Carcass shares for value\n\nQuarter, half and whole beef, lamb, pork and goat shares give the lowest per-kilo price of anything we sell. They suit gastropubs and caterers who can use the whole animal across a menu, and households with freezer space. Every share is broken down to your cut sheet, vacuum-sealed and snap-frozen.\n\n### Cold chain and compliance\n\nEvery wholesale order is temperature-logged from the butchery to your door. Beef and lamb are graded for eating quality under Meat Standards Australia and cut to AUS-MEAT language, and the whole operation is run to Food Standards Australia & New Zealand requirements. Ask for the current specification sheet with your first quote.",
  },
  "/beef/": {
    title: "Buy Beef Online — Grass-Fed Australian Beef | Mr Meat & Co",
    description: "Buy beef online — grass-fed Australian steaks, roasts, fresh mince, slow-cook cuts, BBQ and offal, cut fresh in Alexandria. Cold-chain NSW-wide, bulk beef too.",
    h1: "Grass-Fed Australian Beef, Cut Fresh & Delivered",
    primaryKeyword: "buy beef online",
    supportingKeywords: ["grass fed beef online", "beef delivery sydney", "wholesale beef", "australian angus beef", "australian beef delivered"],
    intro: "Buy beef online from a craft butcher — every cut 100% Australian grass-fed and pasture-raised, from Angus and Angus-cross cattle, from marbled scotch fillet and porterhouse to fresh mince ground daily, slow-cook brisket and cheek, and BBQ favourites. No added hormones, no feedlot finishing.",
    faqs: [
      { question: "Is your beef grass-fed and Australian?", answer: "Yes — 100% Australian grass-fed and pasture-raised for the life of the animal, HGP-free (no added hormones), with no feedlot grain finishing." },
      { question: "Is your beef Angus?", answer: "Yes — Angus and Angus-cross cattle, which is what gives the marbling and consistency our steaks are known for even without grain finishing." },
      { question: "How is beef packed for delivery?", answer: "Vacuum-sealed or butcher-wrapped, labelled by cut, chilled to 0–2°C and packed with coolant sized to your order and the forecast, then delivered on refrigerated vans across Sydney." },
      { question: "What beef cuts do you sell?", answer: "Steaks (scotch fillet, porterhouse, eye fillet, rump, T-bone), roasts (rib, topside, silverside), mince and diced, slow-cook cuts (brisket, cheek, shin, oxtail, short rib) and offal." },
      { question: "Can I buy beef in bulk or by the quarter?", answer: "Yes — quarter, half and whole beef shares are on our bulk beef page, custom cut to your sheet and snap-frozen, plus 5kg and 10kg mince boxes." },
    ],
  },
  "/chicken/": {
    title: "Free-Range Chicken — Breast, Thigh & Mince | Mr Meat & Co",
    description: "Free range chicken delivered across Australia — breast and thigh fillets, drumsticks, wings, whole birds, chicken mince and crumbed schnitzel. Bulk cartons too.",
    h1: "Free-Range Australian Chicken, Delivered Fresh",
    primaryKeyword: "free range chicken",
    supportingKeywords: ["buy chicken online", "buy chicken breast australia", "chicken thigh fillets", "chicken mince", "whole chicken delivery", "bulk chicken breast"],
    intro: "Free range chicken from Australian farms — breast and thigh fillets, drumsticks and wings, whole roasting birds, freshly ground chicken mince, and crumbed schnitzel. Buy by the pack or in bulk breast and schnitzel cartons for meal prep and events.",
    faqs: [
      { question: "Is your chicken free-range?", answer: "Yes — our chicken is Australian free-range, raised with outdoor access, delivered fresh chilled across Sydney." },
      { question: "Do you sell chicken in bulk or by the carton?", answer: "Yes — bulk chicken breast fillets, thigh fillets, drumsticks, wings and 5kg crumbed schnitzel boxes are on our bulk chicken page, at a lower per-kg price." },
      { question: "What's the difference between thigh fillets and thigh cutlets?", answer: "Thigh fillets are boneless and skinless — quick to cook, great for stir-fries and curries. Thigh cutlets are bone-in (skin on or off) — more flavour, better for roasting and braising." },
      { question: "How is chicken delivered and stored?", answer: "Fresh chilled, vacuum-packed or tray-wrapped, delivered cold. Use within 2–3 days or freeze in portions; always cook chicken through to 74°C." },
    ],
  },
  "/lamb/": {
    title: "Buy Lamb Online — Australian Grass-Fed Lamb | Mr Meat & Co",
    description: "Buy lamb online — Australian grass-fed loin chops and cutlets, leg and shoulder roasts, shanks and neck, lamb mince and BBQ cuts. Cold-chain delivery, wholesale too.",
    h1: "Australian Grass-Fed Lamb, Cut Fresh & Delivered",
    primaryKeyword: "buy lamb online",
    supportingKeywords: ["buy lamb online", "australian lamb delivered", "wholesale lamb", "grass fed lamb", "lamb delivered sydney"],
    intro: "Buy lamb online — sweet, tender Australian grass-fed lamb: loin chops, cutlets and chump chops, bone-in and boneless leg roasts, shoulder, shanks and neck for the slow cooker, plus lamb mince and marinated BBQ cuts.",
    faqs: [
      { question: "Where does your lamb come from?", answer: "Australian farms, grass-fed and pasture-raised. Lamb is typically hogget-young for tenderness and a clean, sweet flavour." },
      { question: "How much is lamb per kg?", answer: "It varies by cut — mince and forequarter chops are the value end, cutlets and racks the premium end. A half or whole lamb share brings the average per-kg price down significantly." },
      { question: "What's the cheapest lamb cut for slow cooking?", answer: "Forequarter chops, neck chops, shanks and lamb ribs — all full of connective tissue that turns silky over a long, low braise, and all a fraction of the price of chops or a rack." },
      { question: "Do you sell half or whole lamb?", answer: "Yes — half and whole lamb carcass shares are on our bulk lamb page, broken down to your cut sheet, vacuum-sealed and snap-frozen." },
    ],
  },
  "/pork/": {
    title: "Buy Pork Online — Australian Pork Delivered | Mr Meat & Co",
    description: "Buy pork online — Australian belly and ribs, leg and shoulder roasts for crackling, chops and steaks, fresh pork mince, plus bacon and ham. Cold-chain delivery.",
    h1: "Australian Pork, Cut Fresh & Delivered",
    primaryKeyword: "buy pork online",
    supportingKeywords: ["buy pork online australia", "pork wholesale", "pork delivered sydney", "australian pork", "buy pork mince online"],
    intro: "Buy pork online — Australian rind-on belly and American-style ribs, leg and shoulder roasts scored for crackling, loin and scotch steaks, fresh pork mince, and our own bacon and ham. Ask us to score any roast for the perfect crackle.",
    faqs: [
      { question: "Is your pork Australian?", answer: "Yes — 100% Australian pork. Look for the country-of-origin label; a lot of supermarket ham and bacon is imported, ours is not." },
      { question: "How much is pork shoulder?", answer: "Pork shoulder (scotch/neck) is one of the best-value cuts in the shop — see the current price on the roasts and chops pages. It's the go-to for pulled pork and slow roasts." },
      { question: "Do you sell bacon and ham?", answer: "Yes — streaky and middle bacon, leg ham off the bone, and whole and half Christmas hams in season. We offer a salt-cured bacon with no added nitrates as well as a traditional cure." },
      { question: "Where can I buy pork bones for stock or broth?", answer: "Pork bones — trotters, neck bones and hock — are available to order for stock and broth. Ask for a bone mix; they're also great split between a pot of broth and the dog." },
    ],
  },
  "/sausages/": {
    title: "Butcher Sausages — Beef, Pork, Chicken & Lamb | Mr Meat & Co",
    description: "Butcher sausages made in-house — thick and thin beef, pork and fennel, chicken and herb, lamb and rosemary, gourmet flavours. No fillers, gluten-free options, bulk too.",
    h1: "Handmade Butcher Sausages, No Fillers",
    primaryKeyword: "butcher sausages",
    supportingKeywords: ["sausage meat", "butcher sausages near me", "gourmet sausages", "sausages in bulk", "gluten free sausages"],
    intro: "Butcher sausages made in-house from named cuts and real seasoning — thick and thin beef snags, Italian pork and fennel, chicken and herb, lamb and rosemary, merguez and more. Sausage meat (no casing) also available for sausage rolls and stuffing.",
    faqs: [
      { question: "What's in your sausages — any fillers or preservatives?", answer: "Meat, fat, seasoning and a natural casing. No cereal bulking beyond a little rusk in the traditional recipes, nothing pumped in to add weight, and no artificial preservative numbers. Ask for the specific recipe of any sausage." },
      { question: "Are your sausages gluten-free?", answer: "Several are — the gluten-free range uses no rusk or wheat filler. They're labelled clearly; check the product page or ask us." },
      { question: "Can I buy sausages in bulk for a BBQ or event?", answer: "Yes — 5kg and 10kg sausage cartons are on the bulk sausages page, and we can make custom flavours for larger events with notice." },
      { question: "What sausage flavours do you make?", answer: "Beef (thick, thin, chipolata), pork (plain, Italian, sage), chicken (herb, lemon and tarragon), lamb (rosemary, merguez), plus rotating gourmet flavours. Sausage meat without the casing is available too." },
    ],
  },
  "/bbq-grill/": {
    title: "BBQ Meat Packs & Grill Cuts, Delivered | Mr Meat & Co",
    description: "BBQ meat packs — steak packs, sausage packs, ribs, skewers and burger patties, portioned to feed the room and delivered cold. Custom BBQ packs for parties.",
    h1: "BBQ Meat Packs & Grill Cuts",
    primaryKeyword: "bbq meat pack",
    supportingKeywords: ["bbq meat pack", "bbq meat packs delivered", "buy meat for bbq", "family bbq pack", "bbq meat delivery"],
    intro: "BBQ meat packs with everything for the grill in one order — mixed steak packs, sausage packs, pork and beef ribs, marinated skewers and kebabs, and house burger patties. Packs are portioned to feed a set number of people; we'll build a custom pack for a party.",
    faqs: [
      { question: "What's in a BBQ meat pack?", answer: "A typical family BBQ pack has a mix of sausages, marinated skewers, burger patties and a steak or two — roughly 250–350g of meat per adult. The contents are listed on each pack's page." },
      { question: "How many people does a BBQ pack feed?", answer: "Each pack states how many it serves. As a guide, plan 250–350g of meat per adult when meat is the main event, half that for kids, plus 15% if there's little other food." },
      { question: "Can I get a BBQ pack delivered for the weekend?", answer: "Yes — order by our cut-off and choose a Friday or Saturday delivery window across Sydney Metro." },
      { question: "Do you do custom BBQ packs for parties?", answer: "Yes — tell us headcount and any preferences and we'll build a pack (and a quote) for 20, 50 or 100+ guests." },
    ],
  },
  "/meat-boxes/": {
    title: "Butcher Boxes — Family, Value & Premium | Mr Meat & Co",
    description: "Butcher boxes of grass-fed beef, lamb, free-range chicken and pork — family boxes, value freezer packs, premium steak boxes, meal-prep and BBQ boxes, or build your own.",
    h1: "Meat Boxes, Delivered Across Sydney",
    primaryKeyword: "butcher box",
    supportingKeywords: ["meat box delivery", "family meat box", "meat subscription", "value meat pack", "premium steak box", "build your own meat box"],
    intro: "Butcher boxes curated from grass-fed beef, lamb, free-range chicken and pork — family boxes for the week's dinners, value freezer packs, premium steak boxes, high-protein meal-prep boxes, and BBQ boxes. Order once or set a repeat schedule.",
    faqs: [
      { question: "What's in each meat box?", answer: "Every box lists its exact contents and approximate total weight on its page. Family boxes lean to mince, sausages, chicken and a roast; premium boxes are steak-heavy; meal-prep boxes are lean cuts and mince." },
      { question: "How much meat is in a family box?", answer: "Family boxes range from about 5kg to 10kg of packed meat depending on the size you choose — roughly a week to a fortnight of dinners for a family of four." },
      { question: "Do you offer a meat box subscription?", answer: "Yes — any box can be set to repeat weekly, fortnightly or monthly, and you can skip or change a delivery any time." },
      { question: "Can I customise or build my own box?", answer: "Yes — the Build a Box option lets you choose the cuts and quantities and hit the minimum order however you like." },
      { question: "How is a meat box delivered and how long does it keep?", answer: "Packed cold with coolant, delivered on refrigerated vans across Sydney. Freeze what you won't cook within 2–5 days; the box is designed to portion straight into the freezer." },
    ],
  },
  "/ready-to-cook/": {
    title: "Ready-to-Cook Meat — Schnitzel, Kebabs | Mr Meat & Co",
    description: "Ready-to-cook meat — chicken, beef, pork and veal schnitzel crumbed fresh, marinated cuts, kebabs and burger patties. Delivered cold, gluten-free crumb available.",
    h1: "Ready-to-Cook — Schnitzels, Marinated Cuts & Kebabs",
    primaryKeyword: "ready to cook meat",
    supportingKeywords: ["ready made meals delivered", "marinated meat delivery", "oven ready meals", "crumbed chicken", "heat and eat meals"],
    intro: "Ready-to-cook meat, chef-prepped for the pan or oven — chicken, beef, pork and veal schnitzel crumbed fresh each day, marinated lamb and chicken cuts, kebabs and skewers, and house burger patties. A gluten-free crumb is available across the schnitzel range.",
    faqs: [
      { question: "Are your schnitzels crumbed fresh?", answer: "Yes — pounded, coated in a three-stage flour-egg-crumb and rested each day in our Alexandria kitchen. Not frozen-and-thawed." },
      { question: "Do you have gluten-free crumbed options?", answer: "Yes — a gluten-free crumb across the chicken, beef and veal schnitzel range, using no wheat flour or breadcrumb." },
      { question: "How do I cook a schnitzel — oven or pan?", answer: "Pan-frying in a few millimetres of hot oil gives the best crunch. The air-fryer at 200°C is fastest for one or two; the oven at 220°C is best for a crowd. Internal temp 74°C for chicken." },
      { question: "What marinated cuts do you sell?", answer: "Honey-soy chicken thigh, Portuguese and peri-peri drumsticks, Greek and rosemary lamb, Mediterranean lamb chops and more — rotating through the seasons." },
    ],
  },
  "/specialty-meat/": {
    title: "Buy Specialty Meat Online — Kangaroo, Venison | Mr Meat & Co",
    description: "Buy specialty meat online in Australia — kangaroo, venison, wild boar, rabbit, goat, rose veal and crocodile. Delivered cold NSW-wide and frozen nationwide.",
    h1: "Specialty & Game Meat",
    primaryKeyword: "buy specialty meat online",
    supportingKeywords: ["exotic meat australia", "kangaroo meat", "venison", "rabbit meat", "goat meat", "wild meat delivery"],
    intro: "Buy specialty meat online — the cuts you won't find at the supermarket: lean Australian kangaroo, farmed venison and wild boar, rabbit, goat, rose veal, and crocodile and emu. Wild-harvested and farmed, delivered NSW-wide and frozen nationwide.",
    faqs: [
      { question: "What specialty and game meats do you stock?", answer: "Kangaroo, venison, wild boar, rabbit, goat, rose veal, plus crocodile and emu. Cuts range from steaks and fillets to mince, sausages, osso buco and curry pieces." },
      { question: "Is the game meat farmed or wild?", answer: "Kangaroo is wild-harvested under government quota. Venison and rabbit are farmed. Wild boar is wild-harvested. All from licensed processors." },
      { question: "How do I cook lean game meat without drying it out?", answer: "Fast cuts (backstrap, fillet, kangaroo steak) — hot and quick, rare to medium-rare, then rest. Tough cuts (shoulder, shank, diced) — a slow 2–3 hour braise with added fat. Never cook lean game past medium." },
      { question: "Do you deliver specialty meat Australia-wide?", answer: "Yes. Cold-chain van delivery covers all of NSW; specialty and game orders to the rest of Australia are shipped snap-frozen by express courier." },
    ],
  },
  "/seafood/": {
    title: "Buy Seafood Online — Prawns, Salmon, Fish | Mr Meat & Co",
    description: "Buy seafood online — raw and cooked prawns, Tasmanian salmon portions, Australian barramundi and white fish. Snap-frozen at source, delivered with your meat order.",
    h1: "Fresh & Frozen Seafood, Delivered",
    primaryKeyword: "buy seafood online",
    supportingKeywords: ["buy prawns", "buy salmon", "barramundi for sale", "seafood delivery sydney", "fresh prawns"],
    intro: "Buy seafood online alongside your meat order — green (raw) and cooked king, tiger and banana prawns, skin-on and skinless Tasmanian salmon portions, barramundi fillets and portions, and white fish. Snap-frozen at the source for peak freshness.",
    faqs: [
      { question: "Is your seafood fresh or frozen?", answer: "Both. Most prawns and fish are snap-frozen within hours of the catch — often fresher than 'fresh' cabinet stock that has been thawed. We also carry genuinely fresh lines in season." },
      { question: "Where is your barramundi and salmon from?", answer: "Barramundi is Australian (farmed and wild lines). Salmon is Tasmanian. Country and method are on each product page." },
      { question: "How much are prawns per kg?", answer: "It moves with the season and species — banana prawns are the value buy, tiger mid-range, king prawns premium, and prices rise in December. See the prawns page for current pricing." },
      { question: "Can I get seafood delivered with my meat order?", answer: "Yes — seafood ships in the same cold-chain box, packed so the frozen items don't thaw the chilled meat and vice versa." },
    ],
  },
  "/pet-food/": {
    title: "Raw Dog Food & BARF Delivery — Pet Mince | Mr Meat & Co",
    description: "Raw dog food delivered frozen — pet mince in beef, chicken and kangaroo, raw meaty bones, and offal for BARF and prey-model diets. Human-grade, prepared separately.",
    h1: "Raw Pet Food — Mince, Bones & Offal",
    primaryKeyword: "raw dog food",
    supportingKeywords: ["raw dog food sydney", "pet mince", "raw meat dog food delivery", "barf diet", "kangaroo mince for dogs"],
    intro: "Raw dog food that makes raw feeding simple — pet mince in beef, chicken and kangaroo (some with ground bone), raw meaty bones matched to your dog's size, and secreting offal for the 80/10/10 ratio. Delivered frozen, kept completely separate from the human range.",
    faqs: [
      { question: "Is this raw pet food or for human consumption?", answer: "It's prepared as pet food and labelled as such, though it's made from the same quality Australian meat. It's produced and packed separately from our retail range." },
      { question: "What proteins do you offer for raw feeding?", answer: "Beef, chicken and kangaroo pet mince (plain or with ground bone), plus offal and raw meaty bones. Kangaroo is the go-to novel protein for dogs with chicken or beef allergies." },
      { question: "How do I transition my dog to raw?", answer: "Either fast 12–24 hours then start raw, or swap 25% at a time over about two weeks for sensitive stomachs. Start with one protein, then add bone, then offal. See our raw feeding starter guide." },
      { question: "How is raw pet food delivered?", answer: "Frozen, in the cold-chain box, separate from any human-food items in your order. Keep it frozen, thaw in the fridge, and feed within two days of thawing." },
      { question: "How much raw mince per day for my dog?", answer: "About 2–3% of ideal body weight — roughly 375g a day for a 15kg dog to maintain weight, 750g for a 30kg dog. Puppies eat more, split across 3–4 meals." },
    ],
  },

  /* ---- subcategories ---- */
  "/beef/mince-diced/": {
    title: "Beef Mince Delivered — Lean & Extra-Lean | Mr Meat & Co",
    description: "Beef mince ground daily in Alexandria — premium 80/20, lean and extra-lean, plus diced beef. No added water or fillers. Buy beef mince online or in 5kg / 10kg bulk.",
    h1: "Fresh Beef Mince — Ground Daily",
    primaryKeyword: "beef mince",
    supportingKeywords: ["lean beef mince", "extra lean beef mince", "beef mince price per kg", "buy beef mince online", "diced beef", "1kg beef mince"],
    intro: "Beef mince ground fresh every day from whole-muscle chuck and rump — premium 80/20 for everyday cooking, lean 90/10 and extra-lean 95/5 for meal prep and meatballs, and diced beef for slow cooks. Nothing added.",
    faqs: [
      { question: "What fat ratio is your beef mince?", answer: "Premium is about 80/20 (ground from chuck), lean around 90/10, extra-lean around 95/5 (rump and topside). Every pack is labelled with its real ratio." },
      { question: "Is your beef mince ground fresh?", answer: "Yes — daily, from whole muscle cuts, with no added water, cereal filler or preservative." },
      { question: "How much is beef mince per kg?", answer: "Grass-fed premium mince is around $16–20/kg delivered in Sydney; extra-lean sits higher. 5kg and 10kg bulk boxes bring the per-kg price down." },
      { question: "Can I buy beef mince in bulk?", answer: "Yes — 5kg and 10kg bulk mince boxes on the bulk beef page, snap-frozen in 1kg portions." },
    ],
    guide: "Beef mince is the most-cooked cut in the Australian kitchen, and the fat ratio changes everything about how the dish behaves.\n\n### Reading the fat ratio\n\nRatio is written lean-to-fat. **95/5 – 90/10 (extra-lean and lean beef mince):** meatballs, koftas, meal-prep, anything simmered in sauce — holds shape, low shrinkage, but dries out if grilled. **80/20 (premium):** the all-rounder for bolognese, cottage pie, tacos and san choy bau — enough fat for flavour without a greasy pan. Our mince is ground fresh every day from whole-muscle chuck and rump, with no added water or fillers, and each batch is labelled with its real ratio. Diced beef (chuck, gravy beef) is for slow cooks and curries.\n\n### Cooking beef mince well\n\nBrown mince hard in a wide, hot pan in batches — crowding steams it grey and washes out flavour. Don't drain all the fat if it is going into a sauce. Because grinding mixes surface bacteria through the meat, beef mince must be cooked right through to 71°C — there is no safe medium-rare mince, unlike a whole steak; this follows the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance. Store below 4°C and use within two to three days, or freeze flat in meal-size portions.",
  },
  "/beef/steaks/": {
    title: "Buy Steak Online — Scotch, Porterhouse, Fillet | Mr Meat & Co",
    description: "Buy steak online — grass-fed scotch fillet, porterhouse, eye fillet, rump and T-bone, cut to your thickness. Whole eye fillet and striploin too. Delivered cold.",
    h1: "Grass-Fed Beef Steaks, Cut to Order",
    primaryKeyword: "buy steak online",
    supportingKeywords: ["scotch fillet steak", "porterhouse steak", "eye fillet steak", "buy whole eye fillet", "rump steak", "t-bone steak"],
    intro: "Buy steak online, cut to your thickness — richly marbled scotch fillet, fine-grained porterhouse, tender eye fillet, full-flavoured rump and the bone-in T-bone. Whole eye fillet and striploin available for home carving.",
    faqs: [
      { question: "Are your steaks aged?", answer: "Our beef is wet-aged in the bag for tenderness; selected cuts are available dry-aged on request. Ask us for current dry-aged availability." },
      { question: "What's the difference between scotch fillet and porterhouse?", answer: "Scotch fillet (ribeye) is from the fore-rib — more marbled and forgiving. Porterhouse (sirloin) is from the loin — firmer, leaner and beefier, with a fat cap on one edge." },
      { question: "How thick are the steaks cut?", answer: "Standard is 2.5cm; we'll cut to 2cm or 3cm+ on request, or leave a piece whole for you to portion." },
      { question: "Do you sell whole eye fillet or striploin?", answer: "Yes — whole (unportioned) eye fillet, striploin and rump are available, which works out cheaper per kg than pre-cut steaks." },
    ],
    guide: "Buy steak online and the cut you choose decides the method — a marbled scotch fillet and a lean eye fillet want completely different handling.\n\n### Choosing a steak\n\n**Scotch fillet (ribeye)** is the most marbled and forgiving — rich, juicy, hard to overcook. **Porterhouse (sirloin)** is leaner with a firm bite and a fat strip to crisp. **Eye fillet** is the most tender and the leanest, so it is the easiest to dry out. **Rump** is full-flavoured and better value, best at medium-rare and sliced against the grain. **T-bone** gives you fillet and sirloin on one bone. We cut to your thickness — 2.5–3cm is the sweet spot for a good crust and a pink centre.\n\n### Cooking steak\n\nDry the surface, oil the meat, season with salt, and get the pan or grill genuinely hot. As a guide for a 3cm steak: 3–4 minutes a side for medium-rare (an internal 52–55°C), then rest for as long as you cooked it. Leaner cuts (eye fillet, rump) should be pulled a few degrees earlier; scotch can take a little more. Australian beef is graded for eating quality — you can read how [MSA grading](https://www.mla.com.au/marketing-beef-and-lamb/meat-standards-australia/) works on the MLA site.",
  },
  "/beef/wagyu/": {
    title: "Wagyu Steak Online — F1 Wagyu Beef | Mr Meat & Co",
    description: "Wagyu steak online — F1 Wagyu scotch fillet, porterhouse, rump and mince, from Wagyu-cross Australian cattle over our grass-fed Angus base. Cut fresh, delivered cold.",
    h1: "F1 Wagyu Steak, Cut Fresh & Delivered",
    primaryKeyword: "wagyu steak",
    supportingKeywords: ["wagyu beef", "f1 wagyu", "shop wagyu beef", "online wagyu", "wagyu beef steaks", "best wagyu beef"],
    intro: "Wagyu steak online — our F1 Wagyu range crosses Wagyu genetics over the same grass-fed Angus cattle as the rest of our beef, for noticeably heavier marbling at an approachable price. Scotch fillet, porterhouse, rump and mince, cut fresh in Alexandria and delivered cold.",
    faqs: [
      { question: "What does \"F1 Wagyu\" mean?", answer: "F1 means first-cross — the animal has one Wagyu parent and one non-Wagyu parent (in our case, Angus), so it's roughly half Wagyu genetics. It's the most common tier of Wagyu sold in Australia and gives a real marbling lift over standard beef without full-blood Wagyu pricing." },
      { question: "Is F1 Wagyu as good as full-blood Wagyu?", answer: "It's a different tier, not a lesser one — F1 Wagyu carries noticeably more marbling than standard grass-fed beef at a fraction of full-blood or Japanese Wagyu prices. Full-blood and Japanese A5 Wagyu marble further still, at a much higher price point." },
      { question: "Which Wagyu cut should I start with?", answer: "Rump if you want to try Wagyu without a big spend — it carries the marbling lift at our lowest Wagyu price. Scotch fillet is the most marbled and forgiving to cook; porterhouse is firmer and leaner-grained." },
      { question: "How should I cook Wagyu steak?", answer: "Simpler than you'd think — season with just salt, get the pan or grill hot, and don't overcook it. The extra marbling means Wagyu is more forgiving than a lean steak, but pulling it at medium-rare (52–55°C internal) still gives the best result." },
    ],
    guide: "F1 Wagyu is the entry point into Wagyu beef for most Australians, and it's worth understanding what you're actually buying before you pay a Wagyu premium.\n\n### What F1 Wagyu actually is\n\n\"F1\" is a breeding term, not a grade — it means first-cross: one Wagyu parent, one non-Wagyu parent. Our F1 Wagyu is bred from Wagyu genetics over the same grass-fed Angus base as the rest of our beef, so you're getting the marbling lift Wagyu is known for without paying full-blood or imported Japanese Wagyu prices. Full-blood and Japanese A5 Wagyu sit well above F1 on both marbling and price — F1 is the practical, everyday-splurge tier.\n\n### Choosing a cut\n\n**Scotch fillet** carries the most marbling and is the most forgiving to cook — the classic way to try Wagyu. **Porterhouse** is firmer and leaner-grained, still noticeably richer than our standard porterhouse. **Rump** is the value entry point — most of the marbling lift, our lowest Wagyu price. **Mince** brings the same extra fat and richness to burgers and meatballs without the steak price tag.\n\n### Cooking Wagyu\n\nThe extra intramuscular fat makes Wagyu more forgiving than a lean steak, but it still rewards a light touch: season with just salt, sear in a hot pan or on the grill, and pull it at medium-rare (52–55°C internal) so the fat has rendered without drying the meat out. Rest for as long as you cooked it. For the full breed background — F1 vs full-blood, and what the marbling is actually doing — read our [What Is Wagyu Beef?](/blog/what-is-wagyu-beef/) guide.",
  },
  "/beef/slow-cook/": {
    title: "Slow Cook Beef — Brisket, Cheek & Shin | Mr Meat & Co",
    description: "Slow cook beef cuts built for the braise, smoker and slow cooker — brisket, beef cheek, gravy beef / shin, oxtail, short rib and chuck. Grass-fed, delivered cold.",
    h1: "Beef for Slow Cooking & Braising",
    primaryKeyword: "slow cook beef",
    supportingKeywords: ["beef brisket", "beef cheeks", "gravy beef", "beef osso buco", "beef short ribs", "chuck steak slow cook"],
    intro: "Slow cook beef — the collagen-rich cuts that turn silky over a long, low cook: whole and portioned brisket for the smoker, beef cheek for the richest braise, gravy beef and shin to thicken a stew, oxtail, short rib and chuck.",
    faqs: [
      { question: "What's the best beef cut for a slow cooker?", answer: "Chuck is the most forgiving all-rounder; beef cheek gives the silkiest result; shin or gravy beef thickens the sauce by itself. Avoid lean cuts like rump — they dry out." },
      { question: "How big is your brisket — whole or portioned?", answer: "Both — whole packer briskets (point and flat, ~4–6kg) for the smoker, and portioned pieces for the oven or slow cooker." },
      { question: "Do you sell beef cheeks?", answer: "Yes — trimmed beef cheeks, two per pack, ideal for a red-wine braise. They're one of the best-value premium-eating cuts in the shop." },
    ],
  },
  "/lamb/chops-cutlets/": {
    title: "Lamb Chops & Cutlets Delivered — Grass-Fed | Mr Meat & Co",
    description: "Lamb chops and cutlets delivered — Australian grass-fed loin chops, frenched cutlets, chump chops, forequarter and BBQ chops, plus lamb rack. Cut fresh.",
    h1: "Lamb Chops & Cutlets — Grass-Fed",
    primaryKeyword: "lamb chops",
    supportingKeywords: ["lamb cutlets", "lamb loin chops", "lamb forequarter chops", "lamb chump chops", "lamb chops price per kg", "lamb rack"],
    intro: "Lamb chops for every method — grass-fed tender loin chops and frenched cutlets for a fast, hot grill, meatier chump chops, and value forequarter and BBQ chops that reward a marinade and a lower heat.",
    faqs: [
      { question: "What's the difference between a lamb chop and a cutlet?", answer: "A cutlet is from the rack — small, lean, with a long frenched bone. A loin chop is a mini T-bone with a tender eye and a strip of belly. Chump chops come from the rump and are larger and meatier." },
      { question: "How much are lamb chops per kg?", answer: "Cutlets and rack are the premium end; loin chops mid-range; forequarter and BBQ chops the value buy. A whole lamb share averages the per-kg price down." },
      { question: "Which lamb chop is best for the grill vs slow cook?", answer: "Loin chops and cutlets for a fast, hot grill (2–3 minutes a side). Forequarter and neck chops for a marinated grill or a low braise." },
      { question: "How many lamb chops per kg?", answer: "Roughly 6–8 loin chops or 10–14 cutlets per kg, depending on thickness." },
    ],
    guide: "Lamb chops cover a lot of ground — from the tender loin chop you grill in three minutes to the meaty forequarter chop that wants a marinade and a lower heat.\n\n### Which lamb chop for which method\n\n**Loin chops** (little T-bones) and **frenched cutlets** (from the rack) are the premium fast-grill cuts — high heat, 2–3 minutes a side, pull at medium. **Chump chops** are meatier and a touch chewier, good on the grill or pan. **Forequarter and BBQ chops** are the value cuts: more fat and connective tissue, so they shine with an overnight marinade and a slower cook, or braised. A whole **lamb rack** roasts in 20–25 minutes for a small centrepiece.\n\n### Cooking lamb chops\n\nBring chops to room temperature, pat dry, oil the meat and season with salt just before cooking. For loin chops and cutlets, a screaming-hot pan or grill, 2–3 minutes a side to an internal 60–63°C for medium, then rest 5 minutes — lamb fat is best rendered and lightly charred. Stand fatty chops on their edge briefly to crisp the fat strip. Forequarter chops can go 4–5 minutes a side over lower heat. Australian lamb is graded for eating quality under [MSA grading](https://www.mla.com.au/marketing-beef-and-lamb/meat-standards-australia/).",
  },
  "/lamb/mince-diced/": {
    title: "Lamb Mince Delivered — Fresh & Lean | Mr Meat & Co",
    description: "Lamb mince and diced lamb, ground and cut daily in Alexandria — Australian grass-fed, standard and lean. Ideal for koftas, meatballs, ragu and curry. Buy online.",
    h1: "Fresh Lamb Mince & Diced Lamb",
    primaryKeyword: "lamb mince",
    supportingKeywords: ["lean lamb mince", "buy minced lamb online", "diced lamb", "lamb mince price", "lamb stir-fry strips"],
    intro: "Lamb mince ground fresh daily — grass-fed, standard and lean — plus diced lamb and stir-fry strips. The base of a proper kofta, a Greek-style pastitsio, or a rich lamb ragu.",
    faqs: [
      { question: "What's the fat content of your lamb mince?", answer: "Standard lamb mince is around 80/20; lean lamb mince is closer to 90/10. Both are ground fresh from Australian grass-fed lamb." },
      { question: "Is lamb mince good for koftas and meatballs?", answer: "Yes — lamb mince binds and holds shape well with a little grated onion and spice, and stays moist thanks to its fat. It's the traditional choice for kofta, keftedes and lamb meatballs." },
      { question: "Can I buy lamb mince in bulk?", answer: "Yes — bulk lamb mince is part of the bulk lamb and lamb variety pack range on the wholesale page." },
    ],
    guide: "Lamb mince is the base of a proper kofta, a Greek pastitsio, a shepherd's pie or a spiced ragù — richer and more aromatic than beef.\n\n### Lamb mince or diced lamb?\n\nOur lamb mince is Australian grass-fed, ground fresh daily — standard for koftas, meatballs, moussaka and ragù, and a leaner grind for people watching fat. Diced lamb and stir-fry strips (from the shoulder and leg) are for curries, tagines and skewers where you want pieces that hold their shape over a longer cook.\n\n### Cooking with lamb mince\n\nLamb fat sets hard when it cools, so serve dishes made with lamb mince hot, and skim rendered fat from a slow-cooked ragù before serving. For koftas and meatballs, work the mince with grated onion, salt and spices until slightly tacky, then rest it in the fridge for 30 minutes so it holds on the skewer or in the pan. Brown mince hard in a hot pan in batches for the best flavour. Cook lamb mince right through to 71°C — there is no safe rare for any mince, per the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance. Keep it below 4°C and use within two to three days, or freeze in portions.\n\n### How much lamb mince to buy\n\nAllow about 125g of lamb mince per person for koftas or meatballs as a main, 150g for a moussaka or shepherd's pie, and roughly 100g per person when it is one element of a mezze spread. Lamb mince freezes well for up to 3 months — portion it flat so it thaws quickly.\n\n### Spice partners for lamb\n\nLamb's richness stands up to strong spice: cumin, coriander, cinnamon and allspice for Middle Eastern koftas; ras el hanout for a tagine-style mince; rosemary, garlic and lemon for a Greek or Italian treatment. A little grated onion worked into raw kofta mix both seasons and tenderises it. Diced lamb from the shoulder is the better choice than leg for anything slow-cooked, because the extra connective tissue keeps it moist.",
  },
  "/lamb/roasts/": {
    title: "Leg of Lamb & Lamb Roasts — Grass-Fed | Mr Meat & Co",
    description: "Leg of lamb and lamb roasts — bone-in and boneless leg, rolled shoulder, and frenched rack. Boned, rolled or butterflied on request. Grass-fed, delivered cold.",
    h1: "Lamb Roasts — Leg, Shoulder & Rack",
    primaryKeyword: "leg of lamb",
    supportingKeywords: ["bone in leg of lamb", "boneless leg of lamb", "rolled lamb shoulder", "lamb rack", "lamb roast price"],
    intro: "Leg of lamb and the other centrepiece roasts — bone-in and boneless leg, rolled shoulder for slow roasting, and frenched rack. We'll bone and roll, or butterfly the leg for a fast oven or BBQ cook, at no extra charge.",
    faqs: [
      { question: "Bone-in or boneless leg — which roasts better?", answer: "Bone-in has slightly better flavour and cooks a touch more evenly; boneless carves into clean slices, cooks faster and can be stuffed. Butterflied is fastest of all." },
      { question: "What size leg of lamb for 6 or 8 people?", answer: "Bone-in: about 350–450g raw per person, so a 2–2.5kg leg feeds 5–6 and a 3kg leg feeds 7–8. Boneless: 250–300g per person." },
      { question: "Do you butterfly the leg on request?", answer: "Yes — boned, rolled or butterflied at no extra cost. Just add a note to your order." },
      { question: "How much is a lamb roast?", answer: "Shoulder is the value roast, leg mid-range, rack the premium cut. See current pricing on each product." },
    ],
    guide: "Leg of lamb is the Sunday-roast centrepiece, but the right roast depends on how much time you have and how you like it cooked.\n\n### Choosing a lamb roast\n\n**Bone-in leg** carves traditionally and stays juicier; **boneless (or butterflied) leg** cooks faster and more evenly and is easy to carve — ask us to bone and roll, or butterfly it, at no charge. **Rolled shoulder** is the slow-roast pick: more fat and connective tissue, so it needs longer but rewards you with fall-apart meat. **Frenched rack** is the quick, elegant option for a small table.\n\n### Roasting times\n\nFor a bone-in leg at 180°C, work to roughly 20 minutes per 500g for medium (an internal 60–65°C), plus a 15–20 minute rest. A butterflied leg on a hot BBQ or in a 220°C oven can be done in 25–35 minutes total. Shoulder is different — 3 to 4 hours at 150–160°C, covered, until a fork twists easily. Always rest a roast somewhere warm for at least 15 minutes so the juices redistribute. Meat Standards Australia grades Australian lamb for eating quality; you can read how [MSA grading](https://www.mla.com.au/marketing-beef-and-lamb/meat-standards-australia/) works on the MLA site. All our lamb is Australian grass-fed.",
  },
  "/lamb/slow-cook/": {
    title: "Lamb Shanks & Slow-Cook Lamb — Grass-Fed | Mr Meat & Co",
    description: "Lamb shanks, neck chops, lamb ribs and shoulder for the braise and slow cooker — Australian grass-fed, great value, full of flavour. Delivered cold.",
    h1: "Lamb for Slow Cooking & Braising",
    primaryKeyword: "lamb shanks",
    supportingKeywords: ["lamb ribs", "lamb neck chops", "lamb breast", "diced lamb", "lamb shoulder slow cook"],
    intro: "Lamb shanks and the other cuts that reward time — meaty shanks, neck chops for a curry or tagine, fatty lamb ribs for low-and-slow, and diced shoulder. All Australian grass-fed, all a fraction of the price of chops.",
    faqs: [
      { question: "What's the best lamb cut for a slow-cooked curry or tagine?", answer: "Diced shoulder or neck chops — both full of connective tissue that softens over a 2-hour braise and holds together in the sauce. Shanks for a one-per-person presentation." },
      { question: "How many lamb shanks per person?", answer: "One large shank per person as a main, or two small. They shrink as they braise, so err large." },
      { question: "Are lamb ribs the same as lamb breast?", answer: "They come from the same part of the animal — lamb breast is the whole flap, lamb ribs are that breast cut into bones or a rack. Both are fatty and best cooked low and slow." },
    ],
    guide: "Lamb shanks, neck, ribs and shoulder are the cuts that reward time — collagen-rich, well-marbled, and a fraction of the price of chops.\n\n### Choosing slow-cook lamb\n\n**Lamb shanks** are the classic braise — one per person, cooked until the meat slides off the bone. **Neck chops** (or boneless neck fillet) make the best curry and tagine meat, staying moist through a long cook. **Lamb ribs (breast)** are fatty and cheap, brilliant low-and-slow on the BBQ or roasted hard until the fat crisps. **Diced shoulder** is the all-purpose slow-cook dice for stews and ragù.\n\n### Slow-cooking method\n\nBrown the meat hard first — this is where most of the flavour comes from — then add aromatics and enough liquid to come halfway up. Hold it at the gentlest possible simmer: 2 hours for neck and diced shoulder, 2.5–3 hours for shanks, in the oven at 150–160°C or a low stovetop. It is done when a fork twists with no resistance. Cool leftovers quickly and refrigerate within two hours per the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) rules; braises are better the next day. All our lamb is Australian grass-fed.",
  },
  "/pork/mince/": {
    title: "Pork Mince Delivered — Fresh & Lean | Mr Meat & Co",
    description: "Pork mince ground daily in Alexandria — Australian, standard and lean. Ideal for dumplings, san choy bau, ragu, meatballs and sausage rolls. Buy pork mince online.",
    h1: "Fresh Pork Mince — Ground Daily",
    primaryKeyword: "pork mince",
    supportingKeywords: ["lean pork mince", "buy pork mince online", "pork mince price", "diced pork", "premium pork mince"],
    intro: "Pork mince ground fresh daily — Australian, standard 80/20 for burgers, meatballs and ragu, and lean 90/10 for dumplings, san choy bau and stir-fries where you don't want fat in the pan.",
    faqs: [
      { question: "What's your pork mince fat ratio?", answer: "Standard pork mince is around 80/20; lean pork mince is closer to 90/10. Both are ground fresh from Australian pork." },
      { question: "Is pork mince good for dumplings and san choy bau?", answer: "Yes — lean pork mince is the traditional filling for both. It carries ginger, garlic and soy beautifully and stays juicy without being greasy." },
      { question: "Is bulk pork mince available?", answer: "Yes — bulk pork mince is part of the bulk pork and pork variety pack range on the wholesale page." },
    ],
    guide: "Pork mince is cheaper than beef, cooks faster and carries spice and aromatics beautifully — the backbone of dumplings, larb, ragù, meatballs and sausage rolls.\n\n### Choosing pork mince\n\nOur standard pork mince runs around 80/20 lean-to-fat — the all-rounder for burgers, meatballs, bolognese and sausage rolls, where the fat keeps things juicy. Lean pork mince (around 90/10) is the one for dumplings, san choy bau, stir-fries and anything where rendered fat would pool in the pan or dilute a sauce. All of it is Australian, ground fresh each day from whole-muscle shoulder, with nothing added.\n\n### Cooking pork mince safely and well\n\nBrown pork mince in a hot, wide pan in batches so it sears rather than stews, and don't drain all the fat if it is going into a sauce — that fat is flavour. Pork mince should be cooked right through to 71°C (no pink, juices run clear); unlike a steak there is no safe rare. For dumpling and meatball fillings, mix the raw mince with a little cornflour, soy and cold water or stock and beat it in one direction until sticky — that is what gives a springy, juicy bite. Store it below 4°C and use within two to three days, or freeze in meal-size portions. Cooking temperatures follow the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance.\n\n### Buying pork mince by the dish\n\nFor dumplings and wontons, allow about 100g of lean pork mince per person; for a bolognese or ragù, 125–150g; for sausage rolls, roughly 1kg of filling makes 24 party rolls. Pork mince freezes well for up to 3 months — portion it flat in bags so it thaws in minutes.\n\n### Flavour partners\n\nPork mince is a blank canvas that takes assertive seasoning: fish sauce, white pepper and ginger for Southeast Asian dishes; fennel, garlic and chilli for an Italian-style ragù or a quick 'nduja-style sauce; sage, nutmeg and lemon for a British sausage-roll filling. Because it is milder than beef, don't under-salt it — taste a fried teaspoon of the mix before you commit the whole batch to a terrine or meatball.",
  },
  "/pork/bacon-ham/": {
    title: "Buy Ham Online + Bacon — Australian Pork | Mr Meat & Co",
    description: "Buy ham online — Australian leg ham off the bone, plus streaky and middle bacon and a salt-cured bacon with no added nitrates. Whole Christmas hams in season.",
    h1: "Bacon & Ham — Australian Pork",
    primaryKeyword: "buy ham online",
    supportingKeywords: ["buy sliced ham online", "buy smoked leg ham online", "nitrate free bacon", "streaky bacon", "christmas ham"],
    intro: "Buy ham online — Australian pork leg ham off the bone, plus streaky and middle-cut bacon (traditional cure, or a salt-and-sugar cure with no added nitrates), and whole and half Christmas hams in season. Not water-pumped to inflate weight.",
    faqs: [
      { question: "Is your bacon nitrate-free or preservative-free?", answer: "We offer a salt-and-sugar cure with no added nitrates, nitrites or celery powder — genuinely additive-free, with a shorter shelf life — alongside a lightly-cured traditional bacon. Both are Australian pork, neither is water-pumped." },
      { question: "Do you sell whole Christmas hams?", answer: "Yes — whole and half bone-in leg hams in the lead-up to Christmas. Order early on the Christmas ham page for December delivery." },
      { question: "What's the difference between middle and streaky bacon?", answer: "Middle bacon is the full rasher — the lean eye of the loin plus the streaky belly tail. Streaky bacon is just the belly — fattier, crisps harder, best for wrapping and scattering." },
      { question: "Can I get ham off the bone delivered?", answer: "Yes — leg ham off the bone, sliced or in a piece, delivered cold with your order." },
    ],
    guide: "Buy ham online and buy bacon that is cured properly — real leg ham off the bone, and bacon that hasn't been pumped with water and phosphates to inflate its weight.\n\n### Choosing bacon and ham\n\n**Streaky bacon** (from the belly) crisps hardest and renders the most fat — the choice for a BLT or crumbled over eggs. **Middle bacon** gives you a streaky tail and a leaner eye. We cure with a traditional method, and also offer a salt-and-sugar cure with no added nitrates for people who want it. **Leg ham off the bone** is carved from a whole cooked leg — denser and less watery than a formed, re-pressed ham. **Christmas hams** (whole and half bone-in leg) are available in season.\n\n### Cooking and storing\n\nCook bacon from cold in a cold pan, bringing the heat up slowly so the fat renders before the meat colours. Leg ham is fully cooked — slice and serve, or warm gently. Keep bacon below 4°C and use within a week of opening; sliced ham within 3–5 days. Freeze bacon with paper between rashers. \"Nitrate-free\" and \"uncured\" labelling is more nuanced than it sounds — the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) site explains how curing agents are regulated.",
  },
  "/ready-to-cook/schnitzels/": {
    title: "Chicken Schnitzel Delivered — Beef & Pork Too | Mr Meat & Co",
    description: "Chicken schnitzel crumbed fresh daily, plus beef, pork and veal schnitzel. Delivered cold, gluten-free crumb, parmesan-herb and homestyle. For pan, oven or air-fryer.",
    h1: "Schnitzels — Crumbed Fresh Daily",
    primaryKeyword: "chicken schnitzel",
    supportingKeywords: ["beef schnitzel", "homemade chicken schnitzel", "gluten free chicken schnitzel", "pork schnitzel", "veal schnitzel"],
    intro: "Chicken schnitzel pounded, three-stage-crumbed and rested each day — plus beef, pork and rose-veal schnitzel, in homestyle, parmesan-herb and gluten-free crumbs. Cook from chilled: pan, oven or air-fryer.",
    faqs: [
      { question: "Are schnitzels crumbed fresh in-store?", answer: "Yes — pounded to an even thickness, coated in a three-stage flour-egg-crumb, and rested each day. Not frozen and thawed." },
      { question: "Do you have a gluten-free crumb?", answer: "Yes — a gluten-free crumb across the chicken, beef and veal schnitzel range, with no wheat flour or breadcrumb." },
      { question: "Oven, air-fryer or pan — best method?", answer: "Pan-frying in a few millimetres of hot oil gives the loudest crunch. The air-fryer at 200°C is fastest for one or two. The oven at 220°C fan does a dozen at once. Chicken to 74°C internal." },
      { question: "What protein options are there?", answer: "Chicken, beef, pork and rose veal, in homestyle, parmesan-herb and gluten-free crumbs." },
    ],
    guide: "Chicken schnitzel done right is about the crumb and the cook, not just the meat — a dry, even, three-stage crumb that stays crunchy.\n\n### Choosing schnitzel\n\nOur chicken schnitzel is pounded thin, three-stage-crumbed (flour, egg, crumb) and rested each day so the coating sets. We also do beef, pork and rose-veal schnitzel, in homestyle, parmesan-herb and gluten-free crumbs. Thin and even is the goal — a schnitzel that is thick in the middle either burns outside before it cooks through or comes out dry.\n\n### Cooking schnitzel\n\nCook from chilled. **Pan:** 5–7mm of oil at 170–180°C, 2–3 minutes a side until deep gold, then drain on a rack (not paper, which steams the base). **Oven:** 200°C on a wire rack over a tray, 12–15 minutes, turning once. **Air-fryer:** 190°C for 8–10 minutes, spritzed with oil. Chicken and pork schnitzel need to reach 74°C in the centre; veal and beef can be pulled at 63°C. Rest for a minute before serving so the crumb firms. Cooking temperatures follow the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance. Keep raw crumbed schnitzel below 4°C and cook within two days, or freeze flat.\n\n### How much schnitzel to buy\n\nAllow one large schnitzel (about 150–180g crumbed) per adult, or two smaller ones for a schnitzel-and-salad plate. Crumbed schnitzel freezes well for up to 2 months — freeze it flat on a tray first, then bag, so the pieces don't stick.\n\n### Serving and sides\n\nA squeeze of lemon is the classic, but a schnitzel also carries a topping well: a fried egg (schnitzel \"a la Holstein\"), a tomato-and-mozzarella parmigiana, or a mushroom or Diane-style pan sauce made in the same pan after the schnitzel comes out. Keep sides sharp and simple — a lemony slaw, a rocket salad, or a warm potato salad cut the richness of the crumb.",
  },
  "/bbq-grill/burgers/": {
    title: "Burger Patties — Beef, Wagyu, Lamb & Chicken | Mr Meat & Co",
    description: "Burger patties formed fresh — beef, Wagyu, lamb, chicken and pork, real fat ratio, no fillers. Buy burger patties for the BBQ or a quick dinner.",
    h1: "Burger Patties — No Fillers",
    primaryKeyword: "burger patties",
    supportingKeywords: ["beef patties", "beef burger patties", "wagyu beef patties", "homemade burger patties", "wholesale beef patties"],
    intro: "Burger patties formed fresh from a chuck-and-brisket blend at the right 70/30 fat ratio — plus Wagyu, lamb, chicken-and-chive and pork-and-apple. Just seasoned meat and fat, no egg, crumb or filler.",
    faqs: [
      { question: "What meat are the patties made from — any filler?", answer: "A chuck-and-brisket beef blend at about 70/30, seasoned on the outside only. No egg, breadcrumb, cereal or water. The Wagyu, lamb, chicken and pork patties are the same — meat, fat, seasoning." },
      { question: "What weight are the patties?", answer: "Standard patties are 150–180g each; sliders and thick pub patties on request. Each pack lists patty weight and count." },
      { question: "How many patties per pack?", answer: "Retail packs are 4 or 6; bulk patty boxes (for events) are on the wholesale page." },
    ],
    guide: "Burger patties done properly are just coarsely ground beef and fat, formed with a light hand — no egg, no breadcrumb, no filler.\n\n### What makes a good burger patty\n\nFat ratio is everything: 70/30 to 80/20 lean-to-fat gives a patty that bastes itself as it sears and stays juicy at a safe doneness. A chuck-and-brisket blend is the classic. Our house patties are formed fresh at the right ratio; we also do Wagyu, lamb, chicken-and-chive and pork-and-apple. If you are making your own, ask for a coarse grind and don't over-work the meat — handling it too much makes the patty dense and bouncy.\n\n### Cooking burger patties\n\nSeason the outside with salt just before cooking, press a shallow dimple in the centre so the patty stays flat, and cook over a hot grill or in a heavy pan — two to three minutes a side for a thin patty. Because mince is mixed through, burger patties must be cooked to 71°C in the centre with no pink, per the [Food Standands Australia and New Zealand](https://www.foodstandards.gov.au/) rules — this is different from a whole steak. Rest for a minute, add cheese while it melts against the residual heat, and build on a toasted bun. Store patties below 4°C and use within two days, or freeze with paper between them.\n\n### How many patties, and building the burger\n\nAllow one 150–180g patty per adult, or two smaller 90g patties for a stacked \"smash\" burger. Toast the cut sides of the bun in the pan or on the grill so they don't go soggy under the juices. Add cheese in the last minute so it melts against the residual heat, rest the patty for a minute before building, and keep the stack simple — a great patty doesn't need much more than cheese, pickle, onion and sauce.\n\n### Freezing and thawing\n\nPatties freeze well for up to 3 months with baking paper between them. Thaw in the fridge overnight, not on the bench, and cook within a day of thawing. Never refreeze a raw patty once it has thawed.",
  },
  "/bbq-grill/skewers/": {
    title: "BBQ Skewers & Kebabs — Ready to Grill | Mr Meat & Co",
    description: "BBQ skewers and kebabs delivered — marinated chicken, beef, lamb kofta and mixed skewer packs, threaded fresh on wooden or metal skewers. Ready to grill.",
    h1: "BBQ Skewers & Kebabs",
    primaryKeyword: "bbq skewers",
    supportingKeywords: ["kebab skewers", "marinated chicken skewers", "beef kebabs", "lamb kofta skewers", "mixed bbq skewer pack"],
    intro: "BBQ skewers threaded and marinated fresh — honey-soy and peri-peri chicken, beef and vegetable kebabs, lamb kofta and souvlaki, and a mixed BBQ skewer pack. Ready to hit the grill.",
    faqs: [
      { question: "Are the skewers pre-made and marinated?", answer: "Yes — threaded and marinated in-house, ready to grill straight from the pack. Marinades rotate through the seasons." },
      { question: "Wooden or metal skewers?", answer: "Ours come on wooden skewers (soak them 20 minutes if you're worried about scorching). Metal skewers are reusable and don't burn — we sell those separately." },
      { question: "Can I get a mixed skewer pack?", answer: "Yes — the mixed BBQ skewer pack has chicken, beef and lamb skewers together, portioned to feed a group." },
    ],
    guide: "BBQ skewers and kebabs are threaded and marinated fresh — the fastest way to feed a grill without carving anything.\n\n### Choosing skewers\n\nWe do honey-soy and peri-peri chicken, beef and vegetable kebabs, lamb kofta and souvlaki, and a mixed BBQ skewer pack. Chicken thigh holds up better on a skewer than breast; rump and scotch are the picks for beef. Kofta (spiced lamb mince pressed onto the skewer) cooks fastest of all. Wooden skewers should be soaked for 30 minutes first; metal skewers conduct heat and cook the centre faster.\n\n### Grilling skewers evenly\n\nGet the grill properly hot, oil the bars, and don't crowd them — leave space so the skewers sear rather than steam. Turn every 2–3 minutes for even colour on all four sides. Chicken and pork skewers need to reach 71–74°C in the centre; beef and lamb skewers can be pulled at 55–60°C for medium. Rest for a couple of minutes off the heat, then slide everything off onto a platter with lemon and flatbread. Kofta is done when it is firm and springs back. Cooking-temperature guidance follows the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) advice. Store marinated skewers below 4°C and cook within two days.\n\n### How many skewers per person\n\nAllow two to three skewers per adult as a main with sides, or one to two as part of a spread. If you are threading your own, cut the meat into even 2.5–3cm cubes so everything cooks at the same rate, and don't pack the pieces tight against each other — leave a few millimetres so the heat gets to all sides.\n\n### Marinades that work\n\nAcid (lemon, yoghurt, vinegar) tenderises and seasons; oil carries fat-soluble flavour and stops sticking; sugar or honey browns but burns, so keep sweet glazes for the last few minutes. Two hours is enough for chicken and pork; overnight suits beef and lamb. Marinated skewers keep two days below 4°C.",
  },
  "/bbq-grill/ribs/": {
    title: "Pork Ribs & Beef Ribs for BBQ | Mr Meat & Co",
    description: "Pork ribs and beef ribs for low-and-slow — American-style pork spare ribs, beef short ribs, beef back ribs and lamb ribs. Membrane removed, delivered cold.",
    h1: "Ribs for the BBQ & Smoker",
    primaryKeyword: "pork ribs",
    supportingKeywords: ["american style pork ribs", "beef short ribs", "beef ribs for bbq", "lamb ribs for bbq", "bbq pork ribs"],
    intro: "Pork ribs and beef ribs cut for the smoker and the low oven — American-style pork spare ribs, meaty beef short ribs, beef back ribs and lamb ribs. Membrane removed so the rub gets in and the meat pulls clean.",
    faqs: [
      { question: "Are the ribs cut American-style / St Louis?", answer: "Pork spare ribs are trimmed St Louis-style (squared off, tips removed). We also do full spare racks — ask." },
      { question: "Pork or beef ribs for low-and-slow?", answer: "Pork spare ribs cook faster (about 4–5 hours) and are the classic. Beef short ribs take longer (5–6 hours) but give a richer, brisket-like result." },
      { question: "Is the membrane removed?", answer: "Yes — the silverskin on the bone side is removed so your rub penetrates and the ribs pull cleanly." },
    ],
    guide: "Pork ribs and beef ribs are low-and-slow cuts — collagen-rich, fatty and forgiving, built for the smoker or a long, low oven.\n\n### Pork ribs vs beef ribs\n\n**American-style pork spare ribs** (and the trimmed St Louis cut) are the crowd favourite — meaty, quick by BBQ standards at 4–5 hours, and easy to glaze. **Beef short ribs** are bigger, richer and beefier, needing 6–8 hours to render; **beef back ribs** are the bones from a rib roast, less meat but great flavour. **Lamb ribs** (breast) are small, very fatty and best rendered hard. We remove the membrane from the bone side so the rub penetrates and the meat pulls clean.\n\n### Cooking ribs low and slow\n\nRub the day before if you can. Cook at 110–120°C — bone-side down — until the meat has pulled back from the bone ends and a probe slides through the thickest part with no resistance (pork spare ribs around 90–94°C internal, beef short ribs 96–99°C). Wrapping in foil or butcher's paper partway through speeds the cook and keeps them moist; glaze only in the last 30 minutes so the sugar doesn't burn. Rest 20–30 minutes before cutting. General meat cooking-temperature guidance is on the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) site.\n\n### Rubs, wraps and the stall\n\nA basic rub is equal parts salt and coarse pepper, plus paprika and brown sugar for pork. Apply it a few hours ahead — overnight for beef. Somewhere around 68–75°C internal the meat stops climbing in temperature for an hour or two as moisture evaporates and cools the surface; this is \"the stall\". Wrapping in foil or butcher's paper pushes through it and keeps the ribs moist, at the cost of a slightly softer bark.\n\n### How many ribs to buy\n\nAllow roughly 4–6 pork spare ribs per adult as a main, or one beef short rib each — they are large. A full rack of pork spare ribs feeds two to three. Frozen ribs should be thawed in the fridge, not on the bench, and cooked within two days of thawing.",
  },
  "/specialty-meat/kangaroo/": {
    title: "Buy Kangaroo Meat — Steaks, Mince, Fillet | Mr Meat & Co",
    description: "Buy kangaroo meat online — lean Australian fillet, steaks, mince, diced and sausages. High protein, low fat, wild-harvested under quota. Delivered NSW-wide and nationwide.",
    h1: "Kangaroo Meat — Lean & Australian",
    primaryKeyword: "buy kangaroo meat",
    supportingKeywords: ["buy kangaroo meat", "kangaroo steak", "kangaroo mince", "kangaroo fillet", "kangaroo sausages", "kangaroo meat price per kg"],
    intro: "Buy kangaroo meat — wild-harvested Australian roo, one of the leanest red meats there is, high in protein, iron and zinc. Fillet (rump) and steaks for a fast hot sear, mince for chilli and ragu, diced for a slow curry, and lean sausages.",
    faqs: [
      { question: "Is kangaroo meat healthy?", answer: "It's one of the leanest red meats available — typically under 2% fat, about 22g protein per 100g, higher in iron and zinc than beef, and a natural source of CLA. The catch is it overcooks easily." },
      { question: "How much does kangaroo meat cost per kg?", answer: "Kangaroo generally sits below premium beef and around mid-range beef. Mince and diced are the best value; fillet is the premium cut but still usually cheaper than beef eye fillet." },
      { question: "Is kangaroo cheaper than beef?", answer: "Cut for cut, usually yes — especially mince, sausages and diced — because kangaroo is wild-harvested, not raised, fed and housed." },
      { question: "How do you cook kangaroo so it stays tender?", answer: "Steaks and fillet: hot and fast, about 2 minutes a side for a 2cm steak, target 52–55°C, rest 5 minutes. Diced kangaroo needs a slow 2-hour braise. A little oil in a marinade replaces the fat the meat lacks." },
      { question: "Does kangaroo taste gamey?", answer: "Only mildly — a clean, slightly sweet, iron-rich flavour closer to good grass-fed beef than to venison." },
      { question: "Can dogs eat kangaroo meat?", answer: "Yes — it's a leading novel protein for dogs with chicken or beef allergies. We sell kangaroo pet mince and bulk kangaroo for dogs separately from this human range." },
    ],
    guide: "Buy kangaroo meat and you are cooking one of the leanest red meats there is — typically under 2% fat, high in protein, iron, zinc and omega-3.\n\n### Choosing kangaroo cuts\n\n**Fillet (rump) and loin** are the prime cuts for a fast, hot sear. **Kangaroo mince** works for chilli, burgers, ragù and meatballs — add a little olive oil or pork fat to compensate for how lean it is. **Diced kangaroo** suits a long, wet curry or braise where the collagen has time to soften. Australian kangaroo is wild-harvested under a government-managed quota system, not farmed.\n\n### Cooking kangaroo without it going tough\n\nLeanness is the whole challenge — there is almost no fat to buffer overcooking. Bring steaks and fillet to room temperature, oil the meat not the pan, and sear over very high heat for 2–3 minutes a side to rare or medium-rare (an internal 55–60°C), then rest for as long as you cooked it. Past medium it turns dry and livery. For mince and diced, either keep it fast and pink or commit to a low, slow braise with plenty of liquid — the in-between is where it goes tough. Kangaroo is a game meat: the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) handling rules for raw meat apply.",
  },
  "/specialty-meat/veal/": {
    title: "Buy Veal Online — Australian Rose Veal | Mr Meat & Co",
    description: "Buy veal online — Australian rose veal schnitzel, cutlets, osso buco, diced and mince. Higher-welfare pink veal, not crate-raised. Delivered NSW-wide and nationwide.",
    h1: "Australian Rose Veal",
    primaryKeyword: "buy veal online",
    supportingKeywords: ["veal schnitzel", "veal mince", "veal osso buco", "veal cutlets", "buy veal mince", "rose veal australia"],
    intro: "Buy veal online — Australian rose veal: pale pink, fine-grained and mild, from calves raised in groups with room to move, not the banned white-veal crate system. Schnitzel and scaloppine, cutlets, osso buco, diced and delicate mince.",
    faqs: [
      { question: "What is veal and what age is the animal?", answer: "Veal is meat from young cattle, generally 8 weeks to 8 months old. The young age is why it's pale pink, low in fat and mild in flavour." },
      { question: "Is your veal ethically raised?", answer: "Yes — it's Australian rose veal: calves raised in groups, able to move, producing pink rather than white meat. The old immobilised-crate 'white veal' system is banned or abandoned in Australia." },
      { question: "Veal vs beef — the difference?", answer: "Veal is pale, very lean, fine-textured and mild; beef is red, marbled, firmer and richer. Veal suits schnitzel, scaloppine and osso buco; cook it gently and never past medium on thin cuts." },
      { question: "Where can I buy veal mince and schnitzel in Australia?", answer: "Veal is increasingly rare in supermarkets. We carry Australian rose veal schnitzel, cutlets, osso buco, diced and mince, with bulk veal for restaurants and caterers." },
    ],
    guide: "Buy veal online and you are getting rose veal — pale pink, fine-grained and mild, from calves raised in groups with room to move, not the banned white-veal crate system.\n\n### Choosing veal cuts\n\n**Schnitzel and scaloppine** (from the leg) are the everyday cuts — pounded thin, crumbed or floured, cooked in a minute. **Cutlets** are the premium grill cut. **Osso buco** (shin, cross-cut through the bone) is the braising star — the marrow enriches the sauce. **Diced veal and mince** go into a delicate ragù, a blanquette, or a meatball mix with pork. Veal is leaner and more tender than beef but with less developed flavour, so it takes to butter, lemon, sage, capers and cream.\n\n### Cooking veal\n\nBecause it is lean and young, veal overcooks fast. Schnitzel needs a hot pan and 60–90 seconds a side — no more. Cutlets are best at medium (an internal 60–63°C), rested well. Osso buco and other braises want the opposite: brown hard, then 2–3 hours at a bare simmer until the meat slips off the bone. General meat cooking-temperature guidance is on the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) site. Store veal below 4°C and use within 3 days, or freeze.",
  },
  "/specialty-meat/goat/": {
    title: "Buy Goat Meat — Curry Pieces, Shoulder, Leg | Mr Meat & Co",
    description: "Buy goat meat online in Australia — bone-in curry pieces, shoulder, leg, ribs and diced goat. Lean, full-flavoured, delivered NSW-wide and frozen nationwide.",
    h1: "Goat Meat — Lean & Full-Flavoured",
    primaryKeyword: "buy goat meat",
    supportingKeywords: ["goat meat near me", "buy goat meat online", "goat curry pieces", "diced goat", "goat shoulder", "goat ribs"],
    intro: "Buy goat meat — Australian goat (chevon), leaner than lamb and beef, with a mild, slightly sweet flavour. Bone-in curry pieces, shoulder and leg for slow roasting, diced goat, and ribs for the grill.",
    faqs: [
      { question: "Where can I buy goat meat in Australia?", answer: "Goat is rarely stocked in supermarkets. Mr Meat & Co carries Australian goat — curry pieces, shoulder, leg, diced and ribs — delivered across Sydney and Australia-wide for larger orders." },
      { question: "Is goat meat healthy?", answer: "Goat is one of the leanest red meats — lower in fat and calories than lamb or beef, and a good source of iron and B12." },
      { question: "What's the best goat cut for curry?", answer: "Bone-in curry pieces (chopped shoulder and leg) — the bones add body to the sauce and the connective tissue turns tender over a 2-hour simmer." },
      { question: "Does goat meat taste like lamb?", answer: "It's in the same family but milder and less fatty than lamb, without lamb's distinctive fat flavour. A slow braise with spice suits it best." },
    ],
    guide: "Buy goat meat (chevon) and you are cooking the most-eaten red meat on the planet — leaner than lamb and beef, with a mild, slightly sweet flavour that carries spice well.\n\n### Choosing goat cuts\n\n**Bone-in curry pieces** (mixed shoulder and leg on the bone) are the everyday choice — the bone enriches a curry or stew. **Shoulder and leg** roast whole, low and slow. **Diced goat** (boneless) is quicker to portion for a weeknight curry. **Ribs** take a marinade and a hot grill. Goat is a favourite for Caribbean curry goat, South Asian and West African stews, and Mexican birria.\n\n### Cooking goat so it's tender\n\nGoat is lean and its muscle fibres are firm, so low and slow is almost always the answer — a 2–3 hour braise or a long simmer until the meat pulls from the bone. Marinate overnight in yoghurt, ginger, garlic and spice to tenderise and season. If you do grill goat ribs or a butterflied leg, keep it to medium and rest it well; past that it dries out quickly. General cooking-temperature guidance is on the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) site.\n\nAustralian goat, delivered cold-chain across NSW and frozen by courier nationwide.",
  },
  "/specialty-meat/game/": {
    title: "Buy Game Meat Online — Venison, Boar, Rabbit | Mr Meat & Co",
    description: "Buy game meat online in Australia — farmed venison, wild boar, rabbit, crocodile and emu. Backstrap, osso buco, mince, sausages and mixed game boxes. Nationwide.",
    h1: "Game Meat — Venison, Boar, Rabbit & More",
    primaryKeyword: "buy game meat online",
    supportingKeywords: ["venison near me", "wild boar meat", "buy rabbit meat", "rabbit meat for sale", "crocodile meat", "game meat box"],
    intro: "Buy game meat online — lean, dark, full-flavoured: farmed venison (backstrap, osso buco, mince), wild boar, whole and jointed rabbit, plus crocodile and emu. A mixed game box lets you try a few, and bulk game is available for restaurants.",
    faqs: [
      { question: "What game meats do you stock?", answer: "Farmed venison, wild boar, rabbit, crocodile and emu. Cuts from backstrap and fillet to mince, sausages, osso buco and a mixed game box." },
      { question: "Is it farmed or wild-harvested?", answer: "Venison and rabbit are farmed; wild boar is wild-harvested; crocodile and emu are farmed. All from licensed processors." },
      { question: "How do I cook lean venison so it's not dry?", answer: "Fast cuts like backstrap: hot and quick, pull at 52–55°C, rest. Shoulder and shank: braise 2.5–3 hours with stock, wine and added fat. Never cook fast venison cuts past medium." },
      { question: "Venison vs beef — nutrition?", answer: "Venison has roughly a third of the fat of a lean beef steak, similar or higher protein, and more iron, with a slightly sweet, more mineral flavour." },
      { question: "Do you ship game meat Australia-wide?", answer: "Yes — game and specialty meat ship snap-frozen by express courier anywhere in Australia; refrigerated cold-chain van delivery covers all of NSW." },
    ],
  },
  "/specialty-meat/rabbit/": {
    title: "Buy Rabbit Meat — Whole & Jointed | Mr Meat & Co",
    description: "Buy rabbit meat online in Australia — whole farmed rabbit, jointed rabbit and rabbit loins. Lean, delicate white meat, delivered NSW-wide and frozen nationwide.",
    h1: "Rabbit Meat — Farmed & Delivered",
    primaryKeyword: "buy rabbit meat",
    supportingKeywords: ["rabbit meat for sale", "rabbit meat near me", "where to buy rabbit meat", "whole rabbit", "jointed rabbit"],
    intro: "Buy rabbit meat — Australian farmed rabbit, lean, delicate, almost all white meat. Whole for a pot roast, jointed for a braise (rabbit with mustard and cream is the classic), or as loins for a fast pan-fry.",
    faqs: [
      { question: "Where can I buy rabbit meat in Australia?", answer: "Rabbit isn't sold in supermarkets. Mr Meat & Co carries Australian farmed rabbit — whole, jointed and loins — delivered across Sydney and Australia-wide for larger orders." },
      { question: "What does rabbit taste like?", answer: "Mild, delicate and lean — often compared to chicken but finer-textured, with a faint gamey sweetness. It takes strong flavours (mustard, bacon, white wine, prunes) well." },
      { question: "How do you cook rabbit so it isn't dry?", answer: "It's very lean, so joint it and braise the legs and shoulders slowly with liquid and fat; flash-fry the loins only briefly. Barding with bacon helps a whole roast rabbit stay moist." },
    ],
    guide: "Buy rabbit meat and you are cooking a lean, delicate, almost entirely white meat — closer to chicken than to game in flavour, but with a firmer texture.\n\n### Whole, jointed or loin?\n\n**Whole rabbit** suits a pot roast or a stuffed-and-roasted centrepiece. **Jointed rabbit** (legs and saddle portioned) is the practical choice for a braise — rabbit with mustard and cream, a hunter-style tomato and olive braise, or a rich rabbit ragù for pasta. **Loin fillets** are the quick cut, wrapped in pancetta and pan-fried in a few minutes. Ours is Australian farmed rabbit, so it is consistently tender and mild, without the toughness or strong flavour of wild rabbit.\n\n### Cooking rabbit without drying it out\n\nRabbit has very little fat, and the lean saddle cooks far faster than the legs — which is why jointing and cooking the pieces to different times, or braising the whole thing in liquid, gives the best result. For a braise, brown the joints, then 45–60 minutes at a bare simmer until the leg meat is tender. For loin, sear hard and pull it at just-cooked; a minute too long and it is dry. Wrapping lean cuts in fat (pancetta, caul) helps. General raw-meat handling follows the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance.\n\n### Farmed vs wild rabbit\n\nAlmost all rabbit sold in Australia is farmed, and that is what we stock — raised on a consistent diet so the meat is tender, pale and mild every time. Wild rabbit is darker, leaner still, and can be tough and strongly flavoured depending on age and season, which is why classic recipes for wild rabbit lean on long braises and marinades. If a recipe was written for wild rabbit, a farmed rabbit will cook faster and need less liquid.\n\n### Portions and pairings\n\nA whole rabbit (around 1–1.4kg) feeds two to three; allow one hind leg or two front legs per person for a braise. Rabbit pairs with mustard, cream, white wine, bacon or pancetta, prunes, olives and rosemary — anything that adds fat and acidity to balance how lean it is.",
  },

  "/beef/bones-broth/": {
    title: "Beef Bones for Broth — Marrow & Knuckle | Mr Meat & Co",
    description: "Beef bones for broth and stock — human-grade grass-fed marrow bones, knuckle, and meaty soup bones, cut to size. Delivered cold across NSW.",
    h1: "Beef Bones for Broth & Stock",
    primaryKeyword: "beef bones for broth",
    supportingKeywords: ["beef marrow bones", "buy beef bones", "bones for bone broth", "soup bones", "beef knuckle bones", "where to buy beef bones"],
    intro: "Beef bones for broth — human-grade grass-fed marrow bones cut into 5–7cm canoe and round pieces, knuckle and joint bones packed with collagen, and meaty soup bones. Roast then simmer 12–24 hours for a gelatinous stock.",
    faqs: [
      { question: "Which beef bones make the best broth?", answer: "A mix: knuckle and joint bones for collagen and body, marrow bones for richness and flavour, and a meaty soup bone or two for depth. All-marrow broth is greasy; all-knuckle is thin. Roast them first for colour and flavour." },
      { question: "Are these bones human-grade?", answer: "Yes — these are cut from the same grass-fed carcasses as our retail beef, handled through the human cold chain. Our pet-food bones are a separate range." },
      { question: "How long do I simmer beef bone broth?", answer: "12–24 hours on a low stovetop or in a slow cooker, with a splash of vinegar to help draw out minerals. It's ready when the broth sets to a soft jelly once chilled." },
      { question: "How much bone for how much broth?", answer: "Roughly 1kg of bones per 1.5–2 litres of water. A 2kg pack makes a decent stockpot's worth." },
    ],
    guide: "Beef bones for broth are the base of a proper bone broth or brown stock — deeply savoury, rich in gelatine, and cheap for what they give back.\n\n### Which beef bones to use\n\n**Marrow bones** (cut into 5–7cm canoe and round pieces) give richness and the marrow itself, which you can roast and spread on toast. **Knuckle and joint bones** are the collagen powerhouses — they are what makes a broth set like jelly in the fridge. **Meaty soup bones** (shin, neck) add colour and beefy flavour. For a broth that gels, use at least a third knuckle or joint bone by weight; for a lighter stock, lean on marrow and shin.\n\n### Method for a gelatin-rich broth\n\nRoast the bones at 220°C for 30–40 minutes until deep brown — this is where the colour and roasted flavour come from. Transfer to a stockpot, add a splash of vinegar (it helps draw minerals from the bone), cover with cold water and bring to a bare simmer. Skim the first foam, then hold it at the gentlest simmer for 12 to 24 hours. Strain, cool quickly and refrigerate within two hours, following the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) cooling rules; a good broth will be wobbly and set once cold. It keeps 4–5 days chilled or 3 months frozen.\n\nAll our beef bones are human-grade and from grass-fed Australian cattle.",
  },
  "/pork/bones-broth/": {
    title: "Buy Pork Bones Online — Neck, Trotters, Hock | Mr Meat & Co",
    description: "Buy pork bones online for broth, tonkotsu and stock — neck bones, split trotters and hock bones. Human-grade Australian pork, delivered cold across NSW.",
    h1: "Pork Bones for Broth & Stock",
    primaryKeyword: "buy pork bones online",
    supportingKeywords: ["pork bones for broth", "pork neck bones", "pork trotters", "where can i buy pork bones", "pork hock bones", "tonkotsu bones"],
    intro: "Buy pork bones online for a milky tonkotsu, a Filipino nilaga or a Caribbean souse — neck bones with plenty of meat, split trotters for body and gelatine, and hock bones. Human-grade, from the same pigs as our retail pork.",
    faqs: [
      { question: "What pork bones do I need for tonkotsu ramen broth?", answer: "Trotters and neck bones are the classic combination — trotters for the collagen that gives the milky emulsion, neck bones for meat and marrow. Blanch, then boil hard for 8–12 hours." },
      { question: "Are your pork bones human-grade?", answer: "Yes — cut from the same Australian pigs as our retail pork and kept in the human cold chain. Pet bones are listed separately under pet food." },
      { question: "Do you sell pork trotters?", answer: "Yes — split pork trotters, ideal for broth, brawn, or braising. They're in this Bones & Broth range." },
    ],
    guide: "Buy pork bones online for the bones that make the great long-simmered broths — a milky Japanese tonkotsu, a clear Filipino nilaga, a Caribbean souse or a simple pork stock.\n\n### Which pork bones for which broth\n\n**Neck bones** carry the most meat and marrow and give body and colour — the everyday choice for stock and nilaga. **Split trotters (pig's feet)** are almost pure skin, cartilage and bone: they are what turns a tonkotsu milky and white and what sets a broth to jelly once chilled. **Hock bones** sit between the two. For a classic tonkotsu, use roughly two parts trotter to one part neck bone.\n\n### Getting a milky, gelatinous result\n\nBlanch the bones first: cover with cold water, bring to the boil for 5 minutes, then drain and rinse off the grey scum. Return to a clean pot, cover generously and boil hard — a rolling boil, not a simmer — for 8 to 12 hours, topping up with boiling water. That constant agitation is what emulsifies the fat and collagen into a white broth. For a clear stock, do the opposite: a bare simmer, skimmed often. Cool and refrigerate broth within two hours and use within three to four days, or freeze — the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) cooling guidance applies to stocks too.\n\nAll our pork bones are human-grade, from the same Australian pigs as our retail pork.\n\n### How much you need, and what to do with the broth\n\nFor a batch of tonkotsu, start with about 2kg of bones to 3–4 litres of water — it reduces hard over the long boil. Once strained, a good pork broth keeps 3–4 days in the fridge and freezes for 3 months; freeze it in portions sized to one bowl of ramen or one pot of soup. The rendered fat that sets on top is worth keeping — stir a spoonful back into the finished bowl, or use it to fry aromatics for the tare.\n\n### A note on the bones themselves\n\nOur pork neck bones and trotters are cut from the same Australian pigs as our retail pork and kept in the human cold chain. Blanching before the main boil is not optional for a clean broth — it removes the scum and off-flavours that would otherwise cloud and sour a long simmer.",
  },

  /* ---- new category: live poultry ---- */
  "/live-poultry/": {
    title: "Live Poultry for Sale — Hens, Pullets, Chicks | Mr Meat & Co",
    description: "Live poultry for sale near Sydney — point-of-lay ISA Brown and Australorp hens, young pullets, dual-purpose and meat birds, and bantams. Farm pickup or local delivery.",
    h1: "Live Poultry for Backyard Flocks",
    primaryKeyword: "live poultry for sale",
    supportingKeywords: ["point of lay hens for sale", "laying hens for sale sydney", "pullets for sale", "backyard chickens for sale", "isa brown hens", "live chickens near me"],
    intro: "Live poultry for sale for the backyard coop — point-of-lay hens (16–20 weeks, laying or about to), younger pullets to grow on, dual-purpose and fast-growing meat birds, and a rotating selection of bantams. Farm pickup by appointment or local Sydney delivery.",
    faqs: [
      { question: "What does 'point of lay' mean?", answer: "Point-of-lay (POL) pullets are 16–20 weeks old — either just started laying or within a few weeks of it. They're past the fragile brooder stage and are the easiest way to start a laying flock." },
      { question: "How do I collect live birds — do you deliver?", answer: "Live poultry is collected from our farm partner by appointment, or delivered within a limited radius of Sydney for a fee — arranged separately from the cold-chain meat run. The $300 site minimum order still applies. We'll confirm options when you order." },
      { question: "Are the hens vaccinated and sexed?", answer: "Point-of-lay hens and pullets are sold as females (sexed) and vaccinated against Marek's disease and typically Newcastle/IB, unless a listing says otherwise. Straight-run (unsexed) meat birds are noted as such." },
      { question: "Is there a minimum number of birds?", answer: "Chickens are flock animals and shouldn't be kept singly, so most listings have a minimum of two or three birds. Bantam and rare breeds may vary." },
      { question: "What breeds do you stock?", answer: "Commonly ISA Brown and Hyline (brown-egg layers), Australorp and Plymouth Rock (dual-purpose), fast-growing meat birds, and a rotating selection of bantams. Availability is seasonal — contact us for the current list." },
    ],
    guide: "Choosing live poultry for sale means matching the bird to what you actually want — eggs, meat, or company in the yard.\n\n### What to look for when you buy live poultry\n\nHealthy birds are bright-eyed and alert, with clean vents, smooth legs and full, glossy feathers. They should move freely and hold their wings tight to the body. Ask what the bird has been vaccinated against — for point-of-lay hens in NSW that is normally Marek's disease and often Newcastle disease and infectious bronchitis. Point-of-lay pullets are sold sexed (female); straight-run meat birds are not.\n\n### Settling new birds in\n\nKeep new arrivals separate from an existing flock for two to three weeks to watch for illness. Give them a draught-free coop with roughly 1m² of run per bird, clean water, shell grit and a feed matched to their stage — chick starter, grower/pullet developer, or a layer ration with added calcium once they reach point of lay. Expect a week or two of settling before the first egg. For a plain-English rundown of backyard poultry health and biosecurity, the [NSW DPI poultry pages](https://www.dpi.nsw.gov.au/animals-and-livestock/poultry-and-birds) are a good starting point.\n\nLive poultry is collected from our farm partner by appointment or delivered within a limited radius of Sydney — it is arranged separately from the cold-chain meat run.",
  },
  "/live-poultry/laying-hens/": {
    title: "Point of Lay Hens for Sale — ISA Brown | Mr Meat & Co",
    description: "Point of lay hens for sale near Sydney — ISA Brown, Hyline and Australorp pullets at 16–20 weeks, vaccinated and sexed. Farm pickup or local delivery.",
    h1: "Point-of-Lay Laying Hens",
    primaryKeyword: "point of lay hens for sale",
    supportingKeywords: ["laying hens for sale", "laying hens for sale sydney", "isa brown hens for sale", "australorp hens", "pol hens", "backyard laying hens"],
    intro: "Point of lay hens for sale at 16–20 weeks — vaccinated, sexed females ready to start laying within a few weeks. ISA Brown and Hyline for reliable brown eggs, Australorp and Plymouth Rock for a dual-purpose bird with more personality.",
    faqs: [
      { question: "How soon will point-of-lay hens start laying?", answer: "Usually within 2–6 weeks of settling into their new coop, once they reach about 20–22 weeks and daylight allows. Stress from the move can delay the first egg by a week or two." },
      { question: "How many eggs will they lay?", answer: "A healthy ISA Brown or Hyline lays 280–320 eggs in her first year. Australorps lay slightly fewer but for more years and go broody more readily." },
      { question: "Are they vaccinated?", answer: "Yes — vaccinated against Marek's disease and typically Newcastle disease and infectious bronchitis. The specific vaccinations are on each listing." },
    ],
    guide: "Point of lay hens for sale are pullets at 16–20 weeks — either just laying or within a few weeks of their first egg. They are the fastest, lowest-effort way to start a laying flock.\n\n### Choosing point of lay hens\n\nISA Brown and Hyline are the reliable brown-egg workhorses, laying 280–320 eggs in the first year. Australorp and Plymouth Rock lay a little less but for more years, go broody more readily and make a better dual-purpose bird. All of ours are sold vaccinated (Marek's, and usually Newcastle disease and infectious bronchitis) and sexed as females. Look for a bright red comb and wattles as a sign a hen is close to lay.\n\n### Getting them laying\n\nMost point of lay hens start within two to six weeks of moving in, once they settle and daylight allows. Feed a layer ration (around 16–17% protein) with free-choice shell grit for strong shells, keep water clean and unfrozen, and give at least one nest box per three or four hens in a quiet, dim corner. Stress from the move, a cold snap or a predator scare can all delay the first egg by a week or two. The [NSW DPI poultry pages](https://www.dpi.nsw.gov.au/animals-and-livestock/poultry-and-birds) cover housing, feed and disease in more detail.\n\nCollected from our farm partner by appointment, or delivered within a limited Sydney radius.\n\n### Egg output through the year\n\nA first-year ISA Brown or Hyline lays close to an egg a day in spring and summer, tapering through autumn as daylight drops, and often pausing to moult in their second autumn. Output falls by roughly 15–20% each year after the first, but eggs get larger. Australorps lay fewer — around 250 a year — but keep going for more seasons and go broody more readily.\n\n### Feeding for good shells\n\nOnce a hen is in lay she needs a layer ration (around 16–17% protein) plus free-choice shell grit or crushed shell for calcium — without it, shells go thin and the hen draws calcium from her own bones. Scraps and scratch grain are fine as a small treat but shouldn't make up more than about 10% of the diet, or protein and calcium drop and laying stalls.",
  },
  "/live-poultry/pullets/": {
    title: "Pullets for Sale — Young Hens to Grow On | Mr Meat & Co",
    description: "Pullets for sale near Sydney — 8–15 week brown-egg layers and dual-purpose breeds to grow on to point of lay. Vaccinated, sexed. Farm pickup or local delivery.",
    h1: "Pullets — Young Hens to Grow On",
    primaryKeyword: "pullets for sale",
    supportingKeywords: ["young pullets for sale", "started pullets", "grower pullets", "8 week old pullets", "brown egg layer pullets"],
    intro: "Pullets for sale — younger birds, 8 to 15 weeks, for people who want to raise their flock on themselves and pay less per bird than point of lay. Past the heat-lamp brooder stage, feathered up and hardy, on grower feed.",
    faqs: [
      { question: "Pullet or point-of-lay hen — which should I buy?", answer: "Point-of-lay if you want eggs within weeks and less work. Pullets if you want to raise them yourself, tame them young, and spend less up front — you'll wait 2–4 months for eggs." },
      { question: "What do I feed pullets?", answer: "A grower or pullet-developer feed (around 16% protein) until roughly 18 weeks or the first egg, then switch to a layer feed with added calcium." },
      { question: "Do pullets need heat?", answer: "Not by 8 weeks — fully feathered pullets are fine in a draught-free coop through a Sydney winter. They just need shelter, dry bedding and unfrozen water." },
    ],
    guide: "Pullets for sale are younger birds — 8 to 15 weeks — for people who want to raise their flock on and pay less per bird than point of lay.\n\n### Pullet or point-of-lay hen?\n\nBuy pullets if you want to tame birds young, spread the cost, and don't mind waiting two to four months for eggs. Buy point of lay if you want eggs within weeks and less work. Our pullets are past the heat-lamp brooder stage, fully feathered and hardy, and are sold vaccinated and sexed as females.\n\n### Raising pullets to point of lay\n\nFeed a grower or pullet-developer ration (around 15–16% protein) until roughly 18 weeks or the first egg, then switch to a layer feed with added calcium — starting layer feed too early can cause kidney problems, and starting it too late gives thin shells. House them draught-free with dry bedding, provide grit, and give them safe outdoor access to build immunity and leg strength. By 8 weeks a feathered pullet needs no supplementary heat through a Sydney winter. For feeding stages and flock health, see the [NSW DPI poultry pages](https://www.dpi.nsw.gov.au/animals-and-livestock/poultry-and-birds).\n\nChickens are flock animals — most listings have a minimum of three birds. Farm pickup or local Sydney delivery.\n\n### What pullets cost to raise\n\nA pullet bought at 10 weeks and grown to point of lay at 20 weeks eats roughly 3–4kg of grower feed over that period — a few dollars a bird — so the saving versus buying point-of-lay is real if you have the setup and the patience. The other cost is time: daily checks, clean water, and a secure coop while they are still small enough to be vulnerable to cats, hawks and foxes.\n\n### Handling and taming young birds\n\nPullets bought young are the ones you can properly tame. Sit with them, hand-feed a little scratch or mealworms, and move slowly around the coop — birds handled gently between 8 and 16 weeks stay calm for life and are far easier to health-check, worm and move. Keep at least three together; a single pullet is stressed and noisy.",
  },
  "/live-poultry/meat-birds/": {
    title: "Meat Birds for Sale — Table Chickens | Mr Meat & Co",
    description: "Meat birds for sale near Sydney — fast-growing table chickens and dual-purpose breeds for home meat production. Straight-run, day-old to grower. Farm pickup or delivery.",
    h1: "Meat Birds & Table Chickens",
    primaryKeyword: "meat birds for sale",
    supportingKeywords: ["meat chickens for sale", "table birds", "cornish cross chickens", "dual purpose chickens", "broiler chickens for sale"],
    intro: "Meat birds for sale, raised for the table — fast-growing meat strains that reach processing weight in 7–9 weeks, and slower dual-purpose breeds if you'd rather trade speed for foraging and flavour. Sold straight-run (unsexed).",
    faqs: [
      { question: "How long until meat birds are ready to process?", answer: "Fast-growing meat strains reach 2–3kg live weight in 7–9 weeks. Dual-purpose breeds take 14–20 weeks and finish leaner and firmer." },
      { question: "Are meat birds sexed?", answer: "No — meat birds are sold straight-run (as hatched, roughly half male half female). For table birds this doesn't matter." },
      { question: "Can I get help with processing?", answer: "We can point you to licensed small-scale processors near Sydney, or supply older birds already grown out. Ask when you order." },
    ],
    guide: "Meat birds for sale are birds raised for the table — fast-growing meat strains and slower dual-purpose breeds. They are sold straight-run (unsexed, roughly half male and half female), which for table birds does not matter.\n\n### Fast strain or dual-purpose?\n\nFast-growing meat strains reach 2–3kg live weight in 7–9 weeks on a meat-bird ration and give the tender, plump carcass most people expect. Dual-purpose breeds take 14–20 weeks, forage well, and finish leaner and firmer with more flavour — better for a slow roast or the pot than a quick BBQ.\n\n### Raising and processing meat birds\n\nBrood day-olds at around 32°C, dropping a few degrees a week until they are feathered. Feed a starter then grower meat-bird ration (20–22% then 18–19% protein) with constant clean water, and give fast strains restricted feeding overnight from about week three to reduce leg and heart problems. Fast birds are usually processed at 7–9 weeks before their frame outgrows their legs. We can point you to licensed small-scale processors near Sydney, or supply older birds already grown out. General husbandry and welfare guidance is on the [NSW DPI poultry pages](https://www.dpi.nsw.gov.au/animals-and-livestock/poultry-and-birds).\n\nMinimum six birds. Farm pickup or local Sydney delivery.\n\n### Feeding costs and carcass yield\n\nAs a rough budget, a fast-strain meat bird eats roughly 4–5kg of feed to reach a 2kg dressed carcass — a feed-conversion ratio close to 2:1 — so the running cost is mostly feed, and buying a good meat-bird ration rather than layer pellets pays for itself in growth. Dual-purpose breeds convert less efficiently (closer to 3:1) and take twice as long, so the trade-off is feed cost and time against flavour and foraging. Plan your batch size around freezer space: six fast birds processed together will fill a large chest freezer drawer, and it is far less work to do one processing day than several.\n\n### Welfare through the grow-out\n\nFast-growing strains are prone to leg and heart problems if pushed, so give them room to move, keep litter dry, and restrict feed overnight from about week three. Shade and unlimited water matter more for meat birds than for layers, especially through a Sydney summer.\n\n### Housing and predator protection\n\nMeat birds don't roost much, so a low, open shelter with deep dry litter is enough — but they are heavy, slow and can't escape a fox or a dog, so the run needs to be genuinely secure top and bottom. A mobile pen moved onto fresh grass every day or two keeps litter clean, spreads the manure and gives the birds forage without letting them range where a predator can pick them off. Bring day-olds inside or into a warm brooder box for the first two to three weeks before they go out.",
  },
  "/live-poultry/bantams/": {
    title: "Bantams for Sale — Silkies & Pekins | Mr Meat & Co",
    description: "Bantams for sale near Sydney — Silkie, Pekin and other fancy bantam breeds. Great pets and broodies, small-space friendly. Farm pickup or local delivery.",
    h1: "Bantams & Fancy Breeds",
    primaryKeyword: "bantams for sale",
    supportingKeywords: ["silkie chickens for sale", "pekin bantams for sale", "bantam chickens near me", "fancy chickens for sale", "pet chickens"],
    intro: "Bantams for sale — small breeds for small yards and for people who keep chickens as much for company as for eggs: Silkies (famously friendly and broody), Pekins, and a rotating selection of other fancy bantams. Availability is limited and seasonal.",
    faqs: [
      { question: "Do bantams lay eggs?", answer: "Yes, but small ones — about half the size of a standard egg, and fewer per year. Silkies in particular are more often kept as pets and broody hens than for eggs." },
      { question: "Are bantams good with children?", answer: "Silkies and Pekins are among the calmest, most handleable chicken breeds, which is why they're popular family birds. They can't fly well, so fencing is easier." },
      { question: "Can bantams live with standard hens?", answer: "Often yes, but watch that they aren't bullied at the feeder. A mixed flock works best when raised together or introduced carefully." },
    ],
    guide: "Bantams for sale are small breeds for small yards and for people who keep chickens as much for company as for eggs.\n\n### Popular backyard bantams\n\nSilkies are famously friendly, love being handled and are the classic broody hen — they will happily hatch and raise other birds' eggs. Pekins are round, feather-footed and calm, and cope well in a small run. Both are among the best breeds for children. They lay small eggs — about half the size of a standard egg — and fewer per year than a production hen, so keep bantams for the temperament and the look rather than the egg basket.\n\n### Keeping bantams\n\nBantams need the same basics as any chicken — a predator-proof coop, clean water, shell grit and an appropriate feed — but less space, and lower perches and pop-holes suit their size. They can't fly well, so a 1.2–1.5m fence usually holds them, and feather-footed breeds like Silkies and Pekins do better on dry ground than in mud. A mixed flock of bantams and standard hens works best when the birds are raised together or introduced carefully so the bantams aren't bullied at the feeder. Like any backyard poultry they should be kept under the biosecurity basics set out on the [NSW DPI poultry pages](https://www.dpi.nsw.gov.au/animals-and-livestock/poultry-and-birds). Availability is limited and seasonal — contact us for the current list. Minimum two birds; farm pickup or local Sydney delivery.\n\n### Bantams with children and other pets\n\nSilkies and Pekins are among the calmest, most handleable chicken breeds, which is why they are the usual choice for a family with young kids. Because they can't fly, a low fence contains them and they are easy to catch and carry. Supervise around dogs until you know how the dog reacts — a bantam is small enough to be treated as prey by an untrained dog.\n\n### Broodiness and hatching\n\nSilkie bantams go broody readily and will happily sit on and raise another hen's eggs — including standard-breed or duck eggs — which makes them useful even in a flock kept mainly for eggs. If you don't want chicks, collect eggs daily and lift a persistently broody hen off the nest, or she will sit for weeks and lose condition.",
  },

  /* ---- landing & wholesale ---- */
  "/christmas-ham/": {
    title: "Christmas Ham Delivery — Whole & Half Leg Ham | Mr Meat & Co",
    description: "Christmas ham for December delivery — whole and half bone-in leg ham, plus boneless. Australian pork, glaze on request. Order early, hams sell out.",
    h1: "Christmas Ham — Whole & Half Leg",
    primaryKeyword: "christmas ham",
    supportingKeywords: ["buy christmas ham", "whole leg ham", "half leg ham", "christmas ham delivery sydney", "boneless christmas ham"],
    intro: "Christmas ham — Australian bone-in leg ham for the table: whole (7–10kg) for a crowd with a week of leftovers, half leg (4–6kg) for a smaller table, and boneless if carving space is tight. Order early for a December delivery window; hams sell out.",
    faqs: [
      { question: "When should I order my Christmas ham?", answer: "As early as you can — Christmas hams sell out, and you want it delivered a few days before, not on the 24th. Choose your December delivery window at checkout." },
      { question: "What size Christmas ham do I need?", answer: "A 7–10kg bone-in leg feeds a large crowd with a week of leftovers; a half leg (4–6kg) suits a table of 4–6. Boneless is easiest to carve." },
      { question: "Is the ham cooked?", answer: "Yes — a whole leg ham is fully cooked and cured. You just skin, score, glaze and warm it through (or serve it cold). See our Christmas ham glaze guide." },
      { question: "Do you glaze the ham?", answer: "We supply it ready for you to glaze, with a glaze guide. Ask about a pre-glazed option closer to Christmas." },
    ],
    guide: "A Christmas ham is a whole bone-in leg that has already been cured and cooked — you are only finishing and serving it, but a few choices upfront matter.\n\n### Choosing your Christmas ham\n\n**Whole bone-in leg (7–10kg)** feeds a crowd and gives you a week of leftovers — sandwiches, a pea and ham soup from the bone, ham hock pasta. **Half leg (4–6kg)** suits a smaller table. **Boneless leg** carves into clean, even slices and stores compactly if fridge space is tight. Bone-in has the best flavour and the traditional look; boneless is the easy option. All are made from Australian pork.\n\n### Scoring, glazing and serving\n\nRun a knife around the shank, slide your fingers under the skin and peel it off in one piece, leaving the fat. Score the fat in a diamond pattern about 5mm deep, stud with cloves, and brush generously with glaze. Bake at 160°C, glazing every 15–20 minutes, until deep amber — about 45–60 minutes for a half, 1–1.5 hours for a whole leg. Rest 15 minutes before carving. Store the cut ham wrapped in a damp cloth or a ham bag in the fridge, changing the cloth every few days; it keeps 7–10 days — the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance on cooked-meat storage applies. Our full method and three glaze recipes are in the [Christmas ham glaze guide](/blog/christmas-ham-glaze-guide/). Pre-order early — hams sell out every year.",
  },
  "/wholesale/bulk-meat-orders/": {
    title: "Wholesale Meat & Bulk Carcass Shares | Mr Meat & Co",
    description: "Wholesale meat — quarter, half and whole beef, lamb, pork and goat shares, 5–10kg cartons, and restaurant supply. Custom cut sheets, snap-frozen, NSW-wide and nationwide.",
    h1: "Bulk Meat & Animal Shares",
    primaryKeyword: "wholesale meat",
    supportingKeywords: ["bulk meat near me", "order meat in bulk", "bulk meat packs near me", "restaurant meat supplier", "wholesale butcher sydney"],
    intro: "Wholesale meat by the carcass or the carton — quarter, half and whole beef, lamb, pork and goat shares broken down to your cut sheet, 5kg and 10kg cartons of mince, breast, sausages and more, and standing supply for restaurants, cafés and caterers.",
    faqs: [
      { question: "What's your minimum wholesale order?", answer: "Bulk cartons start at 5kg per line. Carcass shares start at a quarter beast. Restaurant supply is arranged per account — contact us with your volumes." },
      { question: "Do you supply restaurants and cafés?", answer: "Yes — standing weekly orders, custom cuts and cut sheets, and delivery scheduled around your service." },
      { question: "How does carcass / bulk pricing work?", answer: "Carcass shares are priced per kg of hanging weight, cut to your sheet — typically 20–35% below buying the same cuts individually. Cartons are priced per kg at a bulk rate." },
      { question: "Delivery for wholesale orders?", answer: "Cold-chain van across all of NSW, and snap-frozen by courier Australia-wide for larger orders. Be home with freezer space cleared for a carcass share." },
      { question: "Can I get a custom cut sheet?", answer: "Yes — you specify steak thickness, roast sizes, mince vs diced ratio, and whether you want offal, bones and sausages made from the trim. We have a sensible standard sheet too." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-beef/": {
    title: "Wholesale Beef — Quarter, Half & Whole | Mr Meat & Co",
    description: "Wholesale beef — quarter, half and whole grass-fed shares custom cut to your sheet, plus 5kg and 10kg mince boxes and whole primals. Snap-frozen, delivered.",
    h1: "Wholesale & Bulk Beef",
    primaryKeyword: "wholesale beef",
    supportingKeywords: ["bulk beef", "wholesale angus beef", "wholesale beef mince", "bulk beef mince", "quarter beef share", "half beef box"],
    intro: "Wholesale beef by the quarter (40–55kg), half (80–110kg) or whole animal — Angus and Angus-cross, broken down to your cut sheet and snap-frozen — plus 5kg and 10kg bulk mince boxes and whole primals (eye fillet, striploin, rump). Typically 20–35% below individual-cut pricing. Looking for Wagyu instead? See our bulk Wagyu page.",
    faqs: [
      { question: "What's in a quarter, half or whole beef share?", answer: "A spread of premium steaks, roasting and casserole cuts, and mince and diced from the trim — plus bones, shin and offal if you want them. Roughly 25–30% premium, 30–35% roasts, 25–30% mince." },
      { question: "How much does a beef share weigh?", answer: "A quarter is about 40–55kg of packed meat, a half 80–110kg, a whole 160–220kg. Weight varies with the animal, so it's sold as 'approximately'." },
      { question: "Do I choose the cuts?", answer: "Yes — you fill in a cut sheet (steak thickness, roast sizes, mince-to-diced ratio, offal yes/no). We have a standard sheet if you'd rather not." },
      { question: "How much freezer space do I need?", answer: "About 1kg of packed meat per 1.5 litres. A quarter needs ~85L, a half ~170L (a dedicated 200–250L chest freezer), a whole ~330L+." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-wagyu/": {
    title: "Wholesale Wagyu Beef — Bulk F1 Wagyu | Mr Meat & Co",
    description: "Wholesale Wagyu beef — bulk F1 Wagyu mince cartons and whole rump sub-primals at a discount to retail pricing. For restaurants, caterers and bulk buyers.",
    h1: "Wholesale F1 Wagyu Beef",
    primaryKeyword: "wholesale wagyu beef",
    supportingKeywords: ["bulk wagyu", "wholesale wagyu", "f1 wagyu bulk", "wagyu mince bulk", "wagyu wholesale price"],
    intro: "Wholesale F1 Wagyu beef — bulk 5kg mince cartons and whole rump sub-primals, priced below our individual retail Wagyu rate. Same Wagyu-cross genetics over our grass-fed Angus base, at restaurant and caterer volumes.",
    faqs: [
      { question: "What Wagyu products are available wholesale?", answer: "A 5kg F1 Wagyu mince carton and a whole Wagyu rump sub-primal (approximately 3–4kg) are listed. For other cuts at volume, contact us for a custom quote." },
      { question: "Is this the same Wagyu as your retail range?", answer: "Yes — the same F1 Wagyu-cross cattle over our grass-fed Angus base, just packed at wholesale volume and priced below the per-kg retail rate." },
      { question: "Can I get other Wagyu cuts in bulk?", answer: "Scotch fillet and porterhouse can be arranged at volume on a custom quote — use the bulk order contact form and specify quantities." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-chicken/": {
    title: "Wholesale Chicken — Bulk Breast & Thigh | Mr Meat & Co",
    description: "Wholesale chicken — bulk breast and thigh fillets, drumsticks, wings and 5kg crumbed schnitzel boxes. Free-range Australian chicken at a bulk per-kg price.",
    h1: "Wholesale & Bulk Chicken",
    primaryKeyword: "wholesale chicken",
    supportingKeywords: ["chicken breast bulk", "bulk chicken", "wholesale chicken", "bulk chicken thigh fillets", "5kg chicken carton"],
    intro: "Wholesale chicken — free-range Australian breast and thigh fillet cartons, drumsticks, wings, and 5kg crumbed schnitzel boxes, at a lower per-kg price for meal prep, gyms, cafés and events.",
    faqs: [
      { question: "What carton sizes are available?", answer: "Breast and thigh fillets in 2kg and 5kg, drumsticks and wings in 2kg and 5kg, crumbed schnitzel in 5kg. Larger volumes on account." },
      { question: "Fresh or frozen?", answer: "Fresh chilled by default; snap-frozen on request or for Australia-wide shipping." },
      { question: "What's the bulk price per kg?", answer: "It's meaningfully below retail per-kg — see the current carton pricing on each product, or contact us for account rates." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-lamb/": {
    title: "Wholesale Lamb — Half & Whole Shares | Mr Meat & Co",
    description: "Wholesale lamb — half and whole Australian grass-fed carcass shares cut to your sheet, plus 6kg variety packs and bulk lamb mince. Snap-frozen, delivered.",
    h1: "Wholesale & Bulk Lamb",
    primaryKeyword: "wholesale lamb",
    supportingKeywords: ["bulk lamb", "half lamb box", "whole lamb share", "buy half a lamb", "bulk lamb mince", "lamb carcass price"],
    intro: "Wholesale lamb — Australian grass-fed by the half (9–13kg packed) or whole animal (18–26kg), broken down to your cut sheet: chops, cutlets, leg and shoulder roasts, shanks, neck and mince — plus 6kg mixed variety packs. Typically 20–30% below individual-cut pricing.",
    faqs: [
      { question: "What's in a half or whole lamb share?", answer: "A spread across the whole animal: loin chops and cutlets, chump chops, a leg and a shoulder (bone-in or boned and rolled), shanks, neck chops or diced, and mince and BBQ chops from the trim. You choose the split on a cut sheet." },
      { question: "How much does a lamb share weigh, and feed?", answer: "A half lamb is about 9–13kg of packed meat, a whole 18–26kg. A whole lamb feeds a family of four for roughly 2–3 months of lamb meals. Weight varies with the animal, so it's sold as 'approximately'." },
      { question: "How much freezer space for half a lamb?", answer: "About 20–25 litres for a half, 40–50 litres for a whole — a half fits in the freezer drawer of a large fridge-freezer; a whole wants a small chest freezer or an empty upright." },
      { question: "Is the lamb grass-fed?", answer: "Yes — 100% Australian grass-fed and pasture-raised, the same lambs as our retail range, just bought by the carcass." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-pork/": {
    title: "Wholesale Pork — Half & Whole Shares | Mr Meat & Co",
    description: "Wholesale pork — half and whole Australian carcass shares cut to your sheet, 11kg variety packs, bulk belly, shoulder and whole fillets. Snap-frozen, delivered.",
    h1: "Wholesale & Bulk Pork",
    primaryKeyword: "wholesale pork",
    supportingKeywords: ["bulk pork", "half pig share", "whole pork carcass", "buy half a pig", "bulk pork belly", "bulk pork mince"],
    intro: "Wholesale pork — Australian by the half (25–35kg packed) or whole pig (55–75kg), cut to your sheet: leg and shoulder roasts, belly, loin and cutlets, ribs, hocks, mince and sausages from the trim — plus 11kg mixed variety packs and bulk belly and shoulder for smokers and caterers.",
    faqs: [
      { question: "What's in a half or whole pig share?", answer: "Leg (roasts or ham), shoulder (roasts or diced), whole or portioned belly, loin and cutlets, spare ribs, hocks, and mince and sausages made from the trim. Ask us to cure some of the leg and belly into bacon and ham, or leave it fresh." },
      { question: "Can I have some of it cured into bacon and ham?", answer: "Yes — that's one of the best reasons to buy a pig share. Nominate on the cut sheet how much leg you want as ham and how much belly as bacon, and we cure it for you." },
      { question: "How much freezer space for half a pig?", answer: "Roughly 50–60 litres for a half, 100–120 litres for a whole — a half needs a dedicated freezer drawer or small chest freezer; a whole wants a 200L+ freezer." },
      { question: "Is the pork Australian?", answer: "Yes — 100% Australian pork, never imported, the same pigs as our retail range." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-goat/": {
    title: "Wholesale Goat Meat — Shares & Curry Cartons | Mr Meat & Co",
    description: "Wholesale goat meat — half and whole Australian carcass shares, 2.5kg and 5kg diced curry cartons, and bulk bone-in goat ribs. Lean, full-flavoured, delivered.",
    h1: "Wholesale & Bulk Goat",
    primaryKeyword: "wholesale goat meat",
    supportingKeywords: ["bulk goat meat", "half goat share", "whole goat carcass", "buy goat meat in bulk", "goat curry cartons", "goat meat wholesale australia"],
    intro: "Wholesale goat meat — Australian goat by the half or whole carcass, cut for curry, roasting and the grill, plus 2.5kg and 5kg cartons of bone-in curry pieces and bulk ribs — for restaurants, caterers and large households cooking goat regularly.",
    faqs: [
      { question: "How is a goat share cut?", answer: "Usually mostly bone-in curry pieces (chopped shoulder, leg and neck), with the loin left as chops or a rack and the ribs kept whole. Tell us if you want more roasting cuts and fewer curry pieces." },
      { question: "What does a half or whole goat weigh?", answer: "A whole goat carcass yields roughly 10–16kg of packed meat depending on the animal; a half, 5–8kg. It's sold by finished weight." },
      { question: "Is goat cheaper in bulk?", answer: "Yes — carton and carcass pricing is well below buying curry pieces by the pack, which is why restaurants and big families order it this way." },
      { question: "How should I cook bulk goat?", answer: "Bone-in curry pieces reward a slow 2-hour simmer with spice — the bones add body to the sauce. Loin and rack can be grilled fast. Goat is lean, so keep braises moist and don't dry-roast the lean cuts." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-sausages/": {
    title: "Bulk Sausages — 5kg & 10kg Wholesale Cartons | Mr Meat & Co",
    description: "Bulk sausages — 5kg and 10kg cartons of butcher beef sausages, thick and thin, plus 5kg gourmet links. Made fresh, snap-frozen, delivered for events and venues.",
    h1: "Wholesale & Bulk Sausages",
    primaryKeyword: "bulk sausages",
    supportingKeywords: ["wholesale sausages", "bulk sausages for bbq", "5kg sausages", "10kg sausage carton", "sausages in bulk", "catering sausages"],
    intro: "Bulk sausages by the 5kg and 10kg carton — traditional thick and thin beef snags, plus gourmet flavour links — made fresh with meat, fat, seasoning and natural casings. For sausage sizzles, clubs, caterers and fundraisers.",
    faqs: [
      { question: "How many sausages in a 5kg or 10kg carton?", answer: "Roughly 60–70 thick sausages or 110–130 thin ones per 5kg, double that for 10kg. Exact count depends on the link size — it's on the product page." },
      { question: "Are they fresh or frozen?", answer: "Made fresh, then snap-frozen for bulk cartons so you can portion what you need. Ask for fresh chilled if you're using the lot within a couple of days." },
      { question: "Can you do a specific flavour or recipe for an event?", answer: "Yes — for larger orders we can run a specific flavour, casing or gluten-free recipe. Contact us with your quantity and date." },
      { question: "What's in the sausages?", answer: "Meat, fat, seasoning, a little rusk in the traditional recipes, and a natural casing. Nothing pumped in to add weight, and no artificial preservative numbers." },
    ],
    guide: "Bulk sausages by the 5kg and 10kg carton are for sausage sizzles, clubs, caterers and fundraisers — the same butcher sausages we sell retail, made fresh and snap-frozen for volume.\n\n### Choosing bulk sausages\n\nTraditional **thick and thin beef snags** are the sausage-sizzle standard — thin cook faster and go further per kilo, thick hold up better on a flat plate. We also carton **gourmet flavour links** (pork and fennel, lamb and rosemary, and more) for events that want something above a plain snag. All are made with meat, fat, seasoning and natural casings — no fillers padding out the weight — so allow for a little more shrinkage than a supermarket sausage.\n\n### Cooking sausages in volume\n\nOn a flat plate or BBQ, keep the heat moderate — high heat splits the casing and burns the outside before the centre is done. Turn regularly for even colour; a sausage is cooked at 71°C internal with no pink. For a big event, part-cook (poach or oven) ahead and finish on the grill to order. Thaw cartons in the fridge, not on the bench, and cook within two days of thawing per the [Food Standards Australia and New Zealand](https://www.foodstandards.gov.au/) guidance. For a sausage sizzle, budget roughly 1.5–2 thin sausages per adult.",
  },
  "/wholesale/bulk-meat-orders/bulk-veal/": {
    title: "Wholesale Veal — Rose Veal Shares & Cartons | Mr Meat & Co",
    description: "Wholesale veal — half and whole Australian rose veal carcass shares, and 5kg cartons of schnitzel, mince, diced veal and osso buco. For restaurants and caterers.",
    h1: "Wholesale & Bulk Veal",
    primaryKeyword: "wholesale veal",
    supportingKeywords: ["bulk veal", "veal schnitzel bulk", "bulk veal mince", "veal osso buco carton", "rose veal wholesale", "restaurant veal supplier"],
    intro: "Wholesale veal — Australian rose veal in volume: half and whole carcass shares cut to a restaurant sheet, and 5kg cartons of pre-cut schnitzel, scaloppine, diced veal, mince and osso buco. Rose veal from group-raised calves, not the crate system.",
    faqs: [
      { question: "Is this rose veal or white veal?", answer: "Rose veal — pale pink, from calves raised in groups with room to move. The immobilised-crate 'white veal' system is not used in Australia." },
      { question: "What carton options are there?", answer: "5kg cartons of crumbed schnitzel, plain scaloppine, diced veal, veal mince, and cross-cut osso buco. Half and whole carcass shares are cut to your specification." },
      { question: "Do you supply veal to restaurants?", answer: "Yes — standing weekly orders with consistent portion sizing for schnitzel and scaloppine, plus osso buco and shanks to order. Set up an account through the wholesale contact page." },
      { question: "Fresh or frozen?", answer: "Carcass shares and cut cartons are supplied snap-frozen. Fresh chilled is available for standing restaurant accounts on a delivery schedule." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-kangaroo/": {
    title: "Wholesale Kangaroo Meat — Shares & Cartons | Mr Meat & Co",
    description: "Wholesale kangaroo meat — boned-out half and whole shares, and 5kg frozen cartons of mince, fillets, diced and sausages. Lean, high-protein, delivered.",
    h1: "Wholesale & Bulk Kangaroo",
    primaryKeyword: "wholesale kangaroo meat",
    supportingKeywords: ["bulk kangaroo meat", "kangaroo mince bulk", "5kg kangaroo carton", "kangaroo fillet wholesale", "bulk kangaroo for dogs", "kangaroo meat supplier"],
    intro: "Wholesale kangaroo meat — wild-harvested Australian roo in volume: boned-out half and whole shares, and 5kg frozen cartons of mince, fillets, diced and sausages. For restaurants, meal-prep businesses, gyms, and raw-feeding dog owners buying by the carton.",
    faqs: [
      { question: "What bulk kangaroo formats are available?", answer: "5kg frozen cartons of kangaroo mince, loin fillets, diced kangaroo and kangaroo sausages, plus boned-out half and whole shares that mix all of the above." },
      { question: "Is bulk kangaroo cheaper than retail?", answer: "Yes — carton pricing is well below the per-pack retail price, which is why meal-prep businesses and raw feeders buy it this way." },
      { question: "Can I buy bulk kangaroo for my dogs?", answer: "Yes — kangaroo is a popular single novel protein for raw feeding. Bulk cartons suit multi-dog households and breeders. It's the same meat as the human range; feed it raw or lightly cooked per your vet's advice." },
      { question: "How is it delivered?", answer: "Snap-frozen, in cold-chain packaging. Keep it at or below -18°C and thaw portions in the fridge." },
    ],
  },
  "/wholesale/bulk-meat-orders/bulk-game/": {
    title: "Wholesale Game Meat — Venison Shares | Mr Meat & Co",
    description: "Wholesale game meat — half and whole farmed venison carcass shares, frozen venison mince and osso buco cartons, and mixed game boxes with wild boar and more.",
    h1: "Wholesale & Bulk Game Meat",
    primaryKeyword: "wholesale game meat",
    supportingKeywords: ["bulk venison", "venison carcass share", "wholesale venison", "bulk game meat box", "wild boar wholesale", "game meat supplier australia"],
    intro: "Wholesale game meat in volume — half and whole farmed venison carcass shares cut to your sheet, 5kg frozen cartons of venison mince, backstrap and osso buco, and large mixed game boxes bringing in wild boar, rabbit and more. For restaurants and serious home cooks.",
    faqs: [
      { question: "What's in a venison carcass share?", answer: "Backstrap and fillet as premium cuts, leg as roasts or diced, shoulder and shank for braising, osso buco from the shanks, and mince and sausages from the trim. Cut to your sheet." },
      { question: "Is the venison farmed or wild?", answer: "Farmed — Australian farmed venison from licensed producers, consistent in size and supply, unlike wild-shot deer. Wild boar in the mixed boxes is wild-harvested." },
      { question: "What carton sizes are there?", answer: "5kg frozen cartons of venison mince, backstrap and osso buco, and mixed game boxes from 5kg upward. Larger and custom volumes on account." },
      { question: "Do you supply game to restaurants?", answer: "Yes — standing orders of venison backstrap, osso buco and mince with consistent portioning. Contact us through the wholesale page to set up an account." },
    ],
  },
};

export const FAQ: FAQItem[] = [
  {
    question: "Where do you deliver?",
    answer: "We run refrigerated cold-chain vans across the whole of NSW — Sydney Metro plus regional runs including Wollongong and the Central Coast. Everywhere else in Australia, your order is snap-frozen, packed in insulated boxes and sent by express courier. Every order is packed cold with gel ice so it's still cold when it reaches your door. Choose your delivery day at checkout.",
  },
  {
    question: "What's the minimum order, and is delivery free?",
    answer: "The minimum order is $300 AUD. Orders over $300 get free temperature-controlled delivery anywhere in NSW — no separate delivery fee. Interstate orders over $300 pay a frozen-courier freight fee, quoted at checkout or on request.",
  },
  {
    question: "Is all your meat 100% Australian and grass-fed?",
    answer: "Our beef and lamb are 100% Australian, pasture-raised and grass-fed. Chicken is free-range, pork is Australian, and everything is cut or ground fresh in our Alexandria butchery with no added water, cereal fillers or preservative.",
  },
  {
    question: "How does the 10% crypto discount work?",
    answer: "Pay for your order in cryptocurrency (BTC or USDT) and 10% comes off the total automatically at checkout. It's crypto only — PayID and bank transfer are fee-free but don't attract the discount, and we don't take cards.",
  },
  {
    question: "How do you keep the meat cold in transit?",
    answer: "Orders are packed into insulated liners with frozen gel packs and moved on refrigerated vehicles. For longer NSW runs the meat travels snap-frozen. If anything arrives above temperature, contact us the same day and we'll replace it.",
  },
  {
    question: "Can I order wholesale or in bulk?",
    answer: "Yes — see the wholesale page for quarter, half and whole beef, lamb and pork shares cut to your sheet, 5kg and 10kg cartons, and standing restaurant supply. Bulk pricing is per kg at a rate below individual cuts.",
  },
];

/* ------------------------------------------------------------------ *
 * FAQ_GROUPS — the full themed FAQ bank shown on /faq/.
 * All items are also emitted as one combined FAQPage JSON-LD block.
 * Answers are concrete (never "it depends"), 40–90 words, crypto-only
 * discount wording, and steer to the relevant section by name.
 * ------------------------------------------------------------------ */
export interface FaqGroup {
  heading: string;
  intro?: string;
  items: FAQItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: "Delivery, freshness & storage",
    items: [
      { question: "What days do you deliver and how far do you ship?", answer: "We run refrigerated vans across Greater Sydney Metro most weekdays, with set weekly runs to Wollongong, the Central Coast and regional NSW. You pick an available delivery day at checkout. Anywhere else in Australia, orders are snap-frozen and sent by express courier — freight is quoted at checkout." },
      { question: "Is the meat fresh or frozen when it arrives?", answer: "Most retail cuts arrive fresh chilled and vacuum-sealed. Some items — game, specialty meat, bulk cartons and anything travelling a long distance — arrive snap-frozen. Each product page states its storage type, and frozen items are labelled clearly." },
      { question: "How is the cold chain maintained — will it still be cold at my door?", answer: "Orders are packed into insulated liners with frozen gel packs and carried on temperature-controlled vans. A typical Sydney Metro delivery keeps meat below 4°C the whole way. If your order ever arrives above temperature, photograph it and contact us the same day for a replacement or refund." },
      { question: "How long does the meat last once delivered?", answer: "Fresh chilled cuts keep 3–4 days in the coldest part of your fridge in their unopened vacuum pack; mince and sausages, 2–3 days. Freeze anything you won't use in that window — vacuum-sealed cuts hold quality 6–12 months at -18°C." },
      { question: "Can I freeze the meat when it arrives?", answer: "Yes. Freeze it on the day of delivery while it's at peak freshness, ideally in its original vacuum pack. Portion mince and sausages into meal-size amounts first. Thaw in the fridge overnight, never on the bench, and don't refreeze raw meat once thawed." },
      { question: "What happens if I'm not home for delivery?", answer: "Leave delivery notes at checkout — most customers have the box left in a shaded spot or with a neighbour. The insulated packaging holds temperature for a few hours. If you know you'll be out all day, choose a different delivery date; we can't guarantee safety for a box left in the sun." },
      { question: "Do you deliver to Wollongong, the Central Coast, Newcastle or interstate?", answer: "Wollongong, the Central Coast and much of regional NSW are on scheduled cold-chain van runs — the checkout shows the next available date. Newcastle and the Hunter, and everywhere outside NSW, are served by frozen express courier; the checkout quotes the freight. Contact us with your postcode if you're not sure." },
    ],
  },
  {
    heading: "Ordering, pricing & payment",
    items: [
      { question: "What's the minimum order value?", answer: "$300 AUD. Orders at or above $300 get free temperature-controlled delivery anywhere in NSW, so there's no delivery fee on top. Interstate orders over $300 pay only a frozen-courier freight fee, quoted at checkout." },
      { question: "How do I get the 10% discount?", answer: "Pay in cryptocurrency — Bitcoin (BTC) or Tether (USDT). The 10% comes off automatically when you choose crypto at checkout. It's crypto only: PayID and bank transfer are fee-free but don't earn the discount." },
      { question: "Do you charge a card or payment surcharge?", answer: "No. PayID and direct bank transfer are completely fee-free. We don't accept credit cards at all, so there's no card surcharge to worry about. Crypto payments additionally get the 10% discount." },
      { question: "Can I change or cancel an order?", answer: "Yes, up until your order is packed — usually the afternoon before your delivery date. Contact us as early as you can. Once an order is cut, packed and loaded we can't recall it, but we'll always sort out genuine mistakes." },
      { question: "How does WhatsApp ordering work?", answer: "Message us your list on WhatsApp and we'll build the order, confirm weights and the total, and send payment details. It suits big or unusual orders and cut-sheet requests. Payment is still PayID, bank transfer or crypto — the crypto discount still applies." },
      { question: "How do your prices compare to the supermarket?", answer: "On everyday mince and chicken we're usually a little above supermarket special pricing and comparable to their standard pricing — but for whole-muscle cuts, and especially for bulk cartons and animal shares, we're well below butcher retail. The trade-off is named-cut quality, real fat ratios and nothing added." },
    ],
  },
  {
    heading: "Quality & provenance",
    items: [
      { question: "Is your beef grass-fed or grain-fed?", answer: "Our standard beef is 100% Australian grass-fed and pasture-raised for its whole life. Where a product is grain-finished or Wagyu we say so on the product page. See our grass-fed vs grain-fed guide on the blog for what the difference means on the plate." },
      { question: "Where do your animals come from?", answer: "From verified Australian farms, with beef and lamb from pasture-based NSW and Victorian producers. We buy whole and primal and break it down in our Alexandria butchery, so there's no imported trim and no anonymous blended product." },
      { question: "Are there any added preservatives, water or fillers?", answer: "No. Our fresh meat and mince are just meat — nothing pumped in to add weight, no cereal fillers, no artificial preservative numbers. Sausages contain meat, fat, seasoning, a little rusk in the traditional recipes, and a natural casing. Cured items (bacon, ham) are listed with their exact cure." },
      { question: "Is your chicken free-range?", answer: "Yes — our chicken is Australian free-range with genuine outdoor access, delivered fresh chilled. Bulk chicken cartons are the same birds at a lower per-kg price." },
      { question: "Is your pork Australian?", answer: "Yes, 100% Australian pork — never imported. That includes the bacon, the ham and the Christmas hams, which are cured here from Australian legs." },
      { question: "Are your sausages gluten-free?", answer: "Some are and some aren't. The traditional recipes contain a little rusk (wheat). We make dedicated gluten-free sausages with no wheat rusk — they're labelled as such on the product page. If you need certainty for coeliac disease, message us and we'll confirm the current batch." },
      { question: "Is your bacon nitrate-free?", answer: "We offer a salt-and-sugar cure with no added nitrates, nitrites or celery powder — genuinely additive-free, with the shorter shelf life that implies — alongside a lightly-cured traditional bacon. Both are Australian pork and neither is water-pumped. See the nitrate-free bacon explainer on the blog." },
    ],
  },
  {
    heading: "Cuts & cooking",
    items: [
      { question: "What's the difference between a lamb chop and a cutlet?", answer: "A cutlet comes from the rack — small, lean, with a long frenched bone, best grilled fast. A loin chop is a mini T-bone with a tender eye and a strip of belly. A chump chop comes from the rump and is larger and meatier. See the lamb chops page for all three." },
      { question: "Scotch fillet vs porterhouse vs eye fillet — which is which?", answer: "Scotch fillet (ribeye) is from the fore-rib: well-marbled, rich and forgiving. Porterhouse (sirloin) is from the loin: firmer, leaner and beefier, with a fat cap on one edge. Eye fillet (tenderloin) is the lean, ultra-tender muscle that does no work — mild and buttery. All three are on the beef steaks page." },
      { question: "What's the best beef cut for a slow cooker?", answer: "Chuck is the most forgiving all-rounder. Beef cheek gives the silkiest result. Gravy beef or shin thickens the sauce by itself thanks to its collagen. Avoid lean cuts like rump — they go dry and stringy. The beef slow-cook page groups these together." },
      { question: "Which pork roast gives the best crackling?", answer: "A bone-in or boneless pork shoulder or a pork rack with the rind on. Ask us to score the rind, dry it uncovered in the fridge overnight, rub with salt, and start the roast at 240°C for 25–30 minutes before dropping the heat. Full method is in the pork crackling guide on the blog." },
      { question: "What fat ratio is your mince?", answer: "Beef: premium is about 80/20, lean around 90/10, extra-lean around 95/5. Lamb and pork mince are about 80/20 standard and 90/10 lean. Every pack is labelled with its actual ratio — we grind from named muscles, not to a blended target." },
      { question: "How many chops, sausages or patties per kilo?", answer: "Roughly: 6–8 lamb loin chops or 10–14 cutlets per kg; 5–6 thick pork chops per kg; 6–8 thick sausages per 500g pack (12–16 thin); and 6 standard 150–180g burger patties per kg." },
      { question: "Bone-in or boneless leg of lamb for roasting?", answer: "Bone-in has slightly better flavour and cooks a touch more evenly. Boneless carves into clean slices, cooks faster and can be stuffed or butterflied. We'll bone, roll or butterfly any leg at no extra charge — just add a note. See the how-to-roast-a-leg-of-lamb guide." },
    ],
  },
  {
    heading: "Kangaroo & specialty meat",
    items: [
      { question: "Is kangaroo meat healthy?", answer: "It's one of the leanest red meats available — typically under 2% fat, around 22g protein per 100g, and higher in iron and zinc than beef, with a natural source of CLA. The main catch is that it overcooks easily, so it's best served rare to medium-rare." },
      { question: "How much does kangaroo meat cost per kg?", answer: "Kangaroo generally sits below premium beef and around mid-range beef. Mince and diced are the best value; fillet is the premium cut but still usually cheaper than beef eye fillet. Current pricing is on each product on the kangaroo page." },
      { question: "Is kangaroo cheaper than beef?", answer: "Cut for cut, usually yes — especially mince, sausages and diced — because kangaroo is wild-harvested under quota rather than raised, fed and housed." },
      { question: "Is kangaroo meat sustainable and ethical?", answer: "Kangaroo is wild-harvested from abundant species under government quotas, with no land clearing, feedlots or methane footprint of farmed cattle. It's widely regarded as one of the lower-impact red meats available in Australia." },
      { question: "How do you cook kangaroo so it stays tender?", answer: "Steaks and fillet: sear hard and fast, about 2 minutes a side for a 2cm steak, pull at 52–55°C internal, then rest 5 minutes. Diced kangaroo needs the opposite — a slow 2-hour braise. A little oil in a marinade replaces the fat the meat lacks." },
      { question: "Does kangaroo taste gamey?", answer: "Only mildly — a clean, slightly sweet, iron-rich flavour that's closer to good grass-fed beef than to venison. Cooking it past medium is what makes it taste strong and livery." },
      { question: "What is veal and is yours ethically raised?", answer: "Veal is meat from young cattle. Ours is Australian rose veal — calves raised in groups with room to move, producing pale pink meat, not the immobilised-crate 'white veal' system that's been abandoned here. It's mild, lean and fine-grained. See the veal page and the veal explainer on the blog." },
      { question: "Where can I buy goat, rabbit or game meat in Australia?", answer: "All of them are on our specialty meat pages — goat (curry pieces, shoulder, ribs), farmed rabbit (whole, jointed, loin), and game including venison, wild boar, crocodile and emu. Cold-chain van delivery covers all of NSW; orders elsewhere in Australia ship snap-frozen by express courier." },
    ],
  },
  {
    heading: "Seafood",
    items: [
      { question: "Are the prawns raw or cooked, fresh or frozen?", answer: "Both raw (green) and cooked prawns are available, and each product page says which. Most are snap-frozen at their peak, which for prawns is genuinely as good as — often better than — 'fresh' prawns that have been thawed on ice at a counter for days." },
      { question: "What's the difference between king, tiger and banana prawns?", answer: "King prawns are large, sweet and firm — the premium eating prawn. Tiger prawns are striped, meaty and hold up well on the grill. Banana prawns are smaller, softer and milder, and are the value choice for curries and fried rice. See the prawn comparison guide on the blog." },
      { question: "Can I freeze prawns at home?", answer: "If they arrived frozen and you've kept them frozen, just keep them that way. If they arrived thawed, use them within a day and don't refreeze raw. Cooked prawns can be frozen once for up to a month." },
      { question: "Where is your seafood from?", answer: "Origin varies by product and season and is listed on each product page. We prioritise Australian where the species and supply allow, and label imported product honestly." },
    ],
  },
  {
    heading: "Wholesale & bulk orders",
    items: [
      { question: "What's your minimum wholesale order?", answer: "Bulk cartons start at 5kg per line. Carcass shares start at a quarter beast. Standing restaurant supply is arranged per account — contact us with your weekly volumes and we'll quote." },
      { question: "Do you supply restaurants and cafés?", answer: "Yes — standing weekly orders, custom cuts and cut sheets, consistent portion control, and delivery timed around your service. Get in touch through the wholesale contact page to set up an account." },
      { question: "What's in a quarter, half or whole beef share, and how much freezer space do I need?", answer: "A share is a spread of premium steaks, roasting and casserole cuts, and mince and diced from the trim — roughly 25–30% premium, 30–35% roasts, 25–30% mince. A quarter is about 40–55kg of packed meat (needs ~85L of freezer), a half 80–110kg (a dedicated 200–250L chest freezer), a whole 160–220kg." },
      { question: "How does carcass or bulk pricing work?", answer: "Carcass shares are priced per kg of hanging weight and cut to your sheet — typically 20–35% below buying the same cuts individually. Bulk cartons are priced per kg at a flat bulk rate. You pay for the actual finished weight." },
      { question: "Can I choose my own cuts with a cut sheet?", answer: "Yes. For an animal share you specify steak thickness, roast sizes, the mince-to-diced ratio, and whether you want the bones, offal and sausages made from the trim. We have a sensible standard sheet if you'd rather not decide every line." },
      { question: "Do you deliver bulk orders Australia-wide?", answer: "Refrigerated cold-chain van delivery covers all of NSW. For a full carcass share, be home with freezer space cleared. Frozen cartons are sent interstate by express courier — the checkout quotes the freight, or ask us." },
    ],
  },
  {
    heading: "Live poultry",
    items: [
      { question: "What does 'point of lay' mean?", answer: "Point-of-lay (POL) pullets are 16–20 weeks old — either just started laying or within a few weeks of it. They're past the fragile brooder stage and are the quickest, lowest-effort way to start a laying flock." },
      { question: "How do I collect live birds — do you deliver them?", answer: "Live poultry is collected from our farm partner by appointment, or delivered within a limited radius of Sydney for a fee — arranged separately from the cold-chain meat run. The $300 site minimum order still applies to live-bird orders. We confirm collection or delivery options with you when you order." },
      { question: "Are the hens vaccinated and sexed?", answer: "Point-of-lay hens and pullets are sold as sexed females, vaccinated against Marek's disease and typically Newcastle disease and infectious bronchitis. Each listing states its vaccinations. Straight-run (unsexed) meat birds are noted as such." },
      { question: "Is there a minimum number of birds?", answer: "Yes — chickens are flock animals and shouldn't be kept alone, so most listings have a minimum of two or three birds (six for meat birds). Bantam and rare breeds may vary." },
      { question: "What breeds do you stock?", answer: "Commonly ISA Brown and Hyline for reliable brown eggs, Australorp and Plymouth Rock as dual-purpose birds, fast-growing meat strains, and a rotating seasonal selection of Silkie and Pekin bantams. Availability changes through the year — contact us for the current list." },
    ],
  },
  {
    heading: "Raw pet feeding",
    items: [
      { question: "Is this raw pet food or for human consumption?", answer: "The pet food range is prepared specifically for animal diets and is labelled 'Pet Food Only — Not for Human Consumption'. It's kept separate from our retail meat. Our human-grade beef and pork stock bones are listed under Bones & Broth in the beef and pork categories instead." },
      { question: "What proteins do you offer for raw or BARF feeding?", answer: "Raw pet mince across beef, chicken, kangaroo and mixed blends, plus raw meaty bones and offal. Kangaroo is popular as a single novel protein for dogs with chicken or beef sensitivities. See the pet food category and the raw feeding starter guide on the blog." },
      { question: "How much raw mince per day for my dog?", answer: "About 2–3% of ideal adult body weight per day — roughly 375g for a 15kg dog to maintain weight, 750g for a 30kg dog. Active dogs need more, less active dogs less. Puppies eat 5–8% of current weight, split across 3–4 meals." },
      { question: "Which bones are safe — and why never cooked bones?", answer: "Raw meaty bones sized to your dog (never smaller than their muzzle) are safe for supervised chewing. Never feed cooked bones of any kind — cooking makes them brittle so they splinter into sharp fragments that can pierce the gut. Weight-bearing beef leg bones can crack teeth on hard chewers." },
      { question: "How is raw pet food delivered?", answer: "Frozen, in the same insulated cold-chain packaging as the rest of your order. Keep it frozen at or below -18°C and thaw portions in the fridge as needed." },
      { question: "Is kangaroo good for dogs with allergies?", answer: "It's one of the leading novel proteins for elimination diets — many dogs reactive to chicken, beef or lamb tolerate kangaroo well because they've never been exposed to it. It's also very lean. Introduce any new protein gradually over a week." },
    ],
  },
];

export const COMPLIANCE = {
  bannedTerms: [
    ["preservative", "223"].join(" "),
    ["nitrogen", "flushing"].join(" "),
    ["water", "pumping"].join(" "),
    ["synthetic", "binders"].join(" "),
    ["imported", "beef", "trim"].join(" ")
  ],
  requiredFramings: ["100% Australian Sourced Meat"],
  prohibitedClaims: [],
  ageGate: false,
  ageMinimum: null,
  gdpr: true,
  disclaimer: "All prices in AUD and include GST where applicable. Free cold-chain delivery across NSW on orders $300+; interstate orders ship frozen by courier with freight quoted at checkout.",
};
