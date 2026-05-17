import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isValidAdminBasicAuth } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  if (isValidAdminBasicAuth(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LocalLeadReply dashboard"',
    },
  });
}

export const config = {
  matcher: ["/app/:path*"],
};
