import React from 'react'
import HeroSection from '@/components/HeroSection'
import ServicesPreview from '@/components/ServicesPreview'
import TechnologiesSection from '@/components/TechnologiesSection'
import DynamicBannerSection from '@/components/banner'

const HomePage = () => {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <TechnologiesSection />
      <DynamicBannerSection/>
      <ServicesPreview />
    </main>
  )
}

export default HomePage