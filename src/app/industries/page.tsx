'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Factory, 
  Car, 
  Building2, 
  Zap,
  Cpu,
  Wrench,
  Settings,
  CheckCircle,
  Globe,
  Rocket,
  Shield,
  Target,
  TrendingUp,
  BarChart3,
  Database,
  Cog,
  Users,
  Award
} from 'lucide-react'

const IndustryPage = () => {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null)

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

  // Replace the entire industries array with this updated version:

const industries = [
  {
    id: 'automotive',
    icon: Car,
    title: "Automotive",
    subtitle: "Advanced Mobility",
    description: "Drive innovation in automotive manufacturing with cutting-edge automation, precision engineering, and smart production systems for next-generation vehicles and transportation solutions.",
    highlights: [
      "Vehicle Assembly Automation",
      "Engine Manufacturing Systems",
      "Quality Control & Testing",
      "Supply Chain Integration"
    ],
    technologies: ["Robotics", "AI Vision", "IoT Systems", "Digital Twin"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'aerospace',
    icon: Rocket,
    title: "Aerospace",
    subtitle: "Precision Engineering",
    description: "Elevate aerospace manufacturing with ultra-precision automation, advanced composite processing, and mission-critical quality systems for aircraft and space applications.",
    highlights: [
      "Aircraft Component Manufacturing",
      "Composite Material Processing",
      "Precision Assembly Systems",
      "Aerospace Quality Standards"
    ],
    technologies: ["CNC Machining", "3D Printing", "NDT Systems", "CAD/CAM"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'railways',
    icon: Car,
    title: "Railways",
    subtitle: "Smart Transportation",
    description: "Transform railway systems with intelligent automation, predictive maintenance, and advanced manufacturing solutions for modern rail infrastructure and rolling stock.",
    highlights: [
      "Rolling Stock Manufacturing",
      "Rail Infrastructure Systems",
      "Predictive Maintenance",
      "Safety & Signaling Systems"
    ],
    technologies: ["Signal Systems", "Automation", "Sensors", "Control Systems"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'shipbuilding',
    icon: Factory,
    title: "Shipbuilding",
    subtitle: "Marine Engineering",
    description: "Revolutionize shipbuilding with advanced welding automation, hull construction systems, and marine-grade manufacturing processes for modern vessels.",
    highlights: [
      "Automated Welding Systems",
      "Hull Construction Automation",
      "Marine Assembly Processes",
      "Quality Assurance Systems"
    ],
    technologies: ["Welding Robotics", "CAD Systems", "Material Handling", "Testing"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'construction',
    icon: Building2,
    title: "Construction & Territories",
    subtitle: "Infrastructure Development",
    description: "Enhance construction processes with smart building technologies, automated construction systems, and territorial development solutions for modern infrastructure.",
    highlights: [
      "Smart Building Systems",
      "Construction Automation",
      "Infrastructure Planning",
      "Territory Management"
    ],
    technologies: ["BIM Systems", "3D Modeling", "IoT Sensors", "Automation"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'industry-equipment',
    icon: Cog,
    title: "Industry Equipment",
    subtitle: "Manufacturing Solutions",
    description: "Optimize industrial equipment with advanced automation, predictive maintenance, and smart manufacturing technologies for enhanced operational efficiency.",
    highlights: [
      "Equipment Automation",
      "Predictive Maintenance",
      "Performance Optimization",
      "System Integration"
    ],
    technologies: ["PLC Systems", "SCADA", "Sensors", "Analytics"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'digital-manufacturing',
    icon: Cpu,
    title: "Digital Manufacturing",
    subtitle: "Industry 4.0",
    description: "Lead the digital transformation with smart factory solutions, AI-powered manufacturing, and connected production systems for the future of industry.",
    highlights: [
      "Smart Factory Implementation",
      "AI-Powered Production",
      "Connected Systems",
      "Data Analytics"
    ],
    technologies: ["AI/ML", "Digital Twin", "Cloud Computing", "Big Data"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'mining',
    icon: Wrench,
    title: "Mining",
    subtitle: "Resource Extraction",
    description: "Transform mining operations with automated extraction systems, intelligent processing equipment, and advanced safety solutions for sustainable resource management.",
    highlights: [
      "Automated Extraction",
      "Processing Optimization",
      "Safety Systems",
      "Environmental Monitoring"
    ],
    technologies: ["Automation", "Safety Systems", "Monitoring", "Processing"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'information-technology',
    icon: Database,
    title: "Information Technology",
    subtitle: "Digital Solutions",
    description: "Accelerate digital transformation with cutting-edge IT solutions, cloud technologies, and smart systems integration for modern business operations.",
    highlights: [
      "Cloud Solutions",
      "System Integration",
      "Data Management",
      "Digital Transformation"
    ],
    technologies: ["Cloud Computing", "APIs", "Databases", "Security"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  },
  {
    id: 'skill-development',
    icon: Award,
    title: "High End Skill Development",
    subtitle: "Professional Training",
    description: "Empower workforce with advanced skill development programs, technical training, and certification courses for emerging technologies and industry expertise.",
    highlights: [
      "Technical Training Programs",
      "Certification Courses",
      "Skill Assessment",
      "Professional Development"
    ],
    technologies: ["E-Learning", "VR Training", "Assessment Tools", "LMS"],
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-cyan-500/20",
    borderColor: "border-sky-500/20",
    hoverBorderColor: "hover:border-sky-400/40",
    textColor: "text-sky-400",
    hoverTextColor: "group-hover:text-sky-200",
    buttonGradient: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90",
    iconBg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20",
    iconBorder: "border-sky-400/30"
  }
]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-5 lg:opacity-10">
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
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 4 === 0 ? 'bg-blue-400/40' : 
              i % 4 === 1 ? 'bg-green-400/30' : 
              i % 4 === 2 ? 'bg-purple-400/30' : 'bg-orange-400/30'
            }`}
            style={{
              left: `${5 + (i * 6)}%`,
              top: `${10 + (i * 5)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 4)}s`
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
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-data-flow"
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
      <section className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                <span className="font-medium">Industry Expertise</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Transforming Industries with</span>
                <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  Advanced Technology
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Delivering specialized solutions across diverse industries, from manufacturing and automotive 
                to aerospace and healthcare, with proven expertise in digital transformation and Industry 4.0 implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            
            {industries.map((industry, index) => (
              <div 
                key={industry.id} 
                className={`animate-on-scroll opacity-0 translate-y-10 ${
                  index === 4 ? 'lg:col-span-2 xl:col-span-1 lg:mx-auto xl:mx-0' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="relative group transition-all duration-500"
                  onMouseEnter={() => setActiveIndustry(industry.id)}
                  onMouseLeave={() => setActiveIndustry(null)}
                >

                  <div className={`relative bg-gray-900/40 backdrop-blur-sm border ${industry.borderColor} rounded-3xl overflow-hidden ${industry.hoverBorderColor} transition-all duration-500 hover:shadow-2xl`}>
                    
                    {/* Glass Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
                    <div className={`absolute inset-0 bg-gradient-to-tl ${industry.gradientFrom} via-transparent ${industry.gradientTo}`}></div>
                    
                    {/* Hover Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradientFrom} ${industry.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    {/* Header Section */}
                    <div className="relative z-10 p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 ${industry.iconBg} rounded-2xl flex items-center justify-center backdrop-blur-sm border ${industry.iconBorder} group-hover:scale-105 transition-transform duration-300`}>
                          <industry.icon className={`w-7 h-7 ${industry.textColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold text-white ${industry.hoverTextColor} transition-colors duration-300`}>
                            {industry.subtitle}
                          </div>
                          <div className={`${industry.textColor} text-xs font-medium opacity-80`}>Sector</div>
                        </div>
                      </div>
                      
                      <h3 className={`text-2xl lg:text-3xl font-bold text-white mb-4 ${industry.hoverTextColor} transition-colors duration-300`}>
                        {industry.title}
                      </h3>
                      
                      <p className="text-gray-300 text-base leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                        {industry.description}
                      </p>

                      {/* Key Highlights */}
                      <div className="space-y-2 mb-6">
                        {industry.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3 group/item">
                            <div className={`w-4 h-4 rounded-full ${industry.gradientFrom} ${industry.gradientTo} border ${industry.iconBorder} flex items-center justify-center backdrop-blur-sm group-hover:bg-opacity-50 transition-colors duration-300`}>
                              <CheckCircle className={`w-2.5 h-2.5 ${industry.textColor}`} />
                            </div>
                            <span className={`text-gray-300 text-sm group-hover:text-white group-hover/item:${industry.hoverTextColor} transition-colors duration-200`}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/industries/${industry.id}`}
                        className={`group/btn inline-flex items-center px-5 py-3 bg-gradient-to-r ${industry.buttonGradient} text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg backdrop-blur-sm border ${industry.iconBorder}`}
                      >
                        Explore {industry.title}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>

                    {/* Technology Preview */}
                    <div className="relative z-10 px-6 lg:px-8 pb-6">
                      <div className={`bg-black/20 backdrop-blur-sm border ${industry.borderColor} rounded-2xl p-4 overflow-hidden`}>
                        <h4 className="text-white font-semibold mb-3 flex items-center text-sm">
                          <span className={`w-2 h-2 ${industry.textColor} rounded-full mr-3 animate-pulse`}></span>
                          Key Technologies
                        </h4>
                        
                        <div className="flex flex-wrap gap-2">
                          {industry.technologies.map((tech, idx) => (
                            <span 
                              key={idx} 
                              className={`px-3 py-1 bg-gradient-to-r ${industry.gradientFrom} ${industry.gradientTo} rounded-lg text-xs text-gray-300 hover:text-white transition-colors duration-200 backdrop-blur-sm border ${industry.borderColor}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className={`absolute top-3 left-3 w-2 h-2 ${industry.textColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse`}></div>
                    <div className={`absolute bottom-3 right-3 w-1 h-1 ${industry.textColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-12 lg:p-16 overflow-hidden">
              {/* Glass Effects */}
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
                    Your Industry?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Partner with GT Technologies to leverage industry-specific expertise and cutting-edge 
                  solutions that drive measurable results across your operations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full font-semibold text-lg hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-sky-500/25"
                  >
                    Discuss Your Project
                    <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/case-studies"
                    className="px-8 py-4 bg-transparent border-2 border-sky-400/50 text-white rounded-full font-semibold text-lg hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-300"
                  >
                    View Case Studies
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-12 h-12 border-2 border-sky-400/30 rounded-xl rotate-45 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-sky-400/30 to-cyan-400/30 rounded-full animate-bounce"></div>
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

export default IndustryPage