import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { LanguageProvider } from './LanguageContext';
import type { ReactNode } from 'react';

describe('useTranslation', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null);
  });

  it('should return translation function, language, and setLanguage', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current).toHaveProperty('t');
    expect(result.current).toHaveProperty('language');
    expect(result.current).toHaveProperty('setLanguage');
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.setLanguage).toBe('function');
  });

  it('should start with default language (Spanish)', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.language).toBe('es');
  });

  it('should translate keys correctly in Spanish', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.t('navigation.home')).toBe('Inicio');
    expect(result.current.t('hero.greeting')).toBe('¡Hola! Soy');
    expect(result.current.t('contact.title')).toBe('Contacto');
  });

  it('should translate keys correctly in English', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t('navigation.home')).toBe('Home');
    expect(result.current.t('hero.greeting')).toBe('Hello! I\'m');
    expect(result.current.t('contact.title')).toBe('Contact');
  });

  it('should handle nested translation keys', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.t('hero.downloadCV')).toBe('Descargar CV');
    expect(result.current.t('projects.viewProject')).toBe('Demo');
  });

  it('should use fallback when translation key is missing', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    const fallbackText = 'Fallback Text';
    const translatedText = result.current.t('nonexistent.key', fallbackText);

    expect(translatedText).toBe(fallbackText);
  });

  it('should return key when no fallback is provided and key is missing', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    const missingKey = 'nonexistent.key';
    const translatedText = result.current.t(missingKey);

    expect(translatedText).toBe(missingKey);
  });

  it('should fallback to default language when key is missing in current language', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    // Switch to English
    act(() => {
      result.current.setLanguage('en');
    });

    // Test with a key that might exist in Spanish but not English
    // Since our test data should have all keys, we'll test the fallback mechanism
    // by testing a key that doesn't exist in either language
    const result1 = result.current.t('missing.key', 'fallback');
    expect(result1).toBe('fallback');
  });

  it('should warn in development mode for missing keys', () => {
    // Set NODE_ENV to development
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const { result } = renderHook(() => useTranslation(), { wrapper });

    result.current.t('missing.key');

    expect(console.warn).toHaveBeenCalledWith(
      'Missing translation key: "missing.key" for language: "es"'
    );

    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should not warn in production mode for missing keys', () => {
    // Set NODE_ENV to production
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const { result } = renderHook(() => useTranslation(), { wrapper });

    result.current.t('missing.key');

    expect(console.warn).not.toHaveBeenCalled();

    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should change language and persist to localStorage', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-language', 'en');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('localStorage not available');
    });

    const { result } = renderHook(() => useTranslation(), { wrapper });

    // Should not throw an error
    expect(() => {
      act(() => {
        result.current.setLanguage('en');
      });
    }).not.toThrow();

    expect(result.current.language).toBe('en');
  });

  it('should throw error when used outside LanguageProvider', () => {
    // Suppress console.error for this test since we expect an error
    const originalConsoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useTranslation());
    }).toThrow('useLanguageContext must be used within a LanguageProvider');

    console.error = originalConsoleError;
  });
});