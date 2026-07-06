'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function FilterUsers() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    // Reset to first page whenever filters change
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
        <Input
          placeholder="Search by name or email..."
          defaultValue={searchParams.get('search') ?? ''}
          onBlur={(e) => updateFilter('search', e.target.value)}
          className="md:max-w-sm"
        />

        <Select
          defaultValue={searchParams.get('role') ?? 'all'}
          onValueChange={(value) => updateFilter('role', value)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get('status') ?? 'all'}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
