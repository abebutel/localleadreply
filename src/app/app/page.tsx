import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Phone,
  Send,
  Settings,
  UserRoundPlus,
} from "lucide-react";
import { getAnalyticsSummary } from "@/lib/analytics";
import { hasAdminPassword } from "@/lib/admin-auth";
import { leadStatuses, listRecentLeads, type LeadStatus } from "@/lib/leads";
import { listRecentPilotRequests } from "@/lib/pilot-requests";
import { updateLeadStatusAction } from "./actions";

export const metadata: Metadata = {
  title: "LocalLeadReply Demo Dashboard",
  description:
    "Preview the LocalLeadReply lead inbox, follow-up queue, and text-back templates.",
  robots: {
    index: false,
    follow: false,
  },
};

const sampleLeads = [
  {
    name: "Megan R.",
    need: "Kitchen sink leak",
    source: "Website form",
    status: "Auto-replied",
    time: "18 sec",
  },
  {
    name: "Carlos M.",
    need: "Water heater quote",
    source: "Google Ads landing page",
    status: "Needs call",
    time: "7 min",
  },
  {
    name: "Dana K.",
    need: "After-hours drain clog",
    source: "Emergency form",
    status: "Follow-up due",
    time: "24 min",
  },
];

const setupItems = [
  "Business name and phone number",
  "Lead form consent text",
  "First auto-reply template",
  "Owner notification email",
];

const statusLabels: Record<LeadStatus, string> = {
  new: "Needs call",
  contacted: "Contacted",
  booked: "Booked",
  lost: "Lost",
};

const statusStyles: Record<LeadStatus, string> = {
  new: "border-[#d7d1c4] bg-white text-[#123c69]",
  contacted: "border-[#c8d6e5] bg-[#edf5fb] text-[#123c69]",
  booked: "border-[#b9dec9] bg-[#e6f2ec] text-[#1f7049]",
  lost: "border-[#f0c7b8] bg-[#fff4ed] text-[#9b341f]",
};

type DashboardLead =
  | {
      id: string;
      name: string;
      need: string;
      source: string;
      status: LeadStatus;
      phone: string;
      email: string | null;
      message: string | null;
      time: string;
    }
  | {
      name: string;
      need: string;
      source: string;
      status: string;
      time: string;
    };

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{
    updated?: string;
  }>;
};

