'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CheckSquare,
  Clock,
  FileText,
  PieChart,
  Activity,
  Target,
} from 'lucide-react'

// Mock report data
const projectReports = [
  {
    id: '1',
    name: 'E-Ticaret Sitesi',
    progress: 85,
    budget: 50000,
    spent: 42500,
    tasksCompleted: 24,
    totalTasks: 30,
    teamSize: 4,
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mobil Uygulama',
    progress: 60,
    budget: 35000,
    spent: 21000,
    tasksCompleted: 15,
    totalTasks: 25,
    teamSize: 3,
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    status: 'active',
  },
  {
    id: '3',
    name: 'Kurumsal Website',
    progress: 100,
    budget: 25000,
    spent: 24000,
    tasksCompleted: 20,
    totalTasks: 20,
    teamSize: 2,
    startDate: '2023-11-01',
    endDate: '2024-03-01',
    status: 'completed',
  },
]

const monthlyData = [
  { month: 'Ocak', revenue: 45000, expenses: 12000, projects: 2 },
  { month: 'Şubat', revenue: 52000, expenses: 15000, projects: 3 },
  { month: 'Mart', revenue: 48000, expenses: 13000, projects: 2 },
  { month: 'Nisan', revenue: 61000, expenses: 18000, projects: 4 },
  { month: 'Mayıs', revenue: 55000, expenses: 16000, projects: 3 },
  { month: 'Haziran', revenue: 68000, expenses: 20000, projects: 4 },
]

const teamPerformance = [
  { name: 'Ahmet Yılmaz', completedTasks: 24, hoursWorked: 160, efficiency: 92 },
  { name: 'Elif Kaya', completedTasks: 18, hoursWorked: 140, efficiency: 88 },
  { name: 'Mehmet Özkan', completedTasks: 31, hoursWorked: 180, efficiency: 95 },
  { name: 'Ayşe Demir', completedTasks: 42, hoursWorked: 170, efficiency: 90 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [activeTab, setActiveTab] = useState('overview')

  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0)
  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const totalProjects = projectReports.length
  const activeProjects = projectReports.filter(p => p.status === 'active').length
  const completedProjects = projectReports.filter(p => p.status === 'completed').length

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <DashboardLayout title="Raporlar" subtitle="Proje ve performans raporlarınızı inceleyin">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Haftalık</SelectItem>
                <SelectItem value="monthly">Aylık</SelectItem>
                <SelectItem value="quarterly">Çeyreklik</SelectItem>
                <SelectItem value="yearly">Yıllık</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Proje Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Projeler</SelectItem>
                {projectReports.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Tarih Aralığı
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₺{totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Son 6 ay toplamı
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Kar</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ₺{totalProfit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                %{Math.round((totalProfit / totalRevenue) * 100)} kar marjı
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                {totalProjects} toplam proje
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
              <p className="text-xs text-muted-foreground">
                %{Math.round((completedProjects / totalProjects) * 100)} başarı oranı
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="projects">Proje Raporları</TabsTrigger>
            <TabsTrigger value="financial">Finansal</TabsTrigger>
            <TabsTrigger value="team">Ekip Performansı</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Aylık Gelir Trendi</CardTitle>
                  <CardDescription>Son 6 ayın gelir ve gider karşılaştırması</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{data.month}</span>
                          <span className="font-medium">
                            ₺{(data.revenue - data.expenses).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${(data.revenue / 70000) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${(data.expenses / 25000) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                      <span>Gelir</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                      <span>Gider</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Proje Durumu</CardTitle>
                  <CardDescription>Tüm projelerin genel durumu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectReports.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{project.name}</span>
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                            {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={project.progress} className="flex-1" />
                          <span className={`text-sm font-medium ${getProgressColor(project.progress)}`}>
                            %{project.progress}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{project.tasksCompleted}/{project.totalTasks} görev</span>
                          <span>{project.teamSize} kişi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4">
              {projectReports.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.startDate).toLocaleDateString('tr-TR')} - {' '}
                          {new Date(project.endDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">%{project.progress}</div>
                        <div className="text-xs text-muted-foreground">İlerleme</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getBudgetStatus(project.spent, project.budget)}`}>
                          ₺{project.spent.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ₺{project.budget.toLocaleString()} bütçe
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {project.tasksCompleted}/{project.totalTasks}
                        </div>
                        <div className="text-xs text-muted-foreground">Görevler</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{project.teamSize}</div>
                        <div className="text-xs text-muted-foreground">Ekip Üyesi</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={project.progress} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gelir Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            ₺{data.revenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {data.projects} proje
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gider Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <div className="text-right">
                          <div className="font-medium text-red-600">
                            ₺{data.expenses.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            %{Math.round((data.expenses / data.revenue) * 100)} oranı
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Performance Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4">
              {teamPerformance.map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <Badge variant="secondary">
                        %{member.efficiency} verimlilik
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{member.completedTasks}</div>
                        <div className="text-xs text-muted-foreground">Tamamlanan Görev</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{member.hoursWorked}</div>
                        <div className="text-xs text-muted-foreground">Çalışma Saati</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {(member.completedTasks / member.hoursWorked * 10).toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Görev/Saat</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={member.efficiency} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 