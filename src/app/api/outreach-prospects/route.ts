import { NextRequest, NextResponse } from "next/server";
import { isValidAdminBasicAuth } from "@/lib/admin-auth";
import {
  createOutreachProspects,
  isOutreachProspectStatus,
  type NewOutreachProspect,
} from "@/lib/outreach-prospects";

type ProspectRequest = Partial<NewOutreachProspect>;

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (isValidAdminBasicAuth(authorization)) {
    return true;
  }

  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
}

function clean(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeProspect(prospect: ProspectRequest) {
  const status = clean(prospect.status, 40);

  return {
    business_name: clean(prospect.business_name, 160),
    city: clean(prospect.city, 120),
    niche: clean(prospect.niche, 80) || "plumbing",
    website: clean(prospect.website, 300) || null,
    contact_name: clean(prospect.contact_name, 160) || null,
    contact_email: clean(prospect.contact_email, 180) || null,
    phone: clean(prospect.phone, 80) || null,
    lead_source: clean(prospect.lead_source, 160) || null,
    notes: clean(prospect.notes, 1000) || null,
    status: isOutreachProspectStatus(status) ? status : "identified",
    last_contacted_at: clean(prospect.last_contacted_at, 80) || null,
    next_follow_up_at: clean(prospect.next_follow_up_at, 80) || null,
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | ProspectRequest
    | ProspectRequest[]
    | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prospects = (Array.isArray(body) ? body : [body]).map(normalizeProspect);
  const invalid = prospects.find(
    (prospect) => !prospect.business_name || !prospect.city,
  );

  if (invalid) {
    return NextResponse.json(
      { error: "Each prospect needs business_name and city." },
      { status: 400 },
    );
  }

  const result = await createOutreachProspects(prospects);

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: result.inserted });
}
