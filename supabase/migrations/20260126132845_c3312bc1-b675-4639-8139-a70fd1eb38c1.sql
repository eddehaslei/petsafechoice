-- Enable public INSERT on search_logs for frontend analytics
DROP POLICY IF EXISTS "Search logs INSERT denied for anon" ON public.search_logs;

CREATE POLICY "Search logs public INSERT allowed" 
ON public.search_logs 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);