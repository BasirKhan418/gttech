import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminLogin from '../../utils/admin/login-page';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '/career' },
      { name: 'Gallery', href: '/gallery' }
    ],
    industries: [
      { name: 'Automotive', href: '/industries/automotive' },
      { name: 'Aerospace', href: '/industries/aerospace' },
      { name: 'Railways', href: '/industries/railways' },
      { name: 'Smart Cities', href: '/industries/smartcities' }
    ],
    // support: [
    //   { name: 'Contact Us', href: '/contact' },
    //   { name: 'Support Center', href: '/support' },
    //   { name: 'Documentation', href: '/docs' },
    //   { name: 'Privacy Policy', href: '/privacy' }
    // ]
  }

  const socialLinks = [
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'GitHub', href: '#', icon: '💻' },
    { name: 'YouTube', href: '#', icon: '📺' }
  ]

  return (
    <footer className="bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-950 border-t border-cyan-300/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400/20 rounded-full animate-float hidden lg:block"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-cyan-300/25 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-60 right-10 w-1 h-1 bg-cyan-200/20 rounded-full animate-float hidden lg:block" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-white/10 rounded-xl blur-sm"></div>
                  <div className="relative">
                    <Image
                      src="/logo.png"
                      alt='GT Technologies Logo'
                      width={200}
                      height={100}
                    />
                  </div>
                </div>
              </Link>
              
              <p className="text-cyan-100/80 mb-6 leading-relaxed">
                Leading digital transformation with cutting-edge engineering solutions, 
                Industry 4.0 technologies, and innovative design services across multiple industries.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-cyan-300/30 rounded-lg flex items-center justify-center text-xl hover:bg-cyan-400/20 hover:border-cyan-300/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-cyan-500/20"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-6 bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">Company</h3>
                  <ul className="space-y-4">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-cyan-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 transform inline-block hover:text-cyan-100"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

               {/*<div>
                  <h3 className="text-white font-semibold text-lg mb-6 bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">Support</h3>
                  <ul className="space-y-4">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-cyan-200/80 hover:text-white transition-all duration-300 hover:translate-x-1 transform inline-block hover:text-cyan-100"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>*/}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-cyan-300/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-cyan-200 via-white to-cyan-300 bg-clip-text text-transparent">
                  Stay Updated
                </span>
              </h3>
              <p className="text-cyan-100/80">
                Get the latest insights on digital transformation and Industry 4.0 trends.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-cyan-300/30 rounded-lg text-white placeholder-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300/60 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30">
                Subscribe
              </button>
              <br/>
              <Link href="/login">
               <button className="px-6 py-3 bg-white/90 text-cyan-800 rounded-lg font-semibold hover:bg-white hover:text-cyan-900 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/20 border border-cyan-300/30">
                Admin Login
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-cyan-300/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-cyan-200/80 text-sm">
              © 2025 GramTarang Technologies. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-cyan-200/80">
              <Link href="/privacy" className="hover:text-cyan-100 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan-100 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-cyan-100 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-cyan-200/80">
              <span>Made with ❤️ By</span>
              <Link href="https://www.devsomeware.com/" target="_blank" className="text-cyan-400 hover:underline">
                DevSomeware
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>
    </footer>
  )
}

export default Footer