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
  auto_reply_preview text,
  source text not null default 'capture_form',
  created_at timestamptz not null default now()
);

create index if not exists leads_business_slug_created_at_idx
  on public.leads (business_slug, created_at desc);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

alter table public.leads enable row level security;

drop policy if exists "Service role can manage leads" on public.leads;
create policy "Service role can manage leads"
  on public.leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
