"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Banner {
  id?: number
  _id?: string
  title: string
  description: string
  tags: string[]
  buttonText: string
  buttonLink: string
  image?: string
  showImage?: boolean 
  isActive: boolean
}

interface BannerCardProps {
  banner: Banner
  isActive: boolean
}

const DynamicBannerSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/banner')
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch banners")
      }
      // Filter only active banners
      const activeBanners = data.data.filter((banner: Banner) => banner.isActive)
      setBanners(activeBanners)
    } catch (err) {
      console.error("Error fetching banners:", err)
      setBanners([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 2) {
      const timer = setInterval(() => {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentBanner((prev) => (prev + 1) % (banners.length - 1))
          setIsAnimating(false)
        }, 300)
      }, 6000)

      return () => clearInterval(timer)
    }
  }, [banners.length])

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

  const NoContentBanner = () => (
    <div className="relative glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden border border-gray-300/40 shadow-2xl">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-gray-50/40 to-gray-100/50 backdrop-blur-xl"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(107,114,128,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,114,128,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Glass Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="animate-on-scroll opacity-0 translate-y-10">
          <div className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 glass-badge border border-gray-400/50 rounded-full text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 backdrop-blur-sm bg-gray-100/60 shadow-lg">
            <span className="mr-2">📰</span>
            <span className="font-semibold">No Content Available</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            <span className="block">No Banners</span>
            <span className="block bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 bg-clip-text text-transparent">
              Currently Available
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            There are currently no active banners to display. Please check back later for updates and announcements.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-6 sm:px-8 py-3 sm:py-4 glass-button bg-gradient-to-r from-gray-500/90 to-gray-600/90 text-white rounded-full font-semibold text-base sm:text-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105 shadow-xl backdrop-blur-sm border border-gray-400/40"
            >
              Contact Us
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/services"
              className="px-6 sm:px-8 py-3 sm:py-4 glass-button bg-white/80 border-2 border-gray-400/60 text-gray-700 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-50/80 hover:border-gray-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Glass Corner Elements */}
      <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-2 border-gray-400/40 rounded-xl rotate-45 backdrop-blur-sm bg-gray-100/30"></div>
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-400/40 to-gray-500/40 rounded-full backdrop-blur-sm"></div>
    </div>
  )

  // Compact banner component
  const BannerCard = ({ banner, isActive }: BannerCardProps) => (
    <div className="relative glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden border border-cyan-300/40 h-full shadow-2xl">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/40 to-cyan-100/50 backdrop-blur-xl"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-6">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px sm:30px sm:30px'
        }}></div>
      </div>

      {/* Glass Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/15 to-transparent opacity-60"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-cyan-400/60' : i % 3 === 1 ? 'bg-cyan-300/50' : 'bg-cyan-200/40'
            }`}
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${15 + (i * 10)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}

        {/* Circuit Nodes */}
        <div className="absolute right-2 sm:right-4 md:right-6 top-2 sm:top-4 md:top-6 opacity-50">
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12">
            <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-spin-slow backdrop-blur-sm"></div>
            <div className="absolute inset-1 rounded-full border border-cyan-300/40 animate-spin-reverse"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-cyan-500/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        
        {/* Content Section */}
        <div className={`${banner.showImage && banner.image ? 'lg:w-2/3' : 'w-full'} flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-6`}>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
            {banner.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 glass-tag bg-cyan-500/25 backdrop-blur-sm border border-cyan-400/50 rounded-full text-xs sm:text-sm text-cyan-700 hover:bg-cyan-500/35 hover:border-cyan-400/70 transition-all duration-300 animate-float font-semibold shadow-md"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 leading-tight">
            <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {banner.title.length > 50 ? banner.title.substring(0, 50) + '...' : banner.title}
            </span>
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed animate-fade-in-up line-clamp-3" style={{ animationDelay: '0.4s' }}>
            {banner.description.length > 120 ? banner.description.substring(0, 120) + '...' : banner.description}
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href={banner.buttonLink}
              className="group inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 glass-button bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white rounded-full font-semibold text-sm sm:text-base md:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/30 backdrop-blur-sm border border-cyan-400/40"
            >
              {banner.buttonText}
              <span className="ml-2 sm:ml-3 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        {banner.showImage && banner.image && (
          <div className="lg:w-1/3 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-48 sm:max-w-56 md:max-w-64 lg:max-w-none">
              <div className="relative glass-image-container rounded-xl sm:rounded-2xl overflow-hidden border border-cyan-400/40 backdrop-blur-sm bg-white/30 p-2 sm:p-3 md:p-4 shadow-xl">
                {/* Image Glass Frame */}
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 object-cover transition-all duration-700 hover:scale-105"
                  />
                  
                  {/* Image Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-white/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-300/10"></div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-cyan-400/30 animate-pulse"></div>
                </div>

                {/* Glass Frame Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
                
                {/* Corner Highlights */}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-l-2 border-t-2 border-cyan-400/70 rounded-tl-lg"></div>
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-r-2 border-t-2 border-cyan-400/70 rounded-tr-lg"></div>
                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-l-2 border-b-2 border-cyan-400/70 rounded-bl-lg"></div>
                <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-r-2 border-b-2 border-cyan-400/70 rounded-br-lg"></div>
              </div>

              {/* Floating Elements Around Image */}
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-cyan-400/70 rounded-full animate-bounce backdrop-blur-sm"></div>
              <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-cyan-300/70 rounded-full animate-ping"></div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 right-2 sm:right-4 md:right-6 opacity-40">
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full animate-matrix-blink ${
                i % 3 === 0 ? 'bg-cyan-400/70' : 'bg-cyan-200/50'
              } backdrop-blur-sm`}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading banners...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show no content message if no banners
  if (banners.length === 0) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Integrated Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 bg-clip-text text-transparent">
                Latest Tech Updates
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest developments, announcements, and insights from GT Technologies.
            </p>
          </div>
          
          <NoContentBanner />
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px sm:40px sm:40px md:50px md:50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Integrated Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
              Latest Tech Updates
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Stay informed with the latest developments, announcements, and insights from GT Technologies.
          </p>
        </div>

        {banners.length === 1 ? (
          // Single banner - show full width
          <div className="relative">
            <BannerCard banner={banners[0]} isActive={true} />
          </div>
        ) : (
          // Multiple banners - show two at once
          <div className="relative">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 transition-all duration-300 ${isAnimating ? 'scale-98' : 'scale-100'}`}>
              <BannerCard 
                banner={banners[currentBanner]} 
                isActive={true} 
              />
              <BannerCard 
                banner={banners[(currentBanner + 1) % banners.length]} 
                isActive={true} 
              />
            </div>

            {/* Navigation Arrows (only if more than 2 banners) */}
            {banners.length > 2 && (
              <>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length - 1) % (banners.length - 1))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 glass-button bg-white/70 backdrop-blur-sm border border-cyan-400/50 rounded-full flex items-center justify-center text-cyan-700 hover:bg-white/90 hover:border-cyan-500/70 transition-all duration-300 hover:scale-110 z-20 shadow-lg"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % (banners.length - 1))}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 glass-button bg-white/70 backdrop-blur-sm border border-cyan-400/50 rounded-full flex items-center justify-center text-cyan-700 hover:bg-white/90 hover:border-cyan-500/70 transition-all duration-300 hover:scale-110 z-20 shadow-lg"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </>
            )}

            {/* Progress Indicators (only if more than 2 banners) */}
            {banners.length > 2 && (
              <div className="flex justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
                {Array.from({ length: banners.length - 1 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                      index === currentBanner 
                        ? 'bg-cyan-500 w-6 sm:w-8 md:w-10 shadow-lg shadow-cyan-500/50' 
                        : 'bg-cyan-300/60 w-2 sm:w-3 hover:bg-cyan-400/80 hover:w-4 sm:hover:w-6'
                    }`}
                    onClick={() => setCurrentBanner(index)}
                  ></div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      

      {/* Custom Animations and Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
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

        @keyframes data-flow {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes matrix-blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
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
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-data-flow {
          animation: data-flow 4s linear infinite;
        }

        .animate-matrix-blink {
          animation: matrix-blink 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }

        .scale-98 {
          transform: scale(0.98);
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default DynamicBannerSection