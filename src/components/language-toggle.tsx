"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { useTranslation } from "@/i18n/useTranslation"

export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="relative p-2 rounded-lg bg-background border border-border hover:bg-accent transition-colors"
      aria-label={t("navigation.switchLanguage", "Switch language")}
      aria-describedby="language-status"
      title={t("navigation.currentLanguage", `Current language: ${language === "es" ? "Spanish" : "English"}`)}
    >
      <div className="flex items-center space-x-1">
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium" id="language-status">
          {language.toUpperCase()}
        </span>
      </div>
    </motion.button>
  )
}
