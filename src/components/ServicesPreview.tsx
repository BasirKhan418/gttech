'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// GT Tech specific constants
const CAL_LINKS = {
  discovery: "https://cal.com/gttech/discovery-calls",
  strategy: "https://cal.com/gttech/strategy-sessions", 
  enterprise: "https://cal.com/gttech/enterprise-consultation",
  consultation: "https://cal.com/gttech/general-consultation",
  kickoff: "https://cal.com/gttech/project-kickoff",
  followup: "https://cal.com/gttech/follow-up-meetings"
} as const;

const CONSULTATION_PACKAGES = [
  {
    id: "startup",
    title: "Discovery Consultation",
    discoveryDuration: "45 min",
    strategyDuration: "90 min", 
    desc: "Perfect for startups and small businesses looking to explore digital transformation opportunities.",
    buttonText: "Schedule Discovery Call",
    features: [
      "Technology assessment and roadmap",
      "Industry 4.0 readiness evaluation", 
      "Cost estimation and timeline",
      "Solution recommendations",
      "Follow-up action plan"
    ]
  },
  {
    id: "enterprise", 
    title: "Enterprise Consultation",
    discoveryDuration: "60 min",
    strategyDuration: "2 hours",
    desc: "Comprehensive consultation for large enterprises requiring advanced digital solutions.",
    buttonText: "Book Enterprise Session",
    features: [
      "Complete digital transformation audit",
      "Custom solution architecture", 
      "ROI analysis and projections",
      "Implementation strategy",
      "Ongoing support planning",
      "Technology partnership guidance"
    ]
  }
];

type ConsultationType = "discovery" | "strategy";

