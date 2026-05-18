import { NextRequest, NextResponse } from "next/server";
import { verifyPilotRequestStatusAction } from "@/lib/lead-actions";
import {
  isPilotRequestStatus,
  updatePilotRequestStatus,
} from "@/lib/pilot-requests";

type Context = {
  params: Promise<{
    requestId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: Context) {
  const { requestId } = await params;
  const status = request.nextUrl.searchParams.get("status");
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!isPilotRequestStatus(status) || status === "new") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  if (!verifyPilotRequestStatusAction({ requestId, status, token })) {
    return NextResponse.json({ error: "Invalid action token." }, { status: 401 });
  }

  const result = await updatePilotRequestStatus(requestId, status);

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }

  const redirectUrl = new URL("/app", request.nextUrl.origin);
  redirectUrl.searchParams.set("pilotUpdated", status);
  return NextResponse.redirect(redirectUrl);
}
