import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SafetyResultData } from "@/components/SafetyResult";

/**
 * Updates the browser URL to a permalink format when a search result is shown.
 * Format: /[lang]/food/[food-name]
 */
export function usePermalink(result: SafetyResultData | null) {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (result) {
      const lang = i18n.language.split("-")[0];
      const foodSlug = result.food.toLowerCase().trim().replace(/\s+/g, "-");
      const targetPath = `/${lang}/food/${encodeURIComponent(foodSlug)}`;

      // Only update if the path is different to avoid loops
      if (location.pathname !== targetPath) {
        window.history.replaceState(null, "", targetPath);
      }
    } else if (location.pathname !== "/") {
      // If result is cleared, go back to root only if we're on a food page
      if (location.pathname.match(/^\/[a-z]{2}\/food\//)) {
        window.history.replaceState(null, "", "/");
      }
    }
  }, [result, i18n.language, location.pathname]);
}
