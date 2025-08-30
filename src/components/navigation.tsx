"use client"

import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"

interface NavigationProps {
  onOpenContact?: () => void
}

export function Navigation({ onOpenContact }: NavigationProps) {
  const navItems = [
    { name: "Inicio", href: "#hero" },
    { name: "Experiencia", href: "#timeline" },
    { name: "Proyectos", href: "#projects" },
  ]

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
            Portfolio
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 + 0.3 }}
              whileHover={{ scale: 1.05 }}
              onClick={onOpenContact}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contacto
            </motion.button>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}
