'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Zap, Loader2 } from 'lucide-react'
import { ProductGrid } from '@/components/shared/ProductGrid'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { cn } from '@/lib/utils'
import { useGetProductsQuery } from '@/store/api/apiSlice'
import type { Product as ApiProduct } from '@/types'

function mapProduct(p: ApiProduct) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    discountPrice: p.comparePrice,
    images: p.images?.map((i) => (typeof i === 'string' ? i : i.url)) ?? [],
    rating: p.averageRating,
    reviewCount: p.numReviews,
    category: p.category
      ? typeof p.category === 'object'
        ? p.category.name
        : p.category
      : '',
    inStock: p.stock > 0,
  }
}

export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ]

  const { data, isLoading } = useGetProductsQuery({ limit: 8 })
  const dealProducts = (data?.data ?? [])
    .filter((p: ApiProduct) => p.comparePrice && p.comparePrice > p.price)
    .slice(0, 4)
    .map(mapProduct)

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-900 via-red-950 to-zinc-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-2"
            >
              <Zap className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">
                Flash Sale
              </span>
            </motion.div>
            <SectionHeading
              title="Deals of the Day"
              subtitle="Limited time offers. Grab them before they're gone!"
              align="left"
              viewAll={{ href: '/deals', label: 'View All Deals' }}
            />
          </div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Clock className="h-5 w-5 text-amber-400" />
            <div className="flex gap-2">
              {timeUnits.map((unit, i) => (
                <div key={unit.label} className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[3.5rem]">
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : (
            <ProductGrid
              products={dealProducts}
              columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}
