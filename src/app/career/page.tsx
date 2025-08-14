'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  Briefcase,
  CheckCircle,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Star,
  Award,
  Globe,
  Home,
  Laptop
} from 'lucide-react'

interface JobPosting {
  _id: string
  role: string
  experience: string
  requirements: string[]
  description: string
  location: string
  mode: 'remote' | 'offline' | 'hybrid'
  applyUrl: string
  salary?: string
  department?: string
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship'
  skills?: string[]
  benefits?: string[]
  isActive: boolean
  applicationDeadline?: string
  isExpired?: boolean
  createdAt: string
  updatedAt: string
}

const CareerPage = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMode, setSelectedMode] = useState<string>('all')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')

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
  }, [jobPostings])

  useEffect(() => {
    fetchJobPostings()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobPostings, searchTerm, selectedMode, selectedDepartment])

  const fetchJobPostings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/career')
      const data = await response.json()

      if (data.success) {
        const activeJobs = data.data.filter((job: JobPosting) => job.isActive)
        setJobPostings(activeJobs)
        setFilteredJobs(activeJobs)
      } else {
        setError(data.message || 'Failed to fetch job postings')
      }
    } catch (error) {
      setError('Failed to fetch job postings')
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobPostings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Mode filter
    if (selectedMode !== 'all') {
      filtered = filtered.filter(job => job.mode === selectedMode)
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(job => job.department === selectedDepartment)
    }

    setFilteredJobs(filtered)
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'remote':
        return <Globe className="w-4 h-4" />
      case 'offline':
        return <Home className="w-4 h-4" />
      case 'hybrid':
        return <Laptop className="w-4 h-4" />
      default:
        return <Briefcase className="w-4 h-4" />
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'remote':
        return 'from-green-500/25 to-emerald-500/20 border-green-400/40 text-green-700'
      case 'offline':
        return 'from-blue-500/25 to-blue-500/20 border-blue-400/40 text-blue-700'
      case 'hybrid':
        return 'from-purple-500/25 to-purple-500/20 border-purple-400/40 text-purple-700'
      default:
        return 'from-gray-500/25 to-gray-500/20 border-gray-400/40 text-gray-700'
    }
  }

  const getEmploymentTypeColor = (type?: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-500/25 text-blue-700 border-blue-400/40'
      case 'part-time':
        return 'bg-yellow-500/25 text-yellow-700 border-yellow-400/40'
      case 'contract':
        return 'bg-orange-500/25 text-orange-700 border-orange-400/40'
      case 'internship':
        return 'bg-green-500/25 text-green-700 border-green-400/40'
      default:
        return 'bg-gray-500/25 text-gray-700 border-gray-400/40'
    }
  }

  const uniqueDepartments = Array.from(new Set(jobPostings.map(job => job.department).filter(Boolean)))

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
            <p className="text-gray-800 text-lg">Loading career opportunities...</p>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Jobs</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchJobPostings}
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

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 3 === 0 ? 'bg-cyan-400/60' : i % 3 === 1 ? 'bg-cyan-300/50' : 'bg-cyan-200/40'
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
      <div className="absolute left-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
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

      <div className="absolute right-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
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
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="font-medium">Join Our Team</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Shape the Future of</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Technology
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Join our innovative team and be part of transforming businesses through 
                cutting-edge technology solutions and Industry 4.0 excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="bg-white/80 backdrop-blur-sm border border-cyan-600/50 rounded-3xl p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-cyan-600/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                  />
                </div>

                {/* Mode Filter */}
                <div className="relative">
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="appearance-none bg-white/80 backdrop-blur-sm border border-cyan-600/60 rounded-xl text-gray-800 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                  >
                    <option value="all">All Modes</option>
                    <option value="remote">Remote</option>
                    <option value="offline">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Department Filter */}
                {uniqueDepartments.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="appearance-none bg-white/80 backdrop-blur-sm border border-cyan-600/60 rounded-xl text-gray-800 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                    >
                      <option value="all">All Departments</option>
                      {uniqueDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-on-scroll opacity-0 translate-y-10">
                <div className="relative bg-white/80 backdrop-blur-sm border border-cyan-600/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-400/5"></div>
                  
                  <div className="relative z-10">
                    <Briefcase className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {jobPostings.length === 0 ? 'No Open Positions' : 'No Matching Positions'}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {jobPostings.length === 0 
                        ? 'We\'re not currently hiring, but check back soon for new opportunities!'
                        : 'Try adjusting your search filters to find more positions.'
                      }
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105"
                    >
                      Contact Us
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="animate-on-scroll opacity-0 translate-y-10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="group relative bg-white/80 backdrop-blur-sm border border-cyan-600/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02] hover:-translate-y-2">
                    
                    {/* Glass Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 group-hover:from-white/90 group-hover:via-white/70 group-hover:to-white/50 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-400/5 group-hover:from-cyan-500/12 group-hover:to-cyan-400/8 transition-all duration-500"></div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                    </div>

                    {/* Pulsing Border Effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/40 animate-pulse-border"></div>
                    </div>

                    {/* Floating Particles on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-400/70 rounded-full animate-float-particle"
                          style={{
                            left: `${15 + i * 25}%`,
                            top: `${10 + i * 15}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${2 + i * 0.5}s`
                          }}
                        ></div>
                      ))}
                    </div>

                    <div className="relative z-10 p-6 lg:p-8">
                      
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                        <div className="flex-1">
                          
                          {/* Tags Row */}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            {/* Work Mode */}
                            <span className={`px-3 py-1 backdrop-blur-sm border rounded-full text-xs font-medium flex items-center gap-2 bg-gradient-to-r ${getModeColor(job.mode)}`}>
                              {getModeIcon(job.mode)}
                              {job.mode.charAt(0).toUpperCase() + job.mode.slice(1)}
                            </span>

                            {/* Employment Type */}
                            {job.employmentType && (
                              <span className={`px-3 py-1 backdrop-blur-sm border rounded-full text-xs font-medium ${getEmploymentTypeColor(job.employmentType)}`}>
                                {job.employmentType.charAt(0).toUpperCase() + job.employmentType.slice(1)}
                              </span>
                            )}

                            {/* Department */}
                            {job.department && (
                              <span className="px-3 py-1 bg-purple-500/25 text-purple-700 border border-purple-400/40 backdrop-blur-sm rounded-full text-xs font-medium">
                                {job.department}
                              </span>
                            )}

                            {/* Application Deadline */}
                            {job.applicationDeadline && !job.isExpired && (
                              <span className="px-3 py-1 bg-yellow-500/25 text-yellow-700 border border-yellow-400/40 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Job Title and Company Info */}
                          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors duration-300">
                            {job.role}
                          </h3>

                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-cyan-600" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-cyan-600" />
                              <span>{job.experience}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-cyan-600" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-cyan-600" />
                              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex-shrink-0">
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[300%] transition-transform duration-700"></div>
                            <span className="relative z-10">Apply Now</span>
                            <ExternalLink className="w-5 h-5 ml-2 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </a>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                          {job.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-gray-900 font-semibold mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 text-cyan-600 mr-2" />
                            Requirements
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {job.requirements.map((req, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-gray-900 font-semibold mb-3 flex items-center">
                            <Star className="w-5 h-5 text-cyan-600 mr-2" />
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-cyan-500/25 text-cyan-700 border border-cyan-400/40 backdrop-blur-sm rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <h4 className="text-gray-900 font-semibold mb-3 flex items-center">
                            <Award className="w-5 h-5 text-cyan-600 mr-2" />
                            Benefits
                          </h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {job.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-gray-700">
                                <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <div className="absolute bottom-3 right-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    
                    {/* Corner Tech Elements */}
                    <div className="absolute top-3 right-3 w-3 h-3 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping-slow"></div>
                    <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                    
                    {/* Tech Lines */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-400/70 to-transparent"></div>
                      <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-cyan-400/70 to-transparent"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-500/70 to-transparent"></div>
                      <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-500/70 to-transparent"></div>
                    </div>

                    {/* Holographic Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/8 via-transparent to-cyan-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/80 backdrop-blur-sm border border-cyan-600/50 rounded-3xl p-12 overflow-hidden shadow-xl">
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-400/5"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-float ${
                      i % 2 === 0 ? 'bg-cyan-400/60' : 'bg-cyan-300/50'
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  <span className="block">Don't See the Right Fit?</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    Let's Connect
                  </span>
                </h2>
                
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  We're always looking for talented individuals who share our passion for 
                  innovation and technology. Send us your resume and let's explore opportunities.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
                  >
                    Get in Touch
                    <Users className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-8 py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    Learn About Us
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-12 h-12 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-cyan-400/40 to-cyan-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>
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

        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 1; }
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

        @keyframes pulse-border {
          0%, 100% { border-color: rgba(6, 182, 212, 0.4); }
          50% { border-color: rgba(6, 182, 212, 0.8); }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 2s ease-in-out infinite;
        }

        .animate-data-flow {
          animation: data-flow 3s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-on-scroll {
          transition: all 1s ease-out;
        }
      `}</style>
    </main>
  )
}

export default CareerPage