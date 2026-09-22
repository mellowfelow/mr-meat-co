'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Reply, RefreshCw } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredEnquiry } from '@/lib/enquiryStore';

const TABS = ['all', 'contact', 'wholesale', 'bulk', 'new', 'replied'] as const;
type Tab = (typeof TABS)[number];

function EnquiriesList({ passcode }: { passcode: string }) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<StoredEnquiry[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('all');

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/admin/enquiries/', { headers: { 'X-Admin-Passcode': passcode } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load enquiries.');
      setEnquiries(data.enquiries);
      setConfigured(data.configured);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [passcode]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Delete this enquiry? This can\'t be undone.')) return;
    await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`, {
      method: 'DELETE',
      headers: { 'X-Admin-Passcode': passcode },
    });
    load();
  };

  const filtered = (enquiries || []).filter((e) => {
    if (tab === 'all') return true;
    if (tab === 'new' || tab === 'replied') return e.status === tab;
    return e.type === tab;
  });

  return (
    <div className="px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-serif text-white">Enquiries</h1>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-red-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
              tab === t ? 'bg-red-800 text-white' : 'bg-[#1C1212] text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!configured && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-xs text-amber-200">
          Enquiry storage isn&apos;t configured yet — add <code>UPSTASH_REDIS_REST_URL</code> and{' '}
          <code>UPSTASH_REDIS_REST_TOKEN</code> as Vercel env vars. Enquiries are still emailed in the meantime.
        </div>
      )}
      {error && <div className="p-4 bg-red-950/40 border border-red-600/50 rounded-2xl text-xs text-red-200">{error}</div>}

      {enquiries === null ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 bg-[#141414] border border-[#991B1B]/40 rounded-2xl text-center text-gray-400 text-sm">
          No enquiries here.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl flex flex-wrap items-start gap-4 cursor-pointer hover:border-red-500/60 transition-colors"
              onClick={() => router.push(`/admin/enquiries/${encodeURIComponent(e.id)}`)}
            >
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1C1212] text-gray-300 capitalize">
                    {e.type}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      e.status === 'replied' ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
                <div className="text-white font-bold text-sm mt-1">{e.name}</div>
                <div className="text-gray-400 text-xs">{e.email || e.phone || 'No contact info'}</div>
                <p className="text-gray-300 text-xs mt-1.5 line-clamp-2">{e.message}</p>
                <div className="text-gray-500 text-[11px] mt-1">{new Date(e.createdAt).toLocaleString('en-AU')}</div>
              </div>
              <div className="flex items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/reply-enquiry/?id=${encodeURIComponent(e.id)}`)}
                  className="p-2 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-900/70"
                  title="Reply"
                >
                  <Reply className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  className="p-2 rounded-lg bg-[#1C1212] text-gray-400 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminEnquiriesPage() {
  return <PasscodeGate>{(passcode) => <EnquiriesList passcode={passcode} />}</PasscodeGate>;
}
