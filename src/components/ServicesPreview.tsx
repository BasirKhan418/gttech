'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// GT Tech specific constants
const CAL_LINKS = {
  discovery: "https://cal.com/swagat-dash-8nt1wl/discovery-call?overlayCalendar=true",
  strategy: "https://cal.com/swagat-dash-8nt1wl/discovery-call?overlayCalendar=true", 
  enterprise: "https://cal.com/swagat-dash-8nt1wl/discovery-call?overlayCalendar=true",
  consultation: "https://cal.com/swagat-dash-8nt1wl/discovery-call?overlayCalendar=true",
  kickoff: "https://cal.com/swagat-dash-8nt1wl/discovery-call?overlayCalendar=true",
  followup: "https://cal.com/swagat-dash-8nt1wl/discovery-call?overlayCalendar=true"
} as const;

const CONSULTATION_PACKAGES = [
  {
    id: "startup",
    title: "Discovery Consultation",
    discoveryDuration: "45 min",
    strategyDuration: "90 min", 
    desc: "Ideal for startups and growing businesses seeking to explore digital transformation opportunities and assess their Industry 4.0 readiness.",
    buttonText: "Schedule Discovery Call",
    features: [
      "Comprehensive technology assessment and roadmap",
      "Industry 4.0 readiness evaluation", 
      "Detailed cost estimation and project timeline",
      "Tailored solution recommendations",
      "Strategic follow-up action plan"
    ]
  },
  {
    id: "enterprise", 
    title: "Enterprise Consultation",
    discoveryDuration: "60 min",
    strategyDuration: "2 hours",
    desc: "Comprehensive consultation designed for large enterprises requiring sophisticated digital solutions and enterprise-grade implementations.",
    buttonText: "Book Enterprise Session",
    features: [
      "Complete digital transformation audit",
      "Custom enterprise solution architecture", 
      "Detailed ROI analysis and financial projections",
      "Strategic implementation roadmap",
      "Comprehensive ongoing support planning",
      "Technology partnership and vendor guidance"
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
    <section className="py-8 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
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
              i % 2 === 0 ? 'bg-cyan-400/50' : 'bg-cyan-200/30'
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
        <div className="mb-12">
          {/* Consultation Header */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 glass-badge bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-semibold">Complimentary Consultation Available</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Let's discuss your
              <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                Digital Transformation Journey
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Every successful transformation begins with understanding your unique challenges and objectives. 
              Schedule a consultation to explore how our Industry 4.0 solutions can accelerate your business growth.
            </p>
          </div>

          {/* Consultation Type Toggle */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="glass-container flex items-center justify-center space-x-6 bg-white/70 backdrop-blur-xl border border-cyan-300/50 rounded-2xl p-6 shadow-xl">
              <span
                className={`text-lg font-semibold transition-colors duration-300 ${
                  consultationType === "discovery" ? "text-cyan-700" : "text-gray-500"
                }`}
              >
                Discovery Call
              </span>

              <button
                onClick={handleSwitch}
                className="relative w-16 h-8 flex items-center rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
              >
                <span
                  className={`absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
                    consultationType === "strategy" ? "translate-x-8" : "translate-x-1"
                  }`}
                >
                  <span className="block w-2 h-2 bg-cyan-500 rounded-full m-auto mt-[7px]"></span>
                </span>
              </button>

              <span
                className={`text-lg font-semibold transition-colors duration-300 ${
                  consultationType === "strategy" ? "text-cyan-700" : "text-gray-500"
                }`}
              >
                Strategy Session
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-3 text-center">
              {consultationType === "discovery"
                ? "Initial assessment and tailored recommendations"
                : "In-depth strategic planning and comprehensive roadmap"}
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
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/25 via-cyan-500/25 to-cyan-600/25 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/15 via-cyan-400/15 to-cyan-500/15 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
                    </>
                  )}

                  <div className={`glass-card relative backdrop-blur-xl overflow-hidden transition-all duration-500 ${
                    isEnterprise 
                      ? 'border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20 bg-gradient-to-br from-white/80 via-cyan-50/60 to-white/70' 
                      : 'border border-cyan-200/60 hover:border-cyan-400/60 bg-gradient-to-br from-white/70 via-cyan-50/40 to-white/60 shadow-lg hover:shadow-xl hover:shadow-cyan-500/15'
                  } rounded-3xl`}>
                    
                    {/* Multiple Glass Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.4] via-white/[0.2] to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/[0.08] via-transparent to-cyan-300/[0.05]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.3] to-transparent"></div>
                    
                    {/* Premium Badge */}
                    {isEnterprise && (
                      <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-cyan-400/60 shadow-lg">
                        ✨ ENTERPRISE
                      </div>
                    )}

                    {/* Header */}
                    <div className="p-8 pb-6 relative z-10">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-cyan-700 transition-colors duration-300">
                        {package_item.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl ${isEnterprise ? 'bg-cyan-500/25 border border-cyan-400/50' : 'bg-cyan-100/60 border border-cyan-200/50'} backdrop-blur-sm shadow-sm`}>
                          <svg className={`w-6 h-6 ${isEnterprise ? 'text-cyan-600' : 'text-cyan-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <span className="text-3xl md:text-4xl font-bold text-gray-800">
                          {consultationType === "discovery" ? package_item.discoveryDuration : package_item.strategyDuration}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {package_item.desc}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="px-8 pb-6">
                      <button 
                        onClick={() => handleBooking(package_item.id)}
                        className={`glass-button z-auto w-full group flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] border ${
                          isEnterprise
                            ? 'bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 hover:from-cyan-600 hover:to-cyan-700 text-white border-cyan-400/60 shadow-lg shadow-cyan-500/30 backdrop-blur-sm'
                            : 'bg-white/80 border-cyan-300/60 text-cyan-700 hover:bg-cyan-50/80 hover:border-cyan-400/70 backdrop-blur-sm shadow-md hover:shadow-lg'
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
                        <span className="text-sm text-gray-500">
                          {consultationType === "discovery" ? (
                            "Complimentary initial consultation"
                          ) : (
                            "Comprehensive strategic planning session"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="px-8 pb-8">
                      <h4 className="text-gray-800 font-semibold mb-4 flex items-center">
                        <span className={`w-2 h-2 ${isEnterprise ? 'bg-cyan-500' : 'bg-cyan-400'} rounded-full mr-3`}></span>
                        What's included:
                      </h4>
                      
                      <div className="space-y-3">
                        {package_item.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 group/item">
                            <div className={`glass-check flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 backdrop-blur-sm ${
                              isEnterprise ? 'bg-cyan-500/25 border border-cyan-400/60' : 'bg-cyan-100/70 border border-cyan-300/50'
                            } shadow-sm`}>
                              <svg className={`w-3 h-3 ${isEnterprise ? 'text-cyan-600' : 'text-cyan-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-200">
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
                            className={`w-2 h-2 rounded-full backdrop-blur-sm border ${
                              isEnterprise ? 'bg-cyan-400/50 border-cyan-500/70' : 'bg-cyan-200/60 border-cyan-300/60'
                            } animate-pulse`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Corner Glass Highlights */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-cyan-300/40 rounded-tl-2xl"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-cyan-300/40 rounded-br-2xl"></div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass-cta relative backdrop-blur-xl border border-cyan-300/50 rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden shadow-2xl">
            {/* Glass Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-cyan-50/60 to-white/70"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.4] via-white/[0.2] to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/[0.08] via-transparent to-cyan-300/[0.05]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.3] to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Partner with GT Technologies to unlock the full potential of digital innovation and Industry 4.0 solutions 
                tailored to your business objectives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/gta"
                  className="glass-button group px-8 py-4 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/30 backdrop-blur-sm border border-cyan-400/60"
                >
                  Start Your Project
                  <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="glass-button px-8 py-4 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-full font-semibold text-lg hover:bg-cyan-50/80 hover:border-cyan-500/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Explore All Services
                </Link>
              </div>
            </div>

            {/* Decorative Glass Elements */}
            <div className="absolute top-6 right-6 w-16 h-16 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse backdrop-blur-sm"></div>
            <div className="absolute bottom-6 left-6 w-10 h-10 bg-gradient-to-br from-cyan-400/40 to-cyan-500/40 rounded-full animate-bounce backdrop-blur-sm"></div>
            <div className="absolute top-12 left-12 w-3 h-3 bg-cyan-400/70 rounded-full animate-ping"></div>
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

        .glass-button {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 
            0 4px 16px rgba(6, 182, 212, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative;
            z-index: 50;
        }

        .glass-badge {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 
            0 2px 8px rgba(6, 182, 212, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .glass-check {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 
            0 2px 4px rgba(6, 182, 212, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .glass-cta {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 
            0 12px 40px rgba(6, 182, 212, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            0 0 0 1px rgba(6, 182, 212, 0.1);
        }
      `}</style>
    </section>
  )
}

export default ServicesPreview