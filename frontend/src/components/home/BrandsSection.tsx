'use client'

import { motion } from 'framer-motion'

const brands = [
  'Nike', 'Apple', 'Samsung', 'Adidas', 'Sony',
  'Amazon', 'Microsoft', 'Google', 'Puma', 'LG',
  'Dell', 'HP', 'Lenovo', 'Bose', 'JBL',
]

export function BrandsSection() {
  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Trusted by Leading Brands
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex shrink-0 gap-16 items-center"
          >
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-2xl sm:text-3xl font-bold text-zinc-300 dark:text-zinc-700 hover:text-zinc-400 dark:hover:text-zinc-500 transition-colors whitespace-nowrap select-none"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
