'use client'
import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-cyan-400/30' : i % 3 === 1 ? 'bg-cyan-300/25' : 'bg-cyan-200/20'
            }`}
            style={{
              left: `${5 + (i * 6)}%`,
              top: `${10 + (i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isMobile ? 'w-72' : ''}`}>
        <AdminSidebar />
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-cyan-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Header */}
      <AdminHeader 
        onToggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen && !isMobile} 
      />

      {/* Main Content */}
      <main className={`glass-content transition-all duration-300 pt-16 min-h-screen ${
        isSidebarOpen && !isMobile ? 'ml-72' : 'ml-0'
      }`}>
        {/* Content Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-cyan-50/60 to-cyan-100/50 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-cyan-300/5"></div>
        
        {/* Content Wrapper */}
        <div className="relative z-10 p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Decorative Corner Elements */}
      <div className="fixed top-4 right-4 w-8 h-8 border-2 border-cyan-400/30 rounded-lg rotate-45 animate-pulse backdrop-blur-sm bg-cyan-100/20 pointer-events-none"></div>
      <div className="fixed bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-cyan-400/30 to-cyan-300/20 rounded-full animate-bounce backdrop-blur-sm pointer-events-none"></div>
    </div>
  )
}

export default AdminLayout