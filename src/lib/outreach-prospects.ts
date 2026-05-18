import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const outreachProspectStatuses = [
  "identified",
  "contacted",
  "replied",
  "pilot_invited",
  "not_fit",
] as const;

export type OutreachProspectStatus = (typeof outreachProspectStatuses)[number];

export type StoredOutreachProspect = {
  id: string;
  business_name: string;
  city: string;
  niche: string;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  phone: string | null;
  lead_source: string | null;
  notes: string | null;
  status: OutreachProspectStatus;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
};

export type OutreachSummary = {
  identified: number;
  contacted: number;
  replied: number;
  pilotInvited: number;
  followUpsDue: number;
};

export type NewOutreachProspect = {
  business_name: string;
  city: string;
  niche?: string;
  website?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  lead_source?: string | null;
  notes?: string | null;
  status?: OutreachProspectStatus;
  last_contacted_at?: string | null;
  next_follow_up_at?: string | null;
};

export function isOutreachProspectStatus(
  value: unknown,
): value is OutreachProspectStatus {
  return (
    typeof value === "string" &&
    outreachProspectStatuses.includes(value as OutreachProspectStatus)
  );
}

export async function createOutreachProspects(prospects: NewOutreachProspect[]) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("outreach_prospects")
    .insert(
      prospects.map((prospect) => ({
        business_name: prospect.business_name,
        city: prospect.city,
        niche: prospect.niche || "plumbing",
        website: prospect.website || null,
        contact_name: prospect.contact_name || null,
        contact_email: prospect.contact_email || null,
        phone: prospect.phone || null,
        lead_source: prospect.lead_source || null,
        notes: prospect.notes || null,
        status: prospect.status || "identified",
        last_contacted_at: prospect.last_contacted_at || null,
        next_follow_up_at: prospect.next_follow_up_at || null,
      })),
    )
    .select("id");

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true, inserted: data.length };
}

export async function listRecentOutreachProspects(limit = 5) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("outreach_prospects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data as StoredOutreachProspect[];
}

export async function updateOutreachProspectStatus({
  id,
  status,
  nextFollowUpAt = null,
}: {
  id: string;
  status: OutreachProspectStatus;
  nextFollowUpAt?: string | null;
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const patch: {
    status: OutreachProspectStatus;
    updated_at: string;
    last_contacted_at?: string;
    next_follow_up_at?: string | null;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "contacted") {
    patch.last_contacted_at = new Date().toISOString();
    patch.next_follow_up_at = nextFollowUpAt;
  }

  if (status === "replied" || status === "pilot_invited" || status === "not_fit") {
    patch.next_follow_up_at = null;
  }

  const { error } = await supabase
    .from("outreach_prospects")
    .update(patch)
    .eq("id", id);

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

export async function getOutreachSummary(): Promise<OutreachSummary> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      identified: 0,
      contacted: 0,
      replied: 0,
      pilotInvited: 0,
      followUpsDue: 0,
    };
  }

  const now = new Date().toISOString();
  const [identified, contacted, replied, pilotInvited, followUpsDue] =
    await Promise.all([
      supabase
        .from("outreach_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "identified"),
      supabase
        .from("outreach_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "contacted"),
      supabase
        .from("outreach_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "replied"),
      supabase
        .from("outreach_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "pilot_invited"),
      supabase
        .from("outreach_prospects")
        .select("id", { count: "exact", head: true })
        .not("next_follow_up_at", "is", null)
        .lte("next_follow_up_at", now)
        .neq("status", "not_fit"),
    ]);

  return {
    identified: identified.count || 0,
    contacted: contacted.count || 0,
    replied: replied.count || 0,
    pilotInvited: pilotInvited.count || 0,
    followUpsDue: followUpsDue.count || 0,
  };
}
