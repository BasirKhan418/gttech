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
  Star
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Loading category...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h1>
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
          <Link
            href="/industries"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Industries
          </Link>
        </div>
      </div>

      {/* Category Header */}
      <section className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="font-medium">{category.name} Industry</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              <span className="block">{category.name}</span>
              <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {industries.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-400/40 backdrop-blur-sm shadow-lg">
                  <Building2 className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Industries Available</h3>
                <p className="text-gray-600 mb-8">
                  We're working on adding solutions for this category. Check back soon!
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25"
                >
                  Contact Us for Custom Solutions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <div
                  key={industry._id}
                  className="opacity-0 translate-y-10"
                  style={{ 
                    animation: `fadeInUp 1s ease-out ${index * 0.1}s forwards`
                  }}
                >
                  <Link href={`/industries/${industry.category}/${industry.slug}`}>
                    <div className="group relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/15">
                      
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={industry.poster}
                          alt={industry.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                        
                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {industry.isFeatured && (
                            <div className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full border border-yellow-400/40 backdrop-blur-sm flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Featured
                            </div>
                          )}
                        </div>

                        {/* View Indicator */}
                        <div className="absolute top-3 right-3 p-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                          <Eye className="w-4 h-4 text-cyan-600" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-cyan-700 transition-colors duration-300">
                          {industry.title}
                        </h3>
                        <p className="text-sm text-cyan-600 font-medium mb-3">{industry.subtitle}</p>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {industry.description}
                        </p>

                        {/* Highlights Preview */}
                        {industry.highlights && industry.highlights.length > 0 && (
                          <div className="mb-4">
                            <div className="space-y-1">
                              {industry.highlights.slice(0, 2).map((highlight, idx) => (
                                <div key={idx} className="flex items-center text-xs text-gray-600">
                                  <CheckCircle className="w-3 h-3 text-cyan-600 mr-2 flex-shrink-0" />
                                  <span className="truncate">{highlight}</span>
                                </div>
                              ))}
                              {industry.highlights.length > 2 && (
                                <p className="text-xs text-cyan-600 font-medium ml-5">
                                  +{industry.highlights.length - 2} more features
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Technologies */}
                        {industry.technologies && industry.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {industry.technologies.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="px-2 py-1 bg-cyan-100/80 text-cyan-700 text-xs rounded-md">
                                {tech}
                              </span>
                            ))}
                            {industry.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                +{industry.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300">
                            Explore Solution
                          </span>
                          <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 group-hover:text-cyan-700 transition-all duration-300" />
                        </div>
                      </div>
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
          <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                <span className="block">Need Custom Solutions for</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  {category.name}?
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Our experts are ready to design tailored solutions that meet your specific {category.name.toLowerCase()} industry requirements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25"
                >
                  Get Custom Solutions
                  <Target className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  View All Services
                </Link>
              </div>
            </div>
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