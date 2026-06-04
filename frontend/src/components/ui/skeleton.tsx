import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const skeletonVariants = cva('animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700', {
  variants: {
    variant: {
      text: 'h-4 w-full rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-xl',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
})

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Skeleton }
