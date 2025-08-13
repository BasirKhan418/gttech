"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MenuIcon, Bell, Search, Moon, Sun, ChevronDown, Settings, User, LogOut, Maximize2, Minimize2 } from "lucide-react"

interface AdminHeaderProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export function AdminHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  darkMode,
  setDarkMode,
}: AdminHeaderProps) {
  
  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", unread: true },
    { id: 2, title: "System backup completed", time: "1 hour ago", unread: true },
    { id: 3, title: "Server maintenance scheduled", time: "3 hours ago", unread: false },
  ]

  return (
    <header className="sticky top-0 z-40 glass-header backdrop-blur-xl bg-gradient-to-r from-gray-950/95 via-slate-950/95 to-black/95 border-b border-sky-500/20 shadow-lg shadow-black/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Glass shine effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>

      <div className="relative z-10 flex items-center justify-between px-4 lg:px-6 h-16">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileMenuOpen(!mobileMenuOpen)
              } else {
                setSidebarCollapsed(!sidebarCollapsed)
              }
            }}
            className="glass-button text-white hover:text-sky-300 hover:bg-sky-500/20 border border-transparent hover:border-sky-400/30 transition-all duration-300 relative group"
          >
            <MenuIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            {sidebarCollapsed ? (
              <Maximize2 className="h-3 w-3 absolute -top-1 -right-1 opacity-60" />
            ) : (
              <Minimize2 className="h-3 w-3 absolute -top-1 -right-1 opacity-60" />
            )}
            
            {/* Button glow effect */}
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          {/* Search Bar - Hidden on small screens */}
          <div className="relative max-w-md hidden sm:block">
            <div className="relative glass-search">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sky-300" />
              <Input 
                placeholder="Search dashboard..." 
                className="pl-10 w-64 lg:w-80 bg-white/10 border-sky-500/30 text-white placeholder-sky-200 hover:bg-white/15 focus:bg-white/20 focus:border-sky-400/50 transition-all duration-300 backdrop-blur-sm"
              />
              
              {/* Search suggestions indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs text-sky-300 bg-sky-500/20 rounded border border-sky-400/30">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="sm:hidden glass-button text-white hover:text-sky-300 hover:bg-sky-500/20 border border-transparent hover:border-sky-400/30 transition-all duration-300 relative group"
          >
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDarkMode(!darkMode)}
            className="glass-button text-white hover:text-sky-300 hover:bg-sky-500/20 border border-transparent hover:border-sky-400/30 transition-all duration-300 relative group"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-180" />
            ) : (
              <Moon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" />
            )}
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="glass-button text-white hover:text-sky-300 hover:bg-sky-500/20 border border-transparent hover:border-sky-400/30 transition-all duration-300 relative group"
              >
                <Bell className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500/90 text-white border-2 border-gray-900 animate-pulse">
                  {notifications.filter(n => n.unread).length}
                </Badge>
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-dropdown backdrop-blur-xl bg-gray-950/95 border-sky-500/20">
              <div className="p-4 border-b border-sky-500/20">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-sky-400" />
                  Notifications
                </h4>
                <p className="text-sm text-sky-300">
                  You have {notifications.filter(n => n.unread).length} unread notifications
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 hover:bg-sky-500/10 transition-colors duration-200 border-b border-sky-500/10 last:border-b-0 ${
                      notification.unread ? 'bg-sky-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.unread ? 'bg-sky-400' : 'bg-gray-600'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{notification.title}</p>
                        <p className="text-xs text-sky-300 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-sky-500/20">
                <Button variant="ghost" className="w-full text-sky-300 hover:text-white hover:bg-sky-500/20 transition-all duration-300">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="glass-button flex items-center gap-2 text-white hover:text-sky-300 hover:bg-sky-500/20 border border-transparent hover:border-sky-400/30 transition-all duration-300 relative group pl-2 pr-3"
              >
                <Avatar className="h-8 w-8 ring-2 ring-sky-400/30 group-hover:ring-sky-400/50 transition-all duration-300">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-sky-600 to-cyan-600 text-white font-semibold text-sm">
                    BK
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">Basir Khan</p>
                  <p className="text-xs text-sky-300">Super Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block transition-transform duration-300 group-hover:rotate-180" />
                
                {/* Button glow effect */}
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-dropdown backdrop-blur-xl bg-gray-950/95 border-sky-500/20">
              <div className="p-3 border-b border-sky-500/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-sky-400/30">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-gradient-to-br from-sky-600 to-cyan-600 text-white">
                      BK
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">Basir Khan</p>
                    <p className="text-sm text-sky-300">basir@gttech.com</p>
                  </div>
                </div>
              </div>
              
              <DropdownMenuItem className="text-white hover:bg-sky-500/20 hover:text-sky-300 transition-colors duration-200 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-white hover:bg-sky-500/20 hover:text-sky-300 transition-colors duration-200 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-sky-500/20" />
              
              <DropdownMenuItem className="text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors duration-200 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Floating particles for header */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 2 === 0 ? 'bg-sky-400/30' : 'bg-white/15'
            }`}
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${30 + (i * 10)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i % 2)}s`
            }}
          ></div>
        ))}
      </div>
    </header>
  )
}