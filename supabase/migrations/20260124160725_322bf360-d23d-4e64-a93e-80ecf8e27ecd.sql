-- Phase 5: Anti-Scraping Security
-- Remove the permissive SELECT policies and replace with restrictive ones
-- Edge functions use service role which bypasses RLS, so data still works

-- Drop existing permissive SELECT policies
DROP POLICY IF EXISTS "Affiliates are publicly readable" ON public.affiliates;
DROP POLICY IF EXISTS "Vets are publicly readable" ON public.vets;

-- Create restrictive SELECT policies that deny direct client access
-- Edge functions with service_role key bypass RLS entirely
CREATE POLICY "Affiliates deny direct public SELECT"
ON public.affiliates
FOR SELECT
USING (false);

CREATE POLICY "Vets deny direct public SELECT"
ON public.vets
FOR SELECT
USING (false);

-- Note: foods table remains publicly readable as it's the core app feature
-- and already has rate limiting in the check-food-safety edge function