'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  label: string
  date?: string
}

interface OrderTimelineProps {
  currentStep: number
  steps?: Step[]
  className?: string
}

const defaultSteps: Step[] = [
  { label: 'Placed' },
  { label: 'Confirmed' },
  { label: 'Shipped' },
  { label: 'Out for Delivery' },
  { label: 'Delivered' },
]

export function OrderTimeline({
  currentStep,
  steps = defaultSteps,
  className,
}: OrderTimelineProps) {
  const progress = ((currentStep) / (steps.length - 1)) * 100

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Progress Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isFuture = index > currentStep

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted &&
                      'border-emerald-500 bg-emerald-500 text-white',
                    isCurrent &&
                      'border-emerald-500 bg-white dark:bg-zinc-900 text-emerald-500 shadow-lg shadow-emerald-500/25',
                    isFuture &&
                      'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-300 dark:text-zinc-600'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-xs font-medium',
                      isCompleted && 'text-emerald-600 dark:text-emerald-400',
                      isCurrent && 'text-zinc-900 dark:text-zinc-100',
                      isFuture && 'text-zinc-400 dark:text-zinc-500'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {step.date}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
