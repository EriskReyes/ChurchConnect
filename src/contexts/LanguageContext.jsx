import { createContext, useState, useCallback } from 'react';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('cc-language') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('cc-language', lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
