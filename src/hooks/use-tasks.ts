import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  createdAt: string
  updatedAt: string
  projectId: string
  assigneeId?: string
  creatorId: string
  project: {
    id: string
    name: string
    status: string
  }
  assignee?: {
    id: string
    name: string
    email: string
  }
}

export interface CreateTaskData {
  title: string
  description?: string
  projectId: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate?: string
  assigneeId?: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string
}

// Fetch all tasks
export function useTasks(filters?: {
  projectId?: string
  status?: string
  priority?: string
}) {
  const params = new URLSearchParams()
  if (filters?.projectId) params.append('projectId', filters.projectId)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)

  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const url = `/api/tasks${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      return data.tasks as Task[]
    },
  })
}

// Fetch single task
export function useTask(taskId: string) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }
      const data = await response.json()
      return data.task as Task
    },
    enabled: !!taskId,
  })
}

// Create task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create task')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
    },
  })
}

// Update task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateTaskData) => {
      const response = await fetch(`/api/tasks/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update task')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
    },
  })
}

// Delete task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete task')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
    },
  })
} 