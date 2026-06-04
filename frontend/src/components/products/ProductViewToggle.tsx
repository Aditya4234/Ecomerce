'use client'

import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProductViewToggleProps {
  view: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
}

export function ProductViewToggle({ view, onChange }: ProductViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-700 p-1 bg-white dark:bg-zinc-900">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange('grid')}
        className={cn(
          'h-8 w-8 rounded-lg',
          view === 'grid'
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-400 dark:text-zinc-500'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange('list')}
        className={cn(
          'h-8 w-8 rounded-lg',
          view === 'list'
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-400 dark:text-zinc-500'
        )}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
