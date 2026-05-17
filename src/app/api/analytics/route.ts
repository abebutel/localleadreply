import { NextResponse } from "next/server";
import {
  isAnalyticsEventName,
  recordAnalyticsEvent,
} from "@/lib/analytics";

type AnalyticsRequest = {
  eventName?: string;
  path?: string;
  referrer?: string | null;
};

function clean(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AnalyticsRequest | null;

  if (!body || !isAnalyticsEventName(body.eventName)) {
    return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
  }

  const path = clean(body.path, 500);

  if (!path || path.startsWith("/app") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  await recordAnalyticsEvent({
    eventName: body.eventName,
    path,
    referrer: clean(body.referrer, 500) || null,
  });

  return NextResponse.json({ ok: true });
}
