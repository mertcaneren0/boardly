'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface Quote {
  id: string
  quoteNumber: string
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'
  issueDate: string
  validUntil: string
  total: number
  client: {
    companyName: string
    contactName: string
  }
  project?: string
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const statusLabels = {
  DRAFT: 'Taslak',
  SENT: 'Gönderildi',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
}

const statusIcons = {
  DRAFT: ClockIcon,
  SENT: DocumentTextIcon,
  APPROVED: CheckCircleIcon,
  REJECTED: XCircleIcon,
}

export default function QuotesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
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
    const mockQuotes: Quote[] = [
      {
        id: '1',
        quoteNumber: 'TEK-2024-001',
        status: 'APPROVED',
        issueDate: '2024-01-15',
        validUntil: '2024-02-15',
        total: 25000,
        client: {
          companyName: 'TechCorp',
          contactName: 'Ahmet Yılmaz',
        },
        project: 'E-ticaret Web Sitesi',
      },
      {
        id: '2',
        quoteNumber: 'TEK-2024-002',
        status: 'SENT',
        issueDate: '2024-01-20',
        validUntil: '2024-02-20',
        total: 15000,
        client: {
          companyName: 'FashionBrand',
          contactName: 'Mehmet Kaya',
        },
        project: 'Sosyal Medya Kampanyası',
      },
      {
        id: '3',
        quoteNumber: 'TEK-2024-003',
        status: 'DRAFT',
        issueDate: '2024-01-25',
        validUntil: '2024-02-25',
        total: 8000,
        client: {
          companyName: 'StartupXYZ',
          contactName: 'Ayşe Demir',
        },
      },
      {
        id: '4',
        quoteNumber: 'TEK-2024-004',
        status: 'REJECTED',
        issueDate: '2024-01-10',
        validUntil: '2024-02-10',
        total: 12000,
        client: {
          companyName: 'OldCompany',
          contactName: 'Fatma Özkan',
        },
      },
    ]
    
    setQuotes(mockQuotes)
    setLoading(false)
  }, [])

  const filteredQuotes = quotes.filter(quote => {
    if (filter === 'all') return true
    return quote.status === filter
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
            <h1 className="text-2xl font-bold text-gray-900">Teklifler & Sözleşmeler</h1>
            <p className="mt-1 text-sm text-gray-500">
              Müşterilerinize teklifler hazırlayın ve takip edin
            </p>
          </div>
          <Link
            href="/quotes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Yeni Teklif
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
            onClick={() => setFilter('DRAFT')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'DRAFT'
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Taslak
          </button>
          <button
            onClick={() => setFilter('SENT')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'SENT'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gönderildi
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'APPROVED'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Onaylandı
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              filter === 'REJECTED'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reddedildi
          </button>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredQuotes.map((quote) => {
            const StatusIcon = statusIcons[quote.status]
            return (
              <li key={quote.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {quote.quoteNumber}
                          </p>
                          <div className="ml-2 flex items-center">
                            <StatusIcon className="h-4 w-4 mr-1" />
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status]}`}
                            >
                              {statusLabels[quote.status]}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {quote.client.companyName} - {quote.client.contactName}
                        </p>
                        {quote.project && (
                          <p className="text-sm text-gray-400 truncate">
                            {quote.project}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {quote.total.toLocaleString('tr-TR')} ₺
                        </p>
                        <p className="text-sm text-gray-500">
                          Geçerlilik: {new Date(quote.validUntil).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/quotes/${quote.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        {quote.status === 'DRAFT' && (
                          <Link
                            href={`/quotes/${quote.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Teklif bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Seçili filtrelere uygun teklif bulunmuyor.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Teklif
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {quotes.length}
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
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Onaylanan
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {quotes.filter(q => q.status === 'APPROVED').length}
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
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bekleyen
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {quotes.filter(q => q.status === 'SENT').length}
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
                <XCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reddedilen
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {quotes.filter(q => q.status === 'REJECTED').length}
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