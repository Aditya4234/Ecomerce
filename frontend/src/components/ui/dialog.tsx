'use client'

import { forwardRef, type ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const DialogRoot = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const sheetStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  full: 'max-w-[95vw] h-[95vh]',
}

interface DialogContentProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
}

function DialogContent({
  children,
  className,
  size = 'md',
}: DialogContentProps) {
  return (
    <AnimatePresence>
      <DialogPortal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 shadow-2xl',
              sheetStyles[size],
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      </DialogPortal>
    </AnimatePresence>
  )
}

interface DialogHeaderProps {
  title?: string
  description?: string
  className?: string
}

function DialogHeader({ title, description, className }: DialogHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}>
      <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </DialogPrimitive.Title>
      {description && (
        <DialogPrimitive.Description className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </DialogPrimitive.Description>
      )}
    </div>
  )
}

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
}

function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
}: DialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        <DialogHeader title={title} description={description} />
        <div className="p-6">{children}</div>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-xl p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <X className="h-5 w-5" />
        </DialogPrimitive.Close>
      </DialogContent>
    </DialogRoot>
  )
}

export {
  DialogRoot,
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
}
