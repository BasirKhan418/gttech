"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  Users,
  ImageIcon,
  Bot,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  FileEdit,
  Circle,
  X,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  {
    icon: FileText,
    label: "CMS",
    href: "/admin/cms",
    subItems: [
      { name: "Pages", href: "/admin/cms/pages" },
      { name: "Menus", href: "/admin/cms/menus" },
      { name: "Media Library", href: "/admin/cms/media" }
    ],
  },
  {
    icon: FileEdit,
    label: "Blogs",
    href: "/admin/blogs",
    subItems: [
      { name: "All Posts", href: "/admin/blogs/posts" },
      { name: "Add New", href: "/admin/blogs/add" },
      { name: "Categories", href: "/admin/blogs/categories" },
      { name: "Tags", href: "/admin/blogs/tags" }
    ],
  },
  {
    icon: Users,
    label: "CRM",
    href: "/admin/crm",
    subItems: [
      { name: "Leads", href: "/admin/crm/leads" },
      { name: "Add Lead", href: "/admin/crm/add" },
      { name: "Reports", href: "/admin/crm/reports" }
    ],
  },
  {
    icon: ImageIcon,
    label: "Sliders & Banners",
    href: "/admin/sliders",
    subItems: [
      { name: "Manage", href: "/admin/sliders/manage" },
      { name: "Add New", href: "/admin/sliders/add" },
      { name: "Schedule", href: "/admin/sliders/schedule" }
    ],
  },
  {
    icon: Bot,
    label: "AI Chatbot",
    href: "/admin/chatbot",
    subItems: [
      { name: "Settings", href: "/admin/chatbot/settings" },
      { name: "Responses", href: "/admin/chatbot/responses" },
      { name: "Training Data", href: "/admin/chatbot/training" }
    ],
  },
  {
    icon: Users,
    label: "Users & Roles",
    href: "/admin/users",
    subItems: [
      { name: "Manage Users", href: "/admin/users/manage" },
      { name: "Permissions", href: "/admin/users/permissions" }
    ],
  },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

interface AdminSidebarProps {
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function AdminSidebar({ sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked")
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Base styles with glass effect - ensuring full height
          "fixed left-0 top-0 h-full min-h-screen z-50 transition-all duration-300 ease-in-out",
          "glass-sidebar backdrop-blur-xl bg-gradient-to-b from-gray-950/95 via-slate-950/95 to-black/95",
          "border-r border-sky-500/20 shadow-2xl shadow-black/50",
          
          // Mobile styles
          "lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          
          // Width based on collapsed state
          sidebarCollapsed ? "lg:w-20" : "lg:w-72",
          "w-80 sm:w-72", // Full width on mobile
        )}
        style={{ height: '100vh', minHeight: '100vh' }}
      >
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

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 2 === 0 ? 'bg-sky-400/40' : 'bg-white/20'
              }`}
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${15 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            ></div>
          ))}
        </div>

        {/* Glass shine effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-500/5 to-transparent opacity-50"></div>

        {/* Content Container */}
        <div className="relative z-10 h-full min-h-screen flex flex-col">
          
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-sky-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GT</span>
              </div>
              {!sidebarCollapsed && (
                <span className="text-white font-semibold text-lg">GTTech</span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:bg-white/10 hover:text-sky-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo Section for Desktop */}
          <div className="hidden lg:flex items-center p-6 border-b border-sky-500/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/25">
                  <span className="text-white font-bold">GT</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-xl blur-sm"></div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="text-white font-bold text-xl">GTTech</span>
                  <p className="text-sky-300 text-xs">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Profile Section */}
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="p-4 border-b border-sky-500/20">
              <Card className="glass-card border-0 shadow-lg shadow-black/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-sky-400/30">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback className="bg-gradient-to-br from-sky-600 to-cyan-600 text-white font-semibold">
                          BK
                        </AvatarFallback>
                      </Avatar>
                      <Circle className="absolute -bottom-1 -right-1 h-4 w-4 fill-green-400 text-green-400 ring-2 ring-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">Basir Khan</p>
                      <p className="text-sky-300 text-sm truncate">Super Admin</p>
                      <Badge className="text-xs mt-1 bg-green-500/20 text-green-300 border-green-500/30">
                        Online
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 min-h-0 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sky-500/30">
            {sidebarItems.map((item, index) => (
              <div key={index} className="group">
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-12 relative group/item transition-all duration-300",
                      "hover:bg-sky-500/20 hover:border-sky-400/30 hover:shadow-lg hover:shadow-sky-500/10",
                      "text-gray-300 hover:text-white border border-transparent",
                      sidebarCollapsed && !mobileMenuOpen && "lg:px-3 lg:justify-center",
                      item.active && "bg-gradient-to-r from-sky-500/30 to-cyan-500/20 border-sky-400/50 text-white shadow-lg shadow-sky-500/20",
                    )}
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault()
                        toggleExpanded(index)
                      }
                      // Close mobile menu when navigating
                      if (window.innerWidth < 1024 && !item.subItems) {
                        setMobileMenuOpen(false)
                      }
                    }}
                  >
                    <div className="relative">
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                      {item.active && (
                        <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-sm"></div>
                      )}
                    </div>
                    
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <>
                        <span className="truncate font-medium">{item.label}</span>
                        {item.subItems && (
                          <div className="ml-auto">
                            {expandedItems.includes(index) ? (
                              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                            ) : (
                              <ChevronRight className="h-4 w-4 transition-transform duration-300" />
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && !mobileMenuOpen && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-sky-500/30 shadow-lg shadow-black/20">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-sky-500/30"></div>
                      </div>
                    )}

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>

                {/* Sub Items */}
                {(!sidebarCollapsed || mobileMenuOpen) && item.subItems && expandedItems.includes(index) && (
                  <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300 border-l-2 border-sky-500/20 pl-4">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link key={subIndex} href={subItem.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sm text-gray-400 hover:text-sky-300 hover:bg-sky-500/10 transition-all duration-300 border border-transparent hover:border-sky-500/20 relative group/sub"
                          onClick={() => {
                            // Close mobile menu when navigating
                            if (window.innerWidth < 1024) {
                              setMobileMenuOpen(false)
                            }
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-sky-400/40 mr-3 group-hover/sub:bg-sky-400 transition-colors duration-300"></div>
                          {subItem.name}
                          
                          {/* Sub item hover effect */}
                          <div className="absolute inset-0 rounded bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover/sub:opacity-100 transition-opacity duration-300"></div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="flex-shrink-0 p-4 border-t border-sky-500/20 space-y-2 mt-auto">
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <>
                <Link href="/admin/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10 text-gray-300 hover:text-white hover:bg-sky-500/20 hover:border-sky-400/30 border border-transparent transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 text-red-300 hover:text-red-200 hover:bg-red-500/20 hover:border-red-400/30 border border-transparent transition-all duration-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}

            {sidebarCollapsed && !mobileMenuOpen && (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 text-gray-300 hover:text-white hover:bg-sky-500/20 relative group/profile"
                >
                  <User className="h-4 w-4" />
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover/profile:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-sky-500/30">
                    Profile Settings
                  </div>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 relative group/logout"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover/logout:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-red-500/30">
                    Logout
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-sky-400/60 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Side glow effect */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-sky-400/50 to-transparent"></div>
      </aside>
    </>
  )
}