'use client';

import React, { useState } from 'react';
import { CONTACT } from '@/config/site';
import { Phone, Mail, X, ShieldCheck, ChevronRight } from 'lucide-react';

function WhatsAppIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.84L0 24l6.344-1.498A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.84 0-3.58-.485-5.09-1.332l-.365-.205-3.774.891.91-3.678-.228-.37A9.957 9.957 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

export function ChatHub() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black p-3.5 rounded-full shadow-2xl flex items-center justify-center space-x-2 transition-all transform hover:scale-105 border-2 border-red-500/60"
        aria-label="Open WhatsApp Butcher Chat"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <WhatsAppIcon className="w-6 h-6 text-white" />}
        <span className="hidden sm:inline text-xs font-black tracking-wide pr-1 text-white">WhatsApp Chat</span>
      </button>

      {/* Floating Contact Drawer */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-[#1C1414] rounded-2xl shadow-2xl border border-[#991B1B]/50 p-4 space-y-4 text-white animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-[#991B1B]/30 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center p-1.5 shadow-md">
                <WhatsAppIcon className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">WhatsApp Butcher Support</h3>
                <p className="text-xs text-red-400 font-medium flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                  <span>Online — Alexandria Workshop</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-[#2D1212] hover:bg-[#3D1818] border border-red-600/50 rounded-xl transition-colors text-white group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#DC2626] text-white flex items-center justify-center p-2 shadow-md shrink-0">
                  <WhatsAppIcon className="w-full h-full text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">WhatsApp Direct Order</div>
                  <div className="text-[11px] text-red-300">Instant response from Sydney butchers</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={`tel:${CONTACT.phone.replace(/[^\d]/g, '')}`}
              className="flex items-center justify-between p-3 bg-[#281818] hover:bg-[#331E1E] border border-[#991B1B]/40 rounded-xl transition-colors text-white group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Call Hotline</div>
                  <div className="text-[11px] text-gray-400">{CONTACT.phone}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="mailto:orders@mrmeatandco.com.au"
              className="flex items-center justify-between p-3 bg-[#281818] hover:bg-[#331E1E] border border-[#991B1B]/40 rounded-xl transition-colors text-white group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gray-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Email Inquiry</div>
                  <div className="text-[11px] text-gray-400" dangerouslySetInnerHTML={{ __html: CONTACT.emailHtml }} />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="pt-2 border-t border-[#991B1B]/30 text-[11px] text-gray-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
            <span>Cold-chain delivery across NSW · frozen courier Australia-wide.</span>
          </div>
        </div>
      )}
    </div>
  );
}

