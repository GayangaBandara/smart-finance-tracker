-- Supabase schema for Finance Tracker
-- Run this in Supabase SQL editor (https://app.supabase.com/project/<your-project>/sql)

-- Transactions table
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  uid uuid not null,
  amount numeric not null,
  date timestamp with time zone not null,
  type text, -- 'income' or 'expense'
  category text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Budgets table
create table if not exists public.budgets (
  id uuid default uuid_generate_v4() primary key,
  uid uuid not null,
  category text not null,
  amount numeric not null,
  period text default 'monthly',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Expenses (optional, can be same as transactions) - provided for compatibility
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  uid uuid not null,
  amount numeric not null,
  created_at timestamptz default now(),
  note text,
  category text,
  updated_at timestamptz default now()
);

-- Enable extensions (uuid generation)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Row Level Security (RLS) - enable and create policies so users can only access their rows

alter table public.transactions enable row level security;
create policy "transactions_select_for_owner" on public.transactions
  for select using (auth.uid() = uid);
create policy "transactions_insert_for_owner" on public.transactions
  for insert with check (auth.uid() = uid);
create policy "transactions_update_for_owner" on public.transactions
  for update using (auth.uid() = uid) with check (auth.uid() = uid);
create policy "transactions_delete_for_owner" on public.transactions
  for delete using (auth.uid() = uid);

alter table public.budgets enable row level security;
create policy "budgets_select_for_owner" on public.budgets
  for select using (auth.uid() = uid);
create policy "budgets_insert_for_owner" on public.budgets
  for insert with check (auth.uid() = uid);
create policy "budgets_update_for_owner" on public.budgets
  for update using (auth.uid() = uid) with check (auth.uid() = uid);
create policy "budgets_delete_for_owner" on public.budgets
  for delete using (auth.uid() = uid);

alter table public.expenses enable row level security;
create policy "expenses_select_for_owner" on public.expenses
  for select using (auth.uid() = uid);
create policy "expenses_insert_for_owner" on public.expenses
  for insert with check (auth.uid() = uid);
create policy "expenses_update_for_owner" on public.expenses
  for update using (auth.uid() = uid) with check (auth.uid() = uid);
create policy "expenses_delete_for_owner" on public.expenses
  for delete using (auth.uid() = uid);

-- Indexes
create index if not exists idx_transactions_uid_date on public.transactions (uid, date desc);
create index if not exists idx_budgets_uid on public.budgets (uid);
create index if not exists idx_expenses_uid_created on public.expenses (uid, created_at desc);
