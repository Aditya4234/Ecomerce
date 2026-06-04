'use client'

import { Select } from '@/components/ui/select'

interface SortOption {
  value: string
  label: string
}

interface ProductSortProps {
  value?: string
  onChange?: (value: string) => void
}

const sortOptions: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'popular', label: 'Popular' },
]

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select
      options={sortOptions}
      value={value}
      onChange={onChange}
      placeholder="Sort by"
      className="w-48"
    />
  )
}
