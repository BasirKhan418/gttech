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
  Cog,
  Zap,
  Settings,
  ArrowRight,
  Rocket
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

const SolutionDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [solutionDetail, setSolutionDetail] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchSolutionDetail(params.id as string)
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
  }, [solutionDetail])

  const fetchSolutionDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      const data = await response.json()

      if (data.success) {
        const solution = data.data.find((item: Content) => item._id === id)
        if (solution && solution.sectionName.toLowerCase() === 'solutions') {
          setSolutionDetail(solution)
        } else {
          setError('Solution not found')
        }
      } else {
        setError(data.message || 'Failed to fetch solution')
      }
    } catch (error) {
      setError('Failed to fetch solution')
      console.error('Error fetching solution:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && solutionDetail) {
      try {
        await navigator.share({
          title: solutionDetail.title,
          text: solutionDetail.description,
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
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading solution...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !solutionDetail) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Solution Not Found</h1>
            <p className="text-gray-400 mb-4">{error}</p>
            <Link
              href="/services/solution"
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Back to Solutions
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5 lg:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 2 === 0 ? 'bg-sky-400/40' : 'bg-white/20'
            }`}
            style={{
              left: `${5 + (i * 12)}%`,
              top: `${10 + (i * 10)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <Link
              href="/services/solution"
              className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Solutions
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Header */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-sm font-medium rounded-full border border-sky-400/30">
                        {solutionDetail.designType}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-400/30">
                        Solution
                      </span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                      {solutionDetail.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <span>Published {new Date(solutionDetail.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {solutionDetail.author && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-sky-400" />
                          <span>{solutionDetail.author.name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span>7 min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              {solutionDetail.poster && (
                <div className="animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative rounded-3xl overflow-hidden bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 p-4">
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                      <Image
                        src={solutionDetail.poster}
                        alt={solutionDetail.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Cog className="w-6 h-6 text-sky-400 mr-3" />
                      Solution Overview
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {solutionDetail.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications / Features */}
              {solutionDetail.lists && solutionDetail.lists.length > 0 && (
                <div className="animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Settings className="w-6 h-6 text-sky-400 mr-3" />
                        Technical Features
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {solutionDetail.lists.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-sky-500/10 rounded-xl border border-sky-400/20 hover:bg-sky-500/15 transition-colors duration-300">
                            <CheckCircle className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Images Gallery */}
              {solutionDetail.images && solutionDetail.images.length > 0 && (
                <div className="animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Zap className="w-6 h-6 text-sky-400 mr-3" />
                        Implementation Gallery
                      </h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {solutionDetail.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative h-48 rounded-xl overflow-hidden bg-gray-800/50 border border-sky-500/20 hover:border-sky-400/40 transition-colors duration-300 cursor-pointer group"
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <Image
                              src={image}
                              alt={`${solutionDetail.title} - Image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Action Buttons */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-6 sticky top-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                  
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Get This Solution</h3>
                    
                    <Link
                      href="/contact"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold text-center hover:from-sky-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
                    >
                      Request Implementation
                    </Link>
                    
                    <button
                      onClick={handleShare}
                      className="w-full px-6 py-3 bg-transparent border border-sky-400/50 text-white rounded-xl font-semibold hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Solution
                    </button>
                    
                    <Link
                      href="/services/solution"
                      className="block w-full px-6 py-3 bg-gray-800/50 border border-gray-600/50 text-gray-300 rounded-xl font-semibold text-center hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                    >
                      View All Solutions
                    </Link>
                  </div>
                </div>
              </div>

              {/* Solution Info */}
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white mb-4">Solution Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-sky-300">Technology Solution</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-sky-300">{solutionDetail.designType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-sky-300">{new Date(solutionDetail.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {solutionDetail.lists && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Features:</span>
                          <span className="text-sky-300">{solutionDetail.lists.length} items</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Implementation:</span>
                        <span className="text-green-400">Available</span>
                      </div>
                    </div>
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
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  <span className="block">Ready to Implement</span>
                  <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    This Solution?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Contact our technical team to discuss implementation details, 
                  timelines, and customization options for your specific requirements.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-sky-500/25"
                  >
                    Start Implementation
                    <Rocket className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-8 py-4 bg-transparent border-2 border-sky-400/50 text-white rounded-full font-semibold text-lg hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300"
                  >
                    Explore More Solutions
                  </Link>
                </div>
              </div>

              <div className="absolute top-6 right-6 w-12 h-12 border-2 border-sky-400/30 rounded-xl rotate-45 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-sky-400/30 to-blue-400/30 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SolutionDetailPage