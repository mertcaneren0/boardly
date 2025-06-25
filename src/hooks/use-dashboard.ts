import { useQuery } from '@tanstack/react-query'

export interface DashboardStats {
  projects: {
    total: number
    active: number
    completed: number
    planning: number
  }
  tasks: {
    total: number
    completed: number
    inProgress: number
    todo: number
    today: number
  }
  budget: {
    total: number
    used: number
    percentage: number
  }
  upcomingDeadlines: Array<{
    id: string
    status: string
    dueDate: string
    priority: string
  }>
  recentActivities: Array<{
    id: string
    type: string
    title: string
    time: string
    icon: string
    projectId?: string
  }>
  todaysTasks: Array<{
    projectName: string
    projectId: string
    tasks: Array<{
      id: string
      title: string
      priority: string
      time: string
      completed: boolean
    }>
  }>
}

// Fetch dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      const data = await response.json()
      return data.stats as DashboardStats
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
} 