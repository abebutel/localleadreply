import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";
import { getLeadDigestSummary } from "@/lib/leads";

function requireCronSecret(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function makeDigestEmail({
  analytics,
  leads,
}: {
  analytics: Awaited<ReturnType<typeof getAnalyticsSummary>>;
  leads: Awaited<ReturnType<typeof getLeadDigestSummary>>;
}) {
  const recentLeadLines =
    leads.recentLeads.length > 0
      ? leads.recentLeads
          .map(
            (lead) =>
              `- ${lead.customer_name} | ${lead.business_name} | ${lead.service} | ${lead.status}`,
          )
          .join("\n")
      : "- No new leads in the last 24 hours.";

  const topPageLines =
    analytics.topPages.length > 0
      ? analytics.topPages
          .map((page) => `- ${page.path}: ${page.views}`)
          .join("\n")
      : "- No page views recorded yet.";

  return `
LocalLeadReply daily summary

Lead pipeline:
- New leads in the last 24 hours: ${leads.newToday}
- Open leads needing attention: ${leads.openLeads}
- Leads marked booked in the last 24 hours: ${leads.bookedToday}

Last 7 days:
- Page views: ${analytics.pageViews}
- Pilot requests: ${analytics.pilotRequests}
- Lead captures: ${analytics.leadCaptures}

Top pages:
${topPageLines}

Recent leads:
${recentLeadLines}

Dashboard:
${process.env.NEXT_PUBLIC_APP_URL ? new URL("/app", process.env.NEXT_PUBLIC_APP_URL).toString() : "Set NEXT_PUBLIC_APP_URL to include dashboard links."}
  `.trim();
}

export async function GET(request: NextRequest) {
  if (!requireCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.PILOT_TO_EMAIL;

  if (!resendApiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      { error: "Daily summary email is not configured." },
      { status: 503 },
    );
  }

  const [analytics, leads] = await Promise.all([
    getAnalyticsSummary(7),
    getLeadDigestSummary(),
  ]);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `LocalLeadReply daily summary: ${leads.openLeads} open leads`,
      text: makeDigestEmail({ analytics, leads }),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Daily summary email could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    openLeads: leads.openLeads,
    newToday: leads.newToday,
    pageViews: analytics.pageViews,
  });
}
