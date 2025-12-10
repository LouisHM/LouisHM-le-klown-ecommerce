-- 2025-02-18 Add explicit sort order for products

alter table public.products
  add column if not exists sort_order integer not null default 0;

update public.products
set sort_order = coalesce(sort_order, 0)
where sort_order is null;

create index if not exists products_sort_order_idx
  on public.products (sort_order, created_at);

-- Refresh public view to expose the new column
drop view if exists public.products_public;

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
