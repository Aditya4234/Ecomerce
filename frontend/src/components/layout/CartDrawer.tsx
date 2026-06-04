'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuantitySelector } from '@/components/shared/QuantitySelector'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCart } from '@/hooks/useCart'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalPrice, totalItems, removeItem, updateQty } = useCart()

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Shopping Cart
                </span>
                <span className="text-sm text-zinc-400">({items.length})</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <EmptyState
                    icon={<ShoppingBag className="h-12 w-12" />}
                    title="Your cart is empty"
                    description="Looks like you haven't added anything to your cart yet"
                    action={{ label: 'Start Shopping', href: '/products' }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const key = `${String(item.product)}-${item.size || ''}-${item.color || ''}`
                    return (
                    <div
                      key={key}
                      className="flex gap-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem({ product: String(item.product), size: item.size, color: item.color })}
                              className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {(item.size || item.color) && (
                            <p className="text-xs text-zinc-400">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
                          )}
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(qty) => updateQty({ product: String(item.product), size: item.size, color: item.color, quantity: qty })}
                            min={1}
                            max={item.stock}
                          />
                          <span className="text-xs text-zinc-400">
                            ${item.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Subtotal</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Shipping and taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full h-12 text-base">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
