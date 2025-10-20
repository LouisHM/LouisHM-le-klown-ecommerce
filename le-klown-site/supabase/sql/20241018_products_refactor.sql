-- 2024-10-18 Simplify products & introduce packs

-- Ensure helper function exists for updated_at triggers
create or replace function public.trigger_set_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Drop legacy structures
drop view if exists public.products_public cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.product_option_values cascade;
drop table if exists public.product_option_groups cascade;

-- Update products table
alter table public.products
  add column if not exists size_options text[] default array[]::text[];

alter table public.products
  add column if not exists color_options text[] default array[]::text[];

alter table public.products
  add column if not exists updated_at timestamptz default now();

alter table public.products
  drop column if exists has_sizes,
  drop column if exists sizes;

update public.products set updated_at = now() where updated_at is null;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.trigger_set_timestamp();

-- Table storing stock per (size,color) combination
create table if not exists public.product_stocks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text,
  color text,
  stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_product_stocks_updated_at on public.product_stocks;
create trigger trg_product_stocks_updated_at
before update on public.product_stocks
for each row execute function public.trigger_set_timestamp();

create unique index if not exists product_stocks_unique_per_option
  on public.product_stocks (product_id, coalesce(size, ''), coalesce(color, ''));

-- Enable policies for new tables (admin manage, public read via views)
alter table if exists public.product_stocks enable row level security;
alter table if exists public.product_stocks force row level security;

drop policy if exists product_stocks_public_select on public.product_stocks;
create policy product_stocks_public_select on public.product_stocks
  for select
  using (true);

drop policy if exists product_stocks_admin_all on public.product_stocks;
create policy product_stocks_admin_all on public.product_stocks
  for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

grant select on public.product_stocks to anon, authenticated;

-- Packs
create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  images text[] default array[]::text[],
  deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_packs_updated_at on public.packs;
create trigger trg_packs_updated_at
before update on public.packs
for each row execute function public.trigger_set_timestamp();

alter table if exists public.packs enable row level security;
alter table if exists public.packs force row level security;

drop policy if exists packs_public_select on public.packs;
create policy packs_public_select on public.packs
  for select
  using (deleted is not true);

drop policy if exists packs_admin_all on public.packs;
create policy packs_admin_all on public.packs
  for all
  using (public.is_admin(auth.uid()))
  with check (true);

grant select on public.packs to anon, authenticated;

create table if not exists public.pack_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists pack_items_pack_id_idx on public.pack_items(pack_id, sort_order);

alter table if exists public.pack_items enable row level security;
alter table if exists public.pack_items force row level security;

drop policy if exists pack_items_public_select on public.pack_items;
create policy pack_items_public_select on public.pack_items
  for select
  using (true);

drop policy if exists pack_items_admin_all on public.pack_items;
create policy pack_items_admin_all on public.pack_items
  for all
  using (public.is_admin(auth.uid()))
  with check (true);

grant select on public.pack_items to anon, authenticated;

-- Views for public consumption
create or replace view public.products_public as
select
  p.*,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', s.id,
        'size', s.size,
        'color', s.color,
        'stock', s.stock
      )
      order by s.size, s.color
    ) filter (where s.id is not null),
    '[]'::jsonb
  ) as stocks,
  coalesce(
    (select sum(stock) from public.product_stocks st where st.product_id = p.id),
    p.stock,
    0
  ) as total_stock
from public.products p
left join public.product_stocks s on s.product_id = p.id
where p.deleted is not true
group by p.id;

create or replace view public.packs_public as
select
  pk.*,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', i.id,
        'product_id', i.product_id,
        'quantity', i.quantity,
        'sort_order', i.sort_order
      )
      order by i.sort_order, i.created_at
    ) filter (where i.id is not null),
    '[]'::jsonb
  ) as items
from public.packs pk
left join public.pack_items i on i.pack_id = pk.id
where pk.deleted is not true
group by pk.id;
