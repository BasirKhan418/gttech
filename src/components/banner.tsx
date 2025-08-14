"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Banner {
  id: number
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

const mockBanners = [
  {
    id: 1,
    title: "Revolutionary AI Solutions Launch",
    description: "Transform your business with cutting-edge artificial intelligence and machine learning technologies that drive innovation and efficiency across all sectors.",
    tags: ["AI/ML", "Innovation", "Digital Transformation"],
    buttonText: "Explore AI Solutions",
    buttonLink: "/services/ai",
    image: "/1.jpeg",
    showImage: true,
    isActive: true
  },
  {
    id: 2,
    title: "Industry 4.0 Manufacturing Summit",
    description: "Join us for the biggest manufacturing revolution event. Discover smart factories, IoT integration, and predictive maintenance solutions.",
    tags: ["Industry 4.0", "IoT", "Smart Manufacturing"],
    buttonText: "Register for Summit",
    buttonLink: "/services/industry40",
    image: "/digital.jpg",
    showImage: true,
    isActive: true
  },
  {
    id: 3,
    title: "Digital Twin Technology Breakthrough",
    description: "Create virtual replicas of your physical assets to optimize performance, predict failures, and drive operational excellence.",
    tags: ["Digital Twin", "Simulation", "Optimization"],
    buttonText: "Discover Digital Twins",
    buttonLink: "/services/digital-twin",
    showImage: false, 
    isActive: true
  }
]

const DynamicBannerSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [banners, setBanners] = useState(mockBanners) 
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentBanner((prev) => (prev + 1) % banners.length)
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

  const FallbackBanner = () => (
    <div className="relative glass-card rounded-3xl p-12 md:p-16 lg:p-20 overflow-hidden border border-cyan-300/40 shadow-2xl">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/40 to-cyan-100/50 backdrop-blur-xl"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 2 === 0 ? 'bg-cyan-400/60' : 'bg-cyan-200/40'
            }`}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glass Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="animate-on-scroll opacity-0 translate-y-10">
          <div className="inline-flex items-center px-6 py-3 glass-badge border border-cyan-400/50 rounded-full text-sm text-cyan-700 mb-6 animate-pulse backdrop-blur-sm bg-cyan-100/60 shadow-lg">
            <span className="mr-2">🚀</span>
            <span className="font-semibold">Exciting News Coming Soon</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="block">Latest News &</span>
            <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
              Announcements
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Stay tuned for the latest updates, product launches, and industry insights. 
            Our team is preparing exciting announcements that will shape the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-8 py-4 glass-button bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/30 backdrop-blur-sm border border-cyan-400/40"
            >
              Get Notified
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 glass-button bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      {/* Glass Corner Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse backdrop-blur-sm bg-cyan-100/30"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-cyan-400/40 to-cyan-500/40 rounded-full animate-bounce backdrop-blur-sm"></div>
      <div className="absolute top-12 right-12 w-3 h-3 bg-cyan-400/70 rounded-full animate-ping"></div>
    </div>
  )

  // Main banner component
  const BannerCard = ({ banner, isActive }: BannerCardProps) => (
    <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="relative glass-card rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden border border-cyan-300/40 h-full shadow-2xl">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-cyan-50/40 to-cyan-100/50 backdrop-blur-xl"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Glass Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/15 to-transparent opacity-60"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Data Flow Lines */}
          <div className="absolute left-0 top-0 bottom-0 w-32 overflow-hidden opacity-25">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-data-flow"
                style={{
                  left: `${i * 20}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '4s'
                }}
              ></div>
            ))}
          </div>

          {/* Floating Particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 3 === 0 ? 'bg-cyan-400/60' : i % 3 === 1 ? 'bg-cyan-300/50' : 'bg-cyan-200/40'
              }`}
              style={{
                left: `${5 + (i * 8)}%`,
                top: `${10 + (i * 7)}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            ></div>
          ))}

          {/* Circuit Nodes */}
          <div className="absolute right-8 top-8 opacity-50">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-spin-slow backdrop-blur-sm"></div>
              <div className="absolute inset-2 rounded-full border border-cyan-300/40 animate-spin-reverse"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-500/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Content Section */}
          <div className={`${banner.showImage && banner.image ? 'lg:w-2/3' : 'w-full'} flex flex-col justify-center space-y-6`}>
            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {banner.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 glass-tag bg-cyan-500/25 backdrop-blur-sm border border-cyan-400/50 rounded-full text-sm text-cyan-700 hover:bg-cyan-500/35 hover:border-cyan-400/70 transition-all duration-300 animate-float font-semibold shadow-md"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight">
              <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {banner.title.split(' ').slice(0, Math.ceil(banner.title.split(' ').length / 2)).join(' ')}
              </span>
              <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {banner.title.split(' ').slice(Math.ceil(banner.title.split(' ').length / 2)).join(' ')}
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {banner.description}
            </p>

            {/* CTA Button */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <Link
                href={banner.buttonLink}
                className="group inline-flex items-center px-8 py-4 glass-button bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/30 backdrop-blur-sm border border-cyan-400/40"
              >
                {banner.buttonText}
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          {banner.showImage && banner.image && (
            <div className="lg:w-1/3 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative w-full max-w-sm lg:max-w-none">
                <div className="relative glass-image-container rounded-2xl overflow-hidden border border-cyan-400/40 backdrop-blur-sm bg-white/30 p-4 shadow-xl">
                  {/* Image Glass Frame */}
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      width={400}
                      height={300}
                      className="w-full h-64 lg:h-80 object-cover transition-all duration-700 hover:scale-105"
                      priority={isActive}
                    />
                    
                    {/* Image Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-white/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-300/10"></div>
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 animate-pulse"></div>
                  </div>

                  {/* Glass Frame Shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-2xl"></div>
                  
                  {/* Corner Highlights */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/70 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/70 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/70 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/70 rounded-br-lg"></div>
                </div>

                {/* Floating Elements Around Image */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400/70 rounded-full animate-bounce backdrop-blur-sm"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-300/70 rounded-full animate-ping"></div>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 right-8 opacity-40">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full animate-matrix-blink ${
                  i % 3 === 0 ? 'bg-cyan-400/70' : 'bg-cyan-200/50'
                } backdrop-blur-sm`}
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Progress Indicator (only if multiple banners) */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-8 flex space-x-3">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                  index === currentBanner 
                    ? 'bg-cyan-500 w-10 shadow-lg shadow-cyan-500/50' 
                    : 'bg-cyan-300/60 w-3 hover:bg-cyan-400/80 hover:w-6'
                }`}
                onClick={() => setCurrentBanner(index)}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (banners.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 glass-badge bg-cyan-500/25 backdrop-blur-sm border border-cyan-400/50 rounded-full text-sm text-cyan-700 mb-6 shadow-lg">
              <span className="mr-2">📰</span>
              <span className="font-semibold">Latest News & Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                Latest Tech Updates
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest developments, announcements, and insights from GT Technologies.
            </p>
          </div>
          
          <FallbackBanner />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 glass-badge bg-cyan-500/25 backdrop-blur-sm border border-cyan-400/50 rounded-full text-sm text-cyan-700 mb-6 animate-fade-in-up shadow-lg">
            <span className="mr-2">📰</span>
            <span className="font-semibold">Latest News & Updates</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
              Latest Tech Updates
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Stay informed with the latest developments, announcements, and insights from GT Technologies.
          </p>
        </div>

        <div className={`relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] transition-all duration-300 ${isAnimating ? 'scale-98' : 'scale-100'}`}>
          {banners.map((banner, index) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              isActive={index === currentBanner}
            />
          ))}

          {/* Navigation Arrows (only if multiple banners) */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-button bg-white/70 backdrop-blur-sm border border-cyan-400/50 rounded-full flex items-center justify-center text-cyan-700 hover:bg-white/90 hover:border-cyan-500/70 transition-all duration-300 hover:scale-110 z-20 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-button bg-white/70 backdrop-blur-sm border border-cyan-400/50 rounded-full flex items-center justify-center text-cyan-700 hover:bg-white/90 hover:border-cyan-500/70 transition-all duration-300 hover:scale-110 z-20 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DynamicBannerSection