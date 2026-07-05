'use client'

import { useTransition, useState, useEffect } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { updateUser } from '../_actions/update-user-action'
import { useRouter } from 'next/navigation'

export function EditUserDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: any
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [form, setForm] = useState({
    id: '',
    name: '',
    // email: '',
    // role: 'user',
  })

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        name: user.name ?? '',
        // email: user.email ?? '',
        // role: user.role,
      })
    }
  }, [user])

  async function handleSubmit() {
    startTransition(async () => {
      const res = await updateUser(form)
      router.refresh()
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('User updated')
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {/* 
          <input
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          /> */}

          {/* <select
            className="w-full border p-2 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select> */}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
