'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  name: string
  role: string
  avatar?: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    quote: 'Absolutely love my purchase! The quality exceeded my expectations and shipping was incredibly fast. Will definitely be ordering again.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Regular Customer',
    quote: 'Best online shopping experience I have ever had. The customer service team went above and beyond to help me with my order.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Fashion Blogger',
    quote: 'The product selection is amazing. I found everything I needed in one place. The prices are competitive and quality is top-notch.',
    rating: 4,
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Tech Enthusiast',
    quote: 'Fast delivery, great packaging, and the product works perfectly. This is now my go-to store for all my shopping needs.',
    rating: 5,
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  const testimonial = testimonials[current]

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Real reviews from real customers
          </p>
        </motion.div>

        <div className="relative min-h-[250px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="text-center"
            >
              <div className="rounded-3xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 sm:p-12 shadow-xl">
                <Quote className="mx-auto h-10 w-10 text-emerald-500/30 mb-6" />
                <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <Rating value={testimonial.rating} size="md" />
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Avatar
                    src={testimonial.avatar}
                    fallback={testimonial.name}
                    size="md"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-zinc-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                i === current ? 'w-8 bg-emerald-500' : 'w-2.5 bg-zinc-300 dark:bg-zinc-600'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
