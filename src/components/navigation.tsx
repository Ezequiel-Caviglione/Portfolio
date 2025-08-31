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
        <div className="flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.05 }} className="font-bold text-xl text-primary">
            {t('navigation.portfolio')}
          </motion.div>

          {/* Desktop Navigation */}
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
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
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
