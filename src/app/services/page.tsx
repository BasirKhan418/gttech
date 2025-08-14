'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Zap, 
  Users, 
  Cog, 
  Lightbulb,
  ChevronDown,
  Star,
  CheckCircle,
  Globe,
  Rocket,
  Shield,
  Target
} from 'lucide-react'

const ServicesPage = () => {
  const [activeService, setActiveService] = useState<'solutions' | 'consulting' | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)

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

  const solutionsFeatures = [
    {
      icon: Cog,
      title: "Industry 4.0 Implementation",
      description: "Transform your manufacturing processes with smart automation, IoT integration, and real-time analytics for enhanced productivity and efficiency.",
      technologies: ["Smart Manufacturing", "IoT Sensors", "Predictive Analytics", "Automation Systems"]
    },
    {
      icon: Globe,
      title: "Digital Twin Technology",
      description: "Create virtual replicas of your physical assets using advanced simulation technologies from Dassault Systèmes for optimized performance.",
      technologies: ["3D Simulation", "Real-time Monitoring", "Performance Optimization", "Dassault Systèmes"]
    },
    {
      icon: Lightbulb,
      title: "AR/VR Solutions",
      description: "Immersive training programs, maintenance guidance, and visualization tools that revolutionize how your team works and learns.",
      technologies: ["Augmented Reality", "Virtual Training", "3D Visualization", "Remote Assistance"]
    },
    {
      icon: Rocket,
      title: "Robotics & Automation",
      description: "Intelligent robotic solutions designed for manufacturing excellence, quality control, and operational efficiency.",
      technologies: ["Industrial Robotics", "Process Automation", "Quality Control", "AI Integration"]
    }
  ]

  const consultingFeatures = [
    {
      icon: Target,
      title: "Strategic Digital Transformation",
      description: "Comprehensive roadmap development for your digital journey with industry-specific insights and best practices implementation.",
      approaches: ["Current State Assessment", "Future State Design", "Gap Analysis", "Implementation Strategy"]
    },
    {
      icon: Shield,
      title: "Technology Integration Planning",
      description: "Expert guidance on selecting and integrating the right technology stack for your specific business requirements and goals.",
      approaches: ["Technology Evaluation", "Integration Architecture", "Risk Assessment", "Change Management"]
    },
    {
      icon: Users,
      title: "Skill Development Programs",
      description: "Centre of Excellence initiatives that build internal capabilities and ensure your team is equipped for technological advancement.",
      approaches: ["Training Programs", "Certification Courses", "Knowledge Transfer", "Competency Development"]
    },
    {
      icon: Star,
      title: "Performance Optimization",
      description: "Continuous improvement strategies that maximize ROI from technology investments and drive operational excellence.",
      approaches: ["Performance Metrics", "Process Optimization", "Cost Reduction", "Quality Enhancement"]
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      
      {/* Enhanced Background Gradient with Glass Effect */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950"></div>
        
        {/* Secondary overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-tl from-sky-900/20 via-slate-800/40 to-cyan-900/20"></div>
        
        {/* Radial gradient overlays for depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-sky-500/15 via-sky-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/15 via-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-500/10 via-blue-500/3 to-transparent rounded-full blur-3xl"></div>
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent"></div>
      </div>
      
      {/* Background Pattern with Enhanced Opacity */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-sky-400/60' : i % 3 === 1 ? 'bg-cyan-400/50' : 'bg-white/30'
            }`}
            style={{
              left: `${5 + (i * 6)}%`,
              top: `${10 + (i * 5)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced Data Flow Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-sky-400/30 to-transparent animate-data-flow"
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
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-data-flow"
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
              <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium">Our Core Services</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Comprehensive Technology</span>
                <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  Solutions & Consulting
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Partner with GT Technologies to unlock digital transformation potential through our 
                comprehensive solutions and expert consulting services tailored for Industry 4.0 excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Cards */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Solutions Card */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div 
                className={`relative group cursor-pointer transition-all duration-700 ${
                  activeService === 'solutions' ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveService('solutions')}
                onMouseLeave={() => setActiveService(null)}
              >
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/10 to-cyan-400/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>

                <div className="glass-card relative backdrop-blur-xl overflow-hidden transition-all duration-500 border-2 border-sky-400/30 group-hover:border-sky-400/60 shadow-2xl shadow-sky-500/10 bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-gray-900/40 rounded-3xl">
                  
                  {/* Glass Layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.08] via-transparent to-cyan-500/[0.05]"></div>

                  {/* Header Section */}
                  <div className="relative z-10 p-8 lg:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-sky-400/30 group-hover:scale-110 transition-transform duration-300">
                        <Cog className="w-8 h-8 text-sky-400 group-hover:rotate-180 transition-transform duration-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white group-hover:text-sky-200 transition-colors duration-300">
                          Technology
                        </div>
                        <div className="text-sky-300 text-sm font-medium">Implementation</div>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-sky-200 transition-colors duration-300">
                      Solutions
                    </h3>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 group-hover:text-gray-200 transition-colors duration-300">
                      Cutting-edge technology implementations that drive digital transformation across 
                      manufacturing, automation, and industrial processes with measurable outcomes.
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-3 mb-8">
                      {[
                        "Smart Manufacturing & Industry 4.0",
                        "AR/VR Implementation & Training",
                        "Robotics & Process Automation",
                        "Digital Twin Development"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 group/item">
                          <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-sky-500/30 transition-colors duration-300">
                            <CheckCircle className="w-3 h-3 text-sky-400" />
                          </div>
                          <span className="text-gray-300 group-hover:text-white group-hover/item:text-sky-200 transition-colors duration-200">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/solution"
                      className="group/btn inline-flex items-center px-6 py-4 bg-gradient-to-r from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/25 backdrop-blur-sm border border-sky-400/50"
                    >
                      Explore Solutions
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Animated Feature Preview */}
                  <div className="relative z-10 px-8 lg:px-10 pb-8">
                    <div className="bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-6 overflow-hidden">
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <span className="w-2 h-2 bg-sky-400 rounded-full mr-3 animate-pulse"></span>
                        Featured Technologies
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {solutionsFeatures.slice(0, 4).map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sky-500/10 transition-colors duration-200 cursor-pointer"
                            onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                          >
                            <feature.icon className="w-4 h-4 text-sky-400 flex-shrink-0" />
                            <span className="text-gray-300 text-sm truncate">{feature.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-sky-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                </div>
              </div>
            </div>

            {/* Consulting Card */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div 
                className={`relative group cursor-pointer transition-all duration-700 ${
                  activeService === 'consulting' ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveService('consulting')}
                onMouseLeave={() => setActiveService(null)}
              >
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-sky-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>

                <div className="glass-card relative backdrop-blur-xl overflow-hidden transition-all duration-500 border-2 border-cyan-400/30 group-hover:border-cyan-400/60 shadow-2xl shadow-cyan-500/10 bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-gray-900/40 rounded-3xl">
                  
                  {/* Glass Layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/[0.08] via-transparent to-blue-500/[0.05]"></div>

                  {/* Header Section */}
                  <div className="relative z-10 p-8 lg:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/30 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">
                          Strategic
                        </div>
                        <div className="text-cyan-300 text-sm font-medium">Advisory</div>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors duration-300">
                      Consulting
                    </h3>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 group-hover:text-gray-200 transition-colors duration-300">
                      Expert strategic guidance and advisory services that accelerate your digital transformation 
                      journey with proven methodologies and industry best practices.
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-3 mb-8">
                      {[
                        "Digital Transformation Strategy",
                        "Technology Assessment & Planning",
                        "Change Management & Training",
                        "Performance Optimization"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 group/item">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-cyan-500/30 transition-colors duration-300">
                            <CheckCircle className="w-3 h-3 text-cyan-400" />
                          </div>
                          <span className="text-gray-300 group-hover:text-white group-hover/item:text-cyan-200 transition-colors duration-200">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/services/consult"
                      className="group/btn inline-flex items-center px-6 py-4 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 hover:from-cyan-600/90 hover:to-cyan-700/90 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/50"
                    >
                      Explore Consulting
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Animated Feature Preview */}
                  <div className="relative z-10 px-8 lg:px-10 pb-8">
                    <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 overflow-hidden">
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                        Service Areas
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {consultingFeatures.slice(0, 4).map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors duration-200 cursor-pointer"
                            onClick={() => setExpandedFeature(expandedFeature === (index + 10) ? null : index + 10)}
                          >
                            <feature.icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-gray-300 text-sm truncate">{feature.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="glass-card bg-slate-900/40 backdrop-blur-xl border border-sky-500/20 rounded-3xl p-12 lg:p-16 overflow-hidden relative">
              {/* Background Elements */}
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
                  <span className="block">Ready to Begin Your</span>
                  <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                    Digital Transformation?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Connect with our expert team to discuss your specific requirements and discover how 
                  GT Technologies can accelerate your journey to Industry 4.0 excellence.
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
                    href="/about"
                    className="px-8 py-4 bg-transparent border-2 border-sky-400/50 text-white rounded-full font-semibold text-lg hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300"
                  >
                    Learn More About Us
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

export default ServicesPage