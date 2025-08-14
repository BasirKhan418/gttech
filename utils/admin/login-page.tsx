"use client"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Shield, Lock, Mail } from "lucide-react"
import { toast ,Toaster} from "sonner"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Login successful - you can redirect here
        console.log("Login successful:", data.message)
        // Example: window.location.href = '/admin/dashboard'
        // Or use Next.js router: router.push('/admin/dashboard')
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await handleLogin()
  }

  const handleButtonClick = async () => {
    await handleLogin()
  }

  // Prevent hydration mismatch by not rendering dynamic content on server
  if (!isClient) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      <Toaster/>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              i % 3 === 0 ? 'bg-cyan-400/60' : i % 3 === 1 ? 'bg-cyan-300/40' : 'bg-cyan-200/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Left Side - Circuit Tech Pattern */}
      <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-32 overflow-hidden opacity-40">
        <div className="relative h-full">
          {/* Data Stream Effect */}
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse"
                style={{
                  left: `${i * 20}%`,
                  height: '100%',
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: '4s'
                }}
              ></div>
            ))}
          </div>

          {/* Circuit Nodes */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  top: `${15 + (i * 10)}%`,
                  left: `${20 + (i % 2) * 30}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                <div className={`rounded-full border ${i % 2 === 0 ? 'border-cyan-500/40' : 'border-cyan-300/30'} ${i % 3 === 0 ? 'w-2 h-2' : 'w-1 h-1'}`}>
                  <div className={`rounded-full w-full h-full animate-ping ${i % 2 === 0 ? 'bg-cyan-400/30' : 'bg-cyan-300/20'}`}
                       style={{ animationDelay: `${i * 0.8}s` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Circuit Tech Pattern (Mirrored) */}
      <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-32 overflow-hidden opacity-40">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse"
                style={{
                  right: `${i * 20}%`,
                  height: '100%',
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: '4s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-4">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          
          {/* Logo Section */}
          <div className="text-center mb-4 lg:mb-4">
            <div className="relative group inline-block">
              {/* Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-600/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-300/10 to-cyan-500/10 rounded-xl blur-lg"></div>
              
              {/* Logo Container */}
              <div className="relative mt-16 bg-white/80 backdrop-blur-xl border border-cyan-400/40 rounded-2xl p-6 lg:p-8 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                
                <div className="relative z-10 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="GT Technologies Logo"
                    width={180}
                    height={64}
                  />
                </div>
                
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-cyan-500/60 rounded-tl-lg"></div>
                <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-cyan-400/60 rounded-tr-lg"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-cyan-400/60 rounded-bl-lg"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-cyan-500/60 rounded-br-lg"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-800 via-cyan-600 to-cyan-700 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-gray-600 text-sm lg:text-base flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-600" />
                Secure Access Dashboard
              </p>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 rounded-3xl blur-lg"></div>
            
            {/* Main Form */}
            <div className="relative bg-white/80 backdrop-blur-2xl border border-cyan-400/40 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
              
              {/* Animated Border Shine */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-20"></div>
              </div>

              <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                  <p className="text-gray-600 text-sm lg:text-base">Enter your credentials to access the admin dashboard</p>
                </div>

                {/* Form */}
                <div className="space-y-6 lg:space-y-8">
                  
                  {/* Error Alert */}
                  {error && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/10 rounded-xl blur-sm"></div>
                      <Alert variant="destructive" className="relative bg-red-50/80 border-red-300/60 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-800 font-medium flex items-center gap-2 text-sm lg:text-base">
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-600" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@gttech.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 lg:h-14 text-base lg:text-lg bg-white/60 backdrop-blur-sm border-cyan-600/50 text-gray-800 placeholder-gray-500 focus:border-cyan-500/80 focus:ring-cyan-400/30 transition-all duration-300 hover:border-cyan-400/70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-cyan-300/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-gray-800 font-medium flex items-center gap-2 text-sm lg:text-base">
                      <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-600" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 lg:h-14 text-base lg:text-lg bg-white/60 backdrop-blur-sm border-cyan-600/50 text-gray-800 placeholder-gray-500 focus:border-cyan-500/80 focus:ring-cyan-400/30 transition-all duration-300 hover:border-cyan-400/70 pr-12 lg:pr-14"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-cyan-300/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    onClick={handleButtonClick}
                    className="w-full h-12 lg:h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold text-base lg:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-cyan-400/50 backdrop-blur-sm group relative overflow-hidden"
                  >
                    {/* Button Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700"></div>
                    
                    {isLoading ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 lg:gap-3 relative z-10">
                        <Shield className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span>Access Admin Panel</span>
                      </div>
                    )}
                  </Button>

                  {/* Additional Info */}
                  <div className="text-center pt-4 lg:pt-6 border-t border-cyan-300/40">
                    <p className="text-xs lg:text-sm text-gray-500 mb-2">
                      Secure admin access powered by GT Technologies
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs lg:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        System Online
                      </span>
                      <span>•</span>
                      <span>SSL Protected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-30">
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-cyan-500/60 rounded-full animate-pulse backdrop-blur-sm"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 lg:mt-12 text-center">
            <p className="text-xs lg:text-sm text-gray-500">
              © 2025 GT Technologies. All rights reserved.
            </p>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">
              Admin Panel v2.0 - Secure Access Portal
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="fixed top-4 lg:top-8 right-4 lg:right-8 w-8 h-8 lg:w-12 lg:h-12 border-2 border-cyan-400/40 rounded-xl rotate-45 animate-pulse backdrop-blur-sm bg-white/20 pointer-events-none"></div>
      <div className="fixed bottom-4 lg:bottom-8 left-4 lg:left-8 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-cyan-400/30 to-cyan-500/30 rounded-full animate-bounce backdrop-blur-sm pointer-events-none"></div>
      <div className="fixed top-16 lg:top-20 left-16 lg:left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-ping pointer-events-none"></div>

      {/* Additional Mobile Decorative Elements */}
      <div className="fixed top-1/4 right-4 w-1 h-1 bg-cyan-500/60 rounded-full animate-pulse pointer-events-none lg:hidden"></div>
      <div className="fixed bottom-1/4 left-4 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse pointer-events-none lg:hidden"></div>

    </div>
  )
}