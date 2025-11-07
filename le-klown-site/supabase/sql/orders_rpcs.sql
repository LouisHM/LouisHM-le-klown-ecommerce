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

create or replace function public.validate_product_stock(
  target_stock_id uuid,
  target_product_id uuid,
  target_size text,
  target_color text,
  qty integer
)
returns table(stock_id uuid, product_id_out uuid, size_out text, color_out text)
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_stock_id uuid := target_stock_id;
  resolved_product_id uuid := target_product_id;
  size_value text := nullif(trim(target_size), '');
  color_value text := nullif(trim(target_color), '');
  size_row text;
  color_row text;
  available integer;
  required_qty integer := greatest(0, coalesce(qty, 0));
begin
  if resolved_stock_id is not null then
    select product_id, stock, size, color
      into resolved_product_id, available, size_row, color_row
    from product_stocks
    where id = resolved_stock_id;
  end if;

  if resolved_stock_id is null and resolved_product_id is not null then
    select id, stock, size, color
      into resolved_stock_id, available, size_row, color_row
    from product_stocks
    where product_id = resolved_product_id
      and lower(coalesce(size, '')) = lower(coalesce(size_value, ''))
      and lower(coalesce(color, '')) = lower(coalesce(color_value, ''))
    limit 1;
  end if;

  if resolved_product_id is null then
    resolved_product_id := target_product_id;
  end if;

  if resolved_stock_id is null and available is null and resolved_product_id is not null then
    select stock into available from products where id = resolved_product_id;
  end if;

  if required_qty > 0 then
    if resolved_product_id is null then
      raise exception using errcode = 'P0001', message = 'STOCK_UNAVAILABLE', detail = 'product_missing';
    end if;

    available := coalesce(available, 0);
    if available < required_qty then
      raise exception using errcode = 'P0001', message = 'STOCK_UNAVAILABLE', detail = format('product=%s,size=%s,color=%s', resolved_product_id, coalesce(size_row, size_value, ''), coalesce(color_row, color_value, ''));
    end if;
  end if;

  stock_id := resolved_stock_id;
  product_id_out := resolved_product_id;
  size_out := coalesce(size_row, size_value);
  color_out := coalesce(color_row, color_value);
  return;
end;
$$;

comment on function public.validate_product_stock(uuid, uuid, text, text, integer)
  is 'Checks availability for a product stock row/combination. Raises STOCK_UNAVAILABLE on failure.';

create or replace function public.adjust_product_stock(
  target_stock_id uuid,
  target_product_id uuid,
  target_size text,
  target_color text,
  qty integer,
  factor integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_stock_id uuid := target_stock_id;
  resolved_product_id uuid := target_product_id;
  size_value text := nullif(trim(target_size), '');
  color_value text := nullif(trim(target_color), '');
  normalized_size text := lower(coalesce(size_value, ''));
  normalized_color text := lower(coalesce(color_value, ''));
  adjust_qty integer := greatest(0, coalesce(qty, 0));
  delta integer := factor * adjust_qty;
  validation record;
begin
  if adjust_qty = 0 or factor = 0 then
    return;
  end if;

  select *
    into validation
  from public.validate_product_stock(
    resolved_stock_id,
    resolved_product_id,
    target_size,
    target_color,
    case when factor < 0 then adjust_qty else 0 end
  );

  resolved_stock_id := validation.stock_id;
  resolved_product_id := coalesce(validation.product_id_out, resolved_product_id);
  size_value := coalesce(validation.size_out, size_value);
  color_value := coalesce(validation.color_out, color_value);

  if resolved_product_id is not null then
    perform 1
    from products
    where id = resolved_product_id;

    if not found then
      if factor > 0 then
        -- Product no longer exists; skip silent restock.
        return;
      else
        raise exception using errcode = 'P0001', message = 'STOCK_UNAVAILABLE', detail = 'product_missing';
      end if;
    end if;
  end if;

  if resolved_stock_id is null then
    if resolved_product_id is null then
      if factor > 0 then
        -- Nothing to restock for legacy snapshots lacking identifiers.
        return;
      end if;
      raise exception using errcode = 'P0001', message = 'STOCK_UNAVAILABLE', detail = 'product_missing';
    end if;

    begin
      insert into product_stocks (product_id, size, color, stock)
      values (
        resolved_product_id,
        size_value,
        color_value,
        case when factor < 0 then adjust_qty else 0 end
      )
      returning id into resolved_stock_id;
    exception
      when unique_violation then
        select id
          into resolved_stock_id
        from product_stocks
        where product_id = resolved_product_id
          and lower(coalesce(size, '')) = lower(coalesce(size_value, ''))
          and lower(coalesce(color, '')) = lower(coalesce(color_value, ''))
        limit 1;
        if resolved_stock_id is null then
          raise;
        end if;
    end;
  end if;

  update product_stocks
    set stock = stock + delta,
        updated_at = now()
    where id = resolved_stock_id
      and (factor >= 0 or stock >= adjust_qty)
    returning product_id into resolved_product_id;

  if not found then
    if factor < 0 then
      raise exception using errcode = 'P0001', message = 'STOCK_UNAVAILABLE', detail = format('product=%s,size=%s,color=%s', resolved_product_id, coalesce(size_value, ''), coalesce(color_value, ''));
    else
      raise exception using errcode = 'P0001', message = 'STOCK_UNAVAILABLE', detail = format('product=%s,size=%s,color=%s', resolved_product_id, coalesce(size_value, ''), coalesce(color_value, ''));
    end if;
  end if;

update products
  set stock = greatest(0, coalesce(stock, 0) + delta),
      updated_at = now()
  where id = resolved_product_id;
end;
$$;

comment on function public.adjust_product_stock(uuid, uuid, text, text, integer, integer)
  is 'Adjusts a product_stocks row (and parent products.stock) by quantity × factor.';

create or replace function public.validate_order_items_stock(items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  pack_item jsonb;
  quantity integer;
  pack_quantity integer;
  item_type text;
  uuid_pattern constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  stock_text text;
  product_text text;
  size_text text;
  color_text text;
  stock_uuid uuid;
  product_uuid uuid;
  pack_stock_text text;
  pack_product_text text;
  pack_size_text text;
  pack_color_text text;
  pack_stock_uuid uuid;
  pack_product_uuid uuid;
begin
  if items is null then
    raise exception 'Items payload is required.' using errcode = 'P0001';
  end if;

  for item in select jsonb_array_elements(coalesce(items, '[]'::jsonb)) loop
    quantity := greatest(0, coalesce((item->>'quantity')::int, 0));
    if quantity <= 0 then
      continue;
    end if;

    item_type := lower(coalesce(item->>'type', 'product'));

    if item_type = 'pack' then
      for pack_item in select jsonb_array_elements(coalesce(item->'pack_items', '[]'::jsonb)) loop
        pack_quantity := greatest(0, coalesce((pack_item->>'quantity')::int, 0)) * quantity;

        pack_stock_text := coalesce(
          nullif(pack_item->>'product_stock_id', ''),
          nullif(pack_item->>'productStockId', ''),
          nullif(pack_item->>'stock_id', ''),
          nullif(pack_item->>'stockId', '')
        );
        if pack_stock_text ~* uuid_pattern then
          pack_stock_uuid := pack_stock_text::uuid;
        else
          pack_stock_uuid := null;
        end if;

        pack_product_text := coalesce(
          nullif(pack_item->>'product_id', ''),
          nullif(pack_item->>'productId', '')
        );
        if pack_product_text ~* uuid_pattern then
          pack_product_uuid := pack_product_text::uuid;
        else
          pack_product_uuid := null;
        end if;

        pack_size_text := coalesce(
          nullif(trim(coalesce(pack_item->>'size', '')), ''),
          (
            select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
            from jsonb_array_elements(coalesce(pack_item->'options', '[]'::jsonb)) opt
            where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('size', 'taille')
            limit 1
          )
        );

        pack_color_text := coalesce(
          nullif(trim(coalesce(pack_item->>'color', '')), ''),
          (
            select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
            from jsonb_array_elements(coalesce(pack_item->'options', '[]'::jsonb)) opt
            where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('color', 'colour', 'couleur')
            limit 1
          )
        );

        perform public.validate_product_stock(
          pack_stock_uuid,
          pack_product_uuid,
          pack_size_text,
          pack_color_text,
          pack_quantity
        );
      end loop;
    else
      stock_text := coalesce(
        nullif(item->>'product_stock_id', ''),
        nullif(item->>'productStockId', ''),
        nullif(item->>'stock_id', ''),
        nullif(item->>'stockId', '')
      );
      if stock_text ~* uuid_pattern then
        stock_uuid := stock_text::uuid;
      else
        stock_uuid := null;
      end if;

      product_text := coalesce(
        nullif(item->>'product_id', ''),
        nullif(item->>'productId', '')
      );
      if product_text ~* uuid_pattern then
        product_uuid := product_text::uuid;
      else
        product_uuid := null;
      end if;

      size_text := coalesce(
        nullif(trim(coalesce(item->>'size', '')), ''),
        (
          select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
          from jsonb_array_elements(coalesce(item->'options', '[]'::jsonb)) opt
          where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('size', 'taille')
          limit 1
        )
      );

      color_text := coalesce(
        nullif(trim(coalesce(item->>'color', '')), ''),
        (
          select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
          from jsonb_array_elements(coalesce(item->'options', '[]'::jsonb)) opt
          where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('color', 'colour', 'couleur')
          limit 1
        )
      );

      perform public.validate_product_stock(
        stock_uuid,
        product_uuid,
        size_text,
        color_text,
        quantity
      );
    end if;
  end loop;
end;
$$;

comment on function public.validate_order_items_stock(jsonb)
  is 'Validates availability for each item contained in a JSONB array.';

create or replace function public.adjust_order_items_stock(items jsonb, factor integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  pack_item jsonb;
  quantity integer;
  pack_quantity integer;
  item_type text;
  uuid_pattern constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  stock_text text;
  product_text text;
  size_text text;
  color_text text;
  stock_uuid uuid;
  product_uuid uuid;
  pack_stock_text text;
  pack_product_text text;
  pack_size_text text;
  pack_color_text text;
  pack_stock_uuid uuid;
  pack_product_uuid uuid;
begin
  if items is null then
    raise exception 'Items payload is required.' using errcode = 'P0001';
  end if;

  for item in select jsonb_array_elements(coalesce(items, '[]'::jsonb)) loop
    quantity := greatest(0, coalesce((item->>'quantity')::int, 0));
    if quantity <= 0 then
      continue;
    end if;

    item_type := lower(coalesce(item->>'type', 'product'));

    if item_type = 'pack' then
      for pack_item in select jsonb_array_elements(coalesce(item->'pack_items', '[]'::jsonb)) loop
        pack_quantity := greatest(0, coalesce((pack_item->>'quantity')::int, 0)) * quantity;

        pack_stock_text := coalesce(
          nullif(pack_item->>'product_stock_id', ''),
          nullif(pack_item->>'productStockId', ''),
          nullif(pack_item->>'stock_id', ''),
          nullif(pack_item->>'stockId', '')
        );
        if pack_stock_text ~* uuid_pattern then
          pack_stock_uuid := pack_stock_text::uuid;
        else
          pack_stock_uuid := null;
        end if;

        pack_product_text := coalesce(
          nullif(pack_item->>'product_id', ''),
          nullif(pack_item->>'productId', '')
        );
        if pack_product_text ~* uuid_pattern then
          pack_product_uuid := pack_product_text::uuid;
        else
          pack_product_uuid := null;
        end if;

        pack_size_text := coalesce(
          nullif(trim(coalesce(pack_item->>'size', '')), ''),
          (
            select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
            from jsonb_array_elements(coalesce(pack_item->'options', '[]'::jsonb)) opt
            where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('size', 'taille')
            limit 1
          )
        );

        pack_color_text := coalesce(
          nullif(trim(coalesce(pack_item->>'color', '')), ''),
          (
            select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
            from jsonb_array_elements(coalesce(pack_item->'options', '[]'::jsonb)) opt
            where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('color', 'colour', 'couleur')
            limit 1
          )
        );

        perform public.adjust_product_stock(
          pack_stock_uuid,
          pack_product_uuid,
          pack_size_text,
          pack_color_text,
          pack_quantity,
          factor
        );
      end loop;
    else
      stock_text := coalesce(
        nullif(item->>'product_stock_id', ''),
        nullif(item->>'productStockId', ''),
        nullif(item->>'stock_id', ''),
        nullif(item->>'stockId', '')
      );
      if stock_text ~* uuid_pattern then
        stock_uuid := stock_text::uuid;
      else
        stock_uuid := null;
      end if;

      product_text := coalesce(
        nullif(item->>'product_id', ''),
        nullif(item->>'productId', '')
      );
      if product_text ~* uuid_pattern then
        product_uuid := product_text::uuid;
      else
        product_uuid := null;
      end if;

      size_text := coalesce(
        nullif(trim(coalesce(item->>'size', '')), ''),
        (
          select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
          from jsonb_array_elements(coalesce(item->'options', '[]'::jsonb)) opt
          where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('size', 'taille')
          limit 1
        )
      );

      color_text := coalesce(
        nullif(trim(coalesce(item->>'color', '')), ''),
        (
          select nullif(trim(coalesce(opt->>'valueLabel', opt->>'value', opt->>'label')), '')
          from jsonb_array_elements(coalesce(item->'options', '[]'::jsonb)) opt
          where lower(coalesce(opt->>'optionLabel', opt->>'label', opt->>'name', opt->>'optionId', opt->>'id')) in ('color', 'colour', 'couleur')
          limit 1
        )
      );

      perform public.adjust_product_stock(
        stock_uuid,
        product_uuid,
        size_text,
        color_text,
        quantity,
        factor
      );
    end if;
  end loop;
end;
$$;

comment on function public.adjust_order_items_stock(jsonb, integer)
  is 'Internal helper: adjusts stock for each product stock row contained in a JSONB items array. factor = -1 reserves stock, factor = +1 restocks.';

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

  perform public.validate_order_items_stock(items);
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
  target_del_flag boolean := del_flag;
  items_payload jsonb;
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

  items_payload := coalesce(order_row.items_snapshot, '[]'::jsonb);

  if target_del_flag is true then
    perform public.adjust_order_items_stock(items_payload, 1);
  else
    perform public.adjust_order_items_stock(items_payload, -1);
  end if;

  update commandes
    set del_flag = target_del_flag,
        updated_at = now_ts
  where id = order_id
  returning * into order_row;

  return order_row;
end;
$$;

comment on function public.mark_order_deleted(uuid, boolean)
  is 'Soft deletes/restores an order and adjusts variant stock accordingly.';
