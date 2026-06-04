import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  const currentTranslations = translations[language] || translations['en'];

  const t = (key) => {
    const keys = key.split('.');
    let value = currentTranslations;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { t, language };
}
