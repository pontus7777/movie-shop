import { Checkbox } from '@/components/ui/checkbox'

type Item = {
  id: string | number
  name: string
}

export function CheckboxFilter({
  items,
  selected,
  onChange,
  disabled,
}: {
  items: Item[]
  selected: string[]
  onChange: (id: string) => void
  disabled?: boolean
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const value = String(item.id)

        return (
          <label
            key={value}
            className="
              flex items-center gap-2 rounded-md px-2 py-1.5
              hover:bg-muted cursor-pointer
            "
          >
            <Checkbox
              checked={selected.includes(value)}
              disabled={disabled}
              onCheckedChange={() => onChange(value)}
            />

            <span className="text-sm">{item.name}</span>
          </label>
        )
      })}
    </div>
  )
}
