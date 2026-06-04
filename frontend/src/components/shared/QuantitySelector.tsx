'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const isMin = value <= min
  const isMax = value >= max

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900',
        size === 'sm' ? 'h-8' : 'h-10',
        className
      )}
    >
      <button
        onClick={() => !isMin && onChange(value - 1)}
        disabled={isMin}
        className={cn(
          'flex items-center justify-center transition-colors',
          size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
          isMin
            ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        )}
      >
        <Minus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>

      <span
        className={cn(
          'flex items-center justify-center font-medium text-zinc-900 dark:text-zinc-100 border-x border-zinc-200 dark:border-zinc-700 select-none',
          size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
        )}
      >
        {value}
      </span>

      <button
        onClick={() => !isMax && onChange(value + 1)}
        disabled={isMax}
        className={cn(
          'flex items-center justify-center transition-colors',
          size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
          isMax
            ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
        )}
      >
        <Plus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
    </div>
  )
}
