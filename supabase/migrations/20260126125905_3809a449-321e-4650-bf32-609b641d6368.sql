-- Drop the permissive INSERT policy and recreate with proper syntax
DROP POLICY IF EXISTS "Search logs INSERT via edge functions only" ON public.search_logs;

-- Recreate as a non-permissive policy (default behavior for anon)
-- Service role bypasses RLS, so inserts via edge functions will work
CREATE POLICY "Search logs INSERT denied for anon" 
ON public.search_logs 
FOR INSERT 
TO anon
WITH CHECK (false);