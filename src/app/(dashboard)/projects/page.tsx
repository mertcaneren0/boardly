'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  PlusIcon,
  FolderIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

interface Project {
  id: string
  name: string
  description: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'ON_HOLD'
  startDate: string
  endDate: string
  budget: number
  client: {
    companyName: string
  }
  progress: number
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
}

const statusLabels = {
  ACTIVE: 'Aktif',
  COMPLETED: 'Tamamlandı',
  ARCHIVED: 'Arşivlendi',
  ON_HOLD: 'Beklemede',
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Mock data - gerçek uygulamada API'den gelecek
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'E-ticaret Web Sitesi',
        description: 'Modern ve kullanıcı dostu e-ticaret platformu',
        status: 'ACTIVE',
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        budget: 25000,
        client: { companyName: 'TechCorp' },
        progress: 65,
      },
      {
        id: '2',
        name: 'Logo Tasarımı',
        description: 'Kurumsal kimlik ve logo tasarımı',
        status: 'COMPLETED',
        startDate: '2024-01-01',
        endDate: '2024-01-20',
        budget: 5000,
        client: { companyName: 'StartupXYZ' },
        progress: 100,
      },
      {
        id: '3',
        name: 'Sosyal Medya Kampanyası',
        description: 'Instagram ve Facebook reklam kampanyası',
        status: 'ACTIVE',
        startDate: '2024-02-01',
        endDate: '2024-04-01',
        budget: 15000,
        client: { companyName: 'FashionBrand' },
        progress: 30,
      },
    ]
    
    setProjects(mockProjects)
    setLoading(false)
  }, [])

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
            <p className="mt-1 text-sm text-gray-500">
              Tüm projelerinizi görüntüleyin ve yönetin
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Proje
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'COMPLETED'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tamamlandı
          </button>
          <button
            onClick={() => setFilter('ON_HOLD')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'ON_HOLD'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Beklemede
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FolderIcon className="h-8 w-8 text-indigo-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project.client.companyName}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}
                >
                  {statusLabels[project.status]}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>İlerleme</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString('tr-TR')} -{' '}
                    {new Date(project.endDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  <span>{project.budget.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex space-x-3">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Görüntüle
                </Link>
                <Link
                  href={`/projects/${project.id}/tasks`}
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Görevler
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Proje bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Seçili filtrelere uygun proje bulunmuyor.
          </p>
        </div>
      )}
    </div>
  )
} 