# LocalLeadReply Thread Handoff

## User Preference

The owner prefers to be as hands-off as possible after launch, ideally with no
manual involvement for one to two months while the site/app tests early demand.

Future work should prioritize automation, monitoring, simple alerts, and
low-touch onboarding. Ask for owner involvement only when credentials, paid
account setup, legal/business ownership decisions, or security-sensitive actions
are genuinely required.

## Product Decision Summary

Several small SaaS ideas were evaluated. The chosen direction is:

LocalLeadReply: a boring, honest, clean growth utility for local service
businesses.

Flagship product:
- Missed lead and form text-back for local service businesses.

Expansion modules later:
- Review reply and reputation hub.
- Weekly local content calendar.

Reasoning:
- Same target buyer across all three modules.
- Lead text-back has the clearest ROI.
- One saved job can justify the monthly price.
- Review/content modules can become upsells after the lead-response workflow
  proves useful.

## Target Market

Start niche by niche, not country-wide outreach.

Recommended first region:
- Florida.
- Tampa, Orlando, Miami, Jacksonville.

First niches:
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

## Live Assets

Production:
- https://www.localleadreply.com

GitHub:
- https://github.com/abebutel/localleadreply

Local workspace:
- `C:\aiProjectIdeas\Codex\small-business-sop`

Important live pages:
- `/`
- `/pilot`
- `/app`
- `/capture/northside-plumbing`
- `/industries/plumbers`
- `/industries/cleaning-companies`
- `/industries/med-spas`
- `/industries/landscapers`
- `/industries/roofers`
- `/guides/missed-call-text-back-examples`
- `/guides/how-fast-should-local-business-respond-to-leads`

## Current App State

Built and deployed:
- Next.js App Router app.
- Landing page.
- Five niche landing pages.
- Two guide articles.
- Pilot request form and API.
- Supabase-backed pilot request storage.
- Supabase-backed outreach prospect tracking for the first Florida plumber
  campaign.
- Lead capture form for sample business.
- Supabase-backed business configuration with hardcoded fallback.
- Resend email notifications.
- Supabase-backed lead storage.
- Dashboard that shows real Supabase leads when present and sample data
  otherwise.
- Dashboard lead status updates for `new`, `contacted`, `booked`, and `lost`.
- Privacy-light first-party analytics in Supabase with a seven-day dashboard
  summary.
- Daily owner digest endpoint scheduled through Vercel Cron.
- Owner email notifications include signed direct action links when the lead is
  stored successfully.
- Pilot request emails include signed direct action links when the request is
  stored successfully.
- Optional Basic Auth dashboard protection through `ADMIN_PASSWORD`.
- Branded favicon/icon routes.
- Sitemap and robots routes.

Verified by the owner:
- Supabase is configured.
- Capture form submission appears on the dashboard.

## Current Pilot Workflow

1. Visitor submits `/capture/northside-plumbing`.
2. App loads active business configuration from Supabase, with the original
   Northside Plumbing config as fallback.
3. App validates name, phone, service, and consent.
4. App stores the lead in Supabase.
5. App sends an email through Resend to the business `owner_email`, falling
   back to `PILOT_TO_EMAIL`.
6. Dashboard reads recent leads from Supabase.
7. Owner can mark the lead contacted, booked, or lost from `/app` or the email
   action links.
8. SMS is not enabled yet.

The current flow is email-first by design. Do not claim that text messages are
being sent until Twilio, A2P 10DLC registration, opt-out handling, and message
event storage are implemented.

SMS readiness plan:
- `docs/TWILIO_SMS_READINESS.md`

## Accounts And Services

Already connected/configured by owner:
- Domain purchased through Vercel: `localleadreply.com`.
- GitHub repo connected to Vercel.
- Resend account created.
- Resend domain verified.
- Resend API key added to Vercel.
- Supabase configured and working.

Known Vercel env vars used:
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `PILOT_TO_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `LEAD_ACTION_SECRET`
- `CRON_SECRET`

Do not store secrets in the repo. `.env.local` is ignored.

## Email Notes

Pilot and lead emails were initially landing in spam. That is expected for a
fresh domain.

Recommended next email setup:
- Create or forward `hello@localleadreply.com`.
- Free forwarding options: Cloudflare Email Routing or ImprovMX.
- Real mailbox option: Zoho Mail.

See:
- `docs/EMAIL_SETUP.md`

## Supabase Notes

Schema lives at:
- `supabase/schema.sql`

Setup doc:
- `docs/SUPABASE_SETUP.md`

The capture route `/capture/[businessSlug]` and dashboard route `/app` are
dynamic and read through the server-side Supabase service role client.

Analytics events live in `public.analytics_events`. Public page views are
recorded client-side; pilot request and lead capture conversions are recorded
server-side after the corresponding notification email succeeds.

Daily summary:
- Route: `/api/daily-summary`
- Schedule: `0 13 * * *` in `vercel.json`
- Sends to `PILOT_TO_EMAIL`
- Requires `Authorization: Bearer ${CRON_SECRET}`
- Includes new leads from the last 24 hours, open lead count, booked count,
  open pilot requests, outreach counts, follow-ups due, and seven-day
  analytics.

Readiness check:
- Route: `/api/readiness`
- Requires dashboard Basic Auth or `Authorization: Bearer ${CRON_SECRET}`
- Checks required env vars and Supabase table reachability without exposing
  secret values.

## Outreach Plan

Initial campaign should focus on Florida plumbers.

Approach:
- Build a list of businesses from public directories/search.
- Prioritize businesses with visible quote forms, paid ads, recent reviews, or
  likely urgent service inquiries.
- Offer a 14-day pilot on one lead source and one approved auto-reply.

See:
- `docs/OUTREACH_PLAYBOOK.md`
- `docs/OUTREACH_IMPORT.md`

Controlled outreach means small-batch validation, not a broad paid launch:
- 20-50 hand-picked Florida plumbers.
- Manual or very small-batch outreach.
- 14-day pilot offer.
- Email-first setup only.
- No SMS claims until Twilio/A2P/opt-out/message logs are complete.
- No paid subscription push until business/legal/payment readiness is handled.

Protected outreach import:
- Route: `/api/outreach-prospects`
- Method: `POST`
- Accepts one prospect or an array of prospects.
- Requires dashboard Basic Auth or `Authorization: Bearer ${CRON_SECRET}`.

## Browser/Chrome Tool Issue

The user installed/logged into Chrome, but the current thread did not expose
callable Chrome/browser tools. Tool discovery only exposed GitHub, Notion, and
Node REPL tools.

If continuing in a new thread, first check whether browser tools are available.
Desired tools would look like:
- browser/chrome navigate
- click
- type
- screenshot
- current tab inspection

If still unavailable, continue with code, HTTP checks, Vercel/GitHub/Supabase
instructions, and ask the owner only for dashboard actions that require login.

## Recommended Next Work

Priority order:
1. Verify `/api/readiness` on production with dashboard auth or cron bearer.
2. Add 20-50 Florida plumber prospects through `/api/outreach-prospects` or
   directly in Supabase.
3. Verify one live pilot request and one live capture request end to end.
4. Start first Florida plumber outreach campaign.
5. Add Twilio only after `docs/TWILIO_SMS_READINESS.md` is satisfied.

Keep the product narrow and trustworthy. Avoid generic CRM sprawl.
