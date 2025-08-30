import type { Translations, Language } from './types';
import esTranslations from './es.json';
import enTranslations from './en.json';

export const translations: Record<Language, Translations> = {
  es: esTranslations as Translations,
  en: enTranslations as Translations,
};

export const defaultLanguage: Language = 'es';

export const supportedLanguages: Language[] = ['es', 'en'];

export function getTranslation(language: Language, key: string, fallback?: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Log warning in development mode for missing keys
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: "${key}" for language: "${language}"`);
      }
      
      // Try fallback to default language
      if (language !== defaultLanguage) {
        return getTranslation(defaultLanguage, key, fallback);
      }
      // Return fallback or key if no translation found
      return fallback || key;
    }
  }
  
  return typeof value === 'string' ? value : fallback || key;
}