"use client"

import type React from "react"

import { useState, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import config from "@/lib/config"
import { useTranslation } from "@/i18n/useTranslation"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

type FormStatus = "idle" | "loading" | "success" | "error"

export const ContactModal = memo(function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>("idle")
  const { t } = useTranslation()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t('contact.modal.validation.nameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.modal.validation.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.modal.validation.emailInvalid')
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.modal.validation.subjectRequired')
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.modal.validation.messageRequired')
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.modal.validation.messageMinLength')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus("loading")

    try {
      // Check if Formspree is properly configured
      if (!config.formspree.isConfigured) {
        console.warn("Formspree is not configured. Please set PUBLIC_FORMSPREE_FORM_ID in your environment variables.")
        throw new Error(t('contact.modal.status.configError'))
      }

      const response = await fetch(config.formspree.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          // Add additional metadata for better tracking
          _replyto: formData.email,
          _subject: `Nuevo mensaje de ${formData.name}: ${formData.subject}`,
        }),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => {
          setStatus("idle")
          onClose()
        }, 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Formspree error:", errorData)
        throw new Error(t('contact.modal.status.error.description'))
      }
    } catch (error) {
      console.error("Contact form error:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-montserrat">{t('contact.modal.title')}</h2>
                  <p className="text-muted-foreground font-open-sans">{t('contact.modal.subtitle')}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Success State */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t('contact.modal.status.success.title')}</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    {t('contact.modal.status.success.description')}
                  </p>
                </motion.div>
              )}

              {/* Error State */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{t('contact.modal.status.error.title')}</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {t('contact.modal.status.error.description')}
                  </p>
                </motion.div>
              )}

              {/* Development Warning */}
              {!config.formspree.isConfigured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{t('contact.modal.status.configWarning.title')}</span>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                    {t('contact.modal.status.configWarning.description')}
                  </p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-primary" />
                    {t('contact.modal.form.name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t('contact.modal.form.namePlaceholder')}
                    className={`transition-colors ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={status === "loading"}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    {t('contact.modal.form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t('contact.modal.form.emailPlaceholder')}
                    className={`transition-colors ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={status === "loading"}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2 font-medium">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    {t('contact.modal.form.subject')}
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder={t('contact.modal.form.subjectPlaceholder')}
                    className={`transition-colors ${errors.subject ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={status === "loading"}
                  />
                  {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-medium">
                    {t('contact.modal.form.message')}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder={t('contact.modal.form.messagePlaceholder')}
                    rows={5}
                    className={`transition-colors resize-none ${
                      errors.message ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    disabled={status === "loading"}
                  />
                  {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                  <p className="text-xs text-muted-foreground">{formData.message.length}/500 {t('contact.modal.form.charactersCount')}</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {status === "loading" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('contact.modal.form.submit')}
                    </>
                  )}
                </Button>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4 font-montserrat">{t('contact.modal.otherContacts.title')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>ezecaviglione@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>linkedin.com/in/ezequiel-caviglione</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})
