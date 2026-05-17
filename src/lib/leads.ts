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
  status: string;
  auto_reply_preview: string | null;
  source: string;
  created_at: string;
};

export type NewStoredLead = Omit<StoredLead, "id" | "created_at">;

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
