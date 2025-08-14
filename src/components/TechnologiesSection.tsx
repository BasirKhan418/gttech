'use client'
import React from 'react'
import Image from 'next/image'

const TechnologiesSection = () => {

  const industries = [
    { name: 'Automotive', image: '/truck.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Aerospace', image: '/d.webp', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Railways', image: '/train.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Shipbuilding', image: '/ship.webp', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Construction & Territories', image: '/construction.png', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Industry equipment', image: '/industry_equipment.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Digital manufacturing ', image: '/digital.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Mining', image: '/mining.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'Information technology', image: '/it.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    { name: 'High end skill development', image: '/high.jpg', color: 'from-cyan-100 via-white to-cyan-50' },
    
  ]

  const partners = [
    { name: 'AWS', logo: '/aws.webp' },
    { name: 'Dassault Systèmes', logo: '/images.png' },
    { name: 'Gram Tarang', logo: '/download.jpeg' },
    { name: 'AWS', logo: '/aws.webp' }, 
    { name: 'Dassault Systèmes', logo: '/images.png' },
    { name: 'Gram Tarang', logo: '/download.jpeg' }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 lg:opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: 5, top: 10, delay: 0, duration: 4 },
          { left: 85, top: 20, delay: 1, duration: 5 },
          { left: 15, top: 80, delay: 2, duration: 3.5 },
          { left: 70, top: 60, delay: 0.5, duration: 4.5 },
          { left: 40, top: 30, delay: 1.5, duration: 4 },
          { left: 90, top: 70, delay: 2.5, duration: 3.8 }
        ].map((particle, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 2 === 0 ? 'bg-cyan-400/60' : 'bg-cyan-200/40'
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

      {/* Left Side Data Stream */}
      <div className="absolute left-0 top-0 bottom-0 w-20 hidden lg:block overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
                style={{
                  left: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: '4s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Data Stream */}
      <div className="absolute right-0 top-0 bottom-0 w-20 hidden lg:block overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
                style={{
                  right: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: '4s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Industries Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            <span className="block">Industries We</span>
            <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
              Serve
            </span>
          </h3>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Delivering specialized solutions across diverse industry verticals with deep domain expertise 
            and cutting-edge technology implementations.
          </p>

          {/* Industries Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm border border-cyan-300/40 p-8 shadow-xl">
            {/* Animated Industries Display */}
            <div className="flex animate-scroll-industries space-x-8 items-center">
              {[...industries, ...industries].map((industry, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 group relative bg-white/80 backdrop-blur-sm border border-cyan-200/60 rounded-2xl p-6 hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden hover:border-cyan-400/80 w-48"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Glowing Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-cyan-300/5 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Animated Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                  </div>

                  {/* Pulsing Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50 animate-pulse-border"></div>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/70 rounded-full animate-float-particle"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${10 + i * 20}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: `${2 + i * 0.5}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="relative z-10 text-center">
                    <div className="mb-4 flex justify-center overflow-hidden rounded-xl bg-cyan-50/50 p-2 border border-cyan-200/30">
                      <Image
                        src={industry.image}
                        alt={industry.name}
                        width={140}
                        height={90}
                        className="w-full h-24 object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700 rounded-lg filter group-hover:brightness-110 group-hover:contrast-110"
                      />
                      
                      {/* Image Overlay Effect */}
                      <div className="absolute inset-2 rounded-lg bg-gradient-to-tr from-cyan-500/15 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    <h4 className="text-gray-800 font-bold text-lg group-hover:text-cyan-700 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1">
                      {industry.name}
                    </h4>
                    
                    <div className="h-0 group-hover:h-6 transition-all duration-500 overflow-hidden">
                      
                    </div>
                  </div>

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
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/8 via-transparent to-cyan-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              ))}
            </div>

            {/* Gradient Overlays for Seamless Scrolling */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/80 via-white/40 to-transparent pointer-events-none z-10"></div>
            
            {/* Central Spotlight Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-cyan-100/20 pointer-events-none"></div>
          </div>
        </div>

        {/* Industry Partners Section */}
        <div className="mt-24 text-center">
          <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-12 max-w-5xl mx-auto overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-8">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-8 w-2 h-2 bg-cyan-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-200/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-6 right-4 w-2 h-2 bg-cyan-400/35 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                <span className="block">Our Industry</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Partners
                </span>
              </h3>
              <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Certified expertise and strategic partnerships with world-class technology leaders, 
                ensuring innovative solutions for your digital transformation journey.
              </p>

              {/* Animated Partners Logos */}
              <div className="relative overflow-hidden rounded-2xl bg-cyan-50/60 backdrop-blur-sm border border-cyan-200/40 p-8 shadow-lg">
                <div className="flex animate-scroll-left space-x-16 items-center">
                  {partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 group cursor-pointer"
                    >
                      <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-200/50 rounded-xl p-6 hover:border-cyan-400/70 transition-all duration-300 hover:scale-105 hover:bg-white/90 shadow-md hover:shadow-xl hover:shadow-cyan-500/20">
                        <div className="w-32 h-16 flex items-center rounded-md justify-center">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={80}
                            height={60}
                            className="object-contain filter rounded-md brightness-90 group-hover:brightness-110 transition-all duration-300"
                          />
                        </div>
                        <div className="text-center mt-3">
                          <p className="text-gray-700 text-sm font-medium group-hover:text-cyan-700 transition-colors duration-300">
                            {partner.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cyan-50/40 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cyan-50/40 to-transparent pointer-events-none"></div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnologiesSection