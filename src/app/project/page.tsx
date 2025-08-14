'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Folder, 
  CheckCircle,
  Eye,
  Calendar,
  Target,
  Star,
  Code,
  Layers
} from 'lucide-react'

interface Project {
  _id: string
  title: string
  category: string
  description: string
  poster: string
  images: string[]
  icon?: string
  technologies?: string[]
  features?: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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
  }, [projects])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/project')
      const data = await response.json()

      if (data.success) {
        const activeProjects = data.data.filter((project: Project) => project.isActive)
        setProjects(activeProjects)
      } else {
        setError(data.message || 'Failed to fetch projects')
      }
    } catch (error) {
      setError('Failed to fetch projects')
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(project => project.category)))]
  
  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  // Get featured projects
  const featuredProjects = projects.filter(project => project.isFeatured)

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Loading Products...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Products</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchProjects}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Try Again
            </button>
          </div>
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
      <section className="relative z-10 pt-18 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-lg">
                <Folder className="w-4 h-4 mr-2" />
                <span className="font-medium">Our Portfolio</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Featured</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Explore our diverse portfolio of innovative products spanning across various technologies 
                and industries, showcasing our expertise in digital transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-3" />
                Featured Products
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredProjects.slice(0, 3).map((project, index) => (
                  <div
                    key={project._id}
                    className="animate-on-scroll opacity-0 translate-y-10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/project/${project._id}`}>
                      <div className="group relative bg-white/70 backdrop-blur-sm border border-yellow-300/50 rounded-3xl overflow-hidden hover:border-yellow-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/15 group-hover:bg-white/80">
                        
                        {/* Glass Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-yellow-50/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-500/8 via-transparent to-yellow-300/5"></div>
                        
                        {/* Featured Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-full px-3 py-1 text-xs font-medium text-yellow-700">
                            Featured
                          </div>
                        </div>

                        {/* Image Section */}
                        {project.poster && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={project.poster}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                            
                            {/* View Indicator */}
                            <div className="absolute top-4 left-4 p-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                              <Eye className="w-4 h-4 text-cyan-600" />
                            </div>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="relative z-10 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-700 text-xs font-medium rounded-full border border-cyan-400/40 backdrop-blur-sm">
                              {project.category}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2">
                            {project.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                            {project.description}
                          </p>

                          {/* Technologies Preview */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                  <div key={idx} className="flex items-center space-x-1">
                                    <Code className="w-3 h-3 text-cyan-600" />
                                    <span className="text-xs text-gray-600">{tech}</span>
                                  </div>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="text-xs text-cyan-600 font-medium">+{project.technologies.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300">
                              View Product
                            </span>
                            <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 group-hover:text-cyan-700 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute bottom-3 right-3 w-1 h-1 bg-yellow-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    selectedCategory === category
                      ? 'bg-cyan-500/20 text-cyan-700 border border-cyan-400/40 shadow-lg'
                      : 'bg-white/60 text-gray-600 border border-gray-300/40 hover:bg-cyan-100/60 hover:text-cyan-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl">
                  {/* Glass Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-400/40 backdrop-blur-sm shadow-lg">
                      <Layers className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {selectedCategory === 'all' ? 'No Products Found' : `No ${selectedCategory} Products`}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {selectedCategory === 'all' 
                        ? 'We\'re working on exciting products. Check back soon!' 
                        : `No products found in the ${selectedCategory} category. Try selecting a different category.`
                      }
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/50"
                    >
                      Get in Touch
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="animate-on-scroll opacity-0 translate-y-10 mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
                </h2>
                <p className="text-gray-600">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project._id}
                    className="animate-on-scroll opacity-0 translate-y-10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/project/${project._id}`}>
                      <div className="group relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/15 group-hover:bg-white/80">
                        
                        {/* Glass Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                        
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Image Section */}
                        {project.poster && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={project.poster}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                            
                            {/* View Indicator */}
                            <div className="absolute top-4 right-4 p-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                              <Eye className="w-4 h-4 text-cyan-600" />
                            </div>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="relative z-10 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-700 text-xs font-medium rounded-full border border-cyan-400/40 backdrop-blur-sm">
                              {project.category}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors duration-300 line-clamp-2">
                            {project.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                            {project.description}
                          </p>

                          {/* Technologies Preview */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                  <div key={idx} className="flex items-center space-x-1">
                                    <Code className="w-3 h-3 text-cyan-600" />
                                    <span className="text-xs text-gray-600">{tech}</span>
                                  </div>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="text-xs text-cyan-600 font-medium">+{project.technologies.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300">
                              View Product
                            </span>
                            <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 group-hover:text-cyan-700 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute bottom-3 right-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 overflow-hidden shadow-2xl">
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-float ${
                      i % 2 === 0 ? 'bg-cyan-400/60' : 'bg-cyan-200/40'
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  <span className="block">Have a Product</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    in Mind?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Let's collaborate on your next big idea. Our team of experts is ready to 
                  bring your vision to life with cutting-edge technology solutions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25"
                  >
                    Start Your Product
                    <Target className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-8 py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                  >
                    View Our Services
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-12 h-12 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-cyan-400/40 to-cyan-500/40 rounded-full animate-bounce"></div>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

export default ProjectsPage