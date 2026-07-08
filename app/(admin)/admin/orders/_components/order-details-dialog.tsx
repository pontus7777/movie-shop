'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Prisma } from '@/generated/prisma/client'
import { CustomerCard } from './customer-card'

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true
    shippingAddress: true
    items: {
      include: {
        movie: true
      }
    }
  }
}>

type Props = {
  order: OrderWithDetails
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer */}
          <CustomerCard user={order.user} />

          {/* Shipping */}

          <div className="rounded-lg border p-4">Shipping Address</div>

          {/* Items */}

          <div className="rounded-lg border p-4">Order Items Table</div>

          {/* Summary */}

          <div className="rounded-lg border p-4">Order Summary</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
