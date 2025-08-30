import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from './hero-section'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
}))

const renderWithLanguageProvider = (component: React.ReactElement, language: 'es' | 'en' = 'es') => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  )
}

describe('HeroSection', () => {
  it('renders with Spanish translations by default', () => {
    renderWithLanguageProvider(<HeroSection />)
    
    // Check greeting and name
    expect(screen.getByText(/¡Hola! Soy Isaí Ezequiel García Caviglione/)).toBeInTheDocument()
    
    // Check main title parts
    expect(screen.getByText('Creando')).toBeInTheDocument()
    expect(screen.getByText('Experiencias')).toBeInTheDocument()
    expect(screen.getByText('Digitales')).toBeInTheDocument()
    
    // Check description
    expect(screen.getByText(/Ingeniero en Sistemas de Información/)).toBeInTheDocument()
    
    // Check skills
    expect(screen.getByText('Desarrollo')).toBeInTheDocument()
    expect(screen.getByText('Diseño')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByText('Ver mi experiencia')).toBeInTheDocument()
    expect(screen.getByText('Explorar proyectos')).toBeInTheDocument()
    
    // Check scroll indicator
    expect(screen.getByText('Descubre más')).toBeInTheDocument()
  })

  it('renders with English translations when language is set to English', () => {
    renderWithLanguageProvider(<HeroSection />, 'en')
    
    // Check greeting and name
    expect(screen.getByText(/Hello! I'm Isaí Ezequiel García Caviglione/)).toBeInTheDocument()
    
    // Check main title parts
    expect(screen.getByText('Creating')).toBeInTheDocument()
    expect(screen.getByText('Digital')).toBeInTheDocument()
    expect(screen.getByText('Experiences')).toBeInTheDocument()
    
    // Check description
    expect(screen.getByText(/Information Systems Engineer/)).toBeInTheDocument()
    
    // Check skills
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByText('View my experience')).toBeInTheDocument()
    expect(screen.getByText('Explore projects')).toBeInTheDocument()
    
    // Check scroll indicator
    expect(screen.getByText('Discover more')).toBeInTheDocument()
  })
})