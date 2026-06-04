'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-zinc-900 via-emerald-900 to-teal-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl" />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={itemVariants} className="mb-8 flex justify-center lg:justify-start">
            <img
              src="/image/logo.png"
              alt="ShopVerse"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-emerald-200 border border-emerald-400/20">
              <Sparkles className="h-4 w-4" />
              Premium Quality Products
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Discover Your
            <span className="block bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Perfect Style
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed"
          >
            Shop the latest trends with confidence. Premium products, 
            unbeatable prices, and free shipping on all orders over $50.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-zinc-900 hover:bg-zinc-100 shadow-2xl shadow-white/25 text-base gap-2"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-base"
              >
                Explore Categories
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap gap-8 sm:gap-12"
          >
            {[
              { label: 'Products', value: '10K+' },
              { label: 'Happy Customers', value: '50K+' },
              { label: 'Years', value: '5+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
