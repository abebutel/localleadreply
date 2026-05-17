import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { guidePages, site } from "@/lib/site";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const articles: Record<
  string,
  {
    title: string;
    intro: string;
    sections: Array<{
      heading: string;
      body: string;
    }>;
    examples?: string[];
  }
> = {
  "missed-call-text-back-examples": {
    title: "Missed Call Text-Back Examples for Local Service Businesses",
    intro:
      "A missed call or quote request is not automatically a lost lead. The key is sending a fast, clear, human-sounding reply that helps the customer take the next step.",
    sections: [
      {
        heading: "Keep the first reply short",
        body: "The first message should confirm the business received the request, name the business, and ask one simple scheduling question. It should not feel like a marketing blast.",
      },
      {
        heading: "Use the customer's context",
        body: "A reply that mentions the requested service feels more useful than a generic 'How can we help?' message. Use only facts the customer provided.",
      },
      {
        heading: "Make handoff easy",
        body: "The auto-reply should create a clear next action for the owner or office manager: call now, schedule later, or mark the lead as handled.",
      },
    ],
    examples: [
      "Thanks for reaching out to BrightSide Cleaning. We received your move-out cleaning request. What time today is best for a quick call?",
      "Hi Jamie, this is Summit Roofing. We saw your roof leak inspection request. Are you available now or later this afternoon?",
      "Thanks for contacting Greenline Landscaping after hours. We received your estimate request and will follow up first thing in the morning.",
    ],
  },
  "how-fast-should-local-business-respond-to-leads": {
    title: "How Fast Should a Local Business Respond to New Leads?",
    intro:
      "For local service businesses, speed matters because the customer is often comparing several options at once. A fast response does not have to be complicated. It just has to be clear and useful.",
    sections: [
      {
        heading: "Aim for minutes, not hours",
        body: "If a lead asks for a quote, appointment, or urgent help, the safest operating goal is to acknowledge the request within a few minutes. Even a short confirmation can keep the conversation alive.",
      },
      {
        heading: "Separate response from resolution",
        body: "The first reply does not need to solve the whole job. It needs to confirm the request, set expectations, and move the lead toward a call or appointment.",
      },
      {
        heading: "Track follow-up visibly",
        body: "A fast first reply is only useful if the team can see what still needs a human follow-up. Local owners need a small queue, not a complex CRM.",
      },
    ],
    examples: [
      "New quote request: auto-replied in 18 seconds, owner call due now.",
      "After-hours inquiry: customer acknowledged, morning follow-up scheduled.",
      "Form lead: service type captured, best call time requested.",
    ],
  },
};

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = guidePages.find((item) => item.slug === slug);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | ${site.name}`,
    description: page.description,
    alternates: {
      canonical: `/guides/${page.slug}`,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#151515]">
      <header className="border-b border-[#dedbd2] bg-[#fbfaf7]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="grid size-9 place-items-center rounded-md bg-[#123c69] text-white">
              <MessageSquareText size={19} aria-hidden="true" />
            </span>
            {site.name}
          </Link>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d94f30] px-4 text-sm font-semibold text-white transition hover:bg-[#bf4227]"
            href="/app"
          >
            View demo
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-sm font-semibold uppercase tracking-normal text-[#d94f30]">
          Local lead response guide
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#565850]">{article.intro}</p>

        <div className="mt-10 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-3 leading-8 text-[#565850]">{section.body}</p>
            </section>
          ))}
        </div>

        {article.examples ? (
          <section className="mt-10 rounded-lg border border-[#d7d1c4] bg-white p-5">
            <h2 className="text-2xl font-semibold">Examples</h2>
            <div className="mt-5 space-y-3">
              {article.examples.map((example) => (
                <p className="rounded-md bg-[#f4f1ea] p-4 leading-7 text-[#4f514b]" key={example}>
                  {example}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 rounded-lg bg-[#123c69] p-6 text-white">
          <h2 className="text-2xl font-semibold">Want this handled automatically?</h2>
          <p className="mt-3 leading-7 text-[#d8e7f3]">
            {site.name} gives local service businesses a simple lead text-back
            workflow, follow-up queue, and approved message templates.
          </p>
          <Link
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#d94f30] px-4 font-semibold text-white transition hover:bg-[#bf4227]"
            href="/pilot"
          >
            Start a pilot
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </article>
    </main>
  );
}
