'use client'

import { useState } from 'react'
import { Ticket, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CouponInputProps {
  onApply?: (code: string) => void
  onRemove?: () => void
  loading?: boolean
  appliedCoupon?: {
    code: string
    discount: string
  } | null
  className?: string
}

export function CouponInput({
  onApply,
  onRemove,
  loading,
  appliedCoupon,
  className,
}: CouponInputProps) {
  const [code, setCode] = useState('')

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) onApply?.(code.trim())
  }

  if (appliedCoupon) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3',
          className
        )}
      >
        <Check className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {appliedCoupon.code}
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
            {appliedCoupon.discount} discount applied
          </p>
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 rounded-lg p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleApply} className={cn('flex gap-2', className)}>
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Coupon code"
        leftIcon={<Ticket className="h-4 w-4" />}
        className="flex-1 uppercase"
      />
      <Button type="submit" variant="outline" loading={loading} disabled={!code.trim()}>
        Apply
      </Button>
    </form>
  )
}
