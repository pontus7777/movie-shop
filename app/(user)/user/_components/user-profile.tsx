'use client'

import { useState } from 'react'
import { User } from 'better-auth'
import { Pencil, Check, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

type Props = {
  user: User
}

export function UserProfile({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      await authClient.updateUser({ name: name.trim() })
      toast.success('Name updated')
      setIsEditing(false)
    } catch {
      toast.error('Failed to update name')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setName(user.name || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:border-purple-500 w-40"
          placeholder="Your name"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <Pencil className="h-3.5 w-3.5" />
      Edit Profile Name
    </button>
  )
}
