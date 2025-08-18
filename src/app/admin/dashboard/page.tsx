'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Eye,
  TrendingUp,
  Activity,
  Calendar,
  Globe,
  Briefcase,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardData {
  users: any[]
  content: any[]
  banners: any[]
  careers: any[]
  gallery: any[]
  teams: any[]
  sliders: any[]
}

interface RecentActivity {
  id: string
  action: string
  user: string
  time: string
  type: 'content' | 'user' | 'banner' | 'career' | 'gallery' | 'team' | 'slider'
  target?: string
}
interface Admin {
  _id: string
  name: string
  username?: string
  email: string
  img?: string
  bio: string
  phone: string
  iscentraladmin: boolean
  twofactor: boolean
  createdAt: string
  updatedAt: string
}
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: [],
    content: [],
    banners: [],
    careers: [],
    gallery: [],
    teams: [],
    sliders: []
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [healthCheck, setHealthCheck] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    fetchDashboardData()
    fetchCurrentAdminData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [usersRes, contentRes, bannersRes, careersRes, galleryRes, teamsRes, slidersRes] = await Promise.allSettled([
        fetch('/api/admin/all'),
        fetch('/api/content'),
        fetch('/api/banner'),
        fetch('/api/career'),
        fetch('/api/gallery'),
        fetch('/api/team'),
        fetch('/api/slider')
      ])

      const data: DashboardData = {
        users: usersRes.status === 'fulfilled' ? (await usersRes.value.json()).admins || [] : [],
        content: contentRes.status === 'fulfilled' ? (await contentRes.value.json()).data || [] : [],
        banners: bannersRes.status === 'fulfilled' ? (await bannersRes.value.json()).data || [] : [],
        careers: careersRes.status === 'fulfilled' ? (await careersRes.value.json()).data || [] : [],
        gallery: galleryRes.status === 'fulfilled' ? (await galleryRes.value.json()).data || [] : [],
        teams: teamsRes.status === 'fulfilled' ? (await teamsRes.value.json()).data || [] : [],
        sliders: slidersRes.status === 'fulfilled' ? (await slidersRes.value.json()).data || [] : []
      }

      setDashboardData(data)
      
      if (!healthCheck && data.users.length > 0) {
        setHealthCheck({ name: data.users[3].name || 'Admin', email: data.users[0].email || '' })
      }
      
      generateRecentActivities(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentAdminData = async () => {
    try {
      const response = await fetch('/api/admin/') 
      if (response.ok) {
        const userData = await response.json()
        setHealthCheck({ name: userData.name, email: userData.email })
      }
    } catch (error) {
      console.error('Error fetching current admin data:', error)
      setHealthCheck({ name: 'Admin', email: '' })
    }
  }

  const generateRecentActivities = (data: DashboardData) => {
    const activities: RecentActivity[] = []

    // Generate activities from recent content
    data.content.slice(0, 3).forEach((item, index) => {
      activities.push({
        id: `content-${item._id}`,
        action: 'Content added',
        user: 'Admin',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'content',
        target: item.sectionName || item.title
      })
    })

    // Generate activities from recent banners
    data.banners.slice(0, 2).forEach((item, index) => {
      activities.push({
        id: `banner-${item._id}`,
        action: 'Banner updated',
        user: 'Admin',
        time: getRelativeTime(item.updatedAt || item.createdAt || new Date()),
        type: 'banner',
        target: item.title
      })
    })

    // Generate activities from recent careers
    data.careers.slice(0, 2).forEach((item, index) => {
      activities.push({
        id: `career-${item._id}`,
        action: 'Job posting added',
        user: 'Admin',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'career',
        target: item.role
      })
    })

    // Sort by most recent
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    setRecentActivities(activities.slice(0, 10))
  }

  const getRelativeTime = (date: string | Date) => {
    const now = new Date()
    const past = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour ago`
    return `${Math.floor(diffInMinutes / 1440)} day ago`
  }

  const stats = [
    {
      title: "Total Users",
      value: (dashboardData.users?.length || 0).toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-cyan-500 to-cyan-600",
      description: "Registered admin users",
      link: "/admin/users"
    },
    {
      title: "Content Items",
      value: (dashboardData.content?.length || 0).toString(),
      change: "+8%",
      trend: "up",
      icon: FileText,
      color: "from-emerald-500 to-emerald-600",
      description: "Published content sections",
      link: "/admin/content"
    },
    {
      title: "Active Banners",
      value: (dashboardData.banners?.filter(b => b.isActive).length || 0).toString(),
      change: "+23%",
      trend: "up",
      icon: Globe,
      color: "from-purple-500 to-purple-600",
      description: "Live promotional banners",
      link: "/admin/banners"
    },
    {
      title: "Open Positions",
      value: (dashboardData.careers?.filter(c => c.isActive).length || 0).toString(),
      change: "+5%",
      trend: "up",
      icon: Briefcase,
      color: "from-orange-500 to-orange-600",
      description: "Active job postings",
      link: "/admin/career"
    },
    {
      title: "Gallery Items",
      value: (dashboardData.gallery?.length || 0).toString(),
      change: "+15%",
      trend: "up",
      icon: ImageIcon,
      color: "from-blue-500 to-blue-600",
      description: "Media gallery assets",
      link: "/admin/gallery"
    },
    {
      title: "Team Members",
      value: (dashboardData.teams?.length || 0).toString(),
      change: "+3%",
      trend: "up",
      icon: Users,
      color: "from-green-500 to-green-600",
      description: "Team member profiles",
      link: "/admin/teams"
    }
  ]

  const quickActions = [
    { 
      name: "Add New Content", 
      href: "/admin/content/add", 
      icon: FileText, 
      color: "from-cyan-500 to-cyan-600",
      description: "Create website content"
    },
    { 
      name: "Create Banner", 
      href: "/admin/banners/add", 
      icon: Globe, 
      color: "from-purple-500 to-purple-600",
      description: "Design promotional banner"
    },
    { 
      name: "Post Job Opening", 
      href: "/admin/career/add", 
      icon: Briefcase, 
      color: "from-orange-500 to-orange-600",
      description: "Add career opportunity"
    },
    { 
      name: "Upload Media", 
      href: "/admin/gallery/add", 
      icon: ImageIcon, 
      color: "from-emerald-500 to-emerald-600",
      description: "Add gallery images"
    },
    { 
      name: "Add Team Member", 
      href: "/admin/teams/add", 
      icon: Users, 
      color: "from-blue-500 to-blue-600",
      description: "Create team profile"
    },
    { 
      name: "Add Admin User", 
      href: "/admin/users/add", 
      icon: Users, 
      color: "from-green-500 to-green-600",
      description: "Create admin account"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white/70 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-white/70 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-white/70 rounded-xl"></div>
          <div className="h-96 bg-white/70 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 rounded-3xl p-8 lg:p-12 overflow-hidden shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Glass Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/40 to-white/50"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 2 === 0 ? 'bg-cyan-400/50' : 'bg-cyan-200/30'
              }`}
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${20 + (i * 8)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Welcome back, <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">{healthCheck?.name}</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Here's what's happening with your GT Technologies platform today.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 rounded-full shadow-lg">
                <div className="flex items-center space-x-3 text-cyan-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-6 right-6 w-12 h-12 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-cyan-400/40 to-cyan-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden group hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer">
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
              </div>

              <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-cyan-700 transition-colors duration-300">
                    {stat.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 text-sm mt-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">{stat.change}</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </CardContent>

              {/* Corner Decoration */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Arrow Icon */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="w-4 h-4 text-cyan-600" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activities */}
        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>

          <CardHeader className="relative z-10 border-b border-cyan-200/30">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-cyan-600" />
              </div>
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Latest actions performed on your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 p-0">
            <div className="max-h-96 overflow-y-auto">
              {recentActivities.length > 0 ? (
                <div className="space-y-1">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-cyan-50/50 transition-colors duration-200">
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'content' ? 'bg-cyan-500' :
                        activity.type === 'banner' ? 'bg-purple-500' :
                        activity.type === 'career' ? 'bg-orange-500' :
                        activity.type === 'gallery' ? 'bg-emerald-500' :
                        activity.type === 'team' ? 'bg-blue-500' :
                        'bg-gray-500'
                      } animate-pulse`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        {activity.target && (
                          <p className="text-xs text-cyan-600 font-medium">{activity.target}</p>
                        )}
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>

          <CardHeader className="relative z-10 border-b border-cyan-200/30">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Plus className="w-5 h-5 text-cyan-600" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Frequently used admin functions
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 p-0">
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2 p-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group flex items-center space-x-4 p-4 rounded-xl bg-white/50 border border-cyan-200/50 hover:bg-cyan-50/60 hover:border-cyan-300/60 hover:scale-105 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-800 font-semibold group-hover:text-cyan-700 transition-colors duration-300">
                        {action.name}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Content", value: dashboardData.content?.filter(c => c.isActive !== false).length || 0, icon: FileText, color: "cyan" },
          { label: "Live Banners", value: dashboardData.banners?.filter(b => b.isActive).length || 0, icon: Globe, color: "purple" },
          { label: "Open Jobs", value: dashboardData.careers?.filter(c => c.isActive).length || 0, icon: Briefcase, color: "orange" },
          { label: "Gallery Items", value: dashboardData.gallery?.length || 0, icon: ImageIcon, color: "emerald" }
        ].map((item, index) => (
          <div key={index} className="relative bg-white/70 backdrop-blur-xl border border-cyan-300/40 rounded-2xl p-6 overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-cyan-50/20 to-white/30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${item.color}-500/20 border border-${item.color}-400/40`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <Badge variant="secondary" className="bg-cyan-100/80 text-cyan-700 border-cyan-300/50">
                  Live
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <p className="text-sm text-gray-600 font-medium">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard