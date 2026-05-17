# Supabase Setup

## Required Vercel Environment Variables

Add these to the Vercel project:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The app only uses the service role key on the server. Do not expose it in client
components.

## Create The Supabase Tables

In Supabase:

1. Open the LocalLeadReply project.
2. Go to SQL Editor.
3. Paste the contents of `supabase/schema.sql`.
4. Run the query.

If the tables already exist from an earlier MVP setup, run the current file
again. It safely adds the `businesses` configuration table, the
`status_updated_at` lead column, and the status constraint used by the owner
dashboard.

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

SMS events, team users, and business accounts should be separate tables later.
