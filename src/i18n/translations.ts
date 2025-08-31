import type { Translations, Language } from './types';
import { measureTranslationPerformance } from './performance';
import esTranslations from './es.json';
import enTranslations from './en.json';

export const translations: Record<Language, Translations> = {
  es: esTranslations as Translations,
  en: enTranslations as Translations,
};

export const defaultLanguage: Language = 'es';

export const supportedLanguages: Language[] = ['es', 'en'];

// Translation cache for memoization
const translationCache = new Map<string, string>();

// Generate cache key for memoization
function getCacheKey(language: Language, key: string, fallback?: string): string {
  return `${language}:${key}:${fallback || ''}`;
}

// Internal translation function without performance monitoring
function _getTranslation(language: Language, key: string, fallback?: string): string {
  // Check cache first for performance
  const cacheKey = getCacheKey(language, key, fallback);
  const cached = translationCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

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
        const fallbackResult = _getTranslation(defaultLanguage, key, fallback);
        // Cache the result
        translationCache.set(cacheKey, fallbackResult);
        return fallbackResult;
      }
      // Return fallback or key if no translation found
      const result = fallback || key;
      translationCache.set(cacheKey, result);
      return result;
    }
  }
  
  const result = typeof value === 'string' ? value : fallback || key;
  // Cache the successful result
  translationCache.set(cacheKey, result);
  return result;
}

// Export the performance-monitored version
export const getTranslation = measureTranslationPerformance(
  _getTranslation,
  (language: Language, key: string, fallback?: string) => {
    const cacheKey = getCacheKey(language, key, fallback);
    return translationCache.has(cacheKey);
  }
);

// Clear cache when needed (useful for testing or dynamic language loading)
export function clearTranslationCache(): void {
  translationCache.clear();
}

// Get cache statistics for monitoring
export function getTranslationCacheStats(): { size: number; keys: string[] } {
  return {
    size: translationCache.size,
    keys: Array.from(translationCache.keys()),
  };
}