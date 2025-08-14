'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Zap, 
  Users, 
  Cog, 
  Lightbulb,
  Star,
  CheckCircle,
  Globe,
  Rocket,
  Shield,
  Target
} from 'lucide-react'

const ServicesPage = () => {
  const [activeService, setActiveService] = useState<'solutions' | 'consulting' | null>(null)

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
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium">Our Core Services</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Comprehensive Technology</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Solutions & Consulting
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Partner with GT Technologies to unlock digital transformation potential through our 
                comprehensive solutions and expert consulting services tailored for Industry 4.0 excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Cards */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Solutions Card */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div 
                className="relative group transition-all duration-500"
                onMouseEnter={() => setActiveService('solutions')}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/15 group-hover:bg-white/80">
                  
                  {/* Glass Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Header Section */}
                  <div className="relative z-10 p-8 lg:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/40 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                        <Cog className="w-8 h-8 text-cyan-600 group-hover:rotate-45 transition-transform duration-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300">
                          Technology
                        </div>
                        <div className="text-cyan-600 text-sm font-medium">Implementation</div>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 group-hover:text-cyan-700 transition-colors duration-300">
                      Solutions
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                      Cutting-edge technology implementations that drive digital transformation across 
                      manufacturing, automation, and industrial processes with measurable outcomes.
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-3 mb-8">
                      {[
                        "Virtual twin development",
                        "AR/VR Implementation & Training",
                        "Robotics & Process Automation",
                        "All type of Simulations"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 group/item">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-cyan-500/30 transition-colors duration-300">
                            <CheckCircle className="w-3 h-3 text-cyan-600" />
                          </div>
                          <span className="text-gray-600 group-hover:text-gray-800 group-hover/item:text-cyan-700 transition-colors duration-200">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="services/solution"
                      className="group/btn inline-flex items-center px-6 py-4 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/50"
                    >
                      Explore Solutions
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Animated Feature Preview */}
                  <div className="relative z-10 px-8 lg:px-10 pb-8">
                    <div className="bg-cyan-50/60 backdrop-blur-sm border border-cyan-300/40 rounded-2xl p-6 overflow-hidden">
                      <h4 className="text-gray-800 font-semibold mb-4 flex items-center">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 animate-pulse"></span>
                        Featured Technologies
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {solutionsFeatures.slice(0, 4).map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cyan-100/50 transition-colors duration-200"
                          >
                            <feature.icon className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                            <span className="text-gray-700 text-sm truncate">{feature.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="absolute bottom-3 right-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Consulting Card */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div 
                className="relative group transition-all duration-500"
                onMouseEnter={() => setActiveService('consulting')}
                onMouseLeave={() => setActiveService(null)}
              >

                <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/15 group-hover:bg-white/80">
                  
                  {/* Glass Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Header Section */}
                  <div className="relative z-10 p-8 lg:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-cyan-400/40 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                        <Users className="w-8 h-8 text-cyan-600 group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors duration-300">
                          Strategic
                        </div>
                        <div className="text-cyan-600 text-sm font-medium">Advisory</div>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 group-hover:text-cyan-700 transition-colors duration-300">
                      Consulting
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                      Expert strategic guidance and advisory services that accelerate your digital transformation 
                      journey with proven methodologies and industry best practices.
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-3 mb-8">
                      {[
                        "Industrial Consultation",
                        "Academic Consultation",
                        "Management aaa& Training",
                        "Performance Optimization"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 group/item">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center backdrop-blur-sm group-hover:bg-cyan-500/30 transition-colors duration-300">
                            <CheckCircle className="w-3 h-3 text-cyan-600" />
                          </div>
                          <span className="text-gray-600 group-hover:text-gray-800 group-hover/item:text-cyan-700 transition-colors duration-200">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/services/consult"
                      className="group/btn inline-flex items-center px-6 py-4 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/50"
                    >
                      Explore Consulting
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Animated Feature Preview */}
                  <div className="relative z-10 px-8 lg:px-10 pb-8">
                    <div className="bg-cyan-50/60 backdrop-blur-sm border border-cyan-300/40 rounded-2xl p-6 overflow-hidden">
                      <h4 className="text-gray-800 font-semibold mb-4 flex items-center">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 animate-pulse"></span>
                        Service Areas
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {consultingFeatures.slice(0, 4).map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cyan-100/50 transition-colors duration-200"
                          >
                            <feature.icon className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                            <span className="text-gray-700 text-sm truncate">{feature.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="absolute bottom-3 right-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 lg:p-16 overflow-hidden shadow-2xl">
              {/* Glass Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
              
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                  <span className="block">Ready to Begin Your</span>
                  <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                    Digital Transformation?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Connect with our expert team to discuss your specific requirements and discover how 
                  GT Technologies can accelerate your journey to Industry 4.0 excellence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25"
                  >
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/about"
                    className="px-8 py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                  >
                    Learn More About Us
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

      {/* Custom Animations and Styles */}
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
      `}</style>
    </main>
  )
}

export default ServicesPage