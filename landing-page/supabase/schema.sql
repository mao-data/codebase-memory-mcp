-- ─── Journi Database Schema ────────────────────────────────────────────────
-- Run this in your Supabase SQL editor: https://app.supabase.com/project/_/sql

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Trips ──────────────────────────────────────────────────────────────────
create table trips (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users(id) on delete cascade not null,
  title         text not null,
  destination   text not null,
  start_date    date,
  end_date      date,
  cover_image   text,
  is_public     boolean default false,
  share_token   text unique default gen_random_uuid()::text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Trip Days ──────────────────────────────────────────────────────────────
create table trip_days (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid references trips(id) on delete cascade not null,
  day_number    integer not null,
  date          date,
  title         text,
  notes         text,
  created_at    timestamptz default now(),
  unique (trip_id, day_number)
);

-- ── Activities ─────────────────────────────────────────────────────────────
create table activities (
  id            uuid primary key default gen_random_uuid(),
  day_id        uuid references trip_days(id) on delete cascade not null,
  trip_id       uuid references trips(id) on delete cascade not null,
  type          text default 'activity'
                  check (type in ('flight','hotel','activity','restaurant','transport')),
  title         text not null,
  description   text,
  start_time    time,
  end_time      time,
  location      text,
  cost          numeric,
  currency      text default 'USD',
  booking_ref   text,
  image_url     text,
  klook_link    text,
  kkday_link    text,
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Collaborators ──────────────────────────────────────────────────────────
create table trip_collaborators (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid references trips(id) on delete cascade not null,
  user_id       uuid references auth.users(id) on delete cascade,
  email         text,
  role          text default 'editor' check (role in ('editor','viewer')),
  accepted_at   timestamptz,
  created_at    timestamptz default now(),
  constraint at_least_one check (user_id is not null or email is not null)
);

-- ── Auto-update updated_at ─────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trips_updated_at
  before update on trips
  for each row execute function update_updated_at();

create trigger activities_updated_at
  before update on activities
  for each row execute function update_updated_at();

-- ── Row Level Security ─────────────────────────────────────────────────────
alter table trips               enable row level security;
alter table trip_days           enable row level security;
alter table activities          enable row level security;
alter table trip_collaborators  enable row level security;

-- Helper: is the current user an owner or collaborator of a trip?
create or replace function is_trip_member(trip_id uuid)
returns boolean as $$
  select exists (
    select 1 from trips where id = trip_id and owner_id = auth.uid()
    union
    select 1 from trip_collaborators
      where trip_collaborators.trip_id = trip_id
        and trip_collaborators.user_id = auth.uid()
        and accepted_at is not null
  );
$$ language sql security definer;

-- Trips: owner full access, collaborators read/write, public read
create policy "owner_all"        on trips for all    using (owner_id = auth.uid());
create policy "collab_select"    on trips for select using (is_trip_member(id));
create policy "collab_update"    on trips for update using (is_trip_member(id));
create policy "public_select"    on trips for select using (is_public = true);

-- Trip days
create policy "days_owner"   on trip_days for all    using (is_trip_member(trip_id));
create policy "days_public"  on trip_days for select
  using (exists (select 1 from trips where id = trip_id and is_public = true));

-- Activities
create policy "act_member"   on activities for all    using (is_trip_member(trip_id));
create policy "act_public"   on activities for select
  using (exists (select 1 from trips where id = trip_id and is_public = true));

-- Collaborators
create policy "collab_owner"  on trip_collaborators for all
  using (exists (select 1 from trips where id = trip_id and owner_id = auth.uid()));
create policy "collab_self"   on trip_collaborators for select
  using (user_id = auth.uid());

-- ── Indexes ────────────────────────────────────────────────────────────────
create index on trips (owner_id);
create index on trips (share_token);
create index on trip_days (trip_id, day_number);
create index on activities (day_id, sort_order);
create index on trip_collaborators (trip_id);
create index on trip_collaborators (user_id);
