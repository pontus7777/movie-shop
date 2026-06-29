'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

export type CrewMemberForm = {
  name: string
  actor: boolean
  director: boolean
}

type Props = {
  value: CrewMemberForm[]
  onChange: (value: CrewMemberForm[]) => void
}

export function CrewEditor({ value, onChange }: Props) {
  // =========================
  // Add new empty row
  // =========================
  function addCrewMember() {
    onChange([
      ...value,
      {
        name: '',
        actor: false,
        director: false,
      },
    ])
  }

  // =========================
  // Remove row
  // =========================
  function removeCrewMember(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  // =========================
  // Update one row
  // =========================
  function updateCrewMember(index: number, changes: Partial<CrewMemberForm>) {
    const updated = [...value]

    updated[index] = {
      ...updated[index],
      ...changes,
    }

    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Crew Members</Label>

      {value.map((member, index) => (
        <div key={index} className="grid grid-cols-12 items-center gap-3 rounded-md border p-3">
          {/* Name */}

          <Input
            className="col-span-6"
            placeholder="Crew member name"
            value={member.name}
            onChange={(e) =>
              updateCrewMember(index, {
                name: e.target.value,
              })
            }
          />

          {/* Actor */}

          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              checked={member.actor}
              onCheckedChange={(checked) =>
                updateCrewMember(index, {
                  actor: checked === true,
                })
              }
            />

            <Label>Actor</Label>
          </div>

          {/* Director */}

          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              checked={member.director}
              onCheckedChange={(checked) =>
                updateCrewMember(index, {
                  director: checked === true,
                })
              }
            />

            <Label>Director</Label>
          </div>

          {/* Delete */}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => removeCrewMember(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addCrewMember}>
        <Plus className="mr-2 h-4 w-4" />
        Add Crew Member
      </Button>
    </div>
  )
}
