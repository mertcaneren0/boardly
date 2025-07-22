'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ReportData {
  monthlyRevenue: Array<{ month: string; revenue: number }>
  projectStatus: Array<{ status: string; count: number; color: string }>
  timeTracking: Array<{ user: string; hours: number }>
  topClients: Array<{ client: string; revenue: number }>
}

export default function ReportsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  useEffect(() => {
    // Mock data - gerçek uygulamada API'den gelecek
    const mockData: ReportData = {
      monthlyRevenue: [
        { month: 'Oca', revenue: 45000 },
        { month: 'Şub', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Nis', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Haz', revenue: 67000 },
      ],
      projectStatus: [
        { status: 'Aktif', count: 8, color: '#10B981' },
        { status: 'Tamamlandı', count: 12, color: '#3B82F6' },
        { status: 'Beklemede', count: 3, color: '#F59E0B' },
        { status: 'Arşivlendi', count: 5, color: '#6B7280' },
      ],
      timeTracking: [
        { user: 'Ayşe Demir', hours: 156 },
        { user: 'Mehmet Kaya', hours: 142 },
        { user: 'Selin Özkan', hours: 128 },
        { user: 'Ahmet Yılmaz', hours: 134 },
      ],
      topClients: [
        { client: 'TechCorp', revenue: 75000 },
        { client: 'FashionBrand', revenue: 45000 },
        { client: 'StartupXYZ', revenue: 15000 },
        { client: 'OldCompany', revenue: 8000 },
      ],
    }
    
    setReportData(mockData)
    setLoading(false)
  }, [])

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const totalRevenue = reportData.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0)
  const totalProjects = reportData.projectStatus.reduce((sum, item) => sum + item.count, 0)
  const totalHours = reportData.timeTracking.reduce((sum, item) => sum + item.hours, 0)
  const avgRevenuePerMonth = totalRevenue / reportData.monthlyRevenue.length

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Performans metriklerinizi ve analizlerinizi görüntüleyin
            </p>
          </div>
          <div className="flex space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="7">Son 7 gün</option>
              <option value="30">Son 30 gün</option>
              <option value="90">Son 90 gün</option>
              <option value="365">Son 1 yıl</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              PDF İndir
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Gelir
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalRevenue.toLocaleString('tr-TR')} ₺
                  </dd>
                  <dd className="text-sm text-green-600 flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    +12% geçen aya göre
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
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Proje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalProjects}
                  </dd>
                  <dd className="text-sm text-blue-600 flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    +3 yeni proje
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
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Saat
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalHours}h
                  </dd>
                  <dd className="text-sm text-yellow-600 flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    +8% verimlilik
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
                <ChartBarIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aylık Ortalama
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {avgRevenuePerMonth.toLocaleString('tr-TR')} ₺
                  </dd>
                  <dd className="text-sm text-purple-600 flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    +15% artış
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aylık Gelir Trendi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString('tr-TR')} ₺`} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Proje Durumları</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.projectStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportData.projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Tracking */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Zaman Takibi</h3>
          <div className="space-y-4">
            {reportData.timeTracking.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-indigo-600">
                      {item.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.user}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">{item.hours}h</span>
                  <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(item.hours / Math.max(...reportData.timeTracking.map(t => t.hours))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">En İyi Müşteriler</h3>
          <div className="space-y-4">
            {reportData.topClients.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-green-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.client}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {item.revenue.toLocaleString('tr-TR')} ₺
                  </span>
                  <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.revenue / Math.max(...reportData.topClients.map(c => c.revenue))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 