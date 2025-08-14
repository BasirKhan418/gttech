'use client'
import React from 'react'
import Image from 'next/image'

const TechnologiesSection = () => {

  const industries = [
    { name: 'Automotive', image: '/truck.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Aerospace', image: '/d.webp', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Railways', image: '/train.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Shipbuilding', image: '/ship.webp', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Construction & Territories', image: '/construction.png', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Industry equipment', image: '/industry_equipment.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Digital manufacturing ', image: '/digital.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Mining', image: '/mining.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'Information technology', image: '/it.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    { name: 'High end skill development', image: '/high.jpg', color: 'from-gray-950 via-slate-950 to-black' },
    
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
    <section className="py-24 bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 lg:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

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
              i % 2 === 0 ? 'bg-sky-400/40' : 'bg-white/15'
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

      <div className="absolute left-0 top-0 bottom-0 w-20 hidden lg:block overflow-hidden opacity-30">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-data-flow"
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

      <div className="absolute right-0 top-0 bottom-0 w-20 hidden lg:block overflow-hidden opacity-30">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-data-flow"
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
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="block">Industries We</span>
            <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
              Serve
            </span>
          </h3>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            Delivering specialized solutions across diverse industry verticals with deep domain expertise 
            and cutting-edge technology implementations.
          </p>

          {/* Industries Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl bg-black/20 backdrop-blur-sm border border-sky-500/20 p-8">
            {/* Animated Industries Display */}
            <div className="flex animate-scroll-industries space-x-8 items-center">
              {[...industries, ...industries].map((industry, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 group relative bg-gray-900/60 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-6 hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/20 overflow-hidden hover:border-sky-400/60 w-48"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Glowing Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Animated Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                  </div>

                  {/* Pulsing Border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/40 animate-pulse-border"></div>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1  bg-sky-400/60 rounded-full animate-float-particle"
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
                    <div className="mb-4 flex justify-center overflow-hidden rounded-xl bg-black/20 p-2">
                      <Image
                        src={industry.image}
                        alt={industry.name}
                        width={140}
                        height={90}
                        className="w-full h-24 object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700 rounded-lg filter group-hover:brightness-110 group-hover:contrast-110"
                      />
                      
                      {/* Image Overlay Effect */}
                      <div className="absolute inset-2 rounded-lg bg-gradient-to-tr from-sky-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    <h4 className="text-white font-bold text-lg group-hover:text-sky-300 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1">
                      {industry.name}
                    </h4>
                    
                    <div className="h-0 group-hover:h-6 transition-all duration-500 overflow-hidden">
                      
                    </div>
                  </div>

                  {/* Corner Tech Elements */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-sky-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping-slow"></div>
                  <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                  
                  {/* Tech Lines */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-sky-400/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-sky-400/60 to-transparent"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-400/60 to-transparent"></div>
                    <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-400/60 to-transparent"></div>
                  </div>

                  {/* Holographic Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              ))}
            </div>

            {/* Gradient Overlays for Seamless Scrolling */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/60 via-black/30 to-transparent pointer-events-none z-10"></div>
            
            {/* Central Spotlight Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none"></div>
          </div>
        </div>

        {/* Industry Partners Section */}
        <div className="mt-24 text-center">
          <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-12 max-w-5xl mx-auto overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-sky-400/20 rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-8 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-4 left-8 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-6 right-4 w-2 h-2 bg-sky-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                <span className="block">Our Industry</span>
                <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  Partners
                </span>
              </h3>
              <p className="text-lg lg:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Certified expertise and strategic partnerships with world-class technology leaders, 
                ensuring innovative solutions for your digital transformation journey.
              </p>

              {/* Animated Partners Logos */}
              <div className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-sky-500/10 p-8">
                <div className="flex animate-scroll-left space-x-16 items-center">
                  {partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 group cursor-pointer"
                    >
                      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-sky-400/30 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                        <div className="w-32 h-16 flex items-center  rounded-md justify-center">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={80}
                            height={60}
                            className="object-contain filter rounded-md  brightness-90 group-hover:brightness-110 transition-all duration-300"
                          />
                        </div>
                        <div className="text-center mt-3">
                          <p className="text-white/80 text-sm font-medium group-hover:text-sky-300 transition-colors duration-300">
                            {partner.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnologiesSection