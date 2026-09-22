'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, Reply } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredEnquiry } from '@/lib/enquiryStore';

function EnquiryDetail({ passcode }: { passcode: string }) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!passcode || !id) { setLoading(false); return; }
    fetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`, { headers: { 'X-Admin-Passcode': passcode } })
      .then((r) => r.json())
      .then((d) => { setEnquiry(d.enquiry || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [passcode, id]);

  async function handleDelete() {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    await fetch(`/api/admin/enquiries/${encodeURIComponent(id!)}/`, {
      method: 'DELETE',
      headers: { 'X-Admin-Passcode': passcode },
    });
    router.push('/admin/enquiries/');
  }

  if (loading) return <div className="px-4 sm:px-6 py-8 text-gray-400 text-sm">Loading enquiry…</div>;

  if (!enquiry) return (
    <div className="px-4 sm:px-6 py-16 text-center">
      <p className="text-gray-400 text-sm mb-4">Enquiry not found.</p>
      <a href="/admin/enquiries/" className="text-xs font-bold text-red-400 hover:text-red-300">← Back to enquiries</a>
    </div>
  );

  const created = enquiry.createdAt ? new Date(enquiry.createdAt) : null;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-serif text-white">Enquiry</h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            {created ? created.toLocaleDateString('en-AU', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1C1212] text-gray-300 capitalize">
              {enquiry.type}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              enquiry.status === 'replied' ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
            }`}>
              {enquiry.status}
            </span>
          </div>
        </div>
        <button onClick={handleDelete} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-400">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Contact</div>
          <div className="text-white font-bold text-sm">{enquiry.name}</div>
          {enquiry.email && <div className="text-gray-300 text-xs mt-1">{enquiry.email}</div>}
          {enquiry.phone && <div className="text-gray-300 text-xs mt-0.5">{enquiry.phone}</div>}
        </div>
        <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Details</div>
          <div className="text-white font-bold text-sm capitalize">{enquiry.type}</div>
          {enquiry.meta?.subject && <div className="text-gray-400 text-xs mt-1">{enquiry.meta.subject}</div>}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">Message</div>
        <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
          {enquiry.message}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <a
          href={`/admin/reply-enquiry/?id=${encodeURIComponent(enquiry.id)}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-red-700 to-red-900 text-white text-sm font-bold hover:from-red-600 hover:to-red-800 transition-all"
        >
          <Reply className="w-4 h-4" />
          {enquiry.status === 'replied' ? 'Send another reply' : 'Reply'}
        </a>
        <a href="/admin/enquiries/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-400">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to enquiries
        </a>
      </div>
    </div>
  );
}

export default function EnquiryDetailPage() {
  return <PasscodeGate>{(passcode) => <EnquiryDetail passcode={passcode} />}</PasscodeGate>;
}
