import { NextRequest, NextResponse } from "next/server";
import { isLeadStatus, updateLeadStatus } from "@/lib/leads";
import { verifyLeadStatusAction } from "@/lib/lead-actions";

type Context = {
  params: Promise<{
    leadId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Context) {
  const { leadId } = await params;
  const status = request.nextUrl.searchParams.get("status");
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!isLeadStatus(status) || status === "new") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  if (!verifyLeadStatusAction({ leadId, status, token })) {
    return NextResponse.json({ error: "Invalid action token." }, { status: 401 });
  }

  const result = await updateLeadStatus(leadId, status);

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }

  const redirectUrl = new URL("/app", request.nextUrl.origin);
  redirectUrl.searchParams.set("updated", status);
  return NextResponse.redirect(redirectUrl);
}
