import { cn, formatPrice } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  discountPrice?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: { price: 'text-sm', discount: 'text-xs', badge: 'text-[10px] px-1.5 py-0.5' },
  md: { price: 'text-lg', discount: 'text-sm', badge: 'text-xs px-2 py-0.5' },
  lg: { price: 'text-2xl', discount: 'text-base', badge: 'text-sm px-2.5 py-1' },
}

export function PriceDisplay({
  price,
  discountPrice,
  className,
  size = 'md',
}: PriceDisplayProps) {
  const hasDiscount = discountPrice !== undefined && discountPrice < price
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {hasDiscount ? (
        <>
          <span
            className={cn(
              'font-bold text-emerald-600 dark:text-emerald-400',
              sizeStyles[size].price
            )}
          >
            {formatPrice(discountPrice!)}
          </span>
          <span
            className={cn(
              'text-zinc-400 dark:text-zinc-500 line-through',
              sizeStyles[size].discount
            )}
          >
            {formatPrice(price)}
          </span>
          <span
            className={cn(
              'rounded-full bg-red-100 dark:bg-red-900/30 font-semibold text-red-600 dark:text-red-400',
              sizeStyles[size].badge
            )}
          >
            -{discountPercent}%
          </span>
        </>
      ) : (
        <span
          className={cn(
            'font-bold text-zinc-900 dark:text-zinc-100',
            sizeStyles[size].price
          )}
        >
          {formatPrice(price)}
        </span>
      )}
    </div>
  )
}
