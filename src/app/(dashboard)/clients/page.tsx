'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusIcon,
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

interface Client {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
  vkn: string
  isActive: boolean
  projectsCount: number
  totalRevenue: number
  lastContact: string
}

export default function ClientsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  useEffect(() => {
    // Mock data - gerçek uygulamada API'den gelecek
    const mockClients: Client[] = [
      {
        id: '1',
        companyName: 'TechCorp',
        contactName: 'Ahmet Yılmaz',
        email: 'ahmet@techcorp.com',
        phone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        vkn: '1234567890',
        isActive: true,
        projectsCount: 3,
        totalRevenue: 75000,
        lastContact: '2024-01-15',
      },
      {
        id: '2',
        companyName: 'StartupXYZ',
        contactName: 'Ayşe Demir',
        email: 'ayse@startupxyz.com',
        phone: '+90 555 987 6543',
        address: 'Ankara, Türkiye',
        vkn: '0987654321',
        isActive: true,
        projectsCount: 1,
        totalRevenue: 15000,
        lastContact: '2024-01-20',
      },
      {
        id: '3',
        companyName: 'FashionBrand',
        contactName: 'Mehmet Kaya',
        email: 'mehmet@fashionbrand.com',
        phone: '+90 555 456 7890',
        address: 'İzmir, Türkiye',
        vkn: '1122334455',
        isActive: true,
        projectsCount: 2,
        totalRevenue: 45000,
        lastContact: '2024-01-10',
      },
      {
        id: '4',
        companyName: 'OldCompany',
        contactName: 'Fatma Özkan',
        email: 'fatma@oldcompany.com',
        phone: '+90 555 111 2222',
        address: 'Bursa, Türkiye',
        vkn: '5566778899',
        isActive: false,
        projectsCount: 0,
        totalRevenue: 0,
        lastContact: '2023-12-01',
      },
    ]
    
    setClients(mockClients)
    setLoading(false)
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && client.isActive) ||
                         (filter === 'inactive' && !client.isActive)
    
    return matchesSearch && matchesFilter
  })

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
            <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
            <p className="mt-1 text-sm text-gray-500">
              Müşteri bilgilerinizi yönetin ve takip edin
            </p>
          </div>
          <Link
            href="/clients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Müşteri
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 ${
              !client.isActive ? 'opacity-75' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {client.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {client.contactName}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {client.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.projectsCount} proje</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Toplam Gelir:</span>
                  <span className="font-medium text-gray-900">
                    {client.totalRevenue.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Son İletişim:</span>
                  <span className="text-gray-900">
                    {new Date(client.lastContact).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Link
                  href={`/clients/${client.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Görüntüle
                </Link>
                <Link
                  href={`/clients/${client.id}/projects`}
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Projeler
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Müşteri bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Seçili filtrelere uygun müşteri bulunmuyor.
          </p>
        </div>
      )}
    </div>
  )
} 