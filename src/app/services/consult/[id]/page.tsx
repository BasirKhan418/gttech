'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle,
  Share2,
  Download,
  Star,
  Users,
  Target,
  Globe,
  ArrowRight
} from 'lucide-react'

interface Content {
  _id: string
  sectionName: string
  title: string
  description: string
  poster: string
  images: string[]
  lists: string[]
  designType: string
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

const ConsultingDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [consultingDetail, setConsultingDetail] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchConsultingDetail(params.id as string)
    }
  }, [params.id])

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
  }, [consultingDetail])

  const fetchConsultingDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      const data = await response.json()

      if (data.success) {
        const service = data.data.find((item: Content) => item._id === id)
        if (service && service.sectionName.toLowerCase() === 'consult') {
          setConsultingDetail(service)
        } else {
          setError('Consulting service not found')
        }
      } else {
        setError(data.message || 'Failed to fetch consulting service')
      }
    } catch (error) {
      setError('Failed to fetch consulting service')
      console.error('Error fetching consulting service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && consultingDetail) {
      try {
        await navigator.share({
          title: consultingDetail.title,
          text: consultingDetail.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px sm:30px sm:30px'
          }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-base sm:text-lg">Loading consulting service...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !consultingDetail) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
            <Link
              href="/services/consult"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm sm:text-base"
            >
              Back to Consulting Services
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px sm:30px sm:30px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden lg:block ${
              i % 2 === 0 ? 'bg-cyan-400/40' : 'bg-cyan-200/30'
            }`}
            style={{
              left: `${3 + (i * 8)}%`,
              top: `${5 + (i * 8)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <Link
              href="/services/consult"
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300 mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Back to Consulting Services
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Main Content Column */}
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
              
              {/* Header */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2 sm:px-3 py-1 bg-cyan-500/20 text-cyan-700 text-xs sm:text-sm font-medium rounded-full border border-cyan-400/40 backdrop-blur-sm">
                        {consultingDetail.designType}
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-700 text-xs sm:text-sm font-medium rounded-full border border-blue-400/40 backdrop-blur-sm">
                        Consulting
                      </span>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                      {consultingDetail.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                        <span>Published {new Date(consultingDetail.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {consultingDetail.author && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                          <span className="truncate max-w-24 sm:max-w-none">{consultingDetail.author.name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                        <span>5 min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              {consultingDetail.poster && (
                <div className="animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm border border-cyan-600/50 p-2 sm:p-4 shadow-xl">
                    <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] rounded-xl sm:rounded-2xl overflow-hidden">
                      <img
                        src={consultingDetail.poster}
                        alt={consultingDetail.title}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 66vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                      Overview
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                        {consultingDetail.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              {consultingDetail.lists && consultingDetail.lists.length > 0 && (
                <div className="animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                        Key Features & Benefits
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4">
                        {consultingDetail.lists.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-cyan-500/10 rounded-lg sm:rounded-xl border border-cyan-400/30 hover:bg-cyan-500/15 transition-colors duration-300 backdrop-blur-sm">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Images Gallery */}
              {consultingDetail.images && consultingDetail.images.length > 0 && (
                <div className="animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                        Gallery
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
                        {consultingDetail.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative h-36 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden bg-white/50 border border-cyan-600/40 hover:border-cyan-400/60 transition-colors duration-300 cursor-pointer group shadow-lg"
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <img
                              src={image}
                              alt={`${consultingDetail.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-4 sm:space-y-6">
              
              {/* Action Buttons */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 sticky top-4 sm:top-8 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10 space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Get Started</h3>
                    
                    <Link
                      href="/contact"
                      className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg sm:rounded-xl font-semibold text-center hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      Schedule Consultation
                    </Link>
                    
                    <button
                      onClick={handleShare}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white/80 border border-cyan-400/60 text-cyan-700 rounded-lg sm:rounded-xl font-semibold hover:bg-cyan-50/80 hover:border-cyan-500/70 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm text-sm sm:text-base"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Share Service
                    </button>
                    
                    <Link
                      href="/services/consult"
                      className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100/80 border border-gray-300/60 text-gray-700 rounded-lg sm:rounded-xl font-semibold text-center hover:bg-gray-200/80 hover:text-gray-800 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                    >
                      View All Consulting
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Service Details</h3>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 flex-shrink-0">Category:</span>
                        <span className="text-cyan-700 font-semibold text-right">Consulting</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 flex-shrink-0">Type:</span>
                        <span className="text-cyan-700 font-semibold text-right">{consultingDetail.designType}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 flex-shrink-0">Last Updated:</span>
                        <span className="text-cyan-700 font-semibold text-right">{new Date(consultingDetail.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {consultingDetail.lists && (
                        <div className="flex justify-between items-start">
                          <span className="text-gray-600 flex-shrink-0">Features:</span>
                          <span className="text-cyan-700 font-semibold">{consultingDetail.lists.length} items</span>
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 flex-shrink-0">Availability:</span>
                        <span className="text-green-600 font-semibold">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services CTA */}
      <section className="relative z-10 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                  <span className="block">Ready to Get Started?</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    Let's Discuss Your Needs
                  </span>
                </h2>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  Schedule a consultation with our experts to explore how this service 
                  can transform your business operations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                  <Link
                    href="/contact"
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-base sm:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25"
                  >
                    Schedule Consultation
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-base sm:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    Explore More Services
                  </Link>
                </div>
              </div>

              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-2 border-cyan-400/40 rounded-lg sm:rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400/30 to-cyan-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>
            </div>
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

        /* Custom responsive utilities */
        @media (min-width: 1536px) {
          .text-2xl {
            font-size: 1.875rem;
          }
        }
      `}</style>
    </main>
  )
}

export default ConsultingDetailPage