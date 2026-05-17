# LocalLeadReply Email Setup

## Goal

Use `hello@localleadreply.com` as the public contact address and make pilot
request notifications land in a real inbox.

## Recommended Free Option

Use email forwarding if you only need to receive mail at
`hello@localleadreply.com`.

Good free options:
- Cloudflare Email Routing: free forwarding, but requires Cloudflare to manage
  the domain DNS.
- ImprovMX: free forwarding tier for simple domain aliases.

Cloudflare Email Routing is receive-only. It forwards inbound mail to another
inbox, but it does not provide outbound SMTP or a normal mailbox.

## Current App Email Variables

These are required in Vercel:

```text
RESEND_API_KEY=...
FROM_EMAIL=LocalLeadReply <hello@localleadreply.com>
PILOT_TO_EMAIL=...
```

`FROM_EMAIL` is the sender used by the app.

`PILOT_TO_EMAIL` is where pilot requests are delivered. This can be a Gmail
address, personal inbox, or `hello@localleadreply.com` if forwarding is active.

## Practical Setup

1. Keep Resend as the app's sending service.
2. Set `FROM_EMAIL` to `LocalLeadReply <hello@localleadreply.com>`.
3. Set up inbound forwarding for `hello@localleadreply.com` to a real inbox.
4. Set `PILOT_TO_EMAIL` to the real inbox or to `hello@localleadreply.com`.
5. Submit the `/pilot` form and confirm the email lands outside spam.

## Deliverability Notes

- New domains often land in spam at first.
- Resend domain verification should add SPF and DKIM records.
- Add a DMARC record when possible, even a relaxed one:

```text
v=DMARC1; p=none; rua=mailto:hello@localleadreply.com
```

- Avoid sending lots of cold email from `hello@localleadreply.com` early.
- Use a separate address like `abe@localleadreply.com` or a dedicated outreach
  tool/domain later if outbound volume grows.
