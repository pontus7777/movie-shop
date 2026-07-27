import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'

/* -------------------------------------------------------
   CHANGE EMAIL MODAL
------------------------------------------------------- */
export default function ChangeEmailModal({
  open,
  onClose,
  currentEmail,
}: {
  open: boolean
  onClose: () => void
  currentEmail: string | null
}) {
  const [email, setEmail] = useState(currentEmail || '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      toast.success('Email updated')
      onClose()
    } catch {
      toast.error('Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
        </DialogHeader>

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter new email"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
