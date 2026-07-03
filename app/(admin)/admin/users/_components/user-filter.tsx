import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FilterUsers() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
        <Input placeholder="Search by name or email..." className="md:max-w-sm" />

        <Select>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
        </Select>

        <Select>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
        </Select>
      </CardContent>
    </Card>
  )
}
