'use client'

import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  date: string
  title?: string
  comment: string
  isVerifiedPurchase?: boolean
}

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.user.avatar}
            fallback={review.user.name}
            size="md"
          />
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {review.user.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Rating value={review.rating} size="sm" />
              <span className="text-xs text-zinc-400">{review.date}</span>
            </div>
          </div>
        </div>
        {review.isVerifiedPurchase && (
          <Badge variant="success" className="text-[10px]">
            Verified Purchase
          </Badge>
        )}
      </div>
      {review.title && (
        <h5 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
          {review.title}
        </h5>
      )}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {review.comment}
      </p>
    </div>
  )
}
