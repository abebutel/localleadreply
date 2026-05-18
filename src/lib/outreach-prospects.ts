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
