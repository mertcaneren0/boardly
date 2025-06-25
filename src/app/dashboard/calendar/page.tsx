'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  FileText,
  Filter,
} from 'lucide-react'

// Mock calendar events
const mockEvents = [
  {
    id: '1',
    title: 'Müşteri Toplantısı - ABC Şirketi',
    type: 'meeting',
    date: '2024-06-25',
    time: '10:00',
    duration: 60,
    location: 'Ofis',
    attendees: ['John Doe', 'Jane Smith'],
    project: 'E-Ticaret Sitesi',
    description: 'Proje ilerlemesi ve son teslim tarihi görüşmesi',
  },
  {
    id: '2',
    title: 'UI Tasarım Review',
    type: 'review',
    date: '2024-06-25',
    time: '14:30',
    duration: 90,
    location: 'Online',
    attendees: ['Design Team'],
    project: 'Mobil Uygulama',
    description: 'Mobil uygulama arayüz tasarımlarının gözden geçirilmesi',
  },
  {
    id: '3',
    title: 'Sprint Planning',
    type: 'planning',
    date: '2024-06-26',
    time: '09:00',
    duration: 120,
    location: 'Toplantı Odası',
    attendees: ['Dev Team', 'Product Owner'],
    project: 'Kurumsal Website',
    description: 'Gelecek sprint için görev planlaması',
  },
  {
    id: '4',
    title: 'Code Review Session',
    type: 'review',
    date: '2024-06-26',
    time: '16:00',
    duration: 60,
    location: 'Online',
    attendees: ['Senior Developers'],
    project: 'E-Ticaret Sitesi',
    description: 'Backend API kod incelemesi',
  },
  {
    id: '5',
    title: 'Proje Sunumu',
    type: 'presentation',
    date: '2024-06-27',
    time: '11:00',
    duration: 45,
    location: 'Müşteri Ofisi',
    attendees: ['Client Team', 'Project Manager'],
    project: 'Mobil Uygulama',
    description: 'İlk versiyon demo sunumu',
  },
  {
    id: '6',
    title: 'Teknik Dokümantasyon',
    type: 'task',
    date: '2024-06-28',
    time: '13:00',
    duration: 180,
    location: 'Ofis',
    attendees: ['Tech Writer'],
    project: 'Kurumsal Website',
    description: 'API dokümantasyonu hazırlama',
  },
]

const eventTypeColors = {
  meeting: 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  planning: 'bg-green-100 text-green-800',
  presentation: 'bg-orange-100 text-orange-800',
  task: 'bg-gray-100 text-gray-800',
}

const eventTypeLabels = {
  meeting: 'Toplantı',
  review: 'İnceleme',
  planning: 'Planlama',
  presentation: 'Sunum',
  task: 'Görev',
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [eventFilter, setEventFilter] = useState<string>('')

  // Get current week dates
  const getCurrentWeekDates = () => {
    const startOfWeek = new Date(selectedDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startOfWeek.setDate(diff)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getCurrentWeekDates()

  // Filter events for current view
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return mockEvents.filter(event => {
      const matchesDate = event.date === dateStr
      const matchesFilter = !eventFilter || event.type === eventFilter
      return matchesDate && matchesFilter
    })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

  const todayEvents = getEventsForDate(new Date())
  const upcomingEvents = mockEvents
    .filter(event => new Date(event.date) > new Date())
    .slice(0, 5)

  return (
    <DashboardLayout title="Takvim" subtitle="Etkinliklerinizi ve toplantılarınızı yönetin">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {weekDates[0].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - {' '}
                {weekDates[6].toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
              Bugün
            </Button>

            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Etkinlik Türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="meeting">Toplantı</SelectItem>
                <SelectItem value="review">İnceleme</SelectItem>
                <SelectItem value="planning">Planlama</SelectItem>
                <SelectItem value="presentation">Sunum</SelectItem>
                <SelectItem value="task">Görev</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Gün</SelectItem>
                <SelectItem value="week">Hafta</SelectItem>
                <SelectItem value="month">Ay</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Etkinlik
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bugün</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Etkinlik planlandı
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weekDates.reduce((total, date) => total + getEventsForDate(date).length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Toplam etkinlik
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplantılar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockEvents.filter(e => e.type === 'meeting').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Bu ay toplam
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yaklaşan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Gelecek etkinlikler
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Haftalık Görünüm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {/* Week Header */}
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                    <div key={day} className="p-2 text-center font-medium text-sm border-b">
                      <div>{day}</div>
                      <div className="text-lg font-bold mt-1">
                        {weekDates[index].getDate()}
                      </div>
                    </div>
                  ))}
                  
                  {/* Week Events */}
                  {weekDates.map((date, index) => {
                    const dayEvents = getEventsForDate(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    
                    return (
                      <div key={index} className={`p-2 min-h-[200px] border rounded-lg ${
                        isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                      }`}>
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 mb-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow ${
                              eventTypeColors[event.type as keyof typeof eventTypeColors]
                            }`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bugünkü Etkinlikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={eventTypeColors[event.type as keyof typeof eventTypeColors]}
                        >
                          {eventTypeLabels[event.type as keyof typeof eventTypeLabels]}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Bugün için etkinlik yok
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yaklaşan Etkinlikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className={eventTypeColors[event.type as keyof typeof eventTypeColors]}
                      >
                        {eventTypeLabels[event.type as keyof typeof eventTypeLabels]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                      <span className="mx-2">•</span>
                      <span>{event.project}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 