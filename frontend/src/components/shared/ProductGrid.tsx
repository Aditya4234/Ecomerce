import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  discountPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  category: string
  inStock: boolean
}

interface ProductGridProps {
  products?: Product[]
  loading?: boolean
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  className?: string
}

export function ProductGrid({
  products = [],
  loading = false,
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  className,
}: ProductGridProps) {
  const colClass = cn(
    'grid gap-4 sm:gap-6',
    'grid-cols-1',
    columns.sm === 2 && 'sm:grid-cols-2',
    columns.sm === 3 && 'sm:grid-cols-3',
    columns.sm === 4 && 'sm:grid-cols-4',
    columns.md === 2 && 'md:grid-cols-2',
    columns.md === 3 && 'md:grid-cols-3',
    columns.md === 4 && 'md:grid-cols-4',
    columns.md === 5 && 'md:grid-cols-5',
    columns.md === 6 && 'md:grid-cols-6',
    columns.lg === 2 && 'lg:grid-cols-2',
    columns.lg === 3 && 'lg:grid-cols-3',
    columns.lg === 4 && 'lg:grid-cols-4',
    columns.lg === 5 && 'lg:grid-cols-5',
    columns.xl === 2 && 'xl:grid-cols-2',
    columns.xl === 3 && 'xl:grid-cols-3',
    columns.xl === 4 && 'xl:grid-cols-4',
    columns.xl === 5 && 'xl:grid-cols-5',
    columns.xl === 6 && 'xl:grid-cols-6',
    className
  )

  if (loading) {
    return (
      <div className={colClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <Skeleton variant="rectangular" className="aspect-square" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 dark:text-zinc-500">No products found</p>
      </div>
    )
  }

  return (
    <div className={colClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
