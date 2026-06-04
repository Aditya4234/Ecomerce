import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Order {
  id: string
  date: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  itemsCount: number
  total: number
}

interface OrderCardProps {
  order: Order
  className?: string
}

const statusColors: Record<Order['status'], { label: string; variant: 'warning' | 'success' | 'destructive' | 'default' | 'secondary' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  processing: { label: 'Processing', variant: 'secondary' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export function OrderCard({ order, className }: OrderCardProps) {
  const status = statusColors[order.status]

  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-lg transition-all hover:shadow-xl',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Package className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Order</p>
            <p className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">
              #{order.id}
            </p>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-zinc-400">Date</p>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {order.date}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Items</p>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {order.itemsCount} product{order.itemsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Separator className="mb-4" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-400">Total</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            ${order.total.toFixed(2)}
          </p>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
