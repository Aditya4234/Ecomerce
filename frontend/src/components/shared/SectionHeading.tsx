import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  viewAll?: {
    label?: string
    href: string
  }
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  viewAll,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col mb-8',
        align === 'center' && 'items-center text-center',
        align === 'right' && 'items-end text-right',
        align === 'left' && 'items-start text-left',
        className
      )}
    >
      <div className="flex items-center gap-4 flex-wrap">
        {viewAll && align === 'left' && (
          <Link
            href={viewAll.href}
            className="ml-auto flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            {viewAll.label || 'View All'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-2xl">
          {subtitle}
        </p>
      )}
      {viewAll && align !== 'left' && (
        <Link
          href={viewAll.href}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          {viewAll.label || 'View All'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
