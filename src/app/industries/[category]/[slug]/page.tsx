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
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Loading industry details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !industry) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Industry Not Found</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/industries"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Back to Industries
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/industries"
              className="text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
            >
              Industries
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/industries/${industry.category}`}
              className="text-cyan-600 hover:text-cyan-700 transition-colors duration-300 capitalize"
            >
              {industry.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{industry.title}</span>
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
      <div className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            {/* Main Content Column */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Header */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-700 text-sm font-medium rounded-full border border-cyan-400/40 backdrop-blur-sm">
                      {industry.category}
                    </span>
                    {industry.isFeatured && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-700 text-sm font-medium rounded-full border border-yellow-400/40 backdrop-blur-sm flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                    {industry.title}
                  </h1>
                  
                  <p className="text-xl text-cyan-600 font-semibold mb-6">{industry.subtitle}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span>Updated {new Date(industry.updatedAt).toLocaleDateString()}</span>
                    </div>
                    
                    {industry.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-600" />
                        <span>{industry.author.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      <span>10 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm border border-cyan-300/50 p-4 shadow-xl">
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <img
                    src={industry.poster}
                    alt={industry.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                </div>
              </div>

              {/* Description */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Target className="w-6 h-6 text-cyan-600 mr-3" />
                    Industry Overview
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              {industry.highlights && industry.highlights.length > 0 && (
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <Settings className="w-6 h-6 text-cyan-600 mr-3" />
                      Key Features & Capabilities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {industry.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-cyan-500/10 rounded-xl border border-cyan-400/30 hover:bg-cyan-500/15 transition-colors duration-300 backdrop-blur-sm">
                          <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Technologies */}
              {industry.technologies && industry.technologies.length > 0 && (
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <Zap className="w-6 h-6 text-cyan-600 mr-3" />
                      Technologies & Tools
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {industry.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="px-4 py-2 bg-cyan-500/15 text-cyan-700 rounded-lg font-medium border border-cyan-400/30 hover:bg-cyan-500/20 transition-colors duration-200 backdrop-blur-sm"
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
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <Globe className="w-6 h-6 text-cyan-600 mr-3" />
                      Implementation Gallery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {industry.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-48 rounded-xl overflow-hidden bg-white/50 border border-cyan-300/40 hover:border-cyan-400/60 transition-colors duration-300 cursor-pointer group shadow-lg"
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`${industry.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Action Buttons */}
              <div className="bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-6 sticky top-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                
                <div className="relative z-10 space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Get This Solution</h3>
                  
                  <Link
                    href="/gaq"
                    className="block w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold text-center hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Request Implementation
                  </Link>
                  
                  <button
                    onClick={handleShare}
                    className="w-full px-6 py-3 bg-white/80 border border-cyan-400/60 text-cyan-700 rounded-xl font-semibold hover:bg-cyan-50/80 hover:border-cyan-500/70 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Solution
                  </button>
                  
                  <Link
                    href={`/industries/${industry.category}`}
                    className="block w-full px-6 py-3 bg-gray-100/80 border border-gray-300/60 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200/80 hover:text-gray-800 transition-all duration-300 backdrop-blur-sm"
                  >
                    View Category
                  </Link>
                </div>
              </div>

              {/* Industry Info */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-6 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Industry Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Category:</span>
                      <span className="text-cyan-700 font-semibold capitalize">{industry.category}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-cyan-700 font-semibold">{new Date(industry.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {industry.highlights && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Features:</span>
                        <span className="text-cyan-700 font-semibold">{industry.highlights.length} items</span>
                      </div>
                    )}
                    {industry.technologies && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Technologies:</span>
                        <span className="text-cyan-700 font-semibold">{industry.technologies.length} tools</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-semibold">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Industries */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-6 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <Link
                      href="/industries"
                      className="flex items-center justify-between p-3 bg-cyan-50/80 rounded-lg border border-cyan-200/60 hover:bg-cyan-100/80 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-cyan-600" />
                        <span className="text-cyan-700 font-medium">All Industries</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    
                    <Link
                      href="/services"
                      className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/60 hover:bg-gray-100/80 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <Cog className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">Our Services</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    
                    <Link
                      href="/case-studies"
                      className="flex items-center justify-between p-3 bg-purple-50/80 rounded-lg border border-purple-200/60 hover:bg-purple-100/80 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700 font-medium">Case Studies</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Solutions CTA */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                <span className="block">Ready to Implement</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  This Solution?
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Contact our expert team to discuss implementation details, 
                timelines, and customization options for your specific requirements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25"
                >
                  Start Implementation
                  <Target className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href={`/industries/${industry.category}`}
                  className="px-8 py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  More {industry.category} Solutions
                </Link>
              </div>
            </div>

            <div className="absolute top-6 right-6 w-12 h-12 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-cyan-400/30 to-cyan-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>
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