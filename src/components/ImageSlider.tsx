import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ImageSliderProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  currentIndex: number
  onIndexChange: (index: number) => void
  title?: string
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  isOpen,
  onClose,
  currentIndex,
  onIndexChange,
  title = 'Gallery'
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length
    onIndexChange(nextIndex)
    setIsLoading(true)
  }

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    onIndexChange(prevIndex)
    setIsLoading(true)
  }

  const handleThumbnailClick = (index: number) => {
    onIndexChange(index)
    setIsLoading(true)
  }

  if (!isOpen || images.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-white/95 via-cyan-50/90 to-cyan-100/95 backdrop-blur-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-white/80 via-white/60 to-transparent backdrop-blur-sm border-b border-cyan-200/30">
        <div className="text-gray-800">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">{title}</h3>
          <p className="text-sm text-gray-600">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-700 hover:bg-cyan-100/60 hover:text-cyan-700 rounded-full transition-all duration-200 border border-cyan-200/50 backdrop-blur-sm"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-center h-full px-4 py-20">
        <div className="relative w-full h-full max-w-6xl max-h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-cyan-500 absolute top-0 left-0"></div>
              </div>
            </div>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-cyan-200/50 shadow-2xl">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="100vw"
              priority
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white/95 text-cyan-700 hover:text-cyan-800 rounded-full transition-all duration-200 backdrop-blur-sm border border-cyan-200/60 hover:border-cyan-300/80 shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white/95 text-cyan-700 hover:text-cyan-800 rounded-full transition-all duration-200 backdrop-blur-sm border border-cyan-200/60 hover:border-cyan-300/80 shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/80 via-white/60 to-transparent backdrop-blur-sm border-t border-cyan-200/30">
          <div className="flex justify-center">
            <div className="flex gap-3 max-w-full overflow-x-auto scrollbar-hide px-4 py-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 backdrop-blur-sm ${
                    index === currentIndex
                      ? 'border-cyan-500 shadow-lg shadow-cyan-500/30 scale-110 ring-2 ring-cyan-300/50'
                      : 'border-cyan-200/60 hover:border-cyan-400/80 hover:shadow-md'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden">
        <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 border border-cyan-200/50">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-cyan-500 scale-125' : 'bg-cyan-300/60 hover:bg-cyan-400/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400/30 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-300/40 rounded-full animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-cyan-500/20 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-60 right-10 w-1 h-1 bg-white/50 rounded-full animate-float hidden lg:block" style={{ animationDelay: '0.5s' }}></div>
    </div>
  )
}

export default ImageSlider