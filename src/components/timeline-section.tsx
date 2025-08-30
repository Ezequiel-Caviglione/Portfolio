"use client"

import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRef, useState } from "react"
import { useTranslation } from "@/i18n/useTranslation"

interface TimelineItem {
  id: string
  technologies: string[]
  type: "work" | "education" | "project"
}

const timelineData: TimelineItem[] = [
  {
    id: "1",
    technologies: ["Angular", "Python", "Django", "TypeScript"],
    type: "work",
  },
  {
    id: "2",
    technologies: ["Java", "Python", "C", "SQL", "Git", "NextJS", "Testing", "Metodologías ágiles", "Análisis de requerimientos", "Planificación de proyectos"],
    type: "education",
  },
]

function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { t } = useTranslation()

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
    return t(`timeline.types.${type}`, "💼")
  }

  // Get translated data for this timeline item
  const itemData = {
    title: t(`timelineData.${item.id}.title`, ""),
    company: t(`timelineData.${item.id}.company`, ""),
    location: t(`timelineData.${item.id}.location`, ""),
    period: t(`timelineData.${item.id}.period`, ""),
    description: t(`timelineData.${item.id}.description`, ""),
    achievements: [
      t(`timelineData.${item.id}.achievements.0`, ""),
      t(`timelineData.${item.id}.achievements.1`, ""),
      t(`timelineData.${item.id}.achievements.2`, ""),
      t(`timelineData.${item.id}.achievements.3`, ""),
    ].filter(achievement => achievement !== "")
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="flex items-start gap-4 md:gap-8"
    >
      {/* Timeline Dot */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
          className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${getTypeColor(item.type)} border-2 md:border-4 border-background shadow-lg z-10`}
        />
        {index < timelineData.length - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
            className="w-0.5 bg-border absolute top-4 md:top-6 h-full"
          />
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1">
        <Card className="border-2 border-border hover:border-primary/50 transition-colors duration-300">
          <CardContent className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl md:text-2xl">{getTypeIcon(item.type)}</span>
                  <h3 className="text-lg md:text-xl font-bold text-foreground font-montserrat">{itemData.title}</h3>
                </div>
                <p className="text-base md:text-lg font-semibold text-primary mb-1">{itemData.company}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{itemData.period}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{itemData.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-foreground mb-4 font-open-sans leading-relaxed">{itemData.description}</p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {t(`technologies.${tech}`, tech)}
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
              {isExpanded ? t("timeline.viewLess") : t("timeline.viewMore")}
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
                <h4 className="font-semibold text-foreground mb-3 font-montserrat">{t("timeline.achievements")}</h4>
                <ul className="space-y-2">
                  {itemData.achievements.map((achievement, i) => (
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
    </motion.div>
  )
}

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-200px" })
  const { t } = useTranslation()

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
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-montserrat">{t("timeline.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-open-sans leading-relaxed">
            {t("timeline.subtitle")}
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
            {t("timeline.viewProjects")}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
