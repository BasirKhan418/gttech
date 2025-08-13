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
      { name: 'News & Updates', href: '/news' }
    ],
    services: [
      { name: 'Digital Product Design', href: '/services/design' },
      { name: 'Industry 4.0 Solutions', href: '/services/industry40' },
      { name: 'Smart City Solutions', href: '/services/smartcity' },
      { name: 'Engineering Services', href: '/services/engineering' }
    ],
    industries: [
      { name: 'Automotive', href: '/industries/automotive' },
      { name: 'Aerospace', href: '/industries/aerospace' },
      { name: 'Railways', href: '/industries/railways' },
      { name: 'Smart Cities', href: '/industries/smartcities' }
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Support Center', href: '/support' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Privacy Policy', href: '/privacy' }
    ]
  }

  const socialLinks = [
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'GitHub', href: '#', icon: '💻' },
    { name: 'YouTube', href: '#', icon: '📺' }
  ]

  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <Image
                src="/logo.png"
                alt='none'
                width={200}
                height={100}/>
              </Link>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Leading digital transformation with cutting-edge engineering solutions, 
                Industry 4.0 technologies, and innovative design services across multiple industries.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
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
                  <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
                  <ul className="space-y-4">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">Services</h3>
                  <ul className="space-y-4">
                    {footerLinks.services.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">Industries</h3>
                  <ul className="space-y-4">
                    {footerLinks.industries.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
                  <ul className="space-y-4">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-white/10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Get the latest insights on digital transformation and Industry 4.0 trends.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
              <br/>
              <Link href="/login">
               <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                Admin-Login
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 GramTarang Technologies. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer