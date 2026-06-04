'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Smartphone,
  Shirt,
  Home,
  Laptop,
  BookOpen,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetCategoriesQuery } from '@/store/api/apiSlice'
import type { Category as ApiCategory } from '@/types'

const iconMap: Record<string, React.ReactNode> = {
  electronics: <Smartphone className="h-8 w-8" />,
  clothing: <Shirt className="h-8 w-8" />,
  'home-garden': <Home className="h-8 w-8" />,
  computers: <Laptop className="h-8 w-8" />,
  books: <BookOpen className="h-8 w-8" />,
  beauty: <Sparkles className="h-8 w-8" />,
}

const colorMap: Record<string, string> = {
  electronics: 'from-blue-500 to-indigo-600',
  clothing: 'from-pink-500 to-rose-600',
  'home-garden': 'from-emerald-500 to-teal-600',
  computers: 'from-purple-500 to-violet-600',
  books: 'from-amber-500 to-orange-600',
  beauty: 'from-rose-500 to-pink-600',
}

const defaultIcon = <Sparkles className="h-8 w-8" />
const defaultColor = 'from-zinc-500 to-zinc-600'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturedCategories() {
  const { data, isLoading } = useGetCategoriesQuery()
  const categories = (data?.data ?? []).slice(0, 6)

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            Shop by Category
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Browse through our extensive collection of premium products
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : (
            categories.map((category: ApiCategory) => {
              const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
              const icon = iconMap[slug] ?? defaultIcon
              const color = colorMap[slug] ?? defaultColor
              return (
                <motion.div key={category._id} variants={itemVariants}>
                  <Link
                    href={`/categories/${category._id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                          color
                        )}
                      />
                      <div
                        className={cn(
                          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110',
                          color
                        )}
                      >
                        {icon}
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              )
            })
          )}
        </motion.div>
      </div>
    </section>
  )
}
