"use client"

import { motion, useInView } from "framer-motion"
import { Mail, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRef } from "react"

interface ContactSectionProps {
  onOpenModal: () => void
}

export function ContactSection({ onOpenModal }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-200px" })

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Respondo en menos de 24 horas",
      value: "hola@miportfolio.com",
      action: "mailto:hola@miportfolio.com",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Para consultas rápidas",
      value: "+34 600 123 456",
      action: "https://wa.me/34600123456",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      description: "Disponible para reuniones",
      value: "Madrid, España",
      action: "#",
    },
  ]

  return (
    <section ref={ref} id="contact" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-montserrat">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-open-sans leading-relaxed">
            Estoy siempre abierto a discutir nuevas oportunidades, proyectos interesantes o simplemente charlar sobre
            tecnología
          </p>
        </motion.div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 font-montserrat">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 font-open-sans">{method.description}</p>
                  <p className="text-sm font-medium text-foreground">{method.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-montserrat">¡Trabajemos juntos!</h3>
            <p className="text-muted-foreground mb-6 font-open-sans leading-relaxed">
              Si tienes una idea, un proyecto o simplemente quieres saludar, no dudes en contactarme. Me encanta
              colaborar en proyectos desafiantes y crear soluciones innovadoras.
            </p>
            <Button
              size="lg"
              onClick={onOpenModal}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Enviar mensaje
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
