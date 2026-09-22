'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, Send } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredOrder } from '@/lib/orderStore';

function OrderDetail({ passcode }: { passcode: string }) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!passcode || !id) { setLoading(false); return; }
    fetch(`/api/admin/orders/${encodeURIComponent(id)}/`, { headers: { 'X-Admin-Passcode': passcode } })
      .then((r) => r.json())
      .then((d) => { setOrder(d.order || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [passcode, id]);

  async function handleDelete() {
    if (!confirm(`Delete order ${id}? This cannot be undone.`)) return;
    await fetch(`/api/admin/orders/${encodeURIComponent(id!)}/`, {
      method: 'DELETE',
      headers: { 'X-Admin-Passcode': passcode },
    });
    router.push('/admin/orders/');
  }

  if (loading) return <div className="px-4 sm:px-6 py-8 text-gray-400 text-sm">Loading order…</div>;

  if (!order) return (
    <div className="px-4 sm:px-6 py-16 text-center">
      <p className="text-gray-400 text-sm mb-4">Order not found.</p>
      <a href="/admin/orders/" className="text-xs font-bold text-red-400 hover:text-red-300">← Back to orders</a>
    </div>
  );

  const created = order.createdAt ? new Date(order.createdAt) : null;

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-serif text-white">Order {order.orderNumber}</h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            {created ? created.toLocaleDateString('en-AU', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              order.status === 'payment-sent' ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
            }`}>
              {order.status === 'payment-sent' ? 'Sent' : 'Pending'}
            </span>
          </div>
        </div>
        <button onClick={handleDelete} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-400">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Customer</div>
          <div className="text-white font-bold text-sm">{order.customerName}</div>
          {order.customerEmail && <div className="text-gray-300 text-xs mt-1">{order.customerEmail}</div>}
          {order.customerPhone && <div className="text-gray-300 text-xs mt-0.5">{order.customerPhone}</div>}
          {order.address && <div className="text-gray-400 text-xs mt-2">{order.address}</div>}
        </div>
        <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Payment</div>
          <div className="text-white font-bold text-sm">{order.paymentMethod || '—'}</div>
          <div className="text-white font-black text-2xl mt-2">${order.amountDue.toFixed(2)} AUD</div>
          {order.subtotal !== order.amountDue && (
            <div className="text-gray-500 text-xs">Subtotal: ${order.subtotal.toFixed(2)} AUD</div>
          )}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">Items</div>
        <div className="bg-[#141414] border border-[#991B1B]/40 rounded-2xl overflow-hidden">
          {(order.items || []).map((item, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? 'border-t border-[#991B1B]/20' : ''}`}>
              <span className="text-gray-200">{item.quantity} × {item.name}</span>
              <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {order.notes && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">Notes</div>
          <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl text-gray-300 text-sm whitespace-pre-wrap">
            {order.notes}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <a
          href={`/admin/send-payment-email/?id=${encodeURIComponent(order.orderNumber)}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-red-700 to-red-900 text-white text-sm font-bold hover:from-red-600 hover:to-red-800 transition-all"
        >
          <Send className="w-4 h-4" />
          {order.status === 'payment-sent' ? 'Resend payment email' : 'Send payment email'}
        </a>
        <a href="/admin/orders/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-400">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to orders
        </a>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return <PasscodeGate>{(passcode) => <OrderDetail passcode={passcode} />}</PasscodeGate>;
}
