-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run

create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker text not null,
  shares numeric,
  cost_basis numeric,
  added_at timestamptz not null default now()
);

create unique index if not exists portfolios_user_ticker_idx
  on portfolios (user_id, ticker);

alter table portfolios enable row level security;

drop policy if exists "Users can view their own holdings" on portfolios;
create policy "Users can view their own holdings"
  on portfolios for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own holdings" on portfolios;
create policy "Users can insert their own holdings"
  on portfolios for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own holdings" on portfolios;
create policy "Users can update their own holdings"
  on portfolios for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own holdings" on portfolios;
create policy "Users can delete their own holdings"
  on portfolios for delete
  using (auth.uid() = user_id);

create table if not exists subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

drop policy if exists "Users can view their own subscription" on subscriptions;
create policy "Users can view their own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);
