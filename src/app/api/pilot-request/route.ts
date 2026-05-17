import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics";

type PilotRequest = {
  name?: string;
  email?: string;
  businessName?: string;
  businessType?: string;
  website?: string;
  phone?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

function makeEmailBody(data: Required<PilotRequest>) {
  return `
New LocalLeadReply pilot request

Name: ${data.name}
Email: ${data.email}
Business: ${data.businessName}
Business type: ${data.businessType}
Website: ${data.website || "Not provided"}
Phone: ${data.phone || "Not provided"}

Message:
${data.message || "Not provided"}
  `.trim();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as PilotRequest | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = {
    name: clean(body.name),
    email: clean(body.email),
    businessName: clean(body.businessName),
    businessType: clean(body.businessType),
    website: clean(body.website),
    phone: clean(body.phone),
    message: clean(body.message),
  };

  if (!data.name || !emailPattern.test(data.email) || !data.businessName) {
    return NextResponse.json(
      { error: "Name, business name, and a valid email are required." },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.PILOT_TO_EMAIL;

  if (!resendApiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      {
        error:
          "Pilot request email is not configured yet. Please email hello@localleadreply.com directly.",
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
      reply_to: data.email,
      subject: `Pilot request from ${data.businessName}`,
      text: makeEmailBody(data),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          "We could not send the pilot request. Please email hello@localleadreply.com directly.",
      },
      { status: 502 },
    );
  }

  await recordAnalyticsEvent({
    eventName: "pilot_request_submitted",
    path: "/pilot",
    metadata: {
      businessType: data.businessType,
    },
  });

  return NextResponse.json({ ok: true });
}
