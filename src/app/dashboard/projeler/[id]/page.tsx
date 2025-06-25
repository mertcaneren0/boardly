'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  FolderOpen,
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  FileText,
  MessageSquare,
  Settings,
  Target,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react'

// Mock project data
const mockProject = {
  id: '1',
  name: 'E-Ticaret Sitesi',
  description: 'Modern ve responsive e-ticaret platformu geliştirme projesi. Kullanıcı dostu arayüz, güvenli ödeme sistemi ve kapsamlı admin paneli içermektedir.',
  status: 'ACTIVE',
  priority: 'HIGH',
  budget: 25000,
  spent: 16250,
  progress: 65,
  deadline: '2024-03-15',
  startDate: '2024-01-10',
  client: {
    name: 'TechCorp Ltd.',
    email: 'contact@techcorp.com',
    phone: '+90 555 123 4567',
    avatar: null
  },
  teamSize: 4,
  createdAt: '2024-01-10',
  tags: ['React', 'Next.js', 'E-commerce', 'TypeScript'],
  tasks: {
    total: 24,
    completed: 16,
    inProgress: 5,
    pending: 3
  },
  files: {
    total: 18,
    documents: 8,
    images: 6,
    other: 4
  }
}

const mockTasks = [
  {
    id: 1,
    title: 'Ana sayfa tasarımı',
    status: 'COMPLETED',
    assignee: 'Ahmet Yılmaz',
    createdBy: 'Proje Yöneticisi',
    createdDate: '2024-01-10',
    dueDate: '2024-01-15',
    priority: 'HIGH'
  },
  {
    id: 2,
    title: 'Ürün katalog sayfası',
    status: 'IN_PROGRESS',
    assignee: 'Elif Kaya',
    createdBy: 'Ahmet Yılmaz',
    createdDate: '2024-01-12',
    dueDate: '2024-02-01',
    priority: 'MEDIUM'
  },
  {
    id: 3,
    title: 'Ödeme sistemi entegrasyonu',
    status: 'PENDING',
    assignee: 'Mehmet Demir',
    createdBy: 'Proje Yöneticisi',
    createdDate: '2024-01-15',
    dueDate: '2024-02-15',
    priority: 'HIGH'
  },
  {
    id: 4,
    title: 'Admin panel geliştirme',
    status: 'IN_PROGRESS',
    assignee: 'Ayşe Öztürk',
    createdBy: 'Mehmet Demir',
    createdDate: '2024-01-18',
    dueDate: '2024-02-20',
    priority: 'MEDIUM'
  },
  {
    id: 5,
    title: 'Mobil responsive optimizasyon',
    status: 'PENDING',
    assignee: 'Can Arslan',
    createdBy: 'Elif Kaya',
    createdDate: '2024-01-20',
    dueDate: '2024-03-01',
    priority: 'LOW'
  }
]

const mockTeamMembers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    role: 'Frontend Developer',
    email: 'ahmet@company.com',
    avatar: null,
    tasksCount: 8
  },
  {
    id: 2,
    name: 'Elif Kaya',
    role: 'UI/UX Designer',
    email: 'elif@company.com', 
    avatar: null,
    tasksCount: 6
  },
  {
    id: 3,
    name: 'Mehmet Demir',
    role: 'Backend Developer',
    email: 'mehmet@company.com',
    avatar: null,
    tasksCount: 7
  },
  {
    id: 4,
    name: 'Ayşe Öztürk',
    role: 'Project Manager',
    email: 'ayse@company.com',
    avatar: null,
    tasksCount: 3
  }
]

const statusConfig = {
  ACTIVE: { label: 'Aktif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  ON_HOLD: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  COMPLETED: { label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

const taskStatusConfig = {
  COMPLETED: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
  IN_PROGRESS: { label: 'Devam Ediyor', color: 'bg-blue-100 text-blue-800' },
  PENDING: { label: 'Bekliyor', color: 'bg-gray-100 text-gray-800' }
}

const priorityConfig = {
  HIGH: { label: 'Yüksek', color: 'bg-red-100 text-red-800' },
  MEDIUM: { label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
  LOW: { label: 'Düşük', color: 'bg-green-100 text-green-800' }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  
  const project = mockProject // In real app, fetch by params.id
  const statusInfo = statusConfig[project.status as keyof typeof statusConfig]
  const completionRate = Math.round((project.tasks.completed / project.tasks.total) * 100)
  const budgetUsage = Math.round((project.spent / project.budget) * 100)

  return (
    <DashboardLayout 
      title={project.name}
      subtitle={`${project.client.name} • ${statusInfo.label}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Paylaş
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </Button>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">İlerleme</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <Progress value={project.progress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {project.tasks.completed}/{project.tasks.total} görev tamamlandı
              </p>
            </CardContent>
          </Card>

          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bütçe</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{project.spent.toLocaleString()}</div>
              <Progress value={budgetUsage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                ₺{project.budget.toLocaleString()} bütçenin %{budgetUsage}'i
              </p>
            </CardContent>
          </Card>

          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ekip</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.teamSize}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Aktif ekip üyesi
              </p>
            </CardContent>
          </Card>

          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deadline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(project.deadline).toLocaleDateString('tr-TR', { 
                  day: '2-digit', 
                  month: '2-digit' 
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="tasks">Görevler</TabsTrigger>
            <TabsTrigger value="team">Ekip</TabsTrigger>
            <TabsTrigger value="files">Dosyalar</TabsTrigger>
            <TabsTrigger value="activity">Aktivite</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-1 space-y-6">
                {/* Project Description */}
                <Card className="card-neon">
                  <CardHeader>
                    <CardTitle>Proje Açıklaması</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Client Info */}
                <Card className="card-neon">
                  <CardHeader>
                    <CardTitle>Müşteri Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {project.client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{project.client.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.client.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{project.client.phone}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mesaj Gönder
                    </Button>
                  </CardContent>
                </Card>

                {/* Project Stats */}
                <Card className="card-neon">
                  <CardHeader>
                    <CardTitle>Proje İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Başlangıç Tarihi</span>
                      <span className="text-sm font-medium">
                        {new Date(project.startDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Toplam Görev</span>
                      <span className="text-sm font-medium">{project.tasks.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Toplam Dosya</span>
                      <span className="text-sm font-medium">{project.files.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Durum</span>
                      <Badge variant="secondary" className={statusInfo.color}>
                        <statusInfo.icon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                {/* Tasks */}
                <Card className="card-neon-glow">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Görevler</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Görev Ekle
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockTasks.map((task) => {
                        const statusInfo = taskStatusConfig[task.status as keyof typeof taskStatusConfig]
                        const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig]
                        
                        return (
                          <div key={task.id} className="border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-lg">{task.title}</h4>
                                <div className="flex gap-2">
                                  <Badge variant="secondary" className={priorityInfo.color}>
                                    {priorityInfo.label}
                                  </Badge>
                                  <Badge variant="secondary" className={statusInfo.color}>
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Atanan Kişi</p>
                                  <p className="font-medium">{task.assignee}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Tanımlayan</p>
                                  <p className="font-medium">{task.createdBy}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Veriliş Tarihi</p>
                                  <p className="font-medium">
                                    {new Date(task.createdDate).toLocaleDateString('tr-TR')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Deadline</p>
                                  <p className="font-medium">
                                    {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Proje Görevleri</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Görev
              </Button>
            </div>
            
            <div className="grid gap-4">
              {mockTasks.map((task) => {
                const statusInfo = taskStatusConfig[task.status as keyof typeof taskStatusConfig]
                const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig]
                
                return (
                  <Card key={task.id} className="card-neon">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Atanan: {task.assignee} • Deadline: {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                          <Badge variant="secondary" className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Ekip Üyeleri</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Üye Ekle
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {mockTeamMembers.map((member) => (
                <Card key={member.id} className="card-neon">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {member.name.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.tasksCount}</div>
                        <div className="text-xs text-muted-foreground">görev</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Proje Dosyaları</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Dosya Yükle
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium">Dökümanlar</h4>
                  <p className="text-2xl font-bold mt-2">{project.files.documents}</p>
                  <p className="text-sm text-muted-foreground">dosya</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium">Görseller</h4>
                  <p className="text-2xl font-bold mt-2">{project.files.images}</p>
                  <p className="text-sm text-muted-foreground">dosya</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium">Diğer</h4>
                  <p className="text-2xl font-bold mt-2">{project.files.other}</p>
                  <p className="text-sm text-muted-foreground">dosya</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <h3 className="text-lg font-medium">Son Aktiviteler</h3>
            
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  type: 'task',
                  message: 'Ahmet Yılmaz "Ana sayfa tasarımı" görevini tamamladı',
                  time: '2 saat önce',
                  icon: CheckCircle
                },
                {
                  id: 2,
                  type: 'comment',
                  message: 'Elif Kaya proje hakkında yorum ekledi',
                  time: '4 saat önce',
                  icon: MessageSquare
                },
                {
                  id: 3,
                  type: 'file',
                  message: 'Mehmet Demir yeni dosya yükledi: wireframe.pdf',
                  time: '1 gün önce',
                  icon: FileText
                },
                {
                  id: 4,
                  type: 'milestone',
                  message: 'Proje %50 tamamlanma oranına ulaştı',
                  time: '2 gün önce',
                  icon: TrendingUp
                }
              ].map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-muted rounded-md">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 