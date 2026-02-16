import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearchStore } from "@/stores/searchStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Index from "./Index";

/**
 * Permalink page for /:lang/food/:foodName
 * Sets the language and triggers a food safety search, then renders Index.
 */
const FoodResult = () => {
  const { lang, foodName } = useParams<{ lang: string; foodName: string }>();
  const { i18n, t } = useTranslation();
  const {
    result,
    setResult,
    setLastSearchedFood,
    setIsLoading,
    setSearchSource,
    getCachedResult,
    setCachedResult,
    petType,
  } = useSearchStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Set language from URL
    const supportedLangs = ["en", "es", "fr", "de", "ar"];
    const targetLang = lang && supportedLangs.includes(lang) ? lang : "en";

    if (i18n.language.split("-")[0] !== targetLang) {
      i18n.changeLanguage(targetLang);
      localStorage.setItem("languageManuallySet", "true");
    }

    if (!foodName) return;

    const decodedFood = decodeURIComponent(foodName).replace(/-/g, " ");
    setLastSearchedFood(decodedFood);
    setSearchSource("search");

    // Check cache first
    const cached = getCachedResult(decodedFood, petType);
    if (cached) {
      setResult(cached);
      return;
    }

    // Fetch from API
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("check-food-safety", {
          body: { food: decodedFood, petType, language: targetLang },
        });

        if (error || data?.error) {
          toast.error(t("errors.genericWithSupport"));
          setIsLoading(false);
          return;
        }

        setResult(data);
        setCachedResult(decodedFood, petType, data);
      } catch {
        toast.error(t("errors.genericWithSupport"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [lang, foodName]);

  return <Index />;
};

export default FoodResult;
