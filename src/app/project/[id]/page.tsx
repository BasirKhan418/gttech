"use client"
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle,
  Share2,
  Star,
  Code,
  Layers,
  ArrowRight,
  Lightbulb,
  Zap,
  Monitor,
  Cloud,
  Car,
  Sofa,
  Shirt,
  Package,
  Palette,
  Settings,
  Battery,
  Ruler,
  Weight,
  Wrench,
  ShirtIcon,
  Scissors,
} from "lucide-react"

interface Project {
  subproducts?: { image: string; title: string; description: string; learnMoreLink?: string }[]
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

  // Category-specific fields
  portfolios?: string[]
  industries?: string[]
  capabilities?: string[]
  valuePropositions?: string[]
  pricingModel?: string
  integrations?: string[]
  apiSupport?: boolean
  batteryCapacity?: string
  range?: string
  chargingTime?: string
  motorType?: string
  material?: string[]
  dimensions?: string
  weight?: string
  assemblyRequired?: boolean
  sizes?: string[]
  colors?: string[]
  fabric?: string[]
  careInstructions?: string[]
}

const ProjectDetailPage = () => {
  const params = useParams()
  const [projectDetail, setProjectDetail] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProjectDetail(params.id as string)
    }
  }, [params.id])

  const fetchProjectDetail = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/project")
      const data = await response.json()

      if (data.success) {
        const project = data.data.find((item: Project) => item._id === id)
        if (project && project.isActive) {
          setProjectDetail(project)
        } else {
          setError("Project not found")
        }
      } else {
        setError(data.message || "Failed to fetch product")
      }
    } catch (error) {
      setError("Failed to fetch product")
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && projectDetail) {
      try {
        await navigator.share({
          title: projectDetail.title,
          text: projectDetail.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const getCategoryConfig = (category: string) => {
    const configs = {
      "Software products": {
        name: "Software Products",
        icon: Monitor,
        color: "from-blue-500 to-blue-600",
        bgGradient: "from-blue-50 to-blue-100",
        accentColor: "blue",
      },
      saap: {
        name: "SAAP Solutions",
        icon: Cloud,
        color: "from-purple-500 to-purple-600",
        bgGradient: "from-purple-50 to-purple-100",
        accentColor: "purple",
      },
      "electric vehicles": {
        name: "Electric Vehicles",
        icon: Car,
        color: "from-green-500 to-green-600",
        bgGradient: "from-green-50 to-green-100",
        accentColor: "green",
      },
      furnitures: {
        name: "Furniture",
        icon: Sofa,
        color: "from-orange-500 to-orange-600",
        bgGradient: "from-orange-50 to-orange-100",
        accentColor: "orange",
      },
      garments: {
        name: "Garments",
        icon: Shirt,
        color: "from-pink-500 to-pink-600",
        bgGradient: "from-pink-50 to-pink-100",
        accentColor: "pink",
      },
    }
    return configs[category as keyof typeof configs] || configs["Software products"]
  }

  const renderCategorySpecificContent = (project: Project) => {
    const categoryConfig = getCategoryConfig(project.category)

    switch (project.category) {
      case "Software products":
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Portfolios */}
            {project.portfolios && project.portfolios.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" />
                  Portfolio Applications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {project.portfolios.map((portfolio, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-500/10 rounded-lg sm:rounded-xl border border-blue-400/30"
                    >
                      <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-sm sm:text-base">{portfolio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industries & Capabilities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {project.industries && project.industries.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
                    Target Industries
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {project.industries.map((industry, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-400/30"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.capabilities && project.capabilities.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
                    Core Capabilities
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {project.capabilities.map((capability, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-400/30"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Value Propositions */}
            {project.valuePropositions && project.valuePropositions.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" />
                  Value Propositions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {project.valuePropositions.map((value, index) => (
                    <div
                      key={index}
                      className="p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 to-blue-400/10 rounded-lg sm:rounded-xl border border-blue-400/30"
                    >
                      <p className="text-gray-700 font-medium text-sm sm:text-base">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case "saap":
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Pricing Model */}
            {project.pricingModel && (
              <div className="bg-white/70 backdrop-blur-sm border border-purple-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2 sm:mr-3" />
                  Pricing Model
                </h3>
                <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-500/10 to-purple-400/10 rounded-xl sm:rounded-2xl border border-purple-400/30">
                  <p className="text-base sm:text-lg font-semibold text-purple-700">{project.pricingModel}</p>
                </div>
              </div>
            )}

            {/* Integrations & API Support */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {project.integrations && project.integrations.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-purple-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3" />
                    Integrations
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {project.integrations.map((integration, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-500/10 rounded-lg border border-purple-400/30"
                      >
                        <Cloud className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{integration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/70 backdrop-blur-sm border border-purple-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3" />
                  API Support
                </h3>
                <div className="p-3 sm:p-4 bg-purple-500/10 rounded-lg sm:rounded-xl border border-purple-400/30">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {project.apiSupport ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base">Full API Support Available</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-400 flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium text-sm sm:text-base">API Support Not Available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "electric vehicles":
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Vehicle Specifications */}
            <div className="bg-white/70 backdrop-blur-sm border border-green-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2 sm:mr-3" />
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {project.batteryCapacity && (
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 text-center">
                    <Battery className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Battery Capacity</p>
                    <p className="font-bold text-green-700 text-sm sm:text-base">{project.batteryCapacity}</p>
                  </div>
                )}
                {project.range && (
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 text-center">
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Range</p>
                    <p className="font-bold text-green-700 text-sm sm:text-base">{project.range}</p>
                  </div>
                )}
                {project.chargingTime && (
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 text-center">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Charging Time</p>
                    <p className="font-bold text-green-700 text-sm sm:text-base">{project.chargingTime}</p>
                  </div>
                )}
                {project.motorType && (
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 text-center">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Motor Type</p>
                    <p className="font-bold text-green-700 text-sm sm:text-base">{project.motorType}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "furnitures":
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Furniture Specifications */}
            <div className="bg-white/70 backdrop-blur-sm border border-orange-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <Sofa className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mr-2 sm:mr-3" />
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {project.dimensions && (
                  <div className="p-3 sm:p-4 bg-orange-500/10 rounded-lg sm:rounded-xl border border-orange-400/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Dimensions</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{project.dimensions}</p>
                  </div>
                )}
                {project.weight && (
                  <div className="p-3 sm:p-4 bg-orange-500/10 rounded-lg sm:rounded-xl border border-orange-400/30">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Weight</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{project.weight}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Materials & Assembly */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {project.material && project.material.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-orange-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 sm:mr-3" />
                    Materials Used
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {project.material.map((mat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-500/10 rounded-lg border border-orange-400/30"
                      >
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base">{mat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white/70 backdrop-blur-sm border border-orange-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 sm:mr-3" />
                  Assembly Information
                </h3>
                <div className="p-3 sm:p-4 bg-orange-500/10 rounded-lg sm:rounded-xl border border-orange-400/30">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {project.assemblyRequired ? (
                      <>
                        <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base">Assembly Required</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base">Pre-assembled</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "garments":
        return (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {project.sizes && project.sizes.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-pink-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 mr-2 sm:mr-3" />
                    Available Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.sizes.map((size, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-pink-500/10 rounded-lg border border-pink-400/30 text-center"
                      >
                        <span className="font-semibold text-pink-700 text-sm sm:text-base">{size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.colors && project.colors.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-pink-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 mr-2 sm:mr-3" />
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.colors.map((color, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-pink-500/10 rounded-lg border border-pink-400/30 text-center"
                      >
                        <span className="font-semibold text-pink-700 text-sm sm:text-base">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fabric & Care */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {project.fabric && project.fabric.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-pink-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <ShirtIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 mr-2 sm:mr-3" />
                    Fabric Composition
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {project.fabric.map((fab, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-pink-500/10 rounded-lg border border-pink-400/30"
                      >
                        <div className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base">{fab}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.careInstructions && project.careInstructions.length > 0 && (
                <div className="bg-white/70 backdrop-blur-sm border border-pink-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 mr-2 sm:mr-3" />
                    Care Instructions
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {project.careInstructions.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-pink-500/10 rounded-lg border border-pink-400/30"
                      >
                        <CheckCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
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
              backgroundSize: "20px 20px sm:30px sm:30px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-base sm:text-lg">Loading product...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !projectDetail) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Project Not Found</h1>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
            <Link
              href="/project"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm sm:text-base"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const categoryConfig = getCategoryConfig(projectDetail.category)
  const IconComponent = categoryConfig.icon

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
            backgroundSize: "15px 15px sm:20px sm:20px lg:30px lg:30px",
          }}
        ></div>
      </div>

      {/* Navigation Header */}
<div className="relative z-10 pt-16 sm:pt-18 lg:pt-20 pb-2 sm:pb-3 lg:pb-4 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center gap-2 text-sm sm:text-base">
      <Link
        href="/project"
        className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Products
      </Link>
      <span className="text-gray-400">/</span>
      <Link
        href={`/category/${projectDetail.category}`}
        className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
      >
        <IconComponent className="w-4 h-4 mr-1" />
        {categoryConfig.name}
      </Link>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="relative z-10 pb-2 sm:pb-6 lg:pb-6 xl:pb-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Single Column Layout for better mobile experience */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className="relative bg-white/80 backdrop-blur-md border border-cyan-200 rounded-xl p-4 sm:p-5 shadow-md">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/40 to-cyan-100/20"></div>

            <div className="relative z-10">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full border border-cyan-200">
                  {categoryConfig.name}
                </span>
                {projectDetail.isFeatured && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-snug">
                {projectDetail.title}
              </h1>
            </div>
          </div>


            {/* Main Image */}
            {projectDetail.poster && (
              <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm border border-cyan-600/50 p-2 sm:p-3 lg:p-4 shadow-xl">
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                  <img
                    src={projectDetail.poster || "/placeholder.svg"}
                    alt={projectDetail.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                  Product Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">{projectDetail.description}</p>
                </div>
              </div>
            </div>

            {/* Technologies Used */}
            {projectDetail.technologies && projectDetail.technologies.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Technologies Used
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {projectDetail.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-500/10 rounded-lg sm:rounded-xl border border-blue-400/30 hover:bg-blue-500/15 transition-colors duration-300 backdrop-blur-sm"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Key Features */}
            {projectDetail.features && projectDetail.features.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {projectDetail.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 hover:bg-green-500/15 transition-colors duration-300 backdrop-blur-sm"
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Category-Specific Content */}
            {renderCategorySpecificContent(projectDetail)}

            {/* Additional Images Gallery */}
            {projectDetail.images && projectDetail.images.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Product Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {projectDetail.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-36 sm:h-48 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden bg-white/50 border border-cyan-600/40 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${projectDetail.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
            {/* Sub Products */}
            {projectDetail.subproducts && projectDetail.subproducts.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl max-w-7xl mx-auto mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3" />
                  Sub Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {projectDetail.subproducts.map((subproduct: any, index: number) => (
                    <div
                      key={index}
                      className="group relative bg-white/70 backdrop-blur-sm border border-blue-300/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-400/70 transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                      {/* Glass Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-blue-50/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/8 via-transparent to-blue-300/5"></div>

                      {/* Image Section */}
                      {subproduct.image && (
                        <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                          <img
                            src={subproduct.image || "/placeholder.svg"}
                            alt={subproduct.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="relative z-10 p-4 sm:p-5">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                          {subproduct.title}
                        </h4>
                        
                        <div className="h-16 sm:h-20 overflow-y-auto pr-2" style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#67e8f9 #f3f4f6'
                          }}>
                        <p className= "text-sm sm:text-base text-gray-600 leading-relaxed">
                          {subproduct.description}
                        </p>
                        </div>

                        {/* CTA Button */}
                        {subproduct.learnMoreLink && (
                          <a
                            href={subproduct.learnMoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full text-cyan-600 hover:text-cyan-700 font-semibold text-sm sm:text-base underline hover:underline transition-colors duration-200"
                          >
                            To Know More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

      {/* CTA Section */}
      <section className="relative z-10 py-4 sm:py-6 lg:py-6 xl:py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">
                <span className="block">Inspired by This</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Product?
                </span>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Let's discuss how we can create something similar or even better for your specific needs. Our team is
                ready to bring your vision to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
                <Link
                  href="/contact"
                  className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center"
                >
                  Start Your Product
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href={`/category/${projectDetail.category}`}
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <span className="hidden sm:inline">Explore More {categoryConfig.name}</span>
                  <span className="sm:hidden">More {categoryConfig.name}</span>
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-2 border-cyan-400/40 rounded-lg sm:rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
            <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-cyan-400/30 to-cyan-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
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

        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          .prose p {
            font-size: 14px;
            line-height: 1.6;
          }
        }

        /* Smooth scrolling for mobile */
        @media (max-width: 768px) {
          html {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Better touch targets for mobile */
        @media (max-width: 640px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </main>
  )
}

export default ProjectDetailPage