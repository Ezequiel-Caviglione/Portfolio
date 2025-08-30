import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PortfolioApp from './PortfolioApp';

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>
}));

// Mock all the child components to focus on provider integration
vi.mock('./navigation', () => ({
  Navigation: () => <div data-testid="navigation">Navigation</div>
}));

vi.mock('./hero-section', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>
}));

vi.mock('./timeline-section', () => ({
  TimelineSection: () => <div data-testid="timeline-section">Timeline Section</div>
}));

vi.mock('./github-projects-section', () => ({
  GitHubProjectsSection: () => <div data-testid="github-projects-section">GitHub Projects Section</div>
}));

vi.mock('./contact-section', () => ({
  ContactSection: () => <div data-testid="contact-section">Contact Section</div>
}));

vi.mock('./contact-modal', () => ({
  ContactModal: () => <div data-testid="contact-modal">Contact Modal</div>
}));

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

describe('PortfolioApp Provider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with LanguageProvider and ThemeProvider hierarchy', () => {
    render(<PortfolioApp />);
    
    // Check that the theme provider is rendered
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    
    // Check that main components are rendered
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-section')).toBeInTheDocument();
    expect(screen.getByTestId('github-projects-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
  });

  it('should attempt to load language preference from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('en');
    
    render(<PortfolioApp />);
    
    // Verify that localStorage.getItem was called with the correct key
    expect(localStorageMock.getItem).toHaveBeenCalledWith('portfolio-language');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Should not throw an error
    expect(() => render(<PortfolioApp />)).not.toThrow();
    
    // Should log a warning
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load language preference from localStorage:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('should use default language when localStorage returns invalid value', () => {
    localStorageMock.getItem.mockReturnValue('invalid-language');
    
    // Should not throw an error and should render successfully
    expect(() => render(<PortfolioApp />)).not.toThrow();
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('should use default language when localStorage returns null', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    // Should not throw an error and should render successfully
    expect(() => render(<PortfolioApp />)).not.toThrow();
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });
});