
-- Create food_requests table for "Request a Food" feature
CREATE TABLE public.food_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  food_name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'dog',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.food_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anonymous users can request foods)
CREATE POLICY "Anyone can request a food"
  ON public.food_requests FOR INSERT
  WITH CHECK (true);

-- Deny public reads (admin only)
CREATE POLICY "Food requests deny public SELECT"
  ON public.food_requests FOR SELECT
  USING (false);

-- Deny public updates/deletes
CREATE POLICY "Food requests deny public UPDATE"
  ON public.food_requests FOR UPDATE
  USING (false);

CREATE POLICY "Food requests deny public DELETE"
  ON public.food_requests FOR DELETE
  USING (false);

-- Add language column to newsletter_subs
ALTER TABLE public.newsletter_subs
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
