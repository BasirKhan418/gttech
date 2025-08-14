'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface SliderItem {
  _id: string
  title: string
  category: string
  imageUrl?: string
  description: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderData, setSliderData] = useState<SliderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fallback data in case API fails or returns empty
  const fallbackSlides: SliderItem[] = [
    {
      _id: 'fallback-1',
      title: "Smart Manufacturing Dashboard",
      category: "Industry 4.0",
      imageUrl: "/1.jpeg",
      description: "AI-powered production monitoring system with real-time analytics"
    },
    {
      _id: 'fallback-2',
      title: "Digital Twin Simulation",
      category: "Engineering Solutions",
      imageUrl: "/1.jpeg", 
      description: "Advanced 3D modeling and simulation with Dassault Systemes"
    },
    {
      _id: 'fallback-3',
      title: "Augmented Reality Training",
      category: "AR/VR Solutions",
      imageUrl: "/1.jpeg",
      description: "Immersive learning experiences for industrial applications"
    }
  ]

  const fetchSliderData = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Fetching slider data from /api/slider...')
      
      const response = await fetch("/api/slider", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 } // Ensure fresh data
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const rawData = await response.json()
      console.log('Raw API response:', rawData)
      
      // Handle different possible response structures more robustly
      let slides: SliderItem[] = []
      
      // Try multiple possible response formats
      if (rawData?.success === true && Array.isArray(rawData?.data)) {
        slides = rawData.data
        console.log('Using rawData.data format (success: true)')
      } else if (rawData?.success !== false && Array.isArray(rawData?.data)) {
        slides = rawData.data
        console.log('Using rawData.data format (no explicit success field)')
      } else if (Array.isArray(rawData?.data)) {
        slides = rawData.data
        console.log('Using rawData.data format (array found)')
      } else if (Array.isArray(rawData)) {
        slides = rawData
        console.log('Using direct array format')
      } else if (rawData?.message && Array.isArray(rawData.message)) {
        slides = rawData.message
        console.log('Using rawData.message format')
      } else if (rawData?.sliders && Array.isArray(rawData.sliders)) {
        slides = rawData.sliders
        console.log('Using rawData.sliders format')
      } else {
        console.log('Unknown response format, checking for any array property...')
        // Last resort: find any array property
        const possibleArrays = Object.values(rawData).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          slides = possibleArrays[0] as SliderItem[]
          console.log('Found array in response:', slides)
        } else {
          console.log('No array found in response, using fallback')
          slides = fallbackSlides
        }
      }
      
      console.log('Processed slides before filtering:', slides)
      
      if (slides && slides.length > 0) {
        // Filter and validate slides more thoroughly
        const validSlides = slides.filter((slide: any) => {
          // More flexible validation
          const hasTitle = slide && (slide.title || slide.name || slide.heading)
          const hasDescription = slide && (slide.description || slide.content || slide.text)
          const hasId = slide && (slide._id || slide.id)
          const isNotInactive = slide.isActive !== false // Allow undefined or true
          
          const isValid = hasTitle && hasDescription && hasId && isNotInactive
          
          if (!isValid) {
            console.log('Filtering out invalid slide:', {
              slide,
              hasTitle,
              hasDescription,
              hasId,
              isNotInactive
            })
          }
          
          return isValid
        }).map((slide: any) => ({
          // Normalize the slide object structure
          _id: slide._id || slide.id || `slide-${Date.now()}-${Math.random()}`,
          title: slide.title || slide.name || slide.heading || 'Untitled',
          description: slide.description || slide.content || slide.text || 'No description available',
          category: slide.category || slide.type || slide.tag || 'General',
          imageUrl: slide.imageUrl || slide.image || slide.src || slide.photo || '/1.jpeg',
          isActive: slide.isActive !== false,
          createdAt: slide.createdAt,
          updatedAt: slide.updatedAt
        }))
        
        console.log('Valid slides after filtering and normalization:', validSlides)
        
        if (validSlides.length > 0) {
          setSliderData(validSlides)
          console.log(`Successfully loaded ${validSlides.length} slides`)
        } else {
          console.log('No valid slides found after filtering, using fallback data')
          setSliderData(fallbackSlides)
        }
      } else {
        console.log('No slides data found, using fallback data')
        setSliderData(fallbackSlides)
      }
    } catch (err) {
      console.error('Error fetching slider data:', err)
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      })
      setError(`Failed to load slider content: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setSliderData(fallbackSlides)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSliderData()
  }, [])

  // Auto-advance slides with longer duration
  useEffect(() => {
    if (sliderData.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length)
      }, 5000) // Increased from 4000ms to 5000ms (5 seconds)
      return () => clearInterval(timer)
    }
  }, [sliderData.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length)
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

  // Get image URL with better fallback handling
  const getImageUrl = (slide: SliderItem): string => {
    const imageUrl = slide.imageUrl || '/1.jpeg'
    
    // Handle different possible URL formats
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
      return imageUrl
    }
    
    // If it's just a filename, assume it's in public folder
    return `/${imageUrl}`
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-cyan-100 pt-16 lg:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 lg:opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles with Cyan Accent */}
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
              i % 2 === 0 ? 'bg-cyan-900/60' : 'bg-cyan-500/40'
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
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-900/30 to-transparent animate-data-flow"
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
                <div className={`rounded-full border ${i % 2 === 0 ? 'border-cyan-800/40' : 'border-cyan-900/30'} ${i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-1'}`}>
                  <div className={`rounded-full w-full h-full animate-ping ${i % 2 === 0 ? 'bg-cyan-400/20' : 'bg-cyan-200/15'}`}
                       style={{ animationDelay: `${i * 0.6}s` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Pattern */}
          <div className="absolute inset-0 opacity-15">
            <div className="grid grid-cols-4 h-full gap-1 p-2">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-matrix-blink ${i % 7 === 0 ? 'h-2' : i % 5 === 0 ? 'h-1' : 'h-0.5'} ${
                    i % 3 === 0 ? 'bg-cyan-800/20' : 'bg-cyan-200/15'
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
              <div className="absolute inset-0 rounded-full border border-cyan-800/30 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-white/40 animate-spin-reverse"></div>
              <div className="absolute inset-4 rounded-full border border-cyan-800/50"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-800/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
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
                  <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
                  <stop offset="50%" stopColor="rgba(6,182,212,0.4)" />
                  <stop offset="100%" stopColor="rgba(6,182,212,0.2)" />
                </linearGradient>
                <linearGradient id="gradientLeft2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
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
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-800/35 to-transparent animate-data-flow"
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
                <div className={`rounded-full border ${i % 2 === 0 ? 'border-cyan-800/45' : 'border-white/50'} ${i % 3 === 0 ? 'w-3 h-3' : i % 3 === 1 ? 'w-2 h-2' : 'w-1 h-1'}`}>
                  <div className={`rounded-full w-full h-full animate-ping ${i % 2 === 0 ? 'bg-cyan-500/25' : 'bg-white/20'}`}
                       style={{ animationDelay: `${i * 0.6}s` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Pattern */}
          <div className="absolute inset-0 opacity-15">
            <div className="grid grid-cols-4 h-full gap-1 p-2">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`animate-matrix-blink ${i % 7 === 0 ? 'h-2' : i % 5 === 0 ? 'h-1' : 'h-0.5'} ${
                    i % 3 === 0 ? 'bg-cyan-900/25' : 'bg-white/20'
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
              <div className="absolute inset-0 rounded-full border border-cyan-800 animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full border border-white/50 animate-spin-reverse"></div>
              <div className="absolute inset-4 rounded-full border border-cyan-800"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
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
                  <stop offset="0%" stopColor="rgba(8,145,178,0.25)" />
                  <stop offset="50%" stopColor="rgba(8,145,178,0.55)" />
                  <stop offset="100%" stopColor="rgba(8,145,178,0.25)" />
                </linearGradient>
                <linearGradient id="gradientRight2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
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
              
              <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 rounded-xl blur-sm"></div>
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-tight animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-200">
                 <span className="block">Empowering</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    Industry
                  </span>
                  <span className="block text-gray-700">Transformation</span>
                </h1>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-400">
                Leading the 4th industrial revolution with cutting-edge solutions in AR/VR, robotics, 
                3D printing, automation, and AI. We digitize organizations with premium technology 
                partnerships including Dassault Systemes and industry leaders.
              </p>

              <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-500">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white/80 backdrop-blur-sm border border-cyan-800/60 rounded-lg p-3 text-center hover:border-cyan-300/80 transition-colors shadow-sm">
                    <div className="text-gray-800 font-semibold">Design & Development</div>
                    <div className="text-gray-600 text-xs mt-1">Product Innovation</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-cyan-800/60 rounded-lg p-3 text-center hover:border-cyan-300/80 transition-colors shadow-sm">
                    <div className="text-gray-800 font-semibold">Centre of Excellence</div>
                    <div className="text-gray-600 text-xs mt-1">Skill Development</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-cyan-800/60 rounded-lg p-3 text-center hover:border-cyan-300/80 transition-colors shadow-sm">
                    <div className="text-gray-800 font-semibold">Solution Implementation</div>
                    <div className="text-gray-600 text-xs mt-1">Engineering Support</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons - Stack on Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-600">
                <Link
                  href="/services"
                  className="group px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-base lg:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/30 text-center"
                >
                  Explore Solutions
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
                <Link
                  href="/gta"
                  className="px-6 py-3 lg:px-8 lg:py-4 bg-white/60 border-2 border-cyan-400/60 text-gray-800 rounded-full font-semibold text-base lg:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-center"
                >
                  Start Project
                </Link>
              </div>

            </div>

            {/* Right Side - Image Slider */}
            <div className="order-2 lg:order-2 py-8 lg:py-0 animate-on-scroll opacity-0 translate-y-10 lg:translate-x-10 lg:translate-y-0 transition-all duration-1000 delay-400">
              
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden bg-white/60 backdrop-blur-sm border border-cyan-200/50 shadow-xl">
                
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading slider content...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-red-500 text-4xl mb-4">⚠️</div>
                      <p className="text-gray-600 mb-2">{error}</p>
                      <button 
                        onClick={fetchSliderData}
                        className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                      >
                        Retry
                      </button>
                      <div className="mt-2 text-xs text-gray-500">
                        Using fallback images in the meantime
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative h-full overflow-hidden">
                      {sliderData.map((slide, index) => (
                        <div
                          key={slide._id}
                          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            index === currentSlide 
                              ? 'opacity-100 scale-100' 
                              : 'opacity-0 scale-105'
                          }`}
                        >
                         <img
  src={getImageUrl(slide)}
  alt={slide.title}
  className="w-full h-full object-cover"  
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
  onError={(e) => {
    console.log(`Image failed to load: ${getImageUrl(slide)}`)
    const target = e.target as HTMLImageElement;
    target.src = '/1.jpeg';
  }}
/>
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
                          
                          {/* Content Overlay - Responsive Padding */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                            <div className="space-y-2 lg:space-y-3">
                              <div className="inline-block px-2 py-1 lg:px-3 lg:py-1 bg-cyan-800/40 backdrop-blur-sm rounded-full text-xs text-white border border-cyan-800/40">
                                {slide.category}
                              </div>
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                                {slide.title}
                              </h3>
                              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                                {slide.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows - Only show if there are multiple slides */}
                    {sliderData.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/70 backdrop-blur-sm border border-cyan-300/60 rounded-full flex items-center justify-center text-gray-700 hover:bg-white/90 hover:border-cyan-400/80 transition-all duration-300 hover:scale-110 text-sm sm:text-base shadow-md"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/70 backdrop-blur-sm border border-cyan-300/60 rounded-full flex items-center justify-center text-gray-700 hover:bg-white/90 hover:border-cyan-400/80 transition-all duration-300 hover:scale-110 text-sm sm:text-base shadow-md"
                        >
                          →
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                          {sliderData.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                  ? 'bg-cyan-800 w-6 sm:w-8' 
                                  : 'bg-white/60 hover:bg-cyan-800/70 w-1.5 sm:w-2'
                              }`}
                            ></button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Decorative Elements */}
                    <div className="absolute -top-3 -right-3 lg:-top-6 lg:-right-6 w-8 h-8 lg:w-12 lg:h-12 bg-cyan-400/30 backdrop-blur-sm rounded-full animate-float hidden sm:block"></div>
                    <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-6 h-6 lg:w-8 lg:h-8 bg-white/50 backdrop-blur-sm rounded-full animate-float hidden sm:block" style={{ animationDelay: '2s' }}></div>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation - Only show if there are multiple slides and not loading */}
              {!loading && !error && sliderData.length > 1 && (
                <div className="hidden sm:flex justify-center mt-4 lg:mt-6 space-x-2 lg:space-x-4 pb-2">
                  {sliderData.map((slide, index) => (
                    <button
                      key={slide._id}
                      onClick={() => setCurrentSlide(index)}
                      className={`relative flex-shrink-0 w-16 h-12 lg:w-20 lg:h-16 rounded-lg overflow-hidden transition-all duration-300 border ${
                        index === currentSlide 
                          ? 'ring-2 ring-cyan-800 scale-105 border-cyan-800' 
                          : 'opacity-60 hover:opacity-80 border-cyan-800'
                      }`}
                    >
                      <img
                        src={getImageUrl(slide)}
                        alt={slide.title}
                        className="object-cover"
                        sizes="80px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/1.jpeg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-5 h-8 lg:w-6 lg:h-10 border-2 border-cyan-900/60 rounded-full flex justify-center">
          <div className="w-0.5 h-2 lg:w-1 lg:h-3 bg-cyan-900 rounded-full mt-1.5 lg:mt-2 animate-pulse"></div>
        </div>
      </div>     
    </section>
  )
}

export default HeroSection