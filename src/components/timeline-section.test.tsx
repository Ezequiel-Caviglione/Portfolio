import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TimelineSection } from './timeline-section'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  useInView: () => true,
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon">📅</div>,
  MapPin: () => <div data-testid="mappin-icon">📍</div>,
  ChevronDown: () => <div data-testid="chevron-down">⬇️</div>,
  ChevronUp: () => <div data-testid="chevron-up">⬆️</div>,
}))

const renderWithLanguageProvider = (component: React.ReactElement, language: 'es' | 'en' = 'es') => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  )
}

describe('TimelineSection', () => {
  it('renders timeline section with Spanish translations', () => {
    renderWithLanguageProvider(<TimelineSection />, 'es')
    
    expect(screen.getByText('Mi Trayectoria')).toBeInTheDocument()
    expect(screen.getByText(/Un recorrido por mi experiencia profesional/)).toBeInTheDocument()
    expect(screen.getByText('Ver mis proyectos')).toBeInTheDocument()
  })

  it('renders timeline section with English translations', () => {
    renderWithLanguageProvider(<TimelineSection />, 'en')
    
    expect(screen.getByText('My Journey')).toBeInTheDocument()
    expect(screen.getByText(/A journey through my professional and academic/)).toBeInTheDocument()
    expect(screen.getByText('View my projects')).toBeInTheDocument()
  })

  it('renders timeline items with translated content', () => {
    renderWithLanguageProvider(<TimelineSection />, 'es')
    
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument()
    expect(screen.getByText('Livepanel')).toBeInTheDocument()
    expect(screen.getByText('Ingeniería en Sistemas de Información')).toBeInTheDocument()
    expect(screen.getByText('Universidad Nacional del Sur')).toBeInTheDocument()
  })

  it('shows expand/collapse functionality with translated buttons', () => {
    renderWithLanguageProvider(<TimelineSection />, 'es')
    
    const expandButtons = screen.getAllByText('Ver logros')
    expect(expandButtons).toHaveLength(2)
    
    // Click first expand button
    fireEvent.click(expandButtons[0])
    
    // Should show "Ver menos" button and achievements
    expect(screen.getByText('Ver menos')).toBeInTheDocument()
    // After expanding, we should see at least one achievements header
    expect(screen.getAllByText('Principales logros:').length).toBeGreaterThanOrEqual(1)
  })

  it('shows expand/collapse functionality with English translations', () => {
    renderWithLanguageProvider(<TimelineSection />, 'en')
    
    const expandButtons = screen.getAllByText('View achievements')
    expect(expandButtons).toHaveLength(2)
    
    // Click first expand button
    fireEvent.click(expandButtons[0])
    
    // Should show "View less" button and achievements
    expect(screen.getByText('View less')).toBeInTheDocument()
    // After expanding, we should see at least one achievements header
    expect(screen.getAllByText('Key achievements:').length).toBeGreaterThanOrEqual(1)
  })

  it('displays timeline items with correct technologies', () => {
    renderWithLanguageProvider(<TimelineSection />, 'es')
    
    expect(screen.getByText('Angular')).toBeInTheDocument()
    expect(screen.getAllByText('Python')).toHaveLength(2) // Python appears in both timeline items
    expect(screen.getByText('Django')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('translates non-technical skills correctly', () => {
    renderWithLanguageProvider(<TimelineSection />, 'es')
    
    // Spanish translations should be displayed
    expect(screen.getByText('Metodologías ágiles')).toBeInTheDocument()
    expect(screen.getByText('Análisis de requerimientos')).toBeInTheDocument()
    expect(screen.getByText('Planificación de proyectos')).toBeInTheDocument()
  })

  it('translates non-technical skills to English correctly', () => {
    renderWithLanguageProvider(<TimelineSection />, 'en')
    
    // English translations should be displayed
    expect(screen.getByText('Agile Methodologies')).toBeInTheDocument()
    expect(screen.getByText('Requirements Analysis')).toBeInTheDocument()
    expect(screen.getByText('Project Planning')).toBeInTheDocument()
  })
})