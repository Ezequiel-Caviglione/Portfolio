import { useState, useEffect } from "react"

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  languages: { name: string; percentage: number }[]
  stargazers_count: number
  forks_count: number
  watchers_count: number
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  visibility: string
}

interface UseGitHubReposReturn {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useGitHubRepos(username = "Ezequiel-Caviglione", limit = 6): UseGitHubReposReturn {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRepos = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user's public repositories
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${limit}&type=public`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data: GitHubRepo[] = await response.json()

      // Fetch languages for each repository
      const reposWithLanguages = await Promise.all(
        data.map(async (repo) => {
          try {
            const languagesResponse = await fetch(
              `https://api.github.com/repos/${repo.full_name}/languages`,
              {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }
            )

            if (languagesResponse.ok) {
              const languagesData = await languagesResponse.json()
              const totalBytes = Object.values(languagesData).reduce((sum: number, bytes: any) => sum + bytes, 0)
              
              // Convert to percentage and get top 5 languages
              const languages = Object.entries(languagesData)
                .map(([name, bytes]: [string, any]) => ({
                  name,
                  percentage: Math.round((bytes / totalBytes) * 100)
                }))
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 5) // Limit to top 5 languages

              return { ...repo, languages }
            } else {
              // Fallback to main language if languages API fails
              return { 
                ...repo, 
                languages: repo.language ? [{ name: repo.language, percentage: 100 }] : []
              }
            }
          } catch (error) {
            console.warn(`Error fetching languages for ${repo.name}:`, error)
            return { 
              ...repo, 
              languages: repo.language ? [{ name: repo.language, percentage: 100 }] : []
            }
          }
        })
      )

      // Filter out forks and sort by stars + recent activity
      const filteredRepos = reposWithLanguages
        .sort((a, b) => {
          // Prioritize repos with more stars and recent updates
          const scoreA = a.stargazers_count * 2 + new Date(a.updated_at).getTime() / 1000000000
          const scoreB = b.stargazers_count * 2 + new Date(b.updated_at).getTime() / 1000000000
          return scoreB - scoreA
        })

      setRepos(filteredRepos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching repositories")
      // Fallback data for demo purposes
      setRepos([
        {
          id: 1,
          name: "portfolio-website",
          full_name: "usuario/portfolio-website",
          description: "Mi portfolio personal construido con Next.js y Framer Motion",
          html_url: "https://github.com/usuario/portfolio-website",
          homepage: "https://miportfolio.com",
          language: "TypeScript",
          languages: [
            { name: "TypeScript", percentage: 65 },
            { name: "CSS", percentage: 20 },
            { name: "JavaScript", percentage: 10 },
            { name: "HTML", percentage: 5 }
          ],
          stargazers_count: 42,
          forks_count: 8,
          watchers_count: 42,
          size: 1024,
          created_at: "2023-01-15T10:00:00Z",
          updated_at: "2024-01-15T15:30:00Z",
          pushed_at: "2024-01-15T15:30:00Z",
          topics: ["nextjs", "framer-motion", "portfolio", "typescript"],
          visibility: "public",
        },
        {
          id: 2,
          name: "ecommerce-platform",
          full_name: "usuario/ecommerce-platform",
          description: "Plataforma de e-commerce completa con React, Node.js y Stripe",
          html_url: "https://github.com/usuario/ecommerce-platform",
          homepage: "https://demo-ecommerce.com",
          language: "JavaScript",
          languages: [
            { name: "JavaScript", percentage: 45 },
            { name: "TypeScript", percentage: 30 },
            { name: "CSS", percentage: 15 },
            { name: "HTML", percentage: 8 },
            { name: "Shell", percentage: 2 }
          ],
          stargazers_count: 128,
          forks_count: 24,
          watchers_count: 128,
          size: 2048,
          created_at: "2023-03-20T14:00:00Z",
          updated_at: "2024-01-10T09:15:00Z",
          pushed_at: "2024-01-10T09:15:00Z",
          topics: ["react", "nodejs", "stripe", "ecommerce"],
          visibility: "public",
        },
        {
          id: 3,
          name: "task-management-app",
          full_name: "usuario/task-management-app",
          description: "Aplicación de gestión de tareas con drag & drop y colaboración en tiempo real",
          html_url: "https://github.com/usuario/task-management-app",
          homepage: null,
          language: "TypeScript",
          languages: [
            { name: "TypeScript", percentage: 70 },
            { name: "SCSS", percentage: 18 },
            { name: "JavaScript", percentage: 8 },
            { name: "HTML", percentage: 4 }
          ],
          stargazers_count: 67,
          forks_count: 12,
          watchers_count: 67,
          size: 1536,
          created_at: "2023-06-10T11:30:00Z",
          updated_at: "2024-01-05T16:45:00Z",
          pushed_at: "2024-01-05T16:45:00Z",
          topics: ["react", "typescript", "dnd", "realtime"],
          visibility: "public",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepos()
  }, [username, limit])

  return {
    repos,
    loading,
    error,
    refetch: fetchRepos,
  }
}
