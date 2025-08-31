"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState, memo } from "react"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n/useTranslation"

interface NavigationProps {
  onOpenContact?: () => void
}

export const Navigation = memo(function Navigation({ onOpenContact }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  
  const navItems = [
    { name: t('navigation.home'), href: "#hero", action: 'navigate' },
    { name: t('navigation.experience'), href: "#timeline", action: 'navigate' },
    { name: t('navigation.projects'), href: "#projects", action: 'navigate' },
    { name: t('navigation.contact'), href: "#contact", action: 'contact' },
  ]

  const handleNavClick = (href: string, action: string) => {
    setIsOpen(false)
    if (action === 'contact') {
      onOpenContact?.()
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    }
  }



  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left spacer for desktop */}
          <div className="hidden md:flex flex-1"></div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href, item.action)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="text-foreground hover:text-primary transition-colors font-medium"
                aria-label={`${t('navigation.accessibility.navigateTo')} ${item.name}`}
                title={`${t('navigation.accessibility.goTo')} ${item.name}`}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Right side - Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 md:flex-1 md:justify-end ml-auto">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t('navigation.accessibility.closeMenu') : t('navigation.accessibility.openMenu')}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              title={isOpen ? t('navigation.accessibility.closeMenu') : t('navigation.accessibility.openMenu')}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
              id="mobile-navigation-menu"
              role="menu"
              aria-label={t('navigation.accessibility.mobileMenu')}
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.action)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block w-full text-left py-2 px-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors font-medium"
                    aria-label={`${t('navigation.accessibility.navigateTo')} ${item.name}`}
                    title={`${t('navigation.accessibility.goTo')} ${item.name}`}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
})
