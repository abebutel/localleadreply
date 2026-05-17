import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const niches = [
  { name: "plumbers", href: "/industries/plumbers" },
  { name: "cleaning companies", href: "/#cleaning-companies" },
  { name: "med spas", href: "/#med-spas" },
  { name: "landscapers", href: "/#landscapers" },
  { name: "roofers", href: "/#roofers" },
];

const plans = [
  {
    name: "Lead Text-Back",
    price: "$79",
    description: "For small local teams that need faster lead response.",
    features: [
      "Instant text-back from lead forms",
      "Simple lead inbox",
      "Follow-up reminders",
      "Reply templates by trade",
    ],
  },
  {
    name: "Growth Bundle",
    price: "$149",
    description: "Lead response plus reputation and weekly content help.",
    features: [
      "Everything in Lead Text-Back",
      "Review reply drafts",
      "Weekly content prompts",
      "Owner summary email",
    ],
    highlighted: true,
  },
  {
    name: "Multi-Location",
    price: "$249",
    description: "For operators managing more than one location or crew.",
    features: [
      "Multiple locations",
      "Team routing rules",
      "Priority setup support",
      "Monthly performance report",
    ],
  },
];

const proofPoints = [
  {
    icon: Zap,
    title: "Respond while the lead is still warm",
    copy: "Send an honest, branded text the moment someone asks for a quote or books a call.",
  },
  {
    icon: ShieldCheck,
    title: "Built for permission-based messaging",
    copy: "Clear opt-in language, opt-out handling, and no bulk blasting behavior.",
  },
  {
    icon: MousePointerClick,
    title: "Simple enough for busy owners",
    copy: "No complicated CRM. Just new leads, reply status, and the next follow-up.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#151515]">
      <header className="border-b border-[#dedbd2] bg-[#fbfaf7]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a className="flex items-center gap-2 font-semibold" href="#">
            <span className="grid size-9 place-items-center rounded-md bg-[#123c69] text-white">
              <MessageSquareText size={19} aria-hidden="true" />
            </span>
            LocalLeadReply
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[#4f514b] md:flex">
            <a href="#how">How it works</a>
            <a href="#niches">Industries</a>
            <a href="/app">Demo</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <a
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d94f30] px-4 text-sm font-semibold text-white transition hover:bg-[#bf4227]"
            href="mailto:hello@localleadreply.com?subject=Pilot%20request"
          >
            Start pilot
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#cfcabf] bg-white px-3 py-2 text-sm font-medium text-[#4f514b]">
            <Sparkles size={16} aria-hidden="true" />
            Simple growth tools for local service businesses
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#101010] sm:text-6xl">
            Text back new leads before they call someone else.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4f514b]">
            LocalLeadReply helps home and local service businesses respond to
            new leads quickly, keep follow-ups organized, and add review replies
            and weekly content when the basics are working.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d94f30] px-5 font-semibold text-white transition hover:bg-[#bf4227]"
              href="mailto:hello@localleadreply.com?subject=14-day%20pilot"
            >
              Try a 14-day pilot
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#bdb7aa] bg-white px-5 font-semibold text-[#151515] transition hover:border-[#123c69]"
              href="#pricing"
            >
              View pricing
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-[#d7d1c4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#ebe7df] pb-4">
            <div>
              <p className="text-sm font-medium text-[#6a6a60]">New lead</p>
              <p className="font-semibold">Emergency sink repair</p>
            </div>
            <span className="rounded-md bg-[#e6f2ec] px-3 py-1 text-sm font-semibold text-[#1f7049]">
              replied
            </span>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-md bg-[#f4f1ea] p-4">
              <p className="text-sm text-[#5f615a]">Incoming form</p>
              <p className="mt-2 font-medium">
                “My kitchen sink is leaking. Can someone come today?”
              </p>
            </div>
            <div className="ml-auto max-w-[88%] rounded-md bg-[#123c69] p-4 text-white">
              <p className="text-sm text-[#cfe3f4]">Auto text-back</p>
              <p className="mt-2">
                Thanks for reaching out to Northside Plumbing. We can help with
                sink leaks. What time today is best for a quick call?
              </p>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {["18 sec response", "1 follow-up due", "$0 ad waste"].map(
                (item) => (
                  <div
                    className="rounded-md border border-[#ebe7df] bg-[#fbfaf7] p-3 text-sm font-semibold"
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-[#dedbd2] bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-3">
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article key={point.title} className="rounded-lg border border-[#e4ded2] p-5">
                <Icon className="text-[#d94f30]" size={24} aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold">{point.title}</h2>
                <p className="mt-3 leading-7 text-[#565850]">{point.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="niches" className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#d94f30]">
            Niche by niche
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            We start where missed leads are expensive.
          </h2>
          <p className="mt-4 leading-7 text-[#565850]">
            The first campaigns focus on local operators with urgent inquiries,
            quote requests, and repeat follow-up needs.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {niches.map((niche) => (
            <a
              className="rounded-md border border-[#cfcabf] bg-white px-4 py-3 font-medium transition hover:border-[#123c69]"
              href={niche.href}
              key={niche.name}
            >
              {niche.name}
            </a>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-[#123c69] px-5 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-[#9ed0f0]">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Start with lead response. Add the bundle when it pays.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                className={`rounded-lg border p-5 ${
                  plan.highlighted
                    ? "border-[#f6c453] bg-white text-[#151515]"
                    : "border-[#46729a] bg-[#174a7e]"
                }`}
                key={plan.name}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p
                      className={`mt-2 leading-7 ${
                        plan.highlighted ? "text-[#565850]" : "text-[#d8e7f3]"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlighted ? (
                    <Star className="text-[#d94f30]" size={22} aria-hidden="true" />
                  ) : null}
                </div>
                <p className="mt-6">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  <span
                    className={plan.highlighted ? "text-[#565850]" : "text-[#d8e7f3]"}
                  >
                    /mo
                  </span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li className="flex gap-3" key={feature}>
                      <CheckCircle2
                        className={plan.highlighted ? "text-[#1f7049]" : "text-[#9ed0f0]"}
                        size={20}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="flex items-center gap-3">
          <Clock3 className="text-[#d94f30]" size={30} aria-hidden="true" />
          <h2 className="text-2xl font-semibold">What happens next</h2>
        </div>
        <p className="leading-7 text-[#565850]">
          We will launch with one focused lead-response workflow, test messaging
          niche by niche, and only add reputation or content features when they
          help owners capture more business without adding busywork.
        </p>
      </section>
    </main>
  );
}
