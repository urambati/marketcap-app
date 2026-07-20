-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run

create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker text not null,
  shares numeric,
  cost_basis numeric,
  added_at timestamptz not null default now()
);

alter table portfolios enable row level security;

create policy "Users can view their own holdings"
  on portfolios for select
  using (auth.uid() = user_id);

create policy "Users can insert their own holdings"
  on portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own holdings"
  on portfolios for update
  using (auth.uid() = user_id);

create policy "Users can delete their own holdings"
  on portfolios for delete
  using (auth.uid() = user_id);
