'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle,
  Share2,
  Star,
  Cog,
  Zap,
  Settings,
  ArrowRight,
  Target,
  Globe,
  Building2
} from 'lucide-react'

interface Industry {
  _id: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  technologies: string[]
  poster: string
  images: string[]
  category: string
  isActive: boolean
  isFeatured: boolean
  slug: string
  author?: {
    _id: string
    name: string
    email: string
  }
  lastEditedAuthor?: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

const IndustryDetailPage = () => {
  const params = useParams()
  const [industry, setIndustry] = useState<Industry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.slug) {
      fetchIndustryDetail(params.slug as string)
    }
  }, [params.slug])

  const fetchIndustryDetail = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/industry/detail/${slug}`)
      const data = await response.json()

      if (data.success) {
        setIndustry(data.data)
      } else {
        setError(data.message || 'Industry not found')
      }
    } catch (error) {
      setError('Failed to fetch industry details')
      console.error('Error fetching industry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && industry) {
      try {
        await navigator.share({
          title: industry.title,
          text: industry.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-xl font-medium">Loading Solution...</span>
        </div>
      </main>
    )
  }

  if (error || !industry) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Solution Not Found</h1>
          <p className="text-slate-600 mb-4 text-sm sm:text-base">{error}</p>
          <Link
            href="/industries"
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm sm:text-base"
          >
            Back to Industries
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px sm:20px sm:20px lg:30px lg:30px'
        }}></div>
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 pt-20 pb-2 sm:pb-3 lg:pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Link
              href="/industries"
              className="text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
            >
              Industries
            </Link>
            <span className="text-slate-400">/</span>
            <Link
              href={`/industries/${industry.category}`}
              className="text-cyan-600 hover:text-cyan-700 transition-colors duration-300 capitalize"
            >
              {industry.category}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 truncate">{industry.title}</span>
          </div>
          
          <Link
            href={`/industries/${industry.category}`}
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300 mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {industry.category} Solutions
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-2 sm:pb-6 lg:pb-6 xl:pb-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className="relative bg-white/80 backdrop-blur-md border border-indigo-200/60 rounded-xl p-4 sm:p-5 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/40 to-indigo-100/20 rounded-xl"></div>

              <div className="relative z-10">
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  
                  {industry.isFeatured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-snug mb-3">
                  {industry.title}
                </h1>
              </div>
            </div>

            {/* Main Image */}
            {industry.poster && (
              <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm border border-indigo-200/60 p-2 sm:p-3 lg:p-4 shadow-xl">
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                  <img
                    src={industry.poster}
                    alt={industry.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="relative bg-white/70 backdrop-blur-sm border border-indigo-200/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-indigo-50/20 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/8 via-transparent to-indigo-300/5 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                  Solution Overview
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg">{industry.description}</p>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            {industry.highlights && industry.highlights.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-indigo-200/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-indigo-50/20 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/8 via-transparent to-indigo-300/5 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Key Features & Capabilities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {industry.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 hover:bg-green-500/15 transition-colors duration-300 backdrop-blur-sm">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm sm:text-base">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Technologies */}
            {industry.technologies && industry.technologies.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-indigo-200/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-indigo-50/20 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/8 via-transparent to-indigo-300/5 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Technologies & Tools
                  </h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {industry.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="px-3 sm:px-4 py-2 bg-cyan-500/15 text-cyan-700 rounded-lg font-medium border border-cyan-400/30 hover:bg-cyan-500/20 transition-colors duration-200 backdrop-blur-sm text-sm sm:text-base"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Images Gallery */}
            {industry.images && industry.images.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-indigo-200/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-indigo-50/20 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/8 via-transparent to-indigo-300/5 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Implementation Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {industry.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-36 sm:h-48 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden bg-white/50 border border-indigo-200/60 hover:border-indigo-400/60 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${industry.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative z-10 py-4 sm:py-6 lg:py-6 xl:py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-white/70 backdrop-blur-sm border border-indigo-200/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-indigo-50/20 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/8 via-transparent to-indigo-300/5 rounded-xl sm:rounded-2xl lg:rounded-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">
                <span className="block">Ready to Implement</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  This Solution?
                </span>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Contact our expert team to discuss implementation details, customization options, and how this solution can transform your business operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
                <Link
                  href="/contact"
                  className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center"
                >
                  Start Implementation
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href={`/industries/${industry.category}`}
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  More {industry.category} Solutions
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-2 border-cyan-400/40 rounded-lg sm:rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
            <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-cyan-400/30 to-cyan-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-on-scroll {
          transition: all 1s ease-out;
        }
      `}</style>
    </main>
  )
}

export default IndustryDetailPage