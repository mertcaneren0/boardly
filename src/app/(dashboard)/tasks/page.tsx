'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  DocumentTextIcon,
  XMarkIcon,
  FolderIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string
  assignee: {
    name: string
    avatar?: string
  }
  project: {
    name: string
  }
  estimatedHours: number
  actualHours: number
  createdAt: string
  tags: string[]
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800 border-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DONE: 'bg-green-100 text-green-800 border-green-200',
}

const statusLabels = {
  TODO: 'Yapılacak',
  IN_PROGRESS: 'Devam Ediyor',
  IN_REVIEW: 'İncelemede',
  DONE: 'Tamamlandı',
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800 border-gray-200',
  MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENT: 'bg-red-100 text-red-800 border-red-200',
}

const priorityLabels = {
  LOW: 'Düşük',
  MEDIUM: 'Orta',
  HIGH: 'Yüksek',
  URGENT: 'Acil',
}

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  useEffect(() => {
    // Mock data
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Logo Tasarımı',
        description: 'Kurumsal logo tasarımı ve varyasyonları',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: '2024-01-20',
        assignee: { name: 'Ayşe Demir' },
        project: { name: 'Brand Identity' },
        estimatedHours: 8,
        actualHours: 6,
        createdAt: '2024-01-15',
        tags: ['Tasarım', 'Logo']
      },
      {
        id: '2',
        title: 'Mobil Uygulama Testleri',
        description: 'iOS ve Android uygulama testleri',
        status: 'TODO',
        priority: 'URGENT',
        dueDate: '2024-01-25',
        assignee: { name: 'Can Yıldız' },
        project: { name: 'Mobile App' },
        estimatedHours: 10,
        actualHours: 0,
        createdAt: '2024-01-18',
        tags: ['Test', 'Mobil']
      },
      {
        id: '3',
        title: 'Müşteri Sunumu Hazırlama',
        description: 'Q1 raporu için müşteri sunumu',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2024-01-28',
        assignee: { name: 'Zeynep Kaya' },
        project: { name: 'Client Relations' },
        estimatedHours: 4,
        actualHours: 2,
        createdAt: '2024-01-20',
        tags: ['Sunum', 'Rapor']
      },
      {
        id: '4',
        title: 'Sosyal Medya İçerikleri',
        description: 'Instagram ve Facebook için içerik üretimi',
        status: 'IN_REVIEW',
        priority: 'MEDIUM',
        dueDate: '2024-02-10',
        assignee: { name: 'Selin Özkan' },
        project: { name: 'Digital Marketing' },
        estimatedHours: 12,
        actualHours: 10,
        createdAt: '2024-01-22',
        tags: ['Sosyal Medya', 'İçerik']
      },
      {
        id: '5',
        title: 'Ana Sayfa Tasarımı',
        description: 'E-ticaret sitesi ana sayfa tasarımı',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2024-02-15',
        assignee: { name: 'Mehmet Kaya' },
        project: { name: 'E-commerce Website' },
        estimatedHours: 16,
        actualHours: 8,
        createdAt: '2024-01-25',
        tags: ['Web Tasarım', 'UI/UX']
      },
      {
        id: '6',
        title: 'Veritabanı Optimizasyonu',
        description: 'Performans iyileştirmeleri ve indeksleme',
        status: 'TODO',
        priority: 'LOW',
        dueDate: '2024-03-01',
        assignee: { name: 'Ahmet Yılmaz' },
        project: { name: 'Backend Development' },
        estimatedHours: 6,
        actualHours: 0,
        createdAt: '2024-01-28',
        tags: ['Backend', 'Optimizasyon']
      }
    ]
    setTasks(mockTasks)
    setLoading(false)
  }, [])

  // Benzersiz atanan kişileri al
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee.name)))

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const statusMatch = filter === 'all' || task.status === filter
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter
      const assigneeMatch = assigneeFilter === 'all' || task.assignee.name === assigneeFilter
      const searchMatch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Tarih filtresi
      let dateMatch = true
      if (dateFilter !== 'all') {
        const taskDate = new Date(task.dueDate)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)
        
        switch (dateFilter) {
          case 'today':
            dateMatch = taskDate.toDateString() === today.toDateString()
            break
          case 'tomorrow':
            dateMatch = taskDate.toDateString() === tomorrow.toDateString()
            break
          case 'this_week':
            dateMatch = taskDate >= today && taskDate <= nextWeek
            break
          case 'overdue':
            dateMatch = taskDate < today
            break
        }
      }
      
      return statusMatch && priorityMatch && assigneeMatch && searchMatch && dateMatch
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case 'priority':
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length
  }

  const getPriorityCount = (priority: string) => {
    return tasks.filter(task => task.priority === priority).length
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredAndSortedTasks.map(task => task.id))
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const clearAllFilters = () => {
    setFilter('all')
    setPriorityFilter('all')
    setAssigneeFilter('all')
    setSearchTerm('')
    setDateFilter('all')
  }

  const activeFiltersCount = [
    filter !== 'all',
    priorityFilter !== 'all',
    assigneeFilter !== 'all',
    searchTerm !== '',
    dateFilter !== 'all'
  ].filter(Boolean).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-80">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Görev ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'kanban' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ViewColumnsIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dueDate">Teslim Tarihi</option>
                  <option value="priority">Öncelik</option>
                  <option value="createdAt">Oluşturulma</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                </button>
              </div>

              {/* Active Filters Indicator */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {activeFiltersCount} filtre aktif
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <XMarkIcon className="h-3 w-3 mr-1" />
                    Temizle
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              {/* Add Task Button */}
              <Link
                href="/tasks/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Yeni Görev
              </Link>

              <div className="text-sm text-gray-600">
                {filteredAndSortedTasks.length} görev bulundu
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Bulk Actions */}
          {selectedTasks.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedTasks.length} görev seçildi
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Toplu Güncelle
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="h-full overflow-y-auto">
            {viewMode === 'list' ? (
              <div className="bg-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedTasks.length === filteredAndSortedTasks.length && filteredAndSortedTasks.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {filteredAndSortedTasks.length} görev
                      </span>
                    </div>
                    <Link
                      href="/tasks/new"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Yeni Görev
                    </Link>
                  </div>
                </div>
                
                {/* Compact Task List */}
                <div className="divide-y divide-gray-200">
                  {filteredAndSortedTasks.map((task) => (
                    <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        {/* Checkbox and Status */}
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => handleTaskSelect(task.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            {task.status === 'DONE' ? (
                              <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckIcon className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                            )}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                              {statusLabels[task.status]}
                            </span>
                          </div>
                        </div>
                        
                        {/* Task Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {task.title}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                              {priorityLabels[task.priority]}
                            </span>
                            {isOverdue(task.dueDate) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Gecikmiş
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {task.description}
                          </p>
                        </div>
                        
                        {/* Assignee */}
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-white">
                              {getInitials(task.assignee.name)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900 truncate">
                            {task.assignee.name}
                          </span>
                        </div>
                        
                        {/* Due Date */}
                        <div className="flex items-center space-x-2 min-w-0">
                          <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className={`text-sm ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        
                        {/* Project */}
                        <div className="flex items-center space-x-2 min-w-0">
                          <FolderIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {task.project.name}
                          </span>
                        </div>
                        
                        {/* Time */}
                        <div className="flex items-center space-x-2 min-w-0">
                          <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {task.estimatedHours}h/{task.actualHours}h
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Görüntüle"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button 
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Düzenle"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Sil"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Empty State */}
                {filteredAndSortedTasks.length === 0 && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Görev bulunamadı</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Seçili filtrelere uygun görev bulunmuyor.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Kanban View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-6">
                {(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const).map((status) => (
                  <div key={status} className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{statusLabels[status]}</h3>
                        <span className="text-sm text-gray-500">
                          {filteredAndSortedTasks.filter(task => task.status === status).length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                      {filteredAndSortedTasks
                        .filter(task => task.status === status)
                        .map((task) => (
                          <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {task.title}
                              </h4>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                                {priorityLabels[task.priority]}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{task.assignee.name}</span>
                              <span>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredAndSortedTasks.length === 0 && (
              <div className="text-center py-12 bg-white">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Görev bulunamadı</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Seçili filtrelere uygun görev bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col fixed right-0 top-0 h-full z-10">
        {/* Filters */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
          
          {/* Date Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Tarih</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Tümü' },
                { value: 'today', label: 'Bugün' },
                { value: 'tomorrow', label: 'Yarın' },
                { value: 'this_week', label: 'Bu Hafta' },
                { value: 'overdue', label: 'Gecikmiş' }
              ].map((date) => (
                <button
                  key={date.value}
                  onClick={() => setDateFilter(date.value)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    dateFilter === date.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {date.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Durum
            </h4>
            <div className="space-y-2">
              {['all', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : statusLabels[status as keyof typeof statusLabels]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Öncelik</h4>
            <div className="space-y-2">
              {['all', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    priorityFilter === priority
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority === 'all' ? 'Tümü' : priorityLabels[priority as keyof typeof priorityLabels]}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Atanan Kişi</h4>
            <div className="space-y-2">
              <button
                onClick={() => setAssigneeFilter('all')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  assigneeFilter === 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tümü
              </button>
              {uniqueAssignees.map((assignee) => (
                <button
                  key={assignee}
                  onClick={() => setAssigneeFilter(assignee)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    assigneeFilter === assignee
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {assignee}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 