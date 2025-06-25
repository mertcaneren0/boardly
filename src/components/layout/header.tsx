'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/components/providers/theme-provider'
import {
  Bell,
  Search,
  Settings,
  LogOut,
  Moon,
  Sun,
  Monitor,
  User,
  Zap,
} from 'lucide-react'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Yeni görev atandı',
      message: 'Website Redesign projesinde yeni bir görev',
      time: '5 dk önce',
      unread: true,
    },
    {
      id: 2,
      title: 'Ödeme hatırlatması',
      message: 'ABC Şirketi ödemesi yarın son gün',
      time: '2 saat önce',
      unread: true,
    },
    {
      id: 3,
      title: 'Proje tamamlandı',
      message: 'Logo Tasarım projesi teslim edildi',
      time: '1 gün önce',
      unread: false,
    },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Title Section */}
        <div className="flex flex-col">
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4 mr-2" />
            Ara
          </Button>

          {/* Notifications */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Bildirimler</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary">{unreadCount} yeni</Badge>
                )}
              </div>
              <div className="max-h-96 overflow-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                      notification.unread ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.unread ? 'bg-primary' : 'bg-muted'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  Tümünü Gör
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {theme === 'light' && <Sun className="h-4 w-4" />}
                {theme === 'dark' && <Moon className="h-4 w-4" />}
                {theme === 'system' && <Monitor className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Açık
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Koyu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                Sistem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-semibold">D</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Demo User</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    demo@boardly.app
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/upgrade')}>
                <Zap className="mr-2 h-4 w-4" />
                Pro'ya Geç
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 