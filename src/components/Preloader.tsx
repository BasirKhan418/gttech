'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const RedesignedPreloader = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const isPageReload =
      navigationEntries.length > 0 &&
      (navigationEntries[0].type === 'reload' || navigationEntries[0].type === 'navigate')

    if (isPageReload || !sessionStorage.getItem('visited')) {
      setIsLoading(true)
      sessionStorage.setItem('visited', 'true')

      setTimeout(() => setShowContent(true), 300)
      setTimeout(() => setIsLoading(false), 2800)
    } else {
      setIsLoading(false)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-cyan-50/40 to-white overflow-hidden">
      {/* Soft Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(6,182,212,0.25) 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Soft Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-3xl animate-glowPulse" />

      {/* Content */}
      <div className={`relative z-10 text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Animated Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 border-[6px] border-transparent border-t-cyan-400 rounded-full animate-ringSpin" />
          <div className="absolute inset-4 border-[4px] border-transparent border-t-cyan-300 rounded-full animate-ringSpinSlow" />

          {/* Logo */}
          <div className="relative animate-logoPop">
            <Image
              src="/logo.png"
              alt="GT Tech Logo"
              width={200}
              height={100}
              className="relative z-10 drop-shadow-md"
              priority
            />
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-logoShimmer rounded-md" />
          </div>
        </div>

        {/* Text */}
        <h2 className="mt-6 text-xl font-medium text-slate-700">
          <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
            Loading Experience
          </span>
        </h2>
        <p className="text-slate-500 text-sm">Please wait a moment...</p>
      </div>

      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        @keyframes ringSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ringSpinSlow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes logoShimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes logoPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-glowPulse { animation: glowPulse 4s ease-in-out infinite; }
        .animate-ringSpin { animation: ringSpin 1.5s linear infinite; }
        .animate-ringSpinSlow { animation: ringSpinSlow 3s linear infinite; }
        .animate-logoShimmer { animation: logoShimmer 2.2s ease-in-out infinite 0.5s; }
        .animate-logoPop { animation: logoPop 0.6s ease-out forwards; }
      `}</style>
    </div>
  )
}

export default RedesignedPreloader
