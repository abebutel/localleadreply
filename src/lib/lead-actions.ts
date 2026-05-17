import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import type { LeadStatus } from "@/lib/leads";

function getActionSecret() {
  return process.env.LEAD_ACTION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function makePayload(leadId: string, status: LeadStatus) {
  return `${leadId}:${status}`;
}

export function signLeadStatusAction(leadId: string, status: LeadStatus) {
  const secret = getActionSecret();

  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(makePayload(leadId, status)).digest("hex");
}

export function verifyLeadStatusAction({
  leadId,
  status,
  token,
}: {
  leadId: string;
  status: LeadStatus;
  token: string;
}) {
  const expected = signLeadStatusAction(leadId, status);

  if (!expected || token.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function makeLeadStatusActionUrl({
  leadId,
  status,
}: {
  leadId: string;
  status: LeadStatus;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const token = signLeadStatusAction(leadId, status);

  if (!appUrl || !token) {
    return null;
  }

  const url = new URL(`/api/leads/${leadId}/status`, appUrl);
  url.searchParams.set("status", status);
  url.searchParams.set("token", token);
  return url.toString();
}
