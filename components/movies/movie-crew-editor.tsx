'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Crew } from '@/generated/prisma/client'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

export type CrewMemberForm = {
  isNew: boolean
  crewId: string
  name: string
  actor: boolean
  director: boolean
}

type Props = {
  crew: Crew[]
  value: CrewMemberForm[]
  onChange: (value: CrewMemberForm[]) => void
}

export function MovieCrewEditor({ value, onChange, crew }: Props) {
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
        <div key={index} className="flex flex-1 items-center gap-4 rounded-lg border p-4">
          {member.crewId ? (
            <Input
              placeholder="New crew member"
              value={member.name}
              onChange={(e) =>
                updateCrewMember(index, {
                  name: e.target.value,
                })
              }
            />
          ) : (
            <div className="flex-1">
              <Select
                value={member.crewId}
                onValueChange={(crewId) => {
                  const selected = crew.find((c) => c.id === crewId)

                  updateCrewMember(index, {
                    crewId,
                    name: selected?.name ?? '',
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select crew member" />
                </SelectTrigger>

                <SelectContent>
                  {crew.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <RadioGroup
            value={member.isNew ? 'new' : 'existing'}
            onValueChange={(value) =>
              updateCrewMember(index, {
                isNew: value === 'new',
                crewId: '',
                name: '',
              })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id={`existing-${index}`} />
              <Label htmlFor={`existing-${index}`}>Existing Crew</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id={`new-${index}`} />
              <Label htmlFor={`new-${index}`}>New Crew Member</Label>
            </div>
          </RadioGroup>

          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
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
        </div>
      ))}
    </div>
  )
}
