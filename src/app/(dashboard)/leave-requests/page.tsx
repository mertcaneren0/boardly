'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  XCircleIcon,
  PlusIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface LeaveRequest {
  id: number
  type: 'vacation' | 'sick' | 'personal' | 'other'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedBy: string
  requestedDate: string
  approvedBy?: string
  approvedDate?: string
  rejectedBy?: string
  rejectedDate?: string
  rejectionReason?: string
}

const leaveTypes = [
  { value: 'vacation', label: 'Tatil İzni', color: 'bg-blue-100 text-blue-800' },
  { value: 'sick', label: 'Hastalık İzni', color: 'bg-red-100 text-red-800' },
  { value: 'personal', label: 'Özel İzin', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: 'Diğer', color: 'bg-gray-100 text-gray-800' },
]

export default function LeaveRequestsPage() {
  const { data: session } = useSession()
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  
  const isAdmin = session?.user?.role === 'ADMIN'

  // Mock data
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      type: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 5,
      reason: 'Yaz tatili için izin talep ediyorum.',
      status: 'pending',
      requestedBy: 'Mehmet Yılmaz',
      requestedDate: '2024-01-10',
    },
    {
      id: 2,
      type: 'sick',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      days: 2,
      reason: 'Grip nedeniyle hastalık izni talep ediyorum.',
      status: 'approved',
      requestedBy: 'Ayşe Demir',
      requestedDate: '2024-01-20',
      approvedBy: 'Admin Kullanıcı',
      approvedDate: '2024-01-22',
    },
    {
      id: 3,
      type: 'personal',
      startDate: '2024-02-01',
      endDate: '2024-02-01',
      days: 1,
      reason: 'Doktor randevusu için yarım gün izin talep ediyorum.',
      status: 'rejected',
      requestedBy: 'Selin Kaya',
      requestedDate: '2024-01-15',
      rejectedBy: 'Admin Kullanıcı',
      rejectedDate: '2024-01-16',
      rejectionReason: 'O tarihte önemli bir proje teslimi var.',
    },
  ])

  const [newRequest, setNewRequest] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const filteredRequests = leaveRequests.filter(request => {
    if (selectedFilter === 'all') return true
    return request.status === selectedFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-warning" />
      case 'approved':
        return <CheckIcon className="h-4 w-4 text-success" />
      case 'rejected':
        return <XCircleIcon className="h-4 w-4 text-error" />
      default:
        return <ClockIcon className="h-4 w-4 text-neutral-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede'
      case 'approved':
        return 'Onaylandı'
      case 'rejected':
        return 'Reddedildi'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'approved':
        return 'bg-success/10 text-success border-success/20'
      case 'rejected':
        return 'bg-error/10 text-error border-error/20'
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200'
    }
  }

  const getTypeInfo = (type: string) => {
    return leaveTypes.find(t => t.value === type) || leaveTypes[3]
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const days = calculateDays(newRequest.startDate, newRequest.endDate)
    
    const request: LeaveRequest = {
      id: Date.now(),
      type: newRequest.type as any,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      days,
      reason: newRequest.reason,
      status: 'pending',
      requestedBy: session?.user?.name || 'Bilinmeyen Kullanıcı',
      requestedDate: new Date().toISOString().split('T')[0],
    }

    setLeaveRequests([request, ...leaveRequests])
    setNewRequest({
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
    })
    setShowNewRequestForm(false)
  }

  const handleApprove = (id: number) => {
    setLeaveRequests(requests =>
      requests.map(request =>
        request.id === id
          ? {
              ...request,
              status: 'approved' as const,
              approvedBy: session?.user?.name || 'Admin',
              approvedDate: new Date().toISOString().split('T')[0],
            }
          : request
      )
    )
  }

  const handleReject = (id: number, reason: string) => {
    setLeaveRequests(requests =>
      requests.map(request =>
        request.id === id
          ? {
              ...request,
              status: 'rejected' as const,
              rejectedBy: session?.user?.name || 'Admin',
              rejectedDate: new Date().toISOString().split('T')[0],
              rejectionReason: reason,
            }
          : request
      )
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">İzin Talepleri</h1>
        <p className="text-neutral-600">
          Tatil, hastalık ve özel izin taleplerinizi yönetin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Toplam Talep</p>
              <p className="text-2xl font-bold text-neutral-900">{leaveRequests.length}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-neutral-400" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Bekleyen</p>
              <p className="text-2xl font-bold text-warning">
                {leaveRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-warning" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Onaylanan</p>
              <p className="text-2xl font-bold text-success">
                {leaveRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <CheckIcon className="h-8 w-8 text-success" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Reddedilen</p>
              <p className="text-2xl font-bold text-error">
                {leaveRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-error" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => setShowNewRequestForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-dark transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Yeni İzin Talebi
        </button>

        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-accent-blue text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {filter === 'all' ? 'Tümü' : 
               filter === 'pending' ? 'Bekleyen' :
               filter === 'approved' ? 'Onaylanan' : 'Reddedilen'}
            </button>
          ))}
        </div>
      </div>

      {/* New Request Form */}
      {showNewRequestForm && (
        <div className="bg-white p-6 rounded-lg border border-neutral-200 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Yeni İzin Talebi</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  İzin Türü
                </label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                >
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={newRequest.startDate}
                  onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={newRequest.endDate}
                  onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Gün Sayısı
                </label>
                <input
                  type="number"
                  value={newRequest.startDate && newRequest.endDate ? calculateDays(newRequest.startDate, newRequest.endDate) : ''}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={newRequest.reason}
                onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                placeholder="İzin talebinizin sebebini açıklayın..."
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue-dark transition-colors"
              >
                Talep Gönder
              </button>
              <button
                type="button"
                onClick={() => setShowNewRequestForm(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">İzin Talepleri</h3>
        </div>
        
        <div className="divide-y divide-neutral-200">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-500">Henüz izin talebi bulunmuyor</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeInfo(request.type).color}`}>
                      {getTypeInfo(request.type).label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  
                  {isAdmin && request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-3 py-1 bg-success text-white text-xs rounded hover:bg-success-dark transition-colors"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Red sebebini girin:')
                          if (reason) handleReject(request.id, reason)
                        }}
                        className="px-3 py-1 bg-error text-white text-xs rounded hover:bg-error-dark transition-colors"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-600">Tarih Aralığı</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {new Date(request.startDate).toLocaleDateString('tr-TR')} - {new Date(request.endDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Gün Sayısı</p>
                    <p className="text-sm font-medium text-neutral-900">{request.days} gün</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Talep Eden</p>
                    <p className="text-sm font-medium text-neutral-900">{request.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Talep Tarihi</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {new Date(request.requestedDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-600">Açıklama</p>
                  <p className="text-sm text-neutral-900">{request.reason}</p>
                </div>
                
                {request.status === 'approved' && (
                  <div className="bg-success/10 p-3 rounded-lg">
                    <p className="text-sm text-success">
                      ✅ {request.approvedBy} tarafından {new Date(request.approvedDate!).toLocaleDateString('tr-TR')} tarihinde onaylandı
                    </p>
                  </div>
                )}
                
                {request.status === 'rejected' && (
                  <div className="bg-error/10 p-3 rounded-lg">
                    <p className="text-sm text-error">
                      ❌ {request.rejectedBy} tarafından {new Date(request.rejectedDate!).toLocaleDateString('tr-TR')} tarihinde reddedildi
                    </p>
                    {request.rejectionReason && (
                      <p className="text-sm text-error mt-1">
                        <strong>Sebep:</strong> {request.rejectionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 