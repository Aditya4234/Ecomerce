'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  alt?: string
  className?: string
}

export function ImageGallery({ images, alt = '', className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [showZoom, setShowZoom] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Image */}
        <div
          className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 cursor-crosshair"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={images[selectedIndex]}
            alt={alt}
            className="h-full w-full object-cover"
          />
          {showZoom && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${images[selectedIndex]})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '200%',
                opacity: 0,
              }}
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(true)
            }}
            className="absolute bottom-4 right-4 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'shrink-0 h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-200',
                  index === selectedIndex
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'
                )}
              >
                <img
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex]}
                alt={alt}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-4 -right-4 rounded-full bg-white dark:bg-zinc-900 p-2 shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      index === selectedIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
