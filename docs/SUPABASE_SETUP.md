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

## Create The Leads Table

In Supabase:

1. Open the LocalLeadReply project.
2. Go to SQL Editor.
3. Paste the contents of `supabase/schema.sql`.
4. Run the query.

## Verify

After deploy:

1. Open `https://www.localleadreply.com/capture/northside-plumbing`.
2. Submit a test lead.
3. Confirm it appears in Supabase `public.leads`.
4. Confirm it appears on `https://www.localleadreply.com/app`.

## Current Data Model

The first table is intentionally small:

- `business_slug`
- `business_name`
- `customer_name`
- `phone`
- `email`
- `service`
- `message`
- `consent_given`
- `status`
- `auto_reply_preview`
- `source`
- `created_at`

SMS events, team users, and business accounts should be separate tables later.
