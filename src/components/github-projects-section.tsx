import { motion, useInView } from "framer-motion"
import { Github, Star, GitFork, Eye, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGitHubRepos, type GitHubRepo } from "@/hooks/use-github-repos"
import { useRef } from "react"

function ProjectCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      Java: "#b07219",
      React: "#61dafb",
      Vue: "#4FC08D",
      CSS: "#1572B6",
      HTML: "#e34c26",
    }
    return colors[language || ""] || "#6b7280"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Github className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground font-montserrat truncate">{repo.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 font-open-sans leading-relaxed">
                {repo.description || "Sin descripción disponible"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Language and Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {repo.language && (
              <Badge
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: getLanguageColor(repo.language),
                  color: getLanguageColor(repo.language),
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                {repo.language}
              </Badge>
            )}
            {repo.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{repo.forks_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{repo.watchers_count}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <Calendar className="w-3 h-3" />
            <span>Actualizado {formatDate(repo.updated_at)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 hover:bg-primary/10 hover:border-primary/50 bg-transparent transform hover:scale-105 transition-all duration-300"
            >
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                Código
              </a>
            </Button>
            {repo.homepage && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 hover:bg-secondary/10 hover:border-secondary/50 bg-transparent transform hover:scale-105 transition-all duration-300"
              >
                <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Demo
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-80">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
              <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                <div className="h-6 bg-muted rounded w-12 animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="h-4 bg-muted rounded w-8 animate-pulse" />
                <div className="h-4 bg-muted rounded w-8 animate-pulse" />
                <div className="h-4 bg-muted rounded w-8 animate-pulse" />
              </div>
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
                <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function GitHubProjectsSection() {
  const { repos, loading, error, refetch } = useGitHubRepos("octocat", 6)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-200px" })

  return (
    <section ref={ref} id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-montserrat">Proyectos Destacados</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-open-sans leading-relaxed">
            Una selección de mis proyectos más recientes en GitHub, con estadísticas en tiempo real y tecnologías
            utilizadas
          </p>
        </motion.div>

        {/* GitHub Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {!loading && (
            <>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary font-montserrat">{repos.length}</div>
                <div className="text-sm text-muted-foreground">Proyectos Activos</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary font-montserrat">
                  {new Set(repos.map((repo) => repo.language).filter(Boolean)).size}
                </div>
                <div className="text-sm text-muted-foreground">Tecnologías</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary font-montserrat">
                  {
                    repos.filter(
                      (repo) => repo.updated_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Actualizados (30d)</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary font-montserrat">
                  {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Stars</div>
              </div>
            </>
          )}
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-muted-foreground mb-4">Error al cargar los repositorios: {error}</p>
            <Button onClick={refetch} variant="outline">
              Reintentar
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {repos.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            asChild
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            <a
              href="https://github.com/octocat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              Ver todos mis proyectos
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
