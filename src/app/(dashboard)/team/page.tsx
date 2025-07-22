'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  CogIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'TEAM_MEMBER'
  avatar?: string
  isActive: boolean
  joinDate: string
  projectsCount: number
  tasksCount: number
  totalHours: number
}

export default function TeamPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  useEffect(() => {
    // Mock data - gerçek uygulamada API'den gelecek
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@creativeagency.com',
        role: 'ADMIN',
        isActive: true,
        joinDate: '2023-01-15',
        projectsCount: 5,
        tasksCount: 12,
        totalHours: 156,
      },
      {
        id: '2',
        name: 'Ayşe Demir',
        email: 'ayse@creativeagency.com',
        role: 'TEAM_MEMBER',
        isActive: true,
        joinDate: '2023-03-20',
        projectsCount: 3,
        tasksCount: 8,
        totalHours: 142,
      },
      {
        id: '3',
        name: 'Mehmet Kaya',
        email: 'mehmet@creativeagency.com',
        role: 'TEAM_MEMBER',
        isActive: true,
        joinDate: '2023-06-10',
        projectsCount: 4,
        tasksCount: 10,
        totalHours: 128,
      },
      {
        id: '4',
        name: 'Selin Özkan',
        email: 'selin@creativeagency.com',
        role: 'TEAM_MEMBER',
        isActive: false,
        joinDate: '2023-02-05',
        projectsCount: 0,
        tasksCount: 0,
        totalHours: 0,
      },
    ]
    
    setTeamMembers(mockTeamMembers)
    setLoading(false)
  }, [])

  const filteredMembers = teamMembers.filter(member => {
    if (filter === 'all') return true
    if (filter === 'active') return member.isActive
    if (filter === 'inactive') return !member.isActive
    return member.role === filter
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    return role === 'ADMIN' ? 'Yönetici' : 'Takım Üyesi'
  }

  const getRoleColor = (role: string) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Takım Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-500">
              Takım üyelerinizi yönetin ve performanslarını takip edin
            </p>
          </div>
          <Link
            href="/team/invite"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Üye Davet Et
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
            onClick={() => setFilter('active')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'inactive'
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pasif
          </button>
          <button
            onClick={() => setFilter('ADMIN')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'ADMIN'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Yöneticiler
          </button>
          <button
            onClick={() => setFilter('TEAM_MEMBER')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'TEAM_MEMBER'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Takım Üyeleri
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 ${
              !member.isActive ? 'opacity-75' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-medium text-indigo-600">
                        {getInitials(member.name)}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getRoleLabel(member.role)}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}
                >
                  {getRoleLabel(member.role)}
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center">
                  <UserCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Katılım: {new Date(member.joinDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{member.projectsCount}</p>
                    <p className="text-xs text-gray-500">Proje</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{member.tasksCount}</p>
                    <p className="text-xs text-gray-500">Görev</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{member.totalHours}h</p>
                    <p className="text-xs text-gray-500">Saat</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Link
                  href={`/team/${member.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Görüntüle
                </Link>
                <button className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                  <CogIcon className="h-4 w-4 mx-auto" />
                </button>
                {member.id !== session?.user?.id && (
                  <button className="flex-1 bg-red-100 text-red-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-red-200 transition-colors">
                    <TrashIcon className="h-4 w-4 mx-auto" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Takım üyesi bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Seçili filtrelere uygun takım üyesi bulunmuyor.
          </p>
        </div>
      )}

      {/* Team Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Üye
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktif Üye
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers.filter(m => m.isActive).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Yönetici
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers.filter(m => m.role === 'ADMIN').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Takım Üyesi
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teamMembers.filter(m => m.role === 'TEAM_MEMBER').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 