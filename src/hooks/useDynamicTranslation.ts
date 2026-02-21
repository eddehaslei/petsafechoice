import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';


const HARDCODED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ar'];


const LANGUAGE_NAMES: Record<string, string> = {
  tr: 'Turkish', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  pl: 'Polish', ru: 'Russian', ja: 'Japanese', ko: 'Korean',
  zh: 'Chinese', sv: 'Swedish', no: 'Norwegian', da: 'Danish',
  fi: 'Finnish', el: 'Greek', he: 'Hebrew', hi: 'Hindi',
  cs: 'Czech', ro: 'Romanian', hu: 'Hungarian', uk: 'Ukrainian',
  id: 'Indonesian', th: 'Thai', vi: 'Vietnamese',
};


function unflatten(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}


export function useDynamicTranslation(detectedLangCode: string | null) {
  const { i18n } = useTranslation();
  const hasApplied = useRef<string | null>(null);


  useEffect(() => {
    if (!detectedLangCode) return;
    const langCode = detectedLangCode.toLowerCase().slice(0, 2);
    if (hasApplied.current === langCode) return;
    if (HARDCODED_LANGUAGES.includes(langCode)) return;
    if (!LANGUAGE_NAMES[langCode]) return;


    hasApplied.current = langCode;


    const fetchTranslation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('translate-ui', {
          body: { targetLanguage: LANGUAGE_NAMES[langCode], languageCode: langCode }
        });
        if (error || !data?.translations) return;
        const nested = unflatten(data.translations);
        i18n.addResourceBundle(langCode, 'translation', nested, true, true);
        await i18n.changeLanguage(langCode);
        localStorage.setItem('i18nextLng', langCode);
        document.documentElement.lang = langCode;
      } catch (err) {
        console.error('Dynamic translation error:', err);
      }
    };


    fetchTranslation();
  }, [detectedLangCode, i18n]);
}