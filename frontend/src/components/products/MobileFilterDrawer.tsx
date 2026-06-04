'use client'

import { ProductFilters } from '@/components/shared/ProductFilters'

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileFilterDrawer({ open, onClose }: MobileFilterDrawerProps) {
  return (
    <ProductFilters mobile open={open} onClose={onClose} />
  )
}
