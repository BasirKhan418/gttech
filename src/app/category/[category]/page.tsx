"use client"
import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Calendar,
  Star,
  Eye,
  ArrowRight,
  Monitor,
  Cloud,
  Car,
  Sofa,
  Shirt,
  X,
} from "lucide-react"

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

const CategoryPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = params.category as string

  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")

  const categoryConfig = {
    "Software products": {
      name: "Software Products",
      icon: Monitor,
      color: "from-blue-500 to-blue-600",
      description: "Custom software solutions and applications",
    },
    saap: {
      name: "SAAP Solutions",
      icon: Cloud,
      color: "from-purple-500 to-purple-600",
      description: "Software as a Service platforms",
    },
    "electric vehicles": {
      name: "Electric Vehicles",
      icon: Car,
      color: "from-green-500 to-green-600",
      description: "Sustainable transportation solutions",
    },
    furnitures: {
      name: "Furniture",
      icon: Sofa,
      color: "from-orange-500 to-orange-600",
      description: "Modern and functional furniture designs",
    },
    garments: {
      name: "Garments",
      icon: Shirt,
      color: "from-pink-500 to-pink-600",
      description: "Fashion and textile products",
    },
  }

  const currentCategory = categoryConfig[decodeURIComponent(category) as keyof typeof categoryConfig]

  useEffect(() => {
    fetchProjects()
  }, [category])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchQuery, sortBy])

  useEffect(() => {
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy !== "newest") params.set("sort", sortBy)

    const newUrl = params.toString() ? `?${params.toString()}` : ""
    router.replace(`/category/${category}${newUrl}`, { scroll: false })
  }, [searchQuery, sortBy, category, router])

  // Scroll animation observer
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    })

    // Observe all cards after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('.animate-on-scroll')
      cards.forEach((card) => observer.observe(card))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [filteredProjects])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log('Fetching projects for category:', category)
      
      const decodedCategory = decodeURIComponent(category)
      const response = await fetch(`/api/project?category=${encodeURIComponent(decodedCategory)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)

      if (data.success && Array.isArray(data.data)) {
        const activeProjects = data.data.filter((project: Project) => project.isActive)
        console.log('Active projects found:', activeProjects.length)
        setProjects(activeProjects)
      } else {
        setError(data.message || "Failed to fetch projects")
        setProjects([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch projects"
      setError(errorMessage)
      console.error("Error fetching projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]
    console.log('Filtering projects. Total:', projects.length)

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.technologies?.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
          project.features?.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      console.log('After search filter:', filtered.length)
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "featured":
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    console.log('Final filtered projects:', filtered.length)
    setFilteredProjects(filtered)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-8">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
            `,
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Loading {currentCategory?.name || "Products"}...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !currentCategory) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {!currentCategory ? "In This Category Products Not Found" : "Error Loading Projects"}
            </h1>
            <p className="text-gray-600 mb-4">{error || "Products are not uploaded yet"}</p>
            <Link
              href="/project"
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const IconComponent = currentCategory.icon

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 2 === 0 ? "bg-cyan-400/40" : "bg-cyan-200/30"
            }`}
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          ></div>
        ))}
      </div>

        {/* Compact Header Section */}
<section className="relative z-10 pt-20 pb-6 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Navigation */}
    <Link
      href="/project"
      className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-all duration-300 mb-6 group text-sm"
    >
      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
      All Categories
    </Link>

    {/* Compact Header Card */}
    <div className="bg-white/90 backdrop-blur-sm border border-cyan-200/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${currentCategory.color} flex items-center justify-center shadow-lg`}>
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              {currentCategory.name}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{currentCategory.description}</p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="font-medium text-gray-700">{filteredProjects.length}</span>
          </div>
          {filteredProjects.filter((p) => p.isFeatured).length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
              <Star className="w-3 h-3 text-yellow-600" />
              <span className="font-medium text-gray-700">{filteredProjects.filter((p) => p.isFeatured).length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</section>

<section className="relative z-10 pb-8 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-md">
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-between gap-4">
  {/* Search Bar */}
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all text-black text-sm"
    />
    {searchQuery && (
      <button
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>

  {/* Controls */}
  <div className="flex items-center gap-3">
    {/* Sort */}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="text-black px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-sm"
    >
      <option value="newest">Latest</option>
      <option value="oldest">Oldest</option>
      <option value="title">A-Z</option>
      <option value="featured">Featured</option>
    </select>

    {/* View Toggle */}
    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-0.5">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "grid" ? "bg-white text-cyan-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "list" ? "bg-white text-cyan-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>


      {/* Active Filters */}
      {searchQuery && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Filtering by:</span>
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-md border border-cyan-200">
            "{searchQuery}"
            <button onClick={clearSearch} className="ml-1 hover:text-cyan-800">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</section>

      {/* Products Grid/List */}
      <section className="relative z-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No products match your search "${searchQuery}"`
                  : `No products available in ${currentCategory.name}`}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredProjects.map((project, index) => (
                <div
                  key={project._id}
                  className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {viewMode === "grid" ? (
                    // Grid View Card
                    <Link href={`/project/${project._id}`}>
                      <div className="group relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/15 hover:bg-white/80">
                        {/* Glass Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                        {/* Featured Badge */}
                        {project.isFeatured && (
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/40 rounded-full px-3 py-1 text-xs font-medium text-yellow-700">
                              Featured
                            </div>
                          </div>
                        )}

                        {/* Image Section */}
                        {project.poster && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={project.poster || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
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
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-500/10 text-blue-700 text-xs rounded-full border border-blue-400/30"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="text-xs text-cyan-600 font-medium">
                                    +{project.technologies.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300">
                              View Details
                            </span>
                            <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 group-hover:text-cyan-700 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // List View Card
                    <Link href={`/project/${project._id}`}>
                      <div className="group relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-2xl overflow-hidden hover:border-cyan-400/70 transition-all duration-300 hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>

                        <div className="relative z-10 p-6">
                          <div className="flex gap-6">
                            {/* Image */}
                            {project.poster && (
                              <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden">
                                <img
                                  src={project.poster || "/placeholder.svg"}
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg"
                                  }}
                                />
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300">
                                    {project.title}
                                  </h3>
                                  {project.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                                </div>
                                <span className="text-gray-500 text-sm flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                {project.description}
                              </p>

                              {/* Technologies */}
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {project.technologies.slice(0, 4).map((tech, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-blue-500/10 text-blue-700 text-xs rounded-full border border-blue-400/30"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                  {project.technologies.length > 4 && (
                                    <span className="text-xs text-cyan-600 font-medium">
                                      +{project.technologies.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <span className="text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300">
                                  View Details
                                </span>
                                <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 group-hover:text-cyan-700 transition-all duration-300" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
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
          animation: fade-in-up 0.8s ease-out forwards;
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

export default CategoryPage