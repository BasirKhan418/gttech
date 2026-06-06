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
        headers: { 'Content-Type': 'application/json' },
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
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
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

      {/* Data flow lines */}
      {['left-0', 'right-0'].map((side, si) => (
        <div key={side} className={`absolute ${side} top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-40`}>
          <div className="relative h-full">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500/25 to-transparent animate-data-flow"
                style={{
                  [si === 0 ? 'left' : 'right']: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s',
                }}
              />
            ))}
          </div>
        </div>
      ))}

      <section className="relative z-10 flex items-center min-h-screen pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left hero */}
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="relative bottom-4">
                <Image src="/logo.png" alt="GT Technologies Logo" width={300} height={100} />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Ready to</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Transform?
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Whether you&apos;re interested in our cutting-edge solutions, need expert consultation,
                or just want to explore possibilities, we&apos;d love to hear from you.
              </p>

              <div className="space-y-8">
                {[
                  { title: 'Quick Response', desc: 'We typically respond within 24 hours with detailed insights and next steps for your project requirements.', delay: '0s', connector: true },
                  { title: 'Expert Consultation', desc: 'Personalized solutions tailored to your specific needs with our team of industry-certified professionals.', delay: '0.5s', connector: true },
                  { title: 'Innovation Focus', desc: 'Cutting-edge technology solutions that drive digital transformation and sustainable business growth.', delay: '1s', connector: false },
                ].map((item) => (
                  <div key={item.title} className="relative group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/80 backdrop-blur-sm border border-cyan-300/60 rounded-xl flex items-center justify-center group-hover:border-cyan-400/80 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: item.delay }} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-cyan-700 transition-colors duration-300">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    {item.connector && <div className="absolute left-6 top-12 w-px h-8 bg-gradient-to-b from-cyan-500/40 to-transparent" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right form card */}
            <div className="animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-500/70 to-transparent" />
                  <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-cyan-500/70 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-500/70 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-500/70 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                      <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                        Get In Touch
                      </span>
                    </h2>
                    <p className="text-gray-500">
                      Let&apos;s discuss how we can help transform your business
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Full Name</label>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleInputChange}
                          required disabled={isSubmitting} placeholder="e.g., John Doe"
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-sm hover:border-cyan-400/70 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">Email Address</label>
                        <input
                          type="email" name="email" value={formData.email} onChange={handleInputChange}
                          required disabled={isSubmitting} placeholder="e.g., john@company.com"
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-sm hover:border-cyan-400/70 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">Mobile Number</label>
                      <input
                        type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange}
                        required disabled={isSubmitting} placeholder="e.g., +91 98765 43210"
                        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-sm hover:border-cyan-400/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">Your Message</label>
                      <textarea
                        name="message" value={formData.message} onChange={handleInputChange}
                        required rows={4} disabled={isSubmitting} placeholder="Share your thoughts or inquiries..."
                        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 resize-none text-sm hover:border-cyan-400/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="bg-green-50 border border-green-400/40 rounded-xl p-4 text-green-800 text-center">
                        <div className="text-lg font-semibold">Message sent successfully!</div>
                        <div className="text-sm mt-1 text-green-700">We&apos;ll get back to you soon.</div>
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-400/40 rounded-xl p-4 text-red-700 text-center">
                        <div className="text-lg font-semibold">Error sending message</div>
                        <div className="text-sm mt-1">{errorMessage || 'Please try again.'}</div>
                      </div>
                    )}

                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700" />
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* We are available */}
          <div className="mt-16 lg:mt-24 mb-16 lg:mb-24 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.4s' }}>
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 lg:p-10 overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-500/70 to-transparent" />
                  <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-cyan-500/70 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-500/70 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-500/70 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                        We are available
                      </span>
                    </h3>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                      Ready to connect? Reach out to us directly through any of the channels below for immediate assistance.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {[
                      {
                        icon: <><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></>,
                        label: 'Email Address', value: 'info@thegttech.com', href: 'mailto:info@thegttech.com', sub: 'Drop us a line anytime',
                      },
                      {
                        icon: <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />,
                        label: 'Phone Number', value: '+91 9840015963', href: 'tel:+919840015963', sub: 'Call us for immediate support',
                      },
                    ].map((item) => (
                      <div key={item.label} className="group">
                        <div className="relative bg-white/80 border border-cyan-300/50 rounded-2xl p-6 lg:p-8 hover:border-cyan-400/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/15 flex items-center space-x-4">
                          <div className="flex-shrink-0 w-14 h-14 bg-white/80 border border-cyan-300/60 rounded-xl flex items-center justify-center group-hover:border-cyan-400/80 transition-all duration-300 group-hover:scale-110">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">{item.icon}</svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{item.label}</p>
                            <a href={item.href} className="text-gray-800 text-lg font-semibold hover:text-cyan-700 transition-colors duration-300 break-all inline-block">{item.value}</a>
                            <p className="text-gray-400 text-sm mt-1">{item.sub}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 lg:mt-10 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
                      <div className="w-1 h-1 bg-cyan-500/60 rounded-full animate-pulse" />
                      <span>Available Monday to Friday, 9 AM – 6 PM IST</span>
                      <div className="w-1 h-1 bg-cyan-500/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-data-flow { animation: data-flow 3s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
      `}</style>
    </main>
  )
}

export default ContactPage
