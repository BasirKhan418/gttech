import React from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ServicesPreview from '@/components/ServicesPreview'
import TechnologiesSection from '@/components/TechnologiesSection'
import Footer from '@/components/Footer'
import DynamicBannerSection from '@/components/banner'

const HomePage = () => {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <TechnologiesSection />
      <DynamicBannerSection/>
      <ServicesPreview />
      <Footer />
    </main>
  )
}

export default HomePage