'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  CogIcon,
  BuildingOfficeIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

interface CompanySettings {
  companyName: string
  address: string
  phone: string
  email: string
  website: string
  taxNumber: string
  logo?: string
}

interface UserSettings {
  name: string
  email: string
  avatar?: string
  notifications: {
    email: boolean
    push: boolean
    projectUpdates: boolean
    taskAssignments: boolean
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('company')
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'Creative Agency',
    address: 'İstanbul, Türkiye',
    phone: '+90 555 123 4567',
    email: 'info@creativeagency.com',
    website: 'www.creativeagency.com',
    taxNumber: '1234567890',
  })
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    notifications: {
      email: true,
      push: true,
      projectUpdates: true,
      taskAssignments: true,
    },
  })
  const [loading, setLoading] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  const tabs = [
    { id: 'company', name: 'Şirket Bilgileri', icon: BuildingOfficeIcon },
    { id: 'profile', name: 'Profil Ayarları', icon: UserIcon },
    { id: 'notifications', name: 'Bildirimler', icon: BellIcon },
    { id: 'security', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'templates', name: 'Şablonlar', icon: DocumentTextIcon },
    { id: 'billing', name: 'Faturalama', icon: CurrencyDollarIcon },
  ]

  const handleCompanySave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    // Show success message
  }

  const handleUserSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    // Show success message
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sistem ayarlarınızı yönetin ve yapılandırın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg">
            {activeTab === 'company' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Şirket Bilgileri</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleCompanySave() }}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        value={companySettings.companyName}
                        onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Vergi Numarası
                      </label>
                      <input
                        type="text"
                        value={companySettings.taxNumber}
                        onChange={(e) => setCompanySettings({...companySettings, taxNumber: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <input
                        type="url"
                        value={companySettings.website}
                        onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Adres
                      </label>
                      <textarea
                        rows={3}
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Profil Ayarları</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleUserSave() }}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        value={userSettings.name}
                        onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Bildirim Ayarları</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h4>
                      <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta al</p>
                    </div>
                    <button
                      onClick={() => setUserSettings({
                        ...userSettings,
                        notifications: {...userSettings.notifications, email: !userSettings.notifications.email}
                      })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        userSettings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        userSettings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Bildirimleri</h4>
                      <p className="text-sm text-gray-500">Anlık bildirimler al</p>
                    </div>
                    <button
                      onClick={() => setUserSettings({
                        ...userSettings,
                        notifications: {...userSettings.notifications, push: !userSettings.notifications.push}
                      })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        userSettings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        userSettings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Proje Güncellemeleri</h4>
                      <p className="text-sm text-gray-500">Proje durumu değişikliklerini takip et</p>
                    </div>
                    <button
                      onClick={() => setUserSettings({
                        ...userSettings,
                        notifications: {...userSettings.notifications, projectUpdates: !userSettings.notifications.projectUpdates}
                      })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        userSettings.notifications.projectUpdates ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        userSettings.notifications.projectUpdates ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Görev Atamaları</h4>
                      <p className="text-sm text-gray-500">Yeni görev atamalarını bildir</p>
                    </div>
                    <button
                      onClick={() => setUserSettings({
                        ...userSettings,
                        notifications: {...userSettings.notifications, taskAssignments: !userSettings.notifications.taskAssignments}
                      })}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        userSettings.notifications.taskAssignments ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        userSettings.notifications.taskAssignments ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Güvenlik Ayarları</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Şifre Değiştir</h4>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Şifre Değiştir
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">İki Faktörlü Doğrulama</h4>
                    <p className="text-sm text-gray-500 mb-4">Hesabınızı daha güvenli hale getirin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Etkinleştir
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Oturum Geçmişi</h4>
                    <p className="text-sm text-gray-500 mb-4">Son giriş aktivitelerinizi görüntüleyin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Şablon Yönetimi</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Teklif Şablonları</h4>
                    <p className="text-sm text-gray-500 mb-4">Müşterilerinize göndereceğiniz teklif şablonlarını yönetin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Şablon Oluştur
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Fatura Şablonları</h4>
                    <p className="text-sm text-gray-500 mb-4">Fatura şablonlarınızı özelleştirin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Şablon Oluştur
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">E-posta Şablonları</h4>
                    <p className="text-sm text-gray-500 mb-4">Otomatik e-posta şablonlarınızı düzenleyin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Şablon Oluştur
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Faturalama Ayarları</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Fatura Bilgileri</h4>
                    <p className="text-sm text-gray-500 mb-4">Fatura gönderim bilgilerinizi güncelleyin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Düzenle
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Ödeme Yöntemleri</h4>
                    <p className="text-sm text-gray-500 mb-4">Kabul ettiğiniz ödeme yöntemlerini yönetin</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Yönet
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Vergi Ayarları</h4>
                    <p className="text-sm text-gray-500 mb-4">KDV ve diğer vergi ayarlarınızı yapılandırın</p>
                    <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Yapılandır
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 