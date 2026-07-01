'use client'

import { Crew } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type CrewSelectorProps = {
  title: string
  crew: Crew[]
  value: string[]
  onChange: (value: string[]) => void
}

export function CrewSelector({ title, crew, value, onChange }: CrewSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{title}</label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-between">
            {value.filter((id) => crew.some((c) => c.id === id)).length === 0
              ? `Select ${title}`
              : `${value.filter((id) => crew.some((c) => c.id === id)).length} selected`}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72">
          {crew.map((member) => (
            <DropdownMenuCheckboxItem
              key={member.id}
              checked={value.includes(member.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...value, member.id])
                } else {
                  onChange(value.filter((id) => id !== member.id))
                }
              }}
            >
              {member.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
