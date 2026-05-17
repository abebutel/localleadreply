import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type PilotBusiness = {
  slug: string;
  name: string;
  trade: string;
  city: string;
  autoReply: string;
  services: string[];
  ownerEmail: string | null;
  isActive: boolean;
};

type BusinessRow = {
  slug: string;
  name: string;
  trade: string;
  city: string;
  auto_reply: string;
  services: string[];
  owner_email: string | null;
  is_active: boolean;
};

export const fallbackPilotBusinesses: PilotBusiness[] = [
  {
    slug: "northside-plumbing",
    name: "Northside Plumbing",
    trade: "Plumbing",
    city: "Tampa, FL",
    autoReply:
      "Thanks for reaching out to Northside Plumbing. We received your request and can help. What time today is best for a quick call?",
    services: [
      "Emergency leak",
      "Drain clog",
      "Water heater",
      "Fixture repair",
      "General quote",
    ],
    ownerEmail: null,
    isActive: true,
  },
];

function fromRow(row: BusinessRow): PilotBusiness {
  return {
    slug: row.slug,
    name: row.name,
    trade: row.trade,
    city: row.city,
    autoReply: row.auto_reply,
    services: row.services,
    ownerEmail: row.owner_email,
    isActive: row.is_active,
  };
}

export async function listPilotBusinesses() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return fallbackPilotBusinesses;
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("slug,name,trade,city,auto_reply,services,owner_email,is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return fallbackPilotBusinesses;
  }

  return data.map((row) => fromRow(row as BusinessRow));
}

export async function getPilotBusiness(slug: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return fallbackPilotBusinesses.find((business) => business.slug === slug);
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("slug,name,trade,city,auto_reply,services,owner_email,is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return fallbackPilotBusinesses.find((business) => business.slug === slug);
  }

  return fromRow(data as BusinessRow);
}
