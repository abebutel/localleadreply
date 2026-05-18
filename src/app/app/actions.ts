"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isValidAdminBasicAuth } from "@/lib/admin-auth";
import { isLeadStatus, updateLeadStatus } from "@/lib/leads";
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
