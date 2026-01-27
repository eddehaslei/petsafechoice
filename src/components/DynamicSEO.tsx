import { useEffect } from "react";
import { SafetyResultData } from "./SafetyResult";
import { isLiquidFood } from "@/lib/liquidFoods";

interface DynamicSEOProps {
  result: SafetyResultData | null;
}

export function DynamicSEO({ result }: DynamicSEOProps) {
  useEffect(() => {
    if (result) {
      const petName = result.petType === "dog" ? "Dogs" : "Cats";
      const foodName = result.food.charAt(0).toUpperCase() + result.food.slice(1);
      
      // Determine if food is liquid - use "Drink" instead of "Eat"
      const verb = isLiquidFood(result.food) ? "Drink" : "Eat";
      
      // Dynamic title: "Can Dogs Eat/Drink Chocolate? | PetSafeChoice"
      const newTitle = `Can ${petName} ${verb} ${foodName}? | PetSafeChoice`;
      
      // Social sharing title (OG/Twitter)
      const socialTitle = `Can ${petName} ${verb} ${foodName}? | PetSafeChoice`;
      
      // Dynamic meta description based on safety level
      let description = "";
      const verbLower = verb.toLowerCase();
      switch (result.safetyLevel) {
        case "safe":
          description = `${foodName} is safe for ${petName.toLowerCase()}! Learn about the health benefits, proper serving sizes, and expert tips for feeding ${foodName.toLowerCase()} to your ${result.petType}.`;
          break;
        case "caution":
          description = `${foodName} requires caution when feeding to ${petName.toLowerCase()}. Understand the risks, safe amounts, and what to watch for. Veterinary-reviewed guidance.`;
          break;
        case "dangerous":
          description = `WARNING: ${foodName} is toxic to ${petName.toLowerCase()}! Learn why it's dangerous, symptoms to watch for, and what to do if your ${result.petType} consumed ${foodName.toLowerCase()}.`;
          break;
      }

      // Update document title
      document.title = newTitle;

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Update Open Graph tags - use social-optimized title
      updateMetaTag("og:title", socialTitle);
      updateMetaTag("og:description", description);
      updateMetaTag("og:type", "article");
      updateMetaTag("og:site_name", "PetSafeChoice");

      // Update Twitter tags - use social-optimized title
      updateMetaTag("twitter:title", socialTitle);
      updateMetaTag("twitter:description", description);
      updateMetaTag("twitter:card", "summary_large_image");
    } else {
      // Reset to default when no result
      document.title = "Can My Pet Eat This? | Pet Food Safety Checker";
      updateMetaTag("description", "Science-backed food safety information for dogs and cats. Know what's safe before you share!");
      updateMetaTag("og:title", "Can My Pet Eat This? | Pet Food Safety Checker");
      updateMetaTag("og:description", "Science-backed food safety information for dogs and cats. Know what's safe before you share!");
      updateMetaTag("twitter:title", "Can My Pet Eat This? | Pet Food Safety Checker");
      updateMetaTag("twitter:description", "Science-backed food safety information for dogs and cats. Know what's safe before you share!");
    }
  }, [result]);

  return null; // This component only manages document head, no visual output
}

function updateMetaTag(name: string, content: string) {
  // Check both name and property attributes
  let meta = document.querySelector(`meta[name="${name}"]`) || 
             document.querySelector(`meta[property="${name}"]`);
  
  if (!meta) {
    meta = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      meta.setAttribute("property", name);
    } else {
      meta.setAttribute("name", name);
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}
