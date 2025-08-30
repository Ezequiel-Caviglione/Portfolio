import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContactModal } from './contact-modal'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
  AnimatePresence: ({ children }: any) => children,
}))

// Mock config
vi.mock('@/lib/config', () => ({
  default: {
    formspree: {
      isConfigured: true,
      endpoint: 'https://formspree.io/test'
    }
  }
}))

const renderWithLanguageProvider = (component: React.ReactElement, language: 'es' | 'en' = 'es') => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  )
}

describe('ContactModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders modal with Spanish translations when open', () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'es')
    
    expect(screen.getByText('Contacto')).toBeInTheDocument()
    expect(screen.getByText('¡Hablemos de tu próximo proyecto!')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Asunto')).toBeInTheDocument()
    expect(screen.getByText('Mensaje')).toBeInTheDocument()
    expect(screen.getByText('Enviar mensaje')).toBeInTheDocument()
  })

  it('renders modal with English translations when open', () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'en')
    
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Let\'s talk about your next project!')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Subject')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
    expect(screen.getByText('Send message')).toBeInTheDocument()
  })

  it('renders form placeholders with Spanish translations', () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'es')
    
    expect(screen.getByPlaceholderText('Tu nombre completo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('¿En qué puedo ayudarte?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Cuéntame sobre tu proyecto, ideas o cualquier consulta que tengas...')).toBeInTheDocument()
  })

  it('renders form placeholders with English translations', () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'en')
    
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('How can I help you?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tell me about your project, ideas, or any questions you have...')).toBeInTheDocument()
  })

  it('shows validation errors in Spanish', async () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'es')
    
    const submitButton = screen.getByText('Enviar mensaje')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
      expect(screen.getByText('El email es requerido')).toBeInTheDocument()
      expect(screen.getByText('El asunto es requerido')).toBeInTheDocument()
      expect(screen.getByText('El mensaje es requerido')).toBeInTheDocument()
    })
  })

  it('shows validation errors in English', async () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'en')
    
    const submitButton = screen.getByText('Send message')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Subject is required')).toBeInTheDocument()
      expect(screen.getByText('Message is required')).toBeInTheDocument()
    })
  })



  it('renders other contacts section with Spanish translations', () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'es')
    
    expect(screen.getByText('Otras formas de contacto')).toBeInTheDocument()
  })

  it('renders other contacts section with English translations', () => {
    renderWithLanguageProvider(<ContactModal isOpen={true} onClose={mockOnClose} />, 'en')
    
    expect(screen.getByText('Other ways to contact')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithLanguageProvider(<ContactModal isOpen={false} onClose={mockOnClose} />)
    
    expect(screen.queryByText('Contacto')).not.toBeInTheDocument()
    expect(screen.queryByText('Contact')).not.toBeInTheDocument()
  })
})