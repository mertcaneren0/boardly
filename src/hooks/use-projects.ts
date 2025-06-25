import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  startDate?: string
  endDate?: string
  budget?: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  progress: number
  tasksCompleted: number
  tasksTotal: number
  owner: {
    name: string
    image?: string
  }
  _count: {
    tasks: number
    files: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateProjectData {
  name: string
  slug: string
  description?: string
  status?: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  startDate?: string
  endDate?: string
  budget?: number
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Fetch projects
export function useProjects(filters?: {
  status?: string
  priority?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.priority) params.append('priority', filters.priority)
      if (filters?.search) params.append('search', filters.search)

      const response = await fetch(`/api/projects?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      return data.projects as Project[]
    },
  })
}

// Fetch single project
export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      const data = await response.json()
      return data.project
    },
    enabled: !!id,
  })
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create project')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectData }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update project')
      }

      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    },
  })
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete project')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
} 