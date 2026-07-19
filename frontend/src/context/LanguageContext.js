import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations, languages } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState(translations.en);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('flexhire_language') || 'en';
    setLanguage(savedLanguage);
    setT(translations[savedLanguage]);
  }, []);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setT(translations[langCode]);
    localStorage.setItem('flexhire_language', langCode);
  };

  const value = {
    language,
    t,
    changeLanguage,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};