'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Zap, 
  Users, 
  Cog, 
  Lightbulb,
  Star,
  CheckCircle,
  Globe,
  Rocket,
  Shield,
  Target,
  Code,
  Layers,
  Settings,
  Monitor,
  Smartphone,
  Database,
  Loader2,
  LucideIcon,
  ChevronRight,
  Plus
} from 'lucide-react'

interface Service {
  _id: string
  slug: string
  sectionName: string
  title: string
  tagline: string
  description: string
  poster?: string
  images?: string[]
  lists?: string[]
  designType: string
  icon: string
  isActive: boolean
  isFeatured: boolean
  technologies?: string[]
  capabilities?: string[]
}

// Icon mapping for dynamic icons
const iconMap: Record<string, LucideIcon> = {
  code: Code,
  star: Star,
  layers: Layers,
  lightbulb: Lightbulb,
  zap: Zap,
  rocket: Rocket,
  settings: Settings,
  cog: Cog,
  monitor: Monitor,
  smartphone: Smartphone,
  database: Database,
  globe: Globe,
  users: Users,
  target: Target,
  shield: Shield
}

const ServicesPage = () => {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const router = useRouter()
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
  }, [loading])

  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Cog
  }

  const toggleCardExpansion = (serviceId: string) => {
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
    return text.slice(0, maxLength).trim() + '...'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-cyan-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl font-medium">Loading Services...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-medium mb-4">Error loading services</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
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
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 3 === 0 ? 'bg-cyan-400/40' : i % 3 === 1 ? 'bg-cyan-300/30' : 'bg-cyan-200/20'
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
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-data-flow"
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
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-data-flow"
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
      <section className="relative z-10 pt-18 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-lg">
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium">Our Core Services</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
                <span className="block">Comprehensive Technology</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Solutions & Consulting
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                Partner with GT Technologies to unlock digital transformation potential through our 
                comprehensive solutions and expert consulting services tailored for Industry 4.0 excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Services Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {services.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => {
                const IconComponent = getIcon(service.icon)
                const isExpanded = expandedCards.has(service._id)
                
                return (
                  <div 
                    key={service._id} 
                    className="animate-on-scroll opacity-0 translate-y-10" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div 
                      className="relative group h-full transition-all duration-500 transform hover:scale-[1.02]"
                      onMouseEnter={() => setActiveService(service._id)}
                      onMouseLeave={() => setActiveService(null)}
                    >
                      <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-2xl md:rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/15 group-hover:bg-white/80 h-full flex flex-col">
                        
                        {/* Glass Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Header Section */}
                        <div className="relative z-10 p-5 md:p-6 lg:p-8 flex-grow">
                          <div className="flex items-start justify-between mb-4 md:mb-6">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/40 group-hover:scale-105 transition-transform duration-300 shadow-lg flex-shrink-0">
                              <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-cyan-600 group-hover:rotate-12 transition-transform duration-500" />
                            </div>
                            <div className="text-right ml-3">
                              <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300 leading-tight">
                                {truncateText(service.sectionName, 20)}
                              </div>
                              {service.isFeatured && (
                                <div className="flex items-center justify-end mt-1">
                                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 mr-1" />
                                  <div className="text-yellow-600 text-xs md:text-sm font-medium">Featured</div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-cyan-700 transition-colors duration-300 leading-tight">
                            {truncateText(service.title, 50)}
                          </h3>
                          
                          <div className="text-cyan-600 font-medium mb-3 md:mb-4 text-sm md:text-base">
                            {truncateText(service.tagline, 60)}
                          </div>
                          
                          <div className="text-gray-600 leading-relaxed mb-4 md:mb-6 group-hover:text-gray-700 transition-colors duration-300">
                            <p className="text-sm md:text-base">
                              {isExpanded 
                                ? service.description 
                                : truncateText(service.description, 120)
                              }
                            </p>
                            {service.description.length > 120 && (
                              <button
                                onClick={() => router.push(`/services/${service.slug}`)}
                                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium mt-2 inline-flex items-center transition-colors duration-200"
                              >
                                {isExpanded ? 'Show Less' : 'Read More'}
                                <ChevronRight className={`w-4 h-4 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                            )}
                          </div>

                          {/* Key Highlights - Responsive Grid */}
                          {service.lists && service.lists.length > 0 && (
                            <div className={`mb-6 md:mb-8 transition-all duration-300 ${isExpanded ? '' : ''}`}>
                              <div className="grid grid-cols-1 gap-2 md:gap-3">
                                {(isExpanded ? service.lists : service.lists.slice(0, 3)).map((item, index) => (
                                  <div key={index} className="flex items-start space-x-2 md:space-x-3 group/item">
                                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-cyan-500/30 transition-colors duration-300 flex-shrink-0 mt-0.5">
                                      <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-cyan-600" />
                                    </div>
                                    <span className="text-gray-600 group-hover:text-gray-800 group-hover/item:text-cyan-700 transition-colors duration-200 text-xs md:text-sm leading-relaxed">
                                      {truncateText(item, isExpanded ? 200 : 80)}
                                    </span>
                                  </div>
                                ))}
                                {!isExpanded && service.lists.length > 3 && (
                                  <button
                                    onClick={() => router.push(`/services/${service.slug}`)}
                                    className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 text-xs md:text-sm font-medium transition-colors duration-200 ml-7"
                                  >
                                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{service.lists.length - 3} more features</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Technology/Capabilities Preview - Compact Design */}
                        <div className="relative z-10 px-5 md:px-6 lg:px-8 pb-6 md:pb-8">
                          <div className="bg-cyan-50/60 backdrop-blur-sm border border-cyan-300/40 rounded-xl md:rounded-2xl p-4 md:p-6 overflow-hidden">
                            <h4 className="text-gray-800 font-semibold mb-3 md:mb-4 flex items-center text-sm md:text-base">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-500 rounded-full mr-2 md:mr-3 animate-pulse"></span>
                              {service.technologies && service.technologies.length > 0 ? 'Technologies' : 
                               service.capabilities && service.capabilities.length > 0 ? 'Capabilities' : 'Features'}
                            </h4>
                            
                            <div className="flex flex-wrap gap-2">
                              {/* Display technologies first, then capabilities, then lists */}
                              {(service.technologies?.slice(0, isExpanded ? 12 : 6) || 
                                service.capabilities?.slice(0, isExpanded ? 12 : 6) || 
                                service.lists?.slice(0, isExpanded ? 12 : 6) || []).map((item, index) => (
                                <div 
                                  key={index} 
                                  className="inline-flex items-center space-x-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-white/60 border border-cyan-200/60 rounded-lg hover:bg-cyan-100/50 hover:border-cyan-300/70 transition-all duration-200 backdrop-blur-sm"
                                >
                                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0"></div>
                                  <span className="text-gray-700 text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-[120px]">
                                    {item.length > 15 ? item.slice(0, 15) + '...' : item}
                                  </span>
                                </div>
                              ))}
                              {!isExpanded && (
                                (service.technologies?.length || 0) > 6 || 
                                (service.capabilities?.length || 0) > 6 || 
                                (service.lists?.length || 0) > 6
                              ) && (
                                <button
                                  onClick={() => toggleCardExpansion(service._id)}
                                  className="inline-flex items-center space-x-1 px-2.5 md:px-3 py-1.5 md:py-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100/50 rounded-lg transition-colors duration-200 text-xs md:text-sm font-medium"
                                >
                                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>More</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CTA Footer */}
                        <div className="relative z-10 px-5 md:px-6 lg:px-8 pb-5 md:pb-6 lg:pb-8 mt-auto">
                          <Link
                            href={`/services/${service.slug}`}
                            className="group/btn w-full inline-flex items-center justify-center px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-sm md:text-base lg:text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/50"
                          >
                            <span className="truncate">Explore {truncateText(service.title, 20)}</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                          </Link>
                        </div>

                        {/* Service Poster Background */}
                        {service.poster && (
                          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <img 
                              src={service.poster} 
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Decorative Elements */}
                        <div className="absolute top-3 left-3 w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute bottom-3 right-3 w-1 h-1 md:w-1.5 md:h-1.5 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-500 text-xl">No services available</div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden shadow-2xl">
              {/* Glass Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
              
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

              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
                  <span className="block">Ready to Begin Your</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    Digital Transformation?
                  </span>
                </h2>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
                  Connect with our expert team to discuss your specific requirements and discover how 
                  GT Technologies can accelerate your journey to Industry 4.0 excellence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-lg mx-auto">
                  <Link
                    href="/contact"
                    className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-base md:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center"
                  >
                    Start Your Project
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/about"
                    className="px-6 md:px-8 py-3 md:py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-base md:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center justify-center"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 w-8 h-8 md:w-12 md:h-12 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse"></div>
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-cyan-400/40 to-cyan-500/40 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations and Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes data-flow {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
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

        .animate-data-flow {
          animation: data-flow 3s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-on-scroll {
          transition: all 1s ease-out;
        }

        /* Custom responsive breakpoints */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
        }
        
        @media (min-width: 1536px) {
          .grid.xl\\:grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </main>
  )
}

export default ServicesPage