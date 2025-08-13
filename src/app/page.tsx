import React from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ServicesPreview from '@/components/ServicesPreview'
import TechnologiesSection from '@/components/TechnologiesSection'
import Footer from '@/components/Footer'

const HomePage = () => {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <TechnologiesSection />
      <ServicesPreview />
      <Footer />
    </main>
  )
}

export default HomePage