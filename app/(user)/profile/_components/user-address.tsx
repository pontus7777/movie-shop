'use client'

import { useState } from 'react'
import { User } from 'better-auth'
import { Pencil, Check, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

type Props = {
    user: User & { address?: string | null }
}

export function UserAddress({ user }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [address, setAddress] = useState(user.address || '')
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        try {
            await authClient.updateUser({ address: address.trim() })
            toast.success('Address updated')
            setIsEditing(false)
        } catch {
            toast.error('Failed to update address')
        } finally {
            setSaving(false)
        }
    }

    function handleCancel() {
        setAddress(user.address || '')
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="flex items-start gap-2">
                <textarea
                    autoFocus
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCancel()
                    }}
                    rows={2}
                    className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary w-64 resize-none"
                    placeholder="Street, city, postal code, country"
                />
                <div className="flex flex-col gap-1">
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
            </div>
        )
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 mt-1"
        >
            <Pencil className="h-3.5 w-3.5" />
            {user.address ? 'Edit' : 'Add'} Address
        </button>
    )
}