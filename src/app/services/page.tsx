'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { 
  ArrowRight, 
  Zap,
  Loader2,
  ChevronRight
} from 'lucide-react'

interface Service {
  _id: string
  slug: string
  sectionName: string
  title: string
  tagline: string
  description: string
  poster?: string
  isActive: boolean
  isFeatured: boolean
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/services')
        const data = await response.json()
        
        if (data.success) {
          // Filter only active services and sort featured first
          const activeServices = data.data.filter((service: Service) => service.isActive)
          const sortedServices = activeServices.sort((a: Service, b: Service) => {
            if (a.isFeatured && !b.isFeatured) return -1
            if (!a.isFeatured && b.isFeatured) return 1
            return 0
          })
          setServices(sortedServices)
        } else {
          setError(data.error || 'Failed to fetch services')
        }
      } catch (err) {
        setError('Failed to load services')
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const toggleReadMore = (serviceId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId)
    } else {
      newExpanded.add(serviceId)
    }
    setExpandedCards(newExpanded)
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    const truncated = text.slice(0, maxLength).trim()
    const lastSpace = truncated.lastIndexOf(' ')
    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl font-medium">Loading Services...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-medium mb-4">Error loading services</div>
          <p className="text-slate-600">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-cyan-100 border border-cyan-200 rounded-full text-sm text-cyan-700 mb-8">
              <Zap className="w-4 h-4 mr-2" />
              <span className="font-medium">Our Services</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="block">Transform Your Business</span>
              <span className="block bg-cyan-700 bg-clip-text text-transparent">
                With Our Solutions
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover comprehensive technology solutions designed to accelerate your digital transformation 
              and drive sustainable growth in the modern business landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const isExpanded = expandedCards.has(service._id)
                const descriptionLimit = 120
                const shouldShowReadMore = service.description.length > descriptionLimit
                
                return (
                  <div 
                    key={service._id} 
                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-indigo-200"
                  >
                    {/* Image Poster */}
                    <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                      {service.poster ? (
                        <img 
                          src={service.poster} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl font-bold text-indigo-200 select-none">
                            {service.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      {/* Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Featured Badge */}
                      {service.isFeatured && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-7">
                      {/* Title */}
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                      
                      {/* Tagline */}
                      <p className="text-cyan-600 font-medium mb-4 text-sm lg:text-base">
                        {service.tagline}
                      </p>
                      
                      {/* Description */}
                      <div className="text-slate-600 leading-relaxed mb-6">
                        <p className="text-sm lg:text-base">
                          {isExpanded 
                            ? service.description 
                            : truncateText(service.description, descriptionLimit)
                          }
                        </p>
                        {shouldShowReadMore && (
                          <button
                            onClick={() => toggleReadMore(service._id)}
                            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium mt-2 inline-flex items-center transition-colors duration-200 group/btn"
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                            <ChevronRight className={`w-4 h-4 ml-1 transition-transform duration-200 group-hover/btn:translate-x-0.5 ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Explore Button */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="group/btn w-full inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        <span>Explore Service</span>
                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>

                    {/* Hover Effect Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-slate-500 text-xl">No services available</div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how our services can help transform your business and drive growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-8 py-4 bg-white text-cyan-700 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ServicesPage