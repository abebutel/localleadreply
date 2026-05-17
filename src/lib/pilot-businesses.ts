export type PilotBusiness = {
  slug: string;
  name: string;
  trade: string;
  city: string;
  autoReply: string;
  services: string[];
};

export const pilotBusinesses: PilotBusiness[] = [
  {
    slug: "northside-plumbing",
    name: "Northside Plumbing",
    trade: "Plumbing",
    city: "Tampa, FL",
    autoReply:
      "Thanks for reaching out to Northside Plumbing. We received your request and can help. What time today is best for a quick call?",
    services: [
      "Emergency leak",
      "Drain clog",
      "Water heater",
      "Fixture repair",
      "General quote",
    ],
  },
];

export function getPilotBusiness(slug: string) {
  return pilotBusinesses.find((business) => business.slug === slug);
}
