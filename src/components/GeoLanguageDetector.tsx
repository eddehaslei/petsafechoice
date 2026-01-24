import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeoLocation } from '@/hooks/useGeoLocation';

export function GeoLanguageDetector() {
  const { i18n } = useTranslation();
  const { countryCode, isLoading, getRecommendedLanguage } = useGeoLocation();
  // Check localStorage immediately on mount to prevent any geo-override
  const hasSetLanguage = useRef(localStorage.getItem('languageManuallySet') === 'true');

  useEffect(() => {
    // If user has manually set a language, never override it
    if (localStorage.getItem('languageManuallySet') === 'true') {
      hasSetLanguage.current = true;
      return;
    }
    
    // Only set language once based on geo-detection
    if (!isLoading && countryCode && !hasSetLanguage.current) {

      const recommendedLang = getRecommendedLanguage();
      console.log('[GeoLanguageDetector] Country:', countryCode, 'Recommended:', recommendedLang, 'Current:', i18n.language);
      
      if (recommendedLang) {
        // Only change if the detected language is different and supported
        const supportedLanguages = ['en', 'ar', 'fr', 'es', 'de'];
        if (supportedLanguages.includes(recommendedLang) && recommendedLang !== i18n.language) {
          console.log('[GeoLanguageDetector] Changing language to:', recommendedLang);
          i18n.changeLanguage(recommendedLang);
          // Save to localStorage so it persists
          localStorage.setItem('i18nextLng', recommendedLang);
        }
      }
      
      hasSetLanguage.current = true;
    }
  }, [isLoading, countryCode, getRecommendedLanguage, i18n]);

  return null; // This component doesn't render anything
}
