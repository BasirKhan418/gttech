'use client'
import React from 'react'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Eye,
  TrendingUp,
  Activity,
  Calendar,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Content Items",
      value: "1,829",
      change: "+8%",
      trend: "up",
      icon: FileText,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Page Views",
      value: "89,432",
      change: "+23%",
      trend: "up",
      icon: Eye,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Analytics",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: BarChart3,
      color: "from-orange-500 to-red-500"
    }
  ]

  const recentActivities = [
    { action: "New content added", user: "Admin", time: "2 minutes ago", type: "content" },
    { action: "User registered", user: "john@example.com", time: "15 minutes ago", type: "user" },
    { action: "Banner updated", user: "Admin", time: "1 hour ago", type: "banner" },
    { action: "System backup completed", user: "System", time: "3 hours ago", type: "system" },
    { action: "Media uploaded", user: "Admin", time: "5 hours ago", type: "media" }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 border border-sky-500/20 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-gray-900/40 backdrop-blur-xl overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.05] via-transparent to-cyan-500/[0.03]"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 2 === 0 ? 'bg-sky-400/40' : 'bg-white/20'
              }`}
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Welcome back, <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Admin</span>
              </h1>
              <p className="text-lg text-gray-300">
                Here's what's happening with your platform today.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="glass-button px-4 py-2 bg-sky-500/20 border border-sky-400/40 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-sky-200">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border border-sky-500/20 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-gray-900/40 backdrop-blur-xl overflow-hidden relative group hover:scale-105 transition-all duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.03] via-transparent to-cyan-500/[0.02]"></div>
            
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 backdrop-blur-sm border border-white/10`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-white group-hover:text-sky-200 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="text-green-400 font-medium">{stat.change}</span>
                <span className="text-gray-400">from last month</span>
              </div>
            </CardContent>

            {/* Decorative Corner */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-sky-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activities */}
        <Card className="glass-card border border-sky-500/20 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-gray-900/40 backdrop-blur-xl overflow-hidden relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.03] via-transparent to-cyan-500/[0.02]"></div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-400" />
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest actions performed on your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg glass-button bg-white/5 border border-white/10 hover:bg-sky-500/10 hover:border-sky-400/30 transition-all duration-300">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'content' ? 'bg-blue-400' :
                  activity.type === 'user' ? 'bg-green-400' :
                  activity.type === 'banner' ? 'bg-purple-400' :
                  activity.type === 'system' ? 'bg-orange-400' :
                  'bg-gray-400'
                } animate-pulse`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-gray-400">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border border-sky-500/20 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-gray-900/40 backdrop-blur-xl overflow-hidden relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.03] via-transparent to-cyan-500/[0.02]"></div>

          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Frequently used admin functions
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            {[
              { name: "Add New Content", href: "/admin/content/add", icon: FileText, color: "from-blue-500 to-cyan-500" },
              { name: "Create Banner", href: "/admin/banners/add", icon: Globe, color: "from-purple-500 to-pink-500" },
              { name: "Upload Media", href: "/admin/media/upload", icon: Eye, color: "from-green-500 to-emerald-500" },
              { name: "Add Admin User", href: "/admin/users/add", icon: Users, color: "from-orange-500 to-red-500" }
            ].map((action, index) => (
              <button
                key={index}
                className="glass-button w-full flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-sky-500/10 hover:border-sky-400/30 hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-20 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium group-hover:text-sky-200 transition-colors duration-300">
                  {action.name}
                </span>
                <div className="flex-1"></div>
                <div className="w-2 h-2 bg-sky-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard