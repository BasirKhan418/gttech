'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const RedesignedPreloader = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Check if this is a page refresh/reload vs route navigation
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const isPageReload = navigationEntries.length > 0 && 
      (navigationEntries[0].type === 'reload' || navigationEntries[0].type === 'navigate')

    // Show preloader on page refresh/reload or first visit
    if (isPageReload || !sessionStorage.getItem('visited')) {
      setIsLoading(true)
      sessionStorage.setItem('visited', 'true')

      // Show content after initial delay
      setTimeout(() => setShowContent(true), 300)

      // Hide preloader after animation completes
      setTimeout(() => setIsLoading(false), 4000)
    } else {
      setIsLoading(false)
    }
  }, [])

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-cyan-50 to-cyan-100 overflow-hidden">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-12">
        <div 
          className="absolute inset-0 animate-grid-flow"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Radial Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-400/15 via-cyan-200/8 to-transparent rounded-full animate-pulse-glow" />
      </div>

      {/* Floating Energy Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-energy"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${15 + (i * 6)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 3)}s`
            }}
          >
            <div className={`w-3 h-3 rounded-full ${
              i % 3 === 0 ? 'bg-cyan-500/70' : i % 3 === 1 ? 'bg-cyan-400/60' : 'bg-cyan-300/50'
            } shadow-lg shadow-current animate-pulse-orb`} />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className={`relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* Logo Container with Advanced Effects */}
        <div className="relative group">
          
          {/* Outer Glow Ring */}
          <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400/25 via-cyan-500/35 via-cyan-300/30 to-cyan-400/25 rounded-2xl blur-2xl animate-rotate-glow" />
          
          {/* Secondary Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300/20 to-cyan-400/20 rounded-xl blur-xl animate-pulse-secondary" />
          
          {/* Logo Background Panel */}
          <div className="relative bg-gradient-to-br from-white/90 via-cyan-50/80 to-white/85 backdrop-blur-2xl border border-cyan-400/40 rounded-2xl p-12 shadow-2xl overflow-hidden">
            
            {/* Glass Morphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/10 via-transparent to-cyan-300/8 rounded-2xl" />
            
            {/* Animated Border Shine */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-border-shine" />
            </div>
            
            {/* Logo with Multiple Shine Effects */}
            <div className="relative">
              
              {/* Logo Image */}
              <div className="relative animate-logo-float">
                <Image
                  src="/logo.png"
                  alt="GT Tech Logo"
                  width={280}
                  height={140}
                  className="relative z-10 filter drop-shadow-2xl"
                  priority
                />
                
                {/* Primary Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 animate-logo-shine skew-x-12" />
                
                {/* Secondary Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 animate-logo-glare -skew-x-12" />
                
                {/* Prismatic Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 via-cyan-300/30 to-transparent opacity-0 animate-prismatic-shine" />
              </div>
              
              {/* Logo Reflection */}
              <div className="absolute top-full left-0 right-0 h-20 overflow-hidden opacity-15">
                <Image
                  src="/logo.png"
                  alt=""
                  width={280}
                  height={140}
                  className="scale-y-[-1] filter blur-sm"
                  style={{ 
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 100%)'
                  }}
                />
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-orbit"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${8 + (i % 3)}s`
                  }}
                >
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      i % 3 === 0 ? 'bg-cyan-500/80' : i % 3 === 1 ? 'bg-cyan-400/70' : 'bg-cyan-300/60'
                    } shadow-lg shadow-current`}
                    style={{
                      transform: `translateX(${60 + (i * 15)}px) translateY(-1px)`
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Corner Tech Accents */}
            <div className="absolute top-6 left-6">
              <div className="w-4 h-4 border-l-2 border-t-2 border-cyan-500/80 rounded-tl-lg animate-pulse-accent" />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-500/70 rounded-full animate-ping" />
            </div>
            <div className="absolute top-6 right-6">
              <div className="w-4 h-4 border-r-2 border-t-2 border-cyan-400/80 rounded-tr-lg animate-pulse-accent" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400/70 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-6 left-6">
              <div className="w-4 h-4 border-l-2 border-b-2 border-cyan-500/80 rounded-bl-lg animate-pulse-accent" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-500/70 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute bottom-6 right-6">
              <div className="w-4 h-4 border-r-2 border-b-2 border-cyan-400/80 rounded-br-lg animate-pulse-accent" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400/70 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>

        {/* Loading Text with Typewriter Effect */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 animate-text-glow">
            <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 via-cyan-400 to-cyan-700 bg-clip-text text-transparent animate-gradient-shift">
              Initializing Experience
            </span>
          </h2>
          <p className="text-gray-600 text-lg animate-fade-in-delayed">
            <span className="animate-typewriter">Crafting your digital journey...</span>
          </p>
        </div>

        {/* Animated Loading Dots */}
        <div className="mt-8 flex justify-center space-x-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full animate-bounce-sequence shadow-lg shadow-current"
              style={{ 
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.15;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.25;
          }
        }

        @keyframes float-energy {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% { 
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% { 
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }

        @keyframes pulse-orb {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @keyframes rotate-glow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-secondary {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.35;
            transform: scale(1.05);
          }
        }

        @keyframes border-shine {
          0% { 
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
            opacity: 0;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(100%) translateY(100%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes logo-float {
          0%, 100% { 
            transform: translateY(0px) scale(1);
          }
          50% { 
            transform: translateY(-8px) scale(1.02);
          }
        }

        @keyframes logo-shine {
          0% { 
            transform: translateX(-120%) skewX(25deg);
            opacity: 0;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(120%) skewX(25deg);
            opacity: 0;
          }
        }

        @keyframes logo-glare {
          0% { 
            transform: translateX(-120%) skewX(-25deg);
            opacity: 0;
          }
          30% { 
            opacity: 0.8;
          }
          100% { 
            transform: translateX(120%) skewX(-25deg);
            opacity: 0;
          }
        }

        @keyframes prismatic-shine {
          0% { 
            transform: translateX(-150%) rotate(45deg);
            opacity: 0;
          }
          20% { 
            opacity: 0.7;
          }
          100% { 
            transform: translateX(150%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-accent {
          0%, 100% { 
            opacity: 0.8;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes text-glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
          }
          50% { 
            text-shadow: 0 0 30px rgba(6, 182, 212, 0.9), 0 0 40px rgba(6, 182, 212, 0.6);
          }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes typewriter {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes fade-in-delayed {
          0% { 
            opacity: 0;
            transform: translateY(10px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-sequence {
          0%, 80%, 100% { 
            transform: scale(1) translateY(0);
          }
          40% { 
            transform: scale(1.2) translateY(-10px);
          }
        }

        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .animate-float-energy {
          animation: float-energy 6s ease-in-out infinite;
        }

        .animate-pulse-orb {
          animation: pulse-orb 2s ease-in-out infinite;
        }

        .animate-rotate-glow {
          animation: rotate-glow 8s linear infinite;
        }

        .animate-pulse-secondary {
          animation: pulse-secondary 3s ease-in-out infinite;
        }

        .animate-border-shine {
          animation: border-shine 3s ease-in-out infinite;
        }

        .animate-logo-float {
          animation: logo-float 4s ease-in-out infinite;
        }

        .animate-logo-shine {
          animation: logo-shine 2.5s ease-in-out infinite;
        }

        .animate-logo-glare {
          animation: logo-glare 3s ease-in-out infinite 0.8s;
        }

        .animate-prismatic-shine {
          animation: prismatic-shine 4s ease-in-out infinite 1.5s;
        }

        .animate-orbit {
          animation: orbit 10s linear infinite;
        }

        .animate-pulse-accent {
          animation: pulse-accent 2s ease-in-out infinite;
        }

        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease-in-out infinite;
        }

        .animate-typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(30) 1s forwards;
          width: 0;
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 1s ease-out 1.5s forwards;
          opacity: 0;
        }

        .animate-bounce-sequence {
          animation: bounce-sequence 1.2s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}

export default RedesignedPreloader