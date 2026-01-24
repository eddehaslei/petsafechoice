import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeoLocation } from '@/hooks/useGeoLocation';

export function GeoLanguageDetector() {
  const { i18n } = useTranslation();
  const { countryCode, isLoading, getRecommendedLanguage } = useGeoLocation();
  const hasSetLanguage = useRef(false);

  useEffect(() => {
    // Only set language once, and only if user hasn't manually selected a language
    if (!isLoading && countryCode && !hasSetLanguage.current) {
      const storedLanguage = localStorage.getItem('i18nextLng');
      const isManuallySet = localStorage.getItem('languageManuallySet');
      
      // If user has manually set a language, don't override it
      if (isManuallySet === 'true') {
        hasSetLanguage.current = true;
        return;
      }

      const recommendedLang = getRecommendedLanguage();
      
      if (recommendedLang && recommendedLang !== i18n.language) {
        // Only change if the detected language is different and supported
        const supportedLanguages = ['en', 'ar', 'fr', 'es', 'de'];
        if (supportedLanguages.includes(recommendedLang)) {
          i18n.changeLanguage(recommendedLang);
        }
      }
      
      hasSetLanguage.current = true;
    }
  }, [isLoading, countryCode, getRecommendedLanguage, i18n]);

  return null; // This component doesn't render anything
}
