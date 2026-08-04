import { Search } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

type Item = {
  id: string | number
  name: string
}

import { memo, useMemo, useState } from 'react'

export const CheckboxFilter = memo(function CheckboxFilter({
  items,
  selected,
  onChange,
  searchable = false,
  searchPlaceholder = 'Search...',
}: {
  items: Item[]
  selected: string[]
  onChange: (id: string) => void
  searchable?: boolean
  searchPlaceholder?: string
}) {
  const selectedSet = new Set(selected)
  const [query, setQuery] = useState('')

  const visibleItems = useMemo(() => {
    if (!searchable || !query.trim()) return items

    const q = query.trim().toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(q))
  }, [items, query, searchable])

  return (
    <div className="space-y-1.5">
      {searchable && (
        <div className="sticky top-0 z-10 bg-background pb-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-md border bg-background py-1.5 pl-7 pr-2 text-sm outline-none focus:border-primary"
          />
        </div>
      )}

      <div className="space-y-1">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => {
            const value = String(item.id)

            return (
              <label
                key={value}
                className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5"
              >
                <Checkbox checked={selectedSet.has(value)} onCheckedChange={() => onChange(value)} />

                <span className="text-sm">{item.name}</span>
              </label>
            )
          })
        ) : (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">No matches.</p>
        )}
      </div>
    </div>
  )
})
