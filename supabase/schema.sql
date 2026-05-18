create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  trade text not null,
  city text not null,
  auto_reply text not null,
  services text[] not null default array[]::text[],
  owner_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.businesses
  add column if not exists owner_email text;

alter table public.businesses
  add column if not exists is_active boolean not null default true;

alter table public.businesses
  add column if not exists updated_at timestamptz not null default now();

insert into public.businesses (
  slug,
  name,
  trade,
  city,
  auto_reply,
  services,
  owner_email,
  is_active
)
values (
  'northside-plumbing',
  'Northside Plumbing',
  'Plumbing',
  'Tampa, FL',
  'Thanks for reaching out to Northside Plumbing. We received your request and can help. What time today is best for a quick call?',
  array[
    'Emergency leak',
    'Drain clog',
    'Water heater',
    'Fixture repair',
    'General quote'
  ],
  null,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  trade = excluded.trade,
  city = excluded.city,
  auto_reply = excluded.auto_reply,
  services = excluded.services,
  is_active = excluded.is_active,
  updated_at = now();

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null,
  business_name text not null,
  customer_name text not null,
  phone text not null,
  email text,
  service text not null,
  message text,
  consent_given boolean not null default false,
  status text not null default 'new',
  status_updated_at timestamptz,
  auto_reply_preview text,
  source text not null default 'capture_form',
  created_at timestamptz not null default now(),
  constraint leads_status_check check (status in ('new', 'contacted', 'booked', 'lost'))
);

create table if not exists public.pilot_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  business_name text not null,
  business_type text not null,
  website text,
  phone text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pilot_requests_status_check check (
    status in ('new', 'contacted', 'qualified', 'closed')
  )
);

alter table public.pilot_requests
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pilot_requests_status_check'
  ) then
    alter table public.pilot_requests
      add constraint pilot_requests_status_check
      check (status in ('new', 'contacted', 'qualified', 'closed'));
  end if;
end
$$;

alter table public.leads
  add column if not exists status_updated_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_status_check'
  ) then
    alter table public.leads
      add constraint leads_status_check
      check (status in ('new', 'contacted', 'booked', 'lost'));
  end if;
end
$$;

create index if not exists leads_business_slug_created_at_idx
  on public.leads (business_slug, created_at desc);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

create index if not exists pilot_requests_status_created_at_idx
  on public.pilot_requests (status, created_at desc);

create index if not exists businesses_slug_active_idx
  on public.businesses (slug, is_active);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text not null,
  referrer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint analytics_events_name_check check (
    event_name in (
      'page_view',
      'pilot_request_submitted',
      'lead_capture_submitted'
    )
  )
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_name_created_at_idx
  on public.analytics_events (event_name, created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "Service role can manage analytics events" on public.analytics_events;
create policy "Service role can manage analytics events"
  on public.analytics_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

alter table public.businesses enable row level security;

drop policy if exists "Service role can manage businesses" on public.businesses;
create policy "Service role can manage businesses"
  on public.businesses
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

alter table public.pilot_requests enable row level security;

drop policy if exists "Service role can manage pilot requests" on public.pilot_requests;
create policy "Service role can manage pilot requests"
  on public.pilot_requests
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

alter table public.leads enable row level security;

drop policy if exists "Service role can manage leads" on public.leads;
create policy "Service role can manage leads"
  on public.leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
