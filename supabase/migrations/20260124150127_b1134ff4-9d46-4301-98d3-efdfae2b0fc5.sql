-- Add explicit deny policies for foods table (defense in depth / documentation)
-- Note: These are already blocked by RLS default-deny, but explicit is better

-- Deny all INSERT operations from public users
CREATE POLICY "Foods INSERT denied for public"
ON public.foods FOR INSERT
WITH CHECK (false);

-- Deny all UPDATE operations from public users  
CREATE POLICY "Foods UPDATE denied for public"
ON public.foods FOR UPDATE
USING (false)
WITH CHECK (false);

-- Deny all DELETE operations from public users
CREATE POLICY "Foods DELETE denied for public"
ON public.foods FOR DELETE
USING (false);

-- Same for affiliates table
CREATE POLICY "Affiliates INSERT denied for public"
ON public.affiliates FOR INSERT
WITH CHECK (false);

CREATE POLICY "Affiliates UPDATE denied for public"
ON public.affiliates FOR UPDATE
USING (false)
WITH CHECK (false);

CREATE POLICY "Affiliates DELETE denied for public"
ON public.affiliates FOR DELETE
USING (false);

-- Same for vets table
CREATE POLICY "Vets INSERT denied for public"
ON public.vets FOR INSERT
WITH CHECK (false);

CREATE POLICY "Vets UPDATE denied for public"
ON public.vets FOR UPDATE
USING (false)
WITH CHECK (false);

CREATE POLICY "Vets DELETE denied for public"
ON public.vets FOR DELETE
USING (false);