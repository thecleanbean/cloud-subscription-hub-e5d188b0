
-- Create a custom type for subscription status
create type subscription_status as enum ('active', 'cancelled', 'pending');

-- Create a table to store user profiles and CleanCloud links
create table profiles (
  id uuid references auth.users on delete cascade,
  email text unique,
  cleancloud_customer_id text unique,
  subscription_status subscription_status default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id );

create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- Create function to handle new user signup
create function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
