import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get demo user ID from database
async function getDemoUserId() {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@boardly.app' }
  })
  return demoUser?.id || null
}

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    // Get project statistics
    const projects = await prisma.project.findMany({
      where: { ownerId: demoUserId },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
            priority: true,
          }
        },
        _count: {
          select: {
            tasks: true,
            files: true,
          }
        }
      }
    })

    // Calculate stats
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
    
    // Task statistics
    const allTasks = projects.flatMap(p => p.tasks)
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.status === 'DONE').length
    const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS').length
    const todoTasks = allTasks.filter(t => t.status === 'TODO').length
    
    // Today's tasks (tasks due today or overdue)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todaysTasks = allTasks.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= todayStart && dueDate <= today
    })

    // Budget calculations (mock for now)
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    const budgetUsed = totalBudget * 0.65 // Mock 65% usage

    // Upcoming deadlines (next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    const upcomingDeadlines = allTasks
      .filter(task => {
        if (!task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return dueDate > today && dueDate <= nextWeek
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5)

    // Recent activity (mock based on recent projects/tasks)
    const recentProjects = projects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)

    const recentActivities = [
      ...recentProjects.map(project => ({
        id: `project-${project.id}`,
        type: 'project',
        title: `${project.name} projesi güncellendi`,
        time: formatTimeAgo(project.updatedAt),
        icon: 'FolderOpen',
        projectId: project.id,
      })),
      // Add completed tasks as activities
      ...allTasks
        .filter(task => task.status === 'DONE')
        .slice(0, 2)
        .map(task => ({
          id: `task-${task.id}`,
          type: 'task',
          title: 'Görev tamamlandı',
          time: '1 gün önce', // Mock time
          icon: 'CheckSquare',
        }))
    ].slice(0, 5)

    const stats = {
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        planning: projects.filter(p => p.status === 'PLANNING').length,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
        today: todaysTasks.length,
      },
      budget: {
        total: totalBudget,
        used: budgetUsed,
        percentage: totalBudget > 0 ? Math.round((budgetUsed / totalBudget) * 100) : 0,
      },
      upcomingDeadlines,
      recentActivities,
      todaysTasks: groupTasksByProject(todaysTasks, projects),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} saat önce`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} gün önce`
  }
}

function groupTasksByProject(tasks: any[], projects: any[]) {
  const grouped = new Map()

  tasks.forEach(task => {
    const project = projects.find(p => p.tasks.some((t: any) => t.id === task.id))
    if (project) {
      if (!grouped.has(project.id)) {
        grouped.set(project.id, {
          projectName: project.name,
          projectId: project.id,
          tasks: []
        })
      }
      
      // Format due date for display
      const dueTime = task.dueDate ? 
        new Date(task.dueDate).toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : 'Belirsiz'

      grouped.get(project.id).tasks.push({
        id: task.id,
        title: task.title || 'Başlıksız görev',
        priority: task.priority?.toLowerCase() || 'medium',
        time: dueTime,
        completed: task.status === 'DONE',
      })
    }
  })

  return Array.from(grouped.values())
} 