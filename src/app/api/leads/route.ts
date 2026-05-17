import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { createLead } from "@/lib/leads";
import { makeLeadStatusActionUrl } from "@/lib/lead-actions";
import { getPilotBusiness } from "@/lib/pilot-businesses";

type LeadRequest = {
  businessSlug?: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
  consent?: boolean;
};

const phonePattern = /^[+()\-\s.\d]{7,24}$/;

function clean(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function makeOwnerEmail({
  businessName,
  data,
  dashboardUrl,
  actionUrls,
}: {
  businessName: string;
  data: {
    name: string;
    phone: string;
    email: string;
    service: string;
    message: string;
  };
  dashboardUrl: string | null;
  actionUrls: {
    contacted: string | null;
    booked: string | null;
    lost: string | null;
  };
}) {
  return `
New LocalLeadReply lead for ${businessName}

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || "Not provided"}
Service: ${data.service}

Message:
${data.message || "Not provided"}

Consent:
The lead checked the form consent box for follow-up by call or text.

Next actions:
${actionUrls.contacted ? `Mark contacted: ${actionUrls.contacted}` : "Mark contacted: open the dashboard"}
${actionUrls.booked ? `Mark booked: ${actionUrls.booked}` : "Mark booked: open the dashboard"}
${actionUrls.lost ? `Mark lost: ${actionUrls.lost}` : "Mark lost: open the dashboard"}

Dashboard:
${dashboardUrl || "Set NEXT_PUBLIC_APP_URL to include dashboard links."}
  `.trim();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadRequest | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const businessSlug = clean(body.businessSlug, 80);
  const business = await getPilotBusiness(businessSlug);

  if (!business) {
    return NextResponse.json({ error: "Unknown pilot business." }, { status: 404 });
  }

  const data = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    service: clean(body.service, 120),
    message: clean(body.message, 800),
  };

  if (!data.name || !phonePattern.test(data.phone) || !data.service) {
    return NextResponse.json(
      { error: "Name, phone, and service type are required." },
      { status: 400 },
    );
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Consent is required before follow-up messages can be sent." },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = business.ownerEmail || process.env.PILOT_TO_EMAIL;
  const autoReplyPreview = business.autoReply;

  const storedLead = await createLead({
    business_slug: business.slug,
    business_name: business.name,
    customer_name: data.name,
    phone: data.phone,
    email: data.email || null,
    service: data.service,
    message: data.message || null,
    consent_given: true,
    status: "new",
    auto_reply_preview: autoReplyPreview,
    source: "capture_form",
  });

  const leadId = storedLead.ok ? storedLead.id : null;
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? new URL("/app", process.env.NEXT_PUBLIC_APP_URL).toString()
    : null;
  const actionUrls = {
    contacted: leadId
      ? makeLeadStatusActionUrl({ leadId, status: "contacted" })
      : null,
    booked: leadId ? makeLeadStatusActionUrl({ leadId, status: "booked" }) : null,
    lost: leadId ? makeLeadStatusActionUrl({ leadId, status: "lost" }) : null,
  };

  if (!resendApiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      {
        error:
          "Lead notifications are not configured yet. Please call the business directly.",
      },
      { status: 503 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: data.email || toEmail,
      subject: `New lead for ${business.name}: ${data.service}`,
      text: makeOwnerEmail({
        businessName: business.name,
        data,
        dashboardUrl,
        actionUrls,
      }),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Lead notification could not be sent. Please call the business directly." },
      { status: 502 },
    );
  }

  await recordAnalyticsEvent({
    eventName: "lead_capture_submitted",
    path: `/capture/${business.slug}`,
    metadata: {
      businessSlug: business.slug,
      service: data.service,
    },
  });

  return NextResponse.json({
    ok: true,
    leadId: storedLead.ok ? storedLead.id : null,
    storageWarning: storedLead.ok ? null : storedLead.reason,
    autoReplyPreview,
  });
}
