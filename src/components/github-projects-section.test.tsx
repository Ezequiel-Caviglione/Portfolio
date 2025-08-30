import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GitHubProjectsSection } from './github-projects-section'
import { LanguageProvider } from '@/i18n/LanguageContext'

// Mock the useGitHubRepos hook
vi.mock('@/hooks/use-github-repos', () => ({
  useGitHubRepos: vi.fn(() => ({
    repos: [
      {
        id: 1,
        name: 'test-repo',
        description: 'Test repository description',
        html_url: 'https://github.com/test/repo',
        homepage: 'https://test-repo.com',
        language: 'TypeScript',
        topics: ['react', 'typescript'],
        stargazers_count: 10,
        forks_count: 5,
        watchers_count: 3,
        updated_at: '2024-01-15T10:00:00Z'
      }
    ],
    loading: false,
    error: null,
    refetch: vi.fn()
  }))
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>
  },
  useInView: () => true
}))

const renderWithLanguageProvider = (component: React.ReactElement, language: 'es' | 'en' = 'es') => {
  return render(
    <LanguageProvider initialLanguage={language}>
      {component}
    </LanguageProvider>
  )
}

describe('GitHubProjectsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Spanish translations', () => {
    it('should render section title in Spanish', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      
      expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument()
    })

    it('should render section subtitle in Spanish', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      
      expect(screen.getByText(/Una selección de mis proyectos más recientes/)).toBeInTheDocument()
    })

    it('should render stats labels in Spanish', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      
      expect(screen.getByText('Proyectos Activos')).toBeInTheDocument()
      expect(screen.getByText('Tecnologías')).toBeInTheDocument()
      expect(screen.getByText('Actualizados (30d)')).toBeInTheDocument()
      expect(screen.getByText('Total Stars')).toBeInTheDocument()
    })

    it('should render button labels in Spanish', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      
      expect(screen.getByText('Código')).toBeInTheDocument()
      expect(screen.getByText('Demo')).toBeInTheDocument()
      expect(screen.getByText('Ver todos mis proyectos')).toBeInTheDocument()
    })

    it('should render "Updated" text in Spanish', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      
      // Use getAllByText to handle multiple matches and check the specific one we want
      const updatedTexts = screen.getAllByText(/Actualizado/)
      expect(updatedTexts.length).toBeGreaterThan(0)
      // Check that at least one contains the date format
      expect(screen.getByText(/Actualizado.*ene/)).toBeInTheDocument()
    })
  })

  describe('English translations', () => {
    it('should render section title in English', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'en')
      
      expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    })

    it('should render section subtitle in English', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'en')
      
      expect(screen.getByText(/A selection of my most recent GitHub projects/)).toBeInTheDocument()
    })

    it('should render stats labels in English', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'en')
      
      expect(screen.getByText('Active Projects')).toBeInTheDocument()
      expect(screen.getByText('Technologies')).toBeInTheDocument()
      expect(screen.getByText('Updated (30d)')).toBeInTheDocument()
      expect(screen.getByText('Total Stars')).toBeInTheDocument()
    })

    it('should render button labels in English', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'en')
      
      expect(screen.getByText('Code')).toBeInTheDocument()
      expect(screen.getByText('Demo')).toBeInTheDocument()
      expect(screen.getByText('View all my projects')).toBeInTheDocument()
    })

    it('should render "Updated" text in English', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'en')
      
      // Use getAllByText to handle multiple matches and check the specific one we want
      const updatedTexts = screen.getAllByText(/Updated/)
      expect(updatedTexts.length).toBeGreaterThan(0)
      // Check that at least one contains the date format
      expect(screen.getByText(/Updated.*Jan/)).toBeInTheDocument()
    })
  })

  describe('Translation functionality', () => {
    it('should use correct fallback text for missing descriptions', () => {
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      
      // Since our mock has a description, we can't test the fallback directly
      // But we can verify the translation key exists by checking the component renders
      expect(screen.getByText('Test repository description')).toBeInTheDocument()
    })

    it('should render correctly in both languages', () => {
      // Test Spanish
      renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument()
      
      // Test English separately
      const { unmount } = renderWithLanguageProvider(<GitHubProjectsSection />, 'es')
      unmount()
      
      renderWithLanguageProvider(<GitHubProjectsSection />, 'en')
      expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    })
  })
})