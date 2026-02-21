
CREATE TABLE public.ui_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT NOT NULL UNIQUE,
  language_name TEXT NOT NULL,
  translations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;

-- Public read access (translations are public content)
CREATE POLICY "UI translations are publicly readable"
ON public.ui_translations
FOR SELECT
USING (true);

-- Only service role can insert/update (via edge function)
-- No insert/update/delete policies for anon users
