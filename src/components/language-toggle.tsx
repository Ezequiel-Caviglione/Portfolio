"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { memo } from "react"
import { useTranslation } from "@/i18n/useTranslation"
import { Button } from "@/components/ui/button"

export const LanguageToggle = memo(function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors"
      aria-label={t("navigation.switchLanguage", "Switch language")}
      title={t("navigation.currentLanguage", `Current language: ${language === "es" ? "Spanish" : "English"}`)}
    >
      <motion.div
        initial={false}
        animate={{
          scale: language === "es" ? 1 : 0,
          rotate: language === "es" ? 0 : 180,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-primary">ES</span>
        </div>
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: language === "en" ? 1 : 0,
          rotate: language === "en" ? 0 : -180,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex items-center justify-center">
          <span className="text-xs font-bold text-primary">EN</span>
        </div>
      </motion.div>
    </Button>
  )
})