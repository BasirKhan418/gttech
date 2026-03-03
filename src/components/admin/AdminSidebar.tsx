'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Upload,
  Eye,
  Edit,
  Trash,
  UserPlus,
  Database,
  Globe,
  Megaphone,
  Plus,
  Folder,
  Code,
  Building2,
  Factory,
  Tag,
  Briefcase,
  Users2,
  LogOut,
  Shield,
  Mail,
  Bell,
  Activity,
  TrendingUp,
  Zap,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'

interface SubMenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface MenuItem {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: SubMenuItem[]
  badge?: string
  color?: string
}

const AdminSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content Management'])
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      name: 'Content Management',
      icon: FileText,
      badge: 'Core',
      color: 'text-purple-600',
      subItems: [
        { name: 'All Content', href: '/admin/content', icon: Eye },
        { name: 'About Content', href: '/admin/about', icon: Sliders },
      ]
    },
    {
      name: 'Industry Management',
      icon: Building2,
      badge: 'New',
      color: 'text-cyan-600',
      subItems: [
        { name: 'All Industries', href: '/admin/industry', icon: Factory },
      ]
    },
    {
      name: 'Product Management',
      icon: Folder,
      color: 'text-green-600',
      subItems: [
        { name: 'All Products', href: '/admin/projects', icon: Eye },
      ]
    },
    {
      name: 'Services Management',
      icon: Briefcase, // Replace ServiceIcon with an existing icon, e.g., Briefcase
      color: 'text-green-600',
      subItems: [
        { name: 'All Services', href: '/admin/services', icon: Eye },
      ]
    },
    {
      name: 'GAQ Management',
      icon: DollarSign,
      badge: 'Important',
      color: 'text-orange-600',
      subItems: [
        { name: 'All Requests', href: '/admin/gaq', icon: Eye },
      ]
    },
    {
      name: 'Career Management',
      icon: Briefcase,
      color: 'text-indigo-600',
      subItems: [
        { name: 'All Careers', href: '/admin/career', icon: Eye },
      ]
    },
    {
      name: 'News Banner',
      icon: Megaphone,
      color: 'text-pink-600',
      subItems: [
        { name: 'All Banners', href: '/admin/banners', icon: Eye },
      ]
    },
    {
      name: 'Website Components',
      icon: Sliders,
      color: 'text-teal-600',
      subItems: [
        { name: 'Hero Sliders', href: '/admin/sliders', icon: Sliders },
      ]
    },
    {
      name: 'Media Gallery',
      icon: ImageIcon,
      color: 'text-violet-600',
      subItems: [
        { name: 'All Media', href: '/admin/gallery', icon: Eye },
      ]
    },
    {
      name: 'Team Management',
      icon: Users2,
      color: 'text-emerald-600',
      subItems: [
        { name: 'All Teams', href: '/admin/teams', icon: Users2 }
      ]
    },
    {
      name: 'Address Management',
      icon: MapPin,
      color: 'text-orange-600',
      subItems: [
        { name: 'All Addresses', href: '/admin/addresses', icon: MapPin }
      ]
    },
    {
      name: 'User Management',
      icon: Users,
      color: 'text-red-600',
      subItems: [
        { name: 'All Admins', href: '/admin/users', icon: Users },
      ]
    },
  ]

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const [basePath, query] = href.split('?')
      return pathname === basePath && (typeof window !== 'undefined' && window?.location?.search?.includes(query))
    }
    return pathname === href
  }

  const isParentActive = (subItems?: SubMenuItem[]) => {
    return subItems?.some(item => isActive(item.href)) || false
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      const response = await fetch('/api/admin/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Logged out successfully')
        router.push('/admin/login')
      } else {
        toast.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-cyan-300/50 z-40 overflow-hidden shadow-xl">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-cyan-50/50 to-white/60"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-cyan-300/40 bg-gradient-to-r from-white/90 to-cyan-50/70">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="GT Technologies"
                width={180}
                height={60}
                className="transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-cyan-700 text-sm font-medium">Admin Portal</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">System Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-cyan-300/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-1 h-1 bg-cyan-500/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-cyan-300/50 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedItems.includes(item.name)
            const parentActive = isParentActive(item.subItems)
            
            return (
              <div key={item.name} className="space-y-1">
                {hasSubItems ? (
                  <>
                    {/* Parent Item with SubMenu */}
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-300 group ${
                        parentActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/15 text-cyan-800 border border-cyan-400/40 shadow-lg'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-100/80 hover:to-cyan-50/60 hover:text-cyan-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          parentActive 
                            ? 'bg-cyan-500/20 border border-cyan-400/30' 
                            : 'bg-gray-100/80 group-hover:bg-cyan-100/80'
                        }`}>
                          <item.icon className={`w-4 h-4 transition-colors duration-300 ${
                            parentActive ? item.color || 'text-cyan-600' : `text-gray-500 group-hover:${item.color || 'text-cyan-600'}`
                          }`} />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{item.name}</span>
                          {item.badge && (
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full border ${
                              item.badge === 'New' ? 'bg-green-500/20 text-green-700 border-green-400/50' :
                              item.badge === 'Core' ? 'bg-purple-500/20 text-purple-700 border-purple-400/50' :
                              item.badge === 'Important' ? 'bg-orange-500/20 text-orange-700 border-orange-400/50' :
                              'bg-cyan-500/20 text-cyan-700 border-cyan-400/50'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {hasSubItems && item.subItems?.some(sub => sub.badge) && (
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : ''
                        } ${parentActive ? 'text-cyan-600' : 'text-gray-500'}`} />
                      </div>
                    </button>

                    {/* SubMenu Items */}
                    <div className={`ml-6 space-y-1 transition-all duration-300 overflow-hidden ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 group relative ${
                            isActive(subItem.href)
                              ? 'bg-gradient-to-r from-cyan-500/25 to-cyan-400/20 text-cyan-800 border border-cyan-400/50 shadow-md'
                              : 'text-gray-600 hover:bg-gradient-to-r hover:from-cyan-100/60 hover:to-cyan-50/40 hover:text-cyan-700'
                          }`}
                        >
                          {/* Active indicator line */}
                          {isActive(subItem.href) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full"></div>
                          )}
                          
                          <div className={`p-1.5 rounded-md transition-all duration-300 ${
                            isActive(subItem.href) 
                              ? 'bg-cyan-500/20 border border-cyan-400/30' 
                              : 'bg-gray-100/60 group-hover:bg-cyan-100/60'
                          }`}>
                            <subItem.icon className={`w-3.5 h-3.5 transition-colors duration-300 ${
                              isActive(subItem.href) ? 'text-cyan-600' : 'text-gray-500 group-hover:text-cyan-600'
                            }`} />
                          </div>
                          <span className="font-medium flex-1">{subItem.name}</span>
                          {subItem.badge && (
                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-700 text-xs rounded-full border border-red-400/50 animate-pulse">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Direct Link Item */
                  <Link
                    href={item.href!}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                      isActive(item.href!)
                        ? 'bg-gradient-to-r from-cyan-500/25 to-cyan-400/20 text-cyan-800 border border-cyan-400/50 shadow-md'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-100/80 hover:to-cyan-50/60 hover:text-cyan-800'
                    }`}
                  >
                    {/* Active indicator line */}
                    {isActive(item.href!) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full"></div>
                    )}
                    
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive(item.href!) 
                        ? 'bg-cyan-500/20 border border-cyan-400/30' 
                        : 'bg-gray-100/80 group-hover:bg-cyan-100/80'
                    }`}>
                      <item.icon className={`w-4 h-4 transition-colors duration-300 ${
                        isActive(item.href!) ? item.color || 'text-cyan-600' : `text-gray-500 group-hover:${item.color || 'text-cyan-600'}`
                      }`} />
                    </div>
                    <span className="font-medium text-sm flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-700 text-xs rounded-full border border-blue-400/50">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-300/40 bg-gradient-to-r from-white/90 to-cyan-50/70">
          {/* User Info */}
          <div className="mb-4 p-3 bg-gradient-to-r from-cyan-50/80 to-cyan-100/60 rounded-xl border border-cyan-300/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-600">Super Administrator</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Link
              href="/admin/industry"
              className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-cyan-400/15 hover:from-cyan-500/30 hover:to-cyan-400/25 border border-cyan-400/40 hover:border-cyan-500/50 rounded-lg transition-all duration-300 group shadow-sm"
            >
              <Building2 className="w-4 h-4 text-cyan-600 group-hover:text-cyan-700 mr-1" />
              <span className="text-xs text-cyan-600 group-hover:text-cyan-700 font-medium">Industries</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500/20 to-blue-400/15 hover:from-blue-500/30 hover:to-blue-400/25 border border-blue-400/40 hover:border-blue-500/50 rounded-lg transition-all duration-300 group shadow-sm"
            >
              <Activity className="w-4 h-4 text-blue-600 group-hover:text-blue-700 mr-1" />
              <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">Analytics</span>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-red-500/20 to-red-400/15 hover:from-red-500/30 hover:to-red-400/25 border border-red-400/40 hover:border-red-500/50 rounded-lg transition-all duration-300 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <LogOut className="w-4 h-4 text-red-600 group-hover:text-red-700 mr-2" />
            )}
            <span className="text-sm text-red-600 group-hover:text-red-700 font-medium">
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </span>
          </button>

          {/* Copyright */}
          <div className="text-center mt-4">
            <p className="text-xs text-cyan-600">
              © 2025 GT Technologies
            </p>
            <p className="text-xs text-cyan-500 mt-1">
              Admin Panel v2.1
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar