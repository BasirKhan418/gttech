'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

interface EnquiryFormData {
  fullName: string
  organizationName: string
  designation: string
  industrySector: string
  interestedIn: string[]
  productSolution: string
  businessRequirement: string
  briefRequirement: string
  email: string
  mobile: string
  city: string
  state: string
}

interface SubmitResponse {
  success: boolean
  message: string
}

const DESIGNATIONS = [
  'CXO / Director',
  'Business Head',
  'Plant Head',
  'Engineering Head',
  'Operations Head',
  'IT Head',
  'Faculty / Professor',
  'Research Scholar',
  'Student',
  'Consultant',
  'Other',
]

const INDUSTRY_SECTORS = [
  'Automotive',
  'Aerospace & Defense',
  'Railways',
  'Shipbuilding & Marine',
  'Construction & Infrastructure',
  'Manufacturing',
  'Mining',
  'Energy & Utilities',
  'Education & Academia',
  'Life Sciences & Pharma',
  'Government',
  'IT & Services',
  'Other',
]

const INTEREST_CATEGORIES = [
  {
    name: 'Software Products',
    options: ['BIOVIA', 'GEOVIA', 'GT HRMS', 'GT LMS'],
  },
  {
    name: 'Academia & Skilling',
    options: ['Centre of Excellence Setup', 'Faculty Development Program', 'Student Skill Development', 'Industry Certification Programs'],
  },
  {
    name: 'Industrial Services',
    options: ['Product Design & Development', 'Consulting', 'AR/VR/MR Solutions', 'Resource Augmentation'],
  },
]

const PRODUCTS_SOLUTIONS = [
  'CATIA',
  'ENOVIA',
  'DELMIA',
  'SIMULIA',
  'BIOVIA',
  '3DEXPERIENCE Platform',
  'GEOVIA',
  'AR/VR Solutions',
  'Digital Twin',
  'AI Solutions',
  'Robotics',
  'Drone Solutions',
  '3D Printing',
  'EV Solutions',
  'Engineering Services',
  'Software Development',
  'Not Sure – Need Consultation',
]

const BUSINESS_REQUIREMENTS = [
  'Product Evaluation / Demo',
  'Pricing Request',
  'Proof of Concept',
  'Pilot Project',
  'New Implementation',
  'Upgrade Existing System',
  'Training Requirement',
  'Consulting Requirement',
  'Partnership Opportunity',
  'RFP / Tender Discussion',
]

const inputClass =
  'w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-cyan-300/60 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-xs hover:border-cyan-400/70 disabled:opacity-50 disabled:cursor-not-allowed'

const labelClass = 'block text-gray-700 font-semibold mb-1 text-xs'

const EnquiryPage = () => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    organizationName: '',
    designation: '',
    industrySector: '',
    interestedIn: [],
    productSolution: '',
    businessRequirement: '',
    briefRequirement: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-fade-in-up')
        })
      },
      { threshold: 0.1 }
    )
    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitStatus === 'error') {
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }

  const handleCheckboxChange = (option: string) => {
    setFormData((prev) => {
      const already = prev.interestedIn.includes(option)
      return {
        ...prev,
        interestedIn: already
          ? prev.interestedIn.filter((o) => o !== option)
          : [...prev.interestedIn, option],
      }
    })
  }

  const validateForm = (): boolean => {
    // Mandatory per webhook: full_name and phone
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setErrorMessage('Full name is required (minimum 2 characters)')
      return false
    }
    if (!formData.mobile.trim()) {
      setErrorMessage('Phone number is required')
      return false
    }
    const cleanPhone = formData.mobile.replace(/[^\d]/g, '')
    if (cleanPhone.length < 10) {
      setErrorMessage('Invalid phone number. Must be at least 10 digits.')
      return false
    }
    // Additional form validations
    if (!formData.organizationName.trim()) {
      setErrorMessage('Please enter your organization / institute name')
      return false
    }
    if (!formData.designation) {
      setErrorMessage('Please select your designation')
      return false
    }
    if (!formData.industrySector) {
      setErrorMessage('Please select your industry sector')
      return false
    }
    if (formData.interestedIn.length === 0) {
      setErrorMessage('Please select at least one area of interest')
      return false
    }
    if (!formData.briefRequirement.trim() || formData.briefRequirement.length < 10) {
      setErrorMessage('Please describe your requirement (minimum 10 characters)')
      return false
    }
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address')
        return false
      }
    }
    return true
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      organizationName: '',
      designation: '',
      industrySector: '',
      interestedIn: [],
      productSolution: '',
      businessRequirement: '',
      briefRequirement: '',
      email: '',
      mobile: '',
      city: '',
      state: '',
    })
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
      // Map form fields to webhook field names
      const payload = {
        full_name: formData.fullName.trim(),
        organization_name: formData.organizationName.trim(),
        designation: formData.designation,
        industry_sector: formData.industrySector,
        interested_in: formData.interestedIn,
        email: formData.email.trim(),
        phone: formData.mobile.trim(),
      }

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        resetForm()
        setTimeout(() => setSubmitStatus('idle'), 6000)
      } else {
        throw new Error(result.error || result.message || 'Failed to submit enquiry')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      <Navbar />

      {/* Grid background */}
      <div className="absolute inset-0 opacity-8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: 10, top: 20, delay: 0, duration: 4 },
          { left: 80, top: 15, delay: 1, duration: 5 },
          { left: 25, top: 70, delay: 2, duration: 3.5 },
          { left: 60, top: 40, delay: 0.5, duration: 4.5 },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
              i % 2 === 0 ? 'bg-cyan-400/60' : 'bg-cyan-200/40'
            }`}
            style={{ left: `${p.left}%`, top: `${p.top}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
          />
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

      <section className="relative z-10 pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

            {/* ── Left hero panel ── */}
            <div className="lg:col-span-2 animate-on-scroll opacity-0 translate-y-10 lg:sticky lg:top-28">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Ready to</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Transform?
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Whether you&apos;re interested in our cutting-edge solutions, need expert consultation,
                or just want to explore possibilities, we&apos;d love to hear from you.
              </p>

              <div className="space-y-8">
                {[
                  {
                    title: 'Quick Response',
                    desc: 'We typically respond within 24 hours with detailed insights and next steps for your project requirements.',
                    delay: '0s',
                  },
                  {
                    title: 'Expert Consultation',
                    desc: 'Personalized solutions tailored to your specific needs with our team of industry-certified professionals.',
                    delay: '0.5s',
                  },
                  {
                    title: 'Innovation Focus',
                    desc: 'Cutting-edge technology solutions that drive digital transformation and sustainable business growth.',
                    delay: '1s',
                  },
                ].map((item, i) => (
                  <div key={i} className="relative group">
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
                    {i < 2 && <div className="absolute left-6 top-12 w-px h-8 bg-gradient-to-b from-cyan-500/40 to-transparent" />}
                  </div>
                ))}
              </div>

              {/* Contact info card */}
              <div className="mt-10 p-5 bg-white/60 backdrop-blur-sm border border-cyan-300/50 rounded-2xl">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Direct Contact</p>
                <a href="mailto:info@thegttech.com" className="flex items-center space-x-3 text-gray-700 hover:text-cyan-700 transition-colors mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">info@thegttech.com</span>
                </a>
                <a href="tel:+919840015963" className="flex items-center space-x-3 text-gray-700 hover:text-cyan-700 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">+91 9840015963</span>
                </a>
                <p className="text-xs text-gray-400 mt-3 ml-11">Mon – Fri, 9 AM – 6 PM IST</p>
              </div>
            </div>

            {/* ── Right: Enquiry Form ── */}
            <div className="lg:col-span-3 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.2s' }}>
              <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-500/70 to-transparent" />
                  <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-cyan-500/70 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-500/70 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-500/70 to-transparent" />
                </div>

                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-cyan-200/50">
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                      Enquiry Form
                    </h2>
                    <p className="text-gray-400 text-xs">Fields marked <span className="text-red-500">*</span> are required</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Section 1 */}
                    <div>
                      <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                        <span className="w-4 h-4 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                        <span>Personal &amp; Organisation Details</span>
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required disabled={isSubmitting} placeholder="Rajesh Kumar" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Organisation / Institute <span className="text-red-500">*</span></label>
                          <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} required disabled={isSubmitting} placeholder="Tata Motors Ltd." className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                          <select name="designation" value={formData.designation} onChange={handleInputChange} required disabled={isSubmitting} className={inputClass}>
                            <option value="">Select designation</option>
                            {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Industry Sector <span className="text-red-500">*</span></label>
                          <select name="industrySector" value={formData.industrySector} onChange={handleInputChange} required disabled={isSubmitting} className={inputClass}>
                            <option value="">Select industry</option>
                            {INDUSTRY_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2 — Interests */}
                    <div>
                      <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                        <span className="w-4 h-4 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                        <span>I am Interested In <span className="text-red-500">*</span></span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {INTEREST_CATEGORIES.map((cat) => (
                          <div key={cat.name} className="bg-white/60 border border-cyan-200/60 rounded-xl p-2.5">
                            <p className="text-xs font-bold text-gray-700 mb-1.5 flex items-center space-x-1">
                              <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                              <span>{cat.name}</span>
                            </p>
                            <div className="space-y-1">
                              {cat.options.map((opt) => {
                                const checked = formData.interestedIn.includes(opt)
                                return (
                                  <label
                                    key={opt}
                                    onClick={() => !isSubmitting && handleCheckboxChange(opt)}
                                    className={`flex items-center space-x-1.5 cursor-pointer rounded-lg px-2 py-1 border transition-all duration-150 select-none ${
                                      checked ? 'bg-cyan-50 border-cyan-400/70 text-cyan-800' : 'bg-white/50 border-gray-200/70 text-gray-600 hover:border-cyan-300/70 hover:bg-cyan-50/40'
                                    }`}
                                  >
                                    <span className={`flex-shrink-0 w-3 h-3 rounded border-2 flex items-center justify-center transition-all duration-150 ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 bg-white'}`}>
                                      {checked && (
                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </span>
                                    <span className="text-xs leading-tight">{opt}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3 */}
                    <div>
                      <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                        <span className="w-4 h-4 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                        <span>Product &amp; Requirement Details</span>
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Product / Solution of Interest</label>
                          <select name="productSolution" value={formData.productSolution} onChange={handleInputChange} disabled={isSubmitting} className={inputClass}>
                            <option value="">Select product / solution</option>
                            {PRODUCTS_SOLUTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Business Requirement <span className="text-red-500">*</span></label>
                          <select name="businessRequirement" value={formData.businessRequirement} onChange={handleInputChange} required disabled={isSubmitting} className={inputClass}>
                            <option value="">Select requirement type</option>
                            {BUSINESS_REQUIREMENTS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Brief Requirement <span className="text-red-500">*</span></label>
                          <textarea name="briefRequirement" value={formData.briefRequirement} onChange={handleInputChange} required rows={2} disabled={isSubmitting} placeholder="Please describe your challenge, project, or objective." className={`${inputClass} resize-none`} />
                        </div>
                      </div>
                    </div>

                    {/* Section 4 */}
                    <div>
                      <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                        <span className="w-4 h-4 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                        <span>Contact Details <span className="text-red-500">*</span></span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={isSubmitting} placeholder="name@company.com" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Mobile <span className="text-red-500">*</span></label>
                          <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required disabled={isSubmitting} placeholder="+91 98765 43210" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>City <span className="text-red-500">*</span></label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} required disabled={isSubmitting} placeholder="Chennai" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>State <span className="text-red-500">*</span></label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} required disabled={isSubmitting} placeholder="Tamil Nadu" className={inputClass} />
                        </div>
                      </div>
                    </div>

                    {submitStatus === 'success' && (
                      <div className="bg-green-50 border border-green-400/40 rounded-xl p-3 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-800">Enquiry Submitted!</p>
                          <p className="text-xs text-green-700">Our team will get back to you within 24 hours.</p>
                        </div>
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-400/40 rounded-xl p-3 text-red-700 text-xs font-semibold">
                        {errorMessage || 'Please fix the errors above and try again.'}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-bold text-sm hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700" />
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* We are available strip */}
          <div className="mt-16 mb-10 animate-on-scroll opacity-0 translate-y-10" style={{ animationDelay: '0.4s' }}>
            <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-300/50 rounded-3xl p-8 lg:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-500/70 to-transparent" />
                <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-cyan-500/70 to-transparent" />
                <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-cyan-500/70 to-transparent" />
                <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-cyan-500/70 to-transparent" />
              </div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">We are available</span>
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">Ready to connect? Reach out to us directly through any of the channels below for immediate assistance.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: <><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></>, label: 'Email Address', value: 'info@thegttech.com', href: 'mailto:info@thegttech.com', sub: 'Drop us a line anytime' },
                    { icon: <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />, label: 'Phone Number', value: '+91 9840015963', href: 'tel:+919840015963', sub: 'Call us for immediate support' },
                  ].map((item) => (
                    <div key={item.label} className="group">
                      <div className="relative bg-white/80 border border-cyan-300/50 rounded-2xl p-6 hover:border-cyan-400/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/15 flex items-center space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-white/80 border border-cyan-300/60 rounded-xl flex items-center justify-center group-hover:border-cyan-400/80 transition-all duration-300">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">{item.icon}</svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                          <a href={item.href} className="text-gray-800 text-lg font-semibold hover:text-cyan-700 transition-colors duration-300">{item.value}</a>
                          <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="w-1 h-1 bg-cyan-500/70 rounded-full animate-pulse" />
                    <span>Available Monday to Friday, 9 AM – 6 PM IST</span>
                    <div className="w-1 h-1 bg-cyan-500/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
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

export default EnquiryPage
