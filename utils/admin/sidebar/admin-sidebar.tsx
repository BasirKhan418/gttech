'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  FolderOpen,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Building2,
  Mail,
  Calendar,
  MessageSquare,
  Database,
  Shield,
  UserCheck,
  Briefcase
} from 'lucide-react'

interface AdminSidebarProps {
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const AdminSidebar = ({ 
  sidebarCollapsed, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: AdminSidebarProps) => {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleExpanded = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin/home',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      description: 'Manage site content',
      children: [
        { label: 'Pages', href: '/admin/pages', icon: FileText },
        { label: 'Blog Posts', href: '/admin/blog', icon: MessageSquare },
        { label: 'Media Library', href: '/admin/media', icon: FolderOpen },
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage users & permissions',
      children: [
        { label: 'All Users', href: '/admin/users', icon: Users },
        { label: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
        { label: 'User Activity', href: '/admin/activity', icon: UserCheck },
      ]
    },
    {
      id: 'business',
      label: 'Business',
      icon: Building2,
      description: 'Business operations',
      children: [
        { label: 'Projects', href: '/admin/projects', icon: Briefcase },
        { label: 'Clients', href: '/admin/clients', icon: Users },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: Mail,
      description: 'Messages & contacts',
      children: [
        { label: 'Contact Forms', href: '/admin/contacts', icon: Mail },
        { label: 'Newsletter', href: '/admin/newsletter', icon: MessageSquare },
        { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
      ]
    }
  ]

  const bottomNavItems = [
    {
      id: 'database',
      label: 'Database',
      href: '/admin/database',
      icon: Database,
      description: 'Data management'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System configuration'
    },
    {
      id: 'help',
      label: 'Help & Support',
      href: '/admin/help',
      icon: HelpCircle,
      description: 'Documentation & support'
    }
  ]

  const NavItem = ({ item, isChild = false }: { item: any, isChild?: boolean }) => {
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus.includes(item.id)

    if (hasChildren) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 group relative",
              "hover:bg-slate-700/50 hover:text-white",
              "text-slate-300",
              sidebarCollapsed && "px-3 justify-center"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <item.icon className={cn(
                "flex-shrink-0 transition-colors duration-200",
                "text-slate-400 group-hover:text-sky-400",
                sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
              )} />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <span className="block text-sm font-medium truncate">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="block text-xs text-slate-500 truncate">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                isExpanded && "rotate-90"
              )} />
            )}
          </button>

          {/* Expanded Children */}
          {!sidebarCollapsed && isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700/50 pl-4">
              {item.children.map((child: any) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                    pathname === child.href
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      : "text-slate-400 hover:bg-slate-700/30 hover:text-white"
                  )}
                >
                  <child.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{child.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Collapsed Dropdown */}
          {sidebarCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="absolute inset-0 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="right" 
                className="w-64 ml-2 bg-slate-800/95 backdrop-blur-xl border-slate-600/50 shadow-2xl"
              >
                <div className="px-3 py-2 border-b border-slate-600/50">
                  <h3 className="font-medium text-white">{item.label}</h3>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                {item.children.map((child: any) => (
                  <DropdownMenuItem key={child.href} asChild>
                    <Link
                      href={child.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm cursor-pointer",
                        pathname === child.href
                          ? "bg-sky-500/20 text-sky-300"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      )}
                    >
                      <child.icon className="w-4 h-4" />
                      <span>{child.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )
    }

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative mb-1",
          isActive
            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-lg shadow-sky-500/10"
            : "text-slate-300 hover:bg-slate-700/50 hover:text-white",
          sidebarCollapsed && "px-3 justify-center"
        )}
      >
        <item.icon className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isActive ? "text-sky-400" : "text-slate-400 group-hover:text-sky-400",
          sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
        )} />
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <span className="block text-sm font-medium truncate">
              {item.label}
            </span>
            {item.description && (
              <span className="block text-xs text-slate-500 truncate">
                {item.description}
              </span>
            )}
          </div>
        )}

        {/* Tooltip for collapsed state */}
        {sidebarCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800/95 backdrop-blur-xl text-white text-sm rounded-lg shadow-xl border border-slate-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-xs text-slate-400 mt-1">{item.description}</div>
            )}
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-400 rounded-r-full" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen transition-all duration-300 border-r border-slate-700/50",
        "bg-slate-900/95 backdrop-blur-xl shadow-2xl",
        sidebarCollapsed ? "w-20" : "w-72",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Glass overlay for professional look */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 via-slate-900/40 to-slate-950/60 backdrop-blur-xl" />
        
        {/* Header */}
        <div className={cn(
          "relative z-10 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-xl",
          sidebarCollapsed ? "p-4" : "p-6"
        )}>
          <div className="flex items-center gap-3">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">GT</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-white font-semibold text-lg truncate">
                    GT Admin
                  </h2>
                  <p className="text-slate-400 text-sm truncate">
                    Management Panel
                  </p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg mx-auto">
                <span className="text-white font-bold text-lg">GT</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2 mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Main Menu
                  </h3>
                </div>
              )}
              {mainNavItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-slate-700/50" />

            {/* Bottom Navigation */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2 mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    System
                  </h3>
                </div>
              )}
              {bottomNavItems.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

      
        

        {/* Decorative elements */}
        <div className="absolute top-20 right-4 w-1 h-8 bg-gradient-to-b from-sky-400/60 to-transparent rounded-full opacity-50" />
        <div className="absolute bottom-20 left-4 w-1 h-6 bg-gradient-to-t from-cyan-400/40 to-transparent rounded-full opacity-50" />
      </aside>
    </>
  )
}