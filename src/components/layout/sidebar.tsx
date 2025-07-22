'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  HomeIcon,
  FolderIcon,
  CheckCircleIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, role: 'all' },
  { name: 'Projeler', href: '/projects', icon: FolderIcon, role: 'all' },
  { name: 'Görevler', href: '/tasks', icon: CheckCircleIcon, role: 'all' },
  { name: 'Takvim', href: '/calendar', icon: CalendarIcon, role: 'all' },
  { name: 'İzin Talepleri', href: '/leave-requests', icon: ClipboardDocumentListIcon, role: 'all' },
  { name: 'Müşteriler', href: '/clients', icon: UsersIcon, role: 'ADMIN' },
  { name: 'Teklifler & Sözleşmeler', href: '/quotes', icon: DocumentTextIcon, role: 'ADMIN' },
  { name: 'Finans', href: '/finance', icon: CurrencyDollarIcon, role: 'ADMIN' },
  { name: 'Raporlama', href: '/reports', icon: ChartBarIcon, role: 'ADMIN' },
  { name: 'Takım', href: '/team', icon: UsersIcon, role: 'ADMIN' },
  { name: 'Ayarlar', href: '/settings', icon: CogIcon, role: 'ADMIN' },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === 'ADMIN'

  const filteredNavigation = navigation.filter((item) => {
    if (item.role === 'ADMIN') {
      return isAdmin
    }
    return true
  })

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-80 bg-white border-r border-neutral-300 overflow-y-auto">
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-300">
            <h2 className="text-xl font-semibold text-neutral-900">Creative Agency CRM</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-neutral-700" />
            </button>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-neutral-300">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-100">
              <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {session?.user?.name || 'Admin Kullanıcı'}
                </p>
                <p className="text-xs text-neutral-600 truncate">
                  {session?.user?.role === 'ADMIN' ? 'Yönetici' : 'Takım Üyesi'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Notifications Button */}
          <div className="p-4 border-b border-neutral-300">
            <Link href="/notifications" className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors">
              <div className="flex items-center gap-2">
                <BellIcon className="h-4 w-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">Bildirimler</span>
              </div>
              <span className="text-xs text-neutral-500 bg-red-500 text-white rounded-full px-2 py-1">
                3
              </span>
            </Link>
          </div>
          
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-accent-blue-subtle text-accent-blue-dark border border-accent-blue-dark'
                          : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                        isActive ? 'text-accent-blue-dark' : 'text-neutral-600 group-hover:text-neutral-800'
                      }`} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80 bg-white border-r border-neutral-300">
          <div className="flex items-center h-16 px-6 border-b border-neutral-300">
            <h2 className="text-xl font-semibold text-neutral-900">
              Creative Agency CRM
            </h2>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-neutral-300">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-100">
              <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {session?.user?.name || 'Admin Kullanıcı'}
                </p>
                <p className="text-xs text-neutral-600 truncate">
                  {session?.user?.role === 'ADMIN' ? 'Yönetici' : 'Takım Üyesi'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Notifications Button */}
          <div className="p-4 border-b border-neutral-300">
            <Link href="/notifications" className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors">
              <div className="flex items-center gap-2">
                <BellIcon className="h-4 w-4 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">Bildirimler</span>
              </div>
              <span className="text-xs text-neutral-500 bg-red-500 text-white rounded-full px-2 py-1">
                3
              </span>
            </Link>
          </div>
          
          <nav className="flex-1 mt-8 px-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-accent-blue-subtle text-accent-blue-dark border border-accent-blue-dark'
                          : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                      }`}
                    >
                      <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                        isActive ? 'text-accent-blue-dark' : 'text-neutral-600 group-hover:text-neutral-800'
                      }`} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <Bars3Icon className="h-6 w-6 text-neutral-700" />
        </button>
      </div>
    </>
  )
} 