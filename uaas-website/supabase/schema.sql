create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz
    default now(),

  ref text
    unique
    not null,

  name text
    not null,

  company text,

  phone text
    not null,

  email text,

  type text,

  brand text,

  model text,

  details text,

  status text
    default 'Received',

  result text
    default ''
);


/* =========================================================
   ROW LEVEL SECURITY
========================================================= */

alter table public.enquiries
enable row level security;


/* =========================================================
   CUSTOMER CAN SUBMIT
========================================================= */

drop policy if exists "public can submit"
on public.enquiries;

create policy "public can submit"
on public.enquiries
for insert
to anon
with check (
  status = 'Received'
);


/* =========================================================
   AUTHENTICATED ENGINEERING TEAM CAN READ
========================================================= */

drop policy if exists "team reads"
on public.enquiries;

create policy "team reads"
on public.enquiries
for select
to authenticated
using (true);


/* =========================================================
   AUTHENTICATED ENGINEERING TEAM CAN UPDATE
========================================================= */

drop policy if exists "team updates"
on public.enquiries;

create policy "team updates"
on public.enquiries
for update
to authenticated
using (true)
with check (true);


/* =========================================================
   CUSTOMER TRACKING FUNCTION
========================================================= */

create or replace function public.track_enquiry(
  p_ref text,
  p_phone text
)
returns setof public.enquiries

language sql

security definer

set search_path = public

as $$

  select *
  from public.enquiries

  where ref = p_ref

    and right(
      regexp_replace(
        phone,
        '\D',
        '',
        'g'
      ),
      10
    )

    =

    right(
      regexp_replace(
        p_phone,
        '\D',
        '',
        'g'
      ),
      10
    );

$$;


/* =========================================================
   ALLOW ANONYMOUS TRACKING
========================================================= */

grant execute
on function public.track_enquiry(text, text)
to anon;


/* =========================================================
   REALTIME
========================================================= */

do $$

begin

  alter publication supabase_realtime
  add table public.enquiries;

exception
  when duplicate_object then
    null;

end $$;