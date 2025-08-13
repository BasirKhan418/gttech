'use client'
import React, { useState } from 'react'
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  LogOut,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AdminHeaderProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export const AdminHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  darkMode,
  setDarkMode
}: AdminHeaderProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [notifications] = useState([
    { id: 1, title: 'New user registered', time: '2 min ago', unread: true },
    { id: 2, title: 'System backup completed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Project milestone reached', time: '3 hours ago', unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="glass-header h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg relative z-30">
      {/* Glass overlay for professional look */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-slate-900/20 to-slate-800/30" />
      
      <div className="relative z-10 h-full flex items-center justify-between px-4 lg:px-6">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass-button lg:hidden p-2 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Sidebar Toggle - This button should be under the sidebar level */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="glass-button hidden lg:flex items-center justify-center p-2 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative z-10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Breadcrumb / Page Title */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/20 border border-sky-500/30 flex items-center justify-center">
              <Settings className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Dashboard</h1>
              <p className="text-slate-400 text-sm">Welcome back, Admin</p>
            </div>
          </div>
        </div>


        {/* Right Section */}
        <div className="flex items-center gap-3">
        

                   

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="glass-button flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200">
                <Avatar className="w-8 h-8 border-2 border-sky-500/30">
                  <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-br from-sky-500 to-sky-600 text-white text-sm font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">John Admin</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-800/95 backdrop-blur-xl border-slate-600/50 shadow-2xl"
            >
              <DropdownMenuLabel className="text-white border-b border-slate-600/50 pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-sky-500/30">
                    <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-sky-500 to-sky-600 text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">John Admin</p>
                    <p className="text-xs text-slate-400">admin@gttech.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <User className="w-4 h-4 mr-3" />
                My Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <Shield className="w-4 h-4 mr-3" />
                Security
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-slate-600/50" />
              
              <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
    </header>
  )
}