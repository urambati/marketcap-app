-- Safe to run more than once. This does not delete or alter portfolio data.

create unique index if not exists portfolios_user_ticker_idx
  on portfolios (user_id, ticker);

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
