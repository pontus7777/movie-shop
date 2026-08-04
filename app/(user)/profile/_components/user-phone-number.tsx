'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from 'better-auth'
import { Pencil, Check, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

type Props = {
    user: User & { mobileNumber?: string | null }
}

export function UserPhoneNumber({ user }: Props) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || '')
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        try {
            await authClient.updateUser({ mobileNumber: mobileNumber.trim() })
            toast.success('Phone number updated')
            setIsEditing(false)
            router.refresh()
        } catch {
            toast.error('Failed to update phone number')
        } finally {
            setSaving(false)
        }
    }

    function handleCancel() {
        setMobileNumber(user.mobileNumber || '')
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    autoFocus
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave()
                        if (e.key === 'Escape') handleCancel()
                    }}
                    className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary w-40"
                    placeholder="+46 70 123 45 67"
                />
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 disabled:opacity-50"
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
            {user.mobileNumber ? 'Edit' : 'Add'} Phone Number
        </button>
    )
}