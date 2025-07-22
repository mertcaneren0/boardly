'use client'

import { useSession } from 'next-auth/react'
import {
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { data: session } = useSession()

  // Mock data
  const stats = [
    {
      title: 'Toplam Görev',
      value: '6',
      icon: CheckCircleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Devam Eden',
      value: '2',
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  const teamMembers = [
    { name: 'Ayşe Demir', role: 'UI/UX Designer', avatar: 'AD' },
    { name: 'Mehmet Yılmaz', role: 'Frontend Developer', avatar: 'MY' },
    { name: 'Selin Kaya', role: 'Project Manager', avatar: 'SK' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {session?.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                İyi günler, {session?.user?.name || 'Kullanıcı'}! 👋
              </h1>
              <p className="text-gray-600 text-sm">Bugün neler yapmak istiyorsunuz?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İstatistikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <PlusIcon className="h-4 w-4" />
                Yeni Görev
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <PlusIcon className="h-4 w-4" />
                Yeni Proje
              </button>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Takım Üyeleri</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{member.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                      <PencilIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                      <TrashIcon className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 