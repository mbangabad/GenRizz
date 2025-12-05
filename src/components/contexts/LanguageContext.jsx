import React, { createContext, useState, useContext, useEffect } from 'react';
import { TRANSLATIONS } from '@/components/constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('genrizz_language');
    if (savedLang && TRANSLATIONS[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguage(lang);
      localStorage.setItem('genrizz_language', lang);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = TRANSLATIONS[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};