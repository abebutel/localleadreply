import { NextRequest, NextResponse } from "next/server";
import { isValidAdminBasicAuth } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const requiredEnvVars = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "FROM_EMAIL",
  "PILOT_TO_EMAIL",
  "ADMIN_PASSWORD",
  "LEAD_ACTION_SECRET",
  "CRON_SECRET",
] as const;

const requiredTables = [
  "businesses",
  "leads",
  "pilot_requests",
  "analytics_events",
  "outreach_prospects",
] as const;

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (isValidAdminBasicAuth(authorization)) {
    return true;
  }

  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
}

async function checkTable(table: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      ok: false,
      table,
      reason: "Supabase admin client is not configured.",
    };
  }

  const { error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  return {
    ok: !error,
    table,
    reason: error?.message || null,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const env = requiredEnvVars.map((name) => ({
    name,
    ok: Boolean(process.env[name]),
  }));
  const tables = await Promise.all(requiredTables.map((table) => checkTable(table)));
  const ok = env.every((item) => item.ok) && tables.every((table) => table.ok);

  return NextResponse.json(
    {
      ok,
      checkedAt: new Date().toISOString(),
      env,
      tables,
    },
    { status: ok ? 200 : 503 },
  );
}
