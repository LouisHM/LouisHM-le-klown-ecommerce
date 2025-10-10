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

alter table if exists product_option_groups enable row level security;
alter table if exists product_option_groups force row level security;

alter table if exists product_option_values enable row level security;
alter table if exists product_option_values force row level security;

alter table if exists product_variants enable row level security;
alter table if exists product_variants force row level security;

-- Products policies
drop policy if exists "products_public_select" on products;
create policy "products_public_select" on products
  for select
  using (deleted = false);

drop policy if exists "products_admin_all" on products;
create policy "products_admin_all" on products
  for all
  using (public.is_admin(auth.uid()))
  with check (true);

grant select on products to anon, authenticated;

-- Option groups (admin only)
drop policy if exists "pog_admin_all" on product_option_groups;
create policy "pog_admin_all" on product_option_groups
  for all
  using (public.is_admin(auth.uid()))
  with check (true);

grant select on product_option_groups to authenticated;

-- Option values (admin only)
drop policy if exists "pov_admin_all" on product_option_values;
create policy "pov_admin_all" on product_option_values
  for all
  using (public.is_admin(auth.uid()))
  with check (true);

grant select on product_option_values to authenticated;

-- Product variants (public read through view, admin mutate)
drop policy if exists "variants_public_select" on product_variants;
create policy "variants_public_select" on product_variants
  for select
  using (deleted = false and is_active = true);

drop policy if exists "variants_admin_all" on product_variants;
create policy "variants_admin_all" on product_variants
  for all
  using (public.is_admin(auth.uid()))
  with check (true);

grant select on product_variants to anon, authenticated;
