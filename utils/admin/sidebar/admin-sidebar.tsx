"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  {
    icon: FileText,
    label: "CMS",
    href: "/admin/cms",
    subItems: ["Pages", "Menus", "Media Library"],
  },
  {
    icon: FileEdit,
    label: "Blogs",
    href: "/admin/blogs",
    subItems: ["All Posts", "Add New", "Categories", "Tags"],
  },
  {
    icon: Users,
    label: "CRM",
    href: "/admin/crm",
    subItems: ["Leads", "Add Lead", "Reports"],
  },
  {
    icon: ImageIcon,
    label: "Sliders & Banners",
    href: "/admin/sliders",
    subItems: ["Manage", "Add New", "Schedule"],
  },
  {
    icon: Bot,
    label: "AI Chatbot",
    href: "/admin/chatbot",
    subItems: ["Settings", "Responses", "Training Data"],
  },
  {
    icon: Users,
    label: "Users & Roles",
    href: "/admin/users",
    subItems: ["Manage Users", "Permissions"],
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

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 overflow-y-auto",
        "lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        sidebarCollapsed ? "lg:w-16" : "lg:w-64",
        "w-64", // Always full width on mobile when open
      )}
    >
      <div className="lg:hidden flex justify-end p-2">
        <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Admin Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback className="bg-blue-600 text-white">BK</AvatarFallback>
                </Avatar>
                <Circle className="absolute -bottom-1 -right-1 h-4 w-4 fill-green-500 text-green-500" />
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">Basir Khan</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Super Admin</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Online
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 space-y-1">
        {sidebarItems.map((item, index) => (
          <div key={index}>
            <Button
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10 relative group",
                sidebarCollapsed && !mobileMenuOpen && "lg:px-2",
                item.active && "bg-blue-600 text-white hover:bg-blue-700",
              )}
              onClick={() => {
                if (item.subItems) {
                  toggleExpanded(index)
                }
                // Close mobile menu when navigating
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(false)
                }
              }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.subItems && (
                    <div className="ml-auto">
                      {expandedItems.includes(index) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </>
              )}

              {sidebarCollapsed && !mobileMenuOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Button>

            {(!sidebarCollapsed || mobileMenuOpen) && item.subItems && expandedItems.includes(index) && (
              <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {item.subItems.map((subItem, subIndex) => (
                  <Button
                    key={subIndex}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      // Close mobile menu when navigating
                      if (window.innerWidth < 1024) {
                        setMobileMenuOpen(false)
                      }
                    }}
                  >
                    {subItem}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
