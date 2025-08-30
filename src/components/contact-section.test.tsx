import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContactSection } from './contact-section'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  useInView: () => true,
  AnimatePresence: ({ children }: any) => children,
}))

const renderWithLanguageProvider = (component: React.ReactElement, language: 'es' | 'en' = 'es') => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  )
}

describe('ContactSection', () => {
  const mockOnOpenModal = vi.fn()

  beforeEach(() => {
    mockOnOpenModal.mockClear()
  })

  it('renders contact section with Spanish translations', () => {
    renderWithLanguageProvider(<ContactSection onOpenModal={mockOnOpenModal} />, 'es')
    
    expect(screen.getByText('¿Tienes un proyecto en mente?')).toBeInTheDocument()
    expect(screen.getByText('Estoy siempre abierto a discutir nuevas oportunidades, proyectos interesantes o simplemente charlar sobre tecnología')).toBeInTheDocument()
    expect(screen.getByText('¡Trabajemos juntos!')).toBeInTheDocument()
    expect(screen.getByText('Enviar mensaje')).toBeInTheDocument()
  })

  it('renders contact section with English translations', () => {
    renderWithLanguageProvider(<ContactSection onOpenModal={mockOnOpenModal} />, 'en')
    
    expect(screen.getByText('Have a project in mind?')).toBeInTheDocument()
    expect(screen.getByText('I\'m always open to discussing new opportunities, interesting projects, or just chatting about technology')).toBeInTheDocument()
    expect(screen.getByText('Let\'s work together!')).toBeInTheDocument()
    expect(screen.getByText('Send message')).toBeInTheDocument()
  })

  it('renders contact methods with translations', () => {
    renderWithLanguageProvider(<ContactSection onOpenModal={mockOnOpenModal} />, 'es')
    
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Respondo en menos de 24 horas')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Para consultas rápidas')).toBeInTheDocument()
    expect(screen.getByText('Ubicación')).toBeInTheDocument()
    expect(screen.getByText('Disponible para reuniones')).toBeInTheDocument()
  })

  it('renders contact methods with English translations', () => {
    renderWithLanguageProvider(<ContactSection onOpenModal={mockOnOpenModal} />, 'en')
    
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('I respond within 24 hours')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('For quick inquiries')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Available for meetings')).toBeInTheDocument()
  })

  it('calls onOpenModal when send message button is clicked', () => {
    renderWithLanguageProvider(<ContactSection onOpenModal={mockOnOpenModal} />)
    
    const sendButton = screen.getByText('Enviar mensaje')
    fireEvent.click(sendButton)
    
    expect(mockOnOpenModal).toHaveBeenCalledTimes(1)
  })
})