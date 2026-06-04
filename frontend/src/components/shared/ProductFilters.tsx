'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Rating } from '@/components/ui/rating'

interface FilterState {
  categories: string[]
  brands: string[]
  rating: number | null
  priceRange: [number, number]
}

interface ProductFiltersProps {
  className?: string
  mobile?: boolean
  open?: boolean
  onClose?: () => void
}

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Beauty',
]

const brands = [
  'Nike',
  'Apple',
  'Samsung',
  'Adidas',
  'Sony',
  'Amazon Basics',
]

export function ProductFilters({
  className,
  mobile,
  open,
  onClose,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    rating: null,
    priceRange: [0, 1000],
  })

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.rating !== null

  const clearAll = () => {
    setFilters({ categories: [], brands: [], rating: null, priceRange: [0, 1000] })
  }

  const toggleCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }))
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
          Categories
        </h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <Checkbox
              key={cat}
              id={`cat-${cat}`}
              label={cat}
              checked={filters.categories.includes(cat)}
              onCheckedChange={() => toggleCategory(cat)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">$0</span>
          <input
            type="range"
            min={0}
            max={1000}
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [0, Number(e.target.value)],
              }))
            }
            className="flex-1 h-1.5 rounded-full appearance-none bg-zinc-200 dark:bg-zinc-700 accent-emerald-500"
          />
          <span className="text-xs text-zinc-400">${filters.priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
          Brands
        </h4>
        <div className="space-y-2.5">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              id={`brand-${brand}`}
              label={brand}
              checked={filters.brands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div>
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  rating: prev.rating === rating ? null : rating,
                }))
              }
              className="flex items-center gap-2 w-full"
            >
              <div
                className={cn(
                  'h-4 w-4 rounded border-2 transition-colors',
                  filters.rating === rating
                    ? 'border-emerald-600 bg-emerald-600'
                    : 'border-zinc-300 dark:border-zinc-600'
                )}
              >
                {filters.rating === rating && (
                  <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <Rating value={rating} size="sm" />
              <span className="text-xs text-zinc-400">& up</span>
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  )

  // Desktop version
  if (!mobile) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-lg',
          className
        )}
      >
        {filterContent}
      </div>
    )
  }

  // Mobile bottom sheet
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 px-5 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5">{filterContent}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
