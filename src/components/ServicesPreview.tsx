'use client'
import React from 'react'
import Link from 'next/link'

const ServicesPreview = () => {
  const services = [
    {
      icon: '🎯',
      title: 'Digital Product Design',
      description: 'End-to-end product development with cutting-edge design thinking and user-centric approach.',
      features: ['3D Visualization', 'Digital Twins', 'Prototyping']
    },
    {
      icon: '🏭',
      title: 'Industry 4.0 Solutions',
      description: 'Transform your manufacturing with AI, IoT, robotics, and automation technologies.',
      features: ['Smart Manufacturing', 'Predictive Analytics', 'Process Automation']
    },
    {
      icon: '🏙️',
      title: 'Smart City Solutions',
      description: 'Comprehensive urban planning and governance solutions for sustainable cities.',
      features: ['Urban Planning', 'Waste Management', 'Transportation']
    },
    {
      icon: '⚙️',
      title: 'Engineering Services',
      description: 'Expert engineering solutions across automotive, aerospace, and industrial sectors.',
      features: ['CAD Design', 'Simulation', 'Technical Consulting']
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-gray-300 mb-6">
            Our Core Services
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Engineering
            <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive digital solutions that drive innovation and transform industries through advanced technology and expert engineering.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-white rounded-full mr-3 group-hover:animate-pulse"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/services"
                  className="inline-flex items-center text-white hover:text-gray-200 transition-colors duration-300 group-hover:translate-x-2 transform"
                >
                  Learn More
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Partner with GramTarang Technologies to unlock the full potential of digital innovation and Industry 4.0 solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
              >
                Start Your Project
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesPreview