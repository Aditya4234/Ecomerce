'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Home,
  Package,
  Grid3X3,
  Info,
  Phone,
  Heart,
  ShoppingCart,
  User,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Phone },
]

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const wishlistCount = 2
  const cartCount = 3

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                ShopVerse
              </span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-indicator"
                        className="ml-auto h-2 w-2 rounded-full bg-emerald-500"
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex gap-2">
                <Link href="/wishlist" className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Heart className="h-4 w-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">{wishlistCount}</Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/cart" className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">{cartCount}</Badge>
                    )}
                  </Button>
                </Link>
              </div>
              <div className="flex gap-2">
                <Link href="/login" className="flex-1" onClick={onClose}>
                  <Button className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
