-- ShopZayn Supabase Authentication & Row Level Security (RLS) Setup
-- Run this SQL in your Supabase SQL Editor before enabling Admin Login.

-- 1. Explicit Admin Authorization Table
-- Authentication alone (auth.users) NEVER grants admin access.
-- Only users with an active row in public.admin_users are authorized.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Authenticated users can only read their own active admin record.
-- Public/anon users cannot read anything, and no client role can insert/update/delete admin_users.
drop policy if exists "Admins can read own active record" on public.admin_users;
create policy "Admins can read own active record"
  on public.admin_users
  for select
  to authenticated
  using (auth.uid() = user_id and is_active = true);

-- Helper function used in RLS policies across admin-managed tables
create or replace function public.is_shopzayn_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.is_active = true
  );
$$;

-- 2. Future Admin-Managed Tables (Scaffold with RLS Enabled)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can view categories" on public.categories;
create policy "Public can view categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can modify categories" on public.categories;
create policy "Only admins can modify categories"
  on public.categories
  for all
  to authenticated
  using (public.is_shopzayn_admin())
  with check (public.is_shopzayn_admin());

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  category text not null,
  price_pkr integer not null check (price_pkr >= 0),
  original_price_pkr integer,
  in_stock boolean not null default true,
  stock_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can view products" on public.products;
create policy "Public can view products"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can modify products" on public.products;
create policy "Only admins can modify products"
  on public.products
  for all
  to authenticated
  using (public.is_shopzayn_admin())
  with check (public.is_shopzayn_admin());

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_city text not null,
  total_pkr integer not null check (total_pkr >= 0),
  status text not null default 'pending_whatsapp',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Only admins can view or manage orders" on public.orders;
create policy "Only admins can view or manage orders"
  on public.orders
  for all
  to authenticated
  using (public.is_shopzayn_admin())
  with check (public.is_shopzayn_admin());

-- To promote an existing Supabase Auth user (created under Authentication -> Users) to ShopZayn Admin,
-- run this in your Supabase SQL Editor (replace with your registered Gmail/email):
-- insert into public.admin_users (user_id, email, role, is_active)
-- select id, email, 'super_admin', true
-- from auth.users
-- where email = 'your-admin-email@gmail.com'
-- on conflict (user_id) do update set is_active = true, role = 'super_admin';