export default async function AppDemoPage({ searchParams }: Props) {
  const params = await searchParams;
  const [storedLeads, analytics, pilotRequests] = await Promise.all([
    listRecentLeads(10),
    getAnalyticsSummary(7),
    listRecentPilotRequests(5),
  ]);
  const leads: DashboardLead[] =
    storedLeads.length > 0
      ? storedLeads.map((lead) => ({
          id: lead.id,
          name: lead.customer_name,
          need: lead.service,
          source: lead.business_name,
          status: lead.status,
          phone: lead.phone,
          email: lead.email,
          message: lead.message,
          time: new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date(lead.created_at)),
        }))
      : sampleLeads;
  const statusCounts = storedLeads.reduce(
    (counts, lead) => ({
      ...counts,
      [lead.status]: (counts[lead.status] || 0) + 1,
    }),
    {} as Record<LeadStatus, number>,
  );
  const activeCount = storedLeads.length
    ? (statusCounts.new || 0) + (statusCounts.contacted || 0)
    : 3;
  const hasPassword = hasAdminPassword();

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#151515]">
      <header className="border-b border-[#dedbd2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link className="inline-flex items-center gap-2 font-semibold" href="/">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to site
          </Link>
          <a
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d94f30] px-4 text-sm font-semibold text-white transition hover:bg-[#bf4227]"
            href="/pilot"
          >
            Request setup
            <Send size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-[#d94f30]">
              Owner workspace
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">
              Northside Plumbing lead inbox
            </h1>
          </div>
          <p className="max-w-xl leading-7 text-[#565850]">
            Capture each request, keep the next follow-up visible, and mark the
            outcome from the dashboard or directly from the owner email.
          </p>
        </div>

        {!hasPassword ? (
          <div className="mb-5 rounded-md border border-[#f0c7b8] bg-[#fff4ed] px-4 py-3 text-sm font-semibold text-[#9b341f]">
            Set ADMIN_PASSWORD in production to require owner login for this
            dashboard. Until then, the page remains open for setup testing.
          </div>
        ) : null}

        {params?.updated ? (
          <div className="mb-5 rounded-md border border-[#b9dec9] bg-[#e6f2ec] px-4 py-3 text-sm font-semibold text-[#1f7049]">
            Lead marked {params.updated}.
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-[#123c69] text-white">
                  <MessageSquareText size={20} aria-hidden="true" />
                </span>
              <div>
                <h2 className="text-xl font-semibold">Recent leads</h2>
                  <p className="text-sm text-[#66685f]">
                    {storedLeads.length > 0
                      ? "Showing live captured leads"
                      : "Sample data until Supabase has captured leads"}
                  </p>
              </div>
              </div>
              <span className="rounded-md bg-[#e6f2ec] px-3 py-1 text-sm font-semibold text-[#1f7049]">
                {activeCount} active
              </span>
            </div>
            <div className="space-y-3">
              {leads.map((lead) => (
                <article
                  className="grid gap-3 rounded-md border border-[#ebe7df] bg-[#fbfaf7] p-4 md:grid-cols-[1fr_auto]"
                  key={"id" in lead ? lead.id : lead.name}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#565850]">
                        {lead.source}
                      </span>
                    </div>
                    <p className="mt-2 text-[#565850]">{lead.need}</p>
                    {"phone" in lead ? (
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#565850]">
                        <a className="font-semibold text-[#123c69]" href={`tel:${lead.phone}`}>
                          {lead.phone}
                        </a>
                        {lead.email ? (
                          <a className="font-semibold text-[#123c69]" href={`mailto:${lead.email}`}>
                            {lead.email}
                          </a>
                        ) : null}
                        {lead.message ? <span>{lead.message}</span> : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-3 md:items-end md:justify-between">
                    <span className="text-sm font-semibold text-[#123c69]">
                      {lead.time}
                    </span>
                    <span
                      className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                        typeof lead.status === "string" && lead.status in statusStyles
                          ? statusStyles[lead.status as LeadStatus]
                          : "border-[#d7d1c4] bg-white"
                      }`}
                    >
                      {typeof lead.status === "string" && lead.status in statusLabels
                        ? statusLabels[lead.status as LeadStatus]
                        : lead.status}
                    </span>
                    {"id" in lead ? (
                      <form
                        action={updateLeadStatusAction}
                        className="flex flex-wrap gap-2 md:justify-end"
                      >
                        <input name="leadId" type="hidden" value={lead.id} />
                        {leadStatuses
                          .filter((status) => status !== lead.status)
                          .map((status) => (
                            <button
                              className="h-9 rounded-md border border-[#d7d1c4] bg-white px-3 text-xs font-semibold text-[#565850] transition hover:border-[#123c69] hover:text-[#123c69]"
                              key={status}
                              name="status"
                              type="submit"
                              value={status}
                            >
                              {statusLabels[status]}
                            </button>
                          ))}
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
              <div className="flex items-center gap-3">
                <UserRoundPlus className="text-[#d94f30]" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Pilot requests</h2>
              </div>
              <div className="mt-5 space-y-3">
                {(pilotRequests.length > 0
                  ? pilotRequests
                  : [
                      {
                        id: "empty",
                        name: "No pilot requests yet",
                        email: "",
                        business_name: "Outreach has not started",
                        business_type: "",
                        website: null,
                        phone: null,
                        message: null,
                        status: "",
                        created_at: "",
                      },
                    ]
                ).map((request) => (
                  <article
                    className="rounded-md border border-[#ebe7df] bg-[#fbfaf7] p-3"
                    key={request.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{request.business_name}</h3>
                      {request.status ? (
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#565850]">
                          {request.status}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#565850]">
                      {request.name}
                      {request.business_type ? ` | ${request.business_type}` : ""}
                    </p>
                    {request.email ? (
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        <a className="font-semibold text-[#123c69]" href={`mailto:${request.email}`}>
                          {request.email}
                        </a>
                        {request.phone ? (
                          <a className="font-semibold text-[#123c69]" href={`tel:${request.phone}`}>
                            {request.phone}
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-[#d94f30]" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Last 7 days</h2>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  [String(analytics.pageViews), "page views"],
                  [String(analytics.pilotRequests), "pilot requests"],
                  [String(analytics.leadCaptures), "lead captures"],
                ].map(([value, label]) => (
                  <div className="rounded-md bg-[#f4f1ea] p-3" key={label}>
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-[#66685f]">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {(analytics.topPages.length > 0
                  ? analytics.topPages
                  : [{ path: "No page views recorded yet", views: 0 }]
                ).map((page) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-md border border-[#ebe7df] px-3 py-2 text-sm"
                    key={page.path}
                  >
                    <span className="truncate text-[#565850]">{page.path}</span>
                    <span className="font-semibold text-[#123c69]">{page.views}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="text-[#d94f30]" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Today</h2>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["18 sec", "fastest reply"],
                  [String(statusCounts.new || 2), "calls needed"],
                  [String(statusCounts.contacted || 1), "follow-ups open"],
                ].map(([value, label]) => (
                  <div className="rounded-md bg-[#f4f1ea] p-3" key={label}>
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-[#66685f]">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
              <div className="flex items-center gap-3">
                <Settings className="text-[#d94f30]" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Setup checklist</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {setupItems.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <CheckCircle2 className="text-[#1f7049]" size={20} aria-hidden="true" />
                    <span className="text-[#565850]">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-[#d7d1c4] bg-[#123c69] p-5 text-white">
              <div className="flex items-center gap-3">
                <Phone className="text-[#9ed0f0]" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Approved auto-reply</h2>
              </div>
              <p className="mt-4 leading-7 text-[#d8e7f3]">
                Thanks for reaching out to Northside Plumbing. We received your
                request and can help. What time today is best for a quick call?
              </p>
              <Link
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#d94f30] px-4 font-semibold text-white transition hover:bg-[#bf4227]"
                href="/capture/northside-plumbing"
              >
                Open sample lead form
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
