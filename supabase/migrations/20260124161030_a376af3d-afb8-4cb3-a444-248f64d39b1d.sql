-- Phase 6: Add country_code column for geo-targeted affiliate links
-- ISO 3166-1 alpha-2 codes: ES (Spain), US (United States), UK (United Kingdom), etc.

ALTER TABLE public.affiliates 
ADD COLUMN country_code TEXT DEFAULT 'US';

-- Add index for efficient country-based lookups
CREATE INDEX idx_affiliates_country ON public.affiliates(country_code);

-- Add comment for documentation
COMMENT ON COLUMN public.affiliates.country_code IS 'ISO 3166-1 alpha-2 country code for geo-targeted affiliate links';