import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const spinnerVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      page: 'min-h-[60vh]',
      section: 'min-h-[30vh]',
      button: 'inline-flex',
      inline: 'inline-flex',
    },
  },
  defaultVariants: {
    variant: 'section',
  },
})

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  text?: string
  className?: string
}

export function LoadingSpinner({
  variant,
  text,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn(spinnerVariants({ variant }), className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 dark:border-zinc-700" />
          <Loader2 className="absolute inset-0 h-10 w-10 animate-spin text-emerald-500" />
        </div>
        {text && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}
