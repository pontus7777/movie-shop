'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { BulkDiscountTier } from '@/generated/prisma/client'
import { updateDiscountTier } from '../_actions/discount-actions'

type Props = {
  tier: BulkDiscountTier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDiscountTierDialog({ tier, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [minQuantity, setMinQuantity] = useState(String(tier.minQuantity))
  const [percentageOff, setPercentageOff] = useState(String(tier.percentageOff))
  const [active, setActive] = useState(tier.active)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const parsedMinQuantity = Number(minQuantity)
    const parsedPercentageOff = Number(percentageOff)

    if (!Number.isInteger(parsedMinQuantity) || parsedMinQuantity < 1) {
      toast.error('Minimum quantity must be a whole number of at least 1')
      return
    }

    if (
      !Number.isInteger(parsedPercentageOff) ||
      parsedPercentageOff < 1 ||
      parsedPercentageOff > 100
    ) {
      toast.error('Discount must be a whole number between 1 and 100')
      return
    }

    try {
      setLoading(true)
      await updateDiscountTier(tier.id, {
        minQuantity: parsedMinQuantity,
        percentageOff: parsedPercentageOff,
        active,
      })
      toast.success('Discount tier updated')
      onOpenChange(false)
    } catch {
      toast.error('Failed to update discount tier — quantity may already be in use')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit discount tier</DialogTitle>
            <DialogDescription>
              Customers who add at least this many items to their cart get the discount
              automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-minQuantity">Minimum quantity</Label>
              <Input
                id="edit-minQuantity"
                type="number"
                min={1}
                step={1}
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-percentageOff">Discount percentage</Label>
              <Input
                id="edit-percentageOff"
                type="number"
                min={1}
                max={100}
                step={1}
                value={percentageOff}
                onChange={(e) => setPercentageOff(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Active</Label>
              <Switch id="edit-active" checked={active} onCheckedChange={setActive} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
