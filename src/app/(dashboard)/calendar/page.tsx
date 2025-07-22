'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'task' | 'project' | 'meeting' | 'deadline'
  priority: 'low' | 'medium' | 'high'
  project?: string
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

  useEffect(() => {
    // Mock events - gerçek uygulamada API'den gelecek
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Logo Tasarımı Teslim',
        date: '2024-01-20',
        type: 'deadline',
        priority: 'high',
        project: 'Logo Tasarımı',
      },
      {
        id: '2',
        title: 'Müşteri Toplantısı',
        date: '2024-01-25',
        type: 'meeting',
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Ana Sayfa Tasarımı',
        date: '2024-02-15',
        type: 'task',
        priority: 'high',
        project: 'E-ticaret Web Sitesi',
      },
      {
        id: '4',
        title: 'Proje Sunumu',
        date: '2024-02-20',
        type: 'meeting',
        priority: 'medium',
      },
    ]
    setEvents(mockEvents)
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-blue-500'
      case 'project': return 'bg-green-500'
      case 'meeting': return 'bg-purple-500'
      case 'deadline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500'
      case 'medium': return 'border-yellow-500'
      case 'low': return 'border-green-500'
      default: return 'border-gray-300'
    }
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Takvim</h1>
            <p className="mt-1 text-sm text-gray-500">
              Projelerinizi ve görevlerinizi takvimde görüntüleyin
            </p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Etkinlik
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: tr })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Bugün
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>
          ))}

          {/* Calendar Days */}
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDate(day)
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <div
                key={day.toString()}
                className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? 'text-indigo-600'
                        : isCurrentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {dayEvents.length} etkinlik
                    </span>
                  )}
                </div>

                {/* Events */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)} text-white`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} daha
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {format(selectedDate, 'd MMMM yyyy, EEEE', { locale: tr })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className={`p-3 border-l-4 rounded-r-lg ${getPriorityColor(event.priority)} bg-gray-50`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    {event.project && (
                      <p className="text-sm text-gray-500">{event.project}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)} text-white`}
                    >
                      {event.type === 'task' && 'Görev'}
                      {event.type === 'project' && 'Proje'}
                      {event.type === 'meeting' && 'Toplantı'}
                      {event.type === 'deadline' && 'Teslim'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.priority === 'high' ? 'bg-red-100 text-red-800' :
                        event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {event.priority === 'high' ? 'Yüksek' :
                       event.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {getEventsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>Bu tarihte etkinlik bulunmuyor</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Modal (Placeholder) */}
      {showEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Etkinlik</h3>
              <p className="text-sm text-gray-500 mb-4">
                Bu özellik yakında eklenecek...
              </p>
              <button
                onClick={() => setShowEventModal(false)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 