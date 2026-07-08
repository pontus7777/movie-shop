'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function FiltersOrder() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams)

    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  function handleSearch(value: string) {
    setSearch(value)

    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }

    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            placeholder="Search orders..."
            className="max-w-sm"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Select
            value={searchParams.get('status') ?? 'all'}
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get('payment') ?? ''}
            onValueChange={(value) => updateFilter('payment', value)}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="swish">Swish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
