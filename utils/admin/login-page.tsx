"use client"
import Image from "next/image"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Shield, Lock, Mail } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Login attempt with:", { email, password })
      setError("Demo mode - login simulation complete")
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonClick = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Login attempt with:", { email, password })
      // Redirect would happen here
      setError("Demo mode - login simulation complete")
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-950 to-black relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-float ${
              i % 3 === 0 ? 'bg-sky-400/30' : i % 3 === 1 ? 'bg-cyan-400/20' : 'bg-white/15'
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
      <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-32 overflow-hidden opacity-20">
        <div className="relative h-full">
          {/* Data Stream Effect */}
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-sky-400/30 to-transparent animate-data-flow"
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
                <div className={`rounded-full border ${i % 2 === 0 ? 'border-sky-400/40' : 'border-white/20'} ${i % 3 === 0 ? 'w-2 h-2' : 'w-1 h-1'}`}>
                  <div className={`rounded-full w-full h-full animate-ping ${i % 2 === 0 ? 'bg-sky-400/20' : 'bg-white/10'}`}
                       style={{ animationDelay: `${i * 0.8}s` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Circuit Tech Pattern (Mirrored) */}
      <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-32 overflow-hidden opacity-20">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-data-flow"
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          
          {/* Logo Section */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="relative group inline-block">
              {/* Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/10 to-cyan-400/10 rounded-xl blur-lg"></div>
              
              {/* Logo Container */}
              <div className="relative mt-16  bg-slate-900/80 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-6 lg:p-8 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/5 via-transparent to-cyan-500/5"></div>
                
                <div className="relative z-10">
                 <Image
                  src="/logo.png"
                  width={150}
                  height={150}
                  alt="oops"
                 />
                </div>
                
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-sky-400/60 rounded-tl-lg"></div>
                <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-cyan-400/60 rounded-tr-lg"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-cyan-400/60 rounded-bl-lg"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-sky-400/60 rounded-br-lg"></div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-sky-200 to-cyan-200 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-slate-400 text-sm lg:text-base flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-sky-400" />
                Secure Access Dashboard
              </p>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-3xl blur-lg"></div>
            
            {/* Main Form */}
            <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Glass Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.08] via-transparent to-cyan-500/[0.05]"></div>
              
              {/* Animated Border Shine */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent animate-border-shine"></div>
              </div>

              <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-slate-400 text-sm lg:text-base">Enter your credentials to access the admin dashboard</p>
                </div>

                {/* Form */}
                <div className="space-y-6 lg:space-y-8">
                  
                  {/* Error Alert */}
                  {error && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/10 rounded-xl blur-sm"></div>
                      <Alert variant="destructive" className="relative bg-red-500/20 border-red-400/50 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-200">{error}</AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-white font-medium flex items-center gap-2 text-sm lg:text-base">
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-sky-400" />
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
                        className="h-12 lg:h-14 text-base lg:text-lg bg-black/20 backdrop-blur-sm border-sky-500/30 text-white placeholder-slate-400 focus:border-sky-400/60 focus:ring-sky-400/30 transition-all duration-300 hover:border-sky-400/50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-cyan-500/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-white font-medium flex items-center gap-2 text-sm lg:text-base">
                      <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-sky-400" />
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
                        className="h-12 lg:h-14 text-base lg:text-lg bg-black/20 backdrop-blur-sm border-sky-500/30 text-white placeholder-slate-400 focus:border-sky-400/60 focus:ring-sky-400/30 transition-all duration-300 hover:border-sky-400/50 pr-12 lg:pr-14"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 lg:h-12 w-10 lg:w-12 text-slate-400 hover:text-white hover:bg-sky-500/20 transition-all duration-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                        )}
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-cyan-500/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    onClick={handleButtonClick} 
                    disabled={isLoading}
                    className="w-full h-12 lg:h-16 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-base lg:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-sky-400/50 backdrop-blur-sm group relative overflow-hidden"
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
                  <div className="text-center pt-4 lg:pt-6 border-t border-sky-500/20">
                    <p className="text-xs lg:text-sm text-slate-500 mb-2">
                      Secure admin access powered by GT Technologies
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs lg:text-sm text-slate-600">
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
                      className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-sky-400/60 rounded-full animate-pulse backdrop-blur-sm"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 lg:mt-12 text-center">
            <p className="text-xs lg:text-sm text-slate-500">
              © 2025 GT Technologies. All rights reserved.
            </p>
            <p className="text-xs lg:text-sm text-slate-600 mt-1">
              Admin Panel v2.0 - Secure Access Portal
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="fixed top-4 lg:top-8 right-4 lg:right-8 w-8 h-8 lg:w-12 lg:h-12 border-2 border-sky-400/20 rounded-xl rotate-45 animate-pulse backdrop-blur-sm bg-white/5 pointer-events-none"></div>
      <div className="fixed bottom-4 lg:bottom-8 left-4 lg:left-8 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full animate-bounce backdrop-blur-sm pointer-events-none"></div>
      <div className="fixed top-16 lg:top-20 left-16 lg:left-20 w-2 h-2 bg-white/40 rounded-full animate-ping pointer-events-none"></div>

      {/* Additional Mobile Decorative Elements */}
      <div className="fixed top-1/4 right-4 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse pointer-events-none lg:hidden"></div>
      <div className="fixed bottom-1/4 left-4 w-1 h-1 bg-sky-400/60 rounded-full animate-ping pointer-events-none lg:hidden"></div>

    </div>
  )
}