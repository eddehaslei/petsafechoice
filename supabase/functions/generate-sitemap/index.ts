import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://petsafechoice.lovable.app";
const LANGUAGES = ["en", "es", "fr", "de", "ar"];

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/faq", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/emergency", priority: "0.8", changefreq: "monthly" },
  { path: "/safe-foods", priority: "0.8", changefreq: "weekly" },
  { path: "/foods", priority: "0.8", changefreq: "weekly" },
  { path: "/foods/chocolate", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/grapes", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/chicken", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/avocado", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/peanut-butter", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/bananas", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/onions", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/strawberries", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/milk", priority: "0.9", changefreq: "monthly" },
  { path: "/foods/watermelon", priority: "0.9", changefreq: "monthly" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slugify(name: string): string {
  return encodeURIComponent(name.toLowerCase().trim().replace(/\s+/g, "-"));
}

serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all unique food names from the database
    const { data: foods, error } = await supabase
      .from("foods")
      .select("name, updated_at")
      .order("name");

    if (error) {
      console.error("DB error:", error);
    }

    // Deduplicate food names (same food may exist for dog + cat)
    const uniqueFoods = new Map<string, string>();
    for (const food of foods || []) {
      const key = food.name.toLowerCase().trim();
      if (!uniqueFoods.has(key) || food.updated_at > uniqueFoods.get(key)!) {
        uniqueFoods.set(key, food.updated_at);
      }
    }

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Static pages with hreflang alternates
    for (const page of STATIC_PAGES) {
      xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
      for (const lang of LANGUAGES) {
        xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}${page.path === "/" ? "" : page.path}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.path}" />\n`;
      xml += `  </url>\n`;
    }

    // Dynamic food pages with hreflang alternates per language
    for (const [foodName, updatedAt] of uniqueFoods) {
      const slug = slugify(foodName);
      const lastmod = updatedAt ? updatedAt.split("T")[0] : today;

      for (const lang of LANGUAGES) {
        xml += `  <url>
    <loc>${SITE_URL}/${lang}/food/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
        // Add hreflang alternates pointing to all other languages
        for (const altLang of LANGUAGES) {
          xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${SITE_URL}/${altLang}/food/${slug}" />\n`;
        }
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/food/${slug}" />\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response("Error generating sitemap", { status: 500 });
  }
});
