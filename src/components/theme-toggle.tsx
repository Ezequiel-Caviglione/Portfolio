"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = React.useState<string | undefined>(
    undefined
  )

  React.useEffect(() => {
    setCurrentTheme(resolvedTheme)
  }, [resolvedTheme])

  if (typeof currentTheme === "undefined") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-10 h-10 rounded-full border-2 border-border"
        disabled
      />
    )
  }

  return (
    <Button
      aria-label="theme-toggle"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      className="relative w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors"
    >
      <motion.div
        initial={false}
        animate={{
          scale: currentTheme === "light" ? 1 : 0,
          rotate: currentTheme === "light" ? 0 : 180,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="h-4 w-4 text-primary" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: currentTheme === "dark" ? 1 : 0,
          rotate: currentTheme === "dark" ? 0 : -180,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="h-4 w-4 text-primary" />
      </motion.div>
    </Button>
  )
}
