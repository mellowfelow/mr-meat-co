import { NextRequest, NextResponse } from "next/server";
import { SITE, FORMS, abs } from "@/config/site";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml, type EmailRow } from "@/lib/emailTemplate";
import { generateOrderNumber } from "@/lib/orderNumber";
import {
  isOrderStoreConfigured,
  saveOrder,
  type StoredOrder,
  type StoredOrderItem,
} from "@/lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OrderPayload {
  /** Optional — the WhatsApp checkout generates this client-side (before
   *  any server round-trip) so the same reference appears in the WhatsApp
   *  message, the dashboard, and this email. Falls back to a fresh one. */
  orderNumber?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  items: StoredOrderItem[];
  subtotal: number;
  amountDue: number;
  paymentMethod: string;
  notes?: string;
  channel: "whatsapp" | "email";
}

const VALID_ORDER_NUMBER = /^MM-[A-Z0-9]{4,10}$/;

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Partial<OrderPayload>;

    if (!data.customerName || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ success: false, message: "Missing order details." }, { status: 400 });
    }

    const orderNumber =
      typeof data.orderNumber === "string" && VALID_ORDER_NUMBER.test(data.orderNumber)
        ? data.orderNumber
        : generateOrderNumber();

    const order: StoredOrder = {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail || undefined,
      customerPhone: data.customerPhone || undefined,
      address: data.address || undefined,
      items: data.items,
      subtotal: Number(data.subtotal) || 0,
      amountDue: Number(data.amountDue) || 0,
      paymentMethod: data.paymentMethod || "Unspecified",
      notes: data.notes || undefined,
      status: "pending",
      channel: data.channel === "whatsapp" ? "whatsapp" : "email",
      createdAt: new Date().toISOString(),
    };

    let saved = false;
    if (isOrderStoreConfigured()) {
      try {
        await saveOrder(order);
        saved = true;
      } catch (e) {
        console.error("[order] failed to save to order store:", (e as Error)?.message);
      }
    } else {
      console.error("[order] order store not configured (Upstash Redis env vars missing) — order not saved to dashboard.");
    }

    const itemRows: EmailRow[] = order.items.map((i) => {
      const lineTotal = i.price * i.quantity;
      const each = i.quantity > 1 ? ` ($${i.price.toFixed(2)} ea)` : "";
      return {
        label: `${i.quantity} × ${i.name}`,
        value: `$${lineTotal.toFixed(2)} AUD${each}`,
      };
    });

    const adminHtml = buildEmailHtml({
      title: "New order",
      refBadge: order.orderNumber,
      intro: `${order.customerName} placed an order via ${order.channel === "whatsapp" ? "WhatsApp" : "the website"}.`,
      rows: [
        { label: "Customer", heading: true },
        { label: "Name", value: order.customerName },
        ...(order.customerEmail ? [{ label: "Email", value: order.customerEmail }] : []),
        ...(order.customerPhone ? [{ label: "Phone", value: order.customerPhone }] : []),
        ...(order.address ? [{ label: "Address", value: order.address }] : []),
        { label: "Items", heading: true },
        ...itemRows,
        ...(order.notes ? [{ label: "Notes", value: order.notes }] : []),
        { label: "Summary", heading: true },
        { label: "Subtotal", value: `$${order.subtotal.toFixed(2)} AUD` },
        { label: "Payment Method", value: order.paymentMethod },
        { label: "Amount Due", value: `$${order.amountDue.toFixed(2)} AUD`, highlight: true },
      ],
      cta: saved
        ? { label: "Reply in Dashboard →", url: abs(`/admin/orders/${encodeURIComponent(order.orderNumber)}`) }
        : undefined,
      footer: `${SITE.name} order notification — ${SITE.domain}`,
    });

    const customerHtml = order.customerEmail
      ? buildEmailHtml({
          title: "We've received your order",
          refBadge: order.orderNumber,
          intro: `Thanks, ${order.customerName} — this confirms we've received your order. Keep this email as your reference. You'll receive a second email shortly with payment details; once that's confirmed we'll finalise your order for dispatch.`,
          rows: [
            { label: "Items", heading: true },
            ...itemRows,
            ...(order.notes ? [{ label: "Notes", value: order.notes }] : []),
            { label: "Summary", heading: true },
            { label: "Subtotal", value: `$${order.subtotal.toFixed(2)} AUD` },
            { label: "Payment Method", value: order.paymentMethod },
            ...(order.address ? [{ label: "Delivering To", value: order.address }] : []),
            { label: "Amount Due", value: `$${order.amountDue.toFixed(2)} AUD`, highlight: true },
          ],
          secondaryCta: {
            label: "Contact Us",
            url: `mailto:${FORMS.contactEmail}?subject=${encodeURIComponent(`Order ${order.orderNumber}`)}`,
          },
          footer: `${SITE.name} — ${SITE.domain}`,
        })
      : null;

    const [adminResult] = await Promise.all([
      sendMail({
        to: FORMS.orderEmail,
        subject: `New order ${order.orderNumber} — $${order.amountDue.toFixed(2)} AUD — ${SITE.name}`,
        html: adminHtml,
        replyTo: order.customerEmail,
      }),
      customerHtml && order.customerEmail
        ? sendMail({
            to: order.customerEmail,
            subject: `Order received — ${order.orderNumber} — $${order.amountDue.toFixed(2)} AUD — ${SITE.name}`,
            html: customerHtml,
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      emailed: adminResult.sent,
      saved,
    });
  } catch (err) {
    const error = err as Error;
    console.error("[order] failed:", error?.message);
    return NextResponse.json({ success: false, message: error.message || "Order failed" }, { status: 500 });
  }
}
