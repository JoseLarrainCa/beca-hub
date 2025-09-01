-- Schemas for Supabase (PostgreSQL)
-- Nota: Estos esquemas están pensados para demo. Ajusta tipos y políticas según tus necesidades.

-- wallets
create table if not exists public.wallets (
  id text primary key,
  name text not null,
  email text,
  balance numeric not null default 0,
  status text not null check (status in ('active','suspended','expired')),
  "validFrom" timestamptz,
  "validUntil" timestamptz,
  "lastTransaction" timestamptz,
  "limitPerPurchase" numeric
);

-- transactions
create table if not exists public.transactions (
  id text primary key,
  "studentId" text not null references public.wallets(id) on update cascade on delete cascade,
  date timestamptz not null,
  type text not null check (type in ('purchase','adjustment','refund')),
  description text,
  amount numeric not null,
  "balanceAfter" numeric,
  vendor text,
  "orderId" text,
  reason text
);

-- batches
create table if not exists public.batches (
  id integer primary key,
  name text not null,
  status text not null check (status in ('pending','approved','rejected')),
  "uploadDate" timestamptz,
  "studentsCount" integer not null default 0,
  "totalAmount" numeric not null default 0,
  "approvedBy" text,
  "processedDate" timestamptz
);

-- students
create table if not exists public.students (
  id text primary key,
  rut text,
  name text not null,
  email text,
  password text,
  career text,
  campus text
);

-- vendors
create table if not exists public.vendors (
  id text primary key,
  name text not null,
  description text,
  category text,
  "contactEmail" text not null,
  "contactPhone" text,
  address text not null,
  "openHours" text,
  image text,
  status text not null check (status in ('active','inactive')) default 'active',
  rating numeric default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- orders
create table if not exists public.orders (
  id text primary key,
  "studentId" text not null references public.wallets(id) on update cascade on delete cascade,
  "vendorName" text,
  items jsonb,
  "totalAmount" numeric not null default 0,
  status text not null check (status in ('confirmed','preparing','ready','collected','cancelled')),
  "estimatedTime" integer,
  "orderDate" timestamptz not null,
  "readyDate" timestamptz,
  "collectedDate" timestamptz,
  notes text
);

-- Índices útiles
create index if not exists idx_transactions_student_date on public.transactions("studentId", date desc);
create index if not exists idx_orders_student_date on public.orders("studentId", "orderDate" desc);
create index if not exists idx_vendors_status on public.vendors(status);
create index if not exists idx_vendors_category on public.vendors(category);

-- RLS (para demo público puedes habilitar políticas abiertas; en producción, restringir)
-- alter table public.wallets enable row level security;
-- alter table public.transactions enable row level security;
-- alter table public.batches enable row level security;
-- alter table public.students enable row level security;
-- alter table public.vendors enable row level security;
-- alter table public.orders enable row level security;

-- -- DEMO (permitir lectura a todos)
-- create policy "read_all_wallets" on public.wallets for select using (true);
-- create policy "read_all_transactions" on public.transactions for select using (true);
-- create policy "read_all_batches" on public.batches for select using (true);
-- create policy "read_all_students" on public.students for select using (true);
-- create policy "read_all_vendors" on public.vendors for select using (true);
-- create policy "read_all_orders" on public.orders for select using (true);


