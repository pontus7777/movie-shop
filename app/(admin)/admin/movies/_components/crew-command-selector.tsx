'use client'

import { useState } from 'react'
import { Crew } from '@/generated/prisma/client'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type CrewRole = 'ACTOR' | 'DIRECTOR'

type CrewSelectorProps = {
  crew: Crew[]
  value: { id: string; role: CrewRole }[]
  onChange: (value: { id: string; role: CrewRole }[]) => void
}

export function CrewCommandSelector({ crew, value, onChange }: CrewSelectorProps) {
  const [open, setOpen] = useState(false)

  const addCrew = (id: string, role: CrewRole) => {
    if (!value.some((c) => c.id === id && c.role === role)) {
      onChange([...value, { id, role }])
    }
  }

  const removeCrew = (id: string, role: CrewRole) => {
    onChange(value.filter((c) => !(c.id === id && c.role === role)))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Selected Crew</label>

        {value.length === 0 && (
          <p className="text-sm text-muted-foreground">No crew selected yet.</p>
        )}

        <div className="flex flex-wrap gap-2">
          {value.map((c) => {
            const member = crew.find((m) => m.id === c.id)
            if (!member) return null

            return (
              <Badge
                key={`${c.id}-${c.role}`}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {member.name}
                <span className="text-xs opacity-70">({c.role})</span>

                <button
                  type="button"
                  className="ml-1 text-xs opacity-60 hover:opacity-100"
                  onClick={() => removeCrew(c.id, c.role)}
                >
                  ✕
                </button>
              </Badge>
            )
          })}
        </div>
      </div>

      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Add Crew Member
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search crew..." />
          <CommandList>
            <CommandEmpty>No crew found.</CommandEmpty>

            <CommandGroup heading="Crew Members">
              {crew.map((member) => (
                <CommandItem key={member.id}>
                  <div className="flex flex-col w-full">
                    <span className="font-medium">{member.name}</span>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addCrew(member.id, 'ACTOR')}
                      >
                        Add Actor
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addCrew(member.id, 'DIRECTOR')}
                      >
                        Add Director
                      </Button>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
