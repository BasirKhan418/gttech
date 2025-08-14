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

const AboutPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(teamMembers)

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

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMembers(teamMembers)
    } else {
      setFilteredMembers(teamMembers.filter(member => member.category === selectedCategory))
    }
  }, [selectedCategory])

  const achievements = [
    { icon: Award, number: "50+", label: "Successful Projects", description: "Delivered across multiple industries" },
    { icon: Users, number: "100+", label: "Expert Team", description: "Skilled professionals and engineers" },
    { icon: Globe, number: "15+", label: "Industry Partners", description: "Strategic technology partnerships" },
    { icon: TrendingUp, number: "99%", label: "Client Satisfaction", description: "Proven track record of excellence" }
  ]

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation Excellence",
      description: "Pushing boundaries with cutting-edge technology solutions and creative problem-solving approaches.",
      gradient: "from-sky-400 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Quality Assurance", 
      description: "Maintaining the highest standards in every project with rigorous testing and validation processes.",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      icon: Users,
      title: "Collaborative Partnership",
      description: "Building lasting relationships through transparent communication and shared success goals.",
      gradient: "from-blue-400 to-sky-500"
    },
    {
      icon: Target,
      title: "Results-Driven Focus",
      description: "Delivering measurable outcomes that drive business growth and operational efficiency.",
      gradient: "from-sky-500 to-cyan-400"
    }
  ]

  const expertise = [
    "Digital Product Design & Development",
    "Industry 4.0 Smart Manufacturing Solutions",
    "AI/ML Implementation & Optimization",
    "Robotics & Process Automation",
    "AR/VR Applications & Digital Twins",
    "IoT Integration & Analytics",
    "Electric Vehicle Development",
    "Agricultural Technology Innovation"
  ]

  const partnerships = [
    { name: "Dassault Systèmes", logo: "/partners/dassault.png", type: "Technology Partner" },
    { name: "AWS", logo: "/partners/aws.png", type: "Cloud Solutions" },
    { name: "Ashok Leyland", logo: "/partners/ashok.png", type: "Industry Partner" },
    { name: "Hyundai", logo: "/partners/hyundai.png", type: "Automotive Partner" },
    { name: "HCL", logo: "/partners/hcl.png", type: "Technology Partner" },
    { name: "Centurion University", logo: "/partners/centurion.png", type: "Incubation Partner" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
    
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 2 === 0 ? 'bg-sky-400/40' : 'bg-white/20'
            }`}
            style={{
              left: `${5 + (i * 4.5)}%`,
              top: `${10 + (i * 4)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
                <Building className="w-4 h-4 mr-2" />
                <span className="font-medium">About GT Technologies</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Transforming Industries with</span>
                <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  Digital Innovation
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Pioneering the future of technology through cutting-edge solutions, strategic partnerships, 
                and a relentless commitment to excellence in digital transformation.
              </p>
            </div>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
            {achievements.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-6 hover:border-sky-400/40 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-6 h-6 text-sky-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-sky-300 font-semibold mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-400">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Content */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-4 py-2 bg-cyan-500/15 backdrop-blur-sm border border-cyan-400/30 rounded-full text-sm text-cyan-200 mb-6">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="font-medium">Our Foundation</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="block">Incubated by Excellence,</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  Driven by Innovation
                </span>
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">GramTarang Technologies Pvt Ltd</strong> is a forward-thinking company 
                  incubated by <strong className="text-sky-300">Centurion University</strong>, representing the pinnacle 
                  of academic excellence merged with industry innovation.
                </p>
                
                <p>
                  We specialize in cutting-edge technology platforms and provide comprehensive <strong className="text-cyan-300">Industry 4.0 solutions</strong> 
                  to heavy industries, encompassing digital manufacturing, automation, intricate automotive component design, 
                  and on-demand customized digital products.
                </p>
                
                <p>
                  Our expertise spans <strong className="text-sky-300">niche engineering solutions</strong> including product design, 
                  modeling, prototyping, visualization, optimization, simulation, and digital project management systems.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/services"
                  className="group px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-sky-500/25"
                >
                  Explore Our Solutions
                  <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-transparent border-2 border-sky-400/50 text-white rounded-xl font-semibold hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300"
                >
                  Partner With Us
                </Link>
              </div>
            </div>

            {/* Visual Element */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
                  
                  {/* Innovation Timeline */}
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Innovation Journey</h3>
                    
                    {[
                      { year: "2020", milestone: "Company Incubation", desc: "Founded under Centurion University" },
                      { year: "2021", milestone: "Industry Partnerships", desc: "Strategic alliances with tech leaders" },
                      { year: "2022", milestone: "Digital Transformation", desc: "Advanced automation solutions" },
                      { year: "2023", milestone: "Global Expansion", desc: "International project delivery" },
                      { year: "2024", milestone: "Innovation Leadership", desc: "Pioneering Industry 4.0 solutions" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-sky-400/30">
                          <span className="text-sky-300 font-bold text-sm">{item.year}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{item.milestone}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10">
            <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
              <Target className="w-4 h-4 mr-2" />
              <span className="font-medium">Our Core Values</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="block">Principles That</span>
              <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                Drive Us Forward
              </span>
            </h2>
            
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our commitment to excellence is built on fundamental values that guide every decision, 
              project, and partnership we undertake.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-6 hover:border-sky-400/40 transition-all duration-300 hover:scale-105 group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Expertise List */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-4 py-2 bg-cyan-500/15 backdrop-blur-sm border border-cyan-400/30 rounded-full text-sm text-cyan-200 mb-6">
                <Settings className="w-4 h-4 mr-2" />
                <span className="font-medium">Technical Expertise</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="block">Comprehensive</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  Solution Portfolio
                </span>
              </h2>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our multi-disciplinary expertise spans across emerging technologies, enabling us to deliver 
                end-to-end solutions that address complex industry challenges.
              </p>

              <div className="space-y-3">
                {expertise.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 group animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 text-sky-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Representation */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Technology Stack</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "AI/ML", level: 95, color: "from-sky-400 to-cyan-500" },
                        { name: "IoT", level: 90, color: "from-cyan-400 to-blue-500" },
                        { name: "Automation", level: 98, color: "from-blue-400 to-sky-500" },
                        { name: "AR/VR", level: 85, color: "from-sky-500 to-cyan-400" }
                      ].map((tech, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium text-sm">{tech.name}</span>
                            <span className="text-sky-300 text-xs">{tech.level}%</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2 backdrop-blur-sm">
                            <div 
                              className={`bg-gradient-to-r ${tech.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${tech.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
                        <Layers className="w-4 h-4" />
                        <span>Multi-layered technology integration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partnerships */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10">
            <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
              <Globe className="w-4 h-4 mr-2" />
              <span className="font-medium">Strategic Partnerships</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="block">Powered by</span>
              <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We collaborate with world-class organizations to deliver unparalleled solutions 
              and drive innovation across industries.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partnerships.map((partner, index) => (
              <div key={index} className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-6 hover:border-sky-400/40 transition-all duration-300 hover:scale-105 group text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5 rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                      {/* Placeholder for partner logo */}
                      <div className="w-12 h-8 bg-gradient-to-r from-sky-400/40 to-cyan-400/40 rounded"></div>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{partner.name}</h3>
                    <p className="text-gray-400 text-xs">{partner.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10">
            <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium">Our Team</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="block">Meet the</span>
              <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                Innovation Leaders
              </span>
            </h2>
            
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Our diverse team of experts brings together decades of experience in technology, 
              engineering, and business transformation.
            </p>

            {/* Team Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === filter.key
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25'
                      : 'bg-white/10 text-gray-300 hover:bg-sky-500/20 hover:text-white border border-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => (
              <div key={member.id} className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-6 hover:border-sky-400/40 transition-all duration-300 hover:scale-105 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
                  
                  {/* Hover Effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                  </div>

                  <div className="relative z-10 text-center">
                    {/* Profile Image */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 to-cyan-500/30 rounded-full animate-pulse"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 rounded-full flex items-center justify-center border-2 border-sky-400/30 group-hover:border-sky-400/60 transition-colors duration-300">
                        {/* Placeholder Avatar */}
                        <Users className="w-10 h-10 text-sky-400" />
                        {/* In production, replace with:
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
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-200 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-sky-300 text-sm font-medium mb-4">
                      {member.title}
                    </p>

                    {/* LinkedIn Link */}
                    <Link
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 hover:from-sky-500/40 hover:to-cyan-500/40 rounded-full transition-all duration-300 hover:scale-110 group/link border border-sky-400/30 hover:border-sky-400/60"
                    >
                      <Linkedin className="w-5 h-5 text-sky-400 group-hover/link:text-white transition-colors duration-300" />
                    </Link>

                    {/* Category Badge */}
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.category === 'directors' ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-300 border border-sky-400/30' :
                        member.category === 'management' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30' :
                        member.category === 'technical' ? 'bg-gradient-to-r from-blue-500/20 to-sky-500/20 text-blue-300 border border-blue-400/30' :
                        'bg-gradient-to-r from-sky-500/20 to-sky-600/20 text-sky-300 border border-sky-400/30'
                      }`}>
                        {member.category.charAt(0).toUpperCase() + member.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-3 right-3 w-2 h-2 bg-sky-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping-slow"></div>
                  <div className="absolute bottom-3 left-3 w-1 h-1 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No team members found</h3>
              <p className="text-gray-500">Try selecting a different category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Vision */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-8 lg:p-10 h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-sky-400/30">
                    <Target className="w-8 h-8 text-sky-400" />
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                    Our <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Vision</span>
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-lg">
                    To develop <strong className="text-white">cost-effective, sustainable, and high-impact products</strong> 
                    and accelerators that address complex and urgent societal challenges. We envision a future where 
                    <strong className="text-sky-300"> local engineering talent</strong> combines with 
                    <strong className="text-cyan-300"> state-of-the-art technology platforms</strong> to create 
                    transformative solutions for global industries.
                  </p>

                  <div className="mt-8 flex items-center space-x-3 text-sky-300">
                    <Zap className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Transforming challenges into opportunities</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-8 lg:p-10 h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 via-transparent to-blue-500/5"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-cyan-400/30">
                    <Lightbulb className="w-8 h-8 text-cyan-400" />
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                    Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Mission</span>
                  </h3>
                  
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      We are deeply involved in the growing fields of <strong className="text-cyan-300">manufacturing electric vehicles (EVs)</strong> 
                      in various configurations and researching <strong className="text-blue-300">digital automation-based products</strong> 
                      for the agricultural sector.
                    </p>
                    
                    <p>
                      Our mission is to bridge the gap between cutting-edge technology and practical industry applications, 
                      creating a <strong className="text-white">skilled workforce</strong> that meets evolving industry demands 
                      while driving sustainable innovation.
                    </p>
                  </div>

                  <div className="mt-8 space-y-3">
                    {[
                      "Scientific consulting excellence",
                      "Digital transformation leadership", 
                      "Workforce development programs"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-12 lg:p-16 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-float ${
                      i % 2 === 0 ? 'bg-sky-400/60' : 'bg-white/40'
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  <span className="block">Ready to Transform</span>
                  <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                    Your Business?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Partner with GT Technologies to unlock the full potential of digital innovation 
                  and Industry 4.0 solutions tailored to your unique challenges.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-sky-500/25"
                  >
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="px-8 py-4 bg-transparent border-2 border-sky-400/50 text-white rounded-full font-semibold text-lg hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300"
                  >
                    Explore Solutions
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-16 h-16 border-2 border-sky-400/30 rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
              <div className="absolute bottom-6 left-6 w-10 h-10 bg-gradient-to-br from-sky-400/30 to-cyan-400/30 rounded-full animate-bounce backdrop-blur-sm"></div>
              <div className="absolute top-12 left-12 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage