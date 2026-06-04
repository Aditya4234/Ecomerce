import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isUp: boolean
  }
  description?: string
  gradient?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose'
  className?: string
}

const gradients = {
  emerald: 'from-emerald-500 to-teal-600',
  blue: 'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-pink-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-red-600',
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
  gradient = 'emerald',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 shadow-lg',
        className
      )}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-90',
          gradients[gradient]
        )}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-white/80">{title}</p>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-white">{icon}</span>
            </div>
          )}
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5',
                trend.isUp
                  ? 'bg-emerald-400/20 text-emerald-200'
                  : 'bg-red-400/20 text-red-200'
              )}
            >
              {trend.isUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-xs text-white/60">{description}</span>
          )}
        </div>
      </div>
    </div>
  )
}
