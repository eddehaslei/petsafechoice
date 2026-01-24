import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';

export const languages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

// Get initial language from localStorage or default to English
// GeoLanguageDetector will override this based on IP if user hasn't manually selected
const getInitialLanguage = (): string => {
  const stored = localStorage.getItem('i18nextLng');
  if (stored && ['en', 'ar', 'fr', 'es', 'de'].includes(stored)) {
    return stored;
  }
  return 'en'; // Default to English, GeoLanguageDetector will update based on IP
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
