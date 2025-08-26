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
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Bell,
  MessageSquare,
  Target,
  DollarSign,
  UserCheck,
  Building,
  MapPin,
  Layers,
  Zap,
  PlusCircle,
  BarChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  _id: string
  name: string
  email: string
  username: string
  phone?: string
  createdAt: string
}

interface DashboardData {
  users: User[]
  content: any[]
  banners: any[]
  careers: any[]
  gallery: any[]
  teams: any[]
  sliders: any[]
  projects: any[]
  industries: any[]
  gaqRequests: any[]
}

interface GAQStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  cancelled: number
}

interface RecentActivity {
  id: string
  action: string
  user: string
  time: string
  type: 'content' | 'user' | 'banner' | 'career' | 'gallery' | 'team' | 'slider' | 'project' | 'industry' | 'gaq'
  target?: string
  status?: string
}

interface CurrentUser {
  name: string
  email: string
  userid: string
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: [],
    content: [],
    banners: [],
    careers: [],
    gallery: [],
    teams: [],
    sliders: [],
    projects: [],
    industries: [],
    gaqRequests: []
  })
  
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [gaqStats, setGAQStats] = useState<GAQStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [timeFilter, setTimeFilter] = useState('7d')

  useEffect(() => {
    fetchDashboardData()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/admin/health')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setCurrentUser({
            name: result.data.name,
            email: result.data.email,
            userid: result.data._id
          })
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel with better error handling
      const fetchPromises = [
        fetch('/api/admin/all').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/content').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/banner').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/career').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/gallery').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/team').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/slider').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/project').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/industry').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/gaq').then(res => res.ok ? res.json() : { success: false, data: [] }),
        fetch('/api/gaq?stats=true').then(res => res.ok ? res.json() : { success: false, stats: {} })
      ]

      const [
        usersRes, contentRes, bannersRes, careersRes, galleryRes, 
        teamsRes, slidersRes, projectsRes, industriesRes, gaqRes, gaqStatsRes
      ] = await Promise.allSettled(fetchPromises)

      // Process results with safer data extraction
      const data: DashboardData = {
        users: usersRes.status === 'fulfilled' && usersRes.value.success ? usersRes.value.admins || usersRes.value.data || [] : [],
        content: contentRes.status === 'fulfilled' && contentRes.value.success ? contentRes.value.data || [] : [],
        banners: bannersRes.status === 'fulfilled' && bannersRes.value.success ? bannersRes.value.data || [] : [],
        careers: careersRes.status === 'fulfilled' && careersRes.value.success ? careersRes.value.data || [] : [],
        gallery: galleryRes.status === 'fulfilled' && galleryRes.value.success ? galleryRes.value.data || [] : [],
        teams: teamsRes.status === 'fulfilled' && teamsRes.value.success ? teamsRes.value.data || [] : [],
        sliders: slidersRes.status === 'fulfilled' && slidersRes.value.success ? slidersRes.value.data || [] : [],
        projects: projectsRes.status === 'fulfilled' && projectsRes.value.success ? projectsRes.value.data || [] : [],
        industries: industriesRes.status === 'fulfilled' && industriesRes.value.success ? industriesRes.value.data || [] : [],
        gaqRequests: gaqRes.status === 'fulfilled' && gaqRes.value.success ? gaqRes.value.data || [] : []
      }

      // Process GAQ stats
      if (gaqStatsRes.status === 'fulfilled' && gaqStatsRes.value.success) {
        setGAQStats(gaqStatsRes.value.stats || {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0
        })
      }

      setDashboardData(data)
      generateRecentActivities(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const generateRecentActivities = (data: DashboardData) => {
    const activities: RecentActivity[] = []

    // Generate activities from recent content
    data.content.slice(0, 3).forEach((item) => {
      activities.push({
        id: `content-${item._id}`,
        action: 'Content published',
        user: 'Admin',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'content',
        target: item.sectionName || item.title,
        status: item.isActive ? 'active' : 'inactive'
      })
    })

    // GAQ requests
    data.gaqRequests.slice(0, 3).forEach((item) => {
      activities.push({
        id: `gaq-${item._id}`,
        action: 'GAQ Request received',
        user: item.name || 'Client',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'gaq',
        target: item.projectType,
        status: item.status
      })
    })

    // Career postings
    data.careers.slice(0, 2).forEach((item) => {
      activities.push({
        id: `career-${item._id}`,
        action: 'Job posting created',
        user: 'Admin',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'career',
        target: item.role,
        status: item.isActive ? 'active' : 'inactive'
      })
    })

    // Projects
    data.projects.slice(0, 2).forEach((item) => {
      activities.push({
        id: `project-${item._id}`,
        action: 'Project added',
        user: 'Admin',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'project',
        target: item.title,
        status: item.status || 'active'
      })
    })

    // Industries
    data.industries.slice(0, 2).forEach((item) => {
      activities.push({
        id: `industry-${item._id}`,
        action: 'Industry solution added',
        user: 'Admin',
        time: getRelativeTime(item.createdAt || new Date()),
        type: 'industry',
        target: item.title,
        status: item.isActive ? 'active' : 'inactive'
      })
    })

    // Sort by most recent and apply filters
    let filteredActivities = activities.sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    )

    if (filterType !== 'all') {
      filteredActivities = filteredActivities.filter(activity => activity.type === filterType)
    }

    if (searchTerm) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.target?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setRecentActivities(filteredActivities.slice(0, 15))
  }

  const getRelativeTime = (date: string | Date) => {
    const now = new Date()
    const past = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': case 'completed': case 'published': return 'bg-green-500'
      case 'pending': case 'draft': return 'bg-yellow-500'
      case 'inactive': case 'cancelled': return 'bg-red-500'
      case 'in-progress': case 'processing': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const stats = [
    {
      title: "Total Admins",
      value: (dashboardData.users?.length || 0).toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-cyan-500 to-cyan-600",
      description: "Registered admin users",
      link: "/admin/users"
    },
    {
      title: "Content Sections",
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
    },
    {
      title: "Active Projects",
      value: (dashboardData.projects?.length || 0).toString(),
      change: "+18%",
      trend: "up",
      icon: Target,
      color: "from-indigo-500 to-indigo-600",
      description: "Active projects",
      link: "/admin/projects"
    },
    {
      title: "Industry Solutions",
      value: (dashboardData.industries?.length || 0).toString(),
      change: "+7%",
      trend: "up",
      icon: Building,
      color: "from-pink-500 to-pink-600",
      description: "Industry specific solutions",
      link: "/admin/industry"
    },
    {
      title: "GAQ Requests",
      value: gaqStats.total.toString(),
      change: `${gaqStats.pending} pending`,
      trend: gaqStats.pending > 0 ? "neutral" : "up",
      icon: MessageSquare,
      color: "from-amber-500 to-amber-600",
      description: "Get a Quote requests",
      link: "/admin/gaq"
    }
  ]

  const quickActions = [
    { 
      name: "Add Content", 
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
      name: "Post Job", 
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
      name: "Add Project", 
      href: "/admin/projects/add", 
      icon: Target, 
      color: "from-indigo-500 to-indigo-600",
      description: "Create new project"
    },
    { 
      name: "Add Industry", 
      href: "/admin/industry/add", 
      icon: Building, 
      color: "from-pink-500 to-pink-600",
      description: "Add industry solution"
    },
    { 
      name: "Manage GAQ", 
      href: "/admin/gaq", 
      icon: MessageSquare, 
      color: "from-amber-500 to-amber-600",
      description: "Review quote requests"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white/70 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
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
      {/* Enhanced Welcome Section */}
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

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Welcome back, <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  {currentUser?.name || 'Admin'}
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Here's what's happening with your GT Technologies platform today.
              </p>
              {currentUser && (
                <p className="text-sm text-gray-500">
                  Logged in as {currentUser.email}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              
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
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.link}>
            <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden group hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer">
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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
                  {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                  {stat.trend === "neutral" && <Clock className="h-4 w-4 text-amber-500" />}
                  <span className={`font-medium ${
                    stat.trend === "up" ? "text-emerald-500" : 
                    stat.trend === "neutral" ? "text-amber-500" : "text-red-500"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>

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
        
        {/* Enhanced Recent Activities */}
        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>

          <CardHeader className="relative z-10 border-b border-cyan-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <CardTitle className="text-gray-800">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-600">
                    Latest actions on your platform
                  </CardDescription>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => generateRecentActivities(dashboardData)}
                className="h-8"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40 h-9">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="gaq">GAQ Requests</SelectItem>
                  <SelectItem value="career">Careers</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="industry">Industries</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 p-0">
            <div className="max-h-96 overflow-y-auto">
              {recentActivities.length > 0 ? (
                <div className="space-y-1">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-cyan-50/50 transition-colors duration-200">
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getStatusColor(activity.status || 'active')} animate-pulse`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        {activity.target && (
                          <p className="text-xs text-cyan-600 font-medium">{activity.target}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">by {activity.user}</p>
                          {activity.status && (
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activities found</p>
                  {(searchTerm || filterType !== 'all') && (
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchTerm('')
                        setFilterType('all')
                      }}
                      className="text-cyan-600 mt-2"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>

          <CardHeader className="relative z-10 border-b border-cyan-200/30">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-cyan-600" />
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

      {/* GAQ Statistics Section */}
      {gaqStats.total > 0 && (
        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/3"></div>

          <CardHeader className="relative z-10 border-b border-cyan-200/30">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <span>GAQ Requests Overview</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Get a Quote requests status breakdown
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
                <div className="text-2xl font-bold text-blue-600">{gaqStats.total}</div>
                <div className="text-sm text-blue-500">Total</div>
              </div>
              <div className="text-center p-4 bg-yellow-50/50 rounded-lg border border-yellow-200/50">
                <div className="text-2xl font-bold text-yellow-600">{gaqStats.pending}</div>
                <div className="text-sm text-yellow-500">Pending</div>
              </div>
              <div className="text-center p-4 bg-purple-50/50 rounded-lg border border-purple-200/50">
                <div className="text-2xl font-bold text-purple-600">{gaqStats.inProgress}</div>
                <div className="text-sm text-purple-500">In Progress</div>
              </div>
              <div className="text-center p-4 bg-green-50/50 rounded-lg border border-green-200/50">
                <div className="text-2xl font-bold text-green-600">{gaqStats.completed}</div>
                <div className="text-sm text-green-500">Completed</div>
              </div>
              <div className="text-center p-4 bg-red-50/50 rounded-lg border border-red-200/50">
                <div className="text-2xl font-bold text-red-600">{gaqStats.cancelled}</div>
                <div className="text-sm text-red-500">Cancelled</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Link href="/admin/gaq">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Manage GAQ Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Active Content", 
            value: dashboardData.content?.filter(c => c.isActive !== false).length || 0, 
            icon: FileText, 
            color: "cyan",
            status: "operational" 
          },
          { 
            label: "Live Banners", 
            value: dashboardData.banners?.filter(b => b.isActive).length || 0, 
            icon: Globe, 
            color: "purple",
            status: "operational" 
          },
          { 
            label: "Open Jobs", 
            value: dashboardData.careers?.filter(c => c.isActive).length || 0, 
            icon: Briefcase, 
            color: "orange",
            status: dashboardData.careers?.filter(c => c.isActive).length > 0 ? "operational" : "warning" 
          },
          { 
            label: "Gallery Items", 
            value: dashboardData.gallery?.length || 0, 
            icon: ImageIcon, 
            color: "emerald",
            status: "operational" 
          }
        ].map((item, index) => (
          <div key={index} className="relative bg-white/70 backdrop-blur-xl border border-cyan-300/40 rounded-2xl p-6 overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-cyan-50/20 to-white/30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${item.color}-500/20 border border-${item.color}-400/40`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${
                    item.status === 'operational' ? 'bg-green-100/80 text-green-700 border-green-300/50' :
                    item.status === 'warning' ? 'bg-yellow-100/80 text-yellow-700 border-yellow-300/50' :
                    'bg-red-100/80 text-red-700 border-red-300/50'
                  }`}
                >
                  {item.status === 'operational' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {item.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {item.status === 'operational' ? 'Live' : 'Needs Attention'}
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <BarChart className="w-5 h-5 text-cyan-600" />
              <span>Content Performance</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published</span>
                <span className="font-semibold text-green-600">
                  {dashboardData.content?.filter(c => c.isActive !== false).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Draft</span>
                <span className="font-semibold text-yellow-600">
                  {dashboardData.content?.filter(c => c.isActive === false).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sections</span>
                <span className="font-semibold text-blue-600">
                  {dashboardData.content?.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <Users className="w-5 h-5 text-cyan-600" />
              <span>Team Overview</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admins</span>
                <span className="font-semibold text-blue-600">
                  {dashboardData.users?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Team Members</span>
                <span className="font-semibold text-green-600">
                  {dashboardData.teams?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Open Positions</span>
                <span className="font-semibold text-orange-600">
                  {dashboardData.careers?.filter(c => c.isActive).length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-gray-800 flex items-center space-x-3">
              <Target className="w-5 h-5 text-cyan-600" />
              <span>Business Metrics</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projects</span>
                <span className="font-semibold text-indigo-600">
                  {dashboardData.projects?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Industries</span>
                <span className="font-semibold text-pink-600">
                  {dashboardData.industries?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quote Requests</span>
                <span className="font-semibold text-amber-600">
                  {gaqStats.total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/30 to-white/40"></div>
        
        <CardHeader className="relative z-10 border-b border-cyan-200/30">
          <CardTitle className="text-gray-800 flex items-center space-x-3">
            <Settings className="w-5 h-5 text-cyan-600" />
            <span>Action Center</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Important tasks and notifications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pending GAQ Requests */}
            {gaqStats.pending > 0 && (
              <div className="p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-800">{gaqStats.pending} Pending GAQ Requests</p>
                    <p className="text-sm text-yellow-600">Require immediate attention</p>
                  </div>
                </div>
                <Link href="/admin/gaq">
                  <Button size="sm" className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white">
                    Review Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Inactive Content */}
            {dashboardData.content?.filter(c => c.isActive === false).length > 0 && (
              <div className="p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">
                      {dashboardData.content?.filter(c => c.isActive === false).length} Draft Content
                    </p>
                    <p className="text-sm text-blue-600">Ready to publish</p>
                  </div>
                </div>
                <Link href="/admin/content">
                  <Button size="sm" className="mt-3 bg-blue-500 hover:bg-blue-600 text-white">
                    Manage Content
                  </Button>
                </Link>
              </div>
            )}

            {/* System Health */}
            <div className="p-4 bg-green-50/50 border border-green-200/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">System Healthy</p>
                  <p className="text-sm text-green-600">All services operational</p>
                </div>
              </div>
              <Button size="sm" className="mt-3 bg-green-500 hover:bg-green-600 text-white" disabled>
                All Good ✓
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard