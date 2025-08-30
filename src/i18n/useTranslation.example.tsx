import React from 'react';
import { useTranslation } from './useTranslation';

/**
 * Example component showing how to use the useTranslation hook
 * This demonstrates the three main features:
 * 1. Translation function (t)
 * 2. Current language access
 * 3. Language switching
 */
export function TranslationExample() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      {/* Basic translation usage */}
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      
      {/* Translation with fallback */}
      <p>{t('some.missing.key', 'Default text if translation is missing')}</p>
      
      {/* Language switching */}
      <div>
        <span>Current language: {language}</span>
        <button onClick={() => setLanguage('es')}>
          {t('navigation.spanish', 'Español')}
        </button>
        <button onClick={() => setLanguage('en')}>
          {t('navigation.english', 'English')}
        </button>
      </div>
      
      {/* Navigation example */}
      <nav>
        <a href="#home">{t('navigation.home')}</a>
        <a href="#about">{t('navigation.about')}</a>
        <a href="#projects">{t('navigation.projects')}</a>
        <a href="#contact">{t('navigation.contact')}</a>
      </nav>
      
      {/* Contact form example */}
      <form>
        <input placeholder={t('contact.name')} />
        <input placeholder={t('contact.email')} />
        <textarea placeholder={t('contact.message')} />
        <button type="submit">{t('contact.send')}</button>
      </form>
    </div>
  );
}

/**
 * Usage notes:
 * 
 * 1. Import the hook: import { useTranslation } from 'src/i18n';
 * 2. Use in component: const { t, language, setLanguage } = useTranslation();
 * 3. Translate text: t('translation.key') or t('translation.key', 'fallback')
 * 4. Check current language: language
 * 5. Change language: setLanguage('es' | 'en')
 * 
 * The hook automatically:
 * - Provides access to all translations
 * - Handles missing keys with fallbacks
 * - Shows development warnings for missing keys
 * - Persists language preference in localStorage
 * - Updates all components when language changes
 */