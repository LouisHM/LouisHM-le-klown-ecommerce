-- RLS policies and privileges for order management
-- Execute after creating functions (orders_rpcs.sql)

-- Ensure RLS is enabled
alter table if exists commandes enable row level security;
alter table if exists commandes force row level security;

-- Revoke all default privileges on commandes from anon/authenticated to route through policies
revoke all on commandes from anon;
revoke all on commandes from authenticated;

-- Policies
drop policy if exists "commandes_admin_select" on commandes;
create policy "commandes_admin_select" on commandes
  for select
  using (public.is_admin(auth.uid()));

drop policy if exists "commandes_owner_select" on commandes;
create policy "commandes_owner_select" on commandes
  for select
  using (
    auth.uid() is not null
    and (
      user_id = auth.uid()
      or (
        customer_email is not null
        and lower(customer_email) = lower(coalesce(auth.jwt()->>'email', ''))
      )
    )
  );

-- Optionally allow service role to insert/update directly (administrative scripts)
grant select on commandes to anon, authenticated;

-- Function execution privileges
grant execute on function public.create_order_with_stock(jsonb) to anon, authenticated;
grant execute on function public.advance_order_status(uuid, text, text) to authenticated;
grant execute on function public.revert_order_status(uuid, text, text) to authenticated;
grant execute on function public.mark_order_deleted(uuid, boolean) to authenticated;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- Catalog policies ----------------------------------------------------------
alter table if exists products enable row level security;
alter table if exists products force row level security;

alter table if exists product_stocks enable row level security;
alter table if exists product_stocks force row level security;

alter table if exists packs enable row level security;
alter table if exists packs force row level security;

alter table if exists pack_items enable row level security;
alter table if exists pack_items force row level security;

-- Products policies
drop policy if exists "products_public_select" on products;
create policy "products_public_select" on products
  for select
  using (deleted = false);

drop policy if exists "products_admin_all" on products;
create policy "products_admin_all" on products
  for all
  using (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  )
  with check (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  );

grant select on products to anon, authenticated;
grant insert, update, delete on products to authenticated;

-- Option groups (admin only)
drop policy if exists "product_stocks_public_select" on product_stocks;
create policy "product_stocks_public_select" on product_stocks
  for select
  using (true);

drop policy if exists "product_stocks_admin_all" on product_stocks;
create policy "product_stocks_admin_all" on product_stocks
  for all
  using (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  )
  with check (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  );

grant select on product_stocks to anon, authenticated;
grant insert, update, delete on product_stocks to authenticated;

drop policy if exists "packs_public_select" on packs;
create policy "packs_public_select" on packs
  for select
  using (deleted is not true);

drop policy if exists "packs_admin_all" on packs;
create policy "packs_admin_all" on packs
  for all
  using (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  )
  with check (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  );

grant select on packs to anon, authenticated;
grant insert, update, delete on packs to authenticated;

drop policy if exists "pack_items_public_select" on pack_items;
create policy "pack_items_public_select" on pack_items
  for select
  using (true);

drop policy if exists "pack_items_admin_all" on pack_items;
create policy "pack_items_admin_all" on pack_items
  for all
  using (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  )
  with check (
    public.is_admin(auth.uid())
    or auth.role() = 'authenticated'
  );

grant select on pack_items to anon, authenticated;
grant insert, update, delete on pack_items to authenticated;
