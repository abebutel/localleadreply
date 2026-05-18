# Outreach Prospect Import

Use the protected `/api/outreach-prospects` endpoint to add one prospect or a
batch of prospects to `public.outreach_prospects`.

The endpoint accepts dashboard Basic Auth or `Authorization: Bearer
${CRON_SECRET}`.

## Required fields

- `business_name`
- `city`

## Optional fields

- `niche`
- `website`
- `contact_name`
- `contact_email`
- `phone`
- `lead_source`
- `notes`
- `status`: `identified`, `contacted`, `replied`, `pilot_invited`, `not_fit`
- `last_contacted_at`
- `next_follow_up_at`

## Batch example

```json
[
  {
    "business_name": "Example Plumbing",
    "city": "Tampa, FL",
    "niche": "plumbing",
    "website": "https://example.com",
    "lead_source": "website form",
    "notes": "Visible emergency plumbing form; good fit for 14-day pilot."
  }
]
```
