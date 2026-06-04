'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowUp,
  Mail,
  Shield,
  Truck,
  Headphones,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Returns Policy', href: '/returns' },
  { label: 'Size Guide', href: '/size-guide' },
]

const customerService = [
  { label: 'My Account', href: '/dashboard' },
  { label: 'Order Tracking', href: '/order-tracking' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

const paymentMethods = [
  'Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Amex'
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="mt-1 text-emerald-100">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form
              onSubmit={handleNewsletter}
              className="flex w-full max-w-md gap-2"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4" />}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="shrink-0 bg-white text-emerald-700 hover:bg-emerald-50"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block">
              ShopVerse
            </Link>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your premium destination for quality products. We offer the best
              selection with competitive prices and fast delivery worldwide.
            </p>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Why Shop With Us
            </h4>
            <ul className="space-y-3">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
                { icon: Shield, label: 'Secure Payment', desc: '100% secure checkout' },
                { icon: Headphones, label: '24/7 Support', desc: 'Dedicated support team' },
                { icon: RotateCcw, label: 'Easy Returns', desc: '30-day return policy' },
              ].map((feature) => (
                <li key={feature.label} className="flex items-start gap-3">
                  <feature.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {feature.label}
                    </p>
                    <p className="text-xs text-zinc-400">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-lg bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to Top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </footer>
  )
}
