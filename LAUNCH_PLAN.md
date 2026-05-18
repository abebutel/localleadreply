# LocalLeadReply Launch Plan

## Product Direction

Domain: https://localleadreply.com

Flagship product: missed lead and form text-back for local service businesses.

Expansion modules:
- Review reply and reputation hub.
- Weekly local content calendar.

## Operating Preference

The owner wants this business to run with as little day-to-day involvement from
them as possible after launch, ideally with no manual involvement for the first
month or two while early acquisition and product usage are tested.

Build toward:
- Automated lead capture and notifications.
- Clear dashboards that show whether anything needs attention.
- Low-touch onboarding for pilots.
- Simple email alerts instead of manual checking.
- Documentation that lets future agents continue without asking the owner for
  repeated context.
- Honest, permission-based messaging with no spammy shortcuts.

Avoid:
- Workflows that require the owner to manually process every pilot request.
- Features that depend on frequent owner decisions before product-market signal
  is visible.
- Anything that risks deliverability, trust, or account reputation for short-term
  outreach volume.

## Initial Geography

Start with a focused region instead of the entire US.

Recommended first test:
- One state with many local service businesses and strong home-service demand.
- Two to four metro areas inside that state.

Good first choices:
- Florida: Tampa, Orlando, Miami, Jacksonville.
- Texas: Austin, Dallas-Fort Worth, Houston, San Antonio.
- Arizona: Phoenix, Scottsdale, Tucson.

The first campaigns should stay narrow enough that landing pages, outreach, and examples feel local and specific.

## First Niches

Recommended order:
1. Plumbers and emergency home services.
2. Cleaning companies.
3. Med spas and salons.
4. Landscapers.
5. Roofers.

## Pricing To Test

- Lead Text-Back: $79/month.
- Growth Bundle: $149/month.
- Multi-Location: $249/month.

Pilot offer:
- 14-day pilot.
- Setup help included.
- No long contract.

## Credential Handling

Do not store usernames, passwords, or API keys in committed files.

Use:
- `.env.local` for local development secrets.
- Vercel environment variables for production.
- Supabase, Twilio, Resend, Stripe, and OpenAI dashboards for service-side secrets.
- A password manager for account usernames/passwords.

Social media accounts should be accessed through browser sessions or official connectors when available, not by storing passwords in the repository.

## SMS Trust Rules

- Use clear opt-in language on lead forms.
- Identify the business in the first message.
- Support STOP/opt-out handling.
- Do not send bulk promotional blasts.
- Complete Twilio A2P 10DLC registration before US production messaging.

## Early Acquisition System

1. Launch one flagship landing page.
2. Add niche pages for the first vertical.
3. Publish practical SEO articles.
4. Create short demo clips from the app.
5. Build a list of local businesses from public directories.
6. Send concise personalized outreach.
7. Offer a 14-day pilot and measure booked calls or replies.

## Controlled Outreach Definition

The first campaign should validate demand without pretending the full SaaS is
finished.

- Track prospects in `public.outreach_prospects`.
- Start with Florida plumbers only.
- Use small batches and manual review.
- Offer an unpaid or lightly assisted 14-day pilot.
- Use email-first alerts until Twilio/A2P/opt-out work is complete.
- Do not accept paid subscriptions until business/legal/payment readiness is
  handled.

## First SEO Articles

- Missed call text-back examples for plumbers.
- How fast should a local service business respond to a lead?
- Why home service leads go cold after five minutes.
- Best follow-up text templates for cleaning companies.
- How to respond to Google reviews without sounding fake.

## Accounts Needed Before Production

- Domain registrar account.
- Vercel.
- Supabase.
- Twilio.
- Resend.
- OpenAI.
- Stripe.
- Google Search Console.
- Analytics provider, such as Plausible or Google Analytics.

## Current Pilot Workflow

The first usable pilot workflow is intentionally email-first:

1. A visitor submits `/capture/northside-plumbing`.
2. The app validates consent, name, phone, and service type.
3. The app emails the configured pilot inbox through Resend.
4. The page shows the approved text-back copy as a preview.

SMS sending is not enabled yet. Add Twilio, A2P 10DLC registration, opt-out
handling, and persistent lead storage before turning on production text-back.
