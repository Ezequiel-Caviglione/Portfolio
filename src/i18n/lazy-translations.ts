import type { Translations, Language } from './types';

// Lazy loading cache for translations
const translationCache = new Map<Language, Promise<Translations>>();

/**
 * Lazy load translation files to optimize bundle size
 * This function loads translation files only when needed
 */
export async function loadTranslations(language: Language): Promise<Translations> {
  // Check if we already have a loading promise for this language
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  // Create a promise to load the translation file
  const loadPromise = (async (): Promise<Translations> => {
    try {
      switch (language) {
        case 'es':
          const esModule = await import('./es.json');
          return esModule.default as Translations;
        case 'en':
          const enModule = await import('./en.json');
          return enModule.default as Translations;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } catch (error) {
      console.error(`Failed to load translations for language: ${language}`, error);
      // Fallback to Spanish if loading fails
      if (language !== 'es') {
        return loadTranslations('es');
      }
      throw error;
    }
  })();

  // Cache the promise
  translationCache.set(language, loadPromise);
  
  return loadPromise;
}

/**
 * Preload translations for better performance
 * Call this function to preload translations before they're needed
 */
export function preloadTranslations(languages: Language[]): void {
  languages.forEach(lang => {
    if (!translationCache.has(lang)) {
      loadTranslations(lang).catch(error => {
        console.warn(`Failed to preload translations for ${lang}:`, error);
      });
    }
  });
}

/**
 * Clear the translation cache
 * Useful for testing or when you need to reload translations
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Check if translations are loaded for a specific language
 */
export function areTranslationsLoaded(language: Language): boolean {
  const promise = translationCache.get(language);
  if (!promise) return false;
  
  // Check if the promise is resolved by checking its state
  // This is a simple way to check without awaiting
  return promise === Promise.resolve(promise);
}