'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CustomerCard } from './customer-card'
import { ShippingCard } from './shipping-card'
import { OrderItemsTable } from './order-items-table'
import { OrderSummaryCard } from './order-summary-card'
import { OrderWithDetails } from '../_types/order'

type Props = {
  order: OrderWithDetails
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2">
          <DialogHeader>
            <DialogTitle>Order #{order.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer */}
            <CustomerCard user={order.user} />

            {/* Shipping */}
            <ShippingCard address={order.shippingAddress} />

            {/* Items */}
            <div className="overflow-x-auto">
              <OrderItemsTable items={order.items} />
            </div>

            {/* Summary */}
            <OrderSummaryCard total={order.total} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
