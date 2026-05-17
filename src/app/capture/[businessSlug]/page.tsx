import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { getPilotBusiness, listPilotBusinesses } from "@/lib/pilot-businesses";

type Props = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const businesses = await listPilotBusinesses();

  return businesses.map((business) => ({ businessSlug: business.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = await getPilotBusiness(businessSlug);

  if (!business) {
    return {};
  }

  return {
    title: `Request help from ${business.name}`,
    description: `Send a service request to ${business.name} in ${business.city}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CapturePage({ params }: Props) {
  const { businessSlug } = await params;
  const business = await getPilotBusiness(businessSlug);

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#151515]">
      <header className="border-b border-[#dedbd2] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-md bg-[#123c69] text-white">
              <MessageSquareText size={19} aria-hidden="true" />
            </span>
            {business.name}
          </span>
          <span className="text-sm font-medium text-[#565850]">{business.city}</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 rounded-md border border-[#cfcabf] bg-white px-3 py-2 text-sm font-semibold text-[#4f514b]">
            <Clock3 size={16} aria-hidden="true" />
            Fast request follow-up
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal">
            Tell {business.name} what you need help with.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#565850]">
            Submit the short form and the team will receive your request. This
            pilot form sends an owner notification first; SMS auto-replies are
            enabled only after production texting is configured.
          </p>
          <div className="mt-6 rounded-lg border border-[#d7d1c4] bg-white p-4">
            <div className="flex gap-3">
              <ShieldCheck className="text-[#1f7049]" size={22} aria-hidden="true" />
              <p className="leading-7 text-[#565850]">
                Your request is used only for follow-up about this service need.
                This is not a promotional text signup.
              </p>
            </div>
          </div>
        </div>

        <LeadCaptureForm
          businessName={business.name}
          businessSlug={business.slug}
          services={business.services}
        />
      </section>
    </main>
  );
}
