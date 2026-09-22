import { NextRequest, NextResponse } from "next/server";
import { checkAdminPasscode } from "@/lib/adminAuth";
import { sendMail } from "@/lib/mailer";
import { buildEmailHtml, escapeHtml } from "@/lib/emailTemplate";
import { getEnquiry, markEnquiryReplied } from "@/lib/enquiryStore";
import { SITE, FORMS } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = checkAdminPasscode(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as { enquiryId: string; message: string };
    if (!body.enquiryId || !body.message) {
      return NextResponse.json({ error: "Missing enquiryId or message." }, { status: 400 });
    }

    const enquiry = await getEnquiry(body.enquiryId);
    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }
    if (!enquiry.email) {
      return NextResponse.json({ error: "This enquiry has no email address to reply to." }, { status: 400 });
    }

    const html = buildEmailHtml({
      title: `Re: your ${enquiry.type} enquiry`,
      intro: `Hi ${enquiry.name || "there"},`,
      rows: [{ label: "Reply", html: escapeHtml(body.message).replace(/\n/g, "<br>") }],
      secondaryCta: {
        label: "Contact Us",
        url: `mailto:${FORMS.contactEmail}?subject=${encodeURIComponent(`Re: your ${enquiry.type} enquiry`)}`,
      },
      footer: `${SITE.name} — ${SITE.domain}`,
    });

    const result = await sendMail({
      to: enquiry.email,
      subject: `Re: your ${enquiry.type} enquiry — ${SITE.name}`,
      html,
    });

    if (result.sent) {
      await markEnquiryReplied(enquiry.id);
    }

    return NextResponse.json({ success: result.sent, ...result });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
