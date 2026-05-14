-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor → New Query)

create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  number int not null,
  position text not null,
  age int not null,
  games int not null default 0,
  goals int not null default 0,
  status text not null default 'fit',
  injury text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security but allow all operations for now (public app)
alter table players enable row level security;

create policy "Allow all operations" on players
  for all
  using (true)
  with check (true);

-- Seed with demo data
insert into players (name, number, position, age, games, goals, status, injury) values
  ('Marco Weber', 1, 'TW', 31, 18, 0, 'fit', null),
  ('Andreas Klein', 12, 'TW', 22, 0, 0, 'fit', null),
  ('Tobias Krüger', 4, 'IV', 28, 17, 2, 'fit', null),
  ('David Schmidt', 5, 'IV', 26, 18, 3, 'fit', null),
  ('Lukas Bauer', 3, 'LV', 24, 16, 1, 'fit', null),
  ('Jonas Hoffmann', 2, 'RV', 25, 18, 0, 'fit', null),
  ('Patrick Wagner', 14, 'IV', 30, 9, 0, 'verletzt', 'Muskelfaserriss · 2 Wochen'),
  ('Marvin Lange', 21, 'RV', 20, 7, 0, 'fit', null),
  ('Felix Richter', 6, 'ZDM', 27, 18, 1, 'fit', null),
  ('Tim Schulz', 8, 'ZM', 25, 17, 4, 'fit', null),
  ('Niklas Braun', 10, 'ZOM', 23, 16, 6, 'fit', null),
  ('Jan Fischer', 7, 'LM', 22, 15, 3, 'fit', null),
  ('Leon Müller', 11, 'RM', 24, 14, 2, 'fit', null),
  ('Kevin Wolf', 16, 'ZM', 21, 8, 0, 'fit', null),
  ('Marcel Koch', 9, 'ST', 28, 18, 12, 'fit', null),
  ('Sven Peters', 17, 'ST', 26, 16, 7, 'fit', null),
  ('Dennis Maier', 18, 'LA', 23, 13, 4, 'verletzt', 'Bänderriss · 4 Wochen'),
  ('Florian Beck', 20, 'RA', 19, 5, 1, 'fit', null);
