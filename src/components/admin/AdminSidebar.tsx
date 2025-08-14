'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
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
  Upload,
  Eye,
  Edit,
  Trash,
  UserPlus,
  Database,
  Globe,
  Megaphone,
  Plus
} from 'lucide-react'

interface SubMenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface MenuItem {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: SubMenuItem[]
  badge?: string
}

const AdminSidebar = () => {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content Management'])

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home
    },
    {
      name: 'Content Management',
      icon: FileText,
      badge: 'New',
      subItems: [
        { name: 'All Content', href: '/admin/content', icon: Eye },
       
      ]
    },
    {
      name: 'Banner Management',
      icon: Megaphone,
      subItems: [
        { name: 'All Banners', href: '/admin/banners', icon: Eye },
      
      ]
    },
    {
      name: 'Slider Management',
      icon: Sliders,
      subItems: [
        { name: 'All Sliders', href: '/admin/sliders', icon: Eye },
        
      ]
    },
    {
      name: 'Media Gallery',
      icon: ImageIcon,
      subItems: [
        { name: 'All Media', href: '/admin/gallery', icon: Eye },
       
      ]
    },
    {
      name: 'Career Management',
      icon: ImageIcon,
      subItems: [
        { name: 'All Careers', href: '/admin/career', icon: Eye },
      ]
    },
    {
      name: 'User Management',
      icon: Users,
      subItems: [
        { name: 'All Admins', href: '/admin/users', icon: Users },
        
      ]
    },
    {
      name: 'Teams',
      href: '/admin/teams',
      icon: BarChart3
    },
  ]

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => pathname === href

  const isParentActive = (subItems?: SubMenuItem[]) => {
    return subItems?.some(item => pathname === item.href) || false
  }

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white/90 backdrop-blur-xl border-r border-cyan-300/50 z-40 overflow-hidden shadow-xl">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/40 to-white/50"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-cyan-300/40 bg-gradient-to-r from-white/80 to-cyan-50/60">
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
          <div className="mt-3">
            <p className="text-cyan-700 text-sm font-medium">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                        parentActive
                          ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-400/40 shadow-lg'
                          : 'text-gray-700 hover:bg-cyan-100/60 hover:text-cyan-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                          parentActive ? 'text-cyan-600' : 'text-gray-500 group-hover:text-cyan-600'
                        }`} />
                        <span className="font-medium text-sm">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-cyan-500/25 text-cyan-700 text-xs rounded-full border border-cyan-400/50">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      } ${parentActive ? 'text-cyan-600' : 'text-gray-500'}`} />
                    </button>

                    {/* SubMenu Items */}
                    <div className={`ml-6 space-y-1 transition-all duration-200 overflow-hidden ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative ${
                            isActive(subItem.href)
                              ? 'bg-cyan-500/25 text-cyan-800 border border-cyan-400/50 shadow-md'
                              : 'text-gray-600 hover:bg-cyan-100/50 hover:text-cyan-700'
                          }`}
                        >
                          {/* Active indicator line */}
                          {isActive(subItem.href) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-500 rounded-full"></div>
                          )}
                          
                          <subItem.icon className={`w-4 h-4 transition-colors duration-200 ${
                            isActive(subItem.href) ? 'text-cyan-600' : 'text-gray-500 group-hover:text-cyan-600'
                          }`} />
                          <span className="font-medium">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Direct Link Item */
                  <Link
                    href={item.href!}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                      isActive(item.href!)
                        ? 'bg-cyan-500/25 text-cyan-800 border border-cyan-400/50 shadow-md'
                        : 'text-gray-700 hover:bg-cyan-100/60 hover:text-cyan-800'
                    }`}
                  >
                    {/* Active indicator line */}
                    {isActive(item.href!) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-500 rounded-full"></div>
                    )}
                    
                    <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive(item.href!) ? 'text-cyan-600' : 'text-gray-500 group-hover:text-cyan-600'
                    }`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-300/40 bg-gradient-to-r from-white/80 to-cyan-50/60">
          <div className="text-center">
            <p className="text-xs text-cyan-600">
              © 2025 GT Technologies
            </p>
            <p className="text-xs text-cyan-500 mt-1">
              Admin Panel v2.0
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/admin/content/add"
              className="flex items-center justify-center px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 hover:border-cyan-500/50 rounded-lg transition-all duration-200 group shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-600 group-hover:text-cyan-700" />
              <span className="ml-1 text-xs text-cyan-600 group-hover:text-cyan-700 font-medium">Add</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-center px-3 py-2 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-300/60 hover:border-gray-400/60 rounded-lg transition-all duration-200 group shadow-sm"
            >
              <Settings className="w-4 h-4 text-gray-600 group-hover:text-gray-700" />
              <span className="ml-1 text-xs text-gray-600 group-hover:text-gray-700 font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar