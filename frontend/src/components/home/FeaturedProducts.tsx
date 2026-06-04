'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ProductGrid } from '@/components/shared/ProductGrid'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { useGetFeaturedProductsQuery } from '@/store/api/apiSlice'
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

export function FeaturedProducts() {
  const { data, isLoading } = useGetFeaturedProductsQuery()
  const products = (data?.data ?? []).map(mapProduct)

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Featured Products"
            subtitle="Hand-picked selections just for you"
            viewAll={{ href: '/products' }}
          />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Products"
          subtitle="Hand-picked selections just for you"
          viewAll={{ href: '/products' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ProductGrid
            products={products}
            columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
          />
        </motion.div>
      </div>
    </section>
  )
}
