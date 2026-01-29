-- Add unique constraint on name + species to enable upsert functionality
-- This enables the self-growing database feature where AI responses are saved

-- First, check for and remove any duplicates (keep the most recent)
DELETE FROM foods a USING foods b
WHERE a.name = b.name 
  AND a.species = b.species 
  AND a.created_at < b.created_at;

-- Add unique constraint for upsert
ALTER TABLE foods ADD CONSTRAINT foods_name_species_unique UNIQUE (name, species);

-- Create permissive INSERT policy for service role operations
-- (Service role already bypasses RLS, but this documents the intent)
COMMENT ON TABLE foods IS 'Food safety database with autonomous growth via AI fallback. Unique constraint on name+species enables upsert operations from edge functions using service role.';