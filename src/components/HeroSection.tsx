'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const showcases = [
    {
      id: 1,
      title: "Smart Manufacturing Dashboard",
      category: "Industry 4.0",
      image: "/1.jpeg",
      description: "AI-powered production monitoring system with real-time analytics"
    },
    {
      id: 2,
      title: "Digital Twin Simulation",
      category: "Engineering Solutions",
      image: "/1.jpeg", 
      description: "Advanced 3D modeling and simulation with Dassault Systemes"
    },
    {
      id: 3,
      title: "Augmented Reality Training",
      category: "AR/VR Solutions",
      image: "/1.jpeg",
      description: "Immersive learning experiences for industrial applications"
    },
    {
      id: 4,
      title: "Robotics Automation",
      category: "Automation",
      image: "/1.jpeg",
      description: "Intelligent robotic solutions for manufacturing excellence"
    },
    {
      id: 5,
      title: "Centre of Excellence",
      category: "Skill Development",
      image: "/1.jpeg",
      description: "Advanced training programs for emerging technologies"
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcases.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [showcases.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showcases.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + showcases.length) % showcases.length)
  }

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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-16 lg:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5 lg:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles with Blue Accent */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: 10, top: 20, delay: 0, duration: 4 },
          { left: 80, top: 15, delay: 1, duration: 5 },
          { left: 25, top: 70, delay: 2, duration: 3.5 },
          { left: 60, top: 40, delay: 0.5, duration: 4.5 }
        ].map((particle, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 2 === 0 ? 'bg-blue-400/30' : 'bg-white/20'
            }`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* Left Side - Circuit Tech Pattern */}
      <div className="absolute left-0 top-0 bottom-0 w-32 hidden xl:block overflow-hidden">
        <div className="relative h-full">
          {/* Data Stream Effect */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-data-flow"
                style={{
                  left: `${i * 15}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>

          {/* Circular Nodes */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  top: `${5 + (i * 6)}%`,
                  left: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.4}s`
                }}
              >
                <div className={`rounded-full border ${i % 2 === 0 ? 'border-blue-400/40' : 'border-white/30'} ${i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-1'}`}>
                  <div className={`rounded-full w-full h-full animate-ping ${i % 2 === 0 ? 'bg-blue-400/20' : 'bg-white/10'}`}
                       style={{ animationDelay: `${i * 0.6}s` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-4 h-full gap-1 p-2">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-matrix-blink ${i % 7 === 0 ? 'h-2' : i % 5 === 0 ? 'h-1' : 'h-0.5'} ${
                    i % 3 === 0 ? 'bg-blue-400/20' : 'bg-white/10'
                  }`}
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${2 + (i % 3)}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Orbital Rings */}
          <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-white/20 animate-spin-reverse"></div>
              <div className="absolute inset-4 rounded-full border border-blue-400/50"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 400" fill="none">
              <path 
                d="M80 50 Q60 80 40 120 T0 180 Q20 220 40 260 T80 320"
                stroke="url(#gradientLeft1)"
                strokeWidth="0.5"
                fill="none"
                className="animate-dash"
              />
              <path 
                d="M90 80 Q70 110 50 150 T10 210 Q30 250 50 290 T90 350"
                stroke="url(#gradientLeft2)"
                strokeWidth="0.3"
                fill="none"
                className="animate-dash"
                style={{ animationDelay: '2s' }}
              />
              <defs>
                <linearGradient id="gradientLeft1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                  <stop offset="50%" stopColor="rgba(59,130,246,0.5)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.2)" />
                </linearGradient>
                <linearGradient id="gradientLeft2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Circuit Tech Pattern (Mirrored) */}
      <div className="absolute right-0 top-0 bottom-0 w-32 hidden xl:block overflow-hidden">
        <div className="relative h-full">
          {/* Data Stream Effect */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-data-flow"
                style={{
                  right: `${i * 15}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>

          {/* Circular Nodes */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  top: `${5 + (i * 6)}%`,
                  right: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.4}s`
                }}
              >
                <div className={`rounded-full border ${i % 2 === 0 ? 'border-blue-400/40' : 'border-white/30'} ${i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-1'}`}>
                  <div className={`rounded-full w-full h-full animate-ping ${i % 2 === 0 ? 'bg-blue-400/20' : 'bg-white/10'}`}
                       style={{ animationDelay: `${i * 0.6}s` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-4 h-full gap-1 p-2">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-matrix-blink ${i % 7 === 0 ? 'h-2' : i % 5 === 0 ? 'h-1' : 'h-0.5'} ${
                    i % 3 === 0 ? 'bg-blue-400/20' : 'bg-white/10'
                  }`}
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${2 + (i % 3)}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Orbital Rings */}
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-white/20 animate-spin-reverse"></div>
              <div className="absolute inset-4 rounded-full border border-blue-400/50"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 400" fill="none">
              <path 
                d="M20 50 Q40 80 60 120 T100 180 Q80 220 60 260 T20 320"
                stroke="url(#gradientRight1)"
                strokeWidth="0.5"
                fill="none"
                className="animate-dash"
              />
              <path 
                d="M10 80 Q30 110 50 150 T90 210 Q70 250 50 290 T10 350"
                stroke="url(#gradientRight2)"
                strokeWidth="0.3"
                fill="none"
                className="animate-dash"
                style={{ animationDelay: '2s' }}
              />
              <defs>
                <linearGradient id="gradientRight1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                  <stop offset="50%" stopColor="rgba(59,130,246,0.5)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.2)" />
                </linearGradient>
                <linearGradient id="gradientRight2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center min-h-[calc(100vh-4rem)]">
            
            {/* Left Content */}
            <div className="order-1 lg:order-1 space-y-6 lg:space-y-8 py-5 lg:py-0">
              
              <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
                
              </div>

              <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-400/5 rounded-xl blur-sm"></div>
                    <div className="relative">
                      <Image
                        src="/logo.png"
                        alt="GT Technologies Logo"
                        width={300}
                        height={100}
                        
                      />
                    </div>
                  </div>
                  
                </div>
              </div>

              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-200">
                 <span className="block">Empowering</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                    Industry
                  </span>
                  <span className="block text-gray-300">Transformation</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-400">
                Leading the 4th industrial revolution with cutting-edge solutions in AR/VR, robotics, 
                3D printing, automation, and AI. We digitize organizations with premium technology 
                partnerships including Dassault Systemes and industry leaders.
              </p>

              <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-500">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 text-center hover:border-blue-400/40 transition-colors">
                    <div className="text-white font-semibold">Design & Development</div>
                    <div className="text-gray-400 text-xs mt-1">Product Innovation</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 text-center hover:border-blue-400/40 transition-colors">
                    <div className="text-white font-semibold">Centre of Excellence</div>
                    <div className="text-gray-400 text-xs mt-1">Skill Development</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 text-center hover:border-blue-400/40 transition-colors">
                    <div className="text-white font-semibold">Solution Implementation</div>
                    <div className="text-gray-400 text-xs mt-1">Engineering Support</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons - Stack on Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-600">
                <Link
                  href="/services"
                  className="group px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold text-base lg:text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/25 text-center"
                >
                  Explore Solutions
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 lg:px-8 lg:py-4 bg-transparent border-2 border-blue-400/50 text-white rounded-full font-semibold text-base lg:text-lg hover:bg-blue-500/10 hover:border-blue-400 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-center"
                >
                  Start Project
                </Link>
              </div>

            </div>

            {/* Right Content - Image Carousel */}
            <div className="order-2 lg:order-2 py-8 lg:py-0 animate-on-scroll opacity-0 translate-y-10 lg:translate-x-10 lg:translate-y-0 transition-all duration-1000 delay-400">
              
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-blue-500/20">
                
                {/* Main Image Display */}
                <div className="relative h-full overflow-hidden">
                  {showcases.map((showcase, index) => (
                    <div
                      key={showcase.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <Image
                        src={showcase.image}
                        alt={showcase.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                      
                      {/* Content Overlay - Responsive Padding */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                        <div className="space-y-2 lg:space-y-3">
                          <div className="inline-block px-2 py-1 lg:px-3 lg:py-1 bg-blue-500/30 backdrop-blur-sm rounded-full text-xs text-white border border-blue-400/30">
                            {showcase.category}
                          </div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                            {showcase.title}
                          </h3>
                          <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                            {showcase.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center text-white hover:bg-slate-700/70 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 text-sm sm:text-base"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center text-white hover:bg-slate-700/70 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 text-sm sm:text-base"
                >
                  →
                </button>

                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                  {showcases.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-blue-400 w-6 sm:w-8' 
                          : 'bg-white/40 hover:bg-blue-400/60 w-1.5 sm:w-2'
                      }`}
                    ></button>
                  ))}
                </div>

                <div className="absolute -top-3 -right-3 lg:-top-6 lg:-right-6 w-8 h-8 lg:w-12 lg:h-12 bg-blue-500/20 backdrop-blur-sm rounded-full animate-float hidden sm:block"></div>
                <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-6 h-6 lg:w-8 lg:h-8 bg-slate-800/30 backdrop-blur-sm rounded-full animate-float hidden sm:block" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="hidden sm:flex justify-center mt-4 lg:mt-6 space-x-2 lg:space-x-4  pb-2">
                {showcases.map((showcase, index) => (
                  <button
                    key={showcase.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`relative flex-shrink-0 w-16 h-12 lg:w-20 lg:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentSlide 
                        ? 'ring-2 ring-blue-400 scale-105' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={showcase.image}
                      alt={showcase.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-5 h-8 lg:w-6 lg:h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
          <div className="w-0.5 h-2 lg:w-1 lg:h-3 bg-blue-400 rounded-full mt-1.5 lg:mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dash {
          0% { stroke-dasharray: 0, 100; }
          50% { stroke-dasharray: 50, 100; }
          100% { stroke-dasharray: 100, 0; }
        }

        @keyframes data-flow {
          0% { 
            transform: translateY(-100%);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes matrix-blink {
          0%, 70% { opacity: 0.1; }
          15%, 55% { opacity: 0.8; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-on-scroll {
          transition: all 1s ease-out;
        }
        
        .animate-on-scroll.animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }

        .animate-dash {
          stroke-dasharray: 100;
          animation: dash 4s ease-in-out infinite;
        }

        .animate-data-flow {
          animation: data-flow 3s linear infinite;
        }

        .animate-matrix-blink {
          animation: matrix-blink 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default HeroSection