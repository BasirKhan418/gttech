'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Play, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ImageIcon,
  Video,
  Calendar,
  Eye
} from 'lucide-react'

interface GalleryItem {
  _id: string
  type: 'image' | 'video'
  title: string
  description?: string
  images?: string[]
  videoUrl?: string
  thumbnail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryItem | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target); 
        }
      });
    },
    { threshold: 0.1 }
  );

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, [galleryItems, activeTab]);

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gallery')
      const data = await response.json()

      if (data.success) {
        setGalleryItems(data.data.filter((item: GalleryItem) => item.isActive))
      } else {
        setError(data.message || 'Failed to fetch gallery items')
      }
    } catch (error) {
      setError('Failed to fetch gallery items')
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const openLightbox = (album: GalleryItem, imageIndex: number = 0) => {
    setSelectedAlbum(album)
    setSelectedImageIndex(imageIndex)
    setShowLightbox(true)
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setSelectedAlbum(null)
    setSelectedImageIndex(0)
  }

  const nextImage = () => {
    if (selectedAlbum && selectedAlbum.images) {
      setSelectedImageIndex((prev) => 
        prev === selectedAlbum.images!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedAlbum && selectedAlbum.images) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? selectedAlbum.images!.length - 1 : prev - 1
      )
    }
  }

  const imageAlbums = galleryItems.filter(item => item.type === 'image')
  const videoItems = galleryItems.filter(item => item.type === 'video')

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Loading gallery...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Gallery</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchGalleryItems}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-8 lg:opacity-12">
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
            className={`absolute w-1 h-1 rounded-full animate-float hidden sm:block ${
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

      {/* Data Flow Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-30">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-data-flow"
                style={{
                  left: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-20 hidden xl:block overflow-hidden opacity-30">
        <div className="relative h-full">
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-data-flow"
                style={{
                  right: `${i * 25}%`,
                  height: '100%',
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '3s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <div className="inline-flex items-center px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full text-sm text-cyan-700 mb-6 shadow-lg">
                <ImageIcon className="w-4 h-4 mr-2" />
                <span className="font-medium">Our Gallery</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="block">Explore Our</span>
                <span className="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 bg-clip-text text-transparent">
                  Visual Journey
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Discover our work through captivating images and videos showcasing 
                our projects, events, and technological innovations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Navigation */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll opacity-0 translate-y-10">
            <div className="flex justify-center mb-8">
              <div className="bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-2xl p-2 flex space-x-2 shadow-xl">
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'image'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-cyan-50/80'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Image Gallery</span>
                  <span className="px-2 py-1 bg-white/30 rounded-full text-xs">
                    {imageAlbums.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'video'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-cyan-50/80'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Video Gallery</span>
                  <span className="px-2 py-1 bg-white/30 rounded-full text-xs">
                    {videoItems.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {activeTab === 'image' ? (
            /* Image Albums */
            <div>
              {imageAlbums.length === 0 ? (
                <div className="text-center py-20">
                  <div className="animate-on-scroll opacity-0 translate-y-10">
                    <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl">
                      {/* Glass Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-400/40 backdrop-blur-sm shadow-lg">
                          <ImageIcon className="w-8 h-8 text-cyan-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Albums Yet</h3>
                        <p className="text-gray-600">Image albums will appear here once they're added.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {imageAlbums.map((album, index) => (
                    <div
                      key={album._id}
                      className="animate-on-scroll opacity-0 translate-y-10"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div 
                        className="group relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/15 cursor-pointer group-hover:bg-white/80"
                        onClick={() => openLightbox(album)}
                      >
                        {/* Glass Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                        
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Album Cover */}
                        <div className="relative h-64 overflow-hidden">
                          {album.images && album.images.length > 0 && (
                            <img
                              src={album.images[0]}
                              alt={album.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                          
                          {/* View Indicator */}
                          <div className="absolute top-4 right-4 p-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                            <Eye className="w-4 h-4 text-cyan-600" />
                          </div>

                          {/* Photo Count */}
                          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
                            {album.images?.length || 0} photos
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-700 text-xs font-medium rounded-full border border-cyan-400/40 backdrop-blur-sm">
                              Album
                            </span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(album.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors duration-300">
                            {album.title}
                          </h3>
                          
                          {album.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                              {album.description}
                            </p>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300">
                              View Album
                            </span>
                            <ChevronRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 group-hover:text-cyan-700 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute bottom-3 right-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Video Gallery */
            <div>
              {videoItems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="animate-on-scroll opacity-0 translate-y-10">
                    <div className="relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl">
                      {/* Glass Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-400/40 backdrop-blur-sm shadow-lg">
                          <Video className="w-8 h-8 text-cyan-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Videos Yet</h3>
                        <p className="text-gray-600">Videos will appear here once they're added.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videoItems.map((video, index) => (
                    <div
                      key={video._id}
                      className="animate-on-scroll opacity-0 translate-y-10"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="group relative bg-white/70 backdrop-blur-sm border border-cyan-600/50 rounded-3xl overflow-hidden hover:border-cyan-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/15 group-hover:bg-white/80">
                        
                        {/* Glass Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-cyan-50/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/5"></div>
                        
                        {/* Video Thumbnail */}
                        <div className="relative h-64 overflow-hidden">
                          {video.videoUrl && (
                            <div className="relative w-full h-full">
                              <img
                                src={video.thumbnail || `https://img.youtube.com/vi/${getYouTubeVideoId(video.videoUrl)}/maxresdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                              
                              {/* Play Button */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-red-500/20 text-red-600 text-xs font-medium rounded-full border border-red-400/40 backdrop-blur-sm">
                              Video
                            </span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(video.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors duration-300">
                            {video.title}
                          </h3>
                          
                          {video.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                              {video.description}
                            </p>
                          )}

                          {/* CTA */}
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-cyan-600 font-semibold text-sm group-hover:text-cyan-700 transition-colors duration-300"
                          >
                            <Play className="w-4 h-4" />
                            <span>Watch Video</span>
                          </a>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-3 left-3 w-2 h-2 bg-cyan-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute bottom-3 right-3 w-1 h-1 bg-cyan-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {showLightbox && selectedAlbum && selectedAlbum.images && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 bg-gray-800/20 backdrop-blur-sm border border-gray-400/40 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-800/30 transition-all duration-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {selectedAlbum.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/20 backdrop-blur-sm border border-gray-400/40 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-800/30 transition-all duration-300 z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800/20 backdrop-blur-sm border border-gray-400/40 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-800/30 transition-all duration-300 z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
              <img
                src={selectedAlbum.images[selectedImageIndex]}
                alt={`${selectedAlbum.title} - Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                sizes="100vw"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-400/40 rounded-2xl p-4 max-w-md mx-auto">
                <h3 className="text-white font-bold text-lg mb-1">{selectedAlbum.title}</h3>
                <p className="text-gray-200 text-sm">
                  Image {selectedImageIndex + 1} of {selectedAlbum.images.length}
                </p>
              </div>              
            </div>

            {/* Thumbnails */}
            {selectedAlbum.images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                <div className="flex space-x-2 max-w-lg overflow-x-auto p-2">
                  {selectedAlbum.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === selectedImageIndex 
                          ? 'border-cyan-400' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes data-flow {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-data-flow {
          animation: data-flow 3s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .animate-on-scroll {
          transition: all 1s ease-out;
        }
      `}</style>
    </main>
  )
}

export default GalleryPage