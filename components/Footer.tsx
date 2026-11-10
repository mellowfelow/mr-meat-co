import React from "react";
import Link from "next/link";
import { SITE, CONTACT, BRAND, CATEGORIES } from "@/config/site";
import { MeatLogo } from "@/components/MeatLogo";
import { MapPin, Phone, Mail, ShieldCheck, Truck, FileText, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0C0808] text-[#FAF7F2] border-t border-[#991B1B]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#DC2626] via-[#B91C1C] to-[#450A0A] rounded-2xl flex items-center justify-center text-white shadow-md border border-red-500/40 p-1.5">
                <MeatLogo className="w-full h-full text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider uppercase text-white block font-serif">
                  {SITE.name}
                </span>
                <span className="text-[10px] uppercase font-black text-red-400 tracking-widest block">
                  Australian Online Meat Shop
                </span>
              </div>
            </Link>
            <p className="text-xs text-gray-300 leading-relaxed max-w-md">
              {BRAND.description}
            </p>

            <div className="pt-2 space-y-2 text-xs text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>{CONTACT.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>{CONTACT.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: CONTACT.emailHtml }} />
              </div>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 font-serif border-b border-[#991B1B]/30 pb-2">
              Shop by Category
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-300 max-h-56 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}/`} className="hover:text-red-300 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/shop/" className="hover:underline transition-colors font-semibold text-red-400">
                  View Full Catalogue →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 font-serif border-b border-[#991B1B]/30 pb-2">
              Company & Resources
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/about/" className="hover:text-red-300 transition-colors">
                  About Our Butcher Shop
                </Link>
              </li>
              <li>
                <Link href="/wholesale/" className="hover:text-red-300 transition-colors">
                  Wholesale Restaurant Program
                </Link>
              </li>
              <li>
                <Link href="/faq/" className="hover:text-red-300 transition-colors">
                  FAQ & Cold-Chain Shipping
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-red-300 transition-colors">
                  Contact & Meat Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Trust Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 font-serif border-b border-[#991B1B]/30 pb-2">
              PayID & Direct Payment
            </h4>
            <p className="text-xs text-gray-300">
              Save 10% on your meat order when you pay with cryptocurrency (BTC / USDT).
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 bg-[#1C1414] rounded-lg text-[11px] font-bold text-red-300 border border-[#991B1B]/40">
                PayID Instant
              </span>
              <span className="px-2.5 py-1 bg-[#1C1414] rounded-lg text-[11px] font-bold text-gray-300 border border-gray-700">
                Bank Transfer
              </span>
              <span className="px-2.5 py-1 bg-[#1C1414] rounded-lg text-[11px] font-bold text-red-300 border border-red-900/50">
                Bitcoin (BTC)
              </span>
              <span className="px-2.5 py-1 bg-[#1C1414] rounded-lg text-[11px] font-bold text-red-300 border border-red-900/50">
                Tether (USDT)
              </span>
            </div>

            <div className="pt-2 text-xs text-gray-300 space-y-1">
              <div className="flex items-center space-x-1 text-red-400 font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>Free Cold-Chain Delivery Across NSW ($300 Min) · Frozen Courier Australia-Wide</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>100% Australian Sourced Meat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#991B1B]/30 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved. Sydney, Australia.
            <span className="block md:inline md:ml-1 text-gray-400">ABN {SITE.abn}</span>
          </div>
          <div className="text-gray-300 font-medium">
            100% Australian Grass-Fed & Hormone-Free Meat Selection
          </div>
        </div>
      </div>
    </footer>
  );
}
