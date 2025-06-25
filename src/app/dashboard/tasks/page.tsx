'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTasks } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react'

const priorityColors = {
  HIGH: 'bg-red-100 text-red-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW: 'bg-green-100 text-green-800',
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
}

const priorityLabels = {
  HIGH: 'Yüksek',
  MEDIUM: 'Orta',
  LOW: 'Düşük',
}

const statusLabels = {
  TODO: 'Yapılacak',
  IN_PROGRESS: 'Devam Ediyor',
  DONE: 'Tamamlandı',
}

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [projectFilter, setProjectFilter] = useState<string>('')

  const { data: tasks = [], isLoading, error } = useTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    projectId: projectFilter || undefined,
  })

  const { data: projects = [] } = useProjects()

  // Filter tasks by search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setPriorityFilter('')
    setProjectFilter('')
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Görevler" subtitle="Tüm görevlerinizi görüntüleyin ve yönetin">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Görevler" subtitle="Hata oluştu">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Görevler yüklenirken hata oluştu</p>
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

  return (
    <DashboardLayout title="Görevler" subtitle="Tüm görevlerinizi görüntüleyin ve yönetin">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Görevlerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Durumlar</SelectItem>
                <SelectItem value="TODO">Yapılacak</SelectItem>
                <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                <SelectItem value="DONE">Tamamlandı</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Öncelik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Öncelikler</SelectItem>
                <SelectItem value="HIGH">Yüksek</SelectItem>
                <SelectItem value="MEDIUM">Orta</SelectItem>
                <SelectItem value="LOW">Düşük</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Proje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Projeler</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || statusFilter || priorityFilter || projectFilter) && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Filtreleri Temizle
              </Button>
            )}
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Görev
          </Button>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="card-neon hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === 'DONE' ? 'bg-green-500' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`} />
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge
                          variant="secondary"
                          className={statusColors[task.status]}
                        >
                          {statusLabels[task.status]}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={priorityColors[task.priority]}
                        >
                          {priorityLabels[task.priority]}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-muted-foreground mb-3">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <CheckSquare className="h-4 w-4" />
                          <span>{task.project.name}</span>
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        )}
                        
                        {task.assignee && (
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{task.assignee.name}</span>
                          </div>
                        )}
                        
                        {task.estimatedHours && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.estimatedHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                      <Button variant="outline" size="sm">
                        Detay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-neon">
            <CardContent className="p-12 text-center">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Görev bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter || priorityFilter || projectFilter
                  ? 'Arama kriterlerinize uygun görev bulunamadı.'
                  : 'Henüz hiç görev oluşturulmamış.'}
              </p>
              {(searchTerm || statusFilter || priorityFilter || projectFilter) ? (
                <Button variant="outline" onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              ) : (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Görevinizi Oluşturun
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
} 