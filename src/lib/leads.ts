import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type StoredLead = {
  id: string;
  business_slug: string;
  business_name: string;
  customer_name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  consent_given: boolean;
  status: LeadStatus;
  auto_reply_preview: string | null;
  source: string;
  created_at: string;
  status_updated_at?: string | null;
};

export type NewStoredLead = Omit<StoredLead, "id" | "created_at">;

export const leadStatuses = ["new", "contacted", "booked", "lost"] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && leadStatuses.includes(value as LeadStatus);
}

export async function createLead(lead: NewStoredLead) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select("id")
    .single();

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true, id: data.id as string };
}

export async function listRecentLeads(limit = 20) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data as StoredLead[];
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("leads")
    .update({
      status,
      status_updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error?.code === "42703") {
    const fallback = await supabase.from("leads").update({ status }).eq("id", id);

    if (fallback.error) {
      return { ok: false, reason: fallback.error.message };
    }

    return { ok: true };
  }

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}
