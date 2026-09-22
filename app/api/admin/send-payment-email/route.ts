import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml, escapeHtml } from "@/lib/emailTemplate";
import { paymentTermsHtml } from "@/lib/order";
import { waPaymentConfirmationLink } from "@/lib/whatsapp";
import { markOrderSent } from "@/lib/orderStore";
import { SITE, FORMS, CONTACT } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      orderNumber: string;
      customerEmail: string;
      amountDue: number;
      instructions: string;
      paymentMethod?: string;
    };

    if (!body.customerEmail || !body.instructions) {
      return NextResponse.json({ error: "Missing customerEmail or instructions." }, { status: 400 });
    }

    const showOsko = body.paymentMethod === "Bank Transfer" || body.paymentMethod === "PayID";
    const whatsappLink = waPaymentConfirmationLink(body.orderNumber || "");

    const html = buildEmailHtml({
      title: `Payment details for your order`,
      refBadge: body.orderNumber,
      intro: `Here's how to complete payment for order ${body.orderNumber}.`,
      rows: [
        { label: "Amount Due", value: `$${Number(body.amountDue || 0).toFixed(2)} AUD`, highlight: true },
        ...(body.paymentMethod ? [{ label: "Payment Method", value: body.paymentMethod }] : []),
        { label: "How to Pay", heading: true },
        { label: "", html: escapeHtml(body.instructions).replace(/\n/g, "<br>"), block: true },
      ],
      afterRows: paymentTermsHtml({
        orderNumber: body.orderNumber,
        contactEmail: CONTACT.email,
        whatsapp: CONTACT.whatsapp,
        whatsappLink,
        showOskoNote: showOsko,
      }),
      secondaryCta: {
        label: "Contact Us",
        url: `mailto:${FORMS.contactEmail}?subject=${encodeURIComponent(`Order ${body.orderNumber}`)}`,
      },
      footer: `${SITE.name} — ${SITE.domain}`,
    });

    const result = await sendMail({
      to: body.customerEmail,
      subject: `Payment details — order ${body.orderNumber} — ${SITE.name}`,
      html,
    });

    if (result.sent && body.orderNumber) {
      await markOrderSent(body.orderNumber);
    }

    return NextResponse.json({ success: result.sent, ...result });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
