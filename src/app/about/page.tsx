'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Award, 
  Users, 
  Globe, 
  Target, 
  Lightbulb, 
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Linkedin,
  Building,
  Briefcase,
  TrendingUp,
  Settings,
  Layers,
  Shield
} from 'lucide-react'

// Team Member Interface
interface TeamMember {
  id: number
  name: string
  title: string
  image: string
  linkedinUrl: string
  category: 'directors' | 'management' | 'technical' | 'operations'
}

// Sample team data - this would come from your API/database
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    title: "Chief Executive Officer & Founder",
    image: "/team/ceo.jpg", // Add actual images to public/team/
    linkedinUrl: "https://linkedin.com/in/rajesh-kumar",
    category: "directors"
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "Chief Technology Officer",
    image: "/team/cto.jpg",
    linkedinUrl: "https://linkedin.com/in/priya-sharma",
    category: "directors"
  },
  {
    id: 3,
    name: "Amit Patel",
    title: "Director of Operations",
    image: "/team/operations.jpg",
    linkedinUrl: "https://linkedin.com/in/amit-patel",
    category: "directors"
  },
  {
    id: 4,
    name: "Sneha Gupta",
    title: "Head of Product Design",
    image: "/team/design.jpg",
    linkedinUrl: "https://linkedin.com/in/sneha-gupta",
    category: "management"
  },
  {
    id: 5,
    name: "Vikram Singh",
    title: "Lead Engineer - Automation",
    image: "/team/engineer1.jpg",
    linkedinUrl: "https://linkedin.com/in/vikram-singh",
    category: "technical"
  },
  {
    id: 6,
    name: "Ananya Reddy",
    title: "Project Manager - Digital Solutions",
    image: "/team/pm.jpg",
    linkedinUrl: "https://linkedin.com/in/ananya-reddy",
    category: "operations"
  }
]

type VisionMissionType = "vision" | "mission";

const AboutPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [visionMissionType, setVisionMissionType] = useState<VisionMissionType>("vision");
  const [isLoading, setIsLoading] = useState(false)

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
  }, [])

  // Fixed team filtering with proper loading states
  useEffect(() => {
    setIsLoading(true)
    
    // Add a small delay to show loading state and prevent rapid switching
    const timer = setTimeout(() => {
      if (selectedCategory === 'all') {
        setFilteredMembers([...teamMembers])
      } else {
        const filtered = teamMembers.filter(member => member.category === selectedCategory)
        setFilteredMembers([...filtered])
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedCategory])

  const handleVisionMissionSwitch = () => {
    setVisionMissionType((prev) => (prev === "vision" ? "mission" : "vision"));
  };

  const partners = [
    { name: 'Dassault Systèmes', logo: '/images.png' },
    { name: 'AWS', logo: '/aws.webp' },
    { name: 'Gram Tarang', logo: '/download.jpeg' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      
      {/* Enhanced Background Grid Pattern */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: 10, top: 20, delay: 0, duration: 4 },
          { left: 80, top: 15, delay: 1, duration: 5 },
          { left: 25, top: 70, delay: 2, duration: 3.5 },
          { left: 60, top: 40, delay: 0.5, duration: 4.5 },
          { left: 5, top: 80, delay: 1.5, duration: 3.8 },
          { left: 90, top: 25, delay: 2.2, duration: 4.2 },
          { left: 35, top: 10, delay: 3, duration: 4.8 },
          { left: 70, top: 85, delay: 1.8, duration: 3.2 }
        ].map((particle, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 3 === 0 ? 'bg-cyan-400/50' : i % 3 === 1 ? 'bg-cyan-300/40' : 'bg-cyan-200/30'
            }`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced Side Data Flow Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
                style={{
                  left: `${i * 20}%`,
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
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
                style={{
                  right: `${i * 20}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section with Enhanced Visual Effects */}
      <section className="relative z-10 pt-24 lg:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll opacity-0 translate-y-10 relative">
            
            <div className="relative z-10">
              <div className="mb-6 md:mb-8 relative group">
                <Image
                  src="/logo.png"
                  alt="GramTarang Technologies Logo"
                  width={200}
                  height={80}
                  className="mx-auto mb-4 md:mb-6 relative z-10 transition-transform duration-500 group-hover:scale-105 w-32 h-auto sm:w-40 md:w-48 lg:w-52"
                />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight relative px-4">
                <span className="block hover:scale-105 transition-transform duration-300">About</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  GramTarang Technologies
                </span>
                
                {/* Floating accent elements around title */}
                <div className="absolute -top-2 md:-top-4 -left-2 md:-left-4 w-1 h-1 md:w-2 md:h-2 bg-cyan-400/50 rounded-full animate-pulse hidden lg:block"></div>
                <div className="absolute -bottom-1 md:-bottom-2 -right-3 md:-right-6 w-1 h-1 bg-cyan-500/70 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}></div>
              </h1>
              
              <div className="relative group px-4">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6 md:mb-8 group-hover:text-gray-700 transition-colors duration-300">
                  Future-ready technology company delivering Industry 4.0 solutions for heavy industries
                </p>
                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 w-0 h-px bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-32 transition-all duration-500"> </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 relative group px-4">
                <span className="group-hover:text-gray-600 transition-colors duration-300">Incubated by</span>
                <div className="w-4 h-px sm:w-px sm:h-4 bg-cyan-500/60 group-hover:bg-cyan-500/90 transition-colors duration-300"></div>
                <span className="text-cyan-600 font-semibold group-hover:text-cyan-700 transition-colors duration-300">Centurion University</span>
                <div className="w-4 h-px sm:w-px sm:h-4 bg-cyan-500/60 group-hover:bg-cyan-500/90 transition-colors duration-300"></div>
                <span className="group-hover:text-gray-600 transition-colors duration-300">Est. 2020</span>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section - Updated to Cyan Theme */}
      <section className="relative z-10 py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-6 md:p-8 lg:p-12 overflow-hidden group hover:border-cyan-400/60 transition-all duration-500 shadow-lg shadow-cyan-500/10">
              {/* Enhanced Background Pattern */}
              <div className="absolute inset-0 opacity-6 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Enhanced Floating Corner Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-2 h-2 bg-cyan-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-200/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-6 right-4 w-2 h-2 bg-cyan-400/35 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

              {/* Enhanced Tech Corner Lines */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-400/70 to-transparent"></div>
                <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-cyan-400/70 to-transparent"></div>
                <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-500/70 to-transparent"></div>
                <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-500/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 relative group">
                    <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block">
                      Our Story
                    </span>
                    
                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-24 transition-all duration-500"></div>
                  </h2>
                </div>

                <div className="grid lg:grid-cols-1 gap-8 md:gap-12">
                  <div className="space-y-6">
                    <div className="group">
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative">
                        GramTarang Technologies Pvt. Ltd., incubated by Centurion University, is a future-ready technology 
                        company delivering Industry 4.0 solutions for heavy industries. Our expertise spans digital manufacturing, 
                        industrial automation, precision automotive component design, and the development of on-demand, 
                        customized digital products.
                        
                        {/* Subtle highlight effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -m-2 p-2"></div>
                      </p>
                    </div>
                    
                    <div className="group">
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative">
                        We work in close partnership with leading global names such as Dassault Systèmes, Ashok Leyland, 
                        Hyundai, AWS, HCL, and many more—serving as trusted system integration partners who help implement 
                        complex projects from concept to completion.
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -m-2 p-2"></div>
                      </p>
                    </div>

                    <div className="group">
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative">
                        Alongside technology deployment, we train and build a highly skilled workforce, aligned with current 
                        and future industry needs.
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -m-2 p-2"></div>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Foundation Section - Enhanced Design with Cyan Theme */}
      <section className="relative z-10 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Content */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-md">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="font-semibold">Our Foundation</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Incubated by</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Excellence,
                </span>
                <span className="block">Driven by Innovation</span>
              </h2>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <div className="group p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-cyan-200/60 rounded-2xl hover:border-cyan-400/70 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/15">
                  <p className="text-base md:text-lg">
                    <strong className="text-gray-800">GramTarang Technologies Pvt Ltd</strong> is a forward-thinking company 
                    incubated by <strong className="text-cyan-700">Centurion University</strong>, representing the pinnacle 
                    of academic excellence merged with industry innovation.
                  </p>
                </div>
                
                <div className="group p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-cyan-200/60 rounded-2xl hover:border-cyan-400/70 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/15">
                  <p className="text-base md:text-lg">
                    We specialize in cutting-edge technology platforms and provide comprehensive <strong className="text-cyan-700">Industry 4.0 solutions</strong> 
                    to heavy industries, encompassing digital manufacturing, automation, intricate automotive component design, 
                    and on-demand customized digital products.
                  </p>
                </div>
                
                <div className="group p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-cyan-200/60 rounded-2xl hover:border-cyan-400/70 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/15">
                  <p className="text-base md:text-lg">
                    Our expertise spans <strong className="text-cyan-700">niche engineering solutions</strong> including product design, 
                    modeling, prototyping, visualization, optimization, simulation, and digital project management systems.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/services/solution"
                  className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30 text-center"
                >
                  Explore Our Solutions
                  <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-xl font-semibold hover:bg-cyan-50/80 hover:border-cyan-500/80 transition-all duration-300 text-center shadow-md"
                >
                  Partner With Us
                </Link>
              </div>
            </div>

            {/* Enhanced Visual Element */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-6 md:p-8 overflow-hidden hover:border-cyan-400/60 transition-all duration-500 group shadow-lg shadow-cyan-500/10">
                  <div className="absolute inset-0 opacity-6 group-hover:opacity-10 transition-opacity duration-500">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  
                  {/* Innovation Timeline */}
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">Innovation Journey</h3>
                    
                    {[
                      { year: "1", milestone: "Company Incubation", desc: "Founded under Centurion University", icon: Building },
                      { year: "2", milestone: "Industry Partnerships", desc: "Strategic alliances with tech leaders", icon: Users },
                      { year: "3", milestone: "Digital Transformation", desc: "Advanced automation solutions", icon: Settings },
                      { year: "4", milestone: "Global Expansion", desc: "International project delivery", icon: Globe },
                      { year: "5", milestone: "Innovation Leadership", desc: "Pioneering Industry 4.0 solutions", icon: Lightbulb }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 group/item">
                        <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500/25 to-cyan-600/25 backdrop-blur-sm border border-cyan-400/40 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 shadow-md">
                          <item.icon className="w-6 h-6 md:w-7 md:h-7 text-cyan-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-cyan-600 font-bold text-sm">{item.year}</span>
                            <div className="h-px bg-gradient-to-r from-cyan-500/60 to-transparent flex-1"></div>
                          </div>
                          <h4 className="text-gray-800 font-semibold text-sm md:text-base mb-1 group-hover/item:text-cyan-700 transition-colors duration-300">{item.milestone}</h4>
                          <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Partners Section - Cyan Theme */}
      <section className="relative z-10 py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-6 md:p-8 lg:p-12 overflow-hidden group hover:border-cyan-400/60 transition-all duration-500 shadow-lg shadow-cyan-500/10">
              {/* Enhanced Background Effects */}
              <div className="absolute inset-0 opacity-6 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-2 h-2 bg-cyan-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-200/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-6 right-4 w-2 h-2 bg-cyan-400/35 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

              <div className="relative z-10">
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                    <span className="block">Our Trusted</span>
                    <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                      Partners
                    </span>
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                    Strategic alliances with industry leaders driving innovation and excellence in technology solutions
                  </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
                  {partners.map((partner, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 backdrop-blur-sm border border-cyan-200/60 rounded-2xl p-6 md:p-8 hover:border-cyan-400/70 hover:bg-white/95 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 min-w-[200px] max-w-[280px] flex-1"
                    >                      
                      <div className="relative z-10 text-center">
                        <div className="h-16 md:h-20 flex items-center justify-center mb-4 md:mb-6">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={120}
                            height={80}
                            className="object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300 group-hover:scale-105 max-w-full h-auto border rounded-2xl"
                          /> 
                        </div>
                        <p className="text-gray-700 text-base md:text-lg font-semibold group-hover:text-cyan-700 transition-colors duration-300">
                          {partner.name}
                        </p>
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Fixed with Better Loading States */}
      <section className="relative z-10 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll opacity-0 translate-y-10">
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-md">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-semibold">Our Team</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              <span className="block">Meet the</span>
              <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                Innovation Leaders
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
              Our diverse team of experts brings together decades of experience in technology, 
              engineering, and business transformation.
            </p>

            {/* Team Filter - Enhanced */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
              {[
                { key: 'all', label: 'All Team' },
                { key: 'directors', label: 'Leadership' },
                { key: 'management', label: 'Management' },
                { key: 'technical', label: 'Technical' },
                { key: 'operations', label: 'Operations' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedCategory(filter.key)}
                  disabled={isLoading}
                  className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50 ${
                    selectedCategory === filter.key
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/80 text-gray-600 hover:bg-cyan-50/80 hover:text-cyan-700 border border-cyan-200/50 hover:border-cyan-300/70 shadow-md'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2 text-cyan-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                <span className="text-sm font-medium">Loading team members...</span>
              </div>
            </div>
          )}

          {/* Team Grid */}
          {!isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredMembers.map((member, index) => (
                <div key={`${member.id}-${selectedCategory}`} className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="glass-card bg-white/80 backdrop-blur-xl border border-cyan-200/60 rounded-3xl p-4 md:p-6 hover:border-cyan-400/70 transition-all duration-300 hover:scale-105 group overflow-hidden shadow-lg hover:shadow-cyan-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                    
                    {/* Hover Effects */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                    </div>

                    <div className="relative z-10 text-center">
                      {/* Profile Image */}
                      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 to-cyan-600/25 rounded-2xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl flex items-center justify-center border-2 border-cyan-400/40 group-hover:border-cyan-400/70 transition-all duration-300 overflow-hidden shadow-md">
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100/30 to-cyan-200/30">
                            <Users className="w-12 h-12 md:w-16 md:h-16 text-cyan-600 mb-2" />
                            <div className="text-xs text-cyan-600/70 font-medium">Photo</div>
                         </div>
                         {/** 
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover rounded-full"
                          />
                          */}
                          
                        </div>
                      </div>

                      {/* Member Info */}
                      <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 group-hover:text-cyan-700 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-cyan-600 text-sm font-medium mb-4 leading-tight">
                        {member.title}
                      </p>

                      {/* LinkedIn Link */}
                      <Link
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500/25 to-cyan-600/25 hover:from-cyan-500/50 hover:to-cyan-600/50 rounded-full transition-all duration-300 hover:scale-110 group/link border border-cyan-400/40 hover:border-cyan-400/70 shadow-md"
                      >
                        <Linkedin className="w-5 h-5 text-cyan-600 group-hover/link:text-cyan-700 transition-colors duration-300" />
                      </Link>

                      {/* Category Badge */}
                      <div className="mt-3">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                          member.category === 'directors' ? 'bg-gradient-to-r from-cyan-500/25 to-cyan-600/25 text-cyan-700 border border-cyan-400/40' :
                          member.category === 'management' ? 'bg-gradient-to-r from-cyan-400/25 to-cyan-500/25 text-cyan-700 border border-cyan-400/40' :
                          member.category === 'technical' ? 'bg-gradient-to-r from-cyan-600/25 to-cyan-700/25 text-cyan-700 border border-cyan-500/40' :
                          'bg-gradient-to-r from-cyan-300/25 to-cyan-400/25 text-cyan-700 border border-cyan-400/40'
                        }`}>
                          {member.category.charAt(0).toUpperCase() + member.category.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping-slow"></div>
                    <div className="absolute bottom-3 left-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm border border-cyan-200/60 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No team members found</h3>
                <p className="text-gray-500">Try selecting a different category filter.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vision & Mission Section - Cyan Theme */}
      <section className="relative z-10 py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Vision & Mission Header */}
          <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-md">
              <Target className="w-4 h-4 mr-2" />
              <span className="font-semibold">Our Core Values</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              <span className="block">Driving Innovation with</span>
              <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                Purpose & Vision
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Our mission and vision shape every decision, project, and partnership we undertake, 
              guiding us toward a future of sustainable innovation.
            </p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            
            {/* Vision Card */}
            <div className="relative group transition-all duration-700 hover:scale-105">
              <div className="glass-card relative backdrop-blur-xl overflow-hidden transition-all duration-500 border border-cyan-400/50 hover:border-cyan-500/70 shadow-lg shadow-cyan-500/15 bg-gradient-to-br from-white/80 via-cyan-50/60 to-white/70 rounded-3xl">
                
                {/* Multiple Glass Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.4] via-white/[0.2] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/[0.08] via-transparent to-cyan-300/[0.05]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.3] to-transparent"></div>
                
                {/* Header */}
                <div className="p-6 md:p-8 pb-4 md:pb-6 relative z-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 group-hover:text-cyan-700 transition-colors duration-300">
                    Our Vision
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 md:p-3 rounded-xl bg-cyan-500/25 border border-cyan-400/50 backdrop-blur-sm shadow-md">
                      <Target className="w-6 h-6 md:w-8 md:h-8 text-cyan-600" />
                    </div>
                    <span className="text-gray-600 text-sm md:text-base">
                      Future-focused aspirations
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6">
                    To develop cost-effective, sustainable, and high-impact products 
                    and accelerators that address complex and urgent societal challenges.
                  </p>
                </div>

                {/* Content */}
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <h4 className="text-gray-800 font-semibold mb-4 flex items-center text-sm md:text-base">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                    What drives us:
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      "Local engineering talent development",
                      "State-of-the-art technology platforms",
                      "Transformative global solutions",
                      "Sustainable innovation approach"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 group/item">
                        <div className="glass-check flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 backdrop-blur-sm bg-cyan-500/25 border border-cyan-400/60 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-cyan-600" />
                        </div>
                        <span className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-200 text-sm md:text-base">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center space-x-3 text-cyan-700 bg-cyan-500/15 rounded-lg p-3 md:p-4 border border-cyan-400/30 shadow-sm">
                    <Zap className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm md:text-base font-medium">Transforming challenges into opportunities</span>
                  </div>
                </div>

                {/* Decorative Glass Elements */}
                <div className="absolute bottom-4 right-4 opacity-40">
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full backdrop-blur-sm border bg-cyan-400/50 border-cyan-500/70 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Corner Glass Highlights */}
                <div className="absolute top-3 left-3 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-cyan-300/40 rounded-tl-2xl"></div>
                <div className="absolute bottom-3 right-3 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-cyan-300/40 rounded-br-2xl"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="relative group transition-all duration-700 hover:scale-105 lg:mt-8">
              <div className="glass-card relative backdrop-blur-xl overflow-hidden transition-all duration-500 border border-cyan-500/50 hover:border-cyan-600/70 shadow-lg shadow-cyan-500/15 bg-gradient-to-br from-white/80 via-cyan-50/60 to-white/70 rounded-3xl">
                
                {/* Multiple Glass Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.4] via-white/[0.2] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-600/[0.08] via-transparent to-cyan-400/[0.05]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.3] to-transparent"></div>
                
                {/* Header */}
                <div className="p-6 md:p-8 pb-4 md:pb-6 relative z-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 group-hover:text-cyan-700 transition-colors duration-300">
                    Our Mission
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 md:p-3 rounded-xl bg-cyan-600/25 border border-cyan-500/50 backdrop-blur-sm shadow-md">
                      <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-cyan-700" />
                    </div>
                    <span className="text-gray-600 text-sm md:text-base">
                      Present-day commitment
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6">
                    We bridge the gap between cutting-edge technology and practical 
                    industry applications, creating skilled workforce and driving innovation.
                  </p>
                </div>

                {/* Content */}
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <h4 className="text-gray-800 font-semibold mb-4 flex items-center text-sm md:text-base">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mr-3"></span>
                    What we deliver:
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      "Electric vehicle manufacturing solutions",
                      "Digital automation for agriculture",
                      "Scientific consulting excellence",
                      "Digital transformation leadership",
                      "Workforce development programs",
                      "Technology partnership guidance"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 group/item">
                        <div className="glass-check flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 backdrop-blur-sm bg-cyan-600/25 border border-cyan-500/60 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-cyan-700" />
                        </div>
                        <span className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-200 text-sm md:text-base">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative Glass Elements */}
                <div className="absolute bottom-4 right-4 opacity-40">
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full backdrop-blur-sm border bg-cyan-500/50 border-cyan-600/70 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Corner Glass Highlights */}
                <div className="absolute top-3 left-3 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-cyan-300/40 rounded-tl-2xl"></div>
                <div className="absolute bottom-3 right-3 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-cyan-300/40 rounded-br-2xl"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Cyan Theme */}
      <section className="relative z-10 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden group hover:border-cyan-400/60 transition-all duration-500 shadow-lg shadow-cyan-500/10">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-6">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              
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
                  <span className="block">Ready to Transform</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    Your Business?
                  </span>
                </h2>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                  Partner with GT Technologies to unlock the full potential of digital innovation 
                  and Industry 4.0 solutions tailored to your unique challenges.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-base md:text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
                  >
                    Start Your Project
                    <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services/solution"
                    className="px-6 md:px-8 py-3 md:py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-base md:text-lg hover:bg-cyan-50/80 hover:border-cyan-500/80 transition-all duration-300 shadow-md"
                  >
                    Explore Solutions
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 w-12 md:w-16 h-12 md:h-16 border-2 border-cyan-400/30 rounded-xl rotate-45 animate-pulse backdrop-blur-sm group-hover:border-cyan-400/50 transition-colors duration-500"></div>
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-8 md:w-10 h-8 md:h-10 bg-cyan-400/30 rounded-full animate-bounce backdrop-blur-sm group-hover:bg-cyan-400/40 transition-colors duration-500"></div>
              <div className="absolute top-8 md:top-12 left-8 md:left-12 w-2 md:w-3 h-2 md:h-3 bg-cyan-400/50 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .glass-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 
            0 8px 32px rgba(6, 182, 212, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 0 0 1px rgba(6, 182, 212, 0.1);
        }

        .glass-container {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            0 4px 16px rgba(6, 182, 212, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  )
}

export default AboutPage