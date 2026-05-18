# Outreach Batch 001 Sources

Import file:

- `data/outreach-prospects-florida-plumbers-batch-001.json`

Public sources used:

- Larson Plumbing: https://www.larsonplumbing.net/
- Sunshine Plumbers of Tampa: https://www.thesunshineplumbers.com/contact
- Pro Plumbing Services Corp.: https://www.proplumbing-air.com/contact/
- Choice Plumbing Orlando: https://choiceplumbingorlando.com/contact-us/
- Herrell Plumbing: https://www.herrellplumbing.com/
- Centurion Plumbing: https://centurionplumbers.com/
- Reliance Plumbing & Drain Cleaning: https://www.relianceplumbers.com/contact-us/
- Harvey Baker Plumbing: https://harveybakerplumbing.com/contact-us/
- The Drain Daddy: https://www.thedraindaddy.com/contact
- HL Plumbing Solutions: https://hlplumbingsolutions.com/
- Orlando Plumbing and Drains: https://www.plumbing-orlando.com/
- Express Plumbing Services Orlando: https://www.expressplumbingservicesorlando.com/
- Greenberry Plumbing: https://greenberryplumbing.com/
- Turner Plumbing Company: https://www.turnerplumbingco.com/jacksonville-contact-us/
- All Hours Emergency Plumber: https://jacksonvilleplumbers.com/contact/
- The Greatful Plumber: https://tgplumber.com/contact/
- Betros Plumbing: https://betrosplumbing.com/contact/
- Affordable Plumbing Company: https://www.affordableplumbingjacksonville.com/contact-us
- Main Plumbing Services: https://mainplumbingmiami.com/contact-us/
- Miami Emergency Plumbing: https://www.miamiemergencyplumbing.com/contact/
- Care Plumbing Services: https://plumbingmiamiservices.com/contact-us/
- 24/7 Plumber Miami: https://www.247plumbermiami.com/contact
- Seva Plumbing: https://sevaplumbing.com/contact-us/
- National Emergency Plumbing: https://nationalemergencyplumbing.com/
- AG Plumbing & Gas: https://agplumbinggasfl.com/contact/

## Import command

Replace `YOUR_CRON_SECRET` with the Vercel `CRON_SECRET`.

```powershell
$json = Get-Content -Raw data\outreach-prospects-florida-plumbers-batch-001.json
Invoke-WebRequest `
  -UseBasicParsing `
  -Uri "https://www.localleadreply.com/api/outreach-prospects" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer YOUR_CRON_SECRET" } `
  -Body $json
```
