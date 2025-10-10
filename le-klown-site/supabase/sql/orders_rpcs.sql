-- RPC and helper functions for order stock management
-- Apply in Supabase SQL editor or psql: \i supabase/sql/orders_rpcs.sql

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from utilisateurs
    where id = coalesce(uid, auth.uid())
      and lower(role) = 'admin'
  );
$$;

comment on function public.is_admin(uuid)
  is 'Returns true if the given user (or current auth.uid) has the admin role.';

create or replace function public.adjust_order_items_stock(items jsonb, factor integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  variant_id uuid;
  quantity integer;
  updated_id uuid;
begin
  if items is null then
    raise exception 'Items payload is required.' using errcode = 'P0001';
  end if;

  for item in select jsonb_array_elements(coalesce(items, '[]'::jsonb)) loop
    variant_id := (item->>'variant_id')::uuid;
    quantity := coalesce((item->>'quantity')::int, 0);

    if variant_id is null or quantity <= 0 then
      continue;
    end if;

    if factor < 0 then
      update product_variants
        set stock = stock + (factor * quantity),
            updated_at = now()
        where id = variant_id
          and deleted = false
          and is_active = true
          and stock >= quantity
        returning id into updated_id;

      if not found then
        raise exception 'Stock insuffisant pour la variante %', variant_id using errcode = 'P0001';
      end if;
    else
      update product_variants
        set stock = stock + (factor * quantity),
            updated_at = now()
        where id = variant_id
          and deleted = false
        returning id into updated_id;

      if not found then
        raise exception 'Variante % introuvable.', variant_id using errcode = 'P0001';
      end if;
    end if;
  end loop;
end;
$$;

comment on function public.adjust_order_items_stock(jsonb, integer)
  is 'Internal helper: adjusts stock for each variant contained in a JSONB items array. factor = -1 reserves stock, factor = +1 restocks.';

create or replace function public.create_order_with_stock(payload jsonb)
returns commandes
language plpgsql
security definer
set search_path = public
as $$
declare
  items jsonb;
  order_row commandes;
begin
  if payload is null then
    raise exception 'Payload is required.' using errcode = 'P0001';
  end if;

  items := coalesce(payload->'items_snapshot', '[]'::jsonb);
  if jsonb_array_length(items) = 0 then
    raise exception 'Impossible de créer une commande sans articles.' using errcode = 'P0001';
  end if;

  perform public.adjust_order_items_stock(items, -1);

  insert into commandes (
    order_ref,
    user_id,
    customer_email,
    customer_first_name,
    customer_last_name,
    customer_address,
    customer_phone,
    customer_instagram,
    customer_notes,
    subtotal_eur,
    shipping_eur,
    total_eur,
    items_snapshot,
    status,
    status_passed_at,
    status_paid_at,
    status_sent_at,
    status_delivered_at,
    del_flag
  )
  values (
    nullif(payload->>'order_ref', '')::text,
    nullif(payload->>'user_id', '')::uuid,
    payload->>'customer_email',
    payload->>'customer_first_name',
    payload->>'customer_last_name',
    payload->>'customer_address',
    nullif(payload->>'customer_phone', ''),
    nullif(payload->>'customer_instagram', ''),
    payload->>'customer_notes',
    coalesce((payload->>'subtotal_eur')::numeric, 0),
    coalesce((payload->>'shipping_eur')::numeric, 0),
    coalesce((payload->>'total_eur')::numeric, 0),
    items,
    coalesce(payload->>'status', 'passée'),
    coalesce((payload->>'status_passed_at')::timestamptz, now()),
    (payload->>'status_paid_at')::timestamptz,
    (payload->>'status_sent_at')::timestamptz,
    (payload->>'status_delivered_at')::timestamptz,
    coalesce((payload->>'del_flag')::boolean, false)
  )
  returning * into order_row;

  return order_row;
exception
  when others then
    raise;
end;
$$;

comment on function public.create_order_with_stock(jsonb)
  is 'Creates a new order and reserves stock for each variant listed in payload.items_snapshot.';

create or replace function public.advance_order_status(
  order_id uuid,
  current_status text,
  next_status text
)
returns commandes
language plpgsql
security definer
set search_path = public
as $$
declare
  order_row commandes;
  now_ts timestamptz := now();
  sequence constant text[] := array['passée','payée','envoyée','livrée'];
  current_index int;
  next_index int;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Accès refusé.' using errcode = '42501';
  end if;

  select * into order_row
  from commandes
  where id = order_id
  for update;

  if not found then
    raise exception 'Commande % introuvable.', order_id using errcode = 'P0001';
  end if;

  if lower(order_row.status) <> lower(current_status) then
    raise exception 'Statut de commande inattendu (attendu %, trouvé %).', current_status, order_row.status using errcode = 'P0001';
  end if;

  current_index := array_position(sequence, lower(current_status));
  next_index := array_position(sequence, lower(next_status));

  if current_index is null or next_index is null or next_index <> current_index + 1 then
    raise exception 'Transition de statut non autorisée (% -> %).', current_status, next_status using errcode = 'P0001';
  end if;

  update commandes
    set
      status = next_status,
      updated_at = now_ts,
      status_passed_at = coalesce(status_passed_at, now_ts),
      status_paid_at = case
        when lower(next_status) in ('payée','envoyée','livrée') then coalesce(status_paid_at, now_ts)
        else status_paid_at
      end,
      status_sent_at = case
        when lower(next_status) in ('envoyée','livrée') then coalesce(status_sent_at, now_ts)
        else status_sent_at
      end,
      status_delivered_at = case
        when lower(next_status) = 'livrée' then coalesce(status_delivered_at, now_ts)
        else status_delivered_at
      end
  where id = order_id
  returning * into order_row;

  return order_row;
end;
$$;

comment on function public.advance_order_status(uuid, text, text)
  is 'Moves an order to the next status in the sequence (passée -> payée -> envoyée -> livrée).';

create or replace function public.revert_order_status(
  order_id uuid,
  current_status text,
  previous_status text
)
returns commandes
language plpgsql
security definer
set search_path = public
as $$
declare
  order_row commandes;
  now_ts timestamptz := now();
  sequence constant text[] := array['passée','payée','envoyée','livrée'];
  current_index int;
  previous_index int;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Accès refusé.' using errcode = '42501';
  end if;

  select * into order_row
  from commandes
  where id = order_id
  for update;

  if not found then
    raise exception 'Commande % introuvable.', order_id using errcode = 'P0001';
  end if;

  if lower(order_row.status) <> lower(current_status) then
    raise exception 'Statut de commande inattendu (attendu %, trouvé %).', current_status, order_row.status using errcode = 'P0001';
  end if;

  current_index := array_position(sequence, lower(current_status));
  previous_index := array_position(sequence, lower(previous_status));

  if current_index is null or previous_index is null or previous_index <> current_index - 1 then
    raise exception 'Retour de statut non autorisé (% -> %).', current_status, previous_status using errcode = 'P0001';
  end if;

  update commandes
    set
      status = previous_status,
      updated_at = now_ts,
      status_delivered_at = case
        when lower(previous_status) = 'livrée' then status_delivered_at
        else null
      end,
      status_sent_at = case
        when lower(previous_status) in ('envoyée','livrée') then status_sent_at
        else null
      end,
      status_paid_at = case
        when lower(previous_status) in ('payée','envoyée','livrée') then status_paid_at
        else null
      end
  where id = order_id
  returning * into order_row;

  return order_row;
end;
$$;

comment on function public.revert_order_status(uuid, text, text)
  is 'Moves an order back to the previous status and clears downstream timestamps accordingly.';

create or replace function public.mark_order_deleted(
  order_id uuid,
  del_flag boolean
)
returns commandes
language plpgsql
security definer
set search_path = public
as $$
declare
  order_row commandes;
  now_ts timestamptz := now();
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Accès refusé.' using errcode = '42501';
  end if;

  select * into order_row
  from commandes
  where id = order_id
  for update;

  if not found then
    raise exception 'Commande % introuvable.', order_id using errcode = 'P0001';
  end if;

  if order_row.del_flag = del_flag then
    return order_row;
  end if;

  if del_flag is true then
    perform public.adjust_order_items_stock(order_row.items_snapshot, 1);
  else
    perform public.adjust_order_items_stock(order_row.items_snapshot, -1);
  end if;

  update commandes
    set del_flag = del_flag,
        updated_at = now_ts
  where id = order_id
  returning * into order_row;

  return order_row;
end;
$$;

comment on function public.mark_order_deleted(uuid, boolean)
  is 'Soft deletes/restores an order and adjusts variant stock accordingly.';
