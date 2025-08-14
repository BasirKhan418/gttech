'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  Home,
  Monitor,
  Sun,
  Moon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'

interface AdminHeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

const AdminHeader = ({ onToggleSidebar, isSidebarOpen }: AdminHeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [healthCheck, setHealthCheck] = useState<{ name?: string; email?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState([
    { id: 1, message: 'New content uploaded', time: '2 min ago', unread: true },
    { id: 2, message: 'User registered', time: '1 hour ago', unread: true },
    { id: 3, message: 'System backup completed', time: '3 hours ago', unread: false }
  ])

  const unreadCount = notifications.filter(n => n.unread).length;

  const getHealthCheck = async ()=>{
    try {
      const response = await fetch('/api/admin/health', { method: 'GET' })
      const data = await response.json()
      if(!data.success) {
        toast.error(data.message || 'Unknown error')
        router.push('/login')
        return
      }
      console.log('Health check data:', data)
      setHealthCheck(data.data)
    } catch (error) {
      toast.error('Error fetching health check')
      router.push('/login')
      console.error('Error fetching health check:', error)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'GET' })
      const data = await response.json()
      if (!data.success) {
        toast.error(data.message || 'Unknown error')
        return
      }
      router.push('/login')
    } catch (error) {
      toast.error('Error logging out')
      console.error('Error logging out:', error)
    }
  }

  useEffect(() => {
    getHealthCheck()
  }, [])

  // Get current page title based on pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length <= 2) return 'Dashboard'
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    return lastSegment.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getBreadcrumb = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length <= 2) return null
    
    return pathSegments.slice(1).map((segment, index) => ({
      name: segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      href: '/' + pathSegments.slice(0, index + 2).join('/'),
      isLast: index === pathSegments.length - 2
    }))
  }

 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const breadcrumb = getBreadcrumb()

  return (
    <header className={`glass-header fixed top-0 right-0 z-30 transition-all duration-300 backdrop-blur-xl border-b border-sky-500/20 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-gray-900/90 ${
      isSidebarOpen ? 'left-72' : 'left-0'
    }`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/[0.03] to-transparent"></div>

      <div className="relative z-10 h-16 px-4 lg:px-6 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="glass-button lg:hidden p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-sky-500/20 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-sm"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Breadcrumb & Title */}
          <div className="hidden sm:block">
            {breadcrumb ? (
              <div className="space-y-1">
                <nav className="flex items-center space-x-2 text-sm">
                  <Link 
                    href="/admin/dashboard" 
                    className="text-gray-400 hover:text-sky-300 transition-colors duration-200 flex items-center"
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      <ChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg]" />
                      {item.isLast ? (
                        <span className="text-white font-medium">{item.name}</span>
                      ) : (
                        <Link 
                          href={item.href}
                          className="text-gray-400 hover:text-sky-300 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
                <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-white flex items-center">
                <Home className="w-5 h-5 mr-2 text-sky-300" />
                {getPageTitle()}
              </h1>
            )}
          </div>

          {/* Mobile Title */}
          <h1 className="text-lg font-bold text-white sm:hidden">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full relative">
            <div className="glass-search relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content, users, settings..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          
          {/* Mobile Search */}
          <button className="glass-button md:hidden p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-sky-500/20 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-sm">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="glass-button relative p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-sky-500/20 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-sm">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs border-none">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="glass-dropdown w-80 bg-slate-900/95 backdrop-blur-xl border border-sky-500/20"
            >
              <DropdownMenuLabel className="text-white font-semibold">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {unreadCount} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sky-500/20" />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="flex flex-col items-start p-3 text-gray-300 hover:bg-sky-500/10 hover:text-white focus:bg-sky-500/10 focus:text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">{notification.message}</span>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{notification.time}</span>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-sky-500/20" />
              <DropdownMenuItem className="text-center text-sky-300 hover:text-sky-200 hover:bg-sky-500/10 focus:bg-sky-500/10 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <Link 
            href="/" 
            target="_blank"
            className="glass-button hidden sm:flex p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-sky-500/20 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-sm"
            title="View Website"
          >
            <Monitor className="w-5 h-5" />
          </Link>

          {/* Settings */}
          <Link 
            href="/admin/settings"
            className="glass-button hidden sm:flex p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-sky-500/20 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-sm"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="glass-button flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-sky-500/20 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-sm">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-semibold">
                    {healthCheck && healthCheck.name ? healthCheck.name.charAt(0).toUpperCase() : 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">{healthCheck?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="glass-dropdown w-56 bg-slate-900/95 backdrop-blur-xl border border-sky-500/20"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold">Admin User</span>
                  <span className="text-xs text-gray-400 font-normal">{healthCheck?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sky-500/20" />
              
              <DropdownMenuItem className="text-gray-300 hover:bg-sky-500/10 hover:text-white focus:bg-sky-500/10 focus:text-white cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-gray-300 hover:bg-sky-500/10 hover:text-white focus:bg-sky-500/10 focus:text-white cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-sky-500/20" />
              
              <DropdownMenuItem 
              
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                onClick={logout}  
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-2 right-20 w-2 h-2 bg-sky-400/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-2 left-10 w-1 h-1 bg-cyan-400/30 rounded-full animate-ping"></div>
    </header>
  )
}

export default AdminHeader