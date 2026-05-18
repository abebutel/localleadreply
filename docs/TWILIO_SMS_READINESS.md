# Twilio SMS Readiness

SMS is not enabled yet. Keep the product email-first until the items below are
complete.

## Positioning Rule

Do not sell this as an AI receptionist or autonomous agent. SMS should be the
approved acknowledgement layer:

1. Lead submits a form or approved capture flow.
2. The business receives an alert.
3. The lead receives one approved acknowledgement.
4. Owner handles the actual follow-up.

## Required Before Sending US SMS

- Twilio account ready for production messaging.
- Messaging Service created.
- A2P 10DLC business/brand registration completed.
- A2P 10DLC campaign approved for this use case.
- Advanced Opt-Out enabled on the Messaging Service.
- STOP, START, and HELP behavior tested.
- Inbound webhook stores opt-out/help events.
- Every outbound message stored in `message_events`.
- Every inbound message stored in `message_events`.
- Lead consent source stored before any outbound SMS.
- Capture form copy includes call/text consent, message/data rates, and STOP
  opt-out language.

## Suggested Supabase Tables

Create these only when SMS implementation begins.

```sql
create table public.message_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  business_slug text not null,
  direction text not null check (direction in ('outbound', 'inbound')),
  channel text not null default 'sms',
  to_phone text,
  from_phone text,
  body text not null,
  provider text not null default 'twilio',
  provider_message_sid text,
  provider_status text,
  opt_out_type text,
  error_code text,
  error_message text,
  created_at timestamptz not null default now()
);

create index message_events_lead_created_at_idx
  on public.message_events (lead_id, created_at desc);

create index message_events_provider_sid_idx
  on public.message_events (provider_message_sid);
```

## First Message Template

Use a short, approved acknowledgement only:

```text
Thanks for reaching out to {{business_name}}. We received your request and can help. What time today is best for a quick call? Reply STOP to opt out.
```

Do not include discounts, promotions, review requests, or unrelated marketing in
the lead acknowledgement campaign.

## Webhooks To Build

- `POST /api/twilio/inbound`
  - Store inbound message.
  - Store `OptOutType` when Twilio sends it.
  - If the message is a normal lead reply, alert the owner by email.

- `POST /api/twilio/status`
  - Store delivery status updates.
  - Surface failed messages in the dashboard.

## Test Plan

1. Submit a test lead with consent.
2. Confirm one outbound SMS is sent.
3. Reply HELP and confirm Twilio/help behavior.
4. Reply STOP and confirm opt-out behavior.
5. Submit another lead with the same phone and confirm no SMS is sent after
   opt-out.
6. Confirm owner email alert still fires.
7. Confirm `message_events` has outbound, inbound, help/stop, and status rows.

## Sources

- Twilio A2P 10DLC overview:
  https://www.twilio.com/docs/sms/a2p-10dlc
- Twilio A2P business information:
  https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/collect-business-info
- Twilio Messaging Services:
  https://www.twilio.com/docs/messaging/services
- Twilio Advanced Opt-Out:
  https://www.twilio.com/docs/messaging/services/tutorials/advanced-opt-out
- Twilio opt-out/help tracking:
  https://help.twilio.com/articles/31560110671259
