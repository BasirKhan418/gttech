'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Industry & Value Solution', href: '/industries' },
    { name: 'Products', href: '/project', hasDropdown: true },
    { name: 'Future Skills', href: 'https://futureskills.thegttech.com', external: true, target: '_blank' },
    { name: 'Contact', href: '/contact' }
  ]

  // Product categories for dropdown
  const productCategories = [
    { name: 'Software Products', href: '/category/Software%20products'},
    { name: 'SAAP', href: '/category/saap'},
    { name: 'Electric Vehicles', href: '/category/electric%20vehicles'},
    { name: 'Furnitures', href: '/category/furnitures'},
    { name: 'Garments', href: '/category/garments'},
  ]

  // Handle dropdown hover with delay
  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setIsProductsDropdownOpen(true)
  }

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setIsProductsDropdownOpen(false)
    }, 300) // 300ms delay before closing
    setDropdownTimeout(timeout)
  }

  return (
    <nav className={` fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'backdrop-blur-xl bg-white border-b border-cyan-300/60 shadow-lg shadow-cyan-500/25' 
        : 'backdrop-blur-md bg-white/50'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-300/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={120}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-105 sm:w-[150px] sm:h-[50px]"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className="px-3 2xl:px-4 py-2 text-sm 2xl:text-base text-gray-800 hover:text-cyan-700 transition-all duration-300 relative group font-medium backdrop-blur-sm flex items-center"
                    >
                      {item.name}
                      <svg 
                        className={`ml-1 w-3 h-3 2xl:w-4 2xl:h-4 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    {/* Dropdown Menu */}
                    <div className={`absolute top-full left-0 mt-1 w-64 2xl:w-72 transition-all duration-300 ${
                      isProductsDropdownOpen 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}>
                      <div className="bg-white backdrop-blur-xl rounded-xl border border-cyan-200/70 shadow-xl shadow-cyan-500/30 overflow-hidden">
                        <div className="py-2">
                          {productCategories.map((category, index) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:text-cyan-700 hover:bg-cyan-100/50 transition-all duration-300 group/item"
                            >
                              <span className="text-base 2xl:text-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                              </span>
                              <span className="font-medium text-sm 2xl:text-base group-hover/item:translate-x-1 transition-transform duration-300">
                                {category.name}
                              </span>
                              <svg 
                                className="ml-auto w-3 h-3 2xl:w-4 2xl:h-4 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-cyan-200/40 px-4 py-3">
                          <Link
                            href="/project"
                            className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white rounded-lg hover:from-cyan-600/90 hover:to-cyan-700/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30 font-medium text-sm 2xl:text-base"
                          >
                            View All Categories
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="px-3 2xl:px-4 py-2 text-sm 2xl:text-base text-gray-800 hover:text-cyan-700 transition-all duration-300 relative group font-medium backdrop-blur-sm"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Tablet Navigation - Shows on large screens only */}
          <div className="hidden lg:flex xl:hidden items-center space-x-1">
            {navItems.slice(0, 5).map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <div
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className="px-3 2xl:px-4 py-2 text-sm 2xl:text-base text-gray-800 hover:text-cyan-700 transition-all duration-300 relative group font-medium backdrop-blur-sm flex items-center"
                    >
                      {item.name}
                      <svg 
                        className={`ml-1 w-3 h-3 2xl:w-4 2xl:h-4 transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    {/* Dropdown Menu */}
                    <div className={`absolute top-full left-0 mt-1 w-64 2xl:w-72 transition-all duration-300 ${
                      isProductsDropdownOpen 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}>
                      <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-cyan-200/70 shadow-xl shadow-cyan-500/30 overflow-hidden">
                        <div className="py-2">
                          {productCategories.map((category, index) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:text-cyan-700 hover:bg-cyan-100/50 transition-all duration-300 group/item"
                            >
                              <span className="text-base 2xl:text-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                              </span>
                              <span className="font-medium text-sm 2xl:text-base group-hover/item:translate-x-1 transition-transform duration-300">
                                {category.name}
                              </span>
                              <svg 
                                className="ml-auto w-3 h-3 2xl:w-4 2xl:h-4 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-cyan-200/40 px-4 py-3">
                          <Link
                            href="/products/all"
                            className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white rounded-lg hover:from-cyan-600/90 hover:to-cyan-700/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30 font-medium text-sm 2xl:text-base"
                          >
                            View All Products
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="px-2 py-2 text-sm text-gray-800 hover:text-cyan-700 transition-all duration-300 relative group font-medium backdrop-blur-sm"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
            <Link
              href="/contact"
              className="px-4 lg:px-6 py-2 text-sm lg:text-base bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 backdrop-blur-lg border border-cyan-400/40 rounded-full text-white hover:from-cyan-600/90 hover:to-cyan-700/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 text-gray-800 hover:text-cyan-700 transition-colors duration-300 backdrop-blur-sm rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`xl:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'max-h-[500px] opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-3 sm:py-4 space-y-1 sm:space-y-2 bg-white/80 backdrop-blur-xl rounded-lg mt-2 border border-cyan-200/70 shadow-lg shadow-cyan-500/25">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <Link
                      href={item.href}
                      className="block px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-cyan-700 hover:bg-cyan-100/50 backdrop-blur-sm transition-all duration-300 rounded-md mx-2 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-2 sm:ml-4 space-y-1">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-cyan-600 hover:bg-cyan-50/50 transition-all duration-300 rounded-md mx-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="block px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-cyan-700 hover:bg-cyan-100/50 backdrop-blur-sm transition-all duration-300 rounded-md mx-2 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="px-3 sm:px-4 pt-2">
              <Link
                href="/contact"
                className="block w-full text-center px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white rounded-full hover:from-cyan-600/90 hover:to-cyan-700/90 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 backdrop-blur-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar