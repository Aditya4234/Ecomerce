'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewsletterFormProps {
  onSubmit?: (email: string) => void
  loading?: boolean
  className?: string}
export function NewsletterForm({ onSubmit, loading, className }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onSubmit?.(email)
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  if (subscribed) {
    return (
      <div className={cn('flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4', className)}>
        <CheckCircle className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Successfully subscribed!
          </p>
          <p className="text-xs text-emerald-600/70">Thank you for joining our newsletter.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        leftIcon={<Mail className="h-4 w-4" />}
        required
        className="flex-1"
      />
      <Button type="submit" loading={loading}>
        Subscribe
      </Button>
    </form>
  )
}