const ServicesPreview = () => {
  const [consultationType, setConsultationType] = useState<ConsultationType>("discovery");

  const handleSwitch = () => {
    setConsultationType((prev) => (prev === "discovery" ? "strategy" : "discovery"));
  };

  const handleBooking = (packageId: string) => {
    let calLink: keyof typeof CAL_LINKS;
    
    if (packageId === "startup") {
      calLink = consultationType === "discovery" ? "discovery" : "strategy";
    } else {
      calLink = consultationType === "discovery" ? "consultation" : "enterprise";
    }
    
    window.open(CAL_LINKS[calLink], '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 2 === 0 ? 'bg-sky-400/40' : 'bg-white/20'
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Consultation Section */}
        <div className="mb-20">
          {/* Consultation Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 glass-badge bg-sky-500/15 backdrop-blur-sm border border-sky-400/30 rounded-full text-sm text-sky-200 mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-medium">Free Consultation Available</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Let's discuss your
              <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                Digital Transformation
              </span>
            </h2>
            
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Every business transformation journey is unique. Schedule a consultation to discuss your vision, 
              requirements, and get a custom Industry 4.0 solution tailored to your needs.
            </p>
          </div>

          {/* Consultation Type Toggle */}
         {/* Consultation Type Toggle */}
<div className="flex flex-col items-center justify-center mb-12">
  <div className="glass-container flex items-center justify-center space-x-6 bg-slate-900/30 backdrop-blur-xl border border-sky-500/20 rounded-2xl p-6">
    <span
      className={`text-lg font-medium transition-colors duration-300 ${
        consultationType === "discovery" ? "text-white" : "text-gray-400"
      }`}
    >
      Discovery Call
    </span>

    {/* Fixed toggle */}
    <button
      onClick={handleSwitch}
      className="relative w-16 h-8 flex items-center rounded-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 transition-all duration-300 shadow-lg focus:outline-none"
    >
      <span
        className={`absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          consultationType === "strategy" ? "translate-x-8" : "translate-x-1"
        }`}
      >
        <span className="block w-2 h-2 bg-sky-500 rounded-full m-auto mt-[7px]"></span>
      </span>
    </button>

    <span
      className={`text-lg font-medium transition-colors duration-300 ${
        consultationType === "strategy" ? "text-white" : "text-gray-400"
      }`}
    >
      Strategy Session
    </span>
  </div>

  <p className="text-sm text-gray-500 mt-3 text-center">
    {consultationType === "discovery"
      ? "Quick assessment and initial recommendations"
      : "Comprehensive planning and strategic roadmap"}
  </p>
</div>


          {/* Consultation Packages */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {CONSULTATION_PACKAGES.map((package_item, idx) => {
              const isEnterprise = package_item.title === "Enterprise Consultation";
              
              return (
                <div key={package_item.id} className={`relative group transition-all duration-700 hover:scale-105 ${
                  idx === 1 ? 'lg:mt-8' : ''
                }`}>
                  {/* Enhanced Glow Effect for Enterprise */}
                  {isEnterprise && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-cyan-400/10 to-blue-400/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
                    </>
                  )}

                  <div className={`glass-card relative backdrop-blur-xl overflow-hidden transition-all duration-500 ${
                    isEnterprise 
                      ? 'border-2 border-sky-400/40 shadow-2xl shadow-sky-500/20 bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-gray-900/40' 
                      : 'border border-slate-600/40 hover:border-sky-500/40 bg-gradient-to-br from-slate-900/30 via-slate-800/50 to-gray-900/30'
                  } rounded-3xl`}>
                    
                    {/* Multiple Glass Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.05] via-transparent to-cyan-500/[0.03]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent"></div>
                    
                    {/* Premium Badge */}
                    {isEnterprise && (
                      <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-sky-500/80 to-cyan-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-sky-400/50 shadow-lg">
                        ✨ PREMIUM
                      </div>
                    )}

                    {/* Header */}
                    <div className="p-8 pb-6 relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-sky-200 transition-colors duration-300">
                        {package_item.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${isEnterprise ? 'bg-sky-500/20 border border-sky-400/40' : 'bg-white/10 border border-white/20'} backdrop-blur-sm`}>
                          <svg className={`w-6 h-6 ${isEnterprise ? 'text-sky-400' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          {consultationType === "discovery" ? package_item.discoveryDuration : package_item.strategyDuration}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {package_item.desc}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="px-8 pb-6">
                      <button 
                        onClick={() => handleBooking(package_item.id)}
                        className={`glass-button z-auto w-full group flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] border ${
                          isEnterprise
                            ? 'bg-gradient-to-r from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90 text-white border-sky-400/50 shadow-lg shadow-sky-500/25 backdrop-blur-sm'
                            : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {package_item.buttonText}
                        <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </button>
                      
                      <div className="text-center mt-3">
                        <span className="text-sm text-gray-400">
                          {consultationType === "discovery" ? (
                            "Free initial consultation"
                          ) : (
                            "In-depth planning session"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="px-8 pb-8">
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <span className={`w-2 h-2 ${isEnterprise ? 'bg-sky-400' : 'bg-gray-400'} rounded-full mr-3`}></span>
                        What's included:
                      </h4>
                      
                      <div className="space-y-3">
                        {package_item.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 group/item">
                            <div className={`glass-check flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 backdrop-blur-sm ${
                              isEnterprise ? 'bg-sky-500/20 border border-sky-400/50' : 'bg-white/10 border border-white/30'
                            }`}>
                              <svg className={`w-3 h-3 ${isEnterprise ? 'text-sky-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-300 group-hover/item:text-white transition-colors duration-200">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decorative Glass Elements */}
                    <div className="absolute bottom-4 right-4 opacity-30">
                      <div className="grid grid-cols-2 gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full backdrop-blur-sm border ${
                              isEnterprise ? 'bg-sky-400/40 border-sky-400/60' : 'bg-white/30 border-white/40'
                            } animate-pulse`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Corner Glass Highlights */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-2xl"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-2xl"></div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-cta relative backdrop-blur-xl border border-sky-500/30 rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden">
            {/* Glass Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-gray-900/40"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.05] via-transparent to-cyan-500/[0.03]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Partner with GT Technologies to unlock the full potential of digital innovation and Industry 4.0 solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/gta"
                  className="glass-button group px-8 py-4 bg-gradient-to-r from-sky-500/80 to-sky-600/80 text-white rounded-full font-semibold text-lg hover:from-sky-600/90 hover:to-sky-700/90 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-sky-500/25 backdrop-blur-sm border border-sky-400/50"
                >
                  Start Your Project
                  <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="glass-button px-8 py-4 bg-white/10 border-2 border-sky-400/50 text-white rounded-full font-semibold text-lg hover:bg-sky-500/10 hover:border-sky-400/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  View All Services
                </Link>
              </div>
            </div>

            {/* Decorative Glass Elements */}
            <div className="absolute top-6 right-6 w-16 h-16 border-2 border-sky-400/30 rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
            <div className="absolute bottom-6 left-6 w-10 h-10 bg-gradient-to-br from-sky-400/30 to-cyan-400/30 rounded-full animate-bounce backdrop-blur-sm"></div>
            <div className="absolute top-12 left-12 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

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
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .glass-container {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-button {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-badge {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-check {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-cta {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </section>
  )
}

export default ServicesPreview