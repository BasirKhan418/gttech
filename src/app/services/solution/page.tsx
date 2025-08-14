'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  Cog, 
  CheckCircle,
  Eye,
  Rocket,
  Target,
  Star,
  Zap
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
  createdAt: string
  updatedAt: string
}

const SolutionsPage = () => {
  const [solutions, setSolutions] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
  }, [solutions])

  useEffect(() => {
    fetchSolutions()
  }, [])

  const fetchSolutions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content')
      const data = await response.json()

      if (data.success) {
        // Filter content by sectionName 'solutions'
        const solutionServices = data.data.filter((item: Content) => 
          item.sectionName.toLowerCase() === 'solutions'
        )
        setSolutions(solutionServices)
      } else {
        setError(data.message || 'Failed to fetch solutions')
      }
    } catch (error) {
      setError('Failed to fetch solutions')
      console.error('Error fetching solutions:', error)
    } finally {
      setLoading(false)
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
            <p className="text-white text-lg">Loading solutions...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Solutions</h1>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={fetchSolutions}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      
      {/* Enhanced Background Elements */}
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
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 3 === 0 ? 'bg-sky-400/40' : i % 3 === 1 ? 'bg-blue-400/30' : 'bg-white/20'
            }`}
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Data Flow Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-30">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-data-flow"
                style={{
                  left: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-30">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-data-flow"
                style={{
                  right: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
                <Cog className="w-4 h-4 mr-2" />
                <span className="font-medium">Technology Solutions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Innovative Technology</span>
                <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Cutting-edge technology implementations that drive digital transformation across 
                manufacturing, automation, and industrial processes with measurable outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {solutions.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-12 max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
                  
                  <div className="relative z-10">
                    <Zap className="w-16 h-16 text-sky-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
                    <p className="text-gray-400 mb-8">
                      Our technology solutions are being prepared. We'll have exciting offerings available soon!
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
                    >
                      Get Notified
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <div
                  key={solution._id}
                  className="animate-on-scroll opacity-0 translate-y-10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/services/solution/${solution._id}`}>
                    <div className="group relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl overflow-hidden hover:border-sky-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/10">
                      
                      {/* Glass Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.08] via-transparent to-blue-500/[0.05]"></div>
                      
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Image Section */}
                      {solution.poster && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={solution.poster}
                            alt={solution.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                          
                          {/* View Indicator */}
                          <div className="absolute top-4 right-4 p-2 bg-sky-500/20 backdrop-blur-sm border border-sky-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Eye className="w-4 h-4 text-sky-400" />
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="relative z-10 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-medium rounded-full border border-sky-400/30">
                            {solution.designType}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(solution.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-200 transition-colors duration-300 line-clamp-2">
                          {solution.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                          {solution.description}
                        </p>

                        {/* Lists Preview */}
                        {solution.lists && solution.lists.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {solution.lists.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3 text-sky-400" />
                                  <span className="text-xs text-gray-400">{item}</span>
                                </div>
                              ))}
                              {solution.lists.length > 3 && (
                                <span className="text-xs text-sky-400">+{solution.lists.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <span className="text-sky-400 font-semibold text-sm group-hover:text-sky-300 transition-colors duration-300">
                            Explore Solution
                          </span>
                          <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 group-hover:text-sky-300 transition-all duration-300" />
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-3 left-3 w-2 h-2 bg-sky-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                      <div className="absolute bottom-3 right-3 w-1 h-1 bg-blue-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-12 overflow-hidden">
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-blue-500/5"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-float ${
                      i % 2 === 0 ? 'bg-sky-400/60' : 'bg-white/40'
                    }`}
                    style={{
                      left: `${10 + (i * 15)}%`,
                      top: `${15 + (i * 10)}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + (i % 3)}s`
                    }}
                  ></div>
                ))}
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  <span className="block">Ready to Implement</span>
                  <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    Cutting-Edge Solutions?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Transform your operations with our advanced technology solutions designed 
                  for Industry 4.0 excellence and sustainable growth.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-sky-500/25"
                  >
                    Start Your Project
                    <Rocket className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-8 py-4 bg-transparent border-2 border-sky-400/50 text-white rounded-full font-semibold text-lg hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300"
                  >
                    View All Services
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-12 h-12 border-2 border-sky-400/30 rounded-xl rotate-45 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-sky-400/30 to-blue-400/30 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SolutionsPage