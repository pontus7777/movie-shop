'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CrewTable } from './crew-table'
import { CreateCrewDialog } from './crew-create'
import { Crew } from '@/generated/prisma/client'

export function AdminCrewPageClient({ crew }: { crew: Crew[] }) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Crew</h2>
          <p className="text-muted-foreground">Manage crews and their movies</p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          Add Crew
        </Button>
      </div>

      <CrewTable crewMembers={crew} />

      {/* Dialog lives OUTSIDE the button */}
      <CreateCrewDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
