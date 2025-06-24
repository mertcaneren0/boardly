'use client'

import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotesList } from '@/components/notes'
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, usePinNote, useArchiveNote } from '@/hooks/notes/use-notes'
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
} from 'lucide-react'

// Mock dashboard stats
const stats = [
  {
    title: 'Aktif Projeler',
    value: '8',
    change: '+2',
    changeType: 'positive' as const,
    icon: FolderOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Devam Eden Görevler',
    value: '23',
    change: '+5',
    changeType: 'positive' as const,
    icon: CheckSquare,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Bu Ay Kazanç',
    value: '₺24,580',
    change: '+12%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    title: 'Bekleyen Ödemeler',
    value: '5',
    change: '-2',
    changeType: 'negative' as const,
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
]

// Mock recent activities
const recentActivities = [
  {
    id: 1,
    type: 'project',
    title: 'Website Redesign projesi oluşturuldu',
    time: '2 saat önce',
    icon: FolderOpen,
  },
  {
    id: 2,
    type: 'task',
    title: 'UI Mockup görevi tamamlandı',
    time: '4 saat önce',
    icon: CheckSquare,
  },
  {
    id: 3,
    type: 'payment',
    title: 'ABC Şirketi ödemesi alındı',
    time: '1 gün önce',
    icon: CreditCard,
  },
  {
    id: 4,
    type: 'team',
    title: 'Yeni ekip üyesi eklendi',
    time: '2 gün önce',
    icon: Users,
  },
]

// Mock upcoming deadlines
const upcomingDeadlines = [
  {
    id: 1,
    title: 'Logo Tasarım Teslimi',
    project: 'ABC Şirketi',
    date: '2024-01-15',
    priority: 'high' as const,
  },
  {
    id: 2,
    title: 'Website Mockup Review',
    project: 'XYZ Startup',
    date: '2024-01-18',
    priority: 'medium' as const,
  },
  {
    id: 3,
    title: 'Son Ödeme Hatırlatması',
    project: 'DEF Ajans',
    date: '2024-01-20',
    priority: 'low' as const,
  },
]

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

export default function DashboardPage() {
  // Notes hooks
  const { data: notes = [], isLoading } = useNotes()
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

  return (
    <DashboardLayout title="Dashboard" subtitle="Projelerin ve görevlerin genel bakışı">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  {' '}geçen aya göre
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activities */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    <activity.icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                Tümünü Gör
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Yaklaşan Son Tarihler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {deadline.project}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(deadline.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <Badge variant="secondary" className={priorityColors[deadline.priority]}>
                    {deadline.priority === 'high' && 'Yüksek'}
                    {deadline.priority === 'medium' && 'Orta'}
                    {deadline.priority === 'low' && 'Düşük'}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                Takvimi Aç
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Proje
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <CheckSquare className="h-4 w-4 mr-2" />
                Görev Ekle
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Ödeme Kaydet
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rapor Oluştur
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Son Notlar</CardTitle>
              <Button variant="outline" size="sm">
                Tümünü Gör
              </Button>
            </div>
            <CardDescription>
              Dashboard notlarınız - proje notları projeler sayfasında görünür
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotesList
              notes={notes.slice(0, 6)} // Show only first 6 notes
              title=""
              showCreateButton={true}
              onCreateNote={handleCreateNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onPinNote={handlePinNote}
              onArchiveNote={handleArchiveNote}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 