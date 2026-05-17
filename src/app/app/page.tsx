import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Phone,
  Send,
  Settings,
} from "lucide-react";

export const metadata: Metadata = {
  title: "LocalLeadReply Demo Dashboard",
  description:
    "Preview the LocalLeadReply lead inbox, follow-up queue, and text-back templates.",
  robots: {
    index: false,
    follow: false,
  },
};

const leads = [
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

export default function AppDemoPage() {
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
            href="mailto:hello@localleadreply.com?subject=Demo%20setup"
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
              Demo workspace
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">
              Northside Plumbing lead inbox
            </h1>
          </div>
          <p className="max-w-xl leading-7 text-[#565850]">
            This is a static preview of the first app workflow: capture the
            lead, send an approved text-back, and keep the next human follow-up
            visible.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-[#123c69] text-white">
                  <MessageSquareText size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">Recent leads</h2>
                  <p className="text-sm text-[#66685f]">Sorted by response urgency</p>
                </div>
              </div>
              <span className="rounded-md bg-[#e6f2ec] px-3 py-1 text-sm font-semibold text-[#1f7049]">
                3 active
              </span>
            </div>
            <div className="space-y-3">
              {leads.map((lead) => (
                <article
                  className="grid gap-3 rounded-md border border-[#ebe7df] bg-[#fbfaf7] p-4 md:grid-cols-[1fr_auto]"
                  key={lead.name}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#565850]">
                        {lead.source}
                      </span>
                    </div>
                    <p className="mt-2 text-[#565850]">{lead.need}</p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    <span className="text-sm font-semibold text-[#123c69]">
                      {lead.time}
                    </span>
                    <span className="rounded-md border border-[#d7d1c4] bg-white px-3 py-2 text-sm font-semibold">
                      {lead.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-[#d7d1c4] bg-white p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="text-[#d94f30]" size={24} aria-hidden="true" />
                <h2 className="text-xl font-semibold">Today</h2>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["18 sec", "fastest reply"],
                  ["2", "calls needed"],
                  ["1", "follow-up due"],
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
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
