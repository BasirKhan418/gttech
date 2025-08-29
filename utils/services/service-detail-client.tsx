"use client"

import type React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import useSWR from "swr"
import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle,
  Share2,
  ImageIcon,
  Layers3,
  Tag,
  BadgeCheck,
  ListTree,
  DollarSign,
  Timer,
  Users,
  Grid3X3,
  Lightbulb,
  Star,
  ArrowRight,
} from "lucide-react"
import ServiceDetailSkeleton from "./service-detail-skeleton"

type Author = { _id?: string; name?: string; email?: string }

type SubService = {
  title: string
  desc: string
  image: string
}

type Service = {
  _id: string
  slug: string
  sectionName: string
  title: string
  tagline: string
  description: string
  poster: string
  images?: string[]
  lists?: string[]
  designType: string
  icon: string
  isActive?: boolean
  isFeatured?: boolean
  lastEditedAuthor?: Author
  author?: Author | string
  industries?: string[]
  subServices?: SubService[]
  benefits?: string[]
  pricingModel?: string
  duration?: string
  teamSize?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  createdAt?: string
  updatedAt?: string
  __v?: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const { data, error, isLoading } = useSWR<{ success: boolean; data?: Service; error?: string }>(
    `/api/services/one?slug=${encodeURIComponent(slug)}`,
    fetcher,
    { revalidateOnFocus: false },
  )

  const service = useMemo(() => (data?.success ? (data?.data ?? null) : null), [data])

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (navigator?.share && service) {
      try {
        await navigator.share({
          title: service.title,
          text: service.tagline || service.description?.slice(0, 120),
          url,
        })
      } catch {
        // ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        alert("Link copied to clipboard")
      } catch {
        // ignore
      }
    }
  }

  if (isLoading) {
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
            <p className="text-gray-700 text-base sm:text-lg">Loading service...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !service) {
    const errMsg = data?.error || "Failed to load service"
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Service Not Found</h1>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{errMsg}</p>
            <Link
              href="/services"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm sm:text-base"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const authorName = typeof service.author === "string" ? undefined : service.author?.name
  const lastEditedBy = typeof service.lastEditedAuthor === "object" ? service.lastEditedAuthor?.name : undefined
  const iconIsUrl =
    typeof service.icon === "string" &&
    (service.icon.startsWith("http://") || service.icon.startsWith("https://") || service.icon.startsWith("/"))

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
              href={`/services#${service.sectionName}`}
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <Tag className="w-4 h-4 mr-1" />
              {service.sectionName}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-2 sm:pb-6 lg:pb-6 xl:pb-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className="relative bg-white/80 backdrop-blur-md border border-cyan-200 rounded-xl p-4 sm:p-5 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/40 to-cyan-100/20"></div>

              <div className="relative z-10">
                {/* Tags */}
                {service.isFeatured && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
                      Featured
                    </span>
                  </div>
                )}

                {/* Title with optional icon */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-snug flex items-center gap-3">
                  {iconIsUrl && (
                    <img
                      src={service.icon || "/placeholder.svg"}
                      alt=""
                      aria-hidden="true"
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-gray-100 ring-1 ring-gray-200 object-cover"
                    />
                  )}
                  {service.title}
                </h1>

                {/* Tagline */}
                {service.tagline && (
                  <p className="mt-3 text-gray-600 text-pretty text-sm sm:text-base lg:text-lg">{service.tagline}</p>
                )}
              </div>
            </div>

            {/* Main Image */}
            {service.poster && (
              <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm border border-cyan-600/50 p-2 sm:p-3 lg:p-4 shadow-xl">
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                  <img
                    src={service.poster || "/placeholder.svg?height=420&width=1200&query=service%20poster"}
                    alt={service.title}
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
                  Service Overview
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Sub Services */}
            {service.subServices && service.subServices.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                    <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Sub Services
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {service.subServices.map((subService, idx) => (
                      <div key={idx} className="group relative bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-200/60 hover:border-cyan-400/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                        {/* Image container */}
                        <div className="relative h-48 sm:h-52 overflow-hidden">
                          <img
                            src={subService.image || "/placeholder.svg?height=200&width=320&query=sub%20service"}
                            alt={subService.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-60"></div>
                          
                          {/* Overlay content on hover */}
                          <div className="absolute inset-0 bg-cyan-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="text-center text-white p-4">
                              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <ArrowRight className="w-6 h-6" />
                              </div>
                              <span className="text-sm font-semibold">Explore Service</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                            {subService.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                            {subService.desc}
                          </p>
                        </div>
                        
                        {/* Decorative corner */}
                        <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Key Benefits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {service.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-green-500/10 rounded-lg sm:rounded-xl border border-green-400/30 hover:bg-green-500/15 transition-colors duration-300 backdrop-blur-sm">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {service.images && service.images.length > 0 && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    Service Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {service.images.map((src, i) => (
                      <div key={i} className="relative h-36 sm:h-48 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden bg-white/50 border border-cyan-600/40 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl">
                        <img
                          src={src || "/placeholder.svg?height=176&width=320&query=service%20image"}
                          alt={`${service.title} image ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEO & Metadata */}
            {(service.metaTitle || service.metaDescription) && (
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

                <div className="relative z-10">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mr-2 sm:mr-3" />
                    SEO & Metadata
                  </h2>
                  {service.metaTitle && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-900 mb-2">Meta Title</div>
                      <div className="text-gray-700 p-3 bg-white/50 rounded-lg border border-cyan-200">{service.metaTitle}</div>
                    </div>
                  )}
                  {service.metaDescription && (
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">Meta Description</div>
                      <p className="text-gray-700 p-3 bg-white/50 rounded-lg border border-cyan-200">{service.metaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative z-10 py-4 sm:py-6 lg:py-6 xl:py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">
                <span className="block">Ready to Discuss</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Your Project?
                </span>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Talk with our experts to see how this service can help your business achieve its goals and drive growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4 sm:px-0">
                <Link
                  href="/contact"
                  className="group px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25 flex items-center justify-center"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/services"
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-sm sm:text-base lg:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  Explore Services
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