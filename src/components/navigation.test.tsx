import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Navigation } from './navigation'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock the theme and language toggle components
vi.mock('./theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>
}))

vi.mock('./language-toggle', () => ({
  LanguageToggle: () => <div data-testid="language-toggle">Language Toggle</div>
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null), // Return null by default (Spanish)
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const renderWithLanguageProvider = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  )
}

describe('Navigation Component', () => {
  const mockOnOpenContact = vi.fn()

  beforeEach(() => {
    mockOnOpenContact.mockClear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  it('renders navigation items with translation keys', () => {
    renderWithLanguageProvider(<Navigation onOpenContact={mockOnOpenContact} />)
    
    // Check that the component renders (translations will be in Spanish by default)
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Experiencia')).toBeInTheDocument()
    expect(screen.getByText('Proyectos')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
  })

  it('calls onOpenContact when contact button is clicked', () => {
    renderWithLanguageProvider(<Navigation onOpenContact={mockOnOpenContact} />)
    
    const contactButton = screen.getByText('Contacto')
    fireEvent.click(contactButton)
    
    expect(mockOnOpenContact).toHaveBeenCalledTimes(1)
  })

  it('includes theme and language toggle components', () => {
    renderWithLanguageProvider(<Navigation onOpenContact={mockOnOpenContact} />)
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })

  it('handles navigation clicks correctly', () => {
    // Mock document.querySelector and scrollIntoView
    const mockScrollIntoView = vi.fn()
    const mockQuerySelector = vi.fn().mockReturnValue({
      scrollIntoView: mockScrollIntoView
    })
    Object.defineProperty(document, 'querySelector', {
      value: mockQuerySelector,
      writable: true
    })

    renderWithLanguageProvider(<Navigation onOpenContact={mockOnOpenContact} />)
    
    const homeButton = screen.getByText('Inicio')
    fireEvent.click(homeButton)
    
    expect(mockQuerySelector).toHaveBeenCalledWith('#hero')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })



  it('uses translation hook correctly', () => {
    // This test verifies that the component is using the useTranslation hook
    // by checking that it renders the expected translated content
    renderWithLanguageProvider(<Navigation onOpenContact={mockOnOpenContact} />)
    
    // Verify that all the expected translation keys are being used
    // by checking the rendered Spanish text (default language)
    expect(screen.getByText('Portfolio')).toBeInTheDocument() // navigation.portfolio
    expect(screen.getByText('Inicio')).toBeInTheDocument() // navigation.home
    expect(screen.getByText('Experiencia')).toBeInTheDocument() // navigation.experience
    expect(screen.getByText('Proyectos')).toBeInTheDocument() // navigation.projects
    expect(screen.getByText('Contacto')).toBeInTheDocument() // navigation.contact
  })
})