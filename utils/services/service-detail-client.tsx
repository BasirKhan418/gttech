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

  if (isLoading) return <ServiceDetailSkeleton />
  if (error || !service) {
    const errMsg = data?.error || "Failed to load service"
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Service not found</h1>
            <p className="text-gray-600 mb-6">{errMsg}</p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const chips = [
    { label: service.designType, icon: <Layers3 className="h-4 w-4" />, tone: "primary" as const },
    { label: service.sectionName, icon: <Tag className="h-4 w-4" />, tone: "neutral" as const },
    ...(service.isFeatured
      ? [{ label: "Featured", icon: <BadgeCheck className="h-4 w-4" />, tone: "success" as const }]
      : []),
  ]

  const authorName = typeof service.author === "string" ? undefined : service.author?.name
  const lastEditedBy = typeof service.lastEditedAuthor === "object" ? service.lastEditedAuthor?.name : undefined
  const iconIsUrl =
    typeof service.icon === "string" &&
    (service.icon.startsWith("http://") || service.icon.startsWith("https://") || service.icon.startsWith("/"))

  const knownKeys = new Set([
    "_id",
    "slug",
    "sectionName",
    "title",
    "tagline",
    "description",
    "poster",
    "images",
    "lists",
    "designType",
    "icon",
    "isActive",
    "isFeatured",
    "lastEditedAuthor",
    "author",
    "industries",
    "subServices",
    "benefits",
    "pricingModel",
    "duration",
    "teamSize",
    "metaTitle",
    "metaDescription",
    "keywords",
    "createdAt",
    "updatedAt",
    "__v",
  ])
  const additionalEntries = Object.entries(service as unknown as Record<string, unknown>).filter(
    ([k, _v]) => !knownKeys.has(k),
  )

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-cyan-700 hover:text-cyan-800">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Services</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {chips.map((c, i) => (
            <Chip key={i} tone={c.tone} icon={c.icon} label={c.label} />
          ))}
        </div>

        {/* Optional icon preview next to title when icon is a URL */}
        <h1 className="text-pretty text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
          {iconIsUrl ? (
            <img
              src={service.icon || "/placeholder.svg"}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 rounded bg-gray-100 ring-1 ring-gray-200 object-cover"
            />
          ) : null}
          {service.title}
        </h1>

        {service.tagline ? <p className="mt-3 text-gray-600 text-pretty">{service.tagline}</p> : null}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {service.createdAt && (
            <div className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-700" />
              <span>Published {new Date(service.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          {authorName && (
            <div className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-700" />
              <span>{authorName}</span>
            </div>
          )}
          {/* Show last edited by if present */}
          {lastEditedBy && (
            <div className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-700" />
              <span>Last edited by {lastEditedBy}</span>
            </div>
          )}
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-700" />
            <span>~5 min read</span>
          </div>
        </div>
      </section>

      {/* Poster */}
      {service.poster ? (
        <section className="mx-auto max-w-6xl px-4">
          <div className="overflow-hidden rounded-2xl border border-cyan-100">
            <img
              src={service.poster || "/placeholder.svg?height=420&width=1200&query=service%20poster"}
              alt={service.title}
              className="h-[340px] w-full object-cover md:h-[420px]"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </section>
      ) : null}

      {/* Content grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-4 ">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader icon={<ListTree className="h-5 w-5 text-cyan-700" />} title="Description" />
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </Card>

            {/* Sub Services */}
            {service.subServices && service.subServices.length > 0 ? (
              <Card>
                <CardHeader icon={<Grid3X3 className="h-5 w-5 text-cyan-700" />} title="Sub Services" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {service.subServices.map((subService, idx) => (
                    <div key={idx} className="rounded-lg  border-cyan-100 shadow-md bg-white p-4">
                      <div className="mb-3">
                        <img
                          src={subService.image || "/placeholder.svg?height=120&width=200&query=sub%20service"}
                          alt={subService.title}
                          className="h-24 w-full rounded-md object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{subService.title}</h4>
                      <p className="text-sm text-gray-600">{subService.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 ? (
              <Card>
                <CardHeader icon={<BadgeCheck className="h-5 w-5 text-cyan-700" />} title="Benefits" />
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="rounded-lg  bg-white p-3 text-gray-800">
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {/* Gallery */}
            {service.images && service.images.length > 0 ? (
              <Card>
                <CardHeader icon={<ImageIcon className="h-5 w-5 text-cyan-700" />} title="Gallery" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {service.images.map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={src || "/placeholder.svg?height=176&width=320&query=service%20image"}
                        alt={`${service.title} image ${i + 1}`}
                        className="h-36 w-full object-cover md:h-44"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {(service.metaTitle || service.metaDescription) && (
              <Card>
                <CardHeader icon={<Tag className="h-5 w-5 text-cyan-700" />} title="SEO & Metadata" />
                {service.metaTitle && (
                  <div className="mb-2">
                    <div className="text-sm font-semibold text-gray-900">Meta Title</div>
                    <div className="text-gray-700">{service.metaTitle}</div>
                  </div>
                )}
                {service.metaDescription && (
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Meta Description</div>
                    <p className="text-gray-700">{service.metaDescription}</p>
                  </div>
                )}
              </Card>
            )}

           
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 ">
            {/* Actions */}
            <div className="sticky top-6 mt-2">
              <div className="rounded-2xl border border-cyan-200 bg-white p-2">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Get Started</h3>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-white hover:bg-cyan-700 transition-colors"
                  >
                    Schedule Consultation
                  </Link>
                  <button
                    onClick={handleShare}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-200 px-4 py-2.5 text-cyan-700 hover:bg-cyan-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <Link
                    href="/services"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    View all services
                  </Link>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className=" bg-gray-50 shadow">
        <div className="mx-auto max-w-6xl px-4 py-10 mt-6 mb-0.5">
          <div className="rounded-2xl border border-cyan-200 bg-white p-6 md:p-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-balance text-2xl font-bold text-gray-900">Ready to discuss your project?</h2>
                <p className="mt-1 text-gray-600">
                  Talk with our experts to see how this service can help your business.
                </p>
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                <Link
                  href="/contact"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-white hover:bg-cyan-700 transition-colors md:flex-none"
                >
                  Schedule Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-cyan-200 bg-white px-4 py-2.5 text-cyan-700 hover:bg-cyan-50 transition-colors md:flex-none"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white p-5">{children}</div>
}

function CardHeader({ icon, title }: { icon?: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  )
}

function DetailRow({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string
  value?: string | number | null
  icon?: React.ReactNode
  valueClass?: string
}) {
  if (value === undefined || value === null || value === "") return null
  return (
    <div className="mb-2 flex items-start justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span>{label}:</span>
      </div>
      <span className={`font-medium text-gray-900 ${valueClass || ""}`}>{value}</span>
    </div>
  )
}

function Chip({
  label,
  tone,
  icon,
}: {
  label?: string
  tone: "primary" | "neutral" | "success"
  icon?: React.ReactNode
}) {
  if (!label) return null
  const tones = {
    primary: "bg-cyan-50 text-cyan-800 border-cyan-200",
    neutral: "bg-gray-50 text-gray-800 border-gray-200",
    success: "bg-green-50 text-green-800 border-green-200",
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${tones[tone]}`}>
      {icon}
      {label}
    </span>
  )
}

function ChipGroup({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-semibold text-gray-900">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span key={i} className="rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-xs text-cyan-800">
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}