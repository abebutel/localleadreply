import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquareText } from "lucide-react";
import { PilotForm } from "./PilotForm";

export const metadata: Metadata = {
  title: "Start a LocalLeadReply Pilot",
  description:
    "Request a 14-day LocalLeadReply pilot for lead text-back and follow-up.",
  alternates: {
    canonical: "/pilot",
  },
};

const expectations = [
  "We confirm the business, website, and lead form setup.",
  "We create one approved text-back template.",
  "We test the flow before any production SMS is enabled.",
  "We keep the pilot focused on lead response, not bulk promotion.",
];

export default function PilotPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#151515]">
      <header className="border-b border-[#dedbd2] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link className="inline-flex items-center gap-2 font-semibold" href="/">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to site
          </Link>
          <span className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-md bg-[#123c69] text-white">
              <MessageSquareText size={19} aria-hidden="true" />
            </span>
            LocalLeadReply
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#d94f30]">
            14-day pilot
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-normal">
            Start with one lead text-back workflow.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#565850]">
            The first pilot is intentionally narrow: one business, one lead
            source, one approved auto-reply, and a simple follow-up queue.
          </p>
          <ul className="mt-8 space-y-4">
            {expectations.map((item) => (
              <li className="flex gap-3" key={item}>
                <CheckCircle2 className="text-[#1f7049]" size={21} aria-hidden="true" />
                <span className="leading-7 text-[#565850]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <PilotForm />
      </section>
    </main>
  );
}
