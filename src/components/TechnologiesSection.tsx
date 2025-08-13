'use client'
import React from 'react'

const TechnologiesSection = () => {
  const technologies = [
    { name: '3DEXPERIENCE', category: 'Platform', logo: '🎯' },
    { name: 'CATIA', category: 'Design', logo: '🔧' },
    { name: 'SIMULIA', category: 'Simulation', logo: '⚡' },
    { name: 'BIOVIA', category: 'Analytics', logo: '🧬' },
    { name: 'AI/ML', category: 'Intelligence', logo: '🤖' },
    { name: 'IoT', category: 'Connectivity', logo: '🌐' },
    { name: 'AR/VR', category: 'Immersive', logo: '🥽' },
    { name: 'Robotics', category: 'Automation', logo: '🦾' },
    { name: '3D Printing', category: 'Manufacturing', logo: '🖨️' },
    { name: 'Digital Twin', category: 'Modeling', logo: '👥' },
    { name: 'Cloud Computing', category: 'Infrastructure', logo: '☁️' },
    { name: 'Blockchain', category: 'Security', logo: '🔗' }
  ]

  const industries = [
    { name: 'Automotive', icon: '🚗', color: 'from-blue-500/20 to-cyan-500/20' },
    { name: 'Aerospace', icon: '✈️', color: 'from-purple-500/20 to-pink-500/20' },
    { name: 'Railways', icon: '🚄', color: 'from-green-500/20 to-emerald-500/20' },
    { name: 'Shipbuilding', icon: '🚢', color: 'from-indigo-500/20 to-blue-500/20' },
    { name: 'Construction', icon: '🏗️', color: 'from-orange-500/20 to-red-500/20' },
    { name: 'Smart Cities', icon: '🏙️', color: 'from-teal-500/20 to-cyan-500/20' }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Industries Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Industries We Serve
          </h3>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Delivering specialized solutions across diverse industry verticals with deep domain expertise.
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${industry.color} backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl overflow-hidden`}
              >
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {industry.icon}
                  </div>
                  <h4 className="text-white font-semibold text-lg">{industry.name}</h4>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Official Dassault Systèmes Partner
            </h3>
            <p className="text-lg text-gray-400 mb-8">
              Certified expertise in 3DEXPERIENCE platform, ensuring world-class solutions for your digital transformation journey.
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-6xl">🤝</div>
              <div className="text-2xl text-white font-bold">+</div>
              <div className="text-6xl">⚙️</div>
              <div className="text-2xl text-white font-bold">=</div>
              <div className="text-6xl">🚀</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnologiesSection