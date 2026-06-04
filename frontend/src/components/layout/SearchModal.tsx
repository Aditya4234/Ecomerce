'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const recentSearches = ['wireless headphones', 'running shoes', 'smart watch', 'laptop bag']
const trendingProducts = [
  { name: 'Premium Wireless Headphones', price: '$149.99', image: '/images/product-1.jpg' },
  { name: 'Athletic Running Shoes', price: '$89.99', image: '/images/product-2.jpg' },
  { name: 'Smart Fitness Watch', price: '$199.99', image: '/images/product-3.jpg' },
]

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else onClose() // toggle
      }
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const filteredTrending = trendingProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <div className="relative mx-auto max-w-2xl px-4 pt-20 sm:pt-28">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700 px-5 py-3">
                <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs text-zinc-400">
                  ESC
                </kbd>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto p-5">
                {query ? (
                  <div>
                    <p className="text-sm text-zinc-400 mb-3">
                      Results for &quot;{query}&quot;
                    </p>
                    {filteredTrending.length > 0 ? (
                      <div className="space-y-2">
                        {filteredTrending.map((product, i) => (
                          <Link
                            key={i}
                            href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={onClose}
                            className="flex items-center gap-4 rounded-xl p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <div className="h-14 w-14 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                {product.price}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-zinc-400" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-zinc-400 py-8">
                        No products found for &quot;{query}&quot;
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Recent Searches
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => setQuery(search)}
                            className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trending Products */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-zinc-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Trending Products
                        </span>
                      </div>
                      <div className="space-y-2">
                        {trendingProducts.map((product, i) => (
                          <Link
                            key={i}
                            href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={onClose}
                            className="flex items-center gap-4 rounded-xl p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20" />
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {product.name}
                              </p>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                {product.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
