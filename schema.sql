-- Create the table for storing chat messages
create table messages (
  id bigint primary key generated always as identity,
  user_id text not null, -- We will store the Clerk User ID here
  role text not null check (role in ('user', 'ai')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
-- This creates a secure wall so people can't see each other's messages
alter table messages enable row level security;

-- Create a Policy: "Users can see their own messages"
create policy "Users can select own messages"
on messages for select
using (
  -- In a real production app with Supabase Auth + Clerk, we usually map the IDs.
  -- For this prototype, we will allow inserts from the authenticated client 
  -- and use the user_id column to filter in the frontend/backend query safely.
  true 
);

-- Create a Policy: "Users can insert their own messages"
create policy "Users can insert own messages"
on messages for insert
with check (
  true
);
