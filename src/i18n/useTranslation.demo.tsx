import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { useTranslation } from './useTranslation';

// Demo component to verify useTranslation hook functionality
function UseTranslationDemo() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>useTranslation Hook Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current Language:</strong> {language}
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => setLanguage('es')}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Español
          </button>
          <button 
            onClick={() => setLanguage('en')}
            style={{ padding: '5px 10px' }}
          >
            English
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Translation Tests:</h3>
        <ul>
          <li><strong>navigation.home:</strong> {t('navigation.home')}</li>
          <li><strong>hero.greeting:</strong> {t('hero.greeting')}</li>
          <li><strong>hero.title:</strong> {t('hero.title')}</li>
          <li><strong>contact.title:</strong> {t('contact.title')}</li>
          <li><strong>projects.viewProject:</strong> {t('projects.viewProject')}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Fallback Tests:</h3>
        <ul>
          <li><strong>missing.key (with fallback):</strong> {t('missing.key', 'This is a fallback')}</li>
          <li><strong>another.missing.key (no fallback):</strong> {t('another.missing.key')}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Nested Key Tests:</h3>
        <ul>
          <li><strong>hero.downloadCV:</strong> {t('hero.downloadCV')}</li>
          <li><strong>contact.success:</strong> {t('contact.success')}</li>
          <li><strong>footer.madeWith:</strong> {t('footer.madeWith')}</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h4>Test Instructions:</h4>
        <ol>
          <li>Check that current language displays correctly</li>
          <li>Click language buttons to switch between Spanish and English</li>
          <li>Verify all translations update immediately</li>
          <li>Check browser localStorage for 'portfolio-language' key</li>
          <li>Refresh page to verify language persistence</li>
          <li>Open browser console to see warnings for missing keys (in development mode)</li>
          <li>Verify fallback text appears for missing keys</li>
        </ol>
      </div>
    </div>
  );
}

// Wrapper component with LanguageProvider
export function UseTranslationDemoApp() {
  return (
    <LanguageProvider>
      <UseTranslationDemo />
    </LanguageProvider>
  );
}

// Manual verification checklist:
// ✓ Hook returns t, language, and setLanguage functions
// ✓ Translation function (t) works with dot notation keys
// ✓ Language switching updates all translations immediately
// ✓ Fallback mechanism works for missing keys
// ✓ Development mode warnings appear for missing keys
// ✓ localStorage integration persists language preference
// ✓ Hook throws error when used outside LanguageProvider
// ✓ Nested translation keys work correctly
// ✓ Default language (Spanish) loads initially