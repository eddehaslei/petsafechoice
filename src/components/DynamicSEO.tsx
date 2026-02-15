import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SafetyResultData } from "./SafetyResult";
import { isLiquidFood } from "@/lib/liquidFoods";

interface DynamicSEOProps {
  result: SafetyResultData | null;
}

export function DynamicSEO({ result }: DynamicSEOProps) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (result) {
      const petName = result.petType === "dog" ? t('petToggle.dog') + "s" : t('petToggle.cat') + "s";
      const foodName = result.food.charAt(0).toUpperCase() + result.food.slice(1);
      
      const newTitle = `${t('resultHeader.canEat', { petName, foodName })} | PetSafeChoice`;

      let description = "";
      const pet = petName.toLowerCase();
      switch (result.safetyLevel) {
        case "safe":
          description = t('seo.safeDesc', { food: foodName, pet });
          break;
        case "caution":
          description = t('seo.cautionDesc', { food: foodName, pet });
          break;
        case "dangerous":
          description = t('seo.dangerousDesc', { food: foodName, pet });
          break;
      }

      document.title = newTitle;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      updateMetaTag("og:title", newTitle);
      updateMetaTag("og:description", description);
      updateMetaTag("og:type", "article");
      updateMetaTag("og:site_name", "PetSafeChoice");
      updateMetaTag("twitter:title", newTitle);
      updateMetaTag("twitter:description", description);
      updateMetaTag("twitter:card", "summary_large_image");
    } else {
      document.title = t('seo.defaultTitle');
      const defaultDesc = t('seo.defaultDescription');
      updateMetaTag("description", defaultDesc);
      updateMetaTag("og:title", t('seo.defaultTitle'));
      updateMetaTag("og:description", defaultDesc);
      updateMetaTag("twitter:title", t('seo.defaultTitle'));
      updateMetaTag("twitter:description", defaultDesc);
    }
  }, [result, i18n.language, t]);

  return null;
}

function updateMetaTag(name: string, content: string) {
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
