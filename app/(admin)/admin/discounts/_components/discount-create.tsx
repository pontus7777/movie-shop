'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { createDiscountTier } from '../_actions/discount-actions'

export function CreateDiscountTierButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [minQuantity, setMinQuantity] = useState('')
  const [percentageOff, setPercentageOff] = useState('')

  function resetForm() {
    setMinQuantity('')
    setPercentageOff('')
  }

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
      await createDiscountTier({
        minQuantity: parsedMinQuantity,
        percentageOff: parsedPercentageOff,
      })
      toast.success('Discount tier created')
      resetForm()
      setOpen(false)
    } catch {
      toast.error('Failed to create discount tier — quantity may already be in use')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Discount Tier</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add discount tier</DialogTitle>
            <DialogDescription>
              Customers who add at least this many items to their cart get the discount
              automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Minimum quantity</Label>
              <Input
                id="minQuantity"
                type="number"
                min={1}
                step={1}
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                placeholder="e.g. 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentageOff">Discount percentage</Label>
              <Input
                id="percentageOff"
                type="number"
                min={1}
                max={100}
                step={1}
                value={percentageOff}
                onChange={(e) => setPercentageOff(e.target.value)}
                placeholder="e.g. 20"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
