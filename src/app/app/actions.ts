"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isValidAdminBasicAuth } from "@/lib/admin-auth";
import { isLeadStatus, updateLeadStatus } from "@/lib/leads";
import {
  isOutreachProspectStatus,
  updateOutreachProspectStatus,
} from "@/lib/outreach-prospects";
import {
  isPilotRequestStatus,
  updatePilotRequestStatus,
} from "@/lib/pilot-requests";

export async function updateLeadStatusAction(formData: FormData) {
  const headersList = await headers();

  if (!isValidAdminBasicAuth(headersList.get("authorization"))) {
    return;
  }

  const leadId = String(formData.get("leadId") || "");
  const status = String(formData.get("status") || "");

  if (!leadId || !isLeadStatus(status)) {
    return;
  }

  await updateLeadStatus(leadId, status);
  revalidatePath("/app");
}

export async function updatePilotRequestStatusAction(formData: FormData) {
  const headersList = await headers();

  if (!isValidAdminBasicAuth(headersList.get("authorization"))) {
    return;
  }

  const requestId = String(formData.get("requestId") || "");
  const status = String(formData.get("status") || "");

  if (!requestId || !isPilotRequestStatus(status)) {
    return;
  }

  await updatePilotRequestStatus(requestId, status);
  revalidatePath("/app");
}

export async function updateOutreachProspectStatusAction(formData: FormData) {
  const headersList = await headers();

  if (!isValidAdminBasicAuth(headersList.get("authorization"))) {
    return;
  }

  const prospectId = String(formData.get("prospectId") || "");
  const status = String(formData.get("status") || "");

  if (!prospectId || !isOutreachProspectStatus(status)) {
    return;
  }

  const nextFollowUp = new Date();
  nextFollowUp.setDate(nextFollowUp.getDate() + 4);

  await updateOutreachProspectStatus({
    id: prospectId,
    status,
    nextFollowUpAt:
      status === "contacted" ? nextFollowUp.toISOString() : null,
  });
  revalidatePath("/app");
}
