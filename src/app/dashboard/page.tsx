'use client'

import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotesList } from '@/components/notes'
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, usePinNote, useArchiveNote } from '@/hooks/notes/use-notes'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { useProjects } from '@/hooks/use-projects'
import { CreateNoteData, UpdateNoteData } from '@/types'
import {
  FolderOpen,
  CheckSquare,
  CreditCard,
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Activity,
  Folder,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react'

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

const iconMap = {
  FolderOpen,
  CheckSquare,
  CreditCard,
  Users,
  Activity,
}

export default function DashboardPage() {
  const router = useRouter()
  
  // API hooks
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: projects = [] } = useProjects()
  
  // Notes hooks
  const { data: notes = [], isLoading: notesLoading } = useNotes()
  const createNoteMutation = useCreateNote()
  const updateNoteMutation = useUpdateNote()
  const deleteNoteMutation = useDeleteNote()
  const pinNoteMutation = usePinNote()
  const archiveNoteMutation = useArchiveNote()

  const handleCreateNote = async (data: CreateNoteData) => {
    await createNoteMutation.mutateAsync(data)
  }

  const handleUpdateNote = async (data: UpdateNoteData) => {
    await updateNoteMutation.mutateAsync(data)
  }

  const handleDeleteNote = async (noteId: string) => {
    await deleteNoteMutation.mutateAsync(noteId)
  }

  const handlePinNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      await pinNoteMutation.mutateAsync({ id: noteId, isPinned: !note.isPinned })
    }
  }

  const handleArchiveNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      await archiveNoteMutation.mutateAsync({ id: noteId, isArchived: !note.isArchived })
    }
  }

  // Loading state
  if (statsLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Hoş geldiniz">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (statsError) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Hata oluştu">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Dashboard verileri yüklenirken hata oluştu</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Yeniden Dene
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const stats = dashboardStats || {
    projects: { total: 0, active: 0, completed: 0, planning: 0 },
    tasks: { total: 0, completed: 0, inProgress: 0, todo: 0, today: 0 },
    budget: { total: 0, used: 0, percentage: 0 },
    upcomingDeadlines: [],
    recentActivities: [],
    todaysTasks: [],
  }

  // Generate dashboard stats cards
  const statsCards = [
    {
      title: 'Aktif Projeler',
      value: stats.projects.active.toString(),
      change: `${stats.projects.total} toplam`,
      changeType: 'neutral' as const,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Devam Eden Görevler',
      value: stats.tasks.inProgress.toString(),
      change: `${stats.tasks.completed} tamamlandı`,
      changeType: 'positive' as const,
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Toplam Bütçe',
      value: `₺${stats.budget.total.toLocaleString()}`,
      change: `%${stats.budget.percentage} kullanıldı`,
      changeType: stats.budget.percentage > 80 ? 'negative' as const : 'positive' as const,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Bugünkü Görevler',
      value: stats.tasks.today.toString(),
      change: `${stats.tasks.todo} bekliyor`,
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <DashboardLayout title="Dashboard" subtitle="Hoş geldiniz">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="card-neon">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Tasks */}
          <div className="lg:col-span-2">
            <Card className="card-neon-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Bugünkü Görevler</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('tr-TR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => router.push('/dashboard/tasks')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Görev Ekle
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {stats.todaysTasks.length > 0 ? (
                  stats.todaysTasks.map((project, projectIndex) => (
                    <div key={projectIndex} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{project.projectName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tamamlandı
                        </span>
                      </div>
                      <div className="space-y-2">
                        {project.tasks.map((task) => (
                          <div 
                            key={task.id}
                            className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                className="rounded border-gray-300"
                                readOnly
                              />
                              <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 ml-auto">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                              >
                                {task.priority === 'high' ? 'Yüksek' : 
                                 task.priority === 'medium' ? 'Orta' : 'Düşük'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{task.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Bugün için planlanmış görev bulunmuyor</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card className="card-neon">
              <CardHeader>
                <CardTitle className="text-lg">Son Aktiviteler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity) => {
                    const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Activity
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Henüz aktivite bulunmuyor
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-neon">
              <CardHeader>
                <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/projeler/yeni')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Proje
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/tasks/new')}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Görev Ekle
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/notes/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Not Ekle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notes Section */}
        <Card className="card-neon-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Son Notlar</CardTitle>
                <CardDescription>
                  Yakın zamanda eklenen notlarınız
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                onClick={() => router.push('/dashboard/notes')}
              >
                Tümünü Gör
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {notesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <NotesList
                notes={notes.slice(0, 3)} // Show only first 3 notes
                onCreateNote={handleCreateNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onPinNote={handlePinNote}
                onArchiveNote={handleArchiveNote}
                isLoading={notesLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 