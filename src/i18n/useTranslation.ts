import { useLanguageContext } from './LanguageContext';
import type { UseTranslationReturn } from './types';

/**
 * Custom hook for accessing translations and language functionality
 * 
 * @returns Object containing translation function, current language, and language setter
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, language, setLanguage } = useTranslation();
 *   
 *   return (
 *     <div>
 *       <h1>{t('hero.title')}</h1>
 *       <button onClick={() => setLanguage('en')}>
 *         {t('navigation.switchLanguage', 'Switch Language')}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation(): UseTranslationReturn {
  const { language, setLanguage, t } = useLanguageContext();

  return {
    /**
     * Translation function that looks up translation keys with fallback mechanism
     * 
     * @param key - Dot-notation key for the translation (e.g., 'hero.title')
     * @param fallback - Optional fallback text if translation is not found
     * @returns Translated string or fallback
     */
    t,
    
    /**
     * Current active language
     */
    language,
    
    /**
     * Function to change the current language
     * 
     * @param lang - Language to switch to ('es' | 'en')
     */
    setLanguage,
  };
}