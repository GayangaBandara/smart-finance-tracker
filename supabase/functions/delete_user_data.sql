-- delete_user_data.sql
-- Run this in the Supabase SQL editor (https://app.supabase.com/project/<your-project>/sql)
-- This provides a secure RPC function the client can call to delete *only* the current user's data.
-- It also adds a trigger that will clean up data when an auth user is deleted (admin action).

-- Function: delete_user_data()
create or replace function public.delete_user_data()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete rows belonging to the currently authenticated user
  delete from public.transactions where uid = auth.uid();
  delete from public.budgets where uid = auth.uid();
  delete from public.expenses where uid = auth.uid();
end;
$$;

-- Function: handle_auth_user_delete()
-- If an auth.user row is deleted (admin/server action), cleanup related rows
create or replace function public.handle_auth_user_delete()
returns trigger
language plpgsql
security definer
as $$
begin
  delete from public.transactions where uid = old.id;
  delete from public.budgets where uid = old.id;
  delete from public.expenses where uid = old.id;
  return old;
end;
$$;

-- Trigger: auth_user_delete
-- Attach the trigger to the auth.users table to run on delete
-- Note: creating triggers on auth schema requires proper privileges (run this in the SQL editor as a project owner)

-- Drop existing trigger if present
drop trigger if exists auth_user_delete on auth.users;

create trigger auth_user_delete
after delete on auth.users
for each row
execute procedure public.handle_auth_user_delete();

-- Notes:
-- 1) The RPC function `delete_user_data()` is SECURITY DEFINER, but uses auth.uid() to ensure callers can only delete their own rows.
-- 2) To fully remove a user's authentication record (auth.users row), an admin action is required. This SQL adds a trigger to delete related rows when the auth.user is removed by an admin.
-- 3) Apply this file by pasting it into the Supabase SQL editor and running it as a project owner.
