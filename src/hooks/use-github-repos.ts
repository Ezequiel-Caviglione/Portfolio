import { useState, useEffect } from "react"

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
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

export function useGitHubRepos(username = "octocat", limit = 6): UseGitHubReposReturn {
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

      // Filter out forks and sort by stars + recent activity
      const filteredRepos = data
        .filter((repo) => !repo.full_name.includes("/") || repo.stargazers_count > 0)
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
