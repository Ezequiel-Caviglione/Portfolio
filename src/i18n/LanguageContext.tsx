import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language, LanguageContextType } from './types';
import { getTranslation, defaultLanguage } from './translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio-language';

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || defaultLanguage);

  // Load language from localStorage on mount (only if no initial language is provided)
  useEffect(() => {
    if (initialLanguage) return; // Skip localStorage loading if initial language is provided
    
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      // localStorage might not be available (SSR, private browsing, etc.)
      console.warn('Failed to load language preference from localStorage:', error);
    }
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // localStorage might not be available or quota exceeded
      console.warn('Failed to save language preference to localStorage:', error);
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}