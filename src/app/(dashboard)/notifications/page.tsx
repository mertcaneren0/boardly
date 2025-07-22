'use client'

import { useSession } from 'next-auth/react'
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function NotificationsPage() {
  const { data: session } = useSession()

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Proje Tamamlandı',
      message: 'E-ticaret Web Sitesi projesi başarıyla tamamlandı.',
      time: '2 saat önce',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Görev Teslim Tarihi',
      message: '3 görevin teslim tarihi yaklaşıyor.',
      time: '4 saat önce',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Yeni Müşteri',
      message: 'TechCorp şirketi sisteme eklendi.',
      time: '6 saat önce',
      read: true,
    },
    {
      id: 4,
      type: 'success',
      title: 'Ödeme Alındı',
      message: 'Mobil Uygulama projesi için ödeme alındı.',
      time: '1 gün önce',
      read: true,
    },
    {
      id: 5,
      type: 'warning',
      title: 'Sistem Bakımı',
      message: 'Sistem bakımı 2 saat sürecek.',
      time: '2 gün önce',
      read: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BellIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Bildirimler</h1>
              <p className="text-gray-600 text-sm">
                {unreadCount} okunmamış bildirim
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Tümünü Okundu İşaretle
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Notifications List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tüm Bildirimler</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                            <XMarkIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {notifications.length === 0 && (
              <div className="p-12 text-center">
                <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim Yok</h3>
                <p className="text-gray-600">Henüz hiç bildiriminiz bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 