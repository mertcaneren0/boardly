'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckSquare,
  Clock,
  Star,
  MoreHorizontal,
  UserPlus,
  Settings,
} from 'lucide-react'

// Mock team data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@boardly.app',
    role: 'Frontend Developer',
    department: 'Geliştirme',
    status: 'active',
    joinDate: '2024-01-15',
    location: 'İstanbul',
    phone: '+90 532 123 4567',
    avatar: null,
    skills: ['React', 'TypeScript', 'CSS'],
    currentProjects: ['E-Ticaret Sitesi', 'Mobil Uygulama'],
    completedTasks: 24,
    activeTasks: 3,
    lastActive: '2024-06-25T10:30:00',
  },
  {
    id: '2',
    name: 'Elif Kaya',
    email: 'elif@boardly.app',
    role: 'UI/UX Designer',
    department: 'Tasarım',
    status: 'active',
    joinDate: '2024-02-01',
    location: 'Ankara',
    phone: '+90 533 987 6543',
    avatar: null,
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    currentProjects: ['Kurumsal Website'],
    completedTasks: 18,
    activeTasks: 2,
    lastActive: '2024-06-25T09:15:00',
  },
  {
    id: '3',
    name: 'Mehmet Özkan',
    email: 'mehmet@boardly.app',
    role: 'Backend Developer',
    department: 'Geliştirme',
    status: 'active',
    joinDate: '2023-11-10',
    location: 'İzmir',
    phone: '+90 534 456 7890',
    avatar: null,
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    currentProjects: ['E-Ticaret Sitesi', 'Mobil Uygulama'],
    completedTasks: 31,
    activeTasks: 4,
    lastActive: '2024-06-25T11:45:00',
  },
  {
    id: '4',
    name: 'Ayşe Demir',
    email: 'ayse@boardly.app',
    role: 'Project Manager',
    department: 'Yönetim',
    status: 'active',
    joinDate: '2023-09-05',
    location: 'İstanbul',
    phone: '+90 535 789 0123',
    avatar: null,
    skills: ['Scrum', 'Jira', 'Leadership'],
    currentProjects: ['E-Ticaret Sitesi', 'Kurumsal Website'],
    completedTasks: 42,
    activeTasks: 6,
    lastActive: '2024-06-25T08:20:00',
  },
  {
    id: '5',
    name: 'Can Şahin',
    email: 'can@boardly.app',
    role: 'DevOps Engineer',
    department: 'Geliştirme',
    status: 'inactive',
    joinDate: '2024-03-20',
    location: 'Bursa',
    phone: '+90 536 012 3456',
    avatar: null,
    skills: ['AWS', 'Kubernetes', 'CI/CD'],
    currentProjects: [],
    completedTasks: 8,
    activeTasks: 0,
    lastActive: '2024-06-20T16:30:00',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  vacation: 'bg-blue-100 text-blue-800',
}

const statusLabels = {
  active: 'Aktif',
  inactive: 'Pasif',
  vacation: 'İzinli',
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [activeTab, setActiveTab] = useState('all')

  // Filter team members
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !departmentFilter || member.department === departmentFilter
    const matchesStatus = !statusFilter || member.status === statusFilter
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && member.status === 'active') ||
                      (activeTab === 'inactive' && member.status !== 'active')
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesTab
  })

  const clearFilters = () => {
    setSearchTerm('')
    setDepartmentFilter('')
    setStatusFilter('')
  }

  // Calculate stats
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length
  const totalTasks = mockTeamMembers.reduce((sum, m) => sum + m.activeTasks, 0)
  const completedTasks = mockTeamMembers.reduce((sum, m) => sum + m.completedTasks, 0)
  const departments = [...new Set(mockTeamMembers.map(m => m.department))].length

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
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

  return (
    <DashboardLayout title="Ekip" subtitle="Takım üyelerinizi yönetin ve performanslarını takip edin">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTeamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeMembers} aktif üye
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departman</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments}</div>
              <p className="text-xs text-muted-foreground">
                Farklı departman
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Görevler</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                Devam eden görevler
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                Bu ay tamamlanan görevler
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ekip üyelerinde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Departman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Departmanlar</SelectItem>
                <SelectItem value="Geliştirme">Geliştirme</SelectItem>
                <SelectItem value="Tasarım">Tasarım</SelectItem>
                <SelectItem value="Yönetim">Yönetim</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
                <SelectItem value="vacation">İzinli</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || departmentFilter || statusFilter) && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Filtreleri Temizle
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Üye Ekle
            </Button>
          </div>
        </div>

        {/* Team Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tümü ({mockTeamMembers.length})</TabsTrigger>
            <TabsTrigger value="active">
              Aktif ({mockTeamMembers.filter(m => m.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Pasif ({mockTeamMembers.filter(m => m.status !== 'active').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredMembers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar || undefined} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={statusColors[member.status as keyof typeof statusColors]}
                          >
                            {statusLabels[member.status as keyof typeof statusLabels]}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{member.email}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{member.location}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Katılım: {new Date(member.joinDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Son aktivite: {formatLastActive(member.lastActive)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">{member.completedTasks}</div>
                            <div className="text-xs text-muted-foreground">Tamamlanan</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">{member.activeTasks}</div>
                            <div className="text-xs text-muted-foreground">Devam Eden</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Yetenekler</div>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {member.currentProjects.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Aktif Projeler</div>
                          <div className="space-y-1">
                            {member.currentProjects.map((project, index) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                • {project}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="h-4 w-4 mr-1" />
                          Mesaj
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Ara
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Ekip üyesi bulunamadı</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || departmentFilter || statusFilter
                      ? 'Arama kriterlerinize uygun ekip üyesi bulunamadı.'
                      : 'Henüz hiç ekip üyesi eklenmemiş.'}
                  </p>
                  {(searchTerm || departmentFilter || statusFilter) ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Filtreleri Temizle
                    </Button>
                  ) : (
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      İlk Ekip Üyenizi Ekleyin
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 