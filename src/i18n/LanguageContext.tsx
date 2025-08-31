import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
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
    if (initialLanguage) {
      // Update HTML lang attribute for initial language
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', initialLanguage);
      }
      return; // Skip localStorage loading if initial language is provided
    }
    
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
        // Update HTML lang attribute
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('lang', savedLanguage);
        }
      } else {
        // Set default language in HTML
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('lang', defaultLanguage);
        }
      }
    } catch (error) {
      // localStorage might not be available (SSR, private browsing, etc.)
      console.warn('Failed to load language preference from localStorage:', error);
      // Set default language in HTML
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', defaultLanguage);
      }
    }
  }, [initialLanguage]);

  // Memoize setLanguage to prevent unnecessary re-renders
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // localStorage might not be available or quota exceeded
      console.warn('Failed to save language preference to localStorage:', error);
    }
  }, []);

  // Memoize translation function to prevent unnecessary re-renders
  const t = useCallback((key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  }, [language]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue: LanguageContextType = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

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