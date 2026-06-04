'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  count?: number
}

const sizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

export function Rating({
  value,
  onChange,
  size = 'md',
  showValue = false,
  count,
}: RatingProps) {
  const [hovered, setHovered] = useState(0)
  const isInteractive = !!onChange

  function Star({ index }: { index: number }) {
    const displayValue = hovered || value
    const filled = index <= Math.floor(displayValue)
    const half = !filled && index - 0.5 <= displayValue
    const activeHover = hovered >= index

    return (
      <button
        type="button"
        disabled={!isInteractive}
        onClick={() => isInteractive && onChange?.(index)}
        onMouseEnter={() => isInteractive && setHovered(index)}
        onMouseLeave={() => isInteractive && setHovered(0)}
        className={cn(
          'transition-all duration-150',
          isInteractive && 'cursor-pointer hover:scale-110',
          !isInteractive && 'cursor-default'
        )}
        aria-label={`${index} star${index > 1 ? 's' : ''}`}
      >
        <svg
          className={cn(
            sizes[size],
            'transition-colors duration-150'
          )}
          viewBox="0 0 24 24"
          fill={filled || half ? '#f59e0b' : 'none'}
          stroke={filled || half ? '#f59e0b' : '#d4d4d8'}
          strokeWidth={1.5}
        >
          <defs>
            <clipPath id={`half-${index}`}>
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          </defs>
          <path
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            fill={filled ? '#f59e0b' : half ? 'url(#halfGrad)' : 'none'}
          />
          {half && (
            <path
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              fill="#f59e0b"
              clipPath={`url(#half-${index})`}
            />
          )}
        </svg>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star key={index} index={index} />
        ))}
      </div>
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-zinc-400 dark:text-zinc-500">
          ({count})
        </span>
      )}
    </div>
  )
}
