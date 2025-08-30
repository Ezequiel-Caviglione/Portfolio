import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTranslation } from '../i18n/useTranslation';
import PortfolioApp from './PortfolioApp';

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock all child components except for a test component
vi.mock('./navigation', () => ({
  Navigation: () => <div>Navigation</div>
}));

vi.mock('./hero-section', () => ({
  HeroSection: () => <div>Hero Section</div>
}));

vi.mock('./timeline-section', () => ({
  TimelineSection: () => <div>Timeline Section</div>
}));

vi.mock('./github-projects-section', () => ({
  GitHubProjectsSection: () => <div>GitHub Projects Section</div>
}));

vi.mock('./contact-section', () => ({
  ContactSection: () => <div>Contact Section</div>
}));

vi.mock('./contact-modal', () => ({
  ContactModal: () => <div>Contact Modal</div>
}));

// Test component that uses the translation hook
function TestTranslationComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <div data-testid="current-language">{language}</div>
      <div data-testid="translated-text">{t('navigation.home', 'Home')}</div>
      <button 
        data-testid="change-language" 
        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      >
        Change Language
      </button>
    </div>
  );
}

// Import LanguageProvider to wrap our test component
import { LanguageProvider } from '../i18n/LanguageContext';

// Create a test wrapper that provides the LanguageProvider context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('LanguageProvider Integration with useTranslation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should provide translation context to child components', () => {
    render(<TestTranslationComponent />, { wrapper: TestWrapper });
    
    // Should show default language (Spanish)
    expect(screen.getByTestId('current-language')).toHaveTextContent('es');
    
    // Should show translated text (fallback to Spanish)
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Inicio');
  });

  it('should allow language switching through context', () => {
    render(<TestTranslationComponent />, { wrapper: TestWrapper });
    
    // Initial state should be Spanish
    expect(screen.getByTestId('current-language')).toHaveTextContent('es');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Inicio');
    
    // Click to change language
    fireEvent.click(screen.getByTestId('change-language'));
    
    // Should switch to English
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Home');
  });

  it('should persist language changes to localStorage', () => {
    render(<TestTranslationComponent />, { wrapper: TestWrapper });
    
    // Change language
    fireEvent.click(screen.getByTestId('change-language'));
    
    // Should save to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('portfolio-language', 'en');
  });

  it('should load saved language from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('en');
    
    render(<TestTranslationComponent />, { wrapper: TestWrapper });
    
    // Should load English from localStorage
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Home');
  });
});