'use client'
import React, { useState } from 'react'
import { 
  Upload, 
  FileText, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  ArrowRight
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

interface FormData {
  name: string
  email: string
  phone: string
  budget: string
  projectType: 'solution' | 'consultancy' | ''
  requirementsPdf: string
  estimatedBudget: string
}

const GAQPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    budget: '',
    projectType: '',
    requirementsPdf: '',
    estimatedBudget: ''
  })
  
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')

  const budgetRanges = [
    'Rs.5,000 - Rs.10,000',
    'Rs.10,000 - Rs.25,000',
    'Rs.25,000 - Rs.50,000',
    'Rs.50,000 - Rs.100,000',
    'Rs.100,000 - Rs.250,000',
    'Rs.250,000+'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB')
      return
    }

    try {
      setUploading(true)
      
      // Get signed URL
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadURL, fileURL } = await uploadResponse.json()

      // Upload file to S3
      const s3Response = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!s3Response.ok) {
        throw new Error('Failed to upload file')
      }

      setFormData(prev => ({ ...prev, requirementsPdf: fileURL }))
      setUploadedFileName(file.name)
      toast.success('Requirements PDF uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return false
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    if (!formData.phone.trim()) {
      toast.error('Phone number is required')
      return false
    }
    
    if (!formData.budget) {
      toast.error('Budget range is required')
      return false
    }
    
    if (!formData.projectType) {
      toast.error('Project type is required')
      return false
    }
    
    if (!formData.requirementsPdf) {
      toast.error('Requirements PDF is required')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setSubmitting(true)
      
      const response = await fetch('/api/gaq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        toast.success('Quote request submitted successfully!')
      } else {
        toast.error(data.message || 'Failed to submit quote request')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to submit quote request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      budget: '',
      projectType: '',
      requirementsPdf: '',
      estimatedBudget: ''
    })
    setSubmitted(false)
    setUploadedFileName('')
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <Toaster position="top-right" richColors />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/50">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Quote Request Submitted!
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for your interest in GT Technologies. We've received your quote request 
                  and will review your requirements. Our team will get back to you within 24-48 hours 
                  with a detailed proposal.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={resetForm}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Submit Another Request
                  </button>
                  
                  <a
                    href="/"
                    className="block w-full px-6 py-3 bg-white/80 border-2 border-cyan-400/60 text-cyan-700 rounded-xl font-semibold hover:bg-cyan-50/80 transition-all duration-300 text-center"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      <Toaster position="top-right" richColors />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-cyan-400/40' : i % 3 === 1 ? 'bg-cyan-300/30' : 'bg-cyan-200/20'
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

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-lg">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="font-medium">Get A Quote</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              <span className="block">Get Your Custom</span>
              <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                Project Quote
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Share your project requirements and budget with us. Our experts will provide you with 
              a detailed proposal tailored to your specific needs.
            </p>
          </div>

          {/* Form */}
          <div className="relative bg-white/80 backdrop-blur-xl border border-cyan-300/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
            
            <div className="relative z-10 p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-800 font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-white/70 border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-800 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-600" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@company.com"
                      className="w-full px-4 py-3 bg-white/70 border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-800 font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-cyan-600" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 00000-0000"
                      className="w-full px-4 py-3 bg-white/70 border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-800 font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-cyan-600" />
                      Budget Range *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/70 border border-cyan-300/60 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 transition-all duration-300"
                      required
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Type */}
                <div className="space-y-4">
                  <label className="text-gray-800 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600" />
                    Project Type *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        value="solution"
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-6 bg-white/60 border rounded-xl transition-all duration-300 ${
                        formData.projectType === 'solution' 
                          ? 'border-cyan-400 bg-cyan-50/60 shadow-md' 
                          : 'border-gray-300 hover:border-cyan-300'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.projectType === 'solution' 
                              ? 'bg-cyan-500 border-cyan-500' 
                              : 'border-gray-300'
                          }`}>
                            {formData.projectType === 'solution' && (
                              <div className="w-full h-full bg-white rounded-full scale-50"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">Technology Solutions</h3>
                            <p className="text-sm text-gray-600">Custom software, automation, AR/VR implementations</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        value="consultancy"
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-6 bg-white/60 border rounded-xl transition-all duration-300 ${
                        formData.projectType === 'consultancy' 
                          ? 'border-cyan-400 bg-cyan-50/60 shadow-md' 
                          : 'border-gray-300 hover:border-cyan-300'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.projectType === 'consultancy' 
                              ? 'bg-cyan-500 border-cyan-500' 
                              : 'border-gray-300'
                          }`}>
                            {formData.projectType === 'consultancy' && (
                              <div className="w-full h-full bg-white rounded-full scale-50"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">Strategic Consultancy</h3>
                            <p className="text-sm text-gray-600">Digital transformation, process optimization</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Requirements PDF Upload */}
                <div className="space-y-4">
                  <label className="text-gray-800 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-600" />
                    Project Requirements (PDF) *
                  </label>
                  
                  {formData.requirementsPdf ? (
                    <div className="p-6 bg-green-50/60 border border-green-400/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">PDF Uploaded Successfully</p>
                            <p className="text-sm text-green-600">{uploadedFileName}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, requirementsPdf: '' }))
                            setUploadedFileName('')
                          }}
                          className="px-4 py-2 text-green-700 hover:text-green-800 font-medium"
                        >
                          Change File
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-cyan-300/60 rounded-xl p-8 text-center hover:border-cyan-400/70 transition-colors duration-300">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                        disabled={uploading}
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        {uploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
                            <p className="text-cyan-700 font-medium">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-cyan-600 mb-3" />
                            <p className="text-cyan-700 font-medium mb-1">Click to upload requirements PDF</p>
                            <p className="text-sm text-gray-600">Or drag and drop your file here</p>
                            <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  )}
                  
                  <div className="bg-cyan-50/60 border border-cyan-300/50 rounded-xl p-4">
                    <h4 className="font-medium text-cyan-800 mb-2">What to include in your requirements:</h4>
                    <ul className="text-sm text-cyan-700 space-y-1">
                      <li>• Project scope and objectives</li>
                      <li>• Technical specifications and features needed</li>
                      <li>• Timeline and delivery expectations</li>
                      <li>• Existing systems and integration requirements</li>
                      <li>• Any specific technologies or platforms preferred</li>
                    </ul>
                  </div>
                </div>

                {/* Estimated Budget (Optional) */}
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-600" />
                    Additional Budget Notes (Optional)
                  </label>
                  <textarea
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    placeholder="Any additional information about your budget, timeline, or specific requirements..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/70 border border-cyan-300/60 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/70 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        Submit Quote Request
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-gray-600 mt-4">
                    We'll review your requirements and get back to you within 24-48 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

export default GAQPage