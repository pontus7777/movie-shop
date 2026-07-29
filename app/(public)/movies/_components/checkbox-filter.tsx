import { Checkbox } from '@/components/ui/checkbox'

type Item = {
  id: string | number
  name: string
}

import { memo } from 'react'

export const CheckboxFilter = memo(function CheckboxFilter({
  items,
  selected,
  onChange,
}: {
  items: Item[]
  selected: string[]
  onChange: (id: string) => void
}) {
  const selectedSet = new Set(selected)

  return (
    <div className="space-y-1">
      {items.map((item) => {
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
      })}
    </div>
  )
})
