'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { PriceDisplay } from '@/components/ui/price-display'
import { addToCart } from '@/store/slices/cartSlice'
import type { AppDispatch } from '@/store'

interface Product {
  id: string
  name: string
  price: number
  discountPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  category: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imgError, setImgError] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl overflow-hidden transition-all duration-300',
        'hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-black/30 hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {imgError ? (
          <div className="flex h-full items-center justify-center text-zinc-300 dark:text-zinc-600">
            <ShoppingCart className="h-12 w-12" />
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImgError(true)}
            className={cn(
              'h-full w-full object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
          />
        )}

        {/* Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm"
        >
          {product.category}
        </Badge>

        {/* Discount Badge */}
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3"
          >
            -{discountPercent}%
          </Badge>
        )}

        {/* Quick Actions */}
        <div
          className={cn(
            'absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 transition-all duration-300',
            isHovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-4 sm:group-hover:translate-y-0'
          )}
        >
          <Button
            size="sm"
            className="flex-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-900"
            onClick={() =>
              dispatch(addToCart({
                product: product.id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                stock: 99,
                quantity: 1,
              }))
            }
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-emerald-600/90 backdrop-blur-sm text-white hover:bg-emerald-600"
            asChild
          >
            <Link href={`/products/${product.id}`}>
              Buy Now
            </Link>
          </Button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all duration-200',
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
          )}
        >
          <Heart
            className={cn('h-4 w-4', isWishlisted && 'fill-current')}
          />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          <Link href={`/products/${product.id}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {product.name}
          </Link>
        </h3>

        <Rating value={product.rating} size="sm" showValue count={product.reviewCount} />

        <PriceDisplay
          price={product.price}
          discountPrice={product.discountPrice}
          size="sm"
        />
      </div>
    </motion.div>
  )
}
