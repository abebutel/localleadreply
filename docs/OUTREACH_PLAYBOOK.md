# LocalLeadReply Outreach Playbook

## First Campaign

Target:
- Plumbing businesses in Florida.
- Start with Tampa, Orlando, Jacksonville, and Miami.
- Prioritize businesses with paid ads, contact forms, or many recent reviews.

Offer:
- 14-day pilot.
- One lead source.
- One approved text-back.
- No long contract.

## Controlled Campaign Rules

This campaign is customer discovery with a working concierge pilot, not a broad
paid SaaS launch.

Rules:
- Start with 20-50 hand-picked prospects.
- Use one niche only: Florida plumbers.
- Send outreach manually or in very small batches.
- Do not claim SMS is live until Twilio, A2P 10DLC, opt-out handling, and
  message logging are complete.
- Offer a 14-day pilot, not a paid subscription.
- Stop adding volume if replies reveal confusion, trust concerns, or poor fit.

Success signals:
- 2-5 replies from the first 50 prospects.
- 1-2 businesses willing to try a 14-day pilot.
- At least one real lead captured through a pilot form.
- The business owner says the alert/status workflow is useful.

Stop or revise if:
- Prospects think this is an AI receptionist or chatbot.
- Prospects mainly ask for pricing before understanding the workflow.
- No replies after 50 well-qualified, personalized prospects.
- The workflow creates manual follow-up burden for the owner.

## Prospect Status Workflow

Use `public.outreach_prospects` to track campaign state.

- `identified`: qualified prospect added, no outreach sent yet.
- `contacted`: first message sent.
- `replied`: prospect responded.
- `pilot_invited`: prospect got a pilot setup link or next-step email.
- `not_fit`: not a fit, bounced, declined, or should not be contacted again.

Recommended cadence:

1. Day 0: first email.
2. Day 3 or 4: follow-up 1.
3. Day 8 or 9: follow-up 2 and close the loop.
4. After reply: update status to `replied`.
5. If interested: update status to `pilot_invited`.
6. If declined or irrelevant: update status to `not_fit`.

Set `next_follow_up_at` for each follow-up so the dashboard and daily digest can
surface due follow-ups.

## Prospect Qualification

Add a prospect only if at least two are true:

- Website has a quote/contact/request-service form.
- Offers urgent or time-sensitive plumbing services.
- Shows paid ads, strong review volume, or active local SEO presence.
- Has visible service area in Tampa, Orlando, Jacksonville, or Miami.
- Follow-up speed plausibly matters for the sale.

Good `lead_source` values:
- `website form`
- `emergency service page`
- `Google Ads landing page`
- `recent reviews`
- `Facebook lead flow`

## Outreach Message

Subject:

```text
Quick question about missed plumbing leads
```

Email:

```text
Hi {{first_name}},

I’m working on LocalLeadReply, a simple text-back system for plumbing companies.

The idea is boring on purpose: when someone submits a quote request or after-hours form, they immediately get a clean text from the business, and the owner sees whether a follow-up call is still needed.

I noticed {{business_name}} looks like it gets leads through {{lead_source}}. Would you be open to a 14-day pilot on one lead form?

No long contract. We would start with one approved message and keep it focused on lead response, not bulk marketing.

Best,
Abe
LocalLeadReply
```

## LinkedIn Message

```text
Hi {{first_name}}, I’m testing a simple lead text-back tool for local service businesses. It helps owners reply instantly when a quote request comes in, then keeps the follow-up visible. Would a 14-day pilot be useful for {{business_name}}?
```

## Follow-Up 1

```text
Hi {{first_name}}, quick follow-up. The pilot is just one lead source and one approved text-back, so it is easy to test without changing how the whole business runs.

Worth trying for {{business_name}}?
```

## Follow-Up 2

```text
Hi {{first_name}}, I’ll close the loop here. If missed calls or after-hours quote requests are ever a problem, LocalLeadReply is built for exactly that small workflow.

Here’s the pilot page:
https://www.localleadreply.com/pilot
```

## Social Posts

### Post 1

```text
Local service businesses do not always need a bigger CRM.

Sometimes the better first fix is simpler:

1. New quote request comes in
2. Customer gets an immediate text-back
3. Owner sees whether a call is still needed

That is what we’re building with LocalLeadReply.
```

### Post 2

```text
If a homeowner is asking three plumbers for a quote, the fastest useful reply has an advantage.

Not a spam blast.
Not a complicated automation.

Just: “We received your request. What time today is best for a quick call?”
```

### Post 3

```text
Building LocalLeadReply around a small rule:

Do not automate dishonesty.

The system should only use facts the customer gave, identify the business clearly, and make follow-up easier for the owner.
```

## Qualification Checklist

Good fit:
- Has a visible phone number or quote form.
- Sells local services with time-sensitive inquiries.
- Owner or office manager handles leads manually.
- Likely value of one saved job is greater than one month of software.

Weak fit:
- No website or form.
- Very low lead volume.
- Already has a full CRM and call center.
- Wants bulk promotional texting.
