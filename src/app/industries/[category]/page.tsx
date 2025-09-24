'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Eye,
  Target,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp
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
  createdAt: string
  imageUrl?: string
}

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  color: string
}

const CategoryPage = () => {
  const params = useParams()
  const [industries, setIndustries] = useState<Industry[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (params.category) {
      fetchCategoryData(params.category as string)
    }
  }, [params.category])

  const fetchCategoryData = async (categorySlug: string) => {
    try {
      setLoading(true)
      
      // Fetch industries for this category
      const industriesResponse = await fetch(`/api/industry/${categorySlug}`)
      const industriesData = await industriesResponse.json()

      // Fetch all categories to get category info
      const categoriesResponse = await fetch('/api/industry/category')
      const categoriesData = await categoriesResponse.json()

      if (industriesData.success && categoriesData.success) {
        setIndustries(industriesData.data)
        const categoryInfo = categoriesData.data.find((cat: Category) => cat.slug === categorySlug)
        setCategory(categoryInfo || null)
      } else {
        setError('Failed to load category data')
      }
    } catch (error) {
      setError('Failed to load category data')
      console.error('Error fetching category data:', error)
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-xl font-medium">Loading Category...</span>
        </div>
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Category Not Found</h1>
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
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '15px 15px sm:20px sm:20px lg:30px lg:30px'
        }}></div>
      </div>

      {/* Navigation Header */}
      <div className="relative z-10 pt-20 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/industries"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300 mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Industries
          </Link>
        </div>
      </div>

      {/* Category Header */}
      <section className="relative pt-4 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="block">{category.name}</span>
              <span className="block bg-cyan-700 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {category.description || `Discover our comprehensive ${category.name.toLowerCase()} solutions designed to accelerate your digital transformation and drive sustainable growth in your industry.`}
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {industries.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">No Solutions Available</h3>
                <p className="text-slate-600 mb-8 text-sm sm:text-base leading-relaxed">
                  We're working on adding innovative solutions for this category. Our team is developing cutting-edge technologies to serve your industry better.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Contact Us for Custom Solutions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            <>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industries.map((industry, index) => {
                  const isExpanded = expandedCards[industry._id]
                  const maxTitleLength = 45
                  const maxDescLength = 120
                  const shouldShowReadMore = industry.description.length > maxDescLength
                  const imageSource = industry.imageUrl || industry.poster

                  return (
                    <div
                      key={industry._id}
                      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-indigo-200"
                      style={{ 
                        animation: `fadeInUp 1s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                        <img
                          src={imageSource}
                          alt={industry.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Status Badges */}
                        {industry.isFeatured && (
                          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6 lg:p-7">
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300 leading-tight">
                          {industry.title.length > maxTitleLength
                            ? `${industry.title.substring(0, maxTitleLength)}...`
                            : industry.title
                          }
                        </h3>
                        
                        <p className="text-cyan-600 font-medium mb-4 text-sm lg:text-base">{industry.subtitle}</p>
                        
                        <div className="text-slate-600 leading-relaxed mb-6">
                          <p className="text-sm lg:text-base">
                            {isExpanded 
                              ? industry.description
                              : industry.description.length > maxDescLength
                              ? truncateText(industry.description, maxDescLength)
                              : industry.description
                            }
                          </p>
                          
                          {shouldShowReadMore && (
                            <button
                              onClick={(e) => toggleExpanded(industry._id, e)}
                              className="text-cyan-600 hover:text-cyan-700 text-sm font-medium mt-2 inline-flex items-center transition-colors duration-200"
                            >
                              {isExpanded ? 'Read Less' : 'Read More'}
                              <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Highlights Preview */}
                        {industry.highlights && industry.highlights.length > 0 && (
                          <div className="mb-6">
                            <div className="space-y-2">
                              {industry.highlights.slice(0, 2).map((highlight, idx) => (
                                <div key={idx} className="flex items-start text-sm text-slate-600">
                                  <CheckCircle className="w-4 h-4 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="leading-relaxed">{highlight}</span>
                                </div>
                              ))}
                              {industry.highlights.length > 2 && (
                                <p className="text-sm text-cyan-600 font-medium ml-6">
                                  +{industry.highlights.length - 2} more features
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Technologies */}
                        {industry.technologies && industry.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
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
                        <Link
                          href={`/industries/${industry.category}/${industry.slug}`}
                          className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                          <span>Explore Solution</span>
                          <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>

                      {/* Hover Effect Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Need Custom {category.name} Solutions?
          </h2>
          
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Our experts are ready to design tailored solutions that meet your specific {category.name.toLowerCase()} industry requirements and drive measurable results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group px-8 py-4 bg-white text-cyan-700 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Get Custom Solutions
              <Target className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

export default CategoryPage