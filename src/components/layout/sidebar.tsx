'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/lib/auth'
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  CreditCard,
  StickyNote,
  Users,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projeler',
    href: '/dashboard/projects',
    icon: FolderOpen,
  },
  {
    title: 'Görevler',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Notlar',
    href: '/dashboard/notes',
    icon: StickyNote,
  },
  {
    title: 'Ödemeler',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    title: 'Takvim',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Ekip',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    title: 'Raporlar',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
]

const quickActions = [
  {
    title: 'Yeni Proje',
    href: '/dashboard/projects/new',
    icon: FolderOpen,
  },
  {
    title: 'Görev Ekle',
    href: '/dashboard/tasks/new',
    icon: CheckSquare,
  },
  {
    title: 'Not Ekle',
    href: '/dashboard/notes/new',
    icon: StickyNote,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className={cn(
      'relative flex flex-col bg-background border-r border-border transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-lg">Boardly</span>
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'h-8 w-8 p-0',
            isCollapsed && 'mx-auto'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-3">
        {/* Navigation */}
        <div className="space-y-1 py-4">
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Navigation
            </h3>
          )}
          
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent text-accent-foreground',
                  isCollapsed && 'justify-center px-2'
                )}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-1 py-4 border-t border-border">
          {!isCollapsed && (
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Hızlı İşlemler
            </h3>
          )}
          
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                isCollapsed && 'justify-center px-2'
              )}>
                <Plus className="h-3 w-3 flex-shrink-0" />
                <action.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{action.title}</span>}
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link href="/dashboard/settings">
          <div className={cn(
            'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
            isCollapsed && 'justify-center px-2'
          )}>
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Ayarlar</span>}
          </div>
        </Link>
        
        {!isCollapsed && user && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 