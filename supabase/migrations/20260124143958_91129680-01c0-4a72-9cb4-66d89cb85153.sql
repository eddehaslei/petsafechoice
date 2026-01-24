-- Create enum for safety ratings
CREATE TYPE public.safety_rating AS ENUM ('safe', 'caution', 'toxic');

-- Create foods table
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'both')),
  safety_rating safety_rating NOT NULL DEFAULT 'caution',
  short_answer TEXT NOT NULL,
  long_desc TEXT,
  benefits TEXT[],
  risks TEXT[],
  serving_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster searches
CREATE INDEX idx_foods_name ON public.foods USING gin(to_tsvector('english', name));
CREATE INDEX idx_foods_species ON public.foods(species);
CREATE INDEX idx_foods_safety ON public.foods(safety_rating);

-- Enable RLS (public read, admin write)
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- Everyone can read foods (public information)
CREATE POLICY "Foods are publicly readable"
ON public.foods
FOR SELECT
USING (true);

-- Create vets table for emergency vet locations
CREATE TABLE public.vets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  website_url TEXT,
  lat DECIMAL(10, 8),
  lon DECIMAL(11, 8),
  rating DECIMAL(2, 1),
  is_24h BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_vets_city ON public.vets(city);
CREATE INDEX idx_vets_country ON public.vets(country);

ALTER TABLE public.vets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vets are publicly readable"
ON public.vets
FOR SELECT
USING (true);

-- Create affiliates table for product recommendations
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  food_category_link TEXT,
  affiliate_url TEXT NOT NULL,
  price_point TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates are publicly readable"
ON public.affiliates
FOR SELECT
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply trigger to foods table
CREATE TRIGGER update_foods_updated_at
BEFORE UPDATE ON public.foods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();