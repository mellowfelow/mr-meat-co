'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Send, RefreshCw, MessageSquare, Mail } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredOrder } from '@/lib/orderStore';

function OrdersList({ passcode }: { passcode: string }) {
  const router = useRouter();
  const [orders, setOrders] = useState<StoredOrder[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/admin/orders/', { headers: { 'X-Admin-Passcode': passcode } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load orders.');
      setOrders(data.orders);
      setConfigured(data.configured);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [passcode]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}? This can't be undone.`)) return;
    await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}/`, {
      method: 'DELETE',
      headers: { 'X-Admin-Passcode': passcode },
    });
    load();
  };

  return (
    <div className="px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-serif text-white">Orders</h1>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-red-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {!configured && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-xs text-amber-200">
          Order storage isn&apos;t configured yet — add <code>UPSTASH_REDIS_REST_URL</code> and{' '}
          <code>UPSTASH_REDIS_REST_TOKEN</code> as Vercel env vars. Orders are still emailed in the meantime.
        </div>
      )}
      {error && <div className="p-4 bg-red-950/40 border border-red-600/50 rounded-2xl text-xs text-red-200">{error}</div>}

      {orders === null ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="p-8 bg-[#141414] border border-[#991B1B]/40 rounded-2xl text-center text-gray-400 text-sm">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.orderNumber}
              className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl flex flex-wrap items-center gap-4 cursor-pointer hover:border-red-500/60 transition-colors"
              onClick={() => router.push(`/admin/orders/${encodeURIComponent(o.orderNumber)}`)}
            >
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-red-400 font-bold">{o.orderNumber}</span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      o.status === 'payment-sent' ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
                    }`}
                  >
                    {o.status === 'payment-sent' ? 'Sent' : 'Pending'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1C1212] text-gray-300 flex items-center gap-1">
                    {o.channel === 'whatsapp' ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                    {o.channel}
                  </span>
                </div>
                <div className="text-white font-bold text-sm mt-1">{o.customerName}</div>
                <div className="text-gray-400 text-xs">
                  {o.customerEmail || o.customerPhone || 'No contact info'} · {new Date(o.createdAt).toLocaleString('en-AU')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-black">${o.amountDue.toFixed(2)} AUD</div>
                <div className="text-gray-500 text-[11px]">{o.items.length} item{o.items.length === 1 ? '' : 's'}</div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/send-payment-email/?id=${encodeURIComponent(o.orderNumber)}`)}
                  className="p-2 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-900/70"
                  title="Send payment details"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(o.orderNumber)}
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

export default function AdminOrdersPage() {
  return <PasscodeGate>{(passcode) => <OrdersList passcode={passcode} />}</PasscodeGate>;
}
