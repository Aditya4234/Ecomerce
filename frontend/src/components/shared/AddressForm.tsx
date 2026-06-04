'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddressFormData {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface AddressFormProps {
  onSubmit?: (data: AddressFormData) => void
  initialData?: Partial<AddressFormData>
  loading?: boolean
  className?: string
}

export function AddressForm({
  onSubmit,
  initialData,
  loading,
  className,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'United States',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state.trim()) newErrors.state = 'State is required'
    if (!form.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    if (!form.country.trim()) newErrors.country = 'Country is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit?.(form)
  }

  const updateField = (field: keyof AddressFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          error={errors.fullName}
          placeholder="John Doe"
        />
        <Input
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <Input
        label="Address"
        value={form.address}
        onChange={(e) => updateField('address', e.target.value)}
        error={errors.address}
        placeholder="123 Main Street, Apt 4B"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          value={form.city}
          onChange={(e) => updateField('city', e.target.value)}
          error={errors.city}
          placeholder="New York"
        />
        <Input
          label="State"
          value={form.state}
          onChange={(e) => updateField('state', e.target.value)}
          error={errors.state}
          placeholder="NY"
        />
        <Input
          label="ZIP Code"
          value={form.zipCode}
          onChange={(e) => updateField('zipCode', e.target.value)}
          error={errors.zipCode}
          placeholder="10001"
        />
      </div>

      <Input
        label="Country"
        value={form.country}
        onChange={(e) => updateField('country', e.target.value)}
        error={errors.country}
      />

      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        Save Address
      </Button>
    </form>
  )
}
