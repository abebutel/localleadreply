import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { industryPages, site } from "@/lib/site";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return industryPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = industryPages.find((item) => item.slug === slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | ${site.name}`,
    description: page.description,
    alternates: {
      canonical: `/industries/${page.slug}`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const page = industryPages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  const templates = [
    `Thanks for reaching out to {{business_name}}. We can help with {{service}}. What time today is best for a quick call?`,
    `Hi {{first_name}}, this is {{business_name}}. We saw your request about {{issue}}. Are you available now or later today?`,
    `Thanks for contacting {{business_name}} after hours. We received your request and will follow up first thing in the morning.`,
  ];

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#151515]">
      <header className="border-b border-[#dedbd2] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid size-9 place-items-center rounded-md bg-[#123c69] text-white">
              <MessageSquareText size={19} aria-hidden="true" />
            </span>
            {site.name}
          </Link>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d94f30] px-4 text-sm font-semibold text-white transition hover:bg-[#bf4227]"
            href={`mailto:${site.email}?subject=${encodeURIComponent(`${page.label} pilot`)}`}
          >
            Start pilot
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-md border border-[#cfcabf] bg-white px-3 py-2 text-sm font-semibold text-[#4f514b]">
            <PhoneCall size={16} aria-hidden="true" />
            {page.badge}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl">
            {page.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#565850]">
            {site.name} gives {page.label} a simple, permission-based text-back
            flow for web forms, quote requests, and after-hours inquiries. It is
            built to help owners respond fast without adding a complicated CRM.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d94f30] px-5 font-semibold text-white transition hover:bg-[#bf4227]"
              href={`mailto:${site.email}?subject=${encodeURIComponent(`${page.label} 14-day pilot`)}`}
            >
              Try a 14-day pilot
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#bdb7aa] bg-white px-5 font-semibold transition hover:border-[#123c69]"
              href="/app"
            >
              View demo dashboard
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-[#d7d1c4] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#ebe7df] pb-4">
            <Clock3 className="text-[#d94f30]" size={24} aria-hidden="true" />
            <div>
              <p className="font-semibold">Sample text-back</p>
              <p className="text-sm text-[#66685f]">Sent after a quote form is submitted</p>
            </div>
          </div>
          <div className="mt-5 rounded-md bg-[#123c69] p-4 text-white">
            <p className="text-sm text-[#cfe3f4]">Auto reply</p>
            <p className="mt-2 leading-7">
              Thanks for reaching out to {page.business}. We can help with{" "}
              {page.issue}. What time today is best for a quick call?
            </p>
          </div>
          <p className="mt-4 rounded-md bg-[#e6f2ec] px-3 py-2 text-sm font-semibold text-[#1f7049]">
            Lead replied in 21 seconds
          </p>
        </aside>
      </section>

      <section className="border-y border-[#dedbd2] bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">What it helps with</h2>
            <ul className="mt-6 space-y-4">
              {page.outcomes.map((outcome) => (
                <li className="flex gap-3" key={outcome}>
                  <CheckCircle2 className="text-[#1f7049]" size={21} aria-hidden="true" />
                  <span className="leading-7 text-[#565850]">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Starter templates</h2>
            <div className="mt-6 space-y-3">
              {templates.map((template) => (
                <div className="rounded-md border border-[#e4ded2] bg-[#fbfaf7] p-4" key={template}>
                  <p className="leading-7 text-[#4f514b]">{template}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#d94f30]" size={28} aria-hidden="true" />
          <h2 className="text-2xl font-semibold">Clean messaging rules</h2>
        </div>
        <p className="leading-7 text-[#565850]">
          {site.name} is designed for lead follow-up only. We use clear form
          consent, identify the business in messages, and support opt-out
          handling before production SMS goes live.
        </p>
      </section>
    </main>
  );
}
