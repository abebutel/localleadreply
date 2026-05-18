# Supabase Setup

## Required Vercel Environment Variables

Add these to the Vercel project:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

The app only uses the service role key on the server. Do not expose it in client
components.

`CRON_SECRET` should be a random long value. Vercel sends it to the daily
summary endpoint as a bearer token when the cron job runs.

## Create The Supabase Tables

In Supabase:

1. Open the LocalLeadReply project.
2. Go to SQL Editor.
3. Paste the contents of `supabase/schema.sql`.
4. Run the query.

If the tables already exist from an earlier MVP setup, run the current file
again. It safely adds the `businesses` configuration table, the
`pilot_requests` table, the `analytics_events` table, the `status_updated_at`
lead column, and the status constraints used by the owner dashboard.

## Verify

After deploy:

1. Open `https://www.localleadreply.com/capture/northside-plumbing`.
2. Submit a test lead.
3. Confirm it appears in Supabase `public.leads`.
4. Confirm it appears on `https://www.localleadreply.com/app`.

## Business Configuration

Pilot capture forms are configured in `public.businesses`.

- `slug`: used in `/capture/[slug]`
- `name`
- `trade`
- `city`
- `auto_reply`: the approved reply preview shown after form submit
- `services`: the dropdown options on the capture form
- `owner_email`: optional lead notification recipient for that business
- `is_active`: hide or activate a capture form without code changes

The schema seeds `northside-plumbing` so the current live sample URL keeps
working. If `owner_email` is blank, lead alerts fall back to `PILOT_TO_EMAIL`.

## Current Data Model

The first lead table is intentionally small:

- `business_slug`
- `business_name`
- `customer_name`
- `phone`
- `email`
- `service`
- `message`
- `consent_given`
- `status`
- `status_updated_at`
- `auto_reply_preview`
- `source`
- `created_at`

## Analytics Events

The app records privacy-light first-party events in `public.analytics_events`.

- `page_view`: public site pages only; `/app` and `/api` are ignored
- `pilot_request_submitted`: recorded after a pilot request email is sent
- `lead_capture_submitted`: recorded after a lead notification email is sent

The owner dashboard summarizes the last seven days from this table. It stores
paths, referrers, event names, and small metadata fields, but no IP addresses or
cookies.

## Pilot Requests

Pilot setup requests are stored in `public.pilot_requests` before the Resend
email is sent. This keeps inbound sales interest visible in the owner dashboard
even if email delivery has a temporary issue.

- `new`: inbound request waiting for owner review
- `contacted`: owner replied or reached out
- `qualified`: business looks like a good pilot candidate
- `closed`: no longer active

SMS events, team users, and business accounts should be separate tables later.
