import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const analyticsEvents = [
  "page_view",
  "pilot_request_submitted",
  "lead_capture_submitted",
] as const;

export type AnalyticsEventName = (typeof analyticsEvents)[number];

export type AnalyticsSummary = {
  pageViews: number;
  pilotRequests: number;
  leadCaptures: number;
  topPages: {
    path: string;
    views: number;
  }[];
};

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return (
    typeof value === "string" &&
    analyticsEvents.includes(value as AnalyticsEventName)
  );
}

export async function recordAnalyticsEvent({
  eventName,
  path,
  referrer = null,
  metadata = {},
}: {
  eventName: AnalyticsEventName;
  path: string;
  referrer?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const { error } = await supabase.from("analytics_events").insert({
    event_name: eventName,
    path,
    referrer,
    metadata,
  });

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

export async function getAnalyticsSummary(days = 7): Promise<AnalyticsSummary> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      pageViews: 0,
      pilotRequests: 0,
      leadCaptures: 0,
      topPages: [],
    };
  }

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_name,path")
    .gte("created_at", since.toISOString())
    .limit(1000);

  if (error || !data) {
    return {
      pageViews: 0,
      pilotRequests: 0,
      leadCaptures: 0,
      topPages: [],
    };
  }

  const pageViewsByPath = new Map<string, number>();

  for (const event of data) {
    if (event.event_name === "page_view" && typeof event.path === "string") {
      pageViewsByPath.set(event.path, (pageViewsByPath.get(event.path) || 0) + 1);
    }
  }

  return {
    pageViews: data.filter((event) => event.event_name === "page_view").length,
    pilotRequests: data.filter(
      (event) => event.event_name === "pilot_request_submitted",
    ).length,
    leadCaptures: data.filter(
      (event) => event.event_name === "lead_capture_submitted",
    ).length,
    topPages: [...pageViewsByPath.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5),
  };
}
