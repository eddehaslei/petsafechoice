-- Create search_logs table for analytics
CREATE TABLE public.search_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat')),
  language TEXT DEFAULT 'en',
  country_code TEXT,
  result_safety_level TEXT,
  source TEXT DEFAULT 'search',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from edge functions (service role)
-- We use a restrictive policy that only allows edge functions to insert
CREATE POLICY "Search logs INSERT via edge functions only" 
ON public.search_logs 
FOR INSERT 
WITH CHECK (true);

-- Deny direct public SELECT to protect user data
CREATE POLICY "Search logs deny direct public SELECT" 
ON public.search_logs 
FOR SELECT 
USING (false);

-- Deny public UPDATE
CREATE POLICY "Search logs deny public UPDATE" 
ON public.search_logs 
FOR UPDATE 
USING (false);

-- Deny public DELETE  
CREATE POLICY "Search logs deny public DELETE" 
ON public.search_logs 
FOR DELETE 
USING (false);

-- Add index for analytics queries
CREATE INDEX idx_search_logs_created_at ON public.search_logs (created_at DESC);
CREATE INDEX idx_search_logs_query ON public.search_logs (query);
CREATE INDEX idx_search_logs_species ON public.search_logs (species);