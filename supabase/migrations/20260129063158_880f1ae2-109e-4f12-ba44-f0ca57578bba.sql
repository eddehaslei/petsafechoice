-- Create newsletter_subs table for email signups
CREATE TABLE public.newsletter_subs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE public.newsletter_subs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for anonymous signups)
CREATE POLICY "Allow public newsletter signups"
ON public.newsletter_subs
FOR INSERT
TO public
WITH CHECK (true);

-- Add comment
COMMENT ON TABLE newsletter_subs IS 'Newsletter subscriptions for weekly pet safety tips emails';