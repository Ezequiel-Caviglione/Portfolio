"use client"

import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRef, useState } from "react"

interface TimelineItem {
  id: string
  title: string
  company: string
  location: string
  period: string
  description: string
  achievements: string[]
  technologies: string[]
  type: "work" | "education" | "project"
}

const timelineData: TimelineItem[] = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    location: "Madrid, España",
    period: "2022 - Presente",
    description:
      "Lidero el desarrollo de aplicaciones web escalables usando React, Node.js y AWS. Responsable de la arquitectura técnica y mentoría del equipo junior.",
    achievements: [
      "Reduje el tiempo de carga de la aplicación principal en un 40%",
      "Implementé CI/CD que redujo los deployments de 2 horas a 15 minutos",
      "Lideré la migración a microservicios mejorando la escalabilidad",
      "Mentoré a 5 desarrolladores junior en mejores prácticas",
    ],
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
    type: "work",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupInnovate",
    location: "Barcelona, España",
    period: "2020 - 2022",
    description:
      "Desarrollé desde cero una plataforma SaaS para gestión de proyectos, desde el MVP hasta 10,000+ usuarios activos.",
    achievements: [
      "Construí la plataforma completa con Next.js y Supabase",
      "Implementé sistema de pagos con Stripe",
      "Desarrollé API REST con autenticación JWT",
      "Alcanzamos 10,000+ usuarios en el primer año",
    ],
    technologies: ["Next.js", "Supabase", "Stripe", "Tailwind CSS", "Vercel"],
    type: "work",
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "DigitalAgency Pro",
    location: "Valencia, España",
    period: "2019 - 2020",
    description:
      "Especializado en crear experiencias web interactivas y responsivas para clientes de diversos sectores.",
    achievements: [
      "Desarrollé 15+ sitios web corporativos",
      "Implementé animaciones avanzadas con Framer Motion",
      "Optimicé SEO logrando mejoras del 60% en rankings",
      "Colaboré con equipos de diseño UX/UI",
    ],
    technologies: ["React", "Vue.js", "SASS", "Framer Motion", "Figma"],
    type: "work",
  },
  {
    id: "4",
    title: "Ingeniería Informática",
    company: "Universidad Politécnica de Valencia",
    location: "Valencia, España",
    period: "2015 - 2019",
    description: "Grado en Ingeniería Informática con especialización en Desarrollo de Software y Sistemas Web.",
    achievements: [
      "Proyecto final: Plataforma de e-learning con React y Node.js",
      "Promedio académico: 8.5/10",
      "Participé en hackathons universitarios",
      "Curso de especialización en Machine Learning",
    ],
    technologies: ["Java", "Python", "C++", "MySQL", "Git"],
    type: "education",
  },
]

function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-primary"
      case "education":
        return "bg-secondary"
      case "project":
        return "bg-accent"
      default:
        return "bg-primary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "work":
        return "💼"
      case "education":
        return "🎓"
      case "project":
        return "🚀"
      default:
        return "💼"
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Content Card */}
      <div className="flex-1">
        <Card className="border-2 border-border hover:border-primary/50 transition-colors duration-300">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <h3 className="text-xl font-bold text-foreground font-montserrat">{item.title}</h3>
                </div>
                <p className="text-lg font-semibold text-primary mb-1">{item.company}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{item.period}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-foreground mb-4 font-open-sans leading-relaxed">{item.description}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Expand Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 transform hover:scale-105 transition-all duration-300"
            >
              {isExpanded ? "Ver menos" : "Ver logros"}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {/* Expanded Content */}
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-border mt-4">
                <h4 className="font-semibold text-foreground mb-3 font-montserrat">Principales logros:</h4>
                <ul className="space-y-2">
                  {item.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-foreground font-open-sans"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Dot */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
          className={`w-6 h-6 rounded-full ${getTypeColor(item.type)} border-4 border-background shadow-lg z-10`}
        />
        {index < timelineData.length - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
            className="w-0.5 bg-border absolute top-6 h-full"
          />
        )}
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1" />
    </motion.div>
  )
}

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-200px" })

  return (
    <section ref={ref} id="timeline" className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-montserrat">Mi Trayectoria</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-open-sans leading-relaxed">
            Un recorrido por mi experiencia profesional y académica, destacando los proyectos y logros más
            significativos
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <TimelineItemComponent key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            Ver mis proyectos
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
