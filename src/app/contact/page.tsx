'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

interface FormData {
  name: string
  email: string
  mobile: string
  message: string
}

interface SubmitResponse {
  success: boolean
  message: string
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/

    if (!formData.name.trim() || formData.name.length < 2) {
      setErrorMessage('Please enter a valid name (minimum 2 characters)')
      return false
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address')
      return false
    }

    if (!phoneRegex.test(formData.mobile.replace(/\s/g, ''))) {
      setErrorMessage('Please enter a valid phone number')
      return false
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMessage('Please enter a message (minimum 10 characters)')
      return false
    }

    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (submitStatus === 'error') {
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: SubmitResponse = await response.json()
      
      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', mobile: '', message: '' })
        
        setTimeout(() => {
          setSubmitStatus('idle')
        }, 5000)
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 opacity-5">
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
          { left: 10, top: 20, delay: 0, duration: 4 },
          { left: 80, top: 15, delay: 1, duration: 5 },
          { left: 25, top: 70, delay: 2, duration: 3.5 },
          { left: 60, top: 40, delay: 0.5, duration: 4.5 }
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
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-data-flow"
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

      <section className="relative z-10 flex items-center min-h-screen pt-16 lg:pt-20 mt-16 lg:mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="relative bottom-4">
                <Image
                  src="/logo.png"
                  alt="GT Technologies Logo"
                  width={300}
                  height={100}
                />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Ready to</span>
                <span className="block bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  Transform?
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Whether you're interested in our cutting-edge solutions, need expert consultation, 
                or just want to explore possibilities, we'd love to hear from you.
              </p>

              <div className="space-y-8">
                <div className="relative group">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/60 backdrop-blur-sm border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:border-sky-400/40 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-sky-300 transition-colors duration-300">
                        Quick Response
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        We typically respond within 24 hours with detailed insights and next steps for your project requirements.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-6 top-12 w-px h-8 bg-gradient-to-b from-sky-400/30 to-transparent"></div>
                </div>
                
                <div className="relative group">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/60 backdrop-blur-sm border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:border-sky-400/40 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-sky-300 transition-colors duration-300">
                        Expert Consultation
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        Personalized solutions tailored to your specific needs with our team of industry-certified professionals.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-6 top-12 w-px h-8 bg-gradient-to-b from-cyan-400/30 to-transparent"></div>
                </div>
                
                <div className="relative group">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/60 backdrop-blur-sm border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:border-sky-400/40 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-sky-400 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-sky-300 transition-colors duration-300">
                        Innovation Focus
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        Cutting-edge technology solutions that drive digital transformation and sustainable business growth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-8 overflow-hidden">
                
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                <div className="absolute top-4 left-4 w-3 h-3 bg-sky-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-6 right-8 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-4 left-8 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-6 right-4 w-2 h-2 bg-sky-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-sky-400/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-sky-400/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-400/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-400/60 to-transparent"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                        Get In Touch
                      </span>
                    </h2>
                    <p className="text-gray-400">
                      Let's discuss how we can help transform your business
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 text-sm hover:border-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="e.g., John Doe"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 text-sm hover:border-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="e.g., john@company.com"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2 text-sm">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 text-sm hover:border-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="e.g., +91 98765 43210"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2 text-sm">
                        Your Message
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300 resize-none text-sm hover:border-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Share your thoughts or inquiries..."
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    {submitStatus === 'success' && (
                      <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-green-300 text-center backdrop-blur-sm">
                        <div className="text-lg font-semibold">Message sent successfully!</div>
                        <div className="text-sm mt-1">We'll get back to you soon.</div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-red-300 text-center backdrop-blur-sm">
                        <div className="text-lg font-semibold">Error sending message</div>
                        <div className="text-sm mt-1">{errorMessage || 'Please try again.'}</div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700"></div>
                      
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"></path>
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 mb-16 lg:mb-24 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.4s' }}>
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gray-900/40 backdrop-blur-sm border border-sky-500/20 rounded-3xl p-8 lg:p-10 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                <div className="absolute top-4 left-4 w-3 h-3 bg-sky-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-6 right-8 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-4 left-8 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-6 right-4 w-2 h-2 bg-sky-400/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-sky-400/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-sky-400/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-400/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-400/60 to-transparent"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                        We are available
                      </span>
                    </h3>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                      Ready to connect? Reach out to us directly through any of the channels below for immediate assistance.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="group">
                      <div className="relative bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-6 lg:p-8 hover:border-sky-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/10 overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                        </div>

                        <div className="absolute top-3 right-3 w-2 h-2 bg-sky-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping-slow"></div>
                        <div className="absolute bottom-3 left-3 w-1 h-1 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>

                        <div className="relative z-10 flex items-center space-x-4">
                          <div className="flex-shrink-0 w-14 h-14 bg-gray-900/60 backdrop-blur-sm border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:border-sky-400/50 transition-all duration-300 group-hover:scale-110">
                            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Email Address</p>
                            <a 
                              href="mailto:info@thegttech.com" 
                              className="text-white text-lg font-semibold hover:text-sky-300 transition-colors duration-300 break-all group-hover:scale-105 transform transition-transform duration-300 inline-block"
                            >
                              info@thegttech.com
                            </a>
                            <p className="text-gray-500 text-sm mt-1">Drop us a line anytime</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative bg-black/20 backdrop-blur-sm border border-sky-500/20 rounded-2xl p-6 lg:p-8 hover:border-sky-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/10 overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                        </div>

                        <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping-slow"></div>
                        <div className="absolute bottom-3 left-3 w-1 h-1 bg-sky-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>

                        <div className="relative z-10 flex items-center space-x-4">
                          <div className="flex-shrink-0 w-14 h-14 bg-gray-900/60 backdrop-blur-sm border border-sky-500/20 rounded-xl flex items-center justify-center group-hover:border-sky-400/50 transition-all duration-300 group-hover:scale-110">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Phone Number</p>
                            <a 
                              href="tel:+919840015963" 
                              className="text-white text-lg font-semibold hover:text-sky-300 transition-colors duration-300 group-hover:scale-105 transform transition-transform duration-300 inline-block"
                            >
                              +91 9840015963
                            </a>
                            <p className="text-gray-500 text-sm mt-1">Call us for immediate support</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 lg:mt-10 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
                      <div className="w-1 h-1 bg-sky-400/60 rounded-full animate-pulse"></div>
                      <span>Available Monday to Friday, 9 AM - 6 PM IST</span>
                      <div className="w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage