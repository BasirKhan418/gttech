'use client'
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

const HeroSection = () => {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Particles - Fixed positions to avoid hydration mismatch */}
      <div className="absolute inset-0">
        {[
          { left: 10, top: 20, delay: 0, duration: 4 },
          { left: 80, top: 15, delay: 1, duration: 5 },
          { left: 25, top: 70, delay: 2, duration: 3.5 },
          { left: 60, top: 40, delay: 0.5, duration: 4.5 },
          { left: 90, top: 80, delay: 1.5, duration: 3 },
          { left: 15, top: 90, delay: 2.5, duration: 6 },
          { left: 70, top: 25, delay: 0.2, duration: 4.2 },
          { left: 40, top: 60, delay: 1.8, duration: 5.5 },
          { left: 95, top: 10, delay: 3, duration: 3.8 },
          { left: 5, top: 50, delay: 0.8, duration: 4.8 },
          { left: 55, top: 85, delay: 2.2, duration: 3.2 },
          { left: 30, top: 30, delay: 1.2, duration: 5.2 },
          { left: 75, top: 65, delay: 2.8, duration: 4.1 },
          { left: 20, top: 5, delay: 0.3, duration: 3.9 },
          { left: 85, top: 45, delay: 1.7, duration: 4.7 },
          { left: 45, top: 75, delay: 2.1, duration: 3.3 },
          { left: 65, top: 35, delay: 0.9, duration: 5.1 },
          { left: 35, top: 55, delay: 2.6, duration: 3.6 },
          { left: 12, top: 12, delay: 1.4, duration: 4.4 },
          { left: 88, top: 88, delay: 0.6, duration: 5.8 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-gray-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Engineering Excellence Since 2018
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="block animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-200">
              Unleash the Power
            </span>
            <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-400">
              of Digital Innovation
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-600">
            Accelerate your digital transformation with intelligent engineering solutions, 
            Industry 4.0 technologies, and cutting-edge design services that drive innovation across industries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-800">
            <Link
              href="/services"
              className="group px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/25"
            >
              Explore Our Solutions
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Start Your Project
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-1000">
            {[
              { number: '500+', label: 'Projects Delivered' },
              { number: '50+', label: 'Industry Partners' },
              { number: '10+', label: 'Years Experience' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor Mockup */}
      <div className="absolute bottom-8 right-8 hidden lg:block animate-on-scroll opacity-0 translate-x-10 transition-all duration-1000 delay-1200">
        <div className="w-80 h-48 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 font-mono text-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-xs ml-2">innovation.js</span>
          </div>
          <div className="space-y-1 text-gray-300">
            <div><span className="text-blue-400">const</span> <span className="text-white">innovation</span> = </div>
            <div className="pl-4"><span className="text-green-400">ai:</span> <span className="text-yellow-400">'enabled'</span>,</div>
            <div className="pl-4"><span className="text-green-400">automation:</span> <span className="text-yellow-400">'advanced'</span>,</div>
            <div className="pl-4"><span className="text-green-400">digitalTwin:</span> <span className="text-blue-400">true</span>,</div>
            <div className="pl-4"><span className="text-green-400">industry40:</span> <span className="text-blue-400">true</span></div>
            <div></div>
            <div className="pt-2 text-gray-500">// Building the future...</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection