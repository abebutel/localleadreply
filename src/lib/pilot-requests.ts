import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type StoredPilotRequest = {
  id: string;
  name: string;
  email: string;
  business_name: string;
  business_type: string;
  website: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type NewStoredPilotRequest = Omit<
  StoredPilotRequest,
  "id" | "status" | "created_at"
>;

export async function createPilotRequest(request: NewStoredPilotRequest) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("pilot_requests")
    .insert({
      ...request,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true, id: data.id as string };
}

export async function listRecentPilotRequests(limit = 5) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("pilot_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return data as StoredPilotRequest[];
}

export async function countOpenPilotRequests() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return 0;
  }

  const { count, error } = await supabase
    .from("pilot_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    return 0;
  }

  return count || 0;
}
