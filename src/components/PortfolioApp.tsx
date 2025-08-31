"use client"

import { useState, memo } from "react"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "../i18n/LanguageContext"
import { useTranslation } from "../i18n/useTranslation"
import { Navigation } from "./navigation"
import { HeroSection } from "./hero-section"
import { TimelineSection } from "./timeline-section"
import { GitHubProjectsSection } from "./github-projects-section"
import { ContactSection } from "./contact-section"
import { ContactModal } from "./contact-modal"

const PortfolioContent = memo(function PortfolioContent() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const { t } = useTranslation()

  const openContactModal = () => setIsContactModalOpen(true)
  const closeContactModal = () => setIsContactModalOpen(false)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <Navigation onOpenContact={openContactModal} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Timeline Section */}
          <TimelineSection />

          {/* GitHub Projects Section */}
          <GitHubProjectsSection />

          {/* Contact Section */}
          <ContactSection onOpenModal={openContactModal} />
        </main>

        {/* Contact Modal */}
        <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-muted-foreground font-open-sans">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
})

export default function PortfolioApp() {
  return (
    <LanguageProvider>
      <PortfolioContent />
    </LanguageProvider>
  )
}