'use client'

import { useSession, signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Sayfa başlıklarını belirle
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Dashboard'
      case '/projects':
        return 'Projeler'
      case '/tasks':
        return 'Görevler'
      case '/calendar':
        return 'Takvim'
      case '/leave-requests':
        return 'İzin Talepleri'
      case '/clients':
        return 'Müşteriler'
      case '/quotes':
        return 'Teklifler & Sözleşmeler'
      case '/finance':
        return 'Finans'
      case '/reports':
        return 'Raporlama'
      case '/team':
        return 'Takım'
      case '/settings':
        return 'Ayarlar'
      case '/notifications':
        return 'Bildirimler'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header className="bg-white border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-neutral-900">
              {getPageTitle(pathname)}
            </h1>
          </div>
          
          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-lg hover:bg-neutral-200 transition-colors">
              <div className="h-8 w-8 rounded-full bg-neutral-300 flex items-center justify-center">
                <span className="text-sm font-medium text-neutral-700">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-lg bg-white border border-neutral-300 shadow-lg py-2 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <div className={`px-4 py-3 ${active ? 'bg-neutral-200' : ''}`}>
                      <p className="text-sm font-medium text-neutral-900">{session?.user?.name}</p>
                      <p className="text-xs text-neutral-600">{session?.user?.email}</p>
                    </div>
                  )}
                </Menu.Item>
                <div className="border-t border-neutral-300 my-2"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => signOut()}
                      className={`${
                        active ? 'bg-neutral-200' : ''
                      } block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:text-neutral-900 transition-colors`}
                    >
                      Çıkış Yap
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
} 