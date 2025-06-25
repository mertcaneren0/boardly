'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProjects, useDeleteProject } from '@/hooks/use-projects'
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Status mapping for API data
const statusMapping = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'ACTIVE', 
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

const statusConfig = {
  PLANNING: { label: 'Planlama', color: 'bg-gray-100 text-gray-800', icon: Clock },
  ACTIVE: { label: 'Aktif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  IN_PROGRESS: { label: 'Aktif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  ON_HOLD: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  COMPLETED: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-800', icon: AlertCircle },
}

const priorityConfig = {
  HIGH: { label: 'Yüksek', color: 'bg-red-100 text-red-800' },
  MEDIUM: { label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
  LOW: { label: 'Düşük', color: 'bg-green-100 text-green-800' },
}

export default function ProjectsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Fetch projects with filters
  const { data: projects = [], isLoading, error } = useProjects({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    search: searchTerm || undefined,
  })

  const deleteProjectMutation = useDeleteProject()

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Projeler" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout title="Projeler" subtitle="Hata oluştu">
        <div className="text-center py-12">
          <p className="text-red-600">Projeler yüklenirken hata oluştu: {error.message}</p>
        </div>
      </DashboardLayout>
    )
  }

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <DashboardLayout 
      title="Projeler" 
      subtitle={`${filteredProjects.length} proje görüntüleniyor`}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="PLANNING">Planlama</SelectItem>
                  <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                  <SelectItem value="ON_HOLD">Beklemede</SelectItem>
                  <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                  <SelectItem value="CANCELLED">İptal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Öncelik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  <SelectItem value="HIGH">Yüksek</SelectItem>
                  <SelectItem value="MEDIUM">Orta</SelectItem>
                  <SelectItem value="LOW">Düşük</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={() => router.push('/dashboard/projeler/yeni')}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Proje
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => {
            const statusInfo = statusConfig[project.status as keyof typeof statusConfig]
            const priorityInfo = priorityConfig[project.priority as keyof typeof priorityConfig]

            return (
              <Card 
                key={project.id} 
                className="card-neon hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/projeler/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {project.clientName || 'Müşteri belirtilmemiş'}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/projeler/${project.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
                              deleteProjectMutation.mutate(project.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || 'Açıklama bulunmuyor'}
                  </p>

                  {/* Status and Priority */}
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={statusInfo?.color || 'bg-gray-100 text-gray-800'}>
                      {statusInfo?.icon && <statusInfo.icon className="h-3 w-3 mr-1" />}
                      {statusInfo?.label || project.status}
                    </Badge>
                    <Badge variant="secondary" className={priorityInfo?.color || 'bg-gray-100 text-gray-800'}>
                      {priorityInfo?.label || project.priority}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">İlerleme</span>
                      <span className="font-medium">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(project.progress || 0)}`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium">
                        {project.budget ? `₺${project.budget.toLocaleString()}` : '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">Bütçe</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium">1</div>
                      <div className="text-xs text-muted-foreground">Ekip</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium">
                        {project.endDate 
                          ? new Date(project.endDate).toLocaleDateString('tr-TR', { 
                              day: '2-digit', 
                              month: '2-digit' 
                            })
                          : '-'
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">Deadline</div>
                    </div>
                  </div>

                  {/* Task Count */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Görevler</span>
                    <span className="text-sm font-medium">
                      {project.tasksCompleted || 0}/{project.tasksTotal || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Proje bulunamadı</h3>
            <p className="text-muted-foreground mb-4">
              Arama kriterlerinize uygun proje bulunmuyor.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setPriorityFilter('all')
            }}>
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 