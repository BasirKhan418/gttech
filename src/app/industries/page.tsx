'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Factory, 
  Car, 
  Building2, 
  Zap,
  Cpu,
  Wrench,
  Settings,
  CheckCircle,
  Globe,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  BarChart3,
  Database,
  Cog,
  Users,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  icon?: string
  color: string
  order: number
  isActive: boolean
  imageUrl?: string
}

interface Industry {
  _id: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  technologies: string[]
  poster: string
  category: string
  isActive: boolean
  isFeatured: boolean
  slug: string
  imageUrl?: string
}

const IndustryPage = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredIndustries, setFeaturedIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})

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
  }, [categories])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, industriesRes] = await Promise.all([
        fetch('/api/industry/category'),
        fetch('/api/industry')
      ])

      const [categoriesData, industriesData] = await Promise.all([
        categoriesRes.json(),
        industriesRes.json()
      ])

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }

      if (industriesData.success) {
        // Get featured industries
        const featured = industriesData.data
          .filter((industry: Industry) => industry.isFeatured && industry.isActive)
          .slice(0, 6)
        setFeaturedIndustries(featured)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (cardId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  const getIconComponent = (iconName?: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      factory: Factory,
      car: Car,
      building2: Building2,
      zap: Zap,
      cpu: Cpu,
      wrench: Wrench,
      settings: Settings,
      globe: Globe,
      rocket: Rocket,
      shield: Shield,
      database: Database,
      cog: Cog,
      users: Users,
      award: Award
    }
    
    return icons[iconName || 'factory'] || Factory
  }

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: any } = {
      cyan: {
        gradient: 'from-cyan-500/20 to-cyan-400/20',
        border: 'border-cyan-500/20 hover:border-cyan-400/40',
        text: 'text-cyan-600',
        bg: 'bg-cyan-500/20'
      },
      blue: {
        gradient: 'from-blue-500/20 to-blue-400/20',
        border: 'border-blue-500/20 hover:border-blue-400/40',
        text: 'text-blue-600',
        bg: 'bg-blue-500/20'
      },
      green: {
        gradient: 'from-green-500/20 to-green-400/20',
        border: 'border-green-500/20 hover:border-green-400/40',
        text: 'text-green-600',
        bg: 'bg-green-500/20'
      },
      purple: {
        gradient: 'from-purple-500/20 to-purple-400/20',
        border: 'border-purple-500/20 hover:border-purple-400/40',
        text: 'text-purple-600',
        bg: 'bg-purple-500/20'
      },
      orange: {
        gradient: 'from-orange-500/20 to-orange-400/20',
        border: 'border-orange-500/20 hover:border-orange-400/40',
        text: 'text-orange-600',
        bg: 'bg-orange-500/20'
      }
    }
    
    return colorMap[color] || colorMap.cyan
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-xl font-medium">Loading Industries...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Enhanced Background Elements */}
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
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 4 === 0 ? 'bg-cyan-400/60' : 
              i % 4 === 1 ? 'bg-cyan-300/50' : 
              i % 4 === 2 ? 'bg-cyan-500/40' : 'bg-cyan-200/40'
            }`}
            style={{
              left: `${5 + (i * 6)}%`,
              top: `${10 + (i * 5)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 4)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-cyan-100 border border-cyan-200 rounded-full text-sm text-cyan-700 mb-8">
                <Building2 className="w-4 h-4 mr-2" />
                <span className="font-medium">Industry Expertise</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                <span className="block">Transforming Industries with</span>
                <span className="block bg-cyan-700 bg-clip-text text-transparent">
                  Advanced Technology
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Delivering specialized solutions across diverse industries, from manufacturing and automotive 
                to aerospace and healthcare, with proven expertise in digital transformation and Industry 4.0 implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Categories */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Explore Industry Categories
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Discover our comprehensive solutions tailored for different industry sectors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon)
              const colorClasses = getColorClasses(category.color)
              const isExpanded = expandedCards[category._id]
              const maxTitleLength = 50
              const maxDescLength = 120
              
              return (
                <div 
                  key={category._id} 
                  className="animate-on-scroll opacity-0 translate-y-10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={`/industries/${category.slug}`}>
                    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-indigo-200 h-full">
                        
                        {/* Image Section */}
                        {category.imageUrl && (
                          <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Icon overlay on image */}
                            <div className={`absolute top-4 left-4 w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center backdrop-blur-sm border border-opacity-40 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                            </div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-6 lg:p-7 flex-1 flex flex-col">
                          {/* If no image, show icon at top */}
                          {!category.imageUrl && (
                            <div className="flex items-center justify-between mb-6">
                              <div className={`w-16 h-16 ${colorClasses.bg} rounded-2xl flex items-center justify-center backdrop-blur-sm border border-opacity-40 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <IconComponent className={`w-8 h-8 ${colorClasses.text}`} />
                              </div>
                            </div>
                          )}
                          
                          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 group-hover:text-cyan-700 transition-colors duration-300 leading-tight">
                            {category.name.length > maxTitleLength
                              ? `${category.name.substring(0, maxTitleLength)}...`
                              : category.name
                            }
                          </h3>
                          
                          <div className="flex-1 mb-6">
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300 text-sm lg:text-base">
                              {isExpanded 
                                ? category.description
                                : category.description.length > maxDescLength
                                ? truncateText(category.description, maxDescLength)
                                : category.description
                              }
                            </p>
                            
                            {category.description.length > maxDescLength && (
                              <button
                                onClick={(e) => toggleExpanded(category._id, e)}
                                className={`mt-2 flex items-center text-sm ${colorClasses.text} font-medium hover:underline transition-colors duration-300`}
                              >
                                {isExpanded ? (
                                  <>
                                    Read Less <ChevronUp className="w-4 h-4 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Read More <ChevronDown className="w-4 h-4 ml-1" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Explore Button */}
                          <div className="mt-auto">
                            <div className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                              <span>Explore Solutions</span>
                              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Industries */}
      {featuredIndustries.length > 0 && (
        <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Featured Industries
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                  Highlighting our most successful industry implementations and solutions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredIndustries.map((industry, index) => {
                const isExpanded = expandedCards[`featured-${industry._id}`]
                const maxTitleLength = 45
                const maxDescLength = 120
                const imageSource = industry.imageUrl || industry.poster
                
                return (
                  <div 
                    key={industry._id} 
                    className="animate-on-scroll opacity-0 translate-y-10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/industries/${industry.category}/${industry.slug}`}>
                      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-indigo-200 h-full flex flex-col">
                        
                        {/* Image */}
                        <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                          <img
                            src={imageSource}
                            alt={industry.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-4 right-4">
                            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Featured
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 lg:p-7 flex-1 flex flex-col">
                          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300 leading-tight">
                            {industry.title.length > maxTitleLength
                              ? `${industry.title.substring(0, maxTitleLength)}...`
                              : industry.title
                            }
                          </h3>
                          <p className="text-cyan-600 font-medium mb-4 text-sm lg:text-base">{industry.subtitle}</p>
                          
                          <div className="flex-1 mb-6">
                            <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                              {isExpanded 
                                ? industry.description
                                : industry.description.length > maxDescLength
                                ? truncateText(industry.description, maxDescLength)
                                : industry.description
                              }
                            </p>
                            
                            {industry.description.length > maxDescLength && (
                              <button
                                onClick={(e) => toggleExpanded(`featured-${industry._id}`, e)}
                                className="mt-2 flex items-center text-xs text-cyan-600 font-medium hover:underline transition-colors duration-300"
                              >
                                {isExpanded ? (
                                  <>
                                    Read Less <ChevronUp className="w-3 h-3 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Read More <ChevronDown className="w-3 h-3 ml-1" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Technologies */}
                          {industry.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-6">
                              {industry.technologies.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="px-2 py-1 bg-cyan-100/80 text-cyan-700 text-xs rounded-md">
                                  {tech}
                                </span>
                              ))}
                              {industry.technologies.length > 3 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                  +{industry.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Explore Button */}
                          <div className="mt-auto">
                            <div className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                              <span>Learn More</span>
                              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover Effect Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">              
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Industry?
            </h2>
            
            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Partner with GT Technologies to leverage industry-specific expertise and cutting-edge 
              solutions that drive measurable results across your operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group px-8 py-4 bg-white text-cyan-700 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Discuss Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/case-studies"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                View Case Studies
              </Link>
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  )
}

export default IndustryPage